-- ==========================================================================
--   DATABASE SCHEMA
-- ==========================================================================
--   The three tables the app uses. "IF NOT EXISTS" means this file is
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
