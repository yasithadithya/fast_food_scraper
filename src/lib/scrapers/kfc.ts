import type { ChainScraper, Deal } from "@/lib/types";
import { fetchHtml, parseHtml, buildDeal } from "./base";

const BASE_URL = "https://kfc.lk";

// KFC splits its priced deals across several menu pages. The dedicated
// "promotions" page carries limited-time specials, "promo" carries the bucket
// deals, and "meals-and-beverages" carries the combos. We scrape all of them
// and dedupe by product name so one page being empty/down doesn't lose the rest.
const DEAL_PAGES = [
  "/menu/promotions",
  "/menu/promo",
  "/menu/meals-and-beverages",
];

// KFC server-renders each product inside a `.itemContainer` card:
//   h3.menu-item-name[title]   — full product name (truncated in text node)
//   p.menu-item-desc[title]    — full description
//   span.price                 — price like "+ Rs. 2,990"
//   img.data-gtag-item-image   — absolute src URL
function parseItems(html: string, seen: Set<string>): Deal[] {
  const $ = parseHtml(html);
  const deals: Deal[] = [];

  $(".itemContainer").each((_, el) => {
    const title =
      $(el).find("h3.menu-item-name").first().attr("title")?.trim() ||
      $(el).find("h3.menu-item-name").first().text().trim();

    if (!title || seen.has(title)) return;
    seen.add(title);

    const description =
      $(el).find("p.menu-item-desc").first().attr("title")?.trim() || "";

    // Price is "Rs. 2,990" or "+  Rs. 2,990" — strip the leading "+ ".
    const rawPrice = $(el).find("span.price").first().text().trim();
    const price = rawPrice ? rawPrice.replace(/^\+\s*/, "").trim() : null;

    const imgSrc =
      $(el).find("img.data-gtag-item-image").first().attr("src") || null;

    deals.push(
      buildDeal("kfc", {
        title,
        description,
        price,
        imageUrl: imgSrc?.startsWith("http") ? imgSrc : null,
        sourceUrl: `${BASE_URL}${DEAL_PAGES[0]}`,
      })
    );
  });

  return deals;
}

export const kfcScraper: ChainScraper = {
  chain: "kfc",

  async scrape(): Promise<Deal[]> {
    const pages = await Promise.allSettled(
      DEAL_PAGES.map((path) => fetchHtml(`${BASE_URL}${path}`))
    );

    const deals: Deal[] = [];
    const seen = new Set<string>();

    pages.forEach((page, i) => {
      if (page.status === "fulfilled") {
        deals.push(...parseItems(page.value, seen));
      } else {
        console.error(
          `KFC page ${DEAL_PAGES[i]} failed:`,
          page.reason instanceof Error ? page.reason.message : page.reason
        );
      }
    });

    return deals;
  },
};
