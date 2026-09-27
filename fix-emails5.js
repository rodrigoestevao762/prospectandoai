const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const target = "setAviso(Enviando e-mails turbo... (/));";
const repl = "setAviso(Enviando e-mails turbo... (/));";

c = c.replace(target, repl);

fs.writeFileSync('app/app/page.tsx', c);
