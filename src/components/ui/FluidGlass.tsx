import React, { useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface FluidGlassProps {
  children?: React.ReactNode;
  mode?: string;
}

/**
 * FluidGlass (High-Fidelity "Ribbed" CSS Version)
 * Replicates the complex cylindrical depth from the reference without Three.js.
 */
export default function FluidGlass({ children }: FluidGlassProps) {
  const bars = useMemo(() => Array.from({ length: 18 }), []);
  
  const mouseX = useMotionValue(0);
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX } = e;
    mouseX.set(clientX);
  };

  return (
    <div 
      className="relative isolate min-h-screen bg-[#020205] overflow-x-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* --- RIBBED BACKGROUND --- */}
      <div className="fixed inset-0 -z-10 flex overflow-hidden pointer-events-none">
        {bars.map((_, i) => {
          // Subtle movement for each bar
          return (
            <motion.div
              key={i}
              className="h-full flex-1 relative border-r border-white/5"
              style={{
                // Creating the cylindrical "ribbed" effect with multiple color stops
                background: `linear-gradient(90deg, 
                  rgba(0,0,0,1) 0%, 
                  rgba(0,10,80,1) 5%, 
                  rgba(0,30,200,1) 50%, 
                  rgba(0,10,80,1) 95%, 
                  rgba(0,0,0,1) 100%
                )`,
              }}
            >
              {/* Highlight overlay that follows mouse with a delay per bar */}
              <BarHighlight index={i} mouseX={mouseX} />
            </motion.div>
          );
        })}
      </div>

      {/* Vignette / Depth */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      
      {/* Subtle Scanlines or Noise */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

function BarHighlight({ index, mouseX }: { index: number, mouseX: any }) {
  const springConfig = { damping: 20, stiffness: 100 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  
  // Each bar's range
  const barWidth = typeof window !== 'undefined' ? window.innerWidth / 18 : 100;
  const barCenter = (index + 0.5) * barWidth;
  
  const opacity = useTransform(smoothMouseX, (latest) => {
    const dist = Math.abs(latest - barCenter);
    const range = 300; // Glow range
    return Math.max(0, 1 - dist / range) * 0.4;
  });

  return (
    <motion.div 
      className="absolute inset-0 z-0 bg-blue-400/20 blur-xl"
      style={{ opacity }}
    />
  );
}
