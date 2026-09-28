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
  
    // Preferir city/town/village se houver, para evitar pegar o centro geográfico vazio de um país inteiro (ex: Luxemburgo)
    let item = json[0];
    const cityItem = json.find((x: any) => x.type === "city" || x.type === "town" || x.type === "administrative" && x.addresstype === "city");
    if (cityItem) item = cityItem;

  
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

  const baseTags = tags.filter(t => !t.startsWith("AND:"));
  const andTags = tags.filter(t => t.startsWith("AND:")).map(t => t.substring(4));

  let bboxString = "";
  let around = "";
  if (bbox && bbox.length === 4) {
      let [s, w, n, e] = bbox;
      
      // MEGA BRAIN DYNAMIC CLAMPING v2: 
      // Sempre aplica um limite seguro (maxDelta) independentemente do nmero de tags ou tamanho original,
      // porque mesmo a bbox de uma nica cidade (ex: Porto Alegre) pode causar Timeout 504 no Overpass.
      let maxDelta = 0.2; // ~22kmx22km (cobre o centro expandido de 90% das capitais globais sem timeout)
        if (limit && limit <= 100) maxDelta = 0.1;
        if (baseTags.length > 20) maxDelta = 0.05; // ~5.5kmx5.5km para buscas "Todos os Comércios", senão causa Timeout 504 (Overpass overloaded)
        
        const latC = (s + n) / 2;
        const lonC = (w + e) / 2;
        
        if (n - s > maxDelta) { s = latC - maxDelta/2; n = latC + maxDelta/2; }
      if (e - w > maxDelta) { w = lonC - maxDelta/2; e = lonC + maxDelta/2; }

      bboxString = `[bbox:${s},${w},${n},${e}]`;
    } else if (radiusM > 0) {
    around = `(around:${radiusM},${lat},${lng})`;
  } else {
    bboxString = `[bbox:-90,-180,90,180]`;
  }

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
      if (baseTags.length > 20) {
        // MEGA BRAIN GROUPING: Evita erro 406 Not Acceptable por excesso de queries
        const grouped: Record<string, string[]> = {};
        for (const t of baseTags) {
           if (t.includes("=")) {
             const [k, v] = t.split("=");
             if (!grouped[k]) grouped[k] = [];
             grouped[k].push(v);
           } else if (t.includes("~")) {
             const [k, v] = t.split("~");
             if (!grouped[k]) grouped[k] = [];
             const cleanV = v.endsWith(",i") ? v.slice(0, -2) : v;
             grouped[k].push(cleanV);
           }
        }
        for (const k in grouped) {
           const vals = Array.from(new Set(grouped[k])).join("|");
           selectors.push(`nwr["${k}"~"${esc(vals)}"]${andModifiers}${around};`);
        }
      } else {
        selectors = baseTags.map((t) => {
          let sel = "";
          if (t.includes("~")) {
            const [k, v] = t.split("~");
            if (v.endsWith(',i')) {
              sel = `nwr["${k}"~"${esc(v.slice(0, -2))}",i]`;
            } else {
              sel = `nwr["${k}"~"${esc(v)}"]`;
            }
          } else if (t.includes("=")) {
            const [k, v] = t.split("=");
            sel = `nwr["${k}"="${esc(v)}"]`;
          } else {
            sel = `nwr["${t}"]`;
          }
          return sel + andModifiers + around + ";";
        });
      }


  const query = `[out:json][timeout:25]${bboxString};(${selectors.join("")});out center ${limit && limit > 0 ? limit : 10000};`;
  const UA = { "User-Agent": "ProspectAI/1.0 (prospeccao de empresas)" };

  let json: { elements?: any[] } | null = null;
  let ultimoErro = "";

  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
  ];

  // MEGA BRAIN MULTI-SATELLITE PARALLELISM ⚡🛰️
  try {
    json = await Promise.any(endpoints.map(async (url) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", ...UA },
        body: "data=" + encodeURIComponent(query),
        signal: AbortSignal.timeout(28000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.elements && data.elements.length === 0 && (data as any).remark && String((data as any).remark).includes("timeout")) {
        throw new Error("Timeout interno do Overpass");
      }
      return data;
    }));
  } catch (err: any) {
    ultimoErro = "Todos os satélites falharam ou deram timeout.";
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
