import { motion } from "framer-motion";

const steps = [
  { step: "01", title: "Data Ingestion", description: "We pull data from 50+ sources — DEXs, social platforms, on-chain explorers, and news feeds." },
  { step: "02", title: "AI Processing", description: "Our neural engine analyzes patterns, correlations, and anomalies across all data streams." },
  { step: "03", title: "Signal Generation", description: "Actionable signals are scored and prioritized based on confidence and potential impact." },
  { step: "04", title: "Dashboard Delivery", description: "Signals appear in your real-time dashboard with full context and recommended actions." },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 lg:px-10">
      <div className="mb-16">
        <span className="data-label">Process</span>
        <h2 className="text-4xl lg:text-5xl font-display font-bold tracking-tight mt-2">
          From noise to signal
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10">
        {steps.map((step, i) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="bg-background p-8 lg:p-10 relative"
          >
            <span className="text-6xl font-bold text-foreground/5 font-mono absolute top-4 right-6">{step.step}</span>
            <span className="data-label">{step.step}</span>
            <h3 className="text-lg font-display font-semibold mt-4 mb-3">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
