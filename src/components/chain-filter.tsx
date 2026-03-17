"use client";

import type { ChainSlug } from "@/lib/types";
import { CHAINS } from "@/lib/data/chains";

interface Props {
  chains: ChainSlug[];
  activeChain: ChainSlug | "all";
  onSelect: (chain: ChainSlug | "all") => void;
}

export function ChainFilter({ chains, activeChain, onSelect }: Props) {
  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect("all")}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          activeChain === "all"
            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        }`}
      >
        All Chains
      </button>
      {chains.map((slug) => (
        <button
          key={slug}
          onClick={() => onSelect(slug)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeChain === slug
              ? "text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          }`}
          style={
            activeChain === slug
              ? { backgroundColor: CHAINS[slug].brandColor }
              : undefined
          }
        >
          {CHAINS[slug].name}
        </button>
      ))}
    </div>
  );
}
