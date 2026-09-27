const fs = require('fs');
let c = fs.readFileSync('app/app/page.tsx', 'utf8');

const regex = /<div key=\{l\.id\}\s+className="lead-card p-4 flex gap-4"\s+style=\{\{ '--lead-accent': accent \} as React\.CSSProperties\}\s+>\s+<div className="flex-1 min-w-0">/;

const replacement = `<div key={l.id}
          className="lead-card p-4 flex gap-4 relative group"
          style={{ '--lead-accent': accent } as React.CSSProperties}
        >
          {/* FOTO E MAPS (Lado Esquerdo) */}
          <div className="w-24 md:w-32 flex-shrink-0 flex flex-col gap-2 relative">
            <div className="w-full h-24 md:h-32 rounded-xl bg-[#05080c] border border-white/5 overflow-hidden relative group-hover:border-white/10 transition-colors shadow-inner">
              {fotoUrl ? (
                <img src={fotoUrl} alt={l.nome} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/5">
                  <span className="text-4xl font-bold font-display opacity-50">{l.nome.charAt(0)}</span>
                </div>
              )}
              {/* Gradient Overlay & Maps Button (Sempre visível no mobile, hover no desktop) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end justify-center p-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={\`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(l.nome + " " + l.cidade)}\`} target="_blank" rel="noopener noreferrer" 
                   className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-[var(--signal)]/20 hover:bg-[var(--signal)]/40 border border-[var(--signal)]/30 text-[9px] mono uppercase tracking-widest text-white transition-all backdrop-blur-md shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-[var(--signal)]"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  VER MAPA
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col">`;

c = c.replace(regex, replacement);
fs.writeFileSync('app/app/page.tsx', c);
