import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  // Don't render on touch/mobile devices
  if (window.matchMedia("(pointer: coarse)").matches) return null;

  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    const loop = () => {
      const lerp = 0.18;
      const cx = currentRef.current.x + (targetRef.current.x - currentRef.current.x) * lerp;
      const cy = currentRef.current.y + (targetRef.current.y - currentRef.current.y) * lerp;
      currentRef.current = { x: cx, y: cy };
      setPos({ x: Math.round(cx), y: Math.round(cy) });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate(-50%, -50%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s",
      }}
    >
      {/* Crosshair lines */}
      <svg width="28" height="28" viewBox="0 0 28 28" style={{ display: "block" }}>
        {/* Horizontal left */}
        <line x1="0" y1="14" x2="10" y2="14" stroke="hsl(145,70%,42%)" strokeWidth="1" />
        {/* Horizontal right */}
        <line x1="18" y1="14" x2="28" y2="14" stroke="hsl(145,70%,42%)" strokeWidth="1" />
        {/* Vertical top */}
        <line x1="14" y1="0" x2="14" y2="10" stroke="hsl(145,70%,42%)" strokeWidth="1" />
        {/* Vertical bottom */}
        <line x1="14" y1="18" x2="14" y2="28" stroke="hsl(145,70%,42%)" strokeWidth="1" />
        {/* Center dot */}
        <circle cx="14" cy="14" r="1.2" fill="hsl(145,70%,42%)" />
      </svg>

      {/* Coordinates label */}
      <span
        style={{
          position: "absolute",
          left: 18,
          top: 18,
          fontFamily: "'Space Mono', monospace",
          fontSize: "9px",
          letterSpacing: "0.05em",
          color: "hsl(145,70%,42%)",
          whiteSpace: "nowrap",
          opacity: 0.75,
          lineHeight: 1,
        }}
      >
        x:{Math.round(targetRef.current.x)}, y:{Math.round(targetRef.current.y)}
      </span>
    </div>
  );
};

export default CustomCursor;
