"use client";

import type { BranchLocation } from "@/lib/types";
import { formatDistance } from "@/lib/distance";

interface Props {
  branch: BranchLocation | null;
  distanceMeters: number | null;
}

export function NearestBranchBadge({ branch, distanceMeters }: Props) {
  if (!branch || distanceMeters === null) return null;

  return (
    <div className="flex max-w-[55%] flex-col items-end text-right">
      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
        <svg
          className="h-3 w-3 shrink-0"
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
        {formatDistance(distanceMeters)}
      </span>
      <span className="mt-1 truncate text-[11px] text-zinc-400 dark:text-zinc-500">
        {branch.name}
      </span>
    </div>
  );
}
