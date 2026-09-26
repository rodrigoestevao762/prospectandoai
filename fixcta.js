const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');
c = c.replace(/<section className="relative z-10 py-40 px-6 text-center overflow-hidden">[\s\S]*?<motion\.div/, "<section className=\"relative z-10 py-40 px-6 text-center overflow-hidden bg-black\">\n          <CTA3D />\n          <div className=\"absolute inset-0 pointer-events-none z-0\">\n            <div className=\"absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.9)_80%,rgba(3,6,9,1)_100%)]\" />\n            <div className=\"absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00CFFF]/20 to-transparent shadow-[0_0_20px_rgba(0,207,255,0.3)]\" />\n          </div>\n\n          <motion.div");
fs.writeFileSync('app/page.tsx', c);
