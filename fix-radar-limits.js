const fs = require('fs');

// 1. Update API route for Insta
let cInsta = fs.readFileSync('app/api/buscar-insta/route.ts', 'utf8');
cInsta = cInsta.replace(/const { nicho, cidade } = await req\.json\(\);/, 'const { nicho, cidade, limit } = await req.json();');
cInsta = cInsta.replace(/await radarInstagram\(nicho \|\| "", cidade \|\| ""\);/, 'await radarInstagram(nicho || "", cidade || "", limit || 300);');
fs.writeFileSync('app/api/buscar-insta/route.ts', cInsta);

// 2. Update API route for Foods
let cFoods = fs.readFileSync('app/api/buscar-foods/route.ts', 'utf8');
cFoods = cFoods.replace(/const { nicho, cidade } = await req\.json\(\);/, 'const { nicho, cidade, limit } = await req.json();');
cFoods = cFoods.replace(/await radarFoods\(nicho \|\| "", cidade \|\| ""\);/, 'await radarFoods(nicho || "", cidade || "", limit || 300);');
fs.writeFileSync('app/api/buscar-foods/route.ts', cFoods);

// 3. Update enrichment.ts to accept limit and pass it correctly
let cEnrich = fs.readFileSync('lib/enrichment.ts', 'utf8');
cEnrich = cEnrich.replace(/export async function radarInstagram\(nicho: string, cidade: string\)/, 'export async function radarInstagram(nicho: string, cidade: string, limit: number = 300)');
cEnrich = cEnrich.replace(/export async function radarFoods\(nicho: string, cidade: string\)/, 'export async function radarFoods(nicho: string, cidade: string, limit: number = 300)');

// Inside radarInstagram, find overpass call
cEnrich = cEnrich.replace(/leadsOSM = await buscarEmpresas\("todos", \["name~\.", "contact:instagram~."\], geo\.lat, geo\.lng, geo\.radiusM, cid, geo\.paisNome\);/g, 
  'leadsOSM = await buscarEmpresas("todos", ["name~.", "contact:instagram~."], geo.lat, geo.lng, geo.radiusM, cid, geo.paisNome, geo.bbox, limit);');

cEnrich = cEnrich.replace(/buscarOutscraper\(query, key, 500\)/g, 'buscarOutscraper(query, key, Math.min(limit, 500))');
cEnrich = cEnrich.replace(/slice\(0, 1500\)/g, 'slice(0, limit)');
cEnrich = cEnrich.replace(/slice\(0, 3000\)/g, 'slice(0, limit)');

// Inside radarFoods, find overpass call
cEnrich = cEnrich.replace(/leadsOSM = await buscarEmpresas\("todos", \["name~\.", "amenity~restaurant\|fast_food\|cafe\|bar\|pub", "delivery~yes\|only"\], geo\.lat, geo\.lng, geo\.radiusM, cid, geo\.paisNome\);/g, 
  'leadsOSM = await buscarEmpresas("todos", ["name~.", "amenity~restaurant|fast_food|cafe|bar|pub", "delivery~yes|only"], geo.lat, geo.lng, geo.radiusM, cid, geo.paisNome, geo.bbox, limit);');

fs.writeFileSync('lib/enrichment.ts', cEnrich);
console.log("Success");
