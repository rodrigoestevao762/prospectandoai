"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase-browser";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Globe,
  Kanban,
  Sparkles,
  Palette,
  PlayCircle,
  CreditCard,
  Settings,
  LogOut,
  Search,
  Bell,
  Radio,
  Eye,
  RotateCw,
  Zap,
  Plus,
  Compass
} from "lucide-react";
import ModalRegistrarVenda from "@/components/codemakers/ModalRegistrarVenda";
import ModalRegistrarCliente from "@/components/codemakers/ModalRegistrarCliente";
import ModalConfiguracoes from "@/components/codemakers/ModalConfiguracoes";
import CodeHardLogo from "@/components/codemakers/CodeHardLogo";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  isAi?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { href: "/app/clientes", label: "Clientes & Leads Salvos", icon: <Users className="w-5 h-5" /> },
  { href: "/app/vendas", label: "Vendas", icon: <Briefcase className="w-5 h-5" /> },
  { href: "/app/sites", label: "Sites", icon: <Globe className="w-5 h-5" /> },
  { href: "/app/crm", label: "CRM Kanban", icon: <Kanban className="w-5 h-5" /> },
  { href: "/app/builder", label: "Site Builder IA", icon: <Sparkles className="w-5 h-5" /> },
  { href: "/app/busca", label: "Code Hunter", icon: <Zap className="w-5 h-5" />, badge: "7k" },
  { href: "/app/mapa", label: "Cartografia Noturna", icon: <Compass className="w-5 h-5" />, badge: "FSD" },
  { href: "/app/design", label: "Code Design", icon: <Palette className="w-5 h-5" /> },
  { href: "/app/prompts", label: "Gerador de Prompts", icon: <Sparkles className="w-5 h-5" /> },
  { href: "/app/play", label: "Code Play", icon: <PlayCircle className="w-5 h-5" /> },
  { href: "/app/planos", label: "Planos & Membros", icon: <CreditCard className="w-5 h-5" /> },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  // Modals state
  const [modalVendaOpen, setModalVendaOpen] = useState(false);
  const [modalClienteOpen, setModalClienteOpen] = useState(false);
  const [modalConfigOpen, setModalConfigOpen] = useState(false);

  // Search input state
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await supabaseBrowser().auth.signOut();
    } catch (e) {
      console.error(e);
    }
    window.location.href = "/login";
  };

  return (
    <div className="bg-[#07050f] min-h-screen flex text-white font-sans selection:bg-[#7c3aed] selection:text-white">
      {/* ── CURVED OBSIDIAN DOCK SIDEBAR (DESKTOP) ── */}
      <aside className="hidden lg:flex flex-col w-[88px] h-screen sticky top-0 bg-[#090714] border-r border-purple-900/20 py-5 items-center justify-between z-40 select-none">
        {/* Top Brand Symbol */}
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/app"
            className="group transition-transform hover:scale-105"
            title="CODEHARD — Início"
          >
            <CodeHardLogo showWordmark={false} size="lg" />
          </Link>

          <div className="w-8 h-px bg-white/[0.08]" />
        </div>

        {/* Vertical Nav Icons Rail */}
        <nav className="flex-1 flex flex-col items-center gap-2 overflow-y-auto py-2 scrollbar-hide my-2">
          {NAV_ITEMS.map((item) => {
            const isActive = path === item.href || (item.href !== "/app" && path.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all group ${
                  isActive
                    ? "bg-[#6d28d9] text-white shadow-[0_0_25px_rgba(109,40,217,0.6)]"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                }`}
                title={item.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeDockPill"
                    className="absolute inset-0 rounded-2xl border-2 border-purple-300/40 pointer-events-none"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="transition-transform group-hover:scale-110">{item.icon}</span>

                {item.badge && !isActive && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-purple-600 border border-purple-400 text-[8px] font-mono font-bold text-white shadow">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions: Settings & Logout */}
        <div className="flex flex-col items-center gap-2 pt-2 border-t border-white/[0.08] w-full px-3">
          <button
            onClick={() => setModalConfigOpen(true)}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            title="Configurações da Conta"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button
            onClick={handleLogout}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Sair do Sistema"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE CONTAINER ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* ── TOP CONTROL BAR ── */}
        <header className="sticky top-0 z-30 h-18 px-4 lg:px-8 bg-[#090714]/80 backdrop-blur-xl border-b border-purple-900/20 flex items-center justify-between gap-4">
          {/* Left: Global Search with Cmd+Space */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar cliente, empresa ou telefone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#120e24]/90 border border-purple-500/15 rounded-2xl pl-10 pr-28 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 transition-colors shadow-inner"
              />
              <div className="absolute right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-[10px] font-mono text-zinc-400">
                <span>⌘</span>
                <span>Espaço</span>
              </div>
            </div>
          </div>

          {/* Right Control Widgets */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Quick Action: Nova Venda */}
            <button
              onClick={() => setModalVendaOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#9333ea] text-white text-xs font-semibold shadow-[0_0_15px_rgba(124,58,237,0.35)] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Nova venda
            </button>

            {/* Quick Action: Novo Cliente */}
            <button
              onClick={() => setModalClienteOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-purple-400" />
              Cliente
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setModalConfigOpen(true)}
              className="w-10 h-10 rounded-xl bg-[#130e26] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors relative"
              title="Notificações"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-purple-500 absolute top-2 right-2 shadow-[0_0_8px_#a855f7]" />
            </button>

            {/* AO VIVO Pulse Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">AO VIVO</span>
            </div>

            {/* Eye (Privacy Toggle) */}
            <button
              onClick={() => setModalConfigOpen(true)}
              className="w-10 h-10 rounded-xl bg-[#130e26] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              title="Privacidade"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Refresh Sync */}
            <button
              onClick={() => router.refresh()}
              className="w-10 h-10 rounded-xl bg-[#130e26] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              title="Atualizar dados"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* User Profile Pill */}
            <button
              onClick={() => setModalConfigOpen(true)}
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-[#130e26] border border-white/10 hover:border-purple-500/40 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-700 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                R
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-white leading-tight">Rodrigo Estevão</span>
                <span className="text-[9px] text-purple-300 font-mono leading-tight">Code Member</span>
              </div>
            </button>
          </div>
        </header>

        {/* ── PAGE CONTENT AREA ── */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-28 lg:pb-12">
          {children}
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION BAR ── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-[#090714]/95 backdrop-blur-2xl border-t border-purple-900/25 z-50 flex items-center justify-around px-2">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive ? "text-purple-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {item.icon}
              <span className="text-[9px] font-medium tracking-tight mt-0.5">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setModalVendaOpen(true)}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6d28d9] to-[#a855f7] flex items-center justify-center text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] -mt-4 border-2 border-[#090714]"
        >
          <Plus className="w-5 h-5" />
        </button>
      </nav>

      {/* ── GLOBAL MODALS ── */}
      <ModalRegistrarVenda
        isOpen={modalVendaOpen}
        onClose={() => setModalVendaOpen(false)}
        onSuccess={(v) => console.log("Venda salva:", v)}
      />
      <ModalRegistrarCliente
        isOpen={modalClienteOpen}
        onClose={() => setModalClienteOpen(false)}
        onSuccess={(c) => console.log("Cliente salvo:", c)}
      />
      <ModalConfiguracoes
        isOpen={modalConfigOpen}
        onClose={() => setModalConfigOpen(false)}
      />
    </div>
  );
}
