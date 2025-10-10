// backend/src/routes/services.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// GET all available services
router.get('/', async (req, res) => {
    const db = req.app.locals.db;
    try {
        const result = await db.query('SELECT id, name, description, price, billing_period FROM services WHERE is_active = TRUE');
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).send("Internal Server Error");
    }
});

// GET user's subscriptions
router.get('/subscriptions', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const userId = req.user.id;
    try {
        const result = await db.query(
            'SELECT s.id, s.status, s.expires_at, svc.name, svc.description FROM subscriptions s JOIN services svc ON s.service_id = svc.id WHERE s.user_id = $1',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;