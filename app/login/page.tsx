"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase-browser";
import GiantEye from "@/components/GiantEye";

function MiniRadar() {
  return (
    <div className="radar aspect-square w-full max-w-sm">
      <div className="radar-sweep" />
      <span className="blip" style={{ left: "30%", top: "30%", animationDelay: "0.5s" }} />
      <span className="blip amber" style={{ left: "66%", top: "55%", animationDelay: "1.8s" }} />
      <span className="blip" style={{ left: "48%", top: "70%", animationDelay: "3s" }} />
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [msg, setMsg] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null); setMsg(null); setCarregando(true);
    const sb = supabaseBrowser();
    if (modo === "login") {
      const { error } = await sb.auth.signInWithPassword({ email, password: senha });
      if (error) setErro(error.message);
      else window.location.href = "/app";
    } else {
      const { error } = await sb.auth.signUp({ email, password: senha });
      if (error) setErro(error.message);
      else setMsg("Conta criada! Confirme o e-mail (se exigido) e faça login.");
    }
    setCarregando(false);
  }

  async function google() {
    setErro(null);
    const { error } = await supabaseBrowser().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setErro(error.message);
  }

    async function recuperarSenha() {
    if (!email) return setErro("Digite seu e-mail para recuperar a senha.");
    setCarregando(true); setErro(null); setMsg(null);
    const { error } = await supabaseBrowser().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login?reset=true`,
    });
    if (error) setErro(error.message);
    else setMsg("Um e-mail de recuperação foi enviado.");
    setCarregando(false);
  }

  return (
    <main className="bg-void grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      {/* Painel esquerdo — atmosfera */}
      <section className="relative hidden flex-col justify-between overflow-hidden border-r border-[var(--line)] p-12 lg:flex">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        
        {/* Particles Effect */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.15 + 0.1,
            }}
            animate={{ y: [-15, 15, -15], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <Link href="/" className="mono relative flex w-fit items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--ink-dim)] transition hover:text-[var(--signal)]">
          ? voltar ao site
        </Link>
        <div className="relative flex flex-1 items-center justify-center py-12">
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <GiantEye className="w-full h-full" />
          </motion.div>
        </div>
        <div className="relative">
          <p className="eyebrow" style={{ color: "#0284c7" }}>Sala de controle</p>
          <h2 className="headline mt-4 max-w-md text-3xl font-bold leading-tight">
            Todo dia, milhares de negócios entram no ar <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#0284c7]">sem um site.</span>
          </h2>
          <div className="mono mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[10px] uppercase tracking-widest text-[var(--ink-faint)]">
            <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>• openstreetmap ao vivo</motion.span>
            <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>• score automático</motion.span>
            <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>• IA multilíngue</motion.span>
          </div>
        </div>
      </section>

      {/* Formulário */}
      <section className="relative flex items-center justify-center px-5 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <GiantEye className="w-10 h-10" />
            <Link href="/" className="headline text-sm font-bold uppercase tracking-widest">
              PROSPECT<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#0284c7]">AI</span>
            </Link>
          </div>
          
          <p className="eyebrow" style={{ color: "#0284c7" }}>{modo === "login" ? "Acesso" : "Novo operador"}</p>
          <h1 className="headline mt-3 text-2xl font-bold">
            {modo === "login" ? "Bem-vindo de volta." : "Crie sua conta gratuita."}
          </h1>
          <p className="mono mt-2 text-[11px] uppercase tracking-widest text-[var(--ink-faint)]">
            {modo === "login" ? "identifique-se para abrir o radar" : "sem cartão • comece em minutos"}
          </p>

          <form onSubmit={entrar} className="mt-8 space-y-4">
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <input
                type="email" required placeholder="E-mail" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field field-premium w-full rounded-xl px-4 py-3 text-sm"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <input
                type="password" required minLength={6} placeholder="Senha (mín. 6 caracteres)" value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="field field-premium w-full rounded-xl px-4 py-3 text-sm"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pt-2">
              <button
                type="submit" disabled={carregando}
                className="btn-3d w-full py-3.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]"
                style={{ background: "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)", border: "none" }}
              >
                {carregando ? "Conectando..." : modo === "login" ? "Entrar no radar" : "Criar conta"}
              </button>
            </motion.div>
          </form>

          

          

          

          <AnimatePresence mode="wait">
            {erro && (
              <motion.p
                key="erro"
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mono mt-5 rounded-lg border border-[var(--alert)]/40 bg-[var(--alert)]/10 px-3 py-2.5 text-xs text-[var(--alert)] overflow-hidden"
              >
                {erro}
              </motion.p>
            )}
            {msg && (
              <motion.p
                key="msg"
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mono mt-5 rounded-lg border border-[var(--signal)]/40 bg-[var(--signal)]/10 px-3 py-2.5 text-xs text-[var(--signal)] overflow-hidden"
              >
                {msg}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}



