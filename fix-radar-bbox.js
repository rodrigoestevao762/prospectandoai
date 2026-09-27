const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

c = c.replace(/buscarEmpresas\(\s*cat\?\.id \|\| "todos",\s*tags,\s*geo\.lat,\s*geo\.lng,\s*geo\.radiusM,\s*cidade,\s*geo\.paisNome,\s*undefined,\s*limitFinal,\s*geo\.bbox\s*\);/, 
  'buscarEmpresas(cat?.id || "todos", tags, geo.lat, geo.lng, geo.radiusM, cidade, geo.paisNome, geo.bbox, limitFinal);');

fs.writeFileSync('app/app/busca/page.tsx', c);
