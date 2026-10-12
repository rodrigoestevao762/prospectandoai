"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { supabaseBrowser } from "@/lib/supabase-browser";
import {
  Crosshair,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Lock,
  Globe as GlobeIcon,
  Sparkles,
} from "lucide-react";
import CloudflareTurnstile from "@/components/CloudflareTurnstile";

const Globe = dynamic(() => import("@/components/Globe"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-[420px] aspect-square flex items-center justify-center">
      <div className="w-36 h-36 rounded-full border border-violet-900/40 animate-pulse bg-violet-950/20" />
    </div>
  ),
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [msg, setMsg] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [carregandoGoogle, setCarregandoGoogle] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  useEffect(() => {
    // Detecta mensagens de erro passadas via URL pelo callback de OAuth ou Middleware
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      const desc = params.get("desc");
      const reset = params.get("reset");

      if (err === "unauthorized") {
        setErro(
          "Acesso Restrito: Esta conta não possui permissão de acesso ao ProspectAI. Entre com as credenciais do administrador ou solicite liberação."
        );
      } else if (err === "oauth") {
        setErro(
          desc ||
            "Falha na autenticação via Google. Verifique se o provedor Google está configurado no painel do Supabase ou tente novamente."
        );
      } else if (reset) {
        setMsg("Link de redefinição validado. Defina sua nova senha.");
      }
    }
  }, []);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setMsg(null);

    // Validação de segurança anti-bot
    if (!turnstileToken && process.env.NODE_ENV === "production") {
      setErro("Por favor, conclua a verificação de segurança da Cloudflare.");
      return;
    }

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

  async function loginComGoogle() {
    setErro(null);
    setMsg(null);
    setCarregandoGoogle(true);
    try {
      const sb = supabaseBrowser();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await sb.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) {
        if (error.message.toLowerCase().includes("provider is not enabled")) {
          setErro(
            "O login com o Google precisa ser ativado no painel do Supabase (Auth > Providers > Google). Insira o Client ID e Client Secret do Google Cloud Console."
          );
        } else {
          setErro(error.message);
        }
        setCarregandoGoogle(false);
      }
    } catch (err: any) {
      setErro(err.message || "Erro ao conectar com Google");
      setCarregandoGoogle(false);
    }
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
    <main className="min-h-screen bg-[#06070b] grid lg:grid-cols-12 text-white selection:bg-[#6d28d9] selection:text-white">
      {/* ── PAINEL ESQUERDO: GLOBO 3D & TELEMETRIA ── */}
      <section className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative flex-col justify-between p-12 border-r border-white/[0.08] overflow-hidden bg-[#080a12]">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(109,40,217,0.15)_0%,transparent_70%)] blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao site
          </Link>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
              Rede Operacional Ativa
            </span>
          </div>
        </div>

        {/* Center 3D Globe Visual */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center">
          <div className="w-full max-w-[420px] aspect-square relative flex items-center justify-center">
            <Globe size="compact" showControls={false} showHubSelector={false} />
          </div>
        </div>

        {/* Bottom Pitch */}
        <div className="relative z-10">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a78bfa] mb-2 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Base Geoespacial B2B • Proteção Cloudflare
          </p>
          <h2 className="font-display text-xl font-bold text-white leading-snug max-w-lg mb-3">
            Mapeamento contínuo de empresas com oportunidade imediata de prestação de serviços.
          </h2>
          <div className="flex flex-wrap gap-4 text-xs text-zinc-500 font-mono">
            <span>• 195 Países</span>
            <span>• Raio até 100km</span>
            <span>• WhatsApp Verificado</span>
            <span>• Cookies Criptografados</span>
          </div>
        </div>
      </section>

      {/* ── PAINEL DIREITO: FORMULÁRIO DE LOGIN ── */}
      <section className="lg:col-span-6 xl:col-span-5 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#6d28d9] flex items-center justify-center shadow-[0_0_15px_rgba(109,40,217,0.4)]">
                <Crosshair className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-display text-lg font-bold tracking-tight text-white">
                  Prospect<span className="text-[#a78bfa]">AI</span>
                </span>
                <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                  Portal Seguro de Acesso
                </p>
              </div>
            </div>

            {/* Badges de Segurança Cloudflare & Cookies */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0d0f18] border border-white/[0.08] text-[10px] font-mono text-zinc-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>SSL / Cloudflare</span>
            </div>
          </div>

          <h1 className="font-display text-2xl font-black text-white mb-2">
            {modo === "login" ? "Acesse sua conta." : "Crie seu acesso gratuito."}
          </h1>
          <p className="text-sm text-zinc-400 mb-6">
            {modo === "login"
              ? "Insira suas credenciais ou autentique com o Google para acessar seus alvos."
              : "Comece a buscar empresas sem site em segundos."}
          </p>

          {/* ── BOTÃO DE LOGIN COM GOOGLE ── */}
          <button
            onClick={loginComGoogle}
            disabled={carregandoGoogle}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-white/[0.12] bg-[#0d0f18] hover:bg-[#141824] hover:border-[#a855f7]/50 text-white font-medium text-sm transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] group"
          >
            {carregandoGoogle ? (
              <span className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Conectando com o Google...
              </span>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                <span>Continuar com o Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-[1px] flex-1 bg-white/[0.08]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              ou com e-mail
            </span>
            <div className="h-[1px] flex-1 bg-white/[0.08]" />
          </div>

          {/* Form */}
          <form onSubmit={entrar} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                E-mail Corporativo
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@empresa.com"
                className="w-full rounded-xl px-3.5 py-3 text-sm bg-[#0d0f18] border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#7c3aed] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Senha
                </label>
                {modo === "login" && (
                  <button
                    type="button"
                    onClick={recuperarSenha}
                    className="text-xs text-[#a78bfa] hover:underline"
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
                className="w-full rounded-xl px-3.5 py-3 text-sm bg-[#0d0f18] border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#7c3aed] transition-colors"
              />
            </div>

            {/* ── CLOUDFLARE TURNSTILE BOT PROTECTION ── */}
            <div className="pt-1">
              <CloudflareTurnstile onVerify={(token) => setTurnstileToken(token)} />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="btn-signal w-full py-3.5 rounded-xl text-sm font-semibold mt-2 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(109,40,217,0.4)]"
            >
              {carregando ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Autenticando...
                </span>
              ) : (
                <>
                  {modo === "login" ? "Entrar na Plataforma" : "Criar Minha Conta"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setModo(modo === "login" ? "cadastro" : "login");
                setErro(null);
                setMsg(null);
              }}
              type="button"
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              {modo === "login" ? (
                <>
                  Não possui uma conta? <span className="text-[#a78bfa] font-semibold">Criar cadastro</span>
                </>
              ) : (
                <>
                  Já possui uma conta? <span className="text-[#a78bfa] font-semibold">Fazer login</span>
                </>
              )}
            </button>
          </div>

          {/* Feedback messages */}
          <AnimatePresence mode="wait">
            {erro && (
              <motion.div
                key="erro"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-300 leading-relaxed shadow-[0_4px_20px_rgba(239,68,68,0.15)]"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{erro}</span>
              </motion.div>
            )}
            {msg && (
              <motion.div
                key="msg"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 leading-relaxed shadow-[0_4px_20px_rgba(16,185,129,0.15)]"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>{msg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rodapé de Cookies de Segurança & Criptografia */}
          <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Cookies de Segurança Ativos
            </span>
            <span>Conforme LGPD & GDPR</span>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
