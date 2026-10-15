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

export const DESIGN_DATABASE: DesignReference[] = [
  // ════════════════════════════════════════════════════════════════
  // ── AWWWARDS (15 REFERÊNCIAS PREMIADAS) ──
  // ════════════════════════════════════════════════════════════════
  {
    id: "aww-01",
    refNumber: "Ref #AW01",
    titulo: "Aether Void — Spatial Compute & Shaders",
    plataforma: "Awwwards",
    categoria: "Tree.js Skills",
    nicho: "SaaS & AI",
    estiloVisual: "Cyberpunk Obsidian",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    tags: ["Three.js", "WebGL", "Shaders GLSL", "R3F"],
    score: 99,
    designMd: `# DESIGN.md — Aether Void (Three.js Spatial)
## 1. PALETA & TOKENS
- Void Deep: #05030a
- Surface Obsidian: #0c0819
- Accent: #7c3aed (Violet Neon)
- Shaders: 3.000 partículas em bufferGeometry com Lerp inercial.`
  },
  {
    id: "aww-02",
    refNumber: "Ref #AW02",
    titulo: "Kuro Omakase — Gastronomia Sensorial",
    plataforma: "Awwwards",
    categoria: "Gsap Skill",
    nicho: "Gastronomia & Restaurantes",
    estiloVisual: "Wabi-Sabi Dark",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=80",
    tags: ["Omakase", "GSAP Scroll", "Audio Spatial", "Alta Cozinha"],
    score: 98,
    designMd: `# DESIGN.md — Kuro Omakase
## 1. EXPERIÊNCIA CINEMÁTICA
- Vídeo 60fps em background de cortes artesanais.
- ScrollTrigger com scrub contínuo e pinning da carta de saquês.`
  },
  {
    id: "aww-03",
    refNumber: "Ref #AW03",
    titulo: "Vértice Penthouse Collection — Coberturas 3D",
    plataforma: "Awwwards",
    categoria: "Tree.js Skills",
    nicho: "Imóveis & Arquitetura",
    estiloVisual: "Architectural Noir",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    tags: ["Mansões de Luxo", "Tour 3D", "Penthouses", "WebGL"],
    score: 98,
    designMd: `# DESIGN.md — Vértice Penthouse Collection
## 1. ARQUITETURA WEBGL
- Modelo tridimensional interativo do edifício com seleção de pavimentos.`
  },
  {
    id: "aww-04",
    refNumber: "Ref #AW04",
    titulo: "Chronos Haute Horlogerie — Relógios Suíços",
    plataforma: "Awwwards",
    categoria: "WebGL Spatial",
    nicho: "E-commerce & Luxo",
    estiloVisual: "Diamond Obsidian",
    tipoSite: "E-commerce",
    imagemUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    tags: ["Joalheria", "Visualizador 3D", "Turbilhão Suíço", "High Ticket"],
    score: 99,
    designMd: `# DESIGN.md — Chronos Haute Horlogerie
## 1. RENDERIZAÇÃO DE PRODUTO
- Visualizador 3D com shaders de reflexão de vidro safira em tempo real.`
  },
  {
    id: "aww-05",
    refNumber: "Ref #AW05",
    titulo: "Apex Exotic Motors — Supercarros & Hipercarros",
    plataforma: "Awwwards",
    categoria: "Tree.js Skills",
    nicho: "Automotivo & Frotas",
    estiloVisual: "Carbon Fiber & Neon",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80",
    tags: ["Ferrari", "Porsche", "Configurador 3D", "Som do Motor"],
    score: 99,
    designMd: `# DESIGN.md — Apex Exotic Motors
## 1. CONFIGURADOR AUTOMOTIVO
- Customizador interativo de cores, rodas e acabamento interno em fibra de carbono.`
  },
  {
    id: "aww-06",
    refNumber: "Ref #AW06",
    titulo: "Obsidian Atelier — Streetwear High Couture",
    plataforma: "Awwwards",
    categoria: "Genjutsu",
    nicho: "Moda & Joalheria",
    estiloVisual: "Tokyo Cyber Street",
    tipoSite: "E-commerce",
    imagemUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
    tags: ["Streetwear", "Drops Limitados", "Lookbook 3D", "Cyberpunk"],
    score: 97,
    designMd: `# DESIGN.md — Obsidian Atelier
## 1. SISTEMA DE LANÇAMENTOS
- Contador regressivo para lançamentos com fila de espera criptografada.`
  },
  {
    id: "aww-07",
    refNumber: "Ref #AW07",
    titulo: "Nexus Quantum — Computação de Próxima Geração",
    plataforma: "Awwwards",
    categoria: "WebGL Spatial",
    nicho: "SaaS & AI",
    estiloVisual: "Quantum Cyber Glass",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1000&q=80",
    tags: ["Quantum", "Qubits", "Shaders GLSL", "Next Gen"],
    score: 98,
    designMd: `# DESIGN.md — Nexus Quantum
## 1. SIMULAÇÃO QUÂNTICA
- Malha holográfica simulando rotação de esfera de Bloch em WebGL.`
  },
  {
    id: "aww-08",
    refNumber: "Ref #AW08",
    titulo: "L'Ombre — Vinhedos Raros & Clube Enológico",
    plataforma: "Awwwards",
    categoria: "Gsap Skill",
    nicho: "Gastronomia & Restaurantes",
    estiloVisual: "Burgundy Velvet Noir",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80",
    tags: ["Vinhos Raros", "Grand Cru", "Parallax Scroll", "Membros VIP"],
    score: 96,
    designMd: `# DESIGN.md — L'Ombre Enoteca
## 1. EXPERIÊNCIA PREMIUM
- Revelação das safras de Bordeaux com scroll suave e storytelling imersivo.`
  },
  {
    id: "aww-09",
    refNumber: "Ref #AW09",
    titulo: "Kinesis Architecture — Retrofit de Arranha-Céus",
    plataforma: "Awwwards",
    categoria: "Design DNA",
    nicho: "Imóveis & Arquitetura",
    estiloVisual: "Brutalist Glass & Concrete",
    tipoSite: "Portfólio",
    imagemUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    tags: ["Arranha-Céus", "Arquitetura", "Swiss Grid", "Fotografia"],
    score: 97,
    designMd: `# DESIGN.md — Kinesis Architecture
## 1. TIPOGRAFIA & GRID
- Layout de proporção áurea com tipografia condensada monumental.`
  },
  {
    id: "aww-10",
    refNumber: "Ref #AW10",
    titulo: "Solaris Orbital — Infraestrutura Espacial & Satélites",
    plataforma: "Awwwards",
    categoria: "Tree.js Skills",
    nicho: "SaaS & AI",
    estiloVisual: "Deep Space Titanium",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
    tags: ["Satélites", "Órbita Terrestre", "Globo 3D", "Telemetria"],
    score: 99,
    designMd: `# DESIGN.md — Solaris Orbital
## 1. GLOBO ORBITAL INTERATIVO
- Globo terrestre em Three.js com constelação de satélites em tempo real.`
  },
  {
    id: "aww-11",
    refNumber: "Ref #AW11",
    titulo: "Aura Aesthetics — Cirurgia Plástica & Rejuvenescimento",
    plataforma: "Awwwards",
    categoria: "Motion Design Skill",
    nicho: "Saúde & Clínicas",
    estiloVisual: "Pearl Soft Noir",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1512290900672-1f4139988ff4?auto=format&fit=crop&w=1000&q=80",
    tags: ["Cirurgia Plástica", "Lifting Facial", "Antes e Depois", "Concierge"],
    score: 96,
    designMd: `# DESIGN.md — Aura Aesthetics
## 1. PROTOCOLOS CIRÚRGICOS
- Visual clean escuro com depoimentos em vídeo 4k e agendamento privativo.`
  },
  {
    id: "aww-12",
    refNumber: "Ref #AW12",
    titulo: "Vortex Soundworks — Sintetizadores Analógicos & Plugins",
    plataforma: "Awwwards",
    categoria: "WebGL Spatial",
    nicho: "Música & Áudio",
    estiloVisual: "Cyber Deck Modular",
    tipoSite: "E-commerce",
    imagemUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80",
    tags: ["Sintetizadores", "Visualizador de Onda", "Web Audio API", "Hardware"],
    score: 97,
    designMd: `# DESIGN.md — Vortex Soundworks
## 1. OSCILOSCÓPIO WEB AUDIO
- Forma de onda dinâmica gerada pelo cursor simulando oscilador analógico.`
  },
  {
    id: "aww-13",
    refNumber: "Ref #AW13",
    titulo: "Elysium Private Islands — Locação de Ilhas Exclusivas",
    plataforma: "Awwwards",
    categoria: "Gsap Skill",
    nicho: "Hotelaria & Luxo",
    estiloVisual: "Aquatic Night Glass",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
    tags: ["Ilhas Privadas", "Iates", "Concierge Global", "Ultra Luxo"],
    score: 98,
    designMd: `# DESIGN.md — Elysium Islands
## 1. CURADORIA DE DESTINOS
- Vídeos cinematográficos das ilhas caribenhas com transições suaves GSAP.`
  },
  {
    id: "aww-14",
    refNumber: "Ref #AW14",
    titulo: "NeuroSync Labs — Interfaces Cerebro-Computador",
    plataforma: "Awwwards",
    categoria: "Tree.js Skills",
    nicho: "SaaS & AI",
    estiloVisual: "Synapse Neon Violet",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1000&q=80",
    tags: ["Neurociência", "Sinapses 3D", "EEG", "Deep Tech"],
    score: 98,
    designMd: `# DESIGN.md — NeuroSync Labs
## 1. CÓRTEX 3D INTERATIVO
- Simulação tridimensional de impulsos elétricos cerebrais com Shaders GLSL.`
  },
  {
    id: "aww-15",
    refNumber: "Ref #AW15",
    titulo: "Graphene Motors — Hipercarros Elétricos Conceito",
    plataforma: "Awwwards",
    categoria: "WebGL Spatial",
    nicho: "Automotivo & Frotas",
    estiloVisual: "Monolithic Matte Black",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1000&q=80",
    tags: ["EV", "Hipercarro", "Aerodinâmica 3D", "Tunnel de Vento"],
    score: 99,
    designMd: `# DESIGN.md — Graphene Motors
## 1. TÚNEL DE VENTO DIGITAL
- Simulação de linhas aerodinâmicas sobre a carroceria do veículo elétrico.`
  },

  // ════════════════════════════════════════════════════════════════
  // ── DRIBBBLE (15 REFERÊNCIAS TRENDING UI/UX) ──
  // ════════════════════════════════════════════════════════════════
  {
    id: "drb-01",
    refNumber: "Ref #DR01",
    titulo: "Synthetix Engine — Deep Learning Terminal",
    plataforma: "Dribbble",
    categoria: "Genjutsu",
    nicho: "SaaS & AI",
    estiloVisual: "Dark Bento Glass",
    tipoSite: "Dashboard",
    imagemUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
    tags: ["Bento Grid", "Genjutsu", "Titanium Glass", "Telemetry"],
    score: 96,
    designMd: `# DESIGN.md — Synthetix Engine
## 1. BENTO GRID DESIGN
- Painel modular com micro-bordas de 1px e telemetria de GPUs em tempo real.`
  },
  {
    id: "drb-02",
    refNumber: "Ref #DR02",
    titulo: "Vortex Capital — Hedge Fund & Trading Algorítmico",
    plataforma: "Dribbble",
    categoria: "Genjutsu",
    nicho: "Fintech & Finanças",
    estiloVisual: "Cybertruck Obsidian",
    tipoSite: "Web App",
    imagemUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1000&q=80",
    tags: ["Trading", "Algoritmos", "Fintech", "Candlesticks"],
    score: 97,
    designMd: `# DESIGN.md — Vortex Capital
## 1. TELEMETRIA FINANCEIRA
- Gráficos neon em alta resolução com taxas de retorno e simulações Monte Carlo.`
  },
  {
    id: "drb-03",
    refNumber: "Ref #DR03",
    titulo: "Iron Vault Performance — Centro CrossFit & Ginástica",
    plataforma: "Dribbble",
    categoria: "Gsap Skill",
    nicho: "Fitness & Performance",
    estiloVisual: "Industrial Brutalism",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80",
    tags: ["CrossFit", "Força", "Agendamento", "WOD Tracker"],
    score: 95,
    designMd: `# DESIGN.md — Iron Vault Performance
## 1. ESTÉTICA BRUTALISTA
- Tipografia densa combinada com fotografias de alto contraste de treinos.`
  },
  {
    id: "drb-04",
    refNumber: "Ref #DR04",
    titulo: "CodeHard Academy — Formação Fullstack com IA",
    plataforma: "Dribbble",
    categoria: "Tree.js Skills",
    nicho: "Educação & EdTech",
    estiloVisual: "Cyber Academy Obsidian",
    tipoSite: "Web App",
    imagemUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
    tags: ["EdTech", "Code Player", "Comunidade VIP", "Gamificação"],
    score: 99,
    designMd: `# DESIGN.md — CodeHard Academy
## 1. INTERFACE DE APRENDIZADO
- Player de vídeo sincronizado com terminal de código e chat com tutor IA.`
  },
  {
    id: "drb-05",
    refNumber: "Ref #DR05",
    titulo: "Valença & Partners — Advocacia Tributária & M&A",
    plataforma: "Dribbble",
    categoria: "Genjutsu",
    nicho: "Advocacia & Jurídico",
    estiloVisual: "Swiss Navy & Titanium",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
    tags: ["Direito Tributário", "Corporate", "Bento Grid", "Sigilo"],
    score: 96,
    designMd: `# DESIGN.md — Valença & Partners
## 1. AUTORIDADE JURÍDICA
- Bento Grid corporativo com bilhões de reais recuperados em litígios fiscais.`
  },
  {
    id: "drb-06",
    refNumber: "Ref #DR06",
    titulo: "Pulse Health AI — Análise Preditiva de Exames",
    plataforma: "Dribbble",
    categoria: "Bento Grid",
    nicho: "Saúde & Clínicas",
    estiloVisual: "Bio Dark Glass",
    tipoSite: "Dashboard",
    imagemUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80",
    tags: ["Exames", "IA Médica", "Diagnóstico", "Dashboard"],
    score: 97,
    designMd: `# DESIGN.md — Pulse Health AI
## 1. DASHBOARD DE BIOMARCADORES
- Gráficos de dispersão e indicadores de glicemia, colesterol e VO2 max.`
  },
  {
    id: "drb-07",
    refNumber: "Ref #DR07",
    titulo: "Nebula CRM — Pipeline de Vendas Aeroespacial",
    plataforma: "Dribbble",
    categoria: "Genjutsu",
    nicho: "SaaS & AI",
    estiloVisual: "Obsidian Titanium",
    tipoSite: "Dashboard",
    imagemUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
    tags: ["CRM", "Kanban", "Vendas", "Previsibilidade"],
    score: 98,
    designMd: `# DESIGN.md — Nebula CRM
## 1. KANBAN INTERATIVO
- Colunas com topos curvos, contadores em tempo real e cálculo de MRR previsto.`
  },
  {
    id: "drb-08",
    refNumber: "Ref #DR08",
    titulo: "Boutique Le Petit — Joias Artesanais em Ouro 18k",
    plataforma: "Dribbble",
    categoria: "Design DNA",
    nicho: "Moda & Joalheria",
    estiloVisual: "Warm Champagne Dark",
    tipoSite: "E-commerce",
    imagemUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80",
    tags: ["Ouro 18k", "Joias", "Diamantes", "Checkout Rápido"],
    score: 95,
    designMd: `# DESIGN.md — Boutique Le Petit
## 1. VITRINE DE LUXO
- Fotografias macro das pedras preciosas com zoom dinâmico e selo de gema.`
  },
  {
    id: "drb-09",
    refNumber: "Ref #DR09",
    titulo: "Hyperion Cloud — Infraestrutura Kubernetes Serverless",
    plataforma: "Dribbble",
    categoria: "Bento Grid",
    nicho: "SaaS & AI",
    estiloVisual: "Matrix Dark Velvet",
    tipoSite: "Dashboard",
    imagemUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80",
    tags: ["DevOps", "Kubernetes", "Logs ao Vivo", "Terminal"],
    score: 97,
    designMd: `# DESIGN.md — Hyperion Cloud
## 1. MONITORAMENTO DE CLUSTERS
- Visualização de pods ativos, consumo de RAM e latência por região.`
  },
  {
    id: "drb-10",
    refNumber: "Ref #DR10",
    titulo: "Steakhouse Prime 88 — Carnes Nobres & Dry Aged",
    plataforma: "Dribbble",
    categoria: "Motion Design Skill",
    nicho: "Gastronomia & Restaurantes",
    estiloVisual: "Ember Charcoal",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
    tags: ["Dry Aged", "Steakhouse", "Wagyu A5", "Carta de Cortes"],
    score: 96,
    designMd: `# DESIGN.md — Steakhouse Prime 88
## 1. APRESENTAÇÃO DE CORTES
- Catálogo de cortes Wagyu A5 e Tomahawk com dias de maturação e reservas.`
  },
  {
    id: "drb-11",
    refNumber: "Ref #DR11",
    titulo: "Aura Dental Studio — Harmonização & Lentes de Resina",
    plataforma: "Dribbble",
    categoria: "Design DNA",
    nicho: "Saúde & Clínicas",
    estiloVisual: "Pearl Obsidian",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1000&q=80",
    tags: ["Lentes de Contato", "Odonto", "Antes e Depois", "VIP"],
    score: 97,
    designMd: `# DESIGN.md — Aura Dental Studio
## 1. SLIDER ANTES E DEPOIS
- Componente tátil de comparação de sorrisos em alta definição.`
  },
  {
    id: "drb-12",
    refNumber: "Ref #DR12",
    titulo: "AeroJet Private Charter — Fretamento de Jatos Executivos",
    plataforma: "Dribbble",
    categoria: "Genjutsu",
    nicho: "Automotivo & Frotas",
    estiloVisual: "Aero Titanium Dark",
    tipoSite: "Web App",
    imagemUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80",
    tags: ["Jatos Particulares", "Empty Legs", "Cotação Instantânea", "VIP"],
    score: 98,
    designMd: `# DESIGN.md — AeroJet Charter
## 1. CALCULADORA DE ROTAS
- Cotação instantânea de horas de voo com mapa de alcance internacional.`
  },
  {
    id: "drb-13",
    refNumber: "Ref #DR13",
    titulo: "Solfire Energy — Usinas Solares de Solo & Baterias",
    plataforma: "Dribbble",
    categoria: "Bento Grid",
    nicho: "Sustentabilidade & Energia",
    estiloVisual: "Sunray Dark Tech",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80",
    tags: ["Energia Solar", "Fazendas Solares", "Economia na Conta", "B2B"],
    score: 95,
    designMd: `# DESIGN.md — Solfire Energy
## 1. SIMULADOR DE INVESTIMENTO
- Gráfico interativo de Payback e redução de custos operacionais industriais.`
  },
  {
    id: "drb-14",
    refNumber: "Ref #DR14",
    titulo: "Kitsune Barber Lounge — Corte Navalha & Tabacaria",
    plataforma: "Dribbble",
    categoria: "Motion Design Skill",
    nicho: "Beleza & Estética",
    estiloVisual: "Neo Tokyo Leather",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80",
    tags: ["Barbearia", "Navalha", "Agendamento", "Clube Mensal"],
    score: 94,
    designMd: `# DESIGN.md — Kitsune Barber Lounge
## 1. AGENDAMENTO VIP
- Seleção de barbeiro e combos de toalha quente com confirmação no WhatsApp.`
  },
  {
    id: "drb-15",
    refNumber: "Ref #DR15",
    titulo: "Alpha Dog Hospital — Centro Veterinário 24h & UTI",
    plataforma: "Dribbble",
    categoria: "Design DNA",
    nicho: "Pet & Veterinária",
    estiloVisual: "Clinical Violet Clean",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80",
    tags: ["Veterinária 24h", "UTI Pet", "Cirurgia", "Emergência"],
    score: 95,
    designMd: `# DESIGN.md — Alpha Dog Hospital
## 1. BOTÃO DE EMERGÊNCIA 24H
- Chamada rápida para ambulância veterinária e plantão cirúrgico imediato.`
  },

  // ════════════════════════════════════════════════════════════════
  // ── MOBBIN (12 REFERÊNCIAS MOBILE-FIRST CONVERSION) ──
  // ════════════════════════════════════════════════════════════════
  {
    id: "mob-01",
    refNumber: "Ref #MB01",
    titulo: "Helios Longevity Center — Aplicativo de Telemetria Biométrica",
    plataforma: "Mobbin",
    categoria: "Motion Design Skill",
    nicho: "Saúde & Clínicas",
    estiloVisual: "Obsidian Health Tech",
    tipoSite: "Mobile App",
    imagemUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80",
    tags: ["Mobile App", "Biometria", "Telemetria", "Micro-interações"],
    score: 96,
    designMd: `# DESIGN.md — Helios Longevity App
## 1. FLUXO MOBILE DE SAÚDE
- Navegação por gestos, monitoramento cardíaco e agendamento com o médico.`
  },
  {
    id: "mob-02",
    refNumber: "Ref #MB02",
    titulo: "Maison Privée — Perfumaria Mobile & Notas Olfativas",
    plataforma: "Mobbin",
    categoria: "Motion Design Skill",
    nicho: "E-commerce & Luxo",
    estiloVisual: "Golden Velvet Dark",
    tipoSite: "Mobile App",
    imagemUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80",
    tags: ["Perfumaria", "Mobile Commerce", "One-Click", "Apple Pay"],
    score: 95,
    designMd: `# DESIGN.md — Maison Privée Mobile
## 1. CHECKOUT ULTRA-RÁPIDO
- Pagamento em 1 clique via Apple Pay e pirâmide olfativa interativa no celular.`
  },
  {
    id: "mob-03",
    refNumber: "Ref #MB03",
    titulo: "Vanguard Executive MBA — Plataforma de Aulas no Bolso",
    plataforma: "Mobbin",
    categoria: "Design DNA",
    nicho: "Educação & EdTech",
    estiloVisual: "Ivy League Minimal",
    tipoSite: "Mobile App",
    imagemUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80",
    tags: ["MBA", "C-Level", "Aulas Offline", "Networking"],
    score: 96,
    designMd: `# DESIGN.md — Vanguard Executive App
## 1. NETWORKING EXECUTIVO
- Feed reservado para diretores e troca de contatos por aproximação.`
  },
  {
    id: "mob-04",
    refNumber: "Ref #MB04",
    titulo: "Volt Rides — Aplicativo de Mobilidade em Teslas",
    plataforma: "Mobbin",
    categoria: "Motion Design Skill",
    nicho: "Automotivo & Frotas",
    estiloVisual: "Tesla Minimal Dark",
    tipoSite: "Mobile App",
    imagemUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80",
    tags: ["Mobilidade", "Tesla", "Carro Elétrico", "Motorista Executivo"],
    score: 97,
    designMd: `# DESIGN.md — Volt Rides
## 1. MAPA DE MOTORISTAS EM TEMPO REAL
- Carrinhos 3D navegando pelo mapa e seleção de temperatura do veículo.`
  },
  {
    id: "mob-05",
    refNumber: "Ref #MB05",
    titulo: "ZenBank Wallet — Conta Internacional Multimoedas",
    plataforma: "Mobbin",
    categoria: "Genjutsu",
    nicho: "Fintech & Finanças",
    estiloVisual: "Titanium Frosted Glass",
    tipoSite: "Mobile App",
    imagemUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80",
    tags: ["Fintech", "Cartão Black", "Câmbio", "Segurança"],
    score: 98,
    designMd: `# DESIGN.md — ZenBank Wallet
## 1. CARTÃO VIRTUAL FLUTUANTE
- Cartão em 3D com giroscópio do celular refletindo luz holográfica violeta.`
  },
  {
    id: "mob-06",
    refNumber: "Ref #MB06",
    titulo: "Savour Delivery — Restaurantes Estrela Michelin na Porta",
    plataforma: "Mobbin",
    categoria: "Motion Design Skill",
    nicho: "Gastronomia & Restaurantes",
    estiloVisual: "Gourmet Dark Velvet",
    tipoSite: "Mobile App",
    imagemUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
    tags: ["Delivery de Luxo", "Michelin", "Rastreio ao Vivo", "Alta Gastronomia"],
    score: 96,
    designMd: `# DESIGN.md — Savour Delivery
## 1. RASTREIO TÁTIL
- Linha do tempo da preparação do prato com motorista em veículo climatizado.`
  },
  {
    id: "mob-07",
    refNumber: "Ref #MB07",
    titulo: "FitPulse Tracker — Análise de Cargas e Frequência Cardíaca",
    plataforma: "Mobbin",
    categoria: "Motion Design Skill",
    nicho: "Fitness & Performance",
    estiloVisual: "Neon Pulse Dark",
    tipoSite: "Mobile App",
    imagemUrl: "https://images.unsplash.com/photo-1510519138161-58444cbfdb7d?auto=format&fit=crop&w=1000&q=80",
    tags: ["Apple Watch", "Treino", "Hipertrofia", "Análise de Cargas"],
    score: 95,
    designMd: `# DESIGN.md — FitPulse Tracker
## 1. TIMER DE DESCANSO TÁTIL
- Notificação de vibração háptica no término do tempo de recuperação da série.`
  },
  {
    id: "mob-08",
    refNumber: "Ref #MB08",
    titulo: "KeyPass Real Estate — Chave Digital para Visitas de Mansões",
    plataforma: "Mobbin",
    categoria: "Design DNA",
    nicho: "Imóveis & Arquitetura",
    estiloVisual: "Architectural Obsidian",
    tipoSite: "Mobile App",
    imagemUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
    tags: ["Fechadura Digital", "Imóveis de Luxo", "QR Code", "Corretores"],
    score: 96,
    designMd: `# DESIGN.md — KeyPass Real Estate
## 1. ACESSO BIOMÉTRICO
- Destravamento da porta principal da mansão via FaceID para corretores cadastrados.`
  },
  {
    id: "mob-09",
    refNumber: "Ref #MB09",
    titulo: "Lexis Pocket — Consulta Processual Criptografada",
    plataforma: "Mobbin",
    categoria: "Genjutsu",
    nicho: "Advocacia & Jurídico",
    estiloVisual: "Deep Navy Titanium",
    tipoSite: "Mobile App",
    imagemUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80",
    tags: ["Processos", "Push Notification", "Tribunais", "Advogado no Bolso"],
    score: 95,
    designMd: `# DESIGN.md — Lexis Pocket
## 1. PUSH EM TEMPO REAL
- Alerta instantâneo quando o juiz despacha ou assina sentença favorável.`
  },
  {
    id: "mob-10",
    refNumber: "Ref #MB10",
    titulo: "Glamour Club — Agendamento de Mechas & Tratamentos Capilares",
    plataforma: "Mobbin",
    categoria: "Motion Design Skill",
    nicho: "Beleza & Estética",
    estiloVisual: "Rosé Dark Silk",
    tipoSite: "Mobile App",
    imagemUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80",
    tags: ["Salão de Beleza", "Mechas", "Balayage", "Agendamento VIP"],
    score: 94,
    designMd: `# DESIGN.md — Glamour Club
## 1. CALENDÁRIO DA CABELEIREIRA
- Grade de horários com seleção do profissional e lembrete automático.`
  },
  {
    id: "mob-11",
    refNumber: "Ref #MB11",
    titulo: "CryptoVault — Carteira Fria Não-Custodial",
    plataforma: "Mobbin",
    categoria: "Tree.js Skills",
    nicho: "Fintech & Finanças",
    estiloVisual: "Cyber Shield 3D",
    tipoSite: "Mobile App",
    imagemUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1000&q=80",
    tags: ["Cripto", "Seed Phrase", "Segurança Máxima", "DeFi"],
    score: 98,
    designMd: `# DESIGN.md — CryptoVault
## 1. ESCUDO BIOMÉTRICO
- Interface com proteção contra gravação de tela e cofres de semente biométrica.`
  },
  {
    id: "mob-12",
    refNumber: "Ref #MB12",
    titulo: "Sommelier Pocket — Scanner de Rótulos de Vinhos com IA",
    plataforma: "Mobbin",
    categoria: "Motion Design Skill",
    nicho: "Gastronomia & Restaurantes",
    estiloVisual: "Bordeaux Noir",
    tipoSite: "Mobile App",
    imagemUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1000&q=80",
    tags: ["Scanner de Rótulo", "Sommelier IA", "Harmonização", "Adega"],
    score: 96,
    designMd: `# DESIGN.md — Sommelier Pocket
## 1. RECONHECIMENTO POR CÂMERA
- Apontou a câmera para a garrafa, exibe notas de prova e pratos harmonizados.`
  },

  // ════════════════════════════════════════════════════════════════
  // ── LAND-BOOK (12 LANDING PAGES DE ALTA CONVERSÃO) ──
  // ════════════════════════════════════════════════════════════════
  {
    id: "lb-01",
    refNumber: "Ref #LB01",
    titulo: "Aura Dental Institute — Odontologia Estética & Implantes",
    plataforma: "Land-Book",
    categoria: "Design DNA",
    nicho: "Saúde & Clínicas",
    estiloVisual: "White Pearl & Titanium",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80",
    tags: ["Clínica Odonto", "Luxury Pearl", "Agendamento VIP", "CRO"],
    score: 97,
    designMd: `# DESIGN.md — Aura Dental Institute
## 1. DIRETRIZES DE CONVERSÃO
- Lentes de contato, harmonização e implantes guiados com botão WhatsApp.`
  },
  {
    id: "lb-02",
    refNumber: "Ref #LB02",
    titulo: "Studio Arch & Living — Design de Interiores e Retrofit",
    plataforma: "Land-Book",
    categoria: "Gsap Skill",
    nicho: "Imóveis & Arquitetura",
    estiloVisual: "Minimal Bauhaus",
    tipoSite: "Portfólio",
    imagemUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
    tags: ["Arquitetura", "Interiores", "Parallax", "Catálogo"],
    score: 96,
    designMd: `# DESIGN.md — Studio Arch
## 1. ARQUITETURA EDITORIAL
- Grid assimétrico e fotografia de interiores premiados.`
  },
  {
    id: "lb-03",
    refNumber: "Ref #LB03",
    titulo: "Lumina Yoga & Recovery Lounge — Bem-Estar & Biohacking",
    plataforma: "Land-Book",
    categoria: "Motion Design Skill",
    nicho: "Fitness & Performance",
    estiloVisual: "Zen Glassmorphism",
    tipoSite: "Web App",
    imagemUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=80",
    tags: ["Yoga", "Sauna Infravermelha", "Biohacking", "Assinatura"],
    score: 96,
    designMd: `# DESIGN.md — Lumina Yoga
## 1. RESPIRAÇÃO GUIADA
- Hero com animação circular suave induzindo foco e tranquilidade.`
  },
  {
    id: "lb-04",
    refNumber: "Ref #LB04",
    titulo: "Dermoclinique Estética Avançada — Harmonização e Laser",
    plataforma: "Land-Book",
    categoria: "Motion Design Skill",
    nicho: "Beleza & Estética",
    estiloVisual: "Soft Rose Glass",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80",
    tags: ["Harmonização", "Laser CO2", "Protocolos Faciais", "Conversão"],
    score: 94,
    designMd: `# DESIGN.md — Dermoclinique
## 1. FUNIL DE CONSULTA
- Questionário interativo direcionando para o WhatsApp da médica dermatologista.`
  },
  {
    id: "lb-05",
    refNumber: "Ref #LB05",
    titulo: "Kinetic Scroll — GSAP Timeline Experience",
    plataforma: "Land-Book",
    categoria: "Gsap Skill",
    nicho: "Agências & Estúdios",
    estiloVisual: "Kinetic Motion",
    tipoSite: "Portfólio",
    imagemUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80",
    tags: ["GSAP ScrollTrigger", "SplitText", "Pinning", "Smooth Scroll"],
    score: 97,
    designMd: `# DESIGN.md — Kinetic Scroll GSAP
## 1. MOTION ENGINE
- ScrollTrigger com scrub contínuo e revelação de tipografia letra por letra.`
  },
  {
    id: "lb-06",
    refNumber: "Ref #LB06",
    titulo: "CloudFortress — Proteção DDoS & WAF Empresarial",
    plataforma: "Land-Book",
    categoria: "Bento Grid",
    nicho: "SaaS & AI",
    estiloVisual: "Cyber Shield Noir",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1000&q=80",
    tags: ["Cybersegurança", "WAF", "Zero Day", "Enterprise"],
    score: 98,
    designMd: `# DESIGN.md — CloudFortress
## 1. SEÇÕES B2B ENTERPRISE
- Comparação com Cloudflare e AWS Shield com tabela de mitigação em <3ms.`
  },
  {
    id: "lb-07",
    refNumber: "Ref #LB07",
    titulo: "TerraNova Agro — Fertirrigação Inteligente & Drones",
    plataforma: "Land-Book",
    categoria: "Design DNA",
    nicho: "Sustentabilidade & Energia",
    estiloVisual: "Agro Tech Obsidian",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1000&q=80",
    tags: ["AgroTech", "Drones", "Lavoura", "Produtividade"],
    score: 95,
    designMd: `# DESIGN.md — TerraNova Agro
## 1. CALCULADORA DE SACAS POR HECTARE
- Simulação de incremento de produtividade de soja e milho via sensor de solo.`
  },
  {
    id: "lb-08",
    refNumber: "Ref #LB08",
    titulo: "Coutinho Contabilidade — BPO Financeiro & Lucro Real",
    plataforma: "Land-Book",
    categoria: "Bento Grid",
    nicho: "Advocacia & Jurídico",
    estiloVisual: "Executive Steel Glass",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
    tags: ["Contabilidade B2B", "Lucro Real", "BPO Financeiro", "Redução de Impostos"],
    score: 95,
    designMd: `# DESIGN.md — Coutinho BPO
## 1. PROPOSTA DE VALOR
- Demonstração do fim de multas fiscais e relatórios gerenciais em DRE ao vivo.`
  },
  {
    id: "lb-09",
    refNumber: "Ref #LB09",
    titulo: "Burguer Station Craft — Hamburgueria Smoked & Chopes",
    plataforma: "Land-Book",
    categoria: "Motion Design Skill",
    nicho: "Gastronomia & Restaurantes",
    estiloVisual: "Dark Smoke Bronze",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
    tags: ["Smash Burger", "Brisket", "Cardápio Próprio", "Delivery"],
    score: 94,
    designMd: `# DESIGN.md — Burguer Station
## 1. PEDIDO EM 2 CLIQUES
- Cardápio direto com adicionais (bacon caramelizado, queijo cheddar inglês).`
  },
  {
    id: "lb-10",
    refNumber: "Ref #LB10",
    titulo: "Titan Shield Blindagens — Blindagem Automotiva Nível III-A",
    plataforma: "Land-Book",
    categoria: "Design DNA",
    nicho: "Automotivo & Frotas",
    estiloVisual: "Ballistic Carbon",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
    tags: ["Blindagem", "Vidros Balísticos", "Garantia 10 Anos", "Segurança"],
    score: 96,
    designMd: `# DESIGN.md — Titan Shield Blindagens
## 1. TESTE BALÍSTICO INTERATIVO
- Vídeos de testes com munição Magnum .44 e certificados do Exército Brasileiro.`
  },
  {
    id: "lb-11",
    refNumber: "Ref #LB11",
    titulo: "Nirvana Spa Resort — Bangalôs sobre as Águas",
    plataforma: "Land-Book",
    categoria: "Gsap Skill",
    nicho: "Hotelaria & Luxo",
    estiloVisual: "Tropical Dark Sunset",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
    tags: ["Resort", "Bangalô", "Spa", "Lua de Mel"],
    score: 97,
    designMd: `# DESIGN.md — Nirvana Spa Resort
## 1. PACOTES ALL-INCLUSIVE
- Galeria de bangalôs privativos com piscina aquecida de borda infinita.`
  },
  {
    id: "lb-12",
    refNumber: "Ref #LB12",
    titulo: "Veloce Bike Studio — Bicicletas de Carbono e Bike Fit",
    plataforma: "Land-Book",
    categoria: "Tree.js Skills",
    nicho: "Fitness & Performance",
    estiloVisual: "Speedway Cyan & Dark",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80",
    tags: ["Ciclismo", "Carbono", "Shimano Di2", "Bike Fit"],
    score: 95,
    designMd: `# DESIGN.md — Veloce Bike Studio
## 1. PESAGEM E CONFIGURAÇÃO
- Visualizador com peso total da bicicleta (6.8kg) e agendamento de Bike Fit a laser.`
  },

  // ════════════════════════════════════════════════════════════════
  // ── BEHANCE (12 IDENTIDADES VISUAIS & BRANDING DE LUXO) ──
  // ════════════════════════════════════════════════════════════════
  {
    id: "beh-01",
    refNumber: "Ref #BE01",
    titulo: "Bella Vista Trattoria — Cantina Toscana & Enoteca",
    plataforma: "Behance",
    categoria: "Design DNA",
    nicho: "Gastronomia & Restaurantes",
    estiloVisual: "Vintage Toscana Luxo",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
    tags: ["Culinária Italiana", "Carta de Vinhos", "Mesa VIP", "Identidade"],
    score: 95,
    designMd: `# DESIGN.md — Bella Vista Trattoria
## 1. IDENTIDADE VISUAL
- Tipografia serifada clássica inspirada nas cantinas históricas de Florença.`
  },
  {
    id: "beh-02",
    refNumber: "Ref #BE02",
    titulo: "Zenith Family Office — Gestão Patrimonial Global",
    plataforma: "Behance",
    categoria: "Design DNA",
    nicho: "Fintech & Finanças",
    estiloVisual: "Midnight Luxury",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80",
    tags: ["Family Office", "Offshores", "Gestão de Ativos", "Alta Renda"],
    score: 96,
    designMd: `# DESIGN.md — Zenith Family Office
## 1. COMUNICAÇÃO RESERVADA
- Foco em discrição e governança para famílias com patrimônio superior a R$ 20M.`
  },
  {
    id: "beh-03",
    refNumber: "Ref #BE03",
    titulo: "Sartoria Milanesa — Alfaiataria Artesanal Sob Medida",
    plataforma: "Behance",
    categoria: "Design DNA",
    nicho: "Moda & Joalheria",
    estiloVisual: "Classic Italian Elegance",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80",
    tags: ["Alfaiataria", "Tecidos Ingleses", "Mestre Alfaiate", "Ternos"],
    score: 95,
    designMd: `# DESIGN.md — Sartoria Milanesa
## 1. NARRATIVA ARTESANAL
- Demonstração do processo manual de corte e mais de 45 horas de confecção por terno.`
  },
  {
    id: "beh-04",
    refNumber: "Ref #BE04",
    titulo: "L'Arcadia — Perfumaria Botânica de Grasse",
    plataforma: "Behance",
    categoria: "Design DNA",
    nicho: "E-commerce & Luxo",
    estiloVisual: "Ethereal Botanical Dark",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80",
    tags: ["Perfumaria de Grasse", "Flores Raras", "Destilação", "Exclusivo"],
    score: 97,
    designMd: `# DESIGN.md — L'Arcadia Perfumes
## 1. EMBALAGEM E IDENTIDADE
- Tipografia com serifas botânicas e visual luxuoso escuro com toques de lavanda.`
  },
  {
    id: "beh-05",
    refNumber: "Ref #BE05",
    titulo: "Insignia Capital — Private Equity & Venture Capital",
    plataforma: "Behance",
    categoria: "Genjutsu",
    nicho: "Fintech & Finanças",
    estiloVisual: "Steel Minimalist",
    tipoSite: "Web App",
    imagemUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    tags: ["Private Equity", "Startups", "Rodadas Série B", "Teses"],
    score: 96,
    designMd: `# DESIGN.md — Insignia Capital
## 1. PORTFÓLIO DE INVESTIDAS
- Exibição de unicórnios acelerados e métricas de expansão internacional.`
  },
  {
    id: "beh-06",
    refNumber: "Ref #BE06",
    titulo: "Monolith Architecture — Concreto Aparente & Vidro Puro",
    plataforma: "Behance",
    categoria: "Tree.js Skills",
    nicho: "Imóveis & Arquitetura",
    estiloVisual: "Brutalist Monolith",
    tipoSite: "Portfólio",
    imagemUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
    tags: ["Concreto Aparente", "Minimalismo", "Projetos Residenciais", "Prêmios"],
    score: 98,
    designMd: `# DESIGN.md — Monolith Studio
## 1. ESPACIALIDADE
- Fotografias com sombras marcadas valorizando a incidência de luz natural nos ambientes.`
  },
  {
    id: "beh-07",
    refNumber: "Ref #BE07",
    titulo: "Aureus Gin — Destilaria Artesanal em Alambiques de Cobre",
    plataforma: "Behance",
    categoria: "Design DNA",
    nicho: "Gastronomia & Restaurantes",
    estiloVisual: "Copper & Dark Velvet",
    tipoSite: "E-commerce",
    imagemUrl: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1000&q=80",
    tags: ["Gin Artesanal", "Zimbro", "Alambique de Cobre", "Drinks"],
    score: 95,
    designMd: `# DESIGN.md — Aureus Gin
## 1. BOTÂNICOS SELECIONADOS
- Ilustrações botânicas vetoriais detalhando cardamomo, coentro e botões de rosa.`
  },
  {
    id: "beh-08",
    refNumber: "Ref #BE08",
    titulo: "Kroma Studios — Produção Audiovisual & Efeitos Visuais VFX",
    plataforma: "Behance",
    categoria: "Gsap Skill",
    nicho: "Agências & Estúdios",
    estiloVisual: "Cinematic Dark Grid",
    tipoSite: "Portfólio",
    imagemUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1000&q=80",
    tags: ["VFX", "Comerciais de TV", "Cinema", "Color Grading"],
    score: 98,
    designMd: `# DESIGN.md — Kroma Studios
## 1. SHOWREEL FULLSCREEN
- Player de showreel com reprodução instantânea a 4k e som estéreo imersivo.`
  },
  {
    id: "beh-09",
    refNumber: "Ref #BE09",
    titulo: "Volare Aeronautica — Manutenção & Hangaragem Executiva",
    plataforma: "Behance",
    categoria: "Design DNA",
    nicho: "Automotivo & Frotas",
    estiloVisual: "Aero Steel Navy",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80",
    tags: ["Hangar", "Revisão de Turbinas", "ANAC", "Aviação"],
    score: 96,
    designMd: `# DESIGN.md — Volare Aeronautica
## 1. RIGOR E SEGURANÇA
- Selos de certificação e agendamento de parada técnica para helicópteros e jatos.`
  },
  {
    id: "beh-10",
    refNumber: "Ref #BE10",
    titulo: "Grand Cru Sommelier Academy — Escola Internacional de Vinhos",
    plataforma: "Behance",
    categoria: "Design DNA",
    nicho: "Educação & EdTech",
    estiloVisual: "Burgundy Classic Luxury",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80",
    tags: ["WSET", "Diploma de Sommelier", "Degustação às Cegas", "Cursos"],
    score: 95,
    designMd: `# DESIGN.md — Grand Cru Academy
## 1. CERTIFICAÇÃO WSET
- Grade de níveis 1, 2 e 3 com calendário de aulas presenciais e kits de aromas.`
  },
  {
    id: "beh-11",
    refNumber: "Ref #BE11",
    titulo: "Alquimia Spa Urbano — Banhos de Ofurô & Massoterapia",
    plataforma: "Behance",
    categoria: "Motion Design Skill",
    nicho: "Beleza & Estética",
    estiloVisual: "Stone & Candle Dark",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=80",
    tags: ["Ofurô", "Massagem Ayurvédica", "Aromaterapia", "Day Spa"],
    score: 94,
    designMd: `# DESIGN.md — Alquimia Spa
## 1. CARTÃO PRESENTE VIP
- Compra de voucher presente para casais com embalagem física de luxo entregue em casa.`
  },
  {
    id: "beh-12",
    refNumber: "Ref #BE12",
    titulo: "Solaris Yacht Club — Venda e Compartilhamento de Iates",
    plataforma: "Behance",
    categoria: "WebGL Spatial",
    nicho: "Hotelaria & Luxo",
    estiloVisual: "Maritime Obsidian Gold",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1000&q=80",
    tags: ["Iates 60 Pés", "Propriedade Fracionada", "Marina", "Náutica"],
    score: 97,
    designMd: `# DESIGN.md — Solaris Yacht Club
## 1. TOUR NÁUTICO 3D
- Visualização das cabines e convés dos iates com simulador de custos de marina.`
  },

  // ════════════════════════════════════════════════════════════════
  // ── PINTEREST (12 MOODBOARDS & ESTÉTICA DE ALTO IMPACTO) ──
  // ════════════════════════════════════════════════════════════════
  {
    id: "pin-01",
    refNumber: "Ref #PI01",
    titulo: "Lexis Wealth Protection — Blindagem e Sucessão Familiar",
    plataforma: "Pinterest",
    categoria: "Design DNA",
    nicho: "Advocacia & Jurídico",
    estiloVisual: "Black Velvet Minimal",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
    tags: ["Holding", "Sucessão", "Planejamento Familiar", "Sigilo"],
    score: 94,
    designMd: `# DESIGN.md — Lexis Wealth
## 1. ESTÉTICA BLACK VELVET
- Fundo escuro aveludado e tipografia em serifas puras transmitindo discrição.`
  },
  {
    id: "pin-02",
    refNumber: "Ref #PI02",
    titulo: "Precision Auto Detail — PPF & Ceramic Coating",
    plataforma: "Pinterest",
    categoria: "Bento Grid",
    nicho: "Automotivo & Frotas",
    estiloVisual: "Dark Workshop Tech",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
    tags: ["Ceramic Coating", "PPF", "Estética Automotiva", "Porsche"],
    score: 95,
    designMd: `# DESIGN.md — Precision Auto Detail
## 1. GRID MODULAR
- Tabela de comparação de repelência de água e proteção contra micro-riscos na pintura.`
  },
  {
    id: "pin-03",
    refNumber: "Ref #PI03",
    titulo: "The Royal Barber Club — Navalha & Lounge Masculino",
    plataforma: "Pinterest",
    categoria: "Bento Grid",
    nicho: "Beleza & Estética",
    estiloVisual: "Vintage Leather & Gold",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80",
    tags: ["Barbearia", "Lounge", "Navalha", "Clube do Whisky"],
    score: 95,
    designMd: `# DESIGN.md — The Royal Barber Club
## 1. AMBIENTAÇÃO DE LUXO
- Tons couro envelhecido e dourado com agendamento online e escolha da bebida.`
  },
  {
    id: "pin-04",
    refNumber: "Ref #PI04",
    titulo: "Minimal Loft Interiors — Arquitetura de Interiores Japandi",
    plataforma: "Pinterest",
    categoria: "Design DNA",
    nicho: "Imóveis & Arquitetura",
    estiloVisual: "Japandi Dark Wood",
    tipoSite: "Portfólio",
    imagemUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
    tags: ["Japandi", "Madeira Escura", "Iluminação Indireta", "Interiores"],
    score: 96,
    designMd: `# DESIGN.md — Minimal Loft Interiors
## 1. FUSÃO ESCANDINAVA E JAPONESA
- Linhas limpas, marcenaria ripada escura e paleta monocromática com textura mineral.`
  },
  {
    id: "pin-05",
    refNumber: "Ref #PI05",
    titulo: "Botanica Lab — Dermocosméticos Veganos & Skincare",
    plataforma: "Pinterest",
    categoria: "Motion Design Skill",
    nicho: "Beleza & Estética",
    estiloVisual: "Sage Green & Dark Clay",
    tipoSite: "E-commerce",
    imagemUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80",
    tags: ["Skincare", "Vegano", "Livre de Parabenos", "Clean Beauty"],
    score: 95,
    designMd: `# DESIGN.md — Botanica Lab
## 1. FORMULAÇÃO LIMPA
- Selos de sustentabilidade e embalagens recicláveis com compra por assinatura.`
  },
  {
    id: "pin-06",
    refNumber: "Ref #PI06",
    titulo: "Nocturne Cocktail Club — Coquetelaria Speakeasy Secreta",
    plataforma: "Pinterest",
    categoria: "Genjutsu",
    nicho: "Gastronomia & Restaurantes",
    estiloVisual: "Speakeasy Velvet Neon",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80",
    tags: ["Speakeasy", "Drinks Autorais", "Senha Secreta", "Porta Oculta"],
    score: 97,
    designMd: `# DESIGN.md — Nocturne Speakeasy
## 1. SENHA DE ENTRADA
- O cliente recebe uma senha rotativa no WhatsApp para digitar na porta do bar.`
  },
  {
    id: "pin-07",
    refNumber: "Ref #PI07",
    titulo: "Zenith Equestrian — Haras de Cavalos Árabes & Salto",
    plataforma: "Pinterest",
    categoria: "Design DNA",
    nicho: "Pet & Veterinária",
    estiloVisual: "British Equestrian Dark",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1000&q=80",
    tags: ["Haras", "Cavalos de Salto", "Garanhões", "Leilão"],
    score: 96,
    designMd: `# DESIGN.md — Zenith Equestrian
## 1. GENÉTICA DE CAMPEÕES
- Linhagem genealógica dos cavalos com vídeos dos títulos internacionais de salto.`
  },
  {
    id: "pin-08",
    refNumber: "Ref #PI08",
    titulo: "Solfire Microgrid — Baterias Residenciais Tipo Powerwall",
    plataforma: "Pinterest",
    categoria: "Bento Grid",
    nicho: "Sustentabilidade & Energia",
    estiloVisual: "Tesla Powerwall Dark",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80",
    tags: ["Bateria Residencial", "Blackout Shield", "Tesla Powerwall", "Off-Grid"],
    score: 96,
    designMd: `# DESIGN.md — Solfire Microgrid
## 1. RESILIÊNCIA ENERGÉTICA
- Simulação de dias de autonomia sem rede elétrica em caso de tempestades.`
  },
  {
    id: "pin-09",
    refNumber: "Ref #PI09",
    titulo: "Vortex Gaming Arena — Centro de Treinamento Esports 240Hz",
    plataforma: "Pinterest",
    categoria: "Tree.js Skills",
    nicho: "Música & Áudio",
    estiloVisual: "Cyber RGB Purple",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80",
    tags: ["Esports", "Bootcamp", "240Hz", "Fibra Dedicada"],
    score: 97,
    designMd: `# DESIGN.md — Vortex Arena
## 1. CONFIGURAÇÃO DOS MONITORES
- Reserva de cabines com monitores 360Hz e conexão dedicada para torneios.`
  },
  {
    id: "pin-10",
    refNumber: "Ref #PI10",
    titulo: "Le Mans Kart Club — Pista Indoor com Cronometragem F1",
    plataforma: "Pinterest",
    categoria: "Motion Design Skill",
    nicho: "Automotivo & Frotas",
    estiloVisual: "Racing Asfalto & Neon",
    tipoSite: "Landing Page",
    imagemUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80",
    tags: ["Kartódromo", "Cronometragem", "Bateria Privativa", "Podium"],
    score: 95,
    designMd: `# DESIGN.md — Le Mans Kart Club
## 1. TABELA DE TEMPOS AO VIVO
- Telemetria de volta mais rápida por piloto sincronizada com o ranking da pista.`
  },
  {
    id: "pin-11",
    refNumber: "Ref #PI11",
    titulo: "Sartoria Napoli — Camisas Italianas em Linho Puro",
    plataforma: "Pinterest",
    categoria: "Design DNA",
    nicho: "Moda & Joalheria",
    estiloVisual: "Linen Mineral Dark",
    tipoSite: "E-commerce",
    imagemUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
    tags: ["Camisas de Linho", "Napoli", "Colarinho Francês", "Algodão Egípcio"],
    score: 94,
    designMd: `# DESIGN.md — Sartoria Napoli
## 1. GUIA DE MEDIDAS VIRTUAL
- Questionário de porte físico (altura, peso, colarinho) recomendando o tamanho exato.`
  },
  {
    id: "pin-12",
    refNumber: "Ref #PI12",
    titulo: "Astral Sound — Fones de Ouvido Planares Magnéticos",
    plataforma: "Pinterest",
    categoria: "WebGL Spatial",
    nicho: "Música & Áudio",
    estiloVisual: "Audiophile Obsidian Wood",
    tipoSite: "E-commerce",
    imagemUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    tags: ["Audiófilo", "Planar Magnético", "Hi-Res Audio", "Madeira Nobre"],
    score: 98,
    designMd: `# DESIGN.md — Astral Sound
## 1. RESPOSTA DE FREQUÊNCIA
- Gráfico interativo de curva de resposta Harmônica de 5Hz a 45kHz sem distorção.`
  }
];

