import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokens } from "@/data/mockData";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search tokens... (type symbol or name)" />
      <CommandList>
        <CommandEmpty>No tokens found.</CommandEmpty>
        <CommandGroup heading="Trending Tokens">
          {tokens.map(token => (
            <CommandItem
              key={token.id}
              value={`${token.symbol} ${token.name}`}
              onSelect={() => {
                navigate(`/token/${token.id}`);
                setOpen(false);
              }}
              className="flex items-center gap-3"
            >
              <span className="w-7 h-7 border border-foreground/20 flex items-center justify-center text-[9px] font-bold shrink-0">
                {token.symbol.slice(0, 2)}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider">{token.symbol}</span>
                <span className="text-xs text-muted-foreground ml-2">{token.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-mono ${token.change24h >= 0 ? "text-primary" : "text-destructive"}`}>
                  {token.change24h >= 0 ? "+" : ""}{token.change24h}%
                </span>
                <span className="text-[10px] font-mono text-muted-foreground border border-foreground/10 px-1.5 py-0.5">
                  {token.signalScore}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      <div className="border-t border-foreground/10 px-4 py-2 flex items-center gap-4">
        <span className="text-[10px] text-muted-foreground font-mono">
          <kbd className="border border-foreground/20 px-1 py-0.5 text-[9px] mr-1">↵</kbd>
          select
        </span>
        <span className="text-[10px] text-muted-foreground font-mono">
          <kbd className="border border-foreground/20 px-1 py-0.5 text-[9px] mr-1">esc</kbd>
          close
        </span>
        <span className="text-[10px] text-muted-foreground font-mono ml-auto">
          <kbd className="border border-foreground/20 px-1 py-0.5 text-[9px] mr-1">⌘K</kbd>
          toggle
        </span>
      </div>
    </CommandDialog>
  );
};

export default CommandPalette;
