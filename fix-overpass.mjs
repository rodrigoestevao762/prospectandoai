import fs from 'fs';

let overpass = fs.readFileSync('lib/overpass.ts', 'utf-8');

// Add timeout to Nominatim
overpass = overpass.replace(
  'const res = await fetch(url, { headers: { "User-Agent": "ProspectandoAI/1.0 (prospeccao)" } });',
  'const res = await fetch(url, { headers: { "User-Agent": "ProspectandoAI/1.0 (prospeccao)" }, signal: AbortSignal.timeout(4000) });'
);

// Optimize Overpass endpoints and timeouts
overpass = overpass.replace(/signal: AbortSignal\.timeout\(90_000\),/g, 'signal: AbortSignal.timeout(5000),');
overpass = overpass.replace(/\[timeout:60\]/g, '[timeout:10]');

// Reduce retries to 1 to fail fast and let the fallback handle it
overpass = overpass.replace('for (let tentativa = 0; tentativa < 2; tentativa++) {', 'for (let tentativa = 0; tentativa < 1; tentativa++) {');

fs.writeFileSync('lib/overpass.ts', overpass);
