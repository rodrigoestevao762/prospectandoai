"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Compass, RotateCw, Pause, Play, Sparkles, MapPin, Zap, Radio, Globe as GlobeIcon } from "lucide-react";

export interface CityTarget {
  name: string;
  country: string;
  lat: number;
  lng: number;
  leads: string;
  niche: string;
}

export const GLOBAL_TARGETS: CityTarget[] = [
  { name: "Barcelona", country: "Espanha", lat: 41.3851, lng: 2.1734, leads: "1.480 alvos", niche: "Escolas & Tech" },
  { name: "São Paulo", country: "Brasil", lat: -23.5505, lng: -46.6333, leads: "3.240 alvos", niche: "Varejo & B2B" },
  { name: "Nova York", country: "EUA", lat: 40.7128, lng: -74.006, leads: "4.120 alvos", niche: "Agências & SaaS" },
  { name: "Londres", country: "Reino Unido", lat: 51.5074, lng: -0.1278, leads: "2.890 alvos", niche: "Fintech & Serviços" },
  { name: "Tóquio", country: "Japão", lat: 35.6762, lng: 139.6503, leads: "3.750 alvos", niche: "E-commerce & AI" },
  { name: "Dubai", country: "EAU", lat: 25.2048, lng: 55.2708, leads: "1.920 alvos", niche: "Imobiliário & Luxo" },
];

interface GlobeProps {
  size?: "hero" | "compact";
  showControls?: boolean;
  showCitySelector?: boolean;
  className?: string;
  onTargetSelect?: (city: CityTarget) => void;
}

export default function Globe({
  size = "hero",
  showControls = true,
  showCitySelector = true,
  className = "",
  onTargetSelect,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Interaction & Physics state refs
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const pointerDelta = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPointer = useRef({ x: 0, y: 0, time: 0 });

  const phiRef = useRef(0);
  const thetaRef = useRef(0.25);
  const targetPhiRef = useRef<number | null>(null);
  const targetThetaRef = useRef<number | null>(null);
  const autoRotateRef = useRef(true);
  const speedMultiplierRef = useRef(1);

  // React state
  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeCity, setActiveCity] = useState<CityTarget>(GLOBAL_TARGETS[0]);
  const [isRotating, setIsRotating] = useState(true);
  const [speedMode, setSpeedMode] = useState<"1x" | "2x">("1x");
  const [telemetryLat, setTelemetryLat] = useState("41.38° N");
  const [telemetryLng, setTelemetryLng] = useState("2.17° E");

  // Function to fly to target coordinates
  const flyToCity = useCallback((city: CityTarget) => {
    setActiveCity(city);
    if (onTargetSelect) onTargetSelect(city);

    // Convert longitude to phi (radians). In cobe, phi=0 aligns around 0° lon with slight offset
    const targetPhi = -((city.lng * Math.PI) / 180) + Math.PI / 2;
    // Latitude to theta (radians), clamped safely to prevent pole inversion
    const targetTheta = Math.max(-0.4, Math.min(0.6, (city.lat * Math.PI) / 180 * 0.7));

    // Normalize targetPhi relative to current phiRef to take the shortest rotation path
    let currentPhi = phiRef.current;
    let diff = (targetPhi - currentPhi) % (Math.PI * 2);
    if (diff > Math.PI) diff -= Math.PI * 2;
    if (diff < -Math.PI) diff += Math.PI * 2;

    targetPhiRef.current = currentPhi + diff;
    targetThetaRef.current = targetTheta;

    setTelemetryLat(`${Math.abs(city.lat).toFixed(2)}° ${city.lat >= 0 ? "N" : "S"}`);
    setTelemetryLng(`${Math.abs(city.lng).toFixed(2)}° ${city.lng >= 0 ? "E" : "W"}`);
  }, [onTargetSelect]);

  const toggleAutoRotate = () => {
    autoRotateRef.current = !autoRotateRef.current;
    setIsRotating(autoRotateRef.current);
  };

  const toggleSpeed = () => {
    if (speedMultiplierRef.current === 1) {
      speedMultiplierRef.current = 2.2;
      setSpeedMode("2x");
    } else {
      speedMultiplierRef.current = 1;
      setSpeedMode("1x");
    }
  };

  const resetOrientation = () => {
    flyToCity(GLOBAL_TARGETS[0]);
  };

  useEffect(() => {
    let globeInstance: any = null;
    let isMounted = true;

    async function initGlobe() {
      if (!canvasRef.current || typeof window === "undefined") return;

      // Safe WebGL preflight check
      try {
        const gl =
          canvasRef.current.getContext("webgl") ||
          canvasRef.current.getContext("experimental-webgl");
        if (!gl) {
          setHasWebGL(false);
          return;
        }
      } catch (e) {
        setHasWebGL(false);
        return;
      }

      try {
        const createGlobeModule = await import("cobe");
        const createGlobe = createGlobeModule.default;

        if (!isMounted || !canvasRef.current) return;

        const getDimensions = () => {
          if (!containerRef.current) return 600;
          const rect = containerRef.current.getBoundingClientRect();
          const w = rect.width || 600;
          return Math.max(w, 320);
        };

        let width = getDimensions();

        // High-density markers across global enterprise hubs
        const markers = [
          { location: [41.3851, 2.1734], size: 0.12 },   // Barcelona (Highlight)
          { location: [-23.5505, -46.6333], size: 0.10 }, // São Paulo
          { location: [40.7128, -74.006], size: 0.10 },  // New York
          { location: [51.5074, -0.1278], size: 0.09 },  // London
          { location: [35.6762, 139.6503], size: 0.09 }, // Tokyo
          { location: [25.2048, 55.2708], size: 0.09 },  // Dubai
          { location: [37.7749, -122.4194], size: 0.07 },// San Francisco
          { location: [48.8566, 2.3522], size: 0.07 },   // Paris
          { location: [52.5200, 13.4050], size: 0.07 },  // Berlin
          { location: [1.3521, 103.8198], size: 0.08 },  // Singapore
          { location: [-33.8688, 151.2093], size: 0.07 },// Sydney
          { location: [19.4326, -99.1332], size: 0.07 }, // Mexico City
          { location: [19.0760, 72.8777], size: 0.07 },  // Mumbai
          { location: [31.2304, 121.4737], size: 0.07 }, // Shanghai
          { location: [37.5665, 126.9780], size: 0.07 }, // Seoul
          { location: [-34.6037, -58.3816], size: 0.07 },// Buenos Aires
          { location: [6.5244, 3.3792], size: 0.06 },    // Lagos
          { location: [-22.9068, -43.1729], size: 0.08 },// Rio de Janeiro
        ];

        globeInstance = createGlobe(canvasRef.current, {
          devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          width: width * 2,
          height: width * 2,
          phi: 0,
          theta: 0.25,
          dark: 1,
          diffuse: 1.4,
          mapSamples: size === "hero" ? 28000 : 18000,
          mapBrightness: 4.2,
          baseColor: [0.10, 0.05, 0.20],     // Deep galactic cosmic purple
          markerColor: [0.85, 0.35, 1.0],     // Vivid electric purple neon
          glowColor: [0.45, 0.16, 0.72],      // Rich violet-purple atmospheric luminescence
          markers,
          onRender: (state) => {
            // Smooth Target Flight Interpolation (Spring-like)
            if (targetPhiRef.current !== null && targetThetaRef.current !== null) {
              const dPhi = targetPhiRef.current - phiRef.current;
              const dTheta = targetThetaRef.current - thetaRef.current;

              phiRef.current += dPhi * 0.08;
              thetaRef.current += dTheta * 0.08;

              if (Math.abs(dPhi) < 0.001 && Math.abs(dTheta) < 0.001) {
                targetPhiRef.current = null;
                targetThetaRef.current = null;
              }
            } else if (!pointerInteracting.current) {
              // Apply momentum decay if present
              if (Math.abs(velocityRef.current.x) > 0.0001) {
                phiRef.current += velocityRef.current.x;
                velocityRef.current.x *= 0.94; // friction
              } else if (autoRotateRef.current) {
                // Natural steady orbit
                phiRef.current += 0.0028 * speedMultiplierRef.current;
              }

              if (Math.abs(velocityRef.current.y) > 0.0001) {
                thetaRef.current += velocityRef.current.y;
                velocityRef.current.y *= 0.94;
                thetaRef.current = Math.max(-0.45, Math.min(0.65, thetaRef.current));
              }
            }

            state.phi = phiRef.current + pointerDelta.current.x;
            state.theta = Math.max(-0.45, Math.min(0.65, thetaRef.current + pointerDelta.current.y));

            const w = getDimensions();
            state.width = w * 2;
            state.height = w * 2;
          },
        });
      } catch (err) {
        console.warn("Globe creation fallback:", err);
        setHasWebGL(false);
      }
    }

    initGlobe();

    return () => {
      isMounted = false;
      if (globeInstance && typeof globeInstance.destroy === "function") {
        try {
          globeInstance.destroy();
        } catch (e) {}
      }
    };
  }, [size]);

  // Pointer event handlers for 2-axis interactive rotation with momentum
  const handlePointerDown = (clientX: number, clientY: number) => {
    pointerInteracting.current = { x: clientX, y: clientY };
    pointerDelta.current = { x: 0, y: 0 };
    velocityRef.current = { x: 0, y: 0 };
    targetPhiRef.current = null;
    targetThetaRef.current = null;
    lastPointer.current = { x: clientX, y: clientY, time: performance.now() };

    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grabbing";
    }
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!pointerInteracting.current) return;

    const dx = clientX - pointerInteracting.current.x;
    const dy = clientY - pointerInteracting.current.y;

    pointerDelta.current = {
      x: dx / 140,
      y: -dy / 220,
    };

    const now = performance.now();
    const dt = now - lastPointer.current.time;
    if (dt > 16) {
      velocityRef.current = {
        x: (clientX - lastPointer.current.x) / 140 / (dt / 16),
        y: -(clientY - lastPointer.current.y) / 220 / (dt / 16),
      };
      lastPointer.current = { x: clientX, y: clientY, time: now };
    }
  };

  const handlePointerUp = () => {
    if (pointerInteracting.current) {
      phiRef.current += pointerDelta.current.x;
      thetaRef.current = Math.max(-0.45, Math.min(0.65, thetaRef.current + pointerDelta.current.y));
      pointerDelta.current = { x: 0, y: 0 };
      pointerInteracting.current = null;
    }

    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grab";
    }
  };

  const isHero = size === "hero";

  return (
    <div
      ref={containerRef}
      className={`relative w-full mx-auto flex flex-col items-center justify-center select-none ${
        isHero ? "max-w-[760px] lg:max-w-[820px]" : "max-w-[440px]"
      } ${className}`}
    >
      {/* ── COSMIC BACKGROUND NEBULA & ATMOSPHERIC PURPLE GLOW ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        {/* Core Electric Purple Corona */}
        <div
          className={`rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.32)_0%,rgba(147,51,234,0.18)_35%,rgba(126,34,206,0.06)_60%,transparent_75%)] blur-3xl animate-pulse ${
            isHero ? "w-[680px] h-[680px]" : "w-[380px] h-[380px]"
          }`}
          style={{ animationDuration: "6s" }}
        />
        {/* Outer Deep Magenta / Violet Aura */}
        <div
          className={`absolute rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.14)_0%,rgba(168,85,247,0.08)_45%,transparent_70%)] blur-[90px] ${
            isHero ? "w-[840px] h-[840px]" : "w-[460px] h-[460px]"
          }`}
        />
      </div>

      {/* ── 3D HOLOGRAPHIC ORBITAL RINGS (Hero Mode Only) ── */}
      {isHero && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          {/* Orbital Ring Alpha */}
          <div
            className="w-[94%] aspect-square rounded-full border border-[#a855f7]/25 opacity-70"
            style={{
              transform: "rotateX(72deg) rotateY(-18deg)",
              boxShadow: "0 0 30px rgba(168,85,247,0.2), inset 0 0 30px rgba(168,85,247,0.15)",
            }}
          />
          {/* Orbital Ring Beta with Dashed Telemetry */}
          <div
            className="w-[108%] aspect-square rounded-full border border-dashed border-[#c084fc]/20 opacity-40 animate-[spin_40s_linear_infinite]"
            style={{
              transform: "rotateX(76deg) rotateY(24deg)",
            }}
          />
        </div>
      )}

      {/* ── TOP MISSION CONTROL TELEMETRY HUD (Hero Mode) ── */}
      {isHero && (
        <div className="w-full flex items-center justify-between px-4 sm:px-6 mb-2 z-20 pointer-events-none">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#080b12]/80 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#a855f7] animate-ping" />
            <span className="mono text-[10px] font-bold text-white/90 tracking-wider uppercase">
              RADAR OSINT v4.2
            </span>
            <span className="text-white/20">•</span>
            <span className="mono text-[10px] text-[#c084fc]">
              {telemetryLat}, {telemetryLng}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/25 backdrop-blur-md">
            <Radio className="w-3 h-3 text-[#10b981] animate-pulse" />
            <span className="mono text-[10px] font-bold text-[#10b981] uppercase tracking-wider">
              142 Satélites em Órbita
            </span>
          </div>
        </div>
      )}

      {/* ── MAIN GLOBE CANVAS CONTAINER ── */}
      <div
        className={`relative w-full aspect-square flex items-center justify-center z-10 ${
          isHero ? "max-h-[640px] lg:max-h-[700px]" : "max-h-[400px]"
        }`}
      >
        {hasWebGL ? (
          <canvas
            ref={canvasRef}
            onPointerDown={(e) => handlePointerDown(e.clientX, e.clientY)}
            onPointerMove={(e) => handlePointerMove(e.clientX, e.clientY)}
            onPointerUp={handlePointerUp}
            onPointerOut={handlePointerUp}
            onTouchStart={(e) => {
              if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchEnd={handlePointerUp}
            style={{
              width: "100%",
              height: "100%",
              cursor: "grab",
              contain: "layout paint size",
              touchAction: "none",
            }}
            aria-label="Globo 3D interativo do Radar OSINT ProspectandoAI"
          />
        ) : (
          /* High-End Futuristic Holographic Fallback */
          <div className="relative w-80 h-80 rounded-full border-2 border-[#a855f7]/40 bg-[#0c101a] flex flex-col items-center justify-center shadow-[0_0_80px_rgba(168,85,247,0.3)]">
            <div
              className="absolute w-72 h-72 rounded-full border border-dashed border-[#c084fc]/50 animate-spin"
              style={{ animationDuration: "24s" }}
            />
            <div className="absolute w-56 h-56 rounded-full border border-[#a855f7]/30 animate-ping opacity-25" />
            <GlobeIcon className="w-12 h-12 text-[#a855f7] mb-2 animate-pulse" />
            <span className="mono text-xs uppercase tracking-widest text-[#c084fc] font-bold">
              Radar Global Ativo
            </span>
            <span className="mono text-[10px] text-white/50 mt-1">Modo Seguro 2D</span>
          </div>
        )}

        {/* Tactical Active Target Beacon Tooltip */}
        {activeCity && (
          <div className="absolute bottom-6 right-4 sm:right-8 z-30 pointer-events-auto">
            <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#080b12]/90 border border-[#a855f7]/40 backdrop-blur-xl shadow-[0_12px_36px_rgba(168,85,247,0.25)]">
              <div className="w-7 h-7 rounded-lg bg-[#a855f7]/20 border border-[#a855f7]/50 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-[#c084fc]" />
              </div>
              <div>
                <p className="font-display text-xs font-bold text-white flex items-center gap-1.5">
                  {activeCity.name}, {activeCity.country}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                </p>
                <p className="mono text-[10px] text-[#c084fc] font-semibold">
                  {activeCity.leads} • {activeCity.niche}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── INTERACTIVE CONTROLS BAR (Auto-Orbit, Speed, Reset) ── */}
      {showControls && (
        <div className="flex items-center gap-2 mt-2 mb-3 z-20">
          <button
            onClick={toggleAutoRotate}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border mono text-[11px] font-bold uppercase tracking-wider transition-all ${
              isRotating
                ? "bg-[#a855f7]/15 border-[#a855f7]/40 text-[#c084fc] shadow-[0_0_16px_rgba(168,85,247,0.25)]"
                : "bg-white/[0.04] border-white/10 text-white/60 hover:text-white"
            }`}
          >
            {isRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isRotating ? "Pausar" : "Orbitar"}
          </button>

          <button
            onClick={toggleSpeed}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 mono text-[11px] font-bold uppercase tracking-wider text-white/70 hover:text-white hover:border-[#a855f7]/40 transition-all"
          >
            <Zap className="w-3 h-3 text-[#a855f7]" />
            Vel: {speedMode}
          </button>

          <button
            onClick={resetOrientation}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 mono text-[11px] font-bold uppercase tracking-wider text-white/70 hover:text-white hover:border-[#a855f7]/40 transition-all"
            title="Recentralizar no alvo principal"
          >
            <RotateCw className="w-3 h-3" />
            Centralizar
          </button>
        </div>
      )}

      {/* ── CLICK-TO-FLY QUICK TARGET CITY CHIPS (100% Interactivity) ── */}
      {showCitySelector && (
        <div className="w-full mt-1 z-20">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap px-2">
            <span className="mono text-[10px] uppercase tracking-widest text-white/40 mr-1 flex items-center gap-1 hidden sm:inline-flex">
              <Compass className="w-3 h-3 text-[#a855f7]" /> Alvos Rápidos:
            </span>
            {GLOBAL_TARGETS.map((city) => {
              const isSelected = activeCity.name === city.name;
              return (
                <button
                  key={city.name}
                  onClick={() => flyToCity(city)}
                  type="button"
                  className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-display font-semibold transition-all ${
                    isSelected
                      ? "bg-[#a855f7] border-[#c084fc] text-white shadow-[0_0_24px_rgba(168,85,247,0.55)] scale-105"
                      : "bg-[#0b0e18]/80 border-white/10 text-white/70 hover:text-white hover:border-[#a855f7]/50 hover:bg-[#a855f7]/10"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-white animate-ping" : "bg-[#a855f7]"
                    }`}
                  />
                  <span>{city.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
