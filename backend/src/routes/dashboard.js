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


// POST /api/analyze
router.post('/analyze', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file provided.' });
        }

        const form = new FormData();
        form.append('file', req.file.buffer, req.file.originalname);

        // API Key is no longer sent
        const response = await axios.post('http://127.0.0.1:5000/analyze', form, {
            headers: { ...form.getHeaders() }
        });

        res.json(response.data);

    } catch (error) {
        const errorMessage = error.response ? error.response.data.error : 'Internal server error during analysis';
        const statusCode = error.response ? error.response.status : 500;
        console.error('Analysis API error:', errorMessage);
        res.status(statusCode).json({ message: errorMessage });
    }
});

module.exports = router;