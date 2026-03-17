import { Link } from "react-router-dom";
import LiveTicker from "./LiveTicker";

export type DashPage = "overview" | "signals" | "tokens" | "news";

const NAV: { key: DashPage; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "signals",  label: "Signals"  },
  { key: "tokens",   label: "Tokens"   },
  { key: "news",     label: "News"     },
];

interface Props {
  page?: DashPage;
  setPage?: (p: DashPage) => void;
}

const DashboardHeader = ({ page, setPage }: Props) => {
  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="border-b border-foreground/10 flex items-center justify-between px-6 lg:px-10 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight font-display shrink-0">SIGNALSCOPE</Link>

        {/* Navigation tabs — always visible, scrollable on mobile */}
        {setPage && (
          <nav className="flex overflow-x-auto scrollbar-none items-center gap-0 -mb-px mx-4 flex-1">
            {NAV.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPage(key)}
                className={`px-4 sm:px-5 py-2 text-[11px] sm:text-xs uppercase tracking-[0.15em] font-bold transition-colors border-b-2 shrink-0 ${
                  page === key
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4 shrink-0">
          <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground border border-foreground/15 px-2 py-1">
            <kbd className="text-[9px]">⌘K</kbd>
            <span>search</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-bold">Live</span>
          </div>
        </div>
      </div>
      <LiveTicker />
    </header>
  );
};

export default DashboardHeader;
