const fs = require('fs');
let c = fs.readFileSync('lib/validar-email.ts', 'utf8');

c = c.replace(/\\d\{4,\}/g, '\\d{6,}');

fs.writeFileSync('lib/validar-email.ts', c);
