const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const targetStr = '<button onClick={() => router.push(/app/editor/)}';
const replacementStr = '<a href={https://www.google.com/maps/search/?api=1&query=} target="_blank" rel="noopener noreferrer" className="btn-3d btn-3d-ghost" style={{ color: "var(--signal)", borderColor: "rgba(56,189,248,0.3)" }}>?? Google Maps</a>\n              <button onClick={() => router.push(/app/editor/)}';

c = c.split(targetStr).join(replacementStr);

fs.writeFileSync('app/app/page.tsx', c);
