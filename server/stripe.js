/* ==========================================================================
   STRIPE CONNECTION
   ==========================================================================
   Every file that needs Stripe imports "stripe" from here.
   The secret key comes from STRIPE_SECRET_KEY in the .env file.
   ========================================================================== */

import "dotenv/config";
import Stripe from "stripe";

// Stripe crashes if the key is missing, which would take the whole server
// down. Using a stand-in keeps the rest of the site working, and checkout
// just shows an error until the real key is added.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "missing-key");

export default stripe;
