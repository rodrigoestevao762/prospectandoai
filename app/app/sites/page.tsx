"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Globe, ExternalLink, Code2, Sparkles, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";
import HardyMascot from "@/components/codemakers/HardyMascot";

interface SiteItem {
  id: string;
  titulo: string;
  cliente: string;
  url: string;
  status: "Publicado" | "Em produção";
  visitas: number;
  gradient: string;
}

export default function SitesPage() {
  const [sites, setSites] = useState<SiteItem[]>([
    {
      id: "1",
      titulo: "Clínica Nova Era — Dermatologia VIP",
      cliente: "Mariana Costa",
      url: "https://clinicanovaera.com.br",
      status: "Publicado",
      visitas: 4820,
      gradient: "from-[#4c1d95] via-[#2e1065] to-[#090714]"
    },
    {
      id: "2",
      titulo: "Studio Alfa Design & Arquitetura",
      cliente: "Rodrigo Silva",
      url: "https://studioalfa.vercel.app",
      status: "Publicado",
      visitas: 3910,
      gradient: "from-[#581c87] via-[#3b0764] to-[#0a0714]"
    },
    {
      id: "3",
      titulo: "Bella Pasta Ristorante Italiano",
      cliente: "Chef Giovanni",
      url: "https://bellapasta.com.br",
      status: "Em produção",
      visitas: 840,
      gradient: "from-[#6d28d9] via-[#4c1d95] to-[#090714]"
    }
  ]);

  return (
    <div className="space-y-6">
      {/* ── HERO BANNER: SITES & ENTREGAS COM MASCOTE ROXO ── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] p-6 md:p-8 overflow-hidden shadow-[0_0_40px_rgba(109,40,217,0.35)] border border-purple-400/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Mascot Hardy on Right */}
        <div className="absolute right-4 md:right-10 -bottom-4 md:-bottom-8 w-44 md:w-60 h-44 md:h-60 pointer-events-none">
          <HardyMascot variant="design" className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold">
              / CODEHARD / SHOWCASE
            </span>
            <Link
              href="/app/builder"
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" /> Criar novo site com IA
            </Link>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mt-2">
            Sites e entregas digitais.
          </h1>
          <p className="text-xs md:text-sm text-purple-100/90 mt-1.5 max-w-lg">
            Gerencie o portfólio de landing pages, status de publicação e links dos seus clientes.
          </p>

          <div className="grid grid-cols-3 gap-3 mt-6 max-w-md">
            <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Publicados</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">2</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Em produção</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">1</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Visitas</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">9.570</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── GRID DE SITES PUBLICADOS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sites.map((site) => (
          <div
            key={site.id}
            className="rounded-3xl bg-[#0c0a18] border border-purple-900/25 overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-purple-500/40 transition-all"
          >
            {/* Visual Thumbnail Preview */}
            <div className={`h-44 w-full bg-gradient-to-br ${site.gradient} p-5 flex flex-col justify-between relative overflow-hidden border-b border-white/[0.06]`}>
              <div className="flex items-center justify-between z-10">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  site.status === "Publicado"
                    ? "bg-purple-600/30 text-purple-300 border-purple-400/40"
                    : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                }`}>
                  {site.status}
                </span>
                <span className="text-xs font-mono font-bold text-white/80">&lt;/&gt;</span>
              </div>

              <div className="z-10 bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-xl max-w-xs shadow">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span className="text-[9px] font-mono text-zinc-300 truncate">{site.url.replace("https://", "")}</span>
                </div>
                <div className="h-1.5 w-3/4 bg-white/30 rounded-full" />
              </div>
            </div>

            {/* Info Body */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  {site.titulo}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">Cliente: <span className="text-zinc-300">{site.cliente}</span></p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2 border-t border-white/[0.06]">
                <span>Tráfego acumulado</span>
                <span className="text-white font-bold">{site.visitas.toLocaleString("pt-BR")} visitas</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-[#140f28] hover:bg-[#1c1538] border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  Abrir site <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <Link
                  href="/app/builder"
                  className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-400/40 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  Editar <Code2 className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
