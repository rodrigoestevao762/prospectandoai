"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cookie, Lock, X, ChevronRight, Check, Sliders } from "lucide-react";

export default function CookieConsent() {
  const [visivel, setVisivel] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [preferencias, setPreferencias] = useState({
    essenciais: true, // Sempre obrigatório
    seguranca: true,  // Cloudflare & telemetria de sessão
    analiticos: false, // Métricas de desempenho
  });

  useEffect(() => {
    // Verifica se o usuário já salvou preferências anteriormente
    try {
      const consent = localStorage.getItem("prospectai_cookie_consent");
      if (!consent) {
        // Exibe com pequeno delay suave
        const timer = setTimeout(() => setVisivel(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignora erro em iframes ou restrições de storage
    }
  }, []);

  const salvarConsentimento = (tipo: "todos" | "essenciais" | "personalizado") => {
    try {
      const payload = {
        tipo,
        preferencias:
          tipo === "todos"
            ? { essenciais: true, seguranca: true, analiticos: true }
            : tipo === "essenciais"
            ? { essenciais: true, seguranca: true, analiticos: false }
            : preferencias,
        data: new Date().toISOString(),
      };
      localStorage.setItem("prospectai_cookie_consent", JSON.stringify(payload));
      
      // Cria cookie de segurança seguro para persistência no servidor
      document.cookie = `prospectai_consent=${tipo}; path=/; max-age=31536000; SameSite=Lax${
        window.location.protocol === "https:" ? "; Secure" : ""
      }`;
    } catch {
      // Fallback
    }
    setVisivel(false);
    setModalAberto(false);
  };

  if (!visivel && !modalAberto) return null;

  return (
    <>
      {/* ── BANNER FLUTUANTE DE COOKIES DE SEGURANÇA ── */}
      <AnimatePresence>
        {visivel && !modalAberto && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50"
          >
            <div className="relative p-5 rounded-2xl bg-[#090b14]/95 border border-[#7c3aed]/40 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.85),0_0_35px_rgba(124,58,237,0.25)] text-white overflow-hidden">
              {/* Efeito sutil de brilho superior */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#a855f7]/60 to-transparent" />

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#6d28d9]/30 border border-[#7c3aed]/40 flex items-center justify-center shrink-0 text-[#c084fc] shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-sm font-bold tracking-tight text-white">
                      Cookies de Segurança & LGPD
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      SSL Criptografado
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Utilizamos cookies de sessão protegidos por <strong className="text-white">Cloudflare</strong> e tokens criptografados para garantir a integridade dos dados, prevenir fraudes e proteger seu acesso corporativo em conformidade com a LGPD.
                  </p>
                </div>
                <button
                  onClick={() => setVisivel(false)}
                  className="text-zinc-500 hover:text-white transition-colors p-1 -mr-1 -mt-1"
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Botões de Ação */}
              <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  onClick={() => salvarConsentimento("todos")}
                  className="w-full sm:flex-1 py-2.5 px-3.5 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] text-white text-xs font-semibold tracking-wide shadow-[0_0_20px_rgba(109,40,217,0.4)] transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> Aceitar Todos
                </button>

                <button
                  onClick={() => salvarConsentimento("essenciais")}
                  className="w-full sm:w-auto py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-zinc-300 hover:text-white border border-white/[0.08] text-xs font-medium transition-colors"
                >
                  Apenas Essenciais
                </button>

                <button
                  onClick={() => setModalAberto(true)}
                  className="w-full sm:w-auto p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-zinc-400 hover:text-white border border-white/[0.06] text-xs transition-colors flex items-center justify-center"
                  title="Personalizar preferências de cookies"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL DETALHADO DE PREFERÊNCIAS ── */}
      <AnimatePresence>
        {modalAberto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg rounded-2xl bg-[#090b14] border border-[#7c3aed]/40 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(124,58,237,0.2)]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#6d28d9]/30 border border-[#7c3aed]/40 flex items-center justify-center text-[#c084fc]">
                    <Cookie className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white">
                      Preferências de Privacidade & Cookies
                    </h3>
                    <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                      ProspectAI Cloud Security
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalAberto(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="my-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {/* 1. Essenciais */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#a855f7]" /> Cookies Essenciais & Autenticação
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Sempre Ativo
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Essenciais para a sessão do usuário, verificação de identidade e segurança de tokens JWT. Não podem ser desativados.
                  </p>
                </div>

                {/* 2. Segurança & Cloudflare */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#818cf8]" />
                      <span className="text-xs font-semibold text-white">
                        Segurança & Cloudflare Turnstile
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Proteção contra ataques DDoS, bots automatizados e validação de tráfego limpo pelo WAF da Cloudflare.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferencias.seguranca}
                      onChange={(e) =>
                        setPreferencias({ ...preferencias, seguranca: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7c3aed]"></div>
                  </label>
                </div>

                {/* 3. Métricas Operacionais */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <ChevronRight className="w-3.5 h-3.5 text-[#c084fc]" />
                      <span className="text-xs font-semibold text-white">
                        Métricas de Desempenho do Radar
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Telemetria anônima de velocidade de resposta e tempo de varredura orbital para aprimorar os algoritmos OSINT.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferencias.analiticos}
                      onChange={(e) =>
                        setPreferencias({ ...preferencias, analiticos: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7c3aed]"></div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.08]">
                <button
                  onClick={() => salvarConsentimento("essenciais")}
                  className="py-2 px-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 text-xs font-semibold transition-colors"
                >
                  Recusar Opcionais
                </button>
                <button
                  onClick={() => salvarConsentimento("personalizado")}
                  className="py-2 px-4 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] text-white text-xs font-semibold shadow-[0_0_15px_rgba(109,40,217,0.4)] transition-all"
                >
                  Salvar Preferências
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
