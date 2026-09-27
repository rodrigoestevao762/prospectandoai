const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const target2 = /      <\/motion\.div>\r?\n    \);\r?\n  \}\)\}/g;
c = c.replace(target2, '      </div>\n    );\n  })}');

fs.writeFileSync('app/app/page.tsx', c);
