const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

const regex = /const \{ error \} = await sb\.from\('leads'\)\.insert\(rows\);/;
const replacement = "const { error } = await sb.from('leads').upsert(rows, { onConflict: 'osm_id', ignoreDuplicates: true });";

c = c.replace(regex, replacement);
fs.writeFileSync('app/app/busca/page.tsx', c);
