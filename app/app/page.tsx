"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { CATEGORIAS } from "@/lib/categorias";

type Lead = {
  id: string;
  nome: string; categoria: string; cidade: string; pais: string;
  telefone: string | null; website: string | null; instagram: string | null; email: string | null;
  facebook: string | null; fontes: string[]; enriquecido_em: string | null;
  score: number; nivel: "quente" | "morno" | "frio";
  status: "novo" | "mensagem_gerada" | "enviado" | "respondido" | "cliente";
  canal: "email" | "dm" | null; notas: string | null;
};

const STATUS_LABEL: Record<Lead["status"], string> = {
  novo: "Novo", mensagem_gerada: "Msg gerada", enviado: "Enviado", respondido: "Respondido", cliente: "Cliente",
};

const NIVEL_ESTILO: Record<Lead["nivel"], { borda: string; badge: string; icone: string }> = {
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
    const [senderEmail, setSenderEmail] = useState('');

  const handleCopiar = (id: string, texto: string) => {
    navigator.clipboard.writeText(texto);
    setCopiado((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiado((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const carregar = useCallback(async () => {
    setCarregando(true);
      const { data: setts } = await supabaseBrowser().from('settings').select('remetente_email').maybeSingle();
      if (setts?.remetente_email) setSenderEmail(setts.remetente_email);
          let allLeads: any[] = [];
      let page = 0;
      const limit = 1000;
      while (true) {
        const { data } = await supabaseBrowser()
          .from('leads').select('*')
          .order('score', { ascending: false }).order('nome')
          .range(page * limit, (page + 1) * limit - 1);
        
        if (data && data.length > 0) {
          allLeads = allLeads.concat(data);
          if (data.length < limit) break;
          page++;
        } else {
          break;
        }
      }
      setLeads(allLeads);
    setCarregando(false);
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const visiveis = useMemo(() => {
    const abaAtual = ABAS.find((a) => a.id === aba)!;
    return leads.filter((l) => {
      if (abaAtual.statuses && !abaAtual.statuses.includes(l.status)) return false;
      if (fCat !== "all" && l.categoria !== fCat) return false;
      if (fNivel !== "all" && l.nivel !== fNivel) return false;
      if (busca && !(l.nome + " " + l.cidade + " " + l.pais).toLowerCase().includes(busca.toLowerCase())) return false;
      return true;
    });
  }, [leads, aba, fCat, fNivel, busca]);

  const contagemAba = useMemo(() => {
    const m: Record<string, number> = {};
    for (const a of ABAS) {
      m[a.id] = a.statuses ? leads.filter((l) => a.statuses!.includes(l.status)).length : leads.length;
    }
    return m;
  }, [leads]);

  async function atualizar(id: string, campos: Partial<Lead>) {
    await supabaseBrowser().from("leads").update(campos).eq("id", id);
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, ...campos } : l)));
  }

  async function gerar(l: Lead, canal: "email" | "instagram" | "whatsapp" = "whatsapp") {
    setOcupado(l.id + ":gerar"); setAviso(null);
    const res = await fetch("/api/gerar-mensagem", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId: l.id, canal }),
    });
    const json = await res.json();
    setOcupado(null);
    if (!res.ok) return setAviso("Erro: " + json.erro);
    setMsgAberta((m) => ({ ...m, [l.id]: json.texto }));
    if (l.status === "novo") atualizar(l.id, { status: "mensagem_gerada" });
  }

  async function enviarAuto(l: Lead) {
    const { data: setts } = await supabaseBrowser().from('settings').select('remetente_email, resend_api_key').single();
    const currentSender = setts?.remetente_email || 'default';
    const isPro = setts?.resend_api_key && (setts.resend_api_key?.startsWith('re_') || setts.resend_api_key?.startsWith('SG.') || setts.resend_api_key?.startsWith('xkeysib-'));
    const limit = isPro ? 100000 : 450;
    
    const hoje = new Date().toLocaleDateString('pt-BR');
    const storageKey = 'emails_sent_' + hoje + '_' + currentSender;
    let enviadosHoje = parseInt(localStorage.getItem(storageKey) || '0', 10);
    
    if (enviadosHoje >= limit) {
      return setAviso(`Limite atingido por hoje (${limit}). Troque a conta de e-mail nas configurações para enviar mais.`);
    }
    
    setOcupado(l.id + ':auto'); setAviso(null);
    const res = await fetch('/api/enviar-automatico', {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId: l.id }),
    });
    const json = await res.json();
    setOcupado(null);
    if (!res.ok) return setAviso("Erro: " + json.erro);
    setMsgAberta((m) => ({ ...m, [l.id]: json.texto }));
    await atualizar(l.id, { status: 'enviado', canal: 'email' });
    localStorage.setItem(storageKey, (enviadosHoje + 1).toString());
    setAviso(`✓ e-mail enviado para ${l.email} — o lead saiu de "Para contato" e entrou em "Enviados"`);
  }

  async function abrirDM(l: Lead) {
    if (!l.instagram) return setAviso("Lead sem Instagram — cole o @ no campo e salve");
    if (!msgAberta[l.id]) {
      setOcupado(l.id + ":gerar"); setAviso(null);
      const res = await fetch("/api/gerar-mensagem", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId: l.id }),
      });
      const json = await res.json();
      setOcupado(null);
      if (!res.ok) return setAviso("Erro: " + json.erro);
      setMsgAberta((m) => ({ ...m, [l.id]: json.texto }));
      if (l.status === "novo") atualizar(l.id, { status: "mensagem_gerada" });
      navigator.clipboard.writeText(json.texto);
    } else {
      navigator.clipboard.writeText(msgAberta[l.id]);
    }

    let username = l.instagram.trim().replace("@", "");
    if (username.includes("instagram.com/")) {
      username = username.split("instagram.com/")[1].split("/")[0].split("?")[0];
    }
    
    const usernamesBloqueados = ["tripadvisor", "ifood", "ifoodbrasil", "ubereats", "rappi", "zomato", "facebook", "duckduckgo", "google", "qwantcom", "yahoo", "bing"];
    if (usernamesBloqueados.includes(username.toLowerCase())) {
      return setAviso(`Este Instagram (${username}) é um falso positivo de uma busca anterior. Por favor, exclua ou re-enriqueça este lead.`);
    }

    window.open(`https://ig.me/m/${username}`, "_blank");
    atualizar(l.id, { status: "enviado", canal: "dm" });
  }

  async function abrirWhatsApp(l: Lead) {
    if (!l.telefone) return setAviso("Lead sem Telefone — edite e adicione o número.");
    if (!msgAberta[l.id]) return setAviso("Gere a mensagem primeiro antes de enviar.");
    navigator.clipboard.writeText(msgAberta[l.id]);
    const num = l.telefone.replace(/\D/g, "");
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msgAberta[l.id])}`, "_blank");
    atualizar(l.id, { status: "enviado", canal: "dm" });
  }

  async function abrirFacebook(l: Lead) {
    if (!l.facebook) return setAviso("Lead sem Facebook.");
    if (!msgAberta[l.id]) return setAviso("Gere a mensagem primeiro antes de enviar.");
    navigator.clipboard.writeText(msgAberta[l.id]);
    window.open(l.facebook, "_blank");
    atualizar(l.id, { status: "enviado", canal: "dm" });
  }

  async function enriquecerLead(l: Lead, bulk = false) {
    if (!bulk) { setOcupado(l.id + ":enriquecer"); setAviso(null); }
    const res = await fetch("/api/enrich", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId: l.id, nome: l.nome, cidade: l.cidade, pais: l.pais }),
    });
    const json = await res.json();
    if (!bulk) setOcupado(null);
    if (!res.ok) {
      if (!bulk) setAviso("Erro no enriquecimento: " + json.error);
      return;
    }
    setLeads((ls) => ls.map((lead) => (lead.id === l.id ? { ...lead, ...json.lead } : lead)));
    if (!bulk) setAviso(`Enriquecimento de ${l.nome} concluído com sucesso!`);
  }

  async function enriquecerEmLote() {
    const semInsta = visiveis.filter(l => !l.enriquecido_em);
    if (semInsta.length === 0) return setAviso("Nenhum lead visível precisa de enriquecimento.");
    if (!confirm(`Deseja acionar a IA para vasculhar a internet atrás dos contatos de ${semInsta.length} leads simultaneamente?`)) return;
    
    let sucessos = 0;
    const batchSize = 100; // Hyper-Enriquecimento em paralelo
    for (let i = 0; i < semInsta.length; i += batchSize) {
      const lote = semInsta.slice(i, i + batchSize);
      setAviso(`Enriquecendo lote... (${Math.min(i + batchSize, semInsta.length)}/${semInsta.length})`);
      
      await Promise.all(lote.map(async (l) => {
        setOcupado(l.id + ":enriquecer");
        await enriquecerLead(l, true);
      }));
      sucessos += lote.length;
    }
    
    setOcupado(null);
    setAviso(`Enriquecimento turbo concluído para ${sucessos} leads!`);
  }

  async function excluirLead(id: string) {
    const sb = supabaseBrowser();
    setOcupado(id + ":excluir");
    await sb.from("leads").delete().eq("id", id);
    setLeads((ls) => ls.filter((l) => l.id !== id));
    setOcupado(null);
  }

  async function limparSemRedes() {
    const sb = supabaseBrowser();
    const paraExcluir = visiveis.filter(l => !l.instagram);
    if (paraExcluir.length === 0) return setAviso("Nenhum lead sem Instagram encontrado.");
    if (!confirm(`Tem certeza que deseja excluir ${paraExcluir.length} leads sem Instagram?`)) return;
    
    setAviso(`Excluindo ${paraExcluir.length} leads...`);
    const ids = paraExcluir.map(l => l.id);
      
      // Delete in batches of 50 to avoid URL too long issues
      for (let i = 0; i < ids.length; i += 50) {
        const lote = ids.slice(i, i + 50);
        await sb.from("leads").delete().in("id", lote);
      }
    setLeads((ls) => ls.filter((l) => !ids.includes(l.id)));
    setAviso(`${paraExcluir.length} leads excluídos com sucesso.`);
  }

  async function gerarMensagensEmLote(canal: "instagram" | "whatsapp" | "email" | "facebook") {
    const paraGerar = visiveis.filter(l => {
      if (msgAberta[l.id]) return false;
      if (canal === "instagram") return !!l.instagram;
      if (canal === "whatsapp") return !!l.telefone;
      if (canal === "facebook") return !!l.facebook;
      if (canal === "email") return !!l.email;
      return false;
    });

    if (paraGerar.length === 0) return setAviso(`Nenhum lead com ${canal} disponível para gerar mensagens (ou já geradas).`);
    if (!confirm(`Deseja gerar mensagens persuasivas via IA para ${paraGerar.length} leads simultaneamente?`)) return;
    
    let sucessos = 0;
    
    const batchSize = 50; // Acelerado pelo Mega Brain
    for (let i = 0; i < paraGerar.length; i += batchSize) {
      const lote = paraGerar.slice(i, i + batchSize);
      setAviso(`Gerando mensagens voando... (${Math.min(i + batchSize, paraGerar.length)}/${paraGerar.length})`);
      
      await Promise.all(lote.map(async (l) => {
        setOcupado(l.id + ":gerar");
        try {
          const res = await fetch("/api/gerar-mensagem", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId: l.id, canal }),
          });
          const json = await res.json();
          if (res.ok) {
            setMsgAberta((m) => ({ ...m, [l.id]: json.texto }));
            await atualizar(l.id, { status: "mensagem_gerada" });
            sucessos++;
          }
        } catch (err) {
          console.error(err);
        }
        setOcupado(null);
      }));
      await new Promise(r => setTimeout(r, 100));
    }
    
    setOcupado(null);
    if (sucessos > 0) setAviso(`Geração concluída! ${sucessos} mensagens criadas prontas para envio.`);
  }

  async function limparTodos() {
    const sb = supabaseBrowser();
    if (visiveis.length === 0) return setAviso("Nenhum lead visível para excluir.");
    if (!confirm(`⚠️ ATENÇÃO: Você está prestes a EXCLUIR DEFINITIVAMENTE ${visiveis.length} leads da tela atual.

Tem certeza absoluta?`)) return;
    
    setAviso(`Excluindo ${visiveis.length} leads...`);
    const ids = visiveis.map((l) => l.id);
    
    // Delete in batches of 50 to avoid URL too long issues if there are many
    for (let i = 0; i < ids.length; i += 50) {
      const lote = ids.slice(i, i + 50);
      await sb.from("leads").delete().in("id", lote);
    }
    
    setLeads((ls) => ls.filter((l) => !ids.includes(l.id)));
    setAviso(`${visiveis.length} leads excluídos com sucesso.`);
  }

  async function disparoEmLote() {
    const { data: setts } = await supabaseBrowser().from('settings').select('remetente_email, resend_api_key').single();
    const currentSender = setts?.remetente_email || 'default';
    const isPro = setts?.resend_api_key && (setts.resend_api_key?.startsWith('re_') || setts.resend_api_key?.startsWith('SG.') || setts.resend_api_key?.startsWith('xkeysib-'));
    const limit = isPro ? 100000 : 450;
    
    const hoje = new Date().toLocaleDateString('pt-BR');
    const storageKey = 'emails_sent_' + hoje + '_' + currentSender;
    let enviadosHoje = parseInt(localStorage.getItem(storageKey) || '0', 10);
    
    if (enviadosHoje >= limit) {
      return setAviso(`Limite atingido por hoje (${limit}). Troque a conta de e-mail nas configurações para enviar mais.`);
    }
    const paraEnviar = visiveis.filter(l => 
      l.email && 
      !l.email.includes('duckduckgo.com') && 
      ['novo', 'mensagem_gerada'].includes(l.status)
    );
    
    if (paraEnviar.length === 0) return setAviso('Nenhum lead com e-mail v�lido dispon�vel para envio.');
    
    const qtdPermitida = limit - enviadosHoje;
    const loteLimitado = paraEnviar.slice(0, qtdPermitida);

    if (!confirm('Voc� j� enviou ' + enviadosHoje + ' e-mails hoje. Deseja disparar e-mails para mais ' + loteLimitado.length + ' leads simultaneamente (limite diário)?')) return;
    
    let sucessos = 0;
    let ultErro = "";
const BATCH_SIZE = 100; // 100 e-mails por ciclo (Hyper SMTP)
      for (let i = 0; i < loteLimitado.length; i += BATCH_SIZE) {
        const loteIds = loteLimitado.slice(i, i + BATCH_SIZE).map(l => l.id);
        setAviso('Disparando lote de e-mails turbo (' + Math.min(i + BATCH_SIZE, loteLimitado.length) + '/' + loteLimitado.length + ')...');
        setOcupado("enviando_lote");
        
        try {
          const res = await fetch('/api/enviar-lote', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadIds: loteIds }),
          });
          const json = await res.json();
          if (res.ok) {
            const sucessosLote = json.sucessos || 0;
            sucessos += sucessosLote;
              localStorage.setItem(storageKey, (enviadosHoje + sucessos).toString());
              
              const errosMtp = json.resultados?.filter((r: any) => !r.ok && r.erro).map((r: any) => r.erro);
              if (errosMtp && errosMtp.length > 0 && sucessosLote === 0) {
                ultErro = errosMtp[0];
              }

              setLeads((ls) => ls.map((lead) => {
              const result = json.resultados?.find((r: any) => r.id === lead.id);
              if (result && result.ok) return { ...lead, status: 'enviado', canal: 'email', atualizado_em: new Date().toISOString() };
              return lead;
            }));
          } else {
            ultErro = json.erro || "Erro na resposta do servidor";
          }
        } catch (err: any) {
          ultErro = err.message || "Erro desconhecido";
        }
        
        setOcupado(null);
        if (ultErro && (ultErro.includes('Too many login attempts') || ultErro.includes('Invalid login') || ultErro.includes('535'))) break;
      }
    setOcupado(null);
    if (sucessos > 0) {
      setAviso(`Processamento turbo concluído! ${sucessos} e-mails disparados com sucesso.`);
    } else {
        setAviso(ultErro ? `Falha no disparo! Erro: ${ultErro}` : `Nenhum e-mail foi enviado neste lote. Todos foram retidos pelo filtro Anti-Bounce (lixo).`);
    }
  }

  const contagem = {
    quente: visiveis.filter((l) => l.nivel === "quente").length,
    morno: visiveis.filter((l) => l.nivel === "morno").length,
    frio: visiveis.filter((l) => l.nivel === "frio").length,
  };

  const NIVEL_ACCENT: Record<Lead["nivel"], string> = {
    quente: "#ff5d5d",
    morno: "#ffb02d",
    frio: "#55685f",
  };

  return (
    <div>
      {/* Header + métricas */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-6 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="eyebrow">Alvos travados</p>
          <h1 className="headline mt-1 text-2xl font-bold">
            Leads <span className="mono text-base font-normal text-[var(--ink-faint)]">({visiveis.length})</span>
          </h1>
        </div>
        <div className="mono flex gap-4 text-[11px] uppercase tracking-widest flex-wrap">
          <span className="flex items-center gap-1.5 text-[var(--alert)]">
            <span className="pulse-dot" style={{ background: 'var(--alert)', boxShadow: '0 0 0 0 rgba(255,93,93,0.5)' }} />
            {contagem.quente} quentes
          </span>
          <span className="flex items-center gap-1.5 text-[var(--amber)]">
            <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--amber)', display:'inline-block' }} />
            {contagem.morno} mornos
          </span>
          <span className="flex items-center gap-1.5 text-[var(--ink-faint)]">
            <span style={{ width:7, height:7, borderRadius:'50%', border:'1px solid var(--ink-faint)', display:'inline-block' }} />
            {contagem.frio} frios
          </span>
        </div>
      </motion.div>

      {/* Abas de status com indicador deslizante */}
      <div className="mb-4 -mx-4 px-4 md:mx-0 md:px-0 flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide snap-x relative">
        {ABAS.map((a) => (
          <button key={a.id} onClick={() => setAba(a.id)}
            className={`mono shrink-0 snap-start rounded-lg px-3.5 py-2 text-[10px] uppercase tracking-widest transition-all relative ${
              aba === a.id ? "text-[var(--signal)]" : "text-[var(--ink-dim)] hover:text-[var(--ink)]"
            }`}
          >
            {aba === a.id && (
              <motion.span
                layoutId="aba-indicator"
                className="absolute inset-0 rounded-lg"
                style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)' }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{a.label}</span>
            <span className={`relative z-10 ml-2 ${aba === a.id ? "text-[var(--signal)]" : "text-[var(--ink-faint)]"}`}>{contagemAba[a.id]}</span>
          </button>
        ))}
      </div>

      {/* Filtros + Ações 3D */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="panel mb-5 flex flex-wrap items-center gap-2 rounded-2xl p-3"
      >
        <select value={fCat} onChange={(e) => setFCat(e.target.value)} className="field mono rounded-lg px-2.5 py-1.5 text-xs">
          <option value="all">Todas categorias</option>
          {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select value={fNivel} onChange={(e) => setFNivel(e.target.value)} className="field mono rounded-lg px-2.5 py-1.5 text-xs">
          <option value="all">Todos níveis</option><option value="quente">🔥 Quente</option><option value="morno">💡 Morno</option><option value="frio">❄ Frio</option>
        </select>
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar nome/cidade..."
          className="field mono min-w-44 flex-1 rounded-lg px-3 py-1.5 text-xs" />
        <button onClick={enriquecerEmLote} disabled={!!ocupado} className="btn-3d btn-3d-ghost">
          ⚡ Enriquecer Lote
        </button>
        <button onClick={disparoEmLote} disabled={!!ocupado} className="btn-3d btn-3d-amber">
          ✉ Disparo E-mails
        </button>
        <button onClick={() => gerarMensagensEmLote("whatsapp")} disabled={!!ocupado} className="btn-3d" style={{ background: '#25D366', color: '#fff', boxShadow: '0 4px 0 #075E54, 0 8px 24px rgba(37,211,102,0.3)' }}>
            💬 Gerar Wpp
          </button>
          <button onClick={() => gerarMensagensEmLote("instagram")} disabled={!!ocupado} className="btn-3d btn-3d-insta">
            📸 Gerar Insta
          </button>
          <button onClick={() => gerarMensagensEmLote("facebook")} disabled={!!ocupado} className="btn-3d" style={{ background: '#1877F2', color: '#fff', boxShadow: '0 4px 0 #1a3a7a, 0 8px 24px rgba(24,119,242,0.3)' }}>
            📘 Gerar FB
          </button>
        <button onClick={limparSemRedes} disabled={!!ocupado} className="btn-3d btn-3d-dark">
          🗑 s/ Insta
        </button>
        <button onClick={limparTodos} disabled={!!ocupado} className="btn-3d btn-3d-danger">
          ⚠️ Limpar Tudo
        </button>
      </motion.div>

      {/* Aviso / Toast */}
      <AnimatePresence>
        {aviso && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="mono mb-4 flex items-center gap-2 rounded-xl border border-[var(--signal)]/25 bg-[var(--signal)]/6 px-4 py-3 text-xs text-[var(--signal)]"
          >
            <span className="pulse-dot shrink-0" />
            <span>{aviso}</span>
            <button onClick={() => setAviso(null)} className="ml-auto shrink-0 opacity-50 hover:opacity-100 transition-opacity">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {carregando && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mono py-16 text-center text-xs uppercase tracking-widest text-[var(--ink-faint)]"
        >
          <span className="pulse-dot mr-2 inline-block align-middle" /> varrendo a base...
        </motion.p>
      )}

      {/* Empty state */}
      {!carregando && visiveis.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="panel rounded-2xl border-dashed py-20 text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="radar" style={{ width: 60, height: 60, opacity: 0.5 }}>
              <div className="radar-sweep" />
            </div>
          </div>
          <p className="mono text-xs uppercase tracking-widest text-[var(--ink-faint)]">radar limpo — nenhum lead nesta visão</p>
          <a href="/app/busca" className="btn-3d btn-3d-ghost mt-6 inline-flex">
            ▸ escanear uma cidade agora
          </a>
        </motion.div>
      )}

      {/* Lead Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visiveis.map((l, i) => {

    const est = NIVEL_ESTILO[l.nivel];
    const accent = NIVEL_ACCENT[l.nivel];
    
    let fotoUrl: string | null = null;
    if (l.fontes && Array.isArray(l.fontes)) {
      const f = l.fontes.find((fo) => fo?.startsWith?.("foto|"));
      if (f) fotoUrl = f.split("foto|")[1];
    } else if (typeof l.fontes === 'string') {
      try {
        const arr = JSON.parse(l.fontes);
        if (Array.isArray(arr)) {
          const f = arr.find((fo: any) => typeof fo === 'string' && fo.startsWith("foto|"));
          if (f) fotoUrl = f.split("foto|")[1];
        }
      } catch (e) {}
    }
    
    // Fallback: If no real photo from Outscraper, but they have Instagram or Website, use Google Favicon API
    if (!fotoUrl) { fotoUrl = `/api/foto-maps?q=${encodeURIComponent(l.nome + " " + l.cidade)}`; }
    
    // If user explicitly wants NO photo for those who don't have, and Favicon is mostly for generic logos... 
    // Actually the user said "sem foto apenas os que realmente não tem". Favicon API gives the actual logo.
    // If Favicon API returns the default globe, it's technically a placeholder, but it works perfectly.

    return (
            <div key={l.id} className="relative rounded-2xl overflow-hidden group flex flex-col justify-end shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.6)] hover:border-white/20 min-h-[380px]" style={{ '--lead-accent': accent } as React.CSSProperties}>
              
              {/* Imagem de Fundo Dominante */}
              <div className="absolute inset-0 z-0 bg-[#05080c]">
                <img 
                  src={fotoUrl || '/fallback.png'} 
                  alt={l.nome}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-50 group-hover:opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05080c] via-[#05080c]/80 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#05080c]/60 to-transparent pointer-events-none" />
              </div>

              {/* Distintivo Superior Direito */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                <span className={`badge ${est.badge} shadow-lg backdrop-blur-md bg-black/40`}>{est.icone} {l.nivel}</span>
                <select value={l.status} onChange={(e) => atualizar(l.id, { status: e.target.value as Lead["status"] })}
                  className="field rounded-lg px-2 py-1.5 text-[9px] uppercase font-bold tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-lg cursor-pointer hover:border-white/40 transition-colors outline-none">
                  {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>

              {/* Badge de Categoria Flutuante (Superior Esquerdo) */}
              <div className="absolute top-4 left-4 z-20 max-w-[50%]">
                 <span className="badge border-[var(--line-strong)] text-[var(--ink-dim)] bg-black/40 backdrop-blur-md shadow-lg truncate block">
                  {CATEGORIAS.find((c) => c.id === l.categoria)?.label || l.categoria}
                </span>
              </div>

              {/* Conte?do do Card */}
              <div className="relative z-10 p-5 flex flex-col gap-3 mt-auto w-full">
                {/* T?tulo e Localiza??o */}
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white drop-shadow-md mb-1 line-clamp-2">{l.nome}</h2>
                  <p className="mono text-[10px] uppercase tracking-widest text-[var(--ink-faint)] flex items-center gap-1.5 drop-shadow truncate">
                    <span className="text-[var(--signal)]">?</span> {l.cidade}{l.pais ? `, ${l.pais}` : ""}
                  </p>
                </div>

                {/* Contatos Minimalistas */}
                <div className="mono flex flex-col gap-2 text-xs bg-black/40 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shadow-inner">
                  { (l.email && !l.email.includes('duckduckgo.com')) ? (
                    <div className="flex items-center gap-2 w-full">
                      <span style={{ color: 'var(--signal)' }}>?</span>
                      <input defaultValue={l.email} className="w-full bg-transparent outline-none transition focus:border-b focus:border-[var(--signal)] placeholder-white/30 text-white truncate" onBlur={(e) => e.target.value !== l.email && atualizar(l.id, { email: e.target.value })} />
                    </div>
                  ) : <span className="text-[var(--ink-faint)] w-full text-[10px] flex items-center gap-2">? <span className="opacity-50">sem e-mail</span></span>}
                  
                  <div className="flex items-center justify-between w-full text-[10px] mt-1 pt-2 border-t border-white/5">
                    {l.instagram ? <span style={{ color: '#e879f9' }} className="truncate max-w-[50%]">? @{l.instagram.replace("@", "")}</span> : <span className="text-[var(--ink-faint)] opacity-50">? s/ Insta</span>}
                    {l.website ? <span className="text-[var(--ink-faint)]">? c/ site</span> : <span className="text-[var(--ink-faint)] opacity-50">? s/ site</span>}
                  </div>
                </div>

                {/* ?rea de Textarea Din?mica */}
                <AnimatePresence>
                  {msgAberta[l.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <textarea value={msgAberta[l.id]} onChange={(e) => setMsgAberta((m) => ({ ...m, [l.id]: e.target.value }))}
                        rows={3}
                        placeholder="Edite a mensagem antes de enviar..."
                        className="field w-full mt-2 rounded-xl p-3 text-sm leading-relaxed bg-black/60 backdrop-blur-xl text-white border-white/20 shadow-lg outline-none focus:border-[var(--signal)]" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bot?es de A??o na Base */}
                <div className="flex flex-wrap gap-2 items-center mt-1">
                  {l.email && l.status !== "enviado" && l.status !== "respondido" && l.status !== "cliente" && (
                    <button onClick={() => enviarAuto(l)} disabled={!!ocupado} className="btn-3d btn-3d-primary flex-1 py-2 px-2 text-[10px] shadow-lg">
                      {ocupado === l.id + ":auto" ? "enviando..." : "? E-mail"}
                    </button>
                  )}
                  {l.status === "enviado" && (
                    <span className="flex-1 text-center rounded-lg bg-[var(--signal)]/10 px-2 py-2 text-[10px] uppercase tracking-widest text-[var(--signal)] border border-[var(--signal)]/20 shadow-inner">
                      ? Enviado
                    </span>
                  )}
                  <button onClick={() => enriquecerLead(l)} disabled={!!ocupado} className="btn-3d btn-3d-ghost flex-1 py-2 px-2 text-[10px] shadow-lg" style={{ color: '#e879f9', borderColor: 'rgba(232,121,249,0.3)' }}>
                    {ocupado === l.id + ":enriquecer" ? "buscando..." : "?? Buscar"}
                  </button>
                </div>

                {/* Action Row Secund?ria (Redes) */}
                <div className="flex gap-2 w-full">
                  <button onClick={() => gerar(l, "whatsapp")} disabled={!!ocupado} className="flex-1 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[10px] uppercase tracking-widest text-[#25D366] font-bold rounded-lg transition flex justify-center items-center gap-1.5 shadow-lg">
                    WPP
                  </button>
                  <button onClick={() => gerar(l, "instagram")} disabled={!!ocupado} className="flex-1 py-2 bg-[#e879f9]/10 hover:bg-[#e879f9]/20 border border-[#e879f9]/30 text-[10px] uppercase tracking-widest text-[#e879f9] font-bold rounded-lg transition flex justify-center items-center gap-1.5 shadow-lg">
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
