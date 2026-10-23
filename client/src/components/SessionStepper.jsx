// A controlled component: it doesn't keep its own state.
// The parent gives it a value and an onChange function,
// and the stepper just shows the value and asks for changes.

function SessionStepper({ value, onChange, min = 0, max = 7 }) {
    return (
        <div className="flex items-center gap-3">

            <button
                type="button"
                onClick={() => onChange(value - 1)}
                disabled={value <= min}
                aria-label="Remove a session"
                className="h-9 w-9 rounded-full border border-white/20 text-lg font-bold text-white transition hover:border-accent disabled:opacity-30"
            >
                −
            </button>

            <span className="w-6 text-center text-lg font-bold text-white" aria-live="polite">
                {value}
            </span>

            <button
                type="button"
                onClick={() => onChange(value + 1)}
                disabled={value >= max}
                aria-label="Add a session"
                className="h-9 w-9 rounded-full border border-white/20 text-lg font-bold text-white transition hover:border-accent disabled:opacity-30"
            >
                +
            </button>

        </div>
    );
}

export default SessionStepper;
