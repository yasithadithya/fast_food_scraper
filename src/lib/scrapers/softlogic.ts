import type { ChainScraper, ChainSlug, Deal } from "@/lib/types";
import { fetchHtml, parseHtml, buildDeal } from "./base";

/**
 * Shared scraper for Softlogic-operated brand sites (Burger King, Popeyes).
 * These sites publish promotions as image-only banners with no text — the deal
 * name has to be reverse-engineered from the image filename. Both sites use the
 * same CMS template, so the logic lives here once and is parameterized per chain.
 */
export interface SoftlogicConfig {
  chain: ChainSlug;
  url: string;
  /** Absolute host prepended to relative `/uploads/...` image paths. */
  imageHost: string;
  /** Regex matching the chain filename prefix, e.g. /^(BK|PLK|POP|PP)_/i. */
  prefixRegex: RegExp;
  description: string;
}

/** Filename fragments that identify site chrome rather than a promotion. */
const FILENAME_NOISE =
  /(header|logo|background|footer|favicon|icon|artboard|space|placeholder)/i;

/** Design shortcodes embedded in filenames that aren't part of the deal name. */
const SHORTCODES = /_(KV|SC|DD|ST|LP)(?=_|$)/gi;

/** Acronyms that should stay uppercase after title-casing. */
const ACRONYMS = /\b(Bogo|Lto|Bbq|Xl|Bk)\b/g;

/** Generic single-word titles that aren't real deals. */
const NOISE_WORDS = new Set([
  "menu",
  "sides",
  "rice",
  "drinks",
  "beverages",
  "combo",
  "new",
  "offer",
  "banner",
]);

/** Convert an image filename to a readable deal title.
 *  e.g. "BK_Serata_Dekak_01_bb98c66267.jpg" → "Serata Dekak"
 *       "PLK_Sandwich_BOGO_KV_b481298226.jpg" → "Sandwich BOGO"
 */
export function titleFromFilename(src: string, prefixRegex: RegExp): string {
  const filename = src.split("/").pop() ?? "";
  const title = filename
    .replace(/\.[a-z0-9]+$/i, "") // strip extension
    .replace(prefixRegex, "") // strip chain prefix
    .replace(/_[a-f0-9]{8,}$/i, "") // strip hash suffix
    .replace(/_copy(_?\d+)?/gi, "") // strip "_copy" variants
    .replace(SHORTCODES, "") // strip design shortcodes
    .replace(/_?\d+x\d+\S*/gi, "") // strip dimension patterns (1436x517)
    .replace(/_+/g, " ") // underscores → spaces
    .replace(/\s+\d+\s*$/, "") // strip trailing sequence number
    .replace(/\b(landing|page)\b/gi, "") // strip leftover template words
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) // title case
    .replace(ACRONYMS, (m) => m.toUpperCase());
  return title;
}

/** Return true if the derived title is a known noise/non-deal banner. */
export function isNoiseTitle(title: string): boolean {
  if (title.length < 4) return true;
  if (/^\d/.test(title)) return true; // starts with a number (dimensional banners)
  return NOISE_WORDS.has(title.toLowerCase());
}

export function createSoftlogicScraper(config: SoftlogicConfig): ChainScraper {
  return {
    chain: config.chain,

    async scrape(): Promise<Deal[]> {
      const html = await fetchHtml(config.url);
      const $ = parseHtml(html);
      const deals: Deal[] = [];
      const seen = new Set<string>();

      // Promotions are `img[data-src]` banners served from /uploads/. They live
      // in menu/premium containers and are duplicated across desktop/mobile
      // layouts, so we select broadly and dedupe by derived title.
      $("img[data-src]").each((_, el) => {
        const dataSrc = $(el).attr("data-src");
        if (!dataSrc || !dataSrc.includes("/uploads/")) return;
        if (FILENAME_NOISE.test(dataSrc.split("/").pop() ?? "")) return;

        const title = titleFromFilename(dataSrc, config.prefixRegex);
        if (!title || isNoiseTitle(title) || seen.has(title)) return;
        seen.add(title);

        deals.push(
          buildDeal(config.chain, {
            title,
            description: config.description,
            price: null,
            imageUrl: dataSrc.startsWith("http")
              ? dataSrc
              : `${config.imageHost}${dataSrc}`,
            sourceUrl: config.url,
          })
        );
      });

      return deals;
    },
  };
}
