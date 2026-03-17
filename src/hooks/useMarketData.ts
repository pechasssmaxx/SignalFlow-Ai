import { useQuery } from "@tanstack/react-query";

export interface LivePrice {
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

// CoinGecko ID → our internal token ID
const CG_TO_LOCAL: Record<string, string> = {
  // Major coins
  bitcoin:                    "btc",
  solana:                     "sol",
  ethereum:                   "eth",
  arbitrum:                   "arb",
  "jupiter-exchange-solana":  "jup",
  "render-token":             "rndr",
  dogwifcoin:                 "wif",
  pendle:                     "pendle",
  celestia:                   "tia",
  binancecoin:                "bnb",
  // Meme coins (DexScreener will override these for accuracy)
  dogecoin:                   "doge",
  "shiba-inu":                "shib",
  pepe:                       "pepe",
  bonk:                       "bonk",
  popcat:                     "popcat",
  "floki":                    "floki",
};

const CG_IDS = Object.keys(CG_TO_LOCAL).join(",");

async function fetchPrices(): Promise<Record<string, LivePrice>> {
  const url =
    `https://api.coingecko.com/api/v3/simple/price` +
    `?ids=${CG_IDS}` +
    `&vs_currencies=usd` +
    `&include_24hr_change=true` +
    `&include_24hr_vol=true` +
    `&include_market_cap=true`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);

  const raw: Record<string, Record<string, number>> = await res.json();
  const result: Record<string, LivePrice> = {};

  for (const [cgId, data] of Object.entries(raw)) {
    const lp: LivePrice = {
      price:     data.usd            ?? 0,
      change24h: data.usd_24h_change ?? 0,
      volume24h: data.usd_24h_vol    ?? 0,
      marketCap: data.usd_market_cap ?? 0,
    };
    result[cgId] = lp;                      // accessible by CoinGecko ID
    const local = CG_TO_LOCAL[cgId];
    if (local) result[local] = lp;          // accessible by our short ID
  }

  return result;
}

export function useMarketData() {
  return useQuery<Record<string, LivePrice>>({
    queryKey: ["live-market-data"],
    queryFn: fetchPrices,
    refetchInterval: 60_000,   // refresh every 60 s
    staleTime:       30_000,
    retry: 1,
  });
}
