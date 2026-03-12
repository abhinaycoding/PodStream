import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface FluidGlassProps {
  children?: React.ReactNode;
  mode?: string;
}

/**
 * FluidGlass (Stable CSS Version)
 * Replaces the unstable R3F/Drei implementation with high-performance CSS/Framer Motion.
 * This ensures the 'reading S' error never returns.
 */
export default function FluidGlass({ children }: FluidGlassProps) {
  // Generate 16 vertical bars for the background effect
  const bars = useMemo(() => Array.from({ length: 16 }), []);

  return (
    <div className="relative isolate min-h-screen bg-black overflow-x-hidden">
      {/* --- STABLE CSS BACKGROUND --- */}
      <div className="fixed inset-0 -z-10 flex overflow-hidden pointer-events-none">
        {bars.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              backgroundPosition: ['0% 0%', '0% 100%', '0% 0%']
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.1
            }}
            className="h-full flex-1 border-r border-white/5 relative"
            style={{
              background: `linear-gradient(to bottom, 
                ${i % 2 === 0 ? 'rgba(0, 21, 179, 0.8)' : 'rgba(0, 15, 120, 0.9)'} 0%, 
                rgba(0, 0, 0, 1) 100%
              )`,
              backgroundSize: '100% 200%',
              // Simulating the depth found in the screenshot
              boxShadow: i % 2 === 0 ? 'inset -1px 0 10px rgba(0,0,0,0.5)' : 'none'
            }}
          >
            {/* Subtle glow stripe */}
            <div className="absolute inset-y-0 left-0 w-[1px] bg-blue-400/20 blur-[1px]" />
          </motion.div>
        ))}
        
        {/* Overall grain/noise overlay for depth */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
