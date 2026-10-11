"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { SpotlightCard } from "@/components/SpotlightCard";
import { useTilt3D } from "@/hooks/useAnimations";
import {
  ArrowRight, Search, Activity, BarChart3,
  Crosshair, Layers, MapPin, CheckCircle2,
  Phone, Globe as GlobeIcon, FileText, Send,
  Sliders, ShieldCheck, Database, Building2
} from "lucide-react";

// Dynamic Client-Only Load for Globe to guarantee zero-SSR hydration issues
const Globe = dynamic(() => import("@/components/Globe"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-[600px] aspect-square flex flex-col items-center justify-center">
      <div className="w-64 h-64 rounded-full border border-violet-900/40 animate-pulse bg-violet-950/20 flex items-center justify-center shadow-lg">
        <div className="w-44 h-44 rounded-full border border-dashed border-violet-500/40 animate-spin" />
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-violet-400 font-semibold mt-4 animate-pulse">
        Carregando Base Vetorial 3D...
      </span>
    </div>
  ),
});

/* ─── LIVE TICKER STRIP ─── */
const TICKER_ITEMS = [
  "RADAR GEOESPACIAL B2B ATIVO",
  "COBERTURA METROPOLITANA ATÉ 100KM",
  "AUDITORIA AUTOMÁTICA DE AUSÊNCIA DE WEBSITE",
  "ENRIQUECIMENTO DE DECISORES & WHATSAPP",
  "ROTEIROS CONSULTIVOS DE PROSPECÇÃO",
  "COBERTURA EM 195 PAÍSES",
  "PIPELINE KANBAN & MÉTRICAS DE MRR",
  "ZERO TIMEOUT ENGINE",
];

function Ticker() {
  return (
    <div className="relative overflow-hidden border-y border-white/[0.08] bg-[#070910] py-3 select-none">
      <div className="flex gap-0 animate-[marquee_28s_linear_infinite] w-max">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-8 font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
            <span className="hover:text-white transition-colors duration-200">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── REAL INTERACTIVE PLATFORM DEMO CONSOLE (SUBSTITUTES FAKE TERMINAL) ─── */
interface DemoLead {
  name: string;
  niche: string;
  neighborhood: string;
  issue: string;
  whatsapp: string;
  priority: "Alta" | "Imediata" | "Média";
}

const DEMO_LEADS_DATA: Record<string, DemoLead[]> = {
  "São Paulo, SP": [
    { name: "Clínica Odonto Vida", niche: "Odontologia", neighborhood: "Perdizes", issue: "Sem Website Detectado", whatsapp: "(11) 98421-9920", priority: "Alta" },
    { name: "Auto Mecânica Paulista", niche: "Automotivo", neighborhood: "Mooca", issue: "Domínio Expirado", whatsapp: "(11) 97134-1180", priority: "Imediata" },
    { name: "Bistrô & Café Jardins", niche: "Gastronomia", neighborhood: "Jardins", issue: "Sem Cardápio Próprio", whatsapp: "(11) 99820-4411", priority: "Alta" },
    { name: "Escritório Contábil Souza", niche: "Contabilidade", neighborhood: "Pinheiros", issue: "Site Não-Mobile / Lento", whatsapp: "(11) 96510-3302", priority: "Média" },
  ],
  "Rio de Janeiro, RJ": [
    { name: "Consultório Dr. Marcelo", niche: "Saúde & Estética", neighborhood: "Barra da Tijuca", issue: "Sem Website Detectado", whatsapp: "(21) 98840-7711", priority: "Alta" },
    { name: "Academia Iron Fit", niche: "Fitness", neighborhood: "Botafogo", issue: "Página Social sem Domínio", whatsapp: "(21) 97412-3390", priority: "Imediata" },
    { name: "Pizzaria Artesanal Lapa", niche: "Gastronomia", neighborhood: "Lapa", issue: "Dependência de Marketplace", whatsapp: "(21) 99310-8844", priority: "Alta" },
    { name: "Imobiliária Carioca Prime", niche: "Imóveis", neighborhood: "Ipanema", issue: "Site sem Certificado SSL", whatsapp: "(21) 96120-5590", priority: "Média" },
  ],
  "Belo Horizonte, MG": [
    { name: "Distribuidora Minas Aço", niche: "Logística & B2B", neighborhood: "Contagem", issue: "Sem Website Detectado", whatsapp: "(31) 98711-2200", priority: "Alta" },
    { name: "Ateliê & Confeitaria Savassi", niche: "Alimentação", neighborhood: "Savassi", issue: "Domínio Expirado", whatsapp: "(31) 97320-4491", priority: "Imediata" },
    { name: "Clínica Veterinária Pampulha", niche: "Pet & Vet", neighborhood: "Pampulha", issue: "Sem Presença Digital", whatsapp: "(31) 99410-6622", priority: "Alta" },
    { name: "Advocacia & Perícias BH", niche: "Jurídico", neighborhood: "Lourdes", issue: "Site Obsoleto / Desktop Only", whatsapp: "(31) 96811-9940", priority: "Média" },
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
    <div className="rounded-2xl border border-white/[0.08] bg-[#090b12] overflow-hidden shadow-2xl">
      {/* Platform Console Header */}
      <div className="px-5 py-4 border-b border-white/[0.07] bg-[#0c0e18] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#6d28d9]/25 border border-[#7c3aed]/40 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-[#a78bfa]" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-white">Console Operacional de Varredura</h4>
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
      <div className="p-4 sm:p-5 border-b border-white/[0.06] bg-[#090b14]/50 flex flex-wrap items-center justify-between gap-4">
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
                  ? "bg-[#6d28d9] text-white shadow-sm font-semibold"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]"
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
                  ? "bg-white/10 text-white border border-white/20 font-bold"
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
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-300 font-mono text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-[#6d28d9] hover:text-white border border-white/10 text-zinc-300 font-medium text-xs transition-all"
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

/* ─── 3D BENTO CARD (CLEAN STARTUP STYLING) ─── */
function BentoCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, rotateX, rotateY, scale, glare, handleMouseMove, handleMouseEnter, handleMouseLeave } = useTilt3D({ maxRotation: 4 });

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-2xl border border-white/[0.08] bg-[#0d0f18] hover:border-violet-500/40 transition-colors duration-300 overflow-hidden group ${className}`}
    >
      <div
        className="absolute inset-0 z-20 pointer-events-none rounded-2xl"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
        }}
      />
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#7c3aed]/40 to-transparent" />
      <div style={{ transform: "translateZ(12px)" }} className="h-full relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

/* ─── MAIN LANDING PAGE ─── */
export default function ProspectAILanding() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <main className="relative min-h-screen text-white bg-[#06070b] overflow-x-hidden selection:bg-[#6d28d9] selection:text-white">
      {/* ── SUBTLE SOLID PURPLE VIGNETTE (NO MULTI-COLOR GRADIENTS) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(109,40,217,0.18)_0%,rgba(76,29,149,0.05)_50%,transparent_75%)] blur-2xl" />
        <div className="absolute inset-0 bg-grid opacity-25" />
      </div>

      {/* ── ENTERPRISE NAVIGATION BAR ── */}
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-50 px-4 pt-3 sm:pt-4"
      >
        <div className="mx-auto max-w-7xl rounded-xl border border-white/[0.08] bg-[#090b14]/90 backdrop-blur-xl shadow-lg">
          <div className="px-5 sm:px-6 h-[60px] flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#6d28d9] flex items-center justify-center shadow-sm">
                <Crosshair className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black tracking-tight text-base leading-tight text-white">
                  Prospect<span className="text-[#a78bfa]">AI</span>
                </span>
                <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-400 font-medium">B2B Lead Intelligence</span>
              </div>
            </Link>

            {/* Links */}
            <div className="hidden md:flex items-center gap-1 bg-white/[0.02] border border-white/[0.04] rounded-lg p-1">
              {[
                { name: "Console de Busca", href: "#console" },
                { name: "Arquitetura & Motores", href: "#funcionalidades" },
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

      {/* ── HERO SECTION: PROFESSIONAL STARTUP LAYOUT ── */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 px-4 sm:px-6 z-10">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="mx-auto max-w-7xl w-full grid lg:grid-cols-12 gap-10 lg:gap-12 items-center"
        >
          {/* Left Column: Clear, High-Value Value Proposition (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-start text-left pt-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#6d28d9]/15 border border-[#7c3aed]/30 mb-6"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-zinc-200">
                Plataforma de Prospecção Geoespacial B2B
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.6 }}
              className="font-display font-black text-4xl sm:text-5xl xl:text-6xl tracking-tight leading-[1.08] mb-6 text-white"
            >
              Encontre empresas locais com déficit digital{" "}
              <span className="text-[#a78bfa]">sem intermediários.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.6 }}
              className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed mb-8 font-normal"
            >
              Mapeie em minutos regiões metropolitanas de até 100km, identifique empresas sem site profissional ou com páginas obsoletas e acesse os contatos diretos de sócios e tomadores de decisão com WhatsApp verificado.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.6 }}
              className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-10"
            >
              <Link
                href="/login"
                className="btn-signal flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold w-full sm:w-auto"
              >
                Iniciar Varredura Gratuita <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#console"
                className="btn-ghost flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm font-medium w-full sm:w-auto"
              >
                Ver Demonstração ao Vivo
              </a>
            </motion.div>

            {/* Metrics Breakdown */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32, duration: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.08] w-full max-w-lg"
            >
              <div>
                <p className="font-display text-2xl font-black text-white">195+</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Países Mapeados</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black text-[#a78bfa]">100km</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Raio Metropolitano</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black text-emerald-400">Zero</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Timeouts de Busca</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Professional 3D Vector Globe (6 cols) */}
          <div className="lg:col-span-6 relative flex items-center justify-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full flex items-center justify-center"
            >
              <Globe size="hero" showControls={true} showHubSelector={true} />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── TICKER STRIP ── */}
      <Ticker />

      {/* ── INTERACTIVE PLATFORM CONSOLE DEMO (REPLACES FAKE TERMINAL) ── */}
      <section id="console" className="relative z-10 py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a78bfa] mb-2 block">
              Demonstração Interativa da Ferramenta
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
              Veja a qualidade dos dados gerados em segundos.
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto mt-2">
              Selecione uma metrópole abaixo para visualizar empresas reais mapeadas sem presença web e com contatos prontos para abordagem.
            </p>
          </div>
          <InteractivePlatformPreview />
        </div>
      </section>

      {/* ── BENTO GRID ARSENAL TECNOLÓGICO ── */}
      <section id="funcionalidades" className="relative z-10 py-24 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#6d28d9]/15 border border-[#7c3aed]/30 mb-3">
              <Layers className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-zinc-300">
                Arquitetura de Dados B2B
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white">
              Engenharia de dados desenhada para fechar contratos.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Motor Geoespacial (Large 2-col) */}
            <BentoCard className="lg:col-span-2 p-7" delay={0}>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-[#6d28d9]/25 text-[#a78bfa] font-bold border border-[#7c3aed]/30">
                      MÓDULO 01 • MALHA GEOESPACIAL
                    </span>
                    <GlobeIcon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    Mapeamento Territorial com Raio Expansível até 100km
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
                    A infraestrutura do ProspectAI divide a busca em clusters de nós geográficos paralelos. Isso permite varrer regiões metropolitanas completas em cidades brasileiras e internacionais sem sofrer Timeouts 504 e captando todas as empresas cadastradas.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.06]">
                  {[
                    ["5km a 100km", "Amplitude de Raio"],
                    ["Zero Falhas", "Arquitetura em Lotes"],
                    ["195 Países", "Malha OpenStreetMap"],
                  ].map(([v, l]) => (
                    <div key={l} className="p-3 rounded-lg bg-[#070912] border border-white/[0.05]">
                      <p className="font-display font-bold text-white text-sm">{v}</p>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </BentoCard>

            {/* Card 2: Auditoria Automatizada */}
            <BentoCard className="p-7" delay={0.08}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-white/[0.05] text-zinc-300 font-semibold border border-white/10">
                  MÓDULO 02 • AUDITORIA
                </span>
                <Search className="w-5 h-5 text-zinc-400" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">Detecção de Déficit Digital</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                O robô audita automaticamente cada empresa: checa a existência de website, validade de certificado SSL, conformidade com dispositivos móveis e tempo de carregamento para entregar o argumento de venda pronto.
              </p>
            </BentoCard>

            {/* Card 3: Enriquecimento de Dados */}
            <BentoCard className="p-7" delay={0.12}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-white/[0.05] text-zinc-300 font-semibold border border-white/10">
                  MÓDULO 03 • DECISORES
                </span>
                <Phone className="w-5 h-5 text-zinc-400" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">WhatsApp Comercial Validado</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                Elimine a barreira de secretárias ou números fixos inoperantes. A plataforma extrai números de WhatsApp ativos, páginas comerciais no Instagram e e-mails para abordagem direta com o decisor.
              </p>
            </BentoCard>

            {/* Card 4: Roteiros Consultivos */}
            <BentoCard className="p-7" delay={0.16}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-white/[0.05] text-zinc-300 font-semibold border border-white/10">
                  MÓDULO 04 • CONVERSÃO
                </span>
                <FileText className="w-5 h-5 text-zinc-400" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">Roteiros de Abordagem Personalizados</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                Gere abordagens consultivas sob medida com base nas deficiências detectadas na empresa alvo. Textos objetivos, persuasivos e prontos para envio sem parecer spam.
              </p>
            </BentoCard>

            {/* Card 5: Pipeline CRM */}
            <BentoCard className="p-7" delay={0.2}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-white/[0.05] text-zinc-300 font-semibold border border-white/10">
                  MÓDULO 05 • CRM
                </span>
                <BarChart3 className="w-5 h-5 text-zinc-400" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">Gestão de Funil & Contratos Recorrentes</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                Mova leads pelas etapas de Primeiro Contato, Proposta Enviada e Fechado. Acompanhe a receita mensal recorrente (MRR) de manutenção e criação de sites em um único painel.
              </p>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA (4 ETAPAS CLARAS) ── */}
      <section id="como-funciona" className="relative z-10 py-24 px-4 sm:px-6 border-y border-white/[0.06] bg-[#070912]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a78bfa] mb-2 block">
              Processo Operacional
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white">
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
              <SpotlightCard key={step.num} className="p-6">
                <div className="w-9 h-9 rounded-lg bg-[#6d28d9]/20 border border-[#7c3aed]/40 flex items-center justify-center mb-4 text-[#a78bfa]">
                  <step.icon className="w-4 h-4" />
                </div>
                <span className="font-mono text-xl font-black text-[#a78bfa] mb-2 block">{step.num}</span>
                <h4 className="font-display font-bold text-base text-white mb-1.5">{step.title}</h4>
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
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a78bfa] mb-2 block">
              Planos Transparentes
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white">
              Pronto para construir sua carteira de clientes recorrentes?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Free Tier */}
            <SpotlightCard className="p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold block mb-2">Degustação</span>
                <h3 className="font-display text-3xl font-black text-white mb-2">Acesso Gratuito</h3>
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

            {/* Pro Tier (Solid Deep Purple) */}
            <div className="relative rounded-xl border border-[#7c3aed]/50 bg-[#0c0e18] p-8 sm:p-10 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#a78bfa] font-bold">Ilimitado</span>
                  <span className="font-mono text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#6d28d9] text-white">
                    RECOMENDADO
                  </span>
                </div>
                <h3 className="font-display text-3xl font-black text-white mb-2">Plano Profissional</h3>
                <p className="text-zinc-400 text-sm mb-6">Capacidade máxima para agências e profissionais de vendas.</p>

                <div className="space-y-3 mb-8">
                  {[
                    "Buscas ilimitadas em qualquer metrópole",
                    "Expansão de raio completo de até 100km",
                    "Detecção avançada de falhas em websites",
                    "Extração de WhatsApp e contatos diretos",
                    "Geração de roteiros consultivos de venda",
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
                className="btn-signal w-full py-3.5 rounded-lg font-bold text-xs text-center block"
              >
                Acessar Versão Completa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.06] py-10 px-4 sm:px-6 bg-[#05060a]">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#6d28d9] flex items-center justify-center">
              <Crosshair className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-sm font-bold tracking-tight text-white">
              Prospect<span className="text-[#a78bfa]">AI</span>
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
