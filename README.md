# The Gorilla Pit

A website for The Gorilla Pit, a fictional gym, with a real backend: programs are stored in a Postgres database, and members can sign up, log in and log out.

**Full explanation:** see [How it all works.md](How%20it%20all%20works.md).

## The three parts

| Part | Folder | Built with | Lives on |
|---|---|---|---|
| Frontend | `client/` | React, Vite, Tailwind CSS | Vercel |
| Backend API | `server/` | Node.js, Express | Railway |
| Database | – | Postgres | Neon |

## Running it locally

1. Copy `server/.env.example` to `server/.env` and add your Neon `DATABASE_URL`.
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
4. Open http://localhost:5173

## API routes

| Method | Route | Does |
|---|---|---|
| GET | `/api/programs` | All programs from the database |
| POST | `/api/auth/signup` | Create an account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Who is logged in |
| POST | `/api/auth/logout` | Log out |
