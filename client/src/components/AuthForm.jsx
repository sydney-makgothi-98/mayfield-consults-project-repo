import { useState } from "react";
import { login, signup, saveToken } from "../api.js";

// A pop-up box for signing in or creating an account.
// One form does both jobs - "mode" decides which one we're doing.

function AuthForm({ onLoggedIn, onClose }) {

    // "login" or "signup"
    const [mode, setMode] = useState("login");

    // What's typed into each box
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {

        // Stop the page from reloading
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = mode === "signup"
                ? await signup(name, email, password)
                : await login(email, password);

            // Remember the login, then tell App who logged in
            saveToken(data.token);
            onLoggedIn(data.user);

        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    const inputClasses = "rounded-lg border border-white/20 bg-white/10 p-3 text-white focus:border-accent focus:outline-none";

    return (
        // Dark background - clicking it closes the box
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>

            {/* THE BOX (clicks inside it don't close it) */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth_title"
                className="relative w-full max-w-sm rounded-xl border border-white/10 bg-primary p-6"
                onClick={(event) => event.stopPropagation()}
            >

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-3 right-4 text-2xl text-muted hover:text-white"
                >
                    ×
                </button>

                <h2 id="auth_title" className="mb-4 font-heading text-2xl font-extrabold text-white">
                    {mode === "login" ? "Sign In" : "Create an Account"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                    {/* Name is only needed when signing up */}
                    {mode === "signup" && (
                        <>
                            <label htmlFor="auth_name" className="font-semibold text-white">Name</label>
                            <input
                                id="auth_name"
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                autoComplete="name"
                                required
                                className={inputClasses}
                            />
                        </>
                    )}

                    <label htmlFor="auth_email" className="font-semibold text-white">Email</label>
                    <input
                        id="auth_email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                        className={inputClasses}
                    />

                    <label htmlFor="auth_password" className="font-semibold text-white">Password</label>
                    <input
                        id="auth_password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                        minLength={6}
                        required
                        className={inputClasses}
                    />

                    {error && <p className="text-red-400" role="alert">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white transition hover:brightness-125 disabled:opacity-50"
                    >
                        {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Sign Up"}
                    </button>

                </form>

                {/* SWITCH BETWEEN SIGN IN AND SIGN UP */}
                <p className="mt-4 text-center text-sm">
                    {mode === "login" ? "No account yet? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() => {
                            setMode(mode === "login" ? "signup" : "login");
                            setError("");
                        }}
                        className="font-semibold text-accent hover:text-accent-2"
                    >
                        {mode === "login" ? "Sign up" : "Sign in"}
                    </button>
                </p>

            </div>

        </div>
    );
}

export default AuthForm;
