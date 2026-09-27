const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

const targetStr = `      bb = [parseFloat(bbox[0]), parseFloat(bbox[2]), parseFloat(bbox[1]), parseFloat(bbox[3])];
    }`;

const replaceStr = `      // Restringir a bounding box para no máximo ~6km do centro para evitar timeouts do Overpass
      // 1 grau lat ~ 111km -> 0.05 graus ~ 5.5km
      const maxDelta = 0.05;
      const latC = parseFloat(d.lat);
      const lonC = parseFloat(d.lon);
      
      let s = parseFloat(bbox[0]);
      let n = parseFloat(bbox[1]);
      let w = parseFloat(bbox[2]);
      let e = parseFloat(bbox[3]);
      
      if (n - s > maxDelta) { s = latC - maxDelta/2; n = latC + maxDelta/2; }
      if (e - w > maxDelta) { w = lonC - maxDelta/2; e = lonC + maxDelta/2; }
      
      bb = [s, w, n, e];
    }`;

c = c.replace(targetStr, replaceStr);
fs.writeFileSync('lib/overpass.ts', c);
