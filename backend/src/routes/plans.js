// backend/src/routes/plans.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// GET all available plans
router.get('/', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    try {
        const result = await db.query('SELECT id, name, description, price_monthly, price_yearly, analysis_credits FROM plans WHERE is_active = TRUE ORDER BY price_monthly ASC');
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching plans:", error);
        res.status(500).send("Internal Server Error");
    }
});

// GET user's current subscription
router.get('/subscription', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const userId = req.user.id;
    try {
        const result = await db.query(
            `SELECT 
                s.status, 
                s.renews_at, 
                s.billing_cycle,
                s.remaining_credits,
                p.name as plan_name,
                p.analysis_credits as total_credits
             FROM subscriptions s 
             JOIN plans p ON s.plan_id = p.id 
             WHERE s.user_id = $1 AND s.status = 'active'`,
            [userId]
        );
        res.json(result.rows[0] || null); // Return the first active sub, or null
    } catch (error) {
        console.error("Error fetching subscription:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;