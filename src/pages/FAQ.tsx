import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const FAQS = [
  {
    section: "General",
    items: [
      {
        q: "What is SignalScope?",
        a: "SignalScope is a real-time crypto signal intelligence platform. It aggregates on-chain whale movements, volume anomalies, social momentum shifts, and live DEX prices into a single tactical dashboard — so you see what's happening before it becomes obvious on CT.",
      },
      {
        q: "Is SignalScope free to use?",
        a: "Yes. The platform is fully free during the current phase. No subscription, no paywall, no hidden fees. We believe signal intelligence should be accessible.",
      },
      {
        q: "Do I need to create an account?",
        a: "No account required. Open the dashboard and start monitoring immediately. Watchlist preferences are saved locally in your browser.",
      },
    ],
  },
  {
    section: "Data & Prices",
    items: [
      {
        q: "Where do the prices come from?",
        a: "Prices are sourced from two independent APIs: CoinGecko for major coins (BTC, ETH, SOL, BNB, ARB, JUP, RNDR, TIA, PENDLE, WIF) and DexScreener for meme coins (PEPE, BONK, SHIB, POPCAT, FLOKI). DexScreener takes priority for meme coins as it reflects real DEX liquidity more accurately.",
      },
      {
        q: "How often do prices update?",
        a: "Prices refresh every 60 seconds from both API sources. Between refreshes, a subtle micro-fluctuation keeps the ticker visually alive. The live badge in the dashboard confirms the data connection status.",
      },
      {
        q: "Are the signals real on-chain data?",
        a: "Signal data is currently simulated to demonstrate the platform's capabilities. Live on-chain signal ingestion (Solana, Ethereum, Arbitrum) is in development and will be available in a future release.",
      },
      {
        q: "Which tokens are tracked?",
        a: "Currently 16 tokens: BTC, ETH, SOL, BNB, ARB, JUP, RNDR, TIA, PENDLE, WIF, PEPE, BONK, SHIB, DOGE, POPCAT, FLOKI. More tokens can be added — open an issue on GitHub or reach out on X.",
      },
    ],
  },
  {
    section: "Dashboard",
    items: [
      {
        q: "What are the 4 dashboard pages?",
        a: "Overview shows the live stats bar, sector heatmap, whale activity, and signal feed. Signals is a full signal log with waveform visualization and raw tx data. Tokens is the full token table with sparklines, heat scores, and HUD overlay. News is an intel-style feed with AI summaries and sentiment classification.",
      },
      {
        q: "What is the Confluence signal?",
        a: "Confluence is detected when multiple independent signal types (whale buy + volume spike + social momentum) align on the same token simultaneously. Confluence tokens are highlighted with a gold ◆ badge in the token table and whale activity feed.",
      },
      {
        q: "How does the Watchlist work?",
        a: "Click the star icon next to any token to add it to your watchlist. Watched tokens float to the top of the table and get highlighted in the News feed. Your watchlist is stored in localStorage — it persists across sessions without an account.",
      },
      {
        q: "What is the Command Palette?",
        a: "Press ⌘K (Mac) or Ctrl+K (Windows) anywhere in the dashboard to open a fuzzy search across all tracked tokens. Select a token to jump directly to its detail page.",
      },
    ],
  },
  {
    section: "Technical",
    items: [
      {
        q: "What is the tech stack?",
        a: "React 18, TypeScript, Vite 5, Tailwind CSS, shadcn/ui, Framer Motion, TanStack Query v5, Recharts, React Router v6. Packaged with Bun and deployed via Docker + nginx on Railway.",
      },
      {
        q: "Is the project open source?",
        a: "Yes. The full source code is available on GitHub at github.com/pechasssmaxx/SignalFlow-Ai under the MIT license.",
      },
      {
        q: "Can I self-host SignalScope?",
        a: "Absolutely. Clone the repo, run `bun install && bun run dev` for local development, or `docker build -t signalscope . && docker run -p 8080:8080 signalscope` for production. No API keys needed — both CoinGecko and DexScreener are free public APIs.",
      },
    ],
  },
];

const FAQItem = ({ q, a, index }: { q: string; a: string; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border-b border-foreground/8 last:border-0"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="text-sm font-medium group-hover:text-muted-foreground transition-colors leading-snug">
          {q}
        </span>
        <span className={`shrink-0 text-primary font-mono text-base leading-none mt-0.5 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-sm text-muted-foreground leading-relaxed pb-5 pr-8">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  let globalIndex = 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="px-6 lg:px-10 pt-32 pb-20 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
            // KNOWLEDGE_BASE
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold font-display tracking-tight mt-3 mb-4">
            FAQ
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Everything you need to know about SignalScope. Can't find an answer?{" "}
            <a
              href="https://x.com/og_scopesol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
            >
              Reach out on X
            </a>.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-14">
          {FAQS.map(section => (
            <div key={section.section}>
              {/* Section label */}
              <div className="flex items-center gap-4 mb-1">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary font-mono">
                  {section.section}
                </span>
                <div className="flex-1 h-px bg-foreground/10" />
              </div>

              {/* Items */}
              <div className="border border-foreground/10 px-6">
                {section.items.map(item => {
                  const idx = globalIndex++;
                  return <FAQItem key={item.q} q={item.q} a={item.a} index={idx} />;
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 border border-foreground/10 p-8 relative">
          <div className="absolute top-2 left-2 w-2 h-2 border-l border-t border-foreground/30" />
          <div className="absolute top-2 right-2 w-2 h-2 border-r border-t border-foreground/30" />
          <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-foreground/30" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-foreground/30" />

          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono mb-2">
            // READY TO START
          </p>
          <h2 className="text-xl font-bold font-display mb-4">
            See the signal through the noise.
          </h2>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-xs uppercase tracking-[0.15em] font-bold hover:brightness-110 transition-all"
          >
            Open Dashboard →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
