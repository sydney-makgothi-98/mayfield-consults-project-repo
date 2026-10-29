/* ==========================================================================
   ORDERS ROUTES
   ==========================================================================
   POST /api/orders/checkout  ->  make an order and send the user to Stripe
   GET  /api/orders/:id       ->  look up one order (used by the success page)

   Both need the user to be signed in (requireLogin), so every order
   belongs to a real user.
   ========================================================================== */

import express from "express";
import db from "../db.js";
import stripe from "../stripe.js";
import requireLogin from "../middleware/requireLogin.js";

const router = express.Router();

// Where Stripe sends people back to after paying
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";


/* ==========================================================================
   CHECKOUT
   ==========================================================================
   The browser only sends WHICH plan it wants (planId), never the price.
   We look the price up in our own database, so nobody can change it.
   ========================================================================== */

router.post("/checkout", requireLogin, async (req, res) => {
    try {
        // 1. Find the plan and its real price
        const planResult = await db.query("SELECT * FROM plans WHERE id = $1", [req.body.planId]);
        const plan = planResult.rows[0];

        if (!plan) {
            return res.status(404).json({ error: "That plan doesn't exist." });
        }

        // 2. Save the order as "pending" (not paid yet)
        const orderResult = await db.query(
            "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id",
            [req.user.id, plan.price]
        );

        const orderId = orderResult.rows[0].id;

        // 3. Save what was bought, and at what price
        await db.query(
            "INSERT INTO order_items (order_id, plan_id, name, price, quantity) VALUES ($1, $2, $3, $4, 1)",
            [orderId, plan.id, plan.name, plan.price]
        );

        // 4. Ask Stripe for a checkout page for this order
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            customer_email: req.user.email,
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: "zar",
                        unit_amount: plan.price,
                        product_data: { name: `${plan.name} membership` },
                    },
                },
            ],
            // The order id travels with the payment, so the webhook knows which order was paid
            metadata: { orderId: String(orderId) },
            success_url: `${CLIENT_URL}/?order=${orderId}`,
            cancel_url: `${CLIENT_URL}/#membership`,
        });

        // 5. Remember which Stripe session belongs to this order
        await db.query("UPDATE orders SET stripe_session_id = $1 WHERE id = $2", [session.id, orderId]);

        // 6. Send back Stripe's page address. The frontend sends the user there.
        res.json({ url: session.url });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not start checkout. Please try again." });
    }
});


/* ==========================================================================
   LOOK UP AN ORDER
   ==========================================================================
   Only finds orders that belong to the signed-in user, so nobody can
   see someone else's order by guessing a number.
   ========================================================================== */

router.get("/:id", requireLogin, async (req, res) => {
    try {
        const orderResult = await db.query(
            "SELECT id, status, total, created_at FROM orders WHERE id = $1 AND user_id = $2",
            [req.params.id, req.user.id]
        );

        const order = orderResult.rows[0];

        if (!order) {
            return res.status(404).json({ error: "Order not found." });
        }

        const itemsResult = await db.query(
            "SELECT name, price, quantity FROM order_items WHERE order_id = $1",
            [order.id]
        );

        order.items = itemsResult.rows;

        res.json(order);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not load order." });
    }
});

export default router;
