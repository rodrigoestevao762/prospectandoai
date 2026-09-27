const fs = require('fs');
const lines = fs.readFileSync('lib/enrichment.ts', 'utf8').split('\n');
for (let i = 245; i <= 285; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
