import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const TOKENS = ["$PEPE", "$WIF", "$BONK", "$DOGE", "$SHIB", "$FLOKI", "$MOG", "$SPX", "$POPCAT", "$NEIRO", "$GOAT", "$FWOG", "$TURBO", "$BRETT", "$MEW"];
const SIGNAL_TYPES = ["Whale Movement", "Volume Spike", "Social Surge", "Smart Money", "Dev Activity", "Liquidity Shift", "Cross-chain Flow", "Dex Accumulation"];
const CHAINS = ["ETH", "SOL", "BSC", "ARB", "BASE", "AVAX", "TON", "SUI"];

let nextId = 100;

function randomSignal(id: number) {
  return {
    id,
    token: TOKENS[Math.floor(Math.random() * TOKENS.length)],
    type: SIGNAL_TYPES[Math.floor(Math.random() * SIGNAL_TYPES.length)],
    chain: CHAINS[Math.floor(Math.random() * CHAINS.length)],
    score: Math.floor(Math.random() * 30) + 65,
  };
}

const SignalCard = ({ signal }: { signal: ReturnType<typeof randomSignal> }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: -16, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.93 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className="bg-background p-5 lg:p-6 flex flex-col gap-4"
  >
    <div className="flex items-start justify-between">
      <div>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{signal.type}</span>
        <p className="text-2xl font-bold font-display mt-0.5 tracking-tight">{signal.token}</p>
      </div>
      <span className="text-[9px] uppercase tracking-widest border border-foreground/15 px-2 py-1 font-mono">
        {signal.chain}
      </span>
    </div>

    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">AI Confidence</span>
        <span className="text-xs font-mono font-bold text-primary">{signal.score}</span>
      </div>
      <div className="h-px bg-foreground/10 w-full">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${signal.score}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Active</span>
      </div>
      <span className="text-[10px] font-mono text-muted-foreground">just now</span>
    </div>
  </motion.div>
);

const Pricing = () => {
  const [signals, setSignals] = useState(() =>
    Array.from({ length: 6 }, (_, i) => randomSignal(i))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(prev => [randomSignal(nextId++), ...prev].slice(0, 9));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="signals-live" className="py-24 px-6 lg:px-10">
      <div className="mb-16 flex items-end justify-between">
        <div>
          <span className="data-label">Live Feed</span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold tracking-tight mt-2">
            Signal Pulse
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10">
        <AnimatePresence mode="popLayout">
          {signals.map((s) => (
            <SignalCard key={s.id} signal={s} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Pricing;
