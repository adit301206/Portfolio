/*
 * NOVA GlitchText — RGB-split glitch on hover with intermittent static bursts.
 * Uses layered ::before/::after with clip-path animations.
 * Style: Orbital Command (ideas.md).
 */
import { motion } from "framer-motion";

export default function GlitchText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <motion.span
      className={`glitch-trigger relative inline-block ${className}`}
      data-text={text}
      whileHover="hover"
    >
      <span className="relative z-10">{text}</span>
      {/* glitch layers rendered absolutely, revealed on hover via CSS */}
      <span
        aria-hidden="true"
        className="glitch-layer pointer-events-none absolute inset-0 z-20 opacity-0"
        data-text={text}
      >
        {text}
      </span>
    </motion.span>
  );
}
