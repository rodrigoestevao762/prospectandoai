const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

c = c.replace(/if \(\!json\) \{\s*return \[\];\s*\}/g, `if (!json) {\n      if (ultimoErro) throw ultimoErro;\n      return [];\n    }`);

fs.writeFileSync('lib/overpass.ts', c);
