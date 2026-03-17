import { useQuery } from "@tanstack/react-query";
import type { LivePrice } from "./useMarketData";

// Contract address → our internal token ID + chain
// DexScreener supports multi-chain token lookups by address
const DEX_TOKENS = [
  // Ethereum meme coins
  { address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933", id: "pepe",   chain: "ethereum" },
  { address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", id: "shib",   chain: "ethereum" },
  { address: "0xcf0c122c6b73ff809c693db761e7baebe62b6a2e", id: "floki",  chain: "ethereum" },
  // Solana meme coins
  { address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",           id: "bonk",   chain: "solana" },
  { address: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",           id: "popcat", chain: "solana" },
] as const;

async function fetchDexPrices(): Promise<Record<string, LivePrice>> {
  // Batch all addresses in one request (DexScreener supports up to 30)
  const addresses = DEX_TOKENS.map(t => t.address).join(",");
  const res = await fetch(
    `https://api.dexscreener.com/latest/dex/tokens/${addresses}`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) throw new Error(`DexScreener ${res.status}`);

  const data = await res.json();
  const result: Record<string, LivePrice> = {};

  for (const token of DEX_TOKENS) {
    // Find all pairs where this token is the base asset on the right chain
    const pairs: any[] = (data.pairs ?? []).filter(
      (p: any) =>
        p.baseToken?.address?.toLowerCase() === token.address.toLowerCase() &&
        p.chainId === token.chain
    );
    if (!pairs.length) continue;

    // Pick the most liquid pair to get the most accurate price
    const best = [...pairs].sort(
      (a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0)
    )[0];

    const price = parseFloat(best.priceUsd ?? "0");
    if (!price) continue;

    result[token.id] = {
      price,
      change24h: best.priceChange?.h24 ?? 0,
      volume24h: best.volume?.h24 ?? 0,
      marketCap: best.fdv ?? 0,
    };
  }

  return result;
}

export function useDexScreener() {
  return useQuery<Record<string, LivePrice>>({
    queryKey:        ["dex-screener-data"],
    queryFn:         fetchDexPrices,
    refetchInterval: 60_000,
    staleTime:       30_000,
    retry:           1,
  });
}
