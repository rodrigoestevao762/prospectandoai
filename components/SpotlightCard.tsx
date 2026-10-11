"use client";

import { useRef, useState } from "react";

export function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative rounded-2xl border border-white/[0.06] bg-[#0c1018] overflow-hidden transition-all duration-300 hover:border-white/[0.12] ${className}`}
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, rgba(217, 70, 239, 0.22), transparent 70%)`,
        }}
      />
      {/* Top edge sheen */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d946ef]/40 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
