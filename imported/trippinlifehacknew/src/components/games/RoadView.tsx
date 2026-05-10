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
  // The path the camera is currently focused on. In zoomed mode this is the
  // active player's chosen path; in overview mode this is unused.
  const activePathIdx = isZoomed ? focusedPathIndex! : currentPlayer.pathIndex !== null && currentPlayer.pathIndex !== undefined ? currentPlayer.pathIndex : 0;
  const neon = PATH_NEON_HEX[activePathIdx] ?? '#a855f7';
  const zoomedTilesOnPath = activePathTiles[activePathIdx] ?? [];
  const totalTilesZoomed = zoomedTilesOnPath.length || 30;
  // Animate the active player's walking — only matters in zoomed mode.
  const stepAnim = useStepAnimation(currentPlayer.position, `${currentPlayer.id}-${activePathIdx}`);
  const {
    displayPos: zoomedDisplayPos,
    hopping
  } = stepAnim;
  const clampedZoomedPos = Math.max(0, Math.min(zoomedDisplayPos, totalTilesZoomed - 1));
  const zoomedProgress = clampedZoomedPos / Math.max(1, totalTilesZoomed - 1);
  const zoomedPawnYPct = ZOOMED_LANE_BOTTOM_PCT - zoomedProgress * (ZOOMED_LANE_BOTTOM_PCT - ZOOMED_LANE_TOP_PCT);
  return <div className="absolute inset-0 overflow-hidden z-[5] pointer-events-none">
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* OVERVIEW MODE — show all lanes & all players at once.            */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {!isZoomed && <motion.div key="overview" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.5
      }} className="absolute inset-0">
          
            {/* Render each lane's pawns (no visible track lines — the
          background art IS the board). */}
            {paths.map((_, laneIdx) => {
          const laneX = OVERVIEW_LANE_X[laneIdx];
          const tilesOnLane = activePathTiles[laneIdx] ?? [];
          const totalTilesLane = tilesOnLane.length || 30;
          const playersOnLane = players.filter((p) => p.pathIndex === laneIdx);
          const laneColor = PATH_NEON_HEX[laneIdx] ?? '#a855f7';
          return <Fragment key={laneIdx}>
                  <motion.div className="absolute rounded-full" style={{
              left: `${laneX}%`,
              top: `${OVERVIEW_LANE_TOP_PCT}%`,
              bottom: `${100 - OVERVIEW_LANE_BOTTOM_PCT}%`,
              width: 6,
              transform: 'translateX(-50%)',
              background: `linear-gradient(180deg, ${laneColor}22, ${laneColor}66 18%, ${laneColor}44 72%, ${laneColor}18)`,
              boxShadow: `0 0 18px ${laneColor}66`,
              opacity: currentPlayer.pathIndex === laneIdx ? 0.9 : 0.5
            }} animate={{
              opacity: currentPlayer.pathIndex === laneIdx ? [0.65, 0.95, 0.65] : 0.45
            }} transition={{
              duration: 1.8,
              repeat: currentPlayer.pathIndex === laneIdx ? Infinity : 0
            }} />
                  {[OVERVIEW_LANE_TOP_PCT, OVERVIEW_LANE_BOTTOM_PCT].map((dotY) => <div key={dotY} className="absolute h-3 w-3 rounded-full border border-white/60 bg-black/40" style={{
              left: `${laneX}%`,
              top: `${dotY}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 16px ${laneColor}`
            }} />)}
                  {playersOnLane.map((p, stackIdx) => {
              // Map tile index along lane → vertical % on screen.
              // tile 0 sits at lane bottom, last tile at lane top.
              const lanePos = p.id === currentPlayer.id ? zoomedDisplayPos : p.position;
              const progress = lanePos / Math.max(1, totalTilesLane - 1);
              const yPct = OVERVIEW_LANE_BOTTOM_PCT - progress * (OVERVIEW_LANE_BOTTOM_PCT - OVERVIEW_LANE_TOP_PCT);
              // Stack multiple players on the same tile horizontally.
              const xOffsetPx = (stackIdx - (playersOnLane.length - 1) / 2) * 18;
              const isActive = players[currentPlayerIndex]?.id === p.id;
              return <motion.div key={p.id} className="absolute" style={{
                left: `${laneX}%`,
                top: `${yPct}%`,
                transform: `translate(calc(-50% + ${xOffsetPx}px), -50%)`,
                filter: isActive ? `drop-shadow(0 0 10px ${PATH_NEON_HEX[laneIdx]})` : undefined
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

            {/* Lane labels at the bottom — tiny chips that sit under each
          visual lane on the background art, telling players which
          lane is which. They're small and sit out of the way. */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
              <div className="flex gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                {paths.map((p, i) => {
              const isCurrentLane = currentPlayer.pathIndex === i;
              return <div key={i} className="flex items-center gap-1 text-[10px] font-black" style={{
                color: PATH_NEON_HEX[i],
                opacity: isCurrentLane ? 1 : 0.55
              }}>
                    
                      <span>{p.emoji}</span>
                      <span className="hidden sm:inline">
                        {p.name.split(' →')[0]}
                      </span>
                    </div>;
            })}
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ZOOMED MODE — fullscreen view of the active player's lane,      */}
      {/* with the big cinematic walking pawn.                            */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isZoomed && <motion.div key={`zoomed-${activePathIdx}`} initial={{
        opacity: 0,
        scale: 0.94
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 1.06
      }} transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1]
      }} className="absolute inset-0">
          
            {/* Neon vignette — visually narrows the world to one lane. */}
            <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 50% 70%, transparent 0%, transparent 35%, ${neon}22 60%, rgba(10,4,28,0.7) 100%)`
        }} />

            <div className="absolute left-1/2 top-[12%] bottom-[14%] w-3 -translate-x-1/2 rounded-full" style={{
          background: `linear-gradient(180deg, ${neon}18, ${neon}66 20%, ${neon}44 72%, ${neon}18)`,
          boxShadow: `0 0 28px ${neon}88`
        }} />
            <div className="absolute left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border border-white/60 bg-black/50" style={{
          top: `${ZOOMED_LANE_TOP_PCT}%`,
          boxShadow: `0 0 18px ${neon}`
        }} />
            <div className="absolute left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border border-white/60 bg-black/50" style={{
          top: `${ZOOMED_LANE_BOTTOM_PCT}%`,
          boxShadow: `0 0 18px ${neon}`
        }} />
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
          
            {/* Moving card/space layer for readable progression in zoomed mode. */}
            <motion.div className="absolute left-1/2 top-[70%] w-[82vw] max-w-[360px] -translate-x-1/2" animate={{
          y: zoomedDisplayPos * TILE_SPACING_PX_ZOOMED
        }} transition={{
          duration: HOP_DURATION_MS / 1000,
          ease: [0.22, 1, 0.36, 1]
        }}>
              {zoomedTilesOnPath.map((tileId, idx) => {
            const tile = getTileById(tileId);
            const styleInfo = categoryStyles[tile.category] || categoryStyles.start;
            const TileIcon = styleInfo.icon;
            const isCurrent = idx === zoomedDisplayPos;
            const distanceFromPawn = Math.abs(idx - zoomedDisplayPos);
            if (distanceFromPawn > 4) return null;
            return <motion.div key={`${tileId}-${idx}`} className={`absolute left-1/2 flex min-h-[76px] w-full -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${styleInfo.bg} ${styleInfo.border}`} style={{
              top: -idx * TILE_SPACING_PX_ZOOMED,
              borderColor: isCurrent ? neon : undefined,
              boxShadow: isCurrent ? `0 0 30px ${neon}88, inset 0 1px 0 rgba(255,255,255,0.35)` : '0 12px 28px rgba(0,0,0,0.32)',
              opacity: Math.max(0.35, 1 - distanceFromPawn * 0.16)
            }} animate={{
              scale: isCurrent ? 1.06 : 1,
              x: isCurrent ? [0, -3, 3, 0] : 0
            }} transition={{
              duration: isCurrent ? 0.42 : 0.25,
              ease: [0.22, 1, 0.36, 1]
            }}>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/85 shadow-inner">
                    <TileIcon className="h-5 w-5 text-slate-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Space {idx + 1}
                    </p>
                    <p className="truncate text-sm font-black text-slate-900">
                      {tile.name}
                    </p>
                  </div>
                  {isCurrent && <span className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white" style={{
                background: neon,
                boxShadow: `0 0 16px ${neon}`
              }}>
                      landing
                    </span>}
                </motion.div>;
          })}
            </motion.div>


            {/* Active player pawn — advances tile-by-tile in sync with movement state. */}
            <motion.div className="absolute" initial={false} style={{
          left: `${ZOOMED_LANE_X}%`,
          top: `${zoomedPawnYPct}%`,
          transform: 'translate(-50%, -100%)',
          filter: `drop-shadow(0 0 28px ${neon}cc)`
        }} animate={{
          top: `${zoomedPawnYPct}%`
        }} transition={{
          duration: HOP_DURATION_MS / 1000,
          ease: [0.22, 1, 0.36, 1]
        }}>
            
              <Pawn3D color={PAWN_COLORS[currentPlayer.color] || PAWN_COLORS.purple} avatar={currentPlayer.avatar} letter={currentPlayer.name.charAt(0).toUpperCase()} scale={1} hopping={hopping} />
            
            </motion.div>

            {/* Path indicator (bottom-left) */}
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
                  <span className="text-2xl">
                    {paths[activePathIdx]?.emoji}
                  </span>
                  <span className="text-base font-black uppercase tracking-wider" style={{
                color: neon,
                textShadow: `0 0 12px ${neon}`
              }}>
                  
                    {paths[activePathIdx]?.name?.split(' →')[0]}
                  </span>
                </div>
                <div className="mt-2 text-white/70 text-[11px] font-black tracking-wider">
                  TILE {zoomedDisplayPos + 1} / {totalTilesZoomed}
                </div>
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* HUD: Player chips (always visible, both modes)                  */}
      {/* ════════════════════════════════════════════════════════════════ */}
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