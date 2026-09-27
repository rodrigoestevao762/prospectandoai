const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

// 1. Remove photo logic
c = c.replace(/      let fotoUrl: string \| null = null;[\s\S]*?\{fotoUrl \? \([\s\S]*?<\/div>\s*<\/div>\n          \n          <div className="flex-1 min-w-0">/, 
          <div className="flex-1 min-w-0">);
c = c.replace(/<div className="shrink-0 mt-1">[\s\S]*?<\/div>\s+<div className="flex-1 min-w-0">/, <div className="flex-1 min-w-0">);

fs.writeFileSync('app/app/page.tsx', c);
