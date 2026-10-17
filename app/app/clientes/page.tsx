"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Users, Mail, ExternalLink, Send, MessageSquare, Phone, Globe, Sparkles,
  Trash2, Copy, Check, Search, Filter, Plus, ArrowUpRight, Flame, ShieldAlert,
  ChevronDown, Edit3, Kanban, RefreshCw, LayoutGrid, Table as TableIcon,
  MapPin, CheckCircle2, AlertCircle, Building2, Eye
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import HardyMascot from "@/components/codemakers/HardyMascot";
import ModalRegistrarCliente from "@/components/codemakers/ModalRegistrarCliente";
import { isEmailValidoParaB2B } from "@/lib/validar-email";

export interface SavedLead {
  id: string;
  osm_id?: string;
  nome: string;
  categoria?: string;
  cidade: string;
  pais?: string;
  telefone?: string | null;
  website?: string | null;
  instagram?: string | null;
  email?: string | null;
  endereco?: string | null;
  score?: number;
  nivel?: "quente" | "morno" | "frio";
  status?: "novo" | "mensagem_gerada" | "enviado" | "respondido" | "negociacao" | "cliente";
  notas?: string | null;
  created_at?: string;
}

const STATUS_OPCOES = [
  { id: "novo", label: "Novo Lead", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { id: "mensagem_gerada", label: "DM Gerada", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  { id: "enviado", label: "E-mail / DM Enviado", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { id: "respondido", label: "Respondeu", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
  { id: "negociacao", label: "Em Negociação", color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "cliente", label: "Cliente Fechado", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
];

export default function ClientesLeadsPage() {
  const [leads, setLeads] = useState<SavedLead[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("todos");
  const [viewMode, setViewMode] = useState<"cards" | "tabela">("cards");
  const [modalClienteOpen, setModalClienteOpen] = useState(false);
  const [menuRemoverAberto, setMenuRemoverAberto] = useState(false);

  // Estados de Operação Individual
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [aviso, setAviso] = useState<{ tipo: "ok" | "erro"; msg: string } | null>(null);
  const [msgAberta, setMsgAberta] = useState<Record<string, string>>({});
  const [copiado, setCopiado] = useState<Record<string, boolean>>({});

  // ── CARREGAMENTO DE LEADS (SUPABASE + LOCALSTORAGE RESILIENTE) ──
  const carregarLeads = useCallback(async () => {
    setCarregando(true);
    let listaFinal: SavedLead[] = [];

    try {
      const sb = supabaseBrowser();
      const { data: { user } } = await sb.auth.getUser();

      if (user) {
        const { data, error } = await sb
          .from("leads")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (data && !error) {
          listaFinal = data;
        }
      }
    } catch (e) {
      console.warn("Falha ao carregar do Supabase:", e);
    }

    // Mesclar com cache local para nunca perder leads capturados
    try {
      const locaisRaw = localStorage.getItem("prospectai_saved_leads");
      if (locaisRaw) {
        const locais: SavedLead[] = JSON.parse(locaisRaw);
        locais.forEach((loc) => {
          const jaExiste = listaFinal.some(
            (rem) => rem.id === loc.id || (rem.osm_id && rem.osm_id === loc.osm_id)
          );
          if (!jaExiste) {
            listaFinal.unshift(loc);
          }
        });
      }
    } catch (e) {
      console.warn("Falha ao ler localStorage:", e);
    }

    // Sanitização automática: purgar e-mails fantasmas e resquícios de busca como 20@gmail.com
    let houveSanitizacao = false;
    listaFinal = listaFinal.map((lead) => {
      if (lead.email && (lead.email.trim() === "20@gmail.com" || !isEmailValidoParaB2B(lead.email))) {
        houveSanitizacao = true;
        return { ...lead, email: null };
      }
      return lead;
    });

    if (houveSanitizacao) {
      try {
        localStorage.setItem("prospectai_saved_leads", JSON.stringify(listaFinal));
      } catch (e) {}
      try {
        const sb = supabaseBrowser();
        sb.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            sb.from("leads").update({ email: null }).eq("email", "20@gmail.com").eq("user_id", user.id);
          }
        });
      } catch (e) {}
    }

    setLeads(listaFinal);
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregarLeads();
  }, [carregarLeads]);

  // Salvar no estado e sincronizar com Supabase & LocalStorage
  const atualizarLead = async (id: string, campos: Partial<SavedLead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...campos } : l))
    );

    // Sincronizar LocalStorage
    try {
      const locaisRaw = localStorage.getItem("prospectai_saved_leads");
      if (locaisRaw) {
        const locais: SavedLead[] = JSON.parse(locaisRaw);
        const atualizados = locais.map((l) => (l.id === id ? { ...l, ...campos } : l));
        localStorage.setItem("prospectai_saved_leads", JSON.stringify(atualizados));
      }
    } catch (e) {}

    // Sincronizar Supabase
    try {
      const sb = supabaseBrowser();
      const { data: { user } } = await sb.auth.getUser();
      if (user) {
        await sb.from("leads").update(campos).eq("id", id).eq("user_id", user.id);
      }
    } catch (e) {}
  };

  // ── OPÇÃO 1: DISPARO DE E-MAIL ──
  const handleDispararEmail = async (lead: SavedLead) => {
    if (!lead.email) {
      setAviso({ tipo: "erro", msg: `O lead "${lead.nome}" não possui e-mail cadastrado.` });
      return;
    }

    setOcupado(lead.id + ":email");
    setAviso(null);

    try {
      const res = await fetch("/api/enviar-automatico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id }),
      });
      const data = await res.json();

      if (res.ok) {
        await atualizarLead(lead.id, { status: "enviado" });
        if (data.texto) {
          setMsgAberta((prev) => ({ ...prev, [lead.id]: data.texto }));
        }
        setAviso({ tipo: "ok", msg: `E-mail enviado com sucesso para ${lead.email}!` });
      } else {
        setAviso({ tipo: "erro", msg: data.erro || "Falha ao enviar e-mail." });
      }
    } catch (err: any) {
      setAviso({ tipo: "erro", msg: err.message || "Erro de conexão ao enviar e-mail." });
    } finally {
      setOcupado(null);
    }
  };

  // ── OPÇÃO 2: GERAR DM (INSTAGRAM COM IA GEMINI) ──
  const handleGerarDM = async (lead: SavedLead) => {
    setOcupado(lead.id + ":dm");
    setAviso(null);

    try {
      let texto = msgAberta[lead.id];
      if (!texto) {
        const res = await fetch("/api/gerar-mensagem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadId: lead.id, canal: "instagram" }),
        });
        const data = await res.json();

        if (res.ok && data.texto) {
          texto = data.texto;
          setMsgAberta((prev) => ({ ...prev, [lead.id]: texto }));
          await atualizarLead(lead.id, { status: "mensagem_gerada" });
        } else {
          // Template fallback
          texto = `Olá ${lead.nome}! Notei que vocês têm um trabalho incrível em ${lead.cidade}, mas ainda estão sem um site profissional para captar clientes no Google. Preparamos uma proposta rápida sem compromisso, podemos conversar?`;
          setMsgAberta((prev) => ({ ...prev, [lead.id]: texto }));
        }
      }

      // Copiar para o clipboard
      navigator.clipboard.writeText(texto);
      setCopiado((prev) => ({ ...prev, [lead.id]: true }));
      setTimeout(() => setCopiado((prev) => ({ ...prev, [lead.id]: false })), 2500);

      // Abrir Instagram se tiver
      if (lead.instagram) {
        let username = lead.instagram.trim().replace("@", "");
        if (username.includes("instagram.com/")) {
          username = username.split("instagram.com/")[1].split("/")[0].split("?")[0];
        }
        window.open(`https://ig.me/m/${username}`, "_blank");
        await atualizarLead(lead.id, { status: "enviado" });
      }

      setAviso({ tipo: "ok", msg: "Mensagem copiada para a área de transferência!" });
    } catch (err: any) {
      setAviso({ tipo: "erro", msg: err.message || "Erro ao gerar DM." });
    } finally {
      setOcupado(null);
    }
  };

  // ── OPÇÃO 3: WHATSAPP DIRETO ──
  const handleAbrirWhatsApp = async (lead: SavedLead) => {
    if (!lead.telefone) {
      setAviso({ tipo: "erro", msg: "Este lead não possui telefone cadastrado." });
      return;
    }

    let texto = msgAberta[lead.id];
    if (!texto) {
      texto = `Olá, falo com o responsável pela ${lead.nome}? Identificamos uma oportunidade para colocar sua empresa no topo do Google em ${lead.cidade}. Podemos conversar 2 minutos?`;
      setMsgAberta((prev) => ({ ...prev, [lead.id]: texto }));
    }

    navigator.clipboard.writeText(texto);
    const numLimpo = lead.telefone.replace(/\D/g, "");
    const ddi = numLimpo.length <= 11 ? "55" + numLimpo : numLimpo;
    window.open(`https://wa.me/${ddi}?text=${encodeURIComponent(texto)}`, "_blank");
    await atualizarLead(lead.id, { status: "enviado" });
  };

  // ── OPÇÃO 4: ENRIQUECIMENTO PROFUNDO (DEEP SCAN COM IA) ──
  const handleEnriquecerLead = async (lead: SavedLead) => {
    setOcupado(lead.id + ":enrich");
    setAviso(null);

    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          nome: lead.nome,
          cidade: lead.cidade,
          pais: lead.pais || "Brasil"
        }),
      });
      const data = await res.json();

      if (res.ok && data.lead) {
        await atualizarLead(lead.id, data.lead);
        setAviso({ tipo: "ok", msg: `Lead "${lead.nome}" enriquecido com sucesso!` });
      } else {
        setAviso({ tipo: "erro", msg: data.error || "Não foram encontrados novos dados públicos." });
      }
    } catch (err: any) {
      setAviso({ tipo: "erro", msg: err.message || "Erro ao enriquecer dados." });
    } finally {
      setOcupado(null);
    }
  };

  // ── OPÇÃO 5: EXCLUIR LEAD ──
  const handleExcluirLead = async (id: string, nome: string) => {
    if (!confirm(`Deseja realmente remover "${nome}" da sua carteira de leads?`)) return;

    setOcupado(id + ":delete");
    setLeads((prev) => prev.filter((l) => l.id !== id));

    // Remover do LocalStorage
    try {
      const locaisRaw = localStorage.getItem("prospectai_saved_leads");
      if (locaisRaw) {
        const locais: SavedLead[] = JSON.parse(locaisRaw);
        localStorage.setItem(
          "prospectai_saved_leads",
          JSON.stringify(locais.filter((l) => l.id !== id))
        );
      }
    } catch (e) {}

    // Remover do Supabase
    try {
      const sb = supabaseBrowser();
      const { data: { user } } = await sb.auth.getUser();
      if (user) {
        await sb.from("leads").delete().eq("id", id).eq("user_id", user.id);
      }
    } catch (e) {}

    setOcupado(null);
    setAviso({ tipo: "ok", msg: `Lead "${nome}" removido.` });
  };

  // ── FUNÇÃO: REMOVER TODOS OS LEADS ──
  const handleRemoverTodos = async () => {
    if (leads.length === 0) return;
    if (!confirm(`Deseja realmente remover TODOS os ${leads.length} leads salvos? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setOcupado("bulk:delete_all");
    setLeads([]);

    // Limpar LocalStorage
    try {
      localStorage.removeItem("prospectai_saved_leads");
    } catch (e) {}

    // Limpar Supabase
    try {
      const sb = supabaseBrowser();
      const { data: { user } } = await sb.auth.getUser();
      if (user) {
        await sb.from("leads").delete().eq("user_id", user.id);
      }
    } catch (e) {}

    setOcupado(null);
    setMenuRemoverAberto(false);
    setAviso({ tipo: "ok", msg: "Todos os leads foram removidos da sua carteira." });
  };

  // ── FUNÇÃO: REMOVER POR NÍVEL (QUENTES, MORNOS, FRIOS) ──
  const handleRemoverPorNivel = async (nivelAlvo: "quente" | "morno" | "frio") => {
    const alvos = leads.filter((l) => {
      const n = l.nivel || (!l.website && (l.score || 0) >= 80 ? "quente" : (l.score || 0) >= 50 ? "morno" : "frio");
      return n === nivelAlvo;
    });

    if (alvos.length === 0) {
      setAviso({ tipo: "erro", msg: `Não há leads classificados como ${nivelAlvo} para remover.` });
      setMenuRemoverAberto(false);
      return;
    }

    const labelNivel = nivelAlvo === "quente" ? "QUENTES" : nivelAlvo === "morno" ? "MORNOS" : "FRIOS";
    if (!confirm(`Deseja remover todos os ${alvos.length} leads ${labelNivel}?`)) {
      return;
    }

    const alvosIds = new Set(alvos.map((a) => a.id));
    const restantes = leads.filter((l) => !alvosIds.has(l.id));

    setOcupado(`bulk:delete_${nivelAlvo}`);
    setLeads(restantes);

    // Atualizar LocalStorage
    try {
      localStorage.setItem("prospectai_saved_leads", JSON.stringify(restantes));
    } catch (e) {}

    // Atualizar Supabase
    try {
      const sb = supabaseBrowser();
      const { data: { user } } = await sb.auth.getUser();
      if (user) {
        const idsArray = Array.from(alvosIds);
        await sb.from("leads").delete().in("id", idsArray).eq("user_id", user.id);
      }
    } catch (e) {}

    setOcupado(null);
    setMenuRemoverAberto(false);
    setAviso({ tipo: "ok", msg: `${alvos.length} leads ${labelNivel.toLowerCase()} foram removidos.` });
  };

  // ── OPÇÃO 6: DISPARO EM LOTE DE E-MAILS ──
  const handleDisparoEmLote = async () => {
    const comEmail = leadsFiltrados.filter((l) => l.email && l.status !== "enviado" && l.status !== "cliente");
    if (comEmail.length === 0) {
      setAviso({ tipo: "erro", msg: "Nenhum lead com e-mail pendente de envio nos filtros atuais." });
      return;
    }

    if (!confirm(`Deseja disparar e-mails de apresentação para ${comEmail.length} empresas agora?`)) return;

    setOcupado("bulk:email");
    setAviso({ tipo: "ok", msg: `Iniciando disparo em lote para ${comEmail.length} leads...` });

    try {
      const ids = comEmail.map((l) => l.id);
      const res = await fetch("/api/enviar-lote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: ids }),
      });
      const data = await res.json();

      if (res.ok) {
        for (const l of comEmail) {
          await atualizarLead(l.id, { status: "enviado" });
        }
        setAviso({ tipo: "ok", msg: `Disparo concluído com sucesso para ${comEmail.length} empresas!` });
      } else {
        setAviso({ tipo: "erro", msg: data.erro || "Falha no envio em lote." });
      }
    } catch (err: any) {
      setAviso({ tipo: "erro", msg: err.message || "Erro no envio em lote." });
    } finally {
      setOcupado(null);
    }
  };

  // ── FILTRAGEM DINÂMICA DE LEADS ──
  const leadsFiltrados = useMemo(() => {
    return leads.filter((l) => {
      // Filtro por abas
      if (abaAtiva === "contato" && l.status !== "novo" && l.status !== "mensagem_gerada") return false;
      if (abaAtiva === "enviados" && l.status !== "enviado") return false;
      if (abaAtiva === "negociacao" && l.status !== "negociacao" && l.status !== "respondido") return false;
      if (abaAtiva === "quentes" && !(l.nivel === "quente" || (!l.website && (l.score || 0) >= 80))) return false;
      if (abaAtiva === "mornos" && !(l.nivel === "morno" || (!l.website && (l.score || 0) >= 50 && (l.score || 0) < 80))) return false;
      if (abaAtiva === "frios" && !(l.nivel === "frio" || (l.website && (l.score || 0) < 50))) return false;

      // Filtro por texto
      if (busca.trim()) {
        const q = busca.toLowerCase();
        const nomeMatch = l.nome?.toLowerCase().includes(q);
        const cidadeMatch = l.cidade?.toLowerCase().includes(q);
        const catMatch = l.categoria?.toLowerCase().includes(q);
        const telMatch = l.telefone?.toLowerCase().includes(q);
        if (!nomeMatch && !cidadeMatch && !catMatch && !telMatch) return false;
      }

      return true;
    });
  }, [leads, abaAtiva, busca]);

  // Contadores para métricas
  const contagens = useMemo(() => {
    return {
      total: leads.length,
      quentes: leads.filter((l) => l.nivel === "quente" || (!l.website && (l.score || 0) >= 80)).length,
      mornos: leads.filter((l) => l.nivel === "morno" || (!l.website && (l.score || 0) >= 50 && (l.score || 0) < 80)).length,
      frios: leads.filter((l) => l.nivel === "frio" || (l.website && (l.score || 0) < 50)).length,
      enviados: leads.filter((l) => l.status === "enviado").length,
      clientes: leads.filter((l) => l.status === "cliente").length,
    };
  }, [leads]);

  return (
    <div className="space-y-6 pb-16">
      {/* ── BANNER EXECUTIVO COM HARDY MASCOTE & TELEMETRIA ── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] p-6 md:p-8 overflow-hidden shadow-[0_0_40px_rgba(109,40,217,0.35)] border border-purple-400/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Mascote Hardy no Canto Direito */}
        <div className="absolute right-4 md:right-8 -bottom-4 md:-bottom-8 w-44 md:w-60 h-44 md:h-60 pointer-events-none">
          <HardyMascot variant="client" className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold px-2.5 py-0.5 rounded-full bg-black/25 border border-white/10">
              / CODEHARD / CARTEIRA DE LEADS SALVOS
            </span>
            <span className="text-[10px] font-mono text-purple-200">
              {leads.length} alvos capturados
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            Central de Leads &amp; Gestão de Fechamentos.
          </h1>
          <p className="text-xs md:text-sm text-purple-100/90 max-w-lg leading-relaxed">
            Aqui estão todas as empresas salvas nas suas varreduras. Dispare e-mails, gere DMs com IA, acesse o WhatsApp e abra no Google com 1 clique.
          </p>

          {/* 4 Cards de Métricas no Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Total Salvos</span>
              <span className="text-2xl font-bold font-mono text-white block mt-0.5">{contagens.total}</span>
              <span className="text-[9px] text-purple-200/70 block">empresas no radar</span>
            </div>

            <div className="p-3 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">🔥 Quentes</span>
              <span className="text-2xl font-bold font-mono text-white block mt-0.5">{contagens.quentes}</span>
              <span className="text-[9px] text-purple-200/70 block">sem website</span>
            </div>

            <div className="p-3 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">E-mails Enviados</span>
              <span className="text-2xl font-bold font-mono text-white block mt-0.5">{contagens.enviados}</span>
              <span className="text-[9px] text-purple-200/70 block">abordagens ativas</span>
            </div>

            <div className="p-3 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Fechados</span>
              <span className="text-2xl font-bold font-mono text-white block mt-0.5">{contagens.clientes}</span>
              <span className="text-[9px] text-purple-200/70 block">clientes ativos</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ALERTA DE FEEDBACK ── */}
      {aviso && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in duration-200 ${
            aviso.tipo === "ok"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {aviso.tipo === "ok" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{aviso.msg}</span>
          </div>
          <button onClick={() => setAviso(null)} className="text-zinc-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ── BARRA DE CONTROLE: ABAS, BUSCA & AÇÕES EM LOTE ── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0c0a18] border border-purple-900/25 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Abas de Filtragem Rápida */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#140f28] border border-white/[0.06] text-xs">
            {[
              { id: "todos", label: "Todos", count: leads.length },
              { id: "contato", label: "Para Contato", count: leads.filter(l => l.status === "novo" || !l.status).length },
              { id: "enviados", label: "Enviados", count: contagens.enviados },
              { id: "negociacao", label: "Em Negociação", count: leads.filter(l => l.status === "negociacao" || l.status === "respondido").length },
              { id: "cliente", label: "Clientes", count: contagens.clientes },
              { id: "quentes", label: "🔥 Quentes", count: contagens.quentes },
              { id: "mornos", label: "💡 Mornos", count: contagens.mornos },
              { id: "frios", label: "❄️ Frios", count: contagens.frios },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAbaAtiva(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                  abaAtiva === tab.id
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/30 text-purple-200">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Botões de Ação Global */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Menu de Exclusão em Massa */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuRemoverAberto(!menuRemoverAberto)}
                disabled={leads.length === 0 || ocupado?.startsWith("bulk:delete")}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 shadow-sm"
                title="Opções de exclusão e limpeza da lista"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Limpar Leads</span>
                <ChevronDown className={`w-3 h-3 text-red-400 transition-transform ${menuRemoverAberto ? "rotate-180" : ""}`} />
              </button>

              {menuRemoverAberto && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuRemoverAberto(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0c0a18] border border-red-500/30 shadow-[0_15px_35px_rgba(0,0,0,0.85)] p-2 z-50 space-y-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold border-b border-white/[0.08]">
                      Limpar por Temperatura
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoverPorNivel("quente")}
                      disabled={contagens.quentes === 0}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-500/20 text-xs font-semibold text-red-300 flex items-center justify-between transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5 text-red-400" /> Remover Quentes
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 font-bold">
                        {contagens.quentes}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoverPorNivel("morno")}
                      disabled={contagens.mornos === 0}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-500/20 text-xs font-semibold text-amber-300 flex items-center justify-between transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Remover Mornos
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 font-bold">
                        {contagens.mornos}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoverPorNivel("frio")}
                      disabled={contagens.frios === 0}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-500/20 text-xs font-semibold text-blue-300 flex items-center justify-between transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-xs">❄️</span> Remover Frios
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 font-bold">
                        {contagens.frios}
                      </span>
                    </button>

                    <div className="border-t border-white/[0.08] pt-1.5 mt-1">
                      <button
                        type="button"
                        onClick={handleRemoverTodos}
                        disabled={leads.length === 0}
                        className="w-full text-left px-3 py-2 rounded-xl bg-red-600/30 hover:bg-red-600 text-xs font-bold text-red-100 hover:text-white flex items-center justify-between transition-colors disabled:opacity-30 cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Trash2 className="w-3.5 h-3.5" /> Remover Todos
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/50 text-white font-bold">
                          {leads.length}
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleDisparoEmLote}
              disabled={ocupado === "bulk:email"}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all"
              title="Disparar e-mail para todos os leads da lista com e-mail"
            >
              <Send className="w-3.5 h-3.5" />
              {ocupado === "bulk:email" ? "Disparando..." : "Disparo em Lote"}
            </button>

            <button
              onClick={() => setModalClienteOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-purple-400" /> Novo Lead
            </button>

            {/* Alternador Cards / Tabela */}
            <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-zinc-400">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-lg ${viewMode === "cards" ? "bg-purple-600 text-white" : "hover:text-white"}`}
                title="Visualização em Cards"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("tabela")}
                className={`p-1.5 rounded-lg ${viewMode === "tabela" ? "bg-purple-600 text-white" : "hover:text-white"}`}
                title="Visualização em Tabela"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Input de Busca em Tempo Real */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nome da empresa, cidade, nicho ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#120e24] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
          />
        </div>
      </div>

      {/* ── ESTADO CARREGANDO ── */}
      {carregando && (
        <div className="py-24 text-center flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-sm font-semibold text-white">Carregando carteira de leads salvos...</p>
        </div>
      )}

      {/* ── ESTADO VAZIO (SEM LEADS) ── */}
      {!carregando && leadsFiltrados.length === 0 && (
        <div className="p-12 rounded-3xl bg-[#0c0a18] border border-purple-900/25 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-lg font-bold text-white">Nenhum lead encontrado</h3>
            <p className="text-xs text-zinc-400">
              {busca
                ? "Nenhum resultado corresponde à sua pesquisa. Tente outros termos."
                : "Você ainda não salvou leads. Dispare o radar cartográfico para capturar empresas com déficit digital."}
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/app/mapa"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg"
            >
              <Compass className="w-4 h-4" /> Abrir Radar Cartográfico ↗
            </Link>
            <button
              onClick={() => setModalClienteOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs"
            >
              Cadastrar Manualmente
            </button>
          </div>
        </div>
      )}

      {/* ── VISUALIZAÇÃO EM CARDS (PADRÃO COM TODAS AS OPÇÕES) ── */}
      {!carregando && viewMode === "cards" && leadsFiltrados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {leadsFiltrados.map((lead) => {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              lead.nome + " " + (lead.endereco || lead.cidade || "")
            )}`;

            const isQuente = lead.nivel === "quente" || (!lead.website && (lead.score || 0) >= 80);
            const statusConfig = STATUS_OPCOES.find((s) => s.id === lead.status) || STATUS_OPCOES[0];

            return (
              <div
                key={lead.id}
                className="rounded-3xl bg-[#0c0a18] border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4 group"
              >
                {/* Topo do Card: Categoria, Nível e Menu de Status */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider truncate">
                      {lead.categoria || "Comércio Local"}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isQuente ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                          🔥 Quente
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                          💡 Morno
                        </span>
                      )}

                      {/* Dropdown de Estágio do Lead */}
                      <select
                        value={lead.status || "novo"}
                        onChange={(e) => atualizarLead(lead.id, { status: e.target.value as any })}
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border outline-none cursor-pointer ${statusConfig.color}`}
                      >
                        {STATUS_OPCOES.map((opt) => (
                          <option key={opt.id} value={opt.id} className="bg-[#0c0a18] text-white">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Nome da Empresa & Localização */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                      {lead.nome}
                    </h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span className="truncate">{lead.endereco || `${lead.cidade}, ${lead.pais || "Brasil"}`}</span>
                    </p>
                  </div>

                  {/* Dados de Contato & Presença Web */}
                  <div className="p-3 rounded-2xl bg-[#130f26] border border-white/5 space-y-2 text-xs">
                    {/* Telefone */}
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 font-mono text-[11px]">Telefone:</span>
                      {lead.telefone ? (
                        <span className="font-mono text-purple-200 font-bold">{lead.telefone}</span>
                      ) : (
                        <span className="text-zinc-600 text-[11px]">Não informado</span>
                      )}
                    </div>

                    {/* E-mail */}
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 font-mono text-[11px]">E-mail:</span>
                      {lead.email ? (
                        <span className="font-mono text-purple-200 truncate max-w-[170px]" title={lead.email}>
                          {lead.email}
                        </span>
                      ) : (
                        <span className="text-zinc-600 text-[11px]">Sem e-mail público</span>
                      )}
                    </div>

                    {/* Instagram */}
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 font-mono text-[11px]">Instagram:</span>
                      {lead.instagram ? (
                        <span className="font-mono text-pink-400 font-bold">@{lead.instagram.replace("@", "")}</span>
                      ) : (
                        <span className="text-zinc-600 text-[11px]">Sem perfil</span>
                      )}
                    </div>

                    {/* Website */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <span className="text-zinc-500 font-mono text-[11px]">Presença Web:</span>
                      {lead.website ? (
                        <a
                          href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-400 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          🌐 Ver Site
                        </a>
                      ) : (
                        <span className="text-amber-400 font-bold text-[11px]">⚡ Sem Website</span>
                      )}
                    </div>
                  </div>

                  {/* Textarea Expansível da Mensagem IA */}
                  {msgAberta[lead.id] && (
                    <div className="space-y-1.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                        <span>MENSAGEM DE ABORDAGEM IA:</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(msgAberta[lead.id]);
                            setCopiado((prev) => ({ ...prev, [lead.id]: true }));
                            setTimeout(() => setCopiado((prev) => ({ ...prev, [lead.id]: false })), 2000);
                          }}
                          className="text-purple-300 hover:text-white flex items-center gap-1"
                        >
                          {copiado[lead.id] ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiado[lead.id] ? "Copiado!" : "Copiar"}
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={msgAberta[lead.id]}
                        onChange={(e) => setMsgAberta((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                        className="w-full p-2.5 rounded-xl bg-black/60 border border-purple-500/30 text-xs text-white leading-relaxed focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  )}
                </div>

                {/* ── GRADE DE AÇÕES EM CADA LEAD (TODAS HABILITADAS) ── */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  {/* Linha 1 de Botões Principais */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Botão 1: Disparo de E-mail */}
                    <button
                      onClick={() => handleDispararEmail(lead)}
                      disabled={ocupado === lead.id + ":email" || !lead.email}
                      className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                        lead.email
                          ? "bg-purple-600 hover:bg-purple-500 text-white"
                          : "bg-white/5 text-zinc-500 cursor-not-allowed border border-white/5"
                      }`}
                      title={lead.email ? `Enviar e-mail para ${lead.email}` : "Sem e-mail cadastrado"}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {ocupado === lead.id + ":email" ? "Enviando..." : "Disparar E-mail"}
                    </button>

                    {/* Botão 2: Ver no Google / Maps */}
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      title="Abrir ficha e avaliações no Google Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                      Ver no Google
                    </a>
                  </div>

                  {/* Linha 2 de Botões de Redes e IA */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {/* Botão 3: Gerar DM Instagram */}
                    <button
                      onClick={() => handleGerarDM(lead)}
                      disabled={ocupado === lead.id + ":dm"}
                      className="py-2 px-2 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-300 font-bold flex items-center justify-center gap-1 transition-colors"
                      title="Gerar DM personalizada e abrir Instagram"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {ocupado === lead.id + ":dm" ? "Gerando..." : "Gerar DM"}
                    </button>

                    {/* Botão 4: WhatsApp */}
                    <button
                      onClick={() => handleAbrirWhatsApp(lead)}
                      disabled={!lead.telefone}
                      className={`py-2 px-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors ${
                        lead.telefone
                          ? "bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300"
                          : "bg-white/5 text-zinc-600 border border-transparent cursor-not-allowed"
                      }`}
                      title={lead.telefone ? "Iniciar conversa no WhatsApp com proposta" : "Sem telefone"}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      WhatsApp
                    </button>

                    {/* Botão 5: Enriquecer com IA (Deep Scan) */}
                    <button
                      onClick={() => handleEnriquecerLead(lead)}
                      disabled={ocupado === lead.id + ":enrich"}
                      className="py-2 px-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center gap-1 transition-colors"
                      title="Buscar e-mails e contatos públicos com IA"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {ocupado === lead.id + ":enrich" ? "Scan..." : "Enriquecer"}
                    </button>
                  </div>

                  {/* Linha 3 de Utilidades: Editor de Landing & Excluir */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <Link
                      href={`/app/editor/${lead.id}`}
                      className="text-purple-300 hover:text-purple-200 flex items-center gap-1 text-[11px] font-semibold"
                      title="Abrir gerador de landing page exclusivo para este cliente"
                    >
                      <Globe className="w-3.5 h-3.5" /> Editar Landing Page ↗
                    </Link>

                    <button
                      onClick={() => handleExcluirLead(lead.id, lead.nome)}
                      disabled={ocupado === lead.id + ":delete"}
                      className="text-zinc-500 hover:text-red-400 p-1.5 transition-colors"
                      title="Excluir da carteira"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── VISUALIZAÇÃO EM TABELA COMPACTA ── */}
      {!carregando && viewMode === "tabela" && leadsFiltrados.length > 0 && (
        <div className="rounded-3xl bg-[#0c0a18] border border-purple-900/25 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#120e24] text-[10px] font-mono text-zinc-400 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="p-4">Empresa / Cidade</th>
                  <th className="p-4">Contatos</th>
                  <th className="p-4">Presença</th>
                  <th className="p-4">Estágio</th>
                  <th className="p-4 text-right">Ações Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leadsFiltrados.map((lead) => {
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    lead.nome + " " + (lead.endereco || lead.cidade || "")
                  )}`;
                  const statusConfig = STATUS_OPCOES.find((s) => s.id === lead.status) || STATUS_OPCOES[0];

                  return (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-white block">{lead.nome}</span>
                        <span className="text-[11px] text-zinc-400">{lead.cidade} · {lead.categoria}</span>
                      </td>

                      <td className="p-4 space-y-0.5">
                        <span className="text-[11px] text-purple-200 block font-mono">{lead.telefone || "Sem telefone"}</span>
                        <span className="text-[11px] text-zinc-400 block font-mono truncate max-w-[180px]">{lead.email || "Sem e-mail"}</span>
                      </td>

                      <td className="p-4">
                        {lead.website ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                            Tem Site
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono font-bold">
                            Sem Site
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <select
                          value={lead.status || "novo"}
                          onChange={(e) => atualizarLead(lead.id, { status: e.target.value as any })}
                          className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer ${statusConfig.color}`}
                        >
                          {STATUS_OPCOES.map((opt) => (
                            <option key={opt.id} value={opt.id} className="bg-[#0c0a18] text-white">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDispararEmail(lead)}
                            disabled={!lead.email}
                            className="p-2 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 transition-colors"
                            title="Disparar E-mail"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                            title="Ver no Google"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleGerarDM(lead)}
                            className="p-2 rounded-lg bg-pink-500/20 hover:bg-pink-500/40 text-pink-300 transition-colors"
                            title="Gerar DM Instagram"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleAbrirWhatsApp(lead)}
                            disabled={!lead.telefone}
                            className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 transition-colors"
                            title="WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            href={`/app/editor/${lead.id}`}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 transition-colors"
                            title="Editar Landing Page"
                          >
                            <Globe className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleExcluirLead(lead.id, lead.nome)}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para Cadastro Manual */}
      <ModalRegistrarCliente
        isOpen={modalClienteOpen}
        onClose={() => setModalClienteOpen(false)}
        onSuccess={(novo) => {
          const item: SavedLead = {
            id: novo.id || Date.now().toString(),
            nome: novo.empresa || novo.nome,
            cidade: novo.cidade || "São Paulo",
            telefone: novo.telefone || null,
            email: novo.email || null,
            status: "novo",
            created_at: new Date().toISOString()
          };
          setLeads((prev) => [item, ...prev]);
        }}
      />
    </div>
  );
}
