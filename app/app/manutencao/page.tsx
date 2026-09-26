"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { DollarSign, Search, MessageCircle, Link as LinkIcon, RefreshCcw, Save } from "lucide-react";

type Cliente = {
  id: string;
  nome: string;
  telefone: string | null;
  notas: string | null;
  
  // parsed
  site_url: string;
  valor_venda: number;
  valor_manutencao: number;
  data_fechamento: string;
};

export default function ManutencaoPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [msgAberta, setMsgAberta] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      const { data } = await supabaseBrowser()
        .from("leads")
        .select("id, nome, telefone, notas, created_at")
        .eq("status", "cliente");

      if (data) {
        const parsed = data.map(d => {
          let js: any = {};
          try { if (d.notas) js = JSON.parse(d.notas); } catch(e) {}
          return {
            id: d.id,
            nome: d.nome,
            telefone: d.telefone,
            notas: d.notas,
            site_url: js.site_url || "",
            valor_venda: js.valor_venda || 0,
            valor_manutencao: js.valor_manutencao || 150, // default 150
            data_fechamento: js.data_fechamento || d.created_at,
          };
        });
        // Sort by recency
        parsed.sort((a, b) => new Date(b.data_fechamento).getTime() - new Date(a.data_fechamento).getTime());
        setClientes(parsed);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function atualizarManutencao(id: string, novoValor: number) {
    const cl = clientes.find(c => c.id === id);
    if (!cl) return;
    
    let js: any = {};
    try { if (cl.notas) js = JSON.parse(cl.notas); } catch(e) {}
    
    js.valor_manutencao = novoValor;
    const novasNotas = JSON.stringify(js);
    
    setClientes(cs => cs.map(c => c.id === id ? { ...c, valor_manutencao: novoValor, notas: novasNotas } : c));
    await supabaseBrowser().from("leads").update({ notas: novasNotas }).eq("id", id);
  }

  async function gerarCobranca(cl: Cliente) {
    setOcupado(cl.id);
    // Fake IA delay since we might not have a specific billing prompt on the backend
    await new Promise(r => setTimeout(r, 1500));
    
    const textoMensagem = `Olá, tudo bem com você?\n\nAqui é da equipe técnica do *ProspectAI* responsável pelo site *${cl.nome}*.\n\nEste é um lembrete automático sobre a manutenção e hospedagem mensal do seu site, no valor de *R$ ${cl.valor_manutencao},00*.\n\nSua plataforma continua operando em alta performance! 🚀\nQualquer dúvida sobre atualizações, estamos à disposição.\n\nChave PIX (CNPJ): [SUA CHAVE AQUI]`;
    
    setMsgAberta(m => ({ ...m, [cl.id]: textoMensagem }));
    setOcupado(null);
  }

  function abrirWhatsApp(cl: Cliente) {
    if (!cl.telefone) return alert("Cliente não possui telefone cadastrado!");
    const num = cl.telefone.replace(/\D/g, "");
    const msg = msgAberta[cl.id] || `Olá, tudo bem? Referente à manutenção do seu site...`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  const filtrados = clientes.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="eyebrow flex items-center gap-2"><RefreshCcw className="w-4 h-4" /> Faturamento Recorrente</p>
        <h1 className="headline mt-1 text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-[#10b981]">
          Manutenção & Cobrança
        </h1>
        <p className="text-[var(--ink-dim)] mt-2 text-sm max-w-2xl">
          Gerencie todos os clientes ativos, acompanhe os sites hospedados e gere mensagens persuasivas de cobrança mensal automatizada.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-black/40 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-dim)]" />
          <input 
            value={busca} onChange={e => setBusca(e.target.value)}
            placeholder="Buscar cliente..." 
            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#10b981] outline-none font-mono transition-colors"
          />
        </div>
        <div className="shrink-0 flex items-center gap-4 text-sm mono text-[var(--ink-dim)]">
          <span>{clientes.length} CLIENTES</span>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-[#10b981] font-bold">MRR ESTIMADO: R$ {clientes.reduce((acc, c) => acc + c.valor_manutencao, 0)}</span>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="radar w-16 h-16 opacity-50" style={{ borderColor: '#10b981' }}>
            <div className="radar-sweep" style={{ background: 'linear-gradient(90deg, transparent 50%, rgba(16,185,129,0.5) 100%)' }} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtrados.length === 0 && (
            <div className="text-center py-20 bg-black/20 border border-white/5 rounded-3xl border-dashed">
              <p className="mono text-[10px] uppercase tracking-widest text-[var(--ink-faint)]">Nenhum cliente ativo encontrado.</p>
            </div>
          )}

          {filtrados.map((cl, i) => (
            <motion.div 
              key={cl.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#05080c] border border-white/10 rounded-3xl p-5 md:p-6 hover:border-white/20 transition-all flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="font-display font-bold text-xl text-white">{cl.nome}</h2>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase border border-[#10b981]/50 bg-[#10b981]/10 text-[#10b981]">
                    CLIENTE ATIVO
                  </span>
                </div>
                
                <div className="mono text-[11px] text-[var(--ink-dim)] space-y-2 mt-4">
                  <p className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#10b981]" /> Valor da Instalação (Setup): <strong className="text-white">R$ {cl.valor_venda}</strong>
                  </p>
                  <p className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-[var(--signal)]" /> URL Hospedada: 
                    {cl.site_url ? <a href={cl.site_url} target="_blank" className="text-[var(--signal)] hover:underline">{cl.site_url}</a> : <span className="opacity-50">Não cadastrada</span>}
                  </p>
                </div>
                
                <AnimatePresence>
                  {msgAberta[cl.id] && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden">
                      <div className="relative">
                        <div className="absolute top-2 left-2 w-1 h-[calc(100%-16px)] bg-[#10b981] rounded" />
                        <textarea 
                          value={msgAberta[cl.id]} onChange={e => setMsgAberta(m => ({...m, [cl.id]: e.target.value}))}
                          rows={6}
                          className="w-full bg-black/40 border border-[#10b981]/30 rounded-xl p-3 pl-6 text-sm text-[var(--ink)] font-mono outline-none resize-none focus:border-[#10b981]"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Controles de Cobrança */}
              <div className="w-full md:w-64 shrink-0 bg-black/40 border border-white/5 rounded-2xl p-4 self-stretch flex flex-col">
                <label className="mono text-[10px] text-[var(--ink-faint)] uppercase tracking-widest mb-1">Manutenção Mensal (R$)</label>
                <div className="relative mb-4">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#10b981]" />
                  <input 
                    type="number" value={cl.valor_manutencao} onChange={e => atualizarManutencao(cl.id, Number(e.target.value))}
                    className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white font-bold outline-none focus:border-[#10b981] transition-colors"
                  />
                </div>
                
                <div className="mt-auto space-y-2">
                  <button 
                    onClick={() => gerarCobranca(cl)} disabled={!!ocupado}
                    className="w-full btn-3d bg-white/5 border border-white/10 hover:border-[#10b981]/50 hover:text-[#10b981] text-white py-2 flex justify-center items-center gap-2 text-[10px]"
                  >
                    {ocupado === cl.id ? "Gerando IA..." : <><MessageCircle className="w-4 h-4"/> GERAR TEXTO DE COBRANÇA</>}
                  </button>
                  {msgAberta[cl.id] && cl.telefone && (
                    <button 
                      onClick={() => abrirWhatsApp(cl)}
                      className="w-full btn-3d bg-[#25D366] text-white font-bold border-none shadow-[0_0_15px_rgba(37,211,102,0.3)] py-2 flex justify-center items-center gap-2 text-[10px]"
                    >
                      <MessageCircle className="w-4 h-4"/> ENVIAR NO WHATSAPP
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
