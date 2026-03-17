import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const BASE_SECTORS = [
  { name: "Memes", count: 18, delta: 1 },
  { name: "DeFi", count: 12, delta: -1 },
  { name: "AI", count: 9, delta: 1 },
  { name: "Layer 2", count: 7, delta: 0 },
  { name: "GameFi", count: 4, delta: -1 },
  { name: "RWA", count: 3, delta: 1 },
];

const SectorHeatmap = () => {
  const [sectors, setSectors] = useState(BASE_SECTORS);

  useEffect(() => {
    const id = setInterval(() => {
      setSectors(prev =>
        prev.map(s => ({
          ...s,
          count: Math.max(1, s.count + Math.floor((Math.random() - 0.45) * 2)),
        }))
      );
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const max = Math.max(...sectors.map(s => s.count));

  return (
    <div className="border border-foreground/10 h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-foreground/10">
        <span className="text-xs uppercase tracking-[0.15em] font-bold">Sector Activity</span>
        <span className="text-xs text-muted-foreground font-mono">Signals / sector</span>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-2.5 justify-center">
        {sectors.map((s, i) => {
          const pct = Math.round((s.count / max) * 100);
          const intensity = pct / 100;
          return (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3"
            >
              <span className="text-[10px] uppercase tracking-widest w-14 shrink-0 font-mono text-muted-foreground">
                {s.name}
              </span>
              <div className="flex-1 h-5 bg-foreground/5 overflow-hidden relative">
                <motion.div
                  className="h-full"
                  style={{ background: `rgba(34,197,94,${0.15 + intensity * 0.65})` }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold w-5 text-right">{s.count}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SectorHeatmap;
