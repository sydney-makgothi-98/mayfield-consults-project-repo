import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Footer from "./components/Footer.jsx";

function App() {
    return (
        <div id="top">

            {/* ANIMATED BACKGROUND */}
            <div className="fixed inset-0 -z-10 animate-background-shift bg-[linear-gradient(-45deg,#000000,#0b1f4d,#2e1065,#000000,#1e1b4b)] bg-[length:400%_400%] motion-reduce:animate-none"></div>

            <Header />

            <Hero />

            <main></main>

            <Footer />

        </div>
    );
}

export default App;
