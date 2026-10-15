"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
}

export default function CodeHardLogo({
  className = "",
  size = "md",
  showWordmark = true,
}: LogoProps) {
  const sizeMap = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textMap = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* ── UNIQUE CODEHARD ICON: DIAMOND-CUT SHIELD WITH INNER <H> CORE ── */}
      <div
        className={`${sizeMap[size]} rounded-2xl bg-gradient-to-br from-[#6d28d9] via-[#4c1d95] to-[#1e0b3d] border border-purple-400/40 p-1.5 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.45)] relative overflow-hidden group`}
      >
        {/* Glow & Specular Lighting */}
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-400/30 rounded-full blur-sm pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.04] to-white/[0.12] pointer-events-none" />

        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]"
        >
          <defs>
            <linearGradient id="chGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5f3ff" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
            <filter id="chGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Outer Diamond/Hex Contour */}
          <path
            d="M20 3L35 11V29L20 37L5 29V11L20 3Z"
            stroke="url(#chGrad)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Left Bracket < */}
          <path
            d="M13 15L8 20L13 25"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Bracket > */}
          <path
            d="M27 15L32 20L27 25"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central High-Tech 'H' Core */}
          <path
            d="M17 14V26M23 14V26M17 20H23"
            stroke="url(#chGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#chGlow)"
          />

          {/* Center Energy Pulse Node */}
          <circle cx="20" cy="20" r="1.5" fill="#ffffff" />
        </svg>
      </div>

      {/* ── WORDMARK ── */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight leading-none text-white ${textMap[size]}`}>
            CODE<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#7c3aed]">HARD</span>
          </div>
          <span className="font-mono text-[8px] uppercase tracking-widest text-purple-300/80 font-bold mt-0.5">
            PLATAFORMA DIGITAL
          </span>
        </div>
      )}
    </div>
  );
}

