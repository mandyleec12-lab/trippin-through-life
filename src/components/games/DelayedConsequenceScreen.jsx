import React from 'react';
import { motion } from 'framer-motion';

/**
 * Shown when a delayed consequence fires — a choice made earlier
 * now resurfaces and affects the player.
 */
export function DelayedConsequenceScreen({ consequence, playerName, onDismiss }) {
  if (!consequence) return null;
  const isPositive = consequence.moneyDelta > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center z-[70] p-4"
      style={{ background: 'rgba(5, 5, 20, 0.90)', backdropFilter: 'blur(16px)' }}
    >
      <motion.div
        initial={{ scale: 0.82, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.82, y: 50 }}
        transition={{ type: 'spring', stiffness: 130, damping: 20 }}
        className="w-full max-w-lg rounded-[2rem] overflow-hidden border"
        style={{
          borderColor: isPositive ? 'rgba(52,211,153,0.4)' : 'rgba(239,68,68,0.4)',
          background: isPositive
            ? 'linear-gradient(135deg, rgba(6,78,59,0.8), rgba(5,5,20,0.98))'
            : 'linear-gradient(135deg, rgba(127,29,29,0.8), rgba(5,5,20,0.98))',
          boxShadow: isPositive
            ? '0 0 60px rgba(52,211,153,0.3)'
            : '0 0 60px rgba(239,68,68,0.3)',
        }}
      >
        {/* Top bar */}
        <div className="h-1 w-full" style={{
          background: isPositive
            ? 'linear-gradient(90deg, transparent, #34d399, transparent)'
            : 'linear-gradient(90deg, transparent, #ef4444, transparent)',
        }} />

        <div className="px-6 py-8 text-center">
          {/* Time travel label */}
          <p className="text-[10px] font-black uppercase tracking-[0.36em] mb-3"
            style={{ color: isPositive ? '#34d399' : '#f87171' }}>
            ⏳ A Past Decision Returns — {playerName}
          </p>

          {/* Big icon */}
          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.12, 1], rotate: [0, isPositive ? 8 : -8, 0] }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            {isPositive ? '✨' : '⚠️'}
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            {consequence.title}
          </h2>
          <p className="text-base font-semibold text-white/65 mb-5 max-w-sm mx-auto">
            {consequence.description}
          </p>

          {/* Money impact */}
          {consequence.moneyDelta !== 0 && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-6 py-3 rounded-2xl border mb-4 text-3xl font-black"
              style={{
                borderColor: isPositive ? 'rgba(52,211,153,0.4)' : 'rgba(239,68,68,0.4)',
                background: isPositive ? 'rgba(6,78,59,0.4)' : 'rgba(127,29,29,0.4)',
                color: isPositive ? '#34d399' : '#f87171',
              }}
            >
              {isPositive ? '+' : '-'}${Math.abs(consequence.moneyDelta)}
            </motion.div>
          )}

          {consequence.skipNextTurn && (
            <p className="text-sm font-bold text-red-300 mb-4">+ Skip next turn</p>
          )}
          {consequence.skipImmunity && (
            <p className="text-sm font-bold text-emerald-300 mb-4">+ Skip immunity this turn</p>
          )}

          <motion.button
            onClick={onDismiss}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-full font-black text-base text-white"
            style={{
              background: isPositive
                ? 'linear-gradient(135deg, #059669, #10b981)'
                : 'linear-gradient(135deg, #b91c1c, #ef4444)',
            }}
          >
            {isPositive ? 'Collect & Continue →' : 'Accept & Move On →'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}