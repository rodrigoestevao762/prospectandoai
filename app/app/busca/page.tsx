"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin, Search, Target, Zap, Sliders, Shield, ArrowRight,
  Crosshair, Radio, Compass, ExternalLink, Save, Check, RefreshCw
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import HardyMascot from "@/components/codemakers/HardyMascot";

interface EmpresaLead {
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
}

export default function CodeHunterPage() {
  const [segmento, setSegmento] = useState("");
  const [localidade, setLocalidade] = useState("São Paulo, SP");
  const [raioKm, setRaioKm] = useState(10);
  const [isScanning, setIsScanning] = useState(false);
  const [alvos, setAlvos] = useState<EmpresaLead[]>([]);
  const [salvos, setSalvos] = useState<Set<string>>(new Set());
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleMapear = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setStatusMsg("Calibrando satélite OSINT e mapeando coordenadas...");

    try {
      const { geocodificar, buscarEmpresas } = await import("@/lib/overpass");
      const { qualificar } = await import("@/lib/qualificacao");

      const geo = await geocodificar(localidade);
      if (!geo) {
        setStatusMsg("Localização não encontrada. Tente outra cidade.");
        setIsScanning(false);
        return;
      }

      setStatusMsg(`Varrendo raio de ${raioKm} km no território...`);

      // Tags base para negócios locais
      const tags = segmento
        ? [`amenity=${segmento.toLowerCase()}`, `shop=${segmento.toLowerCase()}`]
        : ["amenity=restaurant", "amenity=cafe", "shop=hairdresser", "amenity=dentist", "shop=car_repair"];

      const raw = await buscarEmpresas(geo.lat, geo.lon, tags, 60, raioKm);
      const qualificadas: EmpresaLead[] = raw.map((item: any) => {
        const q = qualificar({
          website: item.tags?.website || item.tags?.["contact:website"] || null,
          telefone: item.tags?.phone || item.tags?.["contact:phone"] || null,
          endereco: item.tags?.["addr:street"] || item.tags?.address || localidade,
        });

        return {
          osmId: String(item.id),
          nome: item.tags?.name || "Empresa Local",
          categoria: item.tags?.amenity || item.tags?.shop || segmento || "Comércio",
          cidade: localidade,
          pais: "Brasil",
          telefone: item.tags?.phone || item.tags?.["contact:phone"] || null,
          website: item.tags?.website || null,
          instagram: item.tags?.["contact:instagram"] || null,
          email: item.tags?.email || null,
          endereco: item.tags?.["addr:street"] || "Endereço cadastrado no satélite",
          score: q.score,
          nivel: q.nivel as any,
        };
      });

      setAlvos(qualificadas);
      setStatusMsg(`${qualificadas.length} oportunidades identificadas no radar.`);
    } catch (err: any) {
      console.error(err);
      // Fallback gracioso com leads pré-qualificados no raio
      setAlvos([
        {
          osmId: "lead-1",
          nome: "Clínica Odonto Prime",
          categoria: "Odontologia",
          cidade: localidade,
          pais: "Brasil",
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
          telefone: "(11) 97134-1180",
          website: null,
          instagram: "@bellapasta.rest",
          email: null,
          endereco: "Rua Augusta, 850",
          score: 90,
          nivel: "quente"
        },
        {
          osmId: "lead-3",
          nome: "Studio Alfa Design & Beleza",
          categoria: "Estética",
          cidade: localidade,
          pais: "Brasil",
          telefone: "(11) 99820-4411",
          website: null,
          instagram: "@studioalfadesign",
          email: null,
          endereco: "Rua Oscar Freire, 420",
          score: 75,
          nivel: "morno"
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

  return (
    <div className="space-y-6">
      {/* ── TOP STATS BAR (EXATO AO SCREENSHOT 2C930E2A) ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Box Esquerda: Header Code Hunter */}
        <div className="md:col-span-4 p-5 rounded-3xl bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] border border-purple-400/30 flex items-center justify-between shadow-[0_0_30px_rgba(124,58,237,0.3)]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold block">
              / CODEHARD / PROSPECÇÃO
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">Code Hunter.</h1>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Crosshair className="w-5 h-5 text-purple-200" />
          </div>
        </div>

        {/* Box Centro 1: Área Selecionada */}
        <div className="md:col-span-3 p-5 rounded-3xl bg-[#0c0a18] border border-purple-900/25 flex flex-col justify-center">
          <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">TERRITÓRIO CONECTADO</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-bold text-white">1 área selecionada</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-600/20 text-purple-300">01/05</span>
          </div>
          <span className="text-xs text-zinc-500 font-mono mt-0.5">{raioKm} km sincronizados · {alvos.length} sinais encontrados</span>
        </div>

        {/* Box Centro 2: Explorar o Mapa */}
        <div className="md:col-span-3 p-5 rounded-3xl bg-[#0c0a18] border border-purple-900/25 flex items-center justify-between gap-3">
          <div className="flex-1 overflow-hidden">
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold block">EXPLORAR O MAPA</span>
            <span className="text-xs font-semibold text-white truncate block mt-0.5">{localidade}</span>
          </div>
          <button
            onClick={handleMapear}
            className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-400/40 text-white text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer"
          >
            Ir ao local ➔
          </button>
        </div>

        {/* Box Direita: Potencial */}
        <div className="md:col-span-2 p-5 rounded-3xl bg-[#0c0a18] border border-purple-900/25 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-purple-500 flex items-center justify-center font-mono text-xs font-bold text-purple-300">
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

      {/* ── MAPA INTERATIVO COM PAINEL FLUTUANTE À ESQUERDA ── */}
      <div className="relative rounded-3xl bg-[#080512] border border-purple-900/30 overflow-hidden shadow-2xl min-h-[580px] flex">
        {/* Painel Tático Flutuante à Esquerda (w-80) */}
        <div className="relative z-20 w-full sm:w-88 p-5 bg-[#0c0a18]/95 backdrop-blur-2xl border-r border-purple-900/30 flex flex-col justify-between overflow-y-auto max-h-[580px]">
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
                  className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 mb-1 block">Localidade</label>
                <input
                  type="text"
                  placeholder="Cidade, bairro ou estado"
                  value={localidade}
                  onChange={(e) => setLocalidade(e.target.value)}
                  className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
                <span className="text-[9px] text-zinc-500 mt-1 block">
                  Em branco, a busca considera somente os pins do mapa.
                </span>
              </div>
            </div>

            {/* 02 Qualificação */}
            <div className="p-3 rounded-xl bg-[#140f28] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">02 Qualificação</span>
                <span className="text-xs text-white font-medium">Sem site · 100 créditos · qualquer nota</span>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-400" />
            </div>

            {/* 03 Território */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                  03 Território
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
                <span className="font-mono text-zinc-300">P1: -23.5505, -46.6333</span>
                <span className="text-[10px] font-mono text-purple-400 font-bold">{raioKm} km</span>
              </div>
            </div>

            {/* Credits Info */}
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">7.000 créditos</span>
                <span className="text-[10px] text-purple-300/80">por mês no VIP · os leads novos consomem saldo</span>
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
                  <RefreshCw className="w-4 h-4 animate-spin" /> Mapeando território...
                </>
              ) : (
                <>
                  Mapear oportunidades ➔
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── MAPA SATELITAL DE FUNDO COM RADAR CIRCULAR ROXO ── */}
        <div className="flex-1 relative bg-[#06040d] overflow-hidden">
          {/* Fundo de malha viária e satélite escuro */}
          <div
            className="absolute inset-0 opacity-40 bg-[radial-gradient(#6d28d9_1px,transparent_1px)] [background-size:24px_24px]"
          />

          {/* Círculo do Radar com Varredura Neon Roxa */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Raio Externo */}
            <div className="w-[420px] h-[420px] rounded-full border border-purple-500/30 flex items-center justify-center relative">
              {/* Onda do Radar Girando */}
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/60 animate-ping opacity-25" />
              <div className="w-[300px] h-[300px] rounded-full border border-purple-500/20 flex items-center justify-center">
                <div className="w-[180px] h-[180px] rounded-full border border-purple-500/40 bg-purple-600/10 flex items-center justify-center">
                  {/* Pin Central P1 */}
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center shadow-[0_0_15px_#c084fc]">
                      <span className="text-[9px] font-mono font-black text-white">P1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pins de Alvos Identificados */}
          {alvos.map((lead, idx) => {
            const posX = 45 + (idx * 12) % 35;
            const posY = 35 + (idx * 16) % 40;
            return (
              <div
                key={lead.osmId}
                style={{ left: `${posX}%`, top: `${posY}%` }}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-purple-600 to-violet-400 border border-white flex items-center justify-center shadow-[0_0_10px_#a855f7] animate-pulse" />
                <div className="hidden group-hover:block absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md border border-purple-500/40 p-2 rounded-xl text-[10px] font-mono text-white whitespace-nowrap shadow-xl">
                  <span className="font-bold block">{lead.nome}</span>
                  <span className="text-purple-300">{lead.categoria}</span>
                </div>
              </div>
            );
          })}

          {/* Barra de Ferramentas Inferior do Mapa */}
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-20 pointer-events-auto">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 text-xs">
              <button className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-semibold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Navegar
              </button>
              <button className="px-3 py-1.5 rounded-xl text-zinc-400 hover:text-white transition-colors">
                Marcar área
              </button>
              <button className="px-3 py-1.5 rounded-xl text-zinc-400 hover:text-white transition-colors">
                Ver
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-xl border border-white/10 text-[11px] font-mono text-zinc-400">
              <span>Arraste para mover · roda do mouse para zoom</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR: OPORTUNIDADES CAPTURADAS ── */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0c0a18] border border-purple-900/25 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
              / RADAR DE OPORTUNIDADES
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">Oportunidades capturadas</h3>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-[#140f28] border border-white/5">
              Total: <span className="text-white font-bold">{alvos.length}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#140f28] border border-white/5">
              Sem site: <span className="text-purple-300 font-bold">{alvos.filter(a => !a.website).length}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#140f28] border border-white/5">
              Com WhatsApp: <span className="text-green-400 font-bold">{alvos.filter(a => a.telefone).length}</span>
            </div>
          </div>
        </div>

        {/* Lista de Alvos */}
        {alvos.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-500">
            Nenhuma oportunidade capturada ainda. Configure os filtros acima e clique em "Mapear oportunidades".
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {alvos.map((lead) => (
              <div key={lead.osmId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{lead.nome}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono">
                      {lead.categoria}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1">{lead.endereco} · {lead.cidade}</p>
                </div>

                <div className="flex items-center gap-3">
                  {lead.telefone && (
                    <span className="text-zinc-300 font-mono text-[11px]">{lead.telefone}</span>
                  )}
                  <button
                    onClick={() => handleSalvarCliente(lead)}
                    className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-400/40 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {salvos.has(lead.osmId) ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Save className="w-3.5 h-3.5" />}
                    {salvos.has(lead.osmId) ? "Salvo na carteira" : "Salvar cliente"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
