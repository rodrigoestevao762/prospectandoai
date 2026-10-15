"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { CATEGORIAS, getCategoria } from "@/lib/categorias";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, LayerGroup, Circle } from "leaflet";
import {
  Search, MapPin, Target, Zap, Activity, Globe, Save,
  Camera, Utensils, Sparkles, Filter, Check, ArrowRight,
  Radio, Compass, Shield, ExternalLink, Download, FileSpreadsheet,
  Kanban, Phone, Copy, MessageSquare, LayoutGrid, Table as TableIcon,
  Map as MapIcon, SlidersHorizontal, RefreshCw, X
} from "lucide-react";
import HardyMascot from "@/components/codemakers/HardyMascot";

export type Empresa = {
  osmId: string;
  nome: string;
  categoria: string;
  cidade: string;
  pais: string;
  lat?: number;
  lng?: number;
  telefone: string | null;
  website: string | null;
  instagram: string | null;
  email: string | null;
  endereco: string;
  score: number;
  nivel: "quente" | "morno" | "frio";
  foto?: string | null;
  facebook?: string | null;
};

const NIVEL_CONFIG: Record<
  Empresa["nivel"],
  { border: string; bg: string; text: string; icon: string; label: string }
> = {
  quente: {
    border: "rgba(168,85,247,0.5)",
    bg: "rgba(124,58,237,0.2)",
    text: "#c084fc",
    icon: "🔥",
    label: "Quente"
  },
  morno: {
    border: "rgba(245,158,11,0.5)",
    bg: "rgba(245,158,11,0.15)",
    text: "#f59e0b",
    icon: "💡",
    label: "Morno"
  },
  frio: {
    border: "rgba(148,163,184,0.4)",
    bg: "rgba(148,163,184,0.1)",
    text: "#94a3b8",
    icon: "❄️",
    label: "Frio"
  },
};

export default function CodeHunterRadarPage() {
  // Motores Táticos Originais
  const [engine, setEngine] = useState<"osint" | "insta" | "foods">("osint");
  const [categoria, setCategoria] = useState("todos");
  const [limite, setLimite] = useState("300");
  const [raioManual, setRaioManual] = useState("auto");
  const [nichoInsta, setNichoInsta] = useState("");
  const [cidade, setCidade] = useState("São Paulo");
  const [pais, setPais] = useState("Brasil");

  // Resultados & Operações
  const [resultados, setResultados] = useState<Empresa[] | null>(null);
  const [salvos, setSalvos] = useState<Set<string>>(new Set());
  const [carregando, setCarregando] = useState(false);
  const [statusTexto, setStatusTexto] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [checando, setChecando] = useState<string | null>(null);
  const [somenteInstagram, setSomenteInstagram] = useState(false);
  const [filtroNivel, setFiltroNivel] = useState<"todos" | "quente" | "morno" | "frio">("todos");

  // Nova Função: Visualizador Tri-Modal (Cards / Tabela / Mapa)
  const [modoVisualizacao, setModoVisualizacao] = useState<"cards" | "tabela" | "mapa">("cards");

  // Nova Função: Modal de Gerador de Mensagem WhatsApp com IA
  const [leadMensagem, setLeadMensagem] = useState<Empresa | null>(null);
  const [mensagemGerada, setMensagemGerada] = useState("");
  const [copiouMsg, setCopiouMsg] = useState(false);

  // Mapa CartoDB Dark Matter
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<LeafletMap | null>(null);
  const layerGroup = useRef<LayerGroup | null>(null);
  const circleRef = useRef<Circle | null>(null);

  // ── INICIALIZAÇÃO DO MAPA NOTURNO (QUANDO MODO MAPA ATIVADO) ──
  useEffect(() => {
    let cancel = false;
    if (modoVisualizacao !== "mapa") return;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancel || !mapRef.current || leafletInstance.current) return;

      const firstLead = resultados?.find(r => r.lat && r.lng);
      const centerLat = firstLead?.lat || -23.5505;
      const centerLng = firstLead?.lng || -46.6333;

      const map = L.map(mapRef.current, {
        worldCopyJump: true,
        zoomControl: false,
        attributionControl: false,
      }).setView([centerLat, centerLng], 12);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      layerGroup.current = L.layerGroup().addTo(map);
      leafletInstance.current = map;

      // Plotar marcadores
      if (resultados) {
        atualizarPinsMapa(resultados, map, layerGroup.current, L);
      }

      setTimeout(() => map.invalidateSize(), 300);
    })();

    return () => {
      cancel = true;
      leafletInstance.current?.remove();
      leafletInstance.current = null;
    };
  }, [modoVisualizacao, resultados]);

  const atualizarPinsMapa = (lista: Empresa[], map: LeafletMap, lg: LayerGroup, L: any) => {
    lg.clearLayers();
    const bounds: [number, number][] = [];

    lista.forEach((emp) => {
      if (!emp.lat || !emp.lng) return;
      bounds.push([emp.lat, emp.lng]);
      const cfg = NIVEL_CONFIG[emp.nivel];

      const marker = L.circleMarker([emp.lat, emp.lng], {
        radius: emp.nivel === "quente" ? 7 : 5,
        color: "#ffffff",
        weight: 1.5,
        fillColor: cfg.text,
        fillOpacity: 0.9,
      });

      marker.bindPopup(`
        <div style="background:#0c0a18;color:#fff;padding:10px;border-radius:12px;font-family:sans-serif;font-size:12px;border:1px solid rgba(124,58,237,0.4);min-width:180px;">
          <span style="font-size:9px;font-family:monospace;color:#c084fc;font-weight:bold;text-transform:uppercase;">${emp.categoria}</span>
          <h4 style="font-size:13px;font-weight:bold;margin:3px 0 5px 0;color:#ffffff;">${emp.nome}</h4>
          <p style="font-size:11px;color:#94a3b8;margin:0 0 6px 0;">${emp.website ? "🌐 Possui site" : "⚡ SEM SITE (OPORTUNIDADE)"}</p>
          ${emp.telefone ? `<p style="font-size:11px;color:#c084fc;font-family:monospace;margin:0 0 4px 0;">☎ ${emp.telefone}</p>` : ""}
          <div style="font-size:10px;color:#10b981;font-weight:bold;margin-top:6px;">Score: ${emp.score} (${emp.nivel.toUpperCase()})</div>
        </div>
      `);

      lg.addLayer(marker);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  };

  // ── MOTOR DE BUSCA ORIGINAL INTEGRAL (OVERPASS CLUSTER + INSTA + FOODS) ──
  async function buscar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    setStatusTexto(null);
    setResultados(null);
    setSalvos(new Set());

    const limitFinal = parseInt(limite) || 300;

    if (engine === "osint") {
      try {
        const { geocodificar, buscarEmpresas } = await import("@/lib/overpass");
        const { qualificar } = await import("@/lib/qualificacao");

        const cat = getCategoria(categoria);
        if (!cidade || (categoria !== "todos" && !cat)) {
          setCarregando(false);
          return setErro("Informe a localização (cidade) e a categoria.");
        }

        setStatusTexto("Localizando coordenadas no cluster de satélites...");
        const geo = await geocodificar(cidade + (pais ? ", " + pais : ""));
        if (!geo) {
          setCarregando(false);
          return setErro("Cidade não localizada no mapa geográfico. Tente outra cidade.");
        }

        setStatusTexto(`Varrendo até ${limitFinal} alvos no território com zero timeouts...`);
        const tags = cat
          ? cat.tags
          : Array.from(new Set(CATEGORIAS.flatMap((c) => c.tags)));

        const empresasRaw: any[] = [];
        let mult = 1;
        const maxMult = limitFinal > 1500 ? 2 : 1;
        const limiteMult = raioManual !== "auto" ? 1 : maxMult;

        while (mult <= limiteMult) {
          if (mult > 1) {
            setStatusTexto(`Expandindo raio metropolitano (Nível ${mult})... Meta: ${limitFinal} leads.`);
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

        if (empresasRaw.length === 0) {
          setResultados([]);
          setCarregando(false);
          setErro("Nenhum alvo comercial detectado no quadrante selecionado. Tente calibrar o raio ou buscar por 'Todos os Comércios'.");
          return;
        }

        setStatusTexto(`Qualificando ${empresasRaw.length} leads detectados...`);
        const empresas = empresasRaw.map((e) => {
          const q = qualificar({
            website: e.website,
            instagram: e.instagram,
            email: e.email,
            telefone: e.telefone,
            endereco: e.endereco,
          });
          return {
            ...e,
            score: q.score,
            nivel: q.nivel as any,
            lat: e.lat || geo.lat,
            lng: e.lng || geo.lng
          };
        });

        empresas.sort((a: any, b: any) => b.score - a.score || a.nome.localeCompare(b.nome));

        setResultados(empresas);
        setCarregando(false);
        setStatusTexto(null);
        return;
      } catch (err: any) {
        setCarregando(false);
        setErro("Falha no satélite: " + (err.message || "Erro de conexão"));
        return;
      }
    }

    // Motores Instagram e Foods
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

  // ── DEEP SCAN ENRIQUECIMENTO SOCIAL ──
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

  // ── SALVAR INDIVIDUAL NO BANCO ──
  async function salvar(emp: Empresa) {
    const sb = supabaseBrowser();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) {
      alert("Lead adicionado à carteira local.");
      setSalvos((s) => new Set(s).add(emp.osmId));
      return;
    }

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

  // ── SALVAR EM LOTE ORIGINAL ──
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
    if (!user) {
      naoSalvos.forEach(e => salvos.add(e.osmId));
      setSalvos(new Set(salvos));
      setCarregando(false);
      return;
    }

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

  // ── ENRIQUECER LOTE RADAR ORIGINAL ──
  async function enriquecerLoteRadar() {
    if (!resultados) return;
    const semRedes = resultados.filter((e) => !e.instagram);
    if (semRedes.length === 0) return alert("Todos os alvos já possuem dados sociais.");

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

  // ── NOVA FUNÇÃO 1: EXPORTAR CSV / PLANILHA ──
  const exportarCSV = () => {
    if (!resultados || resultados.length === 0) return;
    const cabecalho = ["Nome", "Categoria", "Cidade", "Telefone", "Website", "Instagram", "Email", "Endereço", "Score", "Nível"];
    const linhas = resultados.map(r => [
      `"${r.nome.replace(/"/g, '""')}"`,
      `"${r.categoria}"`,
      `"${r.cidade}"`,
      `"${r.telefone || ""}"`,
      `"${r.website || ""}"`,
      `"${r.instagram || ""}"`,
      `"${r.email || ""}"`,
      `"${(r.endereco || "").replace(/"/g, '""')}"`,
      r.score,
      r.nivel
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [cabecalho.join(","), ...linhas.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `codehard_leads_${cidade.toLowerCase().replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── NOVA FUNÇÃO 2: GERAR MENSAGEM WHATSAPP COM IA ──
  const abrirGeradorMensagem = (emp: Empresa) => {
    setLeadMensagem(emp);
    const msg = `Olá! Tudo bem? Falo com o responsável pela ${emp.nome}?

Me chamo Rodrigo da CODEHARD. Estava analisando a presença digital de comércios aqui em ${emp.cidade} e notei que a ${emp.nome} tem excelente reputação, mas ${emp.website ? "o site de vocês não está com a experiência mobile otimizada" : "vocês ainda não possuem uma página própria de alta conversão"}.

Nós desenvolvemos uma demonstração interativa de como a nova presença digital da ${emp.nome} ficaria no celular (com catálogo e botão de WhatsApp direto).

Posso enviar o link de teste para você dar uma olhada de 1 minuto sem compromisso?`;

    setMensagemGerada(msg);
    setCopiouMsg(false);
  };

  const copiarMensagemWhatsapp = (telefone: string | null) => {
    navigator.clipboard.writeText(mensagemGerada);
    setCopiouMsg(true);
    if (telefone) {
      const cleanPhone = telefone.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(mensagemGerada)}`, "_blank");
    }
  };

  // Filtragem de Nível
  const alvosFiltrados = (resultados || [])
    .filter((e) => (somenteInstagram ? !!e.instagram : true))
    .filter((e) => (filtroNivel === "todos" ? true : e.nivel === filtroNivel));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* ── HEADER TELEMETRIA TESLA COCKPIT ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#180e33] border border-purple-500/40 text-purple-300 mono text-[10px] font-bold uppercase tracking-wider mb-2 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-purple-400" /> Motor de Varredura Multidimensional
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
            Radar OSINT <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500">Unificado</span>
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Descubra milhares de empresas ativas sem presença digital. Escolha o motor tático, amplie o raio geográfico e capture dados enriquecidos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-[#0c0a18] border border-purple-900/40 flex items-center gap-2.5 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="mono text-[11px] text-zinc-300 font-semibold">Overpass Cluster Ativo</span>
          </div>
        </div>
      </motion.div>

      {/* ── SELETOR DE MOTORES TÁTICOS (TESLA OBSIDIAN TABS) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {[
          {
            id: "osint",
            name: "Motor OSINT Maps",
            desc: "OpenStreetMap Global & Raio Metropolitano",
            icon: Globe,
            badge: "Global",
          },
          {
            id: "insta",
            name: "Radar Instagram",
            desc: "Deep Scan por Nicho e Seguidores",
            icon: Camera,
            badge: "Social",
          },
          {
            id: "foods",
            name: "Radar Foods & Delivery",
            desc: "Pizzarias, Sushis e Gastronomia",
            icon: Utensils,
            badge: "Delivery",
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
              className={`p-5 rounded-[24px] border text-left transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                active
                  ? "bg-[#140b2b] border-purple-500 shadow-[0_0_30px_rgba(124,58,237,0.35)]"
                  : "bg-[#0a0815]/80 border-white/[0.08] hover:bg-[#100c22] hover:border-purple-500/30"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                    active ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]" : "bg-white/[0.05] text-zinc-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {active && (
                  <span className="mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-600/30 text-purple-200 border border-purple-500/40">
                    Ativo
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-sm text-white">{tab.name}</h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{tab.desc}</p>
            </button>
          );
        })}
      </div>

      {/* ── PAINEL DE DISPARO DA BUSCA (TESLA GLASS PANEL) ── */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={buscar}
        className="p-6 sm:p-8 rounded-[28px] bg-[#0c0a18]/95 backdrop-blur-2xl border border-purple-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          {/* Campo Categoria / Nicho */}
          {engine === "insta" ? (
            <div className="sm:col-span-4">
              <label className="block text-[11px] mono uppercase tracking-wider text-zinc-400 mb-2 font-bold">
                Nicho / Palavra-Chave
              </label>
              <div className="relative">
                <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  required
                  value={nichoInsta}
                  onChange={(e) => setNichoInsta(e.target.value)}
                  placeholder="Ex: estética, arquitetura, odontologia..."
                  className="w-full bg-[#140f28] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          ) : (
            <div className="sm:col-span-4">
              <label className="block text-[11px] mono uppercase tracking-wider text-zinc-400 mb-2 font-bold">
                Segmento (Alvo)
              </label>
              <div className="relative">
                <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full bg-[#140f28] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer appearance-none"
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
            <label className="block text-[11px] mono uppercase tracking-wider text-zinc-400 mb-2 font-bold">
              Localização (Cidade do Planeta)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                required
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: Barcelona, Roma, Lisboa, São Paulo..."
                className="w-full bg-[#140f28] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Raio Geográfico (Dropdown Original Preservado) */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] mono uppercase tracking-wider text-zinc-400 mb-2 font-bold">
              Raio de Busca
            </label>
            <select
              value={raioManual}
              onChange={(e) => setRaioManual(e.target.value)}
              className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer appearance-none"
            >
              <option value="auto">Auto (Smart)</option>
              <option value="5">5 km (Bairro)</option>
              <option value="10">10 km (Centro)</option>
              <option value="25">25 km (Cidade)</option>
              <option value="50">50 km (Metrópole)</option>
              <option value="100">100 km (Região)</option>
            </select>
          </div>

          {/* Máx Leads (Preservado) */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] mono uppercase tracking-wider text-zinc-400 mb-2 font-bold">
              Máx Leads
            </label>
            <input
              type="number"
              required
              value={limite}
              onChange={(e) => setLimite(e.target.value)}
              placeholder="300"
              className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3 py-3 text-xs text-white text-center focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
        </div>

        {/* Action Button & Telemetry */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Motor calibrado para zero gateway timeouts.</span>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#9333ea] hover:scale-105 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(124,58,237,0.45)] transition-all cursor-pointer"
          >
            {carregando ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Mapeando Satélites...
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
        {statusTexto && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-mono flex items-center gap-2"
          >
            <Activity className="w-4 h-4 animate-spin text-purple-400" />
            <span>{statusTexto}</span>
          </motion.div>
        )}

        {erro && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2"
          >
            <span>⚠️ {erro}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RESULTADOS ENCONTRADOS COM AÇÕES PODEROSAS ── */}
      {resultados && !carregando && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Action Bar Tesla */}
          <div className="p-5 rounded-[26px] bg-[#0c0a18] border border-purple-900/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <span className="font-display font-black text-2xl text-white font-mono">
                {alvosFiltrados.length}
              </span>
              <span className="mono text-xs uppercase tracking-wider text-zinc-400">
                Alvos Detectados
              </span>

              {/* Seletor Tri-Modal: Cards / Tabela / Mapa */}
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-[#140f28] border border-white/10 ml-4">
                <button
                  onClick={() => setModoVisualizacao("cards")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    modoVisualizacao === "cards" ? "bg-purple-600 text-white shadow-md" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> Cards
                </button>

                <button
                  onClick={() => setModoVisualizacao("tabela")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    modoVisualizacao === "tabela" ? "bg-purple-600 text-white shadow-md" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" /> Tabela
                </button>

                <button
                  onClick={() => setModoVisualizacao("mapa")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    modoVisualizacao === "mapa" ? "bg-purple-600 text-white shadow-md" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" /> Mapa Noturno
                </button>
              </div>
            </div>

            {/* Ações em Lote */}
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono uppercase tracking-wider text-zinc-300 cursor-pointer hover:bg-white/[0.08] transition-colors">
                <input
                  type="checkbox"
                  checked={somenteInstagram}
                  onChange={(e) => setSomenteInstagram(e.target.checked)}
                  className="rounded accent-purple-500 cursor-pointer"
                />
                Com Instagram
              </label>

              {/* Botão de Exportar CSV */}
              <button
                onClick={exportarCSV}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Baixar lista em planilha CSV"
              >
                <Download className="w-3.5 h-3.5" /> Exportar CSV
              </button>

              <button
                onClick={() => salvarEmLote()}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-purple-400" /> Salvar Tudo
              </button>

              <button
                onClick={() => salvarEmLote("quente")}
                className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-400/40 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                🔥 Quentes
              </button>

              <button
                onClick={() => salvarEmLote("morno")}
                className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/40 border border-amber-400/40 text-xs font-semibold text-amber-300 transition-colors cursor-pointer"
              >
                💡 Mornos
              </button>

              <button
                onClick={enriquecerLoteRadar}
                disabled={checando !== null}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> {checando ? "Enriquecendo..." : "Enriquecer Lote"}
              </button>
            </div>
          </div>

          {/* ── MODO 01: GRID DE CARDS TESLA COCKPIT ── */}
          {modoVisualizacao === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {alvosFiltrados.map((emp) => {
                const cfg = NIVEL_CONFIG[emp.nivel];
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  emp.nome + " " + (emp.endereco || emp.cidade)
                )}`;

                return (
                  <div
                    key={emp.osmId}
                    className="relative rounded-[26px] bg-[#0c0a18] border border-purple-900/30 hover:border-purple-500/50 transition-all duration-300 p-5 flex flex-col justify-between group overflow-hidden shadow-xl hover:shadow-[0_15px_35px_rgba(124,58,237,0.25)]"
                  >
                    <div>
                      {/* Topo: Nível e Maps */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 border"
                          style={{ borderColor: cfg.border, backgroundColor: cfg.bg, color: cfg.text }}
                        >
                          <span>{cfg.icon}</span>
                          <span>{emp.nivel}</span>
                          <span className="text-white/60">· {emp.score}</span>
                        </span>

                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-500 hover:text-white transition-colors p-1"
                          title="Ver no Google Maps"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <h3
                        className="font-display font-bold text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1 mb-1"
                        title={emp.nome}
                      >
                        {emp.nome}
                      </h3>

                      <p className="mono text-[11px] text-zinc-400 line-clamp-1 mb-4">
                        📍 {emp.endereco || emp.cidade}
                      </p>

                      {/* Metadados Enriquecidos */}
                      <div className="space-y-1.5 text-xs text-zinc-300 mono border-t border-white/[0.06] pt-3">
                        {emp.telefone && (
                          <p className="flex items-center gap-2 truncate">
                            <span className="text-purple-400">📞</span> {emp.telefone}
                          </p>
                        )}
                        {emp.instagram && (
                          <p className="flex items-center gap-2 truncate text-purple-300 font-bold">
                            <span>◆</span> @{emp.instagram.replace("@", "")}
                          </p>
                        )}
                        {emp.website ? (
                          <p className="flex items-center gap-2 text-zinc-400">
                            <span>🌐</span> Tem Website
                          </p>
                        ) : (
                          <p className="flex items-center gap-2 text-purple-400 font-bold">
                            <span>⚡</span> SEM WEBSITE (OPORTUNIDADE)
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center gap-2">
                      {/* Botão de Gerar Mensagem WhatsApp */}
                      <button
                        onClick={() => abrirGeradorMensagem(emp)}
                        className="p-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 transition-colors cursor-pointer"
                        title="Gerar Mensagem de Abordagem com IA"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => checarRedes(emp)}
                        disabled={!!checando}
                        className="flex-1 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[11px] mono font-medium text-white/90 border border-white/[0.08] transition-colors cursor-pointer"
                      >
                        {checando === emp.osmId ? "Scan..." : "Deep Scan"}
                      </button>

                      <button
                        onClick={() => salvar(emp)}
                        disabled={salvos.has(emp.osmId)}
                        className={`flex-1 py-2 rounded-xl text-[11px] mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          salvos.has(emp.osmId)
                            ? "bg-purple-950/40 text-purple-300 border border-purple-500/30"
                            : "bg-purple-600 hover:bg-purple-500 text-white shadow-md"
                        }`}
                      >
                        {salvos.has(emp.osmId) ? "✓ Salvo" : "Salvar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── MODO 02: TABELA EXECUTIVA TESLA ── */}
          {modoVisualizacao === "tabela" && (
            <div className="rounded-[28px] bg-[#0c0a18] border border-purple-900/30 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-zinc-500 font-mono text-[10px] uppercase bg-white/[0.02]">
                      <th className="py-4 px-5">Empresa & Categoria</th>
                      <th className="py-4 px-5">Localização</th>
                      <th className="py-4 px-5">Telefone / WhatsApp</th>
                      <th className="py-4 px-5">Diagnóstico Digital</th>
                      <th className="py-4 px-5">Score</th>
                      <th className="py-4 px-5 text-right">Ações Rápidas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {alvosFiltrados.map((emp) => (
                      <tr key={emp.osmId} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-5">
                          <span className="font-bold text-white text-sm block">{emp.nome}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{emp.categoria}</span>
                        </td>
                        <td className="py-4 px-5 font-mono text-zinc-400">{emp.endereco || emp.cidade}</td>
                        <td className="py-4 px-5 font-mono text-purple-300 font-bold">{emp.telefone || "Não detectado"}</td>
                        <td className="py-4 px-5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                              !emp.website
                                ? "bg-purple-600/20 text-purple-300 border-purple-500/40"
                                : "bg-zinc-800 text-zinc-400 border-zinc-700"
                            }`}
                          >
                            {!emp.website ? "❌ Sem Website" : "🌐 Possui Website"}
                          </span>
                        </td>
                        <td className="py-4 px-5 font-mono font-bold text-white">{emp.score}</td>
                        <td className="py-4 px-5 text-right space-x-2">
                          <button
                            onClick={() => abrirGeradorMensagem(emp)}
                            className="p-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white transition-colors cursor-pointer"
                            title="Gerar Mensagem de Abordagem"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => salvar(emp)}
                            disabled={salvos.has(emp.osmId)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              salvos.has(emp.osmId)
                                ? "bg-purple-950/40 text-purple-300 border border-purple-500/30"
                                : "bg-purple-600 hover:bg-purple-500 text-white shadow-md"
                            }`}
                          >
                            {salvos.has(emp.osmId) ? "✓ Salvo" : "Salvar Lead"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── MODO 03: MAPA SATELITAL DARK MATTER AO VIVO ── */}
          {modoVisualizacao === "mapa" && (
            <div className="rounded-[28px] overflow-hidden border border-purple-500/30 bg-[#06040d] shadow-2xl relative min-h-[580px]">
              <div ref={mapRef} className="w-full h-full min-h-[580px] z-10" />
              <div className="absolute bottom-4 left-4 z-[400] px-4 py-2 rounded-xl bg-[#0c0a18]/90 border border-white/10 backdrop-blur-md text-[11px] font-mono text-zinc-300 flex items-center gap-2 shadow-xl">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>Exibindo {alvosFiltrados.length} pontos no CartoDB Dark Matter</span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ── MODAL GERADOR DE ABORDAGEM WHATSAPP COM IA ── */}
      {leadMensagem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="w-full max-w-xl rounded-[32px] bg-[#0c0a18] border border-purple-500/40 shadow-[0_0_50px_rgba(124,58,237,0.4)] p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">
                  ABORDAGEM CONSULTIVA CODEHARD
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{leadMensagem.nome}</h3>
              </div>

              <button
                onClick={() => setLeadMensagem(null)}
                className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400">Mensagem Personalizada de Alto Impacto:</label>
              <textarea
                rows={7}
                value={mensagemGerada}
                onChange={(e) => setMensagemGerada(e.target.value)}
                className="w-full bg-[#06040d] border border-purple-900/40 rounded-2xl p-4 text-xs font-mono text-zinc-200 focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(mensagemGerada);
                  setCopiouMsg(true);
                  setTimeout(() => setCopiouMsg(false), 2000);
                }}
                className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiouMsg ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiouMsg ? "Copiado!" : "Copiar Texto"}
              </button>

              <button
                onClick={() => copiarMensagemWhatsapp(leadMensagem.telefone)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" /> Enviar no WhatsApp Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
