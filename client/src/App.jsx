import { useState, useEffect } from "react";
import { getToken, getMe, logout, removeToken } from "./api.js";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import MainContent from "./components/MainContent.jsx";
import Footer from "./components/Footer.jsx";
import AuthForm from "./components/AuthForm.jsx";

function App() {

    // The logged-in user, or null if nobody is logged in
    const [user, setUser] = useState(null);

    // true while the sign in / sign up box is open
    const [showAuth, setShowAuth] = useState(false);

    // When the page loads, check if we're still logged in from last time.
    // This is what keeps people logged in after a refresh.
    useEffect(() => {
        if (getToken()) {
            getMe()
                .then((data) => setUser(data.user))
                .catch(() => removeToken()); // the login has expired
        }
    }, []);

    function handleLoggedIn(loggedInUser) {
        setUser(loggedInUser);
        setShowAuth(false);
    }

    async function handleSignOut() {
        try {
            await logout();
        } catch (error) {
            // Even if the server can't be reached, still sign out on this device
        }

        removeToken();
        setUser(null);
    }

    return (
        <div id="top">

            {/* ANIMATED BACKGROUND */}
            <div className="fixed inset-0 -z-10 animate-background-shift bg-[linear-gradient(-45deg,#000000,#0b1f4d,#2e1065,#000000,#1e1b4b)] bg-[length:400%_400%] motion-reduce:animate-none"></div>

            <Header
                user={user}
                onSignInClick={() => setShowAuth(true)}
                onSignOut={handleSignOut}
            />

            <Hero />

            <MainContent />

            <Footer />

            {/* SIGN IN / SIGN UP BOX */}
            {showAuth && (
                <AuthForm
                    onLoggedIn={handleLoggedIn}
                    onClose={() => setShowAuth(false)}
                />
            )}

        </div>
    );
}

export default App;
