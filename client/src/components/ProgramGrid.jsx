import { useState } from "react";
import { programs } from "../data.js";
import ProgramCard from "./ProgramCard.jsx";

// "All" plus each category once, taken straight from the data
// e.g. ["All", "Strength", "Cardio", "Combat", "Mind & Body"]
const categories = ["All", ...new Set(programs.map((program) => program.category))];

function ProgramGrid() {

    // Which filter button is selected
    const [activeCategory, setActiveCategory] = useState("All");

    // Sessions per week for each program, e.g. { 1: 3, 4: 1 }
    const [sessions, setSessions] = useState({});

    function updateSessions(programId, value) {
        setSessions({ ...sessions, [programId]: value });
    }

    // Adds up every program's sessions for the weekly total
    const totalSessions = Object.values(sessions).reduce((total, value) => total + value, 0);

    // Only the programs that match the selected filter
    const visiblePrograms = activeCategory === "All"
        ? programs
        : programs.filter((program) => program.category === activeCategory);

    return (
        <section id="programs" className="px-4 py-16 md:px-8">

            <div className="mx-auto max-w-6xl">

                <h2 className="mb-2 text-center font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                    Our Programs
                </h2>
                <p className="mx-auto mb-8 max-w-xl text-center">
                    Find the training style that fits your goals.
                </p>

                {/* FILTER BUTTONS */}
                <div className="mb-8 flex flex-wrap justify-center gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setActiveCategory(category)}
                            aria-pressed={activeCategory === category}
                            className={
                                activeCategory === category
                                    ? "rounded-full bg-gradient-to-br from-blue-600 to-violet-600 px-4 py-2 font-semibold text-white"
                                    : "rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-muted transition hover:border-accent hover:text-white"
                            }
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* WEEKLY PLAN TOTAL */}
                <p className="mb-8 text-center" aria-live="polite">
                    Your weekly plan:{" "}
                    <strong className="text-accent-2">
                        {totalSessions} {totalSessions === 1 ? "session" : "sessions"}
                    </strong>
                </p>

                {/* PROGRAM CARDS */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visiblePrograms.map((program) => (
                        <ProgramCard
                            key={program.id}
                            program={program}
                            sessions={sessions[program.id] ?? 0}
                            onSessionsChange={(value) => updateSessions(program.id, value)}
                        />
                    ))}
                </div>

            </div>

        </section>
    );
}

export default ProgramGrid;
