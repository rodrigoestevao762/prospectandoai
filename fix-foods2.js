const fs = require('fs');
let c = fs.readFileSync('lib/enrichment.ts', 'utf8');

const wrongBlock = /const searchesResult = await Promise\.allSettled\(\[\s*searchDuckDuckGo\(`\${baseComAspas} "instagram\.com"`\),\s*searchBing\(`\${baseComAspas} instagram`\),\s*searchYahoo\(`\${baseComAspas} instagram oficial`\),\s*searchQwant\(`\${base} instagram profile`\),\s*searchBrave\(`\${base} instagram\.com`\),\s*searchAsk\(`\${base} instagram page`\),\s*searchEcosia\(`\${base} instagram\.com`\)\s*\]\);/g;

const correctBlock = `const searchesResult = await Promise.allSettled([
        searchDuckDuckGo(\`\${baseComAspas} ifood OR ubereats\`),
        searchBing(\`\${baseComAspas} tripadvisor OR yelp\`),
        searchYahoo(\`\${baseComAspas} doordash OR grubhub\`),
        searchQwant(\`\${base} rappi OR zomato\`),
        searchBrave(\`\${base} just-eat OR deliveroo\`),
        searchAsk(\`\${base} restaurant menu delivery ifood\`),
        searchEcosia(\`\${base} ifood tripadvisor ubereats yelp\`)
      ]);`;

let count = 0;
c = c.replace(wrongBlock, (match) => {
  count++;
  if (count === 2) return correctBlock;
  return match;
});

fs.writeFileSync('lib/enrichment.ts', c);
console.log("Replaced", count, "times");
