const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

c = c.replace(/let fotoUrl: string \| null = null;[\s\S]*?className="flex-1 min-w-0">/, 
  "return (\n        <div key={l.id}\n          className=\"lead-card p-4 flex gap-4\"\n          style={{ '--lead-accent': accent } as React.CSSProperties}\n        >\n          <div className=\"flex-1 min-w-0\">");

fs.writeFileSync('app/app/page.tsx', c);
