import React, { useEffect, useState, useRef, Fragment, useMemo } from 'react';
import { motion } from 'framer-motion';
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
const HOP_DURATION_MS = 440;
const ZOOMED_CARD_HEIGHT_PX = 78;
const ZOOMED_VISIBLE_CARD_RANGE = 2;
type LanePoint = {
  x: number;
  y: number;
};
const OVERVIEW_LANE_CURVES: Record<number, LanePoint[]> = {
  // Bottom -> top. Curves intentionally weave to mimic elevated city lanes.
  0: [{
    x: 26,
    y: 86
  }, {
    x: 30,
    y: 74
  }, {
    x: 44,
    y: 58
  }, {
    x: 39,
    y: 44
  }, {
    x: 53,
    y: 28
  }, {
    x: 47,
    y: 14
  }],
  1: [{
    x: 50,
    y: 86
  }, {
    x: 45,
    y: 72
  }, {
    x: 34,
    y: 56
  }, {
    x: 53,
    y: 42
  }, {
    x: 41,
    y: 26
  }, {
    x: 56,
    y: 14
  }],
  2: [{
    x: 74,
    y: 86
  }, {
    x: 67,
    y: 72
  }, {
    x: 55,
    y: 57
  }, {
    x: 63,
    y: 43
  }, {
    x: 47,
    y: 27
  }, {
    x: 59,
    y: 14
  }]
};
const toSvgLanePath = (points: LanePoint[]) => {
  if (!points.length) return '';
  return points.map((point, idx) => `${idx === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
};
const toSvgSegmentPath = (start: LanePoint, end: LanePoint) => `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
const getPerspectiveScale = (y: number) => {
  // Keeps the board readable like a city street receding into the skyline.
  return 0.72 + Math.max(0, Math.min(y, 100)) / 100 * 0.56;
};
const getPointOnLaneCurve = (points: LanePoint[], progress: number) => {
  if (points.length === 0) {
    return {
      x: 50,
      y: 50,
      angle: -90
    };
  }
  if (points.length === 1) {
    return {
      x: points[0].x,
      y: points[0].y,
      angle: -90
    };
  }
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const segmentLengths = [];
  let totalLength = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i];
    const end = points[i + 1];
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    segmentLengths.push(length);
    totalLength += length;
  }
  if (totalLength <= 0) {
    return {
      x: points[0].x,
      y: points[0].y,
      angle: -90
    };
  }
  const targetDistance = clampedProgress * totalLength;
  let walked = 0;
  for (let i = 0; i < segmentLengths.length; i += 1) {
    const segmentLength = segmentLengths[i];
    const nextWalked = walked + segmentLength;
    if (targetDistance <= nextWalked || i === segmentLengths.length - 1) {
      const start = points[i];
      const end = points[i + 1];
      const localT = segmentLength <= 0 ? 0 : (targetDistance - walked) / segmentLength;
      const x = start.x + (end.x - start.x) * localT;
      const y = start.y + (end.y - start.y) * localT;
      const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
      return {
        x,
        y,
        angle
      };
    }
    walked = nextWalked;
  }
  const fallback = points[points.length - 1];
  return {
    x: fallback.x,
    y: fallback.y,
    angle: -90
  };
};
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
    y: [0, -56 * scale, 0],
    scaleX: [1, 0.97, 1.05, 1],
    scaleY: [1, 1.08, 0.92, 1]
  } : {
    y: [0, -6 * scale, 0],
    scaleX: [1, 1.01, 1],
    scaleY: [1, 0.99, 1]
  }} transition={{
    duration: hopping ? HOP_DURATION_MS * 0.72 / 1000 : 1.8,
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
    // Pulse hop state for each tile so movement reads as distinct jumps.
    setHopping(true);
    const settleTimer = setTimeout(() => {
      setHopping(false);
    }, HOP_DURATION_MS * 0.72);
    const stepTimer = setTimeout(() => {
      setDisplayPos((prev) => {
        if (prev === targetPos) return prev;
        return prev + (targetPos > prev ? 1 : -1);
      });
    }, HOP_DURATION_MS);
    return () => {
      clearTimeout(settleTimer);
      clearTimeout(stepTimer);
    };
  }, [displayPos, targetPos]);
  return {
    displayPos,
    hopping
  };
}
// ─────────────────────────────────────────────────────────────────────────────
const LANE_LABELS = ['College', 'High School / GED', 'Dropout'];
const LANE_DISTRICTS = ['Campus Corridor', 'GED Midtown', 'Hustle Row'];
const CITY_BLOCKS = [
  { left: '9%', top: '13%', width: '14%', height: '16%', label: 'lofts', glow: '#38bdf8' },
  { left: '25%', top: '16%', width: '10%', height: '10%', label: 'media', glow: '#f472b6' },
  { left: '66%', top: '13%', width: '15%', height: '17%', label: 'ads', glow: '#f97316' },
  { left: '80%', top: '31%', width: '10%', height: '18%', label: 'hotel', glow: '#a78bfa' },
  { left: '8%', top: '38%', width: '13%', height: '17%', label: 'market', glow: '#34d399' },
  { left: '71%', top: '54%', width: '16%', height: '15%', label: 'studio', glow: '#ec4899' },
  { left: '14%', top: '66%', width: '12%', height: '16%', label: 'garage', glow: '#f59e0b' },
  { left: '78%', top: '75%', width: '11%', height: '12%', label: 'mall', glow: '#60a5fa' }
];
const BILLBOARD_SITES = [
  { left: '12%', top: '31%', text: 'YOU DECIDE', color: '#38bdf8', rotate: -4 },
  { left: '70%', top: '25%', text: 'LIVE YOUR DREAMS', color: '#f97316', rotate: 3 },
  { left: '11%', top: '58%', text: 'GOOD EATS', color: '#a855f7', rotate: -6 },
  { left: '76%', top: '66%', text: 'NO RISK NO REWARD', color: '#ec4899', rotate: 5 }
];
const ROUTE_HERO_SIGNS = [
  { left: '50%', top: '8%', width: 230, title: "TRIPPIN'", subtitle: 'THROUGH LIFE', color: '#f472b6' },
  { left: '13%', top: '48%', width: 132, title: 'CHOOSE YOUR PATH', subtitle: 'COLLEGE  GED  DROPOUT', color: '#a855f7' },
  { left: '82%', top: '45%', width: 140, title: 'OPPORTUNITY', subtitle: 'IS EVERYWHERE', color: '#22d3ee' }
];

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
  const overviewLaneCurves = useMemo(() => paths.map((_, laneIdx) => OVERVIEW_LANE_CURVES[laneIdx] ?? OVERVIEW_LANE_CURVES[0]), [paths]);
  const overviewSvgPaths = useMemo(() => overviewLaneCurves.map((curve) => toSvgLanePath(curve)), [overviewLaneCurves]);
  const activeLaneCurve = overviewLaneCurves[activePathIdx] ?? overviewLaneCurves[0];
  const activeLaneProgress = clampedZoomedPos / Math.max(1, totalTilesZoomed - 1);
  const activeLanePoint = getPointOnLaneCurve(activeLaneCurve, activeLaneProgress);
  const cameraScale = isZoomed ? 1.38 : 1;
  const cameraX = isZoomed ? `${(50 - activeLanePoint.x) * 0.95}%` : '0%';
  const cameraY = isZoomed ? `${(58 - activeLanePoint.y) * 0.95}%` : '0%';
  return <div className="absolute inset-0 overflow-hidden z-[5] pointer-events-none">
      <motion.div className="absolute inset-0" style={{
      transformOrigin: `${activeLanePoint.x}% ${activeLanePoint.y}%`
    }} animate={{
      scale: cameraScale,
      x: cameraX,
      y: cameraY
    }} transition={{
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }}>
        {/* Shared city-board world for both overview and zoom. Roads below are the same coordinates used for pawn travel. */}
        <div className="absolute left-[5%] right-[5%] top-[8%] bottom-[7%] rounded-[2.6rem] border border-white/12" style={{
        background: 'radial-gradient(circle at 50% 40%, rgba(41,22,76,0.56) 0%, rgba(8,11,24,0.92) 58%, rgba(3,5,13,0.98) 100%)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.62), 0 24px 54px rgba(0,0,0,0.48)'
      }} />
        <div className="absolute left-[6%] right-[6%] top-[10%] bottom-[9%] rounded-[2.2rem] overflow-hidden opacity-70" style={{
        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px), radial-gradient(circle at 48% 46%, rgba(236,72,153,0.16), transparent 46%)',
        backgroundSize: '8% 8%, 8% 8%, 100% 100%'
      }} />
        {ROUTE_HERO_SIGNS.map((sign, index) => <div key={`route-hero-sign-${index}`} className="absolute -translate-x-1/2 rounded-xl border border-white/15 bg-black/70 px-3 py-2 text-center backdrop-blur-sm" style={{
        left: sign.left,
        top: sign.top,
        width: sign.width,
        boxShadow: `0 0 28px ${sign.color}66, inset 0 1px 0 rgba(255,255,255,0.16)`,
        zIndex: 9
      }}>
            <div className="text-base font-black uppercase italic leading-none tracking-[0.12em]" style={{
          color: sign.color,
          textShadow: `0 0 16px ${sign.color}`
        }}>
              {sign.title}
            </div>
            <div className="mt-1 text-[8px] font-black uppercase tracking-[0.22em] text-white/80">
              {sign.subtitle}
            </div>
          </div>)}
        {CITY_BLOCKS.map((block, index) => <div key={`city-block-${index}`} className="absolute rounded-xl border border-white/10 overflow-hidden" style={{
        left: block.left,
        top: block.top,
        width: block.width,
        height: block.height,
        background: 'linear-gradient(180deg, rgba(22,28,48,0.88), rgba(8,11,24,0.94))',
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.09), 0 0 22px ${block.glow}22`
      }}>
            <div className="absolute inset-x-2 top-2 flex gap-1">
              {Array.from({ length: 5 }).map((_, windowIndex) => <span key={windowIndex} className="h-1.5 flex-1 rounded-full" style={{
            background: windowIndex % 2 === 0 ? `${block.glow}88` : 'rgba(255,255,255,0.16)',
            boxShadow: windowIndex % 2 === 0 ? `0 0 10px ${block.glow}` : undefined
          }} />)}
            </div>
            <div className="absolute inset-x-2 bottom-2 rounded-md border border-white/10 bg-black/24 py-1 text-center text-[7px] font-black uppercase tracking-[0.22em] text-white/45">
              {block.label}
            </div>
          </div>)}
        {BILLBOARD_SITES.map((site, index) => <motion.div key={`billboard-site-${index}`} className="absolute rounded-lg border border-white/15 bg-black/55 px-2 py-1 text-center text-[7px] font-black uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm" style={{
        left: site.left,
        top: site.top,
        boxShadow: `0 0 20px ${site.color}66, inset 0 1px 0 rgba(255,255,255,0.14)`,
        color: site.color,
        transform: `rotate(${site.rotate}deg)`,
        zIndex: 10
      }} animate={{
        opacity: [0.65, 1, 0.7]
      }} transition={{
        duration: 2.6 + index * 0.35,
        repeat: Infinity,
        ease: 'easeInOut'
      }}>
            {site.text}
          </motion.div>)}
        <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="city-road-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {overviewSvgPaths.map((lanePath, laneIdx) => {
          const laneColor = PATH_NEON_HEX[laneIdx] ?? '#a855f7';
          return <g key={`lane-road-${laneIdx}`}>
                {overviewLaneCurves[laneIdx]?.slice(0, -1).map((start, segmentIdx) => {
              const end = overviewLaneCurves[laneIdx][segmentIdx + 1];
              const segmentScale = getPerspectiveScale((start.y + end.y) / 2);
              const segmentPath = toSvgSegmentPath(start, end);
              return <g key={`road-segment-${laneIdx}-${segmentIdx}`}>
                    <path d={segmentPath} fill="none" stroke="rgba(1,4,12,0.9)" strokeWidth={17 * segmentScale} strokeLinecap="round" strokeLinejoin="round" />
                    <path d={segmentPath} fill="none" stroke={`${laneColor}66`} strokeWidth={14.2 * segmentScale} strokeLinecap="round" strokeLinejoin="round" filter="url(#city-road-glow)" />
                    <path d={segmentPath} fill="none" stroke="rgba(13,18,31,0.98)" strokeWidth={11.2 * segmentScale} strokeLinecap="round" strokeLinejoin="round" />
                    <path d={segmentPath} fill="none" stroke={`${laneColor}cc`} strokeWidth={0.8 * segmentScale} strokeLinecap="round" strokeLinejoin="round" />
                  </g>;
            })}
                <path d={lanePath} fill="none" stroke={`${laneColor}aa`} strokeWidth={1.45} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.2 3.2" filter="url(#city-road-glow)" />
                <path d={lanePath} fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth={0.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.35 5.5" />
                {[0.18, 0.36, 0.54, 0.72, 0.9].map((progress) => {
              const point = getPointOnLaneCurve(overviewLaneCurves[laneIdx] ?? overviewLaneCurves[0], progress);
              return <circle key={`lane-marker-${laneIdx}-${progress}`} cx={point.x} cy={point.y} r={0.55} fill={laneColor} opacity={0.5} />;
            })}
              </g>;
        })}
        </svg>
        {/* Overpass seams sit on crossover areas without changing the travel coordinates. */}
        <div className="absolute left-[48%] top-[53%] h-4 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/55" style={{
        boxShadow: '0 0 18px rgba(255,255,255,0.18), inset 0 1px 0 rgba(255,255,255,0.18)'
      }} />
        <div className="absolute left-[54%] top-[39%] h-4 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/55" style={{
        boxShadow: '0 0 18px rgba(255,255,255,0.18), inset 0 1px 0 rgba(255,255,255,0.18)'
      }} />

        {paths.map((_, laneIdx) => {
        const laneCurve = overviewLaneCurves[laneIdx] ?? overviewLaneCurves[0];
        const tilesOnLane = activePathTiles[laneIdx] ?? [];
        const totalTilesLane = tilesOnLane.length || 30;
        const playersOnLane = players.filter((p) => p.pathIndex === laneIdx);
        const laneColor = PATH_NEON_HEX[laneIdx] ?? '#a855f7';
        const laneIsActive = laneIdx === activePathIdx;
        const startPoint = getPointOnLaneCurve(laneCurve, 0);
        const finishPoint = getPointOnLaneCurve(laneCurve, 1);
        return <Fragment key={laneIdx}>
              {(!isZoomed || laneIsActive) && <Fragment>
                  <div className="absolute -translate-x-1/2 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-center text-[7px] font-black uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm" style={{
              left: `${startPoint.x}%`,
              top: `${Math.min(93, startPoint.y + 4)}%`,
              boxShadow: `0 0 14px ${laneColor}66`,
              color: laneColor,
              zIndex: 16
            }}>
                    {LANE_LABELS[laneIdx]}
                  </div>
                  <div className="absolute -translate-x-1/2 rounded-full border border-white/12 bg-black/45 px-2 py-0.5 text-center text-[6px] font-black uppercase tracking-[0.2em] text-white/55 backdrop-blur-sm" style={{
              left: `${finishPoint.x}%`,
              top: `${Math.max(8, finishPoint.y - 5)}%`,
              boxShadow: `0 0 12px ${laneColor}44`,
              zIndex: 16
            }}>
                    {LANE_DISTRICTS[laneIdx]}
                  </div>
                </Fragment>}
              {tilesOnLane.map((tileId, idx) => {
            const progress = idx / Math.max(1, totalTilesLane - 1);
            const point = getPointOnLaneCurve(laneCurve, progress);
            const distanceFromCurrent = laneIsActive ? idx - clampedZoomedPos : 999;
            const showInZoom = !isZoomed || !laneIsActive || Math.abs(distanceFromCurrent) <= ZOOMED_VISIBLE_CARD_RANGE + 2;
            if (!showInZoom) return null;
            const showDetailedCard = isZoomed && laneIsActive && Math.abs(distanceFromCurrent) <= ZOOMED_VISIBLE_CARD_RANGE;
            const isCurrent = showDetailedCard && distanceFromCurrent === 0;
            const isCheckpoint = idx % 5 === 0 || idx === totalTilesLane - 1;
            const tile = getTileById(tileId);
            const styleInfo = categoryStyles[tile.category] || categoryStyles.start;
            const TileIcon = styleInfo.icon;
            const tileRotate = showDetailedCard ? 0 : Math.max(-26, Math.min(26, point.angle));
            const perspectiveScale = getPerspectiveScale(point.y);
            const overviewWidth = Math.round((isCheckpoint ? 48 : 36) * perspectiveScale);
            const overviewHeight = Math.round((isCheckpoint ? 24 : 17) * perspectiveScale);
            const showOverviewText = !showDetailedCard && (isCheckpoint || point.y > 68);
            const width = showDetailedCard ? 176 : overviewWidth;
            const height = showDetailedCard ? ZOOMED_CARD_HEIGHT_PX : overviewHeight;
            return <motion.div key={`${laneIdx}-${tileId}-${idx}`} className={`absolute border ${showDetailedCard ? 'rounded-2xl px-3 py-2 text-center' : 'rounded-md'} flex items-center justify-center backdrop-blur-md overflow-hidden`} style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              width,
              height,
              transform: `translate(-50%, -50%) rotate(${tileRotate}deg)`,
              transformOrigin: 'center center',
              borderColor: isCurrent ? neon : `${laneColor}${showDetailedCard ? '88' : '66'}`,
              background: showDetailedCard ? `linear-gradient(135deg, rgba(5,8,18,0.95), rgba(22,18,38,0.94) 55%, ${laneColor}24)` : isCheckpoint ? `linear-gradient(90deg, rgba(3,6,14,0.96), ${laneColor}44, rgba(3,6,14,0.96))` : `linear-gradient(90deg, rgba(2,5,12,0.96), ${laneColor}2f, rgba(2,5,12,0.96))`,
              boxShadow: isCurrent ? `0 0 34px ${neon}aa, inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -10px 18px rgba(0,0,0,0.35)` : isCheckpoint ? `0 0 16px ${laneColor}99, inset 0 1px 0 rgba(255,255,255,0.18)` : `0 0 8px ${laneColor}66, inset 0 1px 0 rgba(255,255,255,0.12)`,
              zIndex: showDetailedCard ? 28 : 18,
              opacity: showDetailedCard ? isCurrent ? 1 : 0.82 : laneIsActive ? 1 : 0.72
            }} animate={isCurrent ? {
              scale: [1, 1.03, 1]
            } : undefined} transition={{
              duration: 0.3
            }}>
                    {showDetailedCard ? <div className="relative flex w-full items-center justify-center gap-2.5">
                        <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 shadow-inner" style={{
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.16), 0 0 12px ${laneColor}55`
                  }}>
                          <TileIcon className="h-4 w-4 text-white/85" />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-[8px] font-black uppercase tracking-[0.18em]" style={{
                      color: laneColor
                    }}>
                            Space {idx + 1} / embedded street card
                          </p>
                          <p className="max-w-[124px] truncate text-xs font-black text-white">{tile.name}</p>
                        </div>
                      </div> : <Fragment>
                        <div className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-white/25" />
                        {showOverviewText ? <div className="relative flex max-w-full items-center gap-1 px-1">
                          <TileIcon className="h-2.5 w-2.5 shrink-0 text-white/85" />
                          <span className="truncate text-[6px] font-black leading-none text-white/90">{tile.name}</span>
                        </div> : <div className="relative h-1.5 w-1.5 rounded-full bg-white/75" style={{
                    boxShadow: `0 0 8px ${laneColor}`
                  }} />}
                      </Fragment>}
                  </motion.div>;
          })}

              {playersOnLane.map((p, stackIdx) => {
            const isCurrentPlayer = p.id === currentPlayer.id;
            if (isZoomed && isCurrentPlayer) return null;
            const lanePos = isCurrentPlayer ? zoomedDisplayPos : p.position;
            const clampedLanePos = Math.max(0, Math.min(lanePos, totalTilesLane - 1));
            const playerProgress = clampedLanePos / Math.max(1, totalTilesLane - 1);
            const point = getPointOnLaneCurve(laneCurve, playerProgress);
            const xOffsetPx = (stackIdx - (playersOnLane.length - 1) / 2) * 16;
            const isActive = players[currentPlayerIndex]?.id === p.id;
            return <motion.div key={p.id} className="absolute" style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              transform: `translate(calc(-50% + ${xOffsetPx}px), -58%)`,
              filter: isActive ? `drop-shadow(0 0 10px ${laneColor})` : undefined,
              zIndex: 30
            }} animate={{
              left: `${point.x}%`,
              top: `${point.y}%`
            }} transition={{
              duration: HOP_DURATION_MS / 1000,
              ease: [0.22, 1, 0.36, 1]
            }}>
                  <MiniPawn color={PAWN_COLORS[p.color] || PAWN_COLORS.purple} letter={p.name.charAt(0).toUpperCase()} avatar={p.avatar} isActive={isActive} />
                </motion.div>;
          })}
            </Fragment>;
      })}

        {isZoomed && <Fragment>
            <motion.div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/45" style={{
          left: `${activeLanePoint.x}%`,
          top: `${activeLanePoint.y}%`,
          width: 142,
          height: 32,
          background: `radial-gradient(circle, ${neon}88 0%, ${neon}22 60%, transparent 100%)`,
          boxShadow: `0 0 20px ${neon}88`,
          zIndex: 34
        }} animate={{
          scaleX: hopping ? [1, 0.94, 1.08, 1] : [1, 1.03, 1],
          scaleY: hopping ? [1, 1.06, 0.94, 1] : [1, 0.98, 1]
        }} transition={{
          duration: hopping ? HOP_DURATION_MS * 0.72 / 1000 : 1.5
        }} />
            <motion.div className="absolute" style={{
          left: `${activeLanePoint.x}%`,
          top: `${activeLanePoint.y}%`,
          transform: 'translate(-50%, -100%)',
          filter: `drop-shadow(0 0 28px ${neon}cc)`,
          zIndex: 40
        }} animate={{
          left: `${activeLanePoint.x}%`,
          top: `${activeLanePoint.y}%`
        }} transition={{
          duration: HOP_DURATION_MS / 1000,
          ease: [0.22, 1, 0.36, 1]
        }}>
              <Pawn3D color={PAWN_COLORS[currentPlayer.color] || PAWN_COLORS.purple} avatar={currentPlayer.avatar} letter={currentPlayer.name.charAt(0).toUpperCase()} scale={1} hopping={hopping} />
            </motion.div>
          </Fragment>}
      </motion.div>

      {isZoomed && <motion.div className="absolute left-1/2 top-20 -translate-x-1/2 rounded-full border border-white/12 bg-black/35 px-4 py-2 text-center backdrop-blur-md" initial={{
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
        </motion.div>}

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

      {isZoomed && <div className="absolute bottom-32 left-3 md:left-6 z-30">
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
        </div>}

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