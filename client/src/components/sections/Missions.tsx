/*
 * NOVA Missions — project "mission log": alternating staggered cards with
 * HUD framing, category tags, expandable details, and lock-on hover.
 * Style: Orbital Command (ideas.md).
 */
import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, ChevronDown, Code2, Github, ExternalLink, ChevronLeft, ChevronRight, Radio } from "lucide-react";
import { PROJECTS, type Project } from "@/lib/data";

const CAT_STYLE: Record<Project["category"], { label: string; cls: string; accent: string }> = {
  AI: { label: "AI · ML", cls: "text-ml-purple border-ml-purple/50", accent: "oklch(0.72 0.17 305)" },
  Web: { label: "Web", cls: "text-amber-sig border-amber-sig/50", accent: "oklch(0.85 0.14 85)" },
  Data: { label: "Data Science", cls: "text-nova border-nova/50", accent: "oklch(0.78 0.15 210)" },
  Backend: { label: "Backend", cls: "text-mint-sig border-mint-sig/50", accent: "oklch(0.8 0.19 160)" },
};

const STATUS_STYLE: Record<Project["status"], { label: string; cls: string }> = {
  LIVE: { label: "Mission Active", cls: "bg-mint-sig/15 text-mint-sig" },
  DEV: { label: "Under Dev", cls: "bg-amber-sig/15 text-amber-sig" },
  ARCHIVE: { label: "Archived", cls: "bg-muted text-muted-foreground" },
};

function MissionScreenshot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative group/screenshot overflow-hidden border border-border/60 bg-void-2 hud-corner">
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border/50 bg-background/60">
        <span className="h-1.5 w-1.5 rounded-full bg-ml-purple/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-amber-sig/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-mint-sig/70" />
        <span className="ml-2 font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground">{alt}</span>
      </div>
      <img src={src} alt={alt} loading="lazy" className="w-full h-auto block transition-transform duration-500 group-hover/screenshot:scale-[1.02]" />
    </div>
  );
}

function MissionLivePreview({ url, accent }: { url: string; accent: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative overflow-hidden border border-border/60 bg-void-2 hud-corner" style={{ borderColor: `${accent}33` }}>
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/50 bg-background/60">
        <div className="flex items-center gap-2">
          <Radio size={11} style={{ color: accent }} className="animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-foreground/70 truncate">{url}</span>
        </div>
        <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-nova hover:text-amber-sig transition-colors shrink-0">
          Open Live <ExternalLink size={10} />
        </a>
      </div>
      <div className="relative" style={{ minHeight: 340 }}>
        {!loaded && !failed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-muted-foreground animate-pulse">Establishing signal…</span>
          </div>
        )}
        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-ml-purple">Signal lost — demo offline</span>
            <a href={url} target="_blank" rel="noreferrer" className="scan-link inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-nova">
              Open in new window <ArrowUpRight size={12} />
            </a>
          </div>
        )}
        <iframe
          src={url}
          title={`Live demo: ${url}`}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms"
          className={`w-full border-0 transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{ height: 340 }}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      </div>
    </div>
  );
}

function MissionCard({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const [shotIdx, setShotIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const shots = project.screenshots ?? [];
  const cs = CAT_STYLE[project.category];
  const ss = STATUS_STYLE[project.status];
  const left = index % 2 === 0;

  // 3D tilt state
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), { damping: 14, stiffness: 220 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), { damping: 14, stiffness: 220 });

  const onPointerMove = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width - 0.5);
    mouseY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onPointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.65, delay: 0.06 * (index % 3), ease: [0.23, 1, 0.32, 1] }}
      className={left ? "lg:mr-[12%]" : "lg:ml-[12%] lg:translate-y-8"}
    >
    <motion.article
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      data-project-card=""
      initial={false}
      className={`hud-corner relative bg-card/55 border border-border/60 p-7 sm:p-9 backdrop-blur-sm transition-colors will-change-transform ${
        left ? "" : ""
      } hover:border-[var(--card-accent,oklch(0.78_0.15_210))]`}
    >
      {/* top meta row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
            {project.date}
          </span>
          <span className={`font-mono text-[10px] tracking-[0.22em] uppercase px-2.5 py-1 border ${cs.cls}`}>
            {cs.label}
          </span>
          <span className={`font-mono text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 ${ss.cls}`}>
            {ss.label}
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-nova/70">
          {String(index + 1).padStart(2, "0")} / {PROJECTS.length}
        </span>
      </div>

      <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground group-hover:text-nova transition-colors">
        {project.name}
      </h3>

      <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl">{project.description}</p>

      {/* tech chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span key={t} className="font-mono text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 bg-void-2 border border-border/60 text-foreground/80">
            {t}
          </span>
        ))}
      </div>

      {/* expandable detail */}
      <button
        onClick={() => setOpen(!open)}
        className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors"
        style={{ color: cs.accent }}
        aria-expanded={open}
      >
        <ChevronDown size={14} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        {open ? "Collapse Briefing" : "Mission Briefing"}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.9 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-5">
              <p className="text-sm text-muted-foreground leading-relaxed">{project.detail}</p>
              <ul className="grid sm:grid-cols-2 gap-2">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5 text-sm text-foreground/85">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-amber-sig" />
                    {h}
                  </li>
                ))}
              </ul>

              {/* screenshot gallery */}
              {shots.length > 0 && (
                <div>
                  <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-3">
                    Mission Visuals <span className="text-nova/70">{String(shotIdx + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}</span>
                  </div>
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${shotIdx}-${dir}`}
                        initial={{ opacity: 0, x: dir * 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -dir * 40 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      >
                        <MissionScreenshot src={shots[shotIdx]} alt={`${project.name} interface`} />
                      </motion.div>
                    </AnimatePresence>
                    {shots.length > 1 && (
                      <div className="absolute inset-y-0 left-0 flex items-center">
                        <button
                          onClick={() => {
                            setShotIdx((i) => (i - 1 + shots.length) % shots.length);
                            setDir(-1);
                          }}
                          aria-label="Previous screenshot"
                          className="p-1.5 rounded-full border border-border/70 bg-background/70 hover:border-nova/60 transition-colors"
                        >
                          <ChevronLeft size={14} />
                        </button>
                      </div>
                    )}
                    {shots.length > 1 && (
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <button
                          onClick={() => {
                            setShotIdx((i) => (i + 1) % shots.length);
                            setDir(1);
                          }}
                          aria-label="Next screenshot"
                          className="p-1.5 rounded-full border border-border/70 bg-background/70 hover:border-nova/60 transition-colors"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* action row */}
      <div className="mt-6 flex flex-wrap items-center gap-5 pt-5 border-t border-border/50" style={{ transform: "translateZ(24px)" }}>
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-foreground hover:text-nova transition-colors"
        >
          <Github size={13} />
          <span>{project.handle}</span>
          <ArrowUpRight size={12} className="text-amber-sig" />
        </a>
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground hidden sm:inline-flex items-center gap-2">
          <Code2 size={12} /> View on GitHub
        </span>
      </div>
    </motion.article>
    </motion.div>
  );
}

export default function Missions() {
  return (
    <section id="missions" className="relative py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="eyebrow mb-4">
            <span className="text-nova/70">03</span> / Mission Log
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Six active <span className="text-nova glow-emerald">missions</span> logged
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground text-lg leading-relaxed">
            Every repository represents a mission focused on solving meaningful
            real-world problems through software.
          </p>
        </motion.div>

        {/* flight-path archive rail */}
        <div className="mt-16 relative">
          <div className="hidden lg:block absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-nova/70 via-border to-mint-sig/60" />
          <div className="space-y-10 lg:space-y-12 lg:pl-20">
            {PROJECTS.map((p, i) => (
              <div key={p.id} className="relative">
                {/* waypoint node */}
                <span
                  className={`hidden lg:flex absolute -left-20 top-8 h-14 w-14 items-center justify-center rounded-full border border-border/70 bg-background font-mono text-[11px] font-semibold ${
                    p.category === "AI"
                      ? "text-mint-sig border-mint-sig/50 shadow-[0_0_18px_rgba(111,207,151,0.25)]"
                      : "text-nova border-nova/50 shadow-[0_0_18px_rgba(47,160,132,0.25)]"
                  }`}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <MissionCard project={p} index={i} />
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/adit301206?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="scan-link inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] uppercase text-nova"
          >
            View all repositories on GitHub <ArrowUpRight size={13} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
