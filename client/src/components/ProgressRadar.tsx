/*
 * Progress Radar — flight-path position widget.
 * A circular radar dial that tracks which section (waypoint) the viewport
 * currently occupies and shows overall flight progress.
 * Style: Orbital Command (ideas.md).
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

const SIZE = 118;
const STROKE = 4;

export default function ProgressRadar() {
  const [activeId, setActiveId] = useState("home");
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, y / max)));
      // find active section
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) {
          current = s.id;
        }
      }
      setActiveId(current);
      setVisible(y > window.innerHeight * 0.4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIdx = useMemo(() => SECTIONS.findIndex((s) => s.id === activeId), [activeId]);

  // sweep angle rotates continuously; blip marks active waypoint angle
  const blipAngle = (activeIdx / SECTIONS.length) * 360 - 90;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const r = SIZE / 2 - STROKE / 2;
  const blipX = cx + r * Math.cos((blipAngle * Math.PI) / 180);
  const blipY = cy + r * Math.sin((blipAngle * Math.PI) / 180);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.85 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      id="progress-radar"
      className="fixed bottom-5 right-5 z-50 hidden md:block"
      aria-label="Flight progress radar"
    >
      <div className="relative hud-corner bg-background/70 backdrop-blur-md border border-nova/30 p-2 shadow-[0_0_30px_rgba(0,229,255,0.12)] cursor-none">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="block">
          {/* outer ring: flight progress */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="oklch(0.25 0.03 245)" strokeWidth={STROKE} />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="oklch(0.78 0.15 210)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * r}
            strokeDashoffset={2 * Math.PI * r * (1 - progress)}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dashoffset 150ms linear" }}
          />
          {/* waypoint dots */}
          {SECTIONS.map((s, i) => {
            const a = ((i / SECTIONS.length) * 360 - 90) * (Math.PI / 180);
            const x = cx + r * Math.cos(a);
            const y = cy + r * Math.sin(a);
            const active = s.id === activeId;
            return (
              <circle
                key={s.id}
                cx={x}
                cy={y}
                r={active ? 3.5 : 2}
                fill={active ? "oklch(0.78 0.15 210)" : "oklch(0.35 0.02 245)"}
                style={{ transition: "all 250ms ease" }}
              />
            );
          })}
          {/* sweep line */}
          <line
            x1={cx}
            y1={cy}
            x2={blipX}
            y2={blipY}
            stroke="oklch(0.78 0.15 210 / 0.5)"
            strokeWidth={1.5}
            style={{ transition: "all 300ms cubic-bezier(0.23,1,0.32,1)" }}
          />
          {/* active waypoint blip */}
          <circle cx={blipX} cy={blipY} r={5} fill="oklch(0.78 0.15 210)" style={{ transition: "all 300ms cubic-bezier(0.23,1,0.32,1)" }} />
          {/* center readout */}
          <text x={cx} y={cy - 2} textAnchor="middle" className="font-mono" fontSize={9} fill="oklch(0.75 0.02 245)" style={{ letterSpacing: "0.12em" }}>
            {SECTIONS[activeIdx]?.label.toUpperCase() ?? ""}
          </text>
          <text x={cx} y={cy + 9} textAnchor="middle" className="font-mono" fontSize={8.5} fill="oklch(0.78 0.15 210)">
            {Math.round(progress * 100)}%
          </text>
        </svg>
      </div>
    </motion.div>
  );
}
