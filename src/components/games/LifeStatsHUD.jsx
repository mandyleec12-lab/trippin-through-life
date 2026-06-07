import React from 'react';
import { motion } from 'framer-motion';
import { getPlayerArchetype } from '../../lib/gameEngine';

const STAT_META = {
  education: { label: 'Education', emoji: '🎓', color: '#7c3aed' },
  health:    { label: 'Health',    emoji: '💪', color: '#059669' },
  family:    { label: 'Family',    emoji: '🏡', color: '#f59e0b' },
  risk:      { label: 'Risk',      emoji: '🎲', color: '#ef4444' },
  kindness:  { label: 'Kindness',  emoji: '💜', color: '#8b5cf6' },
  wealth:    { label: 'Wealth',    emoji: '💰', color: '#10b981' },
};

function StatBar({ statKey, value }) {
  const meta = STAT_META[statKey];
  const clamped = Math.max(-5, Math.min(5, value));
  const pct = ((clamped + 5) / 10) * 100;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] w-4 text-center">{meta.emoji}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: clamped >= 0 ? meta.color : '#ef4444', width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[9px] font-black text-white/50 w-5 text-right">
        {clamped > 0 ? '+' : ''}{clamped}
      </span>
    </div>
  );
}

export function LifeStatsHUD({ player, unlockedDistricts = [], pendingConsequences = [] }) {
  if (!player?.lifeStats) return null;
  const archetype = getPlayerArchetype(player.lifeStats);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute right-3 top-16 z-[25] w-48 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-3 shadow-xl"
    >
      {/* Archetype */}
      <div className="mb-2 text-center">
        <span className="text-lg">{archetype.emoji}</span>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
          {archetype.name}
        </p>
      </div>

      {/* Stat bars */}
      <div className="space-y-1.5 mb-2">
        {Object.entries(player.lifeStats).map(([k, v]) => (
          <StatBar key={k} statKey={k} value={v} />
        ))}
      </div>

      {/* Unlocked districts */}
      {unlockedDistricts.length > 0 && (
        <div className="border-t border-white/10 pt-2">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">
            Districts
          </p>
          <div className="flex flex-wrap gap-1">
            {unlockedDistricts.map(d => (
              <span
                key={d.id}
                title={d.name}
                className="text-base cursor-default"
                style={{ filter: `drop-shadow(0 0 6px ${d.color})` }}
              >
                {d.emoji}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pending consequences */}
      {pendingConsequences.length > 0 && (
        <div className="border-t border-white/10 pt-2 mt-1">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-300/60 mb-1">
            ⏳ {pendingConsequences.length} pending
          </p>
        </div>
      )}
    </motion.div>
  );
}