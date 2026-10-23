import { stats, features, trainers, plans } from "../data.js";
import ProgramGrid from "./ProgramGrid.jsx";

function MainContent() {
    return (
        <main>

            {/* ABOUT SECTION */}
            <section id="about" className="px-4 py-16 md:px-8">

                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="mb-4 font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                        Train Stronger. Live Better.
                    </h2>
                    <p className="mb-4">
                        The Gorilla Pit is a modern gym built for every fitness level, whether you're lifting for the first time or chasing a new personal best.
                    </p>
                    <p className="mb-4">
                        Our certified coaches design every session to push you safely, keep you motivated and help you see real results.
                    </p>
                    <p>
                        From early-morning strength sessions to evening yoga, there's a class that fits your schedule and your goals.
                    </p>
                </div>

            </section>


            {/* STATS SECTION */}
            <section className="bg-white/5 px-4 py-12 md:px-8">

                <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 text-center md:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.id}>
                            <p className="text-3xl font-extrabold text-accent md:text-4xl">{stat.number}</p>
                            <p>{stat.label}</p>
                        </div>
                    ))}
                </div>

            </section>


            {/* WHY US SECTION */}
            <section className="px-4 py-16 md:px-8">

                <div className="mx-auto max-w-6xl">

                    <h2 className="mb-2 text-center font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                        Why The Gorilla Pit?
                    </h2>
                    <p className="mx-auto mb-10 max-w-xl text-center">
                        Everything you need to train hard, recover well and keep coming back.
                    </p>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <article key={feature.id} className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                                <h3 className="mb-2 font-heading text-lg font-bold text-white">{feature.title}</h3>
                                <p>{feature.text}</p>
                            </article>
                        ))}
                    </div>

                </div>

            </section>


            {/* PROGRAMS SECTION */}
            <div className="bg-white/5">
                <ProgramGrid />
            </div>


            {/* TRAINERS SECTION */}
            <section id="trainers" className="px-4 py-16 md:px-8">

                <div className="mx-auto max-w-6xl">

                    <h2 className="mb-2 text-center font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                        Meet Our Trainers
                    </h2>
                    <p className="mx-auto mb-10 max-w-xl text-center">
                        Certified, experienced and genuinely passionate about helping you reach your goals.
                    </p>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {trainers.map((trainer) => (
                            <article key={trainer.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/5 text-center">
                                <img
                                    src={trainer.image}
                                    alt={trainer.name}
                                    className="h-72 w-full bg-white/5 object-cover object-top md:h-80"
                                />
                                <div className="p-5">
                                    <h3 className="mb-1 font-heading text-xl font-bold text-white">{trainer.name}</h3>
                                    <p className="mb-2 font-semibold text-accent-2">{trainer.role}</p>
                                    <p>{trainer.bio}</p>
                                </div>
                            </article>
                        ))}
                    </div>

                </div>

            </section>


            {/* MEMBERSHIP SECTION */}
            <section id="membership" className="bg-white/5 px-4 py-16 md:px-8">

                <div className="mx-auto max-w-6xl">

                    <h2 className="mb-2 text-center font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                        Membership Plans
                    </h2>
                    <p className="mx-auto mb-10 max-w-xl text-center">
                        No joining fees and no long contracts. Cancel anytime.
                    </p>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {plans.map((plan) => (
                            <article
                                key={plan.id}
                                className={`flex flex-col rounded-xl bg-white/5 p-6 text-center ${plan.featured ? "border-2 border-accent-2" : "border border-white/10"}`}
                            >
                                {plan.featured && (
                                    <p className="mb-3 self-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 px-3 py-1 text-xs font-bold text-white">
                                        Most Popular
                                    </p>
                                )}

                                <h3 className="font-heading text-xl font-bold text-white">{plan.name}</h3>
                                <p className="mt-2 text-4xl font-bold text-accent-2">{plan.price}</p>
                                <p className="mb-4 text-sm">{plan.period}</p>

                                <ul className="mb-6 text-left">
                                    {plan.perks.map((perk) => (
                                        <li key={perk} className="border-b border-white/10 py-2">
                                            <span className="font-bold text-accent">✓</span> {perk}
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href="#contact"
                                    className={
                                        plan.featured
                                            ? "mt-auto rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white transition hover:brightness-125"
                                            : "mt-auto rounded-lg border-2 border-accent px-6 py-3 font-semibold text-white transition hover:bg-accent/10"
                                    }
                                >
                                    Join {plan.name}
                                </a>
                            </article>
                        ))}
                    </div>

                </div>

            </section>

        </main>
    );
}

export default MainContent;
