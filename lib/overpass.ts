// Busca de empresas via Overpass API (OpenStreetMap)
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

export type EmpresaOSM = {
  osmId: string;
  nome: string;
  categoria: string;
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

export async function geocodificar(cidade: string, pais?: string): Promise<{ lat: number; lng: number; radiusM: number; paisNome: string } | null> {
  const q = pais ? `${cidade}, ${pais}` : cidade;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`;
  let res;
  try {
    res = await fetch(url, { headers: { "User-Agent": "ProspectandoAI/1.0 (prospeccao)" }, signal: AbortSignal.timeout(5000) });
  } catch (err) {
    return null;
  }
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.length) return null;
  const d = data[0];
  const bbox = String(d.boundingbox || "").split(",");
  let radiusM = 15000;
  if (bbox.length === 4) {
    const dLat = Math.abs(parseFloat(bbox[1]) - parseFloat(bbox[0])) * 111000;
    const dLng = Math.abs(parseFloat(bbox[3]) - parseFloat(bbox[2])) * 111000;
    radiusM = Math.min(50000, Math.max(3000, Math.round(Math.max(dLat, dLng) / 2)));
  }
  return { lat: parseFloat(d.lat), lng: parseFloat(d.lon), radiusM, paisNome: d.display_name?.split(",").pop()?.trim() || pais || "" };
}

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
      return `nw["${k}"~"${esc(v)}",i]${around};`;
    }
    const [k, v] = t.split("=");
    return `nw["${k}"="${esc(v)}"]${around};`;
  });
  
  // Aumentar o limite do timeout para 50s e o teto de resultados para 10000
  const query = `[out:json][timeout:50];(${selectors.join("")});out center 10000;`;
  const UA = { "User-Agent": "ProspectandoAI/1.0 (prospeccao de empresas)" };

  let json: { elements?: any[] } | null = null;
  let ultimoErro: Error | null = null;
  
  for (const url of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", ...UA },
        body: "data=" + encodeURIComponent(query),
        // Timeout maior para garantir puxadas de milhares de leads
        signal: AbortSignal.timeout(50000),
        
      });
      if (res.ok) {
        json = await res.json();
        break;
      }
      ultimoErro = new Error(`Overpass ${res.status}`);
      if (res.status === 400) throw ultimoErro; 
    } catch (e) {
      ultimoErro = e instanceof Error ? e : new Error(String(e));
      if (ultimoErro.message.startsWith("Overpass 400")) throw ultimoErro;
    }
  }

  if (!json) {
    return [];
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
