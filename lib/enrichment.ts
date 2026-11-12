import { isEmailValidoParaB2B } from "./validar-email";
import { geocodificar, buscarEmpresas } from "./overpass";
import { buscarOutscraper } from "./outscraper";
import { normalizarParametrosBusca } from "./normalizar-busca";

async function fetchHtml(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      signal: AbortSignal.timeout(1800),
    });
    return await res.text();
  } catch (err) {
    return "";
  }
}

async function searchDuckDuckGo(query: string): Promise<string> {
  return await fetchHtml(
    `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
  );
}

async function searchBing(query: string): Promise<string> {
  return await fetchHtml(
    `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
  );
}

async function searchYahoo(query: string): Promise<string> {
  return await fetchHtml(
    `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`,
  );
}

async function searchQwant(query: string): Promise<string> {
  return await fetchHtml(
    `https://lite.qwant.com/?q=${encodeURIComponent(query)}`,
  );
}

async function searchBrave(query: string): Promise<string> {
  return await fetchHtml(
    `https://search.brave.com/search?q=${encodeURIComponent(query)}`,
  );
}

async function searchAsk(query: string): Promise<string> {
  return await fetchHtml(
    `https://www.ask.com/web?q=${encodeURIComponent(query)}`,
  );
}

async function searchEcosia(query: string): Promise<string> {
  return await fetchHtml(
    `https://www.ecosia.org/search?q=${encodeURIComponent(query)}`,
  );
}

export async function enrichLeadData(
  nome: string,
  cidade: string,
  pais: string = "",
) {
  const safeNome = nome.replace(/['"]/g, "");

  const searchesResult = await Promise.allSettled([
    searchDuckDuckGo(`"${safeNome}" ${cidade} contato email`),
    searchDuckDuckGo(`site:instagram.com "${safeNome}" ${cidade}`),
    searchQwant(`"${safeNome}" ${cidade} email contato instagram`),
    searchAsk(`"${safeNome}" ${cidade} contato`),



  ]);
  const searches = searchesResult.map((r: any) =>
    r.status === "fulfilled" ? r.value : "",
  );

  // Decodifica resquícios de URL e remove tags HTML para evitar falsos e-mails com %20
  const htmlLimpo = searches.join(" ")
    .replace(/%20/gi, " ")
    .replace(/%22/gi, "")
    .replace(/%25/gi, "")
    .replace(/&amp;/gi, "&")
    .replace(/href=["'][^"']*["']/gi, "");

  const emails = (
    htmlLimpo.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g) || []
  ).filter((e) => isEmailValidoParaB2B(e));
  const instas = (
    htmlLimpo.match(/instagram\.com\/([A-Za-z0-9_.]+)/gi) || []
  ).filter((u) => {
    const lower = u.toLowerCase();
    return (
      !lower.includes("qwantcom") &&
      !lower.includes("/p/") &&
      !lower.includes("/reel/") &&
      !lower.includes("/stories/") &&
      !lower.includes("/explore") &&
      !lower.includes("google")
    );
  });
  const faces = (
    htmlUnificado.match(/facebook\.com\/([A-Za-z0-9_.]+)/gi) || []
  ).filter((u) => {
    const lower = u.toLowerCase();
    return (
      !lower.includes("qwantcom") &&
      !lower.includes("/p/") &&
      !lower.includes("/reel/") &&
      !lower.includes("/stories/") &&
      !lower.includes("/explore") &&
      !lower.includes("google")
    );
  });

  return {
    email: emails.length > 0 ? emails[0]?.toLowerCase() : null,
    instagram:
      instas.length > 0 ? `https://www.${instas[0]?.toLowerCase()}` : null,
    facebook:
      faces.length > 0 ? `https://www.${faces[0]?.toLowerCase()}` : null,
    fontes: ["duckduckgo", "qwant", "ask"],
  };
}

export async function radarInstagram(
  nichoInput: string,
  cidadeInput: string,
  limit: number = 300,
) {
  // Desinversão inteligente de parâmetros caso o usuário inverta Nicho e Cidade
  const { nicho, cidade } = normalizarParametrosBusca(nichoInput, cidadeInput);

  const isGlobal = cidade.toLowerCase() === "mundial" || cidade.trim() === "";
  const cid = isGlobal ? "" : cidade.trim();
  const nic = nicho.trim() || "loja";

  const nicExpanded = nic.toLowerCase().includes("roupa")
    ? `${nic} modas`
    : nic;

  // 1. OUTSCRAPER (se chave configurada)
  const outscraperPromise = (async () => {
    try {
      const key = process.env.OUTSCRAPER_API_KEY;
      if (key) {
        const query = `${nic} ${cid || "Brasil"}`.trim();
        const results = await buscarOutscraper(
          query,
          key,
          Math.min(limit, 300),
        );
        return results.map((r: any) => ({
          osmId: r.osmId,
          nome: r.nome,
          categoria: nicho || "Instagram",
          cidade: r.cidade || cidade || "Global",
          pais: r.pais || "",
          telefone: r.telefone,
          website: r.website,
          email: r.email,
          instagram: r.instagram,
          fonte: "google",
          score: 80,
          nivel: "quente" as const,
        }));
      }
    } catch (e) {}
    return [];
  })();

  // 2. OVERPASS RÁPIDO (máx 150 alvos para não estourar a lambda da Vercel)
  const overpassPromise = (async () => {
    let leadsOSM: any[] = [];
    try {
      if (!isGlobal) {
        const geo = await geocodificar(cid);
        if (geo) {
          const { CATEGORIAS } = await import("./categorias");
          const nicLower = nic.toLowerCase();
          const cat = CATEGORIAS.find(
            (c) =>
              c.id === nicLower || c.label.toLowerCase().includes(nicLower),
          );

          const safeLimit = Math.min(limit, 150);
          if (cat) {
            leadsOSM = await buscarEmpresas(
              cat.id, cat.tags, geo.lat, geo.lng, geo.radiusM, cid, geo.paisNome, geo.bbox, safeLimit
            );
          } else {
            leadsOSM = await buscarEmpresas(
              "todos", [`name~${nic},i`], geo.lat, geo.lng, geo.radiusM, cid, geo.paisNome, geo.bbox, safeLimit
            );
          }
        }
      }
    } catch (error) {}
    return leadsOSM.map((r: any) => ({
      ...r,
      fonte: "overpass",
      score: 60,
      nivel: "morno",
    }));
  })();

  // 3. OSINT INSTAGRAM SCAN
  const osintPromise = (async () => {
    try {
      const base = `${nicExpanded} ${cid}`.trim();
      const baseComAspas = `${nicExpanded} ${cid ? `"${cid}"` : ""}`.trim();

      const searchesResult = await Promise.allSettled([
        searchDuckDuckGo(`${baseComAspas} "instagram.com"`),
        searchBing(`${baseComAspas} instagram`),
        searchYahoo(`${baseComAspas} instagram oficial`),
        searchQwant(`${base} instagram profile`),
        searchBrave(`${base} instagram.com`),
        searchAsk(`${base} instagram page`),
        searchEcosia(`${base} instagram.com`),
      ]);
      const searches = searchesResult.map((r: any) =>
        r.status === "fulfilled" ? r.value : "",
      );

      const htmlUnificado = searches.join(" ")
        .replace(/%20/gi, " ")
        .replace(/%22/gi, "")
        .replace(/&amp;/gi, "&");
      const instaMatches = (
        htmlUnificado.match(/instagram\.com\/([A-Za-z0-9_.]+)/gi) || []
      ).filter((u) => {
        const lower = u.toLowerCase();
        return (
          !lower.includes("qwantcom") &&
          !lower.includes("/p/") &&
          !lower.includes("/reel/") &&
          !lower.includes("/stories/") &&
          !lower.includes("/explore") &&
          !lower.includes("google")
        );
      });

      const usernames = new Set<string>();
      for (const match of instaMatches) {
        const parts = match.split("/");
        if (
          parts.length > 1 &&
          parts[1].length > 2 &&
          !["p", "reel", "explore", "stories"].includes(parts[1])
        ) {
          usernames.add(parts[1].toLowerCase());
        }
      }

      return Array.from(usernames)
        .slice(0, limit)
        .map((user) => {
          const nomeFormatado = user
            .replace(/[._]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
          return {
            osmId: "insta_" + user,
            nome: nomeFormatado,
            categoria: nicho || "Instagram",
            cidade: cidade || "Global",
            pais: "",
            telefone: null,
            website: null,
            email: null,
            instagram: `https://www.instagram.com/${user}`,
            fonte: "instagram",
            score: 75,
            nivel: "quente" as const,
          };
        });
    } catch (err) {
      return [];
    }
  })();

  // DEADLINE DE SEGURANÇA SERVERLESS: Máximo 7.200ms para NUNCA estourar timeout 504 na Vercel
  const timeoutPromise = new Promise<any[]>((resolve) => {
    setTimeout(() => resolve([]), 7200);
  });

  const [outResults, overpassResults, osintResults] = await Promise.race([
    Promise.all([outscraperPromise, overpassPromise, osintPromise]),
    timeoutPromise.then(() => [[], [], []])
  ]);

  const map = new Map<string, any>();
  for (const item of [...(outResults || []), ...(overpassResults || []), ...(osintResults || [])]) {
    if (!item) continue;
    const key = item.instagram ? item.instagram.toLowerCase() : item.osmId;
    if (!map.has(key)) map.set(key, item);
  }

  return Array.from(map.values()).slice(0, limit);
}

export async function radarFoods(
  nichoInput: string,
  cidadeInput: string,
  limit: number = 300,
) {
  const { nicho, cidade } = normalizarParametrosBusca(nichoInput, cidadeInput);
  const isGlobal = cidade.toLowerCase() === "mundial" || cidade.trim() === "";
  const cid = isGlobal ? "" : cidade.trim();
  const nic = nicho.trim() || "restaurante";

  const nicExpanded = nic.toLowerCase().includes("restaurante")
    ? `${nic} restaurant`
    : nic.toLowerCase().includes("hamburgueria")
      ? `${nic} burger`
      : nic.toLowerCase().includes("pizzaria")
        ? `${nic} pizzeria`
        : nic;

  // 1. OUTSCRAPER
  const outscraperPromise = (async () => {
    try {
      const key = process.env.OUTSCRAPER_API_KEY;
      if (key) {
        const query = `${nic} delivery ${cid || "Brasil"}`.trim();
        const results = await buscarOutscraper(
          query,
          key,
          Math.min(limit, 300),
        );
        return results.map((r: any) => ({
          osmId: r.osmId,
          nome: r.nome,
          categoria: nicho || "Delivery/Restaurante",
          cidade: r.cidade || cidade || "Global",
          pais: r.pais || "",
          telefone: r.telefone,
          website: r.website,
          email: r.email,
          instagram: r.instagram,
          fonte: "google",
          score: 80,
          nivel: "quente" as const,
        }));
      }
    } catch (e) {}
    return [];
  })();

  // 2. OVERPASS RÁPIDO (máx 150)
  const overpassPromise = (async () => {
    let leadsOSM: any[] = [];
    try {
      if (!isGlobal) {
        const geo = await geocodificar(cid);
        if (geo) {
          const { CATEGORIAS } = await import("./categorias");
          const nicLower = nic.toLowerCase();
          const cat = CATEGORIAS.find(
            (c) =>
              c.id === nicLower || c.label.toLowerCase().includes(nicLower),
          );

          const safeLimit = Math.min(limit, 150);
          if (cat) {
            leadsOSM = await buscarEmpresas(
              cat.id,
              [...cat.tags, "AND:delivery~yes|only"],
              geo.lat,
              geo.lng,
              geo.radiusM,
              cid,
              geo.paisNome,
              geo.bbox,
              safeLimit,
            );
          } else {
            leadsOSM = await buscarEmpresas(
              "todos",
              [`name~${nic},i`, "amenity~restaurant|fast_food|cafe|bar|pub"],
              geo.lat,
              geo.lng,
              geo.radiusM,
              cid,
              geo.paisNome,
              geo.bbox,
              safeLimit,
            );
          }
        }
      }
    } catch (error) {}
    return leadsOSM.map((r: any) => ({
      ...r,
      fonte: "overpass",
      score: 60,
      nivel: "morno",
    }));
  })();

  // 3. OSINT FOODS & DELIVERY
  const osintPromise = (async () => {
    try {
      const base = `${nicExpanded} ${cid}`.trim();
      const baseComAspas = `${nicExpanded} ${cid ? `"${cid}"` : ""}`.trim();

      const searchesResult = await Promise.allSettled([
        searchDuckDuckGo(`${baseComAspas} ifood OR ubereats`),
        searchBing(`${baseComAspas} tripadvisor OR yelp`),
        searchYahoo(`${baseComAspas} doordash OR grubhub`),
        searchQwant(`${base} rappi OR zomato`),
        searchBrave(`${base} just-eat OR deliveroo`),
        searchAsk(`${base} restaurant menu delivery ifood`),
        searchEcosia(`${base} ifood tripadvisor ubereats yelp`),
      ]);
      const searches = searchesResult.map((r: any) =>
        r.status === "fulfilled" ? r.value : "",
      );

      const htmlUnificado = searches.join(" ");
      const urlsMatches =
        htmlUnificado.match(
          /https?:\/\/(www\.)?([a-zA-Z0-9.-]+)\/([^"'\s<]+)/gi,
        ) || [];

      const restaurantes = new Map<string, any>();

      for (const match of urlsMatches) {
        try {
          const u = new URL(match);
          const host = u.hostname.replace("www.", "");

          if (
            host.includes("ifood.com.br") ||
            host.includes("rappi.com") ||
            host.includes("ubereats.com") ||
            host.includes("tripadvisor") ||
            host.includes("yelp")
          ) {
            const pathParts = u.pathname
              .split("/")
              .filter(Boolean)
              .filter(
                (p) =>
                  ![
                    "delivery",
                    "restaurante",
                    "cardapio",
                    "menu",
                    "br",
                    "pt",
                    "restaurant_review",
                    "biz",
                  ].includes(p.toLowerCase()),
              );

            if (pathParts.length > 0) {
              const slug = pathParts[pathParts.length - 1];
              const nome = slug
                .replace(/[-_]/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());

              if (nome.length > 2 && !restaurantes.has(nome.toLowerCase())) {
                restaurantes.set(nome.toLowerCase(), {
                  osmId: "food_" + slug,
                  nome,
                  categoria: nicho || "Delivery/Alimentos",
                  cidade: cidade || "Global",
                  pais: "",
                  telefone: null,
                  website: match,
                  instagram: null,
                  email: null,
                  fonte: "delivery",
                  score: 75,
                  nivel: "quente" as const,
                });
              }
            }
          }
        } catch (e) {}
      }

      return Array.from(restaurantes.values()).slice(0, limit);
    } catch (err) {
      return [];
    }
  })();

  // DEADLINE DE SEGURANÇA SERVERLESS: Máximo 7.200ms
  const timeoutPromise = new Promise<any[]>((resolve) => {
    setTimeout(() => resolve([]), 7200);
  });

  const [outResults, overpassResults, osintResults] = await Promise.race([
    Promise.all([outscraperPromise, overpassPromise, osintPromise]),
    timeoutPromise.then(() => [[], [], []])
  ]);

  const map = new Map<string, any>();
  for (const item of [...(outResults || []), ...(overpassResults || []), ...(osintResults || [])]) {
    if (!item) continue;
    const key = item.website ? item.website.toLowerCase() : item.osmId;
    if (!map.has(key)) map.set(key, item);
  }

  return Array.from(map.values()).slice(0, limit);
}
