const fs = require('fs');
let c = fs.readFileSync('app/app/mapa/page.tsx', 'utf8');

const s1 = `<input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade (ex: Porto, A`;
const s2 = `il`;
const s3 = `ndia...)"\n          className="field-premium mono min-w-44 flex-1 rounded-lg px-3 py-2 text-xs outline-none bg-black/40 border border-white/10 text-white" />`;

// Find where this input is
const matchIndex = c.indexOf('<input value={cidade}');
const endMatch = c.indexOf('/>', matchIndex) + 2;

if (matchIndex > -1) {
  const replaceStr = `<div className="flex gap-2 min-w-44 flex-1">
          <input type="number" value={limite} onChange={(e) => setLimite(e.target.value)} required placeholder="300"
            className="field-premium mono w-20 rounded-lg px-3 py-2 text-xs outline-none bg-black/40 border border-white/10 text-white text-center" title="Mx Leads" />
          <input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade (ex: Porto...)"
            className="field-premium mono flex-1 rounded-lg px-3 py-2 text-xs outline-none bg-black/40 border border-white/10 text-white" />
        </div>`;
  c = c.substring(0, matchIndex) + replaceStr + c.substring(endMatch);
  fs.writeFileSync('app/app/mapa/page.tsx', c);
  console.log("Substituted!");
} else {
  console.log("Not found.");
}
