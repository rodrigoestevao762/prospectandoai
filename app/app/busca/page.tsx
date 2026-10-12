"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { CATEGORIAS } from "@/lib/categorias";
import {
  Search, MapPin, Target, Zap, Activity, Globe, Save,
  Camera, Utensils, Sparkles, Filter, Check, ArrowRight,
  Radio, Compass, Shield, ExternalLink
} from "lucide-react";

type Empresa = {
  osmId: string;
  nome: string;
  categoria: string;
  cidade: string;
  pais: string;
  telefone: string | null;
  website: string | null;
  instagram: string | null;
  email: string | null;
  endereco: string;
  score: number;
  nivel: "quente" | "morno" | "frio";
  foto?: string | null;
};

const NIVEL_CONFIG: Record<
  Empresa["nivel"],
  { border: string; bg: string; text: string; icon: string }
> = {
  quente: {
    border: "rgba(239,68,68,0.4)",
    bg: "rgba(239,68,68,0.1)",
    text: "#ef4444",
    icon: "🔥",
  },
  morno: {
    border: "rgba(245,158,11,0.4)",
    bg: "rgba(245,158,11,0.1)",
    text: "#f59e0b",
    icon: "💡",
  },
  frio: {
    border: "rgba(100,116,139,0.4)",
    bg: "rgba(100,116,139,0.1)",
    text: "#94a3b8",
    icon: "❄️",
  },
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

  async function checarRedes(emp: Empresa) {
    setChecando(emp.osmId);
    try {
      const res = await fetch("/api/enrich-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: emp.nome, cidade: emp.cidade, pais: emp.pais }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setResultados(
          (resul) =>
            resul?.map((r) => (r.osmId === emp.osmId ? { ...r, ...json.data } : r)) || null
        );
      }
    } catch (e) {
      console.error("Enrich error:", e);
    }
    setChecando(null);
  }

  async function buscar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    setResultados(null);
    setSalvos(new Set());

    const limitFinal = parseInt(limite) || 300;

    if (engine === "osint") {
      try {
        const { getCategoria, CATEGORIAS } = await import("@/lib/categorias");
        const { geocodificar, buscarEmpresas } = await import("@/lib/overpass");
        const { qualificar } = await import("@/lib/qualificacao");

        const cat = getCategoria(categoria);
        if (!cidade || (categoria !== "todos" && !cat)) {
          setCarregando(false);
          return setErro("Informe a localização (cidade) e a categoria.");
        }

        setErro("Localizando coordenadas no satélite...");
        const geo = await geocodificar(cidade + (pais ? ", " + pais : ""));
        if (!geo) {
          setCarregando(false);
          return setErro("Cidade não localizada no mapa geográfico.");
        }

        setErro(`Varrendo até ${limitFinal} alvos com motor OSINT ultrarrápido...`);
        const tags = cat
          ? cat.tags
          : Array.from(new Set(CATEGORIAS.flatMap((c) => c.tags)));

        const empresasRaw: any[] = [];
        let mult = 1;
        const maxMult = limitFinal > 1500 ? 2 : 1;

        const limiteMult = raioManual !== "auto" ? 1 : maxMult;
        while (mult <= limiteMult) {
          if (mult > 1) {
            setErro(`Expandindo raio metropolitano (Nível ${mult})... Meta: ${limitFinal} leads.`);
          }

          let realRadius = geo.radiusM;
          let realMult = mult;
          if (raioManual !== "auto") {
            realRadius = parseInt(raioManual) * 1000;
            realMult = 1;
          }

          const raw = await buscarEmpresas(
            cat?.id || "todos",
            tags,
            geo.lat,
            geo.lng,
            realRadius,
            cidade,
            geo.paisNome,
            geo.bbox,
            limitFinal,
            realMult
          );

          const getLeadKey = (r: any) => {
            const n = (r.nome || "").toLowerCase().trim();
            const end = (r.endereco || "").toLowerCase().trim();
            return end ? `${n}::${end}` : `${n}::${r.osmId || r.id || ""}`;
          };

          const map = new Map();
          empresasRaw.forEach((r) => map.set(getLeadKey(r), r));
          let novos = 0;
          raw.forEach((r: any) => {
            const k = getLeadKey(r);
            if (!map.has(k)) {
              empresasRaw.push(r);
              map.set(k, r);
              novos++;
            }
          });

          if (empresasRaw.length >= limitFinal) break;
          if (novos === 0 && mult > 2) break;

          mult++;
          if (mult <= limiteMult) {
            await new Promise((r) => setTimeout(r, 1200));
          }
        }

        setErro(`Qualificando ${empresasRaw.length} leads detectados...`);
        const empresas = empresasRaw.map((e) => {
          const q = qualificar({
            website: e.website,
            instagram: e.instagram,
            email: e.email,
            telefone: e.telefone,
            endereco: e.endereco,
          });
          return { ...e, score: q.score, nivel: q.nivel };
        });

        empresas.sort((a: any, b: any) => b.score - a.score || a.nome.localeCompare(b.nome));

        setResultados(empresas);
        setCarregando(false);
        setErro(null);
        return;
      } catch (err: any) {
        setCarregando(false);
        setErro("Falha no satélite: " + (err.message || "Erro de conexão"));
        return;
      }
    }

    let endpoint = "";
    let bodyData: any = { categoria, cidade, pais, limit: limitFinal };

    if (engine === "insta") {
      endpoint = "/api/buscar-insta";
      bodyData = { nicho: nichoInsta, cidade, limit: limitFinal };
    } else if (engine === "foods") {
      endpoint = "/api/buscar-foods";
      bodyData = { nicho: categoria === "todos" ? "restaurante" : categoria, cidade, limit: limitFinal };
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const json = await res.json();
      setCarregando(false);
      if (!res.ok) return setErro(json.erro || "Falha na busca.");
      setResultados(json.empresas || json.resultados || []);
    } catch (err: any) {
      setCarregando(false);
      setErro("Falha crítica ao conectar com satélites: " + err.message);
    }
  }

  async function salvar(emp: Empresa) {
    const sb = supabaseBrowser();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return;
    const { error } = await sb
      .from("leads")
      .upsert(
        {
          user_id: user.id,
          nome: emp.nome,
          categoria: emp.categoria,
          cidade: emp.cidade,
          pais: emp.pais,
          telefone: emp.telefone,
          website: emp.website,
          instagram: emp.instagram,
          email: emp.email && emp.email.includes("duckduckgo.com") ? null : emp.email,
          fonte: engine === "insta" ? "instagram" : engine === "foods" ? "ifood" : "osm",
          osm_id: emp.osmId,
          score: emp.score,
          nivel: emp.nivel,
        },
        { onConflict: "user_id,osm_id", ignoreDuplicates: true }
      )
      .select("id")
      .maybeSingle();

    if (!error) setSalvos((s) => new Set(s).add(emp.osmId));
    else setErro(error.message);
  }

  async function enriquecerLoteRadar() {
    if (!resultados) return;
    const semRedes = resultados.filter((e) => !e.instagram);
    if (semRedes.length === 0) return alert("Todos os alvos já possuem dados sociais.");
    if (!confirm(`Iniciar varredura profunda de redes sociais para ${semRedes.length} empresas?`))
      return;

    setChecando("all");
    const batchSize = 10;
    for (let i = 0; i < semRedes.length; i += batchSize) {
      const lote = semRedes.slice(i, i + batchSize);
      await Promise.all(
        lote.map(async (emp) => {
          try {
            const r = await fetch("/api/enrich-search", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nome: emp.nome, cidade: emp.cidade || emp.endereco, pais: emp.pais }),
            });
            if (r.ok) {
              const resJson = await r.json();
              if (resJson.success && resJson.data) {
                setResultados((res) =>
                  res
                    ? res.map((e) =>
                        e.osmId === emp.osmId
                          ? {
                              ...e,
                              instagram: resJson.data.instagram || e.instagram,
                              facebook: resJson.data.facebook || e.facebook,
                              website: resJson.data.website || e.website,
                              telefone: resJson.data.telefone || e.telefone,
                              email: resJson.data.email || e.email,
                            }
                          : e
                      )
                    : null
                );
              }
            }
          } catch (e) {}
        })
      );
    }
    setChecando(null);
  }

  async function salvarEmLote(nivel?: "quente" | "morno" | "frio") {
    if (!resultados) return;
    let lista = somenteInstagram ? resultados.filter((e) => e.instagram) : resultados;
    if (nivel) lista = lista.filter((e) => e.nivel === nivel);
    const naoSalvos = lista.filter((e) => !salvos.has(e.osmId));
    if (naoSalvos.length === 0) return;
    setCarregando(true);
    const sb = supabaseBrowser();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return setCarregando(false);
    const chunkSize = 500;
    for (let i = 0; i < naoSalvos.length; i += chunkSize) {
      const pedaco = naoSalvos.slice(i, i + chunkSize);
      const rows = pedaco.map((emp) => ({
        user_id: user.id,
        nome: emp.nome,
        categoria: emp.categoria,
        cidade: emp.cidade,
        pais: emp.pais,
        telefone: emp.telefone,
        website: emp.website,
        instagram: emp.instagram,
        email: emp.email && emp.email.includes("duckduckgo.com") ? null : emp.email,
        fonte: engine === "insta" ? "instagram" : engine === "foods" ? "ifood" : "osm",
        osm_id: emp.osmId,
        score: emp.score,
        nivel: emp.nivel,
      }));
      const { error } = await sb
        .from("leads")
        .upsert(rows, { onConflict: "user_id,osm_id", ignoreDuplicates: true });
      if (!error) {
        setSalvos((s) => {
          const ns = new Set(s);
          pedaco.forEach((emp) => ns.add(emp.osmId));
          return ns;
        });
      } else {
        setErro("ERRO DB: " + error.message);
        break;
      }
    }
    setCarregando(false);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a855f7]/15 border border-[#a855f7]/30 text-[#c084fc] mono text-[10px] font-bold uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> Motor de Varredura Multidimensional
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
            Radar OSINT <span className="grad-text">Unificado</span>
          </h1>
          <p className="text-[#94a3b8] text-sm mt-1 max-w-2xl">
            Descubra milhares de empresas ativas sem presença digital. Escolha o motor tático, amplie o raio geográfico e capture dados enriquecidos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="mono text-[11px] text-white/70 font-semibold">Overpass Cluster Ativo</span>
          </div>
        </div>
      </motion.div>

      {/* ── SELETOR DE MOTORES (TABS MODERNAS) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            id: "osint",
            name: "Motor OSINT Maps",
            desc: "OpenStreetMap Global & Raio Metropolitano",
            icon: Globe,
            accent: "#a855f7",
          },
          {
            id: "insta",
            name: "Radar Instagram",
            desc: "Deep Scan por Nicho e Seguidores",
            icon: Camera,
            accent: "#ec4899",
          },
          {
            id: "foods",
            name: "Radar Foods & Delivery",
            desc: "Pizzarias, Sushis e Gastronomia",
            icon: Utensils,
            accent: "#f59e0b",
          },
        ].map((tab) => {
          const active = engine === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setEngine(tab.id as any);
                setResultados(null);
              }}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group ${
                active
                  ? "bg-[#0d121f] border-[#a855f7]/50 shadow-[0_0_25px_rgba(168,85,247,0.25)]"
                  : "bg-[#080b12]/50 border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.12]"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    active ? "bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]" : "bg-white/[0.05] text-white/60"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {active && (
                  <span className="mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#a855f7]/20 text-[#e9d5ff] border border-[#a855f7]/30">
                    Ativo
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-sm text-white">{tab.name}</h3>
              <p className="text-xs text-[#94a3b8] mt-0.5 line-clamp-1">{tab.desc}</p>
            </button>
          );
        })}
      </div>

      {/* ── PAINEL DE DISPARO DA BUSCA ── */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={buscar}
        className="glass-premium p-6 sm:p-8 rounded-3xl relative overflow-hidden"
      >
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          {/* Campo Categoria / Nicho */}
          {engine === "insta" ? (
            <div className="sm:col-span-4">
              <label className="block text-[11px] mono uppercase tracking-wider text-white/60 mb-2">
                Nicho / Palavra-Chave
              </label>
              <div className="relative">
                <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ec4899]" />
                <input
                  required
                  value={nichoInsta}
                  onChange={(e) => setNichoInsta(e.target.value)}
                  placeholder="Ex: estética, arquitetura, odontologia..."
                  className="field field-premium w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="sm:col-span-4">
              <label className="block text-[11px] mono uppercase tracking-wider text-white/60 mb-2">
                Segmento (Alvo)
              </label>
              <div className="relative">
                <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c084fc]" />
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="field field-premium w-full rounded-xl pl-10 pr-4 py-3 text-sm appearance-none cursor-pointer"
                >
                  {engine === "foods" ? (
                    <>
                      <option value="restaurante">Restaurantes em Geral</option>
                      <option value="hamburgueria">Hamburguerias & Lanches</option>
                      <option value="pizzaria">Pizzarias</option>
                      <option value="sushi">Sushi & Oriental</option>
                      <option value="acai">Açaí & Sorveterias</option>
                    </>
                  ) : (
                    <>
                      <option value="todos">Todos os Comércios & Negócios</option>
                      {CATEGORIAS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>
          )}

          {/* Localização (Cidade) */}
          <div className="sm:col-span-4">
            <label className="block text-[11px] mono uppercase tracking-wider text-white/60 mb-2">
              Localização (Cidade do Planeta)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#38bdf8]" />
              <input
                required
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: Barcelona, Roma, Lisboa..."
                className="field field-premium w-full rounded-xl pl-10 pr-4 py-3 text-sm"
              />
            </div>
          </div>

          {/* Raio Geográfico (Dropdown) */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] mono uppercase tracking-wider text-white/60 mb-2">
              Raio de Busca
            </label>
            <select
              value={raioManual}
              onChange={(e) => setRaioManual(e.target.value)}
              className="field field-premium w-full rounded-xl px-3 py-3 text-sm appearance-none cursor-pointer"
            >
              <option value="auto">Auto (Smart)</option>
              <option value="5">5 km (Bairro)</option>
              <option value="10">10 km (Centro)</option>
              <option value="25">25 km (Cidade)</option>
              <option value="50">50 km (Metrópole)</option>
              <option value="100">100 km (Região)</option>
            </select>
          </div>

          {/* Máx Leads */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] mono uppercase tracking-wider text-white/60 mb-2">
              Máx Leads
            </label>
            <input
              type="number"
              required
              value={limite}
              onChange={(e) => setLimite(e.target.value)}
              placeholder="300"
              className="field field-premium w-full rounded-xl px-3 py-3 text-sm text-center"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs text-[#94a3b8] mono">
            <Sparkles className="w-4 h-4 text-[#c084fc]" />
            <span>Motor calibrado para zero gateway timeouts.</span>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="btn-signal w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(168,85,247,0.4)]"
          >
            {carregando ? (
              <>
                <Activity className="w-4 h-4 animate-spin" /> Mapeando Satélites...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" /> Acionar Radar Tático
              </>
            )}
          </button>
        </div>
      </motion.form>

      {/* ── STATUS / FEEDBACK ── */}
      <AnimatePresence>
        {erro && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-2xl bg-[#6366f1]/10 border border-[#6366f1]/30 text-xs mono text-[#c7d2fe] flex items-center gap-3 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
          >
            <Activity className="w-4 h-4 shrink-0 text-[#818cf8] animate-spin" />
            <span>{erro}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RADAR PULSE CARREGANDO ── */}
      {carregando && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="radar w-28 h-28 mb-6" />
          <p className="font-display font-bold text-lg text-white mb-1">
            Varredura Orbital em Andamento
          </p>
          <p className="mono text-xs text-[#94a3b8] uppercase tracking-widest">
            Cruzando nós geográficos e calculando threat scores...
          </p>
        </div>
      )}

      {/* ── RESULTADOS ENCONTRADOS ── */}
      {resultados && !carregando && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Action Bar */}
          <div className="p-4 rounded-2xl bg-[#0c101a] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-display font-black text-xl text-white">
                {somenteInstagram ? resultados.filter((e) => e.instagram).length : resultados.length}
              </span>
              <span className="mono text-xs uppercase tracking-wider text-[#94a3b8]">
                Alvos Detectados
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs mono uppercase tracking-wider text-white/70 cursor-pointer hover:bg-white/[0.06] transition-colors">
                <input
                  type="checkbox"
                  checked={somenteInstagram}
                  onChange={(e) => setSomenteInstagram(e.target.checked)}
                  className="rounded accent-[#6366f1]"
                />
                Com Instagram
              </label>

              <div className="h-4 w-px bg-white/10" />

              <button
                onClick={() => salvarEmLote()}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-semibold text-white border border-white/[0.08] transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-[#818cf8]" /> Salvar Tudo
              </button>

              <button
                onClick={() => salvarEmLote("quente")}
                className="px-3 py-1.5 rounded-xl bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-xs font-semibold text-[#ef4444] border border-[#ef4444]/25 transition-colors"
              >
                🔥 Quentes
              </button>

              <button
                onClick={() => salvarEmLote("morno")}
                className="px-3 py-1.5 rounded-xl bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 text-xs font-semibold text-[#f59e0b] border border-[#f59e0b]/25 transition-colors"
              >
                💡 Mornos
              </button>

              <button
                onClick={enriquecerLoteRadar}
                disabled={checando !== null}
                className="px-3.5 py-1.5 rounded-xl bg-[#6366f1]/15 hover:bg-[#6366f1]/25 text-xs font-semibold text-[#818cf8] border border-[#6366f1]/30 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Enriquecer Lote
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {(somenteInstagram ? resultados.filter((e) => e.instagram) : resultados).map((emp) => {
              const cfg = NIVEL_CONFIG[emp.nivel];
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                emp.nome + " " + (emp.endereco || emp.cidade)
              )}`;

              return (
                <div
                  key={emp.osmId}
                  className="relative rounded-2xl bg-[#0a0e18] border border-white/[0.08] hover:border-[#6366f1]/40 transition-all duration-300 p-5 flex flex-col justify-between group overflow-hidden shadow-lg"
                >
                  {/* Top Level Pill & Maps Link */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 border"
                        style={{ borderColor: cfg.border, backgroundColor: cfg.bg, color: cfg.text }}
                      >
                        <span>{cfg.icon}</span>
                        <span>{emp.nivel}</span>
                      </span>

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/40 hover:text-white transition-colors p-1"
                        title="Ver no Google Maps"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <h3
                      className="font-display font-bold text-base text-white group-hover:text-[#818cf8] transition-colors line-clamp-1 mb-1"
                      title={emp.nome}
                    >
                      {emp.nome}
                    </h3>

                    <p className="mono text-[11px] text-[#94a3b8] line-clamp-1 mb-4">
                      📍 {emp.endereco || emp.cidade}
                    </p>

                    {/* Metadata Chips */}
                    <div className="space-y-1.5 text-xs text-[#94a3b8] mono border-t border-white/[0.06] pt-3">
                      {emp.telefone && (
                        <p className="flex items-center gap-2 truncate">
                          <span className="text-white/40">📞</span> {emp.telefone}
                        </p>
                      )}
                      {emp.instagram && (
                        <p className="flex items-center gap-2 truncate text-[#ec4899]">
                          <span>💜</span> @{emp.instagram.replace("@", "")}
                        </p>
                      )}
                      {emp.website ? (
                        <p className="flex items-center gap-2 text-white/50">
                          <span>🌐</span> Tem Website
                        </p>
                      ) : (
                        <p className="flex items-center gap-2 text-[#818cf8] font-bold">
                          <span>⚡</span> SEM WEBSITE (OPORTUNIDADE)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center gap-2">
                    <button
                      onClick={() => checarRedes(emp)}
                      disabled={!!checando}
                      className="flex-1 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[11px] mono font-medium text-white/80 border border-white/[0.08] transition-colors"
                    >
                      {checando === emp.osmId ? "Scan..." : "Deep Scan"}
                    </button>

                    <button
                      onClick={() => salvar(emp)}
                      disabled={salvos.has(emp.osmId)}
                      className={`flex-1 py-2 rounded-lg text-[11px] mono font-bold uppercase tracking-wider transition-all ${
                        salvos.has(emp.osmId)
                          ? "bg-white/[0.06] text-white/40 border border-transparent"
                          : "bg-[#6366f1] text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:brightness-110"
                      }`}
                    >
                      {salvos.has(emp.osmId) ? "✓ Salvo" : "Salvar Lead"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
