/*
 * NOVA Contact — closing signal: workspace imagery, live transmit form
 * (tRPC-backed), email CTA, GitHub link, footer.
 * Style: Orbital Command (ideas.md).
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Mail, ExternalLink, ArrowUp, Send, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import GlitchText from "@/components/GlitchText";
import { trpc } from "@/lib/trpc";
import { PROFILE } from "@/lib/data";

const fades = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as const },
};

const inputCls =
  "w-full bg-void-2 border border-border/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-nova focus:outline-none focus:ring-1 focus:ring-nova/40 transition-colors font-mono tracking-wide";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Collaboration");
  const [message, setMessage] = useState("");

  const mutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      toast.success("Transmission received — I'll reply from the console.", {
        description: "Your message has been logged in the mission archive.",
      });
      setName("");
      setEmail("");
      setMessage("");
    },
    onError: (err) => {
      toast.error("Transmission failed", {
        description: err.message || "Please retry or use the email channel below.",
      });
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 1 || message.trim().length < 10) return;
    mutation.mutate({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() });
  };

  return (
    <>
      <section id="contact" className="relative py-28 sm:py-36 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage: "url(/manus-storage/nova-workspace_d22d0de7.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.13_0.02_245)] via-[oklch(0.13_0.02_245/0.72)] to-[oklch(0.13_0.02_245/0.94)]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fades}>
            <div className="eyebrow mb-4 flex items-center justify-center gap-3">
              <span className="blink h-2 w-2 rounded-full bg-mint-sig shadow-[0_0_10px_rgba(0,255,163,0.9)]" />
              06 / Open Channel
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
              Let's build the <br />
              <span className="text-nova glow-cyan"><GlitchText text="next mission" /></span> together
            </h2>
            <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed">
              Open to internships, collaborations, and interesting problems in AI and data.
              Transmit directly from the console or open a channel via email.
            </p>
          </motion.div>

          {/* live transmit form */}
          <motion.form
            {...fades}
            transition={{ ...fades.transition, delay: 0.12 }}
            onSubmit={onSubmit}
            className="mt-12 text-left hud-corner relative bg-card/55 border border-border/60 backdrop-blur-sm p-6 sm:p-9 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-nova/70">
                // Live Transmission
              </span>
              <span className="blink h-1.5 w-1.5 rounded-full bg-mint-sig shadow-[0_0_8px_rgba(0,255,163,0.9)]" />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <label className="block">
                <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-muted-foreground mb-1.5 block">Callsign *</span>
                <input
                  className={inputCls}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  maxLength={200}
                  data-cursor="TYPE"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-muted-foreground mb-1.5 block">Frequency (Email) *</span>
                <input
                  type="email"
                  className={inputCls}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@orbit.io"
                  required
                  maxLength={320}
                  data-cursor="TYPE"
                />
              </label>
            </div>

            <label className="block">
              <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-muted-foreground mb-1.5 block">Mission Type</span>
              <select
                className={inputCls}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                data-cursor="SELECT"
              >
                <option value="Collaboration">Collaboration</option>
                <option value="Internship">Internship Opportunity</option>
                <option value="Project Inquiry">Project Inquiry</option>
                <option value="General inquiry">General Inquiry</option>
              </select>
            </label>

            <label className="block">
              <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-muted-foreground mb-1.5 block">Transmission *</span>
              <textarea
                className={`${inputCls} min-h-32 resize-y`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the mission you have in mind… (min 10 characters)"
                required
                minLength={10}
                maxLength={5000}
                data-cursor="TYPE"
              />
              <span className="mt-1 block text-right font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
                {message.length} / 5000
              </span>
            </label>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                <CheckCircle2 size={12} className="inline -mt-0.5 mr-1.5 text-mint-sig" />
                Stored in mission archive · Encrypted channel
              </span>
              <button
                type="submit"
                disabled={mutation.isPending}
                data-cursor="SEND"
                className="group relative inline-flex items-center gap-2.5 bg-nova text-primary-foreground font-mono text-[12px] tracking-[0.18em] uppercase px-8 py-3.5 hover:bg-[oklch(0.85_0.14_200)] transition-colors active:scale-[0.97] disabled:opacity-60 disabled:cursor-wait"
                style={{ boxShadow: "0 0 32px rgba(0,229,255,0.35)" }}
              >
                {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {mutation.isPending ? "Transmitting…" : "Transmit"}
              </button>
            </div>

            <AnimateTransition success={mutation.isSuccess} error={mutation.isError} />
          </motion.form>

          <motion.div {...fades} transition={{ ...fades.transition, delay: 0.2 }} className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${PROFILE.email}`}
              className="inline-flex items-center gap-3 border border-border bg-[oklch(0.15_0.02_245/0.85)] backdrop-blur-sm px-8 py-4 font-mono text-[12px] tracking-[0.18em] uppercase text-foreground hover:border-amber-sig hover:text-amber-sig transition-colors active:scale-[0.97]"
            >
              <Mail size={15} />
              <span>{PROFILE.email}</span>
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 border border-border bg-[oklch(0.15_0.02_245/0.85)] backdrop-blur-sm px-8 py-4 font-mono text-[12px] tracking-[0.18em] uppercase text-foreground hover:border-amber-sig hover:text-amber-sig transition-colors active:scale-[0.97]"
            >
              <Github size={15} />
              <span>github.com/{PROFILE.handle}</span>
              <ExternalLink size={13} className="text-amber-sig" />
            </a>
          </motion.div>
        </div>
      </section>

      <footer className="relative border-t border-border/50 bg-[oklch(0.115_0.018_245)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/manus-storage/nova-logo_9ce0c0e9.png"
                alt="NOVA logo"
                className="h-7 w-7"
              />
              <span className="font-mono font-bold text-sm tracking-[0.3em]">
                NOVA<span className="text-nova">//</span>
              </span>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
                © 2026 {PROFILE.name}
              </span>
            </div>
            <div className="flex items-center gap-6 font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
              <span className="hidden sm:inline">Built with React · Three.js · Framer Motion</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-2 text-nova hover:underline"
              >
                <ArrowUp size={12} /> Return to Console
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function AnimateTransition({ success, error }: { success: boolean; error: boolean }) {
  return (
    <motion.div
      key={success ? "ok" : error ? "err" : "idle"}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
    >
      {success && (
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-mint-sig">
          <CheckCircle2 size={13} /> Transmission received — acknowledged.
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-ml-purple">
          <AlertTriangle size={13} /> Signal lost — retry or email directly.
        </div>
      )}
    </motion.div>
  );
}
