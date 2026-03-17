import { NextResponse } from "next/server";
import { scrapeAllDeals } from "@/lib/scrapers/registry";
import { getCachedDeals, setCachedDeals } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cached = getCachedDeals();
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "X-Cache": "HIT" },
      });
    }

    const result = await scrapeAllDeals();
    setCachedDeals(result);

    return NextResponse.json(result, {
      headers: { "X-Cache": "MISS" },
    });
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
