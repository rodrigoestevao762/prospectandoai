"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    let globe: ReturnType<typeof createGlobe> | null = null;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth || 500;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    if (!canvasRef.current) return;

    try {
      const initialWidth = canvasRef.current.offsetWidth || 500;
      width = initialWidth;

      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: initialWidth * 2,
        height: initialWidth * 2,
        phi: 0,
        theta: 0.25,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 2,
        baseColor: [0.08, 0.12, 0.22],
        markerColor: [0.22, 0.74, 0.97],
        glowColor: [0.08, 0.3, 0.6],
        markers: [
          { location: [-23.55, -46.63], size: 0.08 }, // São Paulo
          { location: [40.71, -74.01], size: 0.07 },  // New York
          { location: [51.51, -0.13], size: 0.07 },   // London
          { location: [35.68, 139.65], size: 0.06 },  // Tokyo
          { location: [48.86, 2.35], size: 0.06 },    // Paris
          { location: [-33.87, 151.21], size: 0.05 }, // Sydney
          { location: [25.2, 55.27], size: 0.06 },    // Dubai
          { location: [19.08, 72.88], size: 0.05 },   // Mumbai
          { location: [6.52, 3.38], size: 0.04 },     // Lagos
          { location: [19.43, -99.13], size: 0.06 },  // Mexico City
          { location: [52.52, 13.4], size: 0.05 },    // Berlin
          { location: [37.57, 126.98], size: 0.05 },  // Seoul
          { location: [43.65, -79.38], size: 0.05 },  // Toronto
          { location: [-34.6, -58.38], size: 0.06 },  // Buenos Aires
          { location: [55.76, 37.62], size: 0.05 },   // Moscow
        ],
        onRender: (state) => {
          if (!pointerInteracting.current) {
            phiRef.current += 0.003;
          }
          state.phi = phiRef.current + pointerInteractionMovement.current;
          state.width = (width || 500) * 2;
          state.height = (width || 500) * 2;
        },
      });
    } catch (err) {
      console.warn("WebGL not supported or failed to initialize Cobe globe:", err);
      setWebGlSupported(false);
    }

    return () => {
      if (globe) {
        try {
          globe.destroy();
        } catch (_) {}
      }
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[580px] aspect-square mx-auto flex items-center justify-center">
      {/* Glow behind globe */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.22)_0%,transparent_70%)] blur-2xl pointer-events-none" />

      {webGlSupported ? (
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
            if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
          }}
          onPointerUp={() => {
            pointerInteracting.current = null;
            if (canvasRef.current) canvasRef.current.style.cursor = "grab";
          }}
          onPointerOut={() => {
            pointerInteracting.current = null;
            if (canvasRef.current) canvasRef.current.style.cursor = "grab";
          }}
          onMouseMove={(e) => {
            if (pointerInteracting.current !== null) {
              const delta = e.clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta / 100;
            }
          }}
          onTouchMove={(e) => {
            if (pointerInteracting.current !== null && e.touches[0]) {
              const delta = e.touches[0].clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta / 100;
            }
          }}
          style={{
            width: "100%",
            height: "100%",
            cursor: "grab",
            contain: "layout paint size",
          }}
        />
      ) : (
        <div className="w-72 h-72 rounded-full border border-sky-500/30 bg-sky-950/20 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center mb-3">
            <span className="w-3 h-3 rounded-full bg-sky-400 animate-ping" />
          </div>
          <span className="font-mono text-xs text-sky-400 uppercase tracking-widest font-bold">
            Rede Orbital Global
          </span>
          <span className="text-[11px] text-white/50 mt-1">195 países monitorados</span>
        </div>
      )}
    </div>
  );
}
