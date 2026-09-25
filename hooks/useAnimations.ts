"use client";

import { useRef, useState, MouseEvent } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

export function useTilt3D(config = { stiffness: 300, damping: 20, maxRotation: 15 }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [config.maxRotation, -config.maxRotation]), { stiffness: config.stiffness, damping: config.damping });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-config.maxRotation, config.maxRotation]), { stiffness: config.stiffness, damping: config.damping });
  const scale = useSpring(1, { stiffness: config.stiffness, damping: config.damping });
  
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calcula posição relativa (-0.5 a 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;
    
    x.set(mouseX);
    y.set(mouseY);
    
    // Posiciona o glare (brilho)
    setGlare({
      x: ((e.clientX - rect.left) / width) * 100,
      y: ((e.clientY - rect.top) / height) * 100,
      opacity: 1
    });
  };

  const handleMouseEnter = () => {
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return { ref, rotateX, rotateY, scale, glare, handleMouseMove, handleMouseEnter, handleMouseLeave };
}
