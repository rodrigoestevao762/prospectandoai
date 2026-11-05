import { isEmailValidoParaB2B } from "./validar-email";
import { getCategoria } from "./categorias";

export async function geocodificar(cidade: string) {
  if (!cidade || cidade.toLowerCase() === "mundial") return null;
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cidade)}`, {
    headers: { "User-Agent": "ProspectAI-OSINT/2.0 (contato@prospectai.app)" },
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json || json.length === 0) return null;
  
  let item = json[0];
  const cityItem = json.find((x: any) => x.type === "city" || x.type === "town" || (x.type === "administrative" && x.addresstype === "city"));
  if (cityItem) item = cityItem;

  let paisNome = "";
  const parts = item.display_name.split(",");
  if (parts.length > 0) paisNome = parts[parts.length - 1].trim();

  let bboxStr = item.boundingbox; 
  let bbox: number[] | null = null;
  if (bboxStr && bboxStr.length === 4) {
    bbox = [parseFloat(bboxStr[0]), parseFloat(bboxStr[2]), parseFloat(bboxStr[1]), parseFloat(bboxStr[3])];
  }

  let radiusM = 8000;
  if (item.type === "city" || item.class === "place") radiusM = 25000;
  if (item.type === "country") radiusM = 500000;
  
  return { lat: parseFloat(item.lat), lng: parseFloat(item.lon), radiusM, bbox, paisNome };
}

export async function buscarEmpresas(
  categoria: string,
  extraTags: string[] = [],
  lat: number,
  lng: number,
  radiusM: number,
  cidade: string,
  pais: string,
  bbox?: number[] | null,
  limit?: number,
  radiusMultiplier: number = 1
) {
  let tags = categoria === "todos" ? getCategoria("todos")?.tags || [] : getCategoria(categoria)?.tags || [];
  if (tags.length === 0 && categoria !== "todos") tags = [`amenity~"${categoria}"`, `shop~"${categoria}"`];
  if (extraTags.length > 0) tags = extraTags;

  const baseTags = tags.filter(t => !t.startsWith("AND:"));
  const andTags = tags.filter(t => t.startsWith("AND:")).map(t => t.substring(4));

  const targetLimit = limit && limit > 0 ? limit : 300;

  // Calibra a extensão da busca de acordo com o raio e o volume pedido
  let baseDelta = 0.08;
  if (radiusM && radiusM > 0) {
    const degreeRadius = radiusM / 111000;
    if (targetLimit >= 1500) {
      baseDelta = Math.max(0.18, Math.min(degreeRadius * 1.5, 0.45));
    } else if (categoria === "todos") {
      baseDelta = Math.max(0.06, Math.min(degreeRadius * 1.2, 0.35));
    } else {
      baseDelta = Math.max(0.08, Math.min(degreeRadius * 1.8, 0.65));
    }
  }
  const maxDelta = baseDelta * radiusMultiplier;

  let s = lat - maxDelta / 2;
  let n = lat + maxDelta / 2;
  let w = lng - maxDelta / 2;
  let e = lng + maxDelta / 2;

  function esc(st: string) { return st.replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }

  let andModifiers = "";
  for (const t of andTags) {
    if (t.includes("~")) {
      const [k, v] = t.split("~");
      if (v.endsWith(',i')) {
        andModifiers += `["${k}"~"${esc(v.slice(0, -2))}",i]`;
      } else {
        andModifiers += `["${k}"~"${esc(v)}"]`;
      }
    } else if (t.includes("=")) {
      const [k, v] = t.split("=");
      andModifiers += `["${k}"="${esc(v)}"]`;
    } else {
      andModifiers += `["${t}"]`;
    }
  }

  let selectors: string[] = [];
  if (categoria === "todos") {
    selectors = [
      `node[name]["shop"];`,
      `node[name]["amenity"];`,
      `node[name]["craft"];`,
      `node[name]["office"];`,
      `way[name]["shop"];`,
      `way[name]["amenity"];`,
      `way[name]["craft"];`,
      `way[name]["office"];`
    ];
  } else {
    selectors = baseTags.map((t) => {
      let sel = "";
      if (t.includes("~")) {
        const [k, v] = t.split("~");
        if (v.endsWith(',i')) {
          sel = `nw[name]["${k}"~"${esc(v.slice(0, -2))}",i]`;
        } else {
          sel = `nw[name]["${k}"~"${esc(v)}"]`;
        }
      } else if (t.includes("=")) {
        const [k, v] = t.split("=");
        sel = `nw[name]["${k}"="${esc(v)}"]`;
      } else {
        sel = `nw[name]["${t}"]`;
      }
      return sel + andModifiers + ";";
    });
  }

  const UA = { "User-Agent": "Overpass Turbo/1.0 (https://overpass-turbo.eu)" };
  const ENDPOINTS = [
    "https://overpass.openstreetmap.fr/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
  ];

  // Função interna resiliente para executar uma query Overpass
  const executeQuery = async (queryOverpass: string, attemptIdx: number = 0): Promise<any[]> => {
    // 1. Tenta via proxy interno da aplicação (evita CORS no navegador)
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/overpass-proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: queryOverpass, attemptIndex: attemptIdx }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.elements) && data.elements.length > 0) {
            return data.elements;
          }
        }
      } catch {
        // Fallback direto
      }
    }

    // 2. Consulta direta aos clusters Overpass
    for (let attempt = 0; attempt < ENDPOINTS.length; attempt++) {
      const ep = ENDPOINTS[(attemptIdx + attempt) % ENDPOINTS.length];
      try {
        const res = await fetch(ep, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded", ...UA },
          body: "data=" + encodeURIComponent(queryOverpass),
          signal: AbortSignal.timeout(16000),
        });
        if (!res.ok) continue;
        const text = await res.text();
        if (!text || !text.trim().startsWith("{")) continue;
        const data = JSON.parse(text);
        if (data && Array.isArray(data.elements) && data.elements.length > 0) {
          return data.elements;
        }
      } catch {
        continue;
      }
    }

    return [];
  };

  let allElements: any[] = [];

  // ============================================================
  // MÁQUINA DE BUSCA MULTI-RESOLUÇÃO GLOBAL:
  // ============================================================
  if (targetLimit <= 500) {
    // Volume padrão: 1 consulta unificada instantânea (2-5 segundos)
    const qUnified = `[out:json][timeout:22][bbox:${s.toFixed(5)},${w.toFixed(5)},${n.toFixed(5)},${e.toFixed(5)}];(${selectors.join("")});out center ${targetLimit};`;
    allElements = await executeQuery(qUnified, 0);
  } else if (targetLimit <= 1200) {
    // Médio volume: 4 quadrantes balanceados
    const midLat = (s + n) / 2;
    const midLon = (w + e) / 2;
    const perQuadrant = Math.min(Math.ceil(targetLimit / 3), 700);
    const quads = [
      `[bbox:${s.toFixed(5)},${w.toFixed(5)},${midLat.toFixed(5)},${midLon.toFixed(5)}]`,
      `[bbox:${midLat.toFixed(5)},${w.toFixed(5)},${n.toFixed(5)},${midLon.toFixed(5)}]`,
      `[bbox:${s.toFixed(5)},${midLon.toFixed(5)},${midLat.toFixed(5)},${e.toFixed(5)}]`,
      `[bbox:${midLat.toFixed(5)},${midLon.toFixed(5)},${n.toFixed(5)},${e.toFixed(5)}]`
    ];

    const batch1 = await Promise.all([
      executeQuery(`[out:json][timeout:18]${quads[0]};(${selectors.join("")});out center ${perQuadrant};`, 0),
      executeQuery(`[out:json][timeout:18]${quads[1]};(${selectors.join("")});out center ${perQuadrant};`, 1)
    ]);
    allElements.push(...batch1.flat());

    if (allElements.length < targetLimit) {
      const batch2 = await Promise.all([
        executeQuery(`[out:json][timeout:18]${quads[2]};(${selectors.join("")});out center ${perQuadrant};`, 2),
        executeQuery(`[out:json][timeout:18]${quads[3]};(${selectors.join("")});out center ${perQuadrant};`, 3)
      ]);
      allElements.push(...batch2.flat());
    }
  } else {
    // ULTRA-VOLUME (1.500 a 3.000+ LEADS):
    // Divide o território em uma grade espacial 3x3 (9 setores) cobrindo toda a metrópole
    const stepLat = maxDelta / 3;
    const stepLon = maxDelta / 3;
    const cells: { s: number; n: number; w: number; e: number }[] = [];

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const cellS = s + r * stepLat;
        const cellN = cellS + stepLat;
        const cellW = w + c * stepLon;
        const cellE = cellW + stepLon;
        cells.push({ s: cellS, n: cellN, w: cellW, e: cellE });
      }
    }

    const perCell = Math.min(Math.ceil(targetLimit / 6), 600);

    // Executa em 3 batches de 3 células simultâneas
    for (let b = 0; b < cells.length; b += 3) {
      const batch = cells.slice(b, b + 3);
      const batchResults = await Promise.all(
        batch.map((cell, idx) => {
          const qCell = `[out:json][timeout:20][bbox:${cell.s.toFixed(5)},${cell.w.toFixed(5)},${cell.n.toFixed(5)},${cell.e.toFixed(5)}];(${selectors.join("")});out center ${perCell};`;
          return executeQuery(qCell, (b + idx) % ENDPOINTS.length);
        })
      );

      for (const arr of batchResults) {
        allElements.push(...arr);
      }

      // Se já atingiu a meta pedida com margem, finaliza precocemente
      if (allElements.length >= targetLimit * 1.15) {
        break;
      }
    }
  }

  // Fallback compacto se os seletores não trouxerem dados
  if (allElements.length === 0) {
    try {
      const fallbackRadius = Math.max(6000, Math.min(radiusM || 18000, 30000));
      const fallbackAround = `(around:${fallbackRadius},${lat.toFixed(5)},${lng.toFixed(5)})`;
      const fallbackSelectors = selectors.map(s => s.replace(";", "") + fallbackAround + ";");
      const fallbackQ = `[out:json][timeout:20];(${fallbackSelectors.join("")});out center ${targetLimit};`;
      allElements = await executeQuery(fallbackQ, 0);
    } catch {
      // Ignorar fallback
    }
  }

  const blockedTags = [
    'government', 'diplomatic', 'embassy', 'townhall', 'police', 'fire_station',
    'military', 'quango', 'courthouse', 'prison', 'ngo',
    'bank', 'atm', 'bureau_de_change', 'money_transfer', 'payment_terminal',
    'place_of_worship', 'taxi', 'public_bookcase', 'bench', 'waste_basket',
    'social_facility', 'parking', 'fuel', 'public_building', 'grave_yard', 'shelter',
    'post_office', 'theatre', 'library', 'community_centre', 'cemetery', 'hostel',
    'recycling', 'waste_disposal', 'charging_station', 'telephone'
  ];

  const blockedNames = [
    'banco', 'itau', 'itaú', 'bradesco', 'santander', 'caixa economica', 'caixa econômica',
    'banco do brasil', 'banrisul', 'sicoob', 'sicredi', 'safra', 'btg pactual', 'c6 bank',
    'banco inter', 'nubank', 'banco pan', 'bv financeira', 'banco original', 'banco bmg',
    'banco24horas', 'banco 24 horas', 'casa lotérica', 'loterica', 'lotérica', 'western union',
    'mcdonald', 'burger king', 'subway', 'kfc', 'starbucks', "habib's", 'habibs',
    'carrefour', 'pão de açúcar', 'pao de acucar', 'extra supermercado', 'atacadao', 'atacadão',
    'assai', 'assaí', "sam's club", 'sams club', 'lojas americanas', 'americanas',
    'drogasil', 'droga raia', 'drogaria são paulo', 'drogaria sao paulo', 'pague menos',
    'posto ipiranga', 'posto shell', 'posto br', 'posto petrobras', 'petrobras', 'shell',
    'correios', 'inss', 'receita federal', 'poupatempo', 'detran', 'procon'
  ];

  const seenIds = new Set<string>();
  const uniqueElements = allElements.filter((e: any) => {
    const id = String(e.id);
    if (!id || seenIds.has(id)) return false;
    seenIds.add(id);
    return true;
  });

  const finalElements = uniqueElements.filter((e: any) => {
    if (e.tags?.office && blockedTags.includes(e.tags.office)) return false;
    if (e.tags?.amenity && blockedTags.includes(e.tags.amenity)) return false;
    if (e.tags?.shop && ['lottery'].includes(e.tags.shop)) return false;
    if (e.tags?.military || e.tags?.government || e.tags?.religion) return false;
    
    const n = [e.tags?.name || "", e.tags?.brand || "", e.tags?.operator || ""].join(" ").toLowerCase();
    if (blockedNames.some(term => n.includes(term))) return false;
    
    return true;
  }).map((e: any) => ({
    osmId: String(e.id),
    nome: e.tags?.name || "Empresa Desconhecida",
    categoria,
    cidade: e.tags?.["addr:city"] || cidade,
    pais: pais,
    lat: e.lat != null ? Number(e.lat) : (e.center?.lat != null ? Number(e.center.lat) : lat),
    lng: e.lon != null ? Number(e.lon) : (e.center?.lon != null ? Number(e.center.lon) : lng),
    endereco: [e.tags?.["addr:street"], e.tags?.["addr:housenumber"]].filter(Boolean).join(", ") || "",
    telefone: e.tags?.phone || e.tags?.["contact:phone"] || e.tags?.whatsapp || e.tags?.["contact:whatsapp"] || null,
    website: e.tags?.website || e.tags?.["contact:website"] || null,
    instagram: e.tags?.["contact:instagram"] || e.tags?.instagram || null,
    email: isEmailValidoParaB2B(e.tags?.email || e.tags?.["contact:email"])
      ? (e.tags?.email || e.tags?.["contact:email"]).toLowerCase().trim()
      : null,
    facebook: e.tags?.["contact:facebook"] || e.tags?.facebook || null,
  })).filter((e: any) => e.nome !== "Empresa Desconhecida");

  return finalElements.slice(0, targetLimit);
}
