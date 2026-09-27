const fs = require('fs');
const lines = fs.readFileSync('lib/enrichment.ts', 'utf8').split('\n');
for (let i = 145; i <= 208; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
