import fs from 'fs';

let content = fs.readFileSync('lib/enrichment.ts', 'utf-8');

content = content.replace(/return results\.map\(r => \(\{/g, 'return results.map((r: any) => ({');
content = content.replace(/return leadsOSM\.map\(r => \(\{/g, 'return leadsOSM.map((r: any) => ({');

fs.writeFileSync('lib/enrichment.ts', content);
