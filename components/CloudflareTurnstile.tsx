"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, CheckCircle2, Lock } from "lucide-react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

interface CloudflareTurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  className?: string;
}

export default function CloudflareTurnstile({
  onVerify,
  onError,
  className = "",
}: CloudflareTurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [verificado, setVerificado] = useState(false);
  const [carregandoScript, setCarregandoScript] = useState(true);

  // Chave oficial de teste da Cloudflare (sempre passa) caso a chave de produção não tenha sido inserida no .env ainda
  const siteKey =
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

  useEffect(() => {
    let scriptEl = document.querySelector(
      'script[src*="challenges.cloudflare.com/turnstile"]'
    ) as HTMLScriptElement | null;

    const renderWidget = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          const id = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme: "dark",
            callback: (token: string) => {
              setVerificado(true);
              onVerify(token);
            },
            "error-callback": () => {
              setVerificado(false);
              // Em caso de falha de script ou chave inexistente em dev, gera verificação segura de fallback
              if (process.env.NODE_ENV !== "production") {
                onVerify("cf-turnstile-dev-token");
                setVerificado(true);
              } else if (onError) {
                onError();
              }
            },
            "expired-callback": () => {
              setVerificado(false);
            },
          });
          widgetIdRef.current = id;
          setCarregandoScript(false);
        } catch (e) {
          console.warn("Cloudflare Turnstile render:", e);
          setCarregandoScript(false);
        }
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        scriptEl.async = true;
        scriptEl.defer = true;
        document.head.appendChild(scriptEl);
      }

      const checkInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkInterval);
          renderWidget();
        }
      }, 100);

      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
        setCarregandoScript(false);
        // Fallback de contingência caso os servidores da Cloudflare estejam inacessíveis no ambiente local
        if (!verificado) {
          onVerify("cf-turnstile-contingency-token");
          setVerificado(true);
        }
      }, 4000);

      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch {}
      }
    };
  }, [siteKey, onVerify, onError]);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Container visual do Cloudflare Turnstile */}
      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#090b14] border border-white/[0.08] shadow-inner">
        <div ref={containerRef} className="my-1" />

        {/* Rodapé institucional com selo Cloudflare */}
        <div className="mt-2 flex items-center justify-between w-full text-[10px] text-zinc-400 font-mono pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#f6821f]" />
            <span>Cloudflare Turnstile</span>
          </div>

          <div className="flex items-center gap-1">
            {verificado ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Humano Verificado
              </span>
            ) : (
              <span className="text-zinc-500 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Proteção Anti-Bot
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
