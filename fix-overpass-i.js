const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

c = c.replace(/return \`nwr\["\$\{k\}"~"\$\{esc\(v\)\}"\]\$\{around\};\`;/g, 
  `
      // Suporte para case-insensitive (ex: name~barbearia,i)
      if (v.endsWith(',i')) {
        return \`nwr["\${k}"~"\${esc(v.slice(0, -2))}",i]\${around};\`;
      }
      return \`nwr["\${k}"~"\${esc(v)}"]\${around};\`;
  `);

fs.writeFileSync('lib/overpass.ts', c);
