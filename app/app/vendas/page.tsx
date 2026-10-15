"use client";

import React, { useState } from "react";
import { Plus, Target, ArrowUpRight, DollarSign, TrendingUp, Sparkles } from "lucide-react";
import ModalRegistrarVenda from "@/components/codemakers/ModalRegistrarVenda";

export default function VendasPage() {
  const [modalVendaOpen, setModalVendaOpen] = useState(false);
  const [filterVendas, setFilterVendas] = useState("Todas");
  const [vendas, setVendas] = useState<any[]>([]);

  const filtros = [
    { label: "Todas", count: vendas.length },
    { label: "Melhor margem", count: 0 },
    { label: "Entrega próxima", count: 0 },
    { label: "Atrasadas", count: 0 },
    { label: "Entregues", count: 0 },
    { label: "Sem cliente", count: 0 },
  ];

  const totalFaturamento = vendas.reduce((acc, v) => acc + (v.valorVendido || 0), 0);
  const totalLucro = vendas.reduce((acc, v) => acc + (v.lucroEstimado || 0), 0);
  const ticketMedio = vendas.length > 0 ? totalFaturamento / vendas.length : 0;
  const margemMedia = totalFaturamento > 0 ? (totalLucro / totalFaturamento) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* ── HERO BANNER: RESULT ROOM COM MASCOTE ROXO ── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] p-6 md:p-8 overflow-hidden shadow-[0_0_40px_rgba(109,40,217,0.35)] border border-purple-400/30">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* 3D Mascot on Right */}
        <div className="absolute right-4 md:right-10 -bottom-4 md:-bottom-8 w-44 md:w-64 h-44 md:h-64 pointer-events-none purple-tint opacity-90">
          <img
            src="/codemakers/codin-sales-header-v3.png"
            alt="Mascote Codin Vendas"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold">
              / CODE MAKERS / RESULT ROOM
            </span>
            <button
              onClick={() => setModalVendaOpen(true)}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" /> Nova venda
            </button>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mt-2">
            Projetos que viraram resultado.
          </h1>

          {/* 4 Métricas Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Faturamento</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">
                R$ {totalFaturamento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Lucro líquido</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">
                R$ {totalLucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Margem média</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">
                {margemMedia.toFixed(0)}%
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Ticket médio</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">
                R$ {ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEÇÃO INFERIOR: FILTROS & PAINEL DE VENDAS ── */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0c0a18] border border-purple-900/25 shadow-2xl space-y-6">
        {/* Barra de Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            <span className="text-xs text-zinc-500 font-mono mr-2">Organizar projetos:</span>
            {filtros.map((f) => (
              <button
                key={f.label}
                onClick={() => setFilterVendas(f.label)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  filterVendas === f.label
                    ? "bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                    : "bg-[#140f28] text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                <span>{f.label}</span>
                <span className="text-[10px] font-mono opacity-80">{f.count}</span>
              </button>
            ))}
          </div>

          <div className="text-[11px] text-zinc-500 font-mono whitespace-nowrap">
            ● no recorte · 0 atrasadas
          </div>
        </div>

        {/* Empty State com 3D Code Brackets */}
        {vendas.length === 0 ? (
          <div className="relative min-h-[360px] rounded-2xl bg-[#0e0b1f] border border-white/[0.04] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between overflow-hidden">
            <div className="max-w-md space-y-4 text-center md:text-left z-10">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto md:mx-0 shadow-inner">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">A primeira venda abre o painel.</h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Registre receita, custo e prazo. A análise financeira nasce automaticamente.
                </p>
              </div>
              <button
                onClick={() => setModalVendaOpen(true)}
                className="px-6 py-3 rounded-xl bg-white text-purple-950 font-bold text-xs hover:bg-purple-100 transition-colors shadow-lg inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Registrar primeira venda
              </button>
            </div>

            {/* Decorative 3D Code Brackets </> Symbol Tinted Purple */}
            <div className="w-64 md:w-80 h-64 md:h-80 opacity-70 pointer-events-none purple-tint mt-6 md:mt-0">
              <img
                src="/codemakers/codemakers-sales-symbol-v3.png"
                alt="Símbolo 3D Code Makers"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {vendas.map((v) => (
              <div key={v.id} className="py-4 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">{v.projeto}</h4>
                  <p className="text-zinc-500 mt-0.5">{v.cliente} · {v.tipoProjeto}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-white">
                    R$ {v.valorVendido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <p className="text-purple-400 text-[11px] font-mono">
                    Lucro: R$ {v.lucroEstimado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ModalRegistrarVenda
        isOpen={modalVendaOpen}
        onClose={() => setModalVendaOpen(false)}
        onSuccess={(v) => setVendas((prev) => [v, ...prev])}
      />
    </div>
  );
}
