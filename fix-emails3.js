const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/for \(let i = 0; i < paraEnviar\.length; i \+= batchSize\) \{/, "for (let i = 0; i < loteLimitado.length; i += batchSize) {");
c = c.replace(/const lote = paraEnviar\.slice\(i, i \+ batchSize\);/, "const lote = loteLimitado.slice(i, i + batchSize);");
c = c.replace(/Math\.min\(i \+ batchSize, paraEnviar\.length\)\}\/\$\{paraEnviar\.length\}/, "Math.min(i + batchSize, loteLimitado.length)}/");

fs.writeFileSync('app/app/page.tsx', c);
