"use client";

interface Props {
  message: string;
}

export function ErrorFallback({ message }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <svg
          className="h-7 w-7 text-red-600 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <div>
        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Something went wrong
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {message}
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Try Again
      </button>
    </div>
  );
}
