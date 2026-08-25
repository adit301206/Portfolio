/*
 * NOVA Stack — core technology stack: scanning marquee strips + categorical grid.
 * Style: Orbital Command (ideas.md).
 */
import { motion } from "framer-motion";
import { Code2, Database, BrainCircuit, Cloud } from "lucide-react";
import { PROFILE } from "@/lib/data";

const GROUPS = [
  {
    icon: BrainCircuit,
    title: "AI / ML",
    accent: "text-mint-sig",
    items: PROFILE.stack.filter((s) =>
      ["TensorFlow", "PyTorch", "Scikit-Learn", "Pandas", "Plotly"].includes(s),
    ),
  },
  {
    icon: Cloud,
    title: "Backend / Data",
    accent: "text-nova",
    items: PROFILE.stack.filter((s) =>
      ["Django", "Flask", "Node.js", "Express", "PostgreSQL", "MongoDB", "Docker", "Python", "TypeScript", "Git"].includes(s),
    ),
  },
  {
    icon: Code2,
    title: "Frontend",
    accent: "text-mint-sig",
    items: PROFILE.stack.filter((s) =>
      ["React", "Three.js", "JavaScript", "Tailwind v4"].includes(s),
    ),
  },
  {
    icon: Database,
    title: "In Progress",
    accent: "text-nova",
    items: ["Kubernetes", "Apache Kafka", "MLOps Pipelines", "LLM Fine-tuning"],
  },
];

const MARQUEE = [
  ...PROFILE.stack,
  ...PROFILE.stack,
];

export default function Stack() {
  return (
    <section id="stack" className="relative py-28 sm:py-36 overflow-hidden">
      {/* marquee band */}
      <div className="relative border-y border-border bg-void-2/90 py-5 overflow-hidden shadow-xs">
        <div className="marquee-track items-center">
          {[0, 1].map((half) => (
            <div key={half} className="flex items-center shrink-0" aria-hidden={half === 1}>
              {MARQUEE.map((t, i) => (
                <span key={`${half}-${i}`} className="inline-flex items-center">
                  <span className="font-mono text-sm tracking-[0.16em] uppercase text-muted-foreground px-5">
                    {t}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40 dark:bg-nova/50" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="eyebrow mb-4">
            <span className="text-primary dark:text-nova/70 font-mono">04</span> / Core Systems
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Engineered with the <span className="text-primary dark:text-mint-sig glow-mint">right tools</span>
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground text-lg leading-relaxed">
            The NOVA console runs on a stack tuned for AI experiments, backend
            systems, and data pipelines.
          </p>
        </motion.div>

        <div className="mt-14 grid sm:grid-cols-2 gap-6">
          {GROUPS.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: 0.06 * i, ease: [0.23, 1, 0.32, 1] }}
              className="hud-corner border border-border bg-card p-7 shadow-md rounded-xl hover:border-primary/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-5">
                <g.icon size={18} className={g.accent} />
                <h3 className="font-display font-semibold text-lg text-foreground">{g.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[11px] tracking-[0.14em] uppercase px-3 py-1.5 border border-border bg-void-2 text-foreground/90 font-medium hover:border-primary hover:text-primary transition-colors rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
