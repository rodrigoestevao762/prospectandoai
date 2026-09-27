const fs = require('fs');
let c = fs.readFileSync('lib/enrichment.ts', 'utf8');

c = c.replace(/const searches = await Promise\.all\(\[\s+searchDuckDuckGo\([\s\S]*?\]\);/g, `const searchesResult = await Promise.allSettled([
        searchDuckDuckGo(\`\${baseComAspas} "instagram.com"\`),
        searchBing(\`\${baseComAspas} instagram\`),
        searchYahoo(\`\${baseComAspas} instagram oficial\`),
        searchQwant(\`\${base} instagram profile\`),
        searchBrave(\`\${base} instagram.com\`),
        searchAsk(\`\${base} instagram page\`),
        searchEcosia(\`\${base} instagram.com\`)
      ]);
      const searches = searchesResult.map((r: any) => r.status === 'fulfilled' ? r.value : "");`);

c = c.replace(/const searches = await Promise\.all\(\[\s+searchDuckDuckGo\([\s\S]*?ifood OR ubereats[\s\S]*?\]\);/g, `const searchesResult = await Promise.allSettled([
        searchDuckDuckGo(\`\${baseComAspas} ifood OR ubereats\`),
        searchBing(\`\${baseComAspas} tripadvisor OR yelp\`),
        searchYahoo(\`\${baseComAspas} doordash OR grubhub\`),
        searchQwant(\`\${base} rappi OR zomato\`),
        searchBrave(\`\${base} just-eat OR deliveroo\`),
        searchAsk(\`\${base} restaurant menu delivery ifood\`),
        searchEcosia(\`\${base} ifood tripadvisor ubereats yelp\`)
      ]);
      const searches = searchesResult.map((r: any) => r.status === 'fulfilled' ? r.value : "");`);
      
// Also wrap the outer osintPromise in a try/catch!
c = c.replace(/const osintPromise = \(async \(\) => \{/g, `const osintPromise = (async () => {
      try {`);
      
c = c.replace(/return Array\.from\(restaurantes\.values\(\)\);\s+\}\)\(\);/g, `return Array.from(restaurantes.values());
      } catch (err) {
        console.error("OSINT Foods falhou:", err);
        return [];
      }
    })();`);

c = c.replace(/return leadsInsta;\s+\}\)\(\);/g, `return leadsInsta;
      } catch (err) {
        console.error("OSINT Insta falhou:", err);
        return [];
      }
    })();`);

fs.writeFileSync('lib/enrichment.ts', c);
