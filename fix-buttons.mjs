import fs from 'fs';

let page = fs.readFileSync('app/app/page.tsx', 'utf-8');

const oldButtons = `<button onClick={gerarDMsEmLote} disabled={!!ocupado} className="btn-3d btn-3d-insta">
            📸 Gerar DMs
          </button>`;

const newButtons = `<button onClick={() => gerarMensagensEmLote("whatsapp")} disabled={!!ocupado} className="btn-3d" style={{ background: '#25D366', color: '#fff', boxShadow: '0 4px 0 #075E54, 0 8px 24px rgba(37,211,102,0.3)' }}>
            💬 Gerar Wpp
          </button>
          <button onClick={() => gerarMensagensEmLote("instagram")} disabled={!!ocupado} className="btn-3d btn-3d-insta">
            📸 Gerar Insta
          </button>
          <button onClick={() => gerarMensagensEmLote("facebook")} disabled={!!ocupado} className="btn-3d" style={{ background: '#1877F2', color: '#fff', boxShadow: '0 4px 0 #1a3a7a, 0 8px 24px rgba(24,119,242,0.3)' }}>
            📘 Gerar FB
          </button>`;

page = page.replace(oldButtons, newButtons);

// Wait, the previous replace_file_content left a bug! Let me check if "gerarDMsEmLote" was replaced successfully everywhere.
// In the replace_file_content response, it showed it replaced the declaration, but not the onClick handlers!
// So oldButtons string replace will fix the UI.

fs.writeFileSync('app/app/page.tsx', page);
