import haversineDistance from "haversine-distance";
import type {
  UserLocation,
  BranchLocation,
  Deal,
  DealWithDistance,
  ChainSlug,
} from "@/lib/types";
import { STORE_LOCATIONS } from "@/lib/data/store-locations";

export function findNearestBranch(
  userLocation: UserLocation,
  chain: ChainSlug,
  branches: BranchLocation[] = STORE_LOCATIONS
): { branch: BranchLocation; distanceMeters: number } | null {
  const chainBranches = branches.filter((b) => b.chain === chain);
  if (chainBranches.length === 0) return null;

  let nearest = chainBranches[0];
  let minDist = haversineDistance(
    { lat: userLocation.lat, lng: userLocation.lng },
    { lat: nearest.lat, lng: nearest.lng }
  );

  for (let i = 1; i < chainBranches.length; i++) {
    const dist = haversineDistance(
      { lat: userLocation.lat, lng: userLocation.lng },
      { lat: chainBranches[i].lat, lng: chainBranches[i].lng }
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = chainBranches[i];
    }
  }

  return { branch: nearest, distanceMeters: minDist };
}

export function enrichDealsWithDistance(
  deals: Deal[],
  userLocation: UserLocation | null,
  branches: BranchLocation[] = STORE_LOCATIONS
): DealWithDistance[] {
  return deals.map((deal) => {
    if (!userLocation) {
      return { ...deal, nearestBranch: null, distanceMeters: null };
    }
    const result = findNearestBranch(userLocation, deal.chain, branches);
    return {
      ...deal,
      nearestBranch: result?.branch ?? null,
      distanceMeters: result?.distanceMeters ?? null,
    };
  });
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}
