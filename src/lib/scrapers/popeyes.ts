import type { ChainScraper, Deal } from "@/lib/types";
import { fetchHtml, parseHtml, buildDeal } from "./base";

/** Convert image filename to a readable deal title. */
function titleFromFilename(src: string): string {
  const filename = src.split("/").pop() ?? "";
  return filename
    .replace(/^(PLK|BK|PP)_/i, "")       // strip chain prefix
    .replace(/\.[a-z]+$/i, "")            // strip extension
    .replace(/_[a-f0-9]{8,}$/i, "")       // strip hash suffix
    .replace(/_(Landing_?Page?)$/i, "")   // strip "Landing_Page" suffix
    .replace(/_(KV|SC|DD|ST)(_|$)/gi, " ")
    .replace(/_copy_?\d*/i, "")
    .replace(/\d+x\d+.*/, "")
    .replace(/_\d+$/, "")
    .replace(/_/g, " ")
    .replace(/\s\d+$/, "")               // strip trailing " 04" sequence suffixes
    .replace(/\s+(Landing|Page)$/i, "")   // strip leftover "Landing" or "Page"
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Return true if the title is a known noise/non-deal banner. */
function isNoiseBanner(title: string): boolean {
  const lower = title.toLowerCase();
  const noiseWords = ["menu", "sides", "rice", "drinks", "beverages", "header", "banner", "footer"];
  if (title.length < 4) return true;
  if (/^\d/.test(title)) return true;
  if (noiseWords.some((w) => lower === w)) return true;
  return false;
}

export const popeyesScraper: ChainScraper = {
  chain: "popeyes",

  async scrape(): Promise<Deal[]> {
    const url = "https://popeyes.com.lk";
    const html = await fetchHtml(url);
    const $ = parseHtml(html);
    const deals: Deal[] = [];

    // Popeyes (operated by Softlogic) uses the same template as Burger King.
    // Special offers are image banners in #special_offers > #specialOffers_container.
    $("#special_offers #specialOffers_container").each((_, el) => {
      const dataSrc = $(el).find("img").first().attr("data-src");
      if (!dataSrc) return;

      const title = titleFromFilename(dataSrc);
      if (!title || isNoiseBanner(title)) return;

      deals.push(
        buildDeal("popeyes", {
          title,
          description: "Popeyes special offer — visit the nearest branch or call 0112 123 123 to order.",
          price: null,
          imageUrl: dataSrc.startsWith("http") ? dataSrc : `https://popeyes.com.lk${dataSrc}`,
          sourceUrl: url,
        })
      );
    });

    return deals;
  },
};
