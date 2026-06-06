import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// ─── Constants ───────────────────────────────────────────────────────────────
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

// Path accent colors
const PATH_NEON = ['#38bdf8', '#a855f7', '#f97316'];
const PATH_SECONDARY = ['#6366f1', '#ec4899', '#fb923c'];

// ─── Perspective tile geometry ───────────────────────────────────────────────
// 6 visible slots. Slot 0 = nearest/biggest (bottom). Slot 5 = farthest/smallest.
// All values are % of container width/height.
const SLOTS = [
  { cx: 50, cy: 88, w: 52, h: 13.5, borderR: 18 },
  { cx: 50, cy: 74, w: 40, h: 10.5, borderR: 14 },
  { cx: 50, cy: 63, w: 31, h:  8.2, borderR: 11 },
  { cx: 50, cy: 54, w: 24, h:  6.5, borderR:  9 },
  { cx: 50, cy: 47, w: 18, h:  5,   borderR:  7 },
  { cx: 50, cy: 41, w: 14, h:  4,   borderR:  5 },
];

// Pawn sits fixed at slot 0 position
const PAWN_SLOT = SLOTS[0];

// ─── useScrollBoard ──────────────────────────────────────────────────────────
// When position changes, animate the board scrolling forward by 1 tile step.
// Returns { scrollY, isScrolling } – scrollY drives a CSS translateY on the tile strip.
function useScrollBoard(position) {
  const [scrollPhase, setScrollPhase] = useState({ pos: position, offset: 0, animating: false });
  const prevPos = useRef(position);

  useEffect(() => {
    if (position === prevPos.current) return;
    const steps = position - prevPos.current;
    prevPos.current = position;
    if (steps <= 0) {
      setScrollPhase({ pos: position, offset: 0, animating: false });
      return;
    }
    // Animate one step at a time
    let step = 0;
    function doStep() {
      step++;
      setScrollPhase({ pos: prevPos.current - steps + step, offset: 0, animating: false });
      if (step < steps) setTimeout(doStep, 480);
    }
    // Start scroll animation
    setScrollPhase(s => ({ ...s, animating: true, offset: 1 }));
    const t = setTimeout(() => {
      setScrollPhase({ pos: position, offset: 0, animating: false });
    }, 480);
    return () => clearTimeout(t);
  }, [position]);

  return scrollPhase;
}

// ─── Rain streaks ─────────────────────────────────────────────────────────────
function Rain() {
  const drops = useMemo(() => Array.from({ length: 32 }, (_, i) => ({
    left: `${(i * 3.1 + 0.5) % 100}%`,
    h: 28 + (i % 6) * 9,
    dur: 0.85 + (i % 7) * 0.07,
    delay: i * 0.042,
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 14 }}>
      {drops.map((d, i) => (
        <motion.div key={i} className="absolute w-px rounded-full"
          style={{ left: d.left, top: '-3%', height: d.h, background: 'rgba(147,197,253,0.18)' }}
          animate={{ y: ['0vh', '108vh'], opacity: [0, 0.6, 0] }}
          transition={{ duration: d.dur, repeat: Infinity, delay: d.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

// ─── Neon sign ───────────────────────────────────────────────────────────────
function NeonSign({ lines, color, pos, size = 'sm' }) {
  const fs = size === 'lg' ? 13 : size === 'md' ? 11 : 9;
  return (
    <motion.div className="absolute font-black uppercase text-center pointer-events-none select-none rounded-lg border"
      style={{
        ...pos, zIndex: 12,
        padding: size === 'lg' ? '10px 14px' : '6px 10px',
        fontSize: fs, letterSpacing: '0.1em', lineHeight: 1.32,
        color, borderColor: `${color}55`,
        background: 'rgba(0,1,10,0.85)',
        boxShadow: `0 0 20px ${color}55, 0 0 40px ${color}22, inset 0 0 10px ${color}0d`,
        textShadow: `0 0 8px ${color}, 0 0 18px ${color}88`,
        backdropFilter: 'blur(4px)',
      }}
      animate={{ opacity: [0.4, 1, 0.35, 0.9, 0.4] }}
      transition={{ duration: 3.5 + Math.random() * 2, repeat: Infinity }}
    >
      {lines.map((l, i) => <div key={i}>{l}</div>)}
    </motion.div>
  );
}

// ─── City skyline (pure CSS) ──────────────────────────────────────────────────
function CitySkyline({ neon }) {
  const buildings = useMemo(() => [
    // left side
    { side: 'L', x: 0,   w: 68,  h: 200, windows: 16 },
    { side: 'L', x: 62,  w: 52,  h: 260, windows: 20 },
    { side: 'L', x: 108, w: 44,  h: 180, windows: 14 },
    { side: 'L', x: 146, w: 60,  h: 310, windows: 24 },
    { side: 'L', x: 200, w: 38,  h: 240, windows: 18 },
    // right side
    { side: 'R', x: 0,   w: 70,  h: 220, windows: 17 },
    { side: 'R', x: 64,  w: 55,  h: 280, windows: 22 },
    { side: 'R', x: 114, w: 45,  h: 190, windows: 15 },
    { side: 'R', x: 153, w: 62,  h: 320, windows: 25 },
    { side: 'R', x: 210, w: 40,  h: 250, windows: 19 },
  ], []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      {/* Night sky gradient */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #010106 0%, #020410 25%, #030818 50%, #040a1a 65%, #050c1c 100%)',
      }} />

      {/* Horizon city glow */}
      <motion.div className="absolute" style={{
        bottom: '34%', left: '25%', right: '25%', height: 80,
        background: `radial-gradient(ellipse, ${neon}44 0%, ${neon}11 50%, transparent 75%)`,
        filter: 'blur(24px)', zIndex: 3,
      }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Buildings */}
      {buildings.map((b, i) => {
        const isLeft = b.side === 'L';
        const style = {
          position: 'absolute', bottom: '28%',
          width: b.w, height: b.h,
          background: `linear-gradient(180deg, #0a0f1e, #060810)`,
          borderTop: `1px solid ${neon}33`,
          zIndex: 4,
        };
        if (isLeft) style.left = b.x;
        else style.right = b.x;

        return (
          <div key={i} style={style}>
            {/* Window grid */}
            <div style={{ position: 'absolute', inset: '6px 5px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3, alignContent: 'start', paddingTop: 8 }}>
              {Array.from({ length: b.windows }).map((_, w) => (
                <div key={w} style={{
                  height: 4.5, borderRadius: 1.5,
                  background: w % 5 === 0 ? `${neon}dd` : w % 7 === 0 ? '#fef08a88' : w % 11 === 0 ? '#f472b688' : 'rgba(255,255,255,0.025)',
                  boxShadow: w % 5 === 0 ? `0 0 8px ${neon}` : undefined,
                }} />
              ))}
            </div>
            {/* Roof antenna */}
            {i % 3 === 0 && <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', width: 2, height: 18, background: `${neon}88` }} />}
          </div>
        );
      })}

      {/* Street lamp posts */}
      {[
        { left: '29%', lampH: '44%' }, { right: '29%', lampH: '44%' },
        { left: '36%', lampH: '36%' }, { right: '36%', lampH: '36%' },
        { left: '41%', lampH: '29%' }, { right: '41%', lampH: '29%' },
      ].map((lp, i) => (
        <div key={i} style={{ position: 'absolute', bottom: '26%', width: 3, ...lp, height: lp.lampH, background: 'rgba(120,130,155,0.55)', zIndex: 5 }}>
          <motion.div style={{ position: 'absolute', top: -5, left: -9, width: 22, height: 8, borderRadius: '50%', background: '#fef3c7', filter: 'blur(6px)' }}
            animate={{ opacity: [0.5, 1, 0.6] }}
            transition={{ duration: 2.5 + i * 0.4, repeat: Infinity }}
          />
          {/* Reflection on wet street */}
          <motion.div style={{ position: 'absolute', top: '100%', left: -4, width: 10, height: 60, background: 'linear-gradient(to bottom,rgba(254,243,199,0.25),transparent)', filter: 'blur(3px)' }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2.5 + i * 0.4, repeat: Infinity }}
          />
        </div>
      ))}

      {/* Cars moving on sidewalks */}
      {[0, 1, 2].map(ci => (
        <motion.div key={ci} style={{
          position: 'absolute', bottom: `${26 + ci * 1.2}%`,
          width: 28, height: 11, borderRadius: 4,
          background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)',
          zIndex: 6,
        }}
          animate={{ x: ci % 2 === 0 ? ['-8vw', '112vw'] : ['112vw', '-8vw'], opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: 10 + ci * 3, repeat: Infinity, delay: ci * 4 }}
        >
          <span style={{ position: 'absolute', top: 2, width: 12, height: 5, borderRadius: '50%', background: ci % 2 === 0 ? '#fef08a99' : '#f8717188', left: ci % 2 === 0 ? 2 : undefined, right: ci % 2 !== 0 ? 2 : undefined, boxShadow: ci % 2 === 0 ? '0 0 10px #fef08a' : '0 0 10px #f87171' }} />
        </motion.div>
      ))}

      {/* Road surface — wet dark asphalt */}
      <div className="absolute inset-x-0 bottom-0" style={{ height: '30%', background: 'linear-gradient(to top, #060810 0%, #080c18 60%, transparent 100%)', zIndex: 5 }} />
      {/* Wet road reflections */}
      <motion.div className="absolute" style={{
        bottom: '0%', left: '20%', right: '20%', height: '28%',
        background: `radial-gradient(ellipse at 50% 100%, ${neon}18 0%, rgba(56,189,248,0.05) 40%, transparent 65%)`,
        zIndex: 6,
      }}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      {/* Road center lines */}
      {[0, 1, 2, 3, 4].map(li => (
        <motion.div key={li} className="absolute" style={{
          bottom: `${4 + li * 5}%`, left: '48.5%', right: '48.5%',
          height: '3%', background: 'rgba(254,240,138,0.45)', borderRadius: 2,
          zIndex: 7,
        }} />
      ))}
      {/* Road edge lines (yellow) */}
      <div className="absolute" style={{ bottom: 0, top: '30%', left: '30%', width: 3, background: 'linear-gradient(to bottom, transparent, rgba(254,240,138,0.5))', zIndex: 7 }} />
      <div className="absolute" style={{ bottom: 0, top: '30%', right: '30%', width: 3, background: 'linear-gradient(to bottom, transparent, rgba(254,240,138,0.5))', zIndex: 7 }} />
    </div>
  );
}

// ─── Single tile card (perspective-sized) ────────────────────────────────────
function TileCard({ tile, spaceNum, isNearest, neon, slot, categoryStyles, scrolling }) {
  const styleInfo = categoryStyles?.[tile?.category] ?? categoryStyles?.start;
  const Icon = styleInfo?.icon;
  const emoji = CAT_EMOJI[tile?.category] || '';
  const fs = Math.max(8, Math.round(14 * (slot.w / SLOTS[0].w)));
  const subFs = Math.max(6, Math.round(9 * (slot.w / SLOTS[0].w)));
  const iconSz = Math.max(12, Math.round(22 * (slot.w / SLOTS[0].w)));
  const br = slot.borderR;

  return (
    <div style={{
      position: 'absolute',
      left: `${slot.cx - slot.w / 2}%`,
      top: `${slot.cy - slot.h / 2}%`,
      width: `${slot.w}%`,
      height: `${slot.h}%`,
      borderRadius: br,
      border: `${isNearest ? 3 : 1.5}px solid ${neon}${isNearest ? 'ff' : '88'}`,
      background: isNearest
        ? `linear-gradient(160deg, rgba(10,18,44,0.95), rgba(4,8,22,0.98))`
        : `linear-gradient(160deg, rgba(6,10,26,0.88), rgba(3,6,18,0.92))`,
      boxShadow: isNearest
        ? `0 0 40px ${neon}99, 0 0 80px ${neon}33, inset 0 0 20px ${neon}18`
        : `0 0 10px ${neon}44, inset 0 0 6px ${neon}0d`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', zIndex: isNearest ? 22 : 20,
      pointerEvents: 'none',
    }}>
      {/* Top neon bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: isNearest ? 3 : 1.5, background: `linear-gradient(90deg, transparent, ${neon}, transparent)` }} />
      {/* Scanline texture */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.01) 3px,rgba(255,255,255,0.01) 4px)', pointerEvents: 'none' }} />
      {/* Bottom glow */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: `linear-gradient(to top, ${neon}22, transparent)` }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, padding: '0 8px', width: '100%' }}>
        <p style={{ fontSize: subFs, fontWeight: 900, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1 }}>
          {spaceNum <= 0 ? 'FINISH' : spaceNum === 1 ? 'START' : `SPACE ${spaceNum}`}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
          {Icon && isNearest && (
            <div style={{ width: iconSz, height: iconSz, borderRadius: Math.round(iconSz * 0.3), background: `${neon}18`, border: `1px solid ${neon}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 12px ${neon}66` }}>
              <Icon style={{ width: '60%', height: '60%', color: neon }} />
            </div>
          )}
          <p style={{ fontSize: fs, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.15, textAlign: 'center', textShadow: `0 0 12px ${neon}, 0 0 24px ${neon}66` }}>
            {tile?.name}
          </p>
          {emoji && <span style={{ fontSize: Math.max(10, iconSz), flexShrink: 0, opacity: 0.88 }}>{emoji}</span>}
        </div>
        {isNearest && (tile?.effect === 'money_gain' || tile?.effect === 'money_loss') && tile?.effectValue && (
          <motion.p
            initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ fontSize: subFs + 2, fontWeight: 900, color: tile.effect === 'money_gain' ? '#34d399' : '#f87171', textShadow: tile.effect === 'money_gain' ? '0 0 10px #34d399' : '0 0 10px #f87171' }}
          >
            {tile.effect === 'money_gain' ? '+' : '-'}${Math.abs(tile.effectValue)}
          </motion.p>
        )}
        {isNearest && tile?.effect === 'tax' && <p style={{ fontSize: subFs, fontWeight: 900, color: '#ef4444', textShadow: '0 0 8px #ef4444' }}>💀 ALL PLAYERS TAXED</p>}
        {isNearest && tile?.effect === 'skip' && <p style={{ fontSize: subFs, fontWeight: 900, color: '#fb923c' }}>⏭ SKIP A TURN</p>}
        {isNearest && tile?.effect === 'roll_again' && <p style={{ fontSize: subFs, fontWeight: 900, color: '#c084fc' }}>🎲 ROLL AGAIN!</p>}
      </div>

      {/* Active pulse ring */}
      {isNearest && (
        <motion.div style={{ position: 'absolute', inset: 0, borderRadius: br, border: `2px solid ${neon}`, boxShadow: `0 0 28px ${neon}88` }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
      )}
    </div>
  );
}

// ─── Pawn (travels between tile slots) ───────────────────────────────────────
function Pawn({ player, slotIndex, neon }) {
  const hex = PAWN_HEX[player.color] || '#a855f7';
  const sz = Math.max(44, Math.round(82 * (SLOTS[slotIndex]?.w ?? SLOTS[0].w) / SLOTS[0].w));
  const slot = SLOTS[slotIndex] ?? SLOTS[0];
  const pawnLeft = slot.cx;
  const pawnTop = slot.cy - slot.h * 0.32;

  return (
    <motion.div
      style={{ position: 'absolute', transform: 'translate(-50%, -100%)', zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}
      animate={{
        left: `${pawnLeft}%`,
        top: `${pawnTop}%`,
        // Arc hop: rise up mid-travel
        y: [0, -sz * 1.1, 0],
        scale: [1, 1.08, 1],
      }}
      transition={{
        left: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        top:  { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        y:    { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        scale:{ duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      {/* Idle bob wrapper */}
      <motion.div animate={{ y: [0, -sz * 0.07, 0] }} transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Ball */}
      <div style={{
        width: sz, height: sz, borderRadius: '50%', position: 'relative', flexShrink: 0,
        background: `radial-gradient(circle at 32% 26%, rgba(255,255,255,0.9) 0%, ${hex} 16%, ${hex}cc 50%, ${hex}55 100%)`,
        boxShadow: `0 0 ${sz * 0.55}px ${hex}cc, 0 0 ${sz * 1.1}px ${hex}44, 0 ${sz * 0.18}px ${sz * 0.38}px rgba(0,0,0,0.72), inset 0 -${sz * 0.12}px ${sz * 0.22}px rgba(0,0,0,0.4)`,
        border: '2.5px solid rgba(255,255,255,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {player.avatar
          ? <img src={player.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          : <span style={{ fontSize: sz * 0.33, fontWeight: 900, color: 'rgba(255,255,255,0.97)', textShadow: '0 2px 8px rgba(0,0,0,0.65)', letterSpacing: -1 }}>P</span>
        }
        {/* Specular highlight */}
        <div style={{ position: 'absolute', top: sz * 0.11, left: sz * 0.17, width: sz * 0.26, height: sz * 0.17, borderRadius: '50%', background: 'rgba(255,255,255,0.65)', transform: 'rotate(-30deg)', filter: 'blur(2.5px)' }} />
        {/* Small secondary highlight */}
        <div style={{ position: 'absolute', top: sz * 0.55, right: sz * 0.12, width: sz * 0.12, height: sz * 0.08, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', filter: 'blur(1.5px)' }} />
      </div>
      {/* Stem */}
      <div style={{ width: sz * 0.22, height: sz * 0.3, background: `linear-gradient(180deg, ${hex}cc, ${hex}22)`, borderRadius: '0 0 7px 7px', marginTop: -3, boxShadow: `0 0 16px ${hex}55` }} />
      {/* Base */}
      <div style={{ width: sz * 0.5, height: sz * 0.09, borderRadius: sz * 0.04, background: `linear-gradient(180deg, ${hex}88, ${hex}22)`, boxShadow: `0 0 12px ${hex}44` }} />
      {/* Shadow pool */}
      <motion.div style={{ width: sz * 0.9, height: sz * 0.13, borderRadius: '50%', background: `${hex}55`, filter: 'blur(9px)', marginTop: 2 }}
        animate={{ scaleX: [1, 0.8, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.1, repeat: Infinity }}
      />
      </motion.div>{/* end idle bob */}
    </motion.div>
  );
}

// ─── Main RoadView ─────────────────────────────────────────────────────────────
export function RoadView({ paths, activePathTiles, players, currentPlayerIndex, focusedPathIndex, getTileById, categoryStyles }) {
  const currentPlayer = players[currentPlayerIndex];
  const activePathIdx = (focusedPathIndex != null) ? focusedPathIndex : (currentPlayer.pathIndex ?? 0);
  const neon = PATH_NEON[activePathIdx] ?? '#38bdf8';
  const neon2 = PATH_SECONDARY[activePathIdx] ?? '#6366f1';
  const tilesOnPath = activePathTiles[activePathIdx] ?? [];
  const pos = Math.max(0, Math.min(currentPlayer.position, tilesOnPath.length - 1));

  const pathName  = paths[activePathIdx]?.name  ?? 'Life';
  const pathEmoji = paths[activePathIdx]?.emoji ?? '🏙️';

  // Step animation: displayPos steps toward pos one at a time
  // pawnSlot: 0 = current tile (nearest), briefly goes to slot -1 mid-hop (arc)
  const [displayPos, setDisplayPos] = useState(pos);
  const [pawnSlot, setPawnSlot] = useState(0); // which SLOT index the pawn is on (0=current)
  const prevPosRef = useRef(pos);

  useEffect(() => {
    if (pos === displayPos) return;
    const dir = pos > displayPos ? 1 : -1;
    // Pawn jumps: animate to slot 1 (1 ahead), then board advances, pawn snaps back to slot 0
    setPawnSlot(1); // pawn visually moves to the next tile up
    const t1 = setTimeout(() => {
      setDisplayPos(p => p + dir);
      setPawnSlot(0); // snap back to current (slot 0 = new current tile)
    }, 480);
    return () => clearTimeout(t1);
  }, [pos, displayPos]);

  // Reset on path change
  useEffect(() => {
    setDisplayPos(pos);
    setPawnSlot(0);
  }, [activePathIdx]);

  const safePos = Math.max(0, Math.min(displayPos, tilesOnPath.length - 1));
  const currentTile = getTileById(tilesOnPath[safePos] ?? 0);
  const curNeon = CAT_COLOR[currentTile?.category] || neon;
  const progressPct = tilesOnPath.length > 1 ? Math.round((safePos / (tilesOnPath.length - 1)) * 100) : 0;

  // Visible tiles: current (slot 0) + next 5 ahead (slots 1-5, receding toward horizon)
  const visibleSlots = SLOTS.map((slot, slotIdx) => {
    const tileIdx = safePos + slotIdx;
    if (tileIdx >= tilesOnPath.length) return null;
    const tile = getTileById(tilesOnPath[tileIdx] ?? 0);
    const tileNeon = CAT_COLOR[tile?.category] || neon;
    return { slot, tile, tileNeon, tileIdx, slotIdx };
  }).filter(Boolean);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 5 }}>

      {/* ── Fully animated city environment ── */}
      <CitySkyline neon={neon} />

      {/* ── Rain ── */}
      <Rain />

      {/* ── Neon signs — flanking the street ── */}
      <NeonSign lines={['HUSTLE', 'HARD']}           color="#38bdf8" size="lg" pos={{ top: '7%',  left: '2%' }} />
      <NeonSign lines={['NO RISK', 'NO REWARD']}     color="#a855f7"          pos={{ top: '28%', left: '2%' }} />
      <NeonSign lines={['KEEP MOVING', 'FORWARD']}   color="#f472b6"          pos={{ top: '48%', left: '2%' }} />
      <NeonSign lines={['INVEST IN', 'YOURSELF']}    color="#34d399" size="md" pos={{ top: '66%', left: '2%' }} />
      <NeonSign lines={['FOCUS', 'DISCIPLINE', 'DESTINY']} color="#34d399" size="lg" pos={{ top: '7%',  right: '2%' }} />
      <NeonSign lines={['OPPORTUNITY', 'IS EVERYWHERE']}   color="#fbbf24" size="md" pos={{ top: '26%', right: '2%' }} />
      <NeonSign lines={['THE JOURNEY', 'BUILDS YOU']}      color="#f472b6"          pos={{ top: '46%', right: '2%' }} />
      <NeonSign lines={['BUILD YOUR', 'FUTURE']}           color="#a855f7"          pos={{ top: '64%', right: '2%' }} />
      {/* Vertical banners near center */}
      <NeonSign lines={['LEVEL', 'UP']}              color="#ec4899"          pos={{ top: '14%', left: '26%' }} />
      <NeonSign lines={['GRIND']}                    color="#fb923c"          pos={{ top: '20%', right: '26%' }} />
      {/* Title sign */}
      <motion.div className="absolute font-black text-center pointer-events-none select-none"
        style={{
          top: '10%', left: '50%', transform: 'translateX(-50%)',
          fontSize: 11, letterSpacing: '0.15em', color: neon,
          textShadow: `0 0 14px ${neon}, 0 0 28px ${neon}88`,
          whiteSpace: 'nowrap', zIndex: 15,
          fontFamily: '"Dancing Script", cursive',
          fontSize: 18,
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Trippin' Through Life
      </motion.div>

      {/* ── Perspective tile strip — tiles recede toward horizon ── */}
      {/* Render back-to-front so nearer tiles paint on top */}
      {[...visibleSlots].reverse().map(({ slot, tile, tileNeon, tileIdx, slotIdx }) => (
        <TileCard key={`${activePathIdx}-${tileIdx}`}
          tile={tile}
          spaceNum={tileIdx + 1}
          isNearest={slotIdx === 0}
          neon={tileNeon}
          slot={slot}
          categoryStyles={categoryStyles}
        />
      ))}

      {/* ── Pawn — travels between slot positions ── */}
      <Pawn player={currentPlayer} slotIndex={pawnSlot} neon={curNeon} />

      {/* ── Ground glow under pawn (follows pawn slot) ── */}
      {(() => {
        const gs = SLOTS[pawnSlot] ?? SLOTS[0];
        return (
          <motion.div style={{
            position: 'absolute',
            left: `${gs.cx}%`, top: `${gs.cy + gs.h * 0.32}%`,
            transform: 'translate(-50%, -50%)',
            width: `${gs.w * 0.55}%`, height: 18,
            borderRadius: '50%', background: curNeon, filter: 'blur(18px)',
            zIndex: 35, pointerEvents: 'none',
          }}
            animate={{ left: `${gs.cx}%`, top: `${gs.cy + gs.h * 0.32}%`, opacity: [0.2, 0.55, 0.2], scaleX: [1, 1.2, 1] }}
            transition={{ left: { duration: 0.45 }, top: { duration: 0.45 }, opacity: { duration: 1.3, repeat: Infinity }, scaleX: { duration: 1.3, repeat: Infinity } }}
          />
        );
      })()}

      {/* ── Header bar ── */}
      <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-4 py-1.5"
        style={{ background: 'rgba(0,0,6,0.92)', backdropFilter: 'blur(18px)', borderBottom: `1px solid ${neon}30` }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 14 }}>{pathEmoji}</span>
          <div>
            <p style={{ fontSize: 6, fontWeight: 900, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>YOUR PATH</p>
            <p style={{ fontSize: 11, fontWeight: 900, color: '#fff' }}>{pathName}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p style={{ fontSize: 6, fontWeight: 900, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>SPACE {safePos + 1} / {tilesOnPath.length}</p>
          <div className="rounded-full overflow-hidden" style={{ width: 130, height: 5, background: 'rgba(255,255,255,0.08)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg,${neon},${curNeon})`, boxShadow: `0 0 8px ${neon}` }}
              animate={{ width: `${progressPct}%` }} transition={{ duration: 0.45, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 13, fontWeight: 900, color: (currentPlayer.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
            ${currentPlayer.money?.toLocaleString?.() ?? 0}
          </span>
          {currentPlayer.job && <span style={{ fontSize: 12 }}>{currentPlayer.job.emoji}</span>}
        </div>
      </div>

      {/* ── "YOU ARE HERE" callout ── */}
      <AnimatePresence mode="wait">
        <motion.div key={safePos} className="absolute z-40 rounded-xl border px-3 py-2"
          style={{ bottom: 52, left: 12, background: 'rgba(0,0,8,0.90)', backdropFilter: 'blur(14px)', borderColor: `${curNeon}66`, maxWidth: 172, boxShadow: `0 0 20px ${curNeon}44` }}
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
        >
          <p style={{ fontSize: 7, fontWeight: 900, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>YOU ARE HERE</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span style={{ fontSize: 15 }}>{CAT_EMOJI[currentTile?.category] || '📍'}</span>
            <p style={{ fontSize: 11, fontWeight: 900, color: curNeon, textShadow: `0 0 10px ${curNeon}` }}>{currentTile?.name}</p>
          </div>
          {currentTile?.actionText && <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', marginTop: 3, lineHeight: 1.3 }}>{currentTile.actionText}</p>}
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom player chips ── */}
      <div className="absolute bottom-0 inset-x-0 z-50 flex items-center gap-2 px-4 py-2"
        style={{ background: 'rgba(0,0,6,0.95)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${neon}28` }}>
        <div className="flex gap-1.5 flex-1 flex-wrap">
          {players.map((p, i) => {
            const hex = PAWN_HEX[p.color] || '#a855f7';
            const isActive = i === currentPlayerIndex;
            return (
              <div key={p.id} className="flex items-center gap-1.5 rounded-lg px-2 py-1"
                style={{ background: isActive ? `${hex}1e` : 'rgba(255,255,255,0.03)', border: `1px solid ${isActive ? hex + 'aa' : 'rgba(255,255,255,0.07)'}` }}>
                <motion.div className="rounded-full flex items-center justify-center font-black text-white overflow-hidden flex-shrink-0"
                  style={{ width: 22, height: 22, fontSize: 9, background: `radial-gradient(circle at 35% 30%, ${hex}ff, ${hex}99)`, border: `2px solid ${isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.28)'}`, boxShadow: isActive ? `0 0 10px ${hex}cc` : undefined }}
                  animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 1.2, repeat: isActive ? Infinity : 0 }}
                >
                  {p.avatar ? <img src={p.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : p.name.charAt(0)}
                </motion.div>
                <span style={{ fontSize: 9, fontWeight: 700, color: isActive ? '#fff' : 'rgba(255,255,255,0.6)' }}>{p.name.split(' ')[0]}</span>
                <span style={{ fontSize: 9, fontWeight: 900, color: (p.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
                  ${p.money?.toLocaleString?.() ?? p.money ?? 0}
                </span>
              </div>
            );
          })}
        </div>
        <div className="text-right flex-shrink-0">
          <p style={{ fontSize: 6, fontWeight: 900, color: 'rgba(255,255,255,0.20)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>NOW ON</p>
          <p style={{ fontSize: 10, fontWeight: 900, color: curNeon, textShadow: `0 0 8px ${curNeon}` }}>{currentTile?.name}</p>
        </div>
      </div>
    </div>
  );
}