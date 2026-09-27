const fs = require('fs');
let code = fs.readFileSync('lib/validar-email.ts', 'utf8');

code = code.replace(/if \(\/\\d\{9,\}\/\.test\(user\)\) return false;/, '// if (/\\d{9,}/.test(user)) return false;');

fs.writeFileSync('lib/validar-email.ts', code);
