import { CHAINS, CHAIN_SLUGS } from "@/lib/data/chains";

export function Hero() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white">
      {/* Decorative blurred glows */}
      <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-red-400/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-2xl shadow-inner ring-1 ring-white/20 backdrop-blur-sm"
            role="img"
            aria-label="fire"
          >
            🔥
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
              Fast Food Deals
            </h1>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
              Sri Lanka
            </p>
          </div>
        </div>

        <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
          Today&apos;s best offers from your favourite chains, with the nearest
          branch to you.
        </p>

        {/* Chain lineup */}
        <div className="mt-6 flex flex-wrap gap-2">
          {CHAIN_SLUGS.map((slug) => (
            <span
              key={slug}
              className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm"
            >
              {CHAINS[slug].name}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
