import fs from 'fs';

let enrichment = fs.readFileSync('lib/enrichment.ts', 'utf-8');

enrichment = enrichment.replace(
  /\} \n      \}\);\n      return await res.text\(\);/,
  `} \n      }, signal: AbortSignal.timeout(8000) });\n      return await res.text();`
);

enrichment = enrichment.replace(
  /\}\n      \}\);\n      return await res.text\(\);/,
  `}\n      }, signal: AbortSignal.timeout(8000) });\n      return await res.text();`
);

// Fallback in case regex doesn't match
if (!enrichment.includes('AbortSignal.timeout(8000)')) {
  enrichment = enrichment.replace(
    /'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',\n        }\n      \}\);/,
    `'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',\n        },\n        signal: AbortSignal.timeout(8000)\n      });`
  );
}

fs.writeFileSync('lib/enrichment.ts', enrichment);

