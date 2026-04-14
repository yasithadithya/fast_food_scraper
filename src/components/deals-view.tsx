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

export function DealsView() {
  const { data, loading, syncing, error, syncDeals } = useDeals();
  const geo = useGeolocation();
  const nearbyBranches = useNearbyBranches(geo.location);
  const [activeChain, setActiveChain] = useState<ChainSlug | "all">("all");

  const enrichedDeals = useMemo(() => {
    if (!data) return [];
    const filtered =
      activeChain === "all"
        ? data.deals
        : data.deals.filter((d) => d.chain === activeChain);

    const branchPool =
      geo.location && nearbyBranches.loaded
        ? nearbyBranches.branches
        : undefined;

    const withDistance = enrichDealsWithDistance(
      filtered,
      geo.location,
      branchPool
    );

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
    <div className="space-y-6 pt-6">
      {error && data && (
        <div className="rounded-xl bg-amber-50 p-3 text-center text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
          Sync failed: {error}. Showing the most recently loaded deals.
        </div>
      )}

      {!geo.requested && (
        <LocationPrompt
          onRequest={geo.requestLocation}
          loading={geo.loading}
          error={geo.error}
        />
      )}

      {geo.requested && geo.error && (
        <div className="rounded-xl bg-amber-50 p-3 text-center text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
          {geo.error}. Deals are shown without distance information.
        </div>
      )}

      {geo.location && nearbyBranches.error && (
        <div className="rounded-xl bg-amber-50 p-3 text-center text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
          Could not load nearby branches from Google Maps ({nearbyBranches.error}).
          Using curated branch locations.
        </div>
      )}

      {geo.location &&
        !nearbyBranches.error &&
        nearbyBranches.source === "fallback" && (
          <div className="rounded-xl bg-zinc-100 p-3 text-center text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {nearbyBranches.fallbackReason === "missing_api_key"
              ? "Google Maps API key is not configured. Using curated nearby branches."
              : "Google Maps did not return nearby branches. Using curated branch locations."}
          </div>
        )}

      <ChainFilter
        chains={CHAIN_SLUGS}
        activeChain={activeChain}
        onSelect={setActiveChain}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {enrichedDeals.length} deal{enrichedDeals.length !== 1 ? "s" : ""}{" "}
          found
        </p>
        <div className="flex items-center gap-3">
          {data?.scrapedAt && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Updated {new Date(data.scrapedAt).toLocaleTimeString()}
            </p>
          )}
          <button
            type="button"
            onClick={syncDeals}
            disabled={syncing}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {syncing ? "Syncing..." : "Sync deals"}
          </button>
        </div>
      </div>

      <DealGrid deals={enrichedDeals} />

      {data?.errors && data.errors.length > 0 && (
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
          Some deals are from our curated collection when live data is
          unavailable
        </p>
      )}
    </div>
  );
}
