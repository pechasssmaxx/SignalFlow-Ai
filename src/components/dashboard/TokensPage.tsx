import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { tokens, formatPrice, formatNumber } from "@/data/mockData";
import { useLivePrices } from "@/hooks/useLivePrices";

// ── Sparkline ─────────────────────────────────────────────────────────────────
const Sparkline = ({ data, isUp }: { data: { price: number }[]; isUp: boolean }) => {
  const prices = data.slice(-20).map(d => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const W = 64, H = 20;

  const points = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * W;
    const y = H - ((p - min) / range) * (H - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const color = isUp ? "hsl(145,70%,42%)" : "hsl(0,80%,55%)";

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
};

// ── HUD crosshair overlay ─────────────────────────────────────────────────────
const HUDOverlay = ({ token }: { token: typeof tokens[0] }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={{ duration: 0.12 }}
    className="absolute right-full top-1/2 -translate-y-1/2 mr-4 z-50 pointer-events-none"
    style={{ minWidth: 180 }}
  >
    <div className="border border-primary/40 bg-background p-3 relative">
      {/* Corner markers */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary" />

      <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-2 font-mono">// TACTICAL HUD</div>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-[10px] text-muted-foreground font-mono">Mkt Cap</span>
          <span className="text-[10px] font-bold font-mono">{formatNumber(token.marketCap)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[10px] text-muted-foreground font-mono">Volume</span>
          <span className="text-[10px] font-bold font-mono">{formatNumber(token.volume24h)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[10px] text-muted-foreground font-mono">Signal</span>
          <span className="text-[10px] font-bold font-mono text-primary">{token.signalScore}/100</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// ── Heat score toggle ─────────────────────────────────────────────────────────
function heatColor(score: number, enabled: boolean): string {
  if (!enabled) return "";
  if (score >= 90) return "bg-primary/12";
  if (score >= 75) return "bg-primary/7";
  if (score >= 60) return "bg-yellow-400/8";
  return "";
}

function heatTextColor(score: number, enabled: boolean): string {
  if (!enabled) return "";
  if (score >= 90) return "text-primary font-bold";
  if (score >= 75) return "text-primary/80";
  return "text-muted-foreground";
}

// ── Page ──────────────────────────────────────────────────────────────────────
const TokensPage = () => {
  const [heatMode, setHeatMode] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"default" | "heat">("default");
  const { data: liveData, isLive } = useLivePrices();

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
    if (sortBy === "heat") return b.signalScore - a.signalScore;
    return 0;
  });

  return (
    <div className="glitch-enter">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">// ASSET_RADAR_v2.4</span>
          <h2 className="text-2xl font-bold font-display tracking-tight mt-1">Tokens</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[9px] font-mono border px-2 py-1 ${isLive ? "text-primary border-primary/30" : "text-muted-foreground border-foreground/15"}`}>
            {isLive ? "● LIVE PRICES" : "○ LOADING…"}
          </span>
          <button
            onClick={() => setSortBy(s => s === "heat" ? "default" : "heat")}
            className={`text-[10px] uppercase tracking-[0.15em] font-bold border px-3 py-1.5 transition-colors ${
              sortBy === "heat"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-foreground/20 text-muted-foreground hover:border-foreground/40"
            }`}
          >
            ↑ Sort by Heat
          </button>
          <button
            onClick={() => setHeatMode(h => !h)}
            className={`text-[10px] uppercase tracking-[0.15em] font-bold border px-3 py-1.5 transition-colors ${
              heatMode
                ? "bg-primary/15 text-primary border-primary/40"
                : "border-foreground/20 text-muted-foreground hover:border-foreground/40"
            }`}
          >
            {heatMode ? "◉ Heat On" : "○ Heat Off"}
          </button>
        </div>
      </div>

      <div className="border border-foreground/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-foreground/10 bg-card">
              <th className="text-left px-6 py-3 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">#</th>
              <th className="text-left px-6 py-3 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Token</th>
              <th className="text-right px-6 py-3 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Price</th>
              <th className="text-right px-6 py-3 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">24h</th>
              <th className="text-right px-6 py-3 text-[9px] uppercase tracking-[0.18em] text-muted-foreground hidden sm:table-cell">Volume</th>
              <th className="text-right px-6 py-3 text-[9px] uppercase tracking-[0.18em] text-muted-foreground hidden md:table-cell">Trend</th>
              <th className="text-right px-6 py-3 text-[9px] uppercase tracking-[0.18em] text-muted-foreground hidden md:table-cell">Heat</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((token, i) => (
              <motion.tr
                key={token.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`border-b border-foreground/5 hover:bg-card transition-colors relative ${heatColor(token.signalScore, heatMode)}`}
                onMouseEnter={() => setHoveredId(token.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{i + 1}</td>
                <td className="px-6 py-4">
                  <div className="relative flex items-center gap-3">
                    {/* HUD crosshair */}
                    <AnimatePresence>
                      {hoveredId === token.id && <HUDOverlay token={token} />}
                    </AnimatePresence>

                    {/* Crosshair on icon when hovered */}
                    <div className="relative">
                      <span className={`w-8 h-8 border flex items-center justify-center text-[10px] font-bold uppercase transition-colors ${
                        hoveredId === token.id ? "border-primary text-primary" : "border-foreground/20"
                      }`}>
                        {token.symbol.slice(0, 2)}
                      </span>
                      {hoveredId === token.id && (
                        <>
                          <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-px h-1.5 bg-primary" />
                          <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-px h-1.5 bg-primary" />
                          <span className="absolute -left-0.5 top-1/2 -translate-y-1/2 h-px w-1.5 bg-primary" />
                          <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 h-px w-1.5 bg-primary" />
                        </>
                      )}
                    </div>

                    <Link to={`/token/${token.id}`} className="group">
                      <p className={`text-sm font-semibold group-hover:text-muted-foreground transition-colors ${heatTextColor(token.signalScore, heatMode)}`}>
                        {token.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">{token.symbol}</p>
                    </Link>
                  </div>
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
                  <Sparkline data={token.chartData} isUp={token.change24h >= 0} />
                </td>
                <td className="px-6 py-4 text-right hidden md:table-cell">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-12 h-1 bg-foreground/10 overflow-hidden">
                      <div
                        className={`h-full transition-colors ${heatMode && token.signalScore >= 90 ? "bg-primary" : "bg-foreground"}`}
                        style={{ width: `${token.signalScore}%` }}
                      />
                    </div>
                    <span className={`text-xs font-mono ${heatTextColor(token.signalScore, heatMode)}`}>{token.signalScore}</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokensPage;
