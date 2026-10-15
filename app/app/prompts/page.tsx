"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, FileText, Code2, ArrowUpRight, Zap, RefreshCw } from "lucide-react";

export default function PromptsPage() {
  const [tab, setTab] = useState<"criar" | "meus">("criar");
  const [modo, setModo] = useState<"ideia" | "melhorar">("ideia");
  const [formato, setFormato] = useState<"texto" | "json">("texto");
  const [ideia, setIdeia] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGerar = () => {
    if (!ideia.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      if (formato === "json") {
        setGeneratedPrompt(JSON.stringify({
          role: "expert_web_architect",
          project: ideia,
          theme: "Royal Purple Glassmorphism Dark",
          palette: {
            background: "#080612",
            surface: "#120e24",
            accent: "#7c3aed",
            glow: "rgba(124, 58, 237, 0.4)",
            text: "#f8fafc"
          },
          sections: [
            { id: "hero", type: "3d_head_glowing_structure", cta: "Iniciar Agora" },
            { id: "features", type: "bento_grid", items: ["Radar OSINT", "CRM Automático", "Prompt Studio"] },
            { id: "social_proof", type: "metrics_cards", stats: ["R$ 150k+ gerados", "100% Conversão"] },
            { id: "pricing", type: "comparison_cards", tiers: ["Member", "Creator", "Elite"] }
          ],
          instructions: "Construa utilizando Next.js App Router, Tailwind CSS 4, Framer Motion e Lucide Icons. Preserve contrastes estritos e acabamentos de altíssimo luxo."
        }, null, 2));
      } else {
        setGeneratedPrompt(`### 🔮 PROMPT MASTER DE ENGENHARIA VISUAL — CODE MAKERS

**Papel & Instrução de Sistema:**
Você é um Arquiteto de Software e Designer de Interface Sênior especialista em interfaces futuristas, dark theme luxuoso e altíssima conversão para ${ideia}.

**1. Design System & Direção de Arte:**
- **Estética:** Obsidian Minimalist Bento Grid com efeitos de vidro lapidado (Glassmorphism), iluminação neon roxo elétrico (\`#7c3aed\` / \`#6d28d9\`) e superfícies escuras puras (\`#080612\`).
- **Tipografia:** Sans-serif geométrica para títulos de impacto, numerais em Monospace de precisão.
- **Micro-interações:** Hover states fluidos com \`framer-motion\`, gradientes radiais animados ao fundo.

**2. Arquitetura de Seções:**
- **Header:** Dock flutuante curvo com blur de vidro lapidado e botão de acesso rápido.
- **Hero:** Proposta de valor magnética, subtítulo focado em ROI tangível, badge pulsante "AO VIVO" e elemento 3D central.
- **Bento Grid:** Destaques das capacidades operacionais com métricas em tempo real.
- **Conversão Direta:** Formulário simplificado de 2 passos com cálculo instantâneo.

**3. Stack & Dependências:**
- Next.js 15+ App Router, Tailwind CSS, Lucide Icons, Framer Motion.`);
      }
      setIsGenerating(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ── HERO BANNER: GERADOR DE PROMPTS ── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] p-6 md:p-8 overflow-hidden shadow-[0_0_40px_rgba(109,40,217,0.35)] border border-purple-400/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold">
              / CODE MAKERS / GERADOR DE PROMPTS
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-mono font-bold">
              CODE ELITE
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mt-2">
            Gerador de prompts.
          </h1>
          <p className="text-xs md:text-sm text-purple-100/90 mt-1.5 max-w-lg">
            Transforme ideias simples em instruções ricas para criar ou refinar sites no v0, Claude ou ChatGPT.
          </p>
        </div>
      </div>

      {/* ── GRID PRINCIPAL: FORMULÁRIO À ESQUERDA & PREVIEW À DIREITA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Formulário (6 colunas) */}
        <div className="lg:col-span-6 p-6 md:p-8 rounded-3xl bg-[#0c0a18] border border-purple-900/25 shadow-2xl space-y-6">
          {/* Tabs: Criar Prompt / Meus Prompts */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#140f28] border border-white/[0.06] text-xs">
            <button
              onClick={() => setTab("criar")}
              className={`flex-1 py-2 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                tab === "criar" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Criar prompt
            </button>
            <button
              onClick={() => setTab("meus")}
              className={`flex-1 py-2 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                tab === "meus" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Meus prompts (0)
            </button>
          </div>

          {/* 01 Modo de Geração */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                01
              </span>
              <span className="text-xs font-semibold text-white">O que você quer fazer?</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setModo("ideia")}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  modo === "ideia"
                    ? "bg-[#1c1538] border-purple-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.25)]"
                    : "bg-[#120e24] border-white/5 text-zinc-400 hover:text-white"
                }`}
              >
                <span className="text-xs font-bold block">Criar a partir de uma ideia</span>
                <span className="text-[10px] text-zinc-500 mt-0.5 block">Comece do zero com seu briefing</span>
              </button>

              <button
                type="button"
                onClick={() => setModo("melhorar")}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  modo === "melhorar"
                    ? "bg-[#1c1538] border-purple-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.25)]"
                    : "bg-[#120e24] border-white/5 text-zinc-400 hover:text-white"
                }`}
              >
                <span className="text-xs font-bold block">Melhorar meu prompt</span>
                <span className="text-[10px] text-zinc-500 mt-0.5 block">Adicione detalhes de design e código</span>
              </button>
            </div>
          </div>

          {/* 02 Formato */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                02
              </span>
              <span className="text-xs font-semibold text-white">Qual o formato do prompt?</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormato("texto")}
                className={`py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  formato === "texto"
                    ? "bg-[#1c1538] border-purple-500 text-white"
                    : "bg-[#120e24] border-white/5 text-zinc-400 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Texto
              </button>
              <button
                type="button"
                onClick={() => setFormato("json")}
                className={`py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  formato === "json"
                    ? "bg-[#1c1538] border-purple-500 text-white"
                    : "bg-[#120e24] border-white/5 text-zinc-400 hover:text-white"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> JSON
              </button>
            </div>
          </div>

          {/* 03 Sua Ideia Textarea */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                03
              </span>
              <span className="text-xs font-semibold text-white">Sua ideia</span>
            </div>
            <textarea
              rows={4}
              placeholder="Descreva a ideia do seu site, nicho, público e objetivo... Ex.: Landing page para uma clínica dermatológica de luxo com agendamento online e tour 3D."
              value={ideia}
              onChange={(e) => setIdeia(e.target.value)}
              className="w-full bg-[#140f28] border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleGerar}
            disabled={!ideia.trim() || isGenerating}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#9333ea] disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Otimizando prompt com IA...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Gerar prompt otimizado ✨
              </>
            )}
          </button>
        </div>

        {/* Coluna Direita: Live Output Card (6 colunas) */}
        <div className="lg:col-span-6 p-6 md:p-8 rounded-3xl bg-[#0c0a18] border border-purple-900/25 shadow-2xl flex flex-col justify-between min-h-[500px]">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                  PREVIEW EM TEMPO REAL
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Sua ideia entra aqui. O prompt sai pronto.
                </h3>
              </div>

              {generatedPrompt && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-400/40 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              )}
            </div>

            {/* Output Display or Initial State */}
            {generatedPrompt ? (
              <div className="mt-4 p-4 rounded-2xl bg-[#120e24] border border-white/10 font-mono text-xs text-zinc-300 whitespace-pre-wrap max-h-[460px] overflow-y-auto leading-relaxed scrollbar-hide">
                {generatedPrompt}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-3xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 shadow-inner">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white">Sua ideia entra aqui. O prompt sai pronto.</h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm leading-relaxed">
                  Descreva seu projeto no formulário ao lado para gerar uma estrutura visual de alta fidelidade e pronta para deploy.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Compatível com Claude 3.7, v0 e GPT-4o</span>
            <span className="text-purple-400 font-semibold">Motor Code Makers v4</span>
          </div>
        </div>
      </div>
    </div>
  );
}

