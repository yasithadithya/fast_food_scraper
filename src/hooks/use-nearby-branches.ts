"use client";

import { useEffect, useState } from "react";
import type { BranchLocation, ChainSlug, UserLocation } from "@/lib/types";

interface NearbyStoresApiResponse {
  source: "google" | "fallback";
  fallbackReason?: "missing_api_key" | "google_error" | "google_empty";
  branches: BranchLocation[];
  errors: Array<{ chain: ChainSlug; message: string }>;
}

interface NearbyBranchesState {
  branches: BranchLocation[];
  loading: boolean;
  loaded: boolean;
  source: "google" | "fallback" | null;
  fallbackReason: "missing_api_key" | "google_error" | "google_empty" | null;
  error: string | null;
}

export function useNearbyBranches(location: UserLocation | null) {
  const lat = location?.lat;
  const lng = location?.lng;

  const [state, setState] = useState<NearbyBranchesState>({
    branches: [],
    loading: false,
    loaded: false,
    source: null,
    fallbackReason: null,
    error: null,
  });

  useEffect(() => {
    if (lat === undefined || lng === undefined) {
      setState({
        branches: [],
        loading: false,
        loaded: false,
        source: null,
        fallbackReason: null,
        error: null,
      });
      return;
    }

    const controller = new AbortController();

    const run = async () => {
      setState((s) => ({
        ...s,
        loading: true,
        loaded: false,
        error: null,
      }));

      try {
        const params = new URLSearchParams({
          lat: lat.toString(),
          lng: lng.toString(),
        });

        const res = await fetch(`/api/stores/nearby?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json: NearbyStoresApiResponse = await res.json();

        setState({
          branches: json.branches,
          loading: false,
          loaded: true,
          source: json.source,
          fallbackReason: json.fallbackReason ?? null,
          error: null,
        });
      } catch (err) {
        if (controller.signal.aborted) return;
        setState({
          branches: [],
          loading: false,
          loaded: false,
          source: null,
          fallbackReason: null,
          error:
            err instanceof Error
              ? err.message
              : "Failed to load nearby stores",
        });
      }
    };

    void run();

    return () => {
      controller.abort();
    };
  }, [lat, lng]);

  return state;
}
