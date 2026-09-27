const fs = require('fs');
let cOut = fs.readFileSync('lib/outscraper.ts', 'utf8');

if (!cOut.includes('isEmailValidoParaB2B')) {
  cOut = `import { isEmailValidoParaB2B } from "./validar-email";\n` + cOut;
  cOut = cOut.replace(/email: e\.emails\?\.\[0\] \|\| e\.email \|\| null,/g, 
    `email: isEmailValidoParaB2B(e.emails?.[0] || e.email) ? (e.emails?.[0] || e.email) : null,`);
  fs.writeFileSync('lib/outscraper.ts', cOut);
}
