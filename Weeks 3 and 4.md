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

## Week 4

*To be added.*
