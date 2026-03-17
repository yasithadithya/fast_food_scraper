"use client";

import { useState, useEffect } from "react";
import type { DealsApiResponse } from "@/lib/types";

export function useDeals() {
  const [data, setData] = useState<DealsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeals() {
      try {
        const res = await fetch("/api/deals");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: DealsApiResponse = await res.json();
        setData(json);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load deals"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchDeals();
  }, []);

  return { data, loading, error };
}
