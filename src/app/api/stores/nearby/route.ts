import haversineDistance from "haversine-distance";
import { NextResponse } from "next/server";
import { CHAINS, CHAIN_SLUGS } from "@/lib/data/chains";
import { STORE_LOCATIONS } from "@/lib/data/store-locations";
import type { BranchLocation, ChainSlug } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEFAULT_RADIUS_METERS = 25000;
const MAX_RADIUS_METERS = 50000;

interface GoogleNearbyResult {
  place_id: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
  geometry?: {
    location?: {
      lat?: number;
      lng?: number;
    };
  };
}

interface GoogleNearbyResponse {
  status: string;
  error_message?: string;
  results?: GoogleNearbyResult[];
}

function parseNumber(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function clampRadius(radius: number | null): number {
  if (!radius || radius <= 0) return DEFAULT_RADIUS_METERS;
  return Math.min(Math.round(radius), MAX_RADIUS_METERS);
}

function getCity(address: string): string {
  const parts = address
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length >= 2) return parts[parts.length - 2];
  return parts[0] ?? "";
}

function toFallbackNearbyBranches(
  lat: number,
  lng: number,
  radiusMeters: number
): BranchLocation[] {
  return STORE_LOCATIONS.filter((branch) => {
    const distance = haversineDistance(
      { lat, lng },
      { lat: branch.lat, lng: branch.lng }
    );
    return distance <= radiusMeters;
  });
}

async function fetchNearbyForChain(
  chain: ChainSlug,
  lat: number,
  lng: number,
  radiusMeters: number,
  apiKey: string
): Promise<BranchLocation[]> {
  const chainName = CHAINS[chain].name;

  const params = new URLSearchParams({
    key: apiKey,
    location: `${lat},${lng}`,
    radius: radiusMeters.toString(),
    type: "restaurant",
    keyword: chainName,
  });

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Google Places HTTP ${response.status}`);
  }

  const data: GoogleNearbyResponse = await response.json();
  if (data.status === "ZERO_RESULTS") return [];

  if (data.status !== "OK") {
    throw new Error(data.error_message || `Google Places status ${data.status}`);
  }

  return (data.results ?? [])
    .map((place): BranchLocation | null => {
      const placeLat = place.geometry?.location?.lat;
      const placeLng = place.geometry?.location?.lng;
      if (
        typeof placeLat !== "number" ||
        !Number.isFinite(placeLat) ||
        typeof placeLng !== "number" ||
        !Number.isFinite(placeLng)
      ) {
        return null;
      }

      const address = place.vicinity || place.formatted_address || "";
      return {
        chain,
        name: place.name,
        lat: placeLat,
        lng: placeLng,
        address,
        city: getCity(address),
        placeId: place.place_id,
      };
    })
    .filter((branch): branch is BranchLocation => branch !== null);
}

function dedupeBranches(branches: BranchLocation[]): BranchLocation[] {
  const seen = new Set<string>();
  const deduped: BranchLocation[] = [];

  for (const branch of branches) {
    const id = branch.placeId || `${branch.chain}:${branch.name}:${branch.lat}:${branch.lng}`;
    if (seen.has(id)) continue;
    seen.add(id);
    deduped.push(branch);
  }

  return deduped;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const lat = parseNumber(url.searchParams.get("lat"));
    const lng = parseNumber(url.searchParams.get("lng"));
    const radiusMeters = clampRadius(parseNumber(url.searchParams.get("radius")));

    if (lat === null || lng === null) {
      return NextResponse.json(
        { error: "lat and lng query params are required" },
        { status: 400 }
      );
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: "lat must be in [-90, 90] and lng in [-180, 180]" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        source: "fallback",
        fallbackReason: "missing_api_key",
        branches: toFallbackNearbyBranches(lat, lng, radiusMeters),
        errors: CHAIN_SLUGS.map((chain) => ({
          chain,
          message: "GOOGLE_MAPS_API_KEY is not configured",
        })),
      });
    }

    const perChain = await Promise.all(
      CHAIN_SLUGS.map(async (chain) => {
        try {
          const branches = await fetchNearbyForChain(
            chain,
            lat,
            lng,
            radiusMeters,
            apiKey
          );
          return { chain, branches, error: null as string | null };
        } catch (error) {
          return {
            chain,
            branches: [] as BranchLocation[],
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      })
    );

    const allBranches = dedupeBranches(
      perChain.flatMap((entry) => entry.branches)
    );

    const errors = perChain
      .filter((entry) => entry.error)
      .map((entry) => ({ chain: entry.chain, message: entry.error as string }));

    if (allBranches.length === 0) {
      return NextResponse.json({
        source: "fallback",
        fallbackReason: errors.length > 0 ? "google_error" : "google_empty",
        branches: toFallbackNearbyBranches(lat, lng, radiusMeters),
        errors,
      });
    }

    return NextResponse.json({
      source: "google",
      branches: allBranches,
      errors,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch nearby stores",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
