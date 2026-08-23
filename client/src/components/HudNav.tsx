/*
 * NOVA HUD Nav — fixed console header with live scroll telemetry + section rail.
 * Style: Orbital Command — mono coordinates, cyan signal, amber hover targets.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Mail, ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/lib/data";

const SECTIONS = [
  { id: "hero", label: "01", name: "Home" },
  { id: "about", label: "02", name: "About" },
  { id: "missions", label: "03", name: "Missions" },
  { id: "stack", label: "04", name: "Stack" },
  { id: "journey", label: "05", name: "Journey" },
  { id: "contact", label: "06", name: "Contact" },
];

export default function HudNav() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? (doc.scrollTop / max) * 100 : 0);
      setScrolled(doc.scrollTop > 24);

      // active section detection
      let current = "hero";
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = s.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#060B09]/80 backdrop-blur-md border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => go("hero")} className="flex items-center gap-3 group">
            <img
              src="/manus-storage/nova-logo_9ce0c0e9.png"
              alt="NOVA logo"
              className="h-9 w-9 drop-shadow-[0_0_12px_rgba(47,160,132,0.6)]"
            />
            <span className="font-mono font-bold text-sm tracking-[0.3em] text-[#FFFFFF]">
              NOVA<span className="text-[#2FA084]">//</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className={`relative px-3.5 py-2 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors ${
                  active === s.id ? "text-[#6FCF97] font-semibold" : "text-[#EEEEEE] hover:text-[#6FCF97]"
                }`}
              >
                <span className="text-[#2FA084] mr-1.5">{s.label}</span>
                {s.name}
                {active === s.id && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute left-2.5 right-2.5 bottom-1 h-[2px] bg-[#6FCF97] shadow-[0_0_10px_rgba(111,207,151,0.9)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 border border-white/15 bg-white/[0.04] px-4 py-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[#EEEEEE] hover:border-[#6FCF97] hover:text-[#6FCF97] transition-all rounded-md"
            >
              <Github size={14} />
              <span className="hidden lg:inline">GitHub</span>
              <ArrowUpRight size={12} className="text-[#6FCF97]" />
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-foreground border border-border"
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* progress bar */}
        <div className="h-px w-full bg-border/40">
          <div
            className="h-px bg-gradient-to-r from-nova via-mint-sig to-nova-dim shadow-[0_0_10px_rgba(111,207,151,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* left rail: live telemetry */}
      <div className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-5 items-center">
        <div className="flex flex-col items-center gap-3">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              aria-label={s.name}
              className="group flex flex-col items-center gap-1"
            >
              <span
                className={`block h-2 w-2 rounded-full transition-all duration-300 ${
                  active === s.id
                    ? "bg-nova shadow-[0_0_10px_rgba(47,160,132,0.9)] scale-125"
                    : "bg-border group-hover:bg-nova/60"
                }`}
              />
              <span
                className={`font-mono text-[9px] tracking-widest transition-colors ${
                  active === s.id ? "text-nova font-semibold" : "text-muted-foreground/60 group-hover:text-nova/70"
                }`}
              >
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden bg-[oklch(0.12_0.02_175/0.96)] backdrop-blur-xl"
          >
            <div className="flex flex-col gap-1 pt-24 px-6">
              {SECTIONS.map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  onClick={() => go(s.id)}
                  className="flex items-baseline gap-4 py-3 border-b border-border/40 text-left"
                >
                  <span className="font-mono text-xs text-nova">{s.label}</span>
                  <span className="font-display text-2xl font-semibold">{s.name}</span>
                </motion.button>
              ))}
              <div className="flex gap-4 pt-6">
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-border px-4 py-3 font-mono text-[11px] tracking-[0.18em] uppercase"
                >
                  <Github size={14} /> GitHub
                </a>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="inline-flex items-center gap-2 border border-border px-4 py-3 font-mono text-[11px] tracking-[0.18em] uppercase text-mint-sig"
                >
                  <Mail size={14} /> Email
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
