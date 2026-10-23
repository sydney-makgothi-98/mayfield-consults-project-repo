/* ==========================================================================
   PROGRAMS ROUTES
   ==========================================================================
   GET /api/programs  ->  every program in the database, as JSON
   ========================================================================== */

import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM programs ORDER BY id");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not load programs" });
    }
});

export default router;
