"use client";

import React, { useState } from "react";
import { Palette, Copy, Check, ExternalLink, Download, Sparkles, Layers, ArrowUpRight } from "lucide-react";

interface DesignRef {
  id: string;
  titulo: string;
  categoria: string;
  estilo: string;
  descricao: string;
  previewGradient: string;
  tags: string[];
  designMd: string;
}

const DESIGN_REFS: DesignRef[] = [
  {
    id: "vanguard",
    titulo: "Vanguard Obsidian — SaaS Enterprise",
    categoria: "SaaS & Software",
    estilo: "Dark Glass Bento",
    descricao: "Design minimalista com iluminação roxo elétrico, grids de bento transparentes e cartões de métricas.",
    previewGradient: "from-[#4c1d95] via-[#2e1065] to-[#090714]",
    tags: ["Obsidian Glass", "Roxo Elétrico", "Bento Grid", "Métricas ao Vivo"],
    designMd: `# DESIGN.md — Vanguard Obsidian

## 1. PALETA DE CORES
- Void: #080612
- Surface: #120e24
- Primary Accent: #7c3aed (Violet 600)
- Neon Glow: rgba(124, 58, 237, 0.45)
- Text Inks: #f8fafc (Primary), #94a3b8 (Dim)

## 2. COMPONENTES-CHAVE
- Curved Left Sidebar Dock com active pill glow.
- Bento Cards com borda 1px border-white/10 e blur 20px.
- Botões 3D com sombra neon e gradiente violeta linear.`
  },
  {
    id: "lumiere",
    titulo: "Lumière Prime — Saúde & Estética VIP",
    categoria: "Saúde & Estética",
    estilo: "Minimalist Luxury",
    descricao: "Refinamento estético em tons ameixa escuro, tipografia editorial serifada e agendamento instantâneo.",
    previewGradient: "from-[#581c87] via-[#3b0764] to-[#0a0714]",
    tags: ["Editorial Luxury", "Violeta Nobre", "Booking Widget", "Carrossel Antes/Depois"],
    designMd: `# DESIGN.md — Lumière Prime

## 1. PALETA DE CORES
- Base: #0a0714
- Card: #150f28
- Accent: #a855f7 (Purple 500)
- Border: rgba(168, 85, 247, 0.2)

## 2. REGRAS DE LAYOUT
- Hero com tipografia grande e suave.
- Cards de tratamentos com micro-animação de hover.
- Rodapé institucional com selo de verificação médica.`
  },
  {
    id: "kuro",
    titulo: "Kuro Kitchen — Gastronomia Japonesa",
    categoria: "Gastronomia & Delivery",
    estilo: "Cinematic Dark Food",
    descricao: "Experiência imersiva para restaurantes e deliveries com cardápio interativo e checkout via WhatsApp.",
    previewGradient: "from-[#3b0764] via-[#1e0b3d] to-[#07050e]",
    tags: ["Cinematic Dark", "Roxo Ultravioleta", "Cardápio 3D", "Direto no WhatsApp"],
    designMd: `# DESIGN.md — Kuro Kitchen

## 1. PALETA DE CORES
- Fundo: #07050e
- Superfície: #130d24
- Realce: #8b5cf6
- Preços: #34d399 (Emerald)

## 2. ARQUITETURA DE CONVERSÃO
- Grade de pratos com fotos em alta definição.
- Adição com 1 clique e envio automático de pedido com endereço.`
  },
  {
    id: "aether",
    titulo: "Aether AI — Agência & Estúdio Digital",
    categoria: "Agências & Estúdios",
    estilo: "Kinetic Holographic",
    descricao: "Grid arrojado para agências criativas, cases interativos em vídeo e manifesto da marca.",
    previewGradient: "from-[#6d28d9] via-[#4c1d95] to-[#090714]",
    tags: ["Kinetic Motion", "Roxo Neon", "Showcase Interativo", "Pitch Deck"],
    designMd: `# DESIGN.md — Aether AI

## 1. TOKENS & IDENTIDADE
- Primary: #7c3aed
- Glow: 0 0 40px rgba(124, 58, 237, 0.4)
- Layout: 12 colunas com tipografia monumental.`
  }
];

export default function DesignPage() {
  const [selectedCat, setSelectedCat] = useState("Todos");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeModalRef, setActiveModalRef] = useState<DesignRef | null>(null);

  const categorias = ["Todos", "SaaS & Software", "Saúde & Estética", "Gastronomia & Delivery", "Agências & Estúdios"];

  const filtered = selectedCat === "Todos"
    ? DESIGN_REFS
    : DESIGN_REFS.filter(r => r.categoria === selectedCat);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ── HERO BANNER: CODE DESIGN COM MASCOTE ROXO ── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] p-6 md:p-8 overflow-hidden shadow-[0_0_40px_rgba(109,40,217,0.35)] border border-purple-400/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Mascot on Right */}
        <div className="absolute right-4 md:right-10 -bottom-4 md:-bottom-8 w-44 md:w-64 h-44 md:h-64 pointer-events-none purple-tint opacity-90">
          <img
            src="/codemakers/codin-design-header-v2.png"
            alt="Mascote Codin Design"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold">
              / CODE MAKERS / DESIGN SYSTEM
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-mono font-bold">
              TOKENS & DESIGN.MD
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mt-2">
            Biblioteca de referências.
          </h1>
          <p className="text-xs md:text-sm text-purple-100/90 mt-1.5 max-w-lg">
            Estilos visuais, paletas curadas, micro-interações e arquivos DESIGN.md prontos para download e exportação.
          </p>
        </div>
      </div>

      {/* ── CATEGORIAS / FILTROS ── */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCat === cat
                ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                : "bg-[#0c0a18] text-zinc-400 hover:text-white border border-purple-900/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── GRID DE CARDS DE DESIGN ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl bg-[#0c0a18] border border-purple-900/25 overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-purple-500/40 transition-all"
          >
            {/* Visual Thumbnail */}
            <div className={`h-48 w-full bg-gradient-to-br ${item.previewGradient} p-6 flex flex-col justify-between relative overflow-hidden border-b border-white/[0.06]`}>
              <div className="flex items-center justify-between z-10">
                <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-purple-200">
                  {item.categoria}
                </span>
                <span className="text-xs font-mono font-bold text-white/80">&lt;/&gt;</span>
              </div>

              {/* Decorative Mockup Preview */}
              <div className="z-10 bg-black/30 backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl max-w-xs shadow-lg">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="w-2 h-2 rounded-full bg-violet-400/40" />
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                </div>
                <div className="h-2 w-3/4 bg-white/20 rounded-full mb-1.5" />
                <div className="h-2 w-1/2 bg-purple-400/30 rounded-full" />
              </div>
            </div>

            {/* Info Body */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  {item.titulo}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{item.descricao}</p>
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

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
                <button
                  onClick={() => handleCopy(item.id, item.designMd)}
                  className="flex-1 py-2.5 rounded-xl bg-[#140f28] hover:bg-[#1c1538] border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                  {copiedId === item.id ? "DESIGN.md Copiado!" : "Copiar DESIGN.md"}
                </button>

                <button
                  onClick={() => setActiveModalRef(item)}
                  className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-400/40 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  Ver Tokens <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Visualizar Tokens */}
      {activeModalRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#0c0a18] border border-purple-500/30 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                  ARQUIVO DESIGN.MD
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{activeModalRef.titulo}</h3>
              </div>
              <button
                onClick={() => setActiveModalRef(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <pre className="mt-4 p-4 rounded-2xl bg-[#120e24] border border-white/10 font-mono text-xs text-zinc-300 overflow-y-auto flex-1 whitespace-pre-wrap leading-relaxed">
              {activeModalRef.designMd}
            </pre>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                onClick={() => handleCopy(activeModalRef.id, activeModalRef.designMd)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2"
              >
                {copiedId === activeModalRef.id ? "Copiado!" : "Copiar DESIGN.md"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

