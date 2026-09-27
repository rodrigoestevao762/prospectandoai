const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/setAviso\(\Enviando e-mails turbo\.\.\. \(\$\{Math\.min\(i \+ batchSize, loteLimitado\.length\)\}\/\)\\);/, 
  "setAviso(Enviando e-mails turbo... (/));");

fs.writeFileSync('app/app/page.tsx', c);
