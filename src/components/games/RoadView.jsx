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

const CAT_BG = {
  start:      'rgba(255,255,255,0.08)',
  finish:     'rgba(251,191,36,0.12)',
  money:      'rgba(52,211,153,0.08)',
  money_loss: 'rgba(248,113,113,0.08)',
  tax:        'rgba(239,68,68,0.10)',
  heartbreak: 'rgba(244,114,182,0.08)',
  chaos:      'rgba(251,146,60,0.08)',
  blessing:   'rgba(56,189,248,0.08)',
  glowup:     'rgba(192,132,252,0.08)',
  wildcard:   'rgba(232,121,249,0.10)',
};

// District/location flavor by category
const CAT_DISTRICT = {
  start:      { label: '✦ THE JOURNEY BEGINS', sub: 'City Gates — Mile Zero' },
  finish:     { label: '🏆 YOU MADE IT', sub: 'Victory Plaza — Skyline Peak' },
  money:      { label: '💹 Financial District', sub: 'Market Row · Bank & Co.' },
  money_loss: { label: '🧾 Reality Check Ave', sub: 'Bills & Obligations Blvd' },
  tax:        { label: '💀 IRS Plaza', sub: 'Tax Season — Everyone Pays' },
  heartbreak: { label: '💔 Heartbreak Hotel', sub: 'Feelings Lane · Teardrops St.' },
  chaos:      { label: '🔥 Chaos Junction', sub: 'Wild Side · No GPS Here' },
  blessing:   { label: '✨ Blessing Gardens', sub: 'Community Park · Good Vibes' },
  glowup:     { label: '🌟 Glow Up District', sub: 'Self Care Ave · Level Up Ln.' },
  wildcard:   { label: '🃏 Mandy Magic Zone', sub: 'Anything Goes · Host Rules' },
};

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

// ── Pawn token ───────────────────────────────────────────────────────────────
function PawnToken({ player, hopping, isActive }) {
  const hex = PAWN_HEX[player.color] || '#a855f7';
  const size = 28;
  return (
    <motion.div
      className="flex items-center justify-center rounded-full border-2 font-black text-white overflow-hidden z-10"
      style={{
        width: size, height: size,
        fontSize: 10,
        background: `radial-gradient(circle at 35% 35%, ${hex}ee, ${hex}99)`,
        borderColor: 'rgba(255,255,255,0.8)',
        boxShadow: isActive
          ? `0 0 0 3px ${hex}66, 0 0 16px ${hex}cc, 0 3px 8px rgba(0,0,0,0.6)`
          : `0 0 8px ${hex}88, 0 2px 6px rgba(0,0,0,0.5)`,
        flexShrink: 0,
        position: 'relative',
      }}
      animate={hopping
        ? { y: [0, -18, 0], scale: [1, 1.2, 1] }
        : isActive ? { y: [0, -3, 0], scale: [1, 1.05, 1] } : {}
      }
      transition={hopping
        ? { duration: HOP_MS / 1000, ease: [0.22, 1, 0.36, 1] }
        : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      {player.avatar
        ? <img src={player.avatar} alt="" className="w-full h-full object-cover" />
        : player.name.charAt(0).toUpperCase()
      }
    </motion.div>
  );
}

// ── District ambient overlay behind a tile ───────────────────────────────────
function TileDistrictAmbience({ category, neon, isCurrent }) {
  const icons = {
    money:      ['🏦','📈','💳','🏢'],
    money_loss: ['📬','🧾','💸','⚠️'],
    tax:        ['💀','🏛️','📋','💰'],
    heartbreak: ['🌹','💔','🍷','🎸'],
    chaos:      ['⚡','🔥','🌪️','💥'],
    blessing:   ['🌳','☕','🌸','🕊️'],
    glowup:     ['✨','💅','📚','🌟'],
    wildcard:   ['🃏','🎭','🌀','🎲'],
    start:      ['🚀','🗺️','🎯','🌆'],
    finish:     ['🏆','🥂','🎊','👑'],
  }[category] || ['🌃'];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {/* Ambient district glow wash */}
      <div className="absolute inset-0 opacity-30"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${neon}44 0%, transparent 70%)` }}
      />
      {/* Floating ambient emoji icon */}
      {isCurrent && (
        <motion.div
          className="absolute bottom-0.5 right-1 text-xs opacity-40 select-none pointer-events-none"
          animate={{ y: [0, -3, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 9 }}
        >
          {icons[0]}
        </motion.div>
      )}
    </div>
  );
}

// ── Single board space ───────────────────────────────────────────────────────
function BoardSpace({ tile, idx, isCurrent, isStart, isFinish, occupants, hopping, categoryStyles, tileW, tileH }) {
  const styleInfo = categoryStyles[tile.category] || categoryStyles.start;
  const Icon = styleInfo.icon;
  const neon = CAT_NEON[tile.category] || '#60a5fa';
  const bg   = CAT_BG[tile.category]  || 'rgba(20,30,60,0.8)';
  const district = CAT_DISTRICT[tile.category] || {};
  const label = isStart ? '★  START' : isFinish ? '🏆  FINISH' : tile.name;

  return (
    <div
      className="relative flex flex-col rounded-2xl border-2 overflow-hidden select-none"
      style={{
        width: tileW,
        height: tileH,
        background: isCurrent
          ? `linear-gradient(145deg, ${bg}, rgba(8,14,32,0.97))`
          : `linear-gradient(145deg, rgba(6,10,24,0.92), rgba(3,5,14,0.96))`,
        borderColor: isCurrent ? neon : `${neon}44`,
        boxShadow: isCurrent
          ? `0 0 32px ${neon}99, 0 0 80px ${neon}22, inset 0 1px 0 rgba(255,255,255,0.18)`
          : `0 0 8px ${neon}18, 0 2px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
        zIndex: isCurrent ? 10 : 1,
        flexShrink: 0,
      }}
    >
      {/* District ambience */}
      <TileDistrictAmbience category={tile.category} neon={neon} isCurrent={isCurrent} />

      {/* Scanline texture */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.015) 2px,rgba(255,255,255,0.015) 3px)' }}
      />

      {/* Wet street reflection at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-4 opacity-30"
        style={{ background: `linear-gradient(to top, ${neon}33, transparent)` }}
      />

      {/* Top neon accent bar */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${neon}, transparent)`, opacity: isCurrent ? 1 : 0.35 }}
      />

      {/* District micro-label */}
      {district.sub && (
        <div className="absolute top-0.5 right-1 font-black text-white/20 leading-none"
          style={{ fontSize: 5, letterSpacing: '0.06em' }}>
          {district.sub?.split(' ·')[0]}
        </div>
      )}

      {/* Space number */}
      <div className="absolute top-1 left-1.5 font-black text-white/20" style={{ fontSize: 6 }}>{idx + 1}</div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full px-1.5 pt-2 pb-1 gap-0.5">
        {/* Icon circle */}
        <div className="flex items-center justify-center rounded-full shrink-0"
          style={{
            width: isStart || isFinish ? 30 : 22,
            height: isStart || isFinish ? 30 : 22,
            background: `${neon}18`,
            border: `1.5px solid ${neon}66`,
            boxShadow: isCurrent ? `0 0 14px ${neon}88` : `0 0 6px ${neon}33`,
            marginBottom: 1,
          }}>
          <Icon style={{ width: isStart || isFinish ? 15 : 11, height: isStart || isFinish ? 15 : 11, color: neon }} />
        </div>

        {/* Title */}
        <p className="text-center font-black leading-tight w-full"
          style={{
            fontSize: isStart || isFinish ? 9 : 7.5,
            color: isCurrent ? '#fff' : 'rgba(255,255,255,0.82)',
            letterSpacing: '0.03em',
            lineHeight: 1.2,
            maxHeight: 28,
            overflow: 'hidden',
          }}>
          {label}
        </p>

        {/* Effect badge */}
        {tile.effect === 'money_gain'  && tile.effectValue && (
          <span className="font-black rounded-full px-1.5" style={{ fontSize: 7, color: '#34d399', background: 'rgba(52,211,153,0.15)' }}>+${tile.effectValue}</span>
        )}
        {tile.effect === 'money_loss'  && tile.effectValue && (
          <span className="font-black rounded-full px-1.5" style={{ fontSize: 7, color: '#f87171', background: 'rgba(248,113,113,0.15)' }}>-${Math.abs(tile.effectValue)}</span>
        )}
        {tile.effect === 'tax'         && <span className="font-black" style={{ fontSize: 6.5, color: '#ef4444' }}>💀 Taxed!</span>}
        {tile.effect === 'skip'        && <span className="font-black" style={{ fontSize: 6.5, color: '#fb923c' }}>⏭ Skip</span>}
        {tile.effect === 'roll_again'  && <span className="font-black" style={{ fontSize: 6.5, color: '#c084fc' }}>🎲 Again!</span>}

        {/* Pawn tokens */}
        {occupants.length > 0 && (
          <div className="flex gap-0.5 items-center justify-center mt-0.5">
            {occupants.map(p => (
              <PawnToken key={p.id} player={p} hopping={hopping} isActive={isCurrent} />
            ))}
          </div>
        )}
      </div>

      {/* Pulsing border when active */}
      {isCurrent && (
        <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `2px solid ${neon}`, boxShadow: `0 0 24px ${neon}` }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 0.95, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
}

// ── Curved connector SVG between two tiles ───────────────────────────────────
function Connector({ from, to, neon, turn }) {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  let cpx, cpy;
  if (turn) {
    cpx = from.cx + dx * 0.5;
    cpy = to.cy;
  } else {
    cpx = from.cx + dx * 0.5;
    cpy = from.cy + dy * 0.5;
  }
  const pathD = `M ${from.cx} ${from.cy} Q ${cpx} ${cpy} ${to.cx} ${to.cy}`;

  return (
    <g>
      <motion.path d={pathD} fill="none" stroke={neon} strokeWidth={4} strokeLinecap="round" opacity={0}
        animate={{ opacity: [0.12, 0.45, 0.12] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <path d={pathD} fill="none" stroke={neon} strokeWidth={1.5} strokeLinecap="round" opacity={0.5}
        strokeDasharray="5 8"
      />
      <motion.circle cx={to.cx} cy={to.cy} r={3.5} fill={neon} opacity={0}
        animate={{ opacity: [0.25, 0.9, 0.25] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </g>
  );
}

// ── Immersive city overlay (renders OVER the photo, under the tiles) ──────────
function CityOverlay({ pathNeon, currentCategory }) {
  const SIGNS = [
    { text: 'YOU GOT THIS',   color: '#f472b6', left: '4%',  top: '8%'  },
    { text: 'DREAM BIG',      color: '#38bdf8', left: '70%', top: '5%'  },
    { text: 'STAY THE COURSE',color: '#c084fc', left: '38%', top: '13%' },
    { text: 'OPEN LATE',      color: '#fb923c', left: '16%', top: '20%' },
    { text: 'LEVEL UP',       color: '#34d399', left: '78%', top: '18%' },
    { text: 'KEEP GOING',     color: pathNeon,  left: '52%', top: '25%' },
    { text: 'MAIN CHARACTER', color: '#fbbf24', left: '6%',  top: '32%' },
    { text: 'YOUR STORY',     color: '#e879f9', left: '82%', top: '30%' },
  ];

  const STOREFRONTS = [
    { label: '☕ Grind & Go Café',        left: '2%',  bottom: '38%', color: '#fb923c' },
    { label: '📚 City Library',            left: '22%', bottom: '52%', color: '#38bdf8' },
    { label: '🏦 First Metro Bank',        left: '60%', bottom: '46%', color: '#34d399' },
    { label: '🌸 Bloom Community Park',    left: '42%', bottom: '60%', color: '#c084fc' },
    { label: '🍜 Night Market',            left: '78%', bottom: '42%', color: '#f472b6' },
    { label: '🚇 Central Station',         left: '34%', bottom: '32%', color: '#60a5fa' },
    { label: '💅 Glow Up Salon',           left: '14%', bottom: '62%', color: '#e879f9' },
    { label: '🏢 Opportunity Tower',       left: '66%', bottom: '58%', color: '#fbbf24' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>

      {/* Dark atmospheric overlay so photo doesn't overpower tiles */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(2,4,18,0.72) 0%, rgba(4,8,22,0.55) 40%, rgba(2,5,16,0.78) 100%)' }}
      />

      {/* Rain streaks */}
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.div key={`rain-${i}`} className="absolute w-px rounded-full"
          style={{ left: `${(i * 3.6 + 0.5) % 100}%`, top: '-4%', height: 60 + (i % 4) * 10, background: 'rgba(147,197,253,0.14)' }}
          animate={{ y: ['0vh', '118vh'], opacity: [0, 0.5, 0] }}
          transition={{ duration: 1.2 + (i % 6) * 0.1, repeat: Infinity, delay: i * 0.045, ease: 'linear' }}
        />
      ))}

      {/* Wet street puddle shimmer at base */}
      <div className="absolute inset-x-0 bottom-0 h-28"
        style={{ background: `linear-gradient(to top, ${pathNeon}1a, rgba(56,189,248,0.06), transparent)` }}
      />
      {[0,1,2,3].map(i => (
        <motion.div key={`puddle-${i}`} className="absolute rounded-full blur-md"
          style={{ bottom: `${4 + i * 5}%`, left: `${8 + i * 22}%`, width: 80 + i * 30, height: 6, background: pathNeon, opacity: 0 }}
          animate={{ opacity: [0, 0.22, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 1.1, ease: 'easeInOut' }}
        />
      ))}

      {/* Neon motivational billboard signs */}
      {SIGNS.map((sign, i) => (
        <motion.div key={`sign-${i}`}
          className="absolute rounded-lg border font-black uppercase px-2 py-0.5"
          style={{
            left: sign.left, top: sign.top,
            fontSize: 7, letterSpacing: '0.2em',
            color: sign.color,
            borderColor: `${sign.color}55`,
            background: 'rgba(0,0,0,0.75)',
            boxShadow: `0 0 14px ${sign.color}44, inset 0 0 6px ${sign.color}11`,
            backdropFilter: 'blur(6px)',
            zIndex: 2,
          }}
          animate={{ opacity: [0.35, 1, 0.25, 0.85, 0.35] }}
          transition={{ duration: 3.5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        >
          {sign.text}
        </motion.div>
      ))}

      {/* City storefront + district labels */}
      {STOREFRONTS.map((s, i) => (
        <motion.div key={`store-${i}`}
          className="absolute rounded-md border font-bold px-1.5 py-0.5"
          style={{
            left: s.left, bottom: s.bottom,
            fontSize: 6.5, letterSpacing: '0.08em',
            color: s.color,
            borderColor: `${s.color}44`,
            background: 'rgba(0,0,0,0.68)',
            boxShadow: `0 0 8px ${s.color}33`,
            backdropFilter: 'blur(4px)',
            zIndex: 2,
          }}
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
        >
          {s.label}
        </motion.div>
      ))}

      {/* Moving cars (left-to-right & right-to-left) */}
      {[0,1,2].map(i => (
        <motion.div key={`car-${i}`}
          className="absolute rounded-lg border border-white/10 bg-slate-900/80"
          style={{ width: 44, height: 18, top: `${68 + i * 7}%`, left: i % 2 === 0 ? '-6%' : '108%' }}
          animate={{ x: i % 2 === 0 ? ['0vw','130vw'] : ['0vw','-130vw'], opacity: [0, 0.85, 0] }}
          transition={{ duration: 10 + i * 2.5, repeat: Infinity, delay: i * 3.5, ease: 'linear' }}
        >
          <span className="absolute left-1 top-0.5 h-1 w-4 rounded-full bg-amber-200/80" />
          <span className="absolute right-1 bottom-0.5 h-1 w-2 rounded-full bg-red-400/80" />
        </motion.div>
      ))}

      {/* Steam vents from manholes */}
      {[0,1,2].map(i => (
        <motion.div key={`steam-${i}`}
          className="absolute rounded-full blur-xl"
          style={{ width: 40, height: 40, left: `${16 + i * 30}%`, bottom: `${12 + i * 4}%`, background: 'rgba(200,210,255,0.07)' }}
          animate={{ y: [0, -80], opacity: [0, 0.4, 0], scale: [0.8, 1.8] }}
          transition={{ duration: 5 + i * 0.7, repeat: Infinity, delay: i * 2, ease: 'easeOut' }}
        />
      ))}

      {/* Skyline glow at top */}
      <div className="absolute inset-x-0 top-0 h-40"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${pathNeon}18 0%, transparent 65%)` }}
      />

      {/* Active category district pulse */}
      {currentCategory && (
        <motion.div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${CAT_NEON[currentCategory] || pathNeon}22, transparent)` }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Floating sparkles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div key={`spark-${i}`}
          className="absolute rounded-full"
          style={{
            width: 1.5 + (i % 2),
            height: 1.5 + (i % 2),
            left: `${(i * 5.5 + 2) % 100}%`,
            top: `${(i * 4.7 + 5) % 70}%`,
            background: ['#f472b6','#c084fc','#38bdf8','#34d399','#fbbf24'][i % 5],
          }}
          animate={{ y: [0, -24, 0], opacity: [0.1, 0.6, 0.1], scale: [1, 1.4, 1] }}
          transition={{ duration: 4 + i * 0.45, repeat: Infinity, delay: i * 0.22, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ── Layout engine: snake/winding path ────────────────────────────────────────
function buildSnakePath(count, cols) {
  const positions = [];
  let row = 0, col = 0;
  const dir = [1, -1];
  let d = 0;
  for (let i = 0; i < count; i++) {
    positions.push({ col, row });
    const nextInRow = col + dir[d % 2];
    if (nextInRow >= 0 && nextInRow < cols) {
      col = nextInRow;
    } else {
      row++;
      d++;
    }
  }
  return positions;
}

// ── Main RoadView ─────────────────────────────────────────────────────────────
export function RoadView({ paths, activePathTiles, players, currentPlayerIndex, focusedPathIndex, getTileById, categoryStyles, playerColors }) {
  const currentPlayer = players[currentPlayerIndex];
  const boardRef = useRef(null);
  const activeTileRef = useRef(null);

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

  const currentTile = getTileById(tilesOnPath[safePos] ?? 0);
  const currentCategory = currentTile?.category;
  const currentDistrict = CAT_DISTRICT[currentCategory] || {};

  // Grid layout constants
  const COLS    = 3;
  const TILE_W  = 108;
  const TILE_H  = 90;
  const GAP_X   = 14;
  const GAP_Y   = 14;

  const gridPositions = useMemo(() => buildSnakePath(tilesOnPath.length, COLS), [tilesOnPath.length]);

  const rowCount  = gridPositions.length > 0 ? Math.max(...gridPositions.map(p => p.row)) + 1 : 1;
  const boardW    = COLS * TILE_W + (COLS - 1) * GAP_X + 32;
  const boardH    = rowCount * TILE_H + (rowCount - 1) * GAP_Y + 80;

  const tileCenters = useMemo(() => gridPositions.map(({ col, row }) => ({
    cx: 16 + col * (TILE_W + GAP_X) + TILE_W / 2,
    cy: boardH - 40 - row * (TILE_H + GAP_Y) - TILE_H / 2,
  })), [gridPositions, boardH]);

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

  useEffect(() => {
    if (activeTileRef.current && boardRef.current) {
      activeTileRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [safePos]);

  const progressPct  = tilesOnPath.length > 1 ? Math.round((safePos / (tilesOnPath.length - 1)) * 100) : 0;
  const pathName     = paths[activePathIdx]?.name ?? 'Life';
  const pathEmoji    = paths[activePathIdx]?.emoji ?? '🏙️';

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">

      {/* City overlay — environmental storytelling layer */}
      <CityOverlay pathNeon={pathNeon} currentCategory={currentCategory} />

      {/* ── Header ── */}
      <div className="relative z-20 flex items-center justify-between px-3 py-2 shrink-0"
        style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${pathNeon}30` }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{pathEmoji}</span>
          <div>
            <p className="font-black uppercase" style={{ fontSize: 6.5, letterSpacing: '0.22em', color: pathNeon }}>Your Path</p>
            <p className="font-black text-white" style={{ fontSize: 12, lineHeight: 1.2 }}>{pathName}</p>
          </div>
        </div>

        {/* Current district badge */}
        {currentDistrict.label && (
          <motion.div
            className="flex flex-col items-center px-2 py-1 rounded-lg border"
            style={{ borderColor: `${CAT_NEON[currentCategory]}55`, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p className="font-black text-white" style={{ fontSize: 7.5, color: CAT_NEON[currentCategory] }}>{currentDistrict.label}</p>
            {currentDistrict.sub && <p className="text-white/40 font-bold" style={{ fontSize: 6 }}>{currentDistrict.sub}</p>}
          </motion.div>
        )}

        <div className="flex flex-col items-end gap-1">
          <p className="font-black uppercase text-white/30" style={{ fontSize: 6.5, letterSpacing: '0.16em' }}>Journey</p>
          <div className="flex items-center gap-1.5">
            <div className="rounded-full overflow-hidden" style={{ width: 72, height: 5, background: 'rgba(255,255,255,0.07)' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: pathNeon, boxShadow: `0 0 8px ${pathNeon}` }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            </div>
            <span className="font-black text-white/50" style={{ fontSize: 8 }}>{progressPct}%</span>
          </div>
        </div>
      </div>

      {/* ── Board scrollable area ── */}
      <div ref={boardRef}
        className="relative z-10 flex-1 overflow-auto flex items-start justify-center"
        style={{ scrollbarWidth: 'none', padding: '16px 8px 80px' }}>

        {/* SVG connectors — the city streets connecting spaces */}
        <svg
          className="absolute pointer-events-none"
          style={{ left: '50%', top: 16, transform: 'translateX(-50%)', zIndex: 3, overflow: 'visible' }}
          width={boardW} height={boardH}
        >
          {tileCenters.map((from, i) => {
            if (i === tileCenters.length - 1) return null;
            const to = tileCenters[i + 1];
            const isTurn = gridPositions[i].row !== gridPositions[i + 1].row;
            const neon = CAT_NEON[getTileById(tilesOnPath[i]).category] || pathNeon;
            return <Connector key={i} from={from} to={to} neon={neon} turn={isTurn} />;
          })}
        </svg>

        {/* Tiles */}
        <div className="relative" style={{ width: boardW, height: boardH, flexShrink: 0, zIndex: 4 }}>
          {tilesOnPath.map((tileId, idx) => {
            const { col, row } = gridPositions[idx] || { col: 0, row: 0 };
            const tileX = 16 + col * (TILE_W + GAP_X);
            const tileY = boardH - 40 - row * (TILE_H + GAP_Y) - TILE_H;
            const tile  = getTileById(tileId);
            const isCurrent = idx === safePos;
            const isStart   = idx === 0;
            const isFinish  = idx === tilesOnPath.length - 1;
            const occupants = occupantMap[idx] ?? [];

            return (
              <div
                key={`${activePathIdx}-${tileId}-${idx}`}
                ref={isCurrent ? activeTileRef : null}
                className="absolute"
                style={{ left: tileX, top: tileY, zIndex: isCurrent ? 20 : 5 }}
              >
                <motion.div
                  animate={isCurrent ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                  transition={{ duration: 1.8, repeat: isCurrent ? Infinity : 0, ease: 'easeInOut' }}
                >
                  <BoardSpace
                    tile={tile}
                    idx={idx}
                    isCurrent={isCurrent}
                    isStart={isStart}
                    isFinish={isFinish}
                    occupants={occupants}
                    hopping={hopping}
                    categoryStyles={categoryStyles}
                    tileW={TILE_W}
                    tileH={TILE_H}
                  />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Player status bar ── */}
      <div className="relative z-20 px-4 py-2.5 shrink-0"
        style={{ borderTop: `1px solid ${pathNeon}30`, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-3">
          <PawnToken player={currentPlayer} hopping={false} isActive={true} />
          <div className="flex-1 min-w-0">
            <p className="font-black text-white truncate" style={{ fontSize: 12 }}>{currentPlayer.name}</p>
            <p className="font-bold" style={{ fontSize: 10, color: (currentPlayer.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
              ${currentPlayer.money?.toLocaleString?.() ?? currentPlayer.money ?? 0}
              {currentPlayer.job && <span className="text-white/35 font-normal ml-2">{currentPlayer.job.emoji} {currentPlayer.job.name}</span>}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="uppercase text-white/25" style={{ fontSize: 6.5, letterSpacing: '0.15em' }}>Space</p>
            <p className="font-black" style={{ fontSize: 15, color: pathNeon }}>{safePos + 1}<span className="text-white/25 font-normal" style={{ fontSize: 10 }}>/{tilesOnPath.length}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}