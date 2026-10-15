"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Palette, Copy, Check, ExternalLink, Download, Sparkles, Layers,
  ArrowUpRight, Search, ChevronDown, SlidersHorizontal, Eye, X
} from "lucide-react";
import HardyMascot from "@/components/codemakers/HardyMascot";

interface DesignReference {
  id: string;
  refNumber: string;
  titulo: string;
  plataforma: "Awwwards" | "Dribbble" | "Mobbin" | "Land-Book" | "Behance" | "Pinterest";
  categoria: string;
  nicho: string;
  estiloVisual: string;
  tipoSite: string;
  imagemUrl: string;
  tags: string[];
  progresso: number; // 0 a 100 para a barra inferior
  designMd: string;
}

const DESIGN_REFERENCES: DesignReference[] = [
  {
    id: "ref-01",
    refNumber: "Referência 01",
    titulo: "Aether Void — Three.js & Spatial Computing",
    plataforma: "Awwwards",
    categoria: "Tree.js Skills",
    nicho: "SaaS & AI",
    estiloVisual: "Cyberpunk Obsidian",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    tags: ["Three.js", "WebGL", "Spatial Audio", "Partículas 3D"],
    progresso: 85,
    designMd: `# DESIGN.md — Aether Void (Three.js Spatial)

## 1. PALETA DE CORES & TOKENS
- Void Deep: #05030a
- Surface Obsidian: #0c0819
- Primary Accent: #7c3aed (Violet Neon)
- Particle Core: #c084fc
- Glow Filter: 0 0 35px rgba(124, 58, 237, 0.45)

## 2. ARQUITETURA THREE.JS
- Canvas com R3F (@react-three/fiber)
- Simulação de malha nodal com shaders customizados GLSL
- Rotação inercial com suavização GSAP Lerp.`
  },
  {
    id: "ref-02",
    refNumber: "Referência 02",
    titulo: "Genjutsu Minimal — Dark Bento Luxury",
    plataforma: "Dribbble",
    categoria: "Genjutsu",
    nicho: "Fintech & Private Banking",
    estiloVisual: "Dark Bento Glass",
    tipoSite: "Web App",
    imagemUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Genjutsu", "Glassmorphism", "Bento Grid", "Titanium UI"],
    progresso: 70,
    designMd: `# DESIGN.md — Genjutsu Minimal

## 1. ESTÉTICA VISUAL
- Efeito de vidro lapidado com backdrop-filter: blur(28px)
- Bordas de 1px com gradiente translúcido (white/10 -> purple-500/30)
- Iluminação sutil de cantos com pseudo-elementos ::before

## 2. TIPOGRAFIA
- Display: Inter Tight / Monument Extended
- Numerais: JetBrains Mono com tracking alargado.`
  },
  {
    id: "ref-03",
    refNumber: "Referência 03",
    titulo: "Kinetic Scroll — GSAP Timeline Experience",
    plataforma: "Land-Book",
    categoria: "Gsap Skill",
    nicho: "Agências & Estúdios",
    estiloVisual: "Kinetic Motion",
    tipoSite: "Portfólio Institucional",
    imagemUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    tags: ["GSAP ScrollTrigger", "SplitText", "Pinning", "Smooth Scroll"],
    progresso: 95,
    designMd: `# DESIGN.md — Kinetic Scroll GSAP

## 1. MOTION ENGINE
- ScrollTrigger com scrub: 1 e snap progressivo
- Efeito parallax em 3 camadas de profundidade
- Tipografia com reveal letra por letra via SplitType.`
  },
  {
    id: "ref-04",
    refNumber: "Referência 04",
    titulo: "Mobbin Ultra — Mobile-First Conversion",
    plataforma: "Mobbin",
    categoria: "Motion Design Skill",
    nicho: "Aplicativos & SaaS",
    estiloVisual: "Clay & Glass Clean",
    tipoSite: "Mobile App Web",
    imagemUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    tags: ["Mobbin Best", "Framer Motion", "Micro-interações", "Haptic Feel"],
    progresso: 60,
    designMd: `# DESIGN.md — Mobbin Ultra

## 1. MICRO-INTERAÇÕES
- Botões com scale: 0.96 no tap e feedback sonoro
- Bottom-sheet deslizante com drag elasticidade
- Badges dinâmicos com contadores animados.`
  },
  {
    id: "ref-05",
    refNumber: "Referência 05",
    titulo: "Design DNA — Scalable Token Architecture",
    plataforma: "Behance",
    categoria: "Design DNA",
    nicho: "Design Systems",
    estiloVisual: "Architectural Grid",
    tipoSite: "Design System Hub",
    imagemUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80",
    tags: ["Tokens W3C", "Figma Variables", "Radix UI", "Tailwind 4"],
    progresso: 80,
    designMd: `# DESIGN.md — Design DNA Tokens

## 1. TOKENS E VARIÁVEIS
- Espaçamento: Escala geométrica modular base 4px
- Elevação: 4 níveis de sombras difusas em rgba(109,40,217,...)
- Estados: default, hover, active, focus-visible estritos.`
  },
  {
    id: "ref-06",
    refNumber: "Referência 06",
    titulo: "Kuro Atelier — Pinterest Editorial Dark",
    plataforma: "Pinterest",
    categoria: "Genjutsu",
    nicho: "Gastronomia & Luxo",
    estiloVisual: "Cinematic Dark Editorial",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    tags: ["Pinterest Trends", "Editorial Serif", "Cardápio 3D", "Dark Food"],
    progresso: 90,
    designMd: `# DESIGN.md — Kuro Atelier

## 1. ATMOSFERA
- Fundo ultra-escuro (#080510) com iluminação pontual âmbar/violeta
- Fotografia em alta saturação de contrastes
- Checkout instantâneo via modal com WhatsApp integration.`
  }
];

const SKILL_ATALHOS = [
  "Tudo",
  "Awwwards",
  "Dribbble",
  "Mobbin",
  "Land-Book",
  "Behance",
  "Pinterest",
  "Tree.js Skills",
  "Gsap Skill",
  "Design DNA",
  "Motion Design Skill",
  "Genjutsu"
];

export default function DesignLibraryPage() {
  const [selectedAtalho, setSelectedAtalho] = useState("Tudo");
  const [selectedNicho, setSelectedNicho] = useState("Todos os nichos");
  const [selectedEstilo, setSelectedEstilo] = useState("Todos os estilos");
  const [selectedTipo, setSelectedTipo] = useState("Todos os tipos");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeModalItem, setActiveModalItem] = useState<DesignReference | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = DESIGN_REFERENCES.filter((item) => {
    // Filtro por atalho (plataforma ou categoria)
    if (selectedAtalho !== "Tudo") {
      const matchPlataforma = item.plataforma.toLowerCase() === selectedAtalho.toLowerCase();
      const matchCategoria = item.categoria.toLowerCase() === selectedAtalho.toLowerCase();
      if (!matchPlataforma && !matchCategoria) return false;
    }

    // Filtro por busca
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchText = item.titulo.toLowerCase().includes(term) ||
        item.tags.some(t => t.toLowerCase().includes(term)) ||
        item.plataforma.toLowerCase().includes(term);
      if (!matchText) return false;
    }

    return true;
  });

  const handleCopyMd = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ── HERO BANNER: DESIGN HARD · CODEHARD COM HARDY MASCOTE ── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] p-6 md:p-8 overflow-hidden shadow-[0_0_40px_rgba(109,40,217,0.35)] border border-purple-400/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Mascot Hardy Design on Right */}
        <div className="absolute right-4 md:right-10 -bottom-4 md:-bottom-8 w-44 md:w-60 h-44 md:h-60 pointer-events-none">
          <HardyMascot variant="design" className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold">
              / DESIGN HARD · CODEHARD
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-mono font-bold">
              CURADORIA INTERNACIONAL
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mt-2">
            Identidades reais. DESIGN.md prontos.
          </h1>
          <p className="text-xs md:text-sm text-purple-100/90 mt-1.5 max-w-lg leading-relaxed">
            Explore sites premiados no Awwwards, Dribbble, Mobbin e Land-Book. Escolha sua próxima referência e leve o DESIGN.md completo para o seu projeto.
          </p>
        </div>
      </div>

      {/* ── CONTROL BAR: EXPLORE POR DESIGN COM DROPDOWNS E ATALHOS ── */}
      <div className="p-5 rounded-3xl bg-[#0c0a18] border border-purple-900/25 shadow-xl space-y-4">
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
              EXPLORE POR DESIGN
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              ● {filtered.length} referências ativas
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-500 font-mono">Ordenação: Nome: A → Z</span>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <label className="text-[10px] text-zinc-500 uppercase font-mono block mb-1">Nicho</label>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#140f28] border border-white/10 text-xs text-zinc-300">
              <span>{selectedNicho}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </div>
          </div>

          <div className="relative">
            <label className="text-[10px] text-zinc-500 uppercase font-mono block mb-1">Estilo visual</label>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#140f28] border border-white/10 text-xs text-zinc-300">
              <span>{selectedEstilo}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </div>
          </div>

          <div className="relative">
            <label className="text-[10px] text-zinc-500 uppercase font-mono block mb-1">Tipo de site</label>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#140f28] border border-white/10 text-xs text-zinc-300">
              <span>{selectedTipo}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </div>
          </div>
        </div>

        {/* Search Bar + Atalhos Pills */}
        <div className="space-y-3 pt-2 border-t border-white/[0.06]">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por referência, Three.js, Genjutsu, Awwwards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#140f28] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Atalhos: Awwwards, Dribbble, Mobbin, Land-Book, Three.js, Gsap, Genjutsu */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
            <span className="text-[10px] text-zinc-500 font-mono uppercase mr-1 whitespace-nowrap">
              ATALHOS:
            </span>
            {SKILL_ATALHOS.map((at) => (
              <button
                key={at}
                onClick={() => setSelectedAtalho(at)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedAtalho === at
                    ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.45)]"
                    : "bg-[#140f28] text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                {at}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── GRID DE REFERÊNCIAS COM IMAGENS REAIS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl bg-[#0c0a18] border border-purple-900/25 overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-purple-500/40 transition-all"
          >
            {/* Visual Thumbnail com Imagem Real */}
            <div className="h-52 w-full relative overflow-hidden bg-[#150f28] border-b border-white/[0.06]">
              <img
                src={item.imagemUrl}
                alt={item.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a18] via-transparent to-black/30 pointer-events-none" />

              {/* Tag Plataforma Topo */}
              <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white shadow">
                  {item.plataforma}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-600/40 backdrop-blur-md border border-purple-400/40 text-[9px] font-mono font-bold text-purple-200">
                  {item.categoria}
                </span>
              </div>

              {/* Badge REFERÊNCIA Canto Inferior */}
              <div className="absolute bottom-3 right-3.5 z-10">
                <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[9px] font-mono uppercase tracking-widest text-zinc-300 font-bold">
                  REFERÊNCIA
                </span>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                {/* Logo H Icon */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6d28d9] to-[#4c1d95] flex items-center justify-center font-bold font-mono text-white text-xs shadow-md flex-shrink-0">
                  H
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white font-mono">{item.refNumber}</h4>
                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="text-zinc-500 hover:text-white transition-colors"
                      title="Abrir detalhes"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">{item.titulo}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-[#16102e] border border-purple-500/20 text-[10px] font-mono text-purple-300"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Links e Botões de Ação */}
              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>codehard.com.br</span>
                <button
                  onClick={() => handleCopyMd(item.id, item.designMd)}
                  className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === item.id ? "Copiado!" : "DESIGN.md"}
                </button>
              </div>

              {/* Barra de Progresso Vermelha/Roxa Estilo Code Makers */}
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-[#6d28d9] to-[#a855f7] rounded-full"
                  style={{ width: `${item.progresso}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── MODAL DETALHES & TOKENS DESIGN.MD ── */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#0c0a18] border border-purple-500/30 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                  {activeModalItem.plataforma} · {activeModalItem.categoria}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{activeModalItem.titulo}</h3>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="mt-4 p-4 rounded-2xl bg-[#120e24] border border-white/10 font-mono text-xs text-zinc-300 overflow-y-auto flex-1 whitespace-pre-wrap leading-relaxed">
              {activeModalItem.designMd}
            </pre>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                onClick={() => handleCopyMd(activeModalItem.id, activeModalItem.designMd)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
              >
                {copiedId === activeModalItem.id ? "Copiado!" : "Copiar DESIGN.md"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
