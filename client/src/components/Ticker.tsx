/*
 * NOVA Ticker — infinite horizontal scrolling text strip (CSS marquee).
 * Uses a CSS transform animation (not framer-motion) with exactly TWO
 * identical copies of the track so the loop seam is mathematically exact:
 * translating from 0 to -50% lands precisely at the second copy's start.
 * Style: Orbital Command (ideas.md) — mono, letter-spaced, cyan/amber accents.
 */
const GLYPH = "◆";

export default function Ticker({
  items,
  accent = "cyan",
  reverse = false,
}: {
  items: string[];
  accent?: "cyan" | "amber" | "purple" | "emerald" | "mint";
  reverse?: boolean;
}) {
  const line = items.join(`  ${GLYPH}  `) + `  ${GLYPH}  `;
  const color =
    accent === "amber" || accent === "mint"
      ? "text-mint-sig"
      : "text-nova";

  const cls = [
    "font-mono text-sm tracking-[0.32em] uppercase whitespace-nowrap",
    color,
    "opacity-80",
    reverse ? "marquee-track-reverse" : "marquee-track",
  ].join(" ");

  return (
    <div
      className="relative overflow-hidden border-y border-border/40 bg-[oklch(0.13_0.02_175)] py-4 select-none"
      aria-hidden="true"
    >
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[oklch(0.13_0.02_175)] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[oklch(0.13_0.02_175)] to-transparent z-10" />
      <div className="flex w-max">
        <span className={cls}>{line}</span>
        <span className={cls}>{line}</span>
      </div>
    </div>
  );
}
