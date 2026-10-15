"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, LayerGroup, LeafletMouseEvent, Circle } from "leaflet";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { CATEGORIAS } from "@/lib/categorias";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, Search, Target, Radio, Layers, Phone, Globe, ExternalLink,
  Shield, Check, Crosshair, MapPin, Zap, RefreshCw, Filter, Sparkles, Building2
} from "lucide-react";
import CodeHardLogo from "@/components/codemakers/CodeHardLogo";
import HardyMascot from "@/components/codemakers/HardyMascot";

type Resultado = {
  osmId: string;
  nome: string;
  categoria: string;
  cidade: string;
  pais: string;
  lat: number;
  lng: number;
  telefone: string | null;
  website: string | null;
  instagram: string | null;
  email: string | null;
  endereco: string;
  score: number;
  nivel: "quente" | "morno" | "frio";
};

const PRESET_CIDADES = [
  "São Paulo, SP",
  "Rio de Janeiro, RJ",
  "Belo Horizonte, MG",
  "Curitiba, PR",
  "Porto Alegre, RS",
  "Brasília, DF",
  "Salvador, BA",
  "Lisboa, Portugal",
  "Porto, Portugal",
  "Roma, Itália"
];

export default function MapaPage() {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const camadaRef = useRef<LayerGroup | null>(null);
  const raioCirculoRef = useRef<Circle | null>(null);

  const [pronto, setPronto] = useState(false);
  const [cidade, setCidade] = useState("São Paulo, SP");
  const [limite, setLimite] = useState("300");
  const [cat, setCat] = useState("todos");
  const [raioKm, setRaioKm] = useState(15);
  const [filtroNivel, setFiltroNivel] = useState<"todos" | "quente" | "morno" | "frio">("todos");
  const [resultados, setResultados] = useState<Resultado[] | null>(null);
  const [centro, setCentro] = useState<{ cidade: string; pais: string; lat: number; lng: number } | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [salvos, setSalvos] = useState<Set<string>>(new Set());
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const ocupadoRef = useRef(false);
  const catRef = useRef(cat);
  catRef.current = cat;

  // ── INICIALIZAÇÃO DO MAPA CARTOGRÁFICO ESCURO (CARTO DARK MATTER) ──
  useEffect(() => {
    let cancel = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancel || !divRef.current || mapRef.current) return;

      // Criação do Mapa em coordenadas iniciais (São Paulo)
      const map = L.map(divRef.current, {
        worldCopyJump: true,
        zoomControl: false,
        attributionControl: false
      }).setView([-23.5505, -46.6333], 12);

      // CartoDB Dark Matter: O padrão ouro de cartografia noturna ultra-nítida
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      // Controles de Zoom personalizados no tema escuro
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Grupo de marcadores
      camadaRef.current = L.layerGroup().addTo(map);

      // Clique no mapa dispara varredura local no ponto
      map.on("click", (e: LeafletMouseEvent) => {
        buscar({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      mapRef.current = map;
      setPronto(true);

      // Invalidação de tamanho para evitar sharding ou tiles cinzas
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    })();

    return () => {
      cancel = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recalcular tamanho do mapa em resize da janela
  useEffect(() => {
    const handleResize = () => {
      mapRef.current?.invalidateSize();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── MOTOR DE BUSCA VIA OVERPASS / SATÉLITE ──
  async function buscar(p: { cidade?: string; lat?: number; lng?: number; limit?: number }) {
    if (ocupadoRef.current) return;
    ocupadoRef.current = true;
    setCarregando(true);
    setErro(null);
    setSelecionado(null);

    try {
      const res = await fetch("/api/buscar-mapa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...p,
          categoriaId: catRef.current,
          limit: p.limit || parseInt(limite) || 300
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErro(json.erro || "Falha na sincronização geoespacial.");
        return;
      }

      const listaResultados: Resultado[] = json.resultados || [];
      setResultados(listaResultados);
      setCentro({ cidade: json.cidade, pais: json.pais, lat: json.lat, lng: json.lng });

      const L = (await import("leaflet")).default;
      const map = mapRef.current;

      if (map && camadaRef.current) {
        map.flyTo([json.lat, json.lng], p.cidade ? 13 : 14, {
          duration: 1.5,
          easeLinearity: 0.25
        });

        camadaRef.current.clearLayers();

        // Círculo translúcido do raio de busca
        if (raioCirculoRef.current) {
          raioCirculoRef.current.remove();
        }

        raioCirculoRef.current = L.circle([json.lat, json.lng], {
          radius: raioKm * 1000,
          color: "#7c3aed",
          weight: 1.5,
          fillColor: "#7c3aed",
          fillOpacity: 0.12,
          dashArray: "6 8"
        }).addTo(map);

        // Marcador central P1
        const p1Icon = L.divIcon({
          className: "custom-p1-marker",
          html: `
            <div style="position:relative;display:flex;align-items:center;justify-content:center;width:32px;height:32px;">
              <div style="position:absolute;width:32px;height:32px;border-radius:50%;background:rgba(124,58,237,0.4);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
              <div style="width:20px;height:20px;border-radius:50%;background:#7c3aed;border:2.5px solid #ffffff;box-shadow:0 0 15px #c084fc;display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:900;font-family:monospace;">P1</div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        L.marker([json.lat, json.lng], { icon: p1Icon })
          .bindPopup(`<b>Ponto Central de Varredura</b><br>${json.cidade}`)
          .addTo(camadaRef.current);

        // Plotagem de cada empresa encontrada
        for (const r of listaResultados) {
          const isQuente = r.nivel === "quente";
          const cor = isQuente ? "#c084fc" : r.nivel === "morno" ? "#a855f7" : "#64748b";

          const marker = L.circleMarker([r.lat, r.lng], {
            radius: isQuente ? 7 : 5,
            color: "#ffffff",
            weight: 1.5,
            fillColor: cor,
            fillOpacity: 0.9,
          });

          // Popup estilizado em Dark Mode
          const popupContent = `
            <div style="background:#0c0a18;color:#fff;padding:10px;border-radius:12px;font-family:sans-serif;font-size:12px;border:1px solid rgba(124,58,237,0.3);min-width:180px;">
              <span style="font-size:9px;font-family:monospace;color:#c084fc;font-weight:bold;text-transform:uppercase;">${r.categoria}</span>
              <h4 style="font-size:13px;font-weight:bold;margin:3px 0 6px 0;color:#ffffff;">${r.nome}</h4>
              <p style="font-size:11px;color:#94a3b8;margin:0 0 8px 0;">${r.website ? "Possui website" : "❌ Sem website profissional"}</p>
              ${r.telefone ? `<p style="font-size:11px;color:#c084fc;font-family:monospace;margin:0 0 6px 0;">☎ ${r.telefone}</p>` : ""}
              <div style="font-size:10px;color:#38bdf8;font-weight:bold;">Score de Oportunidade: ${r.score}</div>
            </div>
          `;

          marker.bindPopup(popupContent);
          marker.on("click", () => destacar(r.osmId));
          camadaRef.current.addLayer(marker);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErro("Erro de conexão ao satélite OSINT. Tente novamente.");
    } finally {
      setCarregando(false);
      ocupadoRef.current = false;
    }
  }

  function destacar(osmId: string) {
    setSelecionado(osmId);
    document.getElementById("lead-card-" + osmId.replace(/[^\w-]/g, "_"))?.scrollIntoView({
      block: "nearest",
      behavior: "smooth"
    });
  }

  async function salvar(emp: Resultado) {
    const sb = supabaseBrowser();
    const { data: { user } } = await sb.auth.getUser();

    if (!user) {
      alert("Alvo salvo na carteira local temporária.");
      setSalvos((s) => new Set(s).add(emp.osmId));
      return;
    }

    const { error } = await sb.from("leads").upsert({
      user_id: user.id,
      nome: emp.nome,
      categoria: emp.categoria,
      cidade: emp.cidade,
      pais: emp.pais,
      telefone: emp.telefone,
      website: emp.website,
      instagram: emp.instagram,
      email: emp.email,
      fonte: "osm_dark",
      osm_id: emp.osmId,
      score: emp.score,
      nivel: emp.nivel,
    }, { onConflict: "user_id,osm_id", ignoreDuplicates: true });

    if (!error) {
      setSalvos((s) => new Set(s).add(emp.osmId));
    }
  }

  async function salvarTodos() {
    if (!resultados) return;
    const naoSalvos = resultados.filter((e) => !salvos.has(e.osmId));
    if (naoSalvos.length === 0) return;

    setCarregando(true);
    for (const emp of naoSalvos) {
      await salvar(emp);
    }
    setCarregando(false);
  }

  const resultadosFiltrados = resultados?.filter((r) => {
    if (filtroNivel === "todos") return true;
    return r.nivel === filtroNivel;
  }) || [];

  return (
    <div className="space-y-6">
      {/* ── TOP TELEMETRY BAR: TESLA COCKPIT HEADER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Banner Identidade Cartográfica */}
        <div className="lg:col-span-5 p-5 rounded-[26px] bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] border border-purple-400/30 flex items-center justify-between shadow-[0_15px_35px_rgba(124,58,237,0.3)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black/25 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold block">
                TERMINAL CARTOGRÁFICO OSINT · TESLA FSD
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">Cartografia Noturna.</h1>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] font-mono text-purple-200 uppercase font-bold">CartoDB Dark Matter</span>
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Sincronizado
            </span>
          </div>
        </div>

        {/* Status de Cobertura */}
        <div className="lg:col-span-4 p-5 rounded-[26px] bg-[#0a0815]/90 border border-white/[0.08] flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold block">TERRITÓRIO ATIVO</span>
            <span className="text-base font-bold text-white mt-0.5 block truncate">
              {centro ? `${centro.cidade}, ${centro.pais}` : "Selecione uma coordenada"}
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              {resultados ? `${resultados.length} alvos mapeados no raio` : "Pronto para varredura"}
            </span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black font-mono text-purple-400">
              {resultados ? `${Math.round((resultados.filter(r => !r.website).length / (resultados.length || 1)) * 100)}%` : "0%"}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono block">Déficit Digital</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="lg:col-span-3 p-5 rounded-[26px] bg-[#0a0815]/90 border border-white/[0.08] flex flex-col justify-between shadow-xl">
          <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold block">CAPITAIS RÁPIDAS</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {["São Paulo", "Rio", "Lisboa", "Curitiba"].map((city) => (
              <button
                key={city}
                onClick={() => {
                  setCidade(city);
                  buscar({ cidade: city });
                }}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-purple-600/30 border border-white/10 text-white text-[11px] font-semibold transition-all cursor-pointer"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESLA AUTOPILOT FLOATING CONTROL BAR ── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (cidade.trim()) buscar({ cidade: cidade.trim() });
        }}
        className="p-3.5 rounded-[24px] bg-[#0c0a18]/95 backdrop-blur-2xl border border-purple-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-wrap items-center gap-3"
      >
        {/* Categoria */}
        <div className="flex-1 min-w-[200px]">
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="todos">Todos os Comércios & Serviços</option>
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Cidade Input */}
        <div className="flex-[1.5] min-w-[220px] relative">
          <MapPin className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Digite qualquer cidade do mundo..."
            className="w-full bg-[#140f28] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
            required
          />
        </div>

        {/* Raio Selector */}
        <div className="w-28 flex items-center gap-1.5 bg-[#140f28] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white">
          <span className="text-[10px] text-zinc-400 font-mono">Raio:</span>
          <select
            value={raioKm}
            onChange={(e) => setRaioKm(Number(e.target.value))}
            className="bg-transparent text-xs text-purple-300 font-bold focus:outline-none cursor-pointer"
          >
            <option value={5} className="bg-[#140f28]">5 km</option>
            <option value={10} className="bg-[#140f28]">10 km</option>
            <option value={15} className="bg-[#140f28]">15 km</option>
            <option value={25} className="bg-[#140f28]">25 km</option>
            <option value={50} className="bg-[#140f28]">50 km</option>
          </select>
        </div>

        {/* Limite */}
        <div className="w-24 bg-[#140f28] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white">
          <input
            type="number"
            value={limite}
            onChange={(e) => setLimite(e.target.value)}
            placeholder="300"
            className="w-full bg-transparent text-center font-mono focus:outline-none"
            title="Máx Leads"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={carregando || !pronto}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#9333ea] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all cursor-pointer whitespace-nowrap"
        >
          {carregando ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Mapeando satélite...
            </>
          ) : (
            <>
              <Radio className="w-3.5 h-3.5" /> Disparar Varredura
            </>
          )}
        </button>
      </form>

      {/* ── MAIN WORKSPACE: MAPA CARTOGRÁFICO À ESQUERDA + DRAWER À DIREITA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        {/* Mapa Leaflet Escuro (lg:col-span-8) */}
        <div className="lg:col-span-8 rounded-[28px] overflow-hidden border border-purple-500/30 bg-[#06040d] shadow-2xl relative flex flex-col">
          <div ref={divRef} className="w-full h-full min-h-[580px] z-10" />

          {/* Radar Overlay Animado quando Carregando */}
          <AnimatePresence>
            {carregando && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[500] flex flex-col items-center justify-center bg-black/75 backdrop-blur-md"
              >
                <div className="w-24 h-24 rounded-full border-2 border-purple-500/40 relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-30" />
                  <div className="w-16 h-16 rounded-full border border-purple-400/60 bg-purple-600/20 flex items-center justify-center">
                    <Crosshair className="w-8 h-8 text-purple-300 animate-spin" />
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-white uppercase tracking-widest mt-4">
                  Decodificando vetores do território...
                </span>
                <span className="text-[11px] text-zinc-400 font-mono mt-1">
                  Verificando presença na web, DNS e WhatsApp ativo
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Map Footer Bar */}
          <div className="absolute bottom-4 left-4 z-[400] flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-[#0c0a18]/90 border border-white/10 backdrop-blur-md text-[10px] font-mono text-zinc-400 flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>Clique em qualquer coordenada para varredura imediata</span>
            </div>
          </div>
        </div>

        {/* Drawer de Alvos e Oportunidades (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Header do Drawer */}
          <div className="p-5 rounded-[26px] bg-[#0a0815]/90 border border-white/[0.08] shadow-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">ALVOS IDENTIFICADOS</span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {resultadosFiltrados.length} empresas no radar
              </h3>
            </div>

            {resultados && resultados.length > 0 && (
              <button
                onClick={salvarTodos}
                disabled={carregando || resultados.every((e) => salvos.has(e.osmId))}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-400/40 text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
              >
                Salvar Todos
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          {resultados && resultados.length > 0 && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0a0815] border border-white/[0.06] text-xs">
              {(["todos", "quente", "morno", "frio"] as const).map((nivel) => (
                <button
                  key={nivel}
                  onClick={() => setFiltroNivel(nivel)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-mono uppercase font-bold transition-all ${
                    filtroNivel === nivel
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {nivel}
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!resultados && !carregando && (
            <div className="flex-1 p-8 rounded-[28px] bg-[#0a0815]/90 border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-20 h-20 opacity-80">
                <HardyMascot variant="radar" className="w-full h-full" />
              </div>
              <h4 className="text-sm font-bold text-white">Nenhuma varredura ativa</h4>
              <p className="text-xs text-zinc-400 max-w-xs">
                Digite uma cidade ou clique em qualquer ponto do mapa para rastrear empresas sem site.
              </p>
            </div>
          )}

          {/* Lista de Alvos com Cards Tesla Dark Glass */}
          <div className="flex-1 max-h-[500px] overflow-y-auto space-y-3 pr-1">
            {resultadosFiltrados.map((emp) => {
              const id = "lead-card-" + emp.osmId.replace(/[^\w-]/g, "_");
              const isSalvo = salvos.has(emp.osmId);
              const isSelected = selecionado === emp.osmId;

              return (
                <div
                  key={emp.osmId}
                  id={id}
                  onClick={() => destacar(emp.osmId)}
                  className={`p-4 rounded-2xl transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-950/60 border-2 border-purple-500 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                      : "bg-[#0c0a18]/90 border border-purple-900/25 hover:border-purple-500/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-sm font-bold text-white truncate">{emp.nome}</h4>
                      <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">{emp.categoria}</span>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        emp.nivel === "quente"
                          ? "bg-purple-600/30 text-purple-300 border-purple-400/50"
                          : emp.nivel === "morno"
                          ? "bg-amber-600/20 text-amber-300 border-amber-400/40"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}
                    >
                      {emp.nivel.toUpperCase()} · {emp.score}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-white/[0.04]">
                    <span>{emp.website ? "Possui Website" : "❌ Sem Website"}</span>
                    {emp.telefone && (
                      <span className="font-mono text-purple-300 font-bold">{emp.telefone}</span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        salvar(emp);
                      }}
                      disabled={isSalvo}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSalvo
                          ? "bg-emerald-950/60 border border-emerald-500/30 text-emerald-300"
                          : "bg-purple-600 hover:bg-purple-500 text-white shadow-md cursor-pointer"
                      }`}
                    >
                      {isSalvo ? "✓ Salvo no CRM" : "+ Adicionar ao CRM"}
                    </button>

                    {emp.telefone && (
                      <a
                        href={`https://wa.me/${emp.telefone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 transition-colors"
                        title="Abrir WhatsApp"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
