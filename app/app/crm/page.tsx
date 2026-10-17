"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, Kanban, DollarSign, MoveRight, User, MoreHorizontal,
  ArrowUpRight, Lock, Search, Filter, Download, ChevronUp, ChevronDown
} from "lucide-react";
import HardyMascot from "@/components/codemakers/HardyMascot";
import { supabaseBrowser } from "@/lib/supabase-browser";

interface KanbanCard {
  id: string;
  empresa: string;
  contato: string;
  valor: number;
  estagio: string;
  nicho: string;
}

const COLUNAS = [
  { id: "novos", label: "Novos contatos" },
  { id: "qualificados", label: "Qualificados" },
  { id: "proposta", label: "Proposta enviada" },
  { id: "negociacao", label: "Em negociação" },
  { id: "conquistados", label: "Conquistados" },
  { id: "encerrados", label: "Encerrados" },
];

export default function CRMKanbanPage() {
  const [cards, setCards] = useState<KanbanCard[]>([
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

  const [headerMinimized, setHeaderMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("Todas");
  const [searchQuadro, setSearchQuadro] = useState("");
  const [novoModalOpen, setNovoModalOpen] = useState(false);
  const [novaEmpresa, setNovaEmpresa] = useState("");
  const [novoContato, setNovoContato] = useState("");
  const [novoValor, setNovoValor] = useState("3500");
  const [novoEstagio, setNovoEstagio] = useState("novos");

  // Carregar leads reais do Supabase e LocalStorage
  useEffect(() => {
    async function carregarLeadsCRM() {
      let leadsCarregados: KanbanCard[] = [];

      try {
        const sb = supabaseBrowser();
        const { data: { user } } = await sb.auth.getUser();
        if (user) {
          const { data } = await sb.from("leads").select("*").eq("user_id", user.id);
          if (data && data.length > 0) {
            leadsCarregados = data.map((l: any) => ({
              id: l.id,
              empresa: l.nome,
              contato: l.telefone || l.email || "Decisor Comercial",
              valor: l.status === "cliente" ? 5000 : l.status === "negociacao" ? 3500 : 2500,
              estagio: l.status === "cliente" ? "conquistados" : l.status === "negociacao" ? "negociacao" : l.status === "enviado" ? "proposta" : l.status === "mensagem_gerada" ? "qualificados" : "novos",
              nicho: l.categoria || "Comércio Local"
            }));
          }
        }
      } catch (e) {}

      try {
        const locaisRaw = localStorage.getItem("prospectai_saved_leads");
        if (locaisRaw) {
          const locais = JSON.parse(locaisRaw);
          locais.forEach((l: any) => {
            if (!leadsCarregados.some(c => c.id === l.id || c.empresa === l.nome)) {
              leadsCarregados.push({
                id: l.id,
                empresa: l.nome,
                contato: l.telefone || l.email || "Decisor Comercial",
                valor: 3000,
                estagio: l.status === "cliente" ? "conquistados" : l.status === "negociacao" ? "negociacao" : "novos",
                nicho: l.categoria || "Comércio Local"
              });
            }
          });
        }
      } catch (e) {}

      if (leadsCarregados.length > 0) {
        setCards(leadsCarregados);
      }
    }

    carregarLeadsCRM();
  }, []);

  const totalPipeline = cards.reduce((acc, c) => acc + c.valor, 0);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaEmpresa) return;
    const newCard: KanbanCard = {
      id: Date.now().toString(),
      empresa: novaEmpresa,
      contato: novoContato || "Contato Comercial",
      valor: parseFloat(novoValor) || 0,
      estagio: novoEstagio,
      nicho: "Comércio Local"
    };
    setCards([newCard, ...cards]);
    setNovaEmpresa("");
    setNovoContato("");
    setNovoModalOpen(false);
  };

  const moverCard = async (cardId: string, direcao: "next" | "prev") => {
    const colIds = COLUNAS.map(c => c.id);
    let novoEst: string = "novos";

    setCards(cards.map(c => {
      if (c.id === cardId) {
        const curIdx = colIds.indexOf(c.estagio);
        const nextIdx = direcao === "next"
          ? Math.min(colIds.length - 1, curIdx + 1)
          : Math.max(0, curIdx - 1);
        novoEst = colIds[nextIdx];
        return { ...c, estagio: novoEst };
      }
      return c;
    }));

    // Sincronizar status no Supabase
    try {
      const statusMap: Record<string, string> = {
        novos: "novo",
        qualificados: "mensagem_gerada",
        proposta: "enviado",
        negociacao: "negociacao",
        conquistados: "cliente",
        encerrados: "respondido"
      };
      const sb = supabaseBrowser();
      const { data: { user } } = await sb.auth.getUser();
      if (user && statusMap[novoEst]) {
        await sb.from("leads").update({ status: statusMap[novoEst] }).eq("id", cardId).eq("user_id", user.id);
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      {/* ── HERO BANNER: CRM KANBAN COM HARDY MASCOTE ── */}
      {!headerMinimized && (
        <div className="relative rounded-3xl bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] p-6 md:p-8 overflow-hidden shadow-[0_0_40px_rgba(109,40,217,0.35)] border border-purple-400/30">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Mascot Hardy CRM on Right */}
          <div className="absolute right-4 md:right-10 -bottom-4 md:-bottom-8 w-44 md:w-60 h-44 md:h-60 pointer-events-none">
            <HardyMascot variant="crm" className="w-full h-full" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold block">
                  / CODEHARD / PIPELINE STUDIO
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                    CRM Kanban.
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/30 border border-white/20 text-white text-xs font-mono">
                    {cards.length} oportunidades
                  </span>
                </div>
                <p className="text-xs md:text-sm text-purple-100/90 mt-1 max-w-lg">
                  Organize o funil, priorize oportunidades e avance cada negociação com clareza.
                </p>
              </div>

              {/* Action Buttons Top Banner */}
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/40 border border-white/10 text-white text-xs font-semibold">
                  Editar funil
                </button>
                <button className="px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/40 border border-white/10 text-white text-xs font-semibold">
                  Importar carteira
                </button>
                <button
                  onClick={() => setNovoModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white text-purple-950 font-bold text-xs hover:bg-purple-100 transition-colors shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Nova oportunidade
                </button>
                <button
                  onClick={() => setHeaderMinimized(true)}
                  className="p-2 rounded-xl bg-black/30 hover:bg-black/40 border border-white/10 text-white text-xs"
                  title="Minimizar header"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Counters inside banner */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-6 max-w-2xl">
              {COLUNAS.slice(0, 5).map((col, idx) => {
                const count = cards.filter(c => c.estagio === col.id).length;
                return (
                  <div key={col.id} className="p-2.5 rounded-xl bg-black/25 backdrop-blur-md border border-white/10">
                    <span className="text-[9px] font-mono text-purple-200 block truncate">
                      0{idx + 1} {col.label}
                    </span>
                    <span className="text-base font-bold font-mono text-white mt-0.5 block">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {headerMinimized && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0c0a18] border border-purple-900/25">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white">CRM Kanban</h2>
            <span className="text-xs text-purple-300 font-mono">● {cards.length} oportunidades</span>
          </div>
          <button
            onClick={() => setHeaderMinimized(false)}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
          >
            Expandir header <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── TOOLBAR DE CONTROLE ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0c0a18] border border-purple-900/25">
        {/* Tabs: Todas, Minhas, Em atraso, Prioritárias */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#140f28] border border-white/5 text-xs">
          {["Todas", "Minhas", "Em atraso", "Prioritárias"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === t ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar no quadro..."
              value={searchQuadro}
              onChange={(e) => setSearchQuadro(e.target.value)}
              className="w-full bg-[#140f28] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <button className="px-3 py-1.5 rounded-xl bg-[#140f28] hover:bg-[#1a1435] border border-white/10 text-zinc-300 text-xs font-medium flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-purple-400" /> Filtros
          </button>
          <button className="p-2 rounded-xl bg-[#140f28] hover:bg-[#1a1435] border border-white/10 text-zinc-300 text-xs" title="Exportar">
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── 6 COLUNAS KANBAN COM TOPS CURVADOS E CORES CODEHARD ── */}
      <div className="overflow-x-auto pb-6 scrollbar-hide">
        <div className="flex gap-4 min-w-[1450px]">
          {COLUNAS.map((col) => {
            const colCards = cards.filter(c => c.estagio === col.id);
            const colValor = colCards.reduce((acc, c) => acc + c.valor, 0);

            return (
              <div
                key={col.id}
                className="w-72 flex-shrink-0 bg-[#0c0a18] border border-purple-900/25 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl min-h-[560px]"
              >
                {/* Column Top Curved Header with Red/Purple Accent */}
                <div>
                  <div className="p-4 bg-gradient-to-r from-[#241347] via-[#1a0e35] to-[#140a28] border-b border-purple-900/30 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white tracking-tight">{col.label}</h3>
                      <span className="text-[10px] font-mono text-purple-300/80 mt-0.5 block">
                        R$ {colValor.toLocaleString("pt-BR", { minimumFractionDigits: 0 })} valor previsto
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-zinc-500" />
                      <button
                        onClick={() => {
                          setNovoEstagio(col.id);
                          setNovoModalOpen(true);
                        }}
                        className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Cards List / Empty State */}
                  <div className="p-3 space-y-3">
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
                      <div className="py-14 border-2 border-dashed border-white/[0.05] rounded-2xl flex flex-col items-center justify-center text-center p-4">
                        <Plus className="w-6 h-6 text-zinc-600 mb-2" />
                        <span className="text-xs font-semibold text-zinc-400">Nenhuma oportunidade</span>
                        <span className="text-[10px] text-zinc-600 mt-1 leading-relaxed">
                          Crie um card ou arraste para cá.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Add Opportunity */}
                <div className="p-3 border-t border-white/[0.04]">
                  <button
                    onClick={() => {
                      setNovoEstagio(col.id);
                      setNovoModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    + Adicionar oportunidade
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Banner */}
      <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-white/[0.06]">
        <span>● Sincronizado com sua conta · 0 arquivadas</span>
        <span>Arraste os cards entre etapas para atualizar o faturamento</span>
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
                  {COLUNAS.map(c => (
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
