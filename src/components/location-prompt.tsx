"use client";

interface Props {
  onRequest: () => void;
  loading: boolean;
  error: string | null;
}

export function LocationPrompt({ onRequest, loading, error }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/40 dark:bg-blue-950/30 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            Enable location to see nearby branches
          </p>
          <p className="mt-0.5 text-xs text-blue-700/70 dark:text-blue-300/70">
            We&apos;ll sort deals by the closest branch to you.
          </p>
          {error && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      </div>
      <button
        onClick={onRequest}
        disabled={loading}
        className="shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Getting location…" : "Share location"}
      </button>
    </div>
  );
}
