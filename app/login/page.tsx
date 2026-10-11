"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase-browser";
import Globe from "@/components/Globe";
import { Crosshair, ArrowLeft, ArrowRight, Shield, Zap, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [msg, setMsg] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setMsg(null);
    setCarregando(true);
    const sb = supabaseBrowser();
    if (modo === "login") {
      const { error } = await sb.auth.signInWithPassword({ email, password: senha });
      if (error) setErro(error.message);
      else window.location.href = "/app";
    } else {
      const { error } = await sb.auth.signUp({ email, password: senha });
      if (error) setErro(error.message);
      else setMsg("Conta criada com sucesso! Verifique seu e-mail caso seja necessária a confirmação.");
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
    if (!email) return setErro("Digite seu e-mail acima para receber o link de recuperação.");
    setCarregando(true);
    setErro(null);
    setMsg(null);
    const { error } = await supabaseBrowser().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login?reset=true`,
    });
    if (error) setErro(error.message);
    else setMsg("Enviamos um link de recuperação para o seu e-mail.");
    setCarregando(false);
  }

  return (
    <main className="min-h-screen bg-[#050608] grid lg:grid-cols-12 text-white selection:bg-[#6366f1] selection:text-white">
      {/* ── PAINEL ESQUERDO: GLOBO 3D & ATMOSFERA ── */}
      <section className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative flex-col justify-between p-12 border-r border-white/[0.08] overflow-hidden bg-[#070910]">
        {/* Background Grid & Aurora */}
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-[#6366f1]/20 to-transparent rounded-full blur-[140px] pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao site
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/25">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="mono text-[10px] text-[#10b981] font-bold uppercase tracking-wider">Satélites Prontos</span>
          </div>
        </div>

        {/* Center 3D Globe Visual */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center">
          <div className="w-full max-w-[420px] aspect-square relative flex items-center justify-center">
            <Globe />
          </div>
        </div>

        {/* Bottom Pitch */}
        <div className="relative z-10">
          <p className="mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#818cf8] mb-2">
            Mapeamento em Tempo Real
          </p>
          <h2 className="font-display text-2xl font-black text-white leading-snug max-w-lg mb-4">
            Milhares de empresas entram no radar a cada minuto esperando por uma proposta.
          </h2>
          <div className="flex flex-wrap gap-4 text-xs text-white/40 mono uppercase tracking-wider">
            <span>• 195 Países</span>
            <span>• 3 Motores OSINT</span>
            <span>• Auto-Qualificação</span>
          </div>
        </div>
      </section>

      {/* ── PAINEL DIREITO: FORMULÁRIO DE LOGIN ── */}
      <section className="lg:col-span-6 xl:col-span-5 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <Crosshair className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display text-xl font-black tracking-tight text-white">
                Prospect<span className="text-[#818cf8]">AI</span>
              </span>
              <p className="mono text-[9px] uppercase tracking-widest text-[#94a3b8]">Portal de Acesso</p>
            </div>
          </div>

          <h1 className="font-display text-3xl font-black text-white mb-2">
            {modo === "login" ? "Acesse seu radar." : "Crie seu acesso gratuito."}
          </h1>
          <p className="text-sm text-[#94a3b8] mb-8">
            {modo === "login"
              ? "Insira suas credenciais para gerenciar seus alvos e disparos."
              : "Comece a buscar clientes em segundos sem informar cartão."}
          </p>

          {/* Form */}
          <form onSubmit={entrar} className="space-y-4">
            <div>
              <label className="block text-[11px] mono uppercase tracking-wider text-white/60 mb-2">
                E-mail Corporativo
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@empresa.com"
                className="field field-premium w-full rounded-xl px-4 py-3.5 text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] mono uppercase tracking-wider text-white/60">
                  Senha
                </label>
                {modo === "login" && (
                  <button
                    type="button"
                    onClick={recuperarSenha}
                    className="text-xs text-[#818cf8] hover:underline"
                  >
                    Esqueceu?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••••••"
                className="field field-premium w-full rounded-xl px-4 py-3.5 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="btn-signal w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider mt-2 shadow-[0_0_25px_rgba(99,102,241,0.35)] flex items-center justify-center gap-2"
            >
              {carregando ? (
                "Autenticando..."
              ) : (
                <>
                  {modo === "login" ? "Entrar na Plataforma" : "Criar Minha Conta"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-[1px] flex-1 bg-white/[0.08]" />
            <span className="mono text-[10px] uppercase tracking-widest text-white/30">ou</span>
            <div className="h-[1px] flex-1 bg-white/[0.08]" />
          </div>

          {/* Google Auth */}
          <button
            onClick={google}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white/90 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Entrar com Google
          </button>

          {/* Toggle Login / Signup */}
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setModo(modo === "login" ? "cadastro" : "login");
                setErro(null);
                setMsg(null);
              }}
              type="button"
              className="text-xs text-[#94a3b8] hover:text-white transition-colors"
            >
              {modo === "login" ? (
                <>
                  Não possui uma conta? <span className="text-[#818cf8] font-bold">Criar cadastro</span>
                </>
              ) : (
                <>
                  Já possui uma conta? <span className="text-[#818cf8] font-bold">Fazer login</span>
                </>
              )}
            </button>
          </div>

          {/* Feedback messages */}
          <AnimatePresence mode="wait">
            {erro && (
              <motion.div
                key="erro"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/30 text-xs text-[#fca5a5]"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-[#ef4444] mt-0.5" />
                <span>{erro}</span>
              </motion.div>
            )}
            {msg && (
              <motion.div
                key="msg"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 text-xs text-[#6ee7b7]"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10b981] mt-0.5" />
                <span>{msg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}
