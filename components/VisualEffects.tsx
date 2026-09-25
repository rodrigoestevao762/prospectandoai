"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

export function ParticleStarfield() {
  const ref = useRef<any>();
  const [sphere, setSphere] = React.useState<Float32Array | null>(null);

  React.useEffect(() => {
    setSphere(random.inSphere(new Float32Array(5000), { radius: 1.5 }) as Float32Array);
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  if (!sphere) return null;

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#38bdf8" size={0.005} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

export function CyberBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none bg-[var(--void)] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-grid opacity-10 mix-blend-screen" />
      <div className="absolute inset-0 w-full h-full opacity-60">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <ParticleStarfield />
        </Canvas>
      </div>
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[var(--signal)] rounded-full blur-[150px] opacity-10 animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[var(--amber)] rounded-full blur-[150px] opacity-5" />
    </div>
  );
}
