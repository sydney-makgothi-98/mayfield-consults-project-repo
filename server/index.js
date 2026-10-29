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
import plansRoutes from "./routes/plans.js";
import ordersRoutes from "./routes/orders.js";
import webhooksRoutes from "./routes/webhooks.js";

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

// Stripe's webhook must come BEFORE express.json() below, because it needs
// the message exactly as Stripe sent it to check the signature
app.use("/api/webhooks", webhooksRoutes);

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

// Membership plans, and buying them
app.use("/api/plans", plansRoutes);
app.use("/api/orders", ordersRoutes);


/* ==========================================================================
   START THE SERVER
   ========================================================================== */

// Railway gives us a PORT. On our own computer we use 3000.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
