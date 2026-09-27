const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const regex = /<button onClick=\{\(\) => router\.push\(\\/app\/editor\/\$\{l\.id\}\\)\}.*?>/g;

let count = 0;
c = c.replace(regex, (match) => {
  count++;
  return '<a href={https://www.google.com/maps/search/?api=1&query=} target="_blank" rel="noopener noreferrer" className="btn-3d btn-3d-ghost" style={{ color: "var(--signal)", borderColor: "rgba(56,189,248,0.3)" }}>📍 Google Maps</a>\n              ' + match;
});

console.log("Substituições:", count);
fs.writeFileSync('app/app/page.tsx', c);
