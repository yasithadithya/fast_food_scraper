import { createSoftlogicScraper } from "./softlogic";

// Popeyes LK (Softlogic) uses the same template as Burger King:
// promos are image banners under /uploads/.
export const popeyesScraper = createSoftlogicScraper({
  chain: "popeyes",
  url: "https://popeyes.com.lk",
  imageHost: "https://popeyes.com.lk",
  prefixRegex: /^(PLK|POP|PP|BK)_/i,
  description:
    "Popeyes Sri Lanka featured offer. Tap the source link to view details on the official site.",
});
