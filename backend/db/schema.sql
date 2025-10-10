-- Drop existing tables in reverse order of dependency to avoid errors
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS pending_users;

-- Table for pending user registrations (before email verification)
CREATE TABLE pending_users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    verification_token TEXT UNIQUE NOT NULL,
    verification_token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for verified users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    password_reset_token TEXT,
    password_reset_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table to store the services you offer
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL, -- Storing price in the smallest currency unit (e.g., paise for INR)
    billing_period VARCHAR(50) DEFAULT 'monthly', -- e.g., monthly, yearly, once
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table to track which user is subscribed to which service
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'inactive', -- e.g., pending, active, cancelled
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, service_id) -- A user can only have one subscription per service
);

-- Table to track transactions for subscriptions
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL, -- Can be null for one-time payments
    razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    amount INTEGER NOT NULL, -- Amount in the smallest currency unit
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(50) NOT NULL DEFAULT 'created', -- created, successful, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Indexes for faster lookups
CREATE INDEX idx_pending_users_token ON pending_users(verification_token);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);

-- Add the Document Analyzer as the first service by default
INSERT INTO services (name, description, price) VALUES ('Document Analyzer', 'Summarize text and analyze images in your documents.', 2500); -- 2500 paise = ₹25.00