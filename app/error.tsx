"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, ArrowLeft, Crosshair } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-md w-full p-8 rounded-3xl border border-white/10 bg-[#0c101a] text-center shadow-2xl relative overflow-hidden">
        <div className="w-12 h-12 rounded-2xl bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 flex items-center justify-center mx-auto mb-4 text-[#38bdf8]">
          <Crosshair className="w-6 h-6 animate-spin" style={{ animationDuration: "8s" }} />
        </div>

        <h2 className="font-display text-2xl font-black mb-2 tracking-tight text-white">
          Sessão Temporariamente Interrompida
        </h2>
        <p className="text-[#94a3b8] text-sm mb-6 leading-relaxed">
          O sistema estabilizou os componentes gráficos. Clique abaixo para recarregar com telemetria segura.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="btn-signal flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            <RefreshCw className="w-4 h-4" /> Recarregar
          </button>
          <Link
            href="/login"
            className="btn-ghost flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white/70"
          >
            Ir ao Login
          </Link>
        </div>
      </div>
    </div>
  );
}
