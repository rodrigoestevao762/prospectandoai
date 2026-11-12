"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, ArrowLeft, Crosshair, ShieldAlert } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Client Exception Capturada:", error);
  }, [error]);

  const limparCacheEReiniciar = () => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.clear();
        window.location.reload();
      }
    } catch {
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-md w-full p-8 rounded-3xl border border-white/10 bg-[#0c101a] text-center shadow-2xl relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 flex items-center justify-center mx-auto mb-4 text-[#38bdf8]">
          <Crosshair className="w-7 h-7 animate-spin" style={{ animationDuration: "12s" }} />
        </div>

        <h2 className="font-display text-2xl font-black mb-2 tracking-tight text-white">
          Sessão Estabilizada
        </h2>
        <p className="text-[#94a3b8] text-sm mb-6 leading-relaxed">
          Os componentes gráficos foram reajustados para telemetria segura. Escolha uma das opções abaixo para retomar a prospecção instantaneamente.
        </p>

        {error?.message && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/30 border border-red-500/20 text-red-300 text-[11px] font-mono text-left truncate">
            {error.message}
          </div>
        )}

        <div className="flex flex-col gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="btn-signal flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            <RefreshCw className="w-4 h-4" /> Recarregar
          </button>
          <div className="flex gap-2">
            <button
              onClick={limparCacheEReiniciar}
              className="btn-ghost flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white"
            >
              Limpar Caches
            </button>
            <Link
              href="/app"
              className="btn-ghost flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#38bdf8] hover:text-white"
            >
              Painel Geral
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
