const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const upload = multer();

router.get('/dashboard', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    try {
        // Fetch user info and subscription info together
        const userQuery = 'SELECT first_name, last_name, email FROM users WHERE id = $1';
        const subQuery = `
            SELECT p.name as plan_name, s.remaining_credits 
            FROM subscriptions s
            JOIN plans p ON s.plan_id = p.id
            WHERE s.user_id = $1 AND s.status = 'active'`;

        const [userResult, subResult] = await Promise.all([
            db.query(userQuery, [req.user.id]),
            db.query(subQuery, [req.user.id])
        ]);

        const user = userResult.rows[0];
        const subscription = subResult.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            message: `Welcome to your dashboard, ${user.email}!`,
            user: {
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                planName: subscription ? subscription.plan_name : 'No Plan',
                remainingCredits: subscription ? subscription.remaining_credits : 0,
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/analyze', authMiddleware, upload.single('file'), async (req, res) => {
    const db = req.app.locals.db;
    const userId = req.user.id;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file provided.' });
        }

        // --- CREDIT CHECK ---
        const subResult = await db.query(
            "SELECT id, remaining_credits FROM subscriptions WHERE user_id = $1 AND status = 'active'",
            [userId]
        );
        const subscription = subResult.rows[0];

        if (!subscription || subscription.remaining_credits <= 0) {
            return res.status(403).json({ message: 'You have run out of analysis credits. Please upgrade your plan.' });
        }
        // --- END CREDIT CHECK ---

        if (!process.env.ANALYSIS_API_URL) {
            console.error('Analysis API URL is not configured in .env file.');
            return res.status(500).json({ message: 'Analysis service is not configured.' });
        }

        const form = new FormData();
        form.append('file', req.file.buffer, req.file.originalname);
        const analysisEndpoint = `${process.env.ANALYSIS_API_URL}/analyze`;

        const response = await axios.post(analysisEndpoint, form, {
            headers: { ...form.getHeaders() }
        });

        // --- DECREMENT CREDITS & LOG USAGE ---
        const documentAnalyzerServiceId = 1;
        await db.query('BEGIN'); // Start transaction
        await db.query(
            'UPDATE subscriptions SET remaining_credits = remaining_credits - 1 WHERE id = $1',
            [subscription.id]
        );
        await db.query(
            `INSERT INTO usage_logs (user_id, service_id, usage_date)
             VALUES ($1, $2, CURRENT_DATE)
             ON CONFLICT (user_id, service_id, usage_date) 
             DO UPDATE SET usage_count = usage_logs.usage_count + 1`,
            [userId, documentAnalyzerServiceId]
        );
        await db.query('COMMIT'); // Commit transaction
        // --- END ---

        res.json(response.data);

    } catch (error) {
        await db.query('ROLLBACK'); // Rollback on error
        const errorMessage = error.response ? (error.response.data.error || error.response.data.message) : 'Internal server error during analysis';
        const statusCode = error.response ? error.response.status : 500;
        console.error('Analysis API error:', errorMessage);
        res.status(statusCode).json({ message: errorMessage });
    }
});

module.exports = router;