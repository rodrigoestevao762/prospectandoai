const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

c = c.replace('radiusM: number; paisNome: string } | null>', 'radiusM: number; paisNome: string; bbox?: number[] } | null>');

c = c.replace(/if \\(bbox\\.length === 4\\) \\{\\s*const dLat = Math\\.abs\\(parseFloat\\(bbox\\[1\\]\\) - parseFloat\\(bbox\\[0\\]\\)\\) \\* 111000;\\s*const dLng = Math\\.abs\\(parseFloat\\(bbox\\[3\\]\\) - parseFloat\\(bbox\\[2\\]\\)\\) \\* 111000;\\s*radiusM = Math\\.min\\(50000, Math\\.max\\(3000, Math\\.round\\(Math\\.max\\(dLat, dLng\\) \/ 2\\)\\)\\);\\s*\\}/,
let bb;
    if (bbox.length === 4) {
      const dLat = Math.abs(parseFloat(bbox[1]) - parseFloat(bbox[0])) * 111000;
      const dLng = Math.abs(parseFloat(bbox[3]) - parseFloat(bbox[2])) * 111000;
      radiusM = Math.min(50000, Math.max(3000, Math.round(Math.max(dLat, dLng) / 2)));
      bb = [parseFloat(bbox[0]), parseFloat(bbox[2]), parseFloat(bbox[1]), parseFloat(bbox[3])]; // south, west, north, east
    });

c = c.replace('paisNome: d.display_name?.split(",").pop()?.trim() || pais || "" };', 'paisNome: d.display_name?.split(",").pop()?.trim() || pais || "", bbox: bb };');

c = c.replace('classificar?: (t: Record<string, string>) => string,\n  limit?: number', 'classificar?: (t: Record<string, string>) => string,\n  limit?: number,\n  bbox?: number[]');

c = c.replace('const around = radiusM > 0 ? (around:,,) : "";',
let bboxString = "";
  let around = "";
  if (bbox && bbox.length === 4) {
    bboxString = \[bbox:\,\,\,\]\;
  } else if (radiusM > 0) {
    around = \(around:\,\,\)\;
  });

c = c.replace('const query = [out:json][timeout:50];();out center ;;',
'const query = [out:json][timeout:50];();out center ;;');

fs.writeFileSync('lib/overpass.ts', c);
