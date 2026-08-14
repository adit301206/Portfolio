/*
 * NOVA Hero — cinematic opening: split layout, Three.js field behind type,
 * oversized Space Grotesk display + mono telemetry eyebrow.
 * Scroll-linked: parallax depth (field, text, portrait move at different rates),
 * text fades/blur as you descend; glitch on name hover.
 * Style: Orbital Command (ideas.md).
 */
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowDown, FileDown, Github, Mail, ArrowUpRight } from "lucide-react";
import ParticleField from "@/components/ParticleField";
import GlitchText from "@/components/GlitchText";
import { PROFILE } from "@/lib/data";

const wordIn = (delay: number) => ({
  initial: { y: 64, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { delay, duration: 0.7, ease: [0.23, 1, 0.32, 1] as const },
});

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // depth layers: field drifts slowest, text mid, portrait fastest (parallax depth)
  const fieldY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const textBlur = useTransform(scrollYProgress, [0, 0.55], [0, 10]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const statsY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      {/* 3D canvas */}
      <motion.div style={{ y: fieldY }} className="absolute inset-0" aria-hidden="true">
        <ParticleField />
      </motion.div>

      {/* solid void gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_70%_30%,oklch(0.2_0.045_230/0.5),oklch(0.13_0.02_245)_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[oklch(0.13_0.02_245)] to-transparent" />

      {/* large brand glyph backdrop */}
      <motion.div
        style={{ y: fieldY }}
        className="absolute -right-32 top-1/2 -translate-y-1/2 w-[26rem] h-[26rem] opacity-[0.09] pointer-events-none"
      >
        <img src="/manus-storage/nova-logo_9ce0c0e9.png" alt="" className="w-full h-full object-contain float-slow" />
      </motion.div>

      <motion.div style={{ y: textY, opacity: textOpacity, filter: `blur(calc(${textBlur.get()}px))` }} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full pt-28 pb-16">
        {/* keep the whole block as one motion unit; inner values are animated by framer below */}
        <HeroContent />
      </motion.div>

      {/* portrait panel — independent parallax layer */}
      <motion.div
        style={{ y: portraitY, scale: portraitScale }}
        className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-10 hidden lg:block w-[26rem]"
      >
        <PortraitPanel />
      </motion.div>

      {/* scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground">Scroll</span>
        <motion.div
          className="h-10 w-px bg-gradient-to-b from-nova to-transparent origin-top"
          animate={{ scaleY: [0.2, 1, 0.2] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

function HeroContent() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          {/* telemetry eyebrow */}
          <motion.div
            className="eyebrow flex items-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="blink h-2 w-2 rounded-full bg-mint-sig shadow-[0_0_10px_rgba(0,255,163,0.9)]" />
            SYSTEM ONLINE · ENGINEERING INTELLIGENCE CONSOLE · 2026
          </motion.div>

          <h1 className="font-display font-bold leading-[1.02] tracking-tight text-foreground">
            <span className="block overflow-hidden">
              <motion.span {...wordIn(0.3)} className="block text-[clamp(2.75rem,7.2vw,5.6rem)]">
                <GlitchText text="Adit" />
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span {...wordIn(0.42)} className="block text-[clamp(2.75rem,7.2vw,5.6rem)]">
                <span className="glow-cyan text-nova">
                  <GlitchText text="Kapadiya" />
                </span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-7 max-w-xl text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            IT student charting a trajectory toward <span className="text-foreground font-medium">Data Science</span>.
            Building AI systems, data pipelines, and web missions from the NOVA console.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <button
              onClick={() => document.getElementById("missions")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative inline-flex items-center gap-2 bg-nova text-primary-foreground font-mono text-[12px] tracking-[0.18em] uppercase px-7 py-3.5 hover:bg-[oklch(0.85_0.14_200)] transition-colors active:scale-[0.97]"
            >
              <span className="absolute inset-0 shadow-[0_0_32px_rgba(0,229,255,0.35)] transition-opacity group-hover:opacity-80" />
              <span className="relative">Launch Mission Log</span>
              <ArrowDown size={14} className="relative" />
            </button>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="scan-link inline-flex items-center gap-2 border border-border px-7 py-3.5 font-mono text-[12px] tracking-[0.18em] uppercase text-foreground hover:border-amber-sig hover:text-amber-sig transition-colors active:scale-[0.97]"
            >
              <Github size={14} />
              <span>github.com/{PROFILE.handle}</span>
              <ArrowUpRight size={13} className="text-amber-sig" />
            </a>
            <ResumeButton />
          </motion.div>

          {/* quick stats — staggered drift */}
          <motion.div
            className="mt-14 grid grid-cols-3 gap-6 max-w-md"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            {[
              { n: "143", l: "Commits" },
              { n: "34", l: "Pull Requests" },
              { n: "9", l: "Repositories" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                className="border-l-2 border-nova/40 pl-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + i * 0.12, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ x: 4, borderColor: "oklch(0.78 0.15 210)" }}
              >
                <div className="font-display text-3xl font-bold text-nova glow-cyan">{s.n}</div>
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground mt-1">{s.l}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="lg:col-span-5" aria-hidden="true" />
      </div>
    </div>
  );
}

function ResumeButton() {
  const [pulse, setPulse] = useState(false);
  const triggerPulse = () => {
    setPulse(true);
    window.setTimeout(() => setPulse(false), 900);
  };
  return (
    <a
      href="/manus-storage/adit-kapadiya-resume_8ee3ff34.pdf"
      download="Adit-Kapadiya-Resume.pdf"
      onMouseEnter={triggerPulse}
      className="group relative inline-flex items-center gap-2.5 overflow-hidden border border-nova/50 px-7 py-3.5 font-mono text-[12px] tracking-[0.18em] uppercase text-nova transition-colors hover:border-nova active:scale-[0.97]"
    >
      {/* scanning sweep on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -left-[70%] w-[40%] bg-gradient-to-r from-transparent via-nova/15 to-transparent skew-x-12 transition-transform duration-500 group-hover:left-[130%]"
      />
      {/* corner ticks */}
      <span className="absolute left-0 top-0 h-2 w-2 border-l border-t border-nova transition-colors group-hover:border-amber-sig" />
      <span className="absolute right-0 top-0 h-2 w-2 border-r border-t border-nova transition-colors group-hover:border-amber-sig" />
      <span className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-nova transition-colors group-hover:border-amber-sig" />
      <span className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-nova transition-colors group-hover:border-amber-sig" />
      <motion.span
        className="absolute inset-0 border border-amber-sig/0"
        animate={pulse ? { opacity: [0.8, 0] } : {}}
        transition={{ duration: 0.9 }}
        style={{ boxShadow: pulse ? "0 0 0 0 rgba(246,196,83,0.5)" : undefined }}
      />
      <motion.span
        className="relative"
        animate={pulse ? { x: [0, -2, 2, -2, 0] } : {}}
        transition={{ duration: 0.45 }}
      >
        <FileDown size={14} />
      </motion.span>
      <span className="relative">Download Resume</span>
      <span className="relative h-1 w-1 rounded-full bg-amber-sig shadow-[0_0_6px_rgba(246,196,83,0.9)] animate-pulse" />
    </a>
  );
}

function PortraitPanel() {
  return (
    <div className="hud-corner relative p-3 bg-card/40 backdrop-blur-sm border border-border/60">
      <img
        src="/manus-storage/nova-portrait_aace7998.png"
        alt="Adit Kapadiya — NOVA operator portrait"
        className="w-full aspect-square object-cover"
      />
      <div className="absolute top-5 left-6 font-mono text-[10px] tracking-[0.28em] text-nova uppercase">
        Operator 001
      </div>
      <div className="absolute bottom-5 right-6 font-mono text-[10px] tracking-[0.28em] text-muted-foreground uppercase">
        Adit Kapadiya · NOVA//
      </div>
      <div className="absolute inset-0 border border-nova/0 hover:border-nova/30 transition-colors pointer-events-none" />
    </div>
  );
}
