const fs = require('fs');
const lines = fs.readFileSync('lib/enrichment.ts', 'utf8').split('\n');
let inside = false;
let opened = 0;
for (let i = 277; i <= 345; i++) { // Around osintPromise in radarFoods
  console.log(`${i+1}: ${lines[i]}`);
}
