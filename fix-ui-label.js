const fs = require('fs');
let c = fs.readFileSync('app/app/configuracoes/page.tsx', 'utf8');

c = c.replace(/App Password \(Senha de Aplicativo\)/, "Senha de App (Gmail) ou API Key (Resend/SendGrid)");

fs.writeFileSync('app/app/configuracoes/page.tsx', c);
