/* ==========================================================================
   SEED SCRIPT
   ==========================================================================
   Run with:  npm run seed

   1. Creates the tables from schema.sql (if they don't exist yet)
   2. Empties the programs and plans tables
   3. Fills them with the programs and plans below

   It never touches users, sessions or orders, so it's safe to run again.
   ========================================================================== */

import fs from "fs";
import db from "./db.js";

const programs = [
    {
        name: "Strength Training",
        category: "Strength",
        image: "/images/program_strength.jpeg",
        description: "Build real strength with coach-led barbell, dumbbell and kettlebell sessions.",
        duration: "60 min",
        intensity: "Medium – High",
    },
    {
        name: "HIIT & Conditioning",
        category: "Cardio",
        image: "/images/program_hiit.jpeg",
        description: "Fast, high-energy interval workouts that burn calories and build fitness.",
        duration: "45 min",
        intensity: "High",
    },
    {
        name: "Boxing",
        category: "Combat",
        image: "/images/program_boxing.jpeg",
        description: "Learn real boxing skills while getting fit, fast and focused.",
        duration: "60 min",
        intensity: "High",
    },
    {
        name: "Yoga & Mobility",
        category: "Mind & Body",
        image: "/images/program_yoga.jpg",
        description: "Improve flexibility, balance and recovery in a calm, welcoming class.",
        duration: "60 min",
        intensity: "Low – Medium",
    },
    {
        name: "Spin",
        category: "Cardio",
        image: "/images/program_spin.jpeg",
        description: "Ride to the beat in our high-energy indoor cycling studio.",
        duration: "45 min",
        intensity: "Medium – High",
    },
    {
        name: "Personal Training",
        category: "Strength",
        image: "/images/program_personal.webp",
        description: "One-on-one coaching with a plan built entirely around you.",
        duration: "60 min",
        intensity: "Tailored to you",
    },
];

// Prices are in cents: R80 = 8000
const plans = [
    {
        name: "Day Pass",
        price: 8000,
        period: "per day",
        featured: false,
        perks: ["Full gym floor access", "Changing rooms & lockers", "One group class"],
    },
    {
        name: "Monthly",
        price: 45000,
        period: "per month",
        featured: true,
        perks: ["Unlimited gym access", "All group classes", "Free fitness assessment", "Bring a friend once a month"],
    },
    {
        name: "Annual",
        price: 450000,
        period: "per year",
        featured: false,
        perks: ["Everything in Monthly", "Two months free", "Two personal training sessions", "Four guest passes"],
    },
];

async function seed() {

    // 1. Create the tables
    const schema = fs.readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
    await db.query(schema);
    console.log("Tables ready");

    // 2. Empty the programs table and restart its ids at 1
    await db.query("TRUNCATE programs RESTART IDENTITY");

    // 3. Add each program
    for (const program of programs) {
        await db.query(
            `INSERT INTO programs (name, category, image, description, duration, intensity)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [program.name, program.category, program.image, program.description, program.duration, program.intensity]
        );
    }

    console.log(`Added ${programs.length} programs`);

    // 4. Same again for the membership plans
    await db.query("TRUNCATE plans RESTART IDENTITY");

    for (const plan of plans) {
        await db.query(
            `INSERT INTO plans (name, price, period, featured, perks)
             VALUES ($1, $2, $3, $4, $5)`,
            [plan.name, plan.price, plan.period, plan.featured, plan.perks]
        );
    }

    console.log(`Added ${plans.length} plans`);

    // Close the connection so the script can finish
    await db.end();
}

seed();
