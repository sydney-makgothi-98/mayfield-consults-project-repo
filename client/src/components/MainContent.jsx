import { stats, features, trainers } from "../data.js";
import ProgramGrid from "./ProgramGrid.jsx";
import MembershipPlans from "./MembershipPlans.jsx";

function MainContent({ user, onSignInClick }) {
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
            <MembershipPlans user={user} onSignInClick={onSignInClick} />

        </main>
    );
}

export default MainContent;
