const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

c = c.replace(/Tempo limite excedido na varredura\. A regi.*o .* muito grande ou os servidores demoraram a responder \(504\)\./g, "Tempo limite excedido na varredura. A região é muito grande ou os servidores demoraram a responder (504).");
c = c.replace(/Erro no servidor \(n.*o retornou JSON\)/g, "Erro no servidor (não retornou JSON)");
fs.writeFileSync('app/app/busca/page.tsx', c);
