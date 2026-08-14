/*
 * NOVA Custom Cursor — active everywhere, with distinct modes:
 * - default: small ring + tracer dot
 * - interactive (a, button, [role=button], form inputs, .hud-corner cards):
 *   ring expands with accent color (cyan for links/buttons, amber for cards)
 * Style: Orbital Command (ideas.md) — clean ring, no labels, no shape morphs.
 * Hidden on touch devices.
 */
import { useEffect, useRef, useState } from "react";

type Mode = "idle" | "link" | "card";

/* Fading trail particle — created in the DOM on pointer move, fades out via CSS */
function spawnTrailDot(x: number, y: number) {
  const dot = document.createElement("div");
  dot.className = "nova-trail-dot";
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
  document.body.appendChild(dot);
  // match the CSS animation duration so cleanup lands after fade
  window.setTimeout(() => dot.remove(), 1100);
}

export default function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const vx = useRef(0);
  const vy = useRef(0);
  const lastDot = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setIsPointer(true);

    // lerp loop — keeps the tracer dot EXACTLY centered on the ring
    // (CSS transitions on the ring's size/color must never desync the two)
    let raf = 0;
    const tx = { v: -100 }; // current lerped x/y (start offscreen)
    const ty = { v: -100 };
    const LERP = 0.5;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dx = vx.current - tx.v;
      const dy = vy.current - ty.v;
      // only push to DOM when position actually changes
      if (dx !== 0 || dy !== 0) {
        tx.v = Math.abs(dx) > 0.5 ? tx.v + dx * LERP : vx.current;
        ty.v = Math.abs(dy) > 0.5 ? ty.v + dy * LERP : vy.current;
        const t = `translate(${tx.v}px, ${ty.v}px) translate(-50%, -50%)`;
        if (ringRef.current) ringRef.current.style.transform = t;
        if (dotRef.current) dotRef.current.style.transform = t;
      }
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      vx.current = e.clientX;
      vy.current = e.clientY;
      // trail: spawn a dot only after moving ~6px and throttled to ~60fps
      const now = performance.now();
      if (now - lastDot.current > 16) {
        if ((e.clientX - vx.current) ** 2 + (e.clientY - vy.current) ** 2 > 36) {
          spawnTrailDot(e.clientX, e.clientY);
          lastDot.current = now;
        }
      }
      updateMode(e.target as HTMLElement | null);
    };

    const CARDS = "[data-project-card], article.hud-corner, [data-cursor]";

    function updateMode(target: HTMLElement | null) {
      const el = target?.closest<HTMLElement>(
        'a, button, input, textarea, select, [role="button"], ' + CARDS,
      );
      if (el) {
        if (el.closest(CARDS)) {
          setMode("card");
        } else if (["A", "BUTTON"].includes(el.tagName) || el.getAttribute("role") === "button" || el.getAttribute("data-cursor")) {
          setMode("link");
        } else {
          setMode("link");
        }
      } else {
        setMode("idle");
      }
    }

    window.addEventListener("pointermove", onMove);
    // sync mode on mouseover too (catches elements spawned mid-hover)
    const onOver = (e: MouseEvent) => updateMode(e.target as HTMLElement | null);
    document.addEventListener("mouseover", onOver);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  if (!isPointer) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden="true">
      {/* ring — transitions scale + color between modes */}
      <div
        ref={ringRef}
        className={`absolute left-0 top-0 rounded-full mix-blend-difference will-change-transform transition-[width,height,border,box-shadow] duration-200 ease-out ${
          mode === "idle"
            ? "h-8 w-8"
            : mode === "link"
              ? "h-14 w-14 border-2"
              : "h-16 w-16 border-2 border-dashed"
        }`}
        style={
          mode === "idle"
            ? {
                border: "1px solid oklch(0.78 0.15 210)",
              }
            : mode === "link"
              ? {
                  borderColor: "oklch(0.85 0.14 210)",
                  boxShadow: "0 0 18px rgba(0,229,255,0.25)",
                }
              : {
                  borderColor: "oklch(0.87 0.14 85)",
                  boxShadow: "0 0 18px rgba(246,196,83,0.25)",
                }
        }
      >
        {mode === "card" && (
          <>
            <span className="absolute -top-1.5 left-1/2 h-3 w-px -translate-x-1/2 bg-amber-sig" />
            <span className="absolute -bottom-1.5 left-1/2 h-3 w-px -translate-x-1/2 bg-amber-sig" />
            <span className="absolute top-1/2 -left-1.5 h-px w-3 -translate-y-1/2 bg-amber-sig" />
            <span className="absolute top-1/2 -right-1.5 h-px w-3 -translate-y-1/2 bg-amber-sig" />
          </>
        )}
      </div>
      {/* tracer dot — brightens on hover */}
      <div
        ref={dotRef}
        className={`absolute left-0 top-0 h-1.5 w-1.5 rounded-full mix-blend-difference will-change-transform transition-colors duration-200 ${
          mode === "idle" ? "bg-nova/90" : "bg-amber-sig"
        }`}
        style={{ boxShadow: "0 0 10px rgba(0,229,255,0.9)" }}
      />
    </div>
  );
}
