const quickLinks = [
    { href: "#about", label: "About" },
    { href: "#programs", label: "Programs" },
    { href: "#trainers", label: "Trainers" },
    { href: "#membership", label: "Membership" },
];

function Footer() {

    const currentYear = new Date().getFullYear();

    return (
        <footer id="contact" className="bg-black/60 px-4 pt-12 pb-6 text-lavender md:px-8">

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-4">

                {/* BRAND */}
                <div>
                    <h2 className="mb-2 font-heading text-xl font-extrabold text-accent">The Gorilla Pit</h2>
                    <p>Train stronger. Live better.</p>
                    <div className="mt-4 flex justify-center gap-4 sm:justify-start">
                        <a href="#" className="hover:text-accent-2">Instagram</a>
                        <a href="#" className="hover:text-accent-2">Facebook</a>
                        <a href="#" className="hover:text-accent-2">TikTok</a>
                    </div>
                </div>

                {/* QUICK LINKS */}
                <div>
                    <h3 className="mb-2 font-heading font-bold text-accent">Quick Links</h3>
                    <ul className="space-y-1">
                        {quickLinks.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} className="hover:text-accent-2">{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CONTACT */}
                <div>
                    <h3 className="mb-2 font-heading font-bold text-accent">Contact</h3>
                    <p>45 Fitness Avenue, Your City</p>
                    <p><a href="mailto:hello@thegorillapit.com" className="break-all hover:text-accent-2">hello@thegorillapit.com</a></p>
                    <p><a href="tel:+10000000000" className="hover:text-accent-2">+1 (000) 000-0000</a></p>
                </div>

                {/* OPENING HOURS */}
                <div>
                    <h3 className="mb-2 font-heading font-bold text-accent">Opening Hours</h3>
                    <p>Mon–Fri: 5am – 10pm</p>
                    <p>Sat–Sun: 7am – 6pm</p>
                </div>

            </div>

            <p className="mx-auto mt-8 max-w-6xl border-t border-lavender/20 pt-4 text-center text-sm">
                &copy; {currentYear} The Gorilla Pit. All rights reserved.
            </p>

        </footer>
    );
}

export default Footer;
