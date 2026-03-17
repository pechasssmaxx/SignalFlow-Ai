import { useMarketData } from "./useMarketData";
import { useDexScreener } from "./useDexScreener";
export type { LivePrice } from "./useMarketData";

/**
 * Unified hook that merges:
 *  - CoinGecko  → BTC, ETH, SOL, BNB, ARB, JUP, WIF, RNDR, TIA, PENDLE,
 *                  DOGE, SHIB, PEPE, BONK, POPCAT, FLOKI
 *  - DexScreener → PEPE, SHIB, FLOKI (ETH), BONK, POPCAT (SOL)
 *
 * DexScreener data takes precedence for meme coins since it reflects
 * real DEX liquidity more accurately than CoinGecko aggregates.
 */
export function useLivePrices() {
  const { data: cgData,  isLoading: cgLoading  } = useMarketData();
  const { data: dexData, isLoading: dexLoading } = useDexScreener();

  // Merge: CoinGecko first, DexScreener overwrites meme coin entries
  const data =
    cgData || dexData
      ? { ...(cgData ?? {}), ...(dexData ?? {}) }
      : undefined;

  return {
    data,
    isLoading: cgLoading || dexLoading,
    // true only if both sources have resolved at least once
    isLive: !!(cgData || dexData),
  };
}
