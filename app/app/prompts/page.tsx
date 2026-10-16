"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles, Copy, Check, FileText, Code2, Search, ArrowUpRight,
  ShieldAlert, BookOpen, Layers, Terminal, Sliders, Cpu, Wand2,
  Building2, Phone, ShoppingBag, Landmark, Activity, Car, Dumbbell
} from "lucide-react";
import HardyMascot from "@/components/codemakers/HardyMascot";

export interface PromptItem {
  id: string;
  nicho: string;
  categoria: "CÓDIGO & LANDING PAGE" | "COPYWRITING & VENDAS" | "WEBGL & GSAP" | "SISTEMAS & DASHBOARD";
  motorIa: "Syre v2.5" | "Formoda Ultra" | "Titan AI" | "Nova Lux" | "Google Gemini";
  titulo: string;
  subtitulo: string;
  tags: string[];
  conteudo: string;
}

const PROMPT_DATABASE: PromptItem[] = [
  // ── 01. SAÚDE & CLÍNICAS MÉDICAS ──
  {
    id: "p-odonto",
    nicho: "Saúde & Clínicas",
    categoria: "CÓDIGO & LANDING PAGE",
    motorIa: "Syre v2.5",
    titulo: "Landing Page Odonto Prime de Alto Padrão",
    subtitulo: "Conversão voltada a procedimentos de R$ 15k a R$ 60k (Lentes e Implantes).",
    tags: ["Odontologia", "Lentes de Resina", "Implantes", "Landing Page", "Syre"],
    conteudo: `Atue como o motor Syre v2.5 especializado em Landing Pages de Luxo & Alta Conversão.
Crie o código completo em Next.js 15 (App Router), Tailwind CSS e Framer Motion para a landing page da clínica odontológica de estética avançada.

Diretrizes estritas de arquitetura e design:
1. PALETA: Fundo #07050f com placas em vidro acetinado #0c0a18/90, bordas 1px translúcidas (white/10) e realces em Violeta Real (#7c3aed, #a855f7).
2. HERO SECTION:
   - Título impactante: "A harmonia do seu sorriso moldada pela precisão milimétrica."
   - Subtítulo focado em exclusividade e atendimento sem filas com concierge dedicada.
   - Botão primário estilo Tesla pill: "Agendar Consulta Avaliativa VIP" com direcionamento WhatsApp.
3. SELETOR ANTES/DEPOIS:
   - Componente interativo com slider horizontal comparando o sorriso antes e após lentes de contato dental.
4. CORPO CLÍNICO:
   - Fichas dos cirurgiões-dentistas com títulos de mestrado/doutorado e fotos em tons neutros de luxo.
5. FORMULÁRIO DE TRIAGEM:
   - 3 passos rápidos: Procedimento desejado -> Melhor período para contato -> WhatsApp para envio do plano de tratamento.`
  },
  {
    id: "p-med-whats",
    nicho: "Saúde & Clínicas",
    categoria: "COPYWRITING & VENDAS",
    motorIa: "Google Gemini",
    titulo: "Script de Abordagem WhatsApp para Clínicas Médicas",
    subtitulo: "Abordagem consultiva para secretárias e médicos proprietários.",
    tags: ["WhatsApp", "Saúde", "Decisores", "Script", "Gemini"],
    conteudo: `Você é o estrategista digital sênior da CODEHARD operando no motor Google Gemini.
Escreva um script de abordagem consultiva para enviar no WhatsApp do Dr. [Nome do Médico], proprietário da [Nome da Clínica] em [Cidade].

Critérios indispensáveis:
- Tom respeitoso, ético e condizente com a sobriedade médica (sem parecer panfletagem amadora).
- Elogiar a reputação técnica da clínica na região.
- Apontar sutilmente que o site atual deles é lento no mobile e perde pacientes para clínicas concorrentes no Google.
- Oferecer uma prévia interativa já montada especificamente com a identidade visual da clínica dele.
- Fechamento leve: "Posso enviar o link da demonstração de 45 segundos para o senhor dar uma olhada sem nenhum compromisso?"`
  },
  {
    id: "p-clinica-dermatologia",
    nicho: "Saúde & Clínicas",
    categoria: "CÓDIGO & LANDING PAGE",
    motorIa: "Syre v2.5",
    titulo: "Dermatologia Estética & Protocolos Rejuvenescedores",
    subtitulo: "Experiência estética sofisticada com foco em protocolos de harmonização e laser.",
    tags: ["Dermatologia", "Harmonização", "Laser", "Syre"],
    conteudo: `Desenvolva a landing page para um Instituto de Dermatologia & Laser de luxo.
Motor Alvo: Syre v2.5 (Landing Pages de Luxo & Alta Conversão).

Requisitos essenciais:
- Fundo dark obsidian com vidro fumê e detalhes em lavanda metálico (#a855f7).
- Grade de tratamentos: Ultraformer MPT, Bioestimuladores de Colágeno, Laser Lavieen e Harmonização Facial Sutil.
- Depoimentos em carrossel elegante com avaliação 5.0 estrelas Google.
- Chamada direta para recepção VIP via WhatsApp com concierge de agendamento.`
  },

  // ── 02. GASTRONOMIA & RESTAURANTES ──
  {
    id: "p-sushi",
    nicho: "Gastronomia & Restaurantes",
    categoria: "CÓDIGO & LANDING PAGE",
    motorIa: "Titan AI",
    titulo: "Cardápio Digital & Reservas para Sushi Lounge Omakase",
    subtitulo: "Experiência gastronômica com eliminação total de taxas do iFood.",
    tags: ["Japonês", "Omakase", "Cardápio Digital", "Reservas", "Titan AI"],
    conteudo: `Desenvolva uma página moderna para um restaurante japonês contemporâneo e Omakase de luxo.
Motor: Titan AI (E-commerce & Cardápios Interativos).
Framework: Next.js 15, Tailwind CSS, Lucide React e Radix UI.

Requisitos de layout:
1. ESTÉTICA: Dark Minimalist japonês. Fundo preto carvão (#060608), tipografia grotesk estendida e detalhes em dourado champagne e violeta escuro.
2. HERO: Vídeo ou carrossel com cortes precisos de salmão e atum bluefin.
3. CARDÁPIO INTERATIVO COM FILTROS:
   - Abas: "Menu Degustação", "Sashimis Especiais", "Niguiris Trufados", "Drinks & Saquês".
   - Cada prato com foto em alta resolução, descrição detalhada dos insumos e botão de pedido direto.
4. MÓDULO DE RESERVA DE MESAS:
   - Seletor de data, quantidade de pessoas e turno (19h ou 21h30).
   - Confirmação via mensagem estruturada para o WhatsApp da recepção.`
  },
  {
    id: "p-pizzaria-napolitana",
    nicho: "Gastronomia & Restaurantes",
    categoria: "CÓDIGO & LANDING PAGE",
    motorIa: "Titan AI",
    titulo: "Cardápio Interativo & Checkout WhatsApp para Pizzaria Napolitana",
    subtitulo: "Fluxo de pedido ágil com cálculo de carrinho e envio em 1 clique para o WhatsApp da pizzaria.",
    tags: ["Pizzaria", "Delivery", "Carrinho WhatsApp", "Titan AI"],
    conteudo: `Crie a aplicação de cardápio digital e pedidos diretos para uma Pizzaria Artesanal Napolitana de fermentação lenta.
Motor: Titan AI (E-commerce & Cardápios Interativos).

Funcionalidades obrigatórias:
- Catálogo visual de pizzas clássicas, especiais e doces com tags de insumos italianos (Fior di Latte, Pomodoro San Marzano).
- Seletor de massa (Tradicional ou Integral) e borda recheada.
- Mini-carrinho flutuante com cálculo automático de subtotal e taxa de entrega por bairro.
- Botão "Finalizar Pedido via WhatsApp" que formata a mensagem com endereço e forma de pagamento.`
  },

  // ── 03. ADVOCACIA & ESCRITÓRIOS JURÍDICOS ──
  {
    id: "p-adv-tributario",
    nicho: "Advocacia & Jurídico",
    categoria: "CÓDIGO & LANDING PAGE",
    motorIa: "Nova Lux",
    titulo: "Portal Institucional de Advocacia Tributária & Holding",
    subtitulo: "Autoridade corporativa para fechamento de contratos de alta rentabilidade.",
    tags: ["Direito Tributário", "Holding", "Jurídico", "Autoridade", "Nova Lux"],
    conteudo: `Atue como o motor Nova Lux especialista em Design Editorial & Estúdios Criativos.
Crie o código completo da página principal para um escritório de Advocacia Tributária e Proteção Patrimonial Familiar.

Diretrizes:
1. ESTÉTICA: Swiss Minimalist escuro (#080a14), tipografia Inter + Playfair Display, cartões em titânio acetinado com bordas finas.
2. NÚMEROS DE IMPACTO:
   - Grid com contadores animados: "+R$ 450M economizados em tributos", "20+ anos de atuação", "98.4% de decisões favoráveis".
3. ÁREAS DE ATUAÇÃO COM BENTO GRID:
   - Recuperação de Créditos Tributários.
   - Planejamento Sucessório & Holdings Familiares no Agro.
   - Defesa em Execuções Fiscais Complexas.
4. CHAMADA PARA AÇÃO SIGILOSA:
   - Formulário com selo de confidencialidade advocatícia e agendamento direto com sócio sênior.`
  },
  {
    id: "p-family-office",
    nicho: "Finanças & Investimentos",
    categoria: "CÓDIGO & LANDING PAGE",
    motorIa: "Nova Lux",
    titulo: "Portal Institucional para Gestão de Patrimônio & Family Office",
    subtitulo: "Visual sóbrio, editorial e discreto para atendimento a famílias de alto patrimônio líquido.",
    tags: ["Family Office", "Wealth", "Editorial", "Nova Lux"],
    conteudo: `Desenvolva a presença digital de uma gestora de patrimônio familiar (Multi-Family Office).
Motor: Nova Lux (Design Editorial & Estúdios Criativos).

Especificações:
- Paleta monocromática com toques de grafite e violeta imperial (#581c87).
- Tipografia serifada clássica combinada com numerais modernos monoespaçados.
- Seções de Governança, Sucessão Patrimonial e Alocação Global de Ativos.
- Canal seguro e encriptado para solicitação de reunião confidencial.`
  },

  // ── 04. IMOBILIÁRIAS & CONSTRUTORAS DE ALTO PADRÃO ──
  {
    id: "p-imoveis-luxo",
    nicho: "Imóveis & Construção",
    categoria: "WEBGL & GSAP",
    motorIa: "Syre v2.5",
    titulo: "Showcase Imobiliário com Tour 3D & WebGL",
    subtitulo: "Apresentação cinematográfica de condomínios fechados e coberturas.",
    tags: ["Imobiliária", "Three.js", "WebGL", "Mansões", "Syre"],
    conteudo: `Crie um componente de vitrine de imóveis de luxo em React Three Fiber (@react-three/fiber + Drei) e Tailwind CSS.
Motor: Syre v2.5 (Landing Pages de Luxo & Alta Conversão).

Funcionalidades:
1. CENA 3D INTERATIVA:
   - Edifício ou mansão renderizada em wireframe holográfico violeta que reage ao movimento do cursor.
   - Hotspots clicáveis nos pontos-chave (Piscina de Borda Infinita, Heliponto, Suíte Master).
2. CAROUSEL LATERAL:
   - Informações da unidade selecionada: Metragem (m²), Vagas, Suítes e Preço de Lançamento.
   - Botão para download de planta humanizada e agendamento com corretor VIP.`
  },

  // ── 05. AUTOMOTIVO & ESTÉTICA DE SUPERCARROS ──
  {
    id: "p-auto-detail",
    nicho: "Automotivo & Frotas",
    categoria: "CÓDIGO & LANDING PAGE",
    motorIa: "Syre v2.5",
    titulo: "Centro de Estética Automotiva, PPF & Blindagem",
    subtitulo: "Valorização de supercarros com pacotes de proteção cerâmica e envelopamento.",
    tags: ["PPF", "Blindagem", "Estética Automotiva", "Supercarros", "Syre"],
    conteudo: `Desenvolva a página de um estúdio automotivo especializado em PPF (Paint Protection Film), Vitrificação Cerâmica e Blindagem.
Motor: Syre v2.5 (Luxo & Conversão).
Cores: Preto fibra de carbono (#050508) com realces em violeta elétrico (#a855f7) e titânio.

Seções fundamentais:
1. HERO: Título "A armadura invisível para o seu veículo exótico."
2. TABELA COMPARATIVA DE PROTEÇÃO:
   - Comparação entre Cera Comum vs Vitrificação vs Película PPF Regenerativa.
3. CALCULADORA DE ORÇAMENTO INSTANTÂNEO:
   - Escolha do porte do carro (Hatch / Sedan / SUV / Superesportivo) -> Escolha do pacote -> Botão para confirmar valor no WhatsApp.`
  },

  // ── 06. SAAS & SISTEMAS WEB B2B ──
  {
    id: "p-saas-dash",
    nicho: "SaaS & AI",
    categoria: "SISTEMAS & DASHBOARD",
    motorIa: "Formoda Ultra",
    titulo: "Dashboard de Telemetria com Bento Grid & Recharts",
    subtitulo: "Interface executiva completa com gráficos em tempo real e dark mode.",
    tags: ["Dashboard", "SaaS", "Recharts", "Bento Grid", "Formoda"],
    conteudo: `Escreva o código de um Dashboard completo em Next.js 15, Tailwind CSS e Recharts.
Motor: Formoda Ultra (Dark Bento Grid & SaaS Moderno).
Estilo: Tesla Cockpit Dark Glass (#0a0818 com backdrop-filter blur 20px).

Módulos do Dashboard:
1. 4 Cards de Métricas Principais (MRR, Clientes Ativos, CAC, LTV) com variações percentuais em verde esmeralda.
2. Gráfico de Linha de Faturamento Mensal com gradiente violeta sob a curva.
3. Feed de Atividades Recentes com status em tempo real (Novas vendas, Leads capturados).
4. Tabela de Últimos Clientes com paginação e busca instantânea.`
  },
  {
    id: "p-barbearia-vip",
    nicho: "Estética & Beleza",
    categoria: "CÓDIGO & LANDING PAGE",
    motorIa: "Formoda Ultra",
    titulo: "Landing Page & Agendamento para Barbearia Premium",
    subtitulo: "Layout moderno estilo Bento Grid com escolha de profissional e horário.",
    tags: ["Barbearia", "Agendamento", "Bento Grid", "Formoda"],
    conteudo: `Desenvolva uma landing page impactante para uma barbearia premium e club masculino.
Motor: Formoda Ultra (Dark Bento Grid & SaaS Moderno).

Requisitos:
- Bento Grid com serviços: Corte Degrade, Barboterapia, Pigmentação e Day Grooming.
- Seletor visual de barbeiro com foto, especialidade e calendário de horários livres.
- Integração de agendamento automático com confirmação direta via WhatsApp.`
  },
  {
    id: "p-crossfit-performance",
    nicho: "Fitness & Performance",
    categoria: "CÓDIGO & LANDING PAGE",
    motorIa: "Formoda Ultra",
    titulo: "Centro de Treinamento, CrossFit & Alta Performance",
    subtitulo: "Página eletrizante com grade horária de treinos, tabela de planos e aula experimental.",
    tags: ["CrossFit", "Academia", "Planos", "Formoda"],
    conteudo: `Construa a landing page para um Centro de Alta Performance Física e Box de CrossFit.
Motor: Formoda Ultra (Dark Bento Grid & SaaS Moderno).

Elementos:
- Tabela de Horários interativa dividida por modalidades (WOD, Levantamento Olímpico, Ginástica e Endurance).
- Comparativo de planos com badge de recomendação para o plano Anual VIP.
- Formulário rápido para agendamento de Aula Experimental Gratuita.`
  },

  // ── 07. E-COMMERCE & LUXURY DROPS ──
  {
    id: "p-ecommerce-streetwear",
    nicho: "E-commerce & Moda",
    categoria: "CÓDIGO & LANDING PAGE",
    motorIa: "Titan AI",
    titulo: "E-commerce Drop System & Catálogo Dinâmico para Streetwear",
    subtitulo: "Vitrine estilo Balenciaga/Kith com contador regressivo de drop e checkout rápido.",
    tags: ["E-commerce", "Moda", "Drop", "Titan AI"],
    conteudo: `Desenvolva a vitrine virtual para uma marca de moda streetwear de edição limitada.
Motor: Titan AI (E-commerce & Cardápios Interativos).

Recursos fundamentais:
- Contador regressivo para o próximo Drop de coleções limitadas.
- Grade de produtos com efeito hover de visualização de modelo vestindo a peça.
- Seletor de tamanhos (P, M, G, GG) com indicação de estoque em tempo real.
- Gaveta lateral de carrinho com checkout integrado e cálculo de frete.`
  },
  {
    id: "p-joalheria-suica",
    nicho: "Joalherias & Luxo",
    categoria: "CÓDIGO & LANDING PAGE",
    motorIa: "Nova Lux",
    titulo: "Vitrine Imersiva para Joalheria & Alta Relojoaria",
    subtitulo: "Tipografia monumental, detalhes em ouro branco e fotografia de joias de alta precisão.",
    tags: ["Joalheria", "Relógios", "Luxo", "Nova Lux"],
    conteudo: `Crie a landing page para uma joalheria contemporânea e revendedora de relógios suíços.
Motor: Nova Lux (Design Editorial & Estúdios Criativos).

Especificações:
- Fotografia em primeiro plano com zoom tátil suave nos diamantes e caixas de safira.
- Certificação de procedência e garantia vitalícia de autenticidade.
- Botão discreto para atendimento privativo com joalheiro especialista.`
  },

  // ── 08. ESTRATÉGIA COMERCIAL & SCRIPTS DE VENDAS ──
  {
    id: "p-proposta-irrecusavel",
    nicho: "Estratégia & Vendas",
    categoria: "COPYWRITING & VENDAS",
    motorIa: "Google Gemini",
    titulo: "Estrutura de Proposta Comercial Irrecusável de Site",
    subtitulo: "Modelo de proposta em PDF/Apresentação para contratos de R$ 3.000 a R$ 12.000.",
    tags: ["Proposta", "Fechamento", "Contrato", "Alto Valor", "Gemini"],
    conteudo: `Você é o diretor comercial mais premiado do mercado de tecnologia web operando no motor Google Gemini.
Crie o roteiro completo de uma Proposta Comercial Irrecusável para apresentação ao cliente [Nome do Cliente / Empresa].

Estrutura em 6 etapas:
1. DIAGNÓSTICO DO CENÁRIO ATUAL: O custo invisível de não ter um site moderno (clientes perdidos diariamente).
2. O NOVO ECOSSISTEMA: O que será entregue (Design exclusivo modelo Tesla/CODEHARD, carregamento em <1s, mobile-first, WhatsApp integrado).
3. PRAZO DE ENTREGA RELÂMPAGO: Entrega em até 5 dias úteis com protótipo validado.
4. INVESTIMENTO & PARCELAMENTO: 2 opções de planos (Essencial e Dominação Total).
5. GARANTIA BLINDADA DE SATISFAÇÃO: Ajustes ilimitados até a aprovação 100%.
6. BÔNUS EXCLUSIVO DE FECHAMENTO IMEDIATO: Manutenção gratuita por 3 meses se assinado hoje.`
  },
  {
    id: "p-script-objecoes",
    nicho: "Estratégia & Vendas",
    categoria: "COPYWRITING & VENDAS",
    motorIa: "Google Gemini",
    titulo: "Matriz de Quebra de Objeções para Fechamento de Sites no WhatsApp",
    subtitulo: "Respostas cirúrgicas para 'Está caro', 'Já tenho Instagram' e 'Vou pensar'.",
    tags: ["Objeções", "WhatsApp", "Fechamento", "Gemini"],
    conteudo: `Você é o especialista em fechamento de vendas de tecnologia B2B no Google Gemini da CODEHARD.
Forneça a matriz de respostas prontas para as 3 maiores objeções de donos de negócios:

1. "Está muito caro":
Como ancorar valor demonstrando que 1 único novo cliente do procedimento/produto dele já paga o site inteiro.
2. "Meu Instagram já é suficiente":
Como demonstrar com dados que quem busca no Google tem intenção de compra imediata, enquanto no Instagram a conversão de novos clientes é passiva.
3. "Vou pensar e te retorno":
Como criar urgência com elegância, oferecendo garantia de bônus de hospedagem ou protótipo gratuito somente até o fim do dia.`
  }
];

export default function CodeHardPromptsPage() {
  const [activeTab, setActiveTab] = useState<"lab" | "gerador" | "skills">("lab");
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem>(PROMPT_DATABASE[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNicho, setSelectedNicho] = useState<string>("Todos");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("Todas");
  const [selectedMotor, setSelectedMotor] = useState<string>("Todos");
  const [copied, setCopied] = useState(false);

  // Estados do Gerador Inteligente por Nicho
  const [genNicho, setGenNicho] = useState("Clínica Odontológica");
  const [genTipo, setGenTipo] = useState("Landing Page de Alta Conversão");
  const [genMotor, setGenMotor] = useState("Syre v2.5");
  const [genEstilo, setGenEstilo] = useState("Tesla Obsidian & Royal Purple");
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);

  // Nichos disponíveis
  const nichosDisponiveis = useMemo(() => ["Todos", ...Array.from(new Set(PROMPT_DATABASE.map(p => p.nicho)))], []);

  // Filtros
  const filteredPrompts = useMemo(() => {
    return PROMPT_DATABASE.filter((p) => {
      if (selectedNicho !== "Todos" && p.nicho !== selectedNicho) return false;
      if (selectedCategoria !== "Todas" && p.categoria !== selectedCategoria) return false;
      if (selectedMotor !== "Todos" && p.motorIa !== selectedMotor) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = p.titulo.toLowerCase().includes(q);
        const matchesSub = p.subtitulo.toLowerCase().includes(q);
        const matchesTags = p.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSub && !matchesTags) return false;
      }

      return true;
    });
  }, [selectedNicho, selectedCategoria, selectedMotor, searchTerm]);

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleGenerateCustomPrompt = () => {
    const promptCriado = `Atue como o motor ${genMotor} da CODEHARD especializado em ${genTipo}.
Desenvolva uma solução de nível internacional especificamente para o nicho de ${genNicho}.

Motor Ativo: ${genMotor}
Direção de Arte: ${genEstilo}

1. ESPECIFICAÇÃO DE DESIGN & TOKENS:
- Fundo Obsidiana Dark (#07050f), placas em vidro lapidado (#0c0a18) com blur de 24px.
- Bordas de 1px com gradiente sutil de luz (rgba(255,255,255,0.08) para rgba(124,58,237,0.3)).
- Acentos em Roxo Real (#7c3aed, #a855f7) com iluminação difusa.
- Tipografia: Inter Tight para títulos e JetBrains Mono para telemetria e dados.

2. ESTRUTURA DE SEÇÕES DE ALTA CONVERSÃO:
- Hero Section com proposta única de valor para ${genNicho}, prova social tangível e botão WhatsApp em estilo Tesla Pill.
- Seção de Diferenciais em Bento Grid com 3 cartões modulares.
- Demonstração visual de autoridade e depoimentos de clientes satisfeitos.
- Tabela de planos ou catálogo de serviços com destaque para o mais rentável.
- Formulário minimalista de captura rápida em 2 etapas.

3. CÓDIGO & TECNOLOGIAS:
- Código completo em Next.js 15 (App Router), Tailwind CSS e Framer Motion.
- Zero componentes genéricos ou placeholders vazios. Escreva os textos completos e persuasivos adaptados para ${genNicho}.`;

    setGeneratedPrompt(promptCriado);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ── TOP TELEMETRY BAR: TESLA COCKPIT HEADER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Banner Identidade Prompt Lab */}
        <div className="lg:col-span-6 p-6 rounded-[28px] bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] border border-purple-400/30 flex items-center justify-between shadow-[0_20px_40px_rgba(124,58,237,0.35)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-200 animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold">
                ENGENHARIA REVERSA DE PROMPTS · ACERVO OFICIAL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Prompt Lab.</h1>
            <p className="text-xs text-purple-100/90 mt-1 max-w-md">
              Milhares de instruções testadas para Syre v2.5, Formoda Ultra, Titan AI, Nova Lux e Google Gemini divididas por nicho de atuação e modelos.
            </p>
          </div>

          <div className="hidden sm:block w-24 h-24">
            <HardyMascot variant="prompts" className="w-full h-full" />
          </div>
        </div>

        {/* Métricas do Acervo */}
        <div className="lg:col-span-3 p-6 rounded-[28px] bg-[#0a0815]/90 border border-white/[0.08] flex flex-col justify-between shadow-xl">
          <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">PROMPTS CALIBRADOS</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black font-mono text-white">{PROMPT_DATABASE.length}</span>
            <span className="text-xs text-purple-400 font-mono font-bold">Modelos Prontos</span>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Filtráveis por nicho, motor e tecnologia
          </span>
        </div>

        {/* Taxa de Acerto de Código */}
        <div className="lg:col-span-3 p-6 rounded-[28px] bg-[#0a0815]/90 border border-white/[0.08] flex flex-col justify-between shadow-xl">
          <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">FIDELIDADE TÉCNICA</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-400 font-mono">99.8%</span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Zero Alucinação</span>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Instruções calibradas para os 5 motores nativos CODEHARD
          </span>
        </div>
      </div>

      {/* ── SELETOR DE MODO (PROMPT LAB / GERADOR POR NICHO / SKILL VAULT) ── */}
      <div className="flex items-center gap-2 p-1.5 rounded-[22px] bg-[#0c0a18] border border-purple-900/30 w-fit">
        <button
          onClick={() => setActiveTab("lab")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "lab"
              ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4" /> Acervo por Nicho
        </button>

        <button
          onClick={() => setActiveTab("gerador")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "gerador"
              ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Wand2 className="w-4 h-4 text-purple-300" /> Gerador Inteligente por Nicho
        </button>

        <button
          onClick={() => setActiveTab("skills")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "skills"
              ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Cpu className="w-4 h-4" /> Skill Vault (Three.js & GSAP)
        </button>
      </div>

      {/* ── ABA 01: ACERVO POR NICHO COM FILTROS TESLA ── */}
      {activeTab === "lab" && (
        <div className="space-y-6">
          {/* Barra de Filtros */}
          <div className="p-4 rounded-[24px] bg-[#0c0a18]/95 border border-purple-500/25 shadow-xl flex flex-wrap items-center gap-3">
            {/* Campo de Busca */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar prompt por nicho ou objetivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#140f28] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Nicho Dropdown */}
            <div className="w-48">
              <select
                value={selectedNicho}
                onChange={(e) => setSelectedNicho(e.target.value)}
                className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {nichosDisponiveis.map((n) => (
                  <option key={n} value={n}>{n === "Todos" ? "Todos os Nichos" : n}</option>
                ))}
              </select>
            </div>

            {/* Motor Dropdown */}
            <div className="w-48">
              <select
                value={selectedMotor}
                onChange={(e) => setSelectedMotor(e.target.value)}
                className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Todos">Todos os Motores</option>
                <option value="Syre v2.5">Syre v2.5 (Luxo)</option>
                <option value="Formoda Ultra">Formoda Ultra (SaaS)</option>
                <option value="Titan AI">Titan AI (E-commerce)</option>
                <option value="Nova Lux">Nova Lux (Editorial)</option>
                <option value="Google Gemini">Google Gemini (Neural)</option>
              </select>
            </div>

            {/* Categoria */}
            <div className="w-48">
              <select
                value={selectedCategoria}
                onChange={(e) => setSelectedCategoria(e.target.value)}
                className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Todas">Todas as Categorias</option>
                <option value="CÓDIGO & LANDING PAGE">Código & Landing Page</option>
                <option value="COPYWRITING & VENDAS">Copywriting & Vendas</option>
                <option value="WEBGL & GSAP">WebGL & GSAP</option>
                <option value="SISTEMAS & DASHBOARD">Sistemas & Dashboard</option>
              </select>
            </div>
          </div>

          {/* Grid Principal: Lista à Esquerda + Inspetor à Direita */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
            {/* Lista de Prompts (5 colunas) */}
            <div className="lg:col-span-5 space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {filteredPrompts.map((p) => {
                const isSelected = selectedPrompt.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPrompt(p)}
                    className={`p-5 rounded-[24px] transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#160d33] border-2 border-purple-500 shadow-[0_0_25px_rgba(124,58,237,0.35)]"
                        : "bg-[#0c0a18] border border-purple-900/25 hover:border-purple-500/40"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="text-purple-400 font-bold uppercase">{p.nicho}</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-300 font-mono font-bold">
                        {p.motorIa}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">{p.titulo}</h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{p.subtitulo}</p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[9px] font-mono text-zinc-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inspetor de Prompt à Direita (7 colunas) */}
            <div className="lg:col-span-7 rounded-[28px] bg-[#0c0a18] border border-purple-900/30 p-6 md:p-8 flex flex-col justify-between shadow-2xl">
              <div className="space-y-6">
                {/* Header do Inspetor */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.06]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold">
                        {selectedPrompt.categoria}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">Motor Nativo: {selectedPrompt.motorIa}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mt-1">{selectedPrompt.titulo}</h2>
                    <p className="text-xs text-zinc-400 mt-1">{selectedPrompt.subtitulo}</p>
                  </div>

                  <button
                    onClick={() => handleCopyPrompt(selectedPrompt.conteudo)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all cursor-pointer whitespace-nowrap"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copiar Prompt
                      </>
                    )}
                  </button>
                </div>

                {/* Aviso de Restrição de Uso */}
                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-200">
                  <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span>
                    Aviso de Segurança: Prompt protegido por licença de uso comercial exclusivo para membros CODEHARD.
                  </span>
                </div>

                {/* Caixa de Código do Prompt Final */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Instrução calibrada para {selectedPrompt.motorIa}</span>
                    <span>Tokens: ~{Math.round(selectedPrompt.conteudo.length / 4)}</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#06040d] border border-purple-900/30 font-mono text-xs text-zinc-200 leading-relaxed max-h-[360px] overflow-y-auto whitespace-pre-wrap select-all">
                    {selectedPrompt.conteudo}
                  </div>
                </div>
              </div>

              {/* Dica de Aplicação */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Dica: Execute diretamente no Site Builder IA da CODEHARD ou no motor nativo Google Gemini.</span>
                <span className="text-purple-400 font-bold">100% Validado</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ABA 02: GERADOR INTELIGENTE POR NICHO & MODELO ── */}
      {activeTab === "gerador" && (
        <div className="p-6 md:p-8 rounded-[28px] bg-[#0c0a18] border border-purple-500/30 shadow-2xl space-y-8">
          <div className="max-w-xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">
              CONSTRUTOR DINÂMICO
            </span>
            <h2 className="text-2xl font-black text-white mt-1">
              Gerador de Prompts Mestres Sob Medida
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Selecione o nicho exato do seu cliente e monte uma instrução de alto impacto em segundos.
            </p>
          </div>

          {/* Controles de Configuração */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Nicho */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">1. Nicho de Mercado</label>
              <select
                value={genNicho}
                onChange={(e) => setGenNicho(e.target.value)}
                className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Clínica Odontológica">Clínica Odontológica</option>
                <option value="Restaurante Japonês & Sushi">Restaurante Japonês & Sushi</option>
                <option value="Advocacia Tributária & Holding">Advocacia Tributária & Holding</option>
                <option value="Imobiliária de Luxo & Mansões">Imobiliária de Luxo & Mansões</option>
                <option value="Estética Automotiva & PPF">Estética Automotiva & PPF</option>
                <option value="Academia de CrossFit & Performance">Academia de CrossFit & Performance</option>
                <option value="Joalheria & Relógios de Luxo">Joalheria & Relógios de Luxo</option>
                <option value="Startup de Automação & IA">Startup de Automação & IA</option>
              </select>
            </div>

            {/* Tipo de Solução */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">2. Tipo de Entrega</label>
              <select
                value={genTipo}
                onChange={(e) => setGenTipo(e.target.value)}
                className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Landing Page de Alta Conversão">Landing Page de Alta Conversão</option>
                <option value="Web App / Dashboard Executivo">Web App / Dashboard Executivo</option>
                <option value="Script de Abordagem no WhatsApp">Script de Abordagem no WhatsApp</option>
                <option value="Proposta Comercial Irrecusável">Proposta Comercial Irrecusável</option>
              </select>
            </div>

            {/* Motor de IA */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">3. Modelo de Inteligência</label>
              <select
                value={genMotor}
                onChange={(e) => setGenMotor(e.target.value)}
                className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Syre v2.5">Syre v2.5 (Luxo & Conversão)</option>
                <option value="Formoda Ultra">Formoda Ultra (Dark Bento & SaaS)</option>
                <option value="Titan AI">Titan AI (E-commerce & Catálogo)</option>
                <option value="Nova Lux">Nova Lux (Design Editorial & Estúdios)</option>
                <option value="Google Gemini">Google Gemini (Motor Neural & Código Rápido)</option>
              </select>
            </div>

            {/* Estilo Visual */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">4. Direção de Arte</label>
              <select
                value={genEstilo}
                onChange={(e) => setGenEstilo(e.target.value)}
                className="w-full bg-[#140f28] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Tesla Obsidian & Royal Purple">Tesla Obsidian & Royal Purple</option>
                <option value="Genjutsu Cyberpunk Dark">Genjutsu Cyberpunk Dark</option>
                <option value="White Pearl & Titanium Minimal">White Pearl & Titanium Minimal</option>
                <option value="Industrial Dark Brutalism">Industrial Dark Brutalism</option>
              </select>
            </div>
          </div>

          {/* Botão de Geração */}
          <button
            onClick={handleGenerateCustomPrompt}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#9333ea] text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 transition-all cursor-pointer"
          >
            <Wand2 className="w-4 h-4" /> Sintetizar Prompt Especializado
          </button>

          {/* Resultado Gerado */}
          {generatedPrompt && (
            <div className="space-y-4 pt-4 border-t border-white/[0.08]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-purple-400 font-bold uppercase">
                  Prompt Mestre Gerado com Sucesso
                </span>

                <button
                  onClick={() => handleCopyPrompt(generatedPrompt)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copiar para a Área de Transferência
                    </>
                  )}
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-[#06040d] border border-purple-900/40 font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap select-all">
                {generatedPrompt}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ABA 03: SKILL VAULT (THREE.JS & GSAP TEMPLATES) ── */}
      {activeTab === "skills" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-[28px] bg-[#0c0a18] border border-purple-900/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">THREE.JS / WEBGL</span>
              <button
                onClick={() => handleCopyPrompt(`import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";

export default function CyberScene() {
  return (
    <div className="h-[500px] w-full bg-[#05030a] rounded-3xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#a855f7" intensity={2} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1.5} />
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
          <mesh>
            <octahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color="#7c3aed" wireframe emissive="#6d28d9" emissiveIntensity={0.8} />
          </mesh>
        </Float>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}`)}
                className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> Copiar Código
              </button>
            </div>
            <h3 className="text-base font-bold text-white">Cena Espacial Flutuante R3F</h3>
            <p className="text-xs text-zinc-400">
              Template pronto com octaedro wireframe holográfico, campo estelar com 3.000 nós e rotação inercial a 60fps.
            </p>
          </div>

          <div className="p-6 rounded-[28px] bg-[#0c0a18] border border-purple-900/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">GSAP / SCROLLTRIGGER</span>
              <button
                onClick={() => handleCopyPrompt(`import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapPinSection(ref: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".pin-card", {
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=2000",
          scrub: 1,
          pin: true,
        },
        y: -100,
        opacity: 1,
        stagger: 0.3,
      });
    }, ref);

    return () => ctx.revert();
  }, [ref]);
}`)}
                className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> Copiar Código
              </button>
            </div>
            <h3 className="text-base font-bold text-white">ScrollTrigger Pin & Stagger</h3>
            <p className="text-xs text-zinc-400">
              Hook customizado React para fixar uma seção na tela durante a rolagem com cascata cinematográfica de cards.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
