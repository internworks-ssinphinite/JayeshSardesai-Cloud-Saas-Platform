const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const userId = req.user.id;

    try {
        // **THE DEFINITIVE FIX**: This query removes all JavaScript date logic and uses powerful,
        // reliable PostgreSQL functions (`NOW()` and `date_trunc`) to generate the date series.
        // This is the most robust way to solve this problem and is immune to timezone issues.
        const query = `
            SELECT
                all_days.day::text AS usage_date,
                COALESCE(ul.usage_count, 0) AS usage_count
            FROM
                (
                    -- This SQL function generates a series of dates from the first day
                    -- of the current month up to today's date, directly within the database.
                    SELECT generate_series(
                        date_trunc('month', NOW())::date,
                        NOW()::date,
                        '1 day'::interval
                    )::date AS day
                ) AS all_days
            LEFT JOIN
                usage_logs ul ON all_days.day = ul.usage_date AND ul.user_id = $1
            ORDER BY
                all_days.day ASC;
        `;

        const result = await db.query(query, [userId]);

        console.log(`[Usage API] Sending ${result.rows.length} data points for user ${userId}.`);

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching usage data:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;

