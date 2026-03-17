import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Features",     href: "#features"      },
  { label: "How It Works", href: "#how-it-works"   },
  { label: "Pulse",        href: "#signals-live"   },
];

const Navbar = () => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      const nav = document.getElementById("main-nav");
      if (nav && !nav.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen ? "bg-background/95 backdrop-blur-sm border-b border-foreground/10" : ""
      }`}
    >
      {/* Main bar */}
      <div className="flex items-center justify-between px-6 lg:px-10 py-5">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold tracking-tight font-display">SIGNALSCOPE</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.15em]">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 bg-primary text-primary-foreground text-xs uppercase tracking-[0.15em] font-bold hover:brightness-110 transition-all"
          >
            Launch App
          </Link>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8 shrink-0"
            aria-label="Toggle menu"
          >
            <span className={`block h-px bg-foreground transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
            <span className={`block h-px bg-foreground transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px bg-foreground transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-foreground/10 bg-background/98 px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 text-sm uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground border-b border-foreground/5 last:border-0 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="mt-3 py-3 text-center bg-primary text-primary-foreground text-xs uppercase tracking-[0.15em] font-bold"
          >
            Launch App
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
