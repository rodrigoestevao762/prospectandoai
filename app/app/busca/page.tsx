"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { CATEGORIAS } from "@/lib/categorias";
import { Search, MapPin, Target, Zap, Activity, Globe, Save, Camera, Utensils } from "lucide-react";

type Empresa = {
  osmId: string; nome: string; categoria: string; cidade: string; pais: string;
  telefone: string | null; website: string | null; instagram: string | null; email: string | null;
  endereco: string; score: number; nivel: "quente" | "morno" | "frio";
  foto?: string | null;
};

const NIVEL_ACCENT: Record<Empresa["nivel"], string> = {
  quente: "#ff5d5d",
  morno: "#ffb02d",
  frio: "#55685f",
};

export default function BuscaPage() {
  const [engine, setEngine] = useState<"osint" | "insta" | "foods">("osint");
  const [categoria, setCategoria] = useState("todos");
  const [nichoInsta, setNichoInsta] = useState("");
  const [cidade, setCidade] = useState("");
  const [pais, setPais] = useState("");
  
  const [resultados, setResultados] = useState<Empresa[] | null>(null);
  const [salvos, setSalvos] = useState<Set<string>>(new Set());
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [checando, setChecando] = useState<string | null>(null);
  const [somenteInstagram, setSomenteInstagram] = useState(false);

  async function checarRedes(emp: Empresa) {
    setChecando(emp.osmId);
    const res = await fetch('/api/enrich-search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: emp.nome, cidade: emp.cidade, pais: emp.pais }) }); const text = await res.text(); let json = {}; try { json = JSON.parse(text); } catch { console.error('Enrich error:', text); }
    setChecando(null);
    if (res.ok && json.data) {
      setResultados(resul => resul?.map(r => r.osmId === emp.osmId ? { ...r, ...json.data } : r) || null);
    }
  }

  async function buscar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true); setErro(null); setResultados(null); setSalvos(new Set());
    
    let endpoint = "/api/buscar";
    let bodyData: any = { categoria, cidade, pais };

    if (engine === "insta") {
      endpoint = "/api/buscar-insta";
      bodyData = { nicho: nichoInsta, cidade };
    } else if (engine === "foods") {
      endpoint = "/api/buscar-foods";
      bodyData = { nicho: categoria === "todos" ? "restaurante" : categoria, cidade };
    }

    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bodyData) }); const text = await res.text(); let json; try { json = JSON.parse(text); } catch (e) { setCarregando(false); if (text.includes('504') || text.includes('TIMEOUT') || text.includes('error o')) { return setErro('Tempo limite excedido na varredura. A regi�o � muito grande ou os servidores demoraram a responder (504).'); } return setErro('Erro no servidor (n�o retornou JSON). Resposta original: ' + text.substring(0, 40) + '...'); }
      setCarregando(false);
      
      if (!res.ok) return setErro(json.erro || "Erro na busca");
      
      // Radar Insta / Foods returned 'resultados' usually, and 'empresas' for OSINT
      setResultados(json.empresas || json.resultados || []);
    } catch (err: any) {
      setCarregando(false);
      setErro("Falha crítica ao conectar com satélites: " + err.message);
    }
  }

  async function salvar(emp: Empresa) {
    const sb = supabaseBrowser();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    const { data, error } = await sb.from('leads').upsert({
      user_id: user.id, nome: emp.nome, categoria: emp.categoria, cidade: emp.cidade, pais: emp.pais,
      telefone: emp.telefone, website: emp.website, instagram: emp.instagram, email: emp.email,
      fonte: engine === 'insta' ? 'instagram' : engine === 'foods' ? 'ifood' : 'osm',
      osm_id: emp.osmId, score: emp.score, nivel: emp.nivel
    }, { onConflict: 'osm_id', ignoreDuplicates: true }).select('id').maybeSingle();
    if (!error) setSalvos((s) => new Set(s).add(emp.osmId));
    else setErro(error.message);
  }

  async function salvarEmLote(nivel?: 'quente' | 'morno' | 'frio') {
    if (!resultados) return;
    let lista = somenteInstagram ? resultados.filter(e => e.instagram) : resultados;
    if (nivel) lista = lista.filter(e => e.nivel === nivel);
    const naoSalvos = lista.filter(e => !salvos.has(e.osmId));
    if (naoSalvos.length === 0) return;
    setCarregando(true);
    const sb = supabaseBrowser();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return setCarregando(false);
    const chunkSize = 500;
    for (let i = 0; i < naoSalvos.length; i += chunkSize) {
      const pedaco = naoSalvos.slice(i, i + chunkSize);
      const rows = pedaco.map(emp => ({
        user_id: user.id, nome: emp.nome, categoria: emp.categoria, cidade: emp.cidade, pais: emp.pais,
        telefone: emp.telefone, website: emp.website, instagram: emp.instagram, email: emp.email,
        fonte: engine === 'insta' ? 'instagram' : engine === 'foods' ? 'ifood' : 'osm',
        osm_id: emp.osmId, score: emp.score, nivel: emp.nivel,
      }));
      const { error } = await sb.from('leads').upsert(rows, { onConflict: 'osm_id', ignoreDuplicates: true });
      if (!error) {
        setSalvos(s => {
          const ns = new Set(s);
          pedaco.forEach(emp => ns.add(emp.osmId));
          return ns;
        });
      } else {
        console.error('Erro ao salvar lote:', error);
      }
    }
    setCarregando(false);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow flex items-center gap-2"><Globe className="w-4 h-4" /> MÁQUINA DE CAPTURA GLOBAL</p>
        <h1 className="headline mt-2 text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--signal)]">
          Radar OSINT Unificado
        </h1>
        <p className="mt-2 text-[12px] text-[var(--ink-dim)] max-w-2xl">
          Busque milhões de empresas através de 3 motores simultâneos: Mapeamento Global, Deep Scan no Instagram e Varredura de Delivery.
        </p>
      </motion.div>

      {/* Tabs / Motores */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={() => setEngine("osint")} className={`flex-1 min-w-[200px] p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${engine === 'osint' ? 'bg-[var(--signal)]/10 border-[var(--signal)] text-[var(--signal)]' : 'bg-black/40 border-white/5 text-white/50 hover:bg-white/5'}`}>
          <Globe className="w-6 h-6" />
          <span className="font-bold tracking-widest uppercase text-[11px]">Motor OSINT Maps</span>
        </button>
        <button onClick={() => setEngine("insta")} className={`flex-1 min-w-[200px] p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${engine === 'insta' ? 'bg-[#e879f9]/10 border-[#e879f9] text-[#e879f9]' : 'bg-black/40 border-white/5 text-white/50 hover:bg-white/5'}`}>
          <Camera className="w-6 h-6" />
          <span className="font-bold tracking-widest uppercase text-[11px]">Radar Instagram</span>
        </button>
        <button onClick={() => setEngine("foods")} className={`flex-1 min-w-[200px] p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${engine === 'foods' ? 'bg-[#facc15]/10 border-[#facc15] text-[#facc15]' : 'bg-black/40 border-white/5 text-white/50 hover:bg-white/5'}`}>
          <Utensils className="w-6 h-6" />
          <span className="font-bold tracking-widest uppercase text-[11px]">Radar Foods & Delivery</span>
        </button>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
        onSubmit={buscar} 
        className="panel p-5 flex flex-wrap gap-4 rounded-3xl bg-black/40 border border-white/10 shadow-[0_0_30px_rgba(56,189,248,0.05)] relative overflow-hidden"
      >
        <div className={`absolute right-0 top-0 w-64 h-64 blur-[100px] opacity-10 pointer-events-none ${engine === 'insta' ? 'bg-[#e879f9]' : engine === 'foods' ? 'bg-[#facc15]' : 'bg-[var(--signal)]'}`} />
        
        {engine === "insta" ? (
          <div className="flex-1 min-w-[200px] relative z-10">
            <label className="block text-[10px] mono text-[var(--ink-dim)] uppercase tracking-widest mb-1.5">Nicho / Palavra-chave</label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e879f9]" />
              <input required value={nichoInsta} onChange={(e) => setNichoInsta(e.target.value)} placeholder="Ex: dentista, arquitetura..."
                className="w-full bg-[#030609] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-[#e879f9] outline-none font-mono" />
            </div>
          </div>
        ) : (
          <div className="flex-1 min-w-[200px] relative z-10">
            <label className="block text-[10px] mono text-[var(--ink-dim)] uppercase tracking-widest mb-1.5">Segmento (Alvo)</label>
            <div className="relative">
              <Target className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${engine === 'foods' ? 'text-[#facc15]' : 'text-[var(--signal)]'}`} />
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}
                className={`w-full bg-[#030609] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none appearance-none font-mono ${engine === 'foods' ? 'focus:border-[#facc15]' : 'focus:border-[var(--signal)]'}`}>
                {engine === "foods" ? (
                  <>
                    <option value="restaurante">Restaurantes</option>
                    <option value="hamburgueria">Hamburguerias</option>
                    <option value="pizzaria">Pizzarias</option>
                    <option value="sushi">Sushi / Oriental</option>
                    <option value="acai">Açaí / Sorveterias</option>
                  </>
                ) : (
                  <>
                    <option value="todos">Todos os Comércios</option>
                    {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </>
                )}
              </select>
            </div>
          </div>
        )}

        <div className="flex-1 min-w-[200px] relative z-10">
          <label className="block text-[10px] mono text-[var(--ink-dim)] uppercase tracking-widest mb-1.5">Localização (Cidade)</label>
          <div className="relative">
            <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${engine === 'insta' ? 'text-[#e879f9]' : engine === 'foods' ? 'text-[#facc15]' : 'text-[var(--signal)]'}`} />
            <input required value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: Lisboa ou 'Mundial'"
              className={`w-full bg-[#030609] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none font-mono ${engine === 'insta' ? 'focus:border-[#e879f9]' : engine === 'foods' ? 'focus:border-[#facc15]' : 'focus:border-[var(--signal)]'}`} />
          </div>
        </div>

        <div className="w-full md:w-auto self-end relative z-10">
          <button type="submit" disabled={carregando} className={`w-full md:w-auto btn-3d text-black font-bold border-none py-3 px-8 flex items-center justify-center gap-2 h-[46px] ${engine === 'insta' ? 'bg-[#e879f9] shadow-[0_0_20px_rgba(232,121,249,0.3)]' : engine === 'foods' ? 'bg-[#facc15] shadow-[0_0_20px_rgba(250,204,21,0.3)]' : 'bg-[var(--signal)] shadow-[0_0_20px_rgba(56,189,248,0.3)]'}`}>
            {carregando ? <Activity className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            {carregando ? "RASTREANDO..." : "ACIONAR RADAR"}
          </button>
        </div>
      </motion.form>

      <AnimatePresence>
        {erro && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="mono rounded-xl border border-[var(--alert)]/40 bg-[var(--alert)]/10 px-4 py-3 text-xs text-[var(--alert)] shadow-[0_0_15px_rgba(255,93,93,0.1)] flex items-center gap-3">
            <Zap className="w-4 h-4 shrink-0" /> {erro}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {carregando ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="py-24 flex flex-col items-center justify-center relative">
            <div className="radar mb-8" style={{ width: 100, height: 100, opacity: 0.8, borderColor: engine === 'insta' ? '#e879f9' : engine === 'foods' ? '#facc15' : 'var(--signal)' }}>
              <div className="radar-sweep" style={{ background: `linear-gradient(90deg, transparent 50%, ${engine === 'insta' ? 'rgba(232,121,249,0.5)' : engine === 'foods' ? 'rgba(250,204,21,0.5)' : 'rgba(56,189,248,0.5)'} 100%)` }} />
            </div>
            <p className="mono text-sm font-bold uppercase tracking-widest animate-pulse" style={{ color: engine === 'insta' ? '#e879f9' : engine === 'foods' ? '#facc15' : 'var(--signal)' }}>
              [ Conectando a satélites {engine.toUpperCase()}... ]
            </p>
          </motion.div>
        ) : resultados ? (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mt-4 mb-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
              <p className="mono text-[11px] uppercase tracking-widest text-[var(--ink-dim)]">
                <span className="font-bold" style={{ color: engine === 'insta' ? '#e879f9' : engine === 'foods' ? '#facc15' : 'var(--signal)' }}>{somenteInstagram ? resultados.filter(e => e.instagram).length : resultados.length}</span> ALVOS DETECTADOS
              </p>
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-10 h-5 rounded-full bg-black border border-white/10 transition-colors group-hover:border-[#e879f9]/50">
                    <motion.div 
                      className="absolute w-4 h-4 rounded-full bg-[#e879f9]"
                      initial={false}
                      animate={{ x: somenteInstagram ? 10 : -10, opacity: somenteInstagram ? 1 : 0.4 }}
                    />
                  </div>
                  <input type="checkbox" className="hidden" checked={somenteInstagram} onChange={(e) => setSomenteInstagram(e.target.checked)} />
                  <span className={`mono text-[10px] uppercase tracking-widest transition-colors ${somenteInstagram ? 'text-[#e879f9]' : 'text-[var(--ink-faint)]'}`}>
                    C/ INSTAGRAM
                  </span>
                </label>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <button onClick={() => salvarEmLote()} disabled={carregando || (somenteInstagram ? resultados.filter(e => e.instagram) : resultados).every(e => salvos.has(e.osmId))}
                    className="btn-3d bg-white/10 hover:bg-white/20 border-none text-[10px] px-3 py-1.5 flex items-center gap-1 text-white">
                    <Save className="w-3 h-3" /> SALVAR TUDO
                  </button>
                </div>
              </div>
            </div>

            {/* CARDS COM FOTOS GRANDES ENCIMA */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(somenteInstagram ? resultados.filter(e => e.instagram) : resultados).map((emp, i) => {
                const accent = NIVEL_ACCENT[emp.nivel];
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(emp.nome + " " + (emp.endereco || emp.cidade))}`;

                return (
                  <div key={emp.osmId}
                    className="relative flex flex-col rounded-3xl bg-[#05080c] border border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all group overflow-hidden shadow-lg"
                  >
                    <div className="absolute top-0 inset-x-0 h-32 blur-[50px] opacity-10 group-hover:opacity-20 pointer-events-none transition-opacity" style={{ backgroundColor: accent }} />
                    
                    {/* Maps Redirect Header (Super Fast) */}
                    <div className="w-full h-24 bg-gradient-to-b from-white/5 to-transparent relative border-b border-white/5 flex items-center justify-center overflow-hidden">
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] mono uppercase tracking-widest text-white transition-all shadow-[0_0_10px_rgba(255,255,255,0.05)] hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:scale-105">
                        <MapPin className="w-4 h-4 text-[var(--signal)]" />
                        Ver no Google Maps
                      </a>

                      {/* Distintivo de Nível flutuante */}
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border border-white/10 flex items-center gap-1">
                        <span>{emp.nivel === "quente" ? "🔥" : emp.nivel === "morno" ? "💡" : "❄"}</span>
                        <span style={{ color: accent }}>{emp.nivel}</span>
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1 relative z-10">
                      <div className="mb-4">
                        <h2 className="font-display font-bold text-lg text-white group-hover:text-[var(--signal)] transition-colors line-clamp-1 mb-1" title={emp.nome}>
                          {emp.nome}
                        </h2>
                        <p className="mono text-[10px] uppercase tracking-widest text-[var(--ink-faint)] line-clamp-1">📍 {emp.endereco || emp.cidade}</p>
                      </div>

                      <div className="mono text-[10px] space-y-1.5 text-[var(--ink-dim)] flex-1">
                        {emp.telefone && <p className="flex items-center gap-2"><span className="w-4">📞</span> {emp.telefone}</p>}
                        {emp.instagram && <p className="flex items-center gap-2 text-[#e879f9]"><span className="w-4">💜</span> @{emp.instagram.replace('@','')}</p>}
                        {emp.website ? <p className="flex items-center gap-2"><span className="w-4">🌐</span> ACTV</p> : <p className="flex items-center gap-2 text-[var(--signal)] font-bold animate-pulse"><span className="w-4">🚫</span> S/ SITE</p>}
                      </div>
                      
                      <div className="flex gap-2 w-full mt-5 pt-4 border-t border-white/5">
                        <button onClick={() => checarRedes(emp)} disabled={!!checando}
                          className="flex-1 btn-3d bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] px-0">
                          {checando === emp.osmId ? "SCAN..." : "🔍 DEEP SCAN"}
                        </button>
                        <button onClick={() => salvar(emp)} disabled={salvos.has(emp.osmId)}
                          className={`flex-1 btn-3d text-[10px] px-0 font-bold ${salvos.has(emp.osmId) ? 'bg-white/10 text-white/50 border-none' : 'bg-[var(--signal)] text-black border-none shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:scale-105'}`}>
                          {salvos.has(emp.osmId) ? "✓ TRAVADO" : "TRAVAR ALVO"}
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
