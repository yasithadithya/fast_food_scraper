"use client";

import type { DealWithDistance } from "@/lib/types";
import { DealCard } from "./deal-card";

interface Props {
  deals: DealWithDistance[];
}

export function DealGrid({ deals }: Props) {
  if (deals.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium text-zinc-400 dark:text-zinc-500">
          No deals found
        </p>
        <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-600">
          Try selecting a different chain or check back later
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
}
