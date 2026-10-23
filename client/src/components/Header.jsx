import { useState } from "react";

const navLinks = [
    { href: "#about", label: "About" },
    { href: "#programs", label: "Programs" },
    { href: "#trainers", label: "Trainers" },
    { href: "#membership", label: "Membership" },
    { href: "#contact", label: "Contact" },
];

function Header({ user, onSignInClick, onSignOut }) {

    // true when the mobile menu is open
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-10 border-b border-white/10 bg-black/60 backdrop-blur-md">

            <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">

                <a href="#top" className="font-heading text-xl font-extrabold text-white md:text-2xl">
                    The Gorilla Pit
                </a>

                {/* MENU BUTTON (small screens only) */}
                <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-expanded={menuOpen}
                    aria-controls="nav_list"
                    className="rounded-lg border-2 border-accent px-4 py-1.5 font-semibold text-white lg:hidden"
                >
                    {menuOpen ? "Close" : "Menu"}
                </button>

                {/* NAV LINKS (hidden on small screens until the menu is opened) */}
                <ul
                    id="nav_list"
                    className={`${menuOpen ? "flex" : "hidden"} w-full flex-col items-center gap-4 py-2 lg:flex lg:w-auto lg:flex-row lg:gap-6 lg:py-0`}
                >
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="font-medium text-muted transition-colors hover:text-accent-2"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}

                    {/* SIGN IN / SIGN OUT */}
                    <li className="flex items-center gap-3">
                        {user ? (
                            <>
                                <span className="hidden font-medium text-white xl:inline">
                                    Hi, {user.name.split(" ")[0]}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onSignOut();
                                    }}
                                    className="rounded-lg border-2 border-accent px-4 py-1.5 font-semibold text-white transition hover:bg-accent/10"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setMenuOpen(false);
                                    onSignInClick();
                                }}
                                className="rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 px-4 py-1.5 font-semibold text-white transition hover:brightness-125"
                            >
                                Sign in
                            </button>
                        )}
                    </li>
                </ul>

            </nav>

        </header>
    );
}

export default Header;
