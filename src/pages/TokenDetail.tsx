import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { tokens, signals, whaleTransactions, newsItems, formatPrice, formatNumber, timeAgo } from "@/data/mockData";
import { useLivePrices } from "@/hooks/useLivePrices";

const TokenDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: liveData, isLive } = useLivePrices();

  const baseToken = tokens.find(t => t.id === id) || tokens[0];

  // Overlay real prices onto the mock token
  const live = liveData?.[baseToken.id];
  const token = live
    ? {
        ...baseToken,
        price:     live.price,
        change24h: parseFloat(live.change24h.toFixed(2)),
        volume24h: live.volume24h,
        marketCap: live.marketCap,
      }
    : baseToken;

  const tokenSignals = signals.filter(s => s.token === token.symbol);
  const tokenWhales  = whaleTransactions.filter(w => w.token === token.symbol);
  const tokenNews    = newsItems.filter(n => n.token === token.symbol);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="px-6 lg:px-10 py-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3" />
          Back to Dashboard
        </Link>

        {/* Token header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-foreground/10 p-8 mb-6 relative"
        >
          <div className="absolute top-3 left-3 w-2.5 h-2.5 border-l-[1.5px] border-t-[1.5px] border-foreground" />
          <div className="absolute top-3 right-3 w-2.5 h-2.5 border-r-[1.5px] border-t-[1.5px] border-foreground" />
          <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-l-[1.5px] border-b-[1.5px] border-foreground" />
          <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-r-[1.5px] border-b-[1.5px] border-foreground" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="w-14 h-14 border border-foreground/20 flex items-center justify-center text-lg font-bold uppercase">
                {token.symbol.slice(0, 2)}
              </span>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold font-display">{token.name}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm text-muted-foreground font-mono">{token.symbol}</span>
                  <span className={`text-[9px] uppercase tracking-widest font-bold border px-1.5 py-0.5 font-mono ${
                    isLive
                      ? "text-primary border-primary/30 bg-primary/5"
                      : "text-muted-foreground border-foreground/15"
                  }`}>
                    {isLive ? "● live" : "○ …"}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold font-mono">{formatPrice(token.price)}</p>
              <span className={`text-sm font-mono ${token.change24h >= 0 ? "text-success" : "text-destructive"}`}>
                {token.change24h >= 0 ? "+" : ""}{token.change24h}% (24h)
              </span>
            </div>
          </div>

          {/* Signal score */}
          <div className="mt-6 flex items-center gap-4">
            <span className="data-label">Signal Score</span>
            <div className="flex-1 h-1 bg-foreground/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${token.signalScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-foreground"
              />
            </div>
            <span className="text-lg font-bold font-mono">{token.signalScore}</span>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/10 mb-6">
          {[
            { label: "Volume 24h",     value: formatNumber(token.volume24h) },
            { label: "Market Cap",     value: formatNumber(token.marketCap) },
            { label: "Active Signals", value: String(tokenSignals.length || signals.filter(s => s.token === token.symbol).length || 2) },
            { label: "Whale Txs",      value: String(tokenWhales.length || 1) },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className="bg-background p-5"
            >
              <span className="data-label">{stat.label}</span>
              <p className="text-xl font-bold font-mono mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="border border-foreground/10 mb-6">
          <div className="flex items-center justify-between px-6 py-3 border-b border-foreground/10">
            <span className="text-xs uppercase tracking-[0.15em] font-bold">Price Chart (30d)</span>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={token.chartData}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(0 0% 0%)" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="hsl(0 0% 0%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false}
                  tick={{ fill: "hsl(0 0% 45%)", fontSize: 9, fontFamily: "Space Mono" }} interval={4} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fill: "hsl(0 0% 45%)", fontSize: 9, fontFamily: "Space Mono" }} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{
                  background: "hsl(40 10% 95%)", border: "1px solid hsl(0 0% 78%)",
                  borderRadius: "0", fontFamily: "Space Mono", fontSize: "11px",
                }} />
                <Area type="monotone" dataKey="price" stroke="hsl(0 0% 0%)" strokeWidth={1.5} fill="url(#priceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-foreground/10">
            <div className="px-6 py-3 border-b border-foreground/10">
              <span className="text-xs uppercase tracking-[0.15em] font-bold">Recent Signals</span>
            </div>
            <div className="divide-y divide-foreground/5">
              {(tokenSignals.length > 0 ? tokenSignals : signals.slice(0, 3)).map((signal) => (
                <div key={signal.id} className="px-6 py-4">
                  <p className="text-sm mb-1">{signal.message}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{timeAgo(signal.timestamp)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-foreground/10">
            <div className="px-6 py-3 border-b border-foreground/10">
              <span className="text-xs uppercase tracking-[0.15em] font-bold">News Mentions</span>
            </div>
            <div className="divide-y divide-foreground/5">
              {(tokenNews.length > 0 ? tokenNews : newsItems.slice(0, 3)).map((item) => (
                <div key={item.id} className="px-6 py-4">
                  <p className="text-sm font-medium mb-1">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{item.source} · {timeAgo(item.timestamp)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TokenDetail;
