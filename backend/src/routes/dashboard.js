// src/routes/dashboard.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/dashboard
router.get('/dashboard', authMiddleware, async (req, res) => { // Make it async
    const db = req.app.locals.db;
    try {
        const result = await db.query('SELECT first_name, last_name, email FROM users WHERE id = $1', [req.user.id]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            message: `Welcome to your dashboard, ${user.email}!`,
            user: {
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;