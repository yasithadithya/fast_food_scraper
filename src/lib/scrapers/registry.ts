import type { Deal, DealsApiResponse, ScraperError, ChainScraper } from "@/lib/types";
import { kfcScraper } from "./kfc";
import { pizzaHutScraper } from "./pizza-hut";
import { burgerKingScraper } from "./burger-king";
import { popeyesScraper } from "./popeyes";
import { tacoBellScraper } from "./taco-bell";
import { getFallbackDeals } from "@/lib/data/fallback-deals";

const scrapers: ChainScraper[] = [
  kfcScraper,
  pizzaHutScraper,
  burgerKingScraper,
  popeyesScraper,
  tacoBellScraper,
];

export async function scrapeAllDeals(): Promise<DealsApiResponse> {
  const results = await Promise.allSettled(
    scrapers.map(async (scraper) => ({
      chain: scraper.chain,
      deals: await scraper.scrape(),
    }))
  );

  const allDeals: Deal[] = [];
  const errors: ScraperError[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const chain = scrapers[i].chain;

    if (result.status === "fulfilled") {
      const { deals } = result.value;
      if (deals.length > 0) {
        allDeals.push(...deals);
      } else {
        const fallback = getFallbackDeals(chain);
        allDeals.push(...fallback);
        errors.push({
          chain,
          message: "No deals found on site, using curated deals",
          usedFallback: true,
        });
      }
    } else {
      const fallback = getFallbackDeals(chain);
      allDeals.push(...fallback);
      errors.push({
        chain,
        message:
          result.reason instanceof Error
            ? result.reason.message
            : "Scraper failed",
        usedFallback: true,
      });
    }
  }

  return {
    deals: allDeals,
    scrapedAt: new Date().toISOString(),
    errors,
  };
}
