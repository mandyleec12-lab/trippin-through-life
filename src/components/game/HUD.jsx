import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Zap, Heart } from 'lucide-react';

/**
 * Game HUD overlay - shows player stats
 * Money, burnout, position, path info
 */
export default function HUD({ money, burnout, position, pathName, turn, inChaosRealm }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none">
      {/* Top bar */}
      <motion.div
        className={`backdrop-blur-md bg-black/40 border-b-2 transition-colors duration-500 ${
          inChaosRealm ? 'border-red-500/50' : 'border-purple-500/50'
        }`}
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Left: Money & Burnout */}
          <div className="flex gap-8">
            {/* Money */}
            <motion.div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: money < 0 ? [1, 1.1, 1] : 1 }}
                transition={{ duration: money < 0 ? 0.5 : 0 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  money < 0 ? 'bg-red-900/50' : 'bg-green-900/50'
                }`}
              >
                <DollarSign className={`w-5 h-5 ${money < 0 ? 'text-red-400' : 'text-green-400'}`} />
                <span className={`font-bold text-lg ${money < 0 ? 'text-red-300' : 'text-green-300'}`}>
                  ${Math.round(money)}
                </span>
              </motion.div>
            </motion.div>

            {/* Burnout */}
            <motion.div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-900/50">
                <Zap className="w-5 h-5 text-orange-400" />
                <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full transition-all ${
                      burnout > 0.7
                        ? 'bg-red-500'
                        : burnout > 0.4
                          ? 'bg-orange-500'
                          : 'bg-yellow-500'
                    }`}
                    animate={{ width: `${Math.min(burnout * 100, 100)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Center: Path & Position */}
          <motion.div className="text-center text-white">
            <p className="text-sm text-slate-400">Turn {turn}</p>
            <p className="font-bold text-lg">{pathName}</p>
            <p className="text-xs text-slate-400">Tile {Math.floor(position)}/30</p>
          </motion.div>

          {/* Right: Status */}
          <motion.div className="flex items-center gap-4">
            {inChaosRealm ? (
              <motion.div
                className="px-4 py-2 rounded-lg bg-red-900/60 border-2 border-red-500"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="font-bold text-red-400 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Chaos Realm
                </p>
              </motion.div>
            ) : (
              <div className="px-4 py-2 rounded-lg bg-emerald-900/60 border-2 border-emerald-500">
                <p className="font-bold text-emerald-400 text-sm">Normal Mode</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}