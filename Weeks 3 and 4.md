# Weeks 3 and 4

---

## Week 3: Giving the website a brain

### The target

At the end of Week 2, The Gorilla Pit was a good-looking website, but it was only a **shop window**. Everything on it was typed straight into the code. Nobody could sign up, nothing was saved, and the only way to change a gym program was for a programmer to edit the code.

The goal for Week 3 was to turn it into a **real working app**:

- a **database** that stores the gym's programs and its members;
- a **server** that hands that information to the website when asked;
- real **sign up and log in**, so members have accounts;
- the whole thing **live on the internet**, so anyone can use it from anywhere, not just on my laptop.

---

### The simple picture: a restaurant

The easiest way to understand the whole app is to think of a restaurant.

| Restaurant | Our app | What it does |
|---|---|---|
| **The dining room** | The website (`client`) | What customers see and use. Nice to look at, but it doesn't cook anything. |
| **The kitchen** | The server (`server`) | Takes orders, prepares them, and sends them out. Customers never go in here. |
| **The pantry / storeroom** | The database | Where all the ingredients (the information) are kept safely. |
| **The waiter** | The API | Carries orders from the dining room to the kitchen, and brings the food back. |
| **The bouncer at the door** | Login and sessions | Checks who you are and remembers you while you're inside. |

In Week 2 we only had a dining room with plastic food on display. In Week 3 we built the kitchen and the pantry, and hired the waiter and the bouncer.

---

### Step 1: Splitting the project into two parts (client and server)

**What was done:** the Week 2 React website (all the `.jsx` files) was moved into a folder called `client`. A new folder called `server` was made next to it for the kitchen.

```
the project
├── client/   ← the website people see (React)
└── server/   ← the behind-the-scenes kitchen (Node.js + Express)
```

**Why:** the two parts have completely different jobs.

- The **client** runs on the visitor's phone or computer. Anyone can look at its code, so it must **never** hold secrets.
- The **server** runs on a computer we control. It's the only part allowed to talk to the database and handle passwords.

Keeping them in separate folders means each part can be built, tested and put online on its own, and it's always clear which code is "public" and which is "private".

#### How this is like Django

Django is a popular tool (written in the Python language) for building websites with a backend. It uses exactly the same idea, just arranged differently. Django keeps everything in one big box, while we used two smaller boxes. But every part matches up:

| Job | In Django | In our project |
|---|---|---|
| Describe what the data looks like | **Models** (`models.py`) | `schema.sql`: the list of tables and columns |
| Put starting data in | **Fixtures / data migrations** | `seed.js`: puts the 6 gym programs in |
| Decide what happens when someone asks for something | **Views** (`views.py`) | **Routes** (`routes/programs.js`, `routes/auth.js`) |
| Match web addresses to the right code | **URLs** (`urls.py`) | `index.js`: `/api/programs`, `/api/auth/...` |
| What the visitor sees | **Templates** (HTML pages) | The **React** website in `client` |
| Secret settings | `settings.py` + environment variables | The `.env` file |
| Logins | Built-in **auth** system | Our own simple version: bcrypt + a sessions table |

**The one big difference:** in Django, the server builds each finished page and sends the whole page to the browser. In our app, the server only sends **raw information** (in a format called JSON), and React, running in the browser, builds the page from it.

In restaurant terms: Django is a kitchen that sends out **plated meals**. Ours is a kitchen that sends out **ingredients**, and the dining room plates them up. Both feed the customer. Our way lets the website stay fast and smooth, and the same kitchen could later serve a phone app too.

---

### Step 2: Setting up the database (Neon)

**What was done:** we created a free online **Postgres** database on a service called **Neon**, and wrote down what tables it should have.

There are three tables, each like a spreadsheet:

| Table | What it holds |
|---|---|
| `users` | Each member: name, email, scrambled password, and when they joined |
| `sessions` | Who is logged in right now (a "wristband" for each login) |
| `programs` | The gym's classes: Strength, HIIT, Boxing, Yoga, Spin, Personal Training |

**Why Postgres?** It's one of the most trusted databases in the world. Banks and big companies use it, it's free, and it's what we were taught.

**Why Neon?** The database has to be **switched on all the time**, because the live server needs to reach it day and night. A database on my laptop would disappear whenever I closed the lid. Neon keeps it online for free, with no installation, and it sleeps when nobody is using it to save resources.

---

### Step 3: Keeping secrets safe (the `.env` file)

**What was done:** the database's address and password were put in a special file called `.env`. Then `.env` was added to a list called `.gitignore`, which tells git (the tool that saves and uploads code to GitHub) to **never upload it**.

**Why:** the database password is like the key to the storeroom. If it were uploaded to GitHub, anyone who saw the code could walk in and read, change or delete every member's account. And git remembers everything forever, so even deleting it later wouldn't help.

So the rule is: **the code is public, the keys are private.** On the live server, the keys are typed into the hosting company's private settings page instead.

---

### Step 4: Filling the database (the seed script)

**What was done:** in Week 2, the gym programs were typed straight into the website's code. We wrote a small script, `seed.js`, that creates the tables and **moves those programs into the database**. You run it with one command: `npm run seed`.

**Why:** "seeding" is like stocking the shelves before opening day. Now the programs live in one proper place, the database, and could be changed later without touching the website's code. The script is safe to run again whenever you want a fresh start, and it never touches member accounts.

---

### Step 5: Building the API (the waiter)

**What was done:** we built the server with **Node.js** and **Express**, and gave it a few "addresses" the website can ask for:

| Address | What you get back |
|---|---|
| `/api/health` | "I'm alive": a quick check that the server is running |
| `/api/programs` | The list of gym programs, read from the database |
| `/api/auth/signup` | Make a new account |
| `/api/auth/login` | Log in |
| `/api/auth/me` | "Who am I?": used when the page is refreshed |
| `/api/auth/logout` | Log out |

**Why Node.js and Express?** Node.js lets us write the server in **JavaScript**, the same language as the website, so there's only one language to learn. Express is a small, simple add-on that makes it easy to say "when someone asks for this address, do this". It's what we covered in class.

**Why JSON?** JSON is a simple, universal format for sending information, like a neatly filled-in form. Almost every app and programming language in the world understands it.

---

### Step 6: Real sign up and log in (the bouncer)

**What was done:**

1. **Sign up:** the member gives a name, email and password. The password is **scrambled** with a tool called **bcrypt** before it's saved. We never store the real password, so even we can't read it. If the database were ever stolen, the passwords would still be unreadable.
2. **Log in:** the server scrambles the password that was typed in and checks it against the saved one. If they match, it gives the member a long random code called a **token**, and writes it in the `sessions` table. It's like a **festival wristband**.
3. **Staying logged in:** the website keeps the wristband and shows it with every request. When the page is refreshed, it asks the server "who does this wristband belong to?" (`/api/auth/me`), and the member stays logged in.
4. **Log out:** the wristband is cut off, which means it's deleted from the `sessions` table, so it stops working.
5. Wristbands **expire after 7 days**, for safety.

The website now shows **"Hi, [name]" and a Sign out button** when you're logged in, and a **Sign in** button when you're not.

**Why build it this way?** It's the simplest real login system that's still safe. It uses a trusted tool (bcrypt) for the dangerous part, which is passwords, and I can explain every line of it. A wristband (token) was used instead of a "cookie" because our website and our server live on **different web addresses**, and browsers often block cookies between different addresses.

---

### Step 7: Connecting the website to the server

**What was done:** the website stopped using its typed-in list of programs. It now **asks the server** for them every time it loads. All the "talking to the server" code was put in one file, `client/src/api.js`, so it's easy to find and change.

**Why:** now the information has one true home, the database. If a program is changed in the database, every visitor sees the change straight away, without anyone touching the website.

---

### Step 8: Putting it all on the internet

Each part went to the hosting company that suits it best. All three are **free** for a project this size.

```
   Visitor's phone / computer
              │
              ▼
   ┌──────────────────┐   asks for data   ┌──────────────────┐   reads / writes   ┌──────────────────┐
   │      VERCEL      │ ────────────────▶ │     RAILWAY      │ ─────────────────▶ │       NEON       │
   │   the website    │ ◀──────────────── │    the server    │ ◀───────────────── │   the database   │
   │  (dining room)   │    sends back     │    (kitchen)     │                    │    (pantry)      │
   └──────────────────┘                   └──────────────────┘                    └──────────────────┘
```

| Platform | What it hosts | Why this one |
|---|---|---|
| **GitHub** | The code | The central safe for all the code. Vercel and Railway both read from it, so when I upload a change, **both update themselves automatically**. |
| **Vercel** | The website | It's built for websites. It turns the React code into fast, simple files and serves them from computers all over the world, so the site loads quickly anywhere. |
| **Railway** | The server | It's built for servers: programs that must **keep running** 24/7 and wait for requests. Vercel isn't designed for that. |
| **Neon** | The database | An always-on, free Postgres database (see Step 2). |

**Why split it across three companies instead of one?** Each one is the best free option for its job, and it's how the industry commonly does it. If one part needs to grow, it can grow on its own. A restaurant can get a bigger kitchen without rebuilding the dining room.

**How the three were connected** (with a few settings, no extra code):

- **Railway** was given the database's address and password (`DATABASE_URL`), so the kitchen can open the pantry.
- **Vercel** was given the server's address (`VITE_API_URL`), so the dining room knows where the kitchen is.
- **Railway** was given the website's address (`CLIENT_URL`), so the kitchen only accepts orders from **our** dining room and ignores strangers. This safety check is called **CORS**.

**Problems we hit, and how they were fixed:**

- **Railway couldn't find the server at first.** It was looking in the main folder. *Fix:* told it to look in the `server` folder.
- **Railway had outages,** with "502 Bad Gateway" errors and a temporary pause on all updates. This was their problem, not ours. *Fix:* waited and pressed "Redeploy".
- **The website couldn't find the server.** The setting on Vercel had been saved as a "secret" with an extra line break, so the website got the wrong address. *Fix:* deleted it and added it again as a normal setting, with the exact address.
- **The server didn't trust the website yet.** *Fix:* added the website's address to Railway (`CLIENT_URL`).

---

### The result

| What was needed | Done |
|---|---|
| A working API, live on the internet, reading from a real database | ✅ |
| A database design that can be explained in plain English | ✅ |
| A live web address where the whole app works, not just on my laptop | ✅ https://mayfield-consults-project-repo.vercel.app |
| Real sign up and log in, which survives a page refresh | ✅ |
| Secrets kept out of the code on GitHub | ✅ |

Everything was tested on the live site: the programs load, signing up works, members stay logged in after a refresh, logging out works, and wrong passwords are refused.

---

### The one-minute version (for the investor)

> "Before, the site was a brochure. Now it's a real product. There's a **database** that safely stores our classes and our members, a **server** that acts as the middle-man between the website and the database, and a proper **sign-up and log-in** system where passwords are scrambled so even we can't read them. Each part runs on a specialised, trusted cloud service: Vercel for the website, Railway for the server, Neon for the database. They're all connected, they all update automatically when we improve the code, and they cost nothing at our current size. It's the same structure big frameworks like Django use, just split into a website half and a server half so each can grow on its own."

---

## Week 4: Taking payments

### The target

At the end of Week 3, people could sign up and log in, but they couldn't **buy** anything. The "Join" buttons on the membership plans didn't do anything.

The goal for Week 4 was to make the **Join** buttons actually take payment:

- click **Join Monthly** → pay on a secure payment page → land on a page that says **"Payment successful"**;
- every purchase is **saved** in the database and tied to a real member;
- an order is only marked **"paid"** when the payment company itself confirms the money came through.

It all runs in **test mode**: real-looking payments with fake money, using a test card number. Nobody gets charged.

---

### The simple picture: back to the restaurant

| Restaurant | Our app | What it does |
|---|---|---|
| **The order slip** | The `orders` table | One slip per purchase: who ordered, how much, and is it paid yet? |
| **The lines on the slip** | The `order_items` table | What was bought, and at what price |
| **The card machine** | **Stripe** | Takes the card payment. We never touch card numbers. |
| **The bank's confirmation slip** | The **webhook** | Stripe calling our kitchen to say "the money came through" |
| **"Members only" sign at the till** | The **login check** (middleware) | You must be signed in to buy |

---

### Step 1: New tables in the database

**What was done:** three new tables were added and pushed to the live Neon database.

| Table | What it holds |
|---|---|
| `plans` | The 3 membership plans: Day Pass, Monthly, Annual, with their prices. These used to be typed into the website's code (`data.js`); now they live in the database like the programs do. |
| `orders` | One row per purchase: **who** bought it (`user_id`), the **total**, the **status** (`pending` or `paid`), and Stripe's reference number. |
| `order_items` | What was bought in each order, and **at what price**. |

**Why prices are saved in cents** (R450 is saved as `45000`): it's what Stripe uses, and whole numbers never have rounding mistakes. Money and decimals don't mix well in computers.

**Why `order_items` copies the name and price:** if the gym raises the Monthly price next year, old orders should still show what the person **actually paid**. Like a till slip, it never changes after it's printed.

**Why the plans moved into the database:** the server must look up the real price itself (see Step 4). If the price only lived in the website's code, the server would have nowhere trustworthy to check it.

---

### Step 2: Stripe

**What Stripe is:** a payment company, the "card machine" for websites. Millions of businesses use it.

**Why Stripe:**
- **We never see or store card numbers.** People type their card details on **Stripe's own page**, not ours. That's much safer, and it means we don't have to meet the strict security rules for handling cards.
- **Test mode** lets us practise with fake money and the test card `4242 4242 4242 4242`.
- It's free to set up, and it's what was used in class.

**The Stripe secret key** (starts with `sk_test_`) goes in the server's `.env` file and in Railway's Variables, **never** in the website code and **never** on GitHub. Just like the database password in Week 3.

---

### Step 3: The login check (middleware)

**What was done:** a small piece of code called `requireLogin` (in `server/middleware/requireLogin.js`) was added.

**"Middleware"** is code that runs **before** a route, like a bouncer standing in front of a door. It looks at the member's wristband (the login token from Week 3):
- **valid wristband** → lets them through, and tells the route who they are;
- **no wristband, or a fake one** → stops them with "Please sign in first."

It stands in front of **checkout** and **order lookup**.

**Why:** every order must belong to a real member, otherwise we'd have payments with no idea who made them. On the website, clicking **Join** while signed out simply opens the sign-in box.

---

### Step 4: The checkout route

**What was done:** a new address, `POST /api/orders/checkout`. When a signed-in member clicks **Join**:

1. The website sends **only which plan** they want (e.g. plan number 2), **never the price**.
2. The server **looks up the real price** in the database.
3. It saves an **order** marked `pending`, plus an **order item** saying what was bought and for how much.
4. It asks **Stripe** to create a secure payment page for that amount, and attaches our order number to it.
5. It sends the payment page's address back, and the website takes the member there.

**Why never trust a price from the browser?** Anything on the visitor's side can be changed by the visitor. A clever person could edit the request to say "Annual membership, R1". By looking the price up ourselves, the price is always ours to decide. *(This was tested: sending a fake price is simply ignored.)*

---

### Step 5: The webhook (the only thing that marks an order "paid")

**What a webhook is:** normally the website calls our server. A webhook is the other way round: **Stripe calls our server** to tell us something happened. When a payment goes through, Stripe sends a message to `POST /api/webhooks/stripe`.

**What was done:** when that message arrives, the server:
1. **Checks the signature.** Every message from Stripe is "signed" with a secret that only Stripe and our server know (`STRIPE_WEBHOOK_SECRET`). A fake message without the right signature is rejected.
2. If it's a completed, **paid** checkout, it finds our order number in the message and marks that order **`paid`**.

**Why is this the ONLY place that marks an order as paid?**
- After paying, Stripe sends the member back to our success page. But **anyone could type that page's address** without paying.
- The member might also close the tab before getting back to our site, even though they paid.
- The webhook comes **straight from Stripe to our server**, with a signature we can check. It's the bank's own confirmation slip, not the customer saying "trust me, I paid".

**Testing it locally:** Stripe can't reach a laptop directly, so the **Stripe CLI** (a small Stripe program) passes the messages along: `stripe listen --events checkout.session.completed --forward-to localhost:3000/api/webhooks/stripe`.

---

### Step 6: The "Join" buttons

**What was done:** the membership plans now load from the database, and each **Join** button:
- if you're **not signed in** → opens the sign-in box;
- if you **are** signed in → says "Loading...", calls the checkout route, and sends you to Stripe's payment page.

---

### Step 7: The order lookup and the success page

**What was done:**
- A new address, `GET /api/orders/:id`, gives back one order and its status. It only shows **your own** orders, so nobody can peek at someone else's by guessing a number.
- After paying, Stripe sends the member to the success page (`/?order=12`). It shows the order number, the plan, the total and the status.

**Why it checks a few times:** Stripe sends the member back **straight away**, but the webhook message can arrive a second or two **later**. So if the order still says `pending`, the page waits 2 seconds and checks again, up to 5 times. Usually it flips from **"Confirming your payment..."** to **"Payment successful!"** within a moment. If it still hasn't come through, it says so honestly and asks the member to refresh in a minute, rather than pretending it's paid.

---

### Step 8: Setting up Stripe and going live

This is everything that was done outside the code: on Stripe's website, on my laptop, and on Railway.

#### 8.1 Creating the Stripe account (a "sandbox")

1. **Signed up at stripe.com.**
2. On the "What do you need?" screen, kept only **Accept online payments** ticked. **Subscriptions** (repeat billing) and **Build a platform** (marketplaces paying other sellers) were unticked, because we just take a one-off payment.
3. On "How do you want to manage tax, fraud and disputes?", chose **Pick what you need**. The "Let us handle it" option makes Stripe the official seller, adds a 3.5% fee and is built for digital products. We just need plain Stripe Checkout.
4. Chose **Go to sandbox**, *not* "Get your live account".

**What a sandbox is:** Stripe's practice area. Everything works exactly like the real thing, but with **fake money**, and no business or bank details are needed. The dashboard shows a "Sandbox" banner at the top so you always know.

#### 8.2 Getting the secret key

- In the sandbox dashboard: **Developers** (bottom left) → **API keys** → **Secret key** → **Reveal**. It starts with `sk_test_`. The `test` part means it can only ever move fake money.
- It was put in `server/.env` as `STRIPE_SECRET_KEY`. Git ignores that file, so the key never goes to GitHub.
- It was checked by starting a real test checkout from the laptop. Stripe sent back a payment page for R450.

> **Safety net:** if the key is ever missing, Stripe would normally crash the whole server. `server/stripe.js` uses a stand-in instead, so the rest of the site keeps working and only checkout shows an error. That's why the code could be pushed live **before** the key was added to Railway, with nothing breaking.

#### 8.3 Testing the webhook on the laptop (Stripe CLI)

**The problem:** Stripe's computers can't reach `localhost`. My laptop isn't on the public internet.

**The fix:** the **Stripe CLI**, a small program from Stripe. It logs in to my Stripe account, picks up the webhook messages and **passes them on to my laptop**, like a mail forwarding service.

1. **Installed it** with Windows' built-in installer, in PowerShell:
   ```
   winget install Stripe.StripeCli
   ```
   *Hiccup:* afterwards, `stripe` was "not recognised". Windows only tells **new** terminals about newly installed programs. Fix: restart VS Code, or run it using its full file path.
2. **Logged in** with `stripe login`. The browser asked which environment to connect, and **kinematicTechSolutions sandbox** was chosen, because it's the same account the secret key came from. *(If the CLI were connected to a different account, payments would happen in one place while the CLI listened in another, and orders would stay "pending" forever.)*
3. **Started forwarding:**
   ```
   stripe listen --events checkout.session.completed --forward-to localhost:3000/api/webhooks/stripe
   ```
   *Hiccup:* the newest CLI refuses to start unless you say **which** events you want, so `--events checkout.session.completed` was added. That's the only event our code cares about: "a checkout finished".
4. It printed a **signing secret** (`whsec_...`), which went into `server/.env` as `STRIPE_WEBHOOK_SECRET`.

So running it locally takes **three terminals**: the server, the website, and `stripe listen`.

#### 8.4 Pushing the code

All the Week 4 work was built on a separate **branch** (`week-4-stripe`), in small commits:
1. the new tables;
2. the Stripe connection and the login check;
3. the checkout, order lookup and webhook routes;
4. the Join buttons;
5. the success page;
6. the docs.

It was then **merged into `main` and pushed**. Like in Week 3, that made **Vercel** (website) and **Railway** (server) rebuild themselves automatically.

The new tables had already been added to the live **Neon** database by running `npm run seed`. It only *adds* tables and refreshes the programs and plans; it never touches members or orders.

#### 8.5 Wiring the live webhook: Stripe → Railway

On the laptop, the CLI forwards the messages. On the live site, Stripe sends them **straight to Railway**, because Railway's address is public. Stripe just needs to be told where to send them.

In the Stripe sandbox: **Developers → Webhooks → Add destination**:

| Setting | Chosen | Why |
|---|---|---|
| Scope | **Your account** | The payments happen in our own account (not "connected accounts", which is for marketplaces) |
| Payload style | **Snapshot** | The message includes the full payment details, including our order number, which the code reads directly |
| Event | **`checkout.session.completed`** | "A checkout finished": the only event we need |
| Destination type | **Webhook endpoint** | Stripe sends a normal web request to a web address |
| Endpoint URL | `https://mayfield-consults-project-repo-production.up.railway.app/api/webhooks/stripe` | Our live server's webhook route |

After creating it, Stripe showed this destination's own **signing secret** (`whsec_...`).

```
   Member pays on Stripe's page
              │
              ▼
   ┌──────────────────┐   "checkout.session.completed"   ┌──────────────────────────────┐
   │      STRIPE      │ ───────────────────────────────▶ │           RAILWAY            │
   │  (card machine)  │   signed with the webhook secret │  POST /api/webhooks/stripe   │
   └──────────────────┘                                  │  1. checks the signature     │
              │                                          │  2. marks the order "paid"   │
              │ sends the member back                    └──────────────┬───────────────┘
              ▼                                                         │ UPDATE orders
   ┌──────────────────┐   "is order 12 paid yet?"        ┌──────────────▼───────────────┐
   │      VERCEL      │ ───────────────────────────────▶ │        NEON database         │
   │   success page   │ ◀─────────────── "paid" ──────── │    (through the Railway API) │
   └──────────────────┘                                  └──────────────────────────────┘
```

#### 8.6 Giving Railway the Stripe secrets

Railway doesn't have our `.env` file (it's never uploaded), so in **Railway → server → Variables** two new settings were added. Railway then redeployed:

| Name | Value |
|---|---|
| `STRIPE_SECRET_KEY` | The same `sk_test_...` key as in the laptop's `.env` |
| `STRIPE_WEBHOOK_SECRET` | The `whsec_...` from the **live webhook destination** (8.5) |

> **There are two different webhook secrets, and that's correct.** Each place Stripe sends messages to gets its own secret. The laptop's `.env` keeps the one from `stripe listen`, and Railway has the one from the dashboard webhook. If they were swapped, the signature check would fail and orders would never be marked paid.

Vercel needed **no changes**: the website already knew where the server was from Week 3.

#### 8.7 Everything in one place

| Where | Setting | Secret? |
|---|---|---|
| `server/.env` (laptop only) | `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (from `stripe listen`) | **Yes** |
| Railway → Variables | `DATABASE_URL`, `CLIENT_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (from the dashboard webhook) | **Yes** (except `CLIENT_URL`) |
| Vercel → Environment Variables | `VITE_API_URL` | No |
| Stripe sandbox → Webhooks | Destination pointing at Railway's `/api/webhooks/stripe`, event `checkout.session.completed` | – |

> **Housekeeping:** the test secret key was pasted into a chat during setup. It can only move fake money, but as good practice it should be **rolled** (Stripe → API keys → ⋯ → Roll key) before the assessment, and the new key updated in both `server/.env` and Railway.

---

### How it was tested

Everything was tested before going near real Stripe keys:

- **20 server checks:** checkout is blocked when signed out and with a fake wristband; an unknown plan is refused; the order saves the **database** price even when a fake price is sent; members can only see their own orders; webhooks with no signature, or the wrong secret, are rejected and the order stays `pending`; an "unpaid" message doesn't mark it paid; a properly signed "paid" message does.
- **17 website checks** against the real database: plans and prices load (R80, R450, R4 500); Join while signed out opens sign-in; the success page shows "Confirming..." and then **changes by itself** to "Payment successful" when the webhook arrives; it works on a phone-sized screen with no sideways scrolling; signed-out visitors can't see an order.
- **With the real Stripe key:** a real test checkout page was created from the laptop, and then from the live site.
- **On the live site, after setup:** the plans load from the database; checkout is blocked when signed out; when signed in, Stripe creates a payment page (so Railway has the key); the live webhook route is up and rejects a fake signature.
- All test accounts and orders were deleted afterwards.

**The assessment run** (start to finish, on the live site):
1. Open https://mayfield-consults-project-repo.vercel.app and **sign up**.
2. Click **Join Monthly**, and you land on Stripe's page showing R450.
3. Pay with `4242 4242 4242 4242`, any future date, any CVC.
4. Land on **"Payment successful!"** with **Status: Paid**.
5. To show the `orders` table: in **Neon → Tables → orders**, the new row has `status = paid`. In **Stripe → Webhooks → your destination**, the delivery shows as successful.

---

### The one-minute version (for the investor)

> "Members can now buy a membership straight from the website. They click Join, pay on Stripe's secure page, and land on a confirmation page. We never see their card details; Stripe handles that. Every purchase is recorded in our database against a real member account, and the price always comes from our own records, so it can't be tampered with. Most importantly, an order is only marked as paid when Stripe itself confirms the money arrived, through a signed message we can verify. So nobody can fake a payment by visiting the right web page."
