"use client";

import React, { useState } from "react";
import { PlayCircle, CheckCircle2, Clock, BookOpen, Layers, Sparkles, ChevronRight, X } from "lucide-react";
import HardyMascot from "@/components/codemakers/HardyMascot";

interface Aula {
  id: string;
  titulo: string;
  duracao: string;
  concluida: boolean;
  videoUrl?: string;
}

interface Trilha {
  id: string;
  titulo: string;
  descricao: string;
  aulas: Aula[];
  nivel: string;
}

const TRILHAS: Trilha[] = [
  {
    id: "criacao",
    titulo: "01. Criação de Sites de Alta Conversão com IA",
    descricao: "Domine a construção de landing pages modernas, dark glass e de alto luxo utilizando inteligência artificial.",
    nivel: "Iniciante ao Avançado",
    aulas: [
      { id: "c1", titulo: "Fundamentos de interfaces Dark Glass e Design System", duracao: "14 min", concluida: true },
      { id: "c2", titulo: "Estruturando o briefing perfeito para Syre, Formoda e Gemini", duracao: "18 min", concluida: true },
      { id: "c3", titulo: "Otimização de imagens, copy e micro-interações", duracao: "22 min", concluida: false },
      { id: "c4", titulo: "Publicação instantânea na Vercel com domínio próprio", duracao: "11 min", concluida: false },
      { id: "c5", titulo: "Projeto Prático: Landing Page de R$ 4.500 do zero", duracao: "35 min", concluida: false },
    ]
  },
  {
    id: "prompts",
    titulo: "02. Engenharia de Prompts para Front-end Moderno",
    descricao: "Como criar instruções ricas, arquitetura de componentes e documentação DESIGN.md para modelos de IA.",
    nivel: "Intermediário",
    aulas: [
      { id: "p1", titulo: "A anatomia de um prompt de alta fidelidade", duracao: "16 min", concluida: true },
      { id: "p2", titulo: "Gerando DESIGN.md com paletas e tokens estritos", duracao: "20 min", concluida: true },
      { id: "p3", titulo: "Corrigindo alinhamentos e comportamentos responsivos", duracao: "15 min", concluida: false },
      { id: "p4", titulo: "Técnicas de refatoração rápida com IA", duracao: "19 min", concluida: false },
    ]
  },
  {
    id: "prospeccao",
    titulo: "03. Prospecção Ativa B2B com Radar OSINT",
    descricao: "Mapeie centenas de negócios locais com déficit digital e acesse tomadores de decisão.",
    nivel: "Estratégico",
    aulas: [
      { id: "r1", titulo: "Como encontrar empresas locais com déficit digital", duracao: "24 min", concluida: false },
      { id: "r2", titulo: "O motor Overpass e a varredura por raio de 10km", duracao: "17 min", concluida: false },
      { id: "r3", titulo: "Filtrando WhatsApp verificado e redes sociais", duracao: "21 min", concluida: false },
      { id: "r4", titulo: "Scripts de abordagem que geram respostas imediatas", duracao: "19 min", concluida: false },
      { id: "r5", titulo: "Estruturando seu funil de vendas no CRM", duracao: "15 min", concluida: false },
      { id: "r6", titulo: "Follow-up estratégico sem ser invasivo", duracao: "13 min", concluida: false },
    ]
  },
  {
    id: "fechamento",
    titulo: "04. Fechamento de Vendas de R$ 3.000 a R$ 10.000",
    descricao: "Como conduzir reuniões comerciais de alto impacto, vencer objeções e assinar contratos recorrentes.",
    nivel: "Comercial de Elite",
    aulas: [
      { id: "v1", titulo: "Ancoragem de valor e precificação estratégica", duracao: "26 min", concluida: false },
      { id: "v2", titulo: "Apresentação ao vivo: Demonstração do site pronto", duracao: "31 min", concluida: false },
      { id: "v3", titulo: "Quebrando objeções de preço e prazo", duracao: "18 min", concluida: false },
      { id: "v4", titulo: "Contratos e modelos de manutenção recorrente (MRR)", duracao: "22 min", concluida: false },
      { id: "v5", titulo: "Escala da operação: De 1 para 10 clientes por mês", duracao: "28 min", concluida: false },
    ]
  }
];

export default function PlayPage() {
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);

  const totalAulas = TRILHAS.reduce((acc, t) => acc + t.aulas.length, 0);
  const aulasConcluidas = TRILHAS.reduce((acc, t) => acc + t.aulas.filter(a => a.concluida).length, 0);
  const percentual = Math.round((aulasConcluidas / totalAulas) * 100);

  return (
    <div className="space-y-6">
      {/* ── HERO BANNER: CODE PLAY COM MASCOTE ROXO ── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] p-6 md:p-8 overflow-hidden shadow-[0_0_40px_rgba(109,40,217,0.35)] border border-purple-400/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Mascot Hardy on Right */}
        <div className="absolute right-4 md:right-10 -bottom-4 md:-bottom-8 w-44 md:w-60 h-44 md:h-60 pointer-events-none">
          <HardyMascot variant="prompts" className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold">
              / CODEHARD / PLAY
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-mono font-bold">
              TRILHAS PRÁTICAS
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mt-2">
            Aulas e Métodos.
          </h1>
          <p className="text-xs md:text-sm text-purple-100/90 mt-1.5 max-w-lg">
            Vídeos práticos, técnicas de prospecção, fechamento de vendas e engenharia de prompts para você faturar no digital.
          </p>

          <div className="mt-6 p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 max-w-md">
            <div className="flex items-center justify-between text-xs text-purple-200 mb-1.5 font-mono">
              <span>Progresso geral</span>
              <span className="font-bold text-white">{aulasConcluidas} de {totalAulas} aulas ({percentual}%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-violet-300 rounded-full transition-all duration-500"
                style={{ width: `${percentual}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── LISTAGEM DE TRILHAS E AULAS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TRILHAS.map((trilha) => (
          <div
            key={trilha.id}
            className="p-6 md:p-8 rounded-3xl bg-[#0c0a18] border border-purple-900/25 shadow-2xl flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
                  {trilha.nivel}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {trilha.aulas.length} aulas
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mt-2 tracking-tight">{trilha.titulo}</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{trilha.descricao}</p>
            </div>

            {/* Aulas List */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              {trilha.aulas.map((aula, idx) => (
                <button
                  key={aula.id}
                  onClick={() => setSelectedAula(aula)}
                  className="w-full p-3 rounded-2xl bg-[#140f28] hover:bg-[#1c1538] border border-white/5 hover:border-purple-500/30 flex items-center justify-between text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {aula.concluida ? (
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    ) : (
                      <PlayCircle className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 flex-shrink-0 transition-colors" />
                    )}
                    <div>
                      <span className="text-xs font-medium text-white group-hover:text-purple-200 transition-colors block">
                        {idx + 1}. {aula.titulo}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {aula.duracao}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {selectedAula && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-[#0c0a18] border border-purple-500/30 rounded-3xl p-6 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                  REPRODUZINDO AULA
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedAula.titulo}</h3>
              </div>
              <button
                onClick={() => setSelectedAula(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated 16:9 Video Player */}
            <div className="aspect-video w-full rounded-2xl bg-black border border-white/10 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#6d28d9] to-[#a855f7] flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.6)] cursor-pointer hover:scale-105 transition-transform">
                <PlayCircle className="w-8 h-8 text-white fill-white" />
              </div>
              <span className="absolute bottom-4 left-4 text-xs font-mono text-zinc-400">
                CODEHARD Play · Alta Fidelidade HD
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-400 font-mono">Duração: {selectedAula.duracao}</span>
              <button
                onClick={() => {
                  alert("Aula marcada como concluída!");
                  setSelectedAula(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
              >
                Marcar como concluída ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

