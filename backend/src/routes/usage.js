const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/usage
router.get('/', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const userId = req.user.id;

    try {
        // CORRECTED QUERY: Removed the JOIN with the non-existent 'services' table.
        // We only need the count and date for the chart.
        const result = await db.query(
            `SELECT 
                usage_count, 
                usage_date
             FROM usage_logs
             WHERE user_id = $1 
             AND usage_date >= date_trunc('month', current_date)
             ORDER BY usage_date ASC`,
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching usage data:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;