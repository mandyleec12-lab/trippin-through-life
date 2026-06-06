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

// ── Step-by-step pawn animation ──────────────────────────────────────────────
function useStepAnimation(targetPos, resetKey) {
  const [displayPos, setDisplayPos] = useState(targetPos);
  const [hopping, setHopping]       = useState(false);
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

// ── Mini pawn token — sits entirely within one tile ──────────────────────────
function PawnToken({ player, hopping, size = 22 }) {
  const hex = PAWN_HEX[player.color] || '#a855f7';
  return (
    <motion.div
      className="flex items-center justify-center rounded-full border-2 border-white/70 font-black text-white overflow-hidden"
      style={{
        width: size, height: size,
        fontSize: size * 0.38,
        background: hex,
        boxShadow: `0 0 8px ${hex}cc, 0 2px 6px rgba(0,0,0,0.5)`,
        borderColor: 'rgba(255,255,255,0.75)',
        flexShrink: 0,
      }}
      animate={hopping
        ? { y: [0, -size * 0.7, 0], scale: [1, 1.15, 1] }
        : { y: [0, -2, 0] }
      }
      transition={hopping
        ? { duration: HOP_MS / 1000, ease: [0.22, 1, 0.36, 1] }
        : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      {player.avatar
        ? <img src={player.avatar} alt="" className="w-full h-full object-cover" />
        : player.name.charAt(0).toUpperCase()
      }
    </motion.div>
  );
}

// ── Single board space tile ───────────────────────────────────────────────────
function BoardSpace({ tile, idx, isCurrent, isStart, isFinish, occupants, currentPlayerHopping, categoryStyles }) {
  const styleInfo = categoryStyles[tile.category] || categoryStyles.start;
  const Icon      = styleInfo.icon;
  const neon      = CAT_NEON[tile.category] || '#60a5fa';
  const label     = isStart ? 'START' : isFinish ? 'FINISH' : tile.name;

  return (
    <div
      className="relative flex items-center gap-2 rounded-2xl border-2 overflow-visible"
      style={{
        minHeight: isStart || isFinish ? 64 : 50,
        padding: '0 10px 0 8px',
        background: isCurrent
          ? `linear-gradient(135deg, ${neon}22 0%, rgba(10,18,40,0.97) 100%)`
          : 'linear-gradient(135deg, rgba(15,25,50,0.97) 0%, rgba(4,8,18,0.99) 100%)',
        borderColor: isCurrent ? neon : `${neon}40`,
        boxShadow: isCurrent
          ? `0 0 22px ${neon}88, 0 0 48px ${neon}18, inset 0 1px 0 rgba(255,255,255,0.12)`
          : `0 0 4px ${neon}18, inset 0 1px 0 rgba(255,255,255,0.04)`,
        zIndex: isCurrent ? 5 : 1,
      }}
    >
      {/* Scanline texture */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-25"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.015) 3px,rgba(255,255,255,0.015) 4px)' }}
      />

      {/* Space number badge */}
      <div className="absolute -left-2 -top-2 flex items-center justify-center rounded-full border border-white/20 bg-black/80 font-black text-white/50"
        style={{ width: 16, height: 16, fontSize: 7 }}>
        {idx + 1}
      </div>

      {/* Category icon */}
      <div className="shrink-0 flex items-center justify-center rounded-xl"
        style={{
          width: isStart || isFinish ? 36 : 28,
          height: isStart || isFinish ? 36 : 28,
          background: `${neon}15`,
          border: `1px solid ${neon}50`,
          boxShadow: `0 0 8px ${neon}28`,
        }}>
        <Icon style={{ width: isStart || isFinish ? 18 : 14, height: isStart || isFinish ? 18 : 14, color: neon }} />
      </div>

      {/* Label + effect */}
      <div className="flex-1 min-w-0 py-1">
        <p className="font-black truncate leading-tight"
          style={{ fontSize: isStart || isFinish ? 11 : 9.5, letterSpacing: '0.07em', color: isCurrent ? '#fff' : 'rgba(255,255,255,0.75)' }}>
          {label}
        </p>
        {tile.effect === 'money_gain' && tile.effectValue && (
          <p className="font-bold" style={{ fontSize: 8, color: '#34d399' }}>+${tile.effectValue}</p>
        )}
        {tile.effect === 'money_loss' && tile.effectValue && (
          <p className="font-bold" style={{ fontSize: 8, color: '#f87171' }}>-${Math.abs(tile.effectValue)}</p>
        )}
        {tile.effect === 'tax' && (
          <p className="font-bold" style={{ fontSize: 8, color: '#ef4444' }}>All taxed</p>
        )}
        {tile.effect === 'skip' && (
          <p className="font-bold" style={{ fontSize: 8, color: '#fb923c' }}>Skip turn</p>
        )}
        {tile.effect === 'roll_again' && (
          <p className="font-bold" style={{ fontSize: 8, color: '#c084fc' }}>Roll again!</p>
        )}
      </div>

      {/* Player tokens — sit inside the tile, right-aligned */}
      {occupants.length > 0 && (
        <div className="flex gap-1 shrink-0 items-center">
          {occupants.map((p, i) => (
            <PawnToken
              key={p.id}
              player={p}
              hopping={currentPlayerHopping && p.id === occupants.find(x => x.id === p.id)?.id}
              size={20}
            />
          ))}
        </div>
      )}

      {/* Active glow ring */}
      {isCurrent && (
        <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `2px solid ${neon}`, boxShadow: `0 0 16px ${neon}88` }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.0, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
}

// ── Connector arrow between spaces ───────────────────────────────────────────
function SpaceConnector({ neon }) {
  return (
    <div className="flex flex-col items-center" style={{ height: 18, flexShrink: 0 }}>
      <motion.div
        className="w-px"
        style={{ flex: 1, background: `linear-gradient(to bottom, ${neon}88, ${neon}22)`, boxShadow: `0 0 3px ${neon}44` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          width: 0, height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: `6px solid ${neon}`,
          filter: `drop-shadow(0 0 3px ${neon})`,
        }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

// ── Neon city atmosphere (background) ────────────────────────────────────────
function CityAtmosphere({ neon, pathName }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Dark gradient base */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#020617 0%,#060d2e 50%,#0a0520 100%)' }} />

      {/* Building silhouettes */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <div key={i} className="absolute bottom-0 rounded-t-md"
          style={{
            left: `${i * 13 - 2}%`, width: `${9 + (i % 3) * 4}%`, height: `${14 + (i % 4) * 10}%`,
            background: 'linear-gradient(180deg,rgba(10,16,42,0.88),rgba(3,6,16,0.97))',
            borderTop: `1px solid ${neon}1a`,
          }}>
          <div className="absolute inset-x-1.5 top-2 grid grid-cols-3 gap-1">
            {Array.from({ length: 6 }).map((_, w) => (
              <div key={w} className="h-1 rounded-sm"
                style={{ background: w % 4 === 0 ? `${neon}99` : 'rgba(255,255,255,0.04)' }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Rain streaks */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div key={i} className="absolute w-px rounded-full"
          style={{ left: `${i * 7}%`, top: '-5%', height: 60, background: 'rgba(148,163,184,0.15)' }}
          animate={{ y: ['0vh', '110vh'], opacity: [0, 0.4, 0] }}
          transition={{ duration: 1.5 + (i % 5) * 0.15, repeat: Infinity, delay: i * 0.09, ease: 'linear' }}
        />
      ))}

      {/* Wet floor reflection */}
      <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: `linear-gradient(to top, ${neon}10, transparent)` }} />

      {/* Path name neon sign — top right */}
      <motion.div
        className="absolute right-3 top-4 rounded-lg border px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest"
        style={{ borderColor: `${neon}55`, color: neon, background: 'rgba(0,0,0,0.65)', boxShadow: `0 0 14px ${neon}44`, backdropFilter: 'blur(4px)' }}
        animate={{ opacity: [0.45, 1, 0.35, 1, 0.45] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {pathName}
      </motion.div>

      {/* Keep going sign — left */}
      <motion.div
        className="absolute left-3 top-16 rounded-lg border px-2 py-1 text-[8px] font-black uppercase tracking-widest"
        style={{ borderColor: '#38bdf844', color: '#38bdf8', background: 'rgba(0,0,0,0.5)', boxShadow: '0 0 10px #38bdf822' }}
        animate={{ opacity: [0.25, 0.85, 0.25] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      >
        Keep Going
      </motion.div>

      {/* Open late sign */}
      <motion.div
        className="absolute right-3 bottom-24 rounded-lg border px-2 py-1 text-[8px] font-black uppercase tracking-widest"
        style={{ borderColor: '#e879f944', color: '#e879f9', background: 'rgba(0,0,0,0.5)', boxShadow: '0 0 10px #e879f922' }}
        animate={{ opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        Open Late
      </motion.div>

      {/* Road glint streaks */}
      {[0,1,2].map(i => (
        <motion.div key={i} className="absolute h-px rounded-full"
          style={{
            bottom: `${14 + i * 6}%`, left: `${20 + i * 8}%`, width: `${60 + i * 20}px`,
            background: i % 2 === 0 ? neon : '#38bdf8',
            boxShadow: `0 0 12px ${i % 2 === 0 ? neon : '#38bdf8'}`,
          }}
          animate={{ opacity: [0.04, 0.45, 0.06], scaleX: [0.7, 1.2, 0.8] }}
          transition={{ duration: 2.2 + i * 0.4, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ── Main RoadView component ───────────────────────────────────────────────────
export function RoadView({ paths, activePathTiles, players, currentPlayerIndex, focusedPathIndex, getTileById, categoryStyles, playerColors }) {
  const currentPlayer = players[currentPlayerIndex];
  const scrollRef     = useRef(null);
  const tileRefs      = useRef([]);

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

  // Map tile index → list of players occupying it (only for this path)
  const occupantMap = useMemo(() => {
    const map = {};
    for (const p of players) {
      const pPath = p.pathIndex ?? 0;
      if (pPath !== activePathIdx) continue;
      const idx = (p.id === currentPlayer.id) ? safePos : p.position;
      const safeIdx = Math.max(0, Math.min(idx, tilesOnPath.length - 1));
      map[safeIdx] = map[safeIdx] ? [...map[safeIdx], p] : [p];
    }
    return map;
  }, [players, activePathIdx, currentPlayer.id, safePos, tilesOnPath.length]);

  // Auto-scroll active tile into view
  useEffect(() => {
    const el = tileRefs.current[safePos];
    if (el && scrollRef.current) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [safePos]);

  const pathName    = paths[activePathIdx]?.name ?? 'Life';
  const progressPct = tilesOnPath.length > 1 ? Math.round((safePos / (tilesOnPath.length - 1)) * 100) : 0;

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <CityAtmosphere neon={pathNeon} pathName={pathName} />

      {/* ── Header bar ── */}
      <div className="relative z-10 flex items-center justify-between px-4 py-2 shrink-0"
        style={{ borderBottom: `1px solid ${pathNeon}28`, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(14px)' }}>
        <div className="flex items-center gap-2">
          <span className="text-base">{paths[activePathIdx]?.emoji}</span>
          <div>
            <p className="font-black uppercase" style={{ fontSize: 8, letterSpacing: '0.2em', color: pathNeon }}>Path</p>
            <p className="font-black text-white" style={{ fontSize: 11, lineHeight: 1.2 }}>{pathName}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col items-end gap-1">
          <p className="font-black uppercase text-white/40" style={{ fontSize: 8, letterSpacing: '0.18em' }}>Progress</p>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-24 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: pathNeon, boxShadow: `0 0 5px ${pathNeon}` }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            </div>
            <span className="font-black text-white/50" style={{ fontSize: 9 }}>{progressPct}%</span>
          </div>
        </div>
      </div>

      {/* ── Scrollable board ── */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto px-4 py-4"
        style={{ scrollbarWidth: 'none' }}>
        <div className="flex flex-col items-stretch mx-auto gap-0" style={{ maxWidth: 420 }}>
          {tilesOnPath.map((tileId, idx) => {
            const tile      = getTileById(tileId);
            const isCurrent = idx === safePos;
            const isStart   = idx === 0;
            const isFinish  = idx === tilesOnPath.length - 1;
            const occupants = occupantMap[idx] ?? [];
            const neon      = CAT_NEON[tile.category] || pathNeon;

            return (
              <div key={`${activePathIdx}-${tileId}-${idx}`}
                ref={el => { tileRefs.current[idx] = el; }}
                className="flex flex-col items-stretch">
                <BoardSpace
                  tile={tile}
                  idx={idx}
                  isCurrent={isCurrent}
                  isStart={isStart}
                  isFinish={isFinish}
                  occupants={occupants}
                  currentPlayerHopping={hopping}
                  categoryStyles={categoryStyles}
                />
                {idx < tilesOnPath.length - 1 && <SpaceConnector neon={neon} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Current player status bar ── */}
      <div className="relative z-10 px-4 py-2.5 shrink-0"
        style={{ borderTop: `1px solid ${pathNeon}28`, background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(14px)' }}>
        <div className="flex items-center gap-3">
          <PawnToken player={currentPlayer} hopping={false} size={34} />
          <div className="flex-1 min-w-0">
            <p className="font-black text-white truncate" style={{ fontSize: 11 }}>{currentPlayer.name}</p>
            <p className="font-bold" style={{ fontSize: 10, color: (currentPlayer.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
              ${currentPlayer.money?.toLocaleString?.() ?? currentPlayer.money ?? 0}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="uppercase text-white/35" style={{ fontSize: 8, letterSpacing: '0.16em' }}>Space</p>
            <p className="font-black" style={{ fontSize: 14, color: pathNeon }}>{safePos + 1}/{tilesOnPath.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}