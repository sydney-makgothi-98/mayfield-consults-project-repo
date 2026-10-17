# The Gorilla Pit

A simple, responsive website for The Gorilla Pit, a fictional gym. It is built with plain HTML and CSS, with no frameworks or build tools.

## Pages

| Page | What's on it |
|---|---|
| `index.html` | Home: hero, intro, stats, why us, popular programs, testimonials, membership preview |
| `about.html` | Our story, values and facilities |
| `programs.html` | All six programs |
| `program_*.html` | One page per program: strength, HIIT, boxing, yoga, spin, personal training |
| `timetable.html` | Weekly class schedule |
| `trainers.html` | The coaching team |
| `membership.html` | Plans, add-ons and FAQ |
| `contact.html` | Contact form, address and opening hours |

## Project structure

```
├── index.html
├── about.html
├── programs.html
├── program_strength.html   (and five more program pages)
├── timetable.html
├── trainers.html
├── membership.html
├── contact.html
├── images/                 # All site photos (see below)
└── styles/
    ├── styles.css          # All site styles, including media queries
    └── frontend.js         # Interactive features (see "How and why the JS works.md")
```

## Images

All photos and the hero video live in `images/`. Each file name matches where it's used, such as `program_boxing.jpeg` or `trainer_3.avif`. To swap a photo, replace the file and update its `src` in the HTML if the extension changes.

- `hero.mp4`: the looping background video on the Home page
- `about.jpeg`: the Our Story photo on the About page
- `facility_*`: the four facility photos on the About page
- `program_*`: the program cards and program page covers
- `trainer_1` to `trainer_6`: the trainer portraits, in the order they appear on the Trainers page

## Running locally

No build step or install is needed. Open `index.html` in your browser.

## Notes

- The contact form doesn't send messages yet. It needs a form service such as Formspree or Netlify Forms.
- The contact details, prices, trainers and testimonials are placeholders.
