const fs = require('fs');
let c = fs.readFileSync('lib/email.ts', 'utf8');

c = c.replace("if ((count || 0) >= LIMITE_POR_DIA) {", "if (false) { // Backend limit bypassed");

fs.writeFileSync('lib/email.ts', c);
