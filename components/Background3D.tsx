"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Background3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || typeof window === "undefined") return;

    let animId: number;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;

    try {
      const container = mountRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.z = 100;

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

      container.replaceChildren(renderer.domElement);
      renderer.domElement.style.position = "fixed";
      renderer.domElement.style.top = "0";
      renderer.domElement.style.left = "0";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.pointerEvents = "none";
      renderer.domElement.style.zIndex = "0";

      // ── 1. Sophisticated Spatial Depth Field (Deep Obsidian & Subtle Executive Violet) ──
      // Subtle ambient micro-particles floating in deep space (zero tacky constellation lines)
      const particleCount = 120;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(particleCount * 3);
      const scales = new Float32Array(particleCount);
      const velocities: { x: number; y: number; z: number }[] = [];

      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 220;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 160;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 120;
        scales[i] = Math.random() * 1.5 + 0.5;

        velocities.push({
          x: (Math.random() - 0.5) * 0.015,
          y: (Math.random() - 0.5) * 0.015,
          z: (Math.random() - 0.5) * 0.01,
        });
      }

      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

      // Circular particle texture for soft organic bokeh
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d")!;
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
      grad.addColorStop(0.3, "rgba(139, 92, 246, 0.6)");
      grad.addColorStop(0.8, "rgba(91, 33, 182, 0.15)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);

      const pTexture = new THREE.CanvasTexture(canvas);

      const mat = new THREE.PointsMaterial({
        color: 0x8b5cf6,
        size: 2.8,
        map: pTexture,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particlePoints = new THREE.Points(geo, mat);
      scene.add(particlePoints);

      // ── 2. Subtle Spatial Atmosphere Volume ──
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      // Smooth mouse parallax
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.0003;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.0003;
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      // Animation loop
      const animate = () => {
        animId = requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        scene.rotation.y = targetX;
        scene.rotation.x = targetY;

        // Gentle floating drift
        const posArray = geo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          posArray[i * 3] += velocities[i].x;
          posArray[i * 3 + 1] += velocities[i].y;
          posArray[i * 3 + 2] += velocities[i].z;

          if (Math.abs(posArray[i * 3]) > 110) velocities[i].x *= -1;
          if (Math.abs(posArray[i * 3 + 1]) > 80) velocities[i].y *= -1;
          if (Math.abs(posArray[i * 3 + 2]) > 60) velocities[i].z *= -1;
        }
        geo.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!renderer || !camera) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
        geo.dispose();
        mat.dispose();
        pTexture.dispose();
        renderer.dispose();
      };
    } catch (e) {
      console.warn("Background3D initialization skipped:", e);
    }
  }, []);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
}
