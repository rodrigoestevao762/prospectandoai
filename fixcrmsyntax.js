const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/          <\/div>\n          <\/div>\n        <\/div>\n      \);\n    \}\)}\n  <\/div>\n<\/div>\n<\/div>\n\);\n\}/, 
"          </div>\n        </div>\n      );\n    })}\n  </div>\n</div>\n);\n}");

fs.writeFileSync('app/app/page.tsx', c);
