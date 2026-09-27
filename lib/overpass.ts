import { isEmailValidoParaB2B } from "./validar-email";
﻿import { getCategoria } from "./categorias";

export async function geocodificar(cidade: string) {
  if (!cidade || cidade.toLowerCase() === "mundial") return null;
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cidade)}`, {
    headers: { "User-Agent": "ProspectAI/1.0" },
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json || json.length === 0) return null;
  const item = json[0];
  
  let paisNome = "";
  const parts = item.display_name.split(",");
  if (parts.length > 0) paisNome = parts[parts.length - 1].trim();

  let bboxStr = item.boundingbox; 
  let bbox = null;
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
  limit?: number
) {
  let tags = categoria === "todos" ? getCategoria("todos")?.tags || [] : getCategoria(categoria)?.tags || [];
  if (tags.length === 0 && categoria !== "todos") tags = [`amenity~"${categoria}"`, `shop~"${categoria}"`];
  if (extraTags.length > 0) tags = extraTags;

  let bboxString = "";
  let around = "";
  if (bbox && bbox.length === 4) {
    let [s, w, n, e] = bbox;
    
    // MEGA BRAIN DYNAMIC CLAMPING: 
    // Ajusta o tamanho da área pesquisada com base no limite solicitado.
    // Isso impede que pesquisemos 50km (100 segundos) quando o usuário só quer 300 leads.
    const requestedLimit = limit && limit > 0 ? limit : 10000;
    
    // Se a busca tem mais de 5 tags, ela é "pesada".
    if (tags.length > 5) {
      let maxDelta = 0.02; // ~2km (bom para 300 leads)
      
      if (requestedLimit > 500) maxDelta = 0.04; // ~4km
      if (requestedLimit > 1500) maxDelta = 0.08; // ~8km
      if (requestedLimit > 4000) maxDelta = 0.15; // ~16km
      if (requestedLimit > 8000) maxDelta = 0.25; // ~26km
      
      const latC = s + (n - s) / 2;
      const lonC = w + (e - w) / 2;
      if (n - s > maxDelta) { s = latC - maxDelta/2; n = latC + maxDelta/2; }
      if (e - w > maxDelta) { w = lonC - maxDelta/2; e = lonC + maxDelta/2; }
    }

    bboxString = `[bbox:${s},${w},${n},${e}]`;
  } else if (radiusM > 0) {
    around = `(around:${radiusM},${lat},${lng})`;
  } else {
    bboxString = `[bbox:-90,-180,90,180]`;
  }

  function esc(st: string) { return st.replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }
  const selectors = tags.map((t) => {
    if (t.includes("~")) {
      const [k, v] = t.split("~");
      
      // Suporte para case-insensitive (ex: name~barbearia,i)
      if (v.endsWith(',i')) {
        return `nwr["${k}"~"${esc(v.slice(0, -2))}",i]${around};`;
      }
      return `nwr["${k}"~"${esc(v)}"]${around};`;
  
    } else if (t.includes("=")) {
      const [k, v] = t.split("=");
      return `nwr["${k}"="${esc(v)}"]${around};`;
    }
    return `nwr["${t}"]${around};`;
  });

  const query = `[out:json][timeout:120]${bboxString};(${selectors.join("")});out center ${limit && limit > 0 ? limit : 10000};`;
  const UA = { "User-Agent": "ProspectAI/1.0 (prospeccao de empresas)" };

  let json: { elements?: any[] } | null = null;
  let ultimoErro = "";

  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", ...UA },
        body: "data=" + encodeURIComponent(query),
        signal: AbortSignal.timeout(125000),
      });
      if (res.ok) {
        json = await res.json();
        break;
      } else {
        ultimoErro = `HTTP ${res.status}`;
      }
    } catch (err: any) {
      ultimoErro = err.message;
    }
  }

  if (!json || (json.elements && json.elements.length === 0 && (json as any).remark && String((json as any).remark).includes("timeout"))) {
    throw new Error("A região é muito densa e a API Global (Overpass) demorou mais que 120 segundos para responder. Tente reduzir o número de leads MÁX.");
  }

  if (!json.elements) return [];

  return json.elements.map((e: any) => ({
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
}
