const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace("Math.min(i + batchSize, paraEnviar.length)}/));", "Math.min(i + batchSize, loteLimitado.length)}/));");

fs.writeFileSync('app/app/page.tsx', c);
