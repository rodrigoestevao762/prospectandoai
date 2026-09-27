const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/setts\.resend_api_key\.startsWith/g, 'setts.resend_api_key?.startsWith');

fs.writeFileSync('app/app/page.tsx', c);
