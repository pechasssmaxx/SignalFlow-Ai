import { Link } from "react-router-dom";
import { useState } from "react";

const SoonLink = ({ label }: { label: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      className="relative inline-flex items-center gap-2 text-sm text-muted-foreground/50 cursor-not-allowed select-none w-fit"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
      {hovered && (
        <span className="text-[9px] uppercase tracking-[0.15em] font-bold font-mono border border-primary/40 text-primary px-1.5 py-0.5 leading-none">
          Soon
        </span>
      )}
    </span>
  );
};

const Footer = () => {
  return (
    <footer className="px-6 lg:px-10 py-16 border-t border-foreground/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            There is a certain beauty in chaos, in the uncontrollable.
          </p>
        </div>

        <div>
          <span className="data-label mb-4 block">Product</span>
          <div className="flex flex-col gap-2">
            <Link to="/dashboard" className="text-sm hover:text-muted-foreground transition-colors">Dashboard</Link>
            <a href="#features" className="text-sm hover:text-muted-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm hover:text-muted-foreground transition-colors">Pricing</a>
          </div>
        </div>

        <div>
          <span className="data-label mb-4 block">Resources</span>
          <div className="flex flex-col gap-2">
            <SoonLink label="Docs" />
            <SoonLink label="API" />
            <Link to="/faq" className="text-sm hover:text-muted-foreground transition-colors">FAQ</Link>
          </div>
        </div>

        <div>
          <span className="data-label mb-4 block">Socials</span>
          <div className="flex flex-col gap-2">
            <a
              href="https://x.com/og_scopesol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-muted-foreground transition-colors"
            >
              X / Twitter
            </a>
            <span className="text-sm text-muted-foreground/50 cursor-not-allowed">Discord</span>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-6 border-t border-foreground/10 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">SignalScope AI © 2026</span>
        <span className="text-[10px] text-muted-foreground font-mono">x:0, y:0</span>
      </div>
    </footer>
  );
};

export default Footer;
