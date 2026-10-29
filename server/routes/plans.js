/* ==========================================================================
   PLANS ROUTES
   ==========================================================================
   GET /api/plans  ->  every membership plan in the database, as JSON
   ========================================================================== */

import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM plans ORDER BY id");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not load plans" });
    }
});

export default router;
