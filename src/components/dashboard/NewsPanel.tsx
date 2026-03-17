import { motion } from "framer-motion";
import { newsItems, timeAgo } from "@/data/mockData";

const NewsPanel = () => {
  return (
    <div className="border border-foreground/10">
      <div className="flex items-center justify-between px-6 py-3 border-b border-foreground/10">
        <span className="text-xs uppercase tracking-[0.15em] font-bold">News Feed</span>
        <span className="text-xs text-muted-foreground font-mono">{newsItems.length} stories</span>
      </div>
      <div className="divide-y divide-foreground/5">
        {newsItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="px-6 py-4 hover:bg-card transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className={`w-1.5 h-1.5 mt-1.5 flex-shrink-0 ${
                item.sentiment === 'positive' ? 'bg-success' :
                item.sentiment === 'negative' ? 'bg-destructive' : 'bg-muted-foreground'
              }`} />
              <div>
                <p className="text-sm font-medium leading-snug mb-1">{item.title}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                  <span>{item.source}</span>
                  {item.token && <><span>·</span><span className="font-bold">{item.token}</span></>}
                  <span>·</span>
                  <span>{timeAgo(item.timestamp)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NewsPanel;
