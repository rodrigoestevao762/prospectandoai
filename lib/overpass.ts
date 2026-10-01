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
      
      // MEGA BRAIN CLUSTER CHUNKING:
      // Limites incrivelmente maiores porque a busca será fatiada nos múltiplos servidores!
      // A matemática da área: 0.16 x 0.16 = 4 quadrantes de 0.08 x 0.08 (Tamanho perfeito que não dá timeout!)
      // A matemática da área: Se for "Todos os Comércios", NÃO podemos passar de 0.1 (0.05 por quadrante),
      // ou o servidor alemão corta a conexão com 504 Gateway Timeout por excesso de carga no Load Balancer.
      // MEGA BRAIN CHUNKING UNIVERSAL
      // O limite geográfico máximo deve ser estrito (0.1) para QUALQUER busca massiva (>300).
      // Em cidades gigantescas (Genoa, Roma), pedir 500 Pizzarias em 22km (0.2) estoura o balanceador de carga.
      // MEGA BRAIN CHUNKING UNIVERSAL (FIX)
      // O limite deve ser 0.1 para TODAS as buscas. 
      // 0.2 gera quadrantes de 0.1 que causam 504 Gateway Timeout nas partes densas de cidades históricas.
      // Ajuste inteligente: se o usuario quer poucos leads (<= 500), 11km (0.1) eh mais q suficiente e ultra rapido.
      // Se ele quiser milhares (1000+), precisamos de 22km (0.2) senao nao acha quantidade suficiente.
      // Ajuste inteligente: Para "Todos os Comercios", 11km (0.1) SEMPRE tem milhares de resultados. Passar disso causa timeout.
      // Para nichos especificos (ex: Pizzaria), se o usuario pedir muitos leads (>500), expandimos para 22km (0.2).
      let maxDelta = 0.1;
      if (categoria !== "todos" && limit && limit > 500) {
          maxDelta = 0.2;
      }
      
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
      if (categoria === "todos") {
          selectors = [
              `nwr[name]["amenity"];`,
              `nwr[name]["shop"];`,
              `nwr[name]["office"];`,
              `nwr[name]["leisure"];`,
              `nwr[name]["healthcare"];`,
              `nwr[name]["craft"];`,
              `nwr[name]["tourism"];`,
              `nwr[name]["sport"];`
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
    let bboxes = [bboxString];
    if (bbox && bbox.length === 4 && bboxString) {
        const [s, w, n, e] = bbox;
        const midLat = (s + n) / 2;
        const midLon = (w + e) / 2;
        bboxes = [
          `[bbox:${s},${w},${midLat},${midLon}]`,
          `[bbox:${midLat},${w},${n},${midLon}]`,
          `[bbox:${s},${midLon},${midLat},${e}]`,
          `[bbox:${midLat},${midLon},${n},${e}]`
        ];
    }

    const allElements: any[] = [];
    // Cada quadrante pede o `limit` integral. Depois cortamos o excesso.
    const fetchQ = async (bString: string, endpointUrl: string) => {
        const q = `[out:json][timeout:45]${bString};(${selectors.join("")});out center ${limit && limit > 0 ? limit : 10000};`;
        const res = await fetch(endpointUrl, {
           method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", ...UA },
           body: "data=" + encodeURIComponent(q), signal: AbortSignal.timeout(50000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.elements) return data.elements;
        return [];
    };

    // Associa cada quadrante a um endpoint. Como temos 4 quadrantes e 3 endpoints, o 4º reusa o 1º.
    const settled = await Promise.allSettled(bboxes.map((bStr, i) => fetchQ(bStr, endpoints[i % endpoints.length])));
    
    for (const res of settled) {
        if (res.status === 'fulfilled') {
            allElements.push(...res.value);
        }
    }

    let hasSuccess = settled.some(r => r.status === 'fulfilled');
    if (allElements.length === 0 && !hasSuccess) {
        throw new Error("Timeout interno do Overpass em todos os quadrantes");
    }

    // Filtra IDs duplicados caso quadrantes se sobreponham levemente nas bordas
    const uniqueElements = Array.from(new Map(allElements.map(e => [e.id, e])).values());

    json = { elements: uniqueElements };

  } catch (err: any) {
    ultimoErro = "Todos os satélites falharam ou deram timeout.";
  }

  if (!json || (json.elements && json.elements.length === 0 && (json as any).remark && String((json as any).remark).includes("timeout"))) {
    throw new Error("A região é muito densa e a API Global (Overpass) demorou mais que 120 segundos para responder. Tente reduzir o número de leads MÁX.");
  }

  if (!json.elements) return [];

  const finalElements = json.elements.map((e: any) => ({
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
