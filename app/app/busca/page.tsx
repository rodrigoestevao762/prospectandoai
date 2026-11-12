"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { CATEGORIAS } from "@/lib/categorias";
import { salvarLeads, obterIdsSalvos } from "@/lib/leads-storage";
import { normalizarParametrosBusca } from "@/lib/normalizar-busca";
import { useEffect } from "react";
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
  const [limite, setLimite] = useState("300");
  const [raioManual, setRaioManual] = useState("auto");
  const [nichoInsta, setNichoInsta] = useState("");
  const [cidade, setCidade] = useState("");
  const [pais, setPais] = useState("");
  
  const [resultados, setResultados] = useState<Empresa[] | null>(null);
  const [salvos, setSalvos] = useState<Set<string>>(new Set());
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [checando, setChecando] = useState<string | null>(null);
  const [somenteInstagram, setSomenteInstagram] = useState(false);
  const [sucessoSalvar, setSucessoSalvar] = useState<string | null>(null);

  useEffect(() => {
    obterIdsSalvos().then((res) => { if (res instanceof Set) setSalvos(res); else setSalvos(new Set(Array.isArray(res) ? res : [])); }).catch(() => setSalvos(new Set()));
  }, []);

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
    
    let limitFinal = parseInt(limite) || 300;

    // Normalização e desinversão inteligente de nicho e cidade
    const { nicho: nichoNorm, cidade: cidadeNorm, invertido } = normalizarParametrosBusca(
      engine === "insta" ? nichoInsta : categoria,
      cidade
    );

    let cidadeAlvo = cidadeNorm;
    let nichoAlvo = nichoNorm;

    if (invertido) {
      if (engine === "insta") setNichoInsta(nichoNorm);
      setCidade(cidadeNorm);
    }

    if (!cidadeAlvo) {
      setCarregando(false);
      return setErro("Informe uma cidade ou região para prospecção.");
    }

    if (engine === "osint") {
      try {
        const { getCategoria, CATEGORIAS } = await import('@/lib/categorias');
        const { geocodificar, buscarEmpresas } = await import('@/lib/overpass');
        const { qualificar } = await import('@/lib/qualificacao');

        let cat = getCategoria(nichoAlvo) || getCategoria(categoria);
        if (!cat && nichoAlvo) {
          const nLower = nichoAlvo.toLowerCase();
          cat = CATEGORIAS.find(c => c.id === nLower || c.label.toLowerCase().includes(nLower));
        }

        setErro("Geocodificando território... (Buscando coordenadas de " + cidadeAlvo + ")");
        const geo = await geocodificar(cidadeAlvo + (pais ? ", " + pais : ""));
        if (!geo) {
          setCarregando(false);
          return setErro("Cidade não encontrada no mapa: " + cidadeAlvo);
        }

        setErro("Extraindo leads em alta velocidade via satélites OSINT...");
        const tags = cat
          ? cat.tags
          : Array.from(new Set(CATEGORIAS.flatMap((c) => c.tags)));
        
        let empresasRaw: any[] = [];
        let mult = 1;
        const maxMult = limitFinal > 1500 ? 3 : 1;
        
        const limiteMult = raioManual !== 'auto' ? 1 : maxMult;
        while (mult <= limiteMult) {
            if (mult > 1) {
                setErro(`Ampliando raio do satélite (Nível ${mult})... Buscando mais leads para atingir a meta de ${limitFinal}...`);
            }
            
            let realRadius = geo.radiusM;
            let realMult = mult;
            if (raioManual !== 'auto') {
               realRadius = parseInt(raioManual) * 1000;
               realMult = 1;
            }
            const raw = await buscarEmpresas(cat?.id || "todos", tags, geo.lat, geo.lng, realRadius, cidadeAlvo, geo.paisNome, null, limitFinal, realMult);
            
            const map = new Map();
            empresasRaw.forEach(r => map.set(r.osmId || (r.nome + "::" + r.endereco), r));
            let novos = 0;
            raw.forEach((r: any) => {
                const k = r.osmId || (r.nome + "::" + r.endereco);
                if (!map.has(k)) {
                    empresasRaw.push(r);
                    map.set(k, r);
                    novos++;
                }
            });
            
            if (empresasRaw.length >= limitFinal) {
                break;
            }
            
            if (novos === 0 && mult > 1) {
                break;
            }
            
            mult++;
            if (mult <= maxMult) {
               await new Promise(r => setTimeout(r, 2000));
            }
        }
        
        setErro("Qualificando " + empresasRaw.length + " leads encontrados...");
        const empresas = empresasRaw.map((e) => {
          const q = qualificar({ website: e.website, instagram: e.instagram, email: e.email, telefone: e.telefone, endereco: e.endereco });
          return { ...e, score: q.score, nivel: q.nivel };
        });

        empresas.sort((a: any, b: any) => (b.score || 0) - (a.score || 0) || (a.nome || "").localeCompare(b.nome || ""));
        
        setResultados(empresas);
        setCarregando(false);
        setErro(null);
        return;
      } catch (err: any) {
        setCarregando(false);
        setErro("Falha ao conectar com satélites do OSINT: " + err.message);
        return;
      }
    }

    // MOTORES INSTAGRAM & FOODS RESILIENTES
    let endpoint = engine === "insta" ? "/api/buscar-insta" : "/api/buscar-foods";
    let bodyData: any = {
      nicho: nichoAlvo,
      cidade: cidadeAlvo,
      limit: Math.min(limitFinal, 500)
    };

    setErro(`Acionando ${engine === 'insta' ? 'Deep Scan Instagram' : 'Radar Delivery'} para ${nichoAlvo} em ${cidadeAlvo}...`);

    let perfisApi: any[] = [];
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
        signal: AbortSignal.timeout(9000), // Timeout defensivo no client (evita 504)
      });
      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        perfisApi = json.resultados || json.empresas || [];
      }
    } catch {
      // Continua para o enriquecimento via satélite se a API demorar
    }

    // Se o usuário pediu volume alto (300+ leads) ou a API trouxe menos alvos que a meta:
    let leadsSat: any[] = [];
    try {
      const { getCategoria, CATEGORIAS } = await import('@/lib/categorias');
      const { geocodificar, buscarEmpresas } = await import('@/lib/overpass');
      const { qualificar } = await import('@/lib/qualificacao');

      const geo = await geocodificar(cidadeAlvo);
      if (geo) {
        let cat = getCategoria(nichoAlvo);
        if (!cat) {
          const nLower = nichoAlvo.toLowerCase();
          cat = CATEGORIAS.find(c => c.id === nLower || c.label.toLowerCase().includes(nLower));
        }
        const tags = cat ? cat.tags : [`name~${nichoAlvo},i`];
        const raw = await buscarEmpresas(cat?.id || "todos", tags, geo.lat, geo.lng, geo.radiusM, cidadeAlvo, geo.paisNome, null, limitFinal, 1);
        leadsSat = raw.map(e => {
          const q = qualificar({ website: e.website, instagram: e.instagram, email: e.email, telefone: e.telefone, endereco: e.endereco });
          return { ...e, score: q.score, nivel: q.nivel };
        });
      }
    } catch {}

    // Unifica os perfis do Instagram/Foods com a malha geoespacial
    const map = new Map<string, any>();
    for (const p of [...perfisApi, ...leadsSat]) {
      if (!p) continue;
      const key = p.instagram ? p.instagram.toLowerCase() : (p.osmId || (p.nome + "::" + p.endereco));
      if (!map.has(key)) map.set(key, p);
    }

    const unificados = Array.from(map.values()).slice(0, limitFinal);
    unificados.sort((a: any, b: any) => (b.score || 0) - (a.score || 0) || (a.nome || "").localeCompare(b.nome || ""));

    setCarregando(false);
    setErro(null);
    setResultados(unificados);
  }

    async function salvar(emp: Empresa) {
    try {
      await salvarLeads([emp]);
      setSalvos((s) => new Set(s).add(emp.osmId));
      setSucessoSalvar(`Lead "${emp.nome}" salvo no CRM e Alvos!`);
      setTimeout(() => setSucessoSalvar(null), 3000);
    } catch (err: any) {
      setErro("Falha ao salvar lead: " + err.message);
    }
  }

  async function enriquecerLoteRadar() {
    if (!resultados) return;
    const semRedes = resultados.filter(e => !e.instagram);
    if (semRedes.length === 0) return alert('Nenhum lead precisa de enriquecimento (ou todos j� t�m redes).');
    if (!confirm('Deseja acionar a varredura profunda para buscar redes sociais de ' + semRedes.length + ' empresas ao vivo? Isso pode demorar v�rios minutos se a lista for muito grande!')) return;
    
    setChecando('all');
    const batchSize = 10;
    for (let i = 0; i < semRedes.length; i += batchSize) {
      const lote = semRedes.slice(i, i + batchSize);
      await Promise.all(lote.map(async (emp) => {
        try {
          const q = encodeURIComponent(emp.nome + ' ' + (emp.endereco || emp.cidade));
          const r = await fetch('/api/enrich-search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ nome: emp.nome, cidade: emp.cidade || emp.endereco, pais: emp.pais })
            });
          if (r.ok) {
            const resJson = await r.json();
            if (resJson.success && resJson.data) {
              setResultados(res => res ? res.map(e => e.osmId === emp.osmId ? { 
                ...e, 
                instagram: resJson.data.instagram || e.instagram, 
                facebook: resJson.data.facebook || e.facebook, 
                website: resJson.data.website || e.website, 
                telefone: resJson.data.telefone || e.telefone,
                email: resJson.data.email || e.email
              } : e) : null);
            }
          }
        } catch (e) {}
      }));
    }
    setChecando(null);
    alert('Varredura de redes conclu�da com sucesso!');
  }

    async function salvarEmLote(nivel?: 'quente' | 'morno' | 'frio') {
    if (!resultados) return;
    let lista = somenteInstagram ? resultados.filter(e => e.instagram) : resultados;
    if (nivel) lista = lista.filter(e => e.nivel === nivel);
    const naoSalvos = lista.filter(e => !salvos.has(e.osmId));
    if (naoSalvos.length === 0) {
      setSucessoSalvar("Todos os leads deste grupo já estão salvos!");
      setTimeout(() => setSucessoSalvar(null), 3000);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const res = await salvarLeads(naoSalvos);
      setSalvos(s => {
        const ns = new Set(s);
        naoSalvos.forEach(emp => ns.add(emp.osmId));
        return ns;
      });
      setSucessoSalvar(`${res.salvos} leads salvos com sucesso no CRM e Alvos!`);
      setTimeout(() => setSucessoSalvar(null), 4000);
    } catch (err: any) {
      setErro("Erro ao salvar lote: " + err.message);
    } finally {
      setCarregando(false);
    }
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
        <button onClick={() => { setEngine("osint"); setResultados(null); }} className={`flex-1 min-w-[200px] p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${engine === 'osint' ? 'bg-[var(--signal)]/10 border-[var(--signal)] text-[var(--signal)]' : 'bg-black/40 border-white/5 text-white/50 hover:bg-white/5'}`}>
          <Globe className="w-6 h-6" />
          <span className="font-bold tracking-widest uppercase text-[11px]">Motor OSINT Maps</span>
        </button>
        <button onClick={() => { setEngine("insta"); setResultados(null); }} className={`flex-1 min-w-[200px] p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${engine === 'insta' ? 'bg-[#e879f9]/10 border-[#e879f9] text-[#e879f9]' : 'bg-black/40 border-white/5 text-white/50 hover:bg-white/5'}`}>
          <Camera className="w-6 h-6" />
          <span className="font-bold tracking-widest uppercase text-[11px]">Radar Instagram</span>
        </button>
        <button onClick={() => { setEngine("foods"); setResultados(null); }} className={`flex-1 min-w-[200px] p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${engine === 'foods' ? 'bg-[#facc15]/10 border-[#facc15] text-[#facc15]' : 'bg-black/40 border-white/5 text-white/50 hover:bg-white/5'}`}>
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

                  <div className="flex-none w-[120px] relative z-10">
            <label className="block text-[10px] mono text-[var(--ink-dim)] uppercase tracking-widest mb-1.5">RAIO</label>
            <div className="relative">
              <select value={raioManual} onChange={(e) => setRaioManual(e.target.value)}
                className={`w-full bg-[#030609] border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none font-mono appearance-none ${engine === 'foods' ? 'focus:border-[#facc15]' : engine === 'insta' ? 'focus:border-[#e879f9]' : 'focus:border-[var(--signal)]'}`}>
                <option value="auto">Auto</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
                <option value="100">100 km</option>
              </select>
            </div>
          </div>

          <div className="flex-none w-[100px] relative z-10">
            <label className="block text-[10px] mono text-[var(--ink-dim)] uppercase tracking-widest mb-1.5">MÁX LEADS</label>
            <div className="relative">
              <input type="number" value={limite} onChange={(e) => setLimite(e.target.value)} required placeholder="300"
                className={`w-full bg-[#030609] border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none font-mono ${engine === 'foods' ? 'focus:border-[#facc15]' : engine === 'insta' ? 'focus:border-[#e879f9]' : 'focus:border-[var(--signal)]'}`} />
            </div>
          </div>

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
        {sucessoSalvar && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono flex items-center justify-between">
              <span>✓ {sucessoSalvar}</span>
              <button onClick={() => setSucessoSalvar(null)} className="text-emerald-400 hover:text-white ml-2">✕</button>
            </motion.div>
          )}
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
                    <button onClick={() => salvarEmLote("quente")} disabled={carregando || !resultados.some(e => e.nivel === "quente" && !salvos.has(e.osmId))}
                      className="btn-3d bg-[#ff5d5d]/10 hover:bg-[#ff5d5d]/20 border-none text-[10px] px-3 py-1.5 flex items-center gap-1 text-[#ff5d5d]">
                      🔥 QUENTES
                    </button>
                    <button onClick={() => salvarEmLote("morno")} disabled={carregando || !resultados.some(e => e.nivel === "morno" && !salvos.has(e.osmId))}
                      className="btn-3d bg-[#ffb02d]/10 hover:bg-[#ffb02d]/20 border-none text-[10px] px-3 py-1.5 flex items-center gap-1 text-[#ffb02d]">
                      ? MORNOS
                    </button>
                    <button onClick={() => salvarEmLote("frio")} disabled={carregando || !resultados.some(e => e.nivel === "frio" && !salvos.has(e.osmId))}
                      className="btn-3d bg-[#55685f]/10 hover:bg-[#55685f]/20 border-none text-[10px] px-3 py-1.5 flex items-center gap-1 text-[#55685f]">
                      ❄️ FRIOS
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1"></div>
                    <button onClick={enriquecerLoteRadar} disabled={carregando || checando !== null}
                      className="btn-3d bg-purple-500/10 hover:bg-purple-500/20 border-none text-[10px] px-3 py-1.5 flex items-center gap-1 text-purple-400">
                      <Search className="w-3 h-3" /> ENRIQUECER LOTE
                    </button>
                </div>
              </div>
            </div>

            {/* CARDS COM FOTOS GRANDES ENCIMA */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(somenteInstagram ? resultados.filter(e => e.instagram) : resultados).map((emp, i) => {
                const nivelSeguro: "quente" | "morno" | "frio" = (emp.nivel === "quente" || emp.nivel === "morno" || emp.nivel === "frio") ? emp.nivel : "frio";
                const accent = NIVEL_ACCENT[nivelSeguro] || "#55685f";
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
                        <button onClick={() => salvar(emp)} disabled={Boolean(salvos?.has?.(emp.osmId))}
                          className={`flex-1 btn-3d text-[10px] px-0 font-bold ${Boolean(salvos?.has?.(emp.osmId)) ? 'bg-white/10 text-white/50 border-none' : 'bg-[var(--signal)] text-black border-none shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:scale-105'}`}>
                          {Boolean(salvos?.has?.(emp.osmId)) ? "✓ TRAVADO" : "TRAVAR ALVO"}
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
