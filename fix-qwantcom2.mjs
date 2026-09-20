import fs from 'fs';

let content = fs.readFileSync('lib/enrichment.ts', 'utf-8');

const filterRegex = `.filter(u => {
      const lower = u.toLowerCase();
      return !lower.includes('qwantcom') && 
             !lower.includes('/p/') && 
             !lower.includes('/reel/') && 
             !lower.includes('/stories/') &&
             !lower.includes('/explore') &&
             !lower.includes('google');
    })`;

content = content.replace(
  `const instas = htmlUnificado.match(/instagram\\.com\\/([A-Za-z0-9_.]+)/gi) || [];`,
  `const instas = (htmlUnificado.match(/instagram\\.com\\/([A-Za-z0-9_.]+)/gi) || [])${filterRegex};`
);

content = content.replace(
  `const faces = htmlUnificado.match(/facebook\\.com\\/([A-Za-z0-9_.]+)/gi) || [];`,
  `const faces = (htmlUnificado.match(/facebook\\.com\\/([A-Za-z0-9_.]+)/gi) || [])${filterRegex};`
);

content = content.replace(
  `const instaMatches = htmlUnificado.match(/instagram\\.com\\/([A-Za-z0-9_.]+)/gi) || [];`,
  `const instaMatches = (htmlUnificado.match(/instagram\\.com\\/([A-Za-z0-9_.]+)/gi) || [])${filterRegex};`
);

fs.writeFileSync('lib/enrichment.ts', content);
