const fs = require('fs');
let c = fs.readFileSync('app/api/buscar-foods/route.ts', 'utf8');

c = c.replace(/const { nicho, cidade, motor = "overpass" } = await req\.json\(\);/, 'const { nicho, cidade, limit, motor = "overpass" } = await req.json();');

fs.writeFileSync('app/api/buscar-foods/route.ts', c);
