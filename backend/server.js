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
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// make pool available via app.locals
app.locals.db = pool;

async function initDatabase(db) {
    console.log('Initializing database schema...');
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            is_verified BOOLEAN DEFAULT FALSE
        )
    `);
    await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token TEXT');
    await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_expires_at TIMESTAMPTZ');
    console.log('Database schema is up to date.');
}

app.use('/api/auth', authRoutes);
app.use('/api', dashboardRoutes);

const port = process.env.PORT || 4000;

async function start() {
    try {
        await initDatabase(pool);
        app.listen(port, () => {
            console.log(`SS Infinite backend listening on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    }
}

start();
