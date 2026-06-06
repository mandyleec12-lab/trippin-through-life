import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CityBackdrop } from './CityBackdrop';

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

// ── Single board space ───────────────────────────────────────────────────────
function BoardSpace({ tile, idx, isCurrent, isStart, isFinish, occupants, hopping, categoryStyles, tileW, tileH }) {
  const styleInfo = categoryStyles[tile.category] || categoryStyles.start;
  const Icon = styleInfo.icon;
  const neon = CAT_NEON[tile.category] || '#60a5fa';
  const bg   = CAT_BG[tile.category]  || 'rgba(20,30,60,0.8)';
  const label = isStart ? '★  START' : isFinish ? '🏆  FINISH' : tile.name;

  return (
    <div
      className="relative flex flex-col rounded-2xl border-2 overflow-hidden select-none"
      style={{
        width: tileW,
        height: tileH,
        background: isCurrent
          ? `linear-gradient(145deg, ${bg}, rgba(8,14,32,0.97))`
          : `linear-gradient(145deg, rgba(10,18,38,0.95), rgba(4,8,18,0.98))`,
        borderColor: isCurrent ? neon : `${neon}55`,
        boxShadow: isCurrent
          ? `0 0 28px ${neon}99, 0 0 60px ${neon}22, inset 0 1px 0 rgba(255,255,255,0.15)`
          : `0 0 6px ${neon}22, 0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
        zIndex: isCurrent ? 10 : 1,
        flexShrink: 0,
      }}
    >
      {/* Scanline */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.012) 2px,rgba(255,255,255,0.012) 3px)' }}
      />

      {/* Top accent bar */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${neon}, transparent)`, opacity: isCurrent ? 1 : 0.4 }}
      />

      {/* Space number */}
      <div className="absolute top-1 left-1.5 font-black text-white/25" style={{ fontSize: 7 }}>{idx + 1}</div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full px-1.5 pt-2 pb-1 gap-0.5">
        {/* Icon circle */}
        <div className="flex items-center justify-center rounded-full shrink-0"
          style={{
            width: isStart || isFinish ? 28 : 22,
            height: isStart || isFinish ? 28 : 22,
            background: `${neon}18`,
            border: `1.5px solid ${neon}66`,
            boxShadow: `0 0 8px ${neon}44`,
            marginBottom: 1,
          }}>
          <Icon style={{ width: isStart || isFinish ? 14 : 11, height: isStart || isFinish ? 14 : 11, color: neon }} />
        </div>

        {/* Title */}
        <p className="text-center font-black leading-tight w-full"
          style={{
            fontSize: isStart || isFinish ? 9 : 7.5,
            color: isCurrent ? '#fff' : 'rgba(255,255,255,0.80)',
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
          style={{ border: `2px solid ${neon}`, boxShadow: `0 0 20px ${neon}` }}
          animate={{ opacity: [0.25, 1, 0.25] }}
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
  const isHoriz  = Math.abs(dx) > Math.abs(dy);
  const isTurning = turn;

  // Control point for curve
  let cpx, cpy;
  if (isTurning) {
    cpx = from.cx + dx * 0.5;
    cpy = to.cy;
  } else if (isHoriz) {
    cpx = from.cx + dx * 0.5;
    cpy = from.cy + dy * 0.5;
  } else {
    cpx = from.cx + dx * 0.5;
    cpy = from.cy + dy * 0.5;
  }

  const pathD = `M ${from.cx} ${from.cy} Q ${cpx} ${cpy} ${to.cx} ${to.cy}`;

  return (
    <g>
      {/* Glow path */}
      <motion.path d={pathD} fill="none" stroke={neon} strokeWidth={3} strokeLinecap="round" opacity={0}
        animate={{ opacity: [0.18, 0.55, 0.18] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Core path */}
      <path d={pathD} fill="none" stroke={neon} strokeWidth={1.5} strokeLinecap="round" opacity={0.6}
        strokeDasharray="5 7"
      />
      {/* Arrow tip at destination */}
      <motion.circle cx={to.cx} cy={to.cy} r={3} fill={neon} opacity={0}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </g>
  );
}

// ── City environment background ───────────────────────────────────────────────
function CityBackground({ neon }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sky gradient */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg,#030820 0%,#060d2a 35%,#090520 70%,#050210 100%)' }}
      />

      {/* Stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{ width: 1 + (i % 2), height: 1 + (i % 2), left: `${(i * 2.5 + 1) % 100}%`, top: `${(i * 2.3 + 2) % 40}%`, opacity: 0.3 + (i % 4) * 0.1 }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2 + (i % 5) * 0.6, repeat: Infinity, delay: i * 0.07, ease: 'easeInOut' }}
        />
      ))}

      {/* Tall buildings - back layer */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <div key={`b${i}`} className="absolute bottom-0"
          style={{
            left: `${i * 12 - 2}%`,
            width: `${8 + (i % 3) * 3}%`,
            height: `${22 + (i % 5) * 12}%`,
            background: `linear-gradient(180deg, rgba(8,14,38,0.9), rgba(2,5,14,0.98))`,
            borderTop: `1px solid ${neon}22`,
            borderLeft: '1px solid rgba(255,255,255,0.04)',
          }}>
          {/* Windows grid */}
          <div className="absolute inset-x-1 top-2 grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {Array.from({ length: 15 }).map((_, w) => (
              <div key={w} className="rounded-sm" style={{
                height: 4,
                background: w % 4 === 0 ? `${neon}cc` : w % 7 === 0 ? '#fef08a88' : 'rgba(255,255,255,0.04)',
                boxShadow: w % 4 === 0 ? `0 0 6px ${neon}` : undefined,
              }} />
            ))}
          </div>
          {/* Rooftop antenna */}
          {i % 3 === 0 && <div className="absolute -top-6 left-1/2 w-px h-6" style={{ background: `${neon}88`, boxShadow: `0 0 4px ${neon}` }} />}
        </div>
      ))}

      {/* Neon billboard signs */}
      {[
        { left: '5%',  top: '12%', text: 'KEEP GOING', color: neon },
        { left: '72%', top: '8%',  text: 'DREAM BIG',  color: '#f472b6' },
        { left: '42%', top: '18%', text: 'NO LIMITS',  color: '#38bdf8' },
        { left: '18%', top: '22%', text: 'OPEN LATE',  color: '#fb923c' },
        { left: '80%', top: '25%', text: 'LEVEL UP',   color: '#c084fc' },
      ].map((sign, i) => (
        <motion.div key={i}
          className="absolute rounded-lg border px-2 py-1 font-black uppercase"
          style={{
            left: sign.left, top: sign.top,
            fontSize: 8, letterSpacing: '0.18em',
            color: sign.color,
            borderColor: `${sign.color}55`,
            background: 'rgba(0,0,0,0.7)',
            boxShadow: `0 0 12px ${sign.color}44`,
            backdropFilter: 'blur(4px)',
          }}
          animate={{ opacity: [0.4, 1, 0.3, 0.9, 0.4] }}
          transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        >
          {sign.text}
        </motion.div>
      ))}

      {/* Rain streaks */}
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.div key={i} className="absolute w-px rounded-full"
          style={{ left: `${i * 4.5}%`, top: '-5%', height: 55, background: 'rgba(148,163,184,0.16)' }}
          animate={{ y: ['0vh', '115vh'], opacity: [0, 0.4, 0] }}
          transition={{ duration: 1.4 + (i % 5) * 0.13, repeat: Infinity, delay: i * 0.07, ease: 'linear' }}
        />
      ))}

      {/* Wet street puddle reflections */}
      <div className="absolute inset-x-0 bottom-0 h-32"
        style={{ background: `linear-gradient(to top, ${neon}12, rgba(56,189,248,0.06), transparent)` }}
      />
      {[0,1,2].map(i => (
        <motion.div key={i} className="absolute bottom-4 h-2 rounded-full blur-sm"
          style={{ left: `${15 + i * 28}%`, width: `${60 + i * 20}px`, background: neon, opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
        />
      ))}

      {/* Moving cars */}
      {[0,1].map(i => (
        <motion.div key={i} className="absolute h-5 w-12 rounded-lg border border-white/10 bg-slate-900/80"
          style={{ top: `${75 + i * 8}%`, left: i === 0 ? '-8%' : '108%' }}
          animate={{ x: i === 0 ? ['0vw', '130vw'] : ['0vw', '-130vw'], opacity: [0, 0.9, 0] }}
          transition={{ duration: 12 + i * 3, repeat: Infinity, delay: i * 4, ease: 'linear' }}
        >
          <span className="absolute left-1 top-1 h-1 w-5 rounded-full bg-amber-200/80" />
          <span className="absolute right-1 bottom-1 h-1 w-2 rounded-full bg-red-400/80" />
        </motion.div>
      ))}

      {/* Steam vents */}
      {[0,1].map(i => (
        <motion.div key={i} className="absolute rounded-full blur-xl"
          style={{ width: 48, height: 48, left: i === 0 ? '22%' : '70%', bottom: '18%', background: 'rgba(255,255,255,0.06)' }}
          animate={{ y: [0, -60], opacity: [0, 0.3, 0], scale: [0.8, 1.5] }}
          transition={{ duration: 5 + i, repeat: Infinity, delay: i * 2.2, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

// ── Layout engine: snake/winding path ────────────────────────────────────────
// Returns array of {col, row} grid positions, snaking left-right bottom-to-top
function buildSnakePath(count, cols) {
  const positions = [];
  let row = 0, col = 0;
  const dir = [1, -1]; // alternates each row
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

  // Grid layout constants — fits nicely on mobile/tablet
  const COLS    = 3;
  const TILE_W  = 108;
  const TILE_H  = 90;
  const GAP_X   = 14;
  const GAP_Y   = 14;

  // Snake grid positions (bottom-to-top visual = we'll flip via transform)
  const gridPositions = useMemo(() => buildSnakePath(tilesOnPath.length, COLS), [tilesOnPath.length]);

  // Total grid size
  const rowCount  = gridPositions.length > 0 ? Math.max(...gridPositions.map(p => p.row)) + 1 : 1;
  const boardW    = COLS * TILE_W + (COLS - 1) * GAP_X + 32;
  const boardH    = rowCount * TILE_H + (rowCount - 1) * GAP_Y + 80;

  // Tile center positions for connectors
  const tileCenters = useMemo(() => gridPositions.map(({ col, row }) => ({
    cx: 16 + col * (TILE_W + GAP_X) + TILE_W / 2,
    cy: boardH - 40 - row * (TILE_H + GAP_Y) - TILE_H / 2,
  })), [gridPositions, boardH]);

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

  // Auto-scroll active tile into view
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
      <CityBackdrop imageUrl="/ChatGPT_Image_May_6,_2026,_02_47_41_PM.png" />

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between px-3 py-2 shrink-0"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${pathNeon}30` }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{pathEmoji}</span>
          <div>
            <p className="font-black uppercase" style={{ fontSize: 7, letterSpacing: '0.2em', color: pathNeon }}>Your Path</p>
            <p className="font-black text-white" style={{ fontSize: 12, lineHeight: 1.2 }}>{pathName}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="font-black uppercase text-white/35" style={{ fontSize: 7, letterSpacing: '0.16em' }}>Progress</p>
          <div className="flex items-center gap-1.5">
            <div className="rounded-full overflow-hidden" style={{ width: 80, height: 6, background: 'rgba(255,255,255,0.07)' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: pathNeon, boxShadow: `0 0 6px ${pathNeon}` }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            </div>
            <span className="font-black text-white/50" style={{ fontSize: 9 }}>{progressPct}%</span>
          </div>
        </div>
      </div>

      {/* ── Board scrollable area ── */}
      <div ref={boardRef}
        className="relative z-10 flex-1 overflow-auto flex items-start justify-center"
        style={{ scrollbarWidth: 'none', padding: '16px 8px 80px' }}>

        {/* SVG connectors layer */}
        <svg
          className="absolute pointer-events-none"
          style={{ left: '50%', top: 16, transform: 'translateX(-50%)', zIndex: 2, overflow: 'visible' }}
          width={boardW} height={boardH}
        >
          {tileCenters.map((from, i) => {
            if (i === tileCenters.length - 1) return null;
            const to = tileCenters[i + 1];
            const isTurn = gridPositions[i].row !== gridPositions[i + 1].row;
            const neon = CAT_NEON[getTileById(tilesOnPath[i]).category] || pathNeon;
            return (
              <Connector key={i} from={from} to={to} neon={neon} turn={isTurn} />
            );
          })}
        </svg>

        {/* Tiles */}
        <div className="relative" style={{ width: boardW, height: boardH, flexShrink: 0 }}>
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
      <div className="relative z-10 px-4 py-2.5 shrink-0"
        style={{ borderTop: `1px solid ${pathNeon}30`, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center gap-3">
          <PawnToken player={currentPlayer} hopping={false} isActive={true} />
          <div className="flex-1 min-w-0">
            <p className="font-black text-white truncate" style={{ fontSize: 12 }}>{currentPlayer.name}</p>
            <p className="font-bold" style={{ fontSize: 10, color: (currentPlayer.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
              ${currentPlayer.money?.toLocaleString?.() ?? currentPlayer.money ?? 0}
              {currentPlayer.job && <span className="text-white/40 font-normal ml-2">{currentPlayer.job.emoji} {currentPlayer.job.name}</span>}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="uppercase text-white/30" style={{ fontSize: 7, letterSpacing: '0.15em' }}>Space</p>
            <p className="font-black" style={{ fontSize: 15, color: pathNeon }}>{safePos + 1}<span className="text-white/30 font-normal" style={{ fontSize: 10 }}>/{tilesOnPath.length}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}