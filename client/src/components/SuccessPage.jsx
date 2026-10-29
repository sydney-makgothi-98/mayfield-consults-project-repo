import { useState, useEffect } from "react";
import { getOrder, formatPrice } from "../api.js";

// How many times to check, and how long to wait between checks
const MAX_CHECKS = 5;
const WAIT_MS = 2000;

function SuccessPage({ orderId }) {

    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");

    // true once we've checked MAX_CHECKS times and it still isn't paid
    const [gaveUp, setGaveUp] = useState(false);

    // Stripe sends people back here straight after paying, but its webhook
    // message (the thing that marks the order as paid) can arrive a moment
    // later. So if the order still says "pending", wait and check again.
    useEffect(() => {
        let checks = 0;
        let timer;

        async function checkOrder() {
            checks = checks + 1;

            try {
                const data = await getOrder(orderId);
                setOrder(data);

                if (data.status !== "paid") {
                    if (checks < MAX_CHECKS) {
                        timer = setTimeout(checkOrder, WAIT_MS);
                    } else {
                        setGaveUp(true);
                    }
                }
            } catch (err) {
                setError(err.message);
            }
        }

        checkOrder();

        // Stop checking if the page is closed
        return () => clearTimeout(timer);
    }, [orderId]);

    const isPaid = order && order.status === "paid";

    return (
        <main className="px-4 py-24 md:px-8">

            <div className="mx-auto max-w-lg rounded-xl border border-white/10 bg-white/5 p-8 text-center">

                {/* COULD NOT LOAD THE ORDER */}
                {error && (
                    <>
                        <h1 className="mb-4 font-heading text-3xl font-extrabold text-white">Something went wrong</h1>
                        <p className="mb-6 text-red-400">{error}</p>
                    </>
                )}

                {/* STILL WAITING FOR STRIPE */}
                {!error && !isPaid && !gaveUp && (
                    <>
                        <h1 className="mb-4 font-heading text-3xl font-extrabold text-white">Confirming your payment...</h1>
                        <p className="mb-6">This only takes a moment.</p>
                    </>
                )}

                {/* WAITED, BUT STILL NOT PAID */}
                {!error && !isPaid && gaveUp && (
                    <>
                        <h1 className="mb-4 font-heading text-3xl font-extrabold text-white">Payment pending</h1>
                        <p className="mb-6">We haven't had confirmation from Stripe yet. Refresh this page in a minute.</p>
                    </>
                )}

                {/* PAID */}
                {isPaid && (
                    <>
                        <p className="mb-2 text-5xl">✓</p>
                        <h1 className="mb-4 font-heading text-3xl font-extrabold text-white">Payment successful!</h1>
                        <p className="mb-6">Welcome to The Gorilla Pit. Your membership is confirmed.</p>
                    </>
                )}

                {/* ORDER DETAILS */}
                {order && (
                    <div className="mb-6 rounded-lg border border-white/10 p-4 text-left">
                        <p><strong className="text-white">Order:</strong> #{order.id}</p>
                        {order.items.map((item) => (
                            <p key={item.name}><strong className="text-white">Plan:</strong> {item.name}</p>
                        ))}
                        <p><strong className="text-white">Total:</strong> {formatPrice(order.total)}</p>
                        <p>
                            <strong className="text-white">Status:</strong>{" "}
                            <span className={isPaid ? "font-bold text-green-400" : "font-bold text-yellow-400"}>
                                {isPaid ? "Paid" : "Pending"}
                            </span>
                        </p>
                    </div>
                )}

                <a
                    href="/"
                    className="inline-block rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white transition hover:brightness-125"
                >
                    Back to home
                </a>

            </div>

        </main>
    );
}

export default SuccessPage;
