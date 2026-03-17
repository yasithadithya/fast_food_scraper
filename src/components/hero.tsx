export function Hero() {
  return (
    <header className="bg-gradient-to-br from-red-600 to-orange-500 px-4 py-10 text-white sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label="fire">
            🔥
          </span>
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
            Fast Food Deals
          </h1>
        </div>
        <p className="mt-2 text-base text-white/80 sm:text-lg">
          Today&apos;s best offers from your favourite chains in Sri Lanka
        </p>
      </div>
    </header>
  );
}
