# NOVA Portfolio — Design Brainstorm

## Three Candidate Approaches

### 1. Orbital Command (chosen)
**Intro:** A cinematic "mission control" aesthetic — the visitor orbits through Adit's engineering universe on a dark deep-space canvas with cyan/amber signal accents. Feels like piloting a console through his work.
**Probability:** 0.06

### 2. Blueprint Atelier
**Intro:** Drafting-table aesthetic with warm paper tones, technical grid lines, and ink annotations — portfolio as an engineer's sketchbook.
**Probability:** 0.03

### 3. Swiss Signal
**Intro:** Ultra-clean international typographic style on off-white, oversized Helvetica-style type, single red accent, strict grid with asymmetric breaks.
**Probability:** 0.04

---

# CHOSEN: Orbital Command

## Design Movement
Cinematic sci-fi interface design (à la *Deus Ex* HUD meets modern "space OS" portfolios like linear.dev marketing) — grounded in **dark-space minimalism** with engineering HUD chrome.

## Core Principles
1. **Cinematic depth over decoration** — motion and 3D tell the story; UI chrome stays thin.
2. **Signal hierarchy** — cyan is data, amber is action, purple is insight. Color always carries meaning.
3. **Precision typography** — monospace coordinates and counters everywhere, like a real console.
4. **Scroll as a journey** — the page is a flight path; sections feel like waypoints, not stacked blocks.

## Color Philosophy
Deep void background (#0A0E14-ish, oklch ~0.13) evokes space/terminal night. Cyan `#00E5FF` is the primary signal — telemetry, live data, links. Amber `#F6C453` marks interactive/action elements (buttons, hover targets) so users always know what they can touch. Purple `#C084FC` appears sparingly for ML/AI concepts (a nod to his NeuroCity console). A muted mint `#00FFA3` for success/positive stats. No purple gradients as decoration; dark + neon glow stays disciplined.

## Layout Paradigm
Asymmetric "flight deck": fixed HUD nav at top, left rail with scroll progress + section markers, content offset right. Hero is split — huge type left, Three.js canvas right/behind. Projects as a staggered "mission log" timeline, not a uniform grid. Stats row uses oversized numerals with animated counting.

## Signature Elements
1. **Scanline / noise grain overlay** — subtle CRT texture across everything.
2. **Corner brackets** (⌜ ⌝ ⌞ ⌟) framing cards and images — HUD framing motif.
3. **Blinking status dots + monospace coordinates** (e.g., "LAT 12.97° / SYS.NEURON-04") as section eyebrows.

## Interaction Philosophy
Hovering "locks on" — targets get a target-bracket animation and glow. Links underline with a scanning sweep. Buttons press with scale(0.97). Nothing bounces; everything eases with snap.

## Animation
- Framer Motion: scroll-triggered entrances (opacity+translateY 24px, 0.6s cubic-bezier(0.23,1,0.32,1)), stagger 60–80ms, text reveal via clip-path/overflow masks.
- Three.js hero: interactive particle field / wireframe icosahedron "digital twin" that responds to pointer; low-poly neural-network node graph for About.
- Counting stats on scroll into view. Marquee strip of tech stack.
- respect prefers-reduced-motion.

## Typography System
- Display: **Space Grotesk** (700/500) — technical, futuristic, geometric.
- Body: **Inter Tight** (400/500) for readability.
- Mono: **JetBrains Mono** (400/600) for coordinates, counters, labels, code.
- Hierarchy: eyebrow mono uppercase tracking-widest 11–12px → H1 clamp(2.5rem,7vw,5.5rem) → body 16–18px.

## Brand Essence
NOVA — the engineering intelligence console of Adit Kapadiya, an IT student building AI, data, and web systems. For recruiters, collaborators, and the curious. Personality: **precise, ambitious, quietly cinematic**.

## Brand Voice
HUD-terminal tone. Short, confident, technical-poetic.
Examples:
- "System online. Nine missions logged. Zero downtime."
- "Deployed from 2025 — every commit a trajectory."

## Wordmark & Logo
Wordmark "NOVA//" with mono slash — set in JetBrains Mono with cyan accent on slashes. Logo mark: generated bold cyan icosahedron/network glyph, transparent bg, used in nav + favicon.

## Signature Brand Color
Cyan `#00E5FF` — "NOVA Cyan". Ownable, luminous, unmistakable against the void.

## Style Decisions
- Hero direction: the opening viewport must remain **void-first**, with cyan used as selective telemetry glow rather than a full-page teal flood. The noisy hero-canvas image base layer is reduced/darkened so the 3D particle field carries depth.
- Mission log rule: projects read as a **staggered flight-path archive**, connected by waypoint logic (vertical rail with numbered nodes) and telemetry hierarchy, never as a uniform card grid.
- Color semantics rule: **cyan = data/telemetry, amber = action/hover targets, purple = AI/insight moments, mint = success/status**; decorative color use does not blur these meanings.
- Brand device: the NOVA icosahedron glyph recurs at larger scale (section divider / backdrop) to build authority beyond the tiny nav icon.
