/* ==========================================================================
   AUTH ROUTES
   ==========================================================================
   POST /api/auth/signup  ->  create an account and log in
   POST /api/auth/login   ->  log in
   GET  /api/auth/me      ->  who is logged in? (used after a page refresh)
   POST /api/auth/logout  ->  log out

   How a login is remembered:
   1. When someone logs in, we make a long random "token" and save it in
      the sessions table next to their user id.
   2. The frontend keeps the token and sends it with every request in a
      header:  Authorization: Bearer <token>
   3. To know who someone is, we look their token up in the sessions table.
   ========================================================================== */

import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import db from "../db.js";
import { getToken } from "../middleware/requireLogin.js";

const router = express.Router();

// How long a login lasts before you have to log in again
const SESSION_DAYS = 7;


/* ==========================================================================
   HELPERS
   ========================================================================== */

// Makes a new session for a user and gives back its token
async function createSession(userId) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

    await db.query(
        "INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)",
        [token, userId, expiresAt]
    );

    return token;
}


/* ==========================================================================
   SIGN UP
   ========================================================================== */

router.post("/signup", async (req, res) => {
    try {
        const name = (req.body.name || "").trim();
        const email = (req.body.email || "").trim().toLowerCase();
        const password = req.body.password || "";

        if (!name || !email || password.length < 6) {
            return res.status(400).json({ error: "Please fill in every field. Passwords need at least 6 characters." });
        }

        // Is this email already used?
        const existing = await db.query("SELECT id FROM users WHERE email = $1", [email]);

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: "An account with that email already exists." });
        }

        // Never store the real password - only a scrambled "hash" of it
        const passwordHash = await bcrypt.hash(password, 10);

        const result = await db.query(
            "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, passwordHash]
        );

        const user = result.rows[0];
        const token = await createSession(user.id);

        res.status(201).json({ token, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not sign up. Please try again." });
    }
});


/* ==========================================================================
   LOG IN
   ========================================================================== */

router.post("/login", async (req, res) => {
    try {
        const email = (req.body.email || "").trim().toLowerCase();
        const password = req.body.password || "";

        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];

        // bcrypt.compare checks the password against the saved hash.
        // We give the same message either way, so nobody can find out
        // which emails have accounts.
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: "Wrong email or password." });
        }

        const token = await createSession(user.id);

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not log in. Please try again." });
    }
});


/* ==========================================================================
   WHO AM I? (keeps people logged in after a refresh)
   ========================================================================== */

router.get("/me", async (req, res) => {
    try {
        const token = getToken(req);

        if (!token) {
            return res.status(401).json({ error: "Not logged in." });
        }

        // Find the session (only if it hasn't expired) and its user
        const result = await db.query(
            `SELECT users.id, users.name, users.email
             FROM sessions
             JOIN users ON users.id = sessions.user_id
             WHERE sessions.token = $1 AND sessions.expires_at > NOW()`,
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Not logged in." });
        }

        res.json({ user: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not check login." });
    }
});


/* ==========================================================================
   LOG OUT
   ========================================================================== */

router.post("/logout", async (req, res) => {
    try {
        const token = getToken(req);

        // Deleting the session means the token stops working
        if (token) {
            await db.query("DELETE FROM sessions WHERE token = $1", [token]);
        }

        res.json({ message: "Logged out" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not log out." });
    }
});

export default router;
