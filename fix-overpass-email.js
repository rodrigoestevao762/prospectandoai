const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

c = `import { isEmailValidoParaB2B } from "./validar-email";\n` + c;

c = c.replace(/email: e\.tags\?\.email \|\| e\.tags\?\.\['contact:email'\] \|\| null,/g, 
  `email: isEmailValidoParaB2B(e.tags?.email || e.tags?.['contact:email']) ? (e.tags?.email || e.tags?.['contact:email']) : null,`);

fs.writeFileSync('lib/overpass.ts', c);
