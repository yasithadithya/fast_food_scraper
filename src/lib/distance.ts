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
  chain: ChainSlug
): { branch: BranchLocation; distanceMeters: number } | null {
  const branches = STORE_LOCATIONS.filter((b) => b.chain === chain);
  if (branches.length === 0) return null;

  let nearest = branches[0];
  let minDist = haversineDistance(
    { lat: userLocation.lat, lng: userLocation.lng },
    { lat: nearest.lat, lng: nearest.lng }
  );

  for (let i = 1; i < branches.length; i++) {
    const dist = haversineDistance(
      { lat: userLocation.lat, lng: userLocation.lng },
      { lat: branches[i].lat, lng: branches[i].lng }
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = branches[i];
    }
  }

  return { branch: nearest, distanceMeters: minDist };
}

export function enrichDealsWithDistance(
  deals: Deal[],
  userLocation: UserLocation | null
): DealWithDistance[] {
  return deals.map((deal) => {
    if (!userLocation) {
      return { ...deal, nearestBranch: null, distanceMeters: null };
    }
    const result = findNearestBranch(userLocation, deal.chain);
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
