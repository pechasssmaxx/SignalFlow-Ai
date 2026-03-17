import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { newsItems, timeAgo } from "@/data/mockData";

// ── Typing terminal hook ──────────────────────────────────────────────────────
function useTyping(text: string, delay = 0, speed = 28) {
  const [displayed, setDisplayed] = useState("");
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, delay);

    const blink = setInterval(() => setCursor(c => !c), 530);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      clearInterval(blink);
    };
  }, [text, delay, speed]);

  return { displayed, cursor };
}

// ── Tag badge ─────────────────────────────────────────────────────────────────
const TAG_STYLE: Record<string, string> = {
  BULLISH:          "border-primary/50 text-primary bg-primary/8",
  BEARISH:          "border-destructive/50 text-destructive bg-destructive/8",
  "HIGH IMPACT":    "border-yellow-400/60 text-yellow-700 bg-yellow-400/10",
  INSTITUTIONAL:    "border-blue-400/50 text-blue-700 bg-blue-400/8",
  WATCH:            "border-foreground/30 text-foreground/70 bg-foreground/5",
  CAUTION:          "border-orange-400/50 text-orange-700 bg-orange-400/8",
  "SECTOR ROTATION":"border-purple-400/50 text-purple-700 bg-purple-400/8",
  VERIFIED:         "border-primary/40 text-primary/80 bg-primary/5",
  PARTNERSHIP:      "border-cyan-400/50 text-cyan-700 bg-cyan-400/8",
  "DEV SIGNAL":     "border-green-600/50 text-green-700 bg-green-600/8",
  CONGESTION:       "border-red-400/40 text-red-700 bg-red-400/6",
};

const Tag = ({ label }: { label: string }) => (
  <span className={`text-[8px] uppercase tracking-[0.2em] font-bold border px-1.5 py-0.5 ${TAG_STYLE[label] ?? "border-foreground/20 text-muted-foreground"}`}>
    [{label}]
  </span>
);

// ── Animated corner markers ───────────────────────────────────────────────────
const AnimatedCorners = () => (
  <>
    <motion.span
      className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary"
      animate={{ opacity: [1, 0.4, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.span
      className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary"
      animate={{ opacity: [1, 0.4, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
    />
    <motion.span
      className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary"
      animate={{ opacity: [1, 0.4, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
    />
    <motion.span
      className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary"
      animate={{ opacity: [1, 0.4, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
    />
  </>
);

// ── News card ─────────────────────────────────────────────────────────────────
function loadWatchlist(): Set<string> {
  try {
    const raw = localStorage.getItem("ss_watchlist");
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

const NewsCard = ({
  item,
  index,
  watchlist,
}: {
  item: typeof newsItems[0];
  index: number;
  watchlist: Set<string>;
}) => {
  const isWatched = item.token ? watchlist.has(item.token) : false;
  const { displayed, cursor } = useTyping(item.aiSummary ?? "", 300 + index * 400, 22);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`relative border p-5 transition-colors ${
        isWatched
          ? "border-primary/50 bg-primary/4"
          : "border-foreground/10 hover:border-foreground/20"
      }`}
    >
      {isWatched && <AnimatedCorners />}

      {/* Sentiment line */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${
        item.sentiment === "positive" ? "bg-primary" :
        item.sentiment === "negative" ? "bg-destructive" :
        "bg-foreground/20"
      }`} />

      <div className="pl-3">
        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {item.tags.map(tag => <Tag key={tag} label={tag} />)}
          </div>
        )}

        {/* Title */}
        <p className="text-sm font-semibold leading-snug mb-3">{item.title}</p>

        {/* AI Summary (typing effect) */}
        {item.aiSummary && (
          <div className="border border-foreground/8 bg-card p-3 mb-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1 h-1 bg-primary animate-pulse" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-mono">AI SUMMARY</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground leading-relaxed">
              {displayed}
              <span className={`inline-block w-px h-3 bg-primary ml-0.5 align-middle ${cursor ? "opacity-100" : "opacity-0"}`} />
            </p>
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <span>{item.source}</span>
            {item.token && (
              <>
                <span>·</span>
                <span className="font-bold text-foreground/70">{item.token}</span>
              </>
            )}
            {isWatched && (
              <>
                <span>·</span>
                <span className="text-primary font-bold">★ WATCHLIST</span>
              </>
            )}
          </div>
          <span>{timeAgo(item.timestamp)}</span>
        </div>
      </div>
    </motion.div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const NewsPageFull = () => {
  const [watchlist] = useState(loadWatchlist);
  const watchedFirst = [...newsItems].sort((a, b) => {
    const aw = a.token && watchlist.has(a.token) ? 0 : 1;
    const bw = b.token && watchlist.has(b.token) ? 0 : 1;
    return aw - bw;
  });

  return (
    <div className="glitch-enter">
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">// INTELLIGENCE_BRIEFING</span>
          <h2 className="text-2xl font-bold font-display tracking-tight mt-1">News</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground border border-foreground/15 px-2 py-1">
            {newsItems.length} DISPATCHES
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {watchedFirst.map((item, i) => (
          <NewsCard key={item.id} item={item} index={i} watchlist={watchlist} />
        ))}
      </div>
    </div>
  );
};

export default NewsPageFull;
