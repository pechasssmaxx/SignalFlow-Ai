import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-24 px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="border border-foreground/10 p-12 lg:p-20 relative"
      >
        {/* Corner markers */}
        <div className="absolute top-3 left-3 w-3 h-3 border-l-[1.5px] border-t-[1.5px] border-foreground" />
        <div className="absolute top-3 right-3 w-3 h-3 border-r-[1.5px] border-t-[1.5px] border-foreground" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-l-[1.5px] border-b-[1.5px] border-foreground" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-r-[1.5px] border-b-[1.5px] border-foreground" />

        <div className="text-center max-w-2xl mx-auto">
          <span className="data-label">Get Started</span>
          <h2 className="text-4xl lg:text-6xl font-display font-bold tracking-tight mt-3 mb-4">
            Ready to find alpha?
          </h2>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed max-w-md mx-auto">
            Join thousands of traders using AI-powered signals to stay ahead of the market. No noise. Pure signal.
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground text-xs uppercase tracking-[0.2em] font-bold hover:brightness-110 transition-all"
          >
            Launch Dashboard
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
