import React, { useEffect, useState, useRef, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface Player {
  id: string;
  name: string;
  color: string;
  position: number;
  avatar: string | null;
  pathIndex: number | null;
  money: number;
  job: {
    emoji: string;
  } | null;
}
interface PathStyle {
  name: string;
  emoji: string;
  glowColor: string;
  laneColor: string;
  edgeNeon: string;
  textColor: string;
  borderColor: string;
}
interface TileLite {
  id: number;
  name: string;
  category: string;
  effect: string;
  effectValue?: number;
}
interface RoadViewProps {
  paths: PathStyle[];
  activePathTiles: number[][];
  players: Player[];
  currentPlayerIndex: number;
  // null  = overview (show all lanes)
  // 0..2  = zoomed into that player's assigned education path
  focusedPathIndex: number | null;
  getTileById: (id: number) => TileLite;
  categoryStyles: Record<string, {
    icon: React.ElementType;
    bg: string;
    border: string;
  }>;
  playerColors: Record<string, string>;
}
const PATH_NEON_HEX = ['#a855f7', '#ec4899', '#f97316'];
const PAWN_COLORS: Record<string, string> = {
  pink: 'from-pink-400 via-pink-500 to-pink-700',
  purple: 'from-purple-400 via-purple-500 to-purple-700',
  blue: 'from-blue-400 via-blue-500 to-blue-700',
  teal: 'from-teal-400 via-teal-500 to-teal-700',
  gold: 'from-amber-400 via-amber-500 to-amber-700',
  coral: 'from-orange-400 via-rose-500 to-rose-700'
};
// Lane X positions on the cinematic city background, in OVERVIEW mode.
// Three readable starting lanes leave the center open for shared districts.
const OVERVIEW_LANE_X: Record<number, number> = {
  0: 26,
  1: 50,
  2: 74
};
// In zoomed mode the active lane is centered on screen.
const ZOOMED_LANE_X = 50;
// Spacing along the zoomed lane for each card/space.
const TILE_SPACING_PX_ZOOMED = 110;
const HOP_DURATION_MS = 440;
// Vertical bounds for the focused lane in zoomed view.
const ZOOMED_LANE_TOP_PCT = 12;
const ZOOMED_LANE_BOTTOM_PCT = 86;
// In overview, every lane spans this vertical range so all pawns stay visible.
const OVERVIEW_LANE_TOP_PCT = 18;
const OVERVIEW_LANE_BOTTOM_PCT = 86;
// ─────────────────────────────────────────────────────────────────────────────
// Pawn3D — a polished board token used in zoomed view.
function Pawn3D({
  color,
  avatar,
  letter,
  scale = 1,
  hopping






}: {color: string;avatar?: string | null;letter: string;scale?: number;hopping: boolean;}) {
  return <motion.div className="relative flex items-center justify-center" style={{
    width: 132 * scale,
    height: 168 * scale
  }} animate={hopping ? {
    y: [0, -52 * scale, 0],
    scale: [1, 1.06, 1]
  } : {
    y: [0, -8 * scale, 0]
  }} transition={{
    duration: hopping ? HOP_DURATION_MS / 1000 : 1.8,
    repeat: hopping ? 0 : Infinity,
    ease: hopping ? [0.22, 1, 0.36, 1] : 'easeInOut'
  }}>

      <div className="absolute bottom-2 rounded-full bg-black/65 blur-lg" style={{
      width: 104 * scale,
      height: 24 * scale
    }} />

      {hopping && <motion.div className="absolute bottom-8 rounded-full border border-white/40" style={{
      width: 118 * scale,
      height: 44 * scale
    }} initial={{
      scale: 0.7,
      opacity: 0.7
    }} animate={{
      scale: 1.35,
      opacity: 0
    }} transition={{
      duration: HOP_DURATION_MS / 1000,
      ease: 'easeOut'
    }} />}

      <div className={`absolute bottom-4 rounded-full bg-gradient-to-b ${color}`} style={{
      width: 98 * scale,
      height: 34 * scale,
      boxShadow: 'inset 0 -7px 14px rgba(0,0,0,0.45), 0 10px 18px rgba(0,0,0,0.35)'
    }} />

      <div className={`absolute bottom-25 rounded-[2rem] bg-gradient-to-br ${color} flex items-center justify-center overflow-hidden border border-white/45`} style={{
      bottom: 44 * scale,
      width: 86 * scale,
      height: 92 * scale,
      fontSize: 28 * scale,
      boxShadow: 'inset 8px 10px 18px rgba(255,255,255,0.32), inset -10px -14px 20px rgba(0,0,0,0.38), 0 18px 34px rgba(0,0,0,0.45)'
    }}>

        <div className="absolute inset-2 rounded-[1.5rem] border border-white/25 pointer-events-none" />
        <div className="absolute left-4 right-4 top-3 h-4 rounded-full bg-white/35 blur-sm pointer-events-none" />
        {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : <span className="relative z-10 text-white font-black drop-shadow">
          {letter}
        </span>}
      </div>

      <motion.div className="absolute rounded-full pointer-events-none" style={{
      bottom: 46 * scale,
      width: 122 * scale,
      height: 122 * scale,
      background: 'radial-gradient(circle, rgba(255,255,255,0.34) 0%, transparent 66%)'
    }} animate={{
      scale: hopping ? [0.92, 1.45, 0.92] : [1, 1.18, 1],
      opacity: hopping ? [0.8, 0, 0.5] : [0.42, 0.12, 0.42]
    }} transition={{
      duration: hopping ? HOP_DURATION_MS / 1000 : 1.8,
      repeat: hopping ? 0 : Infinity
    }} />

    </motion.div>;
}
// ─────────────────────────────────────────────────────────────────────────────
// MiniPawn — compact readable token used in overview mode.
function MiniPawn({
  color,
  letter,
  avatar,
  isActive





}: {color: string;letter: string;avatar?: string | null;isActive: boolean;}) {
  return <motion.div className="relative flex items-center justify-center" style={{
    width: isActive ? 38 : 30,
    height: isActive ? 38 : 30
  }} animate={isActive ? {
    y: [0, -4, 0],
    scale: [1, 1.05, 1]
  } : undefined} transition={{
    duration: 1.2,
    repeat: isActive ? Infinity : 0,
    ease: 'easeInOut'
  }}>

      {isActive && <motion.div className="absolute inset-0 rounded-full border border-white/55" animate={{
      scale: [1, 1.45, 1],
      opacity: [0.75, 0, 0.75]
    }} transition={{
      duration: 1.4,
      repeat: Infinity,
      ease: 'easeOut'
    }} />}
      <div className={`relative rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-[11px] font-black border-2 border-white/80 overflow-hidden`} style={{
      width: isActive ? 30 : 24,
      height: isActive ? 30 : 24,
      boxShadow: isActive ? '0 0 18px rgba(255,255,255,0.95), 0 7px 14px rgba(0,0,0,0.5)' : '0 4px 8px rgba(0,0,0,0.45)'
    }}>

        {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : letter}
      </div>
    </motion.div>;
}
// ─────────────────────────────────────────────────────────────────────────────
// Hook: animates a "displayed" position toward a "target" position, one tile
// at a time, so the pawn visibly walks square-by-square instead of teleporting.
function useStepAnimation(targetPos: number, resetKey: string): {
  displayPos: number;
  hopping: boolean;
} {
  const [displayPos, setDisplayPos] = useState(targetPos);
  const [hopping, setHopping] = useState(false);
  const lastResetKeyRef = useRef(resetKey);
  // Snap (no animation) when the resetKey changes — e.g. when the active
  // player switches and we should jump to the new player's stored position.
  useEffect(() => {
    if (lastResetKeyRef.current !== resetKey) {
      lastResetKeyRef.current = resetKey;
      setDisplayPos(targetPos);
      setHopping(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);
  useEffect(() => {
    if (displayPos === targetPos) {
      setHopping(false);
      return;
    }
    setHopping(true);
    const timer = setTimeout(() => {
      setDisplayPos((prev) => {
        if (prev === targetPos) return prev;
        return prev + (targetPos > prev ? 1 : -1);
      });
    }, HOP_DURATION_MS);
    return () => clearTimeout(timer);
  }, [displayPos, targetPos]);
  return {
    displayPos,
    hopping
  };
}
// ─────────────────────────────────────────────────────────────────────────────
const getLaneYPct = (position: number, totalTiles: number, topPct: number, bottomPct: number) => {
  const clampedPos = Math.max(0, Math.min(position, Math.max(0, totalTiles - 1)));
  const progress = clampedPos / Math.max(1, totalTiles - 1);
  return bottomPct - progress * (bottomPct - topPct);
};

const LANE_LABELS = ['College', 'High School / GED', 'Dropout'];

// MAIN COMPONENT
export function RoadView(props: RoadViewProps) {
  const {
    paths,
    players,
    currentPlayerIndex,
    activePathTiles,
    focusedPathIndex,
    getTileById,
    categoryStyles
  } = props;
  const currentPlayer = players[currentPlayerIndex];
  const isZoomed = focusedPathIndex !== null && focusedPathIndex !== undefined;
  const activePathIdx = isZoomed ? focusedPathIndex! : currentPlayer.pathIndex !== null && currentPlayer.pathIndex !== undefined ? currentPlayer.pathIndex : 0;
  const neon = PATH_NEON_HEX[activePathIdx] ?? '#a855f7';
  const zoomedTilesOnPath = activePathTiles[activePathIdx] ?? [];
  const totalTilesZoomed = zoomedTilesOnPath.length || 30;
  const {
    displayPos: zoomedDisplayPos,
    hopping
  } = useStepAnimation(currentPlayer.position, `${currentPlayer.id}-${activePathIdx}`);
  const clampedZoomedPos = Math.max(0, Math.min(zoomedDisplayPos, totalTilesZoomed - 1));
  const zoomedPawnYPct = getLaneYPct(clampedZoomedPos, totalTilesZoomed, ZOOMED_LANE_TOP_PCT, ZOOMED_LANE_BOTTOM_PCT);
  return <div className="absolute inset-0 overflow-hidden z-[5] pointer-events-none">
      <AnimatePresence>
        {!isZoomed && <motion.div key="overview" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.45
      }} className="absolute inset-0">
            {/* Board depth and subtle texture so lanes feel grounded */}
            <div className="absolute left-[8%] right-[8%] top-[13%] bottom-[10%] rounded-[2.2rem] border border-white/10" style={{
          background: 'linear-gradient(180deg, rgba(10,8,28,0.72) 0%, rgba(10,10,20,0.78) 100%)',
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.45), 0 18px 44px rgba(0,0,0,0.35)'
        }} />
            <div className="absolute left-[10%] right-[10%] top-[16%] bottom-[12%] rounded-[2rem] opacity-45" style={{
          backgroundImage: 'repeating-linear-gradient(160deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 12px)'
        }} />
            {paths.map((_, laneIdx) => {
          const laneX = OVERVIEW_LANE_X[laneIdx];
          const tilesOnLane = activePathTiles[laneIdx] ?? [];
          const totalTilesLane = tilesOnLane.length || 30;
          const playersOnLane = players.filter((p) => p.pathIndex === laneIdx);
          const laneColor = PATH_NEON_HEX[laneIdx] ?? '#a855f7';
          const laneIsActive = currentPlayer.pathIndex === laneIdx;
          return <Fragment key={laneIdx}>
                  <div className="absolute rounded-[2rem] border border-white/10" style={{
              left: `${laneX}%`,
              top: `${OVERVIEW_LANE_TOP_PCT - 3}%`,
              bottom: `${100 - OVERVIEW_LANE_BOTTOM_PCT + 2}%`,
              width: 74,
              transform: 'translateX(-50%)',
              background: 'linear-gradient(180deg, rgba(4,4,16,0.62), rgba(10,10,24,0.62))',
              boxShadow: laneIsActive ? `0 0 20px ${laneColor}55` : '0 0 10px rgba(0,0,0,0.45)'
            }} />
                  {tilesOnLane.map((tileId, idx) => {
              const yPct = getLaneYPct(idx, totalTilesLane, OVERVIEW_LANE_TOP_PCT, OVERVIEW_LANE_BOTTOM_PCT);
              const nextYPct = idx < totalTilesLane - 1 ? getLaneYPct(idx + 1, totalTilesLane, OVERVIEW_LANE_TOP_PCT, OVERVIEW_LANE_BOTTOM_PCT) : null;
              const isCheckpoint = idx % 5 === 0 || idx === totalTilesLane - 1;
              const tile = getTileById(tileId);
              const styleInfo = categoryStyles[tile.category] || categoryStyles.start;
              return <Fragment key={`${laneIdx}-${tileId}-${idx}`}>
                        {nextYPct !== null && <div className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{
                  left: `${laneX}%`,
                  top: `${nextYPct}%`,
                  height: `${Math.max(0.8, yPct - nextYPct)}%`,
                  width: 4,
                  background: `linear-gradient(180deg, ${laneColor}66, ${laneColor}24)`,
                  boxShadow: `0 0 8px ${laneColor}66`
                }} />}
                        <div className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border ${styleInfo.border}`} style={{
                  left: `${laneX}%`,
                  top: `${yPct}%`,
                  width: isCheckpoint ? 28 : 22,
                  height: isCheckpoint ? 14 : 10,
                  background: 'rgba(18,18,34,0.9)',
                  boxShadow: isCheckpoint ? `0 0 12px ${laneColor}88` : `0 0 6px ${laneColor}55`
                }} />
                      </Fragment>;
            })}

                  {playersOnLane.map((p, stackIdx) => {
              const lanePos = p.id === currentPlayer.id ? zoomedDisplayPos : p.position;
              const clampedLanePos = Math.max(0, Math.min(lanePos, totalTilesLane - 1));
              const yPct = getLaneYPct(clampedLanePos, totalTilesLane, OVERVIEW_LANE_TOP_PCT, OVERVIEW_LANE_BOTTOM_PCT);
              const xOffsetPx = (stackIdx - (playersOnLane.length - 1) / 2) * 18;
              const isActive = players[currentPlayerIndex]?.id === p.id;
              return <motion.div key={p.id} className="absolute" style={{
                left: `${laneX}%`,
                top: `${yPct}%`,
                transform: `translate(calc(-50% + ${xOffsetPx}px), -56%)`,
                filter: isActive ? `drop-shadow(0 0 10px ${laneColor})` : undefined
              }} animate={{
                left: `${laneX}%`,
                top: `${yPct}%`
              }} transition={{
                duration: HOP_DURATION_MS / 1000,
                ease: [0.22, 1, 0.36, 1]
              }}>
                          <MiniPawn color={PAWN_COLORS[p.color] || PAWN_COLORS.purple} letter={p.name.charAt(0).toUpperCase()} avatar={p.avatar} isActive={isActive} />
                        </motion.div>;
            })}
                </Fragment>;
        })}

            <div className="absolute bottom-3 left-0 right-0 flex justify-center">
              <div className="flex gap-2 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-sm border border-white/10">
                {paths.map((p, i) => {
              const isCurrentLane = currentPlayer.pathIndex === i;
              return <div key={i} className="flex items-center gap-1 text-[10px] font-black px-1" style={{
                color: PATH_NEON_HEX[i],
                opacity: isCurrentLane ? 1 : 0.62
              }}>
                      <span>{p.emoji}</span>
                      <span className="hidden sm:inline">{LANE_LABELS[i] ?? p.name.split(' →')[0]}</span>
                    </div>;
            })}
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {isZoomed && <motion.div key={`zoomed-${activePathIdx}`} initial={{
        opacity: 0,
        scale: 0.96
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1]
      }} className="absolute inset-0">
            {/* Grounded board slab and subtle path texture */}
            <div className="absolute left-1/2 top-[9%] bottom-[10%] w-[min(92vw,440px)] -translate-x-1/2 rounded-[2.3rem] border border-white/10" style={{
          background: 'linear-gradient(180deg, rgba(8,8,20,0.86) 0%, rgba(12,10,30,0.86) 100%)',
          boxShadow: `0 26px 54px rgba(0,0,0,0.46), inset 0 0 40px ${neon}22`
        }} />
            <div className="absolute left-1/2 top-[12%] bottom-[13%] w-[min(86vw,330px)] -translate-x-1/2 rounded-[2rem] opacity-55" style={{
          backgroundImage: 'repeating-linear-gradient(150deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 14px)'
        }} />
            <div className="absolute left-1/2 top-[11%] bottom-[12%] w-[min(84vw,220px)] -translate-x-1/2 rounded-[1.7rem] border border-white/8" style={{
          background: 'linear-gradient(180deg, rgba(10,10,24,0.85), rgba(14,12,34,0.9))',
          boxShadow: `0 0 24px ${neon}33`
        }} />

            {/* Full connected route: every space is visible and linked */}
            {zoomedTilesOnPath.map((tileId, idx) => {
          const yPct = getLaneYPct(idx, totalTilesZoomed, ZOOMED_LANE_TOP_PCT, ZOOMED_LANE_BOTTOM_PCT);
          const nextYPct = idx < totalTilesZoomed - 1 ? getLaneYPct(idx + 1, totalTilesZoomed, ZOOMED_LANE_TOP_PCT, ZOOMED_LANE_BOTTOM_PCT) : null;
          const isCheckpoint = idx % 5 === 0 || idx === totalTilesZoomed - 1;
          const isCurrent = idx === clampedZoomedPos;
          return <Fragment key={`zoomed-space-${tileId}-${idx}`}>
                  {nextYPct !== null && <div className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{
              top: `${nextYPct}%`,
              height: `${Math.max(0.8, yPct - nextYPct)}%`,
              width: 6,
              background: `linear-gradient(180deg, ${neon}66, ${neon}24)`,
              boxShadow: `0 0 10px ${neon}66`
            }} />}
                  <motion.div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/30" style={{
              top: `${yPct}%`,
              width: isCheckpoint ? 106 : 84,
              height: isCheckpoint ? 16 : 12,
              background: isCurrent ? `linear-gradient(90deg, ${neon}cc, ${neon}99)` : 'linear-gradient(90deg, rgba(34,34,58,0.95), rgba(24,24,42,0.9))',
              boxShadow: isCurrent ? `0 0 22px ${neon}aa` : '0 0 8px rgba(0,0,0,0.5)'
            }} animate={isCurrent ? {
              scale: [1, 1.06, 1]
            } : undefined} transition={{
              duration: 0.8
            }} />
                </Fragment>;
        })}

            {/* Local readable cards that stay centered around the pawn */}
            {zoomedTilesOnPath.map((tileId, idx) => {
          const distanceFromCurrent = idx - clampedZoomedPos;
          if (Math.abs(distanceFromCurrent) > 3) return null;
          const tile = getTileById(tileId);
          const styleInfo = categoryStyles[tile.category] || categoryStyles.start;
          const TileIcon = styleInfo.icon;
          const isCurrent = distanceFromCurrent === 0;
          return <motion.div key={`card-${tileId}-${idx}`} className={`absolute left-1/2 flex min-h-[68px] w-[min(86vw,330px)] -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-2xl border px-4 py-2 shadow-2xl backdrop-blur-xl ${styleInfo.bg} ${styleInfo.border}`} style={{
            top: `calc(${zoomedPawnYPct}% - ${distanceFromCurrent * (TILE_SPACING_PX_ZOOMED * 0.58)}px)`,
            borderColor: isCurrent ? neon : undefined,
            opacity: isCurrent ? 1 : 0.66,
            boxShadow: isCurrent ? `0 0 30px ${neon}88, inset 0 1px 0 rgba(255,255,255,0.35)` : '0 10px 22px rgba(0,0,0,0.3)'
          }} animate={{
            scale: isCurrent ? 1.03 : 0.98
          }} transition={{
            duration: 0.22
          }}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/85 shadow-inner">
                      <TileIcon className="h-5 w-5 text-slate-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                        Space {idx + 1}
                      </p>
                      <p className="truncate text-sm font-black text-slate-900">{tile.name}</p>
                    </div>
                    {isCurrent && <span className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white" style={{
                background: neon,
                boxShadow: `0 0 16px ${neon}`
              }}>
                        landing
                      </span>}
                  </motion.div>;
        })}

            {/* Pawn anchor: keeps the pawn visually attached to the active space */}
            <motion.div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/45" style={{
          top: `${zoomedPawnYPct}%`,
          width: 126,
          height: 28,
          background: `radial-gradient(circle, ${neon}88 0%, ${neon}22 60%, transparent 100%)`,
          boxShadow: `0 0 20px ${neon}88`
        }} animate={{
          scale: hopping ? [1, 1.12, 1] : [1, 1.04, 1]
        }} transition={{
          duration: hopping ? HOP_DURATION_MS / 1000 : 1.5
        }} />

            {/* Active player pawn — unchanged design, now centered on visible spaces */}
            <motion.div className="absolute" initial={false} style={{
          left: `${ZOOMED_LANE_X}%`,
          top: `${zoomedPawnYPct}%`,
          transform: 'translate(-50%, -92%)',
          filter: `drop-shadow(0 0 28px ${neon}cc)`
        }} animate={{
          top: `${zoomedPawnYPct}%`
        }} transition={{
          duration: HOP_DURATION_MS / 1000,
          ease: [0.22, 1, 0.36, 1]
        }}>
              <Pawn3D color={PAWN_COLORS[currentPlayer.color] || PAWN_COLORS.purple} avatar={currentPlayer.avatar} letter={currentPlayer.name.charAt(0).toUpperCase()} scale={1} hopping={hopping} />
            </motion.div>

            <motion.div className="absolute left-1/2 top-20 -translate-x-1/2 rounded-full border border-white/12 bg-black/35 px-4 py-2 text-center backdrop-blur-md" initial={{
          opacity: 0,
          y: -10
        }} animate={{
          opacity: 1,
          y: 0
        }}>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/55">
                {currentPlayer.position === 0 ? 'First move' : 'Moving'}
              </p>
              <p className="text-sm font-black text-white">
                Watch {currentPlayer.name}'s pawn
              </p>
            </motion.div>

            <div className="absolute bottom-32 left-3 md:left-6 z-30">
              <div className="rounded-2xl p-4 backdrop-blur-md border-2" style={{
            background: 'rgba(15,8,35,0.85)',
            borderColor: `${neon}66`,
            boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 30px ${neon}44, inset 0 1px 0 rgba(255,255,255,0.1)`
          }}>
                <p className="text-white/70 font-black text-[10px] tracking-widest mb-2 leading-tight">
                  ON THE ROAD
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{paths[activePathIdx]?.emoji}</span>
                  <span className="text-base font-black uppercase tracking-wider" style={{
                color: neon,
                textShadow: `0 0 12px ${neon}`
              }}>
                    {LANE_LABELS[activePathIdx] ?? paths[activePathIdx]?.name?.split(' →')[0]}
                  </span>
                </div>
                <div className="mt-2 text-white/70 text-[11px] font-black tracking-wider">
                  TILE {clampedZoomedPos + 1} / {totalTilesZoomed}
                </div>
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>

      <div className="absolute top-4 right-4 md:right-8 z-30 flex flex-col gap-2">
        {players.map((p, i) => {
        const isActive = i === currentPlayerIndex;
        const playerPathColor = p.pathIndex !== null ? PATH_NEON_HEX[p.pathIndex] : '#888';
        return <div key={p.id} className="rounded-full px-4 py-2 backdrop-blur-md border-2 flex items-center gap-3 transition-all duration-500" style={{
          background: isActive ? `${playerPathColor}ee` : 'rgba(15,8,35,0.85)',
          borderColor: isActive ? '#fff' : 'rgba(255,255,255,0.2)',
          boxShadow: isActive ? `0 0 24px ${playerPathColor}cc` : '0 4px 10px rgba(0,0,0,0.4)',
          transform: isActive ? 'scale(1.05)' : 'scale(1)'
        }}>
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${PAWN_COLORS[p.color] || PAWN_COLORS.purple} text-white text-xs font-black flex items-center justify-center border-2 border-white/40 shadow-inner`}>
                {p.avatar ? <img src={p.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : p.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white/80 leading-none mb-0.5">
                  {p.name}
                </span>
                <span className="text-sm font-black leading-none" style={{
              color: p.money < 0 ? '#fca5a5' : isActive ? '#fff' : '#a7f3d0',
              textShadow: isActive ? '0 1px 2px rgba(0,0,0,0.4)' : 'none'
            }}>
                  ${p.money}
                </span>
              </div>
            </div>;
      })}
      </div>
    </div>;
}