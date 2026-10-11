"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase-browser";
import {
  Activity, Target, Zap, LayoutDashboard,
  Map, Globe, Settings, LogOut, DollarSign,
  Crosshair, Radio, Shield, Sparkles
} from "lucide-react";

const LINKS = [
  { href: "/app/dashboard",     label: "Dashboard",       icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/app/busca",         label: "Radar OSINT",     icon: <Zap className="w-4 h-4" />, badge: "v4.2" },
  { href: "/app",               label: "Alvos (Leads)",   icon: <Target className="w-4 h-4" /> },
  { href: "/app/vendas",        label: "Pipeline CRM",    icon: <Activity className="w-4 h-4" /> },
  { href: "/app/manutencao",    label: "Manutenção & MRR",icon: <DollarSign className="w-4 h-4" /> },
  { href: "/app/mapa",          label: "Cartografia 3D",  icon: <Map className="w-4 h-4" /> },
  { href: "/app/sites",         label: "Deploy Sites",    icon: <Globe className="w-4 h-4" /> },
  { href: "/app/configuracoes", label: "Configurações",   icon: <Settings className="w-4 h-4" /> },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  return (
    <div className="bg-[#050608] min-h-screen flex flex-col md:flex-row text-white font-sans selection:bg-[#a855f7] selection:text-white">
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/[0.07] bg-[#070910]/80 backdrop-blur-2xl relative z-30">
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#7e22ce] flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform">
              <Crosshair className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display font-black tracking-tight text-base text-white">
                PROSPECT<span className="text-[#c084fc]">AI</span>
              </span>
              <p className="mono text-[8px] uppercase tracking-widest text-[#94a3b8]">OSINT Console</p>
            </div>
          </Link>
        </div>

        {/* Navigation Modules */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <p className="px-3 text-[9px] mono uppercase tracking-[0.2em] text-[#64748b] font-bold mb-3">
            Módulos de Controle
          </p>
          {LINKS.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? "text-white font-bold"
                    : "text-[#94a3b8] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-[#a855f7]/15 border border-[#a855f7]/35 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <div className="flex items-center gap-3 relative z-10">
                  <span className={active ? "text-[#c084fc]" : "text-white/50 group-hover:text-white/80"}>
                    {l.icon}
                  </span>
                  <span className="text-[13px] tracking-wide font-medium">{l.label}</span>
                </div>
                {l.badge && (
                  <span className="relative z-10 mono text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#a855f7]/25 text-[#e9d5ff] border border-[#a855f7]/40">
                    {l.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Satellite Health Indicator & Logout */}
        <div className="p-4 border-t border-white/[0.06] space-y-3">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="mono text-[10px] text-white/60 uppercase tracking-wider font-semibold">Satélites</span>
            </div>
            <span className="mono text-[10px] text-[#10b981] font-bold">100% LIVE</span>
          </div>

          <button
            onClick={async () => {
              await supabaseBrowser().auth.signOut();
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors text-[12px] font-medium"
          >
            <LogOut className="w-4 h-4" /> Desconectar Sessão
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOPBAR ── */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-white/[0.06] bg-[#070910]/90 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#a855f7] to-[#7e22ce] flex items-center justify-center">
            <Crosshair className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-black tracking-tight text-sm">
            PROSPECT<span className="text-[#c084fc]">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          <span className="mono text-[9px] text-[#10b981] font-bold">ONLINE</span>
        </div>
      </header>

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <main className="flex-1 relative flex flex-col max-h-screen overflow-hidden bg-[#050608]">
        {/* Ambient Glow & Grid Layer */}
        <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#a855f7]/15 via-transparent to-transparent rounded-full blur-[140px] pointer-events-none" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide relative z-10 pb-24 md:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAVIGATION ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 border-t border-white/[0.08] bg-[#080b12]/95 backdrop-blur-2xl z-50 flex overflow-x-auto scrollbar-hide">
        {LINKS.map((l) => {
          const active = path === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex-1 shrink-0 flex flex-col items-center justify-center gap-1 py-3 px-2 min-w-[72px] transition-colors ${
                active ? "text-[#c084fc]" : "text-[#94a3b8]"
              }`}
            >
              <div className="relative">
                {l.icon}
                {active && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#a855f7] shadow-[0_0_8px_#a855f7]" />
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight truncate max-w-[64px]">
                {l.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
