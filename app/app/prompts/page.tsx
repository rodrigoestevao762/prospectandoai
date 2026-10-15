"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, FileText, Code2, Search, ArrowUpRight, ShieldAlert, BookOpen, Layers } from "lucide-react";
import HardyMascot from "@/components/codemakers/HardyMascot";

interface PromptItem {
  id: string;
  categoria: string;
  titulo: string;
  subtitulo: string;
  tags: string[];
  conteudo: string;
}

const PROMPT_DATABASE: PromptItem[] = [
  {
    id: "p1",
    categoria: "DESIGN E PRODUTO",
    titulo: "Direção de landing page",
    subtitulo: "Transforme uma oferta em uma direção clara de página.",
    tags: ["landing page", "direção", "conversão", "arquitetura"],
    conteudo: `Crie uma landing page de altíssima conversão para [produto] voltada a [publico]. Priorize [objetivo] e use uma direção visual [direcao].

Regras estritas de design:
- Estética Obsidian Dark com gradientes violetas sutis (#7c3aed, #a855f7) sobre fundo #080612.
- Efeitos de vidro lapidado (Glassmorphism) com bordas 1px translúcidas.
- Tipografia geométrica de alto impacto para títulos e monospace para numerais e dados.
- Hero com proposta irrecusável e prova de valor tangível.
- Bento Grid com os 3 principais diferenciais operacionais.
- Chamada para ação com formulário minimalista de 2 passos.`
  },
  {
    id: "p2",
    categoria: "DESIGN E PRODUTO",
    titulo: "Crítica de interface",
    subtitulo: "Analise uma tela com critérios objetivos de usabilidade e visual.",
    tags: ["UX", "auditoria", "interface", "heurística"],
    conteudo: `Atue como um Especialista em Design de Produto e Usabilidade (Nielsen Heuristics + Awwwards Judge).

Avalie a seguinte tela ou componente sob 4 pilares:
1. Hierarquia Visual e Escaneabilidade (F-pattern, contraste, pontos focais).
2. Densidade de Informação e Espaçamento (Whitespace, alinhamento ao grid).
3. Acessibilidade e Contraste WCAG AAA para Dark Theme.
4. Clareza de Ação (Acessibilidade de botões primários e secundários).

Forneça recomendações práticas e trechos de código Tailwind CSS para corrigir os 3 maiores gargalos encontrados.`
  },
  {
    id: "p3",
    categoria: "THREE.JS & SHADERS",
    titulo: "Cena 3D com Partículas Interativas",
    subtitulo: "Gere código de WebGL com React Three Fiber e shaders.",
    tags: ["Three.js", "WebGL", "R3F", "Shaders"],
    conteudo: `Construa um componente React Three Fiber (@react-three/fiber + @react-three/drei) para Next.js App Router:
- Campo de 2.000 partículas com cor roxo neon (#a855f7) flutuando organicamente.
- Efeito de dispersão interativa ao mover o cursor do mouse (raycaster).
- Iluminação direcional sutil e rotação lenta constante.
- Otimizado com bufferGeometry e shaderMaterial com zero perda de frames (60fps garantidos).`
  },
  {
    id: "p4",
    categoria: "GSAP SCROLL",
    titulo: "Timeline Cinemática com Scrub",
    subtitulo: "Animações com pin e reveal para sites padrão Awwwards.",
    tags: ["GSAP", "ScrollTrigger", "Pin", "Cinema"],
    conteudo: `Implemente uma seção de storytelling cinemático utilizando GSAP e ScrollTrigger:
- Pin da seção durante 300vh de scroll.
- Fade in e scale progressivo de 3 cards em cascata conforme a rolagem avança.
- SplitText com desdobramento de letras da manchete com ease: "power3.out".
- Compatibilidade nativa com Lenis Smooth Scroll no Next.js.`
  },
  {
    id: "p5",
    categoria: "COPYWRITING B2B",
    titulo: "Script de Abordagem para Decisores",
    subtitulo: "Prospecção ativa no WhatsApp com taxa de resposta alta.",
    tags: ["Vendas", "WhatsApp", "B2B", "Conversão"],
    conteudo: `Você é o diretor comercial de uma agência especializada em tecnologia e presença digital.
Elabore uma mensagem de abordagem via WhatsApp para o proprietário de [empresa] no nicho [nicho].

Diretrizes da mensagem:
- Cumprimento respeitoso e personalizado citando a cidade [cidade].
- Observação técnica sutil: notar que a empresa não possui presença mobile profissional ou o site atual está desatualizado.
- Demonstração do protótipo já criado especificamente para a marca dele.
- Chamada leve e consultiva, sem postura de vendedor insistente ("Gostaria de ver uma prévia rápida de 1 minuto sem compromisso?").`
  }
];

export default function PromptsLabPage() {
  const [activeTab, setActiveTab] = useState<"lab" | "vault" | "vip">("lab");
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem>(PROMPT_DATABASE[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todos");
  const [copied, setCopied] = useState(false);

  const filteredPrompts = PROMPT_DATABASE.filter((p) => {
    if (filterCategory !== "Todos" && p.categoria !== filterCategory) return false;
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      return p.titulo.toLowerCase().includes(s) || p.subtitulo.toLowerCase().includes(s) || p.tags.some(t => t.toLowerCase().includes(s));
    }
    return true;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedPrompt.conteudo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ── TOP SWITCHER TABS ── */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
          ACERVO CODEHARD
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("lab")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "lab"
                ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                : "bg-[#120e24] text-zinc-400 hover:text-white border border-white/5"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Prompt Lab <span className="text-[10px] opacity-70">Prompts prontos para usar</span>
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "vault"
                ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                : "bg-[#120e24] text-zinc-400 hover:text-white border border-white/5"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Skill Vault <span className="text-[10px] opacity-70">Métodos e instalação</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("vip");
              window.location.href = "/app/builder";
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-700 to-violet-600 text-white flex items-center gap-1.5 border border-purple-400/40 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200" /> Gerar com IA <span className="px-1.5 py-0.2 rounded bg-black/40 text-[9px] font-mono font-bold">VIP</span>
          </button>
        </div>
      </div>

      {/* ── HERO BANNER: PROMPT LAB COM HARDY MASCOTE ── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] p-6 md:p-8 overflow-hidden shadow-[0_0_40px_rgba(109,40,217,0.35)] border border-purple-400/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Mascot Hardy Prompts on Right */}
        <div className="absolute right-4 md:right-10 -bottom-4 md:-bottom-8 w-44 md:w-60 h-44 md:h-60 pointer-events-none">
          <HardyMascot variant="prompts" className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold block mb-1">
            / CODEHARD / PROMPT LAB
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            Prompts para sair do rascunho.
          </h1>
          <p className="text-xs md:text-sm text-purple-100/90 mt-1.5 max-w-lg leading-relaxed">
            Escolha um prompt completo, copie ou baixe e ajuste os detalhes no seu próprio chat para gerar sites e códigos precisos.
          </p>

          {/* Metrics Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <span className="px-3 py-1 rounded-xl bg-black/25 backdrop-blur-md border border-white/10 text-[11px] font-mono text-purple-200">
              {PROMPT_DATABASE.length} recursos publicados
            </span>
            <span className="px-3 py-1 rounded-xl bg-black/25 backdrop-blur-md border border-white/10 text-[11px] font-mono text-purple-200">
              Texto completo
            </span>
            <span className="px-3 py-1 rounded-xl bg-black/25 backdrop-blur-md border border-white/10 text-[11px] font-mono text-purple-200">
              Sincronizado
            </span>
          </div>
        </div>
      </div>

      {/* ── BARRA DE PESQUISA & FILTROS ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0c0a18] border border-purple-900/25">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por objetivo, área ou palavra-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#140f28] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {["Todos", "DESIGN E PRODUTO", "THREE.JS & SHADERS", "GSAP SCROLL", "COPYWRITING B2B"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filterCategory === cat
                  ? "bg-purple-600 text-white font-bold"
                  : "bg-[#140f28] text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── GRID DUAS COLUNAS: LISTA À ESQUERDA & VISUALIZADOR À DIREITA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Explore os prompts (5 colunas) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-[#0c0a18] border border-purple-900/25 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                CODEHARD / BIBLIOTECA
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">Explore os prompts ({filteredPrompts.length})</h3>
            </div>
          </div>

          <div className="space-y-3">
            {filteredPrompts.map((p, idx) => {
              const isSelected = selectedPrompt.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPrompt(p)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all group ${
                    isSelected
                      ? "bg-[#1c1538] border-purple-500 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                      : "bg-[#120e24] border-white/5 hover:border-purple-500/30 hover:bg-[#16102e]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      {p.categoria}
                    </span>
                    <ArrowUpRight className={`w-3.5 h-3.5 transition-colors ${isSelected ? "text-purple-300" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors">
                    {p.titulo}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {p.subtitulo}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {p.tags.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-[#181232] border border-purple-500/15 text-[9px] font-mono text-zinc-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Coluna Direita: Visualizador do Prompt Final (7 colunas) */}
        <div className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-[#0c0a18] border border-purple-900/25 shadow-2xl flex flex-col justify-between min-h-[560px]">
          <div className="space-y-4">
            {/* Header do Prompt Selecionado */}
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                [ ] PROMPT / {selectedPrompt.categoria.toLowerCase()}
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">{selectedPrompt.titulo}</h2>
              <p className="text-xs text-zinc-400 mt-1">{selectedPrompt.subtitulo}</p>
            </div>

            {/* Aviso de Uso Restrito em Roxo */}
            <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-purple-200 leading-relaxed">
                <span className="font-bold">USO RESTRITO:</span> É proibido divulgar, compartilhar ou redistribuir este conteúdo. O descumprimento está sujeito à perda de acesso e ao banimento da plataforma.
              </p>
            </div>

            {/* Caixa do Prompt Final */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500 font-bold block">
                    CODEHARD / PROMPT LAB
                  </span>
                  <span className="text-xs font-bold text-white">Prompt final</span>
                </div>

                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copiado!" : "Copiar prompt"}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#120e24] border border-white/10 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto scrollbar-hide">
                {selectedPrompt.conteudo}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Texto completo para copiar e adaptar no seu chat</span>
            <span className="text-purple-400 font-bold">Motor CODEHARD v4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
