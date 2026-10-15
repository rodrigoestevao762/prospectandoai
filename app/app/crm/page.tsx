"use client";

import React, { useState } from "react";
import { Plus, Kanban, DollarSign, MoveRight, User, MoreHorizontal, ArrowUpRight } from "lucide-react";

interface LeadCard {
  id: string;
  empresa: string;
  contato: string;
  valor: number;
  estagio: string;
  nicho: string;
}

const INITIAL_COLUNAS = [
  { id: "novos", label: "Novos contatos" },
  { id: "qualificados", label: "Qualificados" },
  { id: "proposta", label: "Proposta enviada" },
  { id: "negociacao", label: "Em negociação" },
  { id: "conquistados", label: "Conquistados" },
  { id: "encerrados", label: "Encerrados" },
];

export default function CRMKanbanPage() {
  const [cards, setCards] = useState<LeadCard[]>([
    {
      id: "1",
      empresa: "Clínica Odonto Prime",
      contato: "Dra. Juliana Mendes",
      valor: 4500,
      estagio: "qualificados",
      nicho: "Saúde & Estética"
    },
    {
      id: "2",
      empresa: "Bella Pasta Ristorante",
      contato: "Chef Giovanni",
      valor: 3200,
      estagio: "negociacao",
      nicho: "Gastronomia"
    }
  ]);

  const [novoModalOpen, setNovoModalOpen] = useState(false);
  const [novaEmpresa, setNovaEmpresa] = useState("");
  const [novoContato, setNovoContato] = useState("");
  const [novoValor, setNovoValor] = useState("3500");
  const [novoEstagio, setNovoEstagio] = useState("novos");

  const totalPipeline = cards.reduce((acc, c) => acc + c.valor, 0);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaEmpresa) return;
    const newCard: LeadCard = {
      id: Date.now().toString(),
      empresa: novaEmpresa,
      contato: novoContato || "Contato Principal",
      valor: parseFloat(novoValor) || 0,
      estagio: novoEstagio,
      nicho: "Comércio Local"
    };
    setCards([newCard, ...cards]);
    setNovaEmpresa("");
    setNovoContato("");
    setNovoModalOpen(false);
  };

  const moverCard = (cardId: string, direcao: "next" | "prev") => {
    const colIds = INITIAL_COLUNAS.map(c => c.id);
    setCards(cards.map(c => {
      if (c.id === cardId) {
        const curIdx = colIds.indexOf(c.estagio);
        const nextIdx = direcao === "next"
          ? Math.min(colIds.length - 1, curIdx + 1)
          : Math.max(0, curIdx - 1);
        return { ...c, estagio: colIds[nextIdx] };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6">
      {/* ── HERO BANNER: PIPELINE STUDIO COM MASCOTE ROXO ── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] p-6 md:p-8 overflow-hidden shadow-[0_0_40px_rgba(109,40,217,0.35)] border border-purple-400/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Mascot */}
        <div className="absolute right-4 md:right-10 -bottom-4 md:-bottom-8 w-44 md:w-64 h-44 md:h-64 pointer-events-none purple-tint opacity-90">
          <img
            src="/codemakers/codin-sales-header-v3.png"
            alt="Mascote Codin Pipeline"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold">
              / CODE MAKERS / PIPELINE STUDIO
            </span>
            <button
              onClick={() => setNovoModalOpen(true)}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" /> Nova oportunidade
            </button>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mt-2">
            Controle visual de oportunidades.
          </h1>
          <p className="text-xs md:text-sm text-purple-100/90 mt-1.5 max-w-lg">
            Avance negociações da prospecção até o contrato assinado com previsibilidade.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Total no Funil</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">{cards.length}</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Em negociação</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">
                {cards.filter(c => c.estagio === "negociacao").length}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Conquistados</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">
                {cards.filter(c => c.estagio === "conquistados").length}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Valor em Pipeline</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">
                R$ {totalPipeline.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── KANBAN BOARD COM 6 COLUNAS ── */}
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-4 min-w-[1300px]">
          {INITIAL_COLUNAS.map((col) => {
            const colCards = cards.filter(c => c.estagio === col.id);
            const colValor = colCards.reduce((acc, c) => acc + c.valor, 0);

            return (
              <div
                key={col.id}
                className="w-72 flex-shrink-0 bg-[#0c0a18] border border-purple-900/25 rounded-3xl p-4 flex flex-col justify-between min-h-[550px] shadow-xl"
              >
                {/* Column Header */}
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                      <h3 className="text-xs font-bold text-white tracking-tight">{col.label}</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-300 text-[10px] font-mono font-bold">
                      {colCards.length}
                    </span>
                  </div>

                  <div className="py-2 text-[11px] font-mono text-zinc-500">
                    R$ {colValor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>

                  {/* Cards List */}
                  <div className="space-y-3 mt-2">
                    {colCards.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 rounded-2xl bg-[#140f28] border border-white/10 hover:border-purple-500/40 transition-all shadow-md group relative"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                            {c.nicho}
                          </span>
                          <span className="text-xs font-bold font-mono text-white">
                            R$ {c.valor.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white mt-2 leading-tight">{c.empresa}</h4>
                        <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                          <User className="w-3 h-3 text-zinc-500" /> {c.contato}
                        </p>

                        {/* Move Card Arrows */}
                        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                          <button
                            onClick={() => moverCard(c.id, "prev")}
                            className="text-[10px] text-zinc-500 hover:text-white transition-colors"
                          >
                            ← Voltar
                          </button>
                          <button
                            onClick={() => moverCard(c.id, "next")}
                            className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
                          >
                            Avançar →
                          </button>
                        </div>
                      </div>
                    ))}

                    {colCards.length === 0 && (
                      <div className="py-12 border-2 border-dashed border-white/[0.05] rounded-2xl text-center text-xs text-zinc-600">
                        Nenhum card aqui
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Add Card Button */}
                <button
                  onClick={() => {
                    setNovoEstagio(col.id);
                    setNovoModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-zinc-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors mt-4 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar card
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Nova Oportunidade */}
      {novoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0c0a18] border border-purple-500/30 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Nova Oportunidade CRM</h3>
            <form onSubmit={handleAddCard} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Nome da Empresa</label>
                <input
                  type="text"
                  placeholder="Ex.: Studio Beleza & Bem-estar"
                  value={novaEmpresa}
                  onChange={(e) => setNovaEmpresa(e.target.value)}
                  className="w-full bg-[#181330] border border-white/10 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Nome do Contato</label>
                <input
                  type="text"
                  placeholder="Ex.: Lucas Medeiros"
                  value={novoContato}
                  onChange={(e) => setNovoContato(e.target.value)}
                  className="w-full bg-[#181330] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Valor Previsto (R$)</label>
                <input
                  type="number"
                  value={novoValor}
                  onChange={(e) => setNovoValor(e.target.value)}
                  className="w-full bg-[#181330] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Estágio Inicial</label>
                <select
                  value={novoEstagio}
                  onChange={(e) => setNovoEstagio(e.target.value)}
                  className="w-full bg-[#181330] border border-white/10 rounded-xl px-3 py-2 text-white"
                >
                  {INITIAL_COLUNAS.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNovoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Criar oportunidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

