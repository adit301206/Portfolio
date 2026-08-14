/*
 * NOVA Journey — flight log timeline with vertical rail and staggered entries.
 * Style: Orbital Command (ideas.md).
 */
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { TIMELINE } from "@/lib/data";

export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="journey" ref={ref} className="relative py-28 sm:py-36">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="eyebrow mb-4">
            <span className="text-nova/70">05</span> / Flight Log
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Trajectory since <span className="text-nova glow-cyan">2025</span>
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground text-lg leading-relaxed">
            Every waypoint on the flight path — from first commit to production-ready systems.
          </p>
        </motion.div>

        <div className="mt-16 relative pl-8 sm:pl-12">
          {/* rail */}
          <div className="absolute left-3 sm:left-[3.15rem] top-[1.35rem] bottom-6 w-px bg-border" />
          <motion.div
            className="absolute left-3 sm:left-[3.15rem] top-[1.35rem] bottom-6 w-px origin-top bg-gradient-to-b from-nova to-ml-purple"
            style={{ scaleY: railScale }}
          />
          <div className="space-y-10">
            {TIMELINE.map((t, i) => (
              <ScrollReveal
                key={t.year}
                direction={i % 2 === 0 ? "left" : "right"}
                delay={0.05 * (i % 3)}
                className="relative"
              >
                {/* node */}
                <span
                  className={`absolute -left-[2.15rem] sm:-left-[3.6rem] top-[0.7rem] h-3 w-3 rounded-full border-2 ${
                    i === TIMELINE.length - 1
                      ? "bg-mint-sig border-mint-sig shadow-[0_0_12px_rgba(0,255,163,0.9)]"
                      : "bg-background border-nova/70"
                  }`}
                />
                <div className="font-mono text-sm text-nova tracking-[0.14em]">{t.year}</div>
                <p className="mt-1.5 text-foreground/90 leading-relaxed max-w-xl">{t.event}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
