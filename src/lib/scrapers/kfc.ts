import type { ChainScraper, Deal } from "@/lib/types";
import { fetchHtml, parseHtml, buildDeal } from "./base";

export const kfcScraper: ChainScraper = {
  chain: "kfc",

  async scrape(): Promise<Deal[]> {
    const url = "https://kfc.lk/menu/promotions";
    const html = await fetchHtml(url);
    const $ = parseHtml(html);
    const deals: Deal[] = [];
    const seen = new Set<string>();

    // KFC server-renders promotion items inside .itemContainer cards.
    // Each card has:
    //   h3.menu-item-name[title]   — full product name (truncated in text node)
    //   p.menu-item-desc[title]    — full description
    //   span.price                 — price like "+ Rs. 2,990"
    //   img.data-gtag-item-image   — absolute src URL
    $(".itemContainer").each((_, el) => {
      // Use the title attribute for the full untruncated name
      const title =
        $(el).find("h3.menu-item-name").first().attr("title")?.trim() ||
        $(el).find("h3.menu-item-name").first().text().trim();

      if (!title || seen.has(title)) return;
      seen.add(title);

      const description =
        $(el).find("p.menu-item-desc").first().attr("title")?.trim() || "";

      // Price is "Rs. 2,990" or "+  Rs. 2,990" — strip leading "+ "
      const rawPrice = $(el).find("span.price").first().text().trim();
      const price = rawPrice
        ? rawPrice.replace(/^\+\s*/, "").trim()
        : null;

      const imgSrc =
        $(el).find("img.data-gtag-item-image").first().attr("src") || null;

      deals.push(
        buildDeal("kfc", {
          title,
          description,
          price,
          imageUrl: imgSrc?.startsWith("http") ? imgSrc : null,
          sourceUrl: url,
        })
      );
    });

    return deals;
  },
};

