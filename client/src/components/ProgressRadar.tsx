/*
 * Progress Radar — continuous real-time flight-path position widget.
 * Dynamically tracks user's scroll position, updating progress percentage,
 * circular arc bar, sweep line, and waypoint blips at 60fps.
 */
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "Dossier" },
  { id: "missions", label: "Missions" },
  { id: "stack", label: "Stack" },
  { id: "journey", label: "Trajectory" },
  { id: "contact", label: "Comms" },
];

const SIZE = 124;
const STROKE = 4.5;

export default function ProgressRadar() {
  const [activeId, setActiveId] = useState("hero");
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = Math.max(1, docHeight - winHeight);
      const currentProgress = Math.min(1, Math.max(0, y / maxScroll));

      setProgress(currentProgress);

      // detect active section
      let currentSection = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= winHeight * 0.45) {
            currentSection = s.id;
          }
        }
      }
      setActiveId(currentSection);
      setVisible(true);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeIdx = useMemo(() => {
    const idx = SECTIONS.findIndex((s) => s.id === activeId);
    return idx >= 0 ? idx : 0;
  }, [activeId]);

  // Center & radius geometry
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const r = SIZE / 2 - STROKE / 2 - 4; // 4px padding inside SVG frame

  // Continuous 360deg sweep angle driven directly by scroll progress (starting top -90deg)
  const sweepAngle = progress * 360 - 90;
  const sweepRad = (sweepAngle * Math.PI) / 180;
  const blipX = cx + r * Math.cos(sweepRad);
  const blipY = cy + r * Math.sin(sweepRad);

  const circumference = 2 * Math.PI * r;
  const strokeOffset = circumference * (1 - progress);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.9 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      id="progress-radar"
      className="fixed bottom-6 right-6 z-50 hidden md:block"
      aria-label="Flight progress radar"
    >
      <div className="relative glass-card rounded-2xl p-2.5 border border-border shadow-lg cursor-default">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="block">
          {/* background ring track */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={STROKE} />

          {/* dynamic progress arc stroke */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dashoffset 40ms linear" }}
          />

          {/* fixed section waypoint blips around ring */}
          {SECTIONS.map((s, i) => {
            const a = ((i / (SECTIONS.length - 1)) * 360 - 90) * (Math.PI / 180);
            const wx = cx + r * Math.cos(a);
            const wy = cy + r * Math.sin(a);
            const active = s.id === activeId;
            return (
              <circle
                key={s.id}
                cx={wx}
                cy={wy}
                r={active ? 3.5 : 2}
                fill={active ? "var(--accent)" : "var(--muted-foreground)"}
                style={{ transition: "all 200ms ease" }}
              />
            );
          })}

          {/* live continuous radar sweep line */}
          <line
            x1={cx}
            y1={cy}
            x2={blipX}
            y2={blipY}
            stroke="var(--accent)"
            strokeWidth={1.5}
            strokeDasharray="2 2"
            opacity={0.75}
          />

          {/* live continuous blip dot */}
          <circle cx={blipX} cy={blipY} r={4.5} fill="var(--accent)" className="drop-shadow-[0_0_8px_rgba(39,142,117,0.8)]" />

          {/* center readout: active section & percent */}
          <text
            x={cx}
            y={cy - 3}
            textAnchor="middle"
            className="font-mono"
            fontSize={9}
            fill="var(--muted-foreground)"
            style={{ letterSpacing: "0.14em", fontWeight: 600 }}
          >
            {SECTIONS[activeIdx]?.label.toUpperCase() ?? "HERO"}
          </text>
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            className="font-mono font-bold"
            fontSize={11}
            fill="var(--primary)"
            style={{ letterSpacing: "0.08em" }}
          >
            {Math.round(progress * 100)}%
          </text>
        </svg>
      </div>
    </motion.div>
  );
}
