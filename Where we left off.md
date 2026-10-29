# Where We Left Off

A record of everything done on this project so far, and exactly where things stand right now.

> **Note:** no passwords or secret values are written here on purpose. The real database connection string only lives in `server/.env` (on your laptop) and in Railway's Variables page.

---

## Live links

| What | Link |
|---|---|
| Website (Vercel) | https://mayfield-consults-project-repo.vercel.app |
| API (Railway) | https://mayfield-consults-project-repo-production.up.railway.app |
| API test - programs | https://mayfield-consults-project-repo-production.up.railway.app/api/programs |
| API test - health | https://mayfield-consults-project-repo-production.up.railway.app/api/health |
| Database | Neon project `gorilla-pit` (AWS US East 2, Ohio) |

---

## Status right now

| Piece | Status |
|---|---|
| Neon database | ✅ Working. Tables `users`, `sessions`, `programs` created, 6 programs seeded |
| Railway API | ✅ Online, with `CLIENT_URL` picked up |
| `DATABASE_URL` on Railway | ✅ Set |
| `CLIENT_URL` on Railway | ✅ `https://mayfield-consults-project-repo.vercel.app` - the API now trusts the website |
| `VITE_API_URL` on Vercel | ✅ Fixed (set as **Config**, not Secret). The live site points at Railway |
| Live website | ✅ Working |

Railway had a platform-wide deploy pause on 28 Oct 2026. Once it ended, Railway redeployed with `CLIENT_URL` and the site started working.

**Live test (29 Oct 2026), all passed against the real API:**
- 6 programs returned
- Sign up → account created and logged in
- `/api/auth/me` with the token → still logged in (what a page refresh does)
- Log out → the token stops working
- Wrong password → "Wrong email or password."
- Log in again → works

The test account was deleted afterwards, so the database is clean (0 users, 0 sessions, 6 programs).

---

## What to do next

1. Open https://mayfield-consults-project-repo.vercel.app yourself and try it: sign up, refresh, sign out, sign in. Also check it on your phone.
2. Practise explaining `schema.sql`, `routes/auth.js` and the folder structure for the assessment (see **How it all works.md**, section 10).

---

## The story so far

### Part 1 - The static website
- Started as a plain HTML/CSS site (Mayfair Consultants), fixed up `index.html`, switched to double quotes, built the footer, media queries, contact page and product pages.
- The GitHub repo was renamed to **mayfield-consults-project-repo**.
- Rebranded to a fitness site, **The Gorilla Pit** - black / blue / purple colours with an animated background.
- Built a full 13-page site with `frontend.js` features and a JS guide, then swapped in your own images and `hero.mp4`.

### Part 2 - Week 2: React + Tailwind
- Rebuilt the site as a **single page** with **Vite + React** and **Tailwind**.
- Components: `Header`, `Hero`, `MainContent`, `Footer`, `ProgramGrid`, `ProgramCard`, `SessionStepper`.
- A `data.js` file for content, a `useState` category filter, a controlled stepper component, mobile-first classes, small commits, and no horizontal scroll.
- Merged into `main` and pushed.

### Part 3 - The backend (this assignment)
You asked for everything to stay **very basic, in the same coding style**, with a plain-English guide.

**Split into two folders:**
- `client/` - the React website
- `server/` - an Express API

**Database (Neon Postgres):**
- `server/schema.sql` creates three tables: `users`, `sessions`, `programs`.
- `server/seed.js` (`npm run seed`) creates the tables and fills in the 6 programs.

**API (Express):**
- `GET /api/health` - is the server running?
- `GET /api/programs` - all programs as JSON
- `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`

**Login system** - you chose simple **bcrypt + a sessions table** (instead of Better Auth):
- Passwords are scrambled with bcrypt before saving - the real password is never stored.
- Logging in creates a random token, saved in the `sessions` table for 7 days.
- The website keeps the token in `localStorage` and sends it as `Authorization: Bearer <token>`.
- Tokens were used instead of cookies because Vercel and Railway are on different domains.

**Frontend changes:**
- `client/src/api.js` - all calls to the API in one place.
- Programs now load from the API instead of `data.js`.
- A **Sign in / Sign up** pop-up (`AuthForm.jsx`), and the header shows "Hi, {name}" + **Sign out** when logged in.
- After a refresh, the site calls `/api/auth/me` to stay logged in.

**Secrets:**
- `.gitignore` ignores `.env`, `node_modules`, `dist` and `.vite`.
- `.env.example` files show which settings are needed, with fake values.

**Testing:** everything was tested locally first (14 API checks and 17 website checks passed), then against the real Neon database. A test user was created and deleted, so the database is clean (0 users, 0 sessions, 6 programs).

**Guides written:**
- `README.md` - how to run it and the API routes.
- `How it all works.md` - plain-English explanation of everything, including **section 9, "Live DB and Backend"** (Neon, Railway, Vercel and why `.gitignore` matters).

### Part 4 - Going live

**Neon (database)**
- Created project `gorilla-pit` in AWS US East 2 (Ohio), Postgres only, Better Auth off, skipped the agent prompt.
- Copied the connection string into `server/.env` and ran `npm run seed`.
- **Reset the database password**, because the first one had been shared outside `.env`. The new one is only in `server/.env` and Railway.

**Railway (API)**
- New project from the GitHub repo.
- First build failed (expected) → fixed by setting **Root Directory** to `/server`.
- Region set to **EU West** (US West builds were failing at the time).
- Added `DATABASE_URL` in Variables, generated a public domain.
- Hit `502 Bad Gateway` during Railway's outage → a redeploy fixed it. Health, programs and `/me` all checked and working.

**Vercel (website)**
- Imported the repo, **Root Directory** set to `client` (Vite detected automatically).
- Problem 1: the live site's code had the text `VITE_API_URL` instead of the Railway address. Cause: the variable was saved as **Secret** (Vercel won't give secrets with a `VITE_` prefix to the build) and had an extra line break. **Fix:** deleted it and re-added it as **Config** with the exact Railway address, then redeployed. Confirmed working.
- Problem 2: the API didn't trust the Vercel site (CORS). **Fix:** added `CLIENT_URL` on Railway - now just waiting for Railway's deploy pause to end.

**Tip learned:** always use the main link `mayfield-consults-project-repo.vercel.app`, not the per-build links like `...-oh9jex6ie.vercel.app` - Railway only trusts the main one.

---

## Settings summary

| Where | Name | Value | Secret? |
|---|---|---|---|
| `server/.env` (laptop only) | `DATABASE_URL` | Neon connection string | **Yes** |
| Railway → Variables | `DATABASE_URL` | Neon connection string | **Yes** |
| Railway → Variables | `CLIENT_URL` | `https://mayfield-consults-project-repo.vercel.app` | No |
| Vercel → Environment Variables (Config) | `VITE_API_URL` | `https://mayfield-consults-project-repo-production.up.railway.app` | No |

Railway settings: Root Directory `/server`, region EU West.
Vercel settings: Root Directory `client`, framework Vite.

---

## Rules to keep following
- **Never** commit `server/.env` - check with `git check-ignore -v server/.env`.
- **Never** put the database password in docs, commits or chat.
- **Never** put a secret in a `VITE_` variable - those end up in the browser.
- After changing a Vercel variable, **redeploy**. After changing a Railway variable, make sure Railway **redeploys** too.
