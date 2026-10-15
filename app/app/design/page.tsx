"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Palette, Copy, Check, ExternalLink, Download, Sparkles, Layers,
  ArrowUpRight, Search, ChevronDown, SlidersHorizontal, Eye, X,
  Compass, Globe, Smartphone, Monitor, Shield, Filter, Star
} from "lucide-react";
import HardyMascot from "@/components/codemakers/HardyMascot";

export interface DesignReference {
  id: string;
  refNumber: string;
  titulo: string;
  plataforma: "Awwwards" | "Dribbble" | "Mobbin" | "Land-Book" | "Behance" | "Pinterest";
  categoria: "Tree.js Skills" | "Gsap Skill" | "Design DNA" | "Motion Design Skill" | "Genjutsu" | "Bento Grid" | "WebGL Spatial";
  nicho: string;
  estiloVisual: string;
  tipoSite: "Landing Page" | "Web App" | "Dashboard" | "E-commerce" | "Portfólio" | "Mobile App";
  imagemUrl: string;
  tags: string[];
  score: number;
  designMd: string;
}

export const MASSIVE_DESIGN_REFERENCES: DesignReference[] = [
  // ── 01. SAAS & INTELIGÊNCIA ARTIFICIAL ──
  {
    id: "ref-01",
    refNumber: "Ref #001",
    titulo: "Aether Void — Neural Cloud & Spatial Compute",
    plataforma: "Awwwards",
    categoria: "Tree.js Skills",
    nicho: "SaaS & AI",
    estiloVisual: "Cyberpunk Obsidian",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    tags: ["Three.js", "WebGL", "Spatial Computing", "Shader GLSL"],
    score: 98,
    designMd: `# DESIGN.md — Aether Void (Three.js Spatial)
## 1. PALETA CROMÁTICA & TOKENS
- Void Deep: #05030a
- Surface Obsidian: #0c0819
- Primary Accent: #7c3aed (Violet Neon)
- Core Node: #c084fc
- Glow Filter: 0 0 35px rgba(124, 58, 237, 0.45)

## 2. ARQUITETURA THREE.JS
- Canvas integrado via React Three Fiber (@react-three/fiber).
- Campo nodal de 3.000 partículas com rotação inercial via GSAP Lerp.
- Tipografia: Monument Extended + JetBrains Mono com tracking alargado.`
  },
  {
    id: "ref-02",
    refNumber: "Ref #002",
    titulo: "Synthetix Engine — Deep Learning Terminal",
    plataforma: "Dribbble",
    categoria: "Genjutsu",
    nicho: "SaaS & AI",
    estiloVisual: "Dark Bento Glass",
    tipoSite: "Dashboard",
    imagemUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Bento Grid", "Genjutsu", "Titanium Glass", "Telemetry"],
    score: 96,
    designMd: `# DESIGN.md — Synthetix Engine Dashboard
## 1. HIERARQUIA VISUAL
- Painel modular Bento com bordas de 1px com gradiente translúcido (white/10 -> purple-500/30).
- Efeito de profundidade com backdrop-filter: blur(28px).
- Indicadores numéricos em tempo real com micro-gráficos Sparklines.`
  },

  // ── 02. SAÚDE, CLÍNICAS & ODONTOLOGIA DE LUXO ──
  {
    id: "ref-03",
    refNumber: "Ref #003",
    titulo: "Aura Dental Institute — Odontologia Estética & Implantes",
    plataforma: "Land-Book",
    categoria: "Design DNA",
    nicho: "Saúde & Clínicas",
    estiloVisual: "White Pearl & Titanium",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    tags: ["Clínica Odonto", "Luxury Pearl", "Agendamento VIP", "Antes e Depois"],
    score: 97,
    designMd: `# DESIGN.md — Aura Dental Institute
## 1. DIRETRIZES DO NICHO
- Foco em procedimentos de alto ticket: Lentes de Resina, Harmonização Orofacial e Implantes Guiados.
- Seletor interativo "Antes / Depois" com slider tátil.
- Botão flutuante de agendamento VIP direto para WhatsApp da concierge da clínica.`
  },
  {
    id: "ref-04",
    refNumber: "Ref #004",
    titulo: "Helios Longevity Center — Medicina Integrativa & Performance",
    plataforma: "Mobbin",
    categoria: "Motion Design Skill",
    nicho: "Saúde & Clínicas",
    estiloVisual: "Obsidian Health Tech",
    tipoSite: "Web App",
    imagemUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    tags: ["Medicina Preventiva", "Telemetria Biométrica", "Mobile VIP", "Concierge"],
    score: 95,
    designMd: `# DESIGN.md — Helios Longevity Center
## 1. EXPERIÊNCIA DO PACIENTE
- Visual escuro com gradientes suaves de roxo ametista transmitindo rigor científico e sofisticação.
- Dashboard de acompanhamento de biomarcadores e agendamento de infusões vitamínicas.`
  },

  // ── 03. GASTRONOMIA, RESTAURANTES & ALTA COZINHA ──
  {
    id: "ref-05",
    refNumber: "Ref #005",
    titulo: "Kuro Omakase — Gastronomia Japonesa Contemporânea",
    plataforma: "Awwwards",
    categoria: "Gsap Skill",
    nicho: "Gastronomia & Restaurantes",
    estiloVisual: "Wabi-Sabi Dark",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
    tags: ["Omakase", "GSAP Scroll", "Cardápio Degustação", "Reserva Online"],
    score: 99,
    designMd: `# DESIGN.md — Kuro Omakase
## 1. STORYTELLING CINEMÁTICO
- Hero imersivo com vídeo em background a 60fps dos cortes artesanais dos peixes.
- Transições de prato com GSAP ScrollTrigger e áudio espacial sutil ao folhear o cardápio.
- Sistema de reservas integrado com confirmação instantânea via WhatsApp.`
  },
  {
    id: "ref-06",
    refNumber: "Ref #006",
    titulo: "Bella Vista Trattoria — Cantina Gourmet & Enoteca",
    plataforma: "Behance",
    categoria: "Design DNA",
    nicho: "Gastronomia & Restaurantes",
    estiloVisual: "Vintage Toscana Luxo",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    tags: ["Culinária Italiana", "Carta de Vinhos", "Mesa VIP", "Delivery Próprio"],
    score: 94,
    designMd: `# DESIGN.md — Bella Vista Trattoria
## 1. OBJETIVO DE CONVERSÃO
- Eliminar dependência do iFood com cardápio digital próprio sem comissões.
- Galeria de massas artesanais com zoom de alta resolução e harmonização de vinhos.`
  },

  // ── 04. ADVOCACIA & BANCAS JURÍDICAS DE ELITE ──
  {
    id: "ref-07",
    refNumber: "Ref #007",
    titulo: "Valença & Partners — Advocacia Tributária & Fusões",
    plataforma: "Dribbble",
    categoria: "Genjutsu",
    nicho: "Advocacia & Jurídico",
    estiloVisual: "Swiss Navy & Titanium",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    tags: ["Direito Tributário", "Corporate M&A", "Autoridade Jurídica", "Bento Grid"],
    score: 97,
    designMd: `# DESIGN.md — Valença & Partners Law
## 1. AUTORIDADE & CREDIBILIDADE
- Cores sólidas de alta sobriedade: Azul Marinho Grafite (#090c15) e detalhes em Platina (#e2e8f0).
- Casos de sucesso com contadores de bilhões de reais economizados aos clientes.
- Canal exclusivo de consulta sigilosa para diretores e CEOs.`
  },
  {
    id: "ref-08",
    refNumber: "Ref #008",
    titulo: "Lexis Wealth Protection — Proteção Patrimonial Familiar",
    plataforma: "Pinterest",
    categoria: "Design DNA",
    nicho: "Advocacia & Jurídico",
    estiloVisual: "Black Velvet Minimal",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    tags: ["Holding Familiar", "Sucessão", "Planejamento Tributário", "Sigilo"],
    score: 93,
    designMd: `# DESIGN.md — Lexis Wealth Protection
## 1. ESTRUTURA NARRATIVA
- Foco em segurança patrimonial de famílias de empresários e agropecuaristas.
- Simulador interativo de economia sucessória.`
  },

  // ── 05. IMOBILIÁRIAS & EMPREENDIMENTOS DE ALTO PADRÃO ──
  {
    id: "ref-09",
    refNumber: "Ref #009",
    titulo: "Vértice Penthouse Collection — Imóveis Exclusivos",
    plataforma: "Awwwards",
    categoria: "Tree.js Skills",
    nicho: "Imóveis & Arquitetura",
    estiloVisual: "Architectural Noir",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    tags: ["Mansões de Luxo", "Tour 3D WebGL", "Plantas Humanizadas", "Concierge"],
    score: 98,
    designMd: `# DESIGN.md — Vértice Penthouse Collection
## 1. RECURSOS WEBGL
- Modelo 3D interativo do edifício com seleção de pavimentos e visualização 360 da vista da varanda.
- Filtro por metragem, suítes e valor de investimento.
- Atendimento prioritário para corretores de luxo credenciados.`
  },
  {
    id: "ref-10",
    refNumber: "Ref #010",
    titulo: "Studio Arch & Living — Design de Interiores e Retrofit",
    plataforma: "Land-Book",
    categoria: "Gsap Skill",
    nicho: "Imóveis & Arquitetura",
    estiloVisual: "Minimal Bauhaus",
    tipoSite: "Portfólio",
    imagemUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    tags: ["Arquitetura", "Design de Interiores", "Galeria Parallax", "Catálogo"],
    score: 96,
    designMd: `# DESIGN.md — Studio Arch & Living
## 1. DESIGN VISUAL
- Tipografia serifada moderna combinada com sans neo-grotesque.
- Grid assimétrico com transições suaves de imagem via Lenis Scroll.`
  },

  // ── 06. E-COMMERCE DE LUXO & JOALHERIA ──
  {
    id: "ref-11",
    refNumber: "Ref #011",
    titulo: "Chronos Haute Horlogerie — Relógios Suíços & Alta Joalheria",
    plataforma: "Awwwards",
    categoria: "WebGL Spatial",
    nicho: "E-commerce & Luxo",
    estiloVisual: "Diamond Obsidian",
    tipoSite: "E-commerce",
    imagemUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    tags: ["Joalheria", "WebGL 3D Viewer", "Checkout One-Click", "Autenticidade"],
    score: 99,
    designMd: `# DESIGN.md — Chronos Haute Horlogerie
## 1. VISUALIZADOR 3D DO PRODUTO
- Rotação livre em 3D da caixa do relógio com iluminação reflexiva em tempo real.
- Detalhes microscópicos do mostrador e movimento do turbilhão suíço.
- Checkout seguro de alta fidelidade com garantia de autenticidade NFT.`
  },
  {
    id: "ref-12",
    refNumber: "Ref #012",
    titulo: "Maison Privée — Perfumaria de Nicho & Aromas Artesanais",
    plataforma: "Mobbin",
    categoria: "Motion Design Skill",
    nicho: "E-commerce & Luxo",
    estiloVisual: "Golden Velvet Dark",
    tipoSite: "E-commerce",
    imagemUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80",
    tags: ["Perfumaria", "Mobile Commerce", "Notas Olfativas", "Clube de Assinatura"],
    score: 95,
    designMd: `# DESIGN.md — Maison Privée
## 1. CONVERSÃO MOBILE
- Experiência otimizada para compras rápidas no smartphone.
- Pirâmide olfativa interativa revelando notas de topo, coração e base.`
  },

  // ── 07. FINTECHS, CRIPTO & PRIVATE BANKING ──
  {
    id: "ref-13",
    refNumber: "Ref #013",
    titulo: "Vortex Capital — Hedge Fund & Algorithmic Trading",
    plataforma: "Dribbble",
    categoria: "Genjutsu",
    nicho: "Fintech & Finanças",
    estiloVisual: "Cybertruck Obsidian",
    tipoSite: "Web App",
    imagemUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80",
    tags: ["Trading", "Algoritmos", "Fintech", "Telemetria Financeira"],
    score: 98,
    designMd: `# DESIGN.md — Vortex Capital
## 1. ESTÉTICA TESLA / CYBERTRUCK
- Gráficos vetoriais de rendimento em verde neon e roxo elétrico.
- Cards em titânio fosco com cantos chanfrados e micro-bordas de luz.`
  },
  {
    id: "ref-14",
    refNumber: "Ref #014",
    titulo: "Zenith Family Office — Gestão de Fortuna e Investimentos Globais",
    plataforma: "Behance",
    categoria: "Design DNA",
    nicho: "Fintech & Finanças",
    estiloVisual: "Midnight Luxury",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    tags: ["Family Office", "Offshores", "Gestão de Ativos", "Alta Renda"],
    score: 96,
    designMd: `# DESIGN.md — Zenith Family Office
## 1. DIRETRIZES INSTITUCIONAIS
- Comunicação reservada e discreta para investidores qualificados (> R$ 10 milhões).
- Relatórios trimestrais com download criptografado via chave biométrica.`
  },

  // ── 08. AUTOMOTIVO, SUPERCARROS & CONCESSIONÁRIAS EXÓTICAS ──
  {
    id: "ref-15",
    refNumber: "Ref #015",
    titulo: "Apex Exotic Motors — Concessionária de Superesportivos",
    plataforma: "Awwwards",
    categoria: "Tree.js Skills",
    nicho: "Automotivo & Frotas",
    estiloVisual: "Carbon Fiber & Neon",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
    tags: ["Ferrari", "Porsche", "Configurador 3D", "Estoque VIP"],
    score: 99,
    designMd: `# DESIGN.md — Apex Exotic Motors
## 1. APRESENTAÇÃO DE VEÍCULOS
- Configurador de cores e rodas de supercarros com renderização WebGL.
- Gravação de ronco do motor em áudio FLAC integrado ao scroll.`
  },
  {
    id: "ref-16",
    refNumber: "Ref #016",
    titulo: "Precision Auto Detail & Blindagem — Estética Automotiva",
    plataforma: "Pinterest",
    categoria: "Bento Grid",
    nicho: "Automotivo & Frotas",
    estiloVisual: "Dark Workshop Tech",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    tags: ["Ceramic Pro", "PPF", "Blindagem Nível III-A", "Agendamento VIP"],
    score: 94,
    designMd: `# DESIGN.md — Precision Auto Detail
## 1. PROPOSTA DE VALOR
- Tabela de pacotes de proteção de pintura e higienização técnica com botão WhatsApp.`
  },

  // ── 09. FITNESS, ACADEMIAS & CENTROS DE ALTA PERFORMANCE ──
  {
    id: "ref-17",
    refNumber: "Ref #017",
    titulo: "Iron Vault Performance — Centro de Treinamento Olímpico & CrossFit",
    plataforma: "Dribbble",
    categoria: "Gsap Skill",
    nicho: "Fitness & Performance",
    estiloVisual: "Industrial Brutalism",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    tags: ["CrossFit", "Alta Performance", "Grade de Aulas", "Passe Livre"],
    score: 95,
    designMd: `# DESIGN.md — Iron Vault Performance
## 1. ESTÉTICA DE FORÇA
- Tipografia condensada impactante e fotografias em alto contraste preto & branco.`
  },
  {
    id: "ref-18",
    refNumber: "Ref #018",
    titulo: "Lumina Yoga & Recovery Lounge — Bem-Estar & Biohacking",
    plataforma: "Land-Book",
    categoria: "Motion Design Skill",
    nicho: "Fitness & Performance",
    estiloVisual: "Zen Glassmorphism",
    tipoSite: "Web App",
    imagemUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80",
    tags: ["Yoga", "Sauna Infravermelha", "Biohacking", "Assinatura Mensal"],
    score: 96,
    designMd: `# DESIGN.md — Lumina Yoga & Recovery
## 1. EXPERIÊNCIA SENSORIAL
- Tons calmantes de lilás nébula e animações de respiração guiada no Hero.`
  },

  // ── 10. MODA, STREETWEAR & LUXO FASHION ──
  {
    id: "ref-19",
    refNumber: "Ref #019",
    titulo: "Obsidian Atelier — Streetwear Couture & Edições Limitadas",
    plataforma: "Awwwards",
    categoria: "Genjutsu",
    nicho: "Moda & Joalheria",
    estiloVisual: "Tokyo Cyber Street",
    tipoSite: "E-commerce",
    imagemUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Streetwear", "Drop Limitado", "Lookbook 3D", "Moda Luxo"],
    score: 98,
    designMd: `# DESIGN.md — Obsidian Atelier
## 1. SISTEMA DE DROPS
- Contador regressivo para lançamentos com lista de espera exclusiva via SMS/WhatsApp.`
  },
  {
    id: "ref-20",
    refNumber: "Ref #020",
    titulo: "Sartoria Milanesa — Alfaiataria Sob Medida & Ternos Italianos",
    plataforma: "Behance",
    categoria: "Design DNA",
    nicho: "Moda & Joalheria",
    estiloVisual: "Classic Italian Elegance",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
    tags: ["Alfaiataria", "Tecidos Ingleses", "Agendamento com o Mestre", "Sob Medida"],
    score: 95,
    designMd: `# DESIGN.md — Sartoria Milanesa
## 1. SERVIÇO SOB MEDIDA
- Demonstração do processo artesanal de mais de 40 horas de costura por paletó.`
  },

  // ── 11. EDUCAÇÃO, EDTECHS & CURSOS EXECUTIVOS ──
  {
    id: "ref-21",
    refNumber: "Ref #021",
    titulo: "CodeHard Academy — Formação Fullstack com IA & Engenharia de Prompts",
    plataforma: "Dribbble",
    categoria: "Tree.js Skills",
    nicho: "Educação & EdTech",
    estiloVisual: "Cyber Academy Obsidian",
    tipoSite: "Web App",
    imagemUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    tags: ["EdTech", "Plataforma de Aulas", "Comunidade VIP", "Gamificação"],
    score: 99,
    designMd: `# DESIGN.md — CodeHard Academy
## 1. INTERFACE DE APRENDIZADO
- Player de vídeo com notas sincronizadas, transcrição em tempo real e download de repositórios.`
  },
  {
    id: "ref-22",
    refNumber: "Ref #022",
    titulo: "Vanguard Executive MBA — Liderança & Governança de Inteligência Artificial",
    plataforma: "Mobbin",
    categoria: "Design DNA",
    nicho: "Educação & EdTech",
    estiloVisual: "Ivy League Minimal",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    tags: ["MBA Executivo", "C-Level", "Inscrição Seletiva", "Diploma Internacional"],
    score: 96,
    designMd: `# DESIGN.md — Vanguard Executive MBA
## 1. PROCESSO SELETIVO
- Formulário de triagem de currículo com envio de LinkedIn e agendamento de entrevista.`
  },

  // ── 12. BARBEARIAS & ESTÉTICA MASCULINA PREMIUM ──
  {
    id: "ref-23",
    refNumber: "Ref #023",
    titulo: "The Royal Barber Club — Navalha, Charutaria & Lounge",
    plataforma: "Pinterest",
    categoria: "Bento Grid",
    nicho: "Beleza & Estética",
    estiloVisual: "Vintage Leather & Gold",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
    tags: ["Barbearia VIP", "Agendamento Online", "Clube do Bigode", "Corte e Barba"],
    score: 95,
    designMd: `# DESIGN.md — The Royal Barber Club
## 1. AGENDAMENTO SEM ATRASO
- Seleção de barbeiro preferido, horário em tempo real e pagamento antecipado.`
  },
  {
    id: "ref-24",
    refNumber: "Ref #024",
    titulo: "Dermoclinique Estética Avançada — Harmonização e Laser",
    plataforma: "Land-Book",
    categoria: "Motion Design Skill",
    nicho: "Beleza & Estética",
    estiloVisual: "Soft Rose Glass",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
    tags: ["Harmonização", "Laser CO2", "Protocolos Faciais", "Avaliação Gratuita"],
    score: 94,
    designMd: `# DESIGN.md — Dermoclinique Estética
## 1. FUNIL DE ATENDIMENTO
- Questionário diagnóstico de pele em 3 perguntas direcionando para WhatsApp da biomédica.`
  }
];

export default function CodeHardDesignPage() {
  const [selectedRef, setSelectedRef] = useState<DesignReference | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlataforma, setSelectedPlataforma] = useState<string>("Todas");
  const [selectedNicho, setSelectedNicho] = useState<string>("Todos");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("Todas");
  const [selectedTipoSite, setSelectedTipoSite] = useState<string>("Todos");

  // Plataformas disponíveis com contadores
  const plataformas = ["Todas", "Awwwards", "Dribbble", "Mobbin", "Land-Book", "Behance", "Pinterest"];
  const nichos = useMemo(() => ["Todos", ...Array.from(new Set(MASSIVE_DESIGN_REFERENCES.map(r => r.nicho)))], []);
  const categorias = ["Todas", "Tree.js Skills", "Gsap Skill", "Design DNA", "Motion Design Skill", "Genjutsu", "Bento Grid", "WebGL Spatial"];
  const tiposSite = ["Todos", "Landing Page", "Web App", "Dashboard", "E-commerce", "Portfólio"];

  // Filtragem Dinâmica
  const filteredReferences = useMemo(() => {
    return MASSIVE_DESIGN_REFERENCES.filter((item) => {
      if (selectedPlataforma !== "Todas" && item.plataforma !== selectedPlataforma) return false;
      if (selectedNicho !== "Todos" && item.nicho !== selectedNicho) return false;
      if (selectedCategoria !== "Todas" && item.categoria !== selectedCategoria) return false;
      if (selectedTipoSite !== "Todos" && item.tipoSite !== selectedTipoSite) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = item.titulo.toLowerCase().includes(query);
        const matchesNicho = item.nicho.toLowerCase().includes(query);
        const matchesTags = item.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesNicho && !matchesTags) return false;
      }

      return true;
    });
  }, [selectedPlataforma, selectedNicho, selectedCategoria, selectedTipoSite, searchTerm]);

  const handleCopyDesignMd = (ref: DesignReference) => {
    navigator.clipboard.writeText(ref.designMd);
    setCopiedId(ref.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ── TOP TELEMETRY BAR: TESLA SHOWROOM HEADER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Banner Identidade Design Lab */}
        <div className="lg:col-span-6 p-6 rounded-[28px] bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] border border-purple-400/30 flex items-center justify-between shadow-[0_20px_40px_rgba(124,58,237,0.35)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-200 animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold">
                CURADORIA INTERNACIONAL DE LUXO · ACERVO OFICIAL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Design Lab.</h1>
            <p className="text-xs text-purple-100/90 mt-1 max-w-md">
              Arquiteturas visuais extraídas do Awwwards, Dribbble, Mobbin e Behance com tokens e arquivos DESIGN.md prontos.
            </p>
          </div>

          <div className="hidden sm:block w-24 h-24">
            <HardyMascot variant="design" className="w-full h-full" />
          </div>
        </div>

        {/* Métricas de Curadoria */}
        <div className="lg:col-span-3 p-6 rounded-[28px] bg-[#0a0815]/90 border border-white/[0.08] flex flex-col justify-between shadow-xl">
          <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">REFERÊNCIAS INDEXADAS</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black font-mono text-white">{MASSIVE_DESIGN_REFERENCES.length}</span>
            <span className="text-xs text-purple-400 font-mono font-bold">Modelos Ativos</span>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Todas com fotos reais e DESIGN.md completo
          </span>
        </div>

        {/* Status de Integração IA */}
        <div className="lg:col-span-3 p-6 rounded-[28px] bg-[#0a0815]/90 border border-white/[0.08] flex flex-col justify-between shadow-xl">
          <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">EXPORTAÇÃO IMEDIATA</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl font-bold text-white">Claude 3.7 / v0</span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">100% Compatível</span>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Cole direto nas IAs para gerar interfaces idênticas
          </span>
        </div>
      </div>

      {/* ── FILTROS TÁTEIS ESTILO TESLA CONSOLE ── */}
      <div className="p-4 sm:p-5 rounded-[26px] bg-[#0c0a18]/95 backdrop-blur-2xl border border-purple-500/25 shadow-[0_10px_30px_rgba(0,0,0,0.8)] space-y-4">
        {/* Barra de Busca + Controles Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Campo de Busca Livre */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nicho (odonto, restaurante, saas, carros...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#140f28] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Filtro por Nicho */}
          <div className="sm:col-span-3">
            <select
              value={selectedNicho}
              onChange={(e) => setSelectedNicho(e.target.value)}
              className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Todos">Todos os Nichos de Mercado</option>
              {nichos.filter(n => n !== "Todos").map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Habilidade / Skill */}
          <div className="sm:col-span-2">
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Todas">Todas as Skills</option>
              {categorias.filter(c => c !== "Todas").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Tipo de Site */}
          <div className="sm:col-span-2">
            <select
              value={selectedTipoSite}
              onChange={(e) => setSelectedTipoSite(e.target.value)}
              className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Todos">Tipo de Aplicação</option>
              {tiposSite.filter(t => t !== "Todos").map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pílulas de Plataformas Internacionais (Awwwards, Dribbble, etc.) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-white/[0.05]">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold whitespace-nowrap mr-2">
            Plataformas:
          </span>
          {plataformas.map((plat) => {
            const count = plat === "Todas"
              ? MASSIVE_DESIGN_REFERENCES.length
              : MASSIVE_DESIGN_REFERENCES.filter(r => r.plataforma === plat).length;

            return (
              <button
                key={plat}
                onClick={() => setSelectedPlataforma(plat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedPlataforma === plat
                    ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                    : "bg-[#140f28] text-zinc-400 hover:text-white hover:bg-[#1a1435]"
                }`}
              >
                <span>{plat}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/40 text-purple-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── BARRA DE STATUS DE RESULTADOS ── */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-2 font-mono">
        <span>Mostrando {filteredReferences.length} de {MASSIVE_DESIGN_REFERENCES.length} referências exclusivas</span>
        <span className="text-purple-400">Design System: Tesla Obsidian & Royal Purple</span>
      </div>

      {/* ── GRID DE CARDS TESLA MODEL (24+ REFERÊNCIAS COM FOTOS REAIS) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReferences.map((item) => (
          <div
            key={item.id}
            className="group rounded-[28px] bg-[#0c0a18] border border-purple-900/30 hover:border-purple-500/50 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_45px_rgba(124,58,237,0.25)] flex flex-col justify-between overflow-hidden"
          >
            {/* Topo com Foto Real do Site */}
            <div className="relative h-56 w-full overflow-hidden bg-[#150f28]">
              <img
                src={item.imagemUrl}
                alt={item.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Badges Flutuantes sobre a Imagem */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/10 shadow-lg">
                  {item.plataforma}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-600/80 backdrop-blur-md text-[9px] font-mono font-bold text-white shadow-lg">
                  {item.tipoSite}
                </span>
              </div>

              {/* Botão de Abrir Preview Rápido */}
              <button
                onClick={() => setSelectedRef(item)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-purple-600 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/10"
                title="Ver Especificação Completa"
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Gradiente de Transição Inferior */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c0a18] to-transparent pointer-events-none" />
            </div>

            {/* Conteúdo do Card */}
            <div className="p-6 pt-3 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className="text-purple-400 font-bold">{item.categoria}</span>
                  <span className="text-zinc-500">{item.nicho}</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                  {item.titulo}
                </h3>

                <p className="text-xs text-zinc-400 mt-1 font-mono">
                  Estilo: <span className="text-zinc-200">{item.estiloVisual}</span>
                </p>

                {/* Tags em Pílulas */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Barra de Performance e Ações */}
              <div className="pt-4 border-t border-white/[0.05] space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-500">Fidelidade Estética</span>
                  <span className="text-purple-400 font-bold">{item.score}/100</span>
                </div>

                <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                    style={{ width: `${item.score}%` }}
                  />
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleCopyDesignMd(item)}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copiar DESIGN.md
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedRef(item)}
                    className="px-3 py-2.5 rounded-xl bg-[#140f28] hover:bg-[#1a1435] border border-white/10 text-white text-xs font-semibold transition-colors cursor-pointer"
                    title="Inspecionar Código"
                  >
                    <Eye className="w-3.5 h-3.5 text-zinc-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── MODAL DE INSPEÇÃO & EXPORTAÇÃO DO DESIGN.MD ── */}
      {selectedRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="w-full max-w-3xl rounded-[32px] bg-[#0c0a18] border border-purple-500/40 shadow-[0_0_60px_rgba(124,58,237,0.4)] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">
                  {selectedRef.plataforma} · {selectedRef.categoria}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedRef.titulo}</h3>
              </div>

              <button
                onClick={() => setSelectedRef(null)}
                className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Foto Real Ampliada */}
              <div className="h-64 w-full rounded-2xl overflow-hidden bg-[#150f28] relative">
                <img src={selectedRef.imagemUrl} alt={selectedRef.titulo} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-mono text-white border border-white/10">
                  Nicho: {selectedRef.nicho} · Estilo: {selectedRef.estiloVisual}
                </div>
              </div>

              {/* Código DESIGN.md Formatado */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Conteúdo do arquivo DESIGN.md</span>
                  <span className="text-purple-400">Pronto para Claude 3.7 / v0 / ChatGPT</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#06040d] border border-purple-900/30 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
                  <pre>{selectedRef.designMd}</pre>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-white/[0.08] bg-[#080512] flex items-center justify-between gap-4">
              <span className="text-xs text-zinc-400 font-mono">
                Pressione ESC ou feche para voltar à galeria.
              </span>

              <button
                onClick={() => handleCopyDesignMd(selectedRef)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
              >
                {copiedId === selectedRef.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" /> Copiado com sucesso!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copiar Arquivo DESIGN.md
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
