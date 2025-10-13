// backend/src/routes/notifications.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// GET all notifications for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const userId = req.user.id;
    try {
        const result = await db.query(
            'SELECT id, title, message, is_read, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).send("Internal Server Error");
    }
});

// POST to mark a notification as read
router.post('/:id/read', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const userId = req.user.id;
    const notificationId = req.params.id;

    try {
        await db.query(
            'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2',
            [notificationId, userId]
        );
        res.status(200).json({ success: true, message: 'Notification marked as read.' });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;