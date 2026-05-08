import React from 'react';
import { motion } from 'framer-motion';

/**
 * Glossy 3D-style game pawn
 * Responds to position and has shadow/depth effects
 */
export default function Pawn({ color, position, isMoving = false, label = 'P1' }) {
  // Pawn color classes
  const colorMap = {
    pink: 'from-pink-400 to-pink-600',
    purple: 'from-purple-400 to-purple-600',
    blue: 'from-blue-400 to-blue-600',
    teal: 'from-teal-400 to-teal-600',
    gold: 'from-amber-300 to-amber-600',
    coral: 'from-rose-400 to-rose-600',
  };

  const shadowMap = {
    pink: 'shadow-pink-500/70',
    purple: 'shadow-purple-500/70',
    blue: 'shadow-blue-500/70',
    teal: 'shadow-cyan-500/70',
    gold: 'shadow-amber-500/70',
    coral: 'shadow-rose-500/70',
  };

  return (
    <motion.div
      className="absolute z-40 pointer-events-none"
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 25,
        duration: isMoving ? 0.4 : 0,
      }}
    >
      {/* Shadow / Depth indicator */}
      <motion.div
        className="absolute -bottom-2 left-1/2 w-8 h-1 bg-black/20 rounded-full blur-md"
        style={{ transform: 'translateX(-50%)' }}
        animate={{
          scaleX: isMoving ? 0.8 : 1,
          opacity: isMoving ? 0.5 : 0.7,
        }}
      />

      {/* Main pawn body */}
      <motion.div
        className={`relative w-10 h-10 rounded-full bg-gradient-to-br ${colorMap[color] || colorMap.purple} ${shadowMap[color] || shadowMap.purple} shadow-2xl border-2 border-white/40 flex items-center justify-center cursor-pointer`}
        animate={{
          y: isMoving ? -8 : 0,
          boxShadow: isMoving
            ? `0 20px 40px ${color === 'gold' ? 'rgba(217,119,6,0.6)' : 'rgba(0,0,0,0.5)'}`
            : `0 10px 20px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Glossy highlight */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white/60 blur-xs" />

        {/* Player label */}
        <span className="text-xs font-bold text-white drop-shadow-lg">{label}</span>
      </motion.div>

      {/* Glow ring (only when moving) */}
      {isMoving && (
        <motion.div
          className={`absolute inset-0 rounded-full border-2 ${
            {
              pink: 'border-pink-400',
              purple: 'border-purple-400',
              blue: 'border-blue-400',
              teal: 'border-cyan-400',
              gold: 'border-amber-300',
              coral: 'border-rose-400',
            }[color]
          }`}
          animate={{
            scale: [1, 1.5],
            opacity: [1, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
}