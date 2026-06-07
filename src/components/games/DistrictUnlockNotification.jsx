import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Shows a cinematic notification when a new city district is unlocked.
 */
export function DistrictUnlockNotification({ district, onDismiss }) {
  if (!district) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        className="absolute top-20 left-1/2 -translate-x-1/2 z-[80] w-full max-w-md px-4"
      >
        <div
          className="rounded-2xl border px-5 py-4 backdrop-blur-xl shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${district.color}22, rgba(5,5,20,0.96))`,
            borderColor: `${district.color}55`,
            boxShadow: `0 0 40px ${district.color}44`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border border-white/20"
              style={{ background: `${district.color}33` }}
            >
              {district.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 mb-0.5">
                🏙️ New District Unlocked
              </p>
              <h3 className="text-lg font-black text-white truncate">{district.name}</h3>
              <p className="text-xs font-semibold text-white/55 leading-tight">{district.description}</p>
            </div>
            <button onClick={onDismiss} className="text-white/40 hover:text-white/70 text-xl font-bold shrink-0 ml-1">×</button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}