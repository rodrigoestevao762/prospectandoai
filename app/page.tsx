"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from "framer-motion";
import { CyberBackground } from "@/components/VisualEffects";
import { useTilt3D } from "@/hooks/useAnimations";
import {
  ArrowRight, Search, Activity, BarChart3,
  MessageSquare, TrendingUp, Lock, Crosshair,
  Globe, Zap, ChevronDown, Check
} from "lucide-react";

/* ─── MARQUEE ─── */
const MARQUEE_ITEMS = [
  "PROSPECÇÃO GLOBAL", "RADAR OSINT", "COLD E-MAIL IA",
  "WHATSAPP AUTOMATION", "CRM PIPELINE", "SITE BUILDER",
  "ENRIQUECIMENTO DE LEADS", "DISPARO EM MASSA", "MANUTENÇÃO RECORRENTE",
];

function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] bg-black/30 py-4 select-none">
      <div className="flex gap-0 animate-[marquee_30s_linear_infinite] w-max">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-8 mono text-[11px] font-bold tracking-[0.25em] uppercase">
            <span className="text-[var(--signal)] text-[6px]">◆</span>
            <span className="text-white/40 hover:text-white transition-colors duration-300">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── TERMINAL ─── */
function Terminal() {
  const [lines, setLines] = useState<{ text: string; type: string }[]>([]);
  const [done, setDone] = useState(false);

  const SCRIPT = [
    { text: "$ prospectando-ai --radar --global --nicho=\"clinicas\"", type: "cmd" },
    { text: "↳ Conectando a 7 satélites de dados...", type: "info" },
    { text: "↳ Geocodificando São Paulo, SP, Brasil...", type: "info" },
    { text: "↳ Varrendo 142 quarteirões — aguarde.", type: "info" },
    { text: "✓ 89 alvos detectados sem presença digital.", type: "success" },
    { text: "✓ Enriquecendo com e-mails e Instagram...", type: "success" },
    { text: "✓ Payload personalizado gerado pela IA.", type: "success" },
    { text: "▶ Acesse o painel para iniciar o disparo.", type: "cta" },
  ];

  useEffect(() => {
    let i = 0;
    const run = () => {
      if (i >= SCRIPT.length) { setDone(true); return; }
      setLines(prev => [...prev, SCRIPT[i]]);
      i++;
      setTimeout(run, 600 + Math.random() * 400);
    };
    const t = setTimeout(run, 800);
    return () => clearTimeout(t);
  }, []);

  const colorMap: Record<string, string> = {
    cmd: "text-[var(--signal)]",
    info: "text-white/50",
    success: "text-[#10b981]",
    cta: "text-[var(--amber)] font-bold",
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/80 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
      {/* titlebar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="flex-1 text-center mono text-[10px] text-white/30 tracking-widest">prospectando-ai — terminal</span>
        <span className="flex items-center gap-1 mono text-[9px] text-[#10b981]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" /> LIVE
        </span>
      </div>
      {/* content */}
      <div className="p-5 space-y-2 min-h-[220px]">
        <AnimatePresence>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`mono text-[12px] leading-relaxed ${colorMap[line.type] || "text-white/50"}`}
            >
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>
        {!done && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-[var(--signal)] ml-1 align-middle"
          />
        )}
      </div>
    </div>
  );
}

/* ─── 3D BENTO CARD ─── */
function BentoCard({
  children, className = "", delay = 0, glow = "var(--signal)"
}: {
  children: React.ReactNode; className?: string; delay?: number; glow?: string;
}) {
  const { ref, rotateX, rotateY, scale, glare, handleMouseMove, handleMouseEnter, handleMouseLeave } = useTilt3D({ maxRotation: 6 });

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-[24px] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-black/20 backdrop-blur-xl overflow-hidden group ${className}`}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[24px]"
        style={{ boxShadow: `inset 0 0 80px ${glow}15, 0 0 0 1px ${glow}20` }} />
      {/* Glare */}
      <div className="absolute inset-0 z-20 pointer-events-none rounded-[24px]"
        style={{ opacity: glare.opacity, background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.08) 0%, transparent 60%)` }} />
      {/* Top highlight */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div style={{ transform: "translateZ(15px)" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
}

/* ─── FEATURE PILL ─── */
function FeaturePill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm hover:border-[var(--signal)]/30 hover:bg-[var(--signal)]/[0.04] transition-all duration-300 group">
      <span className="text-[var(--signal)] group-hover:scale-110 transition-transform">{icon}</span>
      <span className="mono text-[11px] uppercase tracking-[0.15em] text-white/60 group-hover:text-white/80 transition-colors">{label}</span>
    </div>
  );
}

/* ─── MAIN ─── */
export default function ProspectandoAILanding() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <main className="cyber-theme relative min-h-screen text-white overflow-x-hidden" style={{ background: "var(--void)" }}>
      {/* <CyberBackground /> */}

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-50"
      >
        <div className="mx-4 mt-4 rounded-2xl border border-white/[0.08] bg-black/60 backdrop-blur-2xl shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
          <div className="mx-auto max-w-7xl px-6 h-[60px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--signal)] to-[#0284c7] flex items-center justify-center">
                <Crosshair className="w-4 h-4 text-black" />
                <div className="absolute inset-0 rounded-xl bg-[var(--signal)] animate-ping opacity-10" />
              </div>
              <span className="mono text-[15px] font-black tracking-[0.12em] text-white uppercase">
                Prospecta<span className="text-[var(--signal)]">AI</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1 bg-white/[0.04] rounded-xl p-1">
              {["Funcionalidades", "Como funciona", "Planos"].map(item => (
                <a key={item} href="#" className="mono text-[10px] uppercase tracking-[0.12em] text-white/50 hover:text-white hover:bg-white/[0.06] transition-all px-4 py-2 rounded-lg">
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <span className="mono text-[9px] text-[#10b981] uppercase tracking-[0.15em] font-bold">Online</span>
              </div>
              <Link href="/login"
                className="flex items-center gap-2 mono text-[11px] font-bold tracking-[0.1em] uppercase px-5 py-2 rounded-xl bg-[var(--signal)] text-black hover:brightness-110 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)]"
              >
                Acessar <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Grid perspectivo */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(var(--signal) 1px, transparent 1px), linear-gradient(90deg, var(--signal) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)"
        }} />

        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--signal)]/30 to-transparent"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 mx-auto max-w-6xl px-6 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-10 border border-[var(--signal)]/25 bg-[var(--signal)]/[0.07] backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
            <span className="mono text-[10px] font-bold tracking-[0.22em] uppercase text-[var(--signal)]">
              Motor de Prospecção Global — v3.0
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display leading-[1.0] tracking-[-0.04em] mb-8"
            style={{ fontSize: "clamp(56px, 9vw, 100px)" }}
          >
            <span className="text-white block">ENCONTRE.</span>
            <span className="text-white block">CONVERTA.</span>
            <span className="block bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, var(--signal) 0%, #7dd3fc 45%, #bae6fd 100%)" }}>
              ESCALE.
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-white/50 leading-[1.7] mb-12"
          >
            O único sistema que une{" "}
            <span className="text-white font-semibold">varredura OSINT global</span>,{" "}
            <span className="text-white font-semibold">IA de cold messages</span> e{" "}
            <span className="text-white font-semibold">entrega de sites</span>{" "}
            em uma plataforma de elite para quem vende no digital.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-20"
          >
            <Link href="/login"
              className="group relative flex items-center gap-3 px-10 py-4 text-sm font-bold tracking-[0.06em] uppercase text-black bg-[var(--signal)] rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(56,189,248,0.5),0_8px_40px_rgba(56,189,248,0.35)] hover:shadow-[0_0_0_1px_rgba(56,189,248,0.8),0_12px_60px_rgba(56,189,248,0.5)] transition-all duration-300"
            >
              <span className="relative z-10 font-black mono">Acessar o Sistema</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600 skew-x-12" />
            </Link>
            <a href="#como-funciona"
              className="flex items-center gap-2 px-8 py-4 text-sm mono font-bold tracking-[0.06em] uppercase text-white/50 border border-white/10 rounded-2xl hover:text-white hover:border-white/25 hover:bg-white/[0.03] transition-all duration-300"
            >
              Como funciona <ChevronDown className="w-4 h-4 opacity-60" />
            </a>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="flex flex-wrap gap-2 items-center justify-center mb-20"
          >
            <FeaturePill icon={<Globe className="w-3.5 h-3.5" />} label="Varredura Global" />
            <FeaturePill icon={<MessageSquare className="w-3.5 h-3.5" />} label="Cold Messages IA" />
            <FeaturePill icon={<BarChart3 className="w-3.5 h-3.5" />} label="Pipeline CRM" />
            <FeaturePill icon={<TrendingUp className="w-3.5 h-3.5" />} label="MRR Tracking" />
            <FeaturePill icon={<Lock className="w-3.5 h-3.5" />} label="Infraestrutura Elite" />
          </motion.div>

          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.75, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto"
          >
            <Terminal />
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[var(--void)] to-transparent pointer-events-none z-10" />
      </section>

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── BENTO GRID — ARSENAL ── */}
      <section id="funcionalidades" className="relative z-10 py-32 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mono text-[11px] tracking-[0.3em] uppercase text-[var(--signal)] mb-4 font-bold"
            >Arsenal Completo</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-5xl md:text-6xl font-black tracking-tight text-white leading-tight"
            >
              Tudo que você precisa<br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, var(--signal), #7dd3fc)" }}>
                em um só lugar
              </span>
            </motion.h2>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[1fr]">

            {/* Big card - Radar */}
            <BentoCard className="lg:col-span-2 p-8 min-h-[320px]" delay={0} glow="var(--signal)">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="inline-block mono text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full mb-3 border border-[var(--signal)]/30 bg-[var(--signal)]/10 text-[var(--signal)]">OSINT</span>
                    <h3 className="text-2xl font-black text-white tracking-tight">Radar de Varredura Global</h3>
                  </div>
                  <Search className="w-8 h-8 text-[var(--signal)] opacity-80 shrink-0 mt-1" />
                </div>
                <p className="text-[var(--ink-dim)] leading-relaxed mb-8 flex-1">
                  Vasculhe o planeta com 7+ motores de busca simultâneos. OpenStreetMap, DuckDuckGo, Bing, Instagram e mais. Encontre empresas sem site em qualquer país, nicho ou cidade em segundos.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[["7+", "Motores OSINT"], ["150", "Leads/Busca"], ["Global", "Cobertura"]].map(([val, lbl]) => (
                    <div key={lbl} className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                      <p className="font-black text-[var(--signal)] text-lg">{val}</p>
                      <p className="mono text-[9px] uppercase tracking-widest text-white/40">{lbl}</p>
                    </div>
                  ))}
                </div>
              </div>
            </BentoCard>

            {/* Cold Messages */}
            <BentoCard className="p-8 min-h-[320px]" delay={0.05} glow="var(--amber)">
              <span className="inline-block mono text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full mb-4 border border-[var(--amber)]/30 bg-[var(--amber)]/10 text-[var(--amber)]">IA NATIVA</span>
              <MessageSquare className="w-7 h-7 text-[var(--amber)] mb-4" />
              <h3 className="text-xl font-black text-white mb-3">Cold Messages Cirúrgicas</h3>
              <p className="text-sm text-[var(--ink-dim)] leading-relaxed mb-4">IA gera mensagens ultra-personalizadas analisando empresa, setor e decisor. WhatsApp e e-mail com um clique.</p>
              <div className="p-3 rounded-xl bg-black/50 border border-white/[0.06] mono text-[10px] text-white/60 leading-relaxed">
                <span className="text-[var(--amber)]">›</span> "Olá João, vi que a Clínica Sorrir<br />ainda não tem presença digital..."
              </div>
            </BentoCard>

            {/* Site Builder */}
            <BentoCard className="p-8 min-h-[260px]" delay={0.1} glow="#10b981">
              <span className="inline-block mono text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full mb-4 border border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]">1 CLIQUE</span>
              <Globe className="w-7 h-7 text-[#10b981] mb-4" />
              <h3 className="text-xl font-black text-white mb-3">Site Builder IA</h3>
              <p className="text-sm text-[var(--ink-dim)] leading-relaxed">Crie, hospede e entregue landing pages para clientes sem site — diretamente do painel.</p>
            </BentoCard>

            {/* CRM */}
            <BentoCard className="p-8 min-h-[260px]" delay={0.15} glow="#ec4899">
              <span className="inline-block mono text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full mb-4 border border-[#ec4899]/30 bg-[#ec4899]/10 text-[#ec4899]">CRM</span>
              <BarChart3 className="w-7 h-7 text-[#ec4899] mb-4" />
              <h3 className="text-xl font-black text-white mb-3">Pipeline Kanban Pro</h3>
              <p className="text-sm text-[var(--ink-dim)] leading-relaxed">Kanban visual com arrastar-e-soltar. Registre valores, sites entregues e acompanhe cada etapa da venda.</p>
            </BentoCard>

            {/* MRR */}
            <BentoCard className="p-8 min-h-[260px]" delay={0.2} glow="#8b5cf6">
              <span className="inline-block mono text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full mb-4 border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 text-[#8b5cf6]">RECEITA</span>
              <TrendingUp className="w-7 h-7 text-[#8b5cf6] mb-4" />
              <h3 className="text-xl font-black text-white mb-3">MRR & Cobranças</h3>
              <p className="text-sm text-[var(--ink-dim)] leading-relaxed">Acompanhe mensalidades de manutenção e gere cobranças automáticas via WhatsApp para cada cliente.</p>
            </BentoCard>

          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" className="relative z-10 py-32 px-6 border-y border-white/[0.05] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--signal)]/[0.03] via-transparent to-[var(--amber)]/[0.02] pointer-events-none" />
        <div className="mx-auto max-w-6xl relative z-10 grid lg:grid-cols-2 gap-20 items-center">

          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mono text-[11px] tracking-[0.3em] uppercase text-[var(--signal)] mb-4 font-bold"
            >Fluxo de Trabalho</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-black tracking-tight text-white mb-12 leading-tight"
            >
              Da captura ao<br />fechamento em<br />
              <span className="text-[var(--signal)]">minutos.</span>
            </motion.h2>

            <div className="space-y-0">
              {[
                { n: "01", title: "Configure o Radar", desc: "Defina nicho, cidade e perfil. 7+ motores vasculham o mundo e detectam empresas vulneráveis em segundos." },
                { n: "02", title: "Enriquecimento Automático", desc: "A IA busca e-mail, Instagram, telefone e calcula o Threat-Score de cada alvo automaticamente." },
                { n: "03", title: "Disparo Personalizado", desc: "1 clique: mensagens criadas pela IA são disparadas para centenas de alvos simultaneamente." },
                { n: "04", title: "Feche e Escale", desc: "Registre a venda, entregue o site, configure a mensalidade e acompanhe seu MRR crescer.", isLast: true },
              ].map(({ n, title, desc, isLast }, i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="relative flex gap-5"
                >
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-[var(--signal)]/10 border border-[var(--signal)]/25 flex items-center justify-center mono text-xs font-black text-[var(--signal)] z-10">
                      {n}
                    </div>
                    {!isLast && <div className="w-[1px] flex-1 my-2 bg-gradient-to-b from-[var(--signal)]/25 to-transparent min-h-[32px]" />}
                  </div>
                  <div className={`${isLast ? "pb-0" : "pb-8"}`}>
                    <h4 className="text-white font-bold text-[17px] mb-1.5">{title}</h4>
                    <p className="text-[var(--ink-dim)] text-sm leading-relaxed max-w-sm">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Live preview card */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--signal)]" />
                  <span className="mono text-[10px] uppercase tracking-[0.15em] text-white/50">Radar — Preview</span>
                </div>
                <span className="flex items-center gap-1.5 mono text-[9px] text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded-full border border-[#10b981]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" /> 3 novos
                </span>
              </div>
              <div className="p-4 space-y-2.5">
                {[
                  { name: "Clínica Odonto Sorrir", city: "São Paulo, SP", score: 94, tag: "S/ Site", tagColor: "var(--alert)" },
                  { name: "Pizzaria Don Carlos", city: "Curitiba, PR", score: 72, tag: "Instagram", tagColor: "var(--amber)" },
                  { name: "Studio de Arquitetura", city: "Rio de Janeiro, RJ", score: 88, tag: "S/ Site", tagColor: "var(--alert)" },
                ].map((lead, i) => (
                  <motion.div
                    key={lead.name}
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.12 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-[var(--signal)]/20 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-[var(--signal)] bg-[var(--signal)]/10 border border-[var(--signal)]/20 shrink-0">
                      {lead.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-white truncate">{lead.name}</p>
                      <p className="mono text-[9px] text-white/35 uppercase tracking-widest">📍 {lead.city}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="mono text-xs font-black text-[var(--signal)] mb-1">{lead.score}</p>
                      <span className="mono text-[9px] px-2 py-0.5 rounded-full border font-bold"
                        style={{ color: lead.tagColor, borderColor: `${lead.tagColor}30`, backgroundColor: `${lead.tagColor}10` }}>
                        {lead.tag}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="px-5 py-3.5 border-t border-white/[0.06] flex justify-between items-center">
                <span className="mono text-[9px] text-white/30 uppercase tracking-widest">Preview · dados reais no painel</span>
                <Link href="/login" className="mono text-[9px] font-bold text-[var(--signal)] uppercase tracking-widest hover:underline flex items-center gap-1">
                  Acessar <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[100px] opacity-10 bg-[var(--signal)] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-[80px] opacity-[0.07] bg-[var(--amber)] pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* ── PLANOS ── */}
      <section id="planos" className="relative z-10 py-32 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mono text-[11px] tracking-[0.3em] uppercase text-[var(--signal)] mb-4 font-bold"
            >Acesso ao Sistema</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-6xl font-black tracking-tight text-white"
            >Escolha seu nível</motion.h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Starter */}
            <BentoCard className="p-8" delay={0} glow="var(--signal)">
              <div className="mb-6">
                <p className="mono text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">Iniciante</p>
                <h3 className="font-display text-4xl font-black text-white">Free</h3>
                <p className="text-sm text-white/40 mt-1">Para explorar o sistema</p>
              </div>
              <div className="space-y-3 mb-8">
                {["50 buscas/mês", "10 cold messages", "Pipeline CRM básico", "Suporte por e-mail"].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[var(--signal)] shrink-0" />
                    <span className="text-sm text-white/60">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/login"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[var(--signal)]/30 text-[var(--signal)] mono text-sm font-bold tracking-[0.08em] uppercase hover:bg-[var(--signal)]/10 transition-all"
              >
                Começar Grátis <ArrowRight className="w-4 h-4" />
              </Link>
            </BentoCard>

            {/* Pro */}
            <BentoCard className="p-8 relative" delay={0.1} glow="var(--signal)">
              <div className="absolute top-5 right-5">
                <span className="mono text-[9px] font-black px-3 py-1 rounded-full bg-[var(--signal)] text-black tracking-[0.15em] uppercase">POPULAR</span>
              </div>
              <div className="mb-6">
                <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--signal)] mb-1 font-bold">Elite</p>
                <h3 className="font-display text-4xl font-black text-white">Acesso Total</h3>
                <p className="text-sm text-white/40 mt-1">Para quem está no jogo</p>
              </div>
              <div className="space-y-3 mb-8">
                {[
                  "Buscas ilimitadas globais",
                  "Cold messages ilimitadas",
                  "CRM Pipeline completo",
                  "Site Builder IA",
                  "Controle de Manutenção / MRR",
                  "Suporte prioritário"
                ].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[var(--signal)] shrink-0" />
                    <span className="text-sm text-white/80">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/login"
                className="group w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[var(--signal)] text-black mono text-sm font-black tracking-[0.08em] uppercase hover:brightness-110 transition-all shadow-[0_0_30px_rgba(56,189,248,0.3)] overflow-hidden relative"
              >
                <span className="relative z-10">Acessar o Sistema</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
              </Link>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 py-40 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(56,189,248,0.1)_0%,transparent_70%)]" />
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--signal)]/15 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <p className="mono text-[11px] tracking-[0.3em] uppercase text-[var(--signal)] mb-6 font-bold">Assuma o controle</p>
          <h2 className="font-display font-black tracking-tight text-white mb-6 leading-[1.0]"
            style={{ fontSize: "clamp(52px, 8vw, 88px)" }}>
            PROSPECTE MAIS.<br />
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, var(--signal) 0%, #7dd3fc 100%)" }}>
              VENDA MAIS.
            </span>
          </h2>
          <p className="text-white/50 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Junte-se à nova geração de vendedores que usam inteligência de dados para criar negócios à escala global.
          </p>

          <Link href="/login"
            className="group inline-flex items-center gap-3 px-12 py-5 text-[15px] font-black tracking-[0.06em] uppercase text-black bg-[var(--signal)] rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(56,189,248,0.5),0_8px_60px_rgba(56,189,248,0.4)] hover:shadow-[0_0_0_1px_rgba(56,189,248,0.9),0_12px_80px_rgba(56,189,248,0.6)] transition-all duration-300 relative"
          >
            <span className="relative z-10 mono">Começar Agora</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white/25 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600 skew-x-12" />
          </Link>

          <p className="mt-6 mono text-[10px] uppercase tracking-[0.2em] text-white/25">
            Acesso imediato · Sem cartão de crédito
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.05] py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--signal)] to-[#0284c7] flex items-center justify-center">
              <Crosshair className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="mono text-[13px] font-black tracking-[0.12em] uppercase text-white">ProspectandoAI</span>
          </div>
          <span className="mono text-[9px] text-white/25 uppercase tracking-[0.15em]">
            © 2026 · Motor de Prospecção Global
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="mono text-[9px] text-[#10b981] uppercase tracking-[0.15em] font-bold">Sistemas Online</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
