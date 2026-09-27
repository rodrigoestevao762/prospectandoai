const fs = require('fs');
let c = fs.readFileSync('app/api/buscar-mapa/route.ts', 'utf8');

c = c.replace('const dLat = 12000 / 111000;', 'const dLat = 5000 / 111000;');
c = c.replace('const dLng = 12000 / (111000 * Math.cos(lat * Math.PI / 180));', 'const dLng = 5000 / (111000 * Math.cos(lat * Math.PI / 180));');
c = c.replace('ponto = { lat, lng, radiusM: 12000, paisNome, bbox: bb };', 'ponto = { lat, lng, radiusM: 5000, paisNome, bbox: bb };');

fs.writeFileSync('app/api/buscar-mapa/route.ts', c);
