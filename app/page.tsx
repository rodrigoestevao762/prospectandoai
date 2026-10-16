"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Search, Zap, Crosshair, Sparkles, Check, Phone,
  Globe, Shield, ChevronDown, Layers, Terminal, Compass, Eye,
  Play, Users, Building2, ExternalLink, Sliders, CheckCircle2,
  Copy, Lock, Palette, Kanban, Monitor, Smartphone, LayoutGrid,
  Menu, X, Mail, MapPin, ChevronLeft, ChevronRight, MessageSquare
} from "lucide-react";
import CodeHardLogo from "@/components/codemakers/CodeHardLogo";
import HardyMascot from "@/components/codemakers/HardyMascot";

// ── 01. CARDS DE DESTAQUE: PILARES DA PLATAFORMA (SOBRE NÓS) ──
const SHOWCASE_CARDS = [
  {
    num: "01 / 03",
    tag: "VARREDURA TERRITORIAL 100KM",
    title: "Radar Cartográfico OSINT",
    desc: "Mapeie em minutos regiões metropolitanas inteiras, localize comércios sem website profissional e extraia contatos diretos de tomadores de decisão.",
    badgeIcon: Crosshair,
    nicho: "Geolocalização & Alvos",
    image: "/capa-mundo.jpg",
    cor: "#8b5cf6"
  },
  {
    num: "02 / 03",
    tag: "GERAÇÃO NATIVA DE CÓDIGO",
    title: "Studio Builder IA",
    desc: "Criação cirúrgica de landing pages e cardápios interativos com nossos motores nativos Syre v2.5, Formoda Ultra, Titan AI, Nova Lux e Google Gemini.",
    badgeIcon: Sparkles,
    nicho: "Conversão & Luxo",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    cor: "#a855f7"
  },
  {
    num: "03 / 03",
    tag: "PIPELINE & DISPARO WHATSAPP",
    title: "CRM Kanban & Automação",
    desc: "Central completa para gestão de negociações, enriquecimento de leads e disparos automatizados com WhatsApp verificado de empresas locais.",
    badgeIcon: Kanban,
    nicho: "Vendas & Escala",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    cor: "#7c3aed"
  }
];

// ── 02. MÓDULOS E FUNCIONALIDADES PRINCIPAIS DO NOSSO SITE ──
const CASE_STUDIES = [
  {
    id: "radar",
    client: "Terminal Cartográfico 100km",
    category: "Inteligência Territorial & OSINT",
    headline: "Varredura metropolitana de empresas com déficit digital",
    desc: "Algoritmo geoespacial integrado ao OpenStreetMap e CartoDB Dark Matter. Identifica empresas sem website profissional ou com plataformas obsoletas em minutos, extraindo WhatsApp verificado de tomadores de decisão.",
    metrics: "Raio de 100km · +500 alvos/busca",
    year: "2026",
    color: "#7c3aed",
    link: "/app/mapa",
    actionLabel: "Abrir Radar",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "builder",
    client: "Studio Builder IA (Syre & Formoda)",
    category: "Engenharia de Design & IA",
    headline: "Geração de landing pages de alta conversão em 15s",
    desc: "Gere páginas completas e responsivas estilizadas em obsidian dark glass em segundos. Modelos especializados para Clínicas, Restaurantes, Escritórios e Serviços com publicação instantânea via subdomínio integrado.",
    metrics: "5 Motores IA · 1-Click Deploy",
    year: "2026",
    color: "#9333ea",
    link: "/app/builder",
    actionLabel: "Abrir Builder",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "crm",
    client: "CRM Kanban de Vendas",
    category: "Gestão Comercial & Pipeline",
    headline: "Pipeline visual sem planilhas para fechar contratos",
    desc: "Organize todo o funil comercial com estágios dinâmicos desde a prospecção inicial até o contrato assinado. Acompanhamento de valores de propostas, histórico de contato e previsão de receita recorrente.",
    metrics: "+340% Conversão de Fechamentos",
    year: "2026",
    color: "#6d28d9",
    link: "/app/crm",
    actionLabel: "Acessar CRM",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "disparador",
    client: "Disparador WhatsApp & Enriquecimento",
    category: "Prospecção Ativa & Automação",
    headline: "Abordagens diretas no WhatsApp de tomadores de decisão",
    desc: "Validação ativa de números comerciais móveis e envio de cadências personalizadas com modelos de alta conversão. Enriquecimento de redes sociais, e-mails corporativos e contatos comerciais diretos.",
    metrics: "Zero Timeouts · Validação Instantânea",
    year: "2026",
    color: "#a855f7",
    link: "/app/vendas",
    actionLabel: "Ver Disparador",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
  }
];

const TECH_STACK = [
  { name: "Next.js 15", desc: "App Router, Server Actions & Edge Caching", icon: "▲" },
  { name: "Tailwind CSS", desc: "Design System com tokens em Roxo Real", icon: "✦" },
  { name: "Framer Motion", desc: "Orquestração de física e transições fluidas", icon: "❖" },
  { name: "Three.js & WebGL", desc: "Cenas 3D interativas e shaders espaciais", icon: "⬡" },
  { name: "Google Gemini", desc: "Motor neural de enriquecimento de dados", icon: "⚡" },
  { name: "CartoDB Dark", desc: "Cartografia noturna com satélite Leaflet", icon: "◉" },
  { name: "Syre v2.5", desc: "Motor nativo de páginas de luxo e conversão", icon: "◆" },
  { name: "Formoda Ultra", desc: "Dark Bento Grid & SaaS moderno", icon: "■" }
];

interface DemoLead {
  nome: string;
  nicho: string;
  bairro: string;
  diagnostico: string;
  tipo: "danger" | "warning" | "info";
  whatsapp: string;
  score: number;
}

const DEMO_DATA: Record<string, DemoLead[]> = {
  "São Paulo, SP": [
    { nome: "Clínica Odonto Prime", nicho: "Odontologia", bairro: "Jardins", diagnostico: "Sem Website Profissional", tipo: "danger", whatsapp: "(11) 98421-9920", score: 92 },
    { nome: "Bella Pasta Ristorante", nicho: "Gastronomia", bairro: "Mooca", diagnostico: "Apenas Perfil Social sem Domínio", tipo: "warning", whatsapp: "(11) 97134-1180", score: 88 },
    { nome: "Auto Mecânica Paulista", nicho: "Automotivo", bairro: "Ipiranga", diagnostico: "Site Obsoleto / Lento no Mobile", tipo: "info", whatsapp: "(11) 99820-4411", score: 78 },
    { nome: "Studio Alfa Arquitetura", nicho: "Design & Interiores", bairro: "Pinheiros", diagnostico: "Sem Catálogo / Portfólio Inativo", tipo: "danger", whatsapp: "(11) 96510-3302", score: 95 },
  ],
  "Rio de Janeiro, RJ": [
    { nome: "Consultório Dr. Marcelo", nicho: "Saúde & Estética", bairro: "Barra da Tijuca", diagnostico: "Sem Website Profissional", tipo: "danger", whatsapp: "(21) 98840-7711", score: 90 },
    { nome: "Academia Iron Fit", nicho: "Fitness", bairro: "Botafogo", diagnostico: "Página Social sem Domínio", tipo: "warning", whatsapp: "(21) 97412-3390", score: 85 },
    { nome: "Kuro Kitchen Delivery", nicho: "Gastronomia", bairro: "Leblon", diagnostico: "Dependência de Marketplace", tipo: "info", whatsapp: "(21) 99310-8844", score: 82 },
    { nome: "Solaris Engenharia Solar", nicho: "Energia Solar", bairro: "Recreio", diagnostico: "Sem Calculadora / Lead Capture", tipo: "danger", whatsapp: "(21) 98112-9900", score: 93 },
  ],
  "Curitiba, PR": [
    { nome: "Clínica Dental Batel", nicho: "Odontologia", bairro: "Batel", diagnostico: "Sem Portal de Agendamento Online", tipo: "danger", whatsapp: "(41) 99120-8833", score: 94 },
    { nome: "Bistrô Jardim Social", nicho: "Gastronomia", bairro: "Jardim Social", diagnostico: "Website Obsoleto sem Cardápio Digital", tipo: "warning", whatsapp: "(41) 98744-1290", score: 86 },
    { nome: "Advocacia Centro Cívico", nicho: "Jurídico", bairro: "Centro Cívico", diagnostico: "Sem Página Institucional", tipo: "danger", whatsapp: "(41) 99650-4412", score: 91 },
    { nome: "Pet Care Ecoville", nicho: "Veterinária", bairro: "Ecoville", diagnostico: "Sem Botão de WhatsApp Direto", tipo: "warning", whatsapp: "(41) 99233-5566", score: 89 },
  ],
  "Lisboa, Portugal": [
    { nome: "Lisbon Wine & Tapas", nicho: "Gastronomia", bairro: "Chiado", diagnostico: "Sem Reservas Online", tipo: "danger", whatsapp: "+351 912 345 678", score: 94 },
    { nome: "Atelier D'Art Belém", nicho: "Design & Móveis", bairro: "Belém", diagnostico: "Sem Loja Digital", tipo: "warning", whatsapp: "+351 923 456 789", score: 87 },
    { nome: "Clínica Estética Cascais", nicho: "Saúde & Beleza", bairro: "Cascais", diagnostico: "Sem Formulário de Avaliação", tipo: "danger", whatsapp: "+351 934 567 890", score: 92 },
  ]
};

export default function LoroStyleHomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cidadeDemo, setCidadeDemo] = useState("São Paulo, SP");
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Referência e Scroll Interativo do Hero Cover (Purple Tiger)
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });
  const tigerScale = useTransform(smoothProgress, [0, 1], [1, 1.18]);
  const tigerY = useTransform(smoothProgress, [0, 1], [0, 75]);
  const tigerRotate = useTransform(smoothProgress, [0, 1], [0, 2.5]);
  const tigerGlow = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.7, 0.4]);

  // Interatividade com Mouse Tilt no Card da Imagem
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };
  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const leadsAtuais = DEMO_DATA[cidadeDemo] || DEMO_DATA["São Paulo, SP"];

  return (
    <div className="bg-[#07050f] min-h-screen text-white font-sans selection:bg-[#7c3aed] selection:text-white overflow-x-clip">
      
      {/* ── 01. NAVBAR FLUTUANTE EM PÍLULA (ESTILO LOROLABS) ── */}
      <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto rounded-full bg-[#120b29]/80 backdrop-blur-2xl border border-purple-500/30 px-3 sm:px-5 py-2 shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex items-center justify-between gap-4 md:gap-8 max-w-4xl w-full">
          {/* Logo Badge Esquerdo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6d28d9] to-[#a855f7] flex items-center justify-center text-white font-black text-xs shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform">
              CH
            </div>
            <span className="font-bold text-sm tracking-tight text-white hidden sm:inline-block">
              CODEHARD<span className="text-purple-400">.</span>
            </span>
          </Link>

          {/* Links Centrais de Navegação 100% em Português */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-300">
            <a href="#hero" className="hover:text-purple-300 transition-colors">Início</a>
            <a href="#about" className="hover:text-purple-300 transition-colors">Sobre</a>
            <a href="#portfolio" className="hover:text-purple-300 transition-colors">Módulos</a>
            <a href="#testimonials" className="hover:text-purple-300 transition-colors">Resultados</a>
            <a href="#demo" className="hover:text-purple-300 transition-colors">Demonstração</a>
            <a href="#contact" className="hover:text-purple-300 transition-colors">Contato</a>
          </div>

          {/* Botões de Ação Circulares Direita */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="w-8 h-8 rounded-full bg-white text-purple-950 flex items-center justify-center hover:bg-purple-100 transition-colors shadow-md"
              title="Acessar Plataforma"
            >
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <a
              href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20iniciar%20a%20prospec%C3%A7%C3%A3o%20com%20o%20CODEHARD"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-purple-600/30 hover:bg-purple-600/60 border border-purple-400/40 text-purple-200 flex items-center justify-center transition-colors"
              title="Fale Conosco no WhatsApp"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Menu Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-20 z-40 rounded-3xl bg-[#120b29]/95 backdrop-blur-2xl border border-purple-500/30 p-6 shadow-2xl md:hidden space-y-4"
          >
            <div className="flex flex-col gap-3 text-sm font-semibold">
              <a onClick={() => setMobileMenuOpen(false)} href="#hero" className="p-2 rounded-xl hover:bg-white/5 text-white">Início</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#about" className="p-2 rounded-xl hover:bg-white/5 text-zinc-300">Sobre</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#portfolio" className="p-2 rounded-xl hover:bg-white/5 text-zinc-300">Módulos</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#testimonials" className="p-2 rounded-xl hover:bg-white/5 text-zinc-300">Resultados</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#demo" className="p-2 rounded-xl hover:bg-white/5 text-zinc-300">Demonstração</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#contact" className="p-2 rounded-xl hover:bg-white/5 text-zinc-300">Contato</a>
            </div>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              Acessar Terminal CODEHARD ↗
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 02. HERO SECTION NO MODELO LOROLABS COM CAPA ROXA INTERATIVA ── */}
      <section id="hero" ref={heroRef} className="px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12">
        <div className="max-w-7xl mx-auto rounded-[32px] md:rounded-[44px] overflow-hidden bg-gradient-to-br from-[#190d36] via-[#2a1059] to-[#120626] border border-purple-500/30 shadow-[0_25px_80px_rgba(109,40,217,0.35)] relative p-6 sm:p-10 lg:p-16">
          
          {/* Luzes Ambiente e Malha Geométrica */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.25)_0%,transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Coluna Esquerda: Texto Editorial e CTAs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-purple-200">
                <span className="w-2 h-2 rounded-full bg-purple-300 animate-ping" />
                CODEHARD · PLATAFORMA DE PROSPECÇÃO B2B &amp; DESIGN IA
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                Inteligência Territorial &amp; Prospecção B2B de Alta Conversão.
              </h1>

              <p className="text-sm sm:text-base text-purple-100/80 leading-relaxed max-w-xl">
                Encontre empresas locais com déficit digital sem intermediários. Mapeie em minutos regiões metropolitanas de até 100km, gere landing pages de luxo e acesse o WhatsApp direto de tomadores de decisão.
              </p>

              <div className="text-[10px] font-mono uppercase tracking-[2px] text-purple-300/80 font-semibold">
                INTELIGÊNCIA TERRITORIAL · ARQUITETURA DE DESIGN PROPRIETÁRIA
              </div>

              {/* Botões de Ação estilo LoroLabs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="px-7 py-3.5 rounded-full bg-white text-purple-950 hover:bg-purple-50 font-bold text-xs flex items-center gap-2 shadow-[0_10px_25px_rgba(255,255,255,0.2)] hover:scale-105 transition-all"
                >
                  Iniciar Prospecção Gratuita <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#demo"
                  className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs backdrop-blur-md transition-all"
                >
                  Ver Demonstração ao Vivo
                </a>
              </div>
            </div>

            {/* Coluna Direita: Capa Roxa do Tigre HardCode com Interatividade no Scroll e Mouse */}
            <div className="lg:col-span-6">
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative rounded-3xl md:rounded-[36px] overflow-hidden bg-black/40 border border-purple-500/30 p-2 shadow-2xl group cursor-pointer"
                style={{ perspective: 1000 }}
              >
                {/* Aura Dinâmica de Partículas que Brilha com o Scroll */}
                <motion.div
                  style={{ opacity: tigerGlow }}
                  className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 rounded-3xl blur-2xl pointer-events-none -z-10"
                />

                {/* Imagem do Tigre com Parallax e Tilt */}
                <motion.div
                  style={{
                    scale: tigerScale,
                    y: tigerY,
                    rotateZ: tigerRotate,
                    rotateX: mousePos.y * -15,
                    rotateY: mousePos.x * 15,
                  }}
                  className="w-full aspect-[16/10] sm:aspect-[16/10] rounded-2xl md:rounded-[30px] overflow-hidden bg-[#07050f] relative flex items-center justify-center transition-transform duration-200"
                >
                  <img
                    src="/hardcode-hero-tiger.png"
                    alt="CODEHARD Tiger Editorial Artwork"
                    className="w-full h-full object-cover object-center filter saturate-110 contrast-105"
                  />

                  {/* Efeito de Reflexo Tátil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-purple-200/90 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10">
                    <span>CODEHARD · Inteligência &amp; Design de Alta Conversão</span>
                    <span className="text-purple-400 font-bold">Scroll 3D Interativo</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03. PILARES DA PLATAFORMA (SOBRE NÓS COM FOTOS DO NOSSO ECOSSISTEMA) ── */}
      <section id="about" className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto space-y-12">
        {/* Header da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[10px] font-mono uppercase tracking-[3px] text-purple-400 font-bold">
              SOBRE A PLATAFORMA
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Inteligência Territorial &amp; Engenharia de Conversão
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Unimos inteligência geoespacial, motores nativos de inteligência artificial e esteira comercial automatizada. Do mapeamento da cidade à entrega do site final, uma infraestrutura completa para faturar com serviços digitais.
            </p>
          </div>

          {/* Filtros em Pílula + Controles de Slide */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-zinc-300">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3.5 py-1.5 rounded-full transition-all ${activeFilter === "all" ? "bg-purple-600 text-white" : "hover:text-white"}`}
              >
                Radar OSINT 100km
              </button>
              <button
                onClick={() => setActiveFilter("builder")}
                className={`px-3.5 py-1.5 rounded-full transition-all ${activeFilter === "builder" ? "bg-purple-600 text-white" : "hover:text-white"}`}
              >
                Studio Builder IA
              </button>
              <button
                onClick={() => setActiveFilter("crm")}
                className={`px-3.5 py-1.5 rounded-full transition-all ${activeFilter === "crm" ? "bg-purple-600 text-white" : "hover:text-white"}`}
              >
                CRM &amp; WhatsApp
              </button>
            </div>

            {/* Setas de navegação */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : SHOWCASE_CARDS.length - 1))}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev < SHOWCASE_CARDS.length - 1 ? prev + 1 : 0))}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
                aria-label="Próximo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Large Showcase Cards com Fotos de Software e Tecnologia do Nosso Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHOWCASE_CARDS.map((card, idx) => {
            const Icon = card.badgeIcon;
            return (
              <div
                key={card.num}
                className="group relative rounded-[32px] overflow-hidden bg-[#0c0a18] border border-purple-500/20 shadow-xl transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_15px_40px_rgba(124,58,237,0.25)] flex flex-col justify-between min-h-[460px]"
              >
                {/* Imagem de Fundo com Escurecimento Editorial */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07050f] via-[#07050f]/65 to-black/30" />
                </div>

                {/* Topo do Card: Ícone + Número */}
                <div className="relative z-10 p-6 flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                    <Icon className="w-5 h-5 text-purple-300" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[11px] font-mono text-purple-200 font-bold">
                    {card.num}
                  </span>
                </div>

                {/* Base do Card: Textos e Título */}
                <div className="relative z-10 p-6 sm:p-8 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-[2px] text-purple-300 font-bold block">
                    {card.tag}
                  </span>
                  <h3 className="text-2xl font-black text-white group-hover:text-purple-200 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-zinc-300/90 leading-relaxed line-clamp-3">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 04. RESULTADOS & MÉTRICAS DA PLATAFORMA (TESTIMONIALS) ── */}
      <section id="testimonials" className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-transparent via-[#0d0922]/60 to-transparent">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          
          {/* Citação Monumental Centrada */}
          <div className="space-y-4">
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-normal text-white/90 leading-snug tracking-tight font-serif italic max-w-4xl mx-auto">
              “Em menos de 48 horas após disparar a primeira varredura no radar metropolitano, fechamos 4 contratos de reformulação de sites para clínicas locais. A plataforma se pagou no primeiro dia.”
            </blockquote>
            <span className="text-[10px] font-mono uppercase tracking-[3px] text-purple-400 font-bold block">
              ── RESULTADOS REAIS DE QUEM PROSPECTA COM CODEHARD ──
            </span>
          </div>

          {/* 3 Cartões de Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
            <div className="p-7 rounded-3xl bg-[#0e0924] border border-purple-500/20 shadow-xl space-y-2">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                100 km
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                raio metropolitano máximo de busca territorial sem pontos cegos em capitais e cidades vizinhas.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#0e0924] border border-purple-500/20 shadow-xl space-y-2">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                +500
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                empresas mapeadas por varredura com diagnóstico automático de presença web e contatos diretos.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#0e0924] border border-purple-500/20 shadow-xl space-y-2">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                100%
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                validação ativa de WhatsApp e telefones de tomadores de decisão com zero timeouts de conexão.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05. TECNOLOGIAS & MOTORES NATIVOS ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[3px] text-purple-400 font-bold">
            TECNOLOGIAS &amp; MOTORES
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Arquitetura Própria &amp; Motores Nativos
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Infraestrutura de ponta a ponta projetada para carregamento abaixo de 1 segundo, geoespacial sem latência e geração de código de alta fidelidade.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="p-5 rounded-2xl bg-[#0b0819] border border-purple-900/25 hover:border-purple-500/40 transition-all space-y-1.5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{tech.name}</span>
                <span className="text-purple-400 font-mono text-xs">{tech.icon}</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 06. MÓDULOS E RECURSOS DO SISTEMA (100% NOSSO SITE EM PORTUGUÊS) ── */}
      <section id="portfolio" className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[3px] text-purple-400 font-bold">
              RECURSOS &amp; MÓDULOS DO SISTEMA
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Sistemas &amp; Funcionalidades da Plataforma
            </h2>
          </div>
          <Link
            href="/app/design"
            className="text-xs font-semibold text-purple-300 hover:text-purple-200 flex items-center gap-1.5"
          >
            Acessar Acervo com 78 Referências de Design ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CASE_STUDIES.map((cs) => (
            <div
              key={cs.id}
              className="group rounded-[32px] overflow-hidden bg-[#0c0a18] border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              {/* Banner com Imagem Tecnológica do Módulo */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                <img
                  src={cs.image}
                  alt={cs.client}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a18] via-[#0c0a18]/50 to-transparent" />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold text-purple-300 uppercase">
                    {cs.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-zinc-300">
                    {cs.year}
                  </span>
                </div>
              </div>

              {/* Conteúdo Informativo do Sistema */}
              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white group-hover:text-purple-300 transition-colors">
                    {cs.client}
                  </h3>
                  <h4 className="text-sm font-bold text-purple-200">{cs.headline}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{cs.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <span className="text-xs font-mono text-emerald-400 font-bold">{cs.metrics}</span>
                  <Link
                    href={cs.link}
                    className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-500/40 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                  >
                    {cs.actionLabel} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 07. CONSOLE INTERATIVO DE DEMONSTRAÇÃO: RADAR OSINT ── */}
      <section id="demo" className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto space-y-6">
        <div className="p-8 sm:p-10 rounded-[36px] bg-[#0c0a18] border border-purple-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[2px] text-purple-400 font-bold">
                RADAR EM TEMPO REAL
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                Experimente a Varredura Territorial
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {Object.keys(DEMO_DATA).map((c) => (
                <button
                  key={c}
                  onClick={() => setCidadeDemo(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    cidadeDemo === c
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  {c.split(",")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Cards da Demonstração */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {leadsAtuais.map((l, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-[#130f26] border border-white/5 hover:border-purple-500/30 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">{l.nicho}</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">Score {l.score}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white truncate">{l.nome}</h4>
                  <span className="text-xs text-zinc-400">{l.bairro}</span>
                </div>
                <div className="text-[11px] text-amber-300/90 font-medium bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                  {l.diagnostico}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <span className="font-mono text-purple-300">{l.whatsapp}</span>
                  <button
                    onClick={() => handleCopyPhone(l.whatsapp)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white"
                    title="Copiar número"
                  >
                    {copiedPhone === l.whatsapp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
            <span className="text-xs text-zinc-400">
              Demonstração reduzida. A plataforma completa mapeia até 3.000 empresas por varredura com raio de até 100km.
            </span>
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              Liberar Varredura Completa ↗
            </Link>
          </div>
        </div>
      </section>

      {/* ── 08. RODAPÉ ARREDONDADO NO ESTILO LOROLABS (100% EM PORTUGUÊS) ── */}
      <footer id="contact" className="px-4 sm:px-6 lg:px-8 pb-12 pt-8">
        <div className="max-w-7xl mx-auto rounded-[36px] md:rounded-[44px] overflow-hidden bg-[#0d0822] border border-purple-500/25 p-8 sm:p-12 lg:p-16 space-y-12 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Coluna 1: Marca & Manifesto */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6d28d9] to-[#a855f7] flex items-center justify-center text-white font-black text-sm shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                  CH
                </div>
                <span className="text-xl font-black tracking-tight text-white">
                  CODEHARD<span className="text-purple-400">.</span>
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                Plataforma de inteligência territorial, geração instantânea de websites com IA e automação de prospecção comercial B2B. Do radar cartográfico ao fechamento do contrato.
              </p>

              {/* Pílulas de Mídias */}
              <div className="flex items-center gap-2 pt-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>

            {/* Coluna 2: Navegação Geral */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Navegação
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li><a href="#hero" className="hover:text-purple-300 transition-colors">Início</a></li>
                <li><a href="#about" className="hover:text-purple-300 transition-colors">Sobre a Plataforma</a></li>
                <li><a href="#portfolio" className="hover:text-purple-300 transition-colors">Módulos</a></li>
                <li><a href="#testimonials" className="hover:text-purple-300 transition-colors">Resultados</a></li>
                <li><a href="#demo" className="hover:text-purple-300 transition-colors">Demonstração</a></li>
                <li><Link href="/login" className="hover:text-purple-300 transition-colors">Acesso à Plataforma</Link></li>
              </ul>
            </div>

            {/* Coluna 3: Módulos & Recursos */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Módulos &amp; Recursos
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li><Link href="/app/mapa" className="hover:text-purple-300 transition-colors">Radar Cartográfico OSINT</Link></li>
                <li><Link href="/app/builder" className="hover:text-purple-300 transition-colors">Studio Builder de Landing Pages IA</Link></li>
                <li><Link href="/app/crm" className="hover:text-purple-300 transition-colors">CRM Kanban de Fechamento</Link></li>
                <li><Link href="/app/vendas" className="hover:text-purple-300 transition-colors">Disparador de WhatsApp Validado</Link></li>
                <li><Link href="/app/design" className="hover:text-purple-300 transition-colors">Biblioteca de Design (78+ Modelos)</Link></li>
                <li><Link href="/app/prompts" className="hover:text-purple-300 transition-colors">Central de Prompts de Elite</Link></li>
              </ul>
            </div>

            {/* Coluna 4: Contato & Suporte */}
            <div className="lg:col-span-3 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Contato &amp; Suporte
                </h4>
                <span className="text-[10px] font-mono uppercase tracking-[2px] text-zinc-500 block mt-0.5">
                  CENTRAL DE OPERAÇÕES CODEHARD
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>Av. Paulista, 1000 · São Paulo, Brasil</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <a href="tel:+5511999999999" className="hover:text-white transition-colors">+55 (11) 99999-9999</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <a href="mailto:suporte@codehard.com.br" className="hover:text-white transition-colors">suporte@codehard.com.br</a>
                </div>
              </div>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
              >
                Acessar Plataforma ↗
              </Link>
            </div>
          </div>

          {/* Barra Inferior com Manifesto e Copyright */}
          <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© 2026 CODEHARD Technologies. Todos os direitos reservados.</p>
            <p className="text-purple-200/60 italic font-serif">
              “Prospecção inteligente, design de alta fidelidade e fechamento previsível.”
            </p>
            <div className="flex items-center gap-4">
              <span className="hover:text-zinc-300 transition-colors cursor-pointer">Termos de Uso</span>
              <span className="hover:text-zinc-300 transition-colors cursor-pointer">Privacidade</span>
              <span className="hover:text-zinc-300 transition-colors cursor-pointer">Segurança</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
