"use client";

import { useState, useMemo } from "react";
import { useDeals } from "@/hooks/use-deals";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useNearbyBranches } from "@/hooks/use-nearby-branches";
import { enrichDealsWithDistance } from "@/lib/distance";
import { CHAIN_SLUGS } from "@/lib/data/chains";
import type { ChainSlug } from "@/lib/types";
import { ChainFilter } from "./chain-filter";
import { DealGrid } from "./deal-grid";
import { LocationPrompt } from "./location-prompt";
import { LoadingSkeleton } from "./loading-skeleton";
import { ErrorFallback } from "./error-fallback";

function Notice({
  tone = "warning",
  children,
}: {
  tone?: "warning" | "muted";
  children: React.ReactNode;
}) {
  const styles =
    tone === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300"
      : "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300";
  return (
    <div className={`rounded-xl border px-3 py-2.5 text-center text-xs ${styles}`}>
      {children}
    </div>
  );
}

export function DealsView() {
  const { data, loading, syncing, error, syncDeals } = useDeals();
  const geo = useGeolocation();
  const nearbyBranches = useNearbyBranches(geo.location);
  const [activeChain, setActiveChain] = useState<ChainSlug | "all">("all");

  const counts = useMemo(() => {
    const map: Partial<Record<ChainSlug | "all", number>> = {};
    if (!data) return map;
    map.all = data.deals.length;
    for (const slug of CHAIN_SLUGS) {
      map[slug] = data.deals.filter((d) => d.chain === slug).length;
    }
    return map;
  }, [data]);

  const enrichedDeals = useMemo(() => {
    if (!data) return [];
    const filtered =
      activeChain === "all"
        ? data.deals
        : data.deals.filter((d) => d.chain === activeChain);

    const branchPool =
      geo.location && nearbyBranches.loaded ? nearbyBranches.branches : undefined;

    const withDistance = enrichDealsWithDistance(filtered, geo.location, branchPool);

    // Sort: deals with location info first (by distance), then others
    return withDistance.sort((a, b) => {
      if (a.distanceMeters !== null && b.distanceMeters !== null) {
        return a.distanceMeters - b.distanceMeters;
      }
      if (a.distanceMeters !== null) return -1;
      if (b.distanceMeters !== null) return 1;
      return 0;
    });
  }, [data, activeChain, geo.location, nearbyBranches.branches, nearbyBranches.loaded]);

  if (loading && !data) return <LoadingSkeleton />;
  if (error && !data) return <ErrorFallback message={error} />;

  return (
    <div className="space-y-5 pt-6">
      {/* Notices */}
      {(error && data) ||
      (!geo.requested) ||
      (geo.requested && geo.error) ||
      (geo.location && nearbyBranches.error) ||
      (geo.location && !nearbyBranches.error && nearbyBranches.source === "fallback") ? (
        <div className="space-y-3">
          {error && data && (
            <Notice>Sync failed: {error}. Showing the last loaded deals.</Notice>
          )}

          {!geo.requested && (
            <LocationPrompt
              onRequest={geo.requestLocation}
              loading={geo.loading}
              error={geo.error}
            />
          )}

          {geo.requested && geo.error && (
            <Notice>
              {geo.error}. Deals are shown without distance information.
            </Notice>
          )}

          {geo.location && nearbyBranches.error && (
            <Notice>
              Could not load nearby branches from Google Maps (
              {nearbyBranches.error}). Using curated branch locations.
            </Notice>
          )}

          {geo.location &&
            !nearbyBranches.error &&
            nearbyBranches.source === "fallback" && (
              <Notice tone="muted">
                {nearbyBranches.fallbackReason === "missing_api_key"
                  ? "Live branch lookup is not configured. Using curated nearby branches."
                  : "Google Maps returned no branches. Using curated branch locations."}
              </Notice>
            )}
        </div>
      ) : null}

      {/* Sticky controls */}
      <div className="sticky top-0 z-10 -mx-4 border-b border-zinc-200/70 bg-zinc-50/80 px-4 pb-3 pt-3 backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-950/80">
        <ChainFilter
          chains={CHAIN_SLUGS}
          activeChain={activeChain}
          onSelect={setActiveChain}
          counts={counts}
        />

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {enrichedDeals.length} deal{enrichedDeals.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-3">
            {data?.scrapedAt && (
              <p className="hidden text-xs text-zinc-400 dark:text-zinc-500 sm:block">
                Updated {new Date(data.scrapedAt).toLocaleTimeString()}
              </p>
            )}
            <button
              type="button"
              onClick={syncDeals}
              disabled={syncing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <svg
                className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992V4.356M4.5 9.75a7.5 7.5 0 0113.03-5.06l3.49 3.31M19.5 14.25a7.5 7.5 0 01-13.03 5.06l-3.49-3.31M2.985 19.644v-4.992h4.992"
                />
              </svg>
              {syncing ? "Syncing…" : "Sync"}
            </button>
          </div>
        </div>
      </div>

      <DealGrid deals={enrichedDeals} />

      {data?.errors && data.errors.length > 0 && (
        <p className="pt-2 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Some deals are from our curated collection when live data is
          unavailable.
        </p>
      )}
    </div>
  );
}
