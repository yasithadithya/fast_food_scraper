import * as cheerio from "cheerio";
import type { Deal, ChainSlug } from "@/lib/types";
import crypto from "crypto";

const MAX_ATTEMPTS = 3;

/** Non-retryable client-error status: retrying won't change the outcome. */
class HttpClientError extends Error {}

async function fetchHtmlOnce(url: string): Promise<string> {
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
    if (!res.ok) {
      const message = `HTTP ${res.status} from ${url}`;
      // 4xx is a client error — don't retry, it won't fix itself.
      if (res.status >= 400 && res.status < 500) {
        throw new HttpClientError(message);
      }
      throw new Error(message);
    }
    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchHtml(url: string): Promise<string> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fetchHtmlOnce(url);
    } catch (error) {
      lastError = error;
      // Client errors (4xx) and the final attempt are not retried.
      if (error instanceof HttpClientError || attempt === MAX_ATTEMPTS) {
        break;
      }
      // Exponential backoff: ~400ms, ~800ms.
      await new Promise((resolve) => setTimeout(resolve, 400 * 2 ** (attempt - 1)));
    }
  }
  throw lastError;
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
