/* ==========================================================================
   THE GORILLA PIT - SERVER
   ==========================================================================
   This file starts the server and decides which code handles each URL.
   ========================================================================== */

import "dotenv/config";
import express from "express";
import cors from "cors";
import programsRoutes from "./routes/programs.js";
import authRoutes from "./routes/auth.js";

const app = express();


/* ==========================================================================
   SETTINGS
   ========================================================================== */

// Only these websites are allowed to talk to the API
const allowedSites = ["http://localhost:5173"];

if (process.env.CLIENT_URL) {
    allowedSites.push(process.env.CLIENT_URL);
}

app.use(cors({ origin: allowedSites }));

// Lets the server read JSON sent from the frontend (e.g. login details)
app.use(express.json());


/* ==========================================================================
   ROUTES
   ========================================================================== */

// A quick check to see if the server is running
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

// Everything starting with /api/programs is handled in routes/programs.js
app.use("/api/programs", programsRoutes);

// Everything starting with /api/auth is handled in routes/auth.js
app.use("/api/auth", authRoutes);


/* ==========================================================================
   START THE SERVER
   ========================================================================== */

// Railway gives us a PORT. On our own computer we use 3000.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
