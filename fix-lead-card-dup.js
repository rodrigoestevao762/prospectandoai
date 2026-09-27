const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/<a href=\{`https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=\$\{encodeURIComponent\(l\.nome \+ " " \+ l\.cidade\)\}`\} target="_blank" rel="noopener noreferrer" className="btn-3d btn-3d-ghost" style=\{\{ color: "var\(--signal\)", borderColor: "rgba\(56,189,248,0\.3\)" \}\}>[^<]+<\/a>/, '');

fs.writeFileSync('app/app/page.tsx', c);
