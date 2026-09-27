const fs = require('fs');
let c = fs.readFileSync('lib/mensagens.ts', 'utf8');

c = c.replace('gemini-1.5-flash:generateContent', 'gemini-1.5-flash-8b:generateContent');

fs.writeFileSync('lib/mensagens.ts', c);
