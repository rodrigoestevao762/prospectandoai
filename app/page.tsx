"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { SpotlightCard } from "@/components/SpotlightCard";
import { useTilt3D } from "@/hooks/useAnimations";
import {
  ArrowRight, Search, Activity, BarChart3,
  MessageSquare, TrendingUp, Crosshair,
  Globe as GlobeIcon, Zap, Check, Sparkles,
  Shield, Layers, Terminal as TerminalIcon,
  MapPin, Radio, Compass, Send, CheckCircle2
} from "lucide-react";

// Dynamic Client-Only Load for Globe to guarantee zero-SSR hydration issues
const Globe = dynamic(() => import("@/components/Globe"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-[600px] aspect-square flex flex-col items-center justify-center">
      <div className="w-64 h-64 rounded-full border-2 border-[#a855f7]/30 animate-pulse bg-[#a855f7]/5 flex items-center justify-center">
        <div className="w-44 h-44 rounded-full border border-dashed border-[#c084fc]/40 animate-spin" />
      </div>
      <span className="mono text-xs uppercase tracking-widest text-[#c084fc] font-bold mt-4 animate-pulse">
        Carregando Satélite 3D...
      </span>
    </div>
  ),
});

/* ─── LIVE TICKER STRIP ─── */
const TICKER_ITEMS = [
  "RADAR OSINT v4.2 ATIVO",
  "VARREDURA MULTI-SATÉLITE",
  "ENRIQUECIMENTO AUTOMÁTICO",
  "COLD EMAILS COM IA",
  "COBERTURA EM 195 PAÍSES",
  "PIPELINE CRM KANBAN",
  "ZERO TIMEOUT ENGINE",
  "EXPANSÃO DE RAIO METROPOLITANO 100KM",
];

function Ticker() {
  return (
    <div className="relative overflow-hidden border-y border-white/[0.08] bg-black/50 py-3.5 select-none backdrop-blur-md">
      <div className="flex gap-0 animate-[marquee_28s_linear_infinite] w-max">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-8 mono text-[11px] font-bold tracking-[0.22em] uppercase text-white/50">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] shadow-[0_0_10px_#a855f7]" />
            <span className="hover:text-white transition-colors duration-200">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── OSINT TERMINAL SIMULATOR ─── */
function OsintTerminal() {
  const [lines, setLines] = useState<{ text: string; type: string }[]>([]);
  const [done, setDone] = useState(false);

  const SCRIPT = [
    { text: "$ osint-satellite --target=\"Barcelona, ES\" --niche=\"Escolas & Cursos\"", type: "cmd" },
    { text: "↳ Conectando aos clusters de satélite da Europa (Frankfurt & Paris)...", type: "info" },
    { text: "↳ Processando malha vetorial nw(around:35000)... Raio: 35km", type: "info" },
    { text: "✓ 284 instituições mapeadas na zona metropolitana central.", type: "success" },
    { text: "↳ Algoritmo Deep Scan: auditando presença digital e mobile...", type: "info" },
    { text: "✓ 1.480 empresas detectadas com websites obsoletos ou sem domínio.", type: "success" },
    { text: "✓ Enriquecimento de Instagram comercial, WhatsApp e decisores concluído.", type: "highlight" },
    { text: "▶ Payload pronto. Iniciar sequências automatizadas de prospecção.", type: "cta" },
  ];

  useEffect(() => {
    let i = 0;
    const run = () => {
      if (i >= SCRIPT.length) { setDone(true); return; }
      setLines((prev) => [...prev, SCRIPT[i]]);
      i++;
      setTimeout(run, 600 + Math.random() * 250);
    };
    const t = setTimeout(run, 500);
    return () => clearTimeout(t);
  }, []);

  const colorMap: Record<string, string> = {
    cmd: "text-[#c084fc] font-bold",
    info: "text-white/50",
    success: "text-[#10b981]",
    highlight: "text-[#38bdf8]",
    cta: "text-[#f59e0b] font-bold",
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#080b12]/90 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ef4444]/80" />
          <span className="w-3 h-3 rounded-full bg-[#f59e0b]/80" />
          <span className="w-3 h-3 rounded-full bg-[#10b981]/80" />
        </div>
        <span className="flex-1 text-center mono text-[10px] text-white/40 tracking-widest uppercase">
          telemetria de varredura • osint-engine-v4.2
        </span>
        <span className="flex items-center gap-1.5 mono text-[9px] text-[#10b981] font-bold bg-[#10b981]/10 px-2.5 py-0.5 rounded-full border border-[#10b981]/25">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" /> SATÉLITE ATIVO
        </span>
      </div>
      <div className="p-5 sm:p-6 space-y-2 min-h-[230px] font-mono text-[12px] leading-relaxed">
        <AnimatePresence>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className={colorMap[line.type] || "text-white/60"}
            >
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>
        {!done && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2.5 h-4 bg-[#a855f7] ml-1 align-middle shadow-[0_0_12px_#a855f7]"
          />
        )}
      </div>
    </div>
  );
}

/* ─── 3D BENTO CARD ─── */
function BentoCard({
  children,
  className = "",
  delay = 0,
  accent = "#a855f7",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  accent?: string;
}) {
  const { ref, rotateX, rotateY, scale, glare, handleMouseMove, handleMouseEnter, handleMouseLeave } = useTilt3D({ maxRotation: 5 });

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-3xl border border-white/[0.08] bg-[#0c101a]/75 backdrop-blur-xl overflow-hidden group ${className}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
        style={{ boxShadow: `inset 0 0 60px ${accent}20, 0 0 0 1px ${accent}35` }}
      />
      <div
        className="absolute inset-0 z-20 pointer-events-none rounded-3xl"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
        }}
      />
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#a855f7]/40 to-transparent" />
      <div style={{ transform: "translateZ(15px)" }} className="h-full relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

/* ─── MAIN LANDING PAGE ─── */
export default function ProspectAILanding() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <main className="relative min-h-screen text-white bg-[#050608] overflow-x-hidden selection:bg-[#a855f7] selection:text-white">
      {/* ── AMBIENT ELECTRIC PURPLE AURORA BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Core Vibrant Purple Nebula */}
        <div
          className="absolute -top-32 left-1/4 w-[650px] h-[650px] bg-gradient-to-tr from-[#a855f7]/25 via-[#9333ea]/15 to-transparent rounded-full blur-[140px] animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        {/* Secondary Magenta / Violet Glow */}
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#c026d3]/18 via-[#a855f7]/12 to-transparent rounded-full blur-[140px]" />
        {/* Deep Horizon Purple Atmosphere */}
        <div className="absolute bottom-20 left-10 w-[550px] h-[550px] bg-gradient-to-tr from-[#7e22ce]/20 via-transparent to-transparent rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-grid opacity-35" />
      </div>

      {/* ── FLOATING NAVIGATION ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-50 px-4 pt-4"
      >
        <div className="mx-auto max-w-7xl rounded-2xl border border-white/[0.08] bg-[#080b12]/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <div className="px-6 h-[64px] flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#7e22ce] flex items-center justify-center shadow-[0_0_24px_rgba(168,85,247,0.6)] group-hover:scale-105 transition-transform">
                <Crosshair className="w-5 h-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-[#c084fc] animate-ping opacity-25" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black tracking-tight text-lg leading-tight text-white">
                  Prospect<span className="text-[#c084fc]">AI</span>
                </span>
                <span className="mono text-[8px] uppercase tracking-widest text-[#94a3b8]">OSINT Intelligence</span>
              </div>
            </Link>

            {/* Links */}
            <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.05] rounded-xl p-1">
              {[
                { name: "Funcionalidades", href: "#funcionalidades" },
                { name: "Radar OSINT", href: "#radar" },
                { name: "Como Funciona", href: "#como-funciona" },
                { name: "Planos", href: "#planos" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="font-display text-[12px] font-semibold text-white/60 hover:text-white hover:bg-white/[0.06] transition-all px-4 py-2 rounded-lg"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/25">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="mono text-[10px] text-[#10b981] uppercase tracking-wider font-bold">Satélites Prontos</span>
              </div>
              <Link
                href="/login"
                className="btn-signal flex items-center gap-2 text-[12px] px-5 py-2.5 rounded-xl uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              >
                Acessar <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO SECTION WITH ULTRA-REALISTIC INTERACTIVE 3D GLOBE ── */}
      <section className="relative min-h-[95vh] flex items-center pt-28 pb-16 px-4 sm:px-6 z-10">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="mx-auto max-w-7xl w-full grid lg:grid-cols-12 gap-10 lg:gap-14 items-center"
        >
          {/* Left: Product Headline & Startup Pitch (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-start text-left pt-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#a855f7]/15 border border-[#a855f7]/35 mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#c084fc]" />
              <span className="mono text-[11px] font-bold tracking-widest uppercase text-[#e9d5ff]">
                Radar B2B Global • Nova Geração 2026
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="font-display font-black text-4xl sm:text-6xl xl:text-7xl tracking-tight leading-[1.04] mb-6 text-white"
            >
              Encontre clientes em qualquer lugar do{" "}
              <span className="grad-text">planeta.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-[#94a3b8] text-base sm:text-lg max-w-xl leading-relaxed mb-8 font-normal"
            >
              Varredura unificada com motores de OpenStreetMap, Instagram e Delivery. Mapeie até milhares de empresas sem presença digital com raio expansível até 100km, enriqueça decisores com IA e feche contratos de alto valor.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10"
            >
              <Link
                href="/login"
                className="btn-signal flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold tracking-wide w-full sm:w-auto shadow-[0_0_35px_rgba(168,85,247,0.5)]"
              >
                Ativar Radar Grátis <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#como-funciona"
                className="btn-ghost flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold text-white/80 hover:text-white w-full sm:w-auto"
              >
                Ver Como Funciona
              </a>
            </motion.div>

            {/* Social Trust Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.08] w-full max-w-lg"
            >
              <div>
                <p className="font-display text-2xl font-black text-white">195+</p>
                <p className="mono text-[10px] uppercase tracking-wider text-[#94a3b8]">Países Cobertos</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black text-[#c084fc]">3 Motores</p>
                <p className="mono text-[10px] uppercase tracking-wider text-[#94a3b8]">Simultâneos</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black text-[#10b981]">100km</p>
                <p className="mono text-[10px] uppercase tracking-wider text-[#94a3b8]">Raio Expansível</p>
              </div>
            </motion.div>
          </div>

          {/* Right: Ultra-Realistic Bigger 100% Interactive 3D Globe (6 cols) */}
          <div className="lg:col-span-6 relative flex items-center justify-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full flex items-center justify-center"
            >
              <Globe size="hero" showControls={true} showCitySelector={true} />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── TICKER STRIP ── */}
      <Ticker />

      {/* ── TERMINAL TELEMETRY SECTION ── */}
      <section className="relative z-10 py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#c084fc] mb-3 block">
              Execução ao Vivo
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white">
              Sinta o poder do Motor OSINT operando em tempo real.
            </h2>
          </div>
          <OsintTerminal />
        </div>
      </section>

      {/* ── BENTO GRID ARSENAL TECNOLÓGICO ── */}
      <section id="funcionalidades" className="relative z-10 py-28 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#a855f7]/15 border border-[#a855f7]/30 mb-4"
            >
              <Layers className="w-3.5 h-3.5 text-[#c084fc]" />
              <span className="mono text-[11px] font-bold tracking-widest uppercase text-[#c084fc]">
                Tecnologia Integrada
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl font-black tracking-tight text-white"
            >
              O arsenal completo para a sua{" "}
              <span className="grad-text">máquina de vendas.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Radar OSINT (Large 2-col) */}
            <BentoCard className="lg:col-span-2 p-8" delay={0} accent="#a855f7">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border border-[#a855f7]/40 bg-[#a855f7]/15 text-[#e9d5ff] font-bold">
                      MOTOR 01 • OSINT MAPS
                    </span>
                    <GlobeIcon className="w-6 h-6 text-[#c084fc]" />
                  </div>
                  <h3 className="font-display text-2xl font-black text-white mb-3">
                    Mapeamento Global com Raio Expansível até 100km
                  </h3>
                  <p className="text-[#94a3b8] text-sm leading-relaxed mb-6">
                    Varra bairros inteiros ou regiões metropolitanas completas. O nosso algoritmo inteligente segmenta as buscas usando nós geográficos Overpass sem travar ou sofrer Timeouts 504.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.06]">
                  {[
                    ["100km", "Raio Máximo"],
                    ["100%", "Sem Timeout"],
                    ["Global", "OpenStreetMap"],
                  ].map(([v, l]) => (
                    <div key={l} className="p-3 rounded-xl bg-black/40 border border-white/[0.05]">
                      <p className="font-display font-black text-[#c084fc] text-base">{v}</p>
                      <p className="mono text-[9px] uppercase tracking-wider text-white/40">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </BentoCard>

            {/* Card 2: Radar Instagram */}
            <BentoCard className="p-8" delay={0.08} accent="#ec4899">
              <div className="flex items-center justify-between mb-6">
                <span className="mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border border-[#ec4899]/40 bg-[#ec4899]/15 text-[#fbcfe8] font-bold">
                  MOTOR 02 • SOCIAL
                </span>
                <Radio className="w-6 h-6 text-[#ec4899]" />
              </div>
              <h3 className="font-display text-xl font-black text-white mb-3">Deep Scan Instagram</h3>
              <p className="text-[#94a3b8] text-sm leading-relaxed mb-4">
                Localize perfis comerciais de nicho diretamente no Instagram. Filtre por bio, seguidores e descubra negócios com audiência ativa mas sem site profissional.
              </p>
            </BentoCard>

            {/* Card 3: Radar Foods & Delivery */}
            <BentoCard className="p-8" delay={0.12} accent="#f59e0b">
              <div className="flex items-center justify-between mb-6">
                <span className="mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border border-[#f59e0b]/40 bg-[#f59e0b]/15 text-[#fde68a] font-bold">
                  MOTOR 03 • FOODS
                </span>
                <Search className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <h3 className="font-display text-xl font-black text-white mb-3">Radar de Delivery</h3>
              <p className="text-[#94a3b8] text-sm leading-relaxed mb-4">
                Varredura focada no ecossistema gastronômico: restaurantes e delivery que pagam taxas altas em marketplaces e precisam urgentemente de cardápio próprio.
              </p>
            </BentoCard>

            {/* Card 4: Cold Messaging com IA */}
            <BentoCard className="p-8" delay={0.16} accent="#38bdf8">
              <div className="flex items-center justify-between mb-6">
                <span className="mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border border-[#38bdf8]/40 bg-[#38bdf8]/15 text-[#bae6fd] font-bold">
                  AUTOMAÇÃO
                </span>
                <MessageSquare className="w-6 h-6 text-[#38bdf8]" />
              </div>
              <h3 className="font-display text-xl font-black text-white mb-3">Pitches Multilíngues</h3>
              <p className="text-[#94a3b8] text-sm leading-relaxed mb-4">
                A IA analisa o setor e a cidade do lead e gera propostas persuasivas e hiper-personalizadas em português, espanhol ou inglês prontas para envio.
              </p>
            </BentoCard>

            {/* Card 5: Pipeline Kanban CRM */}
            <BentoCard className="p-8" delay={0.2} accent="#10b981">
              <div className="flex items-center justify-between mb-6">
                <span className="mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border border-[#10b981]/40 bg-[#10b981]/15 text-[#a7f3d0] font-bold">
                  CRM INTEGRADO
                </span>
                <BarChart3 className="w-6 h-6 text-[#10b981]" />
              </div>
              <h3 className="font-display text-xl font-black text-white mb-3">Gestão de MRR e Clientes</h3>
              <p className="text-[#94a3b8] text-sm leading-relaxed mb-4">
                Acompanhe o ciclo de vida de cada lead do primeiro contato até o fechamento. Monitore contratos de manutenção mensal diretamente no painel.
              </p>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" className="relative z-10 py-28 px-6 border-y border-white/[0.06] bg-black/20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#c084fc] mb-3 block">
              Passo a Passo
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white">
              Do radar à proposta assinada em 4 etapas.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                title: "Defina o Alvo",
                desc: "Escolha a cidade do mundo, o segmento desejado e a amplitude do raio de busca.",
                icon: Compass,
              },
              {
                num: "02",
                title: "Ative os Satélites",
                desc: "3 motores disparam simultaneamente e mapeiam centenas de leads sem site em segundos.",
                icon: Zap,
              },
              {
                num: "03",
                title: "Enriqueça com IA",
                desc: "Obtenha telefones, e-mails comerciais e gere argumentos de venda personalizados.",
                icon: Sparkles,
              },
              {
                num: "04",
                title: "Dispare e Feche",
                desc: "Contate em massa pelo WhatsApp ou cold email e converta clientes recorrentes.",
                icon: Send,
              },
            ].map((step) => (
              <SpotlightCard key={step.num} className="p-6">
                <div className="w-10 h-10 rounded-xl bg-[#a855f7]/15 border border-[#a855f7]/30 flex items-center justify-center mb-4 text-[#c084fc]">
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="mono text-2xl font-black text-[#c084fc] mb-2 block">{step.num}</span>
                <h4 className="font-display font-bold text-lg text-white mb-2">{step.title}</h4>
                <p className="text-[#94a3b8] text-xs leading-relaxed">{step.desc}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="planos" className="relative z-10 py-28 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <span className="mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#c084fc] mb-3 block">
              Planos & Acesso
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white">
              Pronto para escalar sua prospecção?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Free Tier */}
            <SpotlightCard className="p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="mono text-xs uppercase tracking-widest text-white/50 font-bold">Degustação</span>
                </div>
                <h3 className="font-display text-4xl font-black text-white mb-2">Gratuito</h3>
                <p className="text-[#94a3b8] text-sm mb-6">Experimente o poder dos satélites sem custo.</p>

                <div className="space-y-3.5 mb-8">
                  {[
                    "50 buscas por mês",
                    "Acesso aos 3 motores OSINT",
                    "Qualificação básica de leads",
                    "Suporte por e-mail",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#c084fc] shrink-0" />
                      <span className="text-sm text-white/80">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/login"
                className="btn-ghost w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs text-center block"
              >
                Começar Grátis
              </Link>
            </SpotlightCard>

            {/* Pro Tier (Highlighted in Electric Purple) */}
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-[#a855f7] via-[#c084fc] to-[#7e22ce] shadow-[0_0_50px_rgba(168,85,247,0.35)]">
              <div className="h-full rounded-2xl bg-[#0c101a] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-52 h-52 bg-[#a855f7]/20 blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="mono text-xs uppercase tracking-widest text-[#c084fc] font-bold">Ilimitado</span>
                    <span className="mono text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#a855f7] text-white tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                      RECOMENDADO
                    </span>
                  </div>
                  <h3 className="font-display text-4xl font-black text-white mb-2">Acesso Pro</h3>
                  <p className="text-[#94a3b8] text-sm mb-6">Potência máxima sem travas ou cotas.</p>

                  <div className="space-y-3.5 mb-8">
                    {[
                      "Buscas ilimitadas em todo o planeta",
                      "Raio expansível de até 100km",
                      "Deep Scan no Instagram liberado",
                      "Radar de Foods & Delivery completo",
                      "Geração de pitches com IA ilimitada",
                      "CRM Kanban e controle de MRR",
                      "Exportação CSV e suporte prioritário",
                    ].map((f) => (
                      <div key={f} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                        <span className="text-sm text-white font-medium">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/login"
                  className="btn-signal w-full py-4 rounded-xl font-bold uppercase tracking-wider text-xs text-center block shadow-[0_0_30px_rgba(168,85,247,0.45)]"
                >
                  Garantir Acesso Completo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CALL TO ACTION ── */}
      <section className="relative z-10 py-32 px-6 text-center border-t border-white/[0.06] bg-black/40">
        <div className="mx-auto max-w-4xl">
          <span className="mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#c084fc] mb-4 block">
            A Era da Prospecção Científica
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-6">
            Pare de caçar leads manualmente.{" "}
            <span className="grad-text">Ative o satélite.</span>
          </h2>
          <p className="text-[#94a3b8] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Junte-se à elite que prospecta empresas qualificadas em qualquer cidade do mundo com inteligência em tempo real.
          </p>

          <Link
            href="/login"
            className="btn-signal inline-flex items-center gap-3 px-10 py-4.5 rounded-xl text-sm font-bold uppercase tracking-wider shadow-[0_0_40px_rgba(168,85,247,0.55)]"
          >
            Acessar Sistema Agora <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.06] py-10 px-6 bg-[#040508]">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#a855f7] to-[#7e22ce] flex items-center justify-center">
              <Crosshair className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-sm font-black tracking-tight uppercase text-white">
              Prospect<span className="text-[#c084fc]">AI</span>
            </span>
          </div>

          <p className="mono text-[10px] text-white/40 uppercase tracking-widest">
            © 2026 ProspectAI • Global Lead Intelligence System
          </p>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="mono text-[10px] text-[#10b981] uppercase tracking-wider font-bold">
              Todos os Satélites Operacionais
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
