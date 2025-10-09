// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const crypto = require('crypto');
const dns = require('dns').promises; // Using the promise-based version of dns
const emailValidator = require('email-validator');
const disposableDomains = require('disposable-email-domains');
const { sendVerificationEmail } = require('../utils/email');

const saltRounds = 10;
const disposableDomainsSet = new Set(disposableDomains);

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const rawEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const db = req.app.locals.db;

    if (!rawEmail || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // ✅ Step 1: Regex check (syntax validity)
        if (!emailValidator.validate(rawEmail)) {
            return res.status(400).json({ message: 'Email has an invalid format.' });
        }

        const domain = rawEmail.split('@')[1];

        // ✅ Step 2: Domain MX check (real mail server exists)
        try {
            const mxRecords = await dns.resolveMx(domain);
            if (mxRecords.length === 0) {
                return res.status(400).json({ message: 'No mail server found for the email domain.' });
            }
        } catch (error) {
            console.error('MX record check failed:', error);
            return res.status(400).json({ message: 'Email domain is not valid or does not exist.' });
        }

        // ✅ Step 3: Block disposable emails
        if (disposableDomainsSet.has(domain)) {
            return res.status(400).json({ message: 'Disposable emails are not allowed.' });
        }

        // ✅ Step 4: Check if email already exists in users or pending_users
        const existingUser = await db.query('SELECT email FROM users WHERE email = $1', [rawEmail]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        const existingPendingUser = await db.query('SELECT email FROM pending_users WHERE email = $1', [rawEmail]);
        if (existingPendingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Email already registered. Please check your inbox for the verification link.' });
        }

        // --- All validations passed, proceed with user creation ---

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiresAt = new Date(Date.now() + 3600000); // 1 hour

        // Store in pending_users table instead of users table
        const result = await db.query(
            'INSERT INTO pending_users (email, password_hash, verification_token, verification_token_expires_at) VALUES ($1, $2, $3, $4) RETURNING id, email',
            [rawEmail, hashedPassword, verificationToken, verificationTokenExpiresAt]
        );

        const pendingUser = result.rows[0];

        // ✅ Step 4: Confirmation Email
        await sendVerificationEmail(pendingUser.email, verificationToken);

        res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });

    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            return res.status(409).json({ message: 'Email already exists.' });
        }
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/auth/verify-email
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    const db = req.app.locals.db;

    if (!token) {
        return res.status(400).json({ message: 'Verification token is required.' });
    }

    try {
        // Look for the token in pending_users table
        const result = await db.query('SELECT * FROM pending_users WHERE verification_token = $1', [token]);
        const pendingUser = result.rows[0];

        if (!pendingUser) {
            return res.status(400).json({ message: 'Invalid or expired verification token.' });
        }

        // Check if token has expired
        if (pendingUser.verification_token_expires_at < new Date()) {
            // Clean up expired pending user
            await db.query('DELETE FROM pending_users WHERE id = $1', [pendingUser.id]);
            return res.status(400).json({ message: 'Verification token has expired. Please register again.' });
        }

        // Begin transaction to move user from pending_users to users
        await db.query('BEGIN');

        try {
            // Create the verified user in the users table
            await db.query(
                'INSERT INTO users (email, password_hash, created_at) VALUES ($1, $2, $3)',
                [pendingUser.email, pendingUser.password_hash, pendingUser.created_at]
            );

            // Remove from pending_users table
            await db.query('DELETE FROM pending_users WHERE id = $1', [pendingUser.id]);

            // Commit transaction
            await db.query('COMMIT');

            res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
        } catch (error) {
            // Rollback transaction on error
            await db.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Email verification error:', error);
        if (error.code === '23505') { // Unique constraint violation
            return res.status(409).json({ message: 'This email is already registered.' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const rawEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const db = req.app.locals.db;

    if (!rawEmail || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Check if user exists in verified users table
        const result = await db.query('SELECT * FROM users WHERE email = $1', [rawEmail]);
        const user = result.rows[0];

        if (!user) {
            // Check if user is still pending verification
            const pendingResult = await db.query('SELECT * FROM pending_users WHERE email = $1', [rawEmail]);
            if (pendingResult.rows.length > 0) {
                return res.status(401).json({ message: 'Please verify your email before logging in. Check your inbox for the verification link.' });
            }
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // All users in the users table are verified, so no need to check is_verified
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { userId: user.id, userEmail: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;