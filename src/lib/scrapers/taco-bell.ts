import type { ChainScraper, Deal } from "@/lib/types";

export const tacoBellScraper: ChainScraper = {
  chain: "taco-bell",

  async scrape(): Promise<Deal[]> {
    // tacobell.lk is a placeholder page that immediately redirects to their
    // Facebook page via <meta http-equiv="refresh"> — no scrapable content.
    // The registry will fall back to curated deals for this chain.
    return [];
  },
};
