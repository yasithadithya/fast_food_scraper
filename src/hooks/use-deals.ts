"use client";

import { useState, useEffect, useCallback } from "react";
import type { DealsApiResponse } from "@/lib/types";

export function useDeals() {
  const [data, setData] = useState<DealsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = useCallback(
    async ({ force = false, showLoading = false } = {}) => {
      if (showLoading) {
        setLoading(true);
      }

      setError(null);

      try {
        const url = force ? "/api/deals?force=1" : "/api/deals";
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: DealsApiResponse = await res.json();
        setData(json);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load deals"
        );
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    void fetchDeals({ showLoading: true });
  }, [fetchDeals]);

  const syncDeals = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      await fetchDeals({ force: true });
    } finally {
      setSyncing(false);
    }
  }, [fetchDeals, syncing]);

  return { data, loading, syncing, error, syncDeals };
}
