/*
 * NOVA ScrollReveal — directional reveal-on-scroll with spring easing.
 * Variants: right (default), left, up, zoom. Used across all sections.
 * Style: Orbital Command (ideas.md).
 */
import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

const DIRS = {
  right: { x: -60, y: 0 },
  left: { x: 60, y: 0 },
  up: { x: 0, y: 60 },
  zoom: { x: 0, y: 0 },
} as const;

type Dir = keyof typeof DIRS;

export default function ScrollReveal({
  children,
  direction = "right",
  delay = 0,
  className,
  once = true,
  wide = false,
}: {
  children: ReactNode;
  direction?: Dir;
  delay?: number;
  className?: string;
  once?: boolean;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: wide ? "-10%" : "-60px" });
  const d = DIRS[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...d, scale: direction === "zoom" ? 0.85 : 1 }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0, scale: 1 }
          : { opacity: 0, ...d, scale: direction === "zoom" ? 0.85 : 1 }
      }
      transition={{
        delay,
        duration: 0.75,
        ease: [0.23, 1, 0.32, 1] as const,
      }}
    >
      {children}
    </motion.div>
  );
}
