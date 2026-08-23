/*
 * NOVA Portfolio — single-page console.
 * Style: Orbital Command (ideas.md) — cinematic depth, HUD chrome, scroll-as-journey.
 */
import HudNav from "@/components/HudNav";
import CustomCursor from "@/components/CustomCursor";
import ProgressRadar from "@/components/ProgressRadar";
import Ticker from "@/components/Ticker";
import BootSequence from "@/components/BootSequence";
import { motion } from "framer-motion";
import Hero from "@/components/sections/Hero";

/* Recurring NOVA brand device: glyph divider between console sections */
function WaypointGlyph() {
  return (
    <div className="relative py-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative mx-auto h-14 w-14 flex items-center justify-center"
      >
        <div className="absolute inset-0 rounded-full border border-border/70" />
        <img
          src="/manus-storage/nova-logo_9ce0c0e9.png"
          alt=""
          className="h-8 w-8 object-contain drop-shadow-[0_0_10px_rgba(47,160,132,0.6)]"
        />
      </motion.div>
    </div>
  );
}
import About from "@/components/sections/About";
import Missions from "@/components/sections/Missions";
import Stack from "@/components/sections/Stack";
import Journey from "@/components/sections/Journey";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[oklch(0.13_0.02_175)] text-foreground overflow-x-hidden">
      <div className="nova-grain" aria-hidden="true" />
      <BootSequence />
      <CustomCursor />
      <ProgressRadar />
      <HudNav />
      <main>
        <Hero />
        <Ticker items={["NOVA CONSOLE", "ADIT KAPADIYA", "DATA SCIENCE", "AI SYSTEMS", "BACKEND ENGINEERING", "FULL STACK"]} accent="emerald" />
        <WaypointGlyph />
        <About />
        <Ticker items={["NEUROCITY", "PREPWISE", "CREDITWISE", "CALIFORNIA HOUSING", "STUDENT MANAGEMENT", "F1 PROJECT"]} accent="mint" reverse />
        <Missions />
        <Stack />
        <Journey />
        <Contact />
      </main>
    </div>
  );
}
