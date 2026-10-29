# The Gorilla Pit

A website for The Gorilla Pit, a fictional gym, with a real backend: programs and membership plans are stored in a Postgres database, members can sign up, log in and log out, and they can buy a membership with Stripe (test mode).

**Full explanation:** see [How it all works.md](How%20it%20all%20works.md) and [Weeks 3 and 4.md](Weeks%203%20and%204.md).

## The parts

| Part | Folder | Built with | Lives on |
|---|---|---|---|
| Frontend | `client/` | React, Vite, Tailwind CSS | Vercel |
| Backend API | `server/` | Node.js, Express | Railway |
| Database | – | Postgres | Neon |
| Payments | – | Stripe Checkout (test mode) | Stripe |

## Running it locally

1. Copy `server/.env.example` to `server/.env` and add your Neon `DATABASE_URL`, `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
2. Set up the backend and fill the database:
   ```
   cd server
   npm install
   npm run seed
   npm run dev
   ```
3. In a **second** terminal, start the frontend:
   ```
   cd client
   npm install
   npm run dev
   ```
4. In a **third** terminal, forward Stripe's webhook messages to your computer (needs the [Stripe CLI](https://docs.stripe.com/stripe-cli)):
   ```
   stripe listen --events checkout.session.completed --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copy the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`, and restart the server.
5. Open http://localhost:5173, sign in, click **Join** on a plan, and pay with the test card `4242 4242 4242 4242` (any future date, any CVC).

## API routes

| Method | Route | Does |
|---|---|---|
| GET | `/api/programs` | All programs from the database |
| POST | `/api/auth/signup` | Create an account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Who is logged in |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/plans` | All membership plans from the database |
| POST | `/api/orders/checkout` | **Signed in only.** Makes an order and returns a Stripe checkout link |
| GET | `/api/orders/:id` | **Signed in only.** One of your orders and its status |
| POST | `/api/webhooks/stripe` | **Stripe only.** Marks an order as paid |
