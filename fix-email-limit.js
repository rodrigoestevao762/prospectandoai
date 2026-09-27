const fs = require('fs');
let c = fs.readFileSync('lib/email.ts', 'utf8');

const regex = /const \{ count \} = await sb\.from\("messages"\)[\s\S]*?if \(\(count \|\| 0\) >= LIMITE_POR_DIA\) \{[\s\S]*?return \{ ok: false, erro: \Limite di.*?rio de \$\{LIMITE_POR_DIA\} e-mails atingido \(Anti-Spam\)\, status: 429 \};\s*\}/g;

c = c.replace(regex, "// Backend limit by user_id disabled so the frontend can handle per-email limits");

fs.writeFileSync('lib/email.ts', c);
