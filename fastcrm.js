const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/<motion\.div\s+key=\{l\.id\}\s+initial=\{\{ opacity: 0, y: 16 \}\}\s+animate=\{\{ opacity: 1, y: 0 \}\}/g, '<div key={l.id}');
c = c.replace(/<\/div>\s+<\/div>\s+<\/motion\.div>\s+\);\s+\}\)\}/g, '</div>\n        </div>\n      </div>\n    );\n  })}');

fs.writeFileSync('app/app/page.tsx', c);
