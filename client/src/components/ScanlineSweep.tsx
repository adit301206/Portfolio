/*
 * NOVA ScanlineSweep — a traveling emerald light sweep that crosses the card
 * border on hover, like a radar scan locking onto a contact.
 * Style: Orbital Command (ideas.md).
 */
import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function ScanlineSweep({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden group ${className}`}>
      {/* sweep band */}
      <motion.span
        className="pointer-events-none absolute -top-[100%] left-0 h-[60%] w-full rotate-[24deg] origin-top-left"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(111,207,151,0.18), transparent)",
        }}
        initial={false}
        animate={{ top: ["-120%", "220%"] }}
        transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1], repeat: Infinity, repeatDelay: 2.4 }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
