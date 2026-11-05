import { isEmailValidoParaB2B } from "./validar-email";
import { getCategoria } from "./categorias";

export async function geocodificar(cidade: string) {
  if (!cidade || cidade.toLowerCase() === "mundial") return null;
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cidade)}`, {
    headers: { "User-Agent": "ProspectAI/2.0" },
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

  let radiusM = 5000;
  if (item.type === "city" || item.class === "place") radiusM = 20000;
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

  // Centraliza no epicentro comercial da cidade (lat, lng) e calibra a malha conforme o raio solicitado
  let baseDelta = 0.05;
  if (radiusM && radiusM > 0) {
    const degreeRadius = radiusM / 111000;
    if (categoria === "todos") {
      baseDelta = Math.max(0.05, Math.min(degreeRadius * 1.6, 0.40));
    } else {
      baseDelta = Math.max(0.06, Math.min(degreeRadius * 2.0, 0.70));
    }
  }
  const maxDelta = baseDelta * radiusMultiplier;

  let s = lat - maxDelta / 2;
  let n = lat + maxDelta / 2;
  let w = lng - maxDelta / 2;
  let e = lng + maxDelta / 2;

  const midLat = (s + n) / 2;
  const midLon = (w + e) / 2;

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
      `nw[name]["shop"];`,
      `nw[name]["craft"];`,
      `nw[name]["amenity"];`,
      `nw[name]["office"];`
    ];
  } else {
    selectors = baseTags.map((t) => {
      let sel = "";
      if (t.includes("~")) {
        const [k, v] = t.split("~");
        if (v.endsWith(',i')) {
          sel = `nw["${k}"~"${esc(v.slice(0, -2))}",i]`;
        } else {
          sel = `nw["${k}"~"${esc(v)}"]`;
        }
      } else if (t.includes("=")) {
        const [k, v] = t.split("=");
        sel = `nw["${k}"="${esc(v)}"]`;
      } else {
        sel = `nw["${t}"]`;
      }
      return sel + andModifiers + ";";
    });
  }

  const UA = { "User-Agent": "ProspectAI/2.0 (OSINT Engine; https://prospectandoai.vercel.app)" };
  const ENDPOINTS = [
    "https://overpass.openstreetmap.fr/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
  ];

  const perQuadrantLimit = limit && limit > 0 ? Math.min(Math.ceil(limit / 2), 1500) : 1500;

  // Monta áreas de busca: se busca volume alto (>= 300), adiciona clusters radiais (que são 10x mais rápidos e não dão timeout)
  const querySlices: string[] = [];

  if (limit && limit >= 300) {
    const clusterR = Math.max(4000, Math.min(Math.round((radiusM || 15000) * 0.4), 8000));
    const step = maxDelta * 0.35;
    const centers = [
      { lat: lat, lon: lng }, // Epicentro
      { lat: lat + step, lon: lng }, // Norte
      { lat: lat - step, lon: lng }, // Sul
      { lat: lat, lon: lng + step }, // Leste
      { lat: lat, lon: lng - step }, // Oeste
      { lat: lat + step * 0.8, lon: lng + step * 0.8 }, // Nordeste
      { lat: lat - step * 0.8, lon: lng - step * 0.8 }, // Sudoeste
      { lat: lat - step * 0.8, lon: lng + step * 0.8 }, // Sudeste
      { lat: lat + step * 0.8, lon: lng - step * 0.8 }, // Noroeste
    ];

    centers.forEach(c => {
      const aroundSelectors = selectors.map(s => s.replace(";", "") + `(around:${clusterR},${c.lat.toFixed(5)},${c.lon.toFixed(5)});`);
      querySlices.push(`(${aroundSelectors.join("")})`);
    });
  } else {
    // Busca padrão de 4 quadrantes
    querySlices.push(
      `[bbox:${s},${w},${midLat},${midLon}];(${selectors.join("")})`,
      `[bbox:${midLat},${w},${n},${midLon}];(${selectors.join("")})`,
      `[bbox:${s},${midLon},${midLat},${e}];(${selectors.join("")})`,
      `[bbox:${midLat},${midLon},${n},${e}];(${selectors.join("")})`
    );
  }

  const fetchSliceWithRetry = async (sliceStr: string, idx: number) => {
    const q = `[out:json][timeout:18]${sliceStr.startsWith('[') ? '' : ''}${sliceStr};out center ${perQuadrantLimit};`;

    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/overpass-proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q, attemptIndex: idx }),
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

    for (let attempt = 0; attempt < ENDPOINTS.length; attempt++) {
      const ep = ENDPOINTS[(idx + attempt) % ENDPOINTS.length];
      try {
        const res = await fetch(ep, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded", ...UA },
          body: "data=" + encodeURIComponent(q),
          signal: AbortSignal.timeout(12000),
        });
        if (!res.ok) continue;
        const data = await res.json();
        if (data.elements && data.elements.length > 0) {
          return data.elements;
        }
      } catch {
        // Failover automático para o próximo servidor do cluster
      }
    }
    return [];
  };

  let allElements: any[] = [];
  try {
    const sliceResults = await Promise.all(
      querySlices.map((slice, i) => fetchSliceWithRetry(slice, i))
    );
    allElements = sliceResults.flat();
  } catch {
    allElements = [];
  }

  // Fallback com centro geográfico caso os quadrantes retornem vazios
  if (allElements.length === 0) {
    try {
      const fallbackAround = `(around:6000,${lat},${lng})`;
      const fallbackSelectors = selectors.map(s => s.replace(";", "") + fallbackAround + ";");
      const fallbackQ = `[out:json][timeout:15];(${fallbackSelectors.join("")});out center 1000;`;

      if (typeof window !== "undefined") {
        try {
          const res = await fetch("/api/overpass-proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: fallbackQ, attemptIndex: 0 }),
          });
          if (res.ok) {
            const fbJson = await res.json();
            if (fbJson && Array.isArray(fbJson.elements) && fbJson.elements.length > 0) {
              allElements = fbJson.elements;
            }
          }
        } catch {}
      }

      if (allElements.length === 0) {
        for (const ep of ENDPOINTS) {
          try {
            const res = await fetch(ep, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded", ...UA },
              body: "data=" + encodeURIComponent(fallbackQ),
              signal: AbortSignal.timeout(10000),
            });
            if (res.ok) {
              const fbJson = await res.json();
              if (fbJson.elements && fbJson.elements.length > 0) {
                allElements = fbJson.elements;
                break;
              }
            }
          } catch {
            continue;
          }
        }
      }
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
    // Bancos e Instituições Financeiras
    'banco', 'itau', 'itaú', 'bradesco', 'santander', 'caixa economica', 'caixa econômica',
    'banco do brasil', 'banrisul', 'sicoob', 'sicredi', 'safra', 'btg pactual', 'c6 bank',
    'banco inter', 'nubank', 'banco pan', 'bv financeira', 'banco original', 'banco bmg',
    'banco24horas', 'banco 24 horas', 'casa lotérica', 'loterica', 'lotérica', 'western union',
    'banco da amazonia', 'banco da amazônia', 'banco do nordeste', 'crefisa',

    // Grandes Redes de Fast-Food e Franquias Globais
    'mcdonald', 'burger king', 'subway', 'kfc', 'starbucks', "habib's", 'habibs',
    "bob's", 'bobs', 'pizza hut', "domino's", 'dominos', 'cacau show', 'kopenhagen',
    'chiquinho sorvetes', 'outback', 'madero', 'giraffas', 'spoleto', 'pizzahut',

    // Grandes Redes de Varejo, Supermercados e Lojas de Departamento
    'carrefour', 'pão de açúcar', 'pao de acucar', 'extra supermercado', 'atacadao', 'atacadão',
    'assai', 'assaí', "sam's club", 'sams club', 'lojas americanas', 'americanas',
    'magazine luiza', 'magalu', 'casas bahia', 'ponto frio', 'fast shop', 'pernambucanas',
    'renner', 'lojas renner', 'riachuelo', 'c&a', 'zara', 'marisa', 'kalunga',
    'leroy merlin', 'telhanorte', 'c&c', 'cec casa', 'petz', 'cobasi', 'smart fit', 'bluefit',
    'dia supermercado', 'supermercado dia', 'hipermercado',

    // Grandes Redes de Farmácias
    'drogasil', 'droga raia', 'drogaria são paulo', 'drogaria sao paulo', 'pague menos',
    'panvel', 'drogaria pacheco', 'extrafarma', 'ultrafarma', 'drogal', 'drogaria araujo',
    'farmácia pague menos',

    // Postos de Combustível Famosos
    'posto ipiranga', 'posto shell', 'posto br', 'posto petrobras', 'petrobras', 'shell',
    'ipiranga', 'raizen', 'raízen', 'ale combustiveis',

    // Órgãos Públicos, Governamentais, Religiosos e de Transporte
    'escola municipal', 'escola estadual', 'colegio estadual', 'colégio estadual',
    'paróquia', 'paroquia', 'igreja', 'templo', 'catedral', 'mesquita', 'sinagoga',
    'ponto de táxi', 'ponto de taxi', 'refeitório comunitário', 'refeitorio comunitario',
    'correios', 'inss', 'receita federal', 'poupatempo', 'detran', 'procon',
    'cartório', 'cartorio', 'prefeitura', 'embaixada', 'consulado', 'tribunal',
    'secretaria de', 'secretaria municipal', 'polícia', 'policia', 'delegacia',
    'upa 24h', 'posto de saúde', 'posto de saude', 'ubs ', 'albergue'
  ];

  // Desduplicação por ID OSM para máxima precisão
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

  return finalElements;
}
