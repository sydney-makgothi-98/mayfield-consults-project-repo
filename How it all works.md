# How It All Works

This guide explains how The Gorilla Pit app is built, in plain English: what each part does, where it lives, and why it was done that way.

---

## 1. The big picture

The app has **three parts**, and each one lives on a different service on the internet:

```
   Your browser
        │
        ▼
┌─────────────────┐     asks for data     ┌──────────────────┐     reads/writes     ┌──────────────────┐
│    FRONTEND     │ ───────────────────▶  │     BACKEND      │ ──────────────────▶  │     DATABASE     │
│  React website  │ ◀───────────────────  │   Express API    │ ◀──────────────────  │     Postgres     │
│  (on Vercel)    │     sends back JSON   │   (on Railway)   │     sends back rows  │     (on Neon)    │
└─────────────────┘                       └──────────────────┘                      └──────────────────┘
     client/                                   server/
```

- **Frontend (`client/`)**: the website people see and click on. It's built with React and Tailwind.
- **Backend (`server/`)**: a small program that sits between the website and the database. The website asks it questions like "give me the programs" or "log this person in", and it answers.
- **Database (Neon)**: where the information is actually stored: the programs, the users and who's logged in.

**Why not let the website talk to the database directly?** The database password would have to be inside the website's code, and anyone can read a website's code in their browser. Keeping the database behind the backend means the password stays secret on the server.

---

## 2. Folder structure

```
Mayfair Consultants/
│
├── client/                     ← THE FRONTEND (React website)
│   ├── index.html              The page shell. React fills in <div id="root">
│   ├── public/images/          Photos and the hero video
│   ├── .env.example            Example settings (safe to share)
│   └── src/
│       ├── main.jsx            Starts React
│       ├── App.jsx             Puts the page together, and remembers who's logged in
│       ├── api.js              Every call to the backend goes through here
│       ├── data.js             Small lists that don't need a database (trainers, plans...)
│       ├── index.css           Tailwind + the site colours
│       └── components/
│           ├── Header.jsx      Logo, links, menu, Sign in / Sign out button
│           ├── Hero.jsx        Video and headline
│           ├── MainContent.jsx About, stats, trainers, membership
│           ├── ProgramGrid.jsx Loads programs from the API, plus the filter
│           ├── ProgramCard.jsx One program card
│           ├── SessionStepper.jsx  The − / + control
│           ├── AuthForm.jsx    The sign in / sign up pop-up
│           └── Footer.jsx      Contact, hours, links
│
├── server/                     ← THE BACKEND (Express API)
│   ├── index.js                Starts the server and connects URLs to routes
│   ├── db.js                   Connects to the database
│   ├── schema.sql              Describes the database tables
│   ├── seed.js                 Fills the database with the programs
│   ├── .env.example            Example secrets file (no real secrets in it)
│   └── routes/
│       ├── programs.js         GET /api/programs
│       └── auth.js             Sign up, log in, who am I, log out
│
├── .gitignore                  Files git must never upload (including .env)
├── README.md                   Short project summary
└── How it all works.md         This guide
```

**Why split into `client/` and `server/`?** They're two separate programs that run in two separate places, Vercel and Railway. Each folder has its own `package.json` and its own packages, so each service only has to install and run what it needs.

---

## 3. The database

### What it is

**Postgres** is a database: it stores information in **tables**, like spreadsheets with columns and rows. **Neon** is a free service that runs a Postgres database on the internet for us.

### The schema (the tables), in plain English

The tables are described in `server/schema.sql`.

**`users`**: one row for every person who signs up.

| Column | What it holds |
|---|---|
| `id` | A number that's unique to each user (1, 2, 3...). Postgres picks it automatically. |
| `name` | The person's name |
| `email` | Their email. **`UNIQUE`** means two accounts can't share an email. |
| `password_hash` | A scrambled version of their password. **The real password is never stored.** |
| `created_at` | When they signed up (filled in automatically) |

**`sessions`**: one row every time someone logs in. This is how the app remembers who's logged in.

| Column | What it holds |
|---|---|
| `token` | A long random code, like a ticket that proves you're logged in |
| `user_id` | Which user the ticket belongs to (points at `users.id`) |
| `expires_at` | When the ticket stops working (7 days after logging in) |

**`programs`**: the gym's programs shown in the main grid.

| Column | What it holds |
|---|---|
| `id` | Unique number for each program |
| `name`, `category`, `image`, `description`, `duration`, `intensity` | The details shown on each card |

### How the tables connect

```
users                    sessions
┌────┬───────────┐       ┌──────────┬─────────┐
│ id │ name      │       │ token    │ user_id │
├────┼───────────┤       ├──────────┼─────────┤
│ 1  │ Ayanda    │ ◀──── │ a91f...  │ 1       │
│ 2  │ Thabo     │ ◀──── │ 7c2e...  │ 2       │
└────┴───────────┘   └── │ e04b...  │ 2       │  ← Thabo is logged in on two devices
                         └──────────┴─────────┘
```

One user can have many sessions, for example a phone and a laptop. `REFERENCES users(id)` makes sure a session can only point at a user who really exists. `ON DELETE CASCADE` means that if a user is deleted, their sessions are deleted too.

`programs` doesn't connect to anything. It's just a list.

### The seed script (`server/seed.js`)

In Week 2 the programs were typed straight into `data.js` (hardcoded). Now they live in the database. The seed script moves them there:

1. It runs `schema.sql` to create the tables. `IF NOT EXISTS` makes this safe to run again.
2. It empties the `programs` table.
3. It adds the 6 programs.

You run it with `npm run seed`. It never touches `users` or `sessions`, so it's safe to run again without deleting anyone's account.

**Why do the trainers and plans still live in `data.js`?** The brief asks for your product/items data in the database, which here means the programs. Trainers and plans never change and nothing searches them, so a database would add work without adding anything useful.

---

## 4. Secrets and the `.env` file

The database address includes a **password**. If it ended up on GitHub, anyone could read, change or delete all your data.

So secrets live in a file called **`.env`**, which:
- sits in `server/` on your computer only;
- is listed in `.gitignore`, so **git refuses to upload it**;
- is read by the server when it starts (`import "dotenv/config"`), which turns each line into a `process.env.SOMETHING` value.

There's also a **`.env.example`** file, which **is** uploaded. It shows what settings are needed, without the real values, so anyone setting up the project knows what to fill in.

**On Railway and Vercel** there's no `.env` file. You type the same values into their **Variables** settings page instead.

**How to prove `.env` is excluded** (useful at assessment):

```
git check-ignore -v server/.env
```

If it prints `.gitignore:6:.env  server/.env`, git is ignoring it. You can also look on GitHub: there's no `.env` file anywhere in the repo.

> `client/.env.example` has `VITE_API_URL`. That one isn't a secret, because it's just the backend's public web address. It's an env variable so the same code can point at `localhost` on your computer and at Railway when live.

---

## 5. The API (the backend)

### What an API is

An **API** is a set of web addresses (**routes**) that send back **data** instead of web pages. The data is in **JSON**, a text format that JavaScript can read easily.

### The routes

| Method | Route | What it does | Login needed? |
|---|---|---|---|
| GET | `/api/health` | Says `{"status":"ok"}`. A quick "is the server on?" check. | No |
| GET | `/api/programs` | Sends back every program from the database | No |
| POST | `/api/auth/signup` | Creates an account and logs you in | No |
| POST | `/api/auth/login` | Logs you in | No |
| GET | `/api/auth/me` | Tells you who's logged in | Yes (token) |
| POST | `/api/auth/logout` | Logs you out | Yes (token) |

**GET** means "give me something". **POST** means "here's some information, do something with it".

### What happens when the site loads the programs

1. `ProgramGrid.jsx` runs `getPrograms()` from `api.js`.
2. `api.js` sends a request to `https://your-railway-url/api/programs`.
3. In `server/index.js`, `app.use("/api/programs", programsRoutes)` sends the request to `routes/programs.js`.
4. `routes/programs.js` asks the database: `SELECT * FROM programs ORDER BY id`.
5. The database returns the rows, and the route sends them back as JSON with `res.json(...)`.
6. React saves them with `setPrograms(data)`, and the cards appear.

### `index.js`: the server's front door

- `express()` creates the server.
- `cors(...)` sets which websites may use the API (see below).
- `express.json()` lets the server read JSON that's sent to it, such as login details.
- `app.use("/api/...", ...)` connects each group of URLs to its route file.
- `app.listen(PORT)` starts listening. Railway tells us which `PORT` to use, and on your computer it's 3000.

### CORS: why the server has a list of allowed websites

Browsers have a safety rule: a website can only read data from **another** web address if that address says it's allowed. Our website (Vercel) and our API (Railway) have different addresses, so the API has to say "Vercel is allowed". That's CORS.

```js
const allowedSites = ["http://localhost:5173"];   // your computer
allowedSites.push(process.env.CLIENT_URL);         // your live Vercel site
```

Any other website trying to use the API gets blocked by the browser.

### `try` / `catch` in every route

If the database is unreachable or something breaks, the `catch` block sends back a friendly error (`{ error: "..." }`) with a **500** status, instead of the server crashing.

### Status codes used

| Code | Meaning | Example |
|---|---|---|
| 200 | OK | Programs loaded |
| 201 | Created | Account created |
| 400 | Bad request | Password too short |
| 401 | Not logged in / wrong details | Wrong password |
| 409 | Conflict | Email already used |
| 500 | Server error | Database unreachable |

---

## 6. Login and sessions, step by step

### Signing up

1. The person fills in the form in `AuthForm.jsx`, and `api.js` sends name, email and password to `POST /api/auth/signup`.
2. The server checks everything's filled in and the password is at least 6 characters.
3. It checks the email isn't already used.
4. It **hashes** the password with **bcrypt**: `bcrypt.hash(password, 10)`.
5. It saves the user with the hash, never the real password.
6. It creates a **session** (see below) and sends back `{ token, user }`.

### What "hashing" means, and why

Hashing scrambles a password into something like `$2a$10$Xk9...`, and it **can't be turned back**. When someone logs in, bcrypt hashes what they typed and checks whether it matches the saved hash.

**Why?** If the database were ever leaked, nobody could read the passwords. That matters because people reuse passwords on other sites. The `10` controls how slow the hashing is, which makes guessing millions of passwords impractical.

### Logging in

1. The email and password go to `POST /api/auth/login`.
2. The server finds the user by email and runs `bcrypt.compare(password, user.password_hash)`.
3. If it matches, the server creates a session. If it doesn't, it replies "Wrong email or password."

> The same message is used for a wrong email **and** a wrong password. That way, nobody can use the login form to find out which emails have accounts.

### Sessions: how the app remembers you

```js
const token = crypto.randomBytes(32).toString("hex");
```

1. The server makes a **token**: 64 random characters, impossible to guess.
2. It saves the token, the user's id and an expiry date (7 days away) in the **sessions** table.
3. It sends the token to the browser.
4. The browser saves it in **localStorage**, a small storage area that survives refreshes and closing the tab.
5. From then on, every request includes the header `Authorization: Bearer <token>`.

### Staying logged in after a refresh

A refresh wipes all of React's state, so `user` goes back to `null`. To fix that, when the page loads, `App.jsx` does this:

```js
useEffect(() => {
    if (getToken()) {
        getMe()
            .then((data) => setUser(data.user))
            .catch(() => removeToken());
    }
}, []);
```

That means: if there's a saved token, ask the server who it belongs to. The server looks the token up in `sessions`, only if it hasn't expired, and joins it to `users`. The user comes back and the header shows **Sign out** again. If the token has expired or been logged out, it's thrown away.

### Signing out

1. `POST /api/auth/logout` **deletes the session row**, so the token stops working everywhere, not just on this device.
2. The browser removes the token from localStorage.
3. `user` goes back to `null`, and the header shows **Sign in**.

### Why a token in a header, and not a cookie?

Cookies are the other common way to remember logins. But our website (on `vercel.app`) and our API (on `railway.app`) are on **different domains**, and browsers increasingly block cookies between different domains. A token sent in a header works the same everywhere, and it's easier to see and explain.

---

## 7. The frontend changes

| File | What changed |
|---|---|
| `api.js` | **New.** Holds the backend's address, saves and removes the token, and has one function per API route. Components never call `fetch` themselves. |
| `ProgramGrid.jsx` | Loads programs with `useEffect` + `getPrograms()` instead of importing them from `data.js`. Shows "Loading programs..." and an error message if the API can't be reached. The filter and stepper work exactly as before. |
| `App.jsx` | Keeps `user` (who's logged in) and `showAuth` (is the pop-up open?) in state, and checks `/api/auth/me` when the page loads. |
| `Header.jsx` | Shows **Sign in** when `user` is `null`, and **Hi, Name + Sign out** when someone is logged in. |
| `AuthForm.jsx` | **New.** One pop-up form that does both sign in and sign up, switched with a `mode` state. |
| `data.js` | The programs were removed, because they live in the database now. |

**Why `useEffect` with `[]`?** The empty `[]` means "run this once, when the component first appears". Without it, the data would be fetched again every time the component redraws.

---

## 8. Running it on your computer

You need **two terminals**, one for each part.

**First time only:**

1. Create `server/.env` by copying `server/.env.example`, then paste your Neon connection string into `DATABASE_URL`.
2. Install and seed:
   ```
   cd server
   npm install
   npm run seed
   ```
3. ```
   cd client
   npm install
   ```

**Every time:**

| Terminal 1 (backend) | Terminal 2 (frontend) |
|---|---|
| `cd server` | `cd client` |
| `npm run dev` | `npm run dev` |
| Runs at http://localhost:3000 | Open http://localhost:5173 |

`npm run dev` on the server uses `node --watch`, which restarts the server automatically when you save a change.

---

## 9. Putting it live

Everything gets deployed **from GitHub**. Each service watches your repo and redeploys whenever you push.

### Step 1: Neon (database)

1. Sign up at **neon.tech**, and create a project (the free plan is fine).
2. Click **Connect** and copy the connection string, which starts with `postgresql://`.
3. Paste it into `server/.env` as `DATABASE_URL=...`
4. In `server/`, run `npm run seed`. You should see "Tables ready" and "Added 6 programs".

### Step 2: Railway (backend)

1. Sign up at **railway.com** with GitHub, then click **New Project → Deploy from GitHub repo** and pick your repo.
2. Open the service, go to **Settings → Root Directory**, and set it to `/server`.
3. Go to **Variables**, and add `DATABASE_URL` with the same Neon string.
4. Go to **Settings → Networking → Generate Domain**. You'll get a link like `https://something.up.railway.app`.
5. Test it by visiting `https://something.up.railway.app/api/programs`. You should see the programs as JSON.

Railway sees `package.json`, runs `npm install`, then runs `npm start`, which is `node index.js`.

### Step 3: Vercel (frontend)

1. Sign up at **vercel.com** with GitHub, then click **Add New → Project** and import your repo.
2. Set **Root Directory** to `client`. Vercel detects Vite by itself.
3. Under **Environment Variables**, add `VITE_API_URL` with your Railway link, **without** a slash at the end.
4. Click **Deploy**. You'll get a link like `https://the-gorilla-pit.vercel.app`.

### Step 4: Let the website talk to the API

1. Back in **Railway → Variables**, add `CLIENT_URL` with your Vercel link, **without** a slash at the end.
2. Railway redeploys. Open your Vercel link, and the programs should load and sign up should work.

### Settings summary

| Where | Name | Value |
|---|---|---|
| `server/.env` (your computer) | `DATABASE_URL` | Neon connection string |
| Railway | `DATABASE_URL` | Neon connection string |
| Railway | `CLIENT_URL` | Your Vercel link |
| Vercel | `VITE_API_URL` | Your Railway link |

> **If the live site says "Could not load programs":** the usual cause is a `CLIENT_URL` or `VITE_API_URL` that doesn't match exactly. Check there's no slash at the end, and that it starts with `https://`. Also note that Vite bakes `VITE_API_URL` in when it builds, so after changing it in Vercel, **redeploy**.

---

## 10. Assessment checklist

| Requirement | Where to show it |
|---|---|
| Working API, live, reading from Postgres | Visit `https://<railway-link>/api/programs`, then show `routes/programs.js` and `db.js` |
| Schema you can explain | `server/schema.sql` and section 3 of this guide |
| Live URL where the whole app works | Your Vercel link: the programs load, and sign up and sign in work |
| Real sign up / login, survives a refresh | Sign up, refresh, and you're still signed in. Explain `/api/auth/me` (section 6) |
| `.env` excluded from git | `git check-ignore -v server/.env`, `.gitignore`, and no `.env` on GitHub |

---

## 11. Words used in this guide

| Word | Meaning |
|---|---|
| **API** | Web addresses that send back data instead of pages |
| **Route** | One of those addresses, such as `/api/programs` |
| **JSON** | The text format the data is sent in: `{ "name": "Boxing" }` |
| **Express** | The Node.js package used to build the API |
| **Postgres** | The database |
| **Neon** | The service that runs our Postgres database online |
| **Schema** | The plan of the tables and their columns |
| **Seed** | Filling the database with starting data |
| **Hash** | A one-way scramble of a password |
| **bcrypt** | The package that does the hashing |
| **Session** | A record that someone is logged in |
| **Token** | The random code that proves which session is yours |
| **localStorage** | Storage in the browser that survives a refresh |
| **CORS** | The browser rule about which websites may read an API |
| **Environment variable** | A setting kept outside the code, such as `DATABASE_URL` |
| **Deploy** | Putting the app on the internet |
