import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlitterHeart } from './GlitterHeart';
const quotes = ["You didn't fall apart… you rebuilt differently.", 'You survived what was meant to break you. I see you!!', "Broken wasn't your ending — it was your beginning.", 'This version of you? Hard earned.', "You didn't heal quietly — and you weren't meant to.", 'You outgrew the version of you that settled. Reach for the stars!!', "You're not too much — you're just not for everyone. Screw em!", "You don't chase anymore — you choose. And I am proud of you!", 'Peace looks better on you.', 'You stopped shrinking to make others comfortable. I see you!', "You don't beg for what you deserve anymore. Great Job!!", "Healing isn't pretty, but it's worth it — and you're doing it.", 'Some days you thrive. Some days you survive. Both count.', "You're still figuring it out — and that's okay.", 'Growth looks messy before it looks beautiful — stay with it.', 'Every step you take forward counts.', "You're allowed to start over as many times as you need.", "You didn't quit — you adjusted.", "You're doing better than you think.", "You deserve the life you're building.", 'You are worthy of the things you want.', 'You stopped settling for almost.', 'You are enough — even on your worst days.', "The right life won't require you to shrink.", 'You stopped abandoning yourself.', 'You matter too.', "Loving yourself will change everything — and it's already starting.", 'You are no longer an option — you are a priority.', "You're allowed to take up space.", "You didn't come this far just to doubt yourself now.", "You've already survived the hardest parts — it's time to start living like you believe that.", "Stop shrinking yourself to make other people comfortable. You weren't made to be easy to handle — you were made to be unforgettable.", "You don't need permission to change your life. You just need one moment where you decide you deserve better — and don't look back.", "You are not behind — you're building a vision no one else sees yet. Stay focused. They'll understand later."];
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
function GlitterParticles() {
  const particles = useMemo(() => {
    return Array.from({
      length: 30
    }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 4,
      duration: Math.random() * 2 + 1
    }));
  }, []);
  return <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes glitter-twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
      {particles.map((p) => <div key={p.id} className="absolute rounded-full bg-white" style={{
      left: p.left,
      top: p.top,
      width: p.size,
      height: p.size,
      animation: `glitter-twinkle ${p.duration}s ${p.delay}s ease-in-out infinite`,
      boxShadow: '0 0 3px rgba(255,255,255,0.8)'
    }} />)}
    </div>;
}
export function SplitFlapQuote() {
  const [shuffledQuotes] = useState(() => shuffleArray(quotes));
  const [currentIndex, setCurrentIndex] = useState(0);
  const advanceQuote = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % shuffledQuotes.length);
  }, [shuffledQuotes.length]);
  useEffect(() => {
    const interval = setInterval(advanceQuote, 7000);
    return () => clearInterval(interval);
  }, [advanceQuote]);
  const currentQuote = shuffledQuotes[currentIndex];
  return <div className="w-full bg-gradient-to-r from-cta-500 via-[#D63385] to-cta-500 relative overflow-hidden">
      {/* Glitter particles */}
      <GlitterParticles />

      {/* Animated shimmer */}
      <div className="absolute inset-0 opacity-20" style={{
      background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 3s ease-in-out infinite'
    }} />
      

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-3 relative z-10">
        <div className="flex items-center justify-center gap-3" style={{
        perspective: '600px'
      }}>
          
          <GlitterHeart size={18} variant="light" className="hidden sm:block" />

          <div className="overflow-hidden min-h-[1.6rem] sm:min-h-[1.8rem] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p key={currentIndex} initial={{
              rotateX: -80,
              opacity: 0,
              y: 8
            }} animate={{
              rotateX: 0,
              opacity: 1,
              y: 0
            }} exit={{
              rotateX: 80,
              opacity: 0,
              y: -8
            }} transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1]
            }} className="text-white text-sm sm:text-base md:text-lg font-bold text-center tracking-wide leading-snug" style={{
              transformOrigin: 'center center',
              fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
              textShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}>
                
                {currentQuote}
              </motion.p>
            </AnimatePresence>
          </div>

          <GlitterHeart size={18} variant="light" className="hidden sm:block" />
        </div>
      </div>
    </div>;
}