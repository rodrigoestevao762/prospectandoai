"use client";

import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const widthRef = useRef(0);

  const onResize = useCallback(() => {
    if (canvasRef.current) {
      widthRef.current = canvasRef.current.offsetWidth;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 2,
      baseColor: [0.12, 0.12, 0.18],
      markerColor: [0.39, 0.4, 0.95],
      glowColor: [0.1, 0.1, 0.3],
      markers: [
        { location: [-23.55, -46.63], size: 0.08 },  // São Paulo
        { location: [40.71, -74.01], size: 0.07 },    // New York
        { location: [51.51, -0.13], size: 0.07 },     // London
        { location: [35.68, 139.65], size: 0.06 },    // Tokyo
        { location: [48.86, 2.35], size: 0.06 },      // Paris
        { location: [-33.87, 151.21], size: 0.05 },   // Sydney
        { location: [25.2, 55.27], size: 0.06 },      // Dubai
        { location: [19.08, 72.88], size: 0.05 },     // Mumbai
        { location: [6.52, 3.38], size: 0.04 },       // Lagos
        { location: [19.43, -99.13], size: 0.06 },    // Mexico City
        { location: [52.52, 13.4], size: 0.05 },      // Berlin
        { location: [37.57, 126.98], size: 0.05 },    // Seoul
        { location: [43.65, -79.38], size: 0.05 },    // Toronto
        { location: [-34.6, -58.38], size: 0.06 },    // Buenos Aires
        { location: [55.76, 37.62], size: 0.05 },     // Moscow
      ],
      onRender: (state) => {
        // When not dragging, auto-rotate
        if (!pointerInteracting.current) {
          phiRef.current += 0.003;
        }
        state.phi = phiRef.current + pointerInteractionMovement.current;
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  return (
    <div className="relative w-full max-w-[580px] aspect-square mx-auto">
      {/* Glow behind globe */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)] blur-2xl pointer-events-none" />
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          canvasRef.current!.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = "grab";
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
    </div>
  );
}

