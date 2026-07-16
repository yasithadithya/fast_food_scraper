export function LoadingSkeleton() {
  return (
    <div className="space-y-5 pt-6">
      {/* Filter skeleton */}
      <div className="flex gap-2 pt-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-20 shrink-0 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>

      {/* Card skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200/60 dark:bg-zinc-900 dark:ring-zinc-800"
          >
            <div className="aspect-[16/10] animate-pulse bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex items-end justify-between pt-2">
                <div className="h-6 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
