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

  let s = lat - 0.03;
  let n = lat + 0.03;
  let w = lng - 0.03;
  let e = lng + 0.03;

  if (bbox && bbox.length === 4) {
    s = bbox[0];
    w = bbox[1];
    n = bbox[2];
    e = bbox[3];
  }

  // Delta calibrado para zero Timeouts (504) mesmo em capitais e metrópoles mundiais
  const maxDelta = categoria === "todos" ? (0.035 * radiusMultiplier) : (0.08 * radiusMultiplier);
  const latC = (s + n) / 2;
  const lonC = (w + e) / 2;

  if (n - s > maxDelta) { s = latC - maxDelta / 2; n = latC + maxDelta / 2; }
  if (e - w > maxDelta) { w = lonC - maxDelta / 2; e = lonC + maxDelta / 2; }

  const midLat = (s + n) / 2;
  const midLon = (w + e) / 2;

  const bboxes = [
    `[bbox:${s},${w},${midLat},${midLon}]`,
    `[bbox:${midLat},${w},${n},${midLon}]`,
    `[bbox:${s},${midLon},${midLat},${e}]`,
    `[bbox:${midLat},${midLon},${n},${e}]`
  ];

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
      `nw[name]["amenity"];`,
      `nw[name]["shop"];`,
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

  const UA = { "User-Agent": "ProspectAI/2.0 (B2B Lead Discovery)" };
  const ENDPOINTS = [
    "https://z.overpass-api.de/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter"
  ];

  const perQuadrantLimit = limit && limit > 0 ? Math.ceil(limit / 2) : 2500;
  const fetchQuadrantWithRetry = async (bString: string, idx: number) => {
    const q = `[out:json][timeout:25]${bString};(${selectors.join("")});out center ${perQuadrantLimit};`;
    for (let attempt = 0; attempt < ENDPOINTS.length; attempt++) {
      const ep = ENDPOINTS[(idx + attempt) % ENDPOINTS.length];
      try {
        const res = await fetch(ep, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded", ...UA },
          body: "data=" + encodeURIComponent(q),
          signal: AbortSignal.timeout(14000),
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
    const quadrantResults = await Promise.all(
      bboxes.map((bStr, i) => fetchQuadrantWithRetry(bStr, i))
    );
    allElements = quadrantResults.flat();
  } catch {
    allElements = [];
  }

  // Fallback com centro geográfico caso os quadrantes retornem vazios
  if (allElements.length === 0) {
    try {
      const fallbackAround = `(around:4000,${lat},${lng})`;
      const fallbackSelectors = selectors.map(s => s.replace(";", "") + fallbackAround + ";");
      const fallbackQ = `[out:json][timeout:20];(${fallbackSelectors.join("")});out center 1000;`;
      for (const ep of ENDPOINTS) {
        try {
          const res = await fetch(ep, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", ...UA },
            body: "data=" + encodeURIComponent(fallbackQ),
            signal: AbortSignal.timeout(12000),
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
    } catch {
      // Ignorar fallback
    }
  }

  const blockedTags = ['government', 'diplomatic', 'embassy', 'townhall', 'police', 'fire_station', 'military', 'quango', 'courthouse', 'prison', 'ngo'];
  const blockedNames = ['embaixada', 'embassy', 'prefeitura', 'ministério', 'ministry', 'governo', 'government', 'câmara municipal', 'câmara dos', 'consulado', 'consulate', 'tribunal', 'court of', 'police', 'polícia', 'departamento de', 'secretaria de', 'órgão', 'orgao'];

  const finalElements = allElements.filter((e: any) => {
    if (e.tags?.office && blockedTags.includes(e.tags.office)) return false;
    if (e.tags?.amenity && blockedTags.includes(e.tags.amenity)) return false;
    if (e.tags?.military) return false;
    
    const n = (e.tags?.name || "").toLowerCase();
    if (blockedNames.some(term => n.includes(term))) return false;
    
    return true;
  }).map((e: any) => ({
    osmId: String(e.id),
    nome: e.tags?.name || "Empresa Desconhecida",
    categoria,
    cidade: e.tags?.["addr:city"] || cidade,
    pais: pais,
    endereco: [e.tags?.["addr:street"], e.tags?.["addr:housenumber"]].filter(Boolean).join(", ") || "",
    telefone: e.tags?.phone || e.tags?.["contact:phone"] || e.tags?.whatsapp || e.tags?.["contact:whatsapp"] || null,
    website: e.tags?.website || e.tags?.["contact:website"] || null,
    instagram: e.tags?.["contact:instagram"] || e.tags?.instagram || null,
    email: e.tags?.email || e.tags?.["contact:email"] || null,
    facebook: e.tags?.["contact:facebook"] || e.tags?.facebook || null,
  })).filter((e: any) => e.nome !== "Empresa Desconhecida");

  // De-duplicação inteligente por Unidade/Filial:
  // Permite filiais com o mesmo nome em ruas ou endereços diferentes (ou nós distintos do mapa)
  const uniqueByName: any[] = [];
  const seenKeys = new Set<string>();
  for (const el of finalElements) {
    const nome = el.nome.toLowerCase().trim();
    const end = el.endereco ? el.endereco.toLowerCase().trim() : "";
    const key = end ? `${nome}::${end}` : `${nome}::${el.osmId}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueByName.push(el);
    }
  }
  return uniqueByName;
}
