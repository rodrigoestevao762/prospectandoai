export function isEmailValidoParaB2B(email: string | null | undefined): boolean {
  if (!email || typeof email !== "string") return false;
  
  const l = email.toLowerCase().trim();
  if (!l.includes("@")) return false;
  
  const parts = l.split("@");
  if (parts.length !== 2) return false;
  
  const [user, domain] = parts;
  
  // Limites de tamanho
  if (l.length < 5 || l.length > 60) return false;
  
  // Bloquear extensões de arquivos e lixos de scraping
  const extensoesLixo = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".css", ".js", ".ttf", ".woff", ".pdf", ".mp4"];
  if (extensoesLixo.some(ext => l.endsWith(ext))) return false;
  
  // Bloquear domínios famosos de tecnologia / redes sociais que nunca são o e-mail de contato real da empresa
  // ATENÇÃO: yahoo.com é provedor de email real! Foi removido da lista de bloqueio.
  const dominiosFalsos = [
    "duckduckgo.com", "sentry.io", "example.com", "w3.org", "sijax", "bing.com",
    "google.com", "microsoft.com", "facebook.com", "instagram.com", "twitter.com",
    "apple.com", "cloudflare.com", "ifood.com", "tripadvisor.com", "tiktok.com",
    "linkedin.com", "amazon.com", "qwant.com", "email.com", "teste.com", "test.com",
    "site.com", "suaempresa.com", "dominio.com", "domain.com", "yourdomain.com", "wixsite.com",
    "github.com", "naoresponda.com"
  ];
  if (dominiosFalsos.some(d => domain === d || domain.endsWith("." + d))) return false;
  
  // Bloquear caixas de entrada governamentais/acadêmicas genéricas que dão bounce
  if (domain.startsWith("ac-") && domain.endsWith(".fr")) return false;
  if (domain.endsWith(".gov.br") || domain.endsWith(".edu.br")) return false;

  // Bloquear usernames lixo (apenas match exato ou startsWith estrito para não bloquear e-mails reais)
  const usernamesLixoExato = [
    "seuemail", "seunome", "teste", "test", "noreply", "no-reply", "naoresponda", "nao-responda",
    "donotreply", "nome", "postmaster", "hostmaster", "webmaster", "mailer-daemon", "mailer", "abuse", "reply"
  ];
  if (usernamesLixoExato.includes(user)) return false;
  if (user.startsWith("noreply") || user.startsWith("no-reply") || user.startsWith("naoresponda")) return false;
  
  // Anti-Padrões de username
  // Se tem mais de 8 números seguidos no user (relaxado, pois muitos usam telefone no e-mail)
  // if (/\d{9,}/.test(user)) return false; 
  if (user.startsWith("-") || user.startsWith(".")) return false;
  if (user.includes("+or+")) return false;
  
  // O domínio deve ter ponto
  if (!domain.includes('.')) return false;
  
  return true;
}
