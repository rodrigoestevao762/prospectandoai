const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

c = c.replace(/bodyData = { nicho: nichoInsta, cidade };/g, 'bodyData = { nicho: nichoInsta, cidade, limit: limitFinal };');
c = c.replace(/bodyData = { nicho: categoria === "todos" \? "restaurante" : categoria, cidade };/g, 'bodyData = { nicho: categoria === "todos" ? "restaurante" : categoria, cidade, limit: limitFinal };');

fs.writeFileSync('app/app/busca/page.tsx', c);
