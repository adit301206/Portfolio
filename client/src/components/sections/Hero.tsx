/*
 * NOVA Hero — editorial split layout with deep charcoal backlight,
 * ultra-crisp white display typography, mint highlighted keywords, and glass CTAs.
 */
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowDown, FileDown, Github, ArrowUpRight } from "lucide-react";
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

  const fieldY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const textBlur = useTransform(scrollYProgress, [0, 0.55], [0, 10]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-background transition-colors duration-300">
      {/* 3D canvas */}
      <motion.div style={{ y: fieldY }} className="absolute inset-0" aria-hidden="true">
        <ParticleField />
      </motion.div>

      {/* deep radial backlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(31,111,95,0.25)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />

      {/* brand glyph backdrop */}
      <motion.div
        style={{ y: fieldY }}
        className="absolute -right-32 top-1/2 -translate-y-1/2 w-[26rem] h-[26rem] opacity-[0.06] pointer-events-none"
      >
        <img src="/manus-storage/nova-logo_9ce0c0e9.png" alt="" className="w-full h-full object-contain float-slow" />
      </motion.div>

      <motion.div style={{ y: textY, opacity: textOpacity, filter: `blur(calc(${textBlur.get()}px))` }} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full pt-28 pb-16">
        <HeroContent />
      </motion.div>

      {/* portrait panel */}
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
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-[#94A3B8]">Scroll</span>
        <motion.div
          className="h-10 w-px bg-gradient-to-b from-[#6FCF97] to-transparent origin-top"
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
            <span className="blink h-2 w-2 rounded-full bg-[#6FCF97] shadow-[0_0_12px_rgba(111,207,151,0.9)]" />
            <span className="text-[#CBD5E1] tracking-[0.25em]">SYSTEM ONLINE · ENGINEERING INTELLIGENCE CONSOLE</span>
          </motion.div>

          <h1 className="font-display font-bold leading-[1.02] tracking-tight">
            <span className="block overflow-hidden">
              <motion.span {...wordIn(0.3)} className="block text-[clamp(2.75rem,7.2vw,5.6rem)] hero-white-gradient">
                <GlitchText text="Adit" />
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span {...wordIn(0.42)} className="block text-[clamp(2.75rem,7.2vw,5.6rem)] hero-white-gradient">
                <GlitchText text="Kapadiya" />
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-7 max-w-xl text-lg text-[#EEEEEE]/90 leading-relaxed font-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            IT student charting a trajectory toward <span className="text-[#6FCF97] font-semibold">Data Science</span>.
            Building <span className="text-[#6FCF97] font-semibold">AI systems</span>, data pipelines, and full-stack web missions from the NOVA console.
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
              className="btn-primary-teal group relative inline-flex items-center gap-2.5 font-mono text-[12px] tracking-[0.18em] uppercase px-7 py-3.5 rounded-lg active:scale-[0.97]"
            >
              <span className="relative font-bold text-[#FFFFFF]">Launch Mission Log</span>
              <ArrowDown size={14} className="relative font-bold text-[#FFFFFF]" />
            </button>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary-glass inline-flex items-center gap-2 px-7 py-3.5 font-mono text-[12px] tracking-[0.18em] uppercase rounded-lg active:scale-[0.97]"
            >
              <Github size={14} />
              <span>github.com/{PROFILE.handle}</span>
              <ArrowUpRight size={13} className="text-[#6FCF97]" />
            </a>
            <ResumeButton />
          </motion.div>

          {/* telemetry numbers — white stat counters with mint labels */}
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
                className="border-l-2 border-white/20 pl-4 transition-colors hover:border-[#6FCF97]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + i * 0.12, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ x: 4 }}
              >
                <div className="font-display text-3.5xl font-bold text-[#FFFFFF] drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">{s.n}</div>
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#6FCF97] font-semibold mt-1">{s.l}</div>
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
      className="btn-secondary-glass group relative inline-flex items-center gap-2.5 overflow-hidden px-7 py-3.5 font-mono text-[12px] tracking-[0.18em] uppercase rounded-lg active:scale-[0.97]"
    >
      <motion.span
        className="relative"
        animate={pulse ? { x: [0, -2, 2, -2, 0] } : {}}
        transition={{ duration: 0.45 }}
      >
        <FileDown size={14} />
      </motion.span>
      <span className="relative font-medium">Download Resume</span>
      <span className="relative h-1.5 w-1.5 rounded-full bg-[#6FCF97] shadow-[0_0_8px_rgba(111,207,151,0.9)] animate-pulse" />
    </a>
  );
}

function PortraitPanel() {
  return (
    <div className="glass-card relative p-3.5 rounded-2xl border border-white/12 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
      <div className="relative rounded-xl overflow-hidden aspect-square border border-white/10">
        <img
          src="/manus-storage/nova-portrait_aace7998.png"
          alt="Adit Kapadiya — NOVA operator portrait"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            // fallback if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
      </div>
      <div className="flex items-center justify-between mt-3 px-1">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] text-[#6FCF97] font-semibold uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-[#6FCF97] shadow-[0_0_8px_rgba(111,207,151,0.9)]" />
          OPERATOR 001 · ACTIVE
        </div>
        <div className="font-mono text-[10px] tracking-[0.22em] text-[#CBD5E1] uppercase">
          ADIT KAPADIYA//
        </div>
      </div>
    </div>
  );
}
