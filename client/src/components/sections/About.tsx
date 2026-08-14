/*
 * NOVA About — operator dossier: portrait, bio, animated stat counters,
 * mission focus areas. Asymmetric two-column flight deck.
 * Style: Orbital Command (ideas.md).
 */
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Brain, Database, Globe2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { PROFILE } from "@/lib/data";

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

const fades = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as const },
};

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  return (
    <section id="about" ref={ref} className="relative py-28 sm:py-36 overflow-hidden">
      {/* background accent */}
      <div
        className="pointer-events-none absolute -right-40 top-20 w-[34rem] h-[34rem] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, oklch(0.78 0.15 210), transparent 65%)" }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div {...fades} className="eyebrow mb-4">
          <span className="text-nova/70">02</span> / Operator Dossier
        </motion.div>
        <motion.h2 {...fades} transition={{ ...fades.transition, delay: 0.08 }} className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
          The mind behind <span className="text-nova glow-cyan">the console</span>
        </motion.h2>

        <div className="mt-14 grid lg:grid-cols-12 gap-12">
          {/* bio */}
          <motion.div {...fades} transition={{ ...fades.transition, delay: 0.14 }} className="lg:col-span-7 space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {PROFILE.bio}
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Every repository is an active mission — from an AI-powered exam tutor to a
              city-scale digital twin with real-time deep learning inference. The thread
              connecting them is the same: <span className="text-foreground font-medium">turn raw data into decisions</span>.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Currently focused on <span className="text-nova">machine learning</span> and{" "}
              <span className="text-nova">backend engineering</span>, with production-ready Django and
              Node systems already shipping, and a trajectory set on data science.
            </p>

            <div className="grid sm:grid-cols-3 gap-px bg-border/50 border border-border/50">
              {[
                {
                  icon: Brain,
                  title: "Artificial Intelligence",
                  text: "NeuroCity's AI brain — YOLOv8 inference, NLP grievance triage, predictive energy models.",
                },
                {
                  icon: Database,
                  title: "Data Science",
                  text: "End-to-end ML pipelines: EDA, feature engineering, regression at R² 0.835.",
                },
                {
                  icon: Globe2,
                  title: "Backend Engineering",
                  text: "Versioned DRF APIs, JWT roles, Supabase-backed full-stack apps.",
                },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="hud-corner bg-card/60 p-6 group"
                >
                  <f.icon size={22} className="text-nova mb-4 group-hover:drop-shadow-[0_0_10px_rgba(0,229,255,0.8)] transition-all" />
                  <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* stat panel */}
          <motion.div {...fades} transition={{ ...fades.transition, delay: 0.22 }} className="lg:col-span-5 relative">
            <ScrollReveal direction="left" delay={0.1} className="sticky top-24">
              <motion.div
                style={{ y }}
                className="hud-corner border border-border/60 bg-card/50 backdrop-blur-sm p-8"
              >
              <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-8">
                Telemetry · Live
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                {[
                  { n: PROFILE.stats.commits, l: "Commits Logged", color: "text-nova glow-cyan" },
                  { n: PROFILE.stats.prs, l: "Pull Requests Merged", color: "text-amber-sig glow-amber" },
                  { n: PROFILE.stats.repos, l: "Repositories", color: "text-ml-purple" },
                  { n: PROFILE.stats.followers, l: "Network Followers", color: "text-mint-sig" },
                ].map((s, i) => (
                  <motion.div
                    key={s.l}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: 0.3 + i * 0.09, duration: 0.5 }}
                    className="border-l-2 border-border pl-4"
                  >
                    <div className={`font-display text-5xl font-bold ${s.color}`}>
                      <CountUp value={s.n} />
                    </div>
                    <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground mt-2">{s.l}</div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 pt-6 border-t border-border/50 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-3">
                <span className="blink h-2 w-2 rounded-full bg-mint-sig shadow-[0_0_8px_rgba(0,255,163,0.8)]" />
                Status: Active Mission Operator
              </div>
              </motion.div>
            </ScrollReveal>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
