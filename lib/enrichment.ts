import { geocodificar, buscarEmpresas } from "./overpass";
import { buscarOutscraper } from "./outscraper";

async function fetchHtml(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      signal: AbortSignal.timeout(6000)
    });
    return await res.text();
  } catch (err) {
    return '';
  }
}

async function searchDuckDuckGo(query: string): Promise<string> {
  return await fetchHtml(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`);
}

async function searchBing(query: string): Promise<string> {
  return await fetchHtml(`https://www.bing.com/search?q=${encodeURIComponent(query)}`);
}

async function searchYahoo(query: string): Promise<string> {
  return await fetchHtml(`https://search.yahoo.com/search?p=${encodeURIComponent(query)}`);
}

async function searchQwant(query: string): Promise<string> {
  return await fetchHtml(`https://lite.qwant.com/?q=${encodeURIComponent(query)}`);
}

async function searchBrave(query: string): Promise<string> {
  return await fetchHtml(`https://search.brave.com/search?q=${encodeURIComponent(query)}`);
}

async function searchAsk(query: string): Promise<string> {
  return await fetchHtml(`https://www.ask.com/web?q=${encodeURIComponent(query)}`);
}

async function searchEcosia(query: string): Promise<string> {
  return await fetchHtml(`https://www.ecosia.org/search?q=${encodeURIComponent(query)}`);
}

export async function enrichLeadData(nome: string, cidade: string, pais: string = "") {
  const safeNome = nome.replace(/['"]/g, "");
  
  const searches = await Promise.all([
    searchDuckDuckGo(`"${safeNome}" ${cidade} contato email`),
    searchBing(`"${safeNome}" ${cidade} @gmail.com`),
    searchYahoo(`site:instagram.com "${safeNome}" ${cidade}`),
    searchQwant(`site:facebook.com "${safeNome}" ${cidade}`),
    searchBrave(`"${safeNome}" ${cidade} email contato`),
    searchAsk(`"${safeNome}" ${cidade} instagram facebook email`),
    searchEcosia(`"${safeNome}" ${cidade} contato`)
  ]);
  
  const htmlUnificado = searches.join(" ");

  const emails = htmlUnificado.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g) || [];
  const instas = (htmlUnificado.match(/instagram\.com\/([A-Za-z0-9_.]+)/gi) || []).filter(u => {
      const lower = u.toLowerCase();
      return !lower.includes('qwantcom') && 
             !lower.includes('/p/') && 
             !lower.includes('/reel/') && 
             !lower.includes('/stories/') &&
             !lower.includes('/explore') &&
             !lower.includes('google');
    });
  const faces = (htmlUnificado.match(/facebook\.com\/([A-Za-z0-9_.]+)/gi) || []).filter(u => {
      const lower = u.toLowerCase();
      return !lower.includes('qwantcom') && 
             !lower.includes('/p/') && 
             !lower.includes('/reel/') && 
             !lower.includes('/stories/') &&
             !lower.includes('/explore') &&
             !lower.includes('google');
    });
  
  return {
    email: emails.length > 0 ? emails[0]?.toLowerCase() : null,
    instagram: instas.length > 0 ? `https://www.${instas[0]?.toLowerCase()}` : null,
    facebook: faces.length > 0 ? `https://www.${faces[0]?.toLowerCase()}` : null,
    fontes: ['duckduckgo', 'bing', 'yahoo', 'qwant', 'brave', 'ask', 'ecosia']
  };
}

export async function radarInstagram(nicho: string, cidade: string) {
  const isGlobal = (cidade.toLowerCase() === "mundial" || cidade.trim() === "");
  const cid = isGlobal ? "" : cidade.trim();
  const nic = nicho.trim() || "loja";
  
  const nicExpanded = nic.toLowerCase().includes("roupa") ? `${nic} modas` : nic;

  // 1. OUTSCRAPER (Google Maps - True Machine)
  const outscraperPromise = (async () => {
    try {
      const key = process.env.OUTSCRAPER_API_KEY;
      if (key) {
        const query = `${nic} ${cid || "Brasil"}`.trim();
        const results = await buscarOutscraper(query, key, 100);
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
          nivel: "quente" as const
        }));
      }
    } catch (e) {}
    return [];
  })();

  // 2. OVERPASS
  const overpassPromise = (async () => {
    let leadsOSM: any[] = [];
    try {
      if (!isGlobal) {
        const geo = await geocodificar(cid);
        if (geo) {
          leadsOSM = await buscarEmpresas("todos", ["name~.", "contact:instagram~."], geo.lat, geo.lng, geo.radiusM, cid, geo.paisNome);
        }
      }
    } catch (error) {}
    return leadsOSM.map((r: any) => ({ ...r, fonte: "overpass", score: 60, nivel: "morno" }));
  })();

  // 3. OSINT
  const osintPromise = (async () => {
    const base = `${nicExpanded} ${cid}`.trim();
    const baseComAspas = `${nicExpanded} ${cid ? `"${cid}"` : ""}`.trim();
    
    const searches = await Promise.all([
      searchDuckDuckGo(`${baseComAspas} "instagram.com"`),
      searchBing(`${baseComAspas} instagram`),
      searchYahoo(`${baseComAspas} instagram oficial`),
      searchQwant(`${base} instagram profile`),
      searchBrave(`${base} instagram.com`),
      searchAsk(`${base} instagram page`),
      searchEcosia(`${base} instagram.com`)
    ]);
    
    const htmlUnificado = searches.join(" ");
    const instaMatches = (htmlUnificado.match(/instagram\.com\/([A-Za-z0-9_.]+)/gi) || []).filter(u => {
      const lower = u.toLowerCase();
      return !lower.includes('qwantcom') && 
             !lower.includes('/p/') && 
             !lower.includes('/reel/') && 
             !lower.includes('/stories/') &&
             !lower.includes('/explore') &&
             !lower.includes('google');
    });

    const usernames = new Set<string>();
    for (const match of instaMatches) {
      const parts = match.split("/");
      if (parts.length > 1 && parts[1].length > 2 && !["p", "reel", "explore", "stories"].includes(parts[1])) {
        usernames.add(parts[1].toLowerCase());
      }
    }

    return Array.from(usernames).slice(0, 100).map(user => {
      const nomeFormatado = user.replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
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
        score: 50,
        nivel: "morno"
      };
    });
  })();

  const [outResults, overpassResults, osintResults] = await Promise.all([outscraperPromise, overpassPromise, osintPromise]);
  
  const map = new Map<string, any>();
  for (const item of [...outResults, ...overpassResults, ...osintResults]) {
    const key = item.instagram ? item.instagram.toLowerCase() : item.osmId;
    if (!map.has(key)) map.set(key, item);
  }
  
  return Array.from(map.values()).slice(0, 200);
}

export async function radarFoods(nicho: string, cidade: string) {
  const isGlobal = (cidade.toLowerCase() === "mundial" || cidade.trim() === "");
  const cid = isGlobal ? "" : cidade.trim();
  const nic = nicho.trim() || "restaurante";
  
  const nicExpanded = nic.toLowerCase().includes("restaurante") ? `${nic} restaurant` : 
                      nic.toLowerCase().includes("hamburgueria") ? `${nic} burger` : 
                      nic.toLowerCase().includes("pizzaria") ? `${nic} pizzeria` : nic;

  // 1. OUTSCRAPER (Google Maps - True Machine)
  const outscraperPromise = (async () => {
    try {
      const key = process.env.OUTSCRAPER_API_KEY;
      if (key) {
        const query = `${nic} delivery ${cid || "Brasil"}`.trim();
        const results = await buscarOutscraper(query, key, 100);
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
          nivel: "quente" as const
        }));
      }
    } catch (e) {}
    return [];
  })();

  // 2. OVERPASS
  const overpassPromise = (async () => {
    let leadsOSM: any[] = [];
    try {
      if (!isGlobal) {
        const geo = await geocodificar(cid);
        if (geo) {
          leadsOSM = await buscarEmpresas("todos", ["name~.", "amenity~restaurant|fast_food|cafe|bar|pub", "delivery~yes|only"], geo.lat, geo.lng, geo.radiusM, cid, geo.paisNome);
        }
      }
    } catch (error) {}
    return leadsOSM.map((r: any) => ({ ...r, fonte: "overpass", score: 60, nivel: "morno" }));
  })();

  // 3. OSINT
  const osintPromise = (async () => {
    const base = `${nicExpanded} ${cid}`.trim();
    const baseComAspas = `${nicExpanded} ${cid ? `"${cid}"` : ""}`.trim();

    const searches = await Promise.all([
      searchDuckDuckGo(`${baseComAspas} ifood OR ubereats`),
      searchBing(`${baseComAspas} tripadvisor OR yelp`),
      searchYahoo(`${baseComAspas} doordash OR grubhub`),
      searchQwant(`${base} rappi OR zomato`),
      searchBrave(`${base} just-eat OR deliveroo`),
      searchAsk(`${base} restaurant menu delivery ifood`),
      searchEcosia(`${base} ifood tripadvisor ubereats yelp`)
    ]);

    const htmlUnificado = searches.join(" ");
    const urlsMatches = htmlUnificado.match(/https?:\/\/(www\.)?([a-zA-Z0-9.-]+)\/([^"'\s<]+)/gi) || [];

    const restaurantes = new Map<string, any>();
    
    for (const match of urlsMatches) {
      try {
        const u = new URL(match);
        const host = u.hostname.replace("www.", "");
        
        const isDelivery = ["ifood.com.br", "ubereats.com", "rappi.com", "doordash.com", "grubhub.com", "just-eat.co.uk", "deliveroo.co.uk", "zomato.com", "tripadvisor.com", "yelp.com"].includes(host);
        
        if (isDelivery && u.pathname.length > 5) {
          const pathParts = u.pathname.split("/").filter(Boolean);
          const nomePotencial = pathParts[pathParts.length - 1].replace(/-/g, " ");
          
          if (nomePotencial.length > 3 && !nomePotencial.includes("?")) {
            const fonteStr = host.split(".")[0];
            const nomeFormatado = nomePotencial.replace(/\b\w/g, l => l.toUpperCase());
            
            restaurantes.set(nomeFormatado, { nome: nomeFormatado, url: match, fonteStr });
          }
        }
      } catch (e) {}
    }

    return Array.from(restaurantes.values()).slice(0, 100).map((r, i) => ({
      osmId: `osint_food_${i}`,
      nome: r.nome,
      categoria: nicho || "Delivery/Restaurante",
      cidade: cidade || "Global",
      pais: "",
      telefone: null,
      website: r.url,
      email: null,
      instagram: null,
      fonte: r.fonteStr,
      score: 60,
      nivel: "quente" as const
    }));
  })();

  const [outResults, overpassResults, osintResults] = await Promise.all([outscraperPromise, overpassPromise, osintPromise]);

  const map = new Map<string, any>();
  for (const item of [...outResults, ...overpassResults, ...osintResults]) {
    const key = item.nome.toLowerCase();
    if (!map.has(key)) map.set(key, item);
  }

  return Array.from(map.values()).slice(0, 200);
}
