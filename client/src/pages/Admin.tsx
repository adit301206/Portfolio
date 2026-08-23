/*
 * NOVA Admin Console — secure operator dashboard for managing
 * portfolio contact transmissions. Owner-only (role === "admin").
 * Style: Orbital Command (ideas.md) — cyan signal, mono telemetry, HUD feel.
 */
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { toast } from "sonner";
import { Eye, Trash2, ShieldOff, ArrowLeft, Mail, Search, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const meQuery = trpc.admin.me.useQuery(undefined, { retry: false });
  const listQuery = trpc.admin.listMessages.useQuery(undefined, {
    retry: false,
  });
  const markRead = trpc.admin.markRead.useMutation({
    onSuccess: async () => {
      await utils.admin.listMessages.invalidate();
      toast.success("Transmission archived", { position: "bottom-right" });
    },
    onError: e => toast.error(e.message, { position: "bottom-right" }),
  });
  const deleteMsg = trpc.admin.deleteMessage.useMutation({
    onSuccess: async () => {
      await utils.admin.listMessages.invalidate();
      toast.success("Transmission purged", { position: "bottom-right" });
    },
    onError: e => toast.error(e.message, { position: "bottom-right" }),
  });

  const isOwner = isAuthenticated && user?.role === "admin";

  // auto-open the latest message when data arrives
  useEffect(() => {
    if (listQuery.data?.messages.length && selectedId === null) {
      setSelectedId(listQuery.data.messages[0]?.id ?? null);
    }
  }, [listQuery.data, selectedId]);

  const messages = useMemo(() => {
    const base = listQuery.data?.messages ?? [];
    return base.filter(m => {
      if (filter === "unread" && m.read === 1) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.subject ?? "").toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [listQuery.data, search, filter]);

  const selected = messages.find(m => m.id === selectedId) ?? null;

  /* --- access control --- */
  if (loading) return <GateShell title="AUTHENTICATING" />;
  if (!isAuthenticated) {
    return (
      <GateShell title="ACCESS RESTRICTED">
        <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
          This console is reserved for the NOVA operator. Sign in to unlock the
          transmission archive.
        </p>
        <button
          onClick={() => startLogin()}
          className="mt-6 inline-flex items-center gap-2 bg-nova text-primary-foreground font-mono text-[11px] tracking-[0.18em] uppercase px-7 py-3.5 hover:bg-[oklch(0.85_0.14_200)] transition-colors active:scale-[0.97]"
        >
          <ShieldOff size={14} />
          Sign in with Manus
        </button>
      </GateShell>
    );
  }
  if (!isOwner) {
    return (
      <GateShell title="CLEARANCE DENIED">
        <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
          Operator <span className="text-nova font-mono">{user?.name}</span>, your
          clearance level does not include the transmission archive. Only the
          portfolio owner may enter.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 border border-border px-7 py-3.5 font-mono text-[11px] tracking-[0.18em] uppercase text-foreground hover:border-nova hover:text-nova transition-colors"
        >
          <ArrowLeft size={14} />
          Return to console
        </Link>
      </GateShell>
    );
  }
  if (meQuery.isLoading || listQuery.isLoading) {
    return <GateShell title="DECRYPTING ARCHIVE" />;
  }

  /* --- owner console --- */
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* top bar */}
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-mint-sig shadow-[0_0_8px_rgba(0,255,163,0.9)] blink" />
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-foreground">
              NOVA // Transmission Archive
            </span>
          </Link>
          <Link
            href="/"
            className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground hover:text-nova transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft size={12} />
            Public Console
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* header stats */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="border-l-2 border-nova/60 pl-4">
            <div className="font-display text-3xl font-bold text-nova glow-emerald">
              {listQuery.data?.messages.length ?? 0}
            </div>
            <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-muted-foreground">
              Total Transmissions
            </div>
          </div>
          <div className="border-l-2 border-amber-sig/60 pl-4">
            <div className="font-display text-3xl font-bold text-amber-sig">
              {listQuery.data?.unread ?? 0}
            </div>
            <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-muted-foreground">
              Pending
            </div>
          </div>
          {/* filter + search */}
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search archive…"
                className="bg-card/60 border border-border rounded-none pl-8 pr-8 py-2 w-48 font-mono text-[11px] tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:border-nova focus:outline-none transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <div className="flex border border-border font-mono text-[10px] tracking-[0.18em] uppercase">
              {(["all", "unread"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 transition-colors ${
                    filter === f
                      ? "bg-nova text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="py-24 text-center font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground border border-dashed border-border/60">
            {listQuery.data?.messages.length
              ? "No transmissions match the filter"
              : "Archive is empty — no signals received yet"}
          </div>
        ) : (
          <div className="grid lg:grid-cols-[20rem_1fr] gap-5">
            {/* transmission list */}
            <ul className="space-y-2">
              <AnimatePresence>
                {messages.map(m => (
                  <motion.li
                    key={m.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <button
                      onClick={() => setSelectedId(m.id)}
                      className={`w-full text-left p-3 border transition-colors ${
                        selectedId === m.id
                          ? "border-nova bg-nova/5"
                          : "border-border/60 bg-card/30 hover:border-nova/40"
                      } ${m.read === 0 ? "border-l-2 border-l-amber-sig" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            m.read === 0
                              ? "bg-amber-sig shadow-[0_0_6px_rgba(246,196,83,0.9)]"
                              : "bg-nova/50"
                          }`}
                        />
                        <span className="font-mono text-[11px] tracking-wider text-foreground truncate">
                          {m.name}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] tracking-wider text-muted-foreground truncate mt-1">
                        {m.subject ?? "General inquiry"}
                      </div>
                      <div className="font-mono text-[8px] tracking-[0.18em] uppercase text-muted-foreground/60 mt-1.5">
                        {new Date(m.createdAt).toLocaleString()}
                      </div>
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            {/* transmission detail */}
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.article
                  key={selected.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  className="hud-corner border border-border/60 bg-card/30 p-6"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
                        Incoming Transmission · {selected.id.toString().padStart(4, "0")}
                      </div>
                      <h2 className="font-display text-xl font-bold text-foreground">
                        {selected.name}
                      </h2>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Mail size={12} className="text-nova" />
                          {selected.email}
                        </span>
                        <span className="font-mono text-[10px]">
                          {new Date(selected.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => markRead.mutate({ id: selected.id })}
                        disabled={markRead.isPending}
                        className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] uppercase text-muted-foreground hover:border-nova hover:text-nova transition-colors disabled:opacity-50"
                      >
                        <Eye size={11} />
                        {selected.read === 1 ? "Archived" : "Mark Read"}
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Purge this transmission permanently?",
                            )
                          ) {
                            deleteMsg.mutate({ id: selected.id });
                          }
                        }}
                        disabled={deleteMsg.isPending}
                        className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] uppercase text-muted-foreground hover:border-red-500/60 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={11} />
                        Purge
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-border/60 pt-4">
                    <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-amber-sig mb-2">
                      Subject · {selected.subject ?? "General inquiry"}
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                      {selected.message}
                    </p>
                  </div>
                </motion.article>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hud-corner border border-border/60 bg-card/30 p-6 font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground"
                >
                  Select a transmission to decrypt
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      <footer className="border-t border-border/60 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-[0.26em] uppercase text-muted-foreground">
            NOVA console · operator archive · restricted
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-mint-sig animate-pulse" />
        </div>
      </footer>
    </div>
  );
}

function GateShell({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-6 px-4 text-center">
      <motion.span
        className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.9)]"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
      <h1 className="font-mono text-[12px] tracking-[0.4em] uppercase text-red-400">
        {title}
      </h1>
      {children}
    </div>
  );
}
