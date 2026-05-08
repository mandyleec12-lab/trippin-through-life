import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LIFE_PATHS } from '@/lib/gameData';

/**
 * Path selection screen at game start
 * Player chooses their life path
 */
export default function PathSelection({ onSelectPath }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-400 opacity-20"
            animate={{
              x: Math.sin(i) * 100,
              y: Math.cos(i) * 100,
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 4 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
            style={{
              left: `${20 + i * 4}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">Trippin' Through Life</h1>
          <p className="text-xl text-purple-300 mb-8">Choose your path. Shape your destiny.</p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-slate-400 text-center mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Each path has different rewards, risks, and consequences. Higher income paths bring more pressure
          and burnout. Lower income paths have survival struggles. There's no "easy" way.
        </motion.p>

        {/* Path options */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {LIFE_PATHS.map((path, idx) => (
            <PathCard
              key={path.id}
              path={path}
              index={idx}
              onSelect={() => onSelectPath(path.id)}
            />
          ))}
        </motion.div>

        {/* Game info */}
        <motion.div
          className="text-slate-400 text-sm space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>💫 Roll the dice and move tile by tile through life</p>
          <p>🎯 Make choices that shape who you become</p>
          <p>⚡ Watch out for the Chaos Realm when things fall apart</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

function PathCard({ path, index, onSelect }) {
  return (
    <motion.button
      onClick={onSelect}
      className={`group relative p-6 rounded-xl border-2 overflow-hidden transition-all hover:scale-105 active:scale-95 ${path.color}`}
      style={{
        borderColor: 'currentColor',
        background: path.bgColor,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      whileHover={{ boxShadow: `0 0 40px rgba(139, 92, 246, 0.5)` }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="relative z-10 text-left text-white">
        <div className="text-4xl mb-2">{path.emoji}</div>
        <h3 className="text-2xl font-bold mb-2">{path.name}</h3>
        <p className="text-sm text-slate-200 mb-4">{path.description}</p>

        {/* Stats hint */}
        <div className="flex gap-4 text-xs text-slate-300 mb-4 border-t border-white/20 pt-3">
          <div>💼 Income: {index === 0 ? 'Very High' : index === 3 ? 'Variable' : index === 1 ? 'Moderate' : 'Low'}</div>
          <div>⚙️ Pressure: {index === 0 || index === 3 ? 'High' : 'Moderate'}</div>
        </div>

        {/* Button */}
        <div className="font-bold text-sm group-hover:translate-x-1 transition-transform">
          Choose This Path →
        </div>
      </div>
    </motion.button>
  );
}