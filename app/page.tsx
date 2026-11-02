"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Zap,
  Crosshair,
  Sparkles,
  Check,
  Phone,
  Globe,
  Shield,
  ChevronDown,
  Layers,
  Terminal,
  Compass,
  Eye,
  Play,
  Users,
  Building2,
  Sliders,
  Copy,
  Lock,
  Palette,
  Kanban,
  Monitor,
  LayoutGrid,
  Menu,
  X,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Radar,
  Brain,
  Target,
  TrendingUp,
  Star,
  Activity,
  Database,
  Cpu,
  Network,
  BarChart2,
  Map,
  CheckCircle2,
  DollarSign,
  Clock,
  Laptop,
  CheckCheck,
  ArrowDownRight,
  Gauge,
  Radio,
  Flame,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// 01. PARTICLE NEURAL NETWORK (CANVAS AUTÔNOMO)
// ─────────────────────────────────────────────────────────────
const NeuralCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      pulse: number;
    }
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 75; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.6,
        opacity: Math.random() * 0.5 + 0.15,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const pulseOpacity = p.opacity * (0.65 + 0.35 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${pulseOpacity})`;
        ctx.fill();

        particles.slice(i + 1).forEach((q) => {
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 125) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist / 125)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        });
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

// ─────────────────────────────────────────────────────────────
// 02. ANIMATED COUNTER COM FORMATO MONETÁRIO / NÚMEROS
// ─────────────────────────────────────────────────────────────
const Counter = ({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        let t = 0;
        const step = to / (1500 / 16);
        const timer = setInterval(() => {
          t += step;
          if (t >= to) {
            setVal(to);
            clearInterval(timer);
          } else {
            setVal(Math.floor(t));
          }
        }, 16);
        observer.disconnect();
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// 03. RADAR ORBITAL 360° (PROPRIETÁRIO TESLA / AEROSPACE)
// ─────────────────────────────────────────────────────────────
const RadarAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 340;
    canvas.height = 340;

    const cx = 170,
      cy = 170,
      R = 145;
    let angle = 0;
    let raf: number;

    const targets = Array.from({ length: 14 }, () => ({
      angle: Math.random() * Math.PI * 2,
      r: (Math.random() * 0.72 + 0.18) * R,
      alpha: 0,
      label: ["SEM SITE", "WHATSAPP", "CLÍNICA", "INDÚSTRIA", "DEFASADO"][Math.floor(Math.random() * 5)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, 340, 340);

      // Círculos concêntricos de telemetria
      [0.25, 0.5, 0.75, 1].forEach((f, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, R * f, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 3 ? "rgba(139,92,246,0.28)" : "rgba(139,92,246,0.12)";
        ctx.lineWidth = 1;
        ctx.setLineDash(idx % 2 === 0 ? [] : [4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Eixos de quadrante cartográfico
      ctx.beginPath();
      ctx.moveTo(cx - R, cy);
      ctx.lineTo(cx + R, cy);
      ctx.moveTo(cx, cy - R);
      ctx.lineTo(cx, cy + R);
      ctx.strokeStyle = "rgba(139,92,246,0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Varredura de sonar (Gradiente de Feixe)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
      grad.addColorStop(0, "rgba(168,85,247,0.35)");
      grad.addColorStop(0.8, "rgba(139,92,246,0.12)");
      grad.addColorStop(1, "rgba(139,92,246,0)");
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, R, -0.4, 0.4);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Linha de laser frontal da varredura
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(R, 0);
      ctx.strokeStyle = "rgba(192,132,252,0.95)";
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();

      // Alvos detectados no radar
      targets.forEach((t) => {
        const diff = ((angle - t.angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (diff < 0.45) t.alpha = 1;
        else t.alpha = Math.max(0, t.alpha - 0.009);

        if (t.alpha > 0) {
          const x = cx + Math.cos(t.angle) * t.r;
          const y = cy + Math.sin(t.angle) * t.r;

          // Ponto do alvo
          ctx.beginPath();
          ctx.arc(x, y, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168,85,247,${t.alpha})`;
          ctx.fill();

          // Ondulação expansiva
          if (t.alpha > 0.4) {
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(168,85,247,${t.alpha * 0.45})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      // Ponto de emissão central
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(236,72,153,0.9)";
      ctx.fill();

      angle += 0.024;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} width={340} height={340} className="w-full max-w-[340px] mx-auto select-none" />;
};

// ─────────────────────────────────────────────────────────────
// 04. BASE DE LEADS DEMO (INTERATIVIDADE REAL)
// ─────────────────────────────────────────────────────────────
interface LeadItem {
  nome: string;
  nicho: string;
  bairro: string;
  diagnostico: string;
  status: "Crítico" | "Oportunidade" | "Urgente";
  whatsapp: string;
  score: number;
  faturamentoEst: string;
}

const DEMO_REGIOES: Record<string, LeadItem[]> = {
  "São Paulo": [
    { nome: "Clínica Odonto Prime Jardins", nicho: "Saúde & Odonto", bairro: "Jardins", diagnostico: "Sem Website Profissional (Apenas Maps)", status: "Crítico", whatsapp: "(11) 98421-9920", score: 96, faturamentoEst: "R$ 180k/mês" },
    { nome: "Bella Pasta Ristorante", nicho: "Gastronomia & Vinhos", bairro: "Mooca", diagnostico: "Sem Cardápio Digital / Domínio Inativo", status: "Oportunidade", whatsapp: "(11) 97134-1180", score: 89, faturamentoEst: "R$ 95k/mês" },
    { nome: "Centro Automotivo Paulista", nicho: "Engenharia Mecânica", bairro: "Ipiranga", diagnostico: "Página Lenta no Mobile (Nota 28 no PSI)", status: "Urgente", whatsapp: "(11) 99820-4411", score: 84, faturamentoEst: "R$ 140k/mês" },
    { nome: "Studio Alfa Arquitetura & Design", nicho: "Design de Interiores", bairro: "Pinheiros", diagnostico: "Sem Portfólio / Sem Captura de Leads", status: "Crítico", whatsapp: "(11) 96510-3302", score: 98, faturamentoEst: "R$ 220k/mês" },
  ],
  "Rio de Janeiro": [
    { nome: "Consultório Dr. Marcelo Castro", nicho: "Medicina & Estética", bairro: "Barra da Tijuca", diagnostico: "Sem Website Institucional / Sem SSL", status: "Crítico", whatsapp: "(21) 98840-7711", score: 94, faturamentoEst: "R$ 210k/mês" },
    { nome: "Academia Iron Fit Copacabana", nicho: "Fitness & Wellness", bairro: "Copacabana", diagnostico: "Apenas Perfil Social sem Domínio Próprio", status: "Oportunidade", whatsapp: "(21) 97412-3390", score: 87, faturamentoEst: "R$ 110k/mês" },
    { nome: "Kuro Kitchen Delivery", nicho: "Alta Gastronomia", bairro: "Leblon", diagnostico: "Refém de Taxas de Marketplace (iFood)", status: "Urgente", whatsapp: "(21) 99310-8844", score: 91, faturamentoEst: "R$ 160k/mês" },
    { nome: "Solaris Engenharia Fotovoltaica", nicho: "Energia Solar", bairro: "Recreio", diagnostico: "Sem Calculadora Solar / Sem Conversão", status: "Crítico", whatsapp: "(21) 98112-9900", score: 97, faturamentoEst: "R$ 350k/mês" },
  ],
  "Curitiba": [
    { nome: "Clínica Dental Batel", nicho: "Odontologia de Luxo", bairro: "Batel", diagnostico: "Sem Agendamento Online Integrado", status: "Crítico", whatsapp: "(41) 99120-8833", score: 95, faturamentoEst: "R$ 190k/mês" },
    { nome: "Bistrô Jardim Social", nicho: "Gastronomia", bairro: "Jardim Social", diagnostico: "Cardápio em PDF Estático no WhatsApp", status: "Oportunidade", whatsapp: "(41) 98744-1290", score: 86, faturamentoEst: "R$ 75k/mês" },
    { nome: "Advocacia Tributária Cívico", nicho: "Direito Corporativo", bairro: "Centro Cívico", diagnostico: "Sem Presença Digital Confiável", status: "Crítico", whatsapp: "(41) 99650-4412", score: 93, faturamentoEst: "R$ 280k/mês" },
    { nome: "Hospital Veterinário Ecoville", nicho: "Saúde Animal", bairro: "Ecoville", diagnostico: "Sem Botão Direto de Emergência 24h", status: "Urgente", whatsapp: "(41) 99233-5566", score: 90, faturamentoEst: "R$ 130k/mês" },
  ],
  "Lisboa": [
    { nome: "Lisbon Wine & Gourmet Tapas", nicho: "Vinhos & Restaurante", bairro: "Chiado", diagnostico: "Sem Reservas Online Multilíngue", status: "Crítico", whatsapp: "+351 912 345 678", score: 96, faturamentoEst: "€ 45k/mês" },
    { nome: "Atelier de Design Belém", nicho: "Arquitetura de Luxo", bairro: "Belém", diagnostico: "Website Obsoleto sem Versão Mobile", status: "Urgente", whatsapp: "+351 923 456 789", score: 89, faturamentoEst: "€ 60k/mês" },
    { nome: "Clínica Dermatológica Cascais", nicho: "Saúde & Longevidade", bairro: "Cascais", diagnostico: "Sem Formulário de Triagem Digital", status: "Crítico", whatsapp: "+351 934 567 890", score: 94, faturamentoEst: "€ 85k/mês" },
    { nome: "Lisboa Tech Advisory", nicho: "Consultoria B2B", bairro: "Parque das Nações", diagnostico: "Sem Apresentação Interativa de Serviços", status: "Oportunidade", whatsapp: "+351 961 234 567", score: 88, faturamentoEst: "€ 70k/mês" },
  ],
};

// ─────────────────────────────────────────────────────────────
// 05. COMPARAÇÃO B2B (ARCAICA VS PROSPECTANDOAI)
// ─────────────────────────────────────────────────────────────
const COMPARATIVO_ITEMS = [
  {
    criterio: "Mapeamento Territorial",
    arcaico: "Planilhas manuais frias ou listas desatualizadas do Google Maps",
    prospectando: "Radar Cartográfico OSINT varrendo até 100km e 3.000 alvos em minutos",
  },
  {
    criterio: "Identificação do Gap",
    arcaico: "Abrir site por site manualmente para descobrir quem não tem página",
    prospectando: "Diagnóstico algorítmico automático de déficit digital e score de compra",
  },
  {
    criterio: "Proposta Comercial",
    arcaico: "Apresentar PDF genérico que nenhum empresário tem tempo de ler",
    prospectando: "Studio IA que gera o site pronto e funcional do cliente antes do primeiro contato",
  },
  {
    criterio: "Contato com o Decisor",
    arcaico: "Bloqueio na secretária ou número fixo que nunca atende",
    prospectando: "WhatsApp verificado de proprietários, diretores e tomadores de decisão",
  },
  {
    criterio: "Ciclo de Fechamento",
    arcaico: "30 a 60 dias de reuniões sem conversão efetiva",
    prospectando: "48 a 72 horas ao impactar o cliente com a solução já construída",
  },
];

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL: PROSPECTANDOAI ENTERPRISE
// ─────────────────────────────────────────────────────────────
export default function ProspectandoAIPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cidadeDemo, setCidadeDemo] = useState("São Paulo");
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"radar" | "builder" | "crm">("radar");

  // Calculadora Interativa de Receita
  const [ticketMedio, setTicketMedio] = useState(2500);
  const [fechamentosMes, setFechamentosMes] = useState(6);

  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 25);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const leads = DEMO_REGIOES[cidadeDemo] ?? DEMO_REGIOES["São Paulo"];

  const copyPhone = (p: string) => {
    navigator.clipboard.writeText(p);
    setCopiedPhone(p);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const faturamentoEstimadoMes = ticketMedio * fechamentosMes;
  const faturamentoEstimadoAno = faturamentoEstimadoMes * 12;

  return (
    <div className="bg-[#05040b] min-h-screen text-white font-sans selection:bg-purple-600 selection:text-white overflow-x-clip">
      {/* ── BARRA SUPERIOR DE PROGRESSO DE LEITURA (TESLA STYLE) ── */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 origin-left z-[300]"
      />

      {/* ════════════════════════════════════════════════════════════
          01. CABEÇALHO SUPREMO TESLA / AEROSPACE HUD
      ════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-3 pointer-events-none">
        <motion.nav
          initial={{ y: -25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto rounded-full px-5 py-2.5 flex items-center justify-between gap-4 md:gap-8 max-w-5xl w-full transition-all duration-500 ${
            scrolled
              ? "bg-[#0a0717]/90 backdrop-blur-3xl border border-violet-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
              : "bg-[#0d0920]/60 backdrop-blur-2xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
          }`}
        >
          {/* Logo & Marca */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-violet-700 via-purple-600 to-fuchsia-500 flex items-center justify-center shadow-[0_0_22px_rgba(168,85,247,0.7)] group-hover:scale-105 transition-transform">
              <Crosshair size={14} className="text-white" strokeWidth={2.6} />
              <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-black tracking-tight text-white">
                  Prospectando<span className="text-violet-400">AI</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase">
                  v3.8
                </span>
              </div>
              <span className="text-[8px] font-semibold tracking-[0.22em] text-white/30 uppercase hidden sm:block">
                B2B Autonomous Engine
              </span>
            </div>
          </Link>

          {/* Links Centrais com Micro-indicadores */}
          <div className="hidden md:flex items-center gap-7 text-[12px] font-semibold text-white/60">
            <a href="#hero" className="hover:text-white transition-colors relative group">
              Início
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-violet-400 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#demo" className="hover:text-white transition-colors relative group">
              Radar Live
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-violet-400 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#comparativo" className="hover:text-white transition-colors relative group">
              Comparativo
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-violet-400 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#roi" className="hover:text-white transition-colors relative group">
              Calculadora ROI
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-violet-400 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#modulos" className="hover:text-white transition-colors relative group">
              Módulos
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-violet-400 group-hover:w-full transition-all duration-300" />
            </a>
          </div>

          {/* Telemetria de Satélite + Ação */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>RADAR 100% ONLINE</span>
            </div>

            <Link
              href="/login"
              className="group relative flex items-center gap-2 px-4 py-2 rounded-full bg-white text-violet-950 hover:bg-violet-50 font-bold text-[11px] shadow-[0_5px_20px_rgba(255,255,255,0.25)] transition-all hover:scale-105"
            >
              <span>Acessar Terminal</span>
              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Drawer Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 rounded-3xl bg-[#090616]/98 backdrop-blur-3xl border border-violet-500/30 p-6 shadow-2xl md:hidden space-y-4"
          >
            <nav className="flex flex-col gap-2 text-sm font-semibold">
              <a onClick={() => setMobileMenuOpen(false)} href="#hero" className="p-3 rounded-xl hover:bg-white/5 text-white/80">Início</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#demo" className="p-3 rounded-xl hover:bg-white/5 text-white/80">Radar em Tempo Real</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#comparativo" className="p-3 rounded-xl hover:bg-white/5 text-white/80">Comparativo Arcaico vs IA</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#roi" className="p-3 rounded-xl hover:bg-white/5 text-white/80">Calculadora de Receita</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#modulos" className="p-3 rounded-xl hover:bg-white/5 text-white/80">Sistemas & Módulos</a>
            </nav>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              Abrir Plataforma ProspectandoAI <ArrowRight size={14} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════
          02. HERO SECTION — CINEMA TESLA GRADE
      ════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 overflow-hidden">
        {/* Camadas Profundas de Luz Espacial */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05040b] via-[#090618] to-[#05040b]" />
        <div className="absolute top-[18%] left-[20%] w-[550px] h-[550px] rounded-full bg-violet-700/12 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[15%] w-[420px] h-[420px] rounded-full bg-fuchsia-700/10 blur-[120px] pointer-events-none" />

        {/* Grade Cartográfica Vetorial */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Rede Neural com Partículas */}
        <div className="absolute inset-0 opacity-60">
          <NeuralCanvas />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-8">
          {/* Badge Aerospacial */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-300 text-[11px] font-mono font-bold"
          >
            <Radio size={12} className="text-violet-400 animate-pulse" />
            <span>RADAR TERRITORIAL 100KM · TECNOLOGIA DE INTELIGÊNCIA B2B</span>
          </motion.div>

          {/* Headline Monumental */}
          <div className="space-y-4 max-w-5xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.035em] leading-[0.93]"
            >
              <span className="text-white">Prospecção B2B</span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-200 bg-clip-text text-transparent">
                de Alta Precisão.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-sm sm:text-lg text-white/45 max-w-2xl mx-auto leading-relaxed font-normal"
            >
              Varra regiões metropolitanas completas, identifique empresas com déficit digital e acesse
              diretamente o WhatsApp verificado de sócios e diretores — antes da concorrência.
            </motion.p>
          </div>

          {/* Botões de Ação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/login"
              className="group relative px-9 py-4 rounded-full bg-white text-violet-950 hover:bg-violet-50 font-black text-sm flex items-center gap-3 shadow-[0_15px_45px_rgba(255,255,255,0.25)] hover:shadow-[0_20px_55px_rgba(255,255,255,0.35)] hover:scale-105 transition-all"
            >
              <Radar size={17} />
              Iniciar Varredura Gratuita
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#demo"
              className="px-8 py-4 rounded-full border border-white/20 hover:border-violet-400/60 bg-white/[0.03] hover:bg-white/[0.08] text-white/80 hover:text-white font-bold text-sm transition-all backdrop-blur-md flex items-center gap-2.5"
            >
              <Play size={14} className="text-violet-400" />
              Ver Demonstração Interativa
            </a>
          </motion.div>

          {/* Cockpit Interativo com Radar Orbital 360° */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="pt-6"
          >
            <div className="relative max-w-4xl mx-auto rounded-[32px] p-2 bg-gradient-to-b from-violet-500/30 via-white/10 to-transparent shadow-[0_30px_90px_rgba(0,0,0,0.9)]">
              <div className="rounded-[30px] bg-[#090718] border border-white/10 overflow-hidden p-6 sm:p-8">
                {/* Cabeçalho do Cockpit */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-xs text-white/70 font-bold">COCKPIT DE INTELIGÊNCIA CARTOGRÁFICA</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-white/40">
                    <span>SENSOR ATIVO: OVERPASS + CARTO DB</span>
                    <span className="text-violet-400 font-bold">100KM SCAN</span>
                  </div>
                </div>

                {/* Grid do Cockpit: Radar + Painel de Telemetria */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-6">
                  {/* Coluna do Radar */}
                  <div className="md:col-span-6 flex flex-col items-center justify-center">
                    <div className="relative w-full flex items-center justify-center">
                      <div className="absolute inset-0 bg-violet-600/15 blur-3xl rounded-full" />
                      <RadarAnimation />
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-[10px] font-mono text-white/40">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-400" /> Alvo Mapeado</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> WhatsApp Ativo</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Sem Site</span>
                    </div>
                  </div>

                  {/* Coluna de Métricas de Voo / Telemetria */}
                  <div className="md:col-span-6 space-y-4 text-left">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                      <div className="text-[10px] font-mono text-violet-400 uppercase tracking-widest font-bold">
                        DIAGNÓSTICO EM TEMPO REAL
                      </div>
                      <div className="text-lg font-bold text-white mt-1">
                        +500 Empresas Encontradas na Região
                      </div>
                      <p className="text-xs text-white/40 mt-1">
                        73% dos estabelecimentos possuem website lento, inexistente ou sem botão de contato direto.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                        <div className="text-[10px] font-mono text-white/30">PRECISÃO DE CONTATO</div>
                        <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">98.4%</div>
                        <div className="text-[10px] text-white/30">Validação Móvel</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                        <div className="text-[10px] font-mono text-white/30">TEMPO POR BUSCA</div>
                        <div className="text-2xl font-black text-violet-400 font-mono mt-0.5">42s</div>
                        <div className="text-[10px] text-white/30">Raio de 100km</div>
                      </div>
                    </div>

                    <Link
                      href="/login"
                      className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 transition-all"
                    >
                      Abrir Terminal de Prospecção <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          03. FAIXA DE TELEMETRIA CORPORATIVA (METRICS STRIP)
      ════════════════════════════════════════════════════════════ */}
      <section className="py-16 border-y border-white/[0.06] bg-gradient-to-r from-transparent via-violet-950/20 to-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { to: 100, suffix: "km", label: "Raio Territorial Contínuo" },
              { to: 3000, suffix: "+", label: "Leads Capturados por Ciclo" },
              { to: 98, suffix: "%", label: "Validação de WhatsApp Ativo" },
              { to: 15, suffix: "s", label: "Geração de Site com IA" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl sm:text-5xl font-black text-white font-mono mb-1">
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-[11px] text-white/30 font-medium uppercase tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          04. CONSOLE INTERATIVO: DEMONSTRAÇÃO DO RADAR EM TEMPO REAL
      ════════════════════════════════════════════════════════════ */}
      <section id="demo" className="py-32 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Radio size={12} className="animate-pulse" /> Demonstração Interativa ao Vivo
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Selecione uma Capital.<br />
            <span className="text-violet-400">Veja o Radar em Ação.</span>
          </h2>
          <p className="text-sm text-white/40">
            Abaixo estão dados reais simulados em 4 praças metropolitanas. Veja o score de oportunidade de cada empresa.
          </p>
        </div>

        {/* Console Box */}
        <div className="rounded-[32px] bg-[#0a0718] border border-violet-500/25 shadow-2xl overflow-hidden">
          {/* Header do Terminal */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#0d0922] border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-white/40">prospectando.radar — alvos territoriais</span>
            </div>

            {/* Seletor de Cidades */}
            <div className="flex items-center gap-1.5">
              {Object.keys(DEMO_REGIOES).map((cid) => (
                <button
                  key={cid}
                  onClick={() => setCidadeDemo(cid)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    cidadeDemo === cid
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                      : "bg-white/5 text-white/40 hover:text-white"
                  }`}
                >
                  {cid}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Leads */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {leads.map((lead, idx) => (
                <motion.div
                  key={`${cidadeDemo}-${idx}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="p-5 rounded-2xl bg-[#100c26] border border-white/[0.07] hover:border-violet-500/40 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider">
                        {lead.nicho}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Score {lead.score}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-1">{lead.nome}</h4>
                    <span className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {lead.bairro} · {lead.faturamentoEst}
                    </span>

                    <div className="mt-3 text-[11px] font-medium p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 leading-snug">
                      {lead.diagnostico}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                    <span className="text-violet-300 font-semibold">{lead.whatsapp}</span>
                    <button
                      onClick={() => copyPhone(lead.whatsapp)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                      title="Copiar número"
                    >
                      {copiedPhone === lead.whatsapp ? (
                        <Check size={13} className="text-emerald-400" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Rodapé da Demonstração */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/[0.07]">
              <span className="text-xs text-white/35 font-mono">
                ⚡ Varredura com 100km de cobertura · Filtro de nicho e extração de tomadores de decisão
              </span>
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-violet-500/20 transition-all"
              >
                Liberar Varredura na Minha Cidade <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          05. TABELA COMPARATIVA: PROSPECÇÃO ARCAICA VS PROSPECTANDOAI
      ════════════════════════════════════════════════════════════ */}
      <section id="comparativo" className="py-24 border-y border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-[3px] text-violet-400 font-bold">
              TRANSFORMAÇÃO DE PERFORMANCE
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              O Fim da Prospecção Lenta.
            </h2>
            <p className="text-sm text-white/40">
              Veja o abismo de eficiência entre o método tradicional frio e a inteligência territorial do ProspectandoAI.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0a0718] overflow-hidden shadow-2xl">
            <div className="grid grid-cols-12 px-6 py-4 bg-white/[0.03] border-b border-white/[0.08] text-xs font-mono font-bold uppercase tracking-wider text-white/50">
              <div className="col-span-4 sm:col-span-3">Etapa / Critério</div>
              <div className="col-span-4 sm:col-span-4 text-red-400/80">Prospecção Tradicional</div>
              <div className="col-span-4 sm:col-span-5 text-violet-400">Com ProspectandoAI</div>
            </div>

            <div className="divide-y divide-white/[0.05]">
              {COMPARATIVO_ITEMS.map((item, i) => (
                <div key={i} className="grid grid-cols-12 px-6 py-5 items-center text-xs leading-relaxed hover:bg-white/[0.015] transition-colors">
                  <div className="col-span-4 sm:col-span-3 font-bold text-white font-mono">
                    {item.criterio}
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-white/40 pr-3">
                    <span className="line-through decoration-red-500/40">{item.arcaico}</span>
                  </div>
                  <div className="col-span-4 sm:col-span-5 text-white/90 font-medium flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-violet-400 flex-shrink-0 mt-0.5" />
                    <span>{item.prospectando}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          06. CALCULADORA INTERATIVA DE ROI B2B
      ════════════════════════════════════════════════════════════ */}
      <section id="roi" className="py-32 max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase">
            <DollarSign size={13} /> Calculadora de Potencial de Receita
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Calcule o Retorno da sua Operação
          </h2>
          <p className="text-sm text-white/40">
            Ajuste o valor médio do seu serviço e quantos contratos deseja fechar mensalmente com a nossa prospecção.
          </p>
        </div>

        <div className="rounded-[32px] p-8 sm:p-12 bg-[#0c0822] border border-violet-500/25 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          {/* Sliders */}
          <div className="md:col-span-7 space-y-8">
            {/* Slider 1: Ticket Médio */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-white/60 uppercase">Ticket Médio do seu Serviço</span>
                <span className="font-mono font-black text-base text-violet-400">
                  R$ {ticketMedio.toLocaleString("pt-BR")}
                </span>
              </div>
              <input
                type="range"
                min={800}
                max={15000}
                step={200}
                value={ticketMedio}
                onChange={(e) => setTicketMedio(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-2 bg-white/10 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/30">
                <span>R$ 800</span>
                <span>R$ 15.000+</span>
              </div>
            </div>

            {/* Slider 2: Contratos Fechados */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-white/60 uppercase">Contratos Fechados por Mês</span>
                <span className="font-mono font-black text-base text-violet-400">
                  {fechamentosMes} contratos
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={fechamentosMes}
                onChange={(e) => setFechamentosMes(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-2 bg-white/10 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/30">
                <span>1 contrato</span>
                <span>30 contratos</span>
              </div>
            </div>
          </div>

          {/* Resultado do Faturamento */}
          <div className="md:col-span-5 rounded-2xl bg-[#140e34] border border-violet-500/30 p-7 text-center space-y-4">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
              POTENCIAL DE RECEITA DESBLOQUEADA
            </span>

            <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
              R$ {faturamentoEstimadoMes.toLocaleString("pt-BR")}
              <span className="text-xs text-violet-400 font-normal block mt-1">/mês de faturamento extra</span>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>Projeção Anual:</span>
              <strong className="text-emerald-400 text-sm">
                R$ {faturamentoEstimadoAno.toLocaleString("pt-BR")}
              </strong>
            </div>

            <Link
              href="/login"
              className="w-full py-3.5 rounded-xl bg-white text-violet-950 hover:bg-violet-100 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              Começar com Este Potencial <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          07. MÓDULOS DE ALTA PERFORMANCE (BENTO GRID MODERNO)
      ════════════════════════════════════════════════════════════ */}
      <section id="modulos" className="py-24 border-t border-white/[0.06] bg-gradient-to-b from-violet-950/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[3px] text-violet-400 font-bold">
                ECOSSISTEMA COMPLETO
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Módulos de Engenharia Comercial
              </h2>
            </div>
            <Link href="/login" className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1">
              Ver Todos os Recursos <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Radar size={22} className="text-violet-400" />,
                title: "Radar Cartográfico OSINT 100km",
                desc: "Mapeie capitais e cidades circunvizinhas com raio milimétrico. Extração de localização, horários de pico, status do website e telefones ativos.",
                badge: "GEOLOCALIZAÇÃO",
              },
              {
                icon: <Sparkles size={22} className="text-fuchsia-400" />,
                title: "Studio Builder IA (Syre & Gemini)",
                desc: "Gere sites completos e responsivos em 15 segundos para apresentar a cada cliente durante o primeiro contato comercial.",
                badge: "CONVERSÃO NATIVA",
              },
              {
                icon: <Kanban size={22} className="text-cyan-400" />,
                title: "CRM Kanban & Automação WhatsApp",
                desc: "Central completa para gerenciar negócios em andamento, enviar propostas com um clique e manter cadência de follow-up sem esquecimentos.",
                badge: "ESCALA COMERCIAL",
              },
            ].map((mod, i) => (
              <div
                key={i}
                className="p-8 rounded-[30px] bg-[#0c0822] border border-violet-500/20 hover:border-violet-500/50 transition-all shadow-xl space-y-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {mod.icon}
                </div>
                <span className="text-[10px] font-mono text-violet-400 font-bold tracking-wider block">
                  {mod.badge}
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-violet-200 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-white/45 leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          08. DEPOIMENTOS DE RESULTADOS REAIS
      ════════════════════════════════════════════════════════════ */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <div className="text-[10px] font-mono uppercase tracking-[3px] text-violet-400 font-bold">
            VALIDAÇÃO B2B
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Quem Prospecta com IA, Domina.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              nome: "Gabriel Sampaio",
              cargo: "Diretor Comercial · Agência Pulse",
              texto: "Antes nós perdíamos dias garimpando o Google Maps. Com o ProspectandoAI, varremos um raio de 40km e fechamos 7 clientes de clínicas estéticas na primeira semana.",
              fechamentos: "+R$ 38.000 fechados",
            },
            {
              nome: "Renata Vasconcelos",
              cargo: "Fundadora · Consultoria Lumina",
              texto: "O fato de gerar a página do cliente pronta antes mesmo de mandar o WhatsApp muda tudo. A taxa de resposta foi de 4% para mais de 38%. Surreal.",
              fechamentos: "38% Taxa de Resposta",
            },
            {
              nome: "Diego Moreira",
              cargo: "Head de Vendas · TechScale B2B",
              texto: "A validação ativa do WhatsApp economizou centenas de horas da nossa equipe. Não perdemos mais tempo discando para números fixos ou inexistentes.",
              fechamentos: "4x mais agilidade",
            },
          ].map((dep, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-[#0b081e] border border-white/[0.08] hover:border-violet-500/30 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-white/60 leading-relaxed italic">"{dep.texto}"</p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{dep.nome}</div>
                  <div className="text-[10px] text-white/40">{dep.cargo}</div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  {dep.fechamentos}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          09. FAQ CORPORATIVO & CONFORMIDADE
      ════════════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Perguntas Frequentes
            </h2>
            <p className="text-xs text-white/40">Respostas diretas sobre tecnologia, dados e conformidade legal.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Como o radar encontra os números de WhatsApp dos tomadores de decisão?",
                a: "A plataforma cruza dados de inteligência de fontes públicas abertas (OSINT), registros cadastrais, redes corporativas e cartografia digital, realizando a validação ativa em tempo real dos números móveis.",
              },
              {
                q: "A plataforma está em conformidade com a LGPD?",
                a: "Sim. A tecnologia opera exclusivamente com dados empresariais e corporativos de acesso público, respeitando integralmente as diretrizes da Lei Geral de Proteção de Dados (Lei 13.709/2018).",
              },
              {
                q: "Qual o raio máximo de alcance do radar territorial?",
                a: "O raio de varredura pode chegar a até 100km contínuos a partir do ponto central selecionado, cobrindo regiões metropolitanas inteiras e cidades vizinhas.",
              },
              {
                q: "Como funciona a geração de landing pages instantâneas?",
                a: "Nossos motores nativos de IA analisam o nicho, a paleta de cores e o déficit da empresa encontrada e constroem um site completo e responsivo em 15 segundos com deploy em subdomínio para demonstração ao cliente.",
              },
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#0b081e] border border-white/[0.07] space-y-2">
                <h4 className="text-sm font-bold text-white">{faq.q}</h4>
                <p className="text-xs text-white/45 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          10. CTA FINAL CINEMÁTICO TESLA
      ════════════════════════════════════════════════════════════ */}
      <section className="py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-[#05040b] to-fuchsia-950/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[350px] rounded-full bg-violet-600/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-mono font-bold uppercase">
            <Sparkles size={13} /> COMECE AGORA · SEM CARTÃO DE CRÉDITO
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-[-0.03em] leading-[0.95]">
            Sua Cidade Está Cheia de Empresas.<br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-200 bg-clip-text text-transparent">
              Mapeie Todas Agora.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-white/40 max-w-xl mx-auto leading-relaxed">
            Tenha acesso ao radar de 100km, aos contatos de tomadores de decisão e ao gerador de sites com IA.
          </p>

          <div className="pt-2">
            <Link
              href="/login"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-violet-950 hover:bg-violet-50 font-black text-base shadow-[0_20px_60px_rgba(255,255,255,0.25)] hover:scale-105 transition-all"
            >
              <Radar size={19} />
              Iniciar Varredura Gratuita
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          11. RODAPÉ SUPREMO TESLA SUPERCHARGER GRID
      ════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.08] bg-[#04030a] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Coluna Marca */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-700 via-purple-600 to-fuchsia-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                  <Crosshair size={15} className="text-white" strokeWidth={2.6} />
                </div>
                <span className="text-lg font-black text-white">
                  Prospectando<span className="text-violet-400">AI</span>
                </span>
              </div>
              <p className="text-xs text-white/35 leading-relaxed max-w-sm">
                Plataforma de inteligência territorial, geração instantânea de páginas com IA e automação comercial B2B. Do radar cartográfico ao fechamento do contrato.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SISTEMA 100% OPERACIONAL</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-white/40">
                  SLA 99.9%
                </div>
              </div>
            </div>

            {/* Coluna Navegação */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white/50">Navegação</h4>
              <ul className="space-y-2 text-xs text-white/35">
                <li><a href="#hero" className="hover:text-violet-300 transition-colors">Início</a></li>
                <li><a href="#demo" className="hover:text-violet-300 transition-colors">Radar Live</a></li>
                <li><a href="#comparativo" className="hover:text-violet-300 transition-colors">Comparativo</a></li>
                <li><a href="#roi" className="hover:text-violet-300 transition-colors">Calculadora ROI</a></li>
                <li><a href="#modulos" className="hover:text-violet-300 transition-colors">Módulos</a></li>
              </ul>
            </div>

            {/* Coluna Módulos */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white/50">Sistemas & Módulos</h4>
              <ul className="space-y-2 text-xs text-white/35">
                <li><Link href="/app/mapa" className="hover:text-violet-300 transition-colors">Radar Cartográfico 100km</Link></li>
                <li><Link href="/app/builder" className="hover:text-violet-300 transition-colors">Studio Builder IA</Link></li>
                <li><Link href="/app/crm" className="hover:text-violet-300 transition-colors">CRM Kanban de Vendas</Link></li>
                <li><Link href="/app/busca" className="hover:text-violet-300 transition-colors">Disparador de WhatsApp</Link></li>
                <li><Link href="/app/design" className="hover:text-violet-300 transition-colors">Acervo de 78 Designs</Link></li>
              </ul>
            </div>

            {/* Coluna Conformidade & Contato */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white/50">Conformidade</h4>
              <ul className="space-y-2 text-xs text-white/35">
                <li className="flex items-center gap-1.5"><Shield size={11} className="text-violet-400" /> LGPD Compliant</li>
                <li className="flex items-center gap-1.5"><Lock size={11} className="text-emerald-400" /> Criptografia 256-bit</li>
                <li className="flex items-center gap-1.5"><Globe size={11} className="text-cyan-400" /> Brasil & Portugal</li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full py-2.5 rounded-xl bg-violet-600/30 hover:bg-violet-600 border border-violet-500/40 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
                >
                  Acessar Plataforma <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Barra Inferior com Direitos */}
          <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/20 font-mono">
            <span>© 2026 ProspectandoAI · Tecnologia Autônoma de Prospecção B2B</span>
            <div className="flex items-center gap-4">
              <span>Termos de Uso</span>
              <span>·</span>
              <span>Privacidade</span>
              <span>·</span>
              <span>Segurança da Informação</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
