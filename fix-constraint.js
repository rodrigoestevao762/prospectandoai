const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

c = c.replace(/onConflict: 'osm_id'/g, "onConflict: 'user_id,osm_id'");

fs.writeFileSync('app/app/busca/page.tsx', c);
