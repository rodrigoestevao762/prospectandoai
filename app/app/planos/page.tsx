"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ArrowUpRight, Sparkles, Shield, CreditCard } from "lucide-react";
import HardyMascot from "@/components/codemakers/HardyMascot";

export default function PlanosPage() {
  const [faturamento, setFaturamento] = useState<"mensal" | "trimestral">("mensal");

  return (
    <div className="space-y-6">
      {/* ── BACK LINK ── */}
      <Link
        href="/app"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar à central
      </Link>

      {/* ── HERO BANNER: SEU LUGAR DENTRO DA CODEHARD ── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] p-6 md:p-8 overflow-hidden shadow-[0_0_40px_rgba(109,40,217,0.35)] border border-purple-400/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Mascot Hardy holding membership card */}
        <div className="absolute right-4 md:right-10 -bottom-4 md:-bottom-8 w-44 md:w-60 h-44 md:h-60 pointer-events-none">
          <HardyMascot variant="member" className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-xl">
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            Seu lugar dentro da CODEHARD.
          </h1>

          {/* Active Membership Badge */}
          <div className="mt-6 p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse shadow-[0_0_10px_#c084fc]" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold block">
                  ASSOCIAÇÃO ATIVA
                </span>
                <span className="text-xs text-white/90">Acesso concedido pela CODEHARD</span>
              </div>
            </div>

            <div className="text-right border-l border-white/10 pl-4">
              <span className="text-[9px] uppercase font-mono text-purple-300 block">SEU CARTÃO</span>
              <span className="text-sm font-bold text-white font-mono">Code Member</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3 TIERS COMPARISON CARDS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tier 01: Code Member */}
        <div className="rounded-3xl bg-[#0c0a18] border border-purple-500/40 overflow-hidden shadow-2xl flex flex-col justify-between p-6 md:p-8 space-y-6 relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                01 / PORTA DE ENTRADA
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-600/30 text-purple-300 text-[10px] font-mono font-bold border border-purple-400/40">
                SEU CARTÃO
              </span>
            </div>

            {/* Visual Card Artwork Tinted Purple */}
            <div className="h-44 rounded-2xl bg-gradient-to-br from-[#1b1433] via-[#0d091e] to-[#080512] border border-purple-500/20 p-5 flex flex-col justify-end relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl" />
              <div className="text-3xl font-black text-white tracking-tight">Code Member</div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Code Member</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Sua base para organizar clientes, projetos e presença digital.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Dashboard e carteira de clientes</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Projetos e portfólio web</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>CRM Kanban operacional</span>
              </div>
            </div>
          </div>

          <button
            disabled
            className="w-full py-3 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-400 text-xs font-bold cursor-default"
          >
            Plano atual ativo ✓
          </button>
        </div>

        {/* Tier 02: Code Creator */}
        <div className="rounded-3xl bg-[#0c0a18] border border-purple-900/25 hover:border-purple-500/30 transition-colors overflow-hidden shadow-2xl flex flex-col justify-between p-6 md:p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                02 / CÍRCULO DE CRIAÇÃO
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                ACESSO RESERVADO
              </span>
            </div>

            {/* Visual Card Artwork */}
            <div className="h-44 rounded-2xl bg-gradient-to-br from-[#2e1065] via-[#1e0b3d] to-[#0a0714] border border-purple-500/20 p-5 flex flex-col justify-end relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/15 rounded-full blur-2xl" />
              <div className="text-3xl font-black text-white tracking-tight">Code Creator</div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Code Creator</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Conhecimento aplicado para construir e entregar em outro nível.
              </p>
              <div className="mt-2 text-base font-bold font-mono text-white">
                R$ 19,90<span className="text-xs text-zinc-500 font-normal">/mês · recorrente</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Tudo do Code Member</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>CODEHARD Play (Todas as aulas e métodos)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Code Design (Biblioteca de referências e DESIGN.md)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert("Redirecionando para checkout seguro Asaas (PIX / Cartão)...")}
            className="w-full py-3 rounded-xl bg-[#140f28] hover:bg-[#1c1538] border border-white/10 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Assinar Code Creator ↗
          </button>
        </div>

        {/* Tier 03: Code Elite */}
        <div className="rounded-3xl bg-gradient-to-b from-[#180f33] to-[#0c0a18] border border-purple-500/50 overflow-hidden shadow-[0_0_40px_rgba(124,58,237,0.3)] flex flex-col justify-between p-6 md:p-8 space-y-6 relative">
          <div className="absolute top-0 right-8 px-3 py-1 rounded-b-xl bg-purple-600 text-white text-[10px] font-mono font-bold tracking-wider shadow">
            MAIS ESCOLHIDO
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                03 / CÍRCULO ELITE
              </span>
              <span className="text-[10px] font-mono text-purple-300 uppercase">
                ACESSO INTEGRAL
              </span>
            </div>

            {/* Visual Card Artwork */}
            <div className="h-44 rounded-2xl bg-gradient-to-br from-[#4c1d95] via-[#3b0764] to-[#120a24] border border-purple-400/30 p-5 flex flex-col justify-end relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />
              <div className="text-3xl font-black text-white tracking-tight">Code Elite</div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Code Elite</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Acesso integral à operação comercial e à prospecção com satélites.
              </p>
              <div className="mt-2 text-base font-bold font-mono text-white">
                R$ 47,20<span className="text-xs text-zinc-500 font-normal">/mês · recorrente</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Tudo do Code Creator</span>
              </div>
              <div className="flex items-center gap-2 text-purple-200 font-semibold">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Code Hunter: 7.000 créditos por mês</span>
              </div>
              <div className="flex items-center gap-2 text-purple-200 font-semibold">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Até 700 créditos por dia para prospecção</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Gerador de Prompts ilimitado com IA</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert("Redirecionando para checkout seguro Asaas (PIX / Cartão)...")}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#9333ea] text-white text-xs font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
          >
            Fazer Upgrade para Elite ↗
          </button>
        </div>
      </div>
    </div>
  );
}

