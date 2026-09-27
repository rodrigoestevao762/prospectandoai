const fs = require('fs');
let c = fs.readFileSync('lib/email.ts', 'utf8');

if (!c.includes('isEmailValidoParaB2B')) {
  c = `import { isEmailValidoParaB2B } from "./validar-email";\n` + c;
  
  c = c.replace(/if \(\n\s*extensoesInvalidas[\s\S]*?\} \{/g, 
    `if (!isEmailValidoParaB2B(lead.email)) {`);
  
  fs.writeFileSync('lib/email.ts', c);
}
