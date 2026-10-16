"use client";

import React, { useState } from "react";
import { Sparkles, Code2, Globe, Monitor, Smartphone, Download, ArrowUpRight, Play, RefreshCw, Check } from "lucide-react";

const MODELS = [
  { id: "syre", nome: "Syre v2.5", nicho: "Landing Pages de Luxo & Alta Conversão", desc: "Equilíbrio cirúrgico entre estética obsidian, dark glass e chamadas comerciais de alta tração." },
  { id: "formoda", nome: "Formoda Ultra", nicho: "Dark Bento Grid & SaaS Moderno", desc: "Ideal para plataformas digitais, dashboards e produtos com visual Linear/Vercel." },
  { id: "titan", nome: "Titan AI", nicho: "E-commerce & Cardápios Interativos", desc: "Modelagem focada em catálogo, cálculo de carrinho e finalização via WhatsApp." },
  { id: "nova", nome: "Nova Lux", nicho: "Design Editorial & Estúdios Criativos", desc: "Tipografia monumental, layout de revista digital e transições cinemáticas." },
  { id: "gemini", nome: "Google Gemini", nicho: "Motor Neural & Código Rápido", desc: "Motor multiraciocínio oficial para estruturação lógica, enriquecimento e geração instantânea." },
];

export default function SiteBuilderPage() {
  const [selectedModel, setSelectedModel] = useState("syre");
  const [promptText, setPromptText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");

  const handleGerarSite = () => {
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* ── HERO BANNER: BUILDER IA ── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] p-6 md:p-8 overflow-hidden shadow-[0_0_40px_rgba(109,40,217,0.35)] border border-purple-400/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold">
              / CODEHARD / BUILDER IA
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-mono font-bold">
              GERAÇÃO VISUAL EM TEMPO REAL
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mt-2">
            O que vamos criar hoje, Rodrigo?
          </h1>
          <p className="text-xs md:text-sm text-purple-100/90 mt-1.5 max-w-lg">
            Descreva a interface e deixe nossos modelos especializados gerarem código limpo, responsivo e com design moderno.
          </p>
        </div>
      </div>

      {/* ── SELETOR DE MODELOS IA ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {MODELS.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedModel(m.id)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedModel === m.id
                ? "bg-[#1c1538] border-purple-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                : "bg-[#0c0a18] border-purple-900/20 text-zinc-400 hover:text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">{m.nome}</span>
              {selectedModel === m.id && (
                <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
              )}
            </div>
            <span className="text-[10px] text-purple-300 font-mono block mt-1">{m.nicho}</span>
            <p className="text-[11px] text-zinc-500 mt-2 line-clamp-2 leading-relaxed">{m.desc}</p>
          </button>
        ))}
      </div>

      {/* ── CONSOLE DE PROMPT ── */}
      <div className="p-6 rounded-3xl bg-[#0c0a18] border border-purple-900/25 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white">Instrução de Construção</span>
          <span className="text-[10px] text-zinc-500 font-mono">Modelo ativo: {MODELS.find(m => m.id === selectedModel)?.nome}</span>
        </div>

        <div className="relative">
          <textarea
            rows={3}
            placeholder="Ex.: Crie uma landing page para a Clínica Odonto Prime em tema roxo escuro minimalista, com hero apresentando a Dra. Juliana, carrossel de tratamentos e botão direto para agendamento no WhatsApp."
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="w-full bg-[#140f28] border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setPromptText("Crie uma landing page ultra-moderna para uma pizzaria gourmet chamada Bella Pasta, com visual Dark Bento, cardápio interativo e entrega rápida.")}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Usar exemplo pronto
          </button>

          <button
            onClick={handleGerarSite}
            disabled={!promptText.trim() || isGenerating}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#9333ea] disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Gerando interface com IA...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Gerar Site Agora ↗
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── WORKSPACE PREVIEW / CÓDIGO GERADO ── */}
      <div className="rounded-3xl bg-[#0c0a18] border border-purple-900/25 shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
        {/* Workspace Top Bar */}
        <div className="p-4 px-6 border-b border-white/[0.06] bg-[#0e0b1f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs font-mono text-zinc-400 border-l border-white/10 pl-3">
              {hasGenerated ? "preview://site-gerado.vercel.app" : "Aguardando geração..."}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Switch Preview / Code */}
            <div className="flex items-center p-1 rounded-xl bg-[#181330] border border-white/10 text-xs">
              <button
                onClick={() => setViewMode("preview")}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                  viewMode === "preview" ? "bg-purple-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                onClick={() => setViewMode("code")}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                  viewMode === "code" ? "bg-purple-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> Código
              </button>
            </div>

            {/* Device Switcher */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-[#181330] border border-white/10 text-xs">
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`p-1.5 rounded-lg transition-colors ${deviceMode === "desktop" ? "bg-purple-600 text-white" : "text-zinc-400 hover:text-white"}`}
                title="Desktop"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode("mobile")}
                className={`p-1.5 rounded-lg transition-colors ${deviceMode === "mobile" ? "bg-purple-600 text-white" : "text-zinc-400 hover:text-white"}`}
                title="Mobile"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Workspace Display Area */}
        <div className="flex-1 p-6 md:p-8 flex items-center justify-center bg-[#07050e] relative overflow-hidden">
          {hasGenerated ? (
            viewMode === "preview" ? (
              <div className={`transition-all duration-300 w-full ${deviceMode === "mobile" ? "max-w-sm rounded-3xl border-4 border-zinc-700 overflow-hidden shadow-2xl" : "max-w-4xl"}`}>
                {/* Live Mock Site Preview */}
                <div className="bg-[#0b0817] border border-purple-500/20 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl text-left">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                    <span className="font-mono font-black text-white tracking-wider">&lt;SITE_PROMPT /&gt;</span>
                    <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                      Agendar Agora
                    </span>
                  </div>

                  <div className="space-y-3 py-4">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono">
                      EXCELÊNCIA & DESIGN
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                      A Experiência Definitiva em Presença Digital.
                    </h2>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
                      Ambiente sofisticado, atendimento exclusivo e resultados comprovados em cada detalhe.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-[#140f28] border border-white/5 space-y-1">
                      <span className="text-xs font-bold text-white">Tratamento Premium</span>
                      <p className="text-[11px] text-zinc-400">Atendimento 100% individualizado</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#140f28] border border-white/5 space-y-1">
                      <span className="text-xs font-bold text-white">Tecnologia Avançada</span>
                      <p className="text-[11px] text-zinc-400">Protocolos modernos de alto impacto</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-4xl p-4 bg-[#0a0714] border border-white/10 rounded-2xl font-mono text-xs text-zinc-300 overflow-x-auto">
                <pre>{`// Landing Page gerada pelo modelo ${MODELS.find(m => m.id === selectedModel)?.nome}
export default function LandingPage() {
  return (
    <div className="bg-[#080612] min-h-screen text-white font-sans">
      <header className="p-6 border-b border-purple-500/20">
        <h1 className="text-2xl font-bold text-purple-400">Presença Digital</h1>
      </header>
      <main className="max-w-4xl mx-auto py-16 px-6">
        <h2 className="text-4xl font-black">A Experiência Definitiva.</h2>
      </main>
    </div>
  );
}`}</pre>
              </div>
            )
          ) : (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-3xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">Seu novo site nascerá aqui</h4>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                Selecione o modelo, digite o que deseja criar e clique em "Gerar Site Agora".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

