const fs = require('fs');
let c = fs.readFileSync('lib/enrichment.ts', 'utf8');

const regexInsta = /leadsOSM = await buscarEmpresas\("todos", \["name~\.", "contact:instagram~\."\], geo\.lat, geo\.lng, geo\.radiusM, cid, geo\.paisNome, geo\.bbox, limit\);/;

const replacementInsta = `
            const { CATEGORIAS } = await import("./categorias");
            const nicLower = nic.toLowerCase();
            const cat = CATEGORIAS.find(c => c.id === nicLower || c.label.toLowerCase().includes(nicLower));
            
            if (cat) {
              leadsOSM = await buscarEmpresas(cat.id, [...cat.tags, "contact:instagram~."], geo.lat, geo.lng, geo.radiusM, cid, geo.paisNome, geo.bbox, limit);
            } else {
              leadsOSM = await buscarEmpresas("todos", [\`name~\${nic},i\`, "contact:instagram~."], geo.lat, geo.lng, geo.radiusM, cid, geo.paisNome, geo.bbox, limit);
            }
`;

c = c.replace(regexInsta, replacementInsta);

// For radarFoods, it's easier because it's always food related
// The old code: leadsOSM = await buscarEmpresas("todos", ["name~.", "amenity~restaurant|fast_food|cafe|bar|pub", "delivery~yes|only"], geo.lat, geo.lng, geo.radiusM, cid, geo.paisNome, geo.bbox, limit);
const regexFoods = /leadsOSM = await buscarEmpresas\("todos", \["name~\.", "amenity~restaurant\|fast_food\|cafe\|bar\|pub", "delivery~yes\|only"\], geo\.lat, geo\.lng, geo\.radiusM, cid, geo\.paisNome, geo\.bbox, limit\);/;

const replacementFoods = `
            const { CATEGORIAS } = await import("./categorias");
            const nicLower = nic.toLowerCase();
            const cat = CATEGORIAS.find(c => c.id === nicLower || c.label.toLowerCase().includes(nicLower));
            
            if (cat) {
              leadsOSM = await buscarEmpresas(cat.id, [...cat.tags, "delivery~yes|only"], geo.lat, geo.lng, geo.radiusM, cid, geo.paisNome, geo.bbox, limit);
            } else {
              leadsOSM = await buscarEmpresas("todos", [\`name~\${nic},i\`, "amenity~restaurant|fast_food|cafe|bar|pub"], geo.lat, geo.lng, geo.radiusM, cid, geo.paisNome, geo.bbox, limit);
            }
`;

c = c.replace(regexFoods, replacementFoods);

fs.writeFileSync('lib/enrichment.ts', c);
console.log("Success");
