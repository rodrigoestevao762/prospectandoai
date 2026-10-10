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
  bbox?: number[] | null, limit?: number, radiusMultiplier: number = 1
) {
  let tags = categoria === "todos" ? getCategoria("todos")?.tags || [] : getCategoria(categoria)?.tags || [];
  if (tags.length === 0 && categoria !== "todos") tags = [`amenity~"${categoria}"`, `shop~"${categoria}"`];
  if (extraTags.length > 0) tags = extraTags;

  const baseTags = tags.filter(t => !t.startsWith("AND:"));
  const andTags = tags.filter(t => t.startsWith("AND:")).map(t => t.substring(4));

  let bboxString = "";
  const finalRadius = radiusM * radiusMultiplier;
  const around = `(around:${finalRadius},${lat},${lng})`;

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
              `nw[name]["amenity"]${around};`,
              `nw[name]["shop"]${around};`,
              `nw[name]["office"]${around};`
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
          return sel + andModifiers + around + ";";
        });
      }


  const UA = { "User-Agent": "ProspectAI/1.0 (prospeccao de empresas)" };
  let json: { elements?: any[] } | null = null;
  let ultimoErro = "";

  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
  ];

  // MEGA BRAIN HYPER-CLUSTER CHUNKING ⚡🛰️🌍
  // Divide a bounding box em 4 quadrantes e atira nos 3 servidores globais ao mesmo tempo!
  try {
    const fetchQ = async (endpointUrl: string) => {
        const q = `[out:json][timeout:45];(${selectors.join("")});out center ${limit && limit > 0 ? limit : 10000};`;
        const res = await fetch(endpointUrl, {
           method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", ...UA },
           body: "data=" + encodeURIComponent(q), signal: AbortSignal.timeout(50000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.elements) return data.elements;
        return [];
    };

    const elements = await fetchQ(endpoints[Math.floor(Math.random() * endpoints.length)]);
    json = { elements };

  } catch (err: any) {
    ultimoErro = "Todos os satélites falharam ou deram timeout.";
  }

  if (!json || (json.elements && json.elements.length === 0 && (json as any).remark && String((json as any).remark).includes("timeout"))) {
    throw new Error("A varredura exigiu muito processamento dos satlites para esta regio especfica e sofreu Timeout interno. Tente buscar um volume menor de leads ou pesquise por um bairro especfico.");
  }

  if (!json.elements) return [];

  const blockedTags = ['government', 'diplomatic', 'embassy', 'townhall', 'police', 'fire_station', 'military', 'quango', 'courthouse', 'prison', 'ngo'];
  const blockedNames = ['embaixada', 'embassy', 'prefeitura', 'minist?rio', 'ministry', 'governo', 'government', 'c?mara municipal', 'c?mara dos', 'consulado', 'consulate', 'tribunal', 'court of', 'police', 'pol?cia', 'departamento de', 'secretaria de', '?rg?o', 'orgao'];

  const finalElements = json.elements.filter((e: any) => {
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

  // MEGA BRAIN DE-DUPLICATION
  // Remove comércios com o mesmo nome para manter o CRM limpo e evitar que Nodes e Ways do mesmo prédio gerem clones
  const uniqueByName = [];
  const seenNames = new Set();
  for (const el of finalElements) {
      const key = el.nome.toLowerCase().trim();
      if (!seenNames.has(key)) {
          seenNames.add(key);
          uniqueByName.push(el);
      }
  }
  return uniqueByName;
}
