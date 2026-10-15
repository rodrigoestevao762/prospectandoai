"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Search, Zap, Crosshair, Sparkles, Check, Phone,
  Globe, Shield, ChevronDown, Layers, Terminal, Compass, Eye,
  Play, Users, Building2, ExternalLink, Sliders, CheckCircle2,
  Copy, Lock, Palette, Kanban
} from "lucide-react";
import CodeHardLogo from "@/components/codemakers/CodeHardLogo";
import HardyMascot from "@/components/codemakers/HardyMascot";

const TICKER_ITEMS = [
  "RADAR GEOESPACIAL OSINT ATIVO",
  "VARREDURA METROPOLITANA ATÉ 100KM",
  "IDENTIFICAÇÃO DE EMPRESAS SEM SITE",
  "WHATSAPP VERIFICADO DE TOMADORES DE DECISÃO",
  "BIBLIOTECA COM ARQUIVOS DESIGN.MD PRONTOS",
  "CURADORIA AWWWARDS, DRIBBBLE & MOBBIN",
  "THREE.JS, GSAP & MOTION DESIGN SKILLS",
  "CRM KANBAN COM FUNIL PREVISÍVEL",
  "BUILDER DE SITES COM IA INTEGRADO",
  "ZERO GATEWAY TIMEOUT ENGINE"
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
  ],
  "Belo Horizonte, MG": [
    { nome: "Empório Minas Gerais", nicho: "Alimentação & Vinhos", bairro: "Savassi", diagnostico: "Sem Loja Própria / Catálogo", tipo: "danger", whatsapp: "(31) 98510-2200", score: 89 },
    { nome: "Clínica Dermatológica Savassi", nicho: "Saúde & Estética", bairro: "Lourdes", diagnostico: "Site sem Certificado SSL", tipo: "warning", whatsapp: "(31) 99230-1144", score: 91 },
  ]
};

export default function CodeHardLandingPage() {
  const [cidadeDemo, setCidadeDemo] = useState("São Paulo, SP");
  const [raioDemo, setRaioDemo] = useState("10 km");
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [faqAberto, setFaqAberto] = useState<number | null>(null);

  const leadsAtuais = DEMO_DATA[cidadeDemo] || DEMO_DATA["São Paulo, SP"];

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <div className="bg-[#07050f] min-h-screen text-white font-sans selection:bg-[#7c3aed] selection:text-white overflow-x-hidden">
      {/* ── 3D AMBIENT LIGHTING & PURPLE MESH ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[650px] bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.22)_0%,rgba(76,29,149,0.08)_50%,transparent_75%)] blur-3xl" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
      </div>

      {/* ── FLOATING PILL NAVBAR COM BLUR DE VIDRO LAPIDADO ── */}
      <nav className="fixed top-4 inset-x-0 z-50 px-4">
        <div className="mx-auto max-w-6xl rounded-2xl border border-purple-500/20 bg-[#0c0a18]/85 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/">
            <CodeHardLogo size="md" showWordmark={true} />
          </Link>

          {/* Links Centrais */}
          <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
            {[
              { label: "A proposta", href: "#proposta" },
              { label: "Recursos", href: "#recursos" },
              { label: "Radar OSINT", href: "#radar" },
              { label: "Design Lab", href: "#design" },
              { label: "Planos", href: "#planos" },
              { label: "Dúvidas", href: "#faq" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Botão de Acesso à Plataforma */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-[10px] font-mono text-purple-300 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
              <span>AO VIVO</span>
            </div>

            <Link
              href="/app"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#9333ea] text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
            >
              Acessar plataforma <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION: 3D CYBERNETIC STRUCTURE & MONUMENTAL TYPOGRAPHY ── */}
      <section className="relative pt-36 pb-20 px-4 sm:px-6 z-10 flex flex-col items-center text-center">
        {/* Giant Metallic Background Typography */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 font-black text-[120px] sm:text-[200px] lg:text-[280px] tracking-tighter text-white/[0.02] pointer-events-none select-none font-mono">
          CODEHARD
        </div>

        {/* Mascot Hardy Hero Floating */}
        <div className="w-48 sm:w-64 h-48 sm:h-64 mb-4">
          <HardyMascot variant="radar" className="w-full h-full" />
        </div>

        {/* Badge de Destaque */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#180e33] border border-purple-500/40 text-purple-300 text-xs font-mono font-bold mb-6 shadow-[0_0_20px_rgba(124,58,237,0.25)]">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>ECOSSISTEMA DEFINITIVO PARA OPERAÇÕES DIGITAIS</span>
        </div>

        {/* Headline Principal */}
        <h1 className="max-w-4xl text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6">
          Crie sites surreais, encontre clientes com déficit digital e{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#7c3aed]">
            feche contratos de alto valor.
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="max-w-2xl text-xs sm:text-base text-zinc-300 leading-relaxed mb-8">
          A plataforma unificada que conecta varredura territorial OSINT em raio de até 100km, biblioteca de identidades com DESIGN.md pronto, CRM Kanban e construtor com IA em um só ecossistema.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            href="/app"
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#9333ea] text-white text-sm font-bold flex items-center gap-2 shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 transition-all cursor-pointer"
          >
            Iniciar Varredura Gratuita <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#radar"
            className="px-6 py-3.5 rounded-2xl bg-[#0c0a18] hover:bg-[#150f28] border border-purple-500/30 text-white text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Crosshair className="w-4 h-4 text-purple-400" /> Ver Demonstração do Radar
          </a>
        </div>

        {/* 4 Métricas Cards no Hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl w-full text-left">
          <div className="p-4 rounded-2xl bg-[#0c0a18]/90 border border-purple-900/30 shadow-xl">
            <span className="text-[10px] uppercase font-mono text-zinc-500 block">Raio Máximo</span>
            <span className="text-2xl font-black font-mono text-white mt-1 block">100 km</span>
            <span className="text-[11px] text-purple-300">Cobertura metropolitana</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c0a18]/90 border border-purple-900/30 shadow-xl">
            <span className="text-[10px] uppercase font-mono text-zinc-500 block">Saldo no Elite</span>
            <span className="text-2xl font-black font-mono text-purple-400 mt-1 block">7.000</span>
            <span className="text-[11px] text-zinc-400">Créditos mensais</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c0a18]/90 border border-purple-900/30 shadow-xl">
            <span className="text-[10px] uppercase font-mono text-zinc-500 block">Satélites</span>
            <span className="text-2xl font-black font-mono text-emerald-400 mt-1 block">Zero</span>
            <span className="text-[11px] text-zinc-400">Timeouts de busca</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c0a18]/90 border border-purple-900/30 shadow-xl">
            <span className="text-[10px] uppercase font-mono text-zinc-500 block">Decisores</span>
            <span className="text-2xl font-black font-mono text-white mt-1 block">WhatsApp</span>
            <span className="text-[11px] text-purple-300">Contato direto validado</span>
          </div>
        </div>
      </section>

      {/* ── TICKER STRIP DE CAPACIDADES ── */}
      <div className="relative overflow-hidden border-y border-purple-900/30 bg-[#080512] py-3 select-none">
        <div className="flex gap-0 animate-[marquee_28s_linear_infinite] w-max">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-6 px-6 font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span className="hover:text-purple-300 transition-colors">{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── SEÇÃO 01: A PROPOSTA (OS 4 PILARES) ── */}
      <section id="proposta" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">
            01 / ARQUITETURA OPERACIONAL
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            A esteira completa de fechamento digital.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Você não precisa de 10 ferramentas desconectadas. O CODEHARD centraliza todas as etapas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              num: "01",
              title: "Prospecção Territorial",
              desc: "Mapeie em minutos empresas locais sem site ou com páginas inoperantes em qualquer bairro ou cidade.",
              icon: Crosshair,
            },
            {
              num: "02",
              title: "Design Lab Curado",
              desc: "Acesse referências premiadas no Awwwards, Dribbble e Mobbin com DESIGN.md prontos para download.",
              icon: Palette,
            },
            {
              num: "03",
              title: "Engenharia de Prompts",
              desc: "Gere instruções de código de altíssima fidelidade testadas para o v0, Claude 3.7 e ChatGPT.",
              icon: Sparkles,
            },
            {
              num: "04",
              title: "Pipeline Comercial",
              desc: "Organize seus contatos em um CRM Kanban visual e controle métricas financeiras de cada contrato.",
              icon: Kanban,
            },
          ].map((item) => (
            <div
              key={item.num}
              className="p-6 rounded-3xl bg-[#0c0a18] border border-purple-900/25 hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  {item.num}
                </span>
                <item.icon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">{item.title}</h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEÇÃO 02: RADAR INTERATIVO DEMO CONSOLE ── */}
      <section id="radar" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
        <div className="p-6 md:p-10 rounded-3xl bg-gradient-to-br from-[#120a28] via-[#0c0819] to-[#07050f] border border-purple-500/30 shadow-[0_0_50px_rgba(124,58,237,0.25)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                RADAR EM TEMPO REAL · CONSOLE DE TESTE
              </span>
              <h2 className="text-2xl font-black text-white mt-0.5">
                Simule uma varredura de satélite agora.
              </h2>
            </div>

            {/* City Selector */}
            <div className="flex items-center gap-2">
              {Object.keys(DEMO_DATA).map((city) => (
                <button
                  key={city}
                  onClick={() => setCidadeDemo(city)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    cidadeDemo === city
                      ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                      : "bg-[#16102e] text-zinc-400 hover:text-white"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Results Table Demo */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-zinc-500 font-mono text-[10px] uppercase">
                  <th className="py-3 px-4">Empresa & Nicho</th>
                  <th className="py-3 px-4">Bairro</th>
                  <th className="py-3 px-4">Déficit Digital Detectado</th>
                  <th className="py-3 px-4">Contato Validado</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {leadsAtuais.map((lead) => (
                  <tr key={lead.nome} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white text-sm block">{lead.nome}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">{lead.nicho}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-400">{lead.bairro}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                        {lead.diagnostico}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-300">{lead.whatsapp}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleCopyPhone(lead.whatsapp)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-400/40 text-white font-semibold text-xs transition-colors cursor-pointer"
                      >
                        {copiedPhone === lead.whatsapp ? "Copiado!" : "Copiar WhatsApp"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
            <span>Deseja varrer toda a sua cidade sem limites?</span>
            <Link href="/app" className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1">
              Abrir Code Hunter Completo ➔
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 03: DESIGN LAB SHOWCASE COM AWWWARDS / DRIBBBLE ── */}
      <section id="design" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
              CURADORIA INTERNACIONAL
            </span>
            <h2 className="text-3xl font-black text-white mt-1">
              Design Lab com identidades de alta fidelidade.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-lg">
              Referências selecionadas do Dribbble, Awwwards, Mobbin e Land-Book prontas com tokens e arquivos DESIGN.md.
            </p>
          </div>

          <Link
            href="/app/design"
            className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-400/40 text-white text-xs font-bold transition-colors"
          >
            Ver acervo de referências curadas ➔
          </Link>
        </div>

        {/* 3 Reference Cards Preview com Fotos Reais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Aether Void — Neural Cloud & Spatial",
              platform: "Awwwards",
              img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
              category: "Tree.js Skills",
              nicho: "SaaS & AI"
            },
            {
              title: "Aura Dental — Odontologia Estética VIP",
              platform: "Land-Book",
              img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
              category: "Design DNA",
              nicho: "Saúde & Clínicas"
            },
            {
              title: "Kuro Omakase — Gastronomia Contemporânea",
              platform: "Awwwards",
              img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
              category: "Gsap Skill",
              nicho: "Alta Cozinha"
            }
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] bg-[#0c0a18] border border-purple-900/30 overflow-hidden shadow-xl group hover:border-purple-500/50 transition-all flex flex-col justify-between"
            >
              <div className="h-48 w-full relative overflow-hidden bg-[#150f28]">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[9px] font-mono font-bold text-white border border-white/10">
                  {item.platform}
                </span>
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-purple-600/80 backdrop-blur-md text-[9px] font-mono font-bold text-white">
                  {item.nicho}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-mono text-purple-400 font-bold">{item.category}</span>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEÇÃO 04: PLANOS & ACESSO ── */}
      <section id="planos" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">
            04 / PLANOS DE ACESSO
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Escolha seu nível dentro da CODEHARD.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Member */}
          <div className="p-6 md:p-8 rounded-3xl bg-[#0c0a18] border border-purple-900/25 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">01 / ENTRADA</span>
              <h3 className="text-xl font-bold text-white">Code Member</h3>
              <p className="text-xs text-zinc-400">Sua base para gerenciar clientes e portfólio digital.</p>
              <div className="text-2xl font-black text-white font-mono">Gratuito</div>
              <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs text-zinc-300">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Dashboard e clientes</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> CRM Kanban</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Portfólio de sites</div>
              </div>
            </div>
            <Link href="/app" className="w-full py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs font-bold text-center block hover:bg-white/10 transition-colors">
              Acessar Gratuitamente
            </Link>
          </div>

          {/* Creator */}
          <div className="p-6 md:p-8 rounded-3xl bg-[#0c0a18] border border-purple-900/25 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">02 / CRIAÇÃO</span>
              <h3 className="text-xl font-bold text-white">Code Creator</h3>
              <p className="text-xs text-zinc-400">Conhecimento aplicado para construir e entregar sites de luxo.</p>
              <div className="text-2xl font-black text-white font-mono">R$ 19,90<span className="text-xs text-zinc-500 font-normal">/mês</span></div>
              <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs text-zinc-300">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Tudo do Code Member</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Code Play (Todas as aulas)</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Code Design (24 referências)</div>
              </div>
            </div>
            <Link href="/app/planos" className="w-full py-3 rounded-xl bg-[#140f28] hover:bg-[#1a1435] border border-white/10 text-white text-xs font-bold text-center block transition-colors">
              Assinar Creator
            </Link>
          </div>

          {/* Elite */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-[#180e33] to-[#0c0a18] border border-purple-500/50 flex flex-col justify-between space-y-6 relative shadow-[0_0_40px_rgba(124,58,237,0.3)]">
            <div className="absolute top-0 right-6 px-3 py-1 rounded-b-xl bg-purple-600 text-white text-[9px] font-mono font-bold tracking-wider">
              MAIS ESCOLHIDO
            </div>
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold">03 / ELITE VIP</span>
              <h3 className="text-xl font-bold text-white">Code Elite</h3>
              <p className="text-xs text-zinc-400">Acesso integral à operação comercial e à prospecção por satélite.</p>
              <div className="text-2xl font-black text-white font-mono">R$ 47,20<span className="text-xs text-zinc-500 font-normal">/mês</span></div>
              <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs text-zinc-300">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Tudo do Code Creator</div>
                <div className="flex items-center gap-2 text-purple-200 font-semibold"><Check className="w-4 h-4 text-purple-400" /> 7.000 créditos de prospecção</div>
                <div className="flex items-center gap-2 text-purple-200 font-semibold"><Check className="w-4 h-4 text-purple-400" /> Até 700 créditos por dia</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Gerador de Prompts com IA</div>
              </div>
            </div>
            <Link href="/app/planos" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] text-white text-xs font-bold text-center block shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              Fazer Upgrade para Elite ➔
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 05: DÚVIDAS FREQUENTES (FAQ) ── */}
      <section id="faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">
            TIRE SUAS DÚVIDAS
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">Perguntas Frequentes</h2>
        </div>

        {[
          {
            q: "Como o Code Hunter encontra empresas sem site?",
            a: "O motor OSINT do CODEHARD consulta dados geoespaciais em tempo real em um raio de até 100km. Nosso algoritmo analisa o cadastro da empresa, verifica DNS, certificados SSL e redes sociais para diagnosticar empresas ativas que não possuem presença digital própria."
          },
          {
            q: "Os dados de WhatsApp são verificados?",
            a: "Sim. A plataforma extrai e valida números cadastrados comercialmente pelos tomadores de decisão, garantindo alta taxa de entrega e resposta para abordagens consultivas."
          },
          {
            q: "O que são os arquivos DESIGN.md da biblioteca?",
            a: "São especificações de arquitetura visual, tokens de cores, tipografia, efeitos e diretrizes de layout prontos para serem colados no Claude 3.7, ChatGPT ou v0, gerando páginas de alta fidelidade instantaneamente."
          },
          {
            q: "Posso cancelar minha assinatura a qualquer momento?",
            a: "Sim, sem qualquer carência ou fidelidade. O cancelamento pode ser feito com 1 clique direto no painel de configurações."
          }
        ].map((faq, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#0c0a18] border border-purple-900/25 overflow-hidden transition-all"
          >
            <button
              onClick={() => setFaqAberto(faqAberto === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-purple-300 transition-colors cursor-pointer"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${faqAberto === idx ? "rotate-180 text-purple-400" : "text-zinc-500"}`} />
            </button>
            {faqAberto === idx && (
              <div className="p-5 pt-0 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.04]">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* ── FOOTER ELEGANTE CODEHARD ── */}
      <footer className="py-12 border-t border-purple-900/30 bg-[#06040d] px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
          <CodeHardLogo size="sm" showWordmark={true} />

          <div className="flex items-center gap-6 text-xs font-mono">
            <a href="#proposta" className="hover:text-white transition-colors">A Proposta</a>
            <a href="#radar" className="hover:text-white transition-colors">Radar OSINT</a>
            <a href="#design" className="hover:text-white transition-colors">Design Lab</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
          </div>

          <div className="text-[11px] font-mono">
            © 2026 CODEHARD Inc. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
