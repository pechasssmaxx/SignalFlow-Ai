import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";

// ── Geometric lines background (original) ────────────────────────────────────

const paths = [
  "M 400 100 Q 700 50 900 200 Q 1100 350 800 500 Q 500 650 700 800",
  "M 500 50 Q 800 100 1000 250 Q 1200 400 900 550 Q 600 700 800 850",
  "M 300 150 Q 600 80 850 280 Q 1050 420 750 580 Q 450 720 650 870",
  "M 600 30 Q 900 120 1100 300 Q 1300 480 1000 600 Q 700 720 900 880",
];

const diamonds: [number, number][] = [
  [400, 100], [900, 200], [800, 500], [700, 800],
  [600, 350], [1000, 250], [850, 280], [750, 580],
];

const GeometricLines = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={mounted ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2.5, delay: i * 0.4, ease: "easeInOut" }}
        />
      ))}
      {diamonds.map(([cx, cy], i) => (
        <motion.rect
          key={i}
          x={cx - 4} y={cy - 4} width={8} height={8}
          fill="black"
          transform={`rotate(45 ${cx} ${cy})`}
          initial={{ opacity: 0, scale: 0 }}
          animate={mounted ? { opacity: 0.15, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.2 + i * 0.15, ease: "backOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}
        />
      ))}
      {mounted && paths.map((d, i) => (
        <circle key={`dot-${i}`} r="2.5" fill="hsl(145 70% 42%)" opacity="0.6">
          <animateMotion dur={`${6 + i * 2}s`} repeatCount="indefinite" begin={`${2 + i * 0.5}s`}>
            <mpath href={`#geopath-${i}`} />
          </animateMotion>
        </circle>
      ))}
      {paths.map((d, i) => (
        <path key={`ref-${i}`} id={`geopath-${i}`} d={d} fill="none" stroke="none" />
      ))}
    </svg>
  );
};

// ── Particle canvas with glitch + transactions ────────────────────────────────

const TX_POOL = [
  "0x4a7b3c2d1e9f", "0xf8e91a3b7c2d",
  "WHALE 847 ETH →", "SELL 2.3M $PEPE",
  "BUY $WIF +18.4%", "0x9c4f2e1a8b5d",
  "SIGNAL 94 CONF",  "BRIDGE SOL→ETH",
  "DEX SWAP 142k",   "SMART MONEY ▲",
  "0xbd72a1e4c830", "BUY $BONK x312",
];

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let frame = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Particles
    const COUNT = 320;
    type P = { x: number; y: number; vx: number; vy: number; hue: number; speed: number };
    const particles: P[] = Array.from({ length: COUNT }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0, vy: 0,
      hue: 250 + (i / COUNT) * 120,
      speed: 0.5 + Math.random() * 1.4,
    }));

    // Transactions
    const TX_COLORS = [[34,197,94],[99,179,237],[251,191,36],[236,72,153],[129,140,248]];
    type TX = { x: number; y: number; text: string; alpha: number; speed: number; r:number; g:number; b:number };
    const txs: TX[] = [];

    const spawnTx = () => {
      const [r,g,b] = TX_COLORS[Math.floor(Math.random() * TX_COLORS.length)];
      txs.push({
        x: canvas.width + 20,
        y: 30 + Math.random() * (canvas.height - 60),
        text: TX_POOL[Math.floor(Math.random() * TX_POOL.length)],
        alpha: 0.25 + Math.random() * 0.35,
        speed: 0.5 + Math.random() * 1.4,
        r, g, b,
      });
    };

    // Glitch lines
    type GL = { y: number; alpha: number; w: number; x: number };
    const glitches: GL[] = [];

    const tick = () => {
      frame++;
      ctx.fillStyle = "rgba(0,0,0,0.038)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Particles
      for (const p of particles) {
        const angle =
          Math.sin(p.x * 0.006) * Math.cos(p.y * 0.006) * Math.PI * 2 +
          Math.cos((p.x + p.y) * 0.003) * Math.PI;
        p.vx = p.vx * 0.94 + Math.cos(angle) * p.speed * 0.06;
        p.vy = p.vy * 0.94 + Math.sin(angle) * p.speed * 0.06;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,62%,0.65)`;
        ctx.fill();
      }

      // Transactions
      if (frame % 50 === 0) spawnTx();
      ctx.font = "10px monospace";
      for (let i = txs.length - 1; i >= 0; i--) {
        const tx = txs[i];
        tx.x -= tx.speed;
        ctx.fillStyle = `rgba(${tx.r},${tx.g},${tx.b},${tx.alpha})`;
        ctx.fillText(tx.text, tx.x, tx.y);
        const tw = ctx.measureText(tx.text).width;
        ctx.fillStyle = `rgba(${tx.r},${tx.g},${tx.b},${tx.alpha * 0.3})`;
        ctx.fillRect(tx.x, tx.y + 3, tw, 0.5);
        ctx.beginPath();
        ctx.arc(tx.x - 4, tx.y - 3, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${tx.r},${tx.g},${tx.b},${Math.min(1, tx.alpha * 1.6)})`;
        ctx.fill();
        if (tx.x < -300) txs.splice(i, 1);
      }

      // Glitch scan lines
      if (Math.random() < 0.018) {
        glitches.push({ y: Math.random() * canvas.height, alpha: 0.5, w: 60 + Math.random() * 260, x: Math.random() * canvas.width * 0.5 });
      }
      for (let i = glitches.length - 1; i >= 0; i--) {
        const g = glitches[i];
        g.alpha -= 0.045;
        if (g.alpha <= 0) { glitches.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(34,197,94,${g.alpha * 0.2})`;
        ctx.fillRect(g.x, g.y, g.w, 1);
        if (g.alpha > 0.25) {
          ctx.fillStyle = `rgba(255,255,255,${g.alpha * 0.07})`;
          ctx.fillRect(g.x, g.y - 2, g.w * 0.55, 0.5);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafId); ro.disconnect(); };
  }, []);

  return (
    <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
  );
};

// ── Text Scramble (auto-loop every 4s) ───────────────────────────────────────

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";

function useTextScramble(text: string) {
  const [output, setOutput] = useState(text);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    let step = 0;
    const steps = text.length * 3;
    timerRef.current = setInterval(() => {
      setOutput(
        text.split("").map((char, idx) => {
          if (char === " ") return " ";
          if (idx < Math.floor(step / 3)) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join("")
      );
      step++;
      if (step > steps) { clearInterval(timerRef.current!); setOutput(text); }
    }, 40);
  }, [text]);

  useEffect(() => {
    const init = setTimeout(scramble, 700);
    const loop = setInterval(scramble, 4000);
    return () => { clearTimeout(init); clearInterval(loop); if (timerRef.current) clearInterval(timerRef.current); };
  }, [scramble]);

  return { output, scramble };
}

const ScrambleText = ({ text, className }: { text: string; className?: string }) => {
  const { output, scramble } = useTextScramble(text);
  return (
    <span className={className} onMouseEnter={scramble} style={{ fontVariantNumeric: "tabular-nums", cursor: "default" }}>
      {output}
    </span>
  );
};

// ── Hero ─────────────────────────────────────────────────────────────────────

const Hero = () => {
  const [elapsed, setElapsed] = useState({ d: 41, h: 20, m: 16, s: 14 });

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => {
        let s = prev.s + 1, m = prev.m, h = prev.h, d = prev.d;
        if (s >= 60) { s = 0; m++; }
        if (m >= 60) { m = 0; h++; }
        if (h >= 24) { h = 0; d++; }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      <GeometricLines />

      {/* Corner markers */}
      <div className="absolute top-6 left-6 w-3 h-3 border-l-[1.5px] border-t-[1.5px] border-foreground" />
      <div className="absolute top-6 right-6 w-3 h-3 border-r-[1.5px] border-t-[1.5px] border-foreground" />
      <div className="absolute bottom-6 left-6 w-3 h-3 border-l-[1.5px] border-b-[1.5px] border-foreground" />
      <div className="absolute bottom-6 right-6 w-3 h-3 border-r-[1.5px] border-b-[1.5px] border-foreground" />

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="w-full px-6 lg:px-10 pt-20 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Left — Logo + Copy */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-[clamp(2rem,5.5vw,5rem)] font-bold leading-[0.85] tracking-tighter font-display">
                  OG AI
                  <br />
                  SCOPE
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="max-w-md"
              >
                <h2 className="text-base lg:text-lg font-display font-semibold leading-tight mb-2">
                  The smartest AI engine
                  <br />
                  for tracking{" "}
                  <ScrambleText
                    text="SHITCOINS"
                    className="italic text-primary text-2xl lg:text-3xl"
                  />
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                  Real-time whale tracking, social momentum analysis, and AI-driven confidence scoring across 12 chains. Built for degens, by degens.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4"
              >
                <Link
                  to="/dashboard"
                  className="px-6 py-3 bg-primary text-primary-foreground text-xs uppercase tracking-[0.2em] font-bold hover:brightness-110 transition-all"
                >
                  Launch App
                </Link>
                <a href="#features" className="text-xs uppercase tracking-[0.2em] hover:text-muted-foreground transition-colors">
                  [ View Signals ]
                </a>
              </motion.div>
            </div>

            {/* Center spacer */}
            <div className="hidden lg:block lg:col-span-3" />

            {/* Right — Data readouts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="lg:col-span-4 flex flex-col gap-0"
            >
              <div className="border-b border-foreground/15 pb-3 mb-3 flex items-center justify-between">
                <span className="data-label">Since Launch</span>
                <span className="text-lg font-bold font-mono tracking-tight">
                  {String(elapsed.d).padStart(2,'0')}:{String(elapsed.h).padStart(2,'0')}:{String(elapsed.m).padStart(2,'0')}:{String(elapsed.s).padStart(2,'0')}
                </span>
              </div>
              <div className="border-b border-foreground/15 pb-3 mb-3">
                <span className="data-label">Signal Frequency</span>
                <div className="flex justify-end gap-6 mt-1">
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">Rate</span>
                    <p className="data-value">47/hr</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">Direction</span>
                    <p className="data-value">Bullish</p>
                  </div>
                </div>
              </div>
              <div className="border-b border-foreground/15 pb-3 mb-3">
                <span className="data-label">Coverage</span>
                <div className="text-right mt-1">
                  <p className="data-value">2,841 Tokens</p>
                  <p className="data-value">14 Chains</p>
                </div>
              </div>
              <div className="pb-3">
                <span className="data-label">Status</span>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="data-value">Operational</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>


      </div>

      {/* Marquee ticker */}
      <div className="border-t border-b border-foreground/15 py-3 overflow-hidden relative z-10">
        <div className="marquee-track">
          {Array.from({ length: 20 }).map((_, i) => (
            <Link
              key={i}
              to="/dashboard"
              className="flex items-center gap-3 px-4 text-xs uppercase tracking-[0.2em] font-bold whitespace-nowrap hover:text-primary transition-colors"
            >
              <span className="w-1.5 h-1.5 bg-foreground" />
              Launch Dashboard
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
