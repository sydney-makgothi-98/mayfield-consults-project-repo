# The Gorilla Pit

A responsive website for The Gorilla Pit, a fictional gym, built with **React**, **Vite** and **Tailwind CSS**.

## Running it

```
npm install
npm run dev
```

Then open the link Vite prints (usually http://localhost:5173).

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server with live reload |
| `npm run build` | Builds the finished site into `dist/` |
| `npm run preview` | Serves the built site locally to check it |

## Project structure

```
├── index.html                  # Page shell, React renders into #root
├── public/
│   └── images/                 # Photos and the hero video
└── src/
    ├── main.jsx                # Starts React
    ├── App.jsx                 # Puts the page together
    ├── index.css               # Tailwind import + theme colours
    ├── data.js                 # All the lists: programs, trainers, plans...
    └── components/
        ├── Header.jsx          # Logo, nav links, mobile menu
        ├── Hero.jsx            # Video background and headline
        ├── MainContent.jsx     # About, stats, why us, trainers, membership
        ├── ProgramGrid.jsx     # Program cards + category filter
        ├── ProgramCard.jsx     # One program card
        ├── SessionStepper.jsx  # The − / + sessions-per-week control
        └── Footer.jsx          # Contact, hours, links
```

## How it works

- **Data file:** every list on the site lives in `src/data.js` as an array of objects, and the components use `.map()` to turn each object into a card. To add a program, trainer or plan, add an object to the array.
- **Filter:** `ProgramGrid` keeps the selected category in `useState`. The filter buttons are built from the categories in the data, so adding a new category adds a new button.
- **SessionStepper:** a controlled component, the same pattern as `QuantityStepper`. It receives `value` and `onChange` as props and has no state of its own. `ProgramGrid` holds every card's sessions in one state object, which is how it shows the weekly total, and why the numbers survive switching filters.
- **Tailwind:** the theme colours (`primary`, `accent`, `accent-2`, `muted`, `lavender`) and the animated background are defined in `@theme` in `src/index.css`, so they work as normal classes like `text-accent`.
- **Mobile-first:** unprefixed classes are for phones, and `sm:`, `md:` and `lg:` add changes for bigger screens. For example, `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.

## Notes

- Contact details, prices, trainers and the address are placeholders.
