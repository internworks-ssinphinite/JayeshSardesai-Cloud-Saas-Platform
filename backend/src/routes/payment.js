// backend/src/routes/payment.js
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { sendNotification } = require('../utils/notifications');

router.post('/create-order', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const { serviceId } = req.body; // We now receive a serviceId
    const userId = req.user.id;

    if (!serviceId) {
        return res.status(400).json({ message: 'A service ID is required.' });
    }

    try {
        // Fetch service details from DB
        const serviceResult = await db.query('SELECT * FROM services WHERE id = $1', [serviceId]);
        if (serviceResult.rows.length === 0) {
            return res.status(404).json({ message: 'Service not found.' });
        }
        const service = serviceResult.rows[0];

        // Create a subscription record (or find an existing inactive one)
        let subResult = await db.query('SELECT * FROM subscriptions WHERE user_id = $1 AND service_id = $2', [userId, serviceId]);
        let subscription;
        if (subResult.rows.length === 0) {
            const newSub = await db.query(
                'INSERT INTO subscriptions (user_id, service_id, status) VALUES ($1, $2, $3) RETURNING *',
                [userId, serviceId, 'pending']
            );
            subscription = newSub.rows[0];
        } else {
            subscription = subResult.rows[0];
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: service.price, // Amount from the database (in paise)
            currency: "INR",
            receipt: `sub_${subscription.id}_${new Date().getTime()}`,
        };

        const order = await instance.orders.create(options);

        // Save the payment record
        await db.query(
            'INSERT INTO payments (user_id, subscription_id, razorpay_order_id, amount, status) VALUES ($1, $2, $3, $4, $5)',
            [userId, subscription.id, order.id, service.price, 'created']
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
            // Find the payment record
            const paymentResult = await db.query('SELECT * FROM payments WHERE razorpay_order_id = $1', [razorpay_order_id]);
            if (paymentResult.rows.length === 0) {
                return res.status(404).json({ message: "Payment record not found." });
            }
            const payment = paymentResult.rows[0];

            // Update payment status
            await db.query(
                'UPDATE payments SET status = $1, razorpay_payment_id = $2, razorpay_signature = $3 WHERE razorpay_order_id = $4',
                ['successful', razorpay_payment_id, razorpay_signature, razorpay_order_id]
            );

            // Activate the subscription
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1); // Simple 1-month expiry

            await db.query(
                'UPDATE subscriptions SET status = $1, expires_at = $2 WHERE id = $3',
                ['active', expiresAt, payment.subscription_id]
            );

            // Fetch service name to include in the notification
            const serviceResult = await db.query('SELECT name FROM services WHERE id = (SELECT service_id FROM subscriptions WHERE id = $1)', [payment.subscription_id]);
            const serviceName = serviceResult.rows[0]?.name || 'a service';

            // *** ADD THIS: Create a notification for successful payment ***
            await sendNotification(db, payment.user_id, 'Service Activated!', `Your subscription for ${serviceName} has been successfully activated.`);

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