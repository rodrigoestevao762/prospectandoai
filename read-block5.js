const fs = require('fs');
const lines = fs.readFileSync('lib/enrichment.ts', 'utf8').split('\n');
for (let i = 330; i <= 348; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
