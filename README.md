<div align="center">

```
███████╗██╗ ██████╗ ███╗   ██╗ █████╗ ██╗      ███████╗ ██████╗ ██████╗ ██████╗ ███████╗
██╔════╝██║██╔════╝ ████╗  ██║██╔══██╗██║      ██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝
███████╗██║██║  ███╗██╔██╗ ██║███████║██║      ███████╗██║     ██║   ██║██████╔╝█████╗
╚════██║██║██║   ██║██║╚██╗██║██╔══██║██║      ╚════██║██║     ██║   ██║██╔═══╝ ██╔══╝
███████║██║╚██████╔╝██║ ╚████║██║  ██║███████╗ ███████║╚██████╗╚██████╔╝██║     ███████╗
╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚══════╝
```

**Real-time crypto signal intelligence. See the signal through the noise.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)

</div>

---

> *"Most traders drown in noise. SignalScope surfaces the 1% of on-chain activity that actually matters — whale accumulation, volume anomalies, social momentum shifts — before they become obvious."*

---

## What It Does

SignalScope is a tactical crypto intelligence dashboard that aggregates **real-time on-chain signals**, **whale wallet movements**, **social momentum**, and **live DEX prices** into a single, surgical interface.

No subscription tiers. No paywalls. No noise.

Built for traders who want to see what's happening *before* it's on CT.

---

## Live Data Sources

| Source | Data | Refresh |
|--------|------|---------|
| **CoinGecko API** | Price, volume, market cap — BTC, ETH, SOL, BNB + 10 more | 60s |
| **DexScreener API** | DEX-accurate prices for PEPE, BONK, SHIB, POPCAT, FLOKI | 60s |
| **On-chain signal feed** | Whale transactions, volume spikes, migration events | Live |

Prices update from two independent sources and are merged — DexScreener takes priority for meme coins since it reflects actual DEX liquidity more accurately than centralized aggregators.

---

## Dashboard Pages

### Overview
Live stats bar with active signals, whale transactions, and market sentiment. Sector heatmap across Memes / DeFi / AI / Layer 2 / GameFi / RWA. ETH + SOL gas tracker.

### Signals
Full signal feed with severity tiers — **critical / high / medium / low**. Each signal includes animated waveform visualization, decoded message effect, and expandable raw transaction data with block number, gas, and chain info.

### Tokens
16-token table with real-time prices from CoinGecko + DexScreener. Sparkline trend charts, heat score mode, HUD tactical overlay on hover, sort by signal strength.

### News
Intel-style news feed with AI summaries, typed terminal reveal effect, sentiment classification, and watchlist token highlighting.

---

## Token Coverage

**Major:**
`BTC` `ETH` `SOL` `BNB` `ARB` `JUP` `RNDR` `TIA` `PENDLE` `WIF`

**Meme coins (via DexScreener):**
`PEPE` `BONK` `SHIB` `DOGE` `POPCAT` `FLOKI`

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   SignalScope                        │
│                                                     │
│  ┌──────────────┐    ┌──────────────────────────┐   │
│  │  CoinGecko   │    │      DexScreener         │   │
│  │  simple/price│    │  /tokens/{addresses}     │   │
│  └──────┬───────┘    └────────────┬─────────────┘   │
│         │                        │                  │
│         └──────────┬─────────────┘                  │
│                    ▼                                 │
│            useLivePrices()                          │
│         (merges both sources,                       │
│          DEX overwrites meme coins)                 │
│                    │                                 │
│    ┌───────────────┼───────────────┐                 │
│    ▼               ▼               ▼                 │
│ LiveTicker   TrendingTokens   TokensPage             │
│ (16 tokens)  (watchlist +     (sparklines +          │
│              confluence)       HUD overlay)          │
└─────────────────────────────────────────────────────┘
```

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 + SWC |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion 12 |
| Data fetching | TanStack Query v5 |
| Charts | Recharts |
| Routing | React Router v6 |
| Package manager | Bun |
| Deployment | Docker + nginx on Railway |

---

## UI Details

- **Custom crosshair cursor** with lerp smoothing and live coordinates (desktop only, auto-disabled on touch)
- **Live ticker** — 16 tokens scrolling continuously, micro-fluctuation between API refreshes
- **Scanning grid** — canvas-based background pulse animation
- **Glitch-in transitions** — page switches with clip-path distortion effect
- **Decode text effect** — signals reveal character-by-character
- **Watchlist** — star any token, persisted to localStorage, floats to top
- **Command palette** — `⌘K` fuzzy search across all tokens
- **Confluence detection** — cross-source buy/sell signal highlighting
- **Hamburger menu** — fully responsive, works on any screen size

---

## Run Locally

```bash
# Clone
git clone https://github.com/pechasssmaxx/SignalFlow-Ai.git
cd SignalFlow-Ai

# Install (uses Bun)
bun install

# Dev server → localhost:8080
bun run dev
```

No API keys needed. CoinGecko and DexScreener are both free public APIs.

---

## Deploy

Ships with a production-ready Docker setup:

```bash
# Build
docker build -t signalscope .

# Run
docker run -p 8080:8080 -e PORT=8080 signalscope
```

nginx handles SPA routing (`try_files $uri /index.html`), gzip compression, and 1-year asset caching for Vite's content-hashed bundles.

**Railway:** connect repo → auto-detects Dockerfile → assign domain → SSL included.

---

## Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── LiveTicker.tsx       # 16-token scrolling price strip
│   │   ├── SignalsPage.tsx      # Signal feed with waveforms
│   │   ├── TokensPage.tsx       # Token table with HUD overlay
│   │   ├── NewsPageFull.tsx     # Intel-style news feed
│   │   ├── TrendingTokens.tsx   # Watchlist-aware token table
│   │   ├── WhaleActivity.tsx    # Whale tx feed + radar scanner
│   │   ├── ScanningGrid.tsx     # Canvas background animation
│   │   └── SectorHeatmap.tsx    # Sector signal intensity bars
│   └── landing/
│       ├── Hero.tsx             # Particle flow + scramble text
│       └── Navbar.tsx           # Responsive + mobile hamburger
├── hooks/
│   ├── useMarketData.ts         # CoinGecko API hook
│   ├── useDexScreener.ts        # DexScreener API hook
│   └── useLivePrices.ts         # Merged live price source
├── data/
│   └── mockData.ts              # Token list + signal feed data
└── pages/
    ├── Dashboard.tsx            # 4-tab dashboard
    └── TokenDetail.tsx          # Individual token deep-dive
```

---

<div align="center">

**Built with precision. Deployed with intent.**

*SignalScope — See the signal through the noise*

</div>
