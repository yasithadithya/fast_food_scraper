"use client";

import { useState } from "react";
import type { DealWithDistance } from "@/lib/types";
import { CHAINS } from "@/lib/data/chains";
import { NearestBranchBadge } from "./nearest-branch-badge";

interface Props {
  deal: DealWithDistance;
}

export function DealCard({ deal }: Props) {
  const chain = CHAINS[deal.chain];
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(deal.imageUrl) && !imgFailed;
  const href =
    deal.sourceUrl && deal.sourceUrl.startsWith("http")
      ? deal.sourceUrl
      : undefined;

  const CardTag = href ? "a" : "article";
  const linkProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <CardTag
      {...linkProps}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200/70 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-zinc-300 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:ring-zinc-700"
    >
      {/* Image banner with brand-color placeholder fallback */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={deal.imageUrl!}
            alt={deal.title}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center px-4 text-center"
            style={{
              background: `linear-gradient(135deg, ${chain.brandColor}, ${chain.brandColor}99)`,
            }}
          >
            <span className="text-2xl font-black leading-tight tracking-tight text-white/90">
              {deal.title}
            </span>
          </div>
        )}

        {/* Top gradient scrim for badge legibility */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Chain badge */}
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm ring-1 ring-white/20"
          style={{ backgroundColor: chain.brandColor }}
        >
          {chain.name}
        </span>

        {/* Curated / live indicator */}
        {deal.isFallback ? (
          <span className="absolute right-3 top-3 rounded-full bg-amber-400/95 px-2 py-0.5 text-[10px] font-semibold text-amber-950 shadow-sm">
            Curated
          </span>
        ) : (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
          {deal.title}
        </h3>
        {deal.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {deal.description}
          </p>
        )}

        {/* Price + branch */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          {deal.price ? (
            <span
              className="text-lg font-bold"
              style={{ color: chain.brandColor }}
            >
              {deal.price}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300">
              View offer
              {href && (
                <svg
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              )}
            </span>
          )}
          <NearestBranchBadge
            branch={deal.nearestBranch}
            distanceMeters={deal.distanceMeters}
          />
        </div>
      </div>
    </CardTag>
  );
}
