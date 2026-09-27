const fs = require('fs');
let c = fs.readFileSync('lib/email.ts', 'utf8');

const regex = /const extensoesInvalidas[\s\S]*?\} \{/g;
c = c.replace(regex, `if (!isEmailValidoParaB2B(lead.email)) {`);
fs.writeFileSync('lib/email.ts', c);
