import { motion } from 'framer-motion';

export default function GiantEye({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer cyber ring */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full text-[#38bdf8]/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.2" />
        <path d="M 50 2 L 50 6 M 50 94 L 50 98 M 2 50 L 6 50 M 94 50 L 98 50" stroke="currentColor" strokeWidth="1" />
      </motion.svg>

      {/* Inner tech ring rotating opposite */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full text-[#0284c7]/30"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 2 2 2" />
      </motion.svg>

      {/* The Eye Shape */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
        <motion.path
          d="M 10 50 Q 50 20 90 50 Q 50 80 10 50 Z"
          fill="none"
          stroke="url(#eyeGrad)"
          strokeWidth="1.5"
          initial={{ d: "M 10 50 Q 50 48 90 50 Q 50 52 10 50 Z" }}
          animate={{ d: "M 10 50 Q 50 20 90 50 Q 50 80 10 50 Z" }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
        />
        <defs>
          <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
      </svg>

      {/* The Iris / Pupil */}
      <motion.div
        className="relative z-10 rounded-full border border-[#38bdf8] bg-[#0284c7]/20 backdrop-blur-sm shadow-[0_0_20px_rgba(56,189,248,0.6)] flex items-center justify-center"
        style={{ width: '32%', height: '32%' }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Core pupil */}
        <div className="w-1/3 h-1/3 rounded-full bg-[#38bdf8] shadow-[0_0_10px_#fff]" />
        {/* Tech crosshair in pupil */}
        <div className="absolute inset-0 w-full h-full border border-[#0284c7]/50 rounded-full" />
        <div className="absolute w-full h-[1px] bg-[#38bdf8]/40" />
        <div className="absolute h-full w-[1px] bg-[#38bdf8]/40" />
      </motion.div>
    </div>
  );
}
