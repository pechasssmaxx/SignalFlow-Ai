import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signals, timeAgo } from "@/data/mockData";

// ── Scramble decode hook ──────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*";

function useScrambleDecode(text: string, delay = 0) {
  const [output, setOutput] = useState(
    () => text.split("").map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join("")
  );
  const [done, setDone] = useState(false);

  useEffect(() => {
    let settled = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setOutput(
          text.split("").map((char, i) => {
            if (char === " " || i < settled) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join("")
        );
        settled++;
        if (settled > text.length) {
          clearInterval(interval);
          setOutput(text);
          setDone(true);
        }
      }, 35);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return { output, done };
}

// ── Animated waveform ─────────────────────────────────────────────────────────
const SEVERITY_AMP: Record<string, number> = {
  critical: 9, high: 6, medium: 3, low: 1.2,
};

const Waveform = ({ severity }: { severity: string }) => {
  const amp = SEVERITY_AMP[severity] ?? 2;
  const bars = Array.from({ length: 18 }, (_, i) => {
    const h = Math.max(2, Math.abs(Math.sin(i * 0.65 + amp * 0.3)) * amp * 1.8 + 2);
    return Math.round(h);
  });

  return (
    <div className="flex items-center gap-px shrink-0" style={{ height: 24, width: 42 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-0.5 bg-primary rounded-sm"
          style={{
            height: `${Math.min(22, h)}px`,
            opacity: 0.35 + (h / (amp * 2 + 4)) * 0.65,
            transformOrigin: "bottom",
            animation: `wave-bar ${0.6 + (i % 5) * 0.12}s ease-in-out ${i * 0.04}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
};

// ── Fake raw transaction hashes ───────────────────────────────────────────────
function genHashes(seed: string): string[] {
  const base = parseInt(seed, 10) || 1;
  return Array.from({ length: 6 }, (_, i) =>
    `0x${(base * 37 * (i + 1) + 0xdeadbeef).toString(16).padStart(40, "0").slice(-40)}`
  );
}

// ── Signal row ────────────────────────────────────────────────────────────────
const SEV_COLOR: Record<string, string> = {
  critical: "text-destructive border-destructive/40 bg-destructive/8",
  high:     "text-yellow-600 border-yellow-400/40 bg-yellow-400/8",
  medium:   "text-foreground/60 border-foreground/20 bg-foreground/4",
  low:      "text-foreground/40 border-foreground/15 bg-transparent",
};

const SignalRow = ({ signal, index }: { signal: typeof signals[0]; index: number }) => {
  const { output } = useScrambleDecode(signal.message, 200 + index * 120);
  const [expanded, setExpanded] = useState(false);
  const hashes = genHashes(signal.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.25 }}
      className="border-b border-foreground/8 last:border-0"
    >
      <div
        className="flex items-start gap-4 px-6 py-4 hover:bg-card transition-colors cursor-pointer select-none"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Severity badge */}
        <span className={`text-[9px] uppercase tracking-widest font-bold border px-1.5 py-0.5 shrink-0 mt-0.5 ${SEV_COLOR[signal.severity]}`}>
          {signal.severity}
        </span>

        {/* Token */}
        <span className="text-xs font-bold font-mono w-14 shrink-0 mt-0.5">{signal.token}</span>

        {/* Type */}
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground w-16 shrink-0 mt-0.5 hidden sm:block">
          {signal.type}
        </span>

        {/* Waveform */}
        <Waveform severity={signal.severity} />

        {/* Decoded message */}
        <span className="flex-1 text-sm font-mono leading-relaxed min-w-0">{output}</span>

        {/* Timestamp + expand */}
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <span className="text-[10px] text-muted-foreground font-mono">{timeAgo(signal.timestamp)}</span>
          <span className={`text-[10px] font-mono transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>▾</span>
        </div>
      </div>

      {/* Expanded raw data */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 ml-[8.5rem]">
              <div className="border border-foreground/10 bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 bg-primary animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Raw Transaction Data</span>
                </div>
                <div className="space-y-1">
                  {hashes.map((hash, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[9px] text-muted-foreground font-mono w-4">{i + 1}</span>
                      <span className="text-[10px] font-mono text-primary/80 tracking-wider">{hash}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-foreground/8 flex gap-6 text-[10px] font-mono text-muted-foreground">
                  <span>Block: #{(14892000 + parseInt(signal.id) * 7).toLocaleString()}</span>
                  <span>Gas: {18 + parseInt(signal.id) * 3} Gwei</span>
                  <span>Chain: {['ETH', 'SOL', 'ARB', 'BASE'][parseInt(signal.id) % 4]}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
type Filter = "all" | "whale" | "social" | "volume" | "news" | "migration";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "whale", label: "Whales" },
  { key: "social", label: "Social" },
  { key: "volume", label: "Volume" },
  { key: "news", label: "News" },
  { key: "migration", label: "Migration" },
];

const SignalsPage = () => {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all" ? signals : signals.filter(s => s.type === filter);

  return (
    <div className="glitch-enter">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">// SIGNAL_INTELLIGENCE_TERMINAL</span>
          <h2 className="text-2xl font-bold font-display tracking-tight mt-1">Signals</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-primary animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">{filtered.length} active</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-0 border border-foreground/10 mb-6 overflow-x-auto">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] font-bold shrink-0 transition-colors border-r border-foreground/10 last:border-0 ${
              filter === f.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-card hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Signal list */}
      <div className="border border-foreground/10">
        {/* Column headers */}
        <div className="hidden sm:flex items-center gap-4 px-6 py-2 border-b border-foreground/10 bg-card">
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground w-[4.5rem]">Severity</span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground w-14">Token</span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground w-16 hidden sm:block">Type</span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground w-[42px]">Wave</span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground flex-1">Message</span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Time</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            {filtered.map((signal, i) => (
              <SignalRow key={signal.id} signal={signal} index={i} />
            ))}
            {filtered.length === 0 && (
              <div className="px-6 py-12 text-center text-muted-foreground font-mono text-sm">
                // NO SIGNALS MATCHING FILTER
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignalsPage;
