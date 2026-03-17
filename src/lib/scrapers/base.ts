import * as cheerio from "cheerio";
import type { Deal, ChainSlug } from "@/lib/types";
import crypto from "crypto";

export async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}

export function parseHtml(html: string) {
  return cheerio.load(html);
}

export function dealId(chain: ChainSlug, title: string): string {
  return crypto
    .createHash("md5")
    .update(`${chain}:${title}`)
    .digest("hex")
    .slice(0, 12);
}

export function buildDeal(
  chain: ChainSlug,
  fields: Pick<Deal, "title" | "description"> &
    Partial<Pick<Deal, "price" | "imageUrl" | "validUntil" | "sourceUrl">>
): Deal {
  return {
    id: dealId(chain, fields.title),
    chain,
    title: fields.title,
    description: fields.description,
    price: fields.price ?? null,
    imageUrl: fields.imageUrl ?? null,
    sourceUrl: fields.sourceUrl ?? "",
    validUntil: fields.validUntil ?? null,
    scrapedAt: new Date().toISOString(),
    isFallback: false,
  };
}
