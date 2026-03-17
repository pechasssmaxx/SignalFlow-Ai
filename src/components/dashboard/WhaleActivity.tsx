import { motion } from "framer-motion";
import { whaleTransactions, formatNumber, timeAgo } from "@/data/mockData";

const RadarScanner = () => (
  <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" stroke="hsl(145,70%,42%)" strokeOpacity="0.15" strokeWidth="1" />
      <circle cx="16" cy="16" r="8" stroke="hsl(145,70%,42%)" strokeOpacity="0.25" strokeWidth="1" />
      <circle cx="16" cy="16" r="3" stroke="hsl(145,70%,42%)" strokeOpacity="0.45" strokeWidth="1" />
      <line x1="16" y1="3" x2="16" y2="29" stroke="hsl(145,70%,42%)" strokeOpacity="0.12" strokeWidth="0.75" />
      <line x1="3" y1="16" x2="29" y2="16" stroke="hsl(145,70%,42%)" strokeOpacity="0.12" strokeWidth="0.75" />
    </svg>
    <svg
      width="20" height="20" viewBox="0 0 32 32" fill="none"
      style={{ position: "absolute", top: 0, left: 0, animation: "spin 3s linear infinite", transformOrigin: "10px 10px" }}
    >
      <path d="M16 16 L29 16 A13 13 0 0 1 22.5 26.3 Z" fill="hsl(145,70%,42%)" fillOpacity="0.12" />
      <line x1="16" y1="16" x2="29" y2="16" stroke="hsl(145,70%,42%)" strokeWidth="1.5" strokeOpacity="0.7" />
      <circle cx="24" cy="10" r="1.5" fill="hsl(145,70%,42%)" opacity="0.9" />
    </svg>
  </div>
);

const CONFLUENCE_BUY = new Set(["SOL", "ETH", "WIF", "RNDR"]);
const CONFLUENCE_SELL = new Set(["JUP"]);

const WhaleActivity = () => {
  return (
    <div className="border border-foreground/10 h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-foreground/10">
        <div className="flex items-center gap-3">
          <RadarScanner />
          <span className="text-xs uppercase tracking-[0.15em] font-bold">Whale Activity</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">Real-time</span>
      </div>
      <div className="flex-1 divide-y divide-foreground/5">
        {whaleTransactions.map((tx, i) => {
          const isCBuy = CONFLUENCE_BUY.has(tx.token);
          const isCsell = CONFLUENCE_SELL.has(tx.token);
          return (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className={`px-6 py-4 hover:bg-card transition-colors relative ${
                isCBuy ? "ring-1 ring-yellow-400/40" : isCsell ? "ring-1 ring-orange-400/30" : ""
              }`}
            >
              {(isCBuy || isCsell) && (
                <span className={`absolute top-2 right-2 text-[8px] uppercase tracking-widest font-bold px-1.5 py-0.5 ${
                  isCBuy
                    ? "bg-yellow-400/10 text-yellow-600 border border-yellow-400/30"
                    : "bg-orange-400/10 text-orange-600 border border-orange-400/30"
                }`}>
                  ◆ confluence
                </span>
              )}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold uppercase ${tx.type === "buy" ? "text-primary" : "text-destructive"}`}>
                    {tx.type}
                  </span>
                  <span className={`text-sm font-bold ${isCBuy ? "text-yellow-600" : ""}`}>{tx.token}</span>
                </div>
                <span className="font-mono text-sm font-bold">{formatNumber(tx.usdValue)}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                <span>{tx.wallet}</span>
                <span>{timeAgo(tx.timestamp)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WhaleActivity;
