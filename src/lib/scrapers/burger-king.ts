import type { ChainScraper, Deal } from "@/lib/types";
import { fetchHtml, parseHtml, buildDeal } from "./base";

/** Convert an image filename to a readable deal title.
 *  e.g. "BK_Curry_Burger_07_cd7ab9ceb6.jpg" → "Curry Burger"
 *       "BK_Family_Combo_10_f788248d04.jpg"  → "Family Combo"
 */
function titleFromFilename(src: string): string {
  const filename = src.split("/").pop() ?? "";
  return filename
    .replace(/^(BK|PLK|POP)_/i, "")       // strip chain prefix
    .replace(/\.[a-z]+$/i, "")             // strip extension
    .replace(/_[a-f0-9]{8,}$/i, "")        // strip hash suffix
    .replace(/_(Landing_?Page?)$/i, "")    // strip "Landing_Page" suffix
    .replace(/_(KV|SC|DD|ST)(_|$)/gi, " ")// strip design shortcodes
    .replace(/_copy_?\d*/i, "")            // strip "_copy" variants
    .replace(/\d+x\d+.*/, "")             // strip dimension patterns like "2x950"
    .replace(/_\d+$/, "")                 // strip trailing sequence number
    .replace(/_/g, " ")                    // underscores → spaces
    .replace(/\s\d+$/, "")               // strip trailing " 04" sequence suffixes
    .replace(/\s+(Landing|Page)$/i, "")   // strip leftover "Landing" or "Page"
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()); // title case
}

/** Return true if the derived title is a known noise/non-deal banner. */
function isNoiseBanner(title: string): boolean {
  const lower = title.toLowerCase();
  const noiseWords = ["menu", "sides", "rice", "drinks", "beverages", "header", "banner", "footer", "slo", "kv"];
  if (title.length < 4) return true;
  if (/^\d/.test(title)) return true; // starts with a number (dimensional banners)
  if (noiseWords.some((w) => lower === w)) return true;
  return false;
}

export const burgerKingScraper: ChainScraper = {
  chain: "burger-king",

  async scrape(): Promise<Deal[]> {
    const url = "https://burgerking.lk";
    const html = await fetchHtml(url);
    const $ = parseHtml(html);
    const deals: Deal[] = [];

    // BK's deals are image banners only — no text in the HTML.
    // The special offers section (#special_offers) holds #specialOffers_container
    // divs each with img#specialOffers_img[data-src].
    $("#special_offers #specialOffers_container").each((_, el) => {
      const dataSrc = $(el).find("img").first().attr("data-src");
      if (!dataSrc) return;

      const title = titleFromFilename(dataSrc);
      if (!title || isNoiseBanner(title)) return;

      deals.push(
        buildDeal("burger-king", {
          title,
          description: "Burger King special offer — visit the nearest branch or call 0112 123 123 to order.",
          price: null,
          imageUrl: dataSrc.startsWith("http") ? dataSrc : `https://burgerking.lk${dataSrc}`,
          sourceUrl: url,
        })
      );
    });

    return deals;
  },
};
