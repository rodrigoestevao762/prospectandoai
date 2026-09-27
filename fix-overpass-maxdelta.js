const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

c = c.replace('const maxDelta = 0.05;', 'const maxDelta = 0.03; // ~3.3km para evitar timeouts no Overpass para Todos os Comercios');
c = c.replace('[timeout:50]', '[timeout:90]'); // give it more time on the server just in case

fs.writeFileSync('lib/overpass.ts', c);
