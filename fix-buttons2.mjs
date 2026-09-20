import fs from 'fs';

let page = fs.readFileSync('app/app/page.tsx', 'utf-8');

const regex = /<button onClick=\{gerarDMsEmLote\}[\s\S]*?<\/button>/;

const newButtons = `<button onClick={() => gerarMensagensEmLote("whatsapp")} disabled={!!ocupado} className="btn-3d" style={{ background: '#25D366', color: '#fff', boxShadow: '0 4px 0 #075E54, 0 8px 24px rgba(37,211,102,0.3)' }}>
            💬 Gerar Wpp
          </button>
          <button onClick={() => gerarMensagensEmLote("instagram")} disabled={!!ocupado} className="btn-3d btn-3d-insta">
            📸 Gerar Insta
          </button>
          <button onClick={() => gerarMensagensEmLote("facebook")} disabled={!!ocupado} className="btn-3d" style={{ background: '#1877F2', color: '#fff', boxShadow: '0 4px 0 #1a3a7a, 0 8px 24px rgba(24,119,242,0.3)' }}>
            📘 Gerar FB
          </button>`;

page = page.replace(regex, newButtons);

fs.writeFileSync('app/app/page.tsx', page);
