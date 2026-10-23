/* ==========================================================================
   SITE DATA
   ==========================================================================
   The smaller lists on the site live here. The components loop over
   these arrays, so to add a trainer or plan, just add an object.

   The programs used to live here too. They now live in the database
   (see server/seed.js) and come from the API instead.
   ========================================================================== */


/* ==========================================================================
   STATS
   ========================================================================== */

export const stats = [
    { id: 1, number: "1 200+", label: "Active Members" },
    { id: 2, number: "6", label: "Expert Coaches" },
    { id: 3, number: "25+", label: "Weekly Classes" },
    { id: 4, number: "7", label: "Days a Week" },
];


/* ==========================================================================
   WHY US
   ========================================================================== */

export const features = [
    {
        id: 1,
        title: "Expert Coaches",
        text: "Every coach is fully certified and ready to help you with form, technique and building a plan that works.",
    },
    {
        id: 2,
        title: "Modern Equipment",
        text: "Train with the latest free weights, racks and cardio machines, all kept clean and well maintained.",
    },
    {
        id: 3,
        title: "Flexible Classes",
        text: "Over 25 classes a week, from sunrise to late evening, so you never have to miss a workout.",
    },
    {
        id: 4,
        title: "Open Early & Late",
        text: "Doors open at 5am on weekdays and stay open until 10pm, so training fits around your life.",
    },
    {
        id: 5,
        title: "Free Fitness Assessment",
        text: "Every new member gets a free assessment and a starter plan, so you know exactly where to begin.",
    },
    {
        id: 6,
        title: "A Real Community",
        text: "No egos, no judgement. Just people supporting each other to get stronger every week.",
    },
];


/* ==========================================================================
   TRAINERS
   ========================================================================== */

export const trainers = [
    {
        id: 1,
        name: "Thabo Mokoena",
        role: "Head Coach & Strength",
        image: "/images/trainer_1.jpeg",
        bio: "Thabo has coached strength athletes for over 10 years and loves helping beginners lift their first heavy barbell.",
    },
    {
        id: 2,
        name: "Lerato Dlamini",
        role: "HIIT & Conditioning",
        image: "/images/trainer_2.avif",
        bio: "Lerato's high-energy classes are famous for their music and for leaving everyone smiling, even when they're exhausted.",
    },
    {
        id: 3,
        name: "Sipho Ndlovu",
        role: "Boxing Coach",
        image: "/images/trainer_3.avif",
        bio: "A former amateur champion, Sipho teaches boxing technique that is clean, safe and seriously fun.",
    },
    {
        id: 4,
        name: "Ayesha Patel",
        role: "Yoga & Mobility",
        image: "/images/trainer_4.webp",
        bio: "Ayesha blends yoga and mobility work to help members move better, recover faster and feel calmer.",
    },
    {
        id: 5,
        name: "Jason van Wyk",
        role: "Spin Instructor",
        image: "/images/trainer_5.jpeg",
        bio: "Jason is a competitive cyclist whose spin playlists are the best-kept secret in the Pit.",
    },
    {
        id: 6,
        name: "Naledi Khumalo",
        role: "Personal Trainer & Nutrition",
        image: "/images/trainer_6.jpeg",
        bio: "Naledi combines training and nutrition coaching to help clients make changes that actually last.",
    },
];


/* ==========================================================================
   MEMBERSHIP PLANS
   ========================================================================== */

export const plans = [
    {
        id: 1,
        name: "Day Pass",
        price: "R80",
        period: "per day",
        featured: false,
        perks: ["Full gym floor access", "Changing rooms & lockers", "One group class"],
    },
    {
        id: 2,
        name: "Monthly",
        price: "R450",
        period: "per month",
        featured: true,
        perks: ["Unlimited gym access", "All group classes", "Free fitness assessment", "Bring a friend once a month"],
    },
    {
        id: 3,
        name: "Annual",
        price: "R4 500",
        period: "per year",
        featured: false,
        perks: ["Everything in Monthly", "Two months free", "Two personal training sessions", "Four guest passes"],
    },
];
