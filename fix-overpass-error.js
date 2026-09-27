const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

c = c.replace(`    if (!json) {
      return [];
    }`, `    if (!json) {
      if (ultimoErro) throw ultimoErro;
      return [];
    }`);

fs.writeFileSync('lib/overpass.ts', c);
