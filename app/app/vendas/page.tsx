"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase-browser";
import Link from "next/link";
import { Activity, Target, Zap } from "lucide-react";

type Lead = {
  id: string;
  nome: string;
  cidade: string;
  nivel: string;
  status: string;
  score: number;
};

const KANBAN_STAGES = [
  { id: "novo", title: "Prospectos (Frio)", color: "var(--ink-dim)", accent: "rgba(139,163,154,0.1)" },
  { id: "mensagem_gerada", title: "Payload Gerado", color: "var(--amber)", accent: "rgba(255,176,45,0.1)" },
  { id: "enviado", title: "Interceptados", color: "var(--signal)", accent: "rgba(56,189,248,0.1)" },
  { id: "respondido", title: "Em Negociação", color: "var(--alert)", accent: "rgba(255,93,93,0.1)" },
  { id: "cliente", title: "Clientes Ativos", color: "#10b981", accent: "rgba(16,185,129,0.1)" },
];

export default function PipelineDeVendas() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabaseBrowser()
        .from("leads")
        .select("id, nome, cidade, nivel, status, score")
        .order("score", { ascending: false });
      if (data) setLeads(data as Lead[]);
      setLoading(false);
    }
    load();
  }, []);

  async function updateLeadStatus(id: string, newStatus: string) {
    // Optimistic update
    setLeads(ls => ls.map(l => l.id === id ? { ...l, status: newStatus } : l));
    // Backend update
    await supabaseBrowser().from("leads").update({ status: newStatus }).eq("id", id);
  }

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="shrink-0"
      >
        <p className="eyebrow flex items-center gap-2"><Activity className="w-4 h-4" /> Pipeline CRM</p>
        <h1 className="headline mt-1 text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--amber)]">
          Visão de Conversão
        </h1>
        <p className="text-[var(--ink-dim)] mt-2 text-sm">
          Acompanhe o funil de infiltração. Altere o status dos leads para movê-los pelas esteiras.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center relative">
          <div className="radar w-24 h-24 opacity-80" style={{ borderColor: 'var(--amber)' }}>
            <div className="radar-sweep" style={{ background: 'linear-gradient(90deg, transparent 50%, rgba(255,176,45,0.5) 100%)' }} />
          </div>
          <p className="absolute mt-32 mono text-xs uppercase tracking-widest text-[var(--amber)] animate-pulse">Sincronizando pipeline...</p>
        </div>
      ) : (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 snap-x">
          {KANBAN_STAGES.map((stage) => {
            const stageLeads = leads.filter(l => l.status === stage.id);
            return (
              <div 
                key={stage.id} 
                className="shrink-0 w-80 flex flex-col snap-start rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden relative group"
              >
                {/* Background ambient glow */}
                <div className="absolute top-0 inset-x-0 h-32 blur-[50px] opacity-10 pointer-events-none" style={{ backgroundColor: stage.color }} />

                {/* Stage Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40 relative z-10">
                  <h3 className="font-display font-bold text-sm tracking-wider uppercase" style={{ color: stage.color }}>{stage.title}</h3>
                  <span className="mono text-[10px] px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 font-bold">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide relative z-10">
                  <AnimatePresence>
                    {stageLeads.map((l) => (
                      <motion.div
                        layout
                        key={l.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
                        whileHover={{ y: -2, scale: 1.02 }}
                        className="p-4 rounded-2xl bg-[#05080c] border border-white/10 cursor-default shadow-lg hover:border-white/20 transition-all group/card"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-display font-bold text-[14px] leading-tight text-white group-hover/card:text-[var(--signal)] transition-colors line-clamp-1">{l.nome}</h4>
                          <span className="text-[12px] bg-black/50 px-1.5 py-0.5 rounded">{l.nivel === 'quente' ? '🔥' : l.nivel === 'morno' ? '💡' : '❄️'}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <p className="mono text-[9px] uppercase tracking-widest text-[var(--ink-faint)]">📍 {l.cidade}</p>
                          <span className="mono text-[9px] uppercase text-[var(--signal)] font-bold">{l.score} PTS</span>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <select 
                            value={l.status}
                            onChange={(e) => updateLeadStatus(l.id, e.target.value)}
                            className="flex-1 bg-black/60 border border-white/10 rounded-lg px-2 py-2 text-[9px] font-bold mono uppercase text-white outline-none focus:border-[var(--signal)] transition-colors cursor-pointer"
                          >
                            {KANBAN_STAGES.map(s => (
                              <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                          </select>
                          <Link href={`/app/editor/${l.id}`} className="shrink-0 bg-[var(--amber)]/10 hover:bg-[var(--amber)]/20 text-[var(--amber)] border border-[var(--amber)]/30 rounded-lg px-3 py-2 flex items-center justify-center transition-colors text-[10px] font-bold">
                            ✦ SITE
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {stageLeads.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-50 pb-10">
                      <Target className="w-8 h-8 text-white/20 mb-2" />
                      <p className="text-[10px] mono uppercase tracking-widest text-[var(--ink-faint)]">
                        Sem Alvos
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}

