import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SignalsPreview = () => {
  const signals = [
    { token: "WIF", type: "VOLUME", message: "Volume spike detected — 340% above average", time: "2m ago", severity: "critical" },
    { token: "SOL", type: "WHALE", message: "Whale accumulation — $4.2M bought in 15 min", time: "5m ago", severity: "high" },
    { token: "JUP", type: "SOCIAL", message: "Social media momentum — trending on CT", time: "10m ago", severity: "high" },
    { token: "ARB", type: "MIGRATION", message: "Migration event — liquidity moving from ETH", time: "15m ago", severity: "medium" },
    { token: "RNDR", type: "NEWS", message: "Partnership announcement with major protocol", time: "20m ago", severity: "medium" },
    { token: "ETH", type: "WHALE", message: "Top wallet added $8.1M position", time: "40m ago", severity: "critical" },
  ];

  return (
    <section className="py-24 px-6 lg:px-10">
      <div className="mb-12">
        <span className="data-label">Live Preview</span>
        <h2 className="text-4xl lg:text-5xl font-display font-bold tracking-tight mt-2">
          Signal feed
        </h2>
      </div>

      <div className="border border-foreground/10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-foreground/10">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-primary animate-pulse" />
            <span className="text-xs uppercase tracking-[0.15em] font-bold">Live Signals</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">{signals.length} active</span>
        </div>

        {/* Signal rows */}
        {signals.map((signal, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center justify-between px-6 py-4 border-b border-foreground/5 hover:bg-card transition-colors group"
          >
            <div className="flex items-center gap-4">
              <span className={`w-2 h-2 ${
                signal.severity === 'critical' ? 'bg-destructive animate-pulse' :
                signal.severity === 'high' ? 'bg-warning animate-pulse' : 'bg-muted-foreground'
              }`} />
              <span className="text-xs font-bold uppercase tracking-wider min-w-[50px]">{signal.token}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider min-w-[70px]">{signal.type}</span>
              <span className="text-sm">{signal.message}</span>
            </div>
            <span className="text-xs text-muted-foreground font-mono whitespace-nowrap ml-4">{signal.time}</span>
          </motion.div>
        ))}

        {/* Footer */}
        <div className="px-6 py-4">
          <Link to="/dashboard" className="text-xs uppercase tracking-[0.15em] hover:text-primary transition-colors">
            [ View All Signals → ]
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignalsPreview;
