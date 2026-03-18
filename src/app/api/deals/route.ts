import { NextResponse } from "next/server";
import { scrapeAllDeals } from "@/lib/scrapers/registry";
import { getCachedDeals, setCachedDeals } from "@/lib/cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;
export const preferredRegion = ["sin1"];

async function scrapeAndCache(cacheHeader: string) {
  const result = await scrapeAllDeals();
  setCachedDeals(result);

  return NextResponse.json(result, {
    headers: { "X-Cache": cacheHeader },
  });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const forceSync =
      url.searchParams.get("force") === "1" ||
      url.searchParams.get("sync") === "1";

    if (!forceSync) {
      const cached = getCachedDeals();
      if (cached) {
        return NextResponse.json(cached, {
          headers: { "X-Cache": "HIT" },
        });
      }
    }

    return await scrapeAndCache(forceSync ? "BYPASS" : "MISS");
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch deals",
        details:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    return await scrapeAndCache("BYPASS");
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to sync deals",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
