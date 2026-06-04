import React from 'react';
import { motion } from 'framer-motion';
import { getLifeSummary } from './LifeCrossroadsModal';

const PLAYER_COLORS = {
  pink: 'bg-pink-500',
  purple: 'bg-purple-500',
  blue: 'bg-blue-500',
  teal: 'bg-teal-500',
  gold: 'bg-amber-400',
  coral: 'bg-rose-400'
};

export default function WinnerScreen({ winner, players, onPlayAgain }) {
  const summary = winner && winner.crossroadsDecisions?.length > 0
    ? getLifeSummary(winner.crossroadsDecisions)
    : null;

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 z-10 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div key={i} className="absolute rounded-full bg-white/10"
            style={{ width: 4 + Math.random() * 8, height: 4 + Math.random() * 8, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -40, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }} />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        className="relative w-full max-w-2xl">

        {/* Title */}
        <div className="text-center mb-6">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <span className="text-7xl">🏆</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white mt-3 drop-shadow-lg"
            style={{ fontFamily: '"Dancing Script", cursive' }}>
            Congratulations!
          </h1>
          <p className="text-pink-200 font-bold text-lg mt-1">{winner?.name} won Trippin' Through Life!</p>
        </div>

        {/* Life Summary Archetype */}
        {summary && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mb-5 rounded-3xl border border-purple-400/30 bg-white/10 backdrop-blur-md p-5 text-center">
            <p className="text-purple-200/70 text-[10px] font-black uppercase tracking-widest mb-2">Your Life Story</p>
            <div className="text-5xl mb-2">{summary.emoji}</div>
            <h2 className="text-white font-black text-2xl">{summary.label}</h2>
            <p className="text-white/70 text-sm font-semibold mt-1">{summary.desc}</p>
          </motion.div>
        )}

        {/* Crossroads decisions recap */}
        {winner?.crossroadsDecisions?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mb-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
            <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-3 text-center">Your Crossroads Choices</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {winner.crossroadsDecisions.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-purple-300 font-black shrink-0">→</span>
                  <span className="text-white/70 flex-1 truncate">{d.chosenLabel}</span>
                  <span className={`font-black shrink-0 ${d.moneyDelta >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {d.moneyDelta >= 0 ? '+' : ''}{d.moneyDelta}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All players final standings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mb-6 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-4">
          <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-3 text-center">Final Standings</p>
          <div className="space-y-2">
            {[...players].sort((a, b) => b.money - a.money).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-white/40 font-black text-sm w-4">{i + 1}</span>
                {p.avatar
                  ? <img src={p.avatar} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
                  : <div className={`w-8 h-8 rounded-full ${PLAYER_COLORS[p.color]} flex items-center justify-center text-white font-black text-xs`}>{p.name.charAt(0)}</div>}
                <span className="text-white font-bold flex-1">{p.name}</span>
                <span className={`font-black ${p.money >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>${p.money}</span>
                {i === 0 && <span>👑</span>}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="text-center">
          <motion.button onClick={onPlayAgain} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black text-xl shadow-[0_8px_30px_rgba(236,72,153,0.5)]">
            Play Again 🎲
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}