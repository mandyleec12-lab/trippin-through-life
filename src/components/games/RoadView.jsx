import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VIDEO_URL = 'https://media.base44.com/videos/public/69fd8ff3b9153ebd6453d5ee/a7cfbfba1_kling_20260607_VIDEO_Create_an__1430_0.mp4';

const PAWN_HEX = {
  pink: '#ec4899', purple: '#a855f7', blue: '#3b82f6',
  teal: '#14b8a6', gold: '#f59e0b', coral: '#f43f5e',
};

const CAT_COLOR = {
  start: '#ffffff', finish: '#fbbf24',
  money: '#34d399', money_loss: '#f87171',
  tax: '#ef4444', heartbreak: '#f472b6',
  chaos: '#fb923c', blessing: '#38bdf8',
  glowup: '#c084fc', wildcard: '#e879f9',
};

const CAT_EMOJI = {
  start: '🚀', finish: '🏆', money: '💹', money_loss: '💸',
  tax: '💀', heartbreak: '💔', chaos: '🔥', blessing: '✨',
  glowup: '🌟', wildcard: '🃏',
};

// Tile slot positions — % of container, matching the perspective tiles visible in the video
// Slot 0 = nearest/biggest (foreground bottom), slots recede toward vanishing point
const SLOTS = [
  { cx: 50, cy: 88, w: 50, h: 13,  br: 16 }, // current tile — largest
  { cx: 50, cy: 74, w: 39, h: 10,  br: 13 },
  { cx: 50, cy: 63, w: 30, h:  8,  br: 10 },
  { cx: 50, cy: 54, w: 23, h:  6.5,br:  8 },
  { cx: 50, cy: 47, w: 17.5,h: 5,  br:  6 },
  { cx: 50, cy: 41, w: 13, h:  4,  br:  5 },
];

const PATH_NEON = ['#38bdf8', '#a855f7', '#f97316'];

// ── Tile overlay card ─────────────────────────────────────────────────────────
function TileCard({ slot, tile, spaceNum, isNearest, neon, categoryStyles }) {
  const styleInfo = categoryStyles?.[tile?.category] ?? categoryStyles?.start;
  const Icon = styleInfo?.icon;
  const emoji = CAT_EMOJI[tile?.category] || '';
  const scale = slot.w / SLOTS[0].w;
  const fs    = Math.max(7, Math.round(13 * scale));
  const subFs = Math.max(5, Math.round(8 * scale));
  const iconSz= Math.max(11, Math.round(20 * scale));

  return (
    <div style={{
      position: 'absolute',
      left: `${slot.cx - slot.w / 2}%`,
      top:  `${slot.cy - slot.h / 2}%`,
      width:  `${slot.w}%`,
      height: `${slot.h}%`,
      borderRadius: slot.br,
      border: `${isNearest ? 2.5 : 1.5}px solid ${neon}${isNearest ? 'ee' : '77'}`,
      background: 'rgba(0,2,14,0.62)',
      backdropFilter: 'blur(2px)',
      boxShadow: isNearest
        ? `0 0 36px ${neon}99, 0 0 70px ${neon}33, inset 0 0 18px ${neon}18`
        : `0 0 8px ${neon}44`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      zIndex: isNearest ? 22 : 18,
      pointerEvents: 'none',
    }}>
      {/* Top neon bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: isNearest ? 2.5 : 1.5, background: `linear-gradient(90deg,transparent,${neon},transparent)` }} />
      {/* Bottom glow */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: `linear-gradient(to top,${neon}22,transparent)` }} />

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: '0 6px', width: '100%' }}>
        <p style={{ fontSize: subFs, fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1 }}>
          {spaceNum <= 1 ? 'START' : `SPACE ${spaceNum}`}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
          {Icon && isNearest && (
            <div style={{ width: iconSz, height: iconSz, borderRadius: Math.round(iconSz * 0.28), background: `${neon}22`, border: `1px solid ${neon}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 10px ${neon}55` }}>
              <Icon style={{ width: '60%', height: '60%', color: neon }} />
            </div>
          )}
          <p style={{ fontSize: fs, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.15, textAlign: 'center', textShadow: `0 0 10px ${neon},0 0 20px ${neon}66` }}>
            {tile?.name}
          </p>
          {emoji && <span style={{ fontSize: Math.max(9, iconSz * 0.85), flexShrink: 0, opacity: 0.88 }}>{emoji}</span>}
        </div>
        {isNearest && (tile?.effect === 'money_gain' || tile?.effect === 'money_loss') && tile?.effectValue && (
          <p style={{ fontSize: subFs + 1, fontWeight: 900, color: tile.effect === 'money_gain' ? '#34d399' : '#f87171', textShadow: tile.effect === 'money_gain' ? '0 0 8px #34d399' : '0 0 8px #f87171' }}>
            {tile.effect === 'money_gain' ? '+' : '-'}${Math.abs(tile.effectValue)}
          </p>
        )}
        {isNearest && tile?.effect === 'tax'        && <p style={{ fontSize: subFs, fontWeight: 900, color: '#ef4444' }}>💀 ALL TAXED</p>}
        {isNearest && tile?.effect === 'skip'       && <p style={{ fontSize: subFs, fontWeight: 900, color: '#fb923c' }}>⏭ SKIP TURN</p>}
        {isNearest && tile?.effect === 'roll_again' && <p style={{ fontSize: subFs, fontWeight: 900, color: '#c084fc' }}>🎲 ROLL AGAIN</p>}
      </div>

      {/* Active pulse ring */}
      {isNearest && (
        <motion.div style={{ position: 'absolute', inset: 0, borderRadius: slot.br, border: `2px solid ${neon}`, pointerEvents: 'none' }}
          animate={{ opacity: [0.2, 1, 0.2], boxShadow: [`0 0 16px ${neon}66`, `0 0 36px ${neon}cc`, `0 0 16px ${neon}66`] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
      )}
    </div>
  );
}

// ── Pawn ball — moves between slot positions ───────────────────────────────────
function Pawn({ player, slotIndex }) {
  const hex  = PAWN_HEX[player.color] || '#a855f7';
  const slot = SLOTS[Math.max(0, Math.min(slotIndex, SLOTS.length - 1))];
  const scale= slot.w / SLOTS[0].w;
  const sz   = Math.max(36, Math.round(78 * scale));

  return (
    <motion.div
      style={{ position: 'absolute', zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', transform: 'translate(-50%,-100%)' }}
      animate={{ left: `${slot.cx}%`, top: `${slot.cy - slot.h * 0.28}%` }}
      transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Idle float */}
      <motion.div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        animate={{ y: [0, -sz * 0.07, 0] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Hop arc — fires once on slot change */}
        <motion.div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          key={slotIndex}
          animate={{ y: [0, -sz * 1.05, 0] }}
          transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Ball */}
          <div style={{
            width: sz, height: sz, borderRadius: '50%', position: 'relative', flexShrink: 0,
            background: `radial-gradient(circle at 32% 26%, rgba(255,255,255,0.92) 0%, ${hex} 15%, ${hex}cc 50%, ${hex}55 100%)`,
            boxShadow: `0 0 ${sz*0.5}px ${hex}cc, 0 0 ${sz*1.0}px ${hex}44, 0 ${sz*0.17}px ${sz*0.36}px rgba(0,0,0,0.72), inset 0 -${sz*0.11}px ${sz*0.2}px rgba(0,0,0,0.4)`,
            border: '2.5px solid rgba(255,255,255,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {player.avatar
              ? <img src={player.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              : <span style={{ fontSize: sz * 0.33, fontWeight: 900, color: 'rgba(255,255,255,0.97)', textShadow: '0 2px 8px rgba(0,0,0,0.65)' }}>P</span>
            }
            {/* Specular */}
            <div style={{ position: 'absolute', top: sz*0.12, left: sz*0.17, width: sz*0.25, height: sz*0.16, borderRadius: '50%', background: 'rgba(255,255,255,0.65)', transform: 'rotate(-30deg)', filter: 'blur(2.5px)' }} />
          </div>
          {/* Stem */}
          <div style={{ width: sz*0.22, height: sz*0.3, background: `linear-gradient(180deg,${hex}cc,${hex}22)`, borderRadius: '0 0 6px 6px', marginTop: -2, boxShadow: `0 0 14px ${hex}55` }} />
          {/* Base disc */}
          <div style={{ width: sz*0.48, height: sz*0.08, borderRadius: sz*0.04, background: `linear-gradient(180deg,${hex}88,${hex}22)` }} />
        </motion.div>
      </motion.div>

      {/* Shadow */}
      <motion.div style={{ width: sz*0.88, height: sz*0.12, borderRadius: '50%', background: `${hex}55`, filter: 'blur(8px)', marginTop: 1 }}
        animate={{ scaleX: [1, 0.8, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.1, repeat: Infinity }}
      />
    </motion.div>
  );
}

// ── Ground glow under pawn ────────────────────────────────────────────────────
function GroundGlow({ slot, color }) {
  return (
    <motion.div style={{
      position: 'absolute',
      left: `${slot.cx}%`, top: `${slot.cy + slot.h * 0.3}%`,
      transform: 'translate(-50%,-50%)',
      width: `${slot.w * 0.52}%`, height: 16,
      borderRadius: '50%', background: color, filter: 'blur(16px)',
      zIndex: 30, pointerEvents: 'none',
    }}
      animate={{ left: `${slot.cx}%`, top: `${slot.cy + slot.h * 0.3}%`, opacity: [0.2, 0.52, 0.2], scaleX: [1, 1.18, 1] }}
      transition={{ left: { duration: 0.44 }, top: { duration: 0.44 }, opacity: { duration: 1.3, repeat: Infinity }, scaleX: { duration: 1.3, repeat: Infinity } }}
    />
  );
}

// ── Main RoadView ─────────────────────────────────────────────────────────────
export function RoadView({ paths, activePathTiles, players, currentPlayerIndex, focusedPathIndex, getTileById, categoryStyles }) {
  const currentPlayer = players[currentPlayerIndex];
  const activePathIdx = (focusedPathIndex != null) ? focusedPathIndex : (currentPlayer.pathIndex ?? 0);
  const neon = PATH_NEON[activePathIdx] ?? '#38bdf8';
  const tilesOnPath = activePathTiles[activePathIdx] ?? [];
  const pos = Math.max(0, Math.min(currentPlayer.position, tilesOnPath.length - 1));

  // Step-by-step animation: pawnSlot = which SLOT (0=current,1=next) the pawn occupies
  const [displayPos, setDisplayPos] = useState(pos);
  const [pawnSlot, setPawnSlot]     = useState(0);

  useEffect(() => {
    setDisplayPos(pos);
    setPawnSlot(0);
  }, [activePathIdx]);

  useEffect(() => {
    if (pos === displayPos) return;
    setPawnSlot(1); // jump to next slot visually
    const t = setTimeout(() => {
      setDisplayPos(p => p + (pos > p ? 1 : -1));
      setPawnSlot(0); // land back on slot 0 = new current tile
    }, 460);
    return () => clearTimeout(t);
  }, [pos, displayPos]);

  const safePos    = Math.max(0, Math.min(displayPos, tilesOnPath.length - 1));
  const curTile    = getTileById(tilesOnPath[safePos] ?? 0);
  const curNeon    = CAT_COLOR[curTile?.category] || neon;
  const progress   = tilesOnPath.length > 1 ? safePos / (tilesOnPath.length - 1) : 0;
  const progressPct= Math.round(progress * 100);
  const pawnGlowSlot = SLOTS[Math.max(0, Math.min(pawnSlot, SLOTS.length - 1))];

  const pathName  = paths[activePathIdx]?.name  ?? 'Life';
  const pathEmoji = paths[activePathIdx]?.emoji ?? '🏙️';

  // Build visible tile window: current + up to 5 ahead
  const visibleSlots = SLOTS.map((slot, si) => {
    const tileIdx = safePos + si;
    if (tileIdx >= tilesOnPath.length) return null;
    const tile = getTileById(tilesOnPath[tileIdx] ?? 0);
    const tileNeon = CAT_COLOR[tile?.category] || neon;
    return { slot, tile, tileNeon, tileIdx, si };
  }).filter(Boolean);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 5 }}>

      {/* ── LOOPING VIDEO BACKGROUND ── */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <video
          autoPlay loop muted playsInline
          style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom' }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        {/* Slight darkening so tile text pops */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.22)' }} />
      </div>

      {/* ── Tile cards overlaid on video — rendered farthest first so nearer tiles paint on top ── */}
      {[...visibleSlots].reverse().map(({ slot, tile, tileNeon, tileIdx, si }) => (
        <TileCard key={`${activePathIdx}-${tileIdx}`}
          slot={slot} tile={tile}
          spaceNum={tileIdx + 1}
          isNearest={si === 0}
          neon={tileNeon}
          categoryStyles={categoryStyles}
        />
      ))}

      {/* ── Pawn — animates its position from slot to slot ── */}
      <Pawn player={currentPlayer} slotIndex={pawnSlot} />

      {/* ── Ground glow under pawn ── */}
      <GroundGlow slot={pawnGlowSlot} color={curNeon} />

      {/* ── Header ── */}
      <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-4 py-1.5"
        style={{ background: 'rgba(0,0,6,0.82)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${neon}30` }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 14 }}>{pathEmoji}</span>
          <div>
            <p style={{ fontSize: 6, fontWeight: 900, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>YOUR PATH</p>
            <p style={{ fontSize: 11, fontWeight: 900, color: '#fff' }}>{pathName}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p style={{ fontSize: 6, fontWeight: 900, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>SPACE {safePos + 1} / {tilesOnPath.length}</p>
          <div style={{ width: 130, height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg,${neon},${curNeon})`, boxShadow: `0 0 8px ${neon}` }}
              animate={{ width: `${progressPct}%` }} transition={{ duration: 0.45 }} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 13, fontWeight: 900, color: (currentPlayer.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
            ${currentPlayer.money?.toLocaleString?.() ?? 0}
          </span>
          {currentPlayer.job && <span style={{ fontSize: 12 }}>{currentPlayer.job.emoji}</span>}
        </div>
      </div>

      {/* ── YOU ARE HERE callout ── */}
      <AnimatePresence mode="wait">
        <motion.div key={safePos} className="absolute z-40 rounded-xl border px-3 py-2"
          style={{ bottom: 52, left: 12, background: 'rgba(0,0,8,0.88)', backdropFilter: 'blur(14px)', borderColor: `${curNeon}66`, maxWidth: 172, boxShadow: `0 0 18px ${curNeon}44` }}
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
        >
          <p style={{ fontSize: 7, fontWeight: 900, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>YOU ARE HERE</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span style={{ fontSize: 15 }}>{CAT_EMOJI[curTile?.category] || '📍'}</span>
            <p style={{ fontSize: 11, fontWeight: 900, color: curNeon, textShadow: `0 0 10px ${curNeon}` }}>{curTile?.name}</p>
          </div>
          {curTile?.actionText && <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', marginTop: 3, lineHeight: 1.3 }}>{curTile.actionText}</p>}
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom player chips ── */}
      <div className="absolute bottom-0 inset-x-0 z-50 flex items-center gap-2 px-4 py-2"
        style={{ background: 'rgba(0,0,6,0.93)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${neon}28` }}>
        <div className="flex gap-1.5 flex-1 flex-wrap">
          {players.map((p, i) => {
            const hex = PAWN_HEX[p.color] || '#a855f7';
            const isActive = i === currentPlayerIndex;
            return (
              <div key={p.id} className="flex items-center gap-1.5 rounded-lg px-2 py-1"
                style={{ background: isActive ? `${hex}1e` : 'rgba(255,255,255,0.03)', border: `1px solid ${isActive ? hex + 'aa' : 'rgba(255,255,255,0.07)'}` }}>
                <motion.div className="rounded-full flex items-center justify-center font-black text-white overflow-hidden flex-shrink-0"
                  style={{ width: 22, height: 22, fontSize: 9, background: `radial-gradient(circle at 35% 30%,${hex}ff,${hex}99)`, border: `2px solid ${isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.28)'}`, boxShadow: isActive ? `0 0 10px ${hex}cc` : undefined }}
                  animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 1.2, repeat: isActive ? Infinity : 0 }}
                >
                  {p.avatar ? <img src={p.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : p.name.charAt(0)}
                </motion.div>
                <span style={{ fontSize: 9, fontWeight: 700, color: isActive ? '#fff' : 'rgba(255,255,255,0.6)' }}>{p.name.split(' ')[0]}</span>
                <span style={{ fontSize: 9, fontWeight: 900, color: (p.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>${p.money?.toLocaleString?.() ?? p.money ?? 0}</span>
              </div>
            );
          })}
        </div>
        <div className="text-right flex-shrink-0">
          <p style={{ fontSize: 6, fontWeight: 900, color: 'rgba(255,255,255,0.20)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>NOW ON</p>
          <p style={{ fontSize: 10, fontWeight: 900, color: curNeon, textShadow: `0 0 8px ${curNeon}` }}>{curTile?.name}</p>
        </div>
      </div>
    </div>
  );
}