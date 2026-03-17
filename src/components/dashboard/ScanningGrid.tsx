import { useEffect, useRef } from "react";

const ScanningGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    const CELL = 64;
    const glowCells: { gx: number; gy: number; opacity: number }[] = [];

    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / CELL);
      const rows = Math.ceil(canvas.height / CELL);

      // Grid lines — very faint
      ctx.strokeStyle = "rgba(0,0,0,0.045)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL + 0.5, 0);
        ctx.lineTo(x * CELL + 0.5, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL + 0.5);
        ctx.lineTo(canvas.width, y * CELL + 0.5);
        ctx.stroke();
      }

      // Occasionally spawn a glow cell
      if (Math.random() < 0.025) {
        glowCells.push({
          gx: Math.floor(Math.random() * cols),
          gy: Math.floor(Math.random() * rows),
          opacity: 0.12,
        });
      }

      // Draw & decay glow cells
      for (let i = glowCells.length - 1; i >= 0; i--) {
        const c = glowCells[i];
        ctx.fillStyle = `rgba(34,197,94,${c.opacity})`;
        ctx.fillRect(c.gx * CELL + 1, c.gy * CELL + 1, CELL - 2, CELL - 2);
        c.opacity -= 0.0025;
        if (c.opacity <= 0) glowCells.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

export default ScanningGrid;
