// backend/src/routes/payment.js
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { sendNotification } = require('../utils/notifications');

router.post('/create-order', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const { planId, billingCycle } = req.body; // 'monthly' or 'yearly'
    const userId = req.user.id;

    if (!planId || !billingCycle) {
        return res.status(400).json({ message: 'A plan ID and billing cycle are required.' });
    }

    try {
        const planResult = await db.query('SELECT * FROM plans WHERE id = $1', [planId]);
        if (planResult.rows.length === 0) {
            return res.status(404).json({ message: 'Plan not found.' });
        }
        const plan = planResult.rows[0];
        const amount = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;

        let subResult = await db.query('SELECT * FROM subscriptions WHERE user_id = $1', [userId]);
        let subscription;
        if (subResult.rows.length === 0) {
            const newSub = await db.query(
                'INSERT INTO subscriptions (user_id, plan_id, status, billing_cycle) VALUES ($1, $2, $3, $4) RETURNING *',
                [userId, planId, 'pending', billingCycle]
            );
            subscription = newSub.rows[0];
        } else {
            const updatedSub = await db.query(
                'UPDATE subscriptions SET plan_id = $1, status = $2, billing_cycle = $3 WHERE user_id = $4 RETURNING *',
                [planId, 'pending', billingCycle, userId]
            );
            subscription = updatedSub.rows[0];
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount,
            currency: "INR",
            receipt: `sub_${subscription.id}_${new Date().getTime()}`,
        };

        const order = await instance.orders.create(options);

        await db.query(
            'INSERT INTO payments (user_id, subscription_id, razorpay_order_id, amount, status) VALUES ($1, $2, $3, $4, $5)',
            [userId, subscription.id, order.id, amount, 'created']
        );

        res.json({ ...order, key_id: process.env.RAZORPAY_KEY_ID });

    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/verify-payment', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            const paymentResult = await db.query('SELECT * FROM payments WHERE razorpay_order_id = $1', [razorpay_order_id]);
            const payment = paymentResult.rows[0];

            await db.query(
                'UPDATE payments SET status = $1, razorpay_payment_id = $2, razorpay_signature = $3 WHERE razorpay_order_id = $4',
                ['successful', razorpay_payment_id, razorpay_signature, razorpay_order_id]
            );

            const subResult = await db.query('SELECT s.*, p.analysis_credits, p.name as plan_name FROM subscriptions s JOIN plans p ON s.plan_id = p.id WHERE s.id = $1', [payment.subscription_id]);
            const subscription = subResult.rows[0];

            const renewsAt = new Date();
            if (subscription.billing_cycle === 'yearly') {
                renewsAt.setFullYear(renewsAt.getFullYear() + 1);
            } else {
                renewsAt.setMonth(renewsAt.getMonth() + 1);
            }

            await db.query(
                'UPDATE subscriptions SET status = $1, renews_at = $2, remaining_credits = $3 WHERE id = $4',
                ['active', renewsAt, subscription.analysis_credits, payment.subscription_id]
            );

            await sendNotification(db, payment.user_id, 'Plan Activated!', `Your subscription for the ${subscription.plan_name} plan has been successfully activated.`);

            res.json({ success: true, message: 'Payment verified and subscription activated.' });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed.' });
        }
    } catch (error) {
        console.error("Verify payment error:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/invoices', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const userId = req.user.id;

    try {
        const result = await db.query(
            `SELECT 
                p.id, 
                p.razorpay_order_id, 
                p.razorpay_payment_id,
                p.amount,
                p.status,
                p.created_at
             FROM payments p
             WHERE p.user_id = $1 AND p.status = 'successful'
             ORDER BY p.created_at DESC`,
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching invoices:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;