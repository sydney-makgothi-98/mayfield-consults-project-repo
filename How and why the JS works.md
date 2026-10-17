# How and Why the JS Works

This guide explains all of the JavaScript in `styles/frontend.js`: what each feature does, how the code works, and why it's written the way it is.

---

## The big picture

### How the file is loaded

Every page loads the script near the top of the `<body>`:

```html
<script src="styles/frontend.js" defer></script>
```

`defer` tells the browser to download the script straight away, but wait until the whole page has been read before running it. That matters, because the JavaScript looks for elements like `.nav` and `.timetable`. If it ran too early, those elements wouldn't exist yet.

> **Why not `async defer`?** The tag used to say `async defer`. When both are present, `async` wins, and `async` runs the script the moment it downloads. That could be before the page has finished loading, so it was changed to just `defer`.

### How the file is organised

The file follows the same layout as `styles.css`: numbered sections with a banner comment, and one feature per section.

```
1.  Mobile menu
2.  Nav shadow on scroll
3.  Scroll reveal animations
4.  Animated stat counters
5.  Timetable: today highlight & filters
6.  FAQ: one answer open at a time
7.  Contact form validation
8.  Open / closed badge
9.  Back to top button
10. Automatic copyright year
11. Hero video
    Start everything
```

Each feature is a **function** named `setupSomething()`. At the bottom of the file, they're all called at once:

```js
document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenu();
    setupNavScroll();
    ...
});
```

`DOMContentLoaded` is an event the browser fires when the HTML has finished loading. Wrapping everything in it is a safety net on top of `defer`.

### The "guard clause" pattern

Every page shares the same JavaScript file, but not every page has every feature. Only the Timetable page has a timetable, for example. So most functions start like this:

```js
const table = document.querySelector(".timetable");

if (!table) {
    return;
}
```

If the element isn't on the current page, `querySelector` gives back `null`, `!table` is true, and `return` stops the function. Nothing breaks, and the next feature runs as normal.

### Progressive enhancement

Several elements are **created by JavaScript** instead of being written in the HTML: the menu button, the timetable filters, the back-to-top button and the open/closed badges. The reason is that if JavaScript ever fails to load, visitors still get a fully working site. All the links show, the whole timetable shows, and nobody sees a button that does nothing. JavaScript only adds improvements on top. This approach is called **progressive enhancement**.

The same idea applies to the animations. Elements are only hidden (ready to fade in) once JavaScript has run. If it never runs, everything is simply visible.

---

## The building blocks

These few tools do almost all the work in the file.

| Tool | What it does | Example |
|---|---|---|
| `document.querySelector(".x")` | Finds the **first** element matching a CSS selector | `document.querySelector(".nav")` |
| `document.querySelectorAll(".x")` | Finds **all** matching elements, as a list | `document.querySelectorAll(".faq_item")` |
| `element.classList.add/remove/toggle` | Adds or removes a CSS class. **This is how JavaScript and CSS work together**: JS switches classes, and CSS decides how each class looks. | `nav.classList.add("nav_open")` |
| `element.addEventListener("click", fn)` | Runs a function when something happens (a click, a scroll, a key press) | `button.addEventListener("click", ...)` |
| `document.createElement("button")` | Makes a brand-new element, which you then add to the page | `nav.insertBefore(menuButton, navList)` |
| `element.setAttribute("name", value)` | Sets an HTML attribute | `button.setAttribute("aria-expanded", "true")` |

The pattern you'll see repeatedly: **JavaScript decides when something changes, and CSS decides what it looks like.** For example, the JS never sets a colour or a size. It just adds `nav_scrolled` or `filter_active`, and section 14 of `styles.css` handles the look.

---

## The features, one by one

### 1. Mobile menu

**What it does:** on screens 900px wide or narrower, the seven nav links are hidden behind a **Menu** button. Tap it to open the links and tap **Close** to hide them. The Escape key also closes the menu.

**How it works:**

1. It creates a `<button>`, puts it in the nav, and adds the class `nav_has_toggle` to the nav.
2. The CSS (in a 900px media query) hides `.nav_list` **only if** the nav has `nav_has_toggle`. That class is only there when JavaScript has run, so without JS the links are never hidden.
3. Clicking the button toggles the class `nav_open`, and CSS shows the list when that class is present:

```js
const isOpen = nav.classList.toggle("nav_open");
```

`classList.toggle` adds the class if it's missing, removes it if it's there, and returns `true` or `false` to tell you which happened. That one value then updates the button text:

```js
menuButton.textContent = isOpen ? "Close" : "Menu";
```

The `? :` is a short if/else: "if `isOpen`, use 'Close', otherwise use 'Menu'".

**Why the `aria-` attributes?** `aria-expanded` tells screen readers whether the menu is open, and `aria-controls` tells them which element the button controls. Sighted users see the change, and these attributes make sure blind users "hear" it too.

---

### 2. Nav shadow on scroll

**What it does:** once you scroll down more than 50px, the nav bar becomes darker and gets a soft shadow, so it stands out from the content scrolling under it.

**How it works:**

```js
function updateNav() {
    nav.classList.toggle("nav_scrolled", window.scrollY > 50);
}

window.addEventListener("scroll", updateNav, { passive: true });
updateNav();
```

- `window.scrollY` is how many pixels the page has been scrolled.
- Here `classList.toggle` gets a second argument. When that argument is true, the class is added, and when it's false, the class is removed.
- `{ passive: true }` promises the browser this code will never block scrolling, which keeps scrolling smooth on phones.
- `updateNav()` is also called once straight away, in case the page opens already scrolled (for example after a refresh).

---

### 3. Scroll reveal animations

**What it does:** section titles, cards, stats and other blocks fade in and slide up as they scroll into view. Cards in the same row appear one after another.

**How it works:**

1. It finds all the elements that should animate, adds the class `reveal` to each (which CSS sets to invisible and 30px lower), and starts watching them.
2. It watches them with an **IntersectionObserver**: a built-in browser tool that tells you when an element enters the screen. It's much more efficient than checking positions on every scroll.

```js
const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
```

- `threshold: 0.15` means "tell me when 15% of the element is visible".
- Adding `revealed` makes CSS fade the element in (`opacity: 1`, `transform: none`).
- `unobserve` stops watching it, so each element only animates once.

3. **The stagger effect:** each element gets a small delay based on its position in its row:

```js
const position = Array.from(element.parentElement.children).indexOf(element);
element.style.transitionDelay = (position % 4) * 0.1 + "s";
```

The first card waits 0s, the second 0.1s, the third 0.2s, and so on. `% 4` (the remainder after dividing by 4) makes the pattern restart every four cards, so the tenth card doesn't wait a whole second.

4. **Cleaning up:** once the fade-in finishes (the `transitionend` event), the `reveal` classes and the delay are removed. Without this, the cards' hover effects would be slowed down by the reveal's transition settings.

**Why the reduced-motion check?** Some people get dizzy or unwell from movement on screen, and turn on "reduce motion" in their device settings. This line reads that setting, and if it's on, the function stops and everything simply shows:

```js
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

---

### 4. Animated stat counters (Home page)

**What it does:** when the stats row scrolls into view, the numbers count up from 0, for example 0 → 1 200+.

**How it works:**

1. It reads the number from the HTML and splits it into the number and the extra text:

```js
const originalText = element.textContent;                    // "1 200+"
const target = parseInt(originalText.replace(/\D/g, ""), 10); // 1200
const suffix = originalText.replace(/[\d\s]/g, "");           // "+"
```

These use **regular expressions**, which are patterns for matching text. `/\D/g` means "every character that isn't a digit", so removing them leaves `1200`. `/[\d\s]/g` means "every digit or space", so removing those leaves `+`.

2. It animates using `requestAnimationFrame`, which asks the browser to run a function just before it next draws the screen, about 60 times per second:

```js
function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    element.textContent = formatNumber(Math.round(target * eased)) + suffix;

    if (progress < 1) {
        requestAnimationFrame(update);
    }
}
```

- `progress` goes from 0 to 1 over 1.5 seconds.
- `eased` is an **easing curve**: it makes the count start fast and slow down at the end, which feels more natural than a steady speed.
- The function calls itself again until `progress` reaches 1.

3. `formatNumber` puts the space back in, so 1200 shows as "1 200".

**Why read the numbers from the HTML?** You can change the stats in `index.html` (for example to "1 500+") and the animation adapts automatically, with no JavaScript changes needed.

---

### 5. Timetable: today highlight and class filters (Timetable page)

**What it does:**
- **Today's column** gets a purple tint and a small "TODAY" label under the day name.
- **Filter buttons** (All, Strength, HIIT, Yoga, Spin, Boxing) appear above the table. Clicking one fades out every other class, so you can see at a glance when that class runs.

**How "today" works:**

```js
const today = new Date().getDay();
const todayColumn = today === 0 ? 7 : today;
```

`getDay()` returns 0 for Sunday, 1 for Monday, up to 6 for Saturday. The table's columns are Time (0), Mon (1) … Sun (7). So Monday to Saturday line up already, and only Sunday (0) needs moving to column 7. The code then adds the class `today` to that cell in every row.

**How the filters work:**

1. It reads every class name in the table and keeps each one once:

```js
if (className !== "—" && !classNames.includes(className)) {
    classNames.push(className);
}
```

2. It creates one button per name, plus "All", and puts them above the table.
3. When a button is clicked, every cell is checked:

```js
const matches = selectedClass === "All" || cell.textContent.trim() === selectedClass;
cell.classList.toggle("dimmed", !matches);
```

Cells that don't match get the class `dimmed`, which CSS fades to 20% opacity.

**Why build the buttons from the table?** If you add a new class to the timetable, such as "Pilates", a Pilates filter button appears automatically. You only ever edit the HTML table.

---

### 6. FAQ: one answer open at a time (Membership page)

**What it does:** opening one FAQ question closes any other open question, so the list stays tidy.

**How it works:** the FAQ uses HTML `<details>` elements, which already open and close on their own with no JavaScript. Every time one opens or closes, it fires a `toggle` event. The code listens for that, and when an item opens, it closes all the others:

```js
item.addEventListener("toggle", function () {
    if (item.open) {
        faqItems.forEach(function (otherItem) {
            if (otherItem !== item) {
                otherItem.open = false;
            }
        });
    }
});
```

**Why `<details>`?** The FAQ works fully without JavaScript. The JS only adds the "one at a time" behaviour on top.

---

### 7. Contact form validation (Contact page)

**What it does:** when the form is submitted, each field is checked. Problems show as a red message **directly under the field**, rather than as the browser's small default popups:

| Field | Rule |
|---|---|
| Name | Must not be empty |
| Email | Must not be empty, and must look like an email address |
| Phone | Optional, but if filled in it must look like a phone number |
| Message | At least 10 characters |

The cursor jumps to the first problem, and each error disappears as soon as you start fixing that field. When everything is valid, a green "Thanks, [name]!" message appears and the form clears.

**How it works:**

1. `form.setAttribute("novalidate", "")` turns off the browser's built-in popups, so the code can show its own messages.
2. On submit, `event.preventDefault()` stops the page from reloading, which is what forms normally do.
3. Each rule is checked in turn, and any failure calls `showError`, which:
   - creates a `<p class="error_message">` and places it right after the field;
   - adds `input_error` to the field (CSS gives it a red border);
   - sets `aria-invalid` and `aria-describedby`, so screen readers announce the problem and read out the message.
4. If any field has `input_error`, the first one gets focus and the function stops (`return`).
5. Otherwise, the success message is shown and `form.reset()` empties the fields.

The email check uses the browser's own email test, `emailInput.validity.valid`, which works because the field has `type="email"`. The phone check is a regular expression: `/^[\d\s+()-]{7,}$/` means "only digits, spaces, `+`, `(`, `)` or `-`, at least 7 of them".

> ⚠️ **Important:** the form still doesn't *send* anywhere. The success message is shown in the browser only. Before the site goes live, connect a form service such as [Formspree](https://formspree.io), and send the data at the spot marked `NOTE:` in the code, just before the success message.

---

### 8. Open / closed badge

**What it does:** a small green **Open now** or red **Closed now** badge appears next to every "Opening Hours" heading: in the footer on every page, and on the Contact page.

**How it works:**

```js
const hour = now.getHours() + now.getMinutes() / 60;   // e.g. 5:30pm → 17.5

const isWeekend = day === 0 || day === 6;
const opensAt = isWeekend ? 7 : 5;
const closesAt = isWeekend ? 18 : 22;
const isOpen = hour >= opensAt && hour < closesAt;
```

The time becomes a decimal (17.5 means 5:30pm), so it's easy to compare with the opening hours. The code then finds headings whose text is exactly "Opening Hours" and adds the badge.

**Things to know:**
- If you change the opening hours, update both the HTML text **and** the numbers here (`7`, `5`, `18`, `22`).
- The badge uses the **visitor's** device clock and time zone, so it assumes visitors are in the same time zone as the gym.

---

### 9. Back to top button

**What it does:** after you scroll down 600px, a round arrow button fades in at the bottom-right. Clicking it takes you back to the top of the page.

**How it works:** it uses the same scroll-and-toggle pattern as the nav shadow, toggling the class `back_to_top_visible` when `scrollY > 600`. Clicking runs `window.scrollTo({ top: 0 })`. The scroll is smooth because `styles.css` already sets `scroll-behavior: smooth` on the page.

The button shows only an arrow, so `aria-label="Back to top"` gives screen readers a proper name to read out.

---

### 10. Automatic copyright year

**What it does:** keeps the year in "© 2026 The Gorilla Pit" up to date automatically, so you never have to edit it each January.

**How it works:**

```js
const currentYear = new Date().getFullYear();
copyright.textContent = copyright.textContent.replace(/\d{4}/, currentYear);
```

`/\d{4}/` matches the first group of four digits, the year, and swaps it for the current year.

---

### 11. Hero video (Home page)

**What it does:** the Home page hero plays `images/hero.mp4` as a silent, looping background. For people with "reduce motion" turned on, the video is paused, so they see a still frame instead.

**How the video plays:** the playing is done by the HTML itself, not by JavaScript:

```html
<video class="hero_video" autoplay muted loop playsinline aria-hidden="true">
```

- `autoplay` starts it straight away. Browsers only allow autoplay when the video is **`muted`**.
- `loop` repeats it forever.
- `playsinline` stops iPhones from opening it full-screen.
- `aria-hidden="true"` tells screen readers to skip it, because it's decoration, not content.

**How the JavaScript helps:**

```js
if (prefersReducedMotion) {
    video.removeAttribute("autoplay");
    video.pause();
}
```

It uses the same reduced-motion check as the scroll animations, and stops the video before it gets going.

---

## How to add your own feature

1. Add a new numbered banner and a `setupYourFeature()` function to `frontend.js`.
2. Start it with a guard clause, so it only runs on pages where the element exists.
3. Use JavaScript to add or remove classes, and put the styling for those classes in section 14 of `styles.css`.
4. Call `setupYourFeature();` inside the `DOMContentLoaded` block at the bottom.

## Quick reference: classes added by JavaScript

| Class | Added to | Meaning |
|---|---|---|
| `nav_has_toggle` | `.nav` | JS has added the menu button |
| `nav_open` | `.nav` | Mobile menu is open |
| `nav_scrolled` | `.nav` | Page is scrolled more than 50px |
| `reveal` / `revealed` | Cards and titles | Waiting to fade in / fading in |
| `today` | Timetable cells | Today's column |
| `dimmed` | Timetable cells | Hidden by the active filter |
| `filter_active` | Filter button | The selected filter |
| `input_error` | Form fields | That field has a problem |
| `back_to_top_visible` | Back to top button | Button is showing |
| `open_status_open` / `open_status_closed` | Badge | Gym is open / closed right now |
