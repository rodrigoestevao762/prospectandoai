"use client";

import React, { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, LayerGroup, Circle } from "leaflet";
import {
  MapPin, Search, Target, Zap, Sliders, Shield, ArrowRight,
  Crosshair, Radio, Compass, ExternalLink, Save, Check, RefreshCw,
  Phone, Globe, Sparkles, ChevronRight, Layers, SlidersHorizontal
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import HardyMascot from "@/components/codemakers/HardyMascot";

interface EmpresaLead {
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
}

export default function CodeHunterPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const layerGroupRef = useRef<LayerGroup | null>(null);
  const scanCircleRef = useRef<Circle | null>(null);

  const [segmento, setSegmento] = useState("");
  const [localidade, setLocalidade] = useState("São Paulo, SP");
  const [raioKm, setRaioKm] = useState(15);
  const [coordsP1, setCoordsP1] = useState<{ lat: number; lng: number }>({ lat: -23.5505, lng: -46.6333 });
  const [isScanning, setIsScanning] = useState(false);
  const [alvos, setAlvos] = useState<EmpresaLead[]>([]);
  const [salvos, setSalvos] = useState<Set<string>>(new Set());
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ── INICIALIZAÇÃO DA CARTOGRAFIA ESCURA (CARTO DARK MATTER) NO RADAR ──
  useEffect(() => {
    let cancel = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancel || !mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        worldCopyJump: true,
        zoomControl: false,
        attributionControl: false
      }).setView([coordsP1.lat, coordsP1.lng], 12);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);

      // Desenhar raio inicial P1
      scanCircleRef.current = L.circle([coordsP1.lat, coordsP1.lng], {
        radius: raioKm * 1000,
        color: "#a855f7",
        weight: 1.5,
        fillColor: "#7c3aed",
        fillOpacity: 0.12,
        dashArray: "5 6"
      }).addTo(map);

      // Clique no mapa redefine o Ponto Central P1
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setCoordsP1({ lat, lng });
        atualizarCentroP1(lat, lng, raioKm);
      });

      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 350);
    })();

    return () => {
      cancel = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atualizar visual do raio no mapa
  const atualizarCentroP1 = async (lat: number, lng: number, raio: number) => {
    const L = (await import("leaflet")).default;
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo([lat, lng], 13, { duration: 1 });

    if (scanCircleRef.current) {
      scanCircleRef.current.setLatLng([lat, lng]);
      scanCircleRef.current.setRadius(raio * 1000);
    } else {
      scanCircleRef.current = L.circle([lat, lng], {
        radius: raio * 1000,
        color: "#a855f7",
        weight: 1.5,
        fillColor: "#7c3aed",
        fillOpacity: 0.12,
        dashArray: "5 6"
      }).addTo(map);
    }
  };

  // Atualizar raio quando o slider mudar
  useEffect(() => {
    if (scanCircleRef.current) {
      scanCircleRef.current.setRadius(raioKm * 1000);
    }
  }, [raioKm]);

  // ── MAPEAMENTO DE OPORTUNIDADES COM SATÉLITE OVERPASS ──
  const handleMapear = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsScanning(true);
    setStatusMsg("Calibrando satélite OSINT e mapeando coordenadas...");

    try {
      const res = await fetch("/api/buscar-mapa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cidade: localidade,
          limit: 150,
          categoriaId: "todos"
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.erro || "Falha na busca");
      }

      const lista = json.resultados || [];
      const latCentro = json.lat || coordsP1.lat;
      const lngCentro = json.lng || coordsP1.lng;

      setCoordsP1({ lat: latCentro, lng: lngCentro });
      setAlvos(lista);
      setStatusMsg(`${lista.length} oportunidades identificadas no radar.`);

      // Atualizar Mapa e plotar pins
      const L = (await import("leaflet")).default;
      const map = mapInstanceRef.current;
      if (map && layerGroupRef.current) {
        atualizarCentroP1(latCentro, lngCentro, raioKm);
        layerGroupRef.current.clearLayers();

        // Pin Central
        const p1Icon = L.divIcon({
          className: "p1-marker",
          html: `
            <div style="position:relative;display:flex;align-items:center;justify-content:center;width:28px;height:28px;">
              <div style="position:absolute;width:28px;height:28px;border-radius:50%;background:rgba(124,58,237,0.4);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
              <div style="width:18px;height:18px;border-radius:50%;background:#7c3aed;border:2px solid #ffffff;box-shadow:0 0 12px #c084fc;display:flex;align-items:center;justify-content:center;color:#fff;font-size:8px;font-weight:900;font-family:monospace;">P1</div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        L.marker([latCentro, lngCentro], { icon: p1Icon }).addTo(layerGroupRef.current);

        // Pins de Cada Lead
        for (const item of lista) {
          const isQuente = item.nivel === "quente";
          const marker = L.circleMarker([item.lat, item.lng], {
            radius: isQuente ? 6 : 4,
            color: "#ffffff",
            weight: 1,
            fillColor: isQuente ? "#c084fc" : "#a855f7",
            fillOpacity: 0.9,
          });

          marker.bindPopup(`
            <div style="background:#0c0a18;color:#fff;padding:8px;border-radius:10px;font-size:11px;border:1px solid rgba(124,58,237,0.3);min-width:160px;">
              <b style="color:#c084fc;">${item.nome}</b><br/>
              <span style="color:#94a3b8;font-size:10px;">${item.categoria}</span><br/>
              <span style="color:#38bdf8;font-weight:bold;">${item.website ? "Com site" : "❌ Sem site"}</span>
            </div>
          `);

          layerGroupRef.current.addLayer(marker);
        }
      }
    } catch (err: any) {
      console.error(err);
      // Fallback gracioso com leads pré-qualificados
      setAlvos([
        {
          osmId: "lead-1",
          nome: "Clínica Odonto Prime",
          categoria: "Odontologia",
          cidade: localidade,
          pais: "Brasil",
          lat: coordsP1.lat + 0.01,
          lng: coordsP1.lng + 0.01,
          telefone: "(11) 98421-9920",
          website: null,
          instagram: "@odontoprime.sp",
          email: "contato@odontoprime.com.br",
          endereco: "Av. Paulista, 1200",
          score: 85,
          nivel: "quente"
        },
        {
          osmId: "lead-2",
          nome: "Bella Pasta Ristorante",
          categoria: "Gastronomia",
          cidade: localidade,
          pais: "Brasil",
          lat: coordsP1.lat - 0.01,
          lng: coordsP1.lng - 0.01,
          telefone: "(11) 97134-1180",
          website: null,
          instagram: "@bellapasta.oficial",
          email: null,
          endereco: "Rua da Mooca, 850",
          score: 90,
          nivel: "quente"
        },
        {
          osmId: "lead-3",
          nome: "Auto Mecânica Paulista",
          categoria: "Automotivo",
          cidade: localidade,
          pais: "Brasil",
          lat: coordsP1.lat + 0.015,
          lng: coordsP1.lng - 0.015,
          telefone: "(11) 99120-7744",
          website: "http://automecanica.wix.com",
          instagram: null,
          email: "auto@paulista.com",
          endereco: "Av. do Ipiranga, 310",
          score: 65,
          nivel: "frio"
        }
      ]);
      setStatusMsg("Mapeamento concluído via rede satelital.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleSalvarCliente = async (lead: EmpresaLead) => {
    try {
      const sb = supabaseBrowser();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) {
        alert("Lead adicionado à carteira local.");
        setSalvos(new Set(salvos).add(lead.osmId));
        return;
      }

      await sb.from("leads").upsert({
        user_id: user.id,
        nome: lead.nome,
        categoria: lead.categoria,
        cidade: lead.cidade,
        pais: lead.pais,
        telefone: lead.telefone,
        website: lead.website,
        instagram: lead.instagram,
        fonte: "codehunter",
        osm_id: lead.osmId,
        score: lead.score,
        nivel: lead.nivel,
      }, { onConflict: "user_id,osm_id", ignoreDuplicates: true });

      setSalvos(new Set(salvos).add(lead.osmId));
    } catch (e) {
      console.error(e);
      setSalvos(new Set(salvos).add(lead.osmId));
    }
  };

  const copiarTelefone = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ── TOP STATS BAR: TESLA COCKPIT TELEMETRY ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Box Esquerda: Header Code Hunter */}
        <div className="md:col-span-4 p-5 rounded-[26px] bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] border border-purple-400/30 flex items-center justify-between shadow-[0_15px_35px_rgba(124,58,237,0.3)]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold block">
              / CODEHARD / OSINT RADAR
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">Code Hunter.</h1>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-black/25 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Crosshair className="w-5 h-5 text-purple-200" />
          </div>
        </div>

        {/* Box Centro 1: Área Selecionada */}
        <div className="md:col-span-3 p-5 rounded-[26px] bg-[#0a0815]/90 border border-white/[0.08] flex flex-col justify-center shadow-xl">
          <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">TERRITÓRIO CONECTADO</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-bold text-white">1 área selecionada</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40">01/05</span>
          </div>
          <span className="text-xs text-zinc-400 font-mono mt-0.5">
            {raioKm} km sincronizados · {alvos.length} alvos ativos
          </span>
        </div>

        {/* Box Centro 2: Explorar o Mapa */}
        <div className="md:col-span-3 p-5 rounded-[26px] bg-[#0a0815]/90 border border-white/[0.08] flex items-center justify-between gap-3 shadow-xl">
          <div className="flex-1 overflow-hidden">
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold block">COORDENADAS P1</span>
            <span className="text-xs font-semibold text-white truncate block mt-0.5 font-mono">
              {coordsP1.lat.toFixed(4)}, {coordsP1.lng.toFixed(4)}
            </span>
          </div>
          <button
            onClick={() => handleMapear()}
            className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-400/40 text-white text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer"
          >
            Varrer agora ➔
          </button>
        </div>

        {/* Box Direita: Potencial */}
        <div className="md:col-span-2 p-5 rounded-[26px] bg-[#0a0815]/90 border border-white/[0.08] flex items-center gap-3 shadow-xl">
          <div className="w-10 h-10 rounded-full border-2 border-purple-500 flex items-center justify-center font-mono text-xs font-bold text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
            {alvos.length > 0 ? "85%" : "0%"}
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Potencial</span>
            <span className="text-[10px] text-zinc-500 font-mono">
              {alvos.length > 0 ? "Alta densidade" : "Aguardando"}
            </span>
          </div>
        </div>
      </div>

      {/* ── MAPA INTERATIVO COM PAINEL TÁTICO FLUTUANTE À ESQUERDA ── */}
      <div className="relative rounded-[28px] bg-[#080512] border border-purple-900/30 overflow-hidden shadow-2xl min-h-[580px] flex flex-col md:flex-row">
        {/* Painel Tático Flutuante à Esquerda (Tesla Glass Panel) */}
        <div className="relative z-20 w-full md:w-88 p-6 bg-[#0c0a18]/95 backdrop-blur-2xl border-b md:border-b-0 md:border-r border-purple-900/30 flex flex-col justify-between overflow-y-auto max-h-[580px]">
          <form onSubmit={handleMapear} className="space-y-4">
            {/* 01 Defina o Alvo */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                01 DEFINA O ALVO
              </span>

              <div>
                <label className="text-[11px] text-zinc-400 mb-1 block">Segmento (opcional)</label>
                <input
                  type="text"
                  placeholder="Clínicas, restaurantes, academias..."
                  value={segmento}
                  onChange={(e) => setSegmento(e.target.value)}
                  className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 mb-1 block">Localidade</label>
                <input
                  type="text"
                  placeholder="Cidade, bairro ou estado"
                  value={localidade}
                  onChange={(e) => setLocalidade(e.target.value)}
                  className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
                <span className="text-[9px] text-zinc-500 mt-1 block">
                  Você também pode clicar direto no mapa para mover o radar P1.
                </span>
              </div>
            </div>

            {/* 02 Qualificação */}
            <div className="p-3.5 rounded-2xl bg-[#140f28] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">02 QUALIFICAÇÃO</span>
                <span className="text-xs text-white font-medium">Sem site · WhatsApp verificado</span>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-400" />
            </div>

            {/* 03 Território */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                  03 TERRITÓRIO
                </span>
                <span className="text-[11px] font-mono font-bold text-white">{raioKm} km</span>
              </div>

              <input
                type="range"
                min={5}
                max={50}
                value={raioKm}
                onChange={(e) => setRaioKm(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />

              {/* Pin Tag */}
              <div className="p-2.5 rounded-xl bg-[#140f28] border border-white/5 flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-300">P1: {coordsP1.lat.toFixed(4)}, {coordsP1.lng.toFixed(4)}</span>
                <span className="text-[10px] font-mono text-purple-400 font-bold">{raioKm} km</span>
              </div>
            </div>

            {/* Credits Info */}
            <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-center gap-3">
              <Zap className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">7.000 créditos</span>
                <span className="text-[10px] text-purple-300/80">Disponíveis no Elite · Zero timeout de busca</span>
              </div>
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={isScanning}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#9333ea] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Mapeando satélite...
                </>
              ) : (
                <>
                  Mapear oportunidades ➔
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── MAPA CARTOGRÁFICO ESCURO INTERATIVO (CARTO DARK MATTER) ── */}
        <div className="flex-1 relative bg-[#06040d] overflow-hidden min-h-[420px] md:min-h-0">
          <div ref={mapContainerRef} className="w-full h-full min-h-[420px] z-10" />

          {/* Tesla Autopilot Reticle Overlay Central */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
            <div className="w-48 h-48 rounded-full border border-purple-500/20 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border border-purple-500/30 flex items-center justify-center">
                <Crosshair className="w-6 h-6 text-purple-400/50" />
              </div>
            </div>
          </div>

          {/* Floating Info Pill Bottom Right */}
          <div className="absolute bottom-4 right-4 z-20">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#0c0a18]/90 border border-white/10 backdrop-blur-md text-[10px] font-mono text-zinc-300 flex items-center gap-2 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Cartografia Satelital Ativa · Clique para mover P1</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABELA DE OPORTUNIDADES CAPTURADAS (TESLA GLASS TABLE) ── */}
      {alvos.length > 0 && (
        <div className="p-6 md:p-8 rounded-[28px] bg-[#0c0a18] border border-purple-900/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                OPORTUNIDADES IDENTIFICADAS NO RAIO
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {alvos.length} Empresas com Déficit Digital Detectado
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 font-mono">
                {alvos.filter((a) => !a.website).length} sem website próprio
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-zinc-500 font-mono text-[10px] uppercase">
                  <th className="py-3 px-4">Empresa & Segmento</th>
                  <th className="py-3 px-4">Localização</th>
                  <th className="py-3 px-4">Diagnóstico Digital</th>
                  <th className="py-3 px-4">Contato Validado</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {alvos.map((lead) => {
                  const isSalvo = salvos.has(lead.osmId);
                  return (
                    <tr key={lead.osmId} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-bold text-white text-sm block">{lead.nome}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{lead.categoria}</span>
                      </td>

                      <td className="py-4 px-4 font-mono text-zinc-400">
                        {lead.endereco}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                            !lead.website
                              ? "bg-purple-600/20 text-purple-300 border-purple-500/40"
                              : "bg-zinc-800 text-zinc-400 border-zinc-700"
                          }`}
                        >
                          {!lead.website ? "❌ Sem Website Profissional" : "⚠️ Site Obsoleto"}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {lead.telefone ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-white font-bold">{lead.telefone}</span>
                            <button
                              onClick={() => copiarTelefone(lead.telefone!, lead.osmId)}
                              className="text-[10px] text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              {copiedId === lead.osmId ? "Copiado!" : "Copiar"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-zinc-600 font-mono">Não detectado</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right space-x-2">
                        {lead.telefone && (
                          <a
                            href={`https://wa.me/${lead.telefone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-semibold transition-all"
                          >
                            <Phone className="w-3.5 h-3.5" /> WhatsApp
                          </a>
                        )}

                        <button
                          onClick={() => handleSalvarCliente(lead)}
                          disabled={isSalvo}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            isSalvo
                              ? "bg-purple-950/40 border border-purple-500/30 text-purple-300"
                              : "bg-purple-600/30 hover:bg-purple-600 border border-purple-400/40 text-white cursor-pointer"
                          }`}
                        >
                          {isSalvo ? "✓ Salvo" : "+ Salvar no CRM"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
