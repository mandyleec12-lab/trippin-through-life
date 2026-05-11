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
const REFERENCE_DISTRICT_SCENES = [
  {
    image: '/city-game-roads/neon-downtown.png',
    label: 'Neon Downtown',
    colorWash: 'rgba(168,85,247,0.28)',
    position: 'center 58%'
  },
  {
    image: '/city-game-roads/rainy-street.png',
    label: 'Rainlit Avenue',
    colorWash: 'rgba(56,189,248,0.22)',
    position: 'center 58%'
  },
  {
    image: '/city-game-roads/night-alley.png',
    label: 'After Hours Row',
    colorWash: 'rgba(236,72,153,0.22)',
    position: 'center 56%'
  },
  {
    image: '/city-game-roads/neon-boardwalk.png',
    label: 'Dream Strip',
    colorWash: 'rgba(249,115,22,0.22)',
    position: 'center 58%'
  },
  {
    image: '/city-game-roads/chaos-gas-station.png',
    label: 'Stormline Station',
    colorWash: 'rgba(239,68,68,0.2)',
    position: 'center 57%'
  }
];
function CinematicCityBackdrop({
  accent,
  districtIndex,
  progress
}: {accent: string;districtIndex: number;progress: number;}) {
  const sceneIndex = (districtIndex + Math.floor(progress * 3)) % REFERENCE_DISTRICT_SCENES.length;
  const scene = REFERENCE_DISTRICT_SCENES[sceneIndex];
  return <div className="absolute inset-0 overflow-hidden bg-slate-950 pointer-events-none" style={{
    zIndex: 0
  }}>
      <div key={scene.image} className="absolute inset-0 bg-cover" style={{
      backgroundImage: `url("${scene.image}")`,
      backgroundPosition: scene.position,
      filter: 'saturate(1.12) contrast(1.06) brightness(0.92)',
      transform: 'scale(1.025)'
    }} />

      <div className="absolute inset-0 mix-blend-screen" style={{
      background: `radial-gradient(circle at 50% 45%, ${scene.colorWash}, transparent 42%), radial-gradient(circle at 50% 78%, ${accent}44, transparent 30%)`
    }} />

      <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-white/75 backdrop-blur-md">
        {scene.label}
      </div>

      <div className="absolute inset-0" style={{
      background: 'linear-gradient(180deg, rgba(2,6,23,0.08) 0%, transparent 28%, rgba(2,6,23,0.38) 100%), radial-gradient(ellipse at 50% 68%, transparent 0%, transparent 46%, rgba(0,0,0,0.42) 100%)'
    }} />
      <motion.div className="absolute inset-x-0 top-[18%] h-[30%] bg-cyan-200/10 blur-3xl" animate={{
      opacity: [0.16, 0.34, 0.18],
      x: ['-4%', '4%', '-4%']
    }} transition={{
      duration: 7,
      repeat: Infinity,
      ease: 'easeInOut'
    }} />
    </div>;
}
function CityLifeOverlay({ accent }: {accent: string;}) {
  return <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{
    zIndex: 1
  }}>
      {[0, 1, 2].map((person) => <motion.div key={`pedestrian-${person}`} className="absolute h-7 w-3 rounded-full bg-slate-100/70 shadow-[0_0_12px_rgba(255,255,255,0.45)]" style={{
      top: `${52 + person * 10}%`,
      left: person % 2 === 0 ? '12%' : '84%'
    }} animate={{
      y: [0, person % 2 === 0 ? 54 : -46],
      opacity: [0, 0.85, 0.85, 0]
    }} transition={{
      duration: 9 + person * 1.8,
      repeat: Infinity,
      delay: person * 1.6,
      ease: 'linear'
    }}>
          <span className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-slate-200/80" />
        </motion.div>)}

      {[0, 1].map((car) => <motion.div key={`side-car-${car}`} className="absolute h-7 w-16 rounded-xl border border-white/15 bg-black/65 shadow-[0_12px_24px_rgba(0,0,0,0.5)]" style={{
      top: `${68 + car * 9}%`,
      left: car === 0 ? '-12%' : '104%'
    }} animate={{
      x: car === 0 ? ['0vw', '42vw'] : ['0vw', '-38vw'],
      opacity: [0, 0.8, 0.8, 0]
    }} transition={{
      duration: 11 + car * 2,
      repeat: Infinity,
      delay: car * 3.5,
      ease: 'linear'
    }}>
          <span className="absolute left-2 top-1 h-1.5 w-5 rounded-full bg-cyan-200/80" />
          <span className="absolute right-1 bottom-1 h-1.5 w-3 rounded-full bg-red-400/90" />
        </motion.div>)}

      {[0, 1, 2, 3].map((glint) => <motion.span key={`road-glint-${glint}`} className="absolute h-px rounded-full" style={{
      left: `${33 + glint * 10}%`,
      top: `${58 + glint * 8}%`,
      width: `${72 + glint * 24}px`,
      background: glint % 2 === 0 ? accent : '#38bdf8',
      boxShadow: `0 0 18px ${glint % 2 === 0 ? accent : '#38bdf8'}`
    }} animate={{
      opacity: [0.05, 0.5, 0.08],
      scaleX: [0.7, 1.18, 0.82]
    }} transition={{
      duration: 2.4 + glint * 0.35,
      repeat: Infinity,
      delay: glint * 0.45,
      ease: 'easeInOut'
    }} />)}

      {[0, 1].map((steam) => <motion.span key={`steam-${steam}`} className="absolute h-20 w-16 rounded-full bg-white/10 blur-xl" style={{
      left: steam === 0 ? '24%' : '72%',
      bottom: `${10 + steam * 8}%`
    }} animate={{
      y: [26, -38],
      opacity: [0, 0.32, 0],
      scale: [0.8, 1.35]
    }} transition={{
      duration: 5.8 + steam,
      repeat: Infinity,
      delay: steam * 2.1,
      ease: 'easeOut'
    }} />)}

      <motion.div className="absolute right-[8%] top-[18%] rounded-lg border border-fuchsia-300/40 bg-black/35 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-200 shadow-[0_0_24px_rgba(217,70,239,0.55)]" animate={{
      opacity: [0.55, 1, 0.42, 0.9]
    }} transition={{
      duration: 2.1,
      repeat: Infinity,
      ease: 'easeInOut'
    }}>
        Open late
      </motion.div>
      <motion.div className="absolute left-[11%] top-[22%] h-4 w-4 rounded-full bg-emerald-300 shadow-[0_0_22px_rgba(110,231,183,0.9)]" animate={{
      opacity: [0.35, 1, 0.35]
    }} transition={{
      duration: 1.3,
      repeat: Infinity,
      ease: 'easeInOut'
    }} />
    </div>;
}

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
  const activeLaneCurve = overviewLaneCurves[activePathIdx] ?? overviewLaneCurves[0];
  const activeLaneSvgPath = useMemo(() => toSvgLanePath(activeLaneCurve), [activeLaneCurve]);
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
      <CinematicCityBackdrop accent={neon} districtIndex={activePathIdx} progress={activeLaneProgress} />
      <CityLifeOverlay accent={neon} />
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
          <g>
            {activeLaneCurve.slice(0, -1).map((start, segmentIdx) => {
              const end = activeLaneCurve[segmentIdx + 1];
              const segmentScale = getPerspectiveScale((start.y + end.y) / 2, worldHeight);
              const segmentPath = toSvgSegmentPath(start, end);
              return <g key={`road-segment-${activePathIdx}-${segmentIdx}`}>
                    <path d={segmentPath} fill="none" stroke="rgba(0,0,0,0.34)" strokeWidth={96 * segmentScale} strokeLinecap="round" strokeLinejoin="round" />
                    <path d={segmentPath} fill="none" stroke="rgba(20,24,32,0.46)" strokeWidth={76 * segmentScale} strokeLinecap="round" strokeLinejoin="round" />
                    <path d={segmentPath} fill="none" stroke={`${neon}24`} strokeWidth={54 * segmentScale} strokeLinecap="round" strokeLinejoin="round" />
                    <path d={segmentPath} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={2.5 * segmentScale} strokeLinecap="round" strokeLinejoin="round" />
                    <path d={segmentPath} fill="none" stroke={`${neon}66`} strokeWidth={8 * segmentScale} strokeLinecap="round" strokeLinejoin="round" opacity={0.48} />
                  </g>;
            })}
            <path d={activeLaneSvgPath} fill="none" stroke={`${neon}aa`} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12 34" opacity={0.72} />
            <path d={activeLaneSvgPath} fill="none" stroke="rgba(250,204,21,0.38)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 48" />
            {[0.18, 0.36, 0.54, 0.72, 0.9].map((progress) => {
              const point = getPointOnLaneCurve(activeLaneCurve, progress);
              return <circle key={`lane-marker-${activePathIdx}-${progress}`} cx={point.x} cy={point.y} r={6} fill={neon} opacity={0.5} />;
            })}
          </g>
        </svg>
        {/* Bridge seams and support shadows make crossovers read like elevated highways. */}
        <div className="absolute left-[48%] top-[53%] h-8 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-y border-white/18 bg-slate-900/80" style={{
        boxShadow: '0 18px 24px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.14)'
      }} />
        <div className="absolute left-[54%] top-[39%] h-8 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-y border-white/18 bg-slate-900/80" style={{
        boxShadow: '0 18px 24px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.14)'
      }} />

        {[activePathIdx].map((laneIdx) => {
        const laneCurve = activeLaneCurve;
        const tilesOnLane = activePathTiles[laneIdx] ?? [];
        const totalTilesLane = tilesOnLane.length || 30;
        const playersOnLane: Player[] = [];
        const laneColor = neon;
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
              <Fragment>
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
                </Fragment>
              {tilesOnLane.map((tileId, idx) => {
            const progress = idx / Math.max(1, totalTilesLane - 1);
            const point = getPointOnLaneCurve(laneCurve, progress);
            const distanceFromCurrent = idx - clampedZoomedPos;
            const isCheckpoint = idx % 5 === 0 || idx === totalTilesLane - 1;
            const showInZoom = distanceFromCurrent >= 0 && distanceFromCurrent <= ACTIVE_CARD_AHEAD_RANGE;
            if (!showInZoom) return null;
            const showDetailedCard = distanceFromCurrent <= ACTIVE_DETAILED_AHEAD_RANGE;
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
            const activeCardScale = clamp(1.12 - Math.max(0, distanceFromCurrent) * 0.11, 0.72, 1.14);
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
              opacity: showDetailedCard ? isCurrent ? 1 : 0.84 : 0.78
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
      <div className="absolute inset-0 pointer-events-none" style={{
      background: 'linear-gradient(180deg, rgba(5,8,18,0.12) 0%, transparent 30%, rgba(2,4,10,0.3) 100%), radial-gradient(ellipse at 50% 72%, transparent 0%, transparent 46%, rgba(0,0,0,0.34) 100%)',
      zIndex: 2
    }} />

    </div>;
}