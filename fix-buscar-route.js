const fs = require('fs');
let c = fs.readFileSync('app/api/buscar/route.ts', 'utf8');

c = c.replace('const { categoria, cidade, pais, motor = "overpass" } = await req.json();', 'const { categoria, cidade, pais, limit, motor = "overpass" } = await req.json();');
c = c.replace('geo.radiusM, cidade, geo.paisNome', 'geo.radiusM, cidade, geo.paisNome, undefined, limit');

fs.writeFileSync('app/api/buscar/route.ts', c);
