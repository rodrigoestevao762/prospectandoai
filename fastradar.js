const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

c = c.replace(/<motion\.div\s+key=\{emp\.osmId\}\s+initial=\{\{ opacity: 0, scale: 0\.95, y: 20 \}\}\s+animate=\{\{ opacity: 1, scale: 1, y: 0 \}\}\s+transition=\{\{ delay: Math\.min\(i \* 0\.05, 0\.5\) \}\}/g, '<div key={emp.osmId}');
c = c.replace(/<\/motion\.div>\s+\);\s+\}\)\}/g, '</div>\n                  );\n                })}');

fs.writeFileSync('app/app/busca/page.tsx', c);
