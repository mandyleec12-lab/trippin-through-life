import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

/**
 * Event/Choice card modal
 * Shows event and decision choices with moral/karma implications
 */
export default function GameCard({
  isOpen = false,
  cardType = 'standard',
  title = 'Event',
  description = '',
  choices = [],
  onChoose = () => {},
  loading = false,
}) {
  const [selectedChoice, setSelectedChoice] = React.useState(null);

  const cardStyles = {
    moral: 'bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 border-amber-400',
    money: 'bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 border-green-400',
    chaos: 'bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 border-red-400',
    blessing: 'bg-gradient-to-br from-cyan-900 via-teal-800 to-blue-900 border-cyan-400',
    life: 'bg-gradient-to-br from-pink-900 via-rose-800 to-red-900 border-pink-400',
  };

  const style = cardStyles[cardType] || cardStyles.life;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`bg-gradient-to-b from-slate-900 to-slate-950 border-4 ${style} rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl`}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Card header */}
            <div className="mb-6 text-center">
              <motion.h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                {title}
              </motion.h2>
              <p className="text-slate-300 text-sm">{description}</p>
            </div>

            {/* Choices */}
            <div className="space-y-3 mb-6">
              {choices.map((choice, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => {
                    setSelectedChoice(idx);
                    setTimeout(() => onChoose(idx), 300);
                  }}
                  disabled={loading || selectedChoice !== null}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left font-medium ${
                    selectedChoice === idx
                      ? 'bg-purple-600 border-purple-400 text-white'
                      : 'bg-slate-800 border-slate-600 text-slate-200 hover:border-purple-400 hover:bg-slate-700'
                  }`}
                  whileHover={{ scale: selectedChoice === null ? 1.02 : 1 }}
                  whileTap={{ scale: selectedChoice === null ? 0.98 : 1 }}
                >
                  <div className="flex items-center justify-between">
                    <span>{choice.text}</span>
                    <motion.span
                      className={`text-sm font-bold ml-2 ${
                        choice.karma > 0 ? 'text-green-400' : choice.karma < 0 ? 'text-red-400' : 'text-slate-400'
                      }`}
                    >
                      {choice.karma > 0 && '+'}
                      {choice.karma > 0 || choice.karma < 0 ? choice.karma : '○'}
                    </motion.span>
                  </div>
                  {choice.consequences && (
                    <p className="text-xs text-slate-400 mt-1">{choice.consequences}</p>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Loading state */}
            {loading && (
              <motion.div
                className="text-center py-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <p className="text-slate-400 text-sm">Your choice is being recorded...</p>
              </motion.div>
            )}

            {/* Karma hint (subtle) */}
            <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400">
                💫 Your choices shape who you become. Some consequences appear later.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}