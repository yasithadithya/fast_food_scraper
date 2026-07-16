"use client";

import type { ChainSlug } from "@/lib/types";
import { CHAINS } from "@/lib/data/chains";

interface Props {
  chains: ChainSlug[];
  activeChain: ChainSlug | "all";
  onSelect: (chain: ChainSlug | "all") => void;
  counts?: Partial<Record<ChainSlug | "all", number>>;
}

export function ChainFilter({ chains, activeChain, onSelect, counts }: Props) {
  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => onSelect("all")}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          activeChain === "all"
            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        }`}
      >
        All
        {counts?.all !== undefined && (
          <span className="ml-1.5 opacity-60">{counts.all}</span>
        )}
      </button>
      {chains.map((slug) => {
        const active = activeChain === slug;
        return (
          <button
            key={slug}
            onClick={() => onSelect(slug)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "text-white shadow-sm"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
            style={active ? { backgroundColor: CHAINS[slug].brandColor } : undefined}
          >
            {!active && (
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: CHAINS[slug].brandColor }}
              />
            )}
            {CHAINS[slug].name}
            {counts?.[slug] !== undefined && (
              <span className="opacity-70">{counts[slug]}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
