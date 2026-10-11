"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Compass, RotateCw, Pause, Play, MapPin, Zap, Radio, Globe as GlobeIcon } from "lucide-react";

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

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Procedural high-resolution texture generator using Natural Earth GeoJSON
function createWorldTexture(geoData: any | null): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // 1. Deep Cosmic Ocean Gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, "#080414");
  oceanGrad.addColorStop(0.5, "#0d0620");
  oceanGrad.addColorStop(1, "#080414");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Latitude & Longitude Tactical Coordinate Grid (Graticules)
  ctx.strokeStyle = "rgba(217, 70, 239, 0.12)";
  ctx.lineWidth = 1;
  // Parallels (Latitude)
  for (let lat = -75; lat <= 75; lat += 15) {
    const y = ((90 - lat) / 180) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  // Meridians (Longitude)
  for (let lng = -180; lng <= 180; lng += 15) {
    const x = ((lng + 180) / 360) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // 3. Render Continents from GeoJSON
  if (geoData && geoData.features) {
    // Fill Pass: Luminous Deep Purple Continent Body
    ctx.fillStyle = "#3b0764";
    ctx.shadowColor = "#d946ef";
    ctx.shadowBlur = 12;

    const drawPolygon = (coords: number[][]) => {
      ctx.beginPath();
      for (let i = 0; i < coords.length; i++) {
        const [lng, lat] = coords[i];
        const x = ((lng + 180) / 360) * width;
        const y = ((90 - lat) / 180) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    };

    geoData.features.forEach((feature: any) => {
      const geom = feature.geometry;
      if (geom.type === "Polygon") {
        geom.coordinates.forEach((ring: number[][]) => drawPolygon(ring));
      } else if (geom.type === "MultiPolygon") {
        geom.coordinates.forEach((poly: number[][][]) => {
          poly.forEach((ring: number[][]) => drawPolygon(ring));
        });
      }
    });

    // Stroke Pass: High-Contrast Neon Electric Fuchsia Coastline Borders
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#f0abfc";
    ctx.strokeStyle = "#e879f9";
    ctx.lineWidth = 2.2;

    const strokePolygon = (coords: number[][]) => {
      ctx.beginPath();
      for (let i = 0; i < coords.length; i++) {
        const [lng, lat] = coords[i];
        const x = ((lng + 180) / 360) * width;
        const y = ((90 - lat) / 180) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    };

    geoData.features.forEach((feature: any) => {
      const geom = feature.geometry;
      if (geom.type === "Polygon") {
        geom.coordinates.forEach((ring: number[][]) => strokePolygon(ring));
      } else if (geom.type === "MultiPolygon") {
        geom.coordinates.forEach((poly: number[][][]) => {
          poly.forEach((ring: number[][]) => strokePolygon(ring));
        });
      }
    });

    // Tactical Cyber Dot Matrix Overlay across Continents
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(240, 171, 252, 0.25)";
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let y = 10; y < height - 10; y += 12) {
      for (let x = 10; x < width - 10; x += 12) {
        const idx = (y * width + x) * 4;
        // If pixel is on continent landmass (purple red channel > 30)
        if (data[idx] > 30) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

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
  const mountRef = useRef<HTMLDivElement>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);

  // Interaction tracking refs
  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const targetRotation = useRef<{ y: number; x: number } | null>(null);
  const autoRotate = useRef(true);
  const speedRef = useRef(1);

  // State
  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeCity, setActiveCity] = useState<CityTarget>(GLOBAL_TARGETS[0]);
  const [isRotating, setIsRotating] = useState(true);
  const [speedMode, setSpeedMode] = useState<"1x" | "2x">("1x");
  const [telemetryLat, setTelemetryLat] = useState("41.38° N");
  const [telemetryLng, setTelemetryLng] = useState("2.17° E");

  // Fly to target city with smooth rotation interpolation
  const flyToCity = useCallback((city: CityTarget) => {
    setActiveCity(city);
    if (onTargetSelect) onTargetSelect(city);

    // Compute target rotation in radians to face camera
    const targetY = -((city.lng + 90) * (Math.PI / 180));
    const targetX = (city.lat * (Math.PI / 180)) * 0.7;

    targetRotation.current = { y: targetY, x: targetX };
    setTelemetryLat(`${Math.abs(city.lat).toFixed(2)}° ${city.lat >= 0 ? "N" : "S"}`);
    setTelemetryLng(`${Math.abs(city.lng).toFixed(2)}° ${city.lng >= 0 ? "E" : "W"}`);
  }, [onTargetSelect]);

  const toggleAutoRotate = () => {
    autoRotate.current = !autoRotate.current;
    setIsRotating(autoRotate.current);
  };

  const toggleSpeed = () => {
    if (speedRef.current === 1) {
      speedRef.current = 2.4;
      setSpeedMode("2x");
    } else {
      speedRef.current = 1;
      setSpeedMode("1x");
    }
  };

  const resetOrientation = () => {
    flyToCity(GLOBAL_TARGETS[0]);
  };

  useEffect(() => {
    if (!mountRef.current || typeof window === "undefined") return;

    let animId: number;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let globeMesh: THREE.Mesh;
    let pulseRings: THREE.Mesh[] = [];

    try {
      const container = mountRef.current;
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 600;

      // 1. Three.js Scene & Camera Setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 2.8;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      container.replaceChildren(renderer.domElement);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.cursor = "grab";

      const globeGroup = new THREE.Group();
      globeGroupRef.current = globeGroup;
      scene.add(globeGroup);

      // 2. Base Sphere Mesh with Procedural Continents Texture
      const globeRadius = 1.0;
      const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);

      // Initial temporary procedural texture while GeoJSON loads
      let currentTexture = createWorldTexture(null);
      const globeMaterial = new THREE.MeshPhongMaterial({
        map: currentTexture,
        specular: new THREE.Color("#d946ef"),
        shininess: 24,
        emissive: new THREE.Color("#2e0854"),
        emissiveIntensity: 0.35,
      });

      globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
      globeGroup.add(globeMesh);

      // Fetch official Natural Earth continents GeoJSON for pixel-perfect coastlines
      fetch("/world-land.json")
        .then((r) => r.json())
        .then((geoData) => {
          const highResTexture = createWorldTexture(geoData);
          globeMaterial.map = highResTexture;
          globeMaterial.needsUpdate = true;
          currentTexture.dispose();
        })
        .catch((e) => console.warn("Fallback to procedural world map:", e));

      // 3. Glowing Atmospheric Shell (Fresnel Limb Bloom)
      const atmosGeometry = new THREE.SphereGeometry(globeRadius * 1.18, 64, 64);
      const atmosMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
            gl_FragColor = vec4(0.85, 0.27, 0.94, 1.0) * intensity * 1.6;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      });
      const atmosMesh = new THREE.Mesh(atmosGeometry, atmosMaterial);
      scene.add(atmosMesh);

      // 4. Lighting: Ambient Space + Vibrant Electric Purple Directional Rim Light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambientLight);

      const purpleRimLight = new THREE.DirectionalLight(0xd946ef, 3.2);
      purpleRimLight.position.set(4, 3, 5);
      scene.add(purpleRimLight);

      const blueBackLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
      blueBackLight.position.set(-4, -2, -3);
      scene.add(blueBackLight);

      // 5. City Hub Beacons & Pulsing Radar Wave Rings
      GLOBAL_TARGETS.forEach((city) => {
        const pos = latLngToVector3(city.lat, city.lng, globeRadius * 1.01);

        // Core Beacon Dot
        const dotGeo = new THREE.SphereGeometry(city.name === "Barcelona" ? 0.024 : 0.016, 16, 16);
        const dotMat = new THREE.MeshBasicMaterial({
          color: city.name === "Barcelona" ? 0x10b981 : 0xf0abfc,
        });
        const dotMesh = new THREE.Mesh(dotGeo, dotMat);
        dotMesh.position.copy(pos);
        globeGroup.add(dotMesh);

        // Expanding Radar Pulse Wave Ring
        const ringGeo = new THREE.RingGeometry(0.02, 0.038, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: city.name === "Barcelona" ? 0x10b981 : 0xd946ef,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.copy(pos);
        ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
        globeGroup.add(ringMesh);
        pulseRings.push(ringMesh);
      });

      // 6. Glowing Orbital Flight Curve Arcs connecting Global Hubs
      const connections: [CityTarget, CityTarget][] = [
        [GLOBAL_TARGETS[1], GLOBAL_TARGETS[0]], // São Paulo -> Barcelona
        [GLOBAL_TARGETS[0], GLOBAL_TARGETS[3]], // Barcelona -> Londres
        [GLOBAL_TARGETS[2], GLOBAL_TARGETS[0]], // Nova York -> Barcelona
        [GLOBAL_TARGETS[3], GLOBAL_TARGETS[5]], // Londres -> Dubai
        [GLOBAL_TARGETS[5], GLOBAL_TARGETS[4]], // Dubai -> Tóquio
      ];

      connections.forEach(([from, to]) => {
        const v1 = latLngToVector3(from.lat, from.lng, globeRadius * 1.01);
        const v2 = latLngToVector3(to.lat, to.lng, globeRadius * 1.01);

        const mid = v1.clone().add(v2).multiplyScalar(0.5);
        const distance = v1.distanceTo(v2);
        mid.setLength(globeRadius + distance * 0.28);

        const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
        const points = curve.getPoints(40);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0xd946ef,
          transparent: true,
          opacity: 0.65,
        });
        const arcLine = new THREE.Line(lineGeo, lineMat);
        globeGroup.add(arcLine);
      });

      // 7. Initial orientation facing Europe / Barcelona
      globeGroup.rotation.y = -Math.PI * 0.55;
      globeGroup.rotation.x = 0.22;

      // 8. Animation & Render Loop
      let clock = new THREE.Clock();
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Target City Flight Slerp (Spring Interpolation)
        if (targetRotation.current) {
          const dY = targetRotation.current.y - globeGroup.rotation.y;
          const dX = targetRotation.current.x - globeGroup.rotation.x;

          globeGroup.rotation.y += dY * 0.08;
          globeGroup.rotation.x += dX * 0.08;

          if (Math.abs(dY) < 0.001 && Math.abs(dX) < 0.001) {
            targetRotation.current = null;
          }
        } else if (!isDragging.current) {
          // Physics Momentum Damping
          if (Math.abs(velocity.current.x) > 0.0001) {
            globeGroup.rotation.y += velocity.current.x;
            velocity.current.x *= 0.94; // friction
          } else if (autoRotate.current) {
            // Steady Natural Orbit
            globeGroup.rotation.y += 0.0024 * speedRef.current;
          }

          if (Math.abs(velocity.current.y) > 0.0001) {
            globeGroup.rotation.x += velocity.current.y;
            velocity.current.y *= 0.94;
            globeGroup.rotation.x = Math.max(-0.6, Math.min(0.6, globeGroup.rotation.x));
          }
        }

        // Animate Pulsing Radar Wave Rings
        pulseRings.forEach((ring, idx) => {
          const scale = 1 + (Math.sin(elapsedTime * 3 + idx) * 0.5 + 0.5) * 1.5;
          ring.scale.set(scale, scale, 1);
          (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0.1, 1 - (scale - 1) / 1.5);
        });

        renderer.render(scene, camera);
      };

      animate();

      // Handle Resize smoothly
      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth || 600;
        const h = container.clientHeight || 600;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
        scene.clear();
      };
    } catch (err) {
      console.warn("WebGL initialization fallback:", err);
      setHasWebGL(false);
    }
  }, []);

  // 100% Interactive Pointer Event Listeners
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    prevPointer.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
    targetRotation.current = null;
    if (mountRef.current) mountRef.current.style.cursor = "grabbing";
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !globeGroupRef.current) return;

    const dx = e.clientX - prevPointer.current.x;
    const dy = e.clientY - prevPointer.current.y;

    velocity.current = {
      x: dx * 0.004,
      y: dy * 0.004,
    };

    globeGroupRef.current.rotation.y += velocity.current.x;
    globeGroupRef.current.rotation.x = Math.max(
      -0.6,
      Math.min(0.6, globeGroupRef.current.rotation.x + velocity.current.y)
    );

    prevPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    if (mountRef.current) mountRef.current.style.cursor = "grab";
  };

  const isHero = size === "hero";

  return (
    <div
      className={`relative w-full mx-auto flex flex-col items-center justify-center select-none ${
        isHero ? "max-w-[760px] lg:max-w-[820px]" : "max-w-[440px]"
      } ${className}`}
    >
      {/* ── HYPER-VIBRANT PURPLE COSMIC NEBULA & ATMOSPHERE ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div
          className={`rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.38)_0%,rgba(192,38,211,0.22)_35%,rgba(134,25,143,0.08)_60%,transparent_75%)] blur-3xl animate-pulse ${
            isHero ? "w-[720px] h-[720px]" : "w-[400px] h-[400px]"
          }`}
          style={{ animationDuration: "5s" }}
        />
        <div
          className={`absolute rounded-full bg-[radial-gradient(circle,rgba(240,171,252,0.18)_0%,rgba(217,70,239,0.1)_45%,transparent_70%)] blur-[95px] ${
            isHero ? "w-[880px] h-[880px]" : "w-[480px] h-[480px]"
          }`}
        />
      </div>

      {/* ── TOP MISSION CONTROL TELEMETRY HUD ── */}
      {isHero && (
        <div className="w-full flex items-center justify-between px-4 sm:px-6 mb-2 z-20 pointer-events-none">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#080b12]/85 border border-[#d946ef]/30 backdrop-blur-md shadow-[0_0_20px_rgba(217,70,239,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#d946ef] animate-ping" />
            <span className="mono text-[10px] font-bold text-white/90 tracking-wider uppercase">
              RADAR OSINT v4.2
            </span>
            <span className="text-white/20">•</span>
            <span className="mono text-[10px] text-[#f0abfc] font-bold">
              {telemetryLat}, {telemetryLng}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 backdrop-blur-md">
            <Radio className="w-3 h-3 text-[#10b981] animate-pulse" />
            <span className="mono text-[10px] font-bold text-[#10b981] uppercase tracking-wider">
              142 Satélites Ativos
            </span>
          </div>
        </div>
      )}

      {/* ── THREE.JS 3D CANVAS STAGE ── */}
      <div
        className={`relative w-full aspect-square flex items-center justify-center z-10 touch-none ${
          isHero ? "max-h-[640px] lg:max-h-[700px]" : "max-h-[400px]"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {hasWebGL ? (
          <div ref={mountRef} className="w-full h-full flex items-center justify-center" />
        ) : (
          <div className="relative w-80 h-80 rounded-full border-2 border-[#d946ef]/40 bg-[#0c101a] flex flex-col items-center justify-center shadow-[0_0_80px_rgba(217,70,239,0.35)]">
            <GlobeIcon className="w-12 h-12 text-[#d946ef] mb-2 animate-pulse" />
            <span className="mono text-xs uppercase tracking-widest text-[#f0abfc] font-bold">
              Radar Global Ativo
            </span>
          </div>
        )}

        {/* Tactical Active Target Beacon Tooltip */}
        {activeCity && (
          <div className="absolute bottom-6 right-4 sm:right-8 z-30 pointer-events-auto">
            <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#080b12]/90 border border-[#d946ef]/40 backdrop-blur-xl shadow-[0_12px_36px_rgba(217,70,239,0.35)]">
              <div className="w-7 h-7 rounded-lg bg-[#d946ef]/20 border border-[#d946ef]/50 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-[#f0abfc]" />
              </div>
              <div>
                <p className="font-display text-xs font-bold text-white flex items-center gap-1.5">
                  {activeCity.name}, {activeCity.country}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                </p>
                <p className="mono text-[10px] text-[#f0abfc] font-semibold">
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
                ? "bg-[#d946ef]/20 border-[#d946ef]/50 text-[#f0abfc] shadow-[0_0_18px_rgba(217,70,239,0.35)]"
                : "bg-white/[0.04] border-white/10 text-white/60 hover:text-white"
            }`}
          >
            {isRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isRotating ? "Pausar" : "Orbitar"}
          </button>

          <button
            onClick={toggleSpeed}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 mono text-[11px] font-bold uppercase tracking-wider text-white/70 hover:text-white hover:border-[#d946ef]/40 transition-all"
          >
            <Zap className="w-3 h-3 text-[#d946ef]" />
            Vel: {speedMode}
          </button>

          <button
            onClick={resetOrientation}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 mono text-[11px] font-bold uppercase tracking-wider text-white/70 hover:text-white hover:border-[#d946ef]/40 transition-all"
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
              <Compass className="w-3 h-3 text-[#d946ef]" /> Alvos Rápidos:
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
                      ? "bg-[#d946ef] border-[#f0abfc] text-white shadow-[0_0_25px_rgba(217,70,239,0.65)] scale-105"
                      : "bg-[#0b0e18]/80 border-white/10 text-white/70 hover:text-white hover:border-[#d946ef]/50 hover:bg-[#d946ef]/10"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-white animate-ping" : "bg-[#d946ef]"
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
