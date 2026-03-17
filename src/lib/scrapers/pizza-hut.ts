import type { ChainScraper, Deal } from "@/lib/types";
import { buildDeal } from "./base";

export const pizzaHutScraper: ChainScraper = {
  chain: "pizza-hut",

  async scrape(): Promise<Deal[]> {
    // Pizza Hut SL is a fully client-rendered SPA.
    // Attempt to find and call their underlying API.
    const apiUrls = [
      "https://pizzahut.lk/api/promotions",
      "https://pizzahut.lk/api/offers",
      "https://pizzahut.lk/api/v1/promotions",
      "https://pizzahut.lk/api/deals",
    ];

    for (const url of apiUrls) {
      try {
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          signal: AbortSignal.timeout(10_000),
        });

        if (!res.ok) continue;

        const data = await res.json();
        const items: Array<Record<string, string>> =
          data.promotions ?? data.offers ?? data.deals ?? data.data ?? [];

        if (!Array.isArray(items) || items.length === 0) continue;

        const deals: Deal[] = items.map(
          (item: Record<string, string>) =>
            buildDeal("pizza-hut", {
              title: item.title ?? item.name ?? "Pizza Hut Deal",
              description: item.description ?? "",
              price: item.price ?? null,
              imageUrl: item.image ?? item.imageUrl ?? null,
              sourceUrl: "https://pizzahut.lk",
            })
        );

        if (deals.length > 0) return deals;
      } catch {
        // Try next URL
      }
    }

    // SPA — cheerio won't help. Return empty, registry will use fallback.
    return [];
  },
};
