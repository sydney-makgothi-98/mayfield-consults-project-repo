/* ==========================================================================
   THE GORILLA PIT - FRONTEND JAVASCRIPT
   ==========================================================================
   Every feature lives in its own function below. They are all started
   together at the very bottom of this file, once the page has loaded.

   Each function first checks that the elements it needs are on the
   current page. If they're not, it simply stops, so this one file can
   be shared safely by every page on the site.
   ========================================================================== */


/* ==========================================================================
   1. MOBILE MENU
   ========================================================================== */

function setupMobileMenu() {

    const nav = document.querySelector(".nav");
    const navList = document.querySelector(".nav_list");

    if (!nav || !navList) {
        return;
    }

    // The button is created here rather than in the HTML, so the links
    // still show normally if JavaScript is ever turned off
    const menuButton = document.createElement("button");
    menuButton.className = "menu_toggle";
    menuButton.type = "button";
    menuButton.textContent = "Menu";
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-controls", "nav_list");

    nav.insertBefore(menuButton, navList);
    nav.classList.add("nav_has_toggle");

    function closeMenu() {
        nav.classList.remove("nav_open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "Menu";
    }

    menuButton.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("nav_open");

        menuButton.setAttribute("aria-expanded", isOpen);
        menuButton.textContent = isOpen ? "Close" : "Menu";
    });

    // Close the menu when the Escape key is pressed
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && nav.classList.contains("nav_open")) {
            closeMenu();
            menuButton.focus();
        }
    });
}


/* ==========================================================================
   2. NAV SHADOW ON SCROLL
   ========================================================================== */

function setupNavScroll() {

    const nav = document.querySelector(".nav");

    if (!nav) {
        return;
    }

    function updateNav() {
        // Adds the class when scrolled more than 50px, removes it otherwise
        nav.classList.toggle("nav_scrolled", window.scrollY > 50);
    }

    window.addEventListener("scroll", updateNav, { passive: true });

    // Run once straight away, in case the page loads already scrolled
    updateNav();
}


/* ==========================================================================
   3. SCROLL REVEAL ANIMATIONS
   ========================================================================== */

function setupScrollReveal() {

    // Respect people who have asked their device for less motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        return;
    }

    const elements = document.querySelectorAll(
        ".section_title, .section_intro, .stat_item, .feature_card, .program_card, " +
        ".testimonial_card, .price_card, .trainer_card, .facility_card, .info_item, " +
        ".faq_item, .split, .info_card"
    );

    const observer = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");

                // Each element only needs to animate in once
                observer.unobserve(entry.target);
            }
        });

    }, { threshold: 0.15 });

    elements.forEach(function (element) {

        // Cards in the same row appear one after another, 0.1s apart
        const position = Array.from(element.parentElement.children).indexOf(element);
        element.style.transitionDelay = (position % 4) * 0.1 + "s";

        element.classList.add("reveal");
        observer.observe(element);

        // Once the animation has finished, remove the reveal classes and
        // delay so the element's normal hover effects work again
        element.addEventListener("transitionend", function () {
            element.classList.remove("reveal", "revealed");
            element.style.transitionDelay = "";
        }, { once: true });
    });
}


/* ==========================================================================
   4. ANIMATED STAT COUNTERS (Home page)
   ========================================================================== */

function setupStatCounters() {

    const statNumbers = document.querySelectorAll(".stat_number");

    if (statNumbers.length === 0) {
        return;
    }

    // Leave the numbers as they are for people who prefer less motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        return;
    }

    // Turns 1200 into "1 200"
    function formatNumber(number) {
        return String(number).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    function animateCount(element) {

        const originalText = element.textContent;                    // e.g. "1 200+"
        const target = parseInt(originalText.replace(/\D/g, ""), 10); // 1200
        const suffix = originalText.replace(/[\d\s]/g, "");           // "+"
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {

            // progress goes from 0 at the start to 1 at the end
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Starts fast and slows down towards the end
            const eased = 1 - Math.pow(1 - progress, 3);

            element.textContent = formatNumber(Math.round(target * eased)) + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });

    }, { threshold: 0.5 });

    statNumbers.forEach(function (statNumber) {
        observer.observe(statNumber);
    });
}


/* ==========================================================================
   5. TIMETABLE: TODAY HIGHLIGHT & CLASS FILTERS (Timetable page)
   ========================================================================== */

function setupTimetable() {

    const table = document.querySelector(".timetable");
    const tableWrapper = document.querySelector(".table_wrapper");

    if (!table || !tableWrapper) {
        return;
    }

    const rows = table.querySelectorAll("tr");
    const classCells = table.querySelectorAll("tbody td:not(:first-child)");

    // --- Highlight today's column ---

    // getDay() gives 0 for Sunday, 1 for Monday ... 6 for Saturday.
    // In the table, column 0 is Time, 1 is Monday ... 7 is Sunday.
    const today = new Date().getDay();
    const todayColumn = today === 0 ? 7 : today;

    rows.forEach(function (row) {
        row.children[todayColumn].classList.add("today");
    });

    const todayLabel = document.createElement("span");
    todayLabel.className = "today_label";
    todayLabel.textContent = "Today";
    table.querySelector("thead tr").children[todayColumn].appendChild(todayLabel);

    // --- Filter buttons ---

    // Collect each class name once, e.g. ["Strength", "HIIT", "Yoga" ...]
    const classNames = [];

    classCells.forEach(function (cell) {
        const className = cell.textContent.trim();

        if (className !== "—" && !classNames.includes(className)) {
            classNames.push(className);
        }
    });

    const filters = document.createElement("div");
    filters.className = "timetable_filters";

    ["All"].concat(classNames).forEach(function (className) {

        const button = document.createElement("button");
        button.className = "filter_button";
        button.type = "button";
        button.textContent = className;
        button.setAttribute("aria-pressed", className === "All");

        if (className === "All") {
            button.classList.add("filter_active");
        }

        button.addEventListener("click", function () {
            applyFilter(className, button);
        });

        filters.appendChild(button);
    });

    tableWrapper.parentElement.insertBefore(filters, tableWrapper);

    function applyFilter(selectedClass, selectedButton) {

        // Move the "active" style to the button that was clicked
        filters.querySelectorAll(".filter_button").forEach(function (button) {
            button.classList.remove("filter_active");
            button.setAttribute("aria-pressed", "false");
        });

        selectedButton.classList.add("filter_active");
        selectedButton.setAttribute("aria-pressed", "true");

        // Fade out every class that doesn't match
        classCells.forEach(function (cell) {
            const matches = selectedClass === "All" || cell.textContent.trim() === selectedClass;
            cell.classList.toggle("dimmed", !matches);
        });
    }
}


/* ==========================================================================
   6. FAQ: ONE ANSWER OPEN AT A TIME (Membership page)
   ========================================================================== */

function setupFaqAccordion() {

    const faqItems = document.querySelectorAll(".faq_item");

    faqItems.forEach(function (item) {

        // "toggle" fires whenever a <details> element opens or closes
        item.addEventListener("toggle", function () {

            if (item.open) {
                faqItems.forEach(function (otherItem) {
                    if (otherItem !== item) {
                        otherItem.open = false;
                    }
                });
            }
        });
    });
}


/* ==========================================================================
   7. CONTACT FORM VALIDATION (Contact page)
   ========================================================================== */

function setupContactForm() {

    const form = document.querySelector("#contact_form");

    if (!form) {
        return;
    }

    const nameInput = form.querySelector("#name");
    const emailInput = form.querySelector("#email");
    const phoneInput = form.querySelector("#phone");
    const messageInput = form.querySelector("#message");

    // Turn off the browser's own error popups so we can show friendlier
    // messages under each field instead
    form.setAttribute("novalidate", "");

    function showError(input, message) {
        const error = document.createElement("p");
        error.className = "error_message";
        error.id = input.id + "_error";
        error.textContent = message;

        input.classList.add("input_error");
        input.setAttribute("aria-invalid", "true");
        input.setAttribute("aria-describedby", error.id);
        input.insertAdjacentElement("afterend", error);
    }

    function clearError(input) {
        const error = form.querySelector("#" + input.id + "_error");

        if (error) {
            error.remove();
        }

        input.classList.remove("input_error");
        input.removeAttribute("aria-invalid");
        input.removeAttribute("aria-describedby");
    }

    function showSuccess(name) {
        const success = document.createElement("p");
        success.className = "form_success";
        success.setAttribute("role", "status");
        success.textContent = "Thanks, " + name + "! We'll get back to you within a day.";

        form.appendChild(success);
    }

    // Remove a field's error as soon as the visitor starts fixing it
    [nameInput, emailInput, phoneInput, messageInput].forEach(function (input) {
        input.addEventListener("input", function () {
            clearError(input);
        });
    });

    form.addEventListener("submit", function (event) {

        // Stop the page from reloading
        event.preventDefault();

        // Clear old messages from any previous attempt
        [nameInput, emailInput, phoneInput, messageInput].forEach(clearError);

        const oldSuccess = form.querySelector(".form_success");

        if (oldSuccess) {
            oldSuccess.remove();
        }

        // --- Check each field ---

        if (nameInput.value.trim() === "") {
            showError(nameInput, "Please enter your name.");
        }

        if (emailInput.value.trim() === "") {
            showError(emailInput, "Please enter your email address.");
        } else if (!emailInput.validity.valid) {
            showError(emailInput, "Please enter a valid email address, like name@example.com.");
        }

        if (phoneInput.value.trim() !== "" && !/^[\d\s+()-]{7,}$/.test(phoneInput.value.trim())) {
            showError(phoneInput, "Please enter a valid phone number.");
        }

        if (messageInput.value.trim().length < 10) {
            showError(messageInput, "Please write a message of at least 10 characters.");
        }

        // If anything is wrong, move the cursor to the first problem
        const firstError = form.querySelector(".input_error");

        if (firstError) {
            firstError.focus();
            return;
        }

        // NOTE: The form doesn't send anywhere yet. Once a form service
        // (like Formspree) is connected, send the data here before
        // showing the success message.
        showSuccess(nameInput.value.trim());
        form.reset();
    });
}


/* ==========================================================================
   8. OPEN / CLOSED BADGE
   ========================================================================== */

function setupOpenStatus() {

    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours() + now.getMinutes() / 60;

    // Opening hours: Mon–Fri 5am – 10pm, Sat–Sun 7am – 6pm
    const isWeekend = day === 0 || day === 6;
    const opensAt = isWeekend ? 7 : 5;
    const closesAt = isWeekend ? 18 : 22;
    const isOpen = hour >= opensAt && hour < closesAt;

    // Find every "Opening Hours" heading (footer and Contact page)
    const headings = document.querySelectorAll(".footer_heading, .info_card_title");

    headings.forEach(function (heading) {

        if (heading.textContent.trim() !== "Opening Hours") {
            return;
        }

        const badge = document.createElement("span");
        badge.className = isOpen ? "open_status open_status_open" : "open_status open_status_closed";
        badge.textContent = isOpen ? "Open now" : "Closed now";

        heading.appendChild(badge);
    });
}


/* ==========================================================================
   9. BACK TO TOP BUTTON
   ========================================================================== */

function setupBackToTop() {

    const button = document.createElement("button");
    button.className = "back_to_top";
    button.type = "button";
    button.textContent = "↑";
    button.setAttribute("aria-label", "Back to top");

    document.body.appendChild(button);

    function updateButton() {
        button.classList.toggle("back_to_top_visible", window.scrollY > 600);
    }

    button.addEventListener("click", function () {
        window.scrollTo({ top: 0 });
    });

    window.addEventListener("scroll", updateButton, { passive: true });
    updateButton();
}


/* ==========================================================================
   10. AUTOMATIC COPYRIGHT YEAR
   ========================================================================== */

function setupFooterYear() {

    const copyright = document.querySelector(".footer_copyright");

    if (!copyright) {
        return;
    }

    // Swaps the four-digit year for the current one, e.g. 2026 → 2027
    const currentYear = new Date().getFullYear();
    copyright.textContent = copyright.textContent.replace(/\d{4}/, currentYear);
}


/* ==========================================================================
   11. HERO VIDEO (Home page)
   ========================================================================== */

function setupHeroVideo() {

    const video = document.querySelector(".hero_video");

    if (!video) {
        return;
    }

    // Stop the looping video for people who prefer less motion.
    // They'll see its first frame as a still background instead.
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
        video.removeAttribute("autoplay");
        video.pause();
    }
}


/* ==========================================================================
   START EVERYTHING
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenu();
    setupNavScroll();
    setupScrollReveal();
    setupStatCounters();
    setupTimetable();
    setupFaqAccordion();
    setupContactForm();
    setupOpenStatus();
    setupBackToTop();
    setupFooterYear();
    setupHeroVideo();
});
