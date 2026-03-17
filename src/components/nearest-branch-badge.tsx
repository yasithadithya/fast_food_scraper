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
    <div className="text-right text-xs text-zinc-500 dark:text-zinc-400">
      <p className="font-medium">{branch.name}</p>
      <p className="flex items-center justify-end gap-1">
        <svg
          className="h-3 w-3"
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
        {formatDistance(distanceMeters)} away
      </p>
    </div>
  );
}
