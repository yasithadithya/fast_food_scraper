import type { BranchLocation } from "@/lib/types";

export const STORE_LOCATIONS: BranchLocation[] = [
  // ── KFC ──
  { chain: "kfc", name: "KFC Colpetty", lat: 6.9107, lng: 79.8538, address: "350 Galle Road, Colombo 3", city: "Colombo" },
  { chain: "kfc", name: "KFC Bambalapitiya", lat: 6.8942, lng: 79.8561, address: "Galle Road, Colombo 4", city: "Colombo" },
  { chain: "kfc", name: "KFC Nugegoda", lat: 6.8728, lng: 79.8893, address: "High Level Road, Nugegoda", city: "Nugegoda" },
  { chain: "kfc", name: "KFC Dehiwala", lat: 6.8567, lng: 79.8650, address: "Galle Road, Dehiwala", city: "Dehiwala" },
  { chain: "kfc", name: "KFC Maharagama", lat: 6.8468, lng: 79.9267, address: "High Level Road, Maharagama", city: "Maharagama" },
  { chain: "kfc", name: "KFC Kandy", lat: 7.2906, lng: 80.6337, address: "Dalada Veediya, Kandy", city: "Kandy" },
  { chain: "kfc", name: "KFC Galle", lat: 6.0328, lng: 80.2170, address: "Main Street, Galle", city: "Galle" },
  { chain: "kfc", name: "KFC Negombo", lat: 7.2084, lng: 79.8358, address: "Main Street, Negombo", city: "Negombo" },
  { chain: "kfc", name: "KFC Wattala", lat: 6.9891, lng: 79.8912, address: "Negombo Road, Wattala", city: "Wattala" },
  { chain: "kfc", name: "KFC Kiribathgoda", lat: 7.0281, lng: 79.9275, address: "Kandy Road, Kiribathgoda", city: "Kiribathgoda" },
  { chain: "kfc", name: "KFC Kaduwela", lat: 6.9312, lng: 79.9836, address: "Avissawella Road, Kaduwela", city: "Kaduwela" },
  { chain: "kfc", name: "KFC Piliyandala", lat: 6.7983, lng: 79.9222, address: "Piliyandala Road", city: "Piliyandala" },
  { chain: "kfc", name: "KFC Ja-Ela", lat: 7.0741, lng: 79.8912, address: "Negombo Road, Ja-Ela", city: "Ja-Ela" },
  { chain: "kfc", name: "KFC Malabe", lat: 6.9020, lng: 79.9580, address: "Athurugiriya Road, Malabe", city: "Malabe" },
  { chain: "kfc", name: "KFC Borella", lat: 6.9252, lng: 79.8752, address: "Baseline Road, Borella", city: "Colombo" },
  { chain: "kfc", name: "KFC Matara", lat: 5.9485, lng: 80.5353, address: "Main Street, Matara", city: "Matara" },
  { chain: "kfc", name: "KFC Kurunegala", lat: 7.4863, lng: 80.3623, address: "Colombo Road, Kurunegala", city: "Kurunegala" },

  // ── Pizza Hut ──
  { chain: "pizza-hut", name: "Pizza Hut Colombo 3", lat: 6.9108, lng: 79.8554, address: "Galle Road, Colombo 3", city: "Colombo" },
  { chain: "pizza-hut", name: "Pizza Hut Colombo 7", lat: 6.9147, lng: 79.8641, address: "Park Street, Colombo 7", city: "Colombo" },
  { chain: "pizza-hut", name: "Pizza Hut Nugegoda", lat: 6.8720, lng: 79.8890, address: "High Level Road, Nugegoda", city: "Nugegoda" },
  { chain: "pizza-hut", name: "Pizza Hut Dehiwala", lat: 6.8550, lng: 79.8640, address: "Galle Road, Dehiwala", city: "Dehiwala" },
  { chain: "pizza-hut", name: "Pizza Hut Kandy", lat: 7.2910, lng: 80.6340, address: "Dalada Veediya, Kandy", city: "Kandy" },
  { chain: "pizza-hut", name: "Pizza Hut Negombo", lat: 7.2090, lng: 79.8360, address: "Main Street, Negombo", city: "Negombo" },
  { chain: "pizza-hut", name: "Pizza Hut Wattala", lat: 6.9895, lng: 79.8910, address: "Negombo Road, Wattala", city: "Wattala" },
  { chain: "pizza-hut", name: "Pizza Hut Maharagama", lat: 6.8470, lng: 79.9270, address: "High Level Road, Maharagama", city: "Maharagama" },
  { chain: "pizza-hut", name: "Pizza Hut Rajagiriya", lat: 6.9080, lng: 79.8950, address: "Rajagiriya Road", city: "Rajagiriya" },
  { chain: "pizza-hut", name: "Pizza Hut Kaduwela", lat: 6.9315, lng: 79.9840, address: "Avissawella Road, Kaduwela", city: "Kaduwela" },
  { chain: "pizza-hut", name: "Pizza Hut Galle", lat: 6.0330, lng: 80.2175, address: "Main Street, Galle", city: "Galle" },
  { chain: "pizza-hut", name: "Pizza Hut Borella", lat: 6.9250, lng: 79.8750, address: "Baseline Road, Borella", city: "Colombo" },
  { chain: "pizza-hut", name: "Pizza Hut Matara", lat: 5.9490, lng: 80.5355, address: "Main Street, Matara", city: "Matara" },

  // ── Burger King ──
  { chain: "burger-king", name: "Burger King Colombo City Centre", lat: 6.9271, lng: 79.8612, address: "Colombo City Centre, Sir James Peiris Mawatha", city: "Colombo" },
  { chain: "burger-king", name: "Burger King Colpetty", lat: 6.9110, lng: 79.8530, address: "Galle Road, Colombo 3", city: "Colombo" },
  { chain: "burger-king", name: "Burger King One Galle Face", lat: 6.9220, lng: 79.8448, address: "One Galle Face Mall, Colombo 2", city: "Colombo" },
  { chain: "burger-king", name: "Burger King Dehiwala", lat: 6.8555, lng: 79.8645, address: "Galle Road, Dehiwala", city: "Dehiwala" },
  { chain: "burger-king", name: "Burger King Nugegoda", lat: 6.8725, lng: 79.8895, address: "High Level Road, Nugegoda", city: "Nugegoda" },
  { chain: "burger-king", name: "Burger King Maharagama", lat: 6.8465, lng: 79.9265, address: "High Level Road, Maharagama", city: "Maharagama" },
  { chain: "burger-king", name: "Burger King Wattala", lat: 6.9890, lng: 79.8915, address: "Negombo Road, Wattala", city: "Wattala" },
  { chain: "burger-king", name: "Burger King Kandy", lat: 7.2905, lng: 80.6335, address: "Dalada Veediya, Kandy", city: "Kandy" },
  { chain: "burger-king", name: "Burger King Kaduwela", lat: 6.9310, lng: 79.9835, address: "Avissawella Road, Kaduwela", city: "Kaduwela" },
  { chain: "burger-king", name: "Burger King Kiribathgoda", lat: 7.0280, lng: 79.9270, address: "Kandy Road, Kiribathgoda", city: "Kiribathgoda" },
  { chain: "burger-king", name: "Burger King Negombo", lat: 7.2085, lng: 79.8355, address: "Main Street, Negombo", city: "Negombo" },
  { chain: "burger-king", name: "Burger King Rajagiriya", lat: 6.9085, lng: 79.8955, address: "Rajagiriya Road", city: "Rajagiriya" },

  // ── Popeyes ──
  { chain: "popeyes", name: "Popeyes Colombo 3", lat: 6.9115, lng: 79.8540, address: "Galle Road, Colombo 3", city: "Colombo" },
  { chain: "popeyes", name: "Popeyes One Galle Face", lat: 6.9222, lng: 79.8450, address: "One Galle Face Mall, Colombo 2", city: "Colombo" },
  { chain: "popeyes", name: "Popeyes Nugegoda", lat: 6.8730, lng: 79.8892, address: "High Level Road, Nugegoda", city: "Nugegoda" },
  { chain: "popeyes", name: "Popeyes Dehiwala", lat: 6.8560, lng: 79.8648, address: "Galle Road, Dehiwala", city: "Dehiwala" },
  { chain: "popeyes", name: "Popeyes Wattala", lat: 6.9893, lng: 79.8914, address: "Negombo Road, Wattala", city: "Wattala" },
  { chain: "popeyes", name: "Popeyes Maharagama", lat: 6.8468, lng: 79.9268, address: "High Level Road, Maharagama", city: "Maharagama" },
];

export function getBranchesByChain(chain: string): BranchLocation[] {
  return STORE_LOCATIONS.filter((b) => b.chain === chain);
}
