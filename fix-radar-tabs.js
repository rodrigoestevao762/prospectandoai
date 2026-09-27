const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

c = c.replace(/onClick=\{\(\) => setEngine\("osint"\)\}/g, 'onClick={() => { setEngine("osint"); setResultados(null); }}');
c = c.replace(/onClick=\{\(\) => setEngine\("insta"\)\}/g, 'onClick={() => { setEngine("insta"); setResultados(null); }}');
c = c.replace(/onClick=\{\(\) => setEngine\("foods"\)\}/g, 'onClick={() => { setEngine("foods"); setResultados(null); }}');

fs.writeFileSync('app/app/busca/page.tsx', c);
