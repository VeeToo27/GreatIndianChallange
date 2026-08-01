import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-mist mb-6">
          Rivyou Primary Research
        </span>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.05] max-w-3xl">
          You say you trust reviews.
          <br />
          <span className="text-jade">We want to know what you actually do.</span>
        </h1>
        <p className="mt-6 max-w-xl text-mist text-lg">
          Nine quick questions on how you really decide what skincare to buy.
          Anonymous, takes under two minutes, and every answer updates the
          live dashboard instantly.
        </p>

        <div className="waterline w-full max-w-md my-12" />

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/survey"
            className="card-focus px-8 py-4 rounded-full bg-jade text-paper font-semibold text-base hover:bg-jadeDeep transition-colors"
          >
            Take the survey
          </Link>
          <Link
            href="/dashboard"
            className="card-focus px-8 py-4 rounded-full border border-ink/15 font-semibold text-base hover:border-ink/40 transition-colors"
          >
            Watch live results →
          </Link>
        </div>
      </div>

      <footer className="text-center pb-8 font-mono text-xs text-mist">
        Built for the Rivyou research sprint
      </footer>
    </main>
  );
}
