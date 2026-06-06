import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HOP_MS = 440;

const PAWN_HEX = {
  pink:   '#ec4899',
  purple: '#a855f7',
  blue:   '#3b82f6',
  teal:   '#14b8a6',
  gold:   '#f59e0b',
  coral:  '#f43f5e',
};

const CAT_NEON = {
  start:      '#ffffff',
  finish:     '#fbbf24',
  money:      '#34d399',
  money_loss: '#f87171',
  tax:        '#ef4444',
  heartbreak: '#f472b6',
  chaos:      '#fb923c',
  blessing:   '#38bdf8',
  glowup:     '#c084fc',
  wildcard:   '#e879f9',
};

const CAT_EMOJI = {
  start:      '🚀',
  finish:     '🏆',
  money:      '💹',
  money_loss: '💸',
  tax:        '💀',
  heartbreak: '💔',
  chaos:      '🔥',
  blessing:   '✨',
  glowup:     '🌟',
  wildcard:   '🃏',
};

// Neon signs flanking the street
const LEFT_SIGNS = [
  { text: 'HUSTLE\nHARD',           color: '#f472b6', style: 'block' },
  { text: 'NO RISK\nNO REWARD',     color: '#a855f7', style: 'block' },
  { text: 'INVEST IN\nYOURSELF',    color: '#3b82f6', style: 'block' },
  { text: 'CHOICES\nTODAY\nREALITY\nTOMORROW', color: '#ffffff', style: 'slim' },
  { text: 'KEEP\nMOVING\nFORWARD', color: '#38bdf8', style: 'slim' },
  { text: 'FOCUS\nPLAN\nEXECUTE',  color: '#34d399', style: 'slim' },
];

const RIGHT_SIGNS = [
  { text: 'FOCUS\nDISCIPLINE\nDESTINY',   color: '#34d399', style: 'block' },
  { text: 'OPPORTUNITY\nIS EVERYWHERE',    color: '#38bdf8', style: 'block' },
  { text: 'LIVE YOUR\nDREAMS',            color: '#f472b6', style: 'block' },
  { text: 'NO RISK\nNO REWARD',           color: '#fbbf24', style: 'slim' },
  { text: 'BUILD\nYOUR\nFUTURE',         color: '#e879f9', style: 'slim' },
  { text: 'STAY\nFOCUSED',               color: '#fb923c', style: 'slim' },
];

const STOREFRONTS_LEFT = ['☕ CAFE', '📚 BOOKS', '🏋️ GYM', '💇 SALON'];
const STOREFRONTS_RIGHT = ['🏦 MARKET', '🏨 MOTEL', '🎯 24/7', '🏢 LOANS'];

// ── Step-by-step pawn animation ──────────────────────────────────────────────
function useStepAnimation(targetPos, resetKey) {
  const [displayPos, setDisplayPos] = useState(targetPos);
  const [hopping, setHopping] = useState(false);
  const lastKeyRef = useRef(resetKey);

  useEffect(() => {
    if (lastKeyRef.current !== resetKey) {
      lastKeyRef.current = resetKey;
      setDisplayPos(targetPos);
      setHopping(false);
    }
  }, [resetKey, targetPos]);

  useEffect(() => {
    if (displayPos === targetPos) { setHopping(false); return; }
    setHopping(true);
    const t1 = setTimeout(() => setHopping(false), HOP_MS * 0.72);
    const t2 = setTimeout(() => {
      setDisplayPos(p => p === targetPos ? p : p + (targetPos > p ? 1 : -1));
    }, HOP_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [displayPos, targetPos]);

  return { displayPos, hopping };
}

// ── 3D Pawn ───────────────────────────────────────────────────────────────────
function Pawn3D({ player, hopping }) {
  const hex = PAWN_HEX[player.color] || '#a855f7';
  return (
    <motion.div className="flex flex-col items-center justify-end pointer-events-none"
      style={{ width: 64, height: 80, position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}
      animate={hopping ? { y: [0, -30, 0], scale: [1, 1.15, 1] } : { y: [0, -6, 0] }}
      transition={hopping
        ? { duration: HOP_MS / 1000, ease: [0.22, 1, 0.36, 1] }
        : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      {/* Ball */}
      <div style={{
        width: 52, height: 52,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, ${hex}ff, ${hex}88 60%, ${hex}44)`,
        boxShadow: `0 0 30px ${hex}cc, 0 0 60px ${hex}66, inset 0 -6px 14px rgba(0,0,0,0.4), inset 0 4px 8px rgba(255,255,255,0.3)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, fontWeight: 900, color: 'white',
        border: '2px solid rgba(255,255,255,0.5)',
        position: 'relative',
      }}>
        {player.avatar
          ? <img src={player.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          : <span style={{ textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>P</span>
        }
        {/* Shine */}
        <div style={{
          position: 'absolute', top: 7, left: 10, width: 14, height: 10,
          borderRadius: '50%', background: 'rgba(255,255,255,0.45)', transform: 'rotate(-20deg)',
          filter: 'blur(2px)',
        }} />
      </div>
      {/* Stem */}
      <div style={{
        width: 10, height: 18,
        background: `linear-gradient(180deg, ${hex}cc, ${hex}44)`,
        borderRadius: '0 0 4px 4px',
        boxShadow: `0 0 10px ${hex}66`,
        marginTop: -2,
      }} />
      {/* Base glow */}
      <div style={{
        width: 40, height: 8, borderRadius: '50%',
        background: `${hex}55`, filter: 'blur(6px)', marginTop: -2,
      }} />
    </motion.div>
  );
}

// ── Single street tile (perspective-correct) ─────────────────────────────────
// Each tile is a trapezoid that shrinks toward the horizon
function StreetTile({ tile, idx, total, isCurrent, isStart, isFinish, occupants, hopping, categoryStyles, pathNeon }) {
  const styleInfo = categoryStyles[tile.category] || categoryStyles.start;
  const Icon = styleInfo.icon;
  const neon = CAT_NEON[tile.category] || pathNeon;
  const emoji = CAT_EMOJI[tile.category] || '🌃';

  // Perspective sizing: tile 0 = bottom/largest, tile n = top/smallest
  const perspective = total > 1 ? idx / (total - 1) : 0;
  // Width shrinks from 340px to 160px
  const w = 340 - perspective * 180;
  // Height shrinks from 90px to 36px
  const h = 90 - perspective * 54;
  // Font sizes
  const labelSize = 18 - perspective * 10;
  const subSize   = 11 - perspective * 5;

  const label = isStart ? 'THE JOURNEY BEGINS' : isFinish ? 'YOU MADE IT! 🏆' : tile.name.toUpperCase();

  return (
    <div
      className="relative flex flex-col items-center justify-center shrink-0"
      style={{
        width: w,
        height: h,
        background: isCurrent
          ? `linear-gradient(135deg, rgba(6,10,28,0.97), rgba(12,18,44,0.95))`
          : `linear-gradient(135deg, rgba(4,7,20,0.92), rgba(2,4,14,0.94))`,
        border: `${isCurrent ? 2.5 : 1.5}px solid ${isCurrent ? neon : neon + '66'}`,
        borderRadius: 10 - perspective * 4,
        boxShadow: isCurrent
          ? `0 0 40px ${neon}99, 0 0 80px ${neon}33, inset 0 0 20px ${neon}11`
          : `0 0 12px ${neon}22, inset 0 0 8px ${neon}08`,
        overflow: 'hidden',
        cursor: 'default',
        flexShrink: 0,
      }}
    >
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.01) 2px,rgba(255,255,255,0.01) 3px)', opacity: 0.5 }}
      />

      {/* Bottom wet reflection */}
      <div className="absolute inset-x-0 bottom-0"
        style={{ height: '30%', background: `linear-gradient(to top, ${neon}28, transparent)` }}
      />

      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 rounded-t"
        style={{ height: 2, background: `linear-gradient(90deg, transparent, ${neon}, transparent)`, opacity: isCurrent ? 1 : 0.5 }}
      />

      {/* Space label */}
      {!isStart && !isFinish && (
        <p className="absolute font-black uppercase text-white/25"
          style={{ fontSize: Math.max(6, subSize - 2), top: 3, left: 6, letterSpacing: '0.15em' }}>
          SPACE {idx + 1}
        </p>
      )}

      {/* Main content */}
      <div className="flex items-center gap-1.5 px-2">
        {/* Icon */}
        <div className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: Math.max(18, 28 - perspective * 10),
            height: Math.max(18, 28 - perspective * 10),
            background: `${neon}18`,
            border: `1px solid ${neon}55`,
            boxShadow: isCurrent ? `0 0 12px ${neon}77` : `0 0 4px ${neon}33`,
          }}>
          <Icon style={{ width: Math.max(9, 14 - perspective * 5), height: Math.max(9, 14 - perspective * 5), color: neon }} />
        </div>

        {/* Title */}
        <p className="font-black text-center leading-tight"
          style={{
            fontSize: Math.max(8, labelSize),
            color: isCurrent ? '#fff' : 'rgba(255,255,255,0.82)',
            letterSpacing: '0.04em',
            lineHeight: 1.15,
            maxWidth: w - 60,
            overflow: 'hidden',
          }}>
          {label}
        </p>

        {/* Emoji */}
        <span style={{ fontSize: Math.max(10, 20 - perspective * 10), opacity: 0.7, flexShrink: 0 }}>{emoji}</span>
      </div>

      {/* Money badge */}
      {(tile.effect === 'money_gain' || tile.effect === 'money_loss') && tile.effectValue && !isStart && !isFinish && (
        <div className="absolute bottom-1 right-2 font-black rounded-full px-1.5"
          style={{
            fontSize: Math.max(6, 9 - perspective * 3),
            color: tile.effect === 'money_gain' ? '#34d399' : '#f87171',
            background: tile.effect === 'money_gain' ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)',
          }}>
          {tile.effect === 'money_gain' ? '+' : '-'}${Math.abs(tile.effectValue)}
        </div>
      )}
      {tile.effect === 'tax' && !isStart && !isFinish && (
        <div className="absolute bottom-1 right-2 font-black" style={{ fontSize: Math.max(6, 8 - perspective * 2), color: '#ef4444' }}>💀 TAXED</div>
      )}

      {/* Active glow pulse */}
      {isCurrent && (
        <motion.div className="absolute inset-0 rounded pointer-events-none"
          style={{ border: `2px solid ${neon}`, boxShadow: `0 0 30px ${neon}` }}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Pawns on this tile */}
      {occupants.length > 0 && isCurrent && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 60 }}>
          {occupants.map((p, pi) => {
            const hex2 = PAWN_HEX[p.color] || '#a855f7';
            return (
              <motion.div key={p.id}
                className="rounded-full border-2 flex items-center justify-center font-black text-white overflow-hidden"
                style={{
                  width: 26, height: 26, fontSize: 9,
                  background: `radial-gradient(circle at 35% 35%, ${hex2}ee, ${hex2}88)`,
                  borderColor: 'rgba(255,255,255,0.8)',
                  boxShadow: `0 0 12px ${hex2}cc`,
                  marginLeft: pi > 0 ? -8 : 0,
                }}
                animate={hopping ? { y: [0, -12, 0] } : { y: [0, -2, 0] }}
                transition={{ duration: hopping ? HOP_MS / 1000 : 1.4, repeat: hopping ? 0 : Infinity, ease: 'easeInOut' }}
              >
                {p.avatar ? <img src={p.avatar} alt="" className="w-full h-full object-cover" /> : p.name.charAt(0)}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Neon sign component ───────────────────────────────────────────────────────
function NeonSign({ text, color, style: signStyle, side, index }) {
  const lines = text.split('\n');
  const isBlock = signStyle === 'block';
  return (
    <motion.div
      className="flex flex-col items-center justify-center rounded-lg border font-black uppercase text-center"
      style={{
        minWidth: isBlock ? 90 : 60,
        padding: isBlock ? '8px 10px' : '5px 8px',
        fontSize: isBlock ? 11 : 9,
        letterSpacing: '0.1em',
        lineHeight: 1.3,
        color,
        borderColor: `${color}66`,
        background: 'rgba(0,0,0,0.82)',
        boxShadow: `0 0 20px ${color}55, 0 0 40px ${color}22, inset 0 0 10px ${color}11`,
        backdropFilter: 'blur(8px)',
        textShadow: `0 0 10px ${color}`,
        flexShrink: 0,
      }}
      animate={{ opacity: [0.5, 1, 0.4, 0.9, 0.5] }}
      transition={{ duration: 3 + index * 0.7, repeat: Infinity, ease: 'easeInOut', delay: index * 0.35 }}
    >
      {lines.map((l, i) => <span key={i}>{l}</span>)}
    </motion.div>
  );
}

// ── Storefront label ──────────────────────────────────────────────────────────
function Storefront({ label, color, index }) {
  return (
    <motion.div
      className="rounded-md border font-black uppercase text-center px-2 py-1"
      style={{
        fontSize: 9, letterSpacing: '0.1em',
        color, borderColor: `${color}55`,
        background: 'rgba(0,0,0,0.75)',
        boxShadow: `0 0 10px ${color}44`,
        flexShrink: 0,
      }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 4 + index * 0.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.8 }}
    >
      {label}
    </motion.div>
  );
}

// ── Main RoadView ─────────────────────────────────────────────────────────────
export function RoadView({ paths, activePathTiles, players, currentPlayerIndex, focusedPathIndex, getTileById, categoryStyles, playerColors }) {
  const currentPlayer = players[currentPlayerIndex];
  const containerRef = useRef(null);

  const activePathIdx = (focusedPathIndex !== null && focusedPathIndex !== undefined)
    ? focusedPathIndex
    : (currentPlayer.pathIndex ?? 0);

  const pathNeon    = ['#a855f7', '#ec4899', '#f97316'][activePathIdx] ?? '#a855f7';
  const tilesOnPath = activePathTiles[activePathIdx] ?? [];

  const { displayPos, hopping } = useStepAnimation(
    currentPlayer.position,
    `${currentPlayer.id}-${activePathIdx}`
  );
  const safePos = Math.max(0, Math.min(displayPos, tilesOnPath.length - 1));

  // Build visible window: show current + 4 ahead, 2 behind
  const VISIBLE_AHEAD  = 5;
  const VISIBLE_BEHIND = 2;
  const windowStart = Math.max(0, safePos - VISIBLE_BEHIND);
  const windowEnd   = Math.min(tilesOnPath.length - 1, safePos + VISIBLE_AHEAD);
  const visibleTiles = tilesOnPath.slice(windowStart, windowEnd + 1);

  // Occupant map
  const occupantMap = useMemo(() => {
    const map = {};
    for (const p of players) {
      const pPath = p.pathIndex ?? 0;
      if (pPath !== activePathIdx) continue;
      const idx = (p.id === currentPlayer.id) ? safePos : p.position;
      const clamped = Math.max(0, Math.min(idx, tilesOnPath.length - 1));
      map[clamped] = map[clamped] ? [...map[clamped], p] : [p];
    }
    return map;
  }, [players, activePathIdx, currentPlayer.id, safePos, tilesOnPath.length]);

  const progressPct = tilesOnPath.length > 1 ? Math.round((safePos / (tilesOnPath.length - 1)) * 100) : 0;
  const pathName    = paths[activePathIdx]?.name ?? 'Life';
  const pathEmoji   = paths[activePathIdx]?.emoji ?? '🏙️';
  const currentTile = getTileById(tilesOnPath[safePos] ?? 0);

  return (
    <div ref={containerRef} className="absolute inset-0 flex flex-col overflow-hidden" style={{ zIndex: 5 }}>

      {/* ── Dark atmospheric overlay on top of city photo ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(1,3,14,0.82) 0%, rgba(2,5,18,0.6) 35%, rgba(1,3,12,0.85) 100%)' }}
        />

        {/* Rain */}
        {Array.from({ length: 32 }).map((_, i) => (
          <motion.div key={i} className="absolute w-px rounded-full"
            style={{ left: `${(i * 3.1 + 0.5) % 100}%`, top: '-5%', height: 55 + (i % 5) * 8, background: 'rgba(147,197,253,0.13)' }}
            animate={{ y: ['0vh', '120vh'], opacity: [0, 0.55, 0] }}
            transition={{ duration: 1.1 + (i % 6) * 0.09, repeat: Infinity, delay: i * 0.04, ease: 'linear' }}
          />
        ))}

        {/* Street wet ground glow */}
        <div className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: `linear-gradient(to top, ${pathNeon}22, rgba(56,189,248,0.06), transparent)` }}
        />
        {[0,1,2,3,4].map(i => (
          <motion.div key={i} className="absolute bottom-0 rounded-full blur-lg"
            style={{ left: `${10 + i * 16}%`, width: 60 + i * 20, height: 8, background: pathNeon, opacity: 0 }}
            animate={{ opacity: [0, 0.25, 0] }}
            transition={{ duration: 2.8 + i * 0.4, repeat: Infinity, delay: i * 0.9, ease: 'easeInOut' }}
          />
        ))}

        {/* Moving cars */}
        {[0,1,2].map(i => (
          <motion.div key={i} className="absolute rounded-md border border-white/10 bg-slate-900/80"
            style={{ width: 40, height: 16, top: `${72 + i * 6}%`, left: i % 2 === 0 ? '-6%' : '106%' }}
            animate={{ x: i % 2 === 0 ? ['0vw','130vw'] : ['0vw','-130vw'], opacity: [0, 0.8, 0] }}
            transition={{ duration: 9 + i * 2.5, repeat: Infinity, delay: i * 3.2, ease: 'linear' }}
          >
            <span className="absolute left-1 top-0.5 h-1 w-3 rounded-full bg-amber-200/80" />
            <span className="absolute right-1 bottom-0.5 h-1 w-1.5 rounded-full bg-red-400/80" />
          </motion.div>
        ))}

        {/* Steam vents */}
        {[0,1].map(i => (
          <motion.div key={i} className="absolute rounded-full blur-xl"
            style={{ width: 44, height: 44, left: i === 0 ? '18%' : '74%', bottom: '20%', background: 'rgba(180,200,255,0.06)' }}
            animate={{ y: [0, -70], opacity: [0, 0.35, 0], scale: [0.8, 2] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i * 2.4, ease: 'easeOut' }}
          />
        ))}

        {/* City top skyline glow */}
        <div className="absolute inset-x-0 top-0 h-48"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${pathNeon}1a 0%, transparent 65%)` }}
        />

        {/* Road lane markings converging to center */}
        <div className="absolute inset-x-0" style={{ bottom: '8%', display: 'flex', justifyContent: 'center', gap: 16, opacity: 0.3 }}>
          {[-1, 1].map(side => (
            <div key={side} className="h-px" style={{
              width: 200,
              background: `linear-gradient(${side > 0 ? 'to right' : 'to left'}, ${pathNeon}88, transparent)`,
              transform: `rotate(${side * -8}deg)`,
              transformOrigin: side > 0 ? 'right center' : 'left center',
            }} />
          ))}
        </div>
      </div>

      {/* ── Left neon signs column ── */}
      <div className="absolute left-0 inset-y-0 flex flex-col justify-around items-start px-1.5 py-4 gap-2 pointer-events-none" style={{ zIndex: 10, width: 110 }}>
        {LEFT_SIGNS.slice(0, 4).map((s, i) => (
          <NeonSign key={i} text={s.text} color={s.color} style={s.style} side="left" index={i} />
        ))}
        <div className="flex flex-col gap-1.5 mt-2">
          {STOREFRONTS_LEFT.map((l, i) => (
            <Storefront key={i} label={l} color={['#f472b6','#38bdf8','#34d399','#e879f9'][i]} index={i} />
          ))}
        </div>
      </div>

      {/* ── Right neon signs column ── */}
      <div className="absolute right-0 inset-y-0 flex flex-col justify-around items-end px-1.5 py-4 gap-2 pointer-events-none" style={{ zIndex: 10, width: 110 }}>
        {RIGHT_SIGNS.slice(0, 4).map((s, i) => (
          <NeonSign key={i} text={s.text} color={s.color} style={s.style} side="right" index={i} />
        ))}
        <div className="flex flex-col gap-1.5 mt-2">
          {STOREFRONTS_RIGHT.map((l, i) => (
            <Storefront key={i} label={l} color={['#fbbf24','#c084fc','#fb923c','#ef4444'][i]} index={i} />
          ))}
        </div>
      </div>

      {/* ── Header ── */}
      <div className="relative z-20 flex items-center justify-between px-28 py-2 shrink-0"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${pathNeon}30` }}>
        <div className="flex items-center gap-2">
          <span className="text-base">{pathEmoji}</span>
          <div>
            <p className="font-black uppercase" style={{ fontSize: 6.5, letterSpacing: '0.22em', color: pathNeon }}>YOUR PATH</p>
            <p className="font-black text-white" style={{ fontSize: 11 }}>{pathName}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <p className="font-black text-white/40 uppercase" style={{ fontSize: 6, letterSpacing: '0.2em' }}>SPACE {safePos + 1} OF {tilesOnPath.length}</p>
          <div className="rounded-full overflow-hidden" style={{ width: 100, height: 5, background: 'rgba(255,255,255,0.08)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${pathNeon}, ${pathNeon}aa)`, boxShadow: `0 0 8px ${pathNeon}` }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-black" style={{ color: currentPlayer.money < 0 ? '#f87171' : '#34d399', fontSize: 13 }}>
            ${currentPlayer.money?.toLocaleString?.() ?? currentPlayer.money ?? 0}
          </span>
          {currentPlayer.job && <span className="text-white/50" style={{ fontSize: 9 }}>{currentPlayer.job.emoji}</span>}
        </div>
      </div>

      {/* ── STREET BOARD — perspective tile strip ── */}
      <div className="relative flex-1 flex flex-col items-center justify-end pb-20" style={{ zIndex: 15 }}>

        {/* Game title sign at horizon */}
        <motion.div
          className="absolute font-black text-center rounded-xl border px-4 py-2"
          style={{
            top: '4%', left: '50%', transform: 'translateX(-50%)',
            fontSize: 10, letterSpacing: '0.18em',
            color: pathNeon,
            borderColor: `${pathNeon}55`,
            background: 'rgba(0,0,0,0.85)',
            boxShadow: `0 0 24px ${pathNeon}66`,
            backdropFilter: 'blur(8px)',
            whiteSpace: 'nowrap',
            zIndex: 20,
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          Trippin' Through Life
        </motion.div>

        {/* Horizon vanishing point glow */}
        <div className="absolute" style={{
          top: '14%', left: '50%', transform: 'translateX(-50%)',
          width: 200, height: 60,
          background: `radial-gradient(ellipse, ${pathNeon}44 0%, transparent 70%)`,
          filter: 'blur(12px)',
          pointerEvents: 'none',
        }} />

        {/* Tile strip — perspective layout, top tiles are small (far), bottom is large (near) */}
        <div className="flex flex-col items-center justify-end gap-1.5 w-full px-28"
          style={{ paddingBottom: 8 }}>
          {/* Render tiles from windowEnd down to windowStart — far first, near last */}
          {[...visibleTiles].reverse().map((tileId, reversedIdx) => {
            const actualIdx = windowEnd - reversedIdx; // index in tilesOnPath
            const tile      = getTileById(tileId);
            const isCurrent = actualIdx === safePos;
            const isStart   = actualIdx === 0;
            const isFinish  = actualIdx === tilesOnPath.length - 1;
            const occupants = occupantMap[actualIdx] ?? [];

            // perspective: 0 = nearest (bottom), 1 = farthest (top)
            const perspectiveVal = reversedIdx / Math.max(1, visibleTiles.length - 1);

            return (
              <motion.div key={`${activePathIdx}-${tileId}-${actualIdx}`}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StreetTile
                  tile={tile}
                  idx={actualIdx}
                  total={tilesOnPath.length}
                  isCurrent={isCurrent}
                  isStart={isStart}
                  isFinish={isFinish}
                  occupants={occupants}
                  hopping={hopping}
                  categoryStyles={categoryStyles}
                  pathNeon={pathNeon}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Pawn standing on the current tile (absolute positioned at bottom) */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none" style={{ zIndex: 55 }}>
          <Pawn3D player={currentPlayer} hopping={hopping} />
        </div>
      </div>

      {/* ── Player status bar ── */}
      <div className="relative z-20 px-28 py-2.5 shrink-0"
        style={{ borderTop: `1px solid ${pathNeon}30`, background: 'rgba(0,0,0,0.90)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-3">
          {/* All players mini */}
          <div className="flex gap-2 flex-1 flex-wrap">
            {players.map((p, i) => {
              const hex = PAWN_HEX[p.color] || '#a855f7';
              const isActive = i === currentPlayerIndex;
              return (
                <div key={p.id} className="flex items-center gap-1.5 rounded-lg px-2 py-1"
                  style={{ background: isActive ? `${hex}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${isActive ? hex : 'rgba(255,255,255,0.08)'}` }}>
                  <div className="rounded-full flex items-center justify-center font-black text-white overflow-hidden"
                    style={{ width: 20, height: 20, fontSize: 8, background: `radial-gradient(circle at 35% 35%, ${hex}ee, ${hex}88)`, border: '1px solid rgba(255,255,255,0.5)' }}>
                    {p.avatar ? <img src={p.avatar} alt="" className="w-full h-full object-cover" /> : p.name.charAt(0)}
                  </div>
                  <span className="font-bold text-white/80" style={{ fontSize: 9 }}>{p.name.split(' ')[0]}</span>
                  <span className="font-black" style={{ fontSize: 9, color: p.money < 0 ? '#f87171' : '#34d399' }}>${p.money}</span>
                </div>
              );
            })}
          </div>
          {/* Current tile name */}
          <div className="text-right shrink-0">
            <p className="font-black uppercase text-white/30" style={{ fontSize: 6, letterSpacing: '0.15em' }}>CURRENT SPACE</p>
            <p className="font-black" style={{ fontSize: 10, color: CAT_NEON[currentTile?.category] || pathNeon }}>{currentTile?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}