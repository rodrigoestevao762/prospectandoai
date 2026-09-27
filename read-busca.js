const fs = require('fs');
const lines = fs.readFileSync('app/app/busca/page.tsx', 'utf8').split('\n');
for (let i = 135; i <= 210; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
