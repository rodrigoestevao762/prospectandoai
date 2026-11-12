"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { CATEGORIAS } from "@/lib/categorias";
import {
  listarLeads,
  atualizarLead as storageAtualizarLead,
  excluirLead as storageExcluirLead,
  salvarLeads as storageSalvarLeads
} from "@/lib/leads-storage";

type Lead = {
  id: string;
  osmId?: string;
  nome: string;
  categoria: string;
  cidade: string;
  pais: string;
  telefone: string | null;
  website: string | null;
  instagram: string | null;
  email: string | null;
  facebook: string | null;
  fontes: string[];
  enriquecido_em: string | null;
  score: number;
  nivel: "quente" | "morno" | "frio";
  status: "novo" | "mensagem_gerada" | "enviado" | "respondido" | "cliente";
  canal: "email" | "dm" | null;
  notas: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  mensagem_gerada: "Msg gerada",
  enviado: "Enviado",
  respondido: "Respondido",
  cliente: "Cliente",
};

const NIVEL_ESTILO: Record<string, { borda: string; badge: string; icone: string }> = {
  quente: {
    borda: "border-l-[var(--alert)]",
    badge: "border-[var(--alert)]/50 bg-[var(--alert)]/10 text-[var(--alert)]",
    icone: "🔥",
  },
  morno: {
    borda: "border-l-[var(--amber)]",
    badge: "border-[var(--amber)]/50 bg-[var(--amber)]/10 text-[var(--amber)]",
    icone: "◐",
  },
  frio: {
    borda: "border-l-[var(--ink-faint)]",
    badge: "border-[var(--line-strong)] bg-white/5 text-[var(--ink-dim)]",
    icone: "○",
  },
};

const ABAS: { id: string; label: string; statuses: Lead["status"][] | null }[] = [
  { id: "contato", label: "Para contato", statuses: ["novo", "mensagem_gerada"] },
  { id: "enviado", label: "Enviados", statuses: ["enviado"] },
  { id: "respondido", label: "Respondidos", statuses: ["respondido"] },
  { id: "cliente", label: "Clientes", statuses: ["cliente"] },
  { id: "all", label: "Todos", statuses: null },
];

function getInstagramHandle(insta: string | null | undefined): string {
  if (!insta || typeof insta !== "string") return "";
  let clean = insta.trim().replace(/^@+/, "");
  clean = clean.replace(/\/+$/, "");
  const parts = clean.split("/");
  const last = parts[parts.length - 1] || clean;
  return last.replace(/^@+/, "").split("?")[0].trim();
}

function getPhoneDigits(phone: string | null | undefined): string {
  if (!phone || typeof phone !== "string") return "";
  return phone.replace(/\D/g, "");
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [fCat, setFCat] = useState("all");
  const [fNivel, setFNivel] = useState("all");
  const [aba, setAba] = useState("contato");
  const [busca, setBusca] = useState("");
  const [msgAberta, setMsgAberta] = useState<Record<string, string>>({});
  const [copiado, setCopiado] = useState<Record<string, boolean>>({});
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const handleCopiar = (id: string, texto: string) => {
    try {
      navigator.clipboard.writeText(texto);
      setCopiado((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiado((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    } catch {}
  };

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const data = await listarLeads();
      setLeads((data || []) as any);
    } catch (err) {
      console.error("Erro ao carregar leads:", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const visiveis = useMemo(() => {
    const abaAtual = ABAS.find((a) => a.id === aba) || ABAS[0];
    return leads.filter((l) => {
      if (!l) return false;
      const statusSeguro = l.status || "novo";
      if (abaAtual.statuses && !abaAtual.statuses.includes(statusSeguro)) return false;
      if (fCat !== "all" && l.categoria !== fCat) return false;
      if (fNivel !== "all" && l.nivel !== fNivel) return false;
      if (busca) {
        const termo = ((l.nome || "") + " " + (l.cidade || "") + " " + (l.pais || "")).toLowerCase();
        if (!termo.includes(busca.toLowerCase())) return false;
      }
      return true;
    });
  }, [leads, aba, fCat, fNivel, busca]);

  const contagemAba = useMemo(() => {
    const m: Record<string, number> = {};
    for (const a of ABAS) {
      m[a.id] = a.statuses ? leads.filter((l) => l && a.statuses!.includes(l.status || "novo")).length : leads.length;
    }
    return m;
  }, [leads]);

  async function atualizar(id: string, campos: Partial<Lead>) {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, ...campos } : l)));
    try {
      await storageAtualizarLead(id, campos as any);
    } catch {}
  }

  async function gerar(l: Lead, canal: "email" | "instagram" | "whatsapp" = "whatsapp") {
    setOcupado(l.id + ":gerar");
    setAviso(null);
    try {
      const res = await fetch("/api/gerar-mensagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: l.id, canal, leadData: l }),
      });
      const json = await res.json().catch(() => ({}));
      setOcupado(null);
      if (!res.ok) return setAviso("Erro ao gerar mensagem: " + (json.erro || "Falha na requisição"));
      if (json.texto) {
        setMsgAberta((m) => ({ ...m, [l.id]: json.texto }));
        if (l.status === "novo") atualizar(l.id, { status: "mensagem_gerada" });
      }
    } catch (err: any) {
      setOcupado(null);
      setAviso("Erro: " + (err.message || "Falha de rede"));
    }
  }

  async function enviarAuto(l: Lead) {
    let setts: any = null;
    try {
      const sb = supabaseBrowser();
      const res = await sb.from("settings").select("remetente_email, resend_api_key").maybeSingle();
      setts = res.data;
    } catch {}

    const currentSender = setts?.remetente_email || "default";
    const isPro = setts?.resend_api_key && (setts.resend_api_key.startsWith("re_") || setts.resend_api_key.startsWith("SG.") || setts.resend_api_key.startsWith("xkeysib-"));
    const limit = isPro ? 100000 : 450;

    const hoje = new Date().toLocaleDateString("pt-BR");
    const storageKey = "emails_sent_" + hoje + "_" + currentSender;
    let enviadosHoje = 0;
    try {
      enviadosHoje = parseInt(localStorage.getItem(storageKey) || "0", 10);
    } catch {}

    if (enviadosHoje >= limit) {
      return setAviso(`Limite atingido por hoje (${limit}). Troque a conta de e-mail nas configurações para enviar mais.`);
    }

    setOcupado(l.id + ":auto");
    setAviso(null);
    try {
      const res = await fetch("/api/enviar-automatico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: l.id, leadData: l }),
      });
      const json = await res.json().catch(() => ({}));
      setOcupado(null);
      if (!res.ok) return setAviso("Erro: " + (json.erro || "Falha no envio"));

      if (json.texto) setMsgAberta((m) => ({ ...m, [l.id]: json.texto }));
      await atualizar(l.id, { status: "enviado", canal: "email" });
      try {
        localStorage.setItem(storageKey, (enviadosHoje + 1).toString());
      } catch {}
      setAviso(`✓ e-mail enviado para ${l.email} — o lead saiu de "Para contato" e entrou em "Enviados"`);
    } catch (err: any) {
      setOcupado(null);
      setAviso("Erro de conexão no envio: " + (err.message || "Tente novamente"));
    }
  }

  async function abrirDM(l: Lead) {
    if (!l.instagram) return setAviso("Lead sem Instagram — cole o @ no campo e salve");
    const username = getInstagramHandle(l.instagram);
    if (!username) return setAviso("Instagram inválido.");

    const usernamesBloqueados = ["tripadvisor", "ifood", "ifoodbrasil", "ubereats", "rappi", "zomato", "facebook", "duckduckgo", "google", "qwantcom", "yahoo", "bing"];
    if (usernamesBloqueados.includes(username.toLowerCase())) {
      return setAviso(`Este Instagram (${username}) é um falso positivo de uma busca anterior.`);
    }

    if (!msgAberta[l.id]) {
      setOcupado(l.id + ":gerar");
      setAviso(null);
      try {
        const res = await fetch("/api/gerar-mensagem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadId: l.id, canal: "instagram", leadData: l }),
        });
        const json = await res.json().catch(() => ({}));
        setOcupado(null);
        if (res.ok && json.texto) {
          setMsgAberta((m) => ({ ...m, [l.id]: json.texto }));
          if (l.status === "novo") atualizar(l.id, { status: "mensagem_gerada" });
          try { navigator.clipboard.writeText(json.texto); } catch {}
        }
      } catch {
        setOcupado(null);
      }
    } else {
      try { navigator.clipboard.writeText(msgAberta[l.id]); } catch {}
    }

    window.open(`https://ig.me/m/${username}`, "_blank");
    atualizar(l.id, { status: "enviado", canal: "dm" });
  }

  async function abrirWhatsApp(l: Lead) {
    if (!l.telefone) return setAviso("Lead sem Telefone — edite e adicione o número.");
    const num = getPhoneDigits(l.telefone);
    if (!num) return setAviso("Telefone inválido.");

    let texto = msgAberta[l.id];
    if (!texto) {
      setOcupado(l.id + ":gerar");
      try {
        const res = await fetch("/api/gerar-mensagem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadId: l.id, canal: "whatsapp", leadData: l }),
        });
        const json = await res.json().catch(() => ({}));
        if (json.texto) {
          texto = json.texto;
          setMsgAberta((m) => ({ ...m, [l.id]: texto }));
        }
      } catch {}
      setOcupado(null);
    }

    if (texto) {
      try { navigator.clipboard.writeText(texto); } catch {}
    }
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(texto || "")}`, "_blank");
    atualizar(l.id, { status: "enviado", canal: "dm" });
  }

  async function enriquecerLead(l: Lead, bulk = false) {
    if (!bulk) { setOcupado(l.id + ":enriquecer"); setAviso(null); }
    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: l.id, nome: l.nome, cidade: l.cidade, pais: l.pais }),
      });
      const json = await res.json().catch(() => ({}));
      if (!bulk) setOcupado(null);
      if (!res.ok) {
        if (!bulk) setAviso("Erro no enriquecimento: " + (json.error || "Serviço ocupado"));
        return;
      }
      if (json && json.lead) {
        setLeads((ls) => ls.map((lead) => (lead.id === l.id ? { ...lead, ...json.lead } : lead)));
        await storageAtualizarLead(l.id, json.lead);
        if (!bulk) setAviso(`Enriquecimento de ${l.nome} concluído com sucesso!`);
      }
    } catch (err: any) {
      if (!bulk) {
        setOcupado(null);
        setAviso("Falha de rede no enriquecimento.");
      }
    }
  }

  async function enriquecerEmLote() {
    const semInsta = visiveis.filter((l) => !l.enriquecido_em);
    if (semInsta.length === 0) return setAviso("Nenhum lead visível precisa de enriquecimento.");
    if (!confirm(`Deseja acionar a IA para vasculhar a internet atrás dos contatos de ${semInsta.length} leads simultaneamente?`)) return;

    let sucessos = 0;
    const batchSize = 50;
    for (let i = 0; i < semInsta.length; i += batchSize) {
      const lote = semInsta.slice(i, i + batchSize);
      setAviso(`Enriquecendo lote... (${Math.min(i + batchSize, semInsta.length)}/${semInsta.length})`);

      await Promise.all(
        lote.map(async (l) => {
          setOcupado(l.id + ":enriquecer");
          await enriquecerLead(l, true);
        })
      );
      sucessos += lote.length;
    }

    setOcupado(null);
    setAviso(`Enriquecimento turbo concluído para ${sucessos} leads!`);
  }

  async function excluirLead(id: string) {
    setOcupado(id + ":excluir");
    try {
      await storageExcluirLead(id);
      const sb = supabaseBrowser();
      sb.from("leads").delete().eq("id", id).catch(() => {});
    } catch (e) {
      console.warn("Aviso ao excluir:", e);
    }
    setLeads((ls) => ls.filter((l) => l.id !== id));
    setOcupado(null);
  }

  async function limparSemRedes() {
    const paraExcluir = visiveis.filter((l) => !l.instagram);
    if (paraExcluir.length === 0) return setAviso("Nenhum lead sem Instagram encontrado.");
    if (!confirm(`Tem certeza que deseja excluir ${paraExcluir.length} leads sem Instagram?`)) return;

    setAviso(`Excluindo ${paraExcluir.length} leads...`);
    const ids = paraExcluir.map((l) => l.id);

    for (const id of ids) {
      await storageExcluirLead(id);
    }

    try {
      const sb = supabaseBrowser();
      for (let i = 0; i < ids.length; i += 50) {
        const lote = ids.slice(i, i + 50);
        sb.from("leads").delete().in("id", lote).catch(() => {});
      }
    } catch {}

    setLeads((ls) => ls.filter((l) => !ids.includes(l.id)));
    setAviso(`${paraExcluir.length} leads excluídos com sucesso.`);
  }

  async function gerarMensagensEmLote(canal: "instagram" | "whatsapp" | "email") {
    const paraGerar = visiveis.filter((l) => {
      if (msgAberta[l.id]) return false;
      if (canal === "instagram") return !!l.instagram;
      if (canal === "whatsapp") return !!l.telefone;
      if (canal === "email") return !!l.email;
      return false;
    });

    if (paraGerar.length === 0) return setAviso(`Nenhum lead com ${canal} disponível para gerar mensagens (ou já geradas).`);
    if (!confirm(`Deseja gerar mensagens persuasivas ultra-rápidas para ${paraGerar.length} leads simultaneamente?`)) return;

    let sucessos = 0;
    const batchSize = 30;
    for (let i = 0; i < paraGerar.length; i += batchSize) {
      const lote = paraGerar.slice(i, i + batchSize);
      setAviso(`Gerando mensagens instantâneas... (${Math.min(i + batchSize, paraGerar.length)}/${paraGerar.length})`);

      await Promise.all(
        lote.map(async (l) => {
          setOcupado(l.id + ":gerar");
          try {
            const res = await fetch("/api/gerar-mensagem", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ leadId: l.id, canal, leadData: l }),
            });
            const json = await res.json().catch(() => ({}));
            if (res.ok && json.texto) {
              setMsgAberta((m) => ({ ...m, [l.id]: json.texto }));
              await atualizar(l.id, { status: "mensagem_gerada" });
              sucessos++;
            }
          } catch {}
          setOcupado(null);
        })
      );
    }

    setOcupado(null);
    if (sucessos > 0) setAviso(`Geração turbo concluída! ${sucessos} mensagens criadas prontas para envio.`);
  }

  async function limparTodos() {
    if (visiveis.length === 0) return setAviso("Nenhum lead visível para excluir.");
    if (!confirm(`⚠️ ATENÇÃO: Você está prestes a EXCLUIR DEFINITIVAMENTE ${visiveis.length} leads da tela atual.\n\nTem certeza absoluta?`)) return;

    setAviso(`Excluindo ${visiveis.length} leads...`);
    const ids = visiveis.map((l) => l.id);

    for (const id of ids) {
      await storageExcluirLead(id);
    }

    try {
      const sb = supabaseBrowser();
      for (let i = 0; i < ids.length; i += 50) {
        const lote = ids.slice(i, i + 50);
        sb.from("leads").delete().in("id", lote).catch(() => {});
      }
    } catch {}

    setLeads((ls) => ls.filter((l) => !ids.includes(l.id)));
    setAviso(`${visiveis.length} leads excluídos com sucesso.`);
  }

  async function disparoEmLote() {
    let setts: any = null;
    try {
      const sb = supabaseBrowser();
      const res = await sb.from("settings").select("remetente_email, resend_api_key").maybeSingle();
      setts = res.data;
    } catch {}

    const currentSender = setts?.remetente_email || "default";
    const isPro = setts?.resend_api_key && (setts.resend_api_key.startsWith("re_") || setts.resend_api_key.startsWith("SG.") || setts.resend_api_key.startsWith("xkeysib-"));
    const limit = isPro ? 100000 : 450;

    const hoje = new Date().toLocaleDateString("pt-BR");
    const storageKey = "emails_sent_" + hoje + "_" + currentSender;
    let enviadosHoje = 0;
    try {
      enviadosHoje = parseInt(localStorage.getItem(storageKey) || "0", 10);
    } catch {}

    if (enviadosHoje >= limit) {
      return setAviso(`Limite atingido por hoje (${limit}). Troque a conta de e-mail nas configurações para enviar mais.`);
    }

    const paraEnviar = visiveis.filter(
      (l) => l.email && !l.email.includes("duckduckgo.com") && ["novo", "mensagem_gerada"].includes(l.status || "novo")
    );

    if (paraEnviar.length === 0) return setAviso("Nenhum lead com e-mail válido disponível para envio.");

    const qtdPermitida = limit - enviadosHoje;
    const loteLimitado = paraEnviar.slice(0, qtdPermitida);

    if (!confirm(`Você já enviou ${enviadosHoje} e-mails hoje. Deseja disparar e-mails para mais ${loteLimitado.length} leads simultaneamente?`)) return;

    let sucessos = 0;
    let ultErro = "";
    const BATCH_SIZE = 40;
    let pending = [...loteLimitado];

    while (pending.length > 0) {
      const batch = pending.slice(0, BATCH_SIZE);
      const loteIds = batch.map((l) => l.id);

      setAviso(`Disparando ${sucessos} de ${loteLimitado.length}... (Enviando lote atual de ${loteIds.length})`);
      setOcupado("enviando_lote");

      try {
        const res = await fetch("/api/enviar-lote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadIds: loteIds, leads: batch }),
        });
        const json = await res.json().catch(() => ({}));

        if (res.ok && json.resultados) {
          let sucessosLote = 0;
          json.resultados.forEach((r: any) => {
            if (r.ok) {
              sucessosLote++;
              pending = pending.filter((p) => p.id !== r.id);
              setLeads((ls) => ls.map((lead) => (lead.id === r.id ? { ...lead, status: "enviado", canal: "email" } : lead)));
              storageAtualizarLead(r.id, { status: "enviado", canal: "email" });
            } else {
              pending = pending.filter((p) => p.id !== r.id);
              ultErro = r.erro || "Falha ao enviar";
            }
          });
          sucessos += sucessosLote;
          try {
            localStorage.setItem(storageKey, (enviadosHoje + sucessos).toString());
          } catch {}
        } else {
          ultErro = json.erro || "Erro no envio";
          break;
        }
      } catch (err: any) {
        ultErro = err.message || "Erro de conexão";
        break;
      }
    }

    setOcupado(null);
    if (sucessos > 0) {
      setAviso(`Processamento turbo concluído! ${sucessos} e-mails disparados com sucesso.`);
    } else {
      setAviso(ultErro ? `Falha no disparo: ${ultErro}` : `Nenhum e-mail pôde ser disparado.`);
    }
  }

  const contagem = {
    quente: visiveis.filter((l) => l.nivel === "quente").length,
    morno: visiveis.filter((l) => l.nivel === "morno").length,
    frio: visiveis.filter((l) => l.nivel === "frio").length,
  };

  const NIVEL_ACCENT: Record<string, string> = {
    quente: "#ff5d5d",
    morno: "#ffb02d",
    frio: "#55685f",
  };

  return (
    <div className="space-y-6">
      {/* Header + métricas */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="eyebrow flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--signal)] animate-pulse" />
            Radar de Alvos & Conversão
          </p>
          <h1 className="headline mt-2 text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--signal)]">
            Alvos Qualificados
          </h1>
          <p className="text-sm text-[var(--ink-dim)] mt-1">
            {leads.length} leads salvos permanentemente · {visiveis.length} visíveis nesta visão
          </p>
        </div>

        {/* Botões de Ações Globais */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => gerarMensagensEmLote("whatsapp")}
            disabled={!!ocupado || visiveis.length === 0}
            className="btn-3d btn-3d-ghost text-xs px-3 py-2 flex items-center gap-1.5"
            style={{ color: "#25D366", borderColor: "rgba(37,211,102,0.3)" }}
          >
            ⚡ Gerar WPP em Lote
          </button>
          <button
            onClick={() => gerarMensagensEmLote("instagram")}
            disabled={!!ocupado || visiveis.length === 0}
            className="btn-3d btn-3d-ghost text-xs px-3 py-2 flex items-center gap-1.5"
            style={{ color: "#e879f9", borderColor: "rgba(232,121,249,0.3)" }}
          >
            ⚡ Gerar DMs em Lote
          </button>
          <button
            onClick={disparoEmLote}
            disabled={!!ocupado || visiveis.length === 0}
            className="btn-3d btn-3d-primary text-xs px-3 py-2 flex items-center gap-1.5"
          >
            🚀 Disparo em Lote
          </button>
          <button
            onClick={enriquecerEmLote}
            disabled={!!ocupado || visiveis.length === 0}
            className="btn-3d btn-3d-ghost text-xs px-3 py-2"
          >
            🔍 Enriquecer Lote
          </button>
          <button
            onClick={limparSemRedes}
            disabled={!!ocupado || visiveis.length === 0}
            className="btn-3d btn-3d-ghost text-xs px-2.5 py-2 text-red-400 hover:text-red-300 border-red-500/20"
            title="Excluir leads sem Instagram"
          >
            Limpar s/ Insta
          </button>
          <button
            onClick={limparTodos}
            disabled={!!ocupado || visiveis.length === 0}
            className="btn-3d btn-3d-ghost text-xs px-2.5 py-2 text-red-500 hover:text-red-400 border-red-500/30"
            title="Limpar todos os leads visíveis"
          >
            Excluir Todos
          </button>
        </div>
      </motion.div>

      {/* Alerta / Notificação */}
      <AnimatePresence>
        {aviso && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-xl bg-black/80 border border-[var(--signal)]/40 text-white text-xs flex items-center justify-between shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <span className="text-[var(--signal)]">●</span>
              <span>{aviso}</span>
            </div>
            <button onClick={() => setAviso(null)} className="text-white/50 hover:text-white ml-4 font-bold">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Abas de Status */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {ABAS.map((a) => (
          <button
            key={a.id}
            onClick={() => setAba(a.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              aba === a.id
                ? "bg-[var(--signal)] text-black shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                : "bg-white/5 text-[var(--ink-dim)] hover:bg-white/10 hover:text-white"
            }`}
          >
            {a.label}
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                aba === a.id ? "bg-black/30 text-black" : "bg-white/10 text-white/70"
              }`}
            >
              {contagemAba[a.id] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Filtrar por nome, cidade ou país..."
            className="field w-full rounded-xl px-4 py-2.5 text-xs bg-black/40 border-white/10 text-white placeholder-white/30 outline-none focus:border-[var(--signal)]"
          />
          {busca && (
            <button
              onClick={() => setBusca("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={fNivel}
          onChange={(e) => setFNivel(e.target.value)}
          className="field rounded-xl px-3 py-2 text-xs bg-black/40 border-white/10 text-white outline-none"
        >
          <option value="all">Todos os Níveis ({visiveis.length})</option>
          <option value="quente">🔥 Quentes ({contagem.quente})</option>
          <option value="morno">◐ Mornos ({contagem.morno})</option>
          <option value="frio">○ Frios ({contagem.frio})</option>
        </select>

        <select
          value={fCat}
          onChange={(e) => setFCat(e.target.value)}
          className="field rounded-xl px-3 py-2 text-xs bg-black/40 border-white/10 text-white outline-none max-w-[200px]"
        >
          <option value="all">Todas Categorias</option>
          {CATEGORIAS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Carregando ou Vazio */}
      {carregando && (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-2 border-[var(--signal)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-[var(--ink-dim)]">Carregando base de alvos...</p>
        </div>
      )}

      {!carregando && visiveis.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card py-16 text-center border-dashed border-white/10"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-[var(--signal)]">
            🎯
          </div>
          <p className="mono text-xs uppercase tracking-widest text-[var(--ink-faint)]">
            Nenhum lead encontrado com estes filtros
          </p>
          <a href="/app/busca" className="btn-3d btn-3d-ghost mt-6 inline-flex text-xs px-4 py-2.5">
            ▸ Fazer Nova Busca no Radar OSINT
          </a>
        </motion.div>
      )}

      {/* Lead Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {visiveis.map((l) => {
          const nivelSeguro: "quente" | "morno" | "frio" =
            l.nivel === "quente" || l.nivel === "morno" || l.nivel === "frio" ? l.nivel : "morno";
          const est = NIVEL_ESTILO[nivelSeguro] || NIVEL_ESTILO.frio;
          const accent = NIVEL_ACCENT[nivelSeguro] || "#9aa5b1";
          const statusSeguro = l.status || "novo";
          const instaUser = getInstagramHandle(l.instagram);
          const phoneDigits = getPhoneDigits(l.telefone);

          return (
            <div
              key={l.id}
              className="relative rounded-2xl overflow-hidden group flex flex-col justify-end shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgb(0,0,0,0.6)] hover:border-white/20 min-h-[380px]"
              style={{ "--lead-accent": accent } as React.CSSProperties}
            >
              {/* Fundo Escuro */}
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-[var(--lead-accent)]/20 via-[#05080c] to-[#0a0f18]" />

              {/* Distintivo Superior Direito */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => {
                      if (confirm("Excluir permanentemente este lead?")) excluirLead(l.id);
                    }}
                    disabled={!!ocupado}
                    className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white/50 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-colors shadow-lg cursor-pointer"
                    title="Excluir Lead"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                  <span className={`badge ${est.badge} shadow-lg backdrop-blur-md bg-black/40`}>
                    {est.icone} {nivelSeguro}
                  </span>
                </div>
                <select
                  value={statusSeguro}
                  onChange={(e) => atualizar(l.id, { status: e.target.value as Lead["status"] })}
                  className="field rounded-lg px-2 py-1.5 text-[9px] uppercase font-bold tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-lg cursor-pointer hover:border-white/40 transition-colors outline-none"
                >
                  {Object.entries(STATUS_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              {/* Badge de Categoria Flutuante (Superior Esquerdo) */}
              <div className="absolute top-4 left-4 z-20 max-w-[50%]">
                <span className="badge border-[var(--line-strong)] text-[var(--ink-dim)] bg-black/40 backdrop-blur-md shadow-lg truncate block">
                  {CATEGORIAS.find((c) => c.id === l.categoria)?.label || l.categoria || "Geral"}
                </span>
              </div>

              {/* Conteúdo do Card */}
              <div className="relative z-10 p-5 flex flex-col gap-3 mt-auto w-full">
                {/* Título e Localização */}
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white drop-shadow-md mb-1 line-clamp-2">
                    {l.nome || "Empresa"}
                  </h2>
                  <p className="mono text-[10px] uppercase tracking-widest text-[var(--ink-faint)] flex items-center gap-1.5 drop-shadow truncate">
                    <span className="text-[var(--signal)]">📍</span> {l.cidade || "Região"}{l.pais ? `, ${l.pais}` : ""}
                  </p>
                </div>

                {/* Contatos Minimalistas */}
                <div className="mono flex flex-col gap-2 text-xs bg-black/40 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shadow-inner">
                  {l.email && !l.email.includes("duckduckgo.com") ? (
                    <div className="flex items-center gap-2 w-full">
                      <span style={{ color: "var(--signal)" }}>✉</span>
                      <input
                        defaultValue={l.email}
                        className="w-full bg-transparent outline-none transition focus:border-b focus:border-[var(--signal)] placeholder-white/30 text-white truncate"
                        onBlur={(e) => e.target.value !== l.email && atualizar(l.id, { email: e.target.value })}
                      />
                    </div>
                  ) : (
                    <span className="text-[var(--ink-faint)] w-full text-[10px] flex items-center gap-2">
                      ✉ <span className="opacity-50">sem e-mail</span>
                    </span>
                  )}

                  <div className="flex items-center justify-between w-full text-[10px] mt-1 pt-2 border-t border-white/5">
                    {instaUser ? (
                      <span style={{ color: "#e879f9" }} className="truncate max-w-[50%]">
                        📸 @{instaUser}
                      </span>
                    ) : (
                      <span className="text-[var(--ink-faint)] opacity-50">📸 s/ Insta</span>
                    )}
                    {l.website ? (
                      <span className="text-[var(--ink-faint)]">🌐 c/ site</span>
                    ) : (
                      <span className="text-[var(--ink-faint)] opacity-50">🌐 s/ site</span>
                    )}
                  </div>
                </div>

                {/* Área de Textarea Dinâmica */}
                <AnimatePresence>
                  {msgAberta[l.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: "hidden" }}
                    >
                      <textarea
                        value={msgAberta[l.id]}
                        onChange={(e) => setMsgAberta((m) => ({ ...m, [l.id]: e.target.value }))}
                        rows={3}
                        placeholder="Edite a mensagem antes de enviar..."
                        className="field w-full mt-2 rounded-xl p-3 text-sm leading-relaxed bg-black/60 backdrop-blur-xl text-white border-white/20 shadow-lg outline-none focus:border-[var(--signal)]"
                      />
                      <div className="flex gap-2 mt-2 w-full">
                        {phoneDigits && (
                          <a
                            href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(msgAberta[l.id] || "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => atualizar(l.id, { status: "enviado" })}
                            className="flex-1 py-2 px-2 text-[10px] uppercase font-bold tracking-wider rounded-lg flex items-center justify-center gap-1 bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] transition hover:bg-[#25D366]/40"
                          >
                            ABRIR WPP
                          </a>
                        )}
                        {instaUser && (
                          <a
                            href={`https://ig.me/m/${instaUser}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              try { navigator.clipboard.writeText(msgAberta[l.id]); } catch {}
                              setAviso("Mensagem copiada para colar no Direct!");
                              setTimeout(() => setAviso(null), 3500);
                              atualizar(l.id, { status: "enviado" });
                            }}
                            className="flex-1 py-2 px-2 text-[10px] uppercase font-bold tracking-wider rounded-lg flex items-center justify-center gap-1 bg-[#e879f9]/20 border border-[#e879f9]/50 text-[#e879f9] transition hover:bg-[#e879f9]/40"
                          >
                            ABRIR INSTA (DM)
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Botões de Ação na Base */}
                <div className="flex flex-wrap gap-2 items-center mt-1">
                  {l.email && statusSeguro !== "enviado" && statusSeguro !== "respondido" && statusSeguro !== "cliente" && (
                    <button
                      onClick={() => enviarAuto(l)}
                      disabled={!!ocupado}
                      className="btn-3d btn-3d-primary flex-1 py-2 px-2 text-[10px] shadow-lg"
                    >
                      {ocupado === l.id + ":auto" ? "enviando..." : "✉ E-mail"}
                    </button>
                  )}
                  {statusSeguro === "enviado" && (
                    <span className="flex-1 text-center rounded-lg bg-[var(--signal)]/10 px-2 py-2 text-[10px] uppercase tracking-widest text-[var(--signal)] border border-[var(--signal)]/20 shadow-inner">
                      ✓ Enviado
                    </span>
                  )}
                  <button
                    onClick={() => enriquecerLead(l)}
                    disabled={!!ocupado}
                    className="btn-3d btn-3d-ghost flex-1 py-2 px-2 text-[10px] shadow-lg"
                    style={{ color: "#e879f9", borderColor: "rgba(232,121,249,0.3)" }}
                  >
                    {ocupado === l.id + ":enriquecer" ? "buscando..." : "Enriquecer"}
                  </button>
                </div>

                {/* Action Row Secundária (Redes) */}
                <div className="flex gap-2 w-full flex-wrap">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((l.nome || "") + " " + (l.cidade || ""))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[30%] py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition flex justify-center items-center gap-1.5 shadow-lg"
                    style={{ background: "var(--signal)", color: "#000", boxShadow: "0 4px 0 rgba(0,0,0,0.5), 0 8px 24px rgba(56,189,248,0.4)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    MAPS
                  </a>
                  <button
                    onClick={() => gerar(l, "whatsapp")}
                    disabled={!!ocupado}
                    className="flex-1 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[10px] uppercase tracking-widest text-[#25D366] font-bold rounded-lg transition flex justify-center items-center gap-1.5 shadow-lg"
                  >
                    WPP
                  </button>
                  <button
                    onClick={() => gerar(l, "instagram")}
                    disabled={!!ocupado}
                    className="flex-1 py-2 bg-[#e879f9]/10 hover:bg-[#e879f9]/20 border border-[#e879f9]/30 text-[10px] uppercase tracking-widest text-[#e879f9] font-bold rounded-lg transition flex justify-center items-center gap-1.5 shadow-lg"
                  >
                    INSTA
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
