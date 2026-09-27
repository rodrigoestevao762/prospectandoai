const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/let allLeads = \[\];/g, 'let allLeads: any[] = [];');

fs.writeFileSync('app/app/page.tsx', c);
