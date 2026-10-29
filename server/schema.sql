-- ==========================================================================
--   DATABASE SCHEMA
-- ==========================================================================
--   The tables the app uses. "IF NOT EXISTS" means this file is
--   safe to run more than once - it won't wipe tables that already exist.
-- ==========================================================================


-- People who have signed up
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Who is logged in right now. One row per login.
-- If a user is deleted, their sessions are deleted too (ON DELETE CASCADE).
CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL
);


-- The gym's programs, shown in the main grid on the site
CREATE TABLE IF NOT EXISTS programs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    duration TEXT NOT NULL,
    intensity TEXT NOT NULL
);


-- The membership plans people can buy.
-- Prices are saved in cents (R450 = 45000), because that's what Stripe uses
-- and whole numbers never have rounding mistakes.
CREATE TABLE IF NOT EXISTS plans (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    period TEXT NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    perks TEXT[] NOT NULL
);


-- One row per purchase.
-- status starts as 'pending' and only the Stripe webhook changes it to 'paid'.
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending',
    total INTEGER NOT NULL,
    stripe_session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- What was bought in each order, and at what price.
-- The name and price are copied in at the time of buying, so an old order
-- never changes even if a plan's price changes later.
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    plan_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1
);
