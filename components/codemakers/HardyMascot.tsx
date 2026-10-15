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
      animate={{ y: [-5, 5, -5] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_20px_50px_rgba(124,58,237,0.55)]"
      >
        <defs>
          {/* ── 3D VOLUMETRIC GRADIENTS (TESLA / OBSIDIAN / CYBERNETIC) ── */}
          <radialGradient id="helmetShell3D" cx="35%" cy="25%" r="75%">
            <stop offset="0%" stopColor="#4c1d95" />
            <stop offset="35%" stopColor="#2e1065" />
            <stop offset="70%" stopColor="#150a2e" />
            <stop offset="100%" stopColor="#080314" />
          </radialGradient>

          <radialGradient id="visorGlass3D" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#1e1038" />
            <stop offset="50%" stopColor="#120626" />
            <stop offset="85%" stopColor="#080214" />
            <stop offset="100%" stopColor="#020008" />
          </radialGradient>

          <linearGradient id="cyberArmorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2e1065" />
            <stop offset="30%" stopColor="#170933" />
            <stop offset="70%" stopColor="#0e051f" />
            <stop offset="100%" stopColor="#070210" />
          </linearGradient>

          <linearGradient id="neonVioletGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f3e8ff" />
            <stop offset="30%" stopColor="#c084fc" />
            <stop offset="70%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>

          <linearGradient id="titaniumRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="25%" stopColor="rgba(192,132,252,0.4)" />
            <stop offset="70%" stopColor="rgba(124,58,237,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>

          <radialGradient id="plasmaIonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="40%" stopColor="#c084fc" />
            <stop offset="75%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <filter id="cyberGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="hudBloom" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── BACKGROUND ORBITAL TELEMETRY RINGS ── */}
        <g opacity="0.35">
          <circle cx="160" cy="160" r="145" fill="none" stroke="url(#neonVioletGlow)" strokeWidth="1" strokeDasharray="6 12" />
          <circle cx="160" cy="160" r="130" fill="none" stroke="#7c3aed" strokeWidth="0.5" />
          <path d="M160 10V25M160 295V310M10 160H25M295 160H310" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* ── ANTI-GRAVITY IONIC THRUSTERS (BASE) ── */}
        <g opacity="0.9">
          <ellipse cx="160" cy="285" rx="42" ry="8" fill="url(#plasmaIonGlow)" opacity="0.7" />
          <path d="M142 258L132 280H188L178 258H142Z" fill="url(#cyberArmorGrad)" stroke="#7c3aed" strokeWidth="1.5" />
          <ellipse cx="160" cy="278" rx="20" ry="4.5" fill="#c084fc" filter="url(#hudBloom)" />
        </g>

        {/* ── CHEST & SHOULDER TESLA ARMOR (CYBER PILOT SUIT) ── */}
        {/* Left Shoulder Plate */}
        <path
          d="M75 220L95 195L125 210L115 255L80 245Z"
          fill="url(#cyberArmorGrad)"
          stroke="#7c3aed"
          strokeWidth="2"
        />
        <path d="M85 222L110 215" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

        {/* Right Shoulder Plate */}
        <path
          d="M245 220L225 195L195 210L205 255L240 245Z"
          fill="url(#cyberArmorGrad)"
          stroke="#7c3aed"
          strokeWidth="2"
        />
        <path d="M235 222L210 215" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

        {/* Central Torso Shell */}
        <path
          d="M105 195L160 178L215 195L210 262L160 274L110 262Z"
          fill="url(#cyberArmorGrad)"
          stroke="url(#titaniumRim)"
          strokeWidth="2.5"
        />

        {/* Torso Ergonomic Grooves */}
        <path d="M130 215L160 224L190 215" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M135 235L160 244L185 235" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

        {/* Chest Reactor Core: Diamond Shield <H> */}
        <g transform="translate(142, 212)">
          <path
            d="M18 0L36 18L18 36L0 18Z"
            fill="#120626"
            stroke="url(#neonVioletGlow)"
            strokeWidth="2"
            filter="url(#cyberGlowFilter)"
          />
          <path
            d="M13 11V25M23 11V25M13 18H23"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* ── AERODYNAMIC HELMET (3D VOLUMETRIC OBSIDIAN SPHERE) ── */}
        <ellipse
          cx="160"
          cy="125"
          rx="78"
          ry="72"
          fill="url(#helmetShell3D)"
          stroke="url(#titaniumRim)"
          strokeWidth="3"
        />

        {/* Specular curved helmet edge reflection */}
        <path
          d="M108 85C122 70 150 64 175 64C200 64 218 72 226 84"
          stroke="url(#titaniumRim)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Cyber Ear Pods / Antenna Nodes */}
        {/* Left Pod */}
        <rect x="74" y="105" width="16" height="42" rx="8" fill="#1b0c34" stroke="#a855f7" strokeWidth="2" />
        <circle cx="82" cy="126" r="4.5" fill="#c084fc" filter="url(#hudBloom)" />
        <path d="M78 85L82 105" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />

        {/* Right Pod */}
        <rect x="230" y="105" width="16" height="42" rx="8" fill="#1b0c34" stroke="#a855f7" strokeWidth="2" />
        <circle cx="238" cy="126" r="4.5" fill="#c084fc" filter="url(#hudBloom)" />
        <path d="M242 85L238 105" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />

        {/* ── PANORAMIC TESLA VISOR (CURVED TEMPERED GLASS) ── */}
        <path
          d="M96 112C96 92 124 82 160 82C196 82 224 92 224 112C224 138 202 158 160 158C118 158 96 138 96 112Z"
          fill="url(#visorGlass3D)"
          stroke="url(#neonVioletGlow)"
          strokeWidth="2.5"
          filter="url(#cyberGlowFilter)"
        />

        {/* Visor Glass Flare Arc */}
        <path
          d="M112 95C126 88 148 85 170 85C192 85 208 88 214 93"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* ── HOLOGRAPHIC HUD SENSORS / DYNAMIC VISOR DISPLAY ── */}
        {variant === "radar" && (
          <g filter="url(#hudBloom)">
            {/* Left Radar Reticle */}
            <circle cx="132" cy="116" r="14" fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="132" cy="116" r="4.5" fill="#ffffff" />
            <line x1="132" y1="98" x2="132" y2="134" stroke="#c084fc" strokeWidth="1" />
            <line x1="114" y1="116" x2="150" y2="116" stroke="#c084fc" strokeWidth="1" />

            {/* Right Radar Reticle */}
            <circle cx="188" cy="116" r="14" fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="188" cy="116" r="4.5" fill="#ffffff" />
            <line x1="188" y1="98" x2="188" y2="134" stroke="#c084fc" strokeWidth="1" />
            <line x1="170" y1="116" x2="206" y2="116" stroke="#c084fc" strokeWidth="1" />

            {/* Telemetry Target Wave */}
            <path d="M148 138Q160 144 172 138" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {variant === "crm" && (
          <g filter="url(#hudBloom)">
            {/* Confident Operator Visor HUD */}
            <path d="M120 120Q132 108 144 120" stroke="#c084fc" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M176 120Q188 108 200 120" stroke="#c084fc" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <rect x="150" y="132" width="20" height="3" rx="1.5" fill="#10b981" />
          </g>
        )}

        {variant === "sales" && (
          <g filter="url(#hudBloom)">
            {/* Bullish Exponential Lenses */}
            <circle cx="132" cy="116" r="8" fill="#c084fc" />
            <path d="M132 104V128M120 116H144" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="188" cy="116" r="8" fill="#c084fc" />
            <path d="M188 104V128M176 116H200" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M150 136Q160 144 170 136" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        )}

        {variant === "design" && (
          <g filter="url(#hudBloom)">
            {/* Creative Precision Apertures */}
            <rect x="122" y="106" width="20" height="20" rx="6" fill="#a855f7" />
            <rect x="126" y="110" width="10" height="10" rx="3" fill="#ffffff" />
            <rect x="178" y="106" width="20" height="20" rx="6" fill="#a855f7" />
            <rect x="182" y="110" width="10" height="10" rx="3" fill="#ffffff" />
          </g>
        )}

        {variant === "prompts" && (
          <g filter="url(#hudBloom)">
            {/* AI Code Brackets Eyes < > */}
            <path d="M138 108L126 116L138 124" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M182 108L194 116L182 124" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="160" cy="134" r="3" fill="#c084fc" />
          </g>
        )}

        {variant === "member" && (
          <g filter="url(#hudBloom)">
            {/* Executive Star Sensors */}
            <ellipse cx="132" cy="116" rx="9" ry="11" fill="#c084fc" />
            <circle cx="135" cy="112" r="3.5" fill="#ffffff" />
            <ellipse cx="188" cy="116" rx="9" ry="11" fill="#c084fc" />
            <circle cx="191" cy="112" r="3.5" fill="#ffffff" />
            <path d="M150 138Q160 144 170 138" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {variant === "client" && (
          <g filter="url(#hudBloom)">
            {/* Focused Observant Lenses */}
            <circle cx="132" cy="116" r="10" fill="#c084fc" />
            <circle cx="135" cy="113" r="4" fill="#ffffff" />
            <circle cx="188" cy="116" r="10" fill="#c084fc" />
            <circle cx="191" cy="113" r="4" fill="#ffffff" />
          </g>
        )}

        {/* ── 3D FLOATING HOLOGRAPHIC ACCESSORY ACCORDING TO VARIANT ── */}
        {variant === "radar" && (
          <g transform="translate(205, 120)" filter="url(#cyberGlowFilter)">
            {/* Floating 3D Spherical Satellite Scanner */}
            <circle cx="50" cy="50" r="40" fill="rgba(76,29,149,0.3)" stroke="#c084fc" strokeWidth="2" strokeDasharray="5 5" />
            <ellipse cx="50" cy="50" rx="38" ry="14" fill="none" stroke="#a855f7" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="7" fill="#ffffff" />
            <path d="M50 50L75 25" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="75" cy="25" r="4" fill="#a855f7" />
            <circle cx="35" cy="40" r="3" fill="#c084fc" />
            <circle cx="68" cy="62" r="3.5" fill="#38bdf8" />
          </g>
        )}

        {variant === "crm" && (
          <g transform="translate(195, 110)" filter="url(#cyberGlowFilter)">
            {/* 3D Floating Glass Kanban Columns */}
            <rect x="15" y="12" width="46" height="28" rx="8" fill="#240e4f" stroke="#c084fc" strokeWidth="1.5" />
            <rect x="22" y="19" width="24" height="4" rx="2" fill="#ffffff" />
            <rect x="22" y="27" width="14" height="3" rx="1.5" fill="#c084fc" />

            <rect x="30" y="46" width="50" height="32" rx="8" fill="#120626" stroke="#10b981" strokeWidth="1.5" />
            <rect x="38" y="54" width="28" height="4" rx="2" fill="#10b981" />
            <rect x="38" y="62" width="16" height="3" rx="1.5" fill="#ffffff" />
          </g>
        )}

        {variant === "design" && (
          <g transform="translate(190, 105)" filter="url(#cyberGlowFilter)">
            {/* Floating 3D Creative Glass Canvas */}
            <rect x="15" y="10" width="65" height="75" rx="12" fill="#170933" stroke="#a855f7" strokeWidth="2" />
            <circle cx="32" cy="28" r="6" fill="#7c3aed" />
            <circle cx="48" cy="28" r="6" fill="#c084fc" />
            <circle cx="64" cy="28" r="6" fill="#ffffff" />
            <rect x="26" y="42" width="44" height="18" rx="4" fill="#2e1065" />
            <rect x="26" y="66" width="20" height="8" rx="2" fill="#a855f7" />
            <rect x="50" y="66" width="20" height="8" rx="2" fill="#ffffff" />
          </g>
        )}

        {variant === "prompts" && (
          <g transform="translate(185, 105)" filter="url(#cyberGlowFilter)">
            {/* Tesla AI Neural Prompt Hologram */}
            <rect x="15" y="18" width="70" height="32" rx="16" fill="#3b0764" stroke="#c084fc" strokeWidth="2" />
            <text x="27" y="38" fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="bold">PROMPT</text>
            <path d="M85 12L88 18L94 21L88 24L85 30L82 24L76 21L82 18Z" fill="#c084fc" />
          </g>
        )}

        {variant === "sales" && (
          <g transform="translate(195, 110)" filter="url(#cyberGlowFilter)">
            {/* Profit Hologram with Exponential Curve */}
            <rect x="12" y="12" width="60" height="72" rx="10" fill="#0d041c" stroke="#a855f7" strokeWidth="2" />
            <path d="M20 64L32 50L44 56L62 26" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="62" cy="26" r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
            <path d="M54 24H64V34" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}

        {variant === "member" && (
          <g transform="translate(180, 115)" filter="url(#cyberGlowFilter)">
            {/* Titanium Tesla VIP Member Card */}
            <rect x="10" y="10" width="76" height="48" rx="8" fill="#0b0318" stroke="#a855f7" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="6" fill="#f59e0b" />
            <rect x="20" y="40" width="32" height="4" rx="2" fill="#c084fc" />
            <text x="48" y="27" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">&lt;H&gt; VIP</text>
          </g>
        )}

        {variant === "client" && (
          <g transform="translate(198, 110)" filter="url(#cyberGlowFilter)">
            {/* Cyber Phone / Holographic Desk */}
            <rect x="10" y="10" width="44" height="72" rx="10" fill="#0a0316" stroke="#a855f7" strokeWidth="2" />
            <rect x="22" y="15" width="20" height="3" rx="1.5" fill="#7c3aed" />
            <circle cx="22" cy="30" r="4.5" fill="#a855f7" />
            <rect x="30" y="28" width="18" height="4" rx="2" fill="#ffffff" />
            <circle cx="22" cy="46" r="4.5" fill="#10b981" />
            <rect x="30" y="44" width="18" height="4" rx="2" fill="#ffffff" />
            <circle cx="22" cy="62" r="4.5" fill="#c084fc" />
            <rect x="30" y="60" width="18" height="4" rx="2" fill="#ffffff" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}
