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
  const dominiosFalsos = [
    "duckduckgo", "sentry", "example", "w3.org", "sijax", "bing.com", "yahoo.com",
    "google.com", "microsoft.com", "facebook.com", "instagram.com", "twitter.com",
    "apple.com", "cloudflare.com", "ifood.com", "tripadvisor.com", "tiktok.com",
    "linkedin.com", "amazon.com", "qwant.com", "email.com", "teste.com", "test.com",
    "site.com", "suaempresa.com", "dominio.com", "domain.com", "yourdomain.com", "wixsite.com",
    "sentry.io", "github.com", "sistemas", "naoresponda"
  ];
  if (dominiosFalsos.some(d => domain.includes(d))) return false;
  
  // Bloquear caixas de entrada governamentais/acadêmicas genéricas francesas e brasileiras que dão bounce
  // "ac-" na frança é académie.
  if (domain.startsWith("ac-") && domain.endsWith(".fr")) return false;
  if (domain.endsWith(".gov.br") || domain.endsWith(".edu.br")) return false; // Dependendo do nicho, mas escolas públicas dão bounce

  // Bloquear usernames lixo
  const usernamesLixo = [
    "seuemail", "seunome", "teste", "test", "noreply", "no-reply", "naoresponda", "nao-responda",
    "donotreply", "admin@site", "contato@site", "contato@suaempresa", "nome@site", "postmaster",
    "hostmaster", "webmaster", "mailer-daemon", "mailer", "abuse", "reply"
  ];
  if (usernamesLixo.some(u => user === u || user.includes(u))) return false;
  
  // Anti-Padrões de username (ex: ce.0594451T)
  // Se tem mais de 4 números seguidos no user, ou se tem caracteres muito estranhos
  if (/\d{4,}/.test(user)) return false; 
  if (user.startsWith("-") || user.startsWith(".")) return false;
  if (user.includes("+or+")) return false;
  
  // O domínio deve ter ponto
  if (!domain.includes('.')) return false;
  
  return true;
}
