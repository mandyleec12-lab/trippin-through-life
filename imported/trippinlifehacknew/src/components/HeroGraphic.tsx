import React from 'react';
import { motion } from 'framer-motion';
import { GlitterHeart } from './GlitterHeart';
export function HeroGraphic() {
  const orbitRadius = 220;
  const orbitDuration = 40;
  const orbitItems = [{
    angle: 0,
    element: 'plane'
  }, {
    angle: 60,
    element: 'heart1'
  }, {
    angle: 120,
    element: 'lipstick'
  }, {
    angle: 180,
    element: 'selfcare'
  }, {
    angle: 240,
    element: 'heart2'
  }, {
    angle: 300,
    element: 'selflove'
  }];
  return <div className="relative w-full h-full flex items-center justify-center">
      {/* Soft background glow blobs */}
      <div className="absolute w-[500px] h-[500px] bg-blush-300/30 rounded-full blur-[100px] -translate-x-10 -translate-y-10" />
      <div className="absolute w-[450px] h-[450px] bg-lavender-300/20 rounded-full blur-[80px] translate-x-10 translate-y-10" />

      {/* Orbit ring (subtle) */}
      <div className="absolute rounded-full border border-blush-200/20" style={{
      width: orbitRadius * 2,
      height: orbitRadius * 2
    }} />
      

      {/* Main Center Heart - BIG */}
      <motion.div animate={{
      scale: [1, 1.03, 1]
    }} transition={{
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut'
    }} className="relative z-20">
        
        <GlitterHeart size={320} className="drop-shadow-2xl filter" />
      </motion.div>

      {/* Orbiting Elements */}
      <motion.div animate={{
      rotate: 360
    }} transition={{
      duration: orbitDuration,
      repeat: Infinity,
      ease: 'linear'
    }} className="absolute z-30" style={{
      width: orbitRadius * 2,
      height: orbitRadius * 2
    }}>
        
        {orbitItems.map((item, i) => {
        const rad = item.angle * Math.PI / 180;
        const x = Math.cos(rad) * orbitRadius + orbitRadius;
        const y = Math.sin(rad) * orbitRadius + orbitRadius;
        return <motion.div key={i} className="absolute flex items-center justify-center" style={{
          left: x - 24,
          top: y - 24,
          width: 48,
          height: 48
        }} animate={{
          rotate: -360
        }} transition={{
          duration: orbitDuration,
          repeat: Infinity,
          ease: 'linear'
        }}>
              
              {/* Realistic Plane */}
              {item.element === 'plane' && <svg width="48" height="48" viewBox="0 0 64 64" className="drop-shadow-xl">
                
                  <defs>
                    <linearGradient id="planeFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    
                      <stop offset="0%" stopColor="#6B7280" />
                      <stop offset="100%" stopColor="#9CA3AF" />
                    </linearGradient>
                  </defs>
                  {/* Fuselage */}
                  <ellipse cx="32" cy="32" rx="22" ry="6" fill="url(#planeFill)" transform="rotate(-35 32 32)" />
                
                  {/* Main wings */}
                  <path d="M22 28 L8 18 C6 17, 6 15, 8 15 L28 24 Z" fill="#6B7280" />
                
                  <path d="M38 36 L52 46 C54 47, 54 49, 52 49 L34 40 Z" fill="#9CA3AF" />
                
                  {/* Tail */}
                  <path d="M14 34 L8 40 C7 41, 7 43, 9 42 L18 37 Z" fill="#6B7280" />
                
                  {/* Cockpit */}
                  <ellipse cx="46" cy="24" rx="5" ry="3" fill="#93C5FD" opacity="0.7" transform="rotate(-35 46 24)" />
                
                  {/* Window line */}
                  <line x1="26" y1="28" x2="40" y2="24" stroke="white" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
                
                  {/* Engine glow */}
                  <circle cx="12" cy="36" r="2.5" fill="#93C5FD" opacity="0.5" />
                
                </svg>}

              {/* Lipstick */}
              {item.element === 'lipstick' && <svg width="38" height="38" viewBox="0 0 100 100" className="drop-shadow-lg">
                
                  <defs>
                    <linearGradient id="goldG2" x1="0%" y1="0%" x2="100%" y2="0%">
                    
                      <stop offset="0%" stopColor="#E6C27A" />
                      <stop offset="50%" stopColor="#FCEECA" />
                      <stop offset="100%" stopColor="#D4AF37" />
                    </linearGradient>
                    <linearGradient id="lipG2" x1="0%" y1="0%" x2="100%" y2="0%">
                    
                      <stop offset="0%" stopColor="#D63384" />
                      <stop offset="50%" stopColor="#FF8CB8" />
                      <stop offset="100%" stopColor="#A81B5E" />
                    </linearGradient>
                  </defs>
                  <rect x="35" y="55" width="30" height="35" rx="4" fill="#FFE8F1" />
                
                  <rect x="33" y="50" width="34" height="6" rx="2" fill="url(#goldG2)" />
                
                  <rect x="38" y="35" width="24" height="15" fill="url(#goldG2)" />
                
                  <path d="M40 35 L40 20 C40 15, 45 10, 55 15 L60 20 L60 35 Z" fill="url(#lipG2)" />
                
                  <path d="M43 35 L43 22 C43 18, 46 15, 48 17 L48 35 Z" fill="white" opacity="0.4" />
                
                </svg>}

              {/* Orbiting hearts */}
              {item.element === 'heart1' && <GlitterHeart size={32} variant="light" />}
              {item.element === 'heart2' && <GlitterHeart size={26} />}

              {/* "Self Care" text badge */}
              {item.element === 'selfcare' && <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-blush-200/50 whitespace-nowrap">
                  <span className="text-xs font-bold text-cta-500 tracking-wide">
                    self care ✨
                  </span>
                </div>}

              {/* "Self Love" text badge */}
              {item.element === 'selflove' && <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-blush-200/50 whitespace-nowrap">
                  <span className="text-xs font-bold text-plum-600 tracking-wide">
                    self love 💕
                  </span>
                </div>}
            </motion.div>;
      })}
      </motion.div>

      {/* Extra floating accent hearts */}
      <motion.div animate={{
      y: [-5, 5, -5],
      rotate: [-5, 5, -5]
    }} transition={{
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: 0.5
    }} className="absolute top-[10%] left-[15%] z-10">
        
        <GlitterHeart size={24} variant="light" className="opacity-60" />
      </motion.div>
      <motion.div animate={{
      y: [5, -5, 5],
      rotate: [5, -5, 5]
    }} transition={{
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: 2
    }} className="absolute bottom-[12%] right-[15%] z-10">
        
        <GlitterHeart size={20} className="opacity-50" />
      </motion.div>
      <motion.div animate={{
      y: [-3, 3, -3]
    }} transition={{
      duration: 3.5,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: 1
    }} className="absolute top-[18%] right-[22%] z-10">
        
        <GlitterHeart size={16} variant="light" className="opacity-40" />
      </motion.div>
    </div>;
}