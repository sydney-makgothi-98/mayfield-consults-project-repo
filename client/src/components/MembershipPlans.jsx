import { useState, useEffect } from "react";
import { getPlans, startCheckout, formatPrice } from "../api.js";

function MembershipPlans({ user, onSignInClick }) {

    // The plans from the database, plus loading and error messages
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // The id of the plan being bought, so its button can say "Loading..."
    const [buyingId, setBuyingId] = useState(null);

    // Load the plans from the API once, when the page first opens
    useEffect(() => {
        getPlans()
            .then((data) => setPlans(data))
            .catch(() => setError("Could not load plans. Please try again later."))
            .finally(() => setLoading(false));
    }, []);

    async function handleJoin(plan) {

        // Every order must belong to a real user, so sign in first
        if (!user) {
            onSignInClick();
            return;
        }

        setError("");
        setBuyingId(plan.id);

        try {
            // The server makes the order and gives back Stripe's checkout page
            const data = await startCheckout(plan.id);
            window.location.href = data.url;
        } catch (err) {
            setError(err.message);
            setBuyingId(null);
        }
    }

    return (
        <section id="membership" className="bg-white/5 px-4 py-16 md:px-8">

            <div className="mx-auto max-w-6xl">

                <h2 className="mb-2 text-center font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                    Membership Plans
                </h2>
                <p className="mx-auto mb-10 max-w-xl text-center">
                    No joining fees and no long contracts. Cancel anytime.
                </p>

                {/* LOADING AND ERROR MESSAGES */}
                {loading && <p className="text-center">Loading plans...</p>}
                {error && <p className="mb-6 text-center text-red-400">{error}</p>}

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
                            <p className="mt-2 text-4xl font-bold text-accent-2">{formatPrice(plan.price)}</p>
                            <p className="mb-4 text-sm">{plan.period}</p>

                            <ul className="mb-6 text-left">
                                {plan.perks.map((perk) => (
                                    <li key={perk} className="border-b border-white/10 py-2">
                                        <span className="font-bold text-accent">✓</span> {perk}
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                onClick={() => handleJoin(plan)}
                                disabled={buyingId !== null}
                                className={
                                    plan.featured
                                        ? "mt-auto rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white transition hover:brightness-125 disabled:opacity-60"
                                        : "mt-auto rounded-lg border-2 border-accent px-6 py-3 font-semibold text-white transition hover:bg-accent/10 disabled:opacity-60"
                                }
                            >
                                {buyingId === plan.id ? "Loading..." : `Join ${plan.name}`}
                            </button>

                            {!user && (
                                <p className="mt-2 text-xs">You'll be asked to sign in first.</p>
                            )}
                        </article>
                    ))}
                </div>

            </div>

        </section>
    );
}

export default MembershipPlans;
