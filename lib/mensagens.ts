// Gerador de mensagem ultra-rápido: Gemini Flash (com teto estrito de 1.8s) + Templates Nativo Persuasivo (<1ms)
import { getCategoria } from "./categorias";

export type MsgInput = {
  nome: string;
  categoria: string;
  cidade: string;
  pais: string;
  temSite: boolean;
  temInstagram: boolean;
  temEmail: boolean;
  negocio: { negocio_nome: string; servico: string; diferenciais: string };
  canal?: "email" | "instagram" | "whatsapp";
};

export function idiomaDoPais(pais: string, cidade: string): string {
  if (!pais && !cidade) return "português do Brasil";
  return `o idioma oficial e nativo de ${cidade}, ${pais}`;
}

function promptMsg(l: MsgInput): string {
  const cat = getCategoria(l.categoria)?.label || l.categoria;
  const idiomaLocal = l.pais || l.cidade || "Brasil";
  
  let contextoCanal = "uma mensagem de primeira abordagem (WhatsApp ou e-mail)";
  if (l.canal === "whatsapp") {
    contextoCanal = "uma mensagem de primeira abordagem exclusiva para WhatsApp. Use emojis, seja muito amigável e use formatação do WhatsApp como *negrito* ou _itálico_ sem exageros";
  } else if (l.canal === "instagram") {
    contextoCanal = "uma curtíssima mensagem de primeira abordagem para Direct do Instagram (DM). Use linguagem informal, emojis e vá direto ao ponto sem enrolação (máximo 3 frases)";
  } else if (l.canal === "email") {
    contextoCanal = "uma mensagem de primeira abordagem por e-mail corporativo. Inclua um 'Assunto:' na primeira linha. Seja educado, direto e profissional";
  }

  return `Você é um redator de prospecção B2B nativo do país/cidade do cliente. Escreva ${contextoCanal} apresentando a empresa ${l.negocio.negocio_nome}, que oferece: ${l.negocio.servico}. Diferenciais: ${l.negocio.diferenciais}.

Destinatário: "${l.nome}", um(a) ${cat.toLowerCase()} em ${l.cidade} (${l.pais}).
Sinais: ${l.temSite ? "já tem site (foco em melhorar/renovar)" : "NÃO tem site próprio (principal gancho)"}; ${l.temInstagram ? "tem Instagram" : "não tem Instagram"}; ${l.temEmail ? "tem e-mail público" : "sem e-mail público"}.

Regras RIGOROSAS:
1. IDIOMA OBRIGATÓRIO: A mensagem DEVE estar escrita EXCLUSIVAMENTE no idioma oficial da localidade (${idiomaLocal}).
2. 3 a 4 frases, tom humano, direto e altamente persuasivo.
3. Termine com uma pergunta simples de fechamento.
4. Responda SOMENTE com o texto da mensagem final, sem aspas nem comentários adicionais.`;
}

function templateMsg(l: MsgInput): string {
  const cat = getCategoria(l.categoria)?.label || l.categoria || "empresa";
  const catMin = cat.toLowerCase();
  const p = (l.pais || "").toLowerCase();
  const c = l.cidade || "sua cidade";
  const nomeEmpresa = l.nome && l.nome !== "Empresa Desconhecida" ? l.nome : "equipe";
  const meuNegocio = l.negocio.negocio_nome || "HardZ Sites";
  const canal = l.canal || "whatsapp";

  const isPt = p.match(/brasil|brazil|portugal|angola|mozambique|cape verde/) || !p;
  const isEsp = p.match(/spain|españa|mexico|colombia|argentina|peru|chile|ecuador|guatemala|cuba|bolivia|dominican|honduras|paraguay|salvador|nicaragua|costa rica|puerto rico|panama|uruguay|venezuela/);
  const isFr = p.match(/france|frança|belgium|belgique|switzerland|suisse|canada|senegal/);
  const isIt = p.match(/italy|itália|italia/);
  const isDe = p.match(/germany|alemanha|deutschland|austria/);

  // ------------------ PORTUGUÊS (BRASIL / PORTUGAL) ------------------
  if (isPt) {
    if (canal === "whatsapp") {
      if (!l.temSite) {
        return `Olá, ${nomeEmpresa}! Tudo bem? 👋\n\nAqui é da *${meuNegocio}*. Vi que vocês têm uma presença muito boa em ${c}, mas ainda não contam com um site próprio oficial indexado no topo do Google.\n\nNós criamos sites modernos e rápidos que transformam visitantes em clientes diários. Posso te enviar uma prévia rápida de como ficaria o site de vocês, sem compromisso? 🚀`;
      } else {
        return `Olá, ${nomeEmpresa}! Tudo bem? 👋\n\nAqui é da *${meuNegocio}*. Estive olhando o trabalho de vocês em ${c} e vejo um potencial gigante para acelerar as vendas e captação de clientes pelo site e Google.\n\nModernizamos e otimizamos páginas para converter muito mais. Posso te mandar uma análise rápida de 2 minutos para vocês darem uma olhada? 🚀`;
      }
    } else if (canal === "instagram") {
      if (!l.temSite) {
        return `Opa, tudo bem? 👋 Vi o perfil da ${nomeEmpresa} e adorei o trabalho de vocês em ${c}! Notei que vocês ainda não têm site oficial próprio no link da bio. Criamos páginas modernas que colocam o negócio no topo do Google. Posso mandar uma prévia rápida sem compromisso?`;
      } else {
        return `Opa, tudo bem? 👋 Vi o perfil da ${nomeEmpresa} em ${c}! Parabéns pelo posicionamento. Nós ajudamos negócios locais a multiplicar as conversões do site e atrair mais clientes via Google. Podemos bater um papo rápido de 2 minutos?`;
      }
    } else {
      // E-mail corporativo
      const assunto = `Parceria estratégica para ${nomeEmpresa} em ${c} — ${meuNegocio}`;
      const corpo = `Olá, equipe da ${nomeEmpresa}!\n\nEstive analisando o mercado de ${catMin} em ${c} e notei o excelente posicionamento de vocês.\n\nNa ${meuNegocio}, somos especialistas em desenvolvimento de sites profissionais de alta conversão e presença no Google. ${!l.temSite ? "Percebi que vocês ainda não possuem um domínio próprio ativo, o que representa uma oportunidade imediata de captar novos clientes todos os dias." : "Ajudamos empresas consolidadas a renovar e acelerar a captação de clientes pela internet."}\n\nPodemos agendar uma breve conversa de 5 minutos esta semana para eu apresentar um diagnóstico prático, sem custo?\n\nAtenciosamente,\nEquipe ${meuNegocio}`;
      return `Assunto: ${assunto}\n\n${corpo}`;
    }
  }

  // ------------------ ESPANHOL ------------------
  if (isEsp) {
    if (canal === "whatsapp") {
      return `¡Hola, ${nomeEmpresa}! 👋\n\nTe escribo de *${meuNegocio}*. Noté el excelente trabajo de su ${catMin} en ${c}. ${!l.temSite ? "Vimos que aún no cuentan con un sitio web oficial para captar clientes en Google." : "Nos especializamos en maximizar las conversiones y clientes desde la web."}\n\n¿Puedo enviarte una vista previa sin compromiso de cómo quedaría su página web optimizada? 🚀`;
    } else if (canal === "instagram") {
      return `¡Hola! 👋 Vi el perfil de ${nomeEmpresa} en ${c}. Excelente trabajo. ¿Sabían que pueden captar muchos más clientes con un sitio web profesional propio? ¿Puedo enviarles una vista previa rápida sin compromiso?`;
    } else {
      return `Assunto: Propuesta para potenciar la presencia digital de ${nomeEmpresa}\n\nEstimado equipo de ${nomeEmpresa}:\n\nLes escribo desde ${meuNegocio}. Analizando los negocios de ${catMin} en ${c}, noté una gran oportunidad para atraer más clientes directos con un sitio web de alta conversión.\n\n¿Tendrían 5 minutos esta semana para mostrarles una propuesta rápida y sin compromiso?\n\nSaludos cordiales,\n${meuNegocio}`;
    }
  }

  // ------------------ INGLÊS / GLOBAL ------------------
  if (canal === "whatsapp") {
    return `Hi, ${nomeEmpresa}! 👋\n\nI'm reaching out from *${meuNegocio}*. I saw your great presence in ${c}. ${!l.temSite ? "I noticed you don't have an official website yet to capture Google search traffic." : "We build high-converting websites designed to turn visitors into paying customers."}\n\nCan I send you a quick preview of what a modern website for your business would look like, no strings attached? 🚀`;
  } else if (canal === "instagram") {
    return `Hey there! 👋 Loved your profile for ${nomeEmpresa} in ${c}! ${!l.temSite ? "Noticed you don't have a dedicated website link in bio yet." : "We help local businesses scale their online conversions."} Can I send you a quick preview of what we can do for you?`;
  } else {
    return `Assunto: Growth opportunity for ${nomeEmpresa} in ${c}\n\nHi team at ${nomeEmpresa},\n\nI came across your business in ${c} and was impressed by your presence. At ${meuNegocio}, we specialize in creating high-performance websites and Google local SEO that consistently generate new clients.\n\nWould you be open to a quick 5-minute chat this week to see a free prototype tailored for ${nomeEmpresa}?\n\nBest regards,\n${meuNegocio}`;
  }
}

export async function gerarMensagem(l: MsgInput, apiKey: string | null): Promise<{ texto: string; fonte: "gemini" | "template" }> {
  if (apiKey) {
    try {
      // Timeout estrito de 1800ms para nunca deixar o usuário esperando
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: promptMsg(l) }] }] }),
          signal: AbortSignal.timeout(1800),
        }
      );
      if (res.ok) {
        const json = await res.json();
        const texto = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (texto && texto.length > 20) return { texto, fonte: "gemini" };
      }
    } catch {
      // Cai no template instantâneo (< 1ms)
    }
  }
  return { texto: templateMsg(l), fonte: "template" };
}
