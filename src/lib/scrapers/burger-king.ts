import { createSoftlogicScraper } from "./softlogic";

// Burger King LK (Softlogic) publishes promos as image banners under /uploads/.
export const burgerKingScraper = createSoftlogicScraper({
  chain: "burger-king",
  url: "https://burgerking.lk",
  imageHost: "https://burgerking.lk",
  prefixRegex: /^(BK|PLK|POP|PP)_/i,
  description:
    "Burger King Sri Lanka featured offer. Tap the source link to view details on the official site.",
});
