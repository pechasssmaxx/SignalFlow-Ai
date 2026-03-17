import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type GasLevel = "low" | "medium" | "high";

function gasColor(level: GasLevel) {
  if (level === "low") return "text-primary";
  if (level === "medium") return "text-warning";
  return "text-destructive";
}

function gasLabel(gwei: number): GasLevel {
  if (gwei < 20) return "low";
  if (gwei < 50) return "medium";
  return "high";
}

const GasTracker = () => {
  const [ethGas, setEthGas] = useState(18);
  const [solFee, setSolFee] = useState(0.00025);

  useEffect(() => {
    const id = setInterval(() => {
      setEthGas(prev => Math.max(5, Math.round(prev + (Math.random() - 0.45) * 4)));
      setSolFee(prev => parseFloat(Math.max(0.00001, prev + (Math.random() - 0.5) * 0.00005).toFixed(5)));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const ethLevel = gasLabel(ethGas);

  return (
    <div className="border border-foreground/10 flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-3 border-b border-foreground/10">
        <span className="text-xs uppercase tracking-[0.15em] font-bold">Gas Tracker</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Live</span>
        </span>
      </div>
      <div className="flex-1 flex flex-col justify-center divide-y divide-foreground/5">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Ethereum</span>
            <div className="flex items-end gap-1.5 mt-0.5">
              <AnimatePresence mode="wait">
                <motion.span
                  key={ethGas}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className={`text-2xl font-bold font-display ${gasColor(ethLevel)}`}
                >
                  {ethGas}
                </motion.span>
              </AnimatePresence>
              <span className="text-xs text-muted-foreground font-mono mb-0.5">Gwei</span>
            </div>
          </div>
          <span className={`text-[10px] uppercase tracking-widest font-bold border px-2 py-0.5 ${
            ethLevel === "low" ? "border-primary/30 text-primary" :
            ethLevel === "medium" ? "border-yellow-500/30 text-yellow-600" :
            "border-destructive/30 text-destructive"
          }`}>
            {ethLevel}
          </span>
        </div>

        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Solana</span>
            <div className="flex items-end gap-1.5 mt-0.5">
              <AnimatePresence mode="wait">
                <motion.span
                  key={solFee}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl font-bold font-display text-primary"
                >
                  {(solFee * 1000).toFixed(3)}
                </motion.span>
              </AnimatePresence>
              <span className="text-xs text-muted-foreground font-mono mb-0.5">μSOL</span>
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold border border-primary/30 text-primary px-2 py-0.5">
            low
          </span>
        </div>
      </div>
    </div>
  );
};

export default GasTracker;
