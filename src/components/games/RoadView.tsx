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
  // null  = follow the current player's lane
  // 0..2  = follow that specific education path
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
const ACTIVE_CARD_AHEAD_RANGE = 4;
const ACTIVE_DETAILED_AHEAD_RANGE = 3;
const BOARD_MIN_WORLD_WIDTH_PX = 1180;
const BOARD_MIN_WORLD_HEIGHT_PX = 3300;
const BOARD_WORLD_WIDTH_MULTIPLIER = 2.05;
const BOARD_WORLD_HEIGHT_MULTIPLIER = 4.6;
const CAMERA_Y_ANCHOR = 0.76;
const CAMERA_TILT_DEG = 54;
const CAMERA_ROLL_DEG = -1.25;
const NEARBY_OTHER_LANE_CARD_WINDOW = 0.34;
type LanePoint = {
  x: number;
  y: number;
};
const FOCUSED_LANE_CURVES: Record<number, LanePoint[]> = {
  // Bottom -> top in normalized world coordinates. These lanes breathe first,
  // then come together only at a few intentional overpass/intersection moments.
  0: [{
    x: 31,
    y: 92
  }, {
    x: 27,
    y: 78
  }, {
    x: 35,
    y: 64
  }, {
    x: 43,
    y: 51
  }, {
    x: 35,
    y: 37
  }, {
    x: 42,
    y: 23
  }, {
    x: 46,
    y: 8
  }],
  1: [{
    x: 50,
    y: 92
  }, {
    x: 53,
    y: 78
  }, {
    x: 46,
    y: 64
  }, {
    x: 50,
    y: 51
  }, {
    x: 58,
    y: 38
  }, {
    x: 49,
    y: 23
  }, {
    x: 51,
    y: 8
  }],
  2: [{
    x: 69,
    y: 92
  }, {
    x: 73,
    y: 78
  }, {
    x: 65,
    y: 64
  }, {
    x: 57,
    y: 51
  }, {
    x: 66,
    y: 37
  }, {
    x: 59,
    y: 23
  }, {
    x: 56,
    y: 8
  }]
};
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const toSvgLanePath = (points: LanePoint[]) => {
  if (!points.length) return '';
  return points.map((point, idx) => `${idx === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
};
const toSvgSegmentPath = (start: LanePoint, end: LanePoint) => `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
const getPerspectiveScale = (y: number, worldHeight = 100) => {
  // Keeps the board readable like a city street receding into the skyline.
  const normalizedY = clamp(y / worldHeight, 0, 1);
  return 0.86 + normalizedY * 0.2;
};
const getReadableLaneTilt = (angle: number, maxTilt = 10) => {
  // A vertical lane points near -90deg; normalize around that so cards stay legible.
  return clamp((angle + 90) * 0.35, -maxTilt, maxTilt);
};
const toWorldPoint = (point: LanePoint, worldWidth: number, worldHeight: number): LanePoint => ({
  x: point.x / 100 * worldWidth,
  y: point.y / 100 * worldHeight
});
const getWorldLaneCurves = (worldWidth: number, worldHeight: number) => {
  return Object.fromEntries(Object.entries(FOCUSED_LANE_CURVES).map(([laneIdx, points]) => [
    Number(laneIdx),
    points.map((point) => toWorldPoint(point, worldWidth, worldHeight))
  ])) as Record<number, LanePoint[]>;
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
  { left: '5%', top: '10%', width: '17%', height: '24%', label: 'apartments', glow: '#38bdf8', stories: 6 },
  { left: '24%', top: '12%', width: '11%', height: '14%', label: 'office', glow: '#f472b6', stories: 4 },
  { left: '65%', top: '10%', width: '17%', height: '24%', label: 'hotel', glow: '#f97316', stories: 7 },
  { left: '82%', top: '30%', width: '12%', height: '22%', label: 'garage', glow: '#a78bfa', stories: 5 },
  { left: '5%', top: '39%', width: '15%', height: '20%', label: 'market', glow: '#34d399', stories: 4 },
  { left: '72%', top: '55%', width: '18%', height: '18%', label: 'studio', glow: '#ec4899', stories: 4 },
  { left: '11%', top: '67%', width: '15%', height: '22%', label: 'shops', glow: '#f59e0b', stories: 5 },
  { left: '78%', top: '75%', width: '13%', height: '14%', label: 'mall', glow: '#60a5fa', stories: 3 },
  { left: '4%', top: '86%', width: '18%', height: '10%', label: 'diner', glow: '#fb7185', stories: 3 },
  { left: '75%', top: '88%', width: '17%', height: '9%', label: 'arcade', glow: '#22d3ee', stories: 4 }
];
const BILLBOARD_SITES = [
  { left: '10%', top: '27%', text: 'YOU DECIDE', color: '#38bdf8', rotate: -4 },
  { left: '68%', top: '23%', text: 'LIVE YOUR DREAMS', color: '#f97316', rotate: 3 },
  { left: '9%', top: '55%', text: 'GOOD EATS', color: '#a855f7', rotate: -6 },
  { left: '77%', top: '68%', text: 'NO RISK NO REWARD', color: '#ec4899', rotate: 5 }
];
const CITY_SIDE_STREETS = [
  { left: '0%', top: '21%', width: '102%', rotate: -8 },
  { left: '-4%', top: '49%', width: '108%', rotate: 7 },
  { left: '6%', top: '78%', width: '92%', rotate: -5 },
  { left: '-8%', top: '91%', width: '112%', rotate: 4 },
  { left: '29%', top: '6%', width: '86%', rotate: 79 },
  { left: '64%', top: '8%', width: '82%', rotate: 101 }
];
const STREET_LIGHTS = [
  { left: '34%', top: '72%' },
  { left: '60%', top: '70%' },
  { left: '38%', top: '57%' },
  { left: '62%', top: '52%' },
  { left: '43%', top: '38%' },
  { left: '58%', top: '34%' },
  { left: '47%', top: '22%' },
  { left: '54%', top: '20%' }
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
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({
    width: 1200,
    height: 800
  });
  useEffect(() => {
    const updateViewportSize = () => {
      const bounds = viewportRef.current?.getBoundingClientRect();
      if (!bounds) return;
      setViewportSize({
        width: Math.max(320, bounds.width),
        height: Math.max(480, bounds.height)
      });
    };
    updateViewportSize();
    if (typeof ResizeObserver === 'undefined' || !viewportRef.current) {
      window.addEventListener('resize', updateViewportSize);
      return () => window.removeEventListener('resize', updateViewportSize);
    }
    const resizeObserver = new ResizeObserver(updateViewportSize);
    resizeObserver.observe(viewportRef.current);
    return () => resizeObserver.disconnect();
  }, []);
  const isZoomed = true;
  const activePathIdx = focusedPathIndex !== null && focusedPathIndex !== undefined ? focusedPathIndex : currentPlayer.pathIndex !== null && currentPlayer.pathIndex !== undefined ? currentPlayer.pathIndex : 0;
  const neon = PATH_NEON_HEX[activePathIdx] ?? '#a855f7';
  const zoomedTilesOnPath = activePathTiles[activePathIdx] ?? [];
  const totalTilesZoomed = zoomedTilesOnPath.length || 30;
  const {
    displayPos: zoomedDisplayPos,
    hopping
  } = useStepAnimation(currentPlayer.position, `${currentPlayer.id}-${activePathIdx}`);
  const clampedZoomedPos = Math.max(0, Math.min(zoomedDisplayPos, totalTilesZoomed - 1));
  const worldWidth = Math.max(BOARD_MIN_WORLD_WIDTH_PX, viewportSize.width * BOARD_WORLD_WIDTH_MULTIPLIER);
  const worldHeight = Math.max(BOARD_MIN_WORLD_HEIGHT_PX, viewportSize.height * BOARD_WORLD_HEIGHT_MULTIPLIER);
  const overviewLaneCurves = useMemo(() => {
    const worldLaneCurves = getWorldLaneCurves(worldWidth, worldHeight);
    return paths.map((_, laneIdx) => worldLaneCurves[laneIdx] ?? worldLaneCurves[0]);
  }, [paths, worldHeight, worldWidth]);
  const overviewSvgPaths = useMemo(() => overviewLaneCurves.map((curve) => toSvgLanePath(curve)), [overviewLaneCurves]);
  const activeLaneCurve = overviewLaneCurves[activePathIdx] ?? overviewLaneCurves[0];
  const activeLaneProgress = clampedZoomedPos / Math.max(1, totalTilesZoomed - 1);
  const activeLanePoint = getPointOnLaneCurve(activeLaneCurve, activeLaneProgress);
  const cameraScale = 1.24;
  const maxCameraX = viewportSize.width * 0.2;
  const minCameraX = viewportSize.width - worldWidth - viewportSize.width * 0.18;
  const maxCameraY = viewportSize.height * 0.24;
  const minCameraY = viewportSize.height - worldHeight - viewportSize.height * 0.16;
  const cameraX = clamp(viewportSize.width * 0.5 - activeLanePoint.x, minCameraX, maxCameraX);
  const cameraY = clamp(viewportSize.height * CAMERA_Y_ANCHOR - activeLanePoint.y, minCameraY, maxCameraY);
  return <div ref={viewportRef} className="absolute inset-0 overflow-hidden z-[5] pointer-events-none" style={{
    perspective: 980,
    perspectiveOrigin: '50% 78%'
  }}>
      <motion.div className="absolute left-0 top-0" style={{
      width: worldWidth,
      height: worldHeight,
      transformOrigin: `${activeLanePoint.x}px ${activeLanePoint.y}px`,
      transformStyle: 'preserve-3d'
    }} animate={{
      scale: cameraScale,
      x: cameraX,
      y: cameraY,
      rotateX: CAMERA_TILT_DEG,
      rotateZ: CAMERA_ROLL_DEG
    }} transition={{
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }}>
        {/* Shared city environment for both overview and zoom. Roads below are the same coordinates used for pawn travel. */}
        <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(3,7,18,0.16) 0%, rgba(3,7,18,0.5) 58%, rgba(1,3,9,0.86) 100%)'
      }} />
        <div className="absolute inset-x-0 top-[7%] bottom-0" style={{
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(250,204,21,0.08), transparent 22%), radial-gradient(circle at 78% 34%, rgba(56,189,248,0.08), transparent 24%), radial-gradient(circle at 55% 56%, rgba(236,72,153,0.08), transparent 28%), linear-gradient(90deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 74px), linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 88px), linear-gradient(180deg, rgba(15,17,22,0.72), rgba(8,9,13,0.9))',
        boxShadow: 'inset 0 60px 90px rgba(0,0,0,0.42), inset 0 -90px 90px rgba(0,0,0,0.62)'
      }} />
        {CITY_SIDE_STREETS.map((street, index) => <div key={`side-street-${index}`} className="absolute h-8 origin-left rounded-full border-y border-white/10 bg-slate-950/65" style={{
        left: street.left,
        top: street.top,
        width: street.width,
        transform: `rotate(${street.rotate}deg)`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -8px 16px rgba(0,0,0,0.45), 0 10px 24px rgba(0,0,0,0.26)',
        zIndex: 3
      }}>
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(253,224,71,0.6) 0 10px, transparent 10px 23px)'
        }} />
          </div>)}
        {CITY_BLOCKS.map((block, index) => <div key={`city-block-${index}`} className="absolute rounded-xl border border-white/10 overflow-hidden" style={{
        left: block.left,
        top: block.top,
        width: block.width,
        height: block.height,
        background: 'linear-gradient(180deg, rgba(34,38,45,0.92), rgba(13,15,20,0.98))',
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 12px 24px 30px rgba(0,0,0,0.48), 0 0 22px ${block.glow}2f`,
        transform: `translateZ(${18 + index % 3 * 6}px)`,
        zIndex: 6
      }}>
            <div className="absolute inset-x-0 top-0 h-5 bg-white/8" style={{
          background: `linear-gradient(90deg, rgba(255,255,255,0.16), ${block.glow}26, transparent)`
        }} />
            <div className="absolute right-0 top-4 bottom-0 w-4 bg-black/28" />
            <div className="absolute left-0 right-4 bottom-0 h-4 bg-black/30" />
            <div className="absolute inset-x-2 top-2 grid gap-1" style={{
          gridTemplateColumns: `repeat(${block.stories}, minmax(0, 1fr))`
        }}>
              {Array.from({ length: block.stories * 3 }).map((_, windowIndex) => <span key={windowIndex} className="h-1 rounded-[2px]" style={{
            background: windowIndex % 3 !== 1 ? `${block.glow}78` : 'rgba(255,255,255,0.14)',
            boxShadow: windowIndex % 2 === 0 ? `0 0 10px ${block.glow}` : undefined
          }} />)}
            </div>
            <div className="absolute inset-x-2 bottom-2 rounded-md border border-white/10 bg-black/45 py-1 text-center text-[7px] font-black uppercase tracking-[0.22em] text-white/55">
              {block.label}
            </div>
          </div>)}
        {BILLBOARD_SITES.map((site, index) => <motion.div key={`billboard-site-${index}`} className="absolute rounded-sm border border-white/15 bg-black/75 px-2 py-1 text-center text-[7px] font-black uppercase tracking-[0.18em] text-white/85" style={{
        left: site.left,
        top: site.top,
        boxShadow: `0 0 15px ${site.color}55, inset 0 1px 0 rgba(255,255,255,0.14), 0 10px 18px rgba(0,0,0,0.36)`,
        color: site.color,
        transform: `translateZ(46px) rotate(${site.rotate}deg) rotateX(-${CAMERA_TILT_DEG}deg)`,
        zIndex: 12
      }} animate={{
        opacity: [0.65, 1, 0.7]
      }} transition={{
        duration: 2.6 + index * 0.35,
        repeat: Infinity,
        ease: 'easeInOut'
      }}>
            <span className="absolute left-1/2 top-full h-7 w-1 -translate-x-1/2 bg-slate-700/80" />
            {site.text}
          </motion.div>)}
        {STREET_LIGHTS.map((light, index) => <div key={`street-light-${index}`} className="absolute" style={{
        left: light.left,
        top: light.top,
        zIndex: 11
      }}>
            <span className="absolute h-8 w-1 rounded-full bg-slate-600/80" />
            <span className="absolute -left-2 -top-1 h-3 w-5 rounded-full bg-amber-200/90" style={{
          boxShadow: '0 0 18px rgba(251,191,36,0.9), 0 0 42px rgba(251,191,36,0.45)'
        }} />
          </div>)}
        <svg className="absolute inset-0" viewBox={`0 0 ${worldWidth} ${worldHeight}`} preserveAspectRatio="none">
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
              const segmentScale = getPerspectiveScale((start.y + end.y) / 2, worldHeight);
              const segmentPath = toSvgSegmentPath(start, end);
              return <g key={`road-segment-${laneIdx}-${segmentIdx}`}>
                    <path d={segmentPath} fill="none" stroke="rgba(70,65,58,0.72)" strokeWidth={92 * segmentScale} strokeLinecap="round" strokeLinejoin="round" />
                    <path d={segmentPath} fill="none" stroke="rgba(4,5,8,0.94)" strokeWidth={80 * segmentScale} strokeLinecap="round" strokeLinejoin="round" />
                    <path d={segmentPath} fill="none" stroke="rgba(32,34,38,0.98)" strokeWidth={66 * segmentScale} strokeLinecap="round" strokeLinejoin="round" />
                    <path d={segmentPath} fill="none" stroke={`${laneColor}30`} strokeWidth={48 * segmentScale} strokeLinecap="round" strokeLinejoin="round" />
                    <path d={segmentPath} fill="none" stroke="rgba(255,255,255,0.36)" strokeWidth={3 * segmentScale} strokeLinecap="round" strokeLinejoin="round" />
                  </g>;
            })}
                <path d={lanePath} fill="none" stroke={`${laneColor}99`} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12 34" />
                <path d={lanePath} fill="none" stroke="rgba(250,204,21,0.5)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 48" />
                {[0.18, 0.36, 0.54, 0.72, 0.9].map((progress) => {
              const point = getPointOnLaneCurve(overviewLaneCurves[laneIdx] ?? overviewLaneCurves[0], progress);
              return <circle key={`lane-marker-${laneIdx}-${progress}`} cx={point.x} cy={point.y} r={6} fill={laneColor} opacity={0.5} />;
            })}
              </g>;
        })}
        </svg>
        {/* Bridge seams and support shadows make crossovers read like elevated highways. */}
        <div className="absolute left-[48%] top-[53%] h-8 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-y border-white/18 bg-slate-900/80" style={{
        boxShadow: '0 18px 24px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.14)'
      }} />
        <div className="absolute left-[54%] top-[39%] h-8 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-y border-white/18 bg-slate-900/80" style={{
        boxShadow: '0 18px 24px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.14)'
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
              {[0.2, 0.5, 0.8].map((progress) => {
            const crossingPoint = getPointOnLaneCurve(laneCurve, progress);
            const crossingScale = getPerspectiveScale(crossingPoint.y, worldHeight);
            return <div key={`crosswalk-${laneIdx}-${progress}`} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-sm opacity-70" style={{
              left: crossingPoint.x,
              top: crossingPoint.y,
              width: 106 * crossingScale,
              height: 16 * crossingScale,
              transform: `translate(-50%, -50%) rotate(${crossingPoint.angle}deg)`,
              backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.74) 0 2px, transparent 2px 5px)',
              zIndex: 17
            }} />;
          })}
              {[0.28, 0.62].map((progress) => {
            const supportPoint = getPointOnLaneCurve(laneCurve, progress);
            return <div key={`bridge-support-${laneIdx}-${progress}`} className="absolute -translate-x-1/2 rounded-b-xl bg-slate-950/70" style={{
              left: supportPoint.x,
              top: supportPoint.y + 48,
              width: 20 * getPerspectiveScale(supportPoint.y, worldHeight),
              height: 78 * getPerspectiveScale(supportPoint.y, worldHeight),
              boxShadow: '10px 16px 18px rgba(0,0,0,0.38)',
              zIndex: 5
            }} />;
          })}
              {(!isZoomed || laneIsActive) && <Fragment>
                  <div className="absolute -translate-x-1/2 rounded-sm border border-white/15 bg-slate-950/75 px-2.5 py-1 text-center text-[7px] font-black uppercase tracking-[0.18em] text-white/85" style={{
              left: startPoint.x,
              top: Math.min(worldHeight - 54, startPoint.y + 72),
              boxShadow: `0 8px 18px rgba(0,0,0,0.42), 0 0 10px ${laneColor}4d`,
              color: laneColor,
              zIndex: 16
            }}>
                    {LANE_LABELS[laneIdx]}
                  </div>
                  <div className="absolute -translate-x-1/2 rounded-sm border border-white/12 bg-slate-950/65 px-2 py-0.5 text-center text-[6px] font-black uppercase tracking-[0.2em] text-white/55" style={{
              left: finishPoint.x,
              top: Math.max(48, finishPoint.y - 72),
              boxShadow: `0 8px 18px rgba(0,0,0,0.35), 0 0 8px ${laneColor}33`,
              zIndex: 16
            }}>
                    {LANE_DISTRICTS[laneIdx]}
                  </div>
                </Fragment>}
              {tilesOnLane.map((tileId, idx) => {
            const progress = idx / Math.max(1, totalTilesLane - 1);
            const point = getPointOnLaneCurve(laneCurve, progress);
            const distanceFromCurrent = laneIsActive ? idx - clampedZoomedPos : 999;
            const isCheckpoint = idx % 5 === 0 || idx === totalTilesLane - 1;
            const isNearbyOtherLaneCheckpoint = !laneIsActive && isCheckpoint && Math.abs(point.y - activeLanePoint.y) < viewportSize.height * NEARBY_OTHER_LANE_CARD_WINDOW;
            const showInZoom = laneIsActive ? distanceFromCurrent >= 0 && distanceFromCurrent <= ACTIVE_CARD_AHEAD_RANGE : isNearbyOtherLaneCheckpoint;
            if (!showInZoom) return null;
            const showDetailedCard = laneIsActive && distanceFromCurrent <= ACTIVE_DETAILED_AHEAD_RANGE;
            const isCurrent = showDetailedCard && distanceFromCurrent === 0;
            const tile = getTileById(tileId);
            const styleInfo = categoryStyles[tile.category] || categoryStyles.start;
            const TileIcon = styleInfo.icon;
            const tileRotate = getReadableLaneTilt(point.angle, showDetailedCard ? 6 : 14);
            const perspectiveScale = getPerspectiveScale(point.y, worldHeight);
            const overviewWidth = Math.round((isCheckpoint ? 82 : 54) * perspectiveScale);
            const overviewHeight = Math.round((isCheckpoint ? 38 : 24) * perspectiveScale);
            const normalizedY = point.y / worldHeight;
            const showOverviewText = !showDetailedCard && (isCheckpoint || normalizedY > 0.72);
            const activeCardScale = laneIsActive ? clamp(1.1 - Math.max(0, distanceFromCurrent) * 0.1, 0.72, 1.12) : 1;
            const width = showDetailedCard ? Math.round(208 * activeCardScale) : overviewWidth;
            const height = showDetailedCard ? Math.round(92 * activeCardScale) : overviewHeight;
            return <motion.div key={`${laneIdx}-${tileId}-${idx}`} className={`absolute border ${showDetailedCard ? 'rounded-xl px-3 py-2 text-center' : 'rounded-sm'} flex items-center justify-center overflow-hidden`} style={{
              left: point.x,
              top: point.y,
              width,
              height,
              transform: `translate(-50%, -50%) translateZ(${showDetailedCard ? 26 : 16}px) rotate(${tileRotate}deg) rotateX(${showDetailedCard ? -28 : -10}deg)`,
              transformOrigin: 'center center',
              borderColor: isCurrent ? neon : `${laneColor}${showDetailedCard ? '88' : '66'}`,
              background: showDetailedCard ? `linear-gradient(135deg, rgba(42,43,46,0.98), rgba(25,27,31,0.98) 58%, ${laneColor}2b)` : isCheckpoint ? `linear-gradient(180deg, rgba(58,57,55,0.96), rgba(30,32,35,0.98))` : `linear-gradient(180deg, rgba(49,50,52,0.96), rgba(28,30,33,0.98))`,
              boxShadow: isCurrent ? `0 0 22px ${neon}88, inset 0 2px 0 rgba(255,255,255,0.24), inset 0 -10px 18px rgba(0,0,0,0.42)` : isCheckpoint ? `0 6px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.18)` : `0 4px 8px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.12)`,
              zIndex: showDetailedCard ? 28 : 18,
              opacity: showDetailedCard ? isCurrent ? 1 : 0.82 : laneIsActive ? 1 : 0.72
            }} animate={isCurrent ? {
              scale: [1, 1.03, 1]
            } : undefined} transition={{
              duration: 0.3
            }}>
                    {showDetailedCard ? <div className="relative flex w-full items-center justify-center gap-2.5">
                        <div className="absolute inset-0 rounded-xl border border-white/10 pointer-events-none" />
                        <div className="absolute left-0 top-0 h-full w-1.5" style={{
                    background: laneColor
                  }} />
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white/10 shadow-inner" style={{
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
              left: point.x,
              top: point.y,
              transform: `translate(calc(-50% + ${xOffsetPx}px), -58%) translateZ(58px) rotateX(-${CAMERA_TILT_DEG}deg)`,
              filter: isActive ? `drop-shadow(0 0 10px ${laneColor})` : undefined,
              zIndex: 30
            }} animate={{
              left: point.x,
              top: point.y
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
          left: activeLanePoint.x,
          top: activeLanePoint.y,
          width: 172,
          height: 42,
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
          left: activeLanePoint.x,
          top: activeLanePoint.y,
          transform: `translate(-50%, -100%) translateZ(88px) rotateX(-${CAMERA_TILT_DEG}deg)`,
          filter: `drop-shadow(0 0 28px ${neon}cc)`,
          zIndex: 40
        }} animate={{
          left: activeLanePoint.x,
          top: activeLanePoint.y
        }} transition={{
          duration: HOP_DURATION_MS / 1000,
          ease: [0.22, 1, 0.36, 1]
        }}>
              <Pawn3D color={PAWN_COLORS[currentPlayer.color] || PAWN_COLORS.purple} avatar={currentPlayer.avatar} letter={currentPlayer.name.charAt(0).toUpperCase()} scale={0.72} hopping={hopping} />
            </motion.div>
          </Fragment>}
      </motion.div>
      {['left', 'right'].map((side) => <div key={`foreground-${side}`} className={`absolute top-0 bottom-0 ${side === 'left' ? 'left-0' : 'right-0'} w-[15%] pointer-events-none overflow-hidden`} style={{
      background: side === 'left' ? 'linear-gradient(90deg, rgba(3,5,12,0.8), rgba(9,13,28,0.34), transparent)' : 'linear-gradient(270deg, rgba(3,5,12,0.8), rgba(9,13,28,0.34), transparent)',
      maskImage: 'linear-gradient(180deg, transparent 0%, black 12%, black 92%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 12%, black 92%, transparent 100%)',
      zIndex: 1
    }}>
          {Array.from({ length: 8 }).map((_, index) => <span key={index} className="absolute rounded-[2px]" style={{
        left: side === 'left' ? `${12 + index % 3 * 22}%` : `${18 + index % 3 * 20}%`,
        top: `${12 + index * 10}%`,
        width: `${18 + index % 2 * 10}px`,
        height: `${3 + index % 3}px`,
        background: index % 2 === 0 ? 'rgba(244,114,182,0.78)' : 'rgba(56,189,248,0.72)',
        boxShadow: index % 2 === 0 ? '0 0 16px rgba(244,114,182,0.9)' : '0 0 16px rgba(56,189,248,0.85)'
      }} />)}
        </div>)}
      <div className="absolute inset-x-0 bottom-0 h-[34%] pointer-events-none" style={{
      background: 'linear-gradient(90deg, rgba(250,204,21,0.42) 0 2px, transparent 2px 18%, transparent 82%, rgba(250,204,21,0.42) 82% calc(82% + 2px), transparent calc(82% + 2px)), linear-gradient(180deg, transparent, rgba(0,0,0,0.34))',
      clipPath: 'polygon(7% 100%, 27% 0, 73% 0, 93% 100%)',
      opacity: 0.72,
      zIndex: 1
    }} />
      <div className="absolute inset-0 pointer-events-none" style={{
      background: 'linear-gradient(180deg, rgba(5,8,18,0.34) 0%, rgba(5,8,18,0.08) 22%, transparent 48%, rgba(2,4,10,0.44) 100%), radial-gradient(ellipse at 50% 72%, transparent 0%, transparent 38%, rgba(0,0,0,0.34) 100%)',
      zIndex: 2
    }} />

    </div>;
}