import React, { useEffect, useState, useRef, Fragment, useMemo } from 'react';
import { motion } from 'framer-motion';
import ThreeBackground from './ThreeBackground';

const PATH_NEON_HEX = ['#a855f7', '#ec4899', '#f97316'];
const PAWN_COLORS = {
  pink: 'from-pink-400 via-pink-500 to-pink-700',
  purple: 'from-purple-400 via-purple-500 to-purple-700',
  blue: 'from-blue-400 via-blue-500 to-blue-700',
  teal: 'from-teal-400 via-teal-500 to-teal-700',
  gold: 'from-amber-400 via-amber-500 to-amber-700',
  coral: 'from-orange-400 via-rose-500 to-rose-700',
};
const HOP_DURATION_MS = 440;
const ACTIVE_CARD_AHEAD_RANGE = 4;
const ACTIVE_DETAILED_AHEAD_RANGE = 3;
const ACTIVE_CARD_BEHIND_RANGE = 1;
const BOARD_MIN_WORLD_WIDTH_PX = 1180;
const BOARD_MIN_WORLD_HEIGHT_PX = 3300;
const BOARD_WORLD_WIDTH_MULTIPLIER = 2.05;
const BOARD_WORLD_HEIGHT_MULTIPLIER = 4.6;
const CAMERA_Y_ANCHOR = 0.76;
const CAMERA_TILT_DEG = 54;
const CAMERA_ROLL_DEG = -1.25;

const FOCUSED_LANE_CURVES = {
  0: [{ x: 43, y: 93 }, { x: 45, y: 80 }, { x: 47, y: 68 }, { x: 50, y: 56 }, { x: 49, y: 44 }, { x: 48, y: 32 }, { x: 49, y: 8 }],
  1: [{ x: 50, y: 93 }, { x: 50, y: 80 }, { x: 51, y: 68 }, { x: 52, y: 56 }, { x: 51, y: 44 }, { x: 50, y: 32 }, { x: 50, y: 8 }],
  2: [{ x: 57, y: 93 }, { x: 55, y: 80 }, { x: 53, y: 68 }, { x: 50, y: 56 }, { x: 52, y: 44 }, { x: 53, y: 32 }, { x: 51, y: 8 }],
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const toSvgSegmentPath = (start, end) => `M ${start.x} ${start.y} L ${end.x} ${end.y}`;

const getPerspectiveScale = (y, worldHeight = 100) => {
  const normalizedY = clamp(y / worldHeight, 0, 1);
  return 0.86 + normalizedY * 0.2;
};

const getReadableLaneTilt = (angle, maxTilt = 10) => {
  return clamp((angle + 90) * 0.35, -maxTilt, maxTilt);
};

const toWorldPoint = (point, worldWidth, worldHeight) => ({
  x: point.x / 100 * worldWidth,
  y: point.y / 100 * worldHeight,
});

const getWorldLaneCurves = (worldWidth, worldHeight) => {
  return Object.fromEntries(
    Object.entries(FOCUSED_LANE_CURVES).map(([laneIdx, points]) => [
      Number(laneIdx),
      points.map((point) => toWorldPoint(point, worldWidth, worldHeight)),
    ])
  );
};

const getPointOnLaneCurve = (points, progress) => {
  if (points.length === 0) return { x: 50, y: 50, angle: -90 };
  if (points.length === 1) return { x: points[0].x, y: points[0].y, angle: -90 };

  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const segmentLengths = [];
  let totalLength = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    segmentLengths.push(length);
    totalLength += length;
  }
  if (totalLength <= 0) return { x: points[0].x, y: points[0].y, angle: -90 };

  const targetDistance = clampedProgress * totalLength;
  let walked = 0;
  for (let i = 0; i < segmentLengths.length; i++) {
    const segmentLength = segmentLengths[i];
    const nextWalked = walked + segmentLength;
    if (targetDistance <= nextWalked || i === segmentLengths.length - 1) {
      const start = points[i];
      const end = points[i + 1];
      const localT = segmentLength <= 0 ? 0 : (targetDistance - walked) / segmentLength;
      const x = start.x + (end.x - start.x) * localT;
      const y = start.y + (end.y - start.y) * localT;
      const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
      return { x, y, angle };
    }
    walked = nextWalked;
  }
  const fallback = points[points.length - 1];
  return { x: fallback.x, y: fallback.y, angle: -90 };
};

// Pawn3D component
function Pawn3D({ color, avatar, letter, scale = 1, hopping }) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: 132 * scale, height: 168 * scale }}
      animate={hopping
        ? { y: [0, -56 * scale, 0], scaleX: [1, 0.97, 1.05, 1], scaleY: [1, 1.08, 0.92, 1] }
        : { y: [0, -6 * scale, 0], scaleX: [1, 1.01, 1], scaleY: [1, 0.99, 1] }
      }
      transition={{
        duration: hopping ? HOP_DURATION_MS * 0.72 / 1000 : 1.8,
        repeat: hopping ? 0 : Infinity,
        ease: hopping ? [0.22, 1, 0.36, 1] : 'easeInOut',
      }}
    >
      <div className="absolute bottom-2 rounded-full bg-black/65 blur-lg" style={{ width: 104 * scale, height: 24 * scale }} />

      {hopping && (
        <motion.div
          className="absolute bottom-8 rounded-full border border-white/40"
          style={{ width: 118 * scale, height: 44 * scale }}
          initial={{ scale: 0.7, opacity: 0.7 }}
          animate={{ scale: 1.35, opacity: 0 }}
          transition={{ duration: HOP_DURATION_MS / 1000, ease: 'easeOut' }}
        />
      )}

      <div
        className={`absolute bottom-4 rounded-full bg-gradient-to-b ${color}`}
        style={{ width: 98 * scale, height: 34 * scale, boxShadow: 'inset 0 -7px 14px rgba(0,0,0,0.45), 0 10px 18px rgba(0,0,0,0.35)' }}
      />

      <div
        className={`absolute rounded-[2rem] bg-gradient-to-br ${color} flex items-center justify-center overflow-hidden border border-white/45`}
        style={{
          bottom: 44 * scale,
          width: 86 * scale,
          height: 92 * scale,
          fontSize: 28 * scale,
          boxShadow: 'inset 8px 10px 18px rgba(255,255,255,0.32), inset -10px -14px 20px rgba(0,0,0,0.38), 0 18px 34px rgba(0,0,0,0.45)',
        }}
      >
        <div className="absolute inset-2 rounded-[1.5rem] border border-white/25 pointer-events-none" />
        <div className="absolute left-4 right-4 top-3 h-4 rounded-full bg-white/35 blur-sm pointer-events-none" />
        {avatar
          ? <img src={avatar} alt="" className="w-full h-full object-cover" />
          : <span className="relative z-10 text-white font-black drop-shadow">{letter}</span>
        }
      </div>

      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ bottom: 46 * scale, width: 122 * scale, height: 122 * scale, background: 'radial-gradient(circle, rgba(255,255,255,0.34) 0%, transparent 66%)' }}
        animate={{
          scale: hopping ? [0.92, 1.45, 0.92] : [1, 1.18, 1],
          opacity: hopping ? [0.8, 0, 0.5] : [0.42, 0.12, 0.42],
        }}
        transition={{ duration: hopping ? HOP_DURATION_MS / 1000 : 1.8, repeat: hopping ? 0 : Infinity }}
      />
    </motion.div>
  );
}

// Hook: step-animate position tile by tile
function useStepAnimation(targetPos, resetKey) {
  const [displayPos, setDisplayPos] = useState(targetPos);
  const [hopping, setHopping] = useState(false);
  const lastResetKeyRef = useRef(resetKey);

  useEffect(() => {
    if (lastResetKeyRef.current !== resetKey) {
      lastResetKeyRef.current = resetKey;
      setDisplayPos(targetPos);
      setHopping(false);
    }
  }, [resetKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (displayPos === targetPos) {
      setHopping(false);
      return;
    }
    setHopping(true);
    const settleTimer = setTimeout(() => setHopping(false), HOP_DURATION_MS * 0.72);
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

  return { displayPos, hopping };
}

const REFERENCE_DISTRICT_SCENES = [
  { image: '/city-game-roads/neon-downtown.png', label: 'Neon Downtown', colorWash: 'rgba(168,85,247,0.28)', position: 'center 58%' },
  { image: '/city-game-roads/rainy-street.png', label: 'Rainlit Avenue', colorWash: 'rgba(56,189,248,0.22)', position: 'center 58%' },
  { image: '/city-game-roads/night-alley.png', label: 'After Hours Row', colorWash: 'rgba(236,72,153,0.22)', position: 'center 56%' },
  { image: '/city-game-roads/neon-boardwalk.png', label: 'Dream Strip', colorWash: 'rgba(249,115,22,0.22)', position: 'center 58%' },
  { image: '/city-game-roads/chaos-gas-station.png', label: 'Stormline Station', colorWash: 'rgba(239,68,68,0.2)', position: 'center 57%' },
];

function CinematicCityBackdrop({ accent, districtIndex, progress }) {
  const sceneIndex = (districtIndex + Math.floor(progress * 3)) % REFERENCE_DISTRICT_SCENES.length;
  const scene = REFERENCE_DISTRICT_SCENES[sceneIndex];
  return (
    <div className="absolute inset-0 overflow-hidden bg-slate-950 pointer-events-none" style={{ zIndex: 0 }}>
      <div
        key={scene.image}
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: `url("${scene.image}")`,
          backgroundPosition: scene.position,
          filter: 'saturate(1.12) contrast(1.06) brightness(0.92)',
          transform: 'scale(1.025)',
        }}
      />
      <div className="absolute inset-0 mix-blend-screen" style={{
        background: `radial-gradient(circle at 50% 45%, ${scene.colorWash}, transparent 42%), radial-gradient(circle at 50% 78%, ${accent}44, transparent 30%)`,
      }} />
      <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-white/75 backdrop-blur-md">
        {scene.label}
      </div>
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(2,6,23,0.08) 0%, transparent 28%, rgba(2,6,23,0.38) 100%), radial-gradient(ellipse at 50% 68%, transparent 0%, transparent 46%, rgba(0,0,0,0.42) 100%)',
      }} />
      <motion.div
        className="absolute inset-x-0 top-[18%] h-[30%] bg-cyan-200/10 blur-3xl"
        animate={{ opacity: [0.16, 0.34, 0.18], x: ['-4%', '4%', '-4%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function CityLifeOverlay({ accent }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {[0, 1, 2].map((person) => (
        <motion.div
          key={`pedestrian-${person}`}
          className="absolute h-7 w-3 rounded-full bg-slate-100/70 shadow-[0_0_12px_rgba(255,255,255,0.45)]"
          style={{ top: `${52 + person * 10}%`, left: person % 2 === 0 ? '12%' : '84%' }}
          animate={{ y: [0, person % 2 === 0 ? 54 : -46], opacity: [0, 0.85, 0.85, 0] }}
          transition={{ duration: 9 + person * 1.8, repeat: Infinity, delay: person * 1.6, ease: 'linear' }}
        >
          <span className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-slate-200/80" />
        </motion.div>
      ))}

      {[0, 1].map((car) => (
        <motion.div
          key={`side-car-${car}`}
          className="absolute h-7 w-16 rounded-xl border border-white/15 bg-black/65 shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
          style={{ top: `${68 + car * 9}%`, left: car === 0 ? '-12%' : '104%' }}
          animate={{ x: car === 0 ? ['0vw', '42vw'] : ['0vw', '-38vw'], opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: 11 + car * 2, repeat: Infinity, delay: car * 3.5, ease: 'linear' }}
        >
          <span className="absolute left-2 top-1 h-1.5 w-5 rounded-full bg-cyan-200/80" />
          <span className="absolute right-1 bottom-1 h-1.5 w-3 rounded-full bg-red-400/90" />
        </motion.div>
      ))}

      {[0, 1, 2, 3].map((glint) => (
        <motion.span
          key={`road-glint-${glint}`}
          className="absolute h-px rounded-full"
          style={{
            left: `${33 + glint * 10}%`,
            top: `${58 + glint * 8}%`,
            width: `${72 + glint * 24}px`,
            background: glint % 2 === 0 ? accent : '#38bdf8',
            boxShadow: `0 0 18px ${glint % 2 === 0 ? accent : '#38bdf8'}`,
          }}
          animate={{ opacity: [0.05, 0.5, 0.08], scaleX: [0.7, 1.18, 0.82] }}
          transition={{ duration: 2.4 + glint * 0.35, repeat: Infinity, delay: glint * 0.45, ease: 'easeInOut' }}
        />
      ))}

      {[0, 1].map((steam) => (
        <motion.span
          key={`steam-${steam}`}
          className="absolute h-20 w-16 rounded-full bg-white/10 blur-xl"
          style={{ left: steam === 0 ? '24%' : '72%', bottom: `${10 + steam * 8}%` }}
          animate={{ y: [26, -38], opacity: [0, 0.32, 0], scale: [0.8, 1.35] }}
          transition={{ duration: 5.8 + steam, repeat: Infinity, delay: steam * 2.1, ease: 'easeOut' }}
        />
      ))}

      <motion.div
        className="absolute right-[8%] top-[18%] rounded-lg border border-fuchsia-300/40 bg-black/35 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-200 shadow-[0_0_24px_rgba(217,70,239,0.55)]"
        animate={{ opacity: [0.55, 1, 0.42, 0.9] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
      >
        Open late
      </motion.div>
      <motion.div
        className="absolute left-[11%] top-[22%] h-4 w-4 rounded-full bg-emerald-300 shadow-[0_0_22px_rgba(110,231,183,0.9)]"
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

// MAIN COMPONENT
export function RoadView({ paths, activePathTiles, players, currentPlayerIndex, focusedPathIndex, getTileById, categoryStyles }) {
  const currentPlayer = players[currentPlayerIndex];
  const viewportRef = useRef(null);
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const updateViewportSize = () => {
      const bounds = viewportRef.current?.getBoundingClientRect();
      if (!bounds) return;
      setViewportSize({ width: Math.max(320, bounds.width), height: Math.max(480, bounds.height) });
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

  const activePathIdx = focusedPathIndex !== null && focusedPathIndex !== undefined
    ? focusedPathIndex
    : (currentPlayer.pathIndex !== null && currentPlayer.pathIndex !== undefined ? currentPlayer.pathIndex : 0);
  const neon = PATH_NEON_HEX[activePathIdx] ?? '#a855f7';
  const zoomedTilesOnPath = activePathTiles[activePathIdx] ?? [];
  const totalTilesZoomed = zoomedTilesOnPath.length || 30;

  const { displayPos: zoomedDisplayPos, hopping } = useStepAnimation(
    currentPlayer.position,
    `${currentPlayer.id}-${activePathIdx}`
  );
  const clampedZoomedPos = Math.max(0, Math.min(zoomedDisplayPos, totalTilesZoomed - 1));

  const worldWidth = Math.max(BOARD_MIN_WORLD_WIDTH_PX, viewportSize.width * BOARD_WORLD_WIDTH_MULTIPLIER);
  const worldHeight = Math.max(BOARD_MIN_WORLD_HEIGHT_PX, viewportSize.height * BOARD_WORLD_HEIGHT_MULTIPLIER);

  const overviewLaneCurves = useMemo(() => {
    const worldLaneCurves = getWorldLaneCurves(worldWidth, worldHeight);
    return paths.map((_, laneIdx) => worldLaneCurves[laneIdx] ?? worldLaneCurves[0]);
  }, [paths, worldHeight, worldWidth]);

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

  return (
    <div
      ref={viewportRef}
      className="absolute inset-0 overflow-hidden z-[5] pointer-events-none"
      style={{ perspective: 980, perspectiveOrigin: '50% 78%' }}
    >
      <ThreeBackground neonColor={neon} progress={activeLaneProgress} />
      <CityLifeOverlay accent={neon} />

      <motion.div
        className="absolute left-0 top-0"
        style={{ width: worldWidth, height: worldHeight, transformOrigin: `${activeLanePoint.x}px ${activeLanePoint.y}px`, transformStyle: 'preserve-3d' }}
        animate={{ scale: cameraScale, x: cameraX, y: cameraY, rotateX: CAMERA_TILT_DEG, rotateZ: CAMERA_ROLL_DEG }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg className="absolute inset-0" viewBox={`0 0 ${worldWidth} ${worldHeight}`} preserveAspectRatio="none">
          <g>
            {activeLaneCurve.slice(0, -1).map((start, segmentIdx) => {
              const end = activeLaneCurve[segmentIdx + 1];
              const segmentScale = getPerspectiveScale((start.y + end.y) / 2, worldHeight);
              const segmentPath = toSvgSegmentPath(start, end);
              return (
                <g key={`road-segment-${activePathIdx}-${segmentIdx}`}>
                  <path d={segmentPath} fill="none" stroke="rgba(0,0,0,0.46)" strokeWidth={104 * segmentScale} strokeLinecap="round" strokeLinejoin="round" />
                  <path d={segmentPath} fill="none" stroke="rgba(17,24,39,0.96)" strokeWidth={86 * segmentScale} strokeLinecap="round" strokeLinejoin="round" />
                  <path d={segmentPath} fill="none" stroke="rgba(148,163,184,0.26)" strokeWidth={2.6 * segmentScale} strokeLinecap="round" strokeLinejoin="round" />
                  <path d={segmentPath} fill="none" stroke={`${neon}2f`} strokeWidth={74 * segmentScale} strokeLinecap="round" strokeLinejoin="round" />
                  <path d={segmentPath} fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth={2.2 * segmentScale} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${16 * segmentScale} ${20 * segmentScale}`} opacity={0.55} />
                </g>
              );
            })}
          </g>
        </svg>

        {[activePathIdx].map((laneIdx) => {
          const laneCurve = activeLaneCurve;
          const tilesOnLane = activePathTiles[laneIdx] ?? [];
          const totalTilesLane = tilesOnLane.length || 30;
          const laneColor = neon;
          return (
            <Fragment key={laneIdx}>
              {tilesOnLane.map((tileId, idx) => {
                const progress = idx / Math.max(1, totalTilesLane - 1);
                const point = getPointOnLaneCurve(laneCurve, progress);
                const distanceFromCurrent = idx - clampedZoomedPos;
                const isCheckpoint = idx % 5 === 0 || idx === totalTilesLane - 1;
                const showInZoom = distanceFromCurrent >= -ACTIVE_CARD_BEHIND_RANGE && distanceFromCurrent <= ACTIVE_CARD_AHEAD_RANGE;
                if (!showInZoom) return null;
                const isCurrent = distanceFromCurrent === 0;
                const isNearby = Math.abs(distanceFromCurrent) <= ACTIVE_DETAILED_AHEAD_RANGE;
                const tile = getTileById(tileId);
                const styleInfo = categoryStyles[tile.category] || categoryStyles.start;
                const TileIcon = styleInfo.icon;
                const tileRotate = getReadableLaneTilt(point.angle, 8);
                const perspectiveScale = getPerspectiveScale(point.y, worldHeight);
                const width = Math.round((isCurrent ? 132 : isCheckpoint ? 102 : 76) * perspectiveScale);
                const height = Math.round((isCurrent ? 34 : isCheckpoint ? 28 : 22) * perspectiveScale);
                const showText = isNearby || isCheckpoint;
                return (
                  <motion.div
                    key={`${laneIdx}-${tileId}-${idx}`}
                    className="absolute border rounded-md flex items-center justify-center overflow-hidden"
                    style={{
                      left: point.x,
                      top: point.y,
                      width,
                      height,
                      transform: `translate(-50%, -50%) translateZ(${isCurrent ? 8 : 3}px) rotate(${tileRotate}deg) rotateX(-6deg)`,
                      transformOrigin: 'center center',
                      borderColor: isCurrent ? `${laneColor}cc` : `${laneColor}${isCheckpoint ? '8f' : '5f'}`,
                      background: 'linear-gradient(180deg, rgba(51,65,85,0.88), rgba(15,23,42,0.98) 65%, rgba(2,6,23,0.98))',
                      boxShadow: isCurrent
                        ? `0 0 18px ${neon}66, inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -8px 12px rgba(0,0,0,0.42)`
                        : '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)',
                      zIndex: isCurrent ? 30 : 20,
                      opacity: isCurrent ? 1 : 0.82,
                    }}
                    animate={isCurrent ? { opacity: [0.88, 1, 0.88] } : undefined}
                    transition={{ duration: 0.45 }}
                  >
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[inherit]">
                      <div className="absolute inset-0 opacity-35" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0 2px, transparent 2px 6px)' }} />
                      <div className="absolute inset-x-[8%] top-1/2 h-px -translate-y-1/2 bg-white/30" />
                      <div className="absolute left-[12%] top-1/2 h-[55%] w-[2px] -translate-y-1/2 rounded-full" style={{ background: laneColor, boxShadow: `0 0 10px ${laneColor}`, opacity: isCurrent ? 0.95 : 0.65 }} />
                      {showText
                        ? <div className="relative z-[1] flex max-w-full items-center gap-1.5 px-2 text-white/90">
                            <TileIcon className={`${isCurrent ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5'} shrink-0`} />
                            <span className={`${isCurrent ? 'text-[9px]' : 'text-[7px]'} truncate font-black uppercase tracking-[0.12em]`}>
                              {isCurrent ? tile.name : `Space ${idx + 1}`}
                            </span>
                          </div>
                        : <div className="relative z-[1] h-1.5 w-1.5 rounded-full bg-white/80" style={{ boxShadow: `0 0 7px ${laneColor}` }} />
                      }
                    </div>
                  </motion.div>
                );
              })}
            </Fragment>
          );
        })}

        {/* Pawn shadow ring */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/45"
          style={{
            left: activeLanePoint.x,
            top: activeLanePoint.y,
            width: 172,
            height: 42,
            background: `radial-gradient(circle, ${neon}88 0%, ${neon}22 60%, transparent 100%)`,
            boxShadow: `0 0 20px ${neon}88`,
            zIndex: 34,
          }}
          animate={{
            scaleX: hopping ? [1, 0.94, 1.08, 1] : [1, 1.03, 1],
            scaleY: hopping ? [1, 1.06, 0.94, 1] : [1, 0.98, 1],
          }}
          transition={{ duration: hopping ? HOP_DURATION_MS * 0.72 / 1000 : 1.5 }}
        />

        {/* Pawn */}
        <motion.div
          className="absolute"
          style={{
            left: activeLanePoint.x,
            top: activeLanePoint.y,
            transform: `translate(-50%, -100%) translateZ(88px) rotateX(-${CAMERA_TILT_DEG}deg)`,
            filter: `drop-shadow(0 0 28px ${neon}cc)`,
            zIndex: 40,
          }}
          animate={{ left: activeLanePoint.x, top: activeLanePoint.y }}
          transition={{ duration: HOP_DURATION_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
        >
          <Pawn3D
            color={PAWN_COLORS[currentPlayer.color] || PAWN_COLORS.purple}
            avatar={currentPlayer.avatar}
            letter={currentPlayer.name.charAt(0).toUpperCase()}
            scale={0.72}
            hopping={hopping}
          />
        </motion.div>
      </motion.div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(5,8,18,0.12) 0%, transparent 30%, rgba(2,4,10,0.3) 100%), radial-gradient(ellipse at 50% 72%, transparent 0%, transparent 46%, rgba(0,0,0,0.34) 100%)',
          zIndex: 2,
        }}
      />
    </div>
  );
}