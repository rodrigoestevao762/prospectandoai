"use client";

import React from "react";
import { motion } from "framer-motion";

interface MascotProps {
  variant?: "radar" | "crm" | "design" | "prompts" | "sales" | "member" | "client";
  className?: string;
}

export default function HardyMascot({
  variant = "radar",
  className = "w-56 h-56",
}: MascotProps) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-4, 4, -4] }}
      transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_15px_35px_rgba(124,58,237,0.45)]"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="bodyGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#4c1d95" />
            <stop offset="40%" stopColor="#2e1065" />
            <stop offset="100%" stopColor="#0f0728" />
          </linearGradient>

          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a0b36" />
            <stop offset="100%" stopColor="#070312" />
          </linearGradient>

          <linearGradient id="neonPurple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>

          <linearGradient id="glowPulse" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <radialGradient id="highlight" cx="30%" cy="20%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* ── AMBIENT ENERGY HALO ── */}
        <circle cx="140" cy="140" r="105" fill="none" stroke="url(#neonPurple)" strokeWidth="1" strokeDasharray="6 8" opacity="0.3" />
        <circle cx="140" cy="140" r="120" fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity="0.2" />

        {/* ── ANTI-GRAVITY HOVER THRUSTERS ── */}
        <g opacity="0.8">
          <ellipse cx="140" cy="245" rx="36" ry="7" fill="#7c3aed" filter="url(#purpleGlow)" opacity="0.5" />
          <path d="M125 220L115 240H165L155 220H125Z" fill="url(#bodyGrad)" stroke="#6d28d9" strokeWidth="1.5" />
          <ellipse cx="140" cy="238" rx="16" ry="4" fill="#c084fc" filter="url(#purpleGlow)" />
        </g>

        {/* ── HARDY BODY (OBSIDIAN CHROME CAPSULE) ── */}
        <rect
          x="75"
          y="70"
          width="130"
          height="145"
          rx="65"
          fill="url(#bodyGrad)"
          stroke="#7c3aed"
          strokeWidth="3.5"
        />
        {/* Specular curved highlight */}
        <path
          d="M90 90C90 90 115 78 140 78C165 78 190 90 190 90"
          stroke="url(#highlight)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* ── CYBER EAR ANTENNAS ── */}
        {/* Left Ear */}
        <rect x="58" y="115" width="18" height="34" rx="9" fill="#2e1065" stroke="#a855f7" strokeWidth="2" />
        <circle cx="67" cy="132" r="4" fill="#c084fc" filter="url(#purpleGlow)" />
        {/* Right Ear */}
        <rect x="204" y="115" width="18" height="34" rx="9" fill="#2e1065" stroke="#a855f7" strokeWidth="2" />
        <circle cx="213" cy="132" r="4" fill="#c084fc" filter="url(#purpleGlow)" />

        {/* ── DYNAMIC DIGITAL VISOR ── */}
        <rect
          x="88"
          y="95"
          width="104"
          height="62"
          rx="26"
          fill="url(#visorGrad)"
          stroke="#a855f7"
          strokeWidth="2.5"
          filter="url(#purpleGlow)"
        />

        {/* ── DIGITAL LED VISOR EYES ── */}
        {variant === "radar" && (
          <g filter="url(#purpleGlow)">
            {/* Radar Scope Visor */}
            <circle cx="120" cy="126" r="12" fill="none" stroke="#c084fc" strokeWidth="2.5" />
            <circle cx="120" cy="126" r="4" fill="#ffffff" />
            <line x1="120" y1="110" x2="120" y2="142" stroke="#c084fc" strokeWidth="1.5" />
            <line x1="104" y1="126" x2="136" y2="126" stroke="#c084fc" strokeWidth="1.5" />

            {/* Right Eye */}
            <circle cx="160" cy="126" r="12" fill="none" stroke="#c084fc" strokeWidth="2.5" />
            <circle cx="160" cy="126" r="4" fill="#ffffff" />
            <line x1="160" y1="110" x2="160" y2="142" stroke="#c084fc" strokeWidth="1.5" />
            <line x1="144" y1="126" x2="176" y2="126" stroke="#c084fc" strokeWidth="1.5" />
          </g>
        )}

        {variant === "crm" && (
          <g filter="url(#purpleGlow)">
            {/* Happy Focus Eyes (^^) */}
            <path d="M110 130Q120 118 130 130" stroke="#c084fc" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M150 130Q160 118 170 130" stroke="#c084fc" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Smile Wave */}
            <path d="M134 140Q140 144 146 140" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {variant === "sales" && (
          <g filter="url(#purpleGlow)">
            {/* Bullish Star Eyes */}
            <circle cx="120" cy="126" r="7" fill="#c084fc" />
            <path d="M120 116V136M110 126H130" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="160" cy="126" r="7" fill="#c084fc" />
            <path d="M160 116V136M150 126H170" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <path d="M132 142Q140 148 148 142" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {variant === "design" && (
          <g filter="url(#purpleGlow)">
            {/* Creative Glowing Lenses */}
            <rect x="110" y="117" width="18" height="18" rx="6" fill="#a855f7" />
            <rect x="113" y="120" width="8" height="8" rx="2" fill="#ffffff" />
            <rect x="152" y="117" width="18" height="18" rx="6" fill="#a855f7" />
            <rect x="155" y="120" width="8" height="8" rx="2" fill="#ffffff" />
          </g>
        )}

        {variant === "prompts" && (
          <g filter="url(#purpleGlow)">
            {/* AI Code Brackets Eyes < > */}
            <path d="M124 119L114 126L124 133" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M156 119L166 126L156 133" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}

        {variant === "member" && (
          <g filter="url(#purpleGlow)">
            {/* Confident VIP Eyes */}
            <ellipse cx="120" cy="125" rx="8" ry="10" fill="#c084fc" />
            <circle cx="123" cy="122" r="3" fill="#ffffff" />
            <ellipse cx="160" cy="125" rx="8" ry="10" fill="#c084fc" />
            <circle cx="163" cy="122" r="3" fill="#ffffff" />
            <path d="M133 141Q140 146 147 141" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {variant === "client" && (
          <g filter="url(#purpleGlow)">
            {/* Friendly Attentive Eyes */}
            <circle cx="120" cy="126" r="9" fill="#c084fc" />
            <circle cx="123" cy="123" r="3.5" fill="#ffffff" />
            <circle cx="160" cy="126" r="9" fill="#c084fc" />
            <circle cx="163" cy="123" r="3.5" fill="#ffffff" />
          </g>
        )}

        {/* ── CHEST EMBLEM: CODEHARD <H> ── */}
        <g transform="translate(126, 172)">
          <rect width="28" height="28" rx="8" fill="#130a2a" stroke="#a855f7" strokeWidth="1.5" />
          <path d="M7 14L4 14M21 14L24 14" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
          <path d="M11 9V19M17 9V19M11 14H17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* ── PROPS IN HANDS ACCORDING TO VARIANT ── */}
        {variant === "radar" && (
          <g transform="translate(170, 140)" filter="url(#purpleGlow)">
            {/* Holographic Satellite Scanner */}
            <circle cx="45" cy="45" r="35" fill="rgba(109,40,217,0.25)" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="45" cy="45" r="20" fill="none" stroke="#a855f7" strokeWidth="1.5" />
            <circle cx="45" cy="45" r="6" fill="#ffffff" />
            <path d="M45 45L65 25" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
            {/* Satellite Target Pins */}
            <circle cx="32" cy="36" r="3" fill="#a855f7" />
            <circle cx="58" cy="52" r="3.5" fill="#c084fc" />
          </g>
        )}

        {variant === "crm" && (
          <g transform="translate(160, 130)">
            {/* 3 Floating Kanban Cards */}
            <rect x="15" y="10" width="38" height="24" rx="6" fill="#3b0764" stroke="#c084fc" strokeWidth="1.5" />
            <rect x="20" y="16" width="20" height="3" rx="1.5" fill="#ffffff" />
            <rect x="20" y="22" width="12" height="3" rx="1.5" fill="#c084fc" />

            <rect x="25" y="38" width="42" height="28" rx="6" fill="#1e1038" stroke="#10b981" strokeWidth="1.5" />
            <rect x="31" y="45" width="24" height="3" rx="1.5" fill="#10b981" />
            <rect x="31" y="52" width="14" height="3" rx="1.5" fill="#ffffff" />
          </g>
        )}

        {variant === "design" && (
          <g transform="translate(155, 125)">
            {/* Glowing Artboard Canvas */}
            <rect x="15" y="10" width="55" height="65" rx="8" fill="#180e33" stroke="#a855f7" strokeWidth="2" filter="url(#purpleGlow)" />
            {/* Color swatches */}
            <circle cx="28" cy="24" r="5" fill="#7c3aed" />
            <circle cx="42" cy="24" r="5" fill="#c084fc" />
            <circle cx="56" cy="24" r="5" fill="#ffffff" />
            {/* Wireframe grids */}
            <rect x="24" y="36" width="37" height="15" rx="3" fill="#2e1065" />
            <rect x="24" y="56" width="18" height="8" rx="2" fill="#a855f7" />
            <rect x="45" y="56" width="16" height="8" rx="2" fill="#ffffff" />
          </g>
        )}

        {variant === "prompts" && (
          <g transform="translate(150, 120)" filter="url(#purpleGlow)">
            {/* Floating Prompt Pill */}
            <rect x="20" y="15" width="60" height="26" rx="13" fill="#4c1d95" stroke="#c084fc" strokeWidth="2" />
            <text x="32" y="32" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">PROMPT</text>
            {/* Sparks */}
            <path d="M75 10L77 15L82 17L77 19L75 24L73 19L68 17L73 15Z" fill="#c084fc" />
          </g>
        )}

        {variant === "sales" && (
          <g transform="translate(160, 125)">
            {/* Profit Tablet with Exponential Chart */}
            <rect x="10" y="10" width="52" height="64" rx="8" fill="#0d0720" stroke="#a855f7" strokeWidth="2" filter="url(#purpleGlow)" />
            {/* Chart line */}
            <path d="M16 58L28 48L38 52L54 26" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="54" cy="26" r="3.5" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
            {/* Arrow UP */}
            <path d="M48 24H56V32" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}

        {variant === "member" && (
          <g transform="translate(145, 130)">
            {/* Titanium VIP Member Card */}
            <rect x="10" y="12" width="68" height="44" rx="6" fill="#0a0518" stroke="#a855f7" strokeWidth="2" filter="url(#purpleGlow)" />
            <circle cx="22" cy="24" r="5" fill="#f59e0b" />
            <rect x="18" y="38" width="28" height="4" rx="2" fill="#c084fc" />
            <text x="44" y="27" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold">&lt;H&gt; VIP</text>
          </g>
        )}

        {variant === "client" && (
          <g transform="translate(165, 125)">
            {/* Modern Smartphone with Contacts */}
            <rect x="10" y="10" width="38" height="64" rx="8" fill="#0a0518" stroke="#a855f7" strokeWidth="2" filter="url(#purpleGlow)" />
            <rect x="22" y="14" width="14" height="2.5" rx="1" fill="#7c3aed" />
            {/* Contacts list */}
            <circle cx="20" cy="28" r="4" fill="#a855f7" />
            <rect x="27" y="26" width="16" height="3" rx="1" fill="#ffffff" />
            <circle cx="20" cy="42" r="4" fill="#10b981" />
            <rect x="27" y="40" width="16" height="3" rx="1" fill="#ffffff" />
            <circle cx="20" cy="56" r="4" fill="#c084fc" />
            <rect x="27" y="54" width="16" height="3" rx="1" fill="#ffffff" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}

