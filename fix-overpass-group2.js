const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

const oldStr = 'return `nw["${k}"~"^${v}$",i]${around};`;';
const newStr = 'return `nw["${k}"~"^(${v})$",i]${around};`;';

c = c.split(oldStr).join(newStr);
fs.writeFileSync('lib/overpass.ts', c);
