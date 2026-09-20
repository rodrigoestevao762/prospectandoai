import fs from 'fs';

let overpass = fs.readFileSync('lib/overpass.ts', 'utf-8');

// Replace the loop with Promise.any
const newBuscarLogic = `
  const UA = { "User-Agent": "ProspectandoAI/1.0 (prospeccao de empresas)" };

  const fetchOverpass = async (url: string) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", ...UA },
      body: "data=" + encodeURIComponent(query),
      signal: AbortSignal.timeout(7500),
    });
    if (!res.ok) throw new Error(\`Overpass \${res.status}\`);
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
`;

const oldBuscarLogicRegex = /const UA = \{ "User-Agent": "ProspectandoAI\/1\.0 \(prospeccao de empresas\)" \};[\s\S]*?const seen = new Set<string>\(\);/;

overpass = overpass.replace(oldBuscarLogicRegex, newBuscarLogic);

// Fix geocodificar timeout and catch
const oldGeoRegex = /let res;\s*try \{\s*res = await fetch\(url, \{ headers: \{ "User-Agent": "ProspectandoAI\/1\.0 \(prospeccao\)" \}, signal: AbortSignal\.timeout\(\d+\) \}\);\s*\} catch \(err\) \{\s*return null;\s*\}/;
overpass = overpass.replace(oldGeoRegex, `
  let res;
  try {
    res = await fetch(url, { headers: { "User-Agent": "ProspectandoAI/1.0 (prospeccao)" }, signal: AbortSignal.timeout(3000) });
  } catch (err) {
    return null;
  }
`);

fs.writeFileSync('lib/overpass.ts', overpass);
