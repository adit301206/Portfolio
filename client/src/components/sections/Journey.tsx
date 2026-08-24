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
            Trajectory since <span className="text-nova glow-emerald">2025</span>
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground text-lg leading-relaxed">
            Every waypoint on the flight path — from first commit to production-ready systems.
          </p>
        </motion.div>

        <div className="mt-16 relative">
          {/* rail positioned at 16px (mobile) / 24px (desktop) from outer edge */}
          <div className="absolute left-4 sm:left-6 top-2 bottom-4 w-px bg-white/15" />
          <motion.div
            className="absolute left-4 sm:left-6 top-2 bottom-4 w-px origin-top bg-gradient-to-b from-[#2FA084] to-[#6FCF97]"
            style={{ scaleY: railScale }}
          />

          {/* entries list with 48px (mobile) / 64px (desktop) padding */}
          <div className="space-y-10 pl-12 sm:pl-16">
            {TIMELINE.map((t, i) => (
              <ScrollReveal
                key={t.year}
                direction={i % 2 === 0 ? "left" : "right"}
                delay={0.05 * (i % 3)}
                className="relative"
              >
                {/* node dot positioned at -32px / -40px relative to entry padding, placing it centered at 16px / 24px */}
                <span
                  className={`absolute -left-8 sm:-left-10 -translate-x-1/2 top-1.5 h-3.5 w-3.5 rounded-full border-2 transition-all ${
                    i === TIMELINE.length - 1
                      ? "bg-[#6FCF97] border-[#6FCF97] shadow-[0_0_12px_rgba(111,207,151,0.9)]"
                      : "bg-background border-primary"
                  }`}
                />
                <div className="font-mono text-sm text-accent tracking-[0.14em] font-semibold">{t.year}</div>
                <p className="mt-1.5 text-foreground/90 leading-relaxed max-w-xl font-sans">{t.event}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
