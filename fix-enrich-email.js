const fs = require('fs');

let cEnrich = fs.readFileSync('lib/enrichment.ts', 'utf8');
if (!cEnrich.includes('isEmailValidoParaB2B')) {
  cEnrich = `import { isEmailValidoParaB2B } from "./validar-email";\n` + cEnrich;
  // Replace direct email extraction
  cEnrich = cEnrich.replace(/email: foundEmail \|\| null/g, `email: isEmailValidoParaB2B(foundEmail) ? foundEmail : null`);
  fs.writeFileSync('lib/enrichment.ts', cEnrich);
}

let cOut = fs.readFileSync('lib/outscraper.ts', 'utf8');
if (!cOut.includes('isEmailValidoParaB2B')) {
  cOut = `import { isEmailValidoParaB2B } from "./validar-email";\n` + cOut;
  // Let's find how email is assigned in outscraper.ts
}
