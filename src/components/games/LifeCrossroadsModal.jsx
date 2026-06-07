import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LIFE_CROSSROADS } from '../../lib/gameEngine';

/**
 * LifeCrossroadsModal — presents a branching life decision.
 * The player's choice modifies their life stats and may schedule a delayed consequence.
 */
export function LifeCrossroadsModal({ crossroadsIndex, playerName, onChoice, onClose }) {
  const crossroads = LIFE_CROSSROADS[crossroadsIndex] ?? LIFE_CROSSROADS[0];
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (choice) => {
    if (selected) return;
    setSelected(choice);
    setTimeout(() => setRevealed(true), 400);
  };

  const handleConfirm = () => {
    onChoice(selected);
    onClose();
  };

  const toneColors = {
    risk: 'border-red-400/60 bg-red-950/40 hover:bg-red-900/50',
    caution: 'border-amber-400/60 bg-amber-950/40 hover:bg-amber-900/50',
    hope: 'border-emerald-400/60 bg-emerald-950/40 hover:bg-emerald-900/50',
  };

  const getChoiceTone = (choice) => {
    if (choice.moneyDelta < -150) return 'caution';
    if (choice.statDelta?.risk > 1 || choice.bigBreakChance) return 'risk';
    return 'hope';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center z-[60] p-4"
      style={{ background: 'rgba(5, 5, 20, 0.88)', backdropFilter: 'blur(12px)' }}
    >
      <motion.div
        initial={{ scale: 0.82, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.82, y: 40 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="w-full max-w-2xl rounded-[2rem] border border-purple-400/30 bg-[#0c0820] shadow-[0_0_80px_rgba(139,92,246,0.35)] overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 text-center border-b border-white/10">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-purple-300/70 mb-1">
            ✦ Life Crossroads — {playerName}
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white">{crossroads.title}</h2>
          <p className="mt-2 text-sm font-semibold text-white/60 max-w-md mx-auto">{crossroads.subtitle}</p>
          <p className="mt-2 text-xs text-purple-300/60 font-semibold">
            ⚠️ Your choice will ripple forward in time. Some consequences appear later.
          </p>
        </div>

        {/* Choices */}
        <div className="p-5 space-y-3">
          {!revealed ? (
            crossroads.choices.map((choice, i) => {
              const tone = getChoiceTone(choice);
              const isSelected = selected?.label === choice.label;
              return (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(choice)}
                  whileHover={!selected ? { y: -2, scale: 1.01 } : {}}
                  whileTap={!selected ? { scale: 0.99 } : {}}
                  className={`w-full text-left rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? 'border-purple-300 bg-purple-900/60 scale-[1.01]'
                      : selected
                      ? 'opacity-40 cursor-default border-white/10 bg-white/5'
                      : toneColors[tone]
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl border border-white/15 bg-black/40 flex items-center justify-center text-xl shrink-0">
                      {['🎯','💡','🎲'][i]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-white text-base">{choice.label}</h4>
                      <p className="text-xs font-semibold text-white/60 mt-0.5">{choice.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {choice.moneyDelta !== 0 && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            choice.moneyDelta > 0
                              ? 'text-emerald-300 border-emerald-400/30 bg-emerald-950/40'
                              : 'text-red-300 border-red-400/30 bg-red-950/40'
                          }`}>
                            {choice.moneyDelta > 0 ? '+' : ''}${choice.moneyDelta}
                          </span>
                        )}
                        {Object.entries(choice.statDelta || {}).map(([k, v]) => (
                          <span key={k} className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            v > 0 ? 'text-purple-300 border-purple-400/30 bg-purple-950/40' : 'text-rose-300 border-rose-400/30 bg-rose-950/40'
                          }`}>
                            {v > 0 ? '+' : ''}{v} {k}
                          </span>
                        ))}
                        {choice.consequence && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full border text-amber-300 border-amber-400/30 bg-amber-950/40">
                            ⏳ delayed effect
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-purple-400/30 bg-purple-950/40 p-5 text-center"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-purple-300/70 mb-2">
                ✦ Decision Locked In
              </p>
              <h3 className="text-xl font-black text-white">{selected.label}</h3>
              <p className="text-sm font-semibold text-white/60 mt-1">{selected.description}</p>
              {selected.consequence && (
                <p className="mt-3 text-xs font-bold text-amber-300/80">
                  ⏳ A consequence of this choice is now moving through time. It will surface later.
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        {revealed && (
          <div className="px-5 pb-5">
            <motion.button
              onClick={handleConfirm}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-base shadow-[0_0_30px_rgba(139,92,246,0.4)]"
            >
              Continue Your Journey →
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}