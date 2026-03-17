export interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  signalScore: number;
  signals: Signal[];
  chartData: ChartPoint[];
}

export interface Signal {
  id: string;
  type: 'volume' | 'whale' | 'social' | 'migration' | 'news';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  token: string;
}

export interface ChartPoint {
  time: string;
  price: number;
  volume: number;
}

export interface WhaleTransaction {
  id: string;
  token: string;
  type: 'buy' | 'sell';
  amount: number;
  usdValue: number;
  wallet: string;
  timestamp: Date;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
  token?: string;
  aiSummary?: string;
  tags?: string[];
}

const generateChartData = (days: number, basePrice: number): ChartPoint[] => {
  const data: ChartPoint[] = [];
  let price = basePrice;
  for (let i = days; i >= 0; i--) {
    price = price * (1 + (Math.random() - 0.48) * 0.08);
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: parseFloat(price.toFixed(8)),
      volume: Math.floor(Math.random() * 50000000) + 5000000,
    });
  }
  return data;
};

export const tokens: Token[] = [
  {
    id: 'sol', name: 'Solana', symbol: 'SOL', price: 178.42, change24h: 12.5,
    volume24h: 2800000000, marketCap: 82000000000, signalScore: 94,
    signals: [], chartData: generateChartData(30, 145),
  },
  {
    id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3842.15, change24h: 5.2,
    volume24h: 18500000000, marketCap: 462000000000, signalScore: 87,
    signals: [], chartData: generateChartData(30, 3500),
  },
  {
    id: 'arb', name: 'Arbitrum', symbol: 'ARB', price: 1.82, change24h: -3.1,
    volume24h: 890000000, marketCap: 6200000000, signalScore: 72,
    signals: [], chartData: generateChartData(30, 1.9),
  },
  {
    id: 'jup', name: 'Jupiter', symbol: 'JUP', price: 1.24, change24h: 28.7,
    volume24h: 450000000, marketCap: 1700000000, signalScore: 96,
    signals: [], chartData: generateChartData(30, 0.85),
  },
  {
    id: 'rndr', name: 'Render', symbol: 'RNDR', price: 10.85, change24h: 8.3,
    volume24h: 620000000, marketCap: 4200000000, signalScore: 81,
    signals: [], chartData: generateChartData(30, 9.2),
  },
  {
    id: 'wif', name: 'dogwifhat', symbol: 'WIF', price: 2.45, change24h: 45.2,
    volume24h: 1200000000, marketCap: 2400000000, signalScore: 98,
    signals: [], chartData: generateChartData(30, 1.2),
  },
  {
    id: 'pendle', name: 'Pendle', symbol: 'PENDLE', price: 6.78, change24h: -1.8,
    volume24h: 180000000, marketCap: 1100000000, signalScore: 65,
    signals: [], chartData: generateChartData(30, 7.1),
  },
  {
    id: 'tia', name: 'Celestia', symbol: 'TIA', price: 15.32, change24h: 6.9,
    volume24h: 340000000, marketCap: 2800000000, signalScore: 78,
    signals: [], chartData: generateChartData(30, 13.5),
  },
  // ── Meme coins ──────────────────────────────────────────────────────────────
  {
    id: 'pepe', name: 'Pepe', symbol: 'PEPE', price: 0.00001312, change24h: 14.2,
    volume24h: 1850000000, marketCap: 5500000000, signalScore: 88,
    signals: [], chartData: generateChartData(30, 0.000008),
  },
  {
    id: 'bonk', name: 'Bonk', symbol: 'BONK', price: 0.00003541, change24h: 22.8,
    volume24h: 920000000, marketCap: 2400000000, signalScore: 91,
    signals: [], chartData: generateChartData(30, 0.000018),
  },
  {
    id: 'shib', name: 'Shiba Inu', symbol: 'SHIB', price: 0.0000248, change24h: 7.4,
    volume24h: 780000000, marketCap: 14600000000, signalScore: 69,
    signals: [], chartData: generateChartData(30, 0.0000200),
  },
  {
    id: 'doge', name: 'Dogecoin', symbol: 'DOGE', price: 0.192, change24h: 9.1,
    volume24h: 2100000000, marketCap: 28000000000, signalScore: 74,
    signals: [], chartData: generateChartData(30, 0.16),
  },
  {
    id: 'popcat', name: 'Popcat', symbol: 'POPCAT', price: 0.823, change24h: 31.5,
    volume24h: 430000000, marketCap: 820000000, signalScore: 93,
    signals: [], chartData: generateChartData(30, 0.45),
  },
  {
    id: 'floki', name: 'Floki', symbol: 'FLOKI', price: 0.000214, change24h: -4.2,
    volume24h: 190000000, marketCap: 2050000000, signalScore: 62,
    signals: [], chartData: generateChartData(30, 0.000180),
  },
];

export const signals: Signal[] = [
  { id: '1', type: 'volume', message: 'Volume spike detected — 340% above average', severity: 'critical', timestamp: new Date(Date.now() - 120000), token: 'WIF' },
  { id: '2', type: 'whale', message: 'Whale accumulation — $4.2M bought in 15 min', severity: 'high', timestamp: new Date(Date.now() - 300000), token: 'SOL' },
  { id: '3', type: 'social', message: 'Social media momentum — trending on CT', severity: 'high', timestamp: new Date(Date.now() - 600000), token: 'JUP' },
  { id: '4', type: 'migration', message: 'Migration event detected — liquidity moving from ETH', severity: 'medium', timestamp: new Date(Date.now() - 900000), token: 'ARB' },
  { id: '5', type: 'news', message: 'Partnership announcement with major protocol', severity: 'medium', timestamp: new Date(Date.now() - 1200000), token: 'RNDR' },
  { id: '6', type: 'volume', message: 'Unusual volume pattern — smart money inflow', severity: 'high', timestamp: new Date(Date.now() - 1800000), token: 'PENDLE' },
  { id: '7', type: 'whale', message: 'Top wallet added $8.1M position', severity: 'critical', timestamp: new Date(Date.now() - 2400000), token: 'ETH' },
  { id: '8', type: 'social', message: 'Influencer spotlight — 12 KOL mentions in 1hr', severity: 'medium', timestamp: new Date(Date.now() - 3600000), token: 'WIF' },
  { id: '9', type: 'volume', message: 'DEX volume surge — 5x normal levels', severity: 'critical', timestamp: new Date(Date.now() - 4200000), token: 'JUP' },
  { id: '10', type: 'news', message: 'Mainnet upgrade announced — bullish catalyst', severity: 'high', timestamp: new Date(Date.now() - 5400000), token: 'TIA' },
  { id: '11', type: 'social', message: 'PEPE trending on X — memecoin rotation signal', severity: 'high', timestamp: new Date(Date.now() - 800000), token: 'PEPE' },
  { id: '12', type: 'volume', message: 'BONK volume 8x — Solana meme season igniting', severity: 'critical', timestamp: new Date(Date.now() - 600000), token: 'BONK' },
  { id: '13', type: 'social', message: 'POPCAT viral loop detected — CT FOMO building', severity: 'high', timestamp: new Date(Date.now() - 1500000), token: 'POPCAT' },
];

export const whaleTransactions: WhaleTransaction[] = [
  { id: '1', token: 'SOL', type: 'buy', amount: 23500, usdValue: 4192700, wallet: '0x7a3...f92d', timestamp: new Date(Date.now() - 180000) },
  { id: '2', token: 'ETH', type: 'buy', amount: 2100, usdValue: 8068515, wallet: '0x3b1...a47e', timestamp: new Date(Date.now() - 420000) },
  { id: '3', token: 'WIF', type: 'buy', amount: 850000, usdValue: 2082500, wallet: '0x9c4...d81b', timestamp: new Date(Date.now() - 780000) },
  { id: '4', token: 'JUP', type: 'sell', amount: 1200000, usdValue: 1488000, wallet: '0x5e8...c23f', timestamp: new Date(Date.now() - 1500000) },
  { id: '5', token: 'RNDR', type: 'buy', amount: 95000, usdValue: 1030750, wallet: '0x2d6...b17a', timestamp: new Date(Date.now() - 2700000) },
  { id: '6', token: 'PEPE', type: 'buy', amount: 2500000000, usdValue: 3280000, wallet: '0x8f1...e44c', timestamp: new Date(Date.now() - 350000) },
  { id: '7', token: 'BONK', type: 'buy', amount: 18000000000, usdValue: 637000, wallet: 'FKzH...9uRq', timestamp: new Date(Date.now() - 510000) },
];

export const newsItems: NewsItem[] = [
  {
    id: '1', title: 'Solana TVL hits new ATH as DeFi activity surges', source: 'CoinDesk',
    sentiment: 'positive', timestamp: new Date(Date.now() - 300000), token: 'SOL',
    aiSummary: 'On-chain metrics confirm sustained capital inflow. Smart money concentration increasing. Probability of continued upside: HIGH.',
    tags: ['BULLISH', 'HIGH IMPACT', 'VERIFIED'],
  },
  {
    id: '2', title: 'Jupiter announces V3 with advanced routing', source: 'The Block',
    sentiment: 'positive', timestamp: new Date(Date.now() - 900000), token: 'JUP',
    aiSummary: 'Protocol upgrade introduces MEV-resistant routing. Expected 40% volume increase. Dev activity spiked 3x in past 48h.',
    tags: ['BULLISH', 'DEV SIGNAL'],
  },
  {
    id: '3', title: 'Ethereum gas fees spike amid NFT mint frenzy', source: 'Decrypt',
    sentiment: 'neutral', timestamp: new Date(Date.now() - 1800000), token: 'ETH',
    aiSummary: 'Temporary congestion event. Network utilization at 94%. Layer 2 migration accelerating. Monitor for reversion.',
    tags: ['WATCH', 'CONGESTION'],
  },
  {
    id: '4', title: 'Render Network partners with major AI platform', source: 'CryptoSlate',
    sentiment: 'positive', timestamp: new Date(Date.now() - 3600000), token: 'RNDR',
    aiSummary: 'Strategic AI partnership creates new demand vector for GPU compute. Token unlock schedule favorable. Accumulation pattern detected.',
    tags: ['BULLISH', 'PARTNERSHIP', 'HIGH IMPACT'],
  },
  {
    id: '5', title: 'Celestia modular thesis gains institutional backing', source: 'Blockworks',
    sentiment: 'positive', timestamp: new Date(Date.now() - 5400000), token: 'TIA',
    aiSummary: 'Two Tier-1 funds confirmed positions. Data availability sector narrative strengthening. 90-day price target revised upward.',
    tags: ['INSTITUTIONAL', 'BULLISH'],
  },
  {
    id: '6', title: 'Memecoin market cap crosses $60B milestone', source: 'DL News',
    sentiment: 'neutral', timestamp: new Date(Date.now() - 7200000),
    aiSummary: 'Sector rotation signal detected. Retail sentiment at extreme greed. Risk-adjusted entry points limited. Exercise caution.',
    tags: ['CAUTION', 'SECTOR ROTATION'],
  },
];

export const formatNumber = (n: number): string => {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
};

export const formatPrice = (n: number): string => {
  if (n >= 1000) return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (n >= 1)    return `$${n.toFixed(3)}`;
  if (n >= 0.01) return `$${n.toFixed(4)}`;
  if (n >= 0.0001) return `$${n.toFixed(6)}`;
  // Very small (PEPE, SHIB, BONK range) — show significant digits
  const sig = n.toPrecision(4);
  return `$${sig}`;
};

export const timeAgo = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};
