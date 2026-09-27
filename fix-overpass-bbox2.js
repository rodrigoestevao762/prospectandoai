const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

c = c.split('radiusM: number; paisNome: string } | null>').join('radiusM: number; paisNome: string; bbox?: number[] } | null>');

c = c.replace(/if \(bbox\.length === 4\) \{[\s\S]*?radiusM =[\s\S]*?\}/,
`let bb;
    if (bbox.length === 4) {
      const dLat = Math.abs(parseFloat(bbox[1]) - parseFloat(bbox[0])) * 111000;
      const dLng = Math.abs(parseFloat(bbox[3]) - parseFloat(bbox[2])) * 111000;
      radiusM = Math.min(50000, Math.max(3000, Math.round(Math.max(dLat, dLng) / 2)));
      bb = [parseFloat(bbox[0]), parseFloat(bbox[2]), parseFloat(bbox[1]), parseFloat(bbox[3])];
    }`);

c = c.split('paisNome: d.display_name?.split(",").pop()?.trim() || pais || "" };').join('paisNome: d.display_name?.split(",").pop()?.trim() || pais || "", bbox: bb };');

c = c.split('classificar?: (t: Record<string, string>) => string,\n  limit?: number\n):').join('classificar?: (t: Record<string, string>) => string,\n  limit?: number,\n  bbox?: number[]\n):');

c = c.split('const around = radiusM > 0 ? `(around:${radiusM},${lat},${lng})` : "";').join(`let bboxString = "";
  let around = "";
  if (bbox && bbox.length === 4) {
    bboxString = \`[bbox:\${bbox[0]},\${bbox[1]},\${bbox[2]},\${bbox[3]}]\`;
  } else if (radiusM > 0) {
    around = \`(around:\${radiusM},\${lat},\${lng})\`;
  }`);

c = c.split('const query = `[out:json][timeout:50];(${selectors.join("")});out center ${limit && limit > 0 ? limit : 10000};`;').join('const query = `[out:json][timeout:50]${bboxString};(${selectors.join("")});out center ${limit && limit > 0 ? limit : 10000};`;');

fs.writeFileSync('lib/overpass.ts', c);
