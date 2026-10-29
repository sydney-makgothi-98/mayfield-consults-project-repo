/* ==========================================================================
   LOGIN CHECK (MIDDLEWARE)
   ==========================================================================
   "Middleware" is code that runs BEFORE a route. Put requireLogin in front
   of any route that only signed-in people may use:

       router.post("/checkout", requireLogin, async (req, res) => { ... });

   - Signed in?      -> saves the user in req.user and lets the route run
   - Not signed in?  -> stops here with a 401 error. The route never runs.
   ========================================================================== */

import db from "../db.js";

// Pulls the token out of the "Authorization: Bearer <token>" header
export function getToken(req) {
    const header = req.headers.authorization || "";

    if (header.startsWith("Bearer ")) {
        return header.slice(7);
    }

    return null;
}

async function requireLogin(req, res, next) {
    try {
        const token = getToken(req);

        if (!token) {
            return res.status(401).json({ error: "Please sign in first." });
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
            return res.status(401).json({ error: "Please sign in first." });
        }

        // Routes after this can use req.user to know who is signed in
        req.user = result.rows[0];
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not check login." });
    }
}

export default requireLogin;
