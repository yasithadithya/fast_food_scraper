"use client";

interface Props {
  onRequest: () => void;
  loading: boolean;
  error: string | null;
}

export function LocationPrompt({ onRequest, loading, error }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/30 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
          Enable location to see nearby branches
        </p>
        <p className="mt-0.5 text-xs text-blue-700/70 dark:text-blue-400/70">
          We&apos;ll find the closest branch for each deal
        </p>
        {error && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
      <button
        onClick={onRequest}
        disabled={loading}
        className="shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Getting location..." : "Share Location"}
      </button>
    </div>
  );
}
