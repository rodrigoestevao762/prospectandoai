const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const target1 = /<motion\.div\s+key=\{l\.id\}\s+initial=\{\{ opacity: 0, y: 16 \}\}\s+animate=\{\{ opacity: 1, y: 0 \}\}\s+transition=\{\{ delay: Math\.min\(i \* 0\.04, 0\.5\), duration: 0\.35, ease: "easeOut" \}\}/g;
c = c.replace(target1, '<div key={l.id}');

const target2 = /<\/motion\.div>\n    \);\n  \}\)\}\n<\/div>\n<\/div>\n\);\n\}/g;
c = c.replace(target2, '</div>\n    );\n  })}\n</div>\n</div>\n);\n}');

fs.writeFileSync('app/app/page.tsx', c);
