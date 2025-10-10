const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const upload = multer();

// ... (GET /api/dashboard route remains the same) ...
router.get('/dashboard', authMiddleware, async (req, res) => {
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


router.post('/analyze', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file provided.' });
        }

        // --- START: MODIFIED CODE ---
        if (!process.env.ANALYSIS_API_URL) {
            console.error('Analysis API URL is not configured in .env file.');
            return res.status(500).json({ message: 'Analysis service is not configured.' });
        }

        const form = new FormData();
        form.append('file', req.file.buffer, req.file.originalname);

        // Use the public Hugging Face URL from the .env file
        const analysisEndpoint = `${process.env.ANALYSIS_API_URL}/analyze`;

        const response = await axios.post(analysisEndpoint, form, {
            headers: { ...form.getHeaders() }
        });
        // --- END: MODIFIED CODE ---

        res.json(response.data);

    } catch (error) {
        const errorMessage = error.response ? (error.response.data.error || error.response.data.message) : 'Internal server error during analysis';
        const statusCode = error.response ? error.response.status : 500;
        console.error('Analysis API error:', errorMessage);
        res.status(statusCode).json({ message: errorMessage });
    }
});

module.exports = router;