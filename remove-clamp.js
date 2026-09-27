const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

const targetToRemove = `    // Se for uma busca muito pesada (ex: Todos os Comércios tem > 40 tags),
    // reduzimos a área de busca drasticamente para não dar 504 Timeout no Overpass
    if (tags.length > 20) {
      const maxDelta = 0.015; // ~1.6km
      const latC = s + (n - s) / 2;
      const lonC = w + (e - w) / 2;
      if (n - s > maxDelta) { s = latC - maxDelta/2; n = latC + maxDelta/2; }
      if (e - w > maxDelta) { w = lonC - maxDelta/2; e = lonC + maxDelta/2; }
    }`;

c = c.replace(targetToRemove, '');

c = c.replace('[timeout:90]', '[timeout:120]');
c = c.replace('AbortSignal.timeout(90000)', 'AbortSignal.timeout(125000)');

fs.writeFileSync('lib/overpass.ts', c);
