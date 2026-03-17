import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signals, timeAgo } from "@/data/mockData";

type Filter = "all" | "whale" | "social" | "volume" | "news";

const severityIndicator: Record<string, string> = {
  critical: "bg-destructive animate-pulse",
  high: "bg-warning animate-pulse",
  medium: "bg-muted-foreground",
  low: "bg-muted-foreground/50",
};

const RadarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
    <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.75" />
    <circle cx="9" cy="9" r="4.5" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.75" />
    <circle cx="9" cy="9" r="1.5" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.75" />
    <line x1="9" y1="1.5" x2="9" y2="16.5" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.75" />
    <line x1="1.5" y1="9" x2="16.5" y2="9" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.75" />
    <line
      x1="9" y1="9" x2="16.5" y2="9"
      stroke="hsl(145,70%,42%)" strokeWidth="1"
      style={{ transformOrigin: "9px 9px", animation: "spin 2.5s linear infinite" }}
    />
    <circle cx="13.5" cy="6" r="1" fill="hsl(145,70%,42%)" opacity="0.8" />
  </svg>
);

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "whale", label: "Whales" },
  { key: "social", label: "Social" },
  { key: "volume", label: "Volume" },
  { key: "news", label: "News" },
];

const SignalFeed = () => {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all" ? signals : signals.filter(s => s.type === filter);

  return (
    <div className="border border-foreground/10 h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-foreground/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-primary animate-pulse" />
          <span className="text-xs uppercase tracking-[0.15em] font-bold">Signal Feed</span>
        </div>
        <div className="flex items-center gap-2">
          <RadarIcon />
          <span className="text-xs text-muted-foreground font-mono">{filtered.length} active</span>
        </div>
      </div>

      {/* Quick filter tabs */}
      <div className="flex items-center border-b border-foreground/10 overflow-x-auto">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 text-[10px] uppercase tracking-[0.15em] font-bold shrink-0 transition-colors border-b-2 -mb-px ${
              filter === f.key
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex-1 divide-y divide-foreground/5 overflow-y-auto max-h-[480px]">
        <AnimatePresence initial={false}>
          {filtered.map((signal) => (
            <motion.div
              key={`${filter}-${signal.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="px-6 py-4 hover:bg-card transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-1.5 h-1.5 shrink-0 ${severityIndicator[signal.severity]}`} />
                <span className="text-xs font-bold uppercase tracking-wider">{signal.token}</span>
                <span className="text-[10px] text-muted-foreground uppercase">{signal.type}</span>
              </div>
              <p className="text-sm leading-relaxed">{signal.message}</p>
              <p className="text-[10px] text-muted-foreground font-mono mt-1">{timeAgo(signal.timestamp)}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignalFeed;
