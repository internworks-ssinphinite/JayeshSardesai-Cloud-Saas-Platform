const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { sendNotification } = require('../utils/notifications');

// Helper function for prorated calculations
const calculateProration = (subscription, newPlan, billingCycle) => {
    const now = new Date();
    const cycleEnd = new Date(subscription.renews_at);
    let cycleStart = new Date(cycleEnd);

    if (subscription.billing_cycle === 'yearly') {
        cycleStart.setFullYear(cycleStart.getFullYear() - 1);
    } else {
        cycleStart.setMonth(cycleStart.getMonth() - 1);
    }

    if (cycleStart > now) {
        cycleStart = new Date(subscription.created_at);
    }

    const totalCycleDays = Math.max(1, (cycleEnd - cycleStart) / (1000 * 60 * 60 * 24));
    const daysUsed = Math.max(0, (now - cycleStart) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, totalCycleDays - daysUsed);

    const oldPlanPrice = subscription.billing_cycle === 'yearly' ? subscription.price_yearly : subscription.price_monthly;
    const newPlanPrice = billingCycle === 'yearly' ? newPlan.price_yearly : newPlan.price_monthly;

    const unusedAmount = (oldPlanPrice / totalCycleDays) * daysRemaining;
    const newPlanCostForRemainingPeriod = (newPlanPrice / totalCycleDays) * daysRemaining;

    const amountToPay = newPlanCostForRemainingPeriod - unusedAmount;

    return {
        amountToPay: Math.max(0, Math.round(amountToPay)),
        creditAmount: Math.max(0, Math.round(-amountToPay))
    };
};


router.post('/create-order', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const { planId, billingCycle } = req.body;
    const userId = req.user.id;

    try {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ message: 'Razorpay is not configured on the server.' });
        }

        const activeSub = await db.query("SELECT * FROM subscriptions WHERE user_id = $1 AND status = 'active'", [userId]);
        if (activeSub.rows.length > 0) {
            return res.status(400).json({ message: 'You already have an active subscription. Please upgrade or downgrade from the billing page.' });
        }

        const planResult = await db.query('SELECT * FROM plans WHERE id = $1', [planId]);
        if (planResult.rows.length === 0) return res.status(404).json({ message: 'Plan not found.' });

        const plan = planResult.rows[0];
        const amount = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;

        let subResult = await db.query('SELECT * FROM subscriptions WHERE user_id = $1', [userId]);
        let subscription;
        if (subResult.rows.length === 0) {
            const newSub = await db.query('INSERT INTO subscriptions (user_id, plan_id, status, billing_cycle) VALUES ($1, $2, $3, $4) RETURNING *', [userId, planId, 'pending', billingCycle]);
            subscription = newSub.rows[0];
        } else {
            const updatedSub = await db.query('UPDATE subscriptions SET plan_id = $1, status = $2, billing_cycle = $3 WHERE user_id = $4 RETURNING *', [planId, 'pending', billingCycle, userId]);
            subscription = updatedSub.rows[0];
        }

        const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
        const order = await instance.orders.create({ amount, currency: "INR", receipt: `sub_${subscription.id}_${Date.now()}` });

        await db.query('INSERT INTO payments (user_id, subscription_id, razorpay_order_id, amount, status) VALUES ($1, $2, $3, $4, $5)', [userId, subscription.id, order.id, amount, 'created']);

        res.json({ ...order, key_id: process.env.RAZORPAY_KEY_ID });

    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/verify-payment', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user.id;

    try {
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed.' });
        }

        const paymentResult = await db.query('SELECT * FROM payments WHERE razorpay_order_id = $1', [razorpay_order_id]);
        if (paymentResult.rows.length === 0) return res.status(404).json({ message: 'Payment record not found.' });
        const payment = paymentResult.rows[0];

        await db.query('UPDATE payments SET status = $1, razorpay_payment_id = $2, razorpay_signature = $3 WHERE razorpay_order_id = $4', ['successful', razorpay_payment_id, razorpay_signature, razorpay_order_id]);

        const subResult = await db.query('SELECT s.*, p.credits_monthly, p.credits_yearly, p.name as plan_name FROM subscriptions s JOIN plans p ON s.plan_id = p.id WHERE s.id = $1', [payment.subscription_id]);
        const subscription = subResult.rows[0];
        const plan = subResult.rows[0];

        const renewsAt = new Date();
        if (subscription.billing_cycle === 'yearly') {
            renewsAt.setFullYear(renewsAt.getFullYear() + 1);
        } else {
            renewsAt.setMonth(renewsAt.getMonth() + 1);
        }

        const newCredits = subscription.billing_cycle === 'yearly' ? plan.credits_yearly : plan.credits_monthly;

        await db.query('UPDATE subscriptions SET status = $1, renews_at = $2, remaining_credits = $3, created_at = NOW(), updated_at = NOW() WHERE id = $4', ['active', renewsAt, newCredits, payment.subscription_id]);

        await sendNotification(db, userId, 'Plan Activated!', `Your subscription for the ${subscription.plan_name} plan has been successfully activated.`);

        res.json({ success: true, message: 'Payment verified and subscription activated.' });
    } catch (error) {
        console.error("Verify payment error:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.post('/upgrade-plan', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const { planId, billingCycle } = req.body;
    const userId = req.user.id;

    try {
        const [subResult, newPlanResult] = await Promise.all([
            db.query("SELECT s.*, p.price_monthly, p.price_yearly FROM subscriptions s JOIN plans p ON s.plan_id = p.id WHERE s.user_id = $1 AND s.status = 'active'", [userId]),
            db.query('SELECT * FROM plans WHERE id = $1', [planId])
        ]);

        if (subResult.rows.length === 0) return res.status(404).json({ message: 'No active subscription found to upgrade.' });

        const subscription = subResult.rows[0];
        const newPlan = newPlanResult.rows[0];
        const { amountToPay } = calculateProration(subscription, newPlan, billingCycle);

        if (amountToPay <= 0) {
            const newCredits = billingCycle === 'yearly' ? newPlan.credits_yearly : newPlan.credits_monthly;
            await db.query("UPDATE subscriptions SET plan_id = $1, billing_cycle = $2, remaining_credits = $3, updated_at = NOW() WHERE id = $4", [planId, billingCycle, newCredits, subscription.id]);
            await sendNotification(db, userId, 'Plan Changed', `Your plan has been successfully changed to ${newPlan.name}.`);
            return res.json({ success: true, new_amount_payable: 0 });
        }

        const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
        const order = await instance.orders.create({ amount: amountToPay, currency: "INR", receipt: `upgrade_${subscription.id}_${Date.now()}` });

        await db.query("UPDATE subscriptions SET temp_plan_id = $1, temp_billing_cycle = $2, temp_order_id = $3 WHERE id = $4", [planId, billingCycle, order.id, subscription.id]);

        res.json({ new_amount_payable: amountToPay, order_id: order.id, key_id: process.env.RAZORPAY_KEY_ID });

    } catch (error) {
        console.error("Upgrade plan error:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/verify-plan-change', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const userId = req.user.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        const subResult = await db.query('SELECT * FROM subscriptions WHERE user_id = $1 AND temp_order_id = $2', [userId, razorpay_order_id]);
        if (subResult.rows.length === 0) return res.status(404).json({ message: 'Subscription change process not found or already completed.' });

        const subscription = subResult.rows[0];

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed.' });
        }

        const newPlanResult = await db.query('SELECT * FROM plans WHERE id = $1', [subscription.temp_plan_id]);
        const newPlan = newPlanResult.rows[0];

        const newCredits = subscription.temp_billing_cycle === 'yearly' ? newPlan.credits_yearly : newPlan.credits_monthly;

        await db.query(
            `UPDATE subscriptions SET plan_id = $1, billing_cycle = $2, remaining_credits = $3, temp_plan_id = NULL, temp_billing_cycle = NULL, temp_order_id = NULL, updated_at = NOW() WHERE id = $4`,
            [newPlan.id, subscription.temp_billing_cycle, newCredits, subscription.id]
        );

        await sendNotification(db, userId, 'Plan Upgraded!', `Your plan has been successfully upgraded to ${newPlan.name}.`);

        res.status(200).json({ success: true, message: 'Plan upgraded successfully.' });

    } catch (error) {
        console.error("Verify plan change error:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/downgrade-plan', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const { planId, billingCycle } = req.body;
    const userId = req.user.id;

    try {
        const [subResult, newPlanResult] = await Promise.all([
            db.query("SELECT s.*, p.price_monthly, p.price_yearly FROM subscriptions s JOIN plans p ON s.plan_id = p.id WHERE s.user_id = $1 AND s.status = 'active'", [userId]),
            db.query('SELECT * FROM plans WHERE id = $1', [planId])
        ]);

        if (subResult.rows.length === 0) return res.status(404).json({ message: 'No active subscription found.' });

        const subscription = subResult.rows[0];
        const newPlan = newPlanResult.rows[0];
        const { creditAmount } = calculateProration(subscription, newPlan, billingCycle);

        const newCredits = billingCycle === 'yearly' ? newPlan.credits_yearly : newPlan.credits_monthly;

        await db.query("UPDATE subscriptions SET plan_id = $1, billing_cycle = $2, remaining_credits = $3, updated_at = NOW() WHERE id = $4", [planId, billingCycle, newCredits, subscription.id]);

        await sendNotification(db, userId, 'Plan Downgraded', `Your plan has been changed to ${newPlan.name}. A credit of ₹${(creditAmount / 100).toFixed(2)} will be applied to your next renewal.`);

        res.json({ success: true, new_amount_payable: -creditAmount });

    } catch (error) {
        console.error("Downgrade plan error:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.post('/cancel-subscription', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const userId = req.user.id;

    try {
        const subResult = await db.query("SELECT s.*, p.name as plan_name, p.price_monthly, p.price_yearly FROM subscriptions s JOIN plans p ON s.plan_id = p.id WHERE s.user_id = $1 AND status = 'active'", [userId]);
        if (subResult.rows.length === 0) return res.status(404).json({ message: 'No active subscription found.' });

        const subscription = subResult.rows[0];

        await db.query(
            "UPDATE subscriptions SET status = 'cancelled', renews_at = NULL, remaining_credits = 0, cancelled_at = NOW() WHERE id = $1",
            [subscription.id]
        );

        await sendNotification(db, userId, 'Subscription Cancelled', `Your ${subscription.plan_name} plan has been cancelled.`);

        res.status(200).json({ success: true, message: 'Subscription cancelled successfully.' });

    } catch (error) {
        console.error("Cancel subscription error:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;

