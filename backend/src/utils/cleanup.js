// src/utils/cleanup.js
// Utility to clean up expired pending user registrations

/**
 * Removes expired pending users from the database
 * @param {Object} db - Database connection object
 * @returns {Promise<number>} - Number of deleted records
 */
async function cleanupExpiredPendingUsers(db) {
    try {
        const result = await db.query(
            'DELETE FROM pending_users WHERE verification_token_expires_at < NOW() RETURNING id'
        );
        
        const deletedCount = result.rows.length;
        
        if (deletedCount > 0) {
            console.log(`[Cleanup] Removed ${deletedCount} expired pending user(s)`);
        }
        
        return deletedCount;
    } catch (error) {
        console.error('[Cleanup] Error removing expired pending users:', error);
        throw error;
    }
}

/**
 * Starts a periodic cleanup job
 * @param {Object} db - Database connection object
 * @param {number} intervalMinutes - Interval in minutes (default: 60)
 */
function startCleanupJob(db, intervalMinutes = 60) {
    const intervalMs = intervalMinutes * 60 * 1000;
    
    console.log(`[Cleanup] Starting cleanup job (runs every ${intervalMinutes} minutes)`);
    
    // Run immediately on startup
    cleanupExpiredPendingUsers(db).catch(err => {
        console.error('[Cleanup] Initial cleanup failed:', err);
    });
    
    // Then run periodically
    setInterval(() => {
        cleanupExpiredPendingUsers(db).catch(err => {
            console.error('[Cleanup] Scheduled cleanup failed:', err);
        });
    }, intervalMs);
}

module.exports = {
    cleanupExpiredPendingUsers,
    startCleanupJob
};
