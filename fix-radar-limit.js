const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

c = c.replace('const [limite, setLimite] = useState("1000");', 'const [limite, setLimite] = useState("300");');
c = c.replace('let limitFinal = parseInt(limite) || 1000;', 'let limitFinal = parseInt(limite) || 300;');
c = c.replace('placeholder="1000"', 'placeholder="300"');

fs.writeFileSync('app/app/busca/page.tsx', c);
