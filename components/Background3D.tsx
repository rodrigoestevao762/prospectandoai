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
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.z = 80;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
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

      // 1. 3D Spatial Constellation of Nodes (Deep Vivid Violet)
      const particleCount = 75;
      const particlesGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const velocities: { x: number; y: number; z: number }[] = [];

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 160;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

        velocities.push({
          x: (Math.random() - 0.5) * 0.04,
          y: (Math.random() - 0.5) * 0.04,
          z: (Math.random() - 0.5) * 0.03,
        });
      }

      particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const particlesMat = new THREE.PointsMaterial({
        color: 0x8b5cf6,
        size: 2.2,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      });

      const particleSystem = new THREE.Points(particlesGeo, particlesMat);
      scene.add(particleSystem);

      // 2. Dynamic Connection Lines between Nearby 3D Nodes
      const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x6d28d9,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
      });

      const maxLineCount = 120;
      const linesGeo = new THREE.BufferGeometry();
      const linePositions = new Float32Array(maxLineCount * 6);
      linesGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
      const lineMesh = new THREE.LineSegments(linesGeo, linesMaterial);
      scene.add(lineMesh);

      // 3. Perspective Grid Plane at Horizon
      const gridHelper = new THREE.GridHelper(260, 26, 0x5b21b6, 0x1f143d);
      gridHelper.position.y = -55;
      gridHelper.position.z = -20;
      (gridHelper.material as THREE.Material).transparent = true;
      (gridHelper.material as THREE.Material).opacity = 0.35;
      scene.add(gridHelper);

      // Mouse Parallax
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.0006;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.0006;
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      // Animation Loop
      const animate = () => {
        animId = requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        scene.rotation.y = targetX * 1.5;
        scene.rotation.x = targetY * 1.2;

        gridHelper.position.z = (gridHelper.position.z + 0.06) % 10 - 20;

        // Move particles
        const posAttr = particlesGeo.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          posArray[i * 3] += velocities[i].x;
          posArray[i * 3 + 1] += velocities[i].y;
          posArray[i * 3 + 2] += velocities[i].z;

          // Bounce boundaries
          if (Math.abs(posArray[i * 3]) > 80) velocities[i].x *= -1;
          if (Math.abs(posArray[i * 3 + 1]) > 60) velocities[i].y *= -1;
          if (Math.abs(posArray[i * 3 + 2]) > 40) velocities[i].z *= -1;
        }
        posAttr.needsUpdate = true;

        // Update proximity lines
        let lineIdx = 0;
        const linePosArray = linesGeo.attributes.position.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          for (let j = i + 1; j < particleCount; j++) {
            const dx = posArray[i * 3] - posArray[j * 3];
            const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
            const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < 26 && lineIdx < maxLineCount) {
              const base = lineIdx * 6;
              linePosArray[base] = posArray[i * 3];
              linePosArray[base + 1] = posArray[i * 3 + 1];
              linePosArray[base + 2] = posArray[i * 3 + 2];

              linePosArray[base + 3] = posArray[j * 3];
              linePosArray[base + 4] = posArray[j * 3 + 1];
              linePosArray[base + 5] = posArray[j * 3 + 2];
              lineIdx++;
            }
          }
        }

        // Clear unused lines
        for (let k = lineIdx * 6; k < maxLineCount * 6; k++) {
          linePosArray[k] = 0;
        }
        linesGeo.attributes.position.needsUpdate = true;

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
        particlesGeo.dispose();
        particlesMat.dispose();
        linesGeo.dispose();
        linesMaterial.dispose();
        gridHelper.dispose();
        renderer.dispose();
      };
    } catch (e) {
      console.warn("Background3D initialization skipped:", e);
    }
  }, []);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
}

