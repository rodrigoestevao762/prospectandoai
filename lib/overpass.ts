// Busca de empresas via Overpass API (OpenStreetMap) — gratuita, sem chave.
// Docs: https://overpass-api.de/ — respeitar limites de uso (1 req/s).

// Endpoints públicos do Overpass — o principal fica sobrecarregado às vezes (504),
// então tentamos os espelhos em sequência.
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

export type EmpresaOSM = {
  osmId: string;
  nome: string;
  categoria: string; // id da categoria
  cidade: string;
  pais: string;
  lat: number;
  lng: number;
  telefone: string | null;
  website: string | null;
  instagram: string | null;
  email: string | null;
  endereco: string;
};

function esc(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** Geocodifica cidade/país via Nominatim (grátis). */
export async function geocodificar(cidade: string, pais?: string): Promise<{ lat: number; lng: number; radiusM: number; paisNome: string } | null> {
  const q = pais ? `${cidade}, ${pais}` : cidade;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`;
  
  let res;
  try {
    res = await fetch(url, { headers: { "User-Agent": "ProspectandoAI/1.0 (prospeccao)" }, signal: AbortSignal.timeout(3000) });
  } catch (err) {
    return null;
  }

  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.length) return null;
  const d = data[0];
  const bbox = String(d.boundingbox || "").split(",");
  // boundingbox: [sul, norte, oeste, leste]
  let radiusM = 15000;
  if (bbox.length === 4) {
    const dLat = Math.abs(parseFloat(bbox[1]) - parseFloat(bbox[0])) * 111000;
    const dLng = Math.abs(parseFloat(bbox[3]) - parseFloat(bbox[2])) * 111000;
    radiusM = Math.min(45000, Math.max(3000, Math.round(Math.max(dLat, dLng) / 2)));
  }
  return { lat: parseFloat(d.lat), lng: parseFloat(d.lon), radiusM, paisNome: d.display_name?.split(",").pop()?.trim() || pais || "" };
}

/** Busca empresas por tags num raio ao redor do ponto.
 *  `classificar` (opcional): recebe as tags OSM do elemento e devolve o id da categoria —
 *  usado no mapa, onde a busca junta tags de todas as categorias. */
export async function buscarEmpresas(
  categoriaId: string,
  tags: string[],
  lat: number,
  lng: number,
  radiusM: number,
  cidade: string,
  pais: string,
  classificar?: (t: Record<string, string>) => string
): Promise<EmpresaOSM[]> {
  const around = radiusM > 0 ? `(around:${radiusM},${lat},${lng})` : "";
  const selectors = tags.map((t) => {
    if (t.includes("~")) {
      const [k, v] = t.split("~");
      return `nwr["${k}"~"${esc(v)}",i]${around};`;
    }
    const [k, v] = t.split("=");
    return `nwr["${k}"="${esc(v)}"]${around};`;
  });
  // Limite massivo de 15000 resultados para velocidade e volume de extração extremo
  const query = `[out:json][timeout:10];(${selectors.join("")});out center 15000;`;

  
  const UA = { "User-Agent": "ProspectandoAI/1.0 (prospeccao de empresas)" };

  const fetchOverpass = async (url: string) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", ...UA },
      body: "data=" + encodeURIComponent(query),
      signal: AbortSignal.timeout(7500),
    });
    if (!res.ok) throw new Error(`Overpass ${res.status}`);
    const data = await res.json();
    if (!data || !data.elements) throw new Error("Invalid JSON");
    return data;
  };

  let json: { elements?: any[] } | null = null;
  try {
    json = await Promise.any(OVERPASS_ENDPOINTS.map(url => fetchOverpass(url)));
  } catch (e) {
    throw new Error("Os servidores do mapa estão sobrecarregados no momento. Por favor, tente novamente em alguns segundos.");
  }

  const seen = new Set<string>();

  const out: EmpresaOSM[] = [];
  for (const el of json.elements || []) {
    const t = el.tags || {};
    if (!t.name) continue;
    const osmId = `${el.type}/${el.id}`;
    if (seen.has(osmId)) continue;
    seen.add(osmId);
    const clat = el.lat ?? el.center?.lat;
    const clng = el.lon ?? el.center?.lon;
    if (clat == null || clng == null) continue;
    // filtra duplicados pelo nome+rua
    const key = (t.name + "|" + (t["addr:street"] || "")).toLowerCase();
    if (seen.has("n:" + key)) continue;
    seen.add("n:" + key);
    const addr = [t["addr:street"], t["addr:housenumber"], t["addr:suburb"]].filter(Boolean).join(", ");
    out.push({
      osmId,
      nome: t.name,
      categoria: classificar ? classificar(t) : categoriaId,
      cidade,
      pais,
      lat: clat,
      lng: clng,
      telefone: t.phone || t["contact:phone"] || null,
      website: t.website || t["contact:website"] || null,
      instagram: t["contact:instagram"] || (t.instagram ? t.instagram : null),
      email: t.email || t["contact:email"] || null,
      endereco: addr,
    });
  }
  return out;
}
