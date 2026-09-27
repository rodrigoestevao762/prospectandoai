const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

const parts = c.split('async function enriquecerLoteRadar() {');
if (parts.length === 3) {
  // It appears twice, parts[0] is before, parts[1] is the first function, parts[2] is the rest
  const p1 = parts[1];
  const p1_end = p1.indexOf('async function '); // wait, there might be other functions!
  // Let's just find the end of the first function.
  // We can just use string matching.
}
