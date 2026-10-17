import SessionStepper from "./SessionStepper.jsx";

function ProgramCard({ program, sessions, onSessionsChange }) {
    return (
        <article className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/20">

            <img
                src={program.image}
                alt={program.name}
                className="h-52 w-full bg-white/5 object-cover"
            />

            <div className="flex flex-1 flex-col p-5">

                <p className="mb-2 text-xs font-bold tracking-wider text-accent-2 uppercase">
                    {program.category}
                </p>

                <h3 className="mb-2 font-heading text-xl font-bold text-white">
                    {program.name}
                </h3>

                <p className="mb-4">
                    {program.description}
                </p>

                <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <span><strong className="text-white">Duration:</strong> {program.duration}</span>
                    <span><strong className="text-white">Intensity:</strong> {program.intensity}</span>
                </div>

                {/* SESSIONS PER WEEK */}
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-sm font-semibold text-white">Sessions per week</span>
                    <SessionStepper value={sessions} onChange={onSessionsChange} />
                </div>

            </div>

        </article>
    );
}

export default ProgramCard;
