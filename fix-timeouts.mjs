import fs from 'fs';

// 1. Fix lib/outscraper.ts
let outscraper = fs.readFileSync('lib/outscraper.ts', 'utf-8');
if (!outscraper.includes('AbortSignal.timeout')) {
  outscraper = outscraper.replace(
    /const res = await fetch\(/,
    `const res = await fetch(`
  );
  // Actually let's just replace the whole fetch block safely
  outscraper = outscraper.replace(
    /const res = await fetch\([\s\S]*?\}\);/,
    `let res;
  try {
    res = await fetch(\`https://api.outscraper.com/maps/search-v3?\${params.toString()}\`, {
      method: "GET",
      headers: { "X-API-KEY": apiKey },
      signal: AbortSignal.timeout(20000)
    });
  } catch (err) {
    console.error("Outscraper timeout/erro:", err);
    return [];
  }`
  );
  fs.writeFileSync('lib/outscraper.ts', outscraper);
}

// 2. Fix lib/overpass.ts
let overpass = fs.readFileSync('lib/overpass.ts', 'utf-8');
if (!overpass.includes('AbortSignal.timeout')) {
  // Geocodificar
  overpass = overpass.replace(
    /res = await fetch\(url, \{ headers: \{ "User-Agent": "ProspectandoAI\/1\.0 \(prospeccao\)" \},  \}\);/,
    `res = await fetch(url, { headers: { "User-Agent": "ProspectandoAI/1.0 (prospeccao)" }, signal: AbortSignal.timeout(10000) });`
  );
  // Buscar Empresas
  overpass = overpass.replace(
    /body: "data=" \+ encodeURIComponent\(query\),/,
    `body: "data=" + encodeURIComponent(query),\n        signal: AbortSignal.timeout(15000),`
  );
  // Prevent DOMException throw
  overpass = overpass.replace(
    /if \(!json\) throw ultimoErro \|\| new Error\("Overpass indisponível"\);/,
    `if (!json) {\n    if (ultimoErro && ultimoErro.name === "TimeoutError") throw new Error("Busca demorou muito, tente uma área menor.");\n    return [];\n  }`
  );
  fs.writeFileSync('lib/overpass.ts', overpass);
}

// 3. Fix lib/enrichment.ts
let enrichment = fs.readFileSync('lib/enrichment.ts', 'utf-8');
if (!enrichment.includes('AbortSignal.timeout(8000)')) {
  enrichment = enrichment.replace(
    /headers: \{\n\s+'User-Agent': 'Mozilla\/5\.0 \([^)]+\) AppleWebKit\/537\.36 \(KHTML, like Gecko\) Chrome\/120\.0\.0\.0 Safari\/537\.36',\n\s+'Accept': 'text\/html[^']+',\n\s+'Accept-Language': 'pt-BR[^']+'\n\s+\}/,
    `headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      signal: AbortSignal.timeout(8000)`
  );
  fs.writeFileSync('lib/enrichment.ts', enrichment);
}

