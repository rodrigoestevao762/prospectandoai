"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Activity, Target, Zap, LayoutDashboard, Database, Map, Globe, Settings, LogOut, CheckCircle, DollarSign } from "lucide-react";

const LINKS = [
  { href: "/app/dashboard",    label: "Dashboard",   icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/app/vendas",       label: "Pipeline CRM",icon: <Activity className="w-4 h-4" /> },
  { href: "/app/manutencao",   label: "Manutenção",  icon: <DollarSign className="w-4 h-4" /> },
  { href: "/app",              label: "Alvos (Leads)",icon: <Target className="w-4 h-4" /> },
  { href: "/app/busca",        label: "Radar OSINT", icon: <Zap className="w-4 h-4" /> },
  { href: "/app/mapa",         label: "Cartografia", icon: <Map className="w-4 h-4" /> },
  { href: "/app/sites",        label: "Deploy Sites",icon: <Globe className="w-4 h-4" /> },
  { href: "/app/configuracoes",label: "Sistema",     icon: <Settings className="w-4 h-4" /> },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  return (
    <div className="bg-[#030609] min-h-screen flex flex-col md:flex-row text-white font-sans selection:bg-[var(--signal)] selection:text-black">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl relative z-20">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-[var(--signal)] flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.5)]">
            <Target className="w-4 h-4 text-black" />
          </div>
          <span className="font-display font-black tracking-widest text-lg">PROSPECT<span className="text-[var(--signal)]">AI</span></span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <p className="px-3 text-[10px] mono uppercase tracking-widest text-[var(--ink-dim)] mb-4">Módulos do Sistema</p>
          {LINKS.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${active ? 'text-white' : 'text-[var(--ink-dim)] hover:text-white hover:bg-white/5'}`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-[var(--signal)]/20 to-transparent border-l-2 border-[var(--signal)] rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l.icon}</span>
                <span className="relative z-10 font-medium text-[13px] tracking-wide">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={async () => { await supabaseBrowser().auth.signOut(); window.location.href = "/login"; }}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-[var(--ink-dim)] hover:text-[var(--alert)] hover:bg-[var(--alert)]/10 transition-colors text-[13px] font-medium"
          >
            <LogOut className="w-4 h-4" /> Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* MOBILE TOPBAR */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[var(--signal)] flex items-center justify-center">
            <Target className="w-3 h-3 text-black" />
          </div>
          <span className="font-display font-black tracking-widest text-sm">PROSPECT<span className="text-[var(--signal)]">AI</span></span>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative flex flex-col max-h-screen overflow-hidden">
        {/* Subtle Cyber Grid Background */}
        <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.05)_0%,transparent_50%)] pointer-events-none" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 border-t border-white/5 bg-black/90 backdrop-blur-xl pb-safe z-50 flex overflow-x-auto scrollbar-hide">
        {LINKS.map((l) => {
          const active = path === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex-1 shrink-0 flex flex-col items-center justify-center gap-1 p-3 min-w-[70px] ${active ? 'text-[var(--signal)]' : 'text-[var(--ink-dim)]'}`}
            >
              <div className="relative">
                {l.icon}
                {active && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--signal)] shadow-[0_0_8px_var(--signal)]" />}
              </div>
              <span className="text-[9px] font-medium tracking-wider">{l.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

