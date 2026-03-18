import type { ChainScraper, Deal } from "@/lib/types";
import { buildDeal } from "./base";

interface PizzaHutTokenResponse {
  access_token?: string;
}

interface PizzaHutOutlet {
  Code?: string;
  OutletCode?: string | null;
  IsActive?: boolean;
}

interface PizzaHutMenuItem {
  WebName?: string;
  Description?: string;
  DescriptionShort?: string;
  Price?: string | number | null;
  FullImageUrl?: string | null;
  ImageURL?: string | null;
  CategoryUrl?: string;
}

const API_BASE = "https://phapis.pizzahut.lk";
const TOKEN_SCOPE = process.env.PIZZA_HUT_TOKEN_SCOPE ?? "/vQFtb6VBYg";
const TOKEN_USERNAME =
  process.env.PIZZA_HUT_TOKEN_USERNAME ?? "JustWebUser";
const TOKEN_PASSWORD =
  process.env.PIZZA_HUT_TOKEN_PASSWORD ?? "nxNCtHIDOJVbGBa";
const DEFAULT_OUTLET_CODE = "AKU";

async function getAccessToken(): Promise<string | null> {
  try {
    const body = new URLSearchParams({
      username: TOKEN_USERNAME,
      password: TOKEN_PASSWORD,
      grant_type: "password",
      scope: TOKEN_SCOPE,
    });

    const res = await fetch(`${API_BASE}/gettoken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) return null;
    const json = (await res.json()) as PizzaHutTokenResponse;
    return json.access_token ?? null;
  } catch {
    return null;
  }
}

async function postApi<T>(
  path: string,
  token: string,
  body: unknown
): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}/api${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function normalizePrice(price: PizzaHutMenuItem["Price"]): string | null {
  if (price === null || price === undefined) return null;

  const numeric = typeof price === "number" ? price : Number(price);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;

  return `Rs. ${numeric.toLocaleString("en-LK", {
    maximumFractionDigits: 0,
  })}`;
}

function normalizeImageUrl(item: PizzaHutMenuItem): string | null {
  if (item.FullImageUrl && item.FullImageUrl.startsWith("http")) {
    return item.FullImageUrl;
  }

  if (item.ImageURL && item.ImageURL.startsWith("/")) {
    return `${API_BASE}${item.ImageURL}`;
  }

  return null;
}

export const pizzaHutScraper: ChainScraper = {
  chain: "pizza-hut",

  async scrape(): Promise<Deal[]> {
    const token = await getAccessToken();
    if (!token) return [];

    const outlets =
      (await postApi<PizzaHutOutlet[]>("/references/outlets", token, {})) ?? [];

    const outletCode =
      outlets.find((o) => o.IsActive && o.OutletCode)?.OutletCode ??
      outlets.find((o) => o.IsActive && o.Code)?.Code ??
      outlets.find((o) => o.OutletCode)?.OutletCode ??
      outlets.find((o) => o.Code)?.Code ??
      DEFAULT_OUTLET_CODE;

    const items =
      (await postApi<PizzaHutMenuItem[]>(
        `/menu/items?webCategory=promo&menuCategory=meal-deal&outletCode=${encodeURIComponent(
          outletCode
        )}`,
        token,
        ""
      )) ?? [];

    const seen = new Set<string>();

    const deals = items
      .map((item) => {
        const title = item.WebName?.trim();
        if (!title || seen.has(title)) return null;
        seen.add(title);

        const description =
          item.Description?.trim() ||
          item.DescriptionShort?.trim() ||
          "Pizza Hut meal deal from the promo menu.";

        return buildDeal("pizza-hut", {
          title,
          description,
          price: normalizePrice(item.Price),
          imageUrl: normalizeImageUrl(item),
          sourceUrl: "https://www.pizzahut.lk/menu/promo/meal-deal",
        });
      })
      .filter((deal): deal is Deal => deal !== null);

    return deals;
  },
};
