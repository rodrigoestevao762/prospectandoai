"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { SpotlightCard } from "@/components/SpotlightCard";
import { useTilt3D } from "@/hooks/useAnimations";
import {
  ArrowRight, Search, Activity, BarChart3,
  Layers, MapPin, CheckCircle2,
  Phone, Globe as GlobeIcon, FileText, Send,
  Sliders, ShieldCheck, Database, Building2,
  Server, DownloadCloud, Radio, Users2
} from "lucide-react";

// Precision Radar Mark for High-End Engineering Branding
function LogoMark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
      <circle cx="12" cy="12" r="8" strokeOpacity="0.4" strokeDasharray="3 3" />
    </svg>
  );
}

// Dynamic Client-Only Load for 3D Background with zero SSR issues
const Background3D = dynamic(() => import("@/components/Background3D"), {
  ssr: false,
});

// Dynamic Client-Only Load for Globe to guarantee zero-SSR hydration issues
const Globe = dynamic(() => import("@/components/Globe"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-[580px] h-[340px] sm:h-[440px] lg:h-[580px] flex flex-col items-center justify-center">
      <div className="w-48 h-48 rounded-full border border-zinc-800 animate-pulse bg-zinc-950/40 flex items-center justify-center">
        <div className="w-28 h-28 rounded-full border border-dashed border-zinc-700 animate-spin" />
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-semibold mt-4 animate-pulse">
        Carregando Base Vetorial 3D...
      </span>
    </div>
  ),
});

/* ─── LIVE TICKER STRIP (PRECISION TELEMETRY STREAM) ─── */
const TICKER_ITEMS = [
  "RADAR GEOESPACIAL B2B ATIVO",
  "COBERTURA METROPOLITANA ATÉ 100KM",
  "DISPARO EM MASSA AUTOMATIZADO WHATSAPP",
  "CARTOGRAFIA MUNDIAL & HEATMAP DE DENSIDADE",
  "AUDITORIA AUTOMÁTICA DE AUSÊNCIA DE WEBSITE",
  "AUDITOR DE DOMÍNIOS & DNS EM TEMPO REAL",
  "ENRIQUECIMENTO DE DECISORES & WHATSAPP",
  "ROTEIROS CONSULTIVOS DE PROSPECÇÃO",
  "COBERTURA EM 195 PAÍSES",
  "PIPELINE KANBAN & MÉTRICAS DE MRR",
  "ZERO TIMEOUT ENGINE",
];

function Ticker() {
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] bg-[#07080e] py-2.5 select-none">
      <div className="flex gap-0 animate-[marquee_32s_linear_infinite] w-max">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-8 font-mono text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
            <span className="hover:text-zinc-200 transition-colors duration-150">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── REAL INTERACTIVE PLATFORM DEMO CONSOLE ─── */
interface DemoLead {
  name: string;
  niche: string;
  neighborhood: string;
  issue: string;
  issueType: "danger" | "warning" | "info" | "neutral";
  whatsapp: string;
  priority: "Alta" | "Imediata" | "Média";
}

const DEMO_LEADS_DATA: Record<string, DemoLead[]> = {
  "São Paulo, SP": [
    { name: "Clínica Odonto Vida", niche: "Odontologia", neighborhood: "Perdizes", issue: "Sem Website Detectado", issueType: "danger", whatsapp: "(11) 98421-9920", priority: "Alta" },
    { name: "Auto Mecânica Paulista", niche: "Automotivo", neighborhood: "Mooca", issue: "Domínio Expirado", issueType: "warning", whatsapp: "(11) 97134-1180", priority: "Imediata" },
    { name: "Bistrô & Café Jardins", niche: "Gastronomia", neighborhood: "Jardins", issue: "Sem Cardápio Próprio", issueType: "info", whatsapp: "(11) 99820-4411", priority: "Alta" },
    { name: "Escritório Contábil Souza", niche: "Contabilidade", neighborhood: "Pinheiros", issue: "Site Não-Mobile / Lento", issueType: "neutral", whatsapp: "(11) 96510-3302", priority: "Média" },
  ],
  "Rio de Janeiro, RJ": [
    { name: "Consultório Dr. Marcelo", niche: "Saúde & Estética", neighborhood: "Barra da Tijuca", issue: "Sem Website Detectado", issueType: "danger", whatsapp: "(21) 98840-7711", priority: "Alta" },
    { name: "Academia Iron Fit", niche: "Fitness", neighborhood: "Botafogo", issue: "Página Social sem Domínio", issueType: "warning", whatsapp: "(21) 97412-3390", priority: "Imediata" },
    { name: "Pizzaria Artesanal Lapa", niche: "Gastronomia", neighborhood: "Lapa", issue: "Dependência de Marketplace", issueType: "info", whatsapp: "(21) 99310-8844", priority: "Alta" },
    { name: "Imobiliária Carioca Prime", niche: "Imóveis", neighborhood: "Ipanema", issue: "Site sem Certificado SSL", issueType: "neutral", whatsapp: "(21) 96120-5590", priority: "Média" },
  ],
  "Belo Horizonte, MG": [
    { name: "Distribuidora Minas Aço", niche: "Logística & B2B", neighborhood: "Contagem", issue: "Sem Website Detectado", issueType: "danger", whatsapp: "(31) 98711-2200", priority: "Alta" },
    { name: "Ateliê & Confeitaria Savassi", niche: "Alimentação", neighborhood: "Savassi", issue: "Domínio Expirado", issueType: "warning", whatsapp: "(31) 97320-4491", priority: "Imediata" },
    { name: "Clínica Veterinária Pampulha", niche: "Pet & Vet", neighborhood: "Pampulha", issue: "Sem Presença Digital", issueType: "danger", whatsapp: "(31) 99410-6622", priority: "Alta" },
    { name: "Advocacia & Perícias BH", niche: "Jurídico", neighborhood: "Lourdes", issue: "Site Obsoleto / Desktop Only", issueType: "neutral", whatsapp: "(31) 96811-9940", priority: "Média" },
  ],
};

function InteractivePlatformPreview() {
  const [selectedCity, setSelectedCity] = useState("São Paulo, SP");
  const [activeRadius, setActiveRadius] = useState("25 km");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const leads = DEMO_LEADS_DATA[selectedCity] || DEMO_LEADS_DATA["São Paulo, SP"];

  const handleCopy = (phone: string, idx: number) => {
    navigator.clipboard?.writeText(phone);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0a0c14] overflow-hidden shadow-2xl">
      {/* Platform Console Header */}
      <div className="px-5 py-3.5 border-b border-white/[0.07] bg-[#0d0f19] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#6d28d9]/25 border border-[#7c3aed]/40 flex items-center justify-center text-[#a78bfa]">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-white">Console Operacional de Varredura</h4>
            <p className="text-[11px] text-zinc-400">Ambiente de demonstração com alvos reais mapeados</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-mono text-[10px] text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> MOTOR OPERACIONAL
          </span>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="p-4 sm:p-5 border-b border-white/[0.06] bg-[#090b12] flex flex-wrap items-center justify-between gap-4">
        {/* City Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-zinc-400 font-medium mr-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#a78bfa]" /> Metrópole:
          </span>
          {Object.keys(DEMO_LEADS_DATA).map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCity === city
                  ? "bg-[#6d28d9] text-white font-semibold shadow-md border border-[#8b5cf6]/60"
                  : "bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Radius Filter Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium mr-1 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-[#a78bfa]" /> Raio:
          </span>
          {["10 km", "25 km", "50 km", "100 km"].map((r) => (
            <button
              key={r}
              onClick={() => setActiveRadius(r)}
              type="button"
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                activeRadius === r
                  ? "bg-white/10 text-white border border-[#7c3aed]/40 font-bold"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.01] text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
              <th className="py-3 px-5">Empresa & Segmento</th>
              <th className="py-3 px-4">Localização</th>
              <th className="py-3 px-4">Diagnóstico Digital</th>
              <th className="py-3 px-4">Contato Validado</th>
              <th className="py-3 px-5 text-right">Ação Direta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {leads.map((lead, idx) => (
              <tr key={lead.name} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-5">
                  <div className="font-semibold text-white text-sm">{lead.name}</div>
                  <div className="text-zinc-400 text-[11px]">{lead.niche}</div>
                </td>
                <td className="py-3.5 px-4 text-zinc-300 font-mono text-[11px]">
                  {lead.neighborhood}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[10px] font-semibold ${
                    lead.issueType === "danger"
                      ? "bg-rose-500/15 border border-rose-500/35 text-rose-300"
                      : lead.issueType === "warning"
                      ? "bg-amber-500/15 border border-amber-500/35 text-amber-300"
                      : lead.issueType === "info"
                      ? "bg-violet-500/20 border border-violet-500/40 text-violet-300"
                      : "bg-sky-500/15 border border-sky-500/35 text-sky-300"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {lead.issue}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 text-zinc-200 font-mono text-[11px]">
                    <Phone className="w-3 h-3 text-[#a78bfa]" />
                    {lead.whatsapp}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <button
                    onClick={() => handleCopy(lead.whatsapp, idx)}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-[#6d28d9] hover:text-white border border-white/10 hover:border-[#7c3aed]/50 text-zinc-300 font-medium text-xs transition-all"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Copiado!
                      </>
                    ) : (
                      <>
                        <span>Contatar</span>
                        <ArrowRight className="w-3 h-3 text-zinc-400" />
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Banner */}
      <div className="p-4 border-t border-white/[0.06] bg-[#070912] flex items-center justify-between text-xs text-zinc-400">
        <span className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#a78bfa]" />
          Mostrando 4 de centenas de alvos detectados no raio de {activeRadius} em {selectedCity}
        </span>
        <Link
          href="/login"
          className="text-[#a78bfa] hover:text-white font-semibold transition-colors flex items-center gap-1"
        >
          Desbloquear varredura completa <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

/* ─── 3D BENTO CARD (EXECUTIVE STARTUP STYLING) ─── */
function BentoCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, rotateX, rotateY, scale, glare, handleMouseMove, handleMouseEnter, handleMouseLeave } = useTilt3D({ maxRotation: 3 });

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-xl border border-white/[0.08] bg-[#0c0e18] hover:border-[#7c3aed]/40 hover:shadow-[0_12px_36px_rgba(109,40,217,0.18)] transition-all duration-300 overflow-hidden group shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ${className}`}
    >
      <div
        className="absolute inset-0 z-20 pointer-events-none rounded-xl"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
        }}
      />
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#7c3aed]/50 to-transparent" />
      <div style={{ transform: "translateZ(10px)" }} className="h-full relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

/* ─── MAIN LANDING PAGE ─── */
export default function ProspectAILanding() {
  return (
    <main className="relative min-h-screen text-white bg-[#08090e] overflow-x-hidden selection:bg-[#6d28d9] selection:text-white">
      {/* ── 3D AMBIENT DEPTH FIELD ── */}
      <Background3D />

      {/* ── ARCHITECTURAL GRID AND VIBRANT PURPLE VIGNETTE ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(109,40,217,0.22)_0%,rgba(76,29,149,0.06)_50%,transparent_75%)] blur-2xl" />
        <div className="absolute inset-0 bg-grid opacity-25" />
      </div>

      {/* ── ENTERPRISE NAVIGATION BAR ── */}
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-50 px-4 pt-3 sm:pt-4"
      >
        <div className="mx-auto max-w-7xl rounded-xl border border-white/[0.08] bg-[#0c0e17]/90 backdrop-blur-xl shadow-lg">
          <div className="px-5 sm:px-6 h-[58px] flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#6d28d9] flex items-center justify-center shadow-sm">
                <LogoMark className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold tracking-tight text-base leading-tight text-white">
                  Prospect<span className="text-[#a78bfa]">AI</span>
                </span>
                <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-400 font-medium">Radar Geoespacial B2B</span>
              </div>
            </Link>

            {/* Links */}
            <div className="hidden md:flex items-center gap-1 bg-white/[0.02] border border-white/[0.04] rounded-lg p-1">
              {[
                { name: "Console de Busca", href: "#console" },
                { name: "Módulos & Arquitetura", href: "#funcionalidades" },
                { name: "Como Funciona", href: "#como-funciona" },
                { name: "Planos de Acesso", href: "#planos" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-[12px] font-medium text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-all px-3 py-1.5 rounded-md"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Rede Operacional</span>
              </div>

              <Link
                href="/login"
                className="btn-signal flex items-center gap-2 text-xs px-4 py-2 rounded-lg font-semibold"
              >
                Acessar Plataforma <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO SECTION: RESPONSIVE ALL-DEVICES ── */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 px-4 sm:px-6 z-10">
        <div className="mx-auto max-w-7xl w-full grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Clear Value Proposition (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-start text-left pt-2 sm:pt-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6d28d9]/20 border border-[#8b5cf6]/40 mb-6 shadow-[0_0_20px_rgba(109,40,217,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#a78bfa] animate-pulse" />
              <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#ddd6fe]">
                Radar Tático B2B • Motor Geoespacial Ativo
              </span>
            </div>

            <h1 className="font-bold text-3xl sm:text-5xl xl:text-6xl tracking-[-0.03em] leading-[1.08] mb-6 text-white">
              Mapeie empresas sem presença digital e{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#7c3aed]">
                feche contratos direto com o dono.
              </span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed mb-8 font-normal">
              Varra qualquer metrópole em segundos: nossa inteligência audita empresas sem site ou com páginas inoperantes, extrai o WhatsApp verificado dos decisores e gera roteiros consultivos prontos para abordagem comercial.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-10">
              <Link
                href="/login"
                className="btn-signal flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold w-full sm:w-auto shadow-[0_8px_24px_-4px_rgba(109,40,217,0.5)]"
              >
                Iniciar Varredura Gratuita <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#console"
                className="btn-ghost flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium w-full sm:w-auto hover:border-[#7c3aed]/40 hover:bg-[#6d28d9]/10 hover:text-white"
              >
                Ver Demonstração ao Vivo
              </a>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-white/[0.08] w-full max-w-xl">
              <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:border-[#7c3aed]/30 transition-all">
                <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">100 km</p>
                <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-400 mt-0.5">Raio Metropolitano</p>
              </div>
              <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:border-[#7c3aed]/30 transition-all">
                <p className="text-xl sm:text-2xl font-bold text-[#c084fc] tracking-tight">WhatsApp</p>
                <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-400 mt-0.5">Contato Validado</p>
              </div>
              <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:border-[#7c3aed]/30 transition-all">
                <p className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight">195 Países</p>
                <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-400 mt-0.5">Malha Global</p>
              </div>
            </div>
          </div>

          {/* Right Column: Professional 3D Vector Globe (Mobile & Desktop Perfect) */}
          <div className="lg:col-span-6 relative flex items-center justify-center w-full mt-4 lg:mt-0">
            <div className="relative w-full flex items-center justify-center">
              <Globe size="hero" showControls={true} showHubSelector={true} />
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER STRIP ── */}
      <Ticker />

      {/* ── INTERACTIVE PLATFORM CONSOLE DEMO ── */}
      <section id="console" className="relative z-10 py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400 mb-2 block">
              Demonstração Interativa da Ferramenta
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Veja a qualidade dos dados gerados em segundos.
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto mt-2">
              Selecione uma metrópole abaixo para visualizar empresas reais mapeadas sem presença web e com contatos prontos para abordagem.
            </p>
          </div>
          <InteractivePlatformPreview />
        </div>
      </section>

      {/* ── EXPANDED BENTO GRID (ALL USER REQUESTED MODULES) ── */}
      <section id="funcionalidades" className="relative z-10 py-24 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 mb-3">
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-zinc-300">
                Arquitetura de Dados B2B Completa
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Engenharia de dados e automação para prospecção de alta escala.
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl mx-auto mt-3">
              Da captura geoespacial do território ao disparo em massa automatizado e acompanhamento no CRM Kanban.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Motor Geoespacial 100km (Large 2-col) */}
            <BentoCard className="lg:col-span-2 p-7" delay={0}>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-[#6d28d9]/25 text-[#a78bfa] font-semibold border border-[#7c3aed]/35">
                      MÓDULO 01 • MALHA GEOESPACIAL
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#6d28d9]/20 border border-[#7c3aed]/40 text-[#a78bfa] flex items-center justify-center">
                      <GlobeIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                    Mapeamento Territorial com Raio Expansível até 100km
                  </h3>
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-6">
                    A infraestrutura do ProspectAI divide a busca em clusters de nós geográficos paralelos. Isso permite varrer regiões metropolitanas completas em cidades brasileiras e internacionais sem sofrer Timeouts 504 e captando todas as empresas cadastradas no OpenStreetMap.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.06]">
                  {[
                    ["5km a 100km", "Amplitude de Raio"],
                    ["Zero Falhas", "Arquitetura em Lotes"],
                    ["195 Países", "Malha OpenStreetMap"],
                  ].map(([v, l]) => (
                    <div key={l} className="p-3 rounded-lg bg-[#070912] border border-white/[0.05]">
                      <p className="font-bold text-white text-sm">{v}</p>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </BentoCard>

            {/* Card 2: Disparo em Massa Automatizado */}
            <BentoCard className="p-7" delay={0.06}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/35">
                  MÓDULO 02 • DISPARO EM MASSA
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Disparo em Massa Automatizado</h3>
              <p className="text-zinc-300 text-xs leading-relaxed mb-4">
                Envio multi-canal escalável com conexão direta de instâncias WhatsApp e SMTP corporativo. Rotação automática de canais, cadência inteligente anti-bloqueio e intervalos humanizados programáveis.
              </p>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-zinc-400">
                <span>• Rotação de Chips</span>
                <span>• Anti-Ban Delay</span>
              </div>
            </BentoCard>

            {/* Card 3: Cartografia Mundial & Heatmap */}
            <BentoCard className="p-7" delay={0.1}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-violet-500/20 text-[#c4b5fd] font-semibold border border-violet-500/35">
                  MÓDULO 03 • CARTOGRAFIA MUNDIAL
                </span>
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/40 text-[#c4b5fd] flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Cartografia & Heatmap de Densidade</h3>
              <p className="text-zinc-300 text-xs leading-relaxed mb-4">
                Visualização cartográfica em camadas com mapa de calor mostrando a concentração de empresas sem site por bairro e setor econômico. Identifique polos comerciais com alta densidade para prospecção cirúrgica.
              </p>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-zinc-400">
                <span>• Zonas Comerciais</span>
                <span>• Mapas de Calor</span>
              </div>
            </BentoCard>

            {/* Card 4: Auditoria Automatizada */}
            <BentoCard className="p-7" delay={0.14}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/35">
                  MÓDULO 04 • AUDITORIA WEB
                </span>
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Detecção de Déficit Digital</h3>
              <p className="text-zinc-300 text-xs leading-relaxed mb-4">
                O robô audita automaticamente cada empresa: checa a existência de website, validade de certificado SSL, conformidade com dispositivos móveis e tempo de carregamento para entregar o argumento de venda pronto.
              </p>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-zinc-400">
                <span>• Checagem SSL</span>
                <span>• Auditoria Mobile</span>
              </div>
            </BentoCard>

            {/* Card 5: Auditor de Domínios & DNS em Tempo Real */}
            <BentoCard className="p-7" delay={0.18}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/35">
                  MÓDULO 05 • DOMÍNIOS & DNS
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <Server className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Auditor de Domínios & DNS</h3>
              <p className="text-zinc-300 text-xs leading-relaxed mb-4">
                Varredura instantânea de status de registro (Whois), registros MX, SPF/DKIM e domínios congelados ou expirados. Encontre clientes que perderam o domínio e precisam de recuperação imediata.
              </p>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-zinc-400">
                <span>• Domínios Expirados</span>
                <span>• Registros DNS/MX</span>
              </div>
            </BentoCard>

            {/* Card 6: Enriquecimento de Dados & WhatsApp */}
            <BentoCard className="p-7" delay={0.22}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/35">
                  MÓDULO 06 • DECISORES
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">WhatsApp Comercial Validado</h3>
              <p className="text-zinc-300 text-xs leading-relaxed mb-4">
                Elimine a barreira de secretárias ou números fixos inoperantes. A plataforma extrai números de WhatsApp ativos, páginas comerciais no Instagram e e-mails para abordagem direta com o decisor.
              </p>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-zinc-400">
                <span>• WhatsApp Ativo</span>
                <span>• Instagram Business</span>
              </div>
            </BentoCard>

            {/* Card 7: Roteiros Consultivos */}
            <BentoCard className="p-7" delay={0.26}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/35">
                  MÓDULO 07 • CONVERSÃO
                </span>
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/40 text-violet-300 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Roteiros Consultivos de Venda</h3>
              <p className="text-zinc-300 text-xs leading-relaxed mb-4">
                Gere abordagens consultivas sob medida com base nas deficiências detectadas na empresa alvo. Textos objetivos, persuasivos e prontos para envio sem parecer spam.
              </p>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-zinc-400">
                <span>• Pitches de Alto Impacto</span>
                <span>• Copy Consultiva</span>
              </div>
            </BentoCard>

            {/* Card 8: Pipeline CRM */}
            <BentoCard className="p-7" delay={0.3}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-300 font-semibold border border-indigo-500/35">
                  MÓDULO 08 • CRM KANBAN
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Gestão de Funil & Contratos MRR</h3>
              <p className="text-zinc-300 text-xs leading-relaxed mb-4">
                Mova leads pelas etapas de Primeiro Contato, Proposta Enviada e Fechado. Acompanhe a receita mensal recorrente (MRR) de manutenção e criação de sites em um único painel.
              </p>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-zinc-400">
                <span>• Controle de MRR</span>
                <span>• Funil Integrado</span>
              </div>
            </BentoCard>

            {/* Card 9: Integrações & Exportação */}
            <BentoCard className="p-7" delay={0.34}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-purple-500/15 text-purple-300 font-semibold border border-purple-500/35">
                  MÓDULO 09 • INTEGRAÇÕES
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center">
                  <DownloadCloud className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Exportação & Webhooks Imediatos</h3>
              <p className="text-zinc-300 text-xs leading-relaxed mb-4">
                Exporte listas completas em formato CSV ou conecte via Webhooks ao seu CRM (HubSpot, RD Station, ActiveCampaign) para disparo e automação contínua.
              </p>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-zinc-400">
                <span>• Planilhas CSV</span>
                <span>• Webhooks REST</span>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA (4 ETAPAS CLARAS) ── */}
      <section id="como-funciona" className="relative z-10 py-24 px-4 sm:px-6 border-y border-white/[0.06] bg-[#07080e]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400 mb-2 block">
              Processo Operacional
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Do mapeamento do território ao fechamento do contrato.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                title: "Defina a Região",
                desc: "Selecione a cidade, o nicho de mercado e ajuste a amplitude do raio de 5km até 100km.",
                icon: MapPin,
              },
              {
                num: "02",
                title: "Execute a Varredura",
                desc: "A malha vetorial processa centenas de registros e identifica empresas sem site ou com falhas digitais.",
                icon: Search,
              },
              {
                num: "03",
                title: "Analise o Diagnóstico",
                desc: "Receba o WhatsApp do responsável, score de oportunidade e argumento comercial estruturado.",
                icon: ShieldCheck,
              },
              {
                num: "04",
                title: "Inicie o Contato",
                desc: "Dispare abordagens consultivas com alto índice de resposta e adicione o cliente ao CRM.",
                icon: Send,
              },
            ].map((step) => (
              <SpotlightCard key={step.num} className="p-6 border-zinc-800/80 hover:border-[#7c3aed]/40 transition-all">
                <div className="w-9 h-9 rounded-lg bg-[#6d28d9]/15 border border-[#7c3aed]/30 flex items-center justify-center mb-4 text-[#c4b5fd] shadow-sm">
                  <step.icon className="w-4 h-4" />
                </div>
                <span className="font-mono text-xl font-bold text-[#a78bfa] mb-2 block">{step.num}</span>
                <h4 className="font-semibold text-base text-white mb-1.5">{step.title}</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">{step.desc}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANOS & ACESSO ── */}
      <section id="planos" className="relative z-10 py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400 mb-2 block">
              Planos Transparentes
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Pronto para construir sua carteira de clientes recorrentes?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Free Tier */}
            <SpotlightCard className="p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold block mb-2">Degustação</span>
                <h3 className="text-3xl font-bold text-white mb-2">Acesso Gratuito</h3>
                <p className="text-zinc-400 text-sm mb-6">Experimente o motor geoespacial sem compromisso.</p>

                <div className="space-y-3 mb-8">
                  {[
                    "50 buscas por mês",
                    "Acesso ao motor de OpenStreetMap",
                    "Diagnóstico básico de presença web",
                    "Exportação de dados limitada",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span className="text-xs text-zinc-300">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/login"
                className="btn-ghost w-full py-3 rounded-lg font-semibold text-xs text-center block"
              >
                Criar Conta Gratuita
              </Link>
            </SpotlightCard>

            {/* Pro Tier (Solid Executive Purple) */}
            <div className="relative rounded-xl border border-violet-700/60 bg-[#0e101a] p-8 sm:p-10 flex flex-col justify-between shadow-xl ring-1 ring-violet-500/20">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-violet-300 font-bold">Ilimitado</span>
                  <span className="font-mono text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded bg-violet-700 text-white">
                    RECOMENDADO
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Plano Profissional</h3>
                <p className="text-zinc-400 text-sm mb-6">Capacidade máxima para agências e profissionais de vendas.</p>

                <div className="space-y-3 mb-8">
                  {[
                    "Buscas ilimitadas em qualquer metrópole",
                    "Expansão de raio completo de até 100km",
                    "Disparo em massa automatizado WhatsApp & Email",
                    "Cartografia mundial e heatmap de densidade",
                    "Auditor de domínios congelados & servidores DNS",
                    "Detecção avançada de falhas em websites e SSL",
                    "Extração de WhatsApp e contatos diretos do decisor",
                    "Pipeline CRM com controle de contratos MRR",
                    "Exportação CSV sem limites e suporte prioritário",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-zinc-200 font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/login"
                className="btn-signal w-full py-3.5 rounded-lg font-semibold text-xs text-center block"
              >
                Acessar Versão Completa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.06] py-10 px-4 sm:px-6 bg-[#06070c]">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700/80 text-zinc-100 flex items-center justify-center">
              <LogoMark className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              ProspectAI
            </span>
          </div>

          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            © 2026 ProspectAI • Plataforma de Inteligência de Vendas B2B
          </p>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
              Servidores Operacionais
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
