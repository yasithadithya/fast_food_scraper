import type { DealsApiResponse } from "@/lib/types";

interface CacheEntry {
  data: DealsApiResponse;
  expiresAt: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
let cache: CacheEntry | null = null;

export function getCachedDeals(): DealsApiResponse | null {
  if (cache && Date.now() < cache.expiresAt) {
    return cache.data;
  }
  return null;
}

export function setCachedDeals(data: DealsApiResponse): void {
  cache = {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };
}
