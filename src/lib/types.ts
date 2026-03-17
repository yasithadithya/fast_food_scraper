export type ChainSlug =
  | "kfc"
  | "pizza-hut"
  | "burger-king"
  | "popeyes"
  | "taco-bell";

export interface ChainInfo {
  slug: ChainSlug;
  name: string;
  baseUrl: string;
  brandColor: string;
  dealsPageUrl: string;
}

export interface Deal {
  id: string;
  chain: ChainSlug;
  title: string;
  description: string;
  price: string | null;
  imageUrl: string | null;
  sourceUrl: string;
  validUntil: string | null;
  scrapedAt: string;
  isFallback: boolean;
}

export interface BranchLocation {
  chain: ChainSlug;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
}

export interface DealWithDistance extends Deal {
  nearestBranch: BranchLocation | null;
  distanceMeters: number | null;
}

export interface DealsApiResponse {
  deals: Deal[];
  scrapedAt: string;
  errors: ScraperError[];
}

export interface ScraperError {
  chain: ChainSlug;
  message: string;
  usedFallback: boolean;
}

export interface ChainScraper {
  chain: ChainSlug;
  scrape(): Promise<Deal[]>;
}
