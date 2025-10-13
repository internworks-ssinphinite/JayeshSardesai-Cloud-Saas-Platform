const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
console.log("--- Loading .env variables ---");
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS variable exists:", !!process.env.EMAIL_PASS ? "Yes" : "NO - THIS IS THE PROBLEM"); // Check if the variable exists
console.log("----------------------------");

const { Pool } = require('pg');
const authRoutes = require('./src/routes/auth');
const dashboardRoutes = require('./src/routes/dashboard');
const { startCleanupJob } = require('./src/utils/cleanup');
const paymentRoutes = require('./src/routes/payment');
const serviceRoutes = require('./src/routes/services');
const notificationRoutes = require('./src/routes/notifications');
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// make pool available via app.locals
app.locals.db = pool;

async function initDatabase(db) {
    console.log('Initializing database schema...');

    // Create pending_users table for unverified registrations
    await db.query(`
        CREATE TABLE IF NOT EXISTS pending_users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            verification_token TEXT UNIQUE NOT NULL,
            verification_token_expires_at TIMESTAMPTZ NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create indexes for pending_users
    await db.query(`
        CREATE INDEX IF NOT EXISTS idx_pending_users_token 
        ON pending_users(verification_token)
    `);
    await db.query(`
        CREATE INDEX IF NOT EXISTS idx_pending_users_expires 
        ON pending_users(verification_token_expires_at)
    `);

    // Create users table for verified users only
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('Database schema is up to date.');
}

app.use('/api/auth', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/notifications', notificationRoutes);

const port = process.env.PORT || 4000;

async function start() {
    try {
        await initDatabase(pool);

        // Start cleanup job to remove expired pending users (runs every 60 minutes)
        startCleanupJob(pool, 60);

        app.listen(port, () => {
            console.log(`SS Infinite backend listening on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    }
}

start();