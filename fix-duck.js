const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

c = c.replace(/email: emp\.email,/g, "email: (emp.email && emp.email.includes('duckduckgo.com')) ? null : emp.email,");

fs.writeFileSync('app/app/busca/page.tsx', c);
