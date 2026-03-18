import type { ChainInfo, ChainSlug } from "@/lib/types";

export const CHAINS: Record<ChainSlug, ChainInfo> = {
  kfc: {
    slug: "kfc",
    name: "KFC",
    baseUrl: "https://kfc.lk",
    brandColor: "#E4002B",
    dealsPageUrl: "https://kfc.lk/menu/promotions",
  },
  "pizza-hut": {
    slug: "pizza-hut",
    name: "Pizza Hut",
    baseUrl: "https://pizzahut.lk",
    brandColor: "#EE3A24",
    dealsPageUrl: "https://www.pizzahut.lk/menu/promo/meal-deal",
  },
  "burger-king": {
    slug: "burger-king",
    name: "Burger King",
    baseUrl: "https://burgerking.lk",
    brandColor: "#FF8732",
    dealsPageUrl: "https://burgerking.lk",
  },
  popeyes: {
    slug: "popeyes",
    name: "Popeyes",
    baseUrl: "https://popeyes.com.lk",
    brandColor: "#F15A22",
    dealsPageUrl: "https://popeyes.com.lk",
  },
};

export const CHAIN_SLUGS = Object.keys(CHAINS) as ChainSlug[];
