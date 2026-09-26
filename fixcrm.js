const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const regex3 = /<motion\.div\s+key=\{l\.id\}\s+initial=\{\{ opacity: 0, y: 16 \}\}\s+animate=\{\{ opacity: 1, y: 0 \}\}\s+transition=\{\{ delay: Math\.min\(i \* 0\.04, 0\.5\), duration: 0\.35, ease: "easeOut" \}\}/g;
const replacement3 = "<div key={l.id}";

c = c.replace(regex3, replacement3);
c = c.replace(/<\/div>\s+<\/div>\s+<\/motion\.div>\s+\);\s+\}\)\}/g, '</div>\n          </div>\n        </div>\n      );\n    })}\n  </div>');
fs.writeFileSync('app/app/page.tsx', c);
