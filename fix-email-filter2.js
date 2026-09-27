const fs = require('fs');
let code = fs.readFileSync('lib/validar-email.ts', 'utf8');

code = code.replace(/"contato", "nome", "postmaster", "hostmaster", "webmaster", "mailer-daemon", "mailer", "abuse", "reply"/, `"nome", "postmaster", "hostmaster", "webmaster", "mailer-daemon", "mailer", "abuse", "reply"`);
code = code.replace(/"donotreply", "admin", /, `"donotreply", `);
code = code.replace(/"seuemail", "seunome", "teste", "test", /, `"seuemail", "seunome", "teste", "test", `);

fs.writeFileSync('lib/validar-email.ts', code);
