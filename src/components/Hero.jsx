function Hero() {
    return (
        <section className="relative isolate flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center md:min-h-[85vh] md:px-8">

            {/* BACKGROUND VIDEO */}
            <video
                className="absolute inset-0 -z-20 h-full w-full object-cover motion-reduce:hidden"
                src="/images/hero.mp4"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
            ></video>

            {/* DARK OVERLAY so the text stays readable */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 to-black/80"></div>

            <h1 className="mb-4 max-w-3xl font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Unleash Your{" "}
                <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                    Inner Beast
                </span>
            </h1>

            <p className="mb-8 max-w-xl text-lg md:text-xl">
                Strength, conditioning, boxing and more, coached by experts in a gym that feels like home.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
                <a
                    href="#membership"
                    className="rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-125"
                >
                    Join Today
                </a>
                <a
                    href="#programs"
                    className="rounded-lg border-2 border-accent px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-accent/10"
                >
                    Explore Programs
                </a>
            </div>

        </section>
    );
}

export default Hero;
