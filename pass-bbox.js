const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

c = c.split('geo.paisNome, undefined, limitFinal').join('geo.paisNome, undefined, limitFinal, geo.bbox');

fs.writeFileSync('app/app/busca/page.tsx', c);

let c2 = fs.readFileSync('app/api/buscar/route.ts', 'utf8');
c2 = c2.split('geo.paisNome, undefined, limit').join('geo.paisNome, undefined, limit, geo.bbox');
fs.writeFileSync('app/api/buscar/route.ts', c2);

