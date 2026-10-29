/* ==========================================================================
   STRIPE WEBHOOK
   ==========================================================================
   POST /api/webhooks/stripe

   A "webhook" is Stripe calling OUR server to tell us something happened.
   When a payment completes, Stripe sends a message here, and this is the
   ONLY place in the whole app that marks an order as "paid".

   Why not trust the browser? Anyone could visit the success page without
   paying. Stripe's message is signed with a secret only Stripe and our
   server know (STRIPE_WEBHOOK_SECRET), so we can prove it's really Stripe.
   ========================================================================== */

import express from "express";
import db from "../db.js";
import stripe from "../stripe.js";

const router = express.Router();

// Stripe's signature check needs the message exactly as it arrived,
// so this route reads the "raw" body instead of turning it into JSON.
router.post("/stripe", express.raw({ type: "application/json" }), async (req, res) => {

    // 1. Prove the message really came from Stripe
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            req.headers["stripe-signature"],
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Webhook signature check failed:", error.message);
        return res.status(400).json({ error: "Invalid signature" });
    }

    // 2. A checkout was completed and the money came through
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        if (session.payment_status === "paid") {
            try {
                await db.query(
                    "UPDATE orders SET status = 'paid' WHERE id = $1",
                    [session.metadata.orderId]
                );

                console.log(`Order ${session.metadata.orderId} paid`);

            } catch (error) {
                // A 500 tells Stripe to try again later
                console.error(error);
                return res.status(500).json({ error: "Could not update order" });
            }
        }
    }

    // 3. Tell Stripe we got the message (otherwise it keeps retrying)
    res.json({ received: true });
});

export default router;
