import type { Deal, ChainSlug } from "@/lib/types";
import crypto from "crypto";
import { CHAINS } from "./chains";

function makeDealId(chain: ChainSlug, title: string): string {
  return crypto
    .createHash("md5")
    .update(`${chain}:${title}`)
    .digest("hex")
    .slice(0, 12);
}

function fallbackDeal(
  chain: ChainSlug,
  title: string,
  description: string,
  price: string | null = null
): Deal {
  return {
    id: makeDealId(chain, title),
    chain,
    title,
    description,
    price,
    imageUrl: null,
    sourceUrl: CHAINS[chain].dealsPageUrl,
    validUntil: null,
    scrapedAt: new Date().toISOString(),
    isFallback: true,
  };
}

const FALLBACK_DEALS: Record<ChainSlug, Deal[]> = {
  kfc: [
    fallbackDeal(
      "kfc",
      "Wednesday Special Bucket",
      "Special KFC bucket deal available every Wednesday with selected pieces at a discounted price",
      "Rs. 2,490"
    ),
    fallbackDeal(
      "kfc",
      "Mega Meal for 4",
      "Family meal deal — 12 pieces of chicken with 4 sides and drinks",
      "Rs. 4,990"
    ),
    fallbackDeal(
      "kfc",
      "Zinger Combo",
      "Zinger burger, regular fries and a drink at a combo price",
      "Rs. 1,690"
    ),
  ],
  "pizza-hut": [
    fallbackDeal(
      "pizza-hut",
      "Buy 1 Get 1 Free",
      "Buy any large pizza and get one free — available on select days",
      null
    ),
    fallbackDeal(
      "pizza-hut",
      "Triple Treat Box",
      "3 pizzas starting from a special price — perfect for sharing",
      "Rs. 3,499"
    ),
    fallbackDeal(
      "pizza-hut",
      "Lunch Express",
      "Personal pan pizza with a drink at a special lunchtime price (11AM–3PM)",
      "Rs. 890"
    ),
  ],
  "burger-king": [
    fallbackDeal(
      "burger-king",
      "Whopper Wednesday",
      "Get the iconic Whopper at a special discounted price every Wednesday",
      "Rs. 990"
    ),
    fallbackDeal(
      "burger-king",
      "King Deal Combo",
      "Burger + fries + drink combo at a value price",
      "Rs. 1,290"
    ),
    fallbackDeal(
      "burger-king",
      "2 for 1 Signature Burgers",
      "Buy one signature burger and get the second one free on weekend evenings",
      null
    ),
  ],
  popeyes: [
    fallbackDeal(
      "popeyes",
      "Chicken Tuesday",
      "Special fried chicken deal every Tuesday — crispy Louisiana-style chicken",
      null
    ),
    fallbackDeal(
      "popeyes",
      "Family Feast",
      "8 pieces of chicken + 2 large sides + drinks — feeds the whole family",
      "Rs. 3,990"
    ),
    fallbackDeal(
      "popeyes",
      "Spicy Chicken Sandwich Combo",
      "Spicy chicken sandwich with fries and a drink at a combo price",
      "Rs. 1,490"
    ),
  ],
};

export function getFallbackDeals(chain: ChainSlug): Deal[] {
  return (FALLBACK_DEALS[chain] ?? []).map((deal) => ({
    ...deal,
    scrapedAt: new Date().toISOString(),
    isFallback: true,
  }));
}
