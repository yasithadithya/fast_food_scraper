"use client";

import { useState, useMemo } from "react";
import { useDeals } from "@/hooks/use-deals";
import { useGeolocation } from "@/hooks/use-geolocation";
import { enrichDealsWithDistance } from "@/lib/distance";
import { CHAIN_SLUGS } from "@/lib/data/chains";
import type { ChainSlug } from "@/lib/types";
import { ChainFilter } from "./chain-filter";
import { DealGrid } from "./deal-grid";
import { LocationPrompt } from "./location-prompt";
import { LoadingSkeleton } from "./loading-skeleton";
import { ErrorFallback } from "./error-fallback";

export function DealsView() {
  const { data, loading, error } = useDeals();
  const geo = useGeolocation();
  const [activeChain, setActiveChain] = useState<ChainSlug | "all">("all");

  const enrichedDeals = useMemo(() => {
    if (!data?.deals) return [];
    const filtered =
      activeChain === "all"
        ? data.deals
        : data.deals.filter((d) => d.chain === activeChain);

    const withDistance = enrichDealsWithDistance(filtered, geo.location);

    // Sort: deals with location info first (by distance), then others
    return withDistance.sort((a, b) => {
      if (a.distanceMeters !== null && b.distanceMeters !== null) {
        return a.distanceMeters - b.distanceMeters;
      }
      if (a.distanceMeters !== null) return -1;
      if (b.distanceMeters !== null) return 1;
      return 0;
    });
  }, [data?.deals, activeChain, geo.location]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorFallback message={error} />;

  return (
    <div className="space-y-6 pt-6">
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
        {data?.scrapedAt && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Updated {new Date(data.scrapedAt).toLocaleTimeString()}
          </p>
        )}
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
