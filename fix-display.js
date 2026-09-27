const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/paraEnviar\.length/g, "loteLimitado.length");

fs.writeFileSync('app/app/page.tsx', c);
