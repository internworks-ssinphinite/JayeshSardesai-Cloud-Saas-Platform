// backend/src/utils/notifications.js

async function sendNotification(db, userId, title, message) {
    try {
        await db.query(
            'INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3)',
            [userId, title, message]
        );
        console.log(`Notification sent to user ${userId}: ${title}`);
    } catch (error) {
        console.error('Failed to send notification:', error);
    }
}

module.exports = { sendNotification };