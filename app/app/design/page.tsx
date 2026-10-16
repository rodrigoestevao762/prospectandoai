"use client";

import React, { useState, useMemo } from "react";
import {
  Palette, Copy, Check, ExternalLink, Download, Sparkles, Layers,
  ArrowUpRight, Search, ChevronDown, SlidersHorizontal, Eye, X,
  Compass, Globe, Smartphone, Monitor, Shield, Filter, Star
} from "lucide-react";
import HardyMascot from "@/components/codemakers/HardyMascot";
import { DESIGN_DATABASE, DesignReference } from "@/lib/design-database";

export default function CodeHardDesignPage() {
  const [selectedRef, setSelectedRef] = useState<DesignReference | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlataforma, setSelectedPlataforma] = useState<string>("Todas");
  const [selectedNicho, setSelectedNicho] = useState<string>("Todos");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("Todas");
  const [selectedTipoSite, setSelectedTipoSite] = useState<string>("Todos");

  // Plataformas disponíveis com contadores dinâmicos
  const plataformas = ["Todas", "Awwwards", "Dribbble", "Mobbin", "Land-Book", "Behance", "Pinterest"];
  const nichos = useMemo(() => ["Todos", ...Array.from(new Set(DESIGN_DATABASE.map(r => r.nicho)))].sort(), []);
  const categorias = ["Todas", "Tree.js Skills", "Gsap Skill", "Design DNA", "Motion Design Skill", "Genjutsu", "Bento Grid", "WebGL Spatial"];
  const tiposSite = ["Todos", "Landing Page", "Web App", "Dashboard", "E-commerce", "Portfólio", "Mobile App"];

  // Filtragem Dinâmica
  const filteredReferences = useMemo(() => {
    return DESIGN_DATABASE.filter((item) => {
      if (selectedPlataforma !== "Todas" && item.plataforma !== selectedPlataforma) return false;
      if (selectedNicho !== "Todos" && item.nicho !== selectedNicho) return false;
      if (selectedCategoria !== "Todas" && item.categoria !== selectedCategoria) return false;
      if (selectedTipoSite !== "Todos" && item.tipoSite !== selectedTipoSite) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = item.titulo.toLowerCase().includes(query);
        const matchesNicho = item.nicho.toLowerCase().includes(query);
        const matchesTags = item.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesNicho && !matchesTags) return false;
      }

      return true;
    });
  }, [selectedPlataforma, selectedNicho, selectedCategoria, selectedTipoSite, searchTerm]);

  const handleCopyDesignMd = (ref: DesignReference) => {
    navigator.clipboard.writeText(ref.designMd);
    setCopiedId(ref.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ── TOP TELEMETRY BAR: TESLA SHOWROOM HEADER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Banner Identidade Design Lab */}
        <div className="lg:col-span-6 p-6 rounded-[28px] bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] border border-purple-400/30 flex items-center justify-between shadow-[0_20px_40px_rgba(124,58,237,0.35)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-200 animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold">
                CURADORIA INTERNACIONAL DE LUXO · ACERVO OFICIAL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Design Lab.</h1>
            <p className="text-xs text-purple-100/90 mt-1 max-w-md">
              Arquiteturas visuais extraídas do Awwwards, Dribbble, Mobbin, Land-Book, Behance e Pinterest com tokens e arquivos DESIGN.md prontos.
            </p>
          </div>

          <div className="hidden sm:block w-24 h-24">
            <HardyMascot variant="design" className="w-full h-full" />
          </div>
        </div>

        {/* Métricas de Curadoria */}
        <div className="lg:col-span-3 p-6 rounded-[28px] bg-[#0a0815]/90 border border-white/[0.08] flex flex-col justify-between shadow-xl">
          <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">REFERÊNCIAS INDEXADAS</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black font-mono text-white">{DESIGN_DATABASE.length}</span>
            <span className="text-xs text-purple-400 font-mono font-bold">Modelos Ativos</span>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Todas com fotos reais e DESIGN.md completo
          </span>
        </div>

        {/* Status de Integração IA */}
        <div className="lg:col-span-3 p-6 rounded-[28px] bg-[#0a0815]/90 border border-white/[0.08] flex flex-col justify-between shadow-xl">
          <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">MOTORES SUPORTADOS</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-white">Syre, Formoda, Titan, Nova & Gemini</span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Nativo</span>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Execute diretamente no Site Builder IA da CODEHARD
          </span>
        </div>
      </div>

      {/* ── FILTROS TÁTEIS ESTILO TESLA CONSOLE ── */}
      <div className="p-4 sm:p-5 rounded-[26px] bg-[#0c0a18]/95 backdrop-blur-2xl border border-purple-500/25 shadow-[0_10px_30px_rgba(0,0,0,0.8)] space-y-4">
        {/* Barra de Busca + Controles Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Campo de Busca Livre */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nicho (odonto, sushi, fintech, joias, carros...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#140f28] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Filtro por Nicho */}
          <div className="sm:col-span-3">
            <select
              value={selectedNicho}
              onChange={(e) => setSelectedNicho(e.target.value)}
              className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Todos">Todos os Nichos de Mercado ({nichos.length - 1})</option>
              {nichos.filter(n => n !== "Todos").map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Habilidade / Skill */}
          <div className="sm:col-span-2">
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Todas">Todas as Skills</option>
              {categorias.filter(c => c !== "Todas").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Tipo de Site */}
          <div className="sm:col-span-2">
            <select
              value={selectedTipoSite}
              onChange={(e) => setSelectedTipoSite(e.target.value)}
              className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Todos">Tipo de Aplicação</option>
              {tiposSite.filter(t => t !== "Todos").map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pílulas de Plataformas Internacionais com Contadores Reais */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-white/[0.05]">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold whitespace-nowrap mr-2">
            Plataformas:
          </span>
          {plataformas.map((plat) => {
            const count = plat === "Todas"
              ? DESIGN_DATABASE.length
              : DESIGN_DATABASE.filter(r => r.plataforma === plat).length;

            return (
              <button
                key={plat}
                onClick={() => setSelectedPlataforma(plat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  selectedPlataforma === plat
                    ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                    : "bg-[#140f28] text-zinc-400 hover:text-white hover:bg-[#1a1435]"
                }`}
              >
                <span>{plat}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/40 text-purple-300 font-bold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── BARRA DE STATUS DE RESULTADOS ── */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-2 font-mono">
        <span>Mostrando {filteredReferences.length} de {DESIGN_DATABASE.length} referências exclusivas</span>
        <span className="text-purple-400 font-bold">Design System: Tesla Obsidian & Royal Purple</span>
      </div>

      {/* ── GRID DE CARDS TESLA MODEL (78 REFERÊNCIAS COM FOTOS REAIS) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReferences.map((item) => (
          <div
            key={item.id}
            className="group rounded-[28px] bg-[#0c0a18] border border-purple-900/30 hover:border-purple-500/50 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_45px_rgba(124,58,237,0.25)] flex flex-col justify-between overflow-hidden"
          >
            {/* Topo com Foto Real do Site */}
            <div className="relative h-56 w-full overflow-hidden bg-[#150f28]">
              <img
                src={item.imagemUrl}
                alt={item.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Badges Flutuantes sobre a Imagem */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/10 shadow-lg">
                  {item.plataforma}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-600/80 backdrop-blur-md text-[9px] font-mono font-bold text-white shadow-lg">
                  {item.tipoSite}
                </span>
              </div>

              {/* Botão de Abrir Preview Rápido */}
              <button
                onClick={() => setSelectedRef(item)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-purple-600 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/10"
                title="Ver Especificação Completa"
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Gradiente de Transição Inferior */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c0a18] to-transparent pointer-events-none" />
            </div>

            {/* Conteúdo do Card */}
            <div className="p-6 pt-3 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className="text-purple-400 font-bold">{item.categoria}</span>
                  <span className="text-zinc-500">{item.nicho}</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                  {item.titulo}
                </h3>

                <p className="text-xs text-zinc-400 mt-1 font-mono">
                  Estilo: <span className="text-zinc-200">{item.estiloVisual}</span>
                </p>

                {/* Tags em Pílulas */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Barra de Performance e Ações */}
              <div className="pt-4 border-t border-white/[0.05] space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-500">Fidelidade Estética</span>
                  <span className="text-purple-400 font-bold">{item.score}/100</span>
                </div>

                <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                    style={{ width: `${item.score}%` }}
                  />
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleCopyDesignMd(item)}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copiar DESIGN.md
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedRef(item)}
                    className="px-3 py-2.5 rounded-xl bg-[#140f28] hover:bg-[#1a1435] border border-white/10 text-white text-xs font-semibold transition-colors cursor-pointer"
                    title="Inspecionar Código"
                  >
                    <Eye className="w-3.5 h-3.5 text-zinc-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── MODAL DE INSPEÇÃO & EXPORTAÇÃO DO DESIGN.MD ── */}
      {selectedRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="w-full max-w-3xl rounded-[32px] bg-[#0c0a18] border border-purple-500/40 shadow-[0_0_60px_rgba(124,58,237,0.4)] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">
                  {selectedRef.plataforma} · {selectedRef.categoria}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedRef.titulo}</h3>
              </div>

              <button
                onClick={() => setSelectedRef(null)}
                className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Foto Real Ampliada */}
              <div className="h-64 w-full rounded-2xl overflow-hidden bg-[#150f28] relative">
                <img src={selectedRef.imagemUrl} alt={selectedRef.titulo} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-mono text-white border border-white/10">
                  Nicho: {selectedRef.nicho} · Estilo: {selectedRef.estiloVisual}
                </div>
              </div>

              {/* Código DESIGN.md Formatado */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Conteúdo do arquivo DESIGN.md</span>
                  <span className="text-purple-400">Pronto para Syre, Formoda, Titan, Nova & Gemini</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#06040d] border border-purple-900/30 font-mono text-xs text-zinc-200 overflow-x-auto leading-relaxed">
                  <pre>{selectedRef.designMd}</pre>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-white/[0.08] bg-[#080512] flex items-center justify-between gap-4">
              <span className="text-xs text-zinc-400 font-mono">
                Pressione ESC ou feche para voltar à galeria.
              </span>

              <button
                onClick={() => handleCopyDesignMd(selectedRef)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
              >
                {copiedId === selectedRef.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" /> Copiado com sucesso!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copiar Arquivo DESIGN.md
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
