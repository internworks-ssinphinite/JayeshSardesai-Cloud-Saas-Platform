// src/routes/dashboard.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/dashboard
router.get('/dashboard', authMiddleware, (req, res) => {
    // The user object is attached by the authMiddleware
    res.status(200).json({
        message: `Welcome to your dashboard, ${req.user.email}!`,
        userEmail: req.user.email
    });
});

module.exports = router;