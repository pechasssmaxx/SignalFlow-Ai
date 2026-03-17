import { motion } from "framer-motion";
import { Activity, Eye, Brain, Waves, Radar, TrendingUp } from "lucide-react";

const features = [
  { icon: Brain, title: "AI Signal Detection", description: "Neural networks scan thousands of data points to detect patterns invisible to human traders." },
  { icon: Waves, title: "Whale Tracking", description: "Real-time monitoring of large wallet movements and smart money flows across chains." },
  { icon: Radar, title: "Social Radar", description: "Track crypto Twitter, Telegram, and Discord sentiment shifts as they happen." },
  { icon: Activity, title: "On-Chain Analytics", description: "Deep analysis of transaction patterns, liquidity flows, and DEX activity." },
  { icon: Eye, title: "Early Alerts", description: "Get notified before tokens trend. Our AI identifies momentum 10-30 minutes early." },
  { icon: TrendingUp, title: "Signal Scoring", description: "Every signal scored 0-100 based on confidence, combining multiple data sources." },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-6 lg:px-10">
      <div className="mb-16">
        <span className="data-label">Features</span>
        <h2 className="text-4xl lg:text-5xl font-display font-bold tracking-tight mt-2">
          Intelligence at every layer
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-background p-8 lg:p-10 group hover:bg-card transition-colors"
          >
            <feature.icon className="w-5 h-5 mb-6 text-muted-foreground group-hover:text-foreground transition-colors" strokeWidth={1.5} />
            <h3 className="text-lg font-display font-semibold mb-3">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
