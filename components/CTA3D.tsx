
"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, TorusKnot, Line, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function DataCore() {
  const coreRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.2;
      coreRef.current.rotation.x += delta * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.15;
      ringRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
        <mesh ref={coreRef} scale={1.5}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#00CFFF" wireframe transparent opacity={0.15} />
        </mesh>
        <mesh scale={1.4}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#2060FF" wireframe transparent opacity={0.1} />
        </mesh>
      </Float>

      <group ref={ringRef}>
        <Float speed={1} rotationIntensity={2} floatIntensity={0.5}>
          <mesh>
            <torusGeometry args={[3, 0.01, 16, 100]} />
            <meshBasicMaterial color="#00CFFF" transparent opacity={0.3} />
          </mesh>
        </Float>
        <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[3.5, 0.01, 16, 100]} />
            <meshBasicMaterial color="#2060FF" transparent opacity={0.2} />
          </mesh>
        </Float>
      </group>
    </group>
  );
}

export default function CTA3D() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <fog attach="fog" args={["#030609", 3, 10]} />
        <ambientLight intensity={0.5} />
        <Stars radius={10} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <DataCore />
      </Canvas>
    </div>
  );
}

