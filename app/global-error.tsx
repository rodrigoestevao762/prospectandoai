"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="bg-[#050608] text-white flex items-center justify-center min-h-screen p-4 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl border border-white/10 bg-[#0c101a] text-center shadow-2xl">
          <h2 className="text-xl font-bold mb-3">Reiniciando telemetria...</h2>
          <p className="text-sm text-gray-400 mb-6">
            Ocorreu uma instabilidade na renderização de gráficos.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#0ea5e9] text-white rounded-xl font-bold uppercase text-xs tracking-wider"
          >
            Tentar Novamente
          </button>
        </div>
      </body>
    </html>
  );
}

