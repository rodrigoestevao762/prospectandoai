const fs = require('fs');
let c = fs.readFileSync('app/app/busca/page.tsx', 'utf8');

const regex2 = /const \{ data, error \} = await sb\.from\("leads"\)\.insert\(\{([\s\S]*?)\}\)\.select\("id"\)\.single\(\);/;
const replacement2 = "const { data, error } = await sb.from('leads').upsert({\n\n}, { onConflict: 'osm_id', ignoreDuplicates: true }).select('id').maybeSingle();";

c = c.replace(regex2, replacement2);
fs.writeFileSync('app/app/busca/page.tsx', c);
