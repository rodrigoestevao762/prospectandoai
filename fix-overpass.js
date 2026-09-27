const fs = require('fs');
let c = fs.readFileSync('lib/overpass.ts', 'utf8');

c = c.replace(/classificar\?: \(t: Record<string, string>\) => string/g, "classificar?: (t: Record<string, string>) => string,\n  limit?: number");
c = c.replace(/const query = \\[out:json\]\[timeout:50\];\(\$\{selectors\.join\(\"\"\)\}\);out center 10000;\;/g, 
  "const limitFinal = limit && limit > 0 ? limit : 10000;\n  const query = [out:json][timeout:50];();out center ;;");

fs.writeFileSync('lib/overpass.ts', c);
