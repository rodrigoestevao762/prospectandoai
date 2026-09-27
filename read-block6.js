const fs = require('fs');
const lines = fs.readFileSync('lib/enrichment.ts', 'utf8').split('\n');
for (let i = 340; i <= lines.length - 1; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
