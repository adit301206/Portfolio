/*
 * NOVA Boot Sequence — cinematic console initialization overlay shown once
 * on first page load. Types out system init lines, then slides away to
 * reveal the page. Hidden on re-entry within the session.
 * Respects prefers-reduced-motion (skips straight to reveal).
 */
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = [
  { text: "> initializing NOVA console…", delay: 120 },
  { text: "> loading operator profile: adit301206", delay: 380 },
  { text: "> mounting particle field……………ok", delay: 600 },
  { text: "> syncing mission log from github…", delay: 820 },
  { text: "> calibrating telemetry…ok", delay: 1030 },
  { text: "> SYSTEM ONLINE · WELCOME OPERATOR 001", delay: 1260 },
];

export default function BootSequence() {
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }
    const started = performance.now();
    const lastTime = 900; // last line shown ~900ms; dismiss at 1500ms
    const total = 1500;

    // line schedule
    LINES.forEach(({ delay }) => {
      timerRef.current = window.setTimeout(() => {
        setShown((s) => [...s, LINES.find((l) => l.delay === delay)!.text]);
      }, delay);
    });

    // progress bar tick
    const progressTimer = window.setInterval(() => {
      setProgress(Math.min(100, Math.round(((performance.now() - started) / total) * 100)));
    }, 50);

    timerRef.current = window.setTimeout(() => {
      setVisible(false);
      clearInterval(progressTimer);
    }, total);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-void"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] },
          }}
          aria-hidden="true"
        >
          {/* corner brackets */}
          <div className="absolute top-6 left-6 h-8 w-8 border-t-2 border-l-2 border-nova/70" />
          <div className="absolute top-6 right-6 h-8 w-8 border-t-2 border-r-2 border-nova/70" />
          <div className="absolute bottom-6 left-6 h-8 w-8 border-b-2 border-l-2 border-nova/70" />
          <div className="absolute bottom-6 right-6 h-8 w-8 border-b-2 border-r-2 border-nova/70" />

          {/* logo glyph */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="font-display text-3xl font-bold tracking-[0.4em] text-nova">
              NOVA<span className="text-amber-sig">//</span>
            </span>
          </motion.div>

          {/* terminal lines */}
          <div className="w-full max-w-lg px-8 font-mono text-[12px] sm:text-sm leading-relaxed">
            {shown.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: i === shown.length - 1 ? 1 : 0.55, x: 0 }}
                transition={{ duration: 0.25 }}
                className={
                  i === shown.length - 1
                    ? "text-ml-purple tracking-wide"
                    : "text-muted-foreground"
                }
              >
                {line}
              </motion.p>
            ))}
            <span className="inline-block w-2 h-4 bg-nova align-middle animate-pulse" />
          </div>

          {/* progress bar */}
          <div className="mt-8 w-64 h-px bg-border/50 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-nova"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>
          <p className="mt-3 font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
            {String(progress).padStart(3, "0")}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
