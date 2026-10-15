"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Plus,
  ArrowUpRight,
  UserPlus,
  CreditCard,
  Calendar,
  Sparkles,
  ChevronDown
} from "lucide-react";
import ModalRegistrarVenda from "@/components/codemakers/ModalRegistrarVenda";
import ModalRegistrarCliente from "@/components/codemakers/ModalRegistrarCliente";

export default function DashboardPage() {
  const [periodo, setPeriodo] = useState("6 meses");
  const [modalVendaOpen, setModalVendaOpen] = useState(false);
  const [modalClienteOpen, setModalClienteOpen] = useState(false);

  const meses = [
    { nome: "Mai", valor: 0 },
    { nome: "Jun", valor: 0 },
    { nome: "Jul", valor: 0 },
    { nome: "Ago", valor: 0 },
    { nome: "Set", valor: 0 },
    { nome: "Out", valor: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* ── GRID PRINCIPAL: 2 COLUNAS (ESQUERDA MÉTRICAS / DIREITA CARTEIRA) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── COLUNA ESQUERDA (8 COLUNAS) ── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card Lucro no Período com Gráfico */}
          <div className="p-6 md:p-8 rounded-3xl bg-[#0c0a18] border border-purple-900/25 relative overflow-hidden shadow-2xl">
            {/* Top Bar do Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_#a855f7]" />
                  <span className="text-xs uppercase font-mono tracking-wider text-zinc-400 font-semibold">
                    Lucro no período
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl md:text-4xl font-black tracking-tight text-white font-mono">
                    R$ 0
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-mono font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> 0%
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => alert("Resumo financeiro compilado: Sem movimentações no período selecionado.")}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#9333ea] text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(124,58,237,0.35)] transition-all cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Gerar resumo do período
                </button>

                {/* Filtros de tempo */}
                <div className="flex items-center p-1 rounded-xl bg-[#140f28] border border-white/[0.06] text-[11px]">
                  {["Hoje", "7 dias", "1 mês", "3 meses", "6 meses", "1 ano"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriodo(p)}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        periodo === p
                          ? "bg-purple-600 text-white font-bold shadow-sm"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gráfico Linear / Área */}
            <div className="py-8 relative">
              <div className="h-44 w-full flex flex-col justify-between relative">
                {/* Linhas de grade horizontais */}
                {[
                  { label: "R$ 1", y: "0%" },
                  { label: "R$ 0,8", y: "25%" },
                  { label: "R$ 0,5", y: "50%" },
                  { label: "R$ 0,3", y: "75%" },
                  { label: "R$ 0", y: "100%" },
                ].map((grid, idx) => (
                  <div key={idx} className="relative w-full flex items-center">
                    <div className="w-full border-b border-white/[0.04]" />
                    <span className="w-14 text-right text-[10px] text-zinc-600 font-mono pl-2">
                      {grid.label}
                    </span>
                  </div>
                ))}

                {/* Linha Roxa Neon de Lucro */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#6d28d9] via-[#a855f7] to-[#7c3aed] shadow-[0_0_12px_#a855f7]" />
              </div>

              {/* Meses no eixo X */}
              <div className="flex justify-between pl-2 pr-14 mt-4 text-[11px] text-zinc-500 font-mono">
                {meses.map((m) => (
                  <span key={m.nome}>{m.nome}</span>
                ))}
              </div>
            </div>

            {/* Rodapé do Card com Ticket Médio e Legenda */}
            <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="px-3 py-1.5 rounded-lg bg-[#140f28] border border-white/[0.06] font-mono text-zinc-400">
                Ticket médio: <span className="text-white font-bold">R$ 0</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                  <span className="text-zinc-400">Lucro líquido</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400/50" />
                  <span className="text-zinc-500">Receita total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subgrid: Próxima Venda & Lucro por Período */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Próxima Venda (Banner Roxo com Laptop 3D) */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#4c1d95] via-[#581c87] to-[#1e0b3d] border border-purple-500/30 relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-[0_0_30px_rgba(124,58,237,0.25)]">
              {/* Decorative 3D Laptop Image Tinted Purple */}
              <div className="absolute right-0 bottom-0 w-44 h-44 opacity-80 pointer-events-none purple-tint">
                <img
                  src="/codemakers/codemakers-code-laptop-v3.png"
                  alt="Laptop 3D Code Makers"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="relative z-10 max-w-xs">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-3 border border-white/20">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  Sua próxima venda começa agora.
                </h3>
                <p className="text-xs text-purple-200 mt-1">
                  0 empresas esperando seu próximo movimento.
                </p>
              </div>

              <div className="relative z-10 mt-6">
                <button
                  onClick={() => setModalClienteOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-white text-purple-950 font-bold text-xs hover:bg-purple-100 transition-colors shadow-lg cursor-pointer"
                >
                  Registrar cliente
                </button>
              </div>
            </div>

            {/* Card 2: Lucro por período com mini barras */}
            <div className="p-6 rounded-3xl bg-[#0c0a18] border border-purple-900/25 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-semibold">Lucro por período</span>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono bg-[#140f28] px-2 py-0.5 rounded-md border border-white/5">
                    <span>6 meses</span>
                    <ChevronDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold font-mono text-white">R$ 0</span>
                  <span className="text-[10px] text-purple-300 font-mono">↗ 0%</span>
                </div>
              </div>

              {/* Mini gráfico de barras */}
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <div className="grid grid-cols-6 gap-2 items-end h-16">
                  {meses.map((m) => (
                    <div key={m.nome} className="flex flex-col items-center gap-1">
                      <span className="text-[9px] text-zinc-600 font-mono">R$ 0</span>
                      <div className="w-full h-2 rounded-full bg-purple-600/30 border border-purple-500/20" />
                      <span className="text-[10px] text-zinc-500 font-mono mt-0.5">{m.nome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── COLUNA DIREITA (4 COLUNAS): MINHA CARTEIRA & VENDAS RECENTES ── */}
        <div className="lg:col-span-4 space-y-6">
          {/* Box Minha Carteira */}
          <div className="p-6 rounded-3xl bg-[#0c0a18] border border-purple-900/25 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white tracking-tight">Minha carteira</h3>
              <button
                onClick={() => setModalVendaOpen(true)}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Nova venda
              </button>
            </div>

            {/* 3D Metallic Code Makers Card */}
            <div className="relative rounded-2xl bg-gradient-to-br from-[#1a1433] via-[#0d091e] to-[#080512] border border-purple-500/30 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
              {/* Decorative radial overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-2xl text-purple-400 tracking-tighter">
                  &lt;/&gt;
                </span>
                {/* Metallic Gold Chip */}
                <div className="w-9 h-7 rounded-md bg-gradient-to-br from-[#fbbf24] via-[#d97706] to-[#b45309] border border-yellow-200/40 p-1 flex items-center justify-center opacity-90 shadow">
                  <div className="w-full h-full border border-black/30 rounded-sm" />
                </div>
              </div>

              <div className="mt-8">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block">
                  Lucro disponível
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black font-mono text-white">R$ 0</span>
                  <span className="text-[10px] text-purple-300 font-mono">↗ 0%</span>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono block mt-1">Receita R$ 0</span>
              </div>
            </div>

            {/* Two Action Buttons: Cliente & Venda */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setModalClienteOpen(true)}
                className="py-2.5 rounded-xl bg-[#140f28] hover:bg-[#1c1538] border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-purple-400" />
                Cliente
              </button>
              <button
                onClick={() => setModalVendaOpen(true)}
                className="py-2.5 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#9333ea] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(124,58,237,0.35)] transition-all cursor-pointer"
              >
                Venda <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Box Vendas Recentes */}
          <div className="p-6 rounded-3xl bg-[#0c0a18] border border-purple-900/25 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white tracking-tight">Vendas recentes</h3>
              <Link href="/app/vendas" className="text-xs text-zinc-400 hover:text-white">
                Ver todas
              </Link>
            </div>

            {/* Empty State */}
            <div className="p-8 rounded-2xl bg-[#120e24] border border-white/[0.04] text-center flex flex-col items-center">
              <span className="text-xs font-semibold text-white">Nenhuma venda registrada</span>
              <p className="text-[11px] text-zinc-500 mt-1 max-w-[200px]">
                Seus resultados aparecerão aqui.
              </p>
              <button
                onClick={() => setModalVendaOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#9333ea] text-white text-xs font-semibold shadow-[0_0_15px_rgba(124,58,237,0.35)] transition-all cursor-pointer"
              >
                Registrar primeira venda
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Modals for Page Buttons */}
      <ModalRegistrarVenda
        isOpen={modalVendaOpen}
        onClose={() => setModalVendaOpen(false)}
      />
      <ModalRegistrarCliente
        isOpen={modalClienteOpen}
        onClose={() => setModalClienteOpen(false)}
      />
    </div>
  );
}
