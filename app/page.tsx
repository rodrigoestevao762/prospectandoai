"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { CyberBackground } from "@/components/VisualEffects";
import { useTilt3D } from "@/hooks/useAnimations";
import {
  ArrowRight, Search, Zap, Target, Globe, Shield,
  Activity, FileCode, ChevronRight, BarChart3,
  MessageSquare, Layers, TrendingUp, Lock, Crosshair
} from "lucide-react";

/* ─── COUNTER ANIMATION ─── */
function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return <span ref={ref}>{prefix}{count.toLocaleString("pt-BR")}{suffix}</span>;
}

/* ─── SCAN LINE EFFECT ─── */
function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--signal)]/40 to-transparent"
        initial={{ top: "0%" }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* ─── TERMINAL TYPING ─── */
function TerminalText({ lines }: { lines: string[] }) {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (lineIndex >= lines.length) return;
    if (charIndex < lines[lineIndex].length) {
      const t = setTimeout(() => {
        setDisplayed(prev => {
          const next = [...prev];
          next[lineIndex] = (next[lineIndex] || "") + lines[lineIndex][charIndex];
          return next;
        });
        setCharIndex(c => c + 1);
      }, 30);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLineIndex(l => l + 1);
        setCharIndex(0);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [lineIndex, charIndex, lines]);

  return (
    <div className="font-mono text-xs space-y-1 text-left">
      {displayed.map((line, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[var(--signal)] opacity-70">›</span>
          <span className={i === lines.length - 1 ? "text-white" : "text-[var(--ink-dim)]"}>{line}</span>
        </div>
      ))}
      {lineIndex < lines.length && (
        <div className="flex items-center gap-2">
          <span className="text-[var(--signal)] opacity-70">›</span>
          <span className="w-[7px] h-[14px] bg-[var(--signal)] animate-pulse inline-block" />
        </div>
      )}
    </div>
  );
}

/* ─── 3D TILT FEATURE CARD ─── */
function EliteCard({
  icon, title, desc, color, badge, delay = 0
}: {
  icon: React.ReactNode; title: string; desc: string;
  color: string; badge?: string; delay?: number;
}) {
  const { ref, rotateX, rotateY, scale, glare, handleMouseMove, handleMouseEnter, handleMouseLeave } = useTilt3D({ maxRotation: 10 });

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-[28px] p-7 bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 hover:border-white/20 cursor-pointer group overflow-hidden"
    >
      {/* Glare */}
      <div
        className="absolute inset-0 z-20 pointer-events-none rounded-[28px] transition-opacity duration-300"
        style={{ opacity: glare.opacity, background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.12) 0%, transparent 55%)` }}
      />

      {/* Ambient glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-[60px] opacity-0 group-hover:opacity-30 transition-all duration-700" style={{ backgroundColor: color }} />

      {/* Top bar accent */}
      <div className="absolute top-0 left-8 right-8 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />

      <div style={{ transform: "translateZ(20px)" }}>
        {badge && (
          <span className="inline-block mono text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full mb-4 border" style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}>
            {badge}
          </span>
        )}
        <div className="mb-6" style={{ color }}>{icon}</div>
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-[var(--ink-dim)] leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ─── STAT CARD ─── */
function StatCard({ value, label, sub, color }: { value: number; label: string; sub: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative p-6 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden group"
    >
      <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-20 transition-all duration-700" style={{ backgroundColor: color }} />
      <p className="font-display text-4xl font-black tracking-tight mb-1" style={{ color }}>
        <AnimatedCounter end={value} suffix={value >= 1000 ? "+" : "%"} />
      </p>
      <p className="text-white font-semibold text-sm mb-0.5">{label}</p>
      <p className="text-[var(--ink-faint)] text-xs mono uppercase tracking-widest">{sub}</p>
    </motion.div>
  );
}

/* ─── PROCESS STEP ─── */
function ProcessStep({ num, title, desc, isLast }: { num: string; title: string; desc: string; isLast?: boolean }) {
  return (
    <div className="relative flex gap-6">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-xl bg-[var(--signal)]/10 border border-[var(--signal)]/30 flex items-center justify-center mono text-xs font-bold text-[var(--signal)] shrink-0 z-10">
          {num}
        </div>
        {!isLast && <div className="w-[1px] flex-1 mt-2 bg-gradient-to-b from-[var(--signal)]/30 to-transparent" />}
      </div>
      <div className="pb-10">
        <h4 className="text-white font-bold text-lg mb-2">{title}</h4>
        <p className="text-[var(--ink-dim)] text-sm leading-relaxed max-w-sm">{desc}</p>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function ProspectandoAILanding() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const terminalLines = [
    "Conectando satélites OSINT...",
    "Varrendo 14.293 alvos em São Paulo...",
    "47 empresas sem presença digital detectadas.",
    "Gerando payload de prospecção personalizado...",
    "Taxa de abertura estimada: 71%",
  ];

  return (
    <main className="cyber-theme relative min-h-screen text-white overflow-x-hidden" style={{ background: "var(--void)" }}>
      <CyberBackground />

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-black/50 backdrop-blur-2xl"
      >
        <div className="mx-auto max-w-7xl px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-[var(--signal)] flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.5)]">
              <Crosshair className="w-5 h-5 text-black" />
              <div className="absolute inset-0 rounded-xl bg-[var(--signal)] animate-ping opacity-20" />
            </div>
            <span className="mono text-lg font-black tracking-[0.15em] text-white uppercase">
              Prospecta<span className="text-[var(--signal)]">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Funcionalidades", "Como funciona", "Planos"].map((item) => (
              <a key={item} href="#" className="mono text-[11px] uppercase tracking-[0.15em] text-[var(--ink-dim)] hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span className="mono text-[10px] text-[#10b981] uppercase tracking-[0.15em]">Online</span>
            </div>
            <Link href="/login"
              className="relative group flex items-center gap-2 mono text-[11px] font-bold tracking-[0.1em] uppercase px-5 py-2.5 rounded-xl border border-[var(--signal)]/40 text-[var(--signal)] hover:bg-[var(--signal)] hover:text-black hover:border-transparent transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Acessar</span>
              <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-32 overflow-hidden">
        <ScanLine />

        {/* Decorative grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px"
        }} />

        <motion.style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">

          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-8 flex items-center gap-2.5 rounded-full px-4 py-2 border border-[var(--signal)]/30 bg-[var(--signal)]/[0.08] backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <span className="mono text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--signal)]">Motor de Prospecção Global — v3.0</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(56px,10vw,96px)] font-black tracking-[-0.03em] leading-[1.0] mb-6"
          >
            <span className="text-white">ENCONTRE.</span>
            <br />
            <span className="text-white">CONVERTA.</span>
            <br />
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, var(--signal) 0%, #7dd3fc 50%, #a5f3fc 100%)" }}>
              ESCALE.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="max-w-2xl text-lg md:text-xl text-[var(--ink-dim)] leading-relaxed mb-12 font-body"
          >
            O único sistema de prospecção que combina{" "}
            <span className="text-white font-medium">varredura global OSINT</span>,{" "}
            <span className="text-white font-medium">IA de mensagens</span> e{" "}
            <span className="text-white font-medium">entrega de sites</span>{" "}
            em uma plataforma de elite.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 items-center mb-20"
          >
            <Link href="/login"
              className="group relative flex items-center gap-3 px-10 py-4 text-sm font-bold tracking-[0.08em] uppercase text-black bg-[var(--signal)] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(56,189,248,0.35)] hover:shadow-[0_0_60px_rgba(56,189,248,0.6)] transition-all duration-300"
            >
              <span className="relative z-10">Iniciar Agora</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            </Link>

            <a href="#features"
              className="flex items-center gap-2 px-8 py-4 text-sm font-bold tracking-[0.08em] uppercase text-[var(--ink)] border border-white/10 rounded-2xl hover:border-white/20 hover:text-white hover:bg-white/[0.03] transition-all duration-300"
            >
              Ver Funcionalidades
              <ChevronRight className="w-4 h-4 opacity-50" />
            </a>
          </motion.div>

          {/* Terminal widget */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]"
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 text-center mono text-[10px] text-[var(--ink-faint)] tracking-widest uppercase">
                prospectando-ai — radar.exe
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <span className="mono text-[9px] text-[#10b981] uppercase tracking-widest">LIVE</span>
              </div>
            </div>
            <div className="p-5">
              <TerminalText lines={terminalLines} />
            </div>
          </motion.div>
        </motion.style>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[var(--void)] to-transparent pointer-events-none z-10" />
      </section>

      {/* ── STATS BAND ── */}
      <section className="relative z-10 border-y border-white/[0.06] bg-black/30 backdrop-blur-xl py-16">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard value={14293} label="Empresas Capturadas" sub="Últimas 24h" color="var(--signal)" />
          <StatCard value={71} label="Taxa de Abertura" sub="Cold messages" color="var(--amber)" />
          <StatCard value={8400} label="Sites Entregues" sub="Landing pages" color="#10b981" />
          <StatCard value={98} label="Taxa de Entrega" sub="Email inbox" color="#ec4899" />
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="relative z-10 py-32 mx-auto max-w-7xl px-6">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mono text-[11px] tracking-[0.3em] uppercase text-[var(--signal)] mb-4"
          >
            Arsenal Completo
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl font-black tracking-tight text-white"
          >
            Tudo que você precisa para<br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, var(--signal), #7dd3fc)" }}>
              dominar a prospecção
            </span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <EliteCard delay={0} icon={<Search size={36} />} color="var(--signal)" badge="OSINT" title="Radar de Varredura Global" desc="Vasculhe o planeta com nossa IA de extração em tempo real. Encontre empresas sem site em qualquer país, nicho ou cidade." />
          <EliteCard delay={0.05} icon={<MessageSquare size={36} />} color="var(--amber)" badge="IA NATIVA" title="Mensagens de Alta Conversão" desc="IA gera cold e-mails e mensagens WhatsApp ultra-personalizadas analisando a empresa-alvo, setor e persona do decisor." />
          <EliteCard delay={0.1} icon={<Globe size={36} />} color="#10b981" badge="1 CLIQUE" title="Entrega de Sites" desc="Empresa sem presença digital? Crie, hospede e entregue uma landing page profissional do zero com um clique." />
          <EliteCard delay={0.15} icon={<BarChart3 size={36} />} color="#ec4899" badge="CRM" title="Pipeline Kanban Pro" desc="Gerencie leads e contratos num sistema Kanban visual com arrastar-e-soltar, registros de valor e links de sites entregues." />
          <EliteCard delay={0.2} icon={<TrendingUp size={36} />} color="#8b5cf6" badge="RECEITA" title="Manutenção & Cobranças" desc="Controle mensalidades, gere mensagens de cobrança automáticas e acompanhe o MRR dos seus clientes em tempo real." />
          <EliteCard delay={0.25} icon={<Lock size={36} />} color="var(--alert)" badge="ULTRA SEGURO" title="Infraestrutura Elite" desc="Dados criptografados, domínios rotacionados e sistema de inboxing garantem entrega impecável e taxa zero de spam." />
        </div>
      </section>

      {/* ── PROCESS SECTION ── */}
      <section className="relative z-10 py-32 border-y border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--signal)]/[0.03] via-transparent to-[var(--amber)]/[0.02]" />
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-24 items-center relative z-10">

          {/* Left: Steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="mono text-[11px] tracking-[0.3em] uppercase text-[var(--signal)] mb-4">Como funciona</p>
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-white mb-12">
              Da captura ao<br />fechamento em
              <span className="text-[var(--signal)]"> minutos</span>
            </h2>

            <div>
              <ProcessStep num="01" title="Configure o Radar" desc="Defina o nicho, cidade e perfil alvo. O sistema usa 7+ fontes de dados globais para varrer e detectar empresas vulneráveis." />
              <ProcessStep num="02" title="IA Enriquece & Qualifica" desc="Cada empresa recebe um Threat-Score automaticamente. Nossa IA busca e-mail, Instagram, telefone e nível de presença digital." />
              <ProcessStep num="03" title="Disparo em Massa" desc="Com 1 clique, a IA cria mensagens personalizadas e dispara cold e-mails ou mensagens WhatsApp para centenas de alvos." />
              <ProcessStep num="04" title="Feche & Entregue" desc="Mova os leads no Kanban, registre os valores, entregue o site e acompanhe o faturamento recorrente no seu painel central." isLast />
            </div>
          </motion.div>

          {/* Right: Live Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Mock Dashboard Card */}
            <div className="rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--signal)]" />
                  <span className="mono text-xs uppercase tracking-[0.15em] text-[var(--ink-dim)]">Radar — Ao Vivo</span>
                </div>
                <span className="flex items-center gap-1.5 mono text-[10px] text-[#10b981] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />3 novos alvos
                </span>
              </div>

              {/* Mock Leads */}
              <div className="p-4 space-y-3">
                {[
                  { name: "Clínica Odonto Sorrir", city: "São Paulo", heat: "🔥", score: 94, badge: "S/ Site" },
                  { name: "Pizzaria Don Carlos", city: "Curitiba", heat: "💡", score: 72, badge: "Instagram" },
                  { name: "Studio Arquitetura", city: "Rio de Janeiro", heat: "🔥", score: 88, badge: "S/ Site" },
                ].map((lead, i) => (
                  <motion.div
                    key={lead.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-[var(--signal)]/30 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 font-bold"
                      style={{ background: `linear-gradient(135deg, var(--signal)20, var(--signal)05)`, border: "1px solid rgba(56,189,248,0.2)" }}>
                      {lead.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{lead.name}</p>
                      <p className="mono text-[10px] text-[var(--ink-faint)] uppercase tracking-widest">📍 {lead.city}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="mono text-xs font-black text-[var(--signal)]">{lead.score}</p>
                      <span className="mono text-[9px] px-2 py-0.5 rounded-full border border-[var(--alert)]/30 bg-[var(--alert)]/10 text-[var(--alert)]">{lead.badge}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom */}
              <div className="px-6 py-4 border-t border-white/[0.06] flex justify-between items-center">
                <span className="mono text-[10px] text-[var(--ink-faint)] uppercase tracking-widest">47 alvos aguardando</span>
                <button className="mono text-[10px] font-bold text-[var(--signal)] uppercase tracking-widest hover:underline flex items-center gap-1">
                  Disparar tudo <Zap className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Floating accent glows */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-[80px] opacity-15 pointer-events-none bg-[var(--signal)]" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-[80px] opacity-10 pointer-events-none bg-[var(--amber)]" />
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 py-40 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(56,189,248,0.12)_0%,transparent_70%)] pointer-events-none" />

        {/* Horizontal glowing lines */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--signal)]/20 to-transparent pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <p className="mono text-[11px] tracking-[0.3em] uppercase text-[var(--signal)] mb-6">Assuma o controle</p>
          <h2 className="font-display text-6xl md:text-8xl font-black tracking-tight text-white mb-8 leading-none">
            PROSPECTE MAIS.<br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, var(--signal) 0%, #7dd3fc 100%)" }}>
              VENDA MAIS.
            </span>
          </h2>
          <p className="text-[var(--ink-dim)] text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Junte-se à nova geração de vendedores que usam inteligência de dados para criar negócios à escala global.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link href="/login"
              className="group relative flex items-center gap-3 px-12 py-5 text-base font-bold tracking-[0.08em] uppercase text-black bg-[var(--signal)] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(56,189,248,0.4)] hover:shadow-[0_0_80px_rgba(56,189,248,0.7)] transition-all duration-300"
            >
              <span className="relative z-10">Começar Gratuitamente</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            </Link>
          </div>

          <p className="mt-8 mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
            Sem cartão de crédito · Acesso imediato · Dados 100% seguros
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-[var(--signal)]" />
            <span className="mono text-xs font-bold tracking-[0.15em] uppercase">ProspectandoAI</span>
          </div>
          <span className="mono text-[10px] text-[var(--ink-faint)] uppercase tracking-[0.15em]">
            © 2026 · Motor de Prospecção Global
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="mono text-[10px] text-[#10b981] uppercase tracking-[0.15em]">Sistemas Operacionais</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
