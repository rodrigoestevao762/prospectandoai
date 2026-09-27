const fs = require('fs');
let c = fs.readFileSync('lib/enrichment.ts', 'utf8');

const wrongBlock = `const searchesResult = await Promise.allSettled([
          searchDuckDuckGo(\`\${baseComAspas} "instagram.com"\`),
          searchBing(\`\${baseComAspas} instagram\`),
          searchYahoo(\`\${baseComAspas} instagram oficial\`),
          searchQwant(\`\${base} instagram profile\`),
          searchBrave(\`\${base} instagram.com\`),
          searchAsk(\`\${base} instagram page\`),
          searchEcosia(\`\${base} instagram.com\`)
        ]);`;

const correctBlock = `const searchesResult = await Promise.allSettled([
          searchDuckDuckGo(\`\${baseComAspas} ifood OR ubereats\`),
          searchBing(\`\${baseComAspas} tripadvisor OR yelp\`),
          searchYahoo(\`\${baseComAspas} doordash OR grubhub\`),
          searchQwant(\`\${base} rappi OR zomato\`),
          searchBrave(\`\${base} just-eat OR deliveroo\`),
          searchAsk(\`\${base} restaurant menu delivery ifood\`),
          searchEcosia(\`\${base} ifood tripadvisor ubereats yelp\`)
        ]);`;

const parts = c.split(wrongBlock);
if (parts.length === 3) { // It appears twice
  c = parts[0] + wrongBlock + parts[1] + correctBlock + parts[2];
  fs.writeFileSync('lib/enrichment.ts', c);
  console.log("Fixed foods OSINT searches");
} else {
  console.log("Could not split properly, parts length:", parts.length);
}
