const fs = require('fs');
let c = fs.readFileSync('app/api/enviar-lote/route.ts', 'utf8');

if (!c.includes('isEmailValidoParaB2B')) {
  c = `import { isEmailValidoParaB2B } from "@/lib/validar-email";\n` + c;
  
  c = c.replace(/if \(fakeDomains\.some[\s\S]*?continue;/g, 
    `if (!isEmailValidoParaB2B(lead.email)) continue;`);
  
  c = c.replace(/const fakeDomains = \["duckduckgo", "example", "teste.com", "email.com"\];\s*/g, '');
  
  fs.writeFileSync('app/api/enviar-lote/route.ts', c);
}
