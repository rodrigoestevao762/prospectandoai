"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase-browser";
import Link from "next/link";

type LandingPage = {
  id: string;
  url_slug: string | null;
  ativo: boolean;
  published_at: string | null;
  tema: string;
  lead: {
    id: string;
    nome: string;
    cidade: string;
  }
};

export default function SitesEntreguesPage() {
  const [landings, setLandings] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLandings() {
      const { data, error } = await supabaseBrowser()
        .from("landing_pages")
        .select(`
          id, url_slug, ativo, published_at, tema,
          lead:lead_id ( id, nome, cidade )
        `)
        .not("url_slug", "is", null)
        .order("published_at", { ascending: false });

      if (data) {
        setLandings(data as any);
      }
      setLoading(false);
    }
    fetchLandings();
  }, []);

  async function toggleStatus(id: string, currentStatus: boolean) {
    const { error } = await supabaseBrowser()
      .from("landing_pages")
      .update({ ativo: !currentStatus })
      .eq("id", id);
    if (!error) {
      setLandings(ls => ls.map(l => l.id === id ? { ...l, ativo: !currentStatus } : l));
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="eyebrow">Deploy Manager</p>
        <h1 className="headline mt-1 text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-[#10b981]">
          Sites Entregues
        </h1>
        <p className="text-[var(--ink-dim)] mt-2">Gerencie e monitore as Landing Pages geradas via IA para os leads prospectados.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="radar w-16 h-16 opacity-50"><div className="radar-sweep" /></div>
        </div>
      ) : landings.length === 0 ? (
        <div className="panel rounded-3xl p-16 text-center border-dashed">
          <p className="mono text-[var(--ink-dim)] uppercase tracking-widest text-sm">Nenhuma landing page publicada ainda.</p>
          <p className="mt-2 text-[var(--ink-faint)]">Acesse um Lead e clique em ✦ Landing para gerar o site.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {landings.map((l, i) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="panel-hover relative overflow-hidden rounded-3xl bg-[var(--panel)] border border-[var(--line)] flex flex-col h-full"
              >
                {/* Status indicator */}
                <div className={`absolute top-0 inset-x-0 h-1 ${l.ativo ? 'bg-[#10b981]' : 'bg-[var(--alert)]'}`} />
                
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold rounded-full border ${
                      l.ativo 
                        ? 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30' 
                        : 'text-[var(--alert)] bg-[var(--alert)]/10 border-[var(--alert)]/30'
                    }`}>
                      {l.ativo ? '● Online' : '○ Offline'}
                    </span>
                    <span className="text-[10px] mono text-[var(--ink-faint)]">
                      {new Date(l.published_at || "").toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{l.lead.nome}</h3>
                  <p className="text-[11px] mono uppercase tracking-widest text-[var(--ink-dim)] mb-4">{l.lead.cidade}</p>
                  
                  <div className="bg-black/40 rounded-xl p-3 border border-white/5 mb-4">
                    <p className="text-[10px] text-[var(--ink-faint)] uppercase tracking-widest mb-1">Tema da IA</p>
                    <p className="text-xs text-[var(--ink)] font-medium capitalize">{l.tema.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="p-4 border-t border-[var(--line)] bg-white/[0.01] flex items-center justify-between gap-2">
                  <div className="flex gap-2 w-full">
                    <a 
                      href={`/s/${l.url_slug}`} 
                      target="_blank" 
                      className="btn-3d flex-1 text-center justify-center text-[10px]"
                      style={{ background: l.ativo ? '#10b981' : 'transparent', color: l.ativo ? '#000' : 'var(--ink)' }}
                    >
                      {l.ativo ? 'Abrir Site ↗' : 'Link Offline'}
                    </a>
                    
                    <Link href={`/app/editor/${l.lead.id}`} className="btn-3d btn-3d-ghost px-3">
                      ✏️ Editar
                    </Link>
                  </div>
                </div>
                
                {/* Toggle Action Overlay */}
                <button 
                  onClick={() => toggleStatus(l.id, l.ativo)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                  title={l.ativo ? "Desativar site" : "Ativar site"}
                >
                  <span className="text-[14px]">{l.ativo ? '⏸' : '▶'}</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
