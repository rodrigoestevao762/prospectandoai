const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

const regex = /const item = json\[0\];/;
const replacement = `
    // Preferir city/town/village se houver, para evitar pegar o centro geográfico vazio de um país inteiro (ex: Luxemburgo)
    let item = json[0];
    const cityItem = json.find((x: any) => x.type === "city" || x.type === "town" || x.type === "administrative" && x.addresstype === "city");
    if (cityItem) item = cityItem;
`;

c = c.replace(regex, replacement);

fs.writeFileSync('lib/overpass.ts', c);
