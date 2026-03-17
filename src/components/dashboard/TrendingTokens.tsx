import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { tokens, formatPrice, formatNumber } from "@/data/mockData";
import { useLivePrices } from "@/hooks/useLivePrices";

const CONFLUENCE_BUY = new Set(["SOL", "ETH", "WIF", "RNDR"]);
const CONFLUENCE_SELL = new Set(["JUP"]);

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <path d="M7 1.5l1.5 3.2 3.5.5-2.5 2.4.6 3.5L7 9.5l-3.1 1.6.6-3.5L2 5.2l3.5-.5z" />
  </svg>
);

function loadWatchlist(): Set<string> {
  try {
    const raw = localStorage.getItem("ss_watchlist");
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

const TrendingTokens = () => {
  const [watchlist, setWatchlist] = useState<Set<string>>(loadWatchlist);
  const { data: liveData, isLive } = useLivePrices();

  useEffect(() => {
    localStorage.setItem("ss_watchlist", JSON.stringify([...watchlist]));
  }, [watchlist]);

  const toggleWatch = (symbol: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWatchlist(prev => {
      const next = new Set(prev);
      next.has(symbol) ? next.delete(symbol) : next.add(symbol);
      return next;
    });
  };

  // Merge real prices into token list
  const liveTokens = tokens.map(token => {
    const live = liveData?.[token.id];
    if (!live) return token;
    return {
      ...token,
      price:     live.price,
      change24h: parseFloat(live.change24h.toFixed(2)),
      volume24h: live.volume24h,
      marketCap: live.marketCap,
    };
  });

  const sorted = [...liveTokens].sort((a, b) => {
    const aw = watchlist.has(a.symbol) ? 0 : 1;
    const bw = watchlist.has(b.symbol) ? 0 : 1;
    return aw - bw;
  });

  return (
    <div className="border border-foreground/10">
      <div className="flex items-center justify-between px-6 py-3 border-b border-foreground/10">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.15em] font-bold">Trending Tokens</span>
          {watchlist.size > 0 && (
            <span className="text-[9px] uppercase tracking-widest font-bold border border-yellow-400/40 text-yellow-600 px-1.5 py-0.5 bg-yellow-400/10">
              ★ {watchlist.size} watched
            </span>
          )}
        </div>
        <span className={`text-xs font-mono ${isLive ? "text-primary" : "text-muted-foreground"}`}>
          {isLive ? "Live" : "Loading…"}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-foreground/10">
              <th className="w-10 px-3 py-3"></th>
              <th className="text-left px-2 py-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">#</th>
              <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Token</th>
              <th className="text-right px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Price</th>
              <th className="text-right px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">24h</th>
              <th className="text-right px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground hidden sm:table-cell">Volume</th>
              <th className="text-right px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground hidden md:table-cell">Signal</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((token, i) => {
              const isWatched = watchlist.has(token.symbol);
              const isCBuy = CONFLUENCE_BUY.has(token.symbol);
              const isCsell = CONFLUENCE_SELL.has(token.symbol);
              return (
                <motion.tr
                  key={token.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04, layout: { duration: 0.3 } }}
                  className={`border-b border-foreground/5 hover:bg-card transition-colors ${
                    isCBuy ? "outline outline-1 outline-yellow-400/30" :
                    isCsell ? "outline outline-1 outline-orange-400/25" : ""
                  }`}
                >
                  <td className="px-3 py-4 text-center">
                    <button
                      onClick={(e) => toggleWatch(token.symbol, e)}
                      className={`transition-colors ${isWatched ? "text-yellow-500" : "text-foreground/20 hover:text-yellow-400"}`}
                    >
                      <StarIcon filled={isWatched} />
                    </button>
                  </td>
                  <td className="px-2 py-4 text-sm text-muted-foreground font-mono">{i + 1}</td>
                  <td className="px-6 py-4">
                    <Link to={`/token/${token.id}`} className="flex items-center gap-3 group">
                      <span className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold uppercase border ${
                        isCBuy ? "border-yellow-400/50 text-yellow-700" :
                        isCsell ? "border-orange-400/40 text-orange-600" :
                        "border-foreground/20"
                      }`}>
                        {token.symbol.slice(0, 2)}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className={`text-sm font-semibold group-hover:text-muted-foreground transition-colors ${isCBuy ? "text-yellow-700" : ""}`}>
                            {token.name}
                          </p>
                          {(isCBuy || isCsell) && (
                            <span className={`text-[8px] uppercase tracking-widest font-bold border px-1 py-0.5 leading-none ${
                              isCBuy
                                ? "border-yellow-400/40 text-yellow-600 bg-yellow-400/10"
                                : "border-orange-400/30 text-orange-600 bg-orange-400/10"
                            }`}>
                              ◆
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono">{token.symbol}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm">{formatPrice(token.price)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-mono ${token.change24h >= 0 ? "text-primary" : "text-destructive"}`}>
                      {token.change24h >= 0 ? "+" : ""}{token.change24h}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-muted-foreground hidden sm:table-cell">
                    {formatNumber(token.volume24h)}
                  </td>
                  <td className="px-6 py-4 text-right hidden md:table-cell">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-12 h-1 bg-foreground/10 overflow-hidden">
                        <div className="h-full bg-foreground" style={{ width: `${token.signalScore}%` }} />
                      </div>
                      <span className="text-xs font-mono">{token.signalScore}</span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrendingTokens;
