# Email Verification Migration Guide

## Overview
This migration implements a **secure email verification flow** where users are only created in the main `users` table **after** they verify their email address.

## What Changed?

### Before (Old Implementation)
1. User registers → User created immediately in `users` table with `is_verified = FALSE`
2. Verification email sent
3. User clicks link → `is_verified` set to `TRUE`
4. User can login

**Problems:**
- Database bloat with unverified accounts
- Potential security issues
- Spam registrations remain in database

### After (New Implementation)
1. User registers → User stored in `pending_users` table
2. Verification email sent
3. User clicks link → User moved from `pending_users` to `users` table
4. User can login

**Benefits:**
- Only verified users exist in the main `users` table
- Automatic cleanup of expired pending registrations
- Better database hygiene
- Improved security

## Database Schema Changes

### New Table: `pending_users`
```sql
CREATE TABLE pending_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    verification_token TEXT UNIQUE NOT NULL,
    verification_token_expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### Updated Table: `users`
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
-- Removed: is_verified, verification_token, verification_token_expires_at
```

## Migration Steps

### Option 1: Fresh Start (Recommended for Development)
If you don't have important user data:

```sql
-- Drop existing tables
DROP TABLE IF EXISTS users CASCADE;

-- Run the new schema (server.js will create tables automatically on startup)
-- Or manually run: backend/db/schema.sql
```

### Option 2: Migrate Existing Data (Production)
If you have existing users:

```sql
-- Step 1: Create pending_users table
CREATE TABLE pending_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    verification_token TEXT UNIQUE NOT NULL,
    verification_token_expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Create indexes
CREATE INDEX idx_pending_users_token ON pending_users(verification_token);
CREATE INDEX idx_pending_users_expires ON pending_users(verification_token_expires_at);

-- Step 3: Move unverified users to pending_users
INSERT INTO pending_users (email, password_hash, verification_token, verification_token_expires_at, created_at)
SELECT 
    email, 
    password_hash, 
    COALESCE(verification_token, md5(random()::text)), 
    COALESCE(verification_token_expires_at, NOW() + INTERVAL '1 hour'),
    created_at
FROM users 
WHERE is_verified = FALSE;

-- Step 4: Remove unverified users from users table
DELETE FROM users WHERE is_verified = FALSE;

-- Step 5: Remove old columns from users table
ALTER TABLE users DROP COLUMN IF EXISTS is_verified;
ALTER TABLE users DROP COLUMN IF EXISTS verification_token;
ALTER TABLE users DROP COLUMN IF EXISTS verification_token_expires_at;
```

## New Features

### 1. Automatic Cleanup
The system now automatically removes expired pending users every 60 minutes.

### 2. Better Error Messages
- "Email already registered. Please check your inbox for the verification link." - When trying to register with a pending email
- "Please verify your email before logging in. Check your inbox for the verification link." - When trying to login with unverified account

### 3. Transaction Safety
Email verification now uses database transactions to ensure data consistency when moving users between tables.

## Testing the New Flow

1. **Register a new user:**
   ```bash
   POST /api/auth/register
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
   - User should be in `pending_users` table
   - User should NOT be in `users` table

2. **Try to login before verification:**
   ```bash
   POST /api/auth/login
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
   - Should receive: "Please verify your email before logging in..."

3. **Verify email:**
   ```bash
   GET /api/auth/verify-email?token=<verification_token>
   ```
   - User should be moved to `users` table
   - User should be removed from `pending_users` table

4. **Login after verification:**
   ```bash
   POST /api/auth/login
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
   - Should receive JWT token successfully

## Rollback Plan

If you need to rollback to the old implementation:

1. Stop the server
2. Restore the old `schema.sql` from git history
3. Restore the old `auth.js` from git history
4. Restore the old `server.js` from git history
5. Run database migration to restore old schema
6. Restart the server

## Support

If you encounter any issues during migration, check:
- Database connection is working
- All tables are created properly
- No foreign key constraints are blocking the migration
- Backup your database before migrating production data
