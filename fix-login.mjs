import fs from 'fs';

let login = fs.readFileSync('app/login/page.tsx', 'utf-8');

// Imports
login = login.replace('import SpinningSatellite from "@/components/SpinningSatellite";', 'import { GiantEye } from "@/components/GiantEye";');

// Giant Eye component replacement
login = login.replace(/<SpinningSatellite className="w-\[300px\] h-\[300px\]" \/>/g, '<GiantEye className="w-full h-full" />');
login = login.replace(/<SpinningSatellite className="w-10 h-10" \/>/g, '<GiantEye className="w-10 h-10" />');
login = login.replace(/animate=\{\{ y: \[-10, 10, -10\] \}\}\n\s*transition=\{\{ duration: 6, repeat: Infinity, ease: "easeInOut" \}\}/, 'animate={{ y: [-10, 10, -10] }}\n            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}\n            className="w-full max-w-[400px] aspect-square"');

// Back button exact replace
login = login.replace(/<Link href="\/" className="mono relative flex w-fit items-center gap-3 text-xs uppercase tracking-\[0\.3em\] text-\[var\(--ink-dim\)\] transition hover:text-\[var\(--signal\)\]">\n\s*← voltar ao site\n\s*<\/Link>/, '<Link href="/" className="mono relative flex w-fit items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--ink-dim)] transition hover:text-[#38bdf8]">\n          ← voltar ao site\n        </Link>');

// Typography & Colors
login = login.replace(/<p className="eyebrow">Sala de controle<\/p>/g, '<p className="eyebrow" style={{ color: "#0284c7" }}>Sala de controle</p>');
login = login.replace(/<span className="text-signal-glow">sem um site\.<\/span>/g, '<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#0284c7]">sem um site.</span>');
login = login.replace(/· openstreetmap ao vivo/g, '• openstreetmap ao vivo');
login = login.replace(/· score automático/g, '• score automático');
login = login.replace(/· IA multilíngue/g, '• IA multilíngue');
login = login.replace(/<span className="text-signal-glow">AI<\/span>/g, '<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#0284c7]">AI</span>');
login = login.replace(/<p className="eyebrow">\{modo === "login" \? "Acesso" : "Novo operador"\}<\/p>/g, '<p className="eyebrow" style={{ color: "#0284c7" }}>{modo === "login" ? "Acesso" : "Novo operador"}</p>');
login = login.replace(/sem cartão · comece em minutos/g, 'sem cartão • comece em minutos');

// Login button styling
login = login.replace(/className="btn-3d btn-3d-primary w-full py-3\.5 text-xs font-bold"/g, 'className="btn-3d w-full py-3.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]"\n                style={{ background: "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)", border: "none" }}');

// Toggle button styling
login = login.replace(/className="mt-8 relative p-1 rounded-xl bg-white\/5 flex"/, 'className="mt-8 relative p-1 rounded-xl bg-white/5 border border-white/10 flex"');
login = login.replace(/text-\[var\(--void\)\]/g, 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]');
login = login.replace(/bg-white rounded-lg z-0/, 'bg-gradient-to-r from-[#38bdf8] to-[#0284c7] rounded-lg z-0');

// Forgot password
const funcRecuperar = `  async function recuperarSenha() {
    if (!email) return setErro("Digite seu e-mail para recuperar a senha.");
    setCarregando(true); setErro(null); setMsg(null);
    const { error } = await supabaseBrowser().auth.resetPasswordForEmail(email, {
      redirectTo: \`\${window.location.origin}/login?reset=true\`,
    });
    if (error) setErro(error.message);
    else setMsg("Um e-mail de recuperação foi enviado.");
    setCarregando(false);
  }

  return (`;

// Only replace the FIRST 'return (' inside LoginPage
const loginPageMatch = login.indexOf('export default function LoginPage() {');
const returnMatch = login.indexOf('return (', loginPageMatch);
login = login.substring(0, returnMatch) + funcRecuperar + login.substring(returnMatch + 8);

const btnRecuperar = `<button type="button" onClick={recuperarSenha} className="mt-2 text-xs text-[var(--ink-dim)] hover:text-white transition">Esqueceu a senha?</button>`;
login = login.replace(/<\/motion\.div>\n\s*<motion\.div initial=\{\{ opacity: 0, y: 10 \}\} animate=\{\{ opacity: 1, y: 0 \}\} transition=\{\{ delay: 0\.3 \}\} className="pt-2">/g, `</motion.div>\n            ${btnRecuperar}\n            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pt-2">`);

fs.writeFileSync('app/login/page.tsx', login);

