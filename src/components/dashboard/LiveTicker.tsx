import { useEffect, useState } from "react";
import { useLivePrices } from "@/hooks/useLivePrices";

const BASE_PRICES = [
  { symbol: "BTC",    id: "btc",    price: 67420.5,    change: 2.14  },
  { symbol: "ETH",    id: "eth",    price: 3842.15,    change: 5.2   },
  { symbol: "SOL",    id: "sol",    price: 178.42,     change: 12.5  },
  { symbol: "BNB",    id: "bnb",    price: 412.8,      change: -0.9  },
  { symbol: "DOGE",   id: "doge",   price: 0.192,      change: 9.1   },
  { symbol: "PEPE",   id: "pepe",   price: 0.00001312, change: 14.2  },
  { symbol: "BONK",   id: "bonk",   price: 0.00003541, change: 22.8  },
  { symbol: "SHIB",   id: "shib",   price: 0.0000248,  change: 7.4   },
  { symbol: "POPCAT", id: "popcat", price: 0.823,      change: 31.5  },
  { symbol: "WIF",    id: "wif",    price: 2.45,       change: 45.2  },
  { symbol: "FLOKI",  id: "floki",  price: 0.000214,   change: -4.2  },
  { symbol: "ARB",    id: "arb",    price: 1.82,       change: -3.1  },
  { symbol: "JUP",    id: "jup",    price: 1.24,       change: 28.7  },
  { symbol: "RNDR",   id: "rndr",   price: 10.85,      change: 8.3   },
  { symbol: "TIA",    id: "tia",    price: 15.32,      change: 6.9   },
  { symbol: "PENDLE", id: "pendle", price: 6.78,       change: -1.8  },
];

function fmtPrice(n: number) {
  if (n >= 1000)  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  if (n >= 1)     return `$${n.toFixed(3)}`;
  if (n >= 0.01)  return `$${n.toFixed(4)}`;
  if (n >= 0.0001) return `$${n.toFixed(6)}`;
  return `$${n.toPrecision(4)}`;
}

const LiveTicker = () => {
  const { data: liveData } = useLivePrices();
  const [prices, setPrices] = useState(BASE_PRICES);

  // Sync with real data whenever it arrives / refreshes
  useEffect(() => {
    if (!liveData) return;
    setPrices(prev =>
      prev.map(p => {
        const live = liveData[p.id];
        if (!live) return p;
        return { ...p, price: live.price, change: live.change24h };
      })
    );
  }, [liveData]);

  // Subtle visual micro-fluctuation between real refreshes
  useEffect(() => {
    const id = setInterval(() => {
      setPrices(prev =>
        prev.map(p => ({
          ...p,
          price: p.price * (1 + (Math.random() - 0.499) * 0.0008),
        }))
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const items = [...prices, ...prices];

  return (
    <div className="border-b border-foreground/10 bg-background overflow-hidden">
      <div className="ticker-track flex items-center gap-0 py-1.5">
        {items.map((p, i) => (
          <span key={i} className="flex items-center gap-2 px-6 shrink-0 border-r border-foreground/10">
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono">{p.symbol}</span>
            <span className="text-[10px] font-mono">{fmtPrice(p.price)}</span>
            <span className={`text-[10px] font-mono ${p.change >= 0 ? "text-primary" : "text-destructive"}`}>
              {p.change >= 0 ? "+" : ""}{p.change.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default LiveTicker;
