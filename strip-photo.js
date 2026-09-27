const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const startStr = "let fotoUrl: string | null = null;";
const endStr = "<div className=\"flex-1 min-w-0\">\n            {/* Header do card */}";

const startIdx = c.indexOf(startStr);
const endIdx = c.indexOf(endStr);

if (startIdx > -1 && endIdx > -1) {
  const newText = c.substring(0, startIdx) + "return (\n        <div key={l.id}\n          className=\"lead-card p-4 flex gap-4\"\n          style={{ '--lead-accent': accent } as React.CSSProperties}\n        >\n          " + endStr + c.substring(endIdx + endStr.length);
  fs.writeFileSync('app/app/page.tsx', newText);
} else {
  console.log("Not found!");
}
