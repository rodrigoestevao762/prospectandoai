"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Compass, RotateCw, Pause, Play, MapPin, Globe as GlobeIcon, Layers } from "lucide-react";
import WORLD_LAND_DATA from "@/public/world-land.json";

export interface CityTarget {
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  leads: string;
  segments: string;
  missingWebsites: string;
}

export const ENTERPRISE_HUBS: CityTarget[] = [
  {
    name: "São Paulo",
    region: "SP",
    country: "Brasil",
    lat: -23.5505,
    lng: -46.6333,
    leads: "14.820 empresas mapeadas",
    segments: "Clínicas, Varejo & B2B",
    missingWebsites: "64% sem presença mobile ou SSL",
  },
  {
    name: "Rio de Janeiro",
    region: "RJ",
    country: "Brasil",
    lat: -22.9068,
    lng: -43.1729,
    leads: "8.430 empresas mapeadas",
    segments: "Gastronomia, Serviços & Saúde",
    missingWebsites: "58% sem website profissional",
  },
  {
    name: "Belo Horizonte",
    region: "MG",
    country: "Brasil",
    lat: -19.9167,
    lng: -43.9345,
    leads: "6.120 empresas mapeadas",
    segments: "Indústria, Comércio & Logística",
    missingWebsites: "61% sem domínio próprio",
  },
  {
    name: "Curitiba",
    region: "PR",
    country: "Brasil",
    lat: -25.4284,
    lng: -49.2733,
    leads: "4.980 empresas mapeadas",
    segments: "Tech, Escritórios & Saúde",
    missingWebsites: "52% com sites obsoletos",
  },
  {
    name: "Lisboa",
    region: "Distrito de Lisboa",
    country: "Portugal",
    lat: 38.7223,
    lng: -9.1393,
    leads: "3.250 empresas mapeadas",
    segments: "Imobiliário, Turismo & B2B",
    missingWebsites: "48% sem cardápio/site digital",
  },
  {
    name: "Nova York",
    region: "NY",
    country: "EUA",
    lat: 40.7128,
    lng: -74.006,
    leads: "12.400 empresas mapeadas",
    segments: "Agências, Serviços & SaaS",
    missingWebsites: "43% necessitam de modernização",
  },
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Procedural high-resolution texture generator directly from bundled Natural Earth GeoJSON
function createWorldTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // 1. Solid Matte Deep Obsidian Space Ocean
  ctx.fillStyle = "#08090f";
  ctx.fillRect(0, 0, width, height);

  // 2. Tactical Latitude & Longitude Coordinate Grid (Graticules)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
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

  // 3. Render Continents from bundled GeoJSON
  if (WORLD_LAND_DATA && (WORLD_LAND_DATA as any).features) {
    // Fill Pass: Executive Dark Slate / Graphite Landmass Body
    ctx.fillStyle = "#141724";

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

    (WORLD_LAND_DATA as any).features.forEach((feature: any) => {
      const geom = feature.geometry;
      if (geom.type === "Polygon") {
        geom.coordinates.forEach((ring: number[][]) => drawPolygon(ring));
      } else if (geom.type === "MultiPolygon") {
        geom.coordinates.forEach((poly: number[][][]) => {
          poly.forEach((ring: number[][]) => drawPolygon(ring));
        });
      }
    });

    // Stroke Pass: Crisp Hairline Coastline Borders (Executive GIS Style)
    ctx.strokeStyle = "#333a50";
    ctx.lineWidth = 1.2;

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

    (WORLD_LAND_DATA as any).features.forEach((feature: any) => {
      const geom = feature.geometry;
      if (geom.type === "Polygon") {
        geom.coordinates.forEach((ring: number[][]) => strokePolygon(ring));
      } else if (geom.type === "MultiPolygon") {
        geom.coordinates.forEach((poly: number[][][]) => {
          poly.forEach((ring: number[][]) => strokePolygon(ring));
        });
      }
    });

    // Clean Geographic Coordinate Mesh on Continents
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let y = 10; y < height - 10; y += 14) {
      for (let x = 10; x < width - 10; x += 14) {
        const idx = (y * width + x) * 4;
        // If pixel is on continent landmass
        if (data[idx] > 20) {
          ctx.beginPath();
          ctx.arc(x, y, 0.9, 0, Math.PI * 2);
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
  showHubSelector?: boolean;
  className?: string;
  onTargetSelect?: (hub: CityTarget) => void;
}

export default function Globe({
  size = "hero",
  showControls = true,
  showHubSelector = true,
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

  // State
  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeHub, setActiveHub] = useState<CityTarget>(ENTERPRISE_HUBS[0]);
  const [isRotating, setIsRotating] = useState(true);
  const [telemetryLat, setTelemetryLat] = useState("23.55° S");
  const [telemetryLng, setTelemetryLng] = useState("46.63° W");

  // Fly to target city with smooth rotation interpolation
  const flyToHub = useCallback((hub: CityTarget) => {
    setActiveHub(hub);
    if (onTargetSelect) onTargetSelect(hub);

    // Compute target rotation in radians to center city directly in front of camera
    const targetY = -((hub.lng + 90) * (Math.PI / 180));
    const targetX = (hub.lat * (Math.PI / 180)) * 0.75;

    targetRotation.current = { y: targetY, x: targetX };
    setTelemetryLat(`${Math.abs(hub.lat).toFixed(2)}° ${hub.lat >= 0 ? "N" : "S"}`);
    setTelemetryLng(`${Math.abs(hub.lng).toFixed(2)}° ${hub.lng >= 0 ? "E" : "W"}`);
  }, [onTargetSelect]);

  const toggleAutoRotate = () => {
    autoRotate.current = !autoRotate.current;
    setIsRotating(autoRotate.current);
  };

  const recenter = () => {
    flyToHub(ENTERPRISE_HUBS[0]);
  };

  useEffect(() => {
    if (!mountRef.current || typeof window === "undefined") return;

    let animId: number;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let worldTexture: THREE.CanvasTexture;

    try {
      const container = mountRef.current;
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 600;

      // 1. Three.js Scene & Camera Setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 2.85;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      container.replaceChildren(renderer.domElement);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.cursor = "grab";

      const globeGroup = new THREE.Group();
      globeGroupRef.current = globeGroup;
      scene.add(globeGroup);

      // 2. Base Sphere Mesh with Instant Synchronous Continents Texture
      const globeRadius = 1.0;
      const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);

      worldTexture = createWorldTexture();
      const globeMaterial = new THREE.MeshPhongMaterial({
        map: worldTexture,
        specular: new THREE.Color("#2a3045"),
        shininess: 14,
        emissive: new THREE.Color("#080910"),
        emissiveIntensity: 0.08,
      });

      const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
      globeGroup.add(globeMesh);

      // 3. Physically Grounded Thin Atmospheric Limb Shell
      const atmosGeometry = new THREE.SphereGeometry(globeRadius * 1.12, 64, 64);
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
            gl_FragColor = vec4(0.35, 0.22, 0.65, 1.0) * intensity * 0.65;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      });
      const atmosMesh = new THREE.Mesh(atmosGeometry, atmosMaterial);
      scene.add(atmosMesh);

      // 4. Balanced Architectural Directional Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
      scene.add(ambientLight);

      const rimLight = new THREE.DirectionalLight(0x6d28d9, 1.4);
      rimLight.position.set(4, 3, 5);
      scene.add(rimLight);

      const subtleFill = new THREE.DirectionalLight(0x334155, 0.7);
      subtleFill.position.set(-4, -2, -3);
      scene.add(subtleFill);

      // 5. Enterprise Hub Data Markers (Clean Geographic Pins)
      ENTERPRISE_HUBS.forEach((hub) => {
        const pos = latLngToVector3(hub.lat, hub.lng, globeRadius * 1.01);

        // Core Pin Dot
        const isSp = hub.name === "São Paulo";
        const dotGeo = new THREE.SphereGeometry(isSp ? 0.022 : 0.016, 16, 16);
        const dotMat = new THREE.MeshBasicMaterial({
          color: isSp ? 0x10b981 : 0xcbd5e1,
        });
        const dotMesh = new THREE.Mesh(dotGeo, dotMat);
        dotMesh.position.copy(pos);
        globeGroup.add(dotMesh);

        // Subtly elevated marker stem
        const stemGeo = new THREE.CylinderGeometry(0.002, 0.002, 0.035, 8);
        const stemMat = new THREE.MeshBasicMaterial({ color: 0x475569 });
        const stemMesh = new THREE.Mesh(stemGeo, stemMat);
        stemMesh.position.copy(pos.clone().multiplyScalar(1.015));
        stemMesh.lookAt(new THREE.Vector3(0, 0, 0));
        stemMesh.rotateX(Math.PI / 2);
        globeGroup.add(stemMesh);
      });

      // 6. Initial Orientation centering South America / Brazil
      globeGroup.rotation.y = 0.85;
      globeGroup.rotation.x = -0.28;

      // 7. Animation Loop with Performance Timestamp
      let lastTime = performance.now();
      const animate = (currentTime: number) => {
        animId = requestAnimationFrame(animate);
        const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
        lastTime = currentTime;

        // Target Hub Flight Interpolation
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
            velocity.current.x *= 0.94;
          } else if (autoRotate.current) {
            // Steady Natural Orbit
            globeGroup.rotation.y += 0.0018;
          }

          if (Math.abs(velocity.current.y) > 0.0001) {
            globeGroup.rotation.x += velocity.current.y;
            velocity.current.y *= 0.94;
            globeGroup.rotation.x = Math.max(-0.6, Math.min(0.6, globeGroup.rotation.x));
          }
        }

        renderer.render(scene, camera);
      };

      animate(performance.now());

      // Resize observer
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
        worldTexture.dispose();
        globeGeometry.dispose();
        globeMaterial.dispose();
        renderer.dispose();
        scene.clear();
      };
    } catch (err) {
      console.warn("WebGL initialization fallback:", err);
      setHasWebGL(false);
    }
  }, []);

  // Pointer Drag Interaction
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

    // Compute live telemetry coordinates based on rotation
    const curLat = (-globeGroupRef.current.rotation.x * (180 / Math.PI)).toFixed(1);
    const curLng = (-((globeGroupRef.current.rotation.y * (180 / Math.PI)) % 360)).toFixed(1);
    setTelemetryLat(`${curLat}°`);
    setTelemetryLng(`${curLng}°`);

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
        isHero ? "max-w-[720px] lg:max-w-[760px]" : "max-w-[420px]"
      } ${className}`}
    >
      {/* ── SUBTLE SOLID DEPTH BACKDROP (NO NEON GLOW) ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div
          className={`rounded-full bg-[radial-gradient(circle,rgba(91,33,182,0.12)_0%,rgba(15,23,42,0.02)_50%,transparent_75%)] blur-2xl ${
            isHero ? "w-[640px] h-[640px]" : "w-[360px] h-[360px]"
          }`}
        />
      </div>

      {/* ── TOP ENTERPRISE HUD BAR ── */}
      {isHero && (
        <div className="w-full flex items-center justify-between px-4 sm:px-6 mb-3 z-20 pointer-events-none">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#0c0e17]/90 border border-white/[0.08] backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span className="font-mono text-[10px] font-bold text-white/90 tracking-wider uppercase">
              BASE GEOESPACIAL B2B
            </span>
            <span className="text-white/20">•</span>
            <span className="font-mono text-[10px] text-zinc-300 font-semibold">
              {telemetryLat}, {telemetryLng}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0c0e17]/90 border border-white/[0.08] backdrop-blur-md">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-mono text-[10px] font-medium text-white/60 uppercase tracking-wider">
              Malha Vetorial Natural Earth
            </span>
          </div>
        </div>
      )}

      {/* ── 3D CANVAS STAGE ── */}
      <div
        className={`relative w-full flex items-center justify-center z-10 touch-pan-y ${
          isHero ? "h-[340px] sm:h-[440px] lg:h-[580px] max-w-[580px] aspect-square" : "h-[280px] sm:h-[360px] max-w-[360px] aspect-square"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {hasWebGL ? (
          <div ref={mountRef} className="w-full h-full flex items-center justify-center" />
        ) : (
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-zinc-800 bg-[#0d0f18] flex flex-col items-center justify-center">
            <GlobeIcon className="w-10 h-10 text-zinc-500 mb-2" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-bold">
              Base Vetorial Carregada
            </span>
          </div>
        )}

        {/* Enterprise Selected Hub Tooltip */}
        {activeHub && isHero && (
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-6 z-30 pointer-events-auto max-w-[240px] sm:max-w-[280px]">
            <div className="p-3 sm:p-3.5 rounded-xl bg-[#0c0e17]/95 border border-white/[0.1] backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <p className="font-display text-xs font-bold text-white truncate">
                  {activeHub.name}, {activeHub.region}
                  <span className="text-[10px] text-zinc-400 font-normal ml-1 hidden sm:inline">({activeHub.country})</span>
                </p>
              </div>
              <p className="font-mono text-[10px] sm:text-[11px] text-zinc-200 font-semibold mb-0.5">
                {activeHub.leads}
              </p>
              <p className="text-[9px] sm:text-[10px] text-zinc-400 leading-tight">
                <strong className="text-zinc-300">Déficit:</strong> {activeHub.missingWebsites}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── ENTERPRISE CONTROL TOOLBAR ── */}
      {showControls && (
        <div className="flex items-center gap-2 mt-2 mb-3 z-20">
          <button
            onClick={toggleAutoRotate}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-[11px] font-semibold tracking-wider transition-all ${
              isRotating
                ? "bg-violet-950/60 border-violet-700/60 text-violet-200"
                : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {isRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isRotating ? "Pausar Órbita" : "Orbitar"}
          </button>

          <button
            onClick={recenter}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 font-mono text-[11px] font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
            title="Recentralizar no Brasil"
          >
            <RotateCw className="w-3 h-3 text-zinc-400" />
            Centralizar Brasil
          </button>
        </div>
      )}

      {/* ── HUB SELECTOR PILLS (SÃO PAULO, RIO, BH, CURITIBA, LISBOA, NY) ── */}
      {showHubSelector && (
        <div className="w-full mt-1 z-20">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap px-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 mr-1 hidden sm:inline-flex items-center gap-1">
              <Compass className="w-3 h-3 text-zinc-400" /> Metrópoles:
            </span>
            {ENTERPRISE_HUBS.map((hub) => {
              const isSelected = activeHub.name === hub.name;
              return (
                <button
                  key={hub.name}
                  onClick={() => flyToHub(hub)}
                  type="button"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                    isSelected
                      ? "bg-violet-700 border-violet-500 text-white shadow-sm font-semibold"
                      : "bg-[#0c0e16]/80 border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-white" : "bg-zinc-500"
                    }`}
                  />
                  <span>{hub.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
