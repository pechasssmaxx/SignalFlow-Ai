import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import DashboardHeader, { type DashPage } from "@/components/dashboard/DashboardHeader";
import TrendingTokens from "@/components/dashboard/TrendingTokens";
import SignalFeed from "@/components/dashboard/SignalFeed";
import VolumeChart from "@/components/dashboard/VolumeChart";
import WhaleActivity from "@/components/dashboard/WhaleActivity";
import NewsPanel from "@/components/dashboard/NewsPanel";
import SectorHeatmap from "@/components/dashboard/SectorHeatmap";
import GasTracker from "@/components/dashboard/GasTracker";
import ScanningGrid from "@/components/dashboard/ScanningGrid";
import CommandPalette from "@/components/CommandPalette";
import SignalsPage from "@/components/dashboard/SignalsPage";
import TokensPage from "@/components/dashboard/TokensPage";
import NewsPageFull from "@/components/dashboard/NewsPageFull";
import { signals } from "@/data/mockData";

// ── Stats with live pulse ─────────────────────────────────────────────────────
const BASE_STATS = [
  { label: "Active Signals", value: 47, change: "+12", suffix: "" },
  { label: "Tokens Tracked", value: 2841, change: "+156", suffix: "" },
  { label: "Whale Alerts", value: 23, change: "+5", suffix: "" },
  { label: "Signal Accuracy", value: 87, change: "+2.1%", suffix: "%" },
];

const PulseStat = ({ stat, delay }: { stat: typeof BASE_STATS[0]; delay: number }) => {
  const [val, setVal] = useState(stat.value);
  const [glow, setGlow] = useState(false);
  const prevVal = useRef(stat.value);

  useEffect(() => {
    const id = setInterval(() => {
      const next = stat.value + Math.floor((Math.random() - 0.4) * 3);
      setVal(next);
      if (next !== prevVal.current) {
        setGlow(true);
        setTimeout(() => setGlow(false), 700);
        prevVal.current = next;
      }
    }, 4000 + delay * 600);
    return () => clearInterval(id);
  }, [stat.value, delay]);

  const display = stat.suffix === "%" ? `${val}%` : val.toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay * 0.08 }}
      className="bg-background p-6 relative overflow-hidden"
    >
      <span className="data-label">{stat.label}</span>
      <div className="flex items-end gap-2 mt-2">
        <motion.span
          animate={glow ? { scale: [1, 1.06, 1] } : {}}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold font-display transition-colors duration-300"
          style={glow ? { color: "hsl(145,70%,42%)", textShadow: "0 0 12px hsl(145,70%,42%/0.4)" } : {}}
        >
          {display}
        </motion.span>
        <span className="text-xs font-mono text-primary mb-1">{stat.change}</span>
      </div>
      {/* Blueprint zone label */}
      <span className="absolute top-2 right-2 text-[8px] font-mono text-foreground/15 uppercase tracking-widest">
        SEC-0{delay + 1}
      </span>
    </motion.div>
  );
};

// ── Market sentiment ──────────────────────────────────────────────────────────
const bullishCount = signals.filter(s => s.severity === "critical" || s.severity === "high").length;
const bearishCount = signals.filter(s => s.severity === "medium" || s.severity === "low").length;
const initBullPct = Math.round((bullishCount / (bullishCount + bearishCount)) * 100);

const MarketSentimentBar = () => {
  const [pct, setPct] = useState(initBullPct);
  useEffect(() => {
    const id = setInterval(() => {
      setPct(prev => Math.min(95, Math.max(35, prev + Math.round((Math.random() - 0.45) * 3))));
    }, 6000);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
      className="bg-background border border-foreground/10 px-6 py-4 mb-8 relative"
    >
      <span className="absolute top-2 right-3 text-[8px] font-mono text-foreground/15 uppercase tracking-widest">ZONE-A</span>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-bold">Market Sentiment</span>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-primary">{pct}% Bullish</span>
          <span className="text-[10px] font-mono text-destructive">{100 - pct}% Bearish</span>
        </div>
      </div>
      <div className="h-1.5 w-full bg-destructive/20 overflow-hidden">
        <motion.div className="h-full bg-primary" animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeInOut" }} />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[9px] font-mono text-primary uppercase tracking-widest">Bulls</span>
        <span className="text-[9px] font-mono text-destructive uppercase tracking-widest">Bears</span>
      </div>
    </motion.div>
  );
};

// ── Overview page ─────────────────────────────────────────────────────────────
const OverviewPage = () => (
  <div className="glitch-enter">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 mb-8">
      {BASE_STATS.map((stat, i) => <PulseStat key={stat.label} stat={stat} delay={i} />)}
    </div>
    <MarketSentimentBar />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2"><TrendingTokens /></div>
      <div><SignalFeed /></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2"><VolumeChart /></div>
      <div><WhaleActivity /></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <GasTracker />
      <SectorHeatmap />
      <NewsPanel />
    </div>
  </div>
);

// ── Page transitions ──────────────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, x: 8 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -8 },
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [page, setPage] = useState<DashPage>("overview");

  return (
    <div className="min-h-screen bg-background relative scanlines">
      <ScanningGrid />
      <CommandPalette />
      <div className="relative z-10">
        <DashboardHeader page={page} setPage={setPage} />
        <main className="px-6 lg:px-10 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.14, ease: "easeOut" }}
            >
              {page === "overview" && <OverviewPage />}
              {page === "signals"  && <SignalsPage />}
              {page === "tokens"   && <TokensPage />}
              {page === "news"     && <NewsPageFull />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
