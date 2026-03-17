"use client";

import type { DealWithDistance } from "@/lib/types";
import { CHAINS } from "@/lib/data/chains";
import { NearestBranchBadge } from "./nearest-branch-badge";

interface Props {
  deal: DealWithDistance;
}

export function DealCard({ deal }: Props) {
  const chain = CHAINS[deal.chain];

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200/60 transition-shadow hover:shadow-md dark:bg-zinc-900 dark:ring-zinc-800">
      {/* Chain color bar */}
      <div className="h-1.5" style={{ backgroundColor: chain.brandColor }} />

      {/* Deal image banner (if available — shown for BK, Popeyes, KFC) */}
      {deal.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={deal.imageUrl}
          alt={deal.title}
          loading="lazy"
          className="h-44 w-full object-cover"
        />
      )}

      <div className="flex flex-1 flex-col p-4">
        {/* Chain badge */}
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
            style={{ backgroundColor: chain.brandColor }}
          >
            {chain.name.slice(0, 2)}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {chain.name}
          </span>
          {deal.isFallback && (
            <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              Curated
            </span>
          )}
        </div>

        {/* Deal info */}
        <h3 className="mt-3 text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
          {deal.title}
        </h3>
        {deal.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {deal.description}
          </p>
        )}

        {/* Price + Branch */}
        <div className="mt-auto flex items-end justify-between pt-4">
          {deal.price ? (
            <span
              className="text-lg font-bold"
              style={{ color: chain.brandColor }}
            >
              {deal.price}
            </span>
          ) : (
            <span />
          )}
          <NearestBranchBadge
            branch={deal.nearestBranch}
            distanceMeters={deal.distanceMeters}
          />
        </div>
      </div>
    </article>
  );
}

