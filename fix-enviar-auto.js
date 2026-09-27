const fs = require('fs');
let c = fs.readFileSync('app/api/enviar-automatico/route.ts', 'utf8');

if (!c.includes('isEmailValidoParaB2B')) {
  c = `import { isEmailValidoParaB2B } from "@/lib/validar-email";\n` + c;
  
  c = c.replace(/const fakeDomains = \["duckduckgo\.com", "example\.com", "teste\.com", "email\.com"\];\n\s*if \(fakeDomains\.some\(d => lead\.email\.toLowerCase\(\)\.includes\(d\)\)\) \{\n\s*return NextResponse\.json\(\{ erro: "E-mail falso\. Disparo abortado\." \}, \{ status: 400 \}\);\n\s*\}/g, 
    `if (!isEmailValidoParaB2B(lead.email)) {
      return NextResponse.json({ erro: "E-mail bloqueado por ser reconhecido como falso (Anti-Bounce)" }, { status: 400 });
    }`);
  
  fs.writeFileSync('app/api/enviar-automatico/route.ts', c);
}
