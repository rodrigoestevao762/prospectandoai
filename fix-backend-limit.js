const fs = require('fs');
let c = fs.readFileSync('lib/email.ts', 'utf8');

c = c.replace(/if \(\(count \|\| 0\) >= 480\) \{[\s\S]*?\}/, "// Backend limit bypassed so frontend can handle multiple emails limit");

fs.writeFileSync('lib/email.ts', c);
