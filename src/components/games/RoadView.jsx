import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Neon billboard messages flanking the road
const LEFT_BILLBOARDS = [
  { text: 'Invest In\nYourself', sub: '📈', color: '#3b82f6' },
  { text: 'Choices\nToday\nReality\nTomorrow', color: '#a855f7' },
  { text: 'Focus\nPlan\nExecute\nRepeat', color: '#f59e0b' },
  { text: 'Hustle\nHard', color: '#f97316' },
  { text: 'Dream\nPlan\nBuild\nLive', color: '#ec4899' },
];
const RIGHT_BILLBOARDS = [
  { text: 'Opportunity\nIs Everywhere', color: '#22d3ee' },
  { text: 'No Risk\nNo Reward', color: '#f59e0b' },
  { text: 'Build\nYour\nFuture', color: '#a78bfa' },
  { text: 'Stay\nFocused', color: '#fbbf24' },
  { text: 'Success\nStarts\nHere', color: '#34d399' },
];
const NEON_SIGNS = ['CAFE', 'GYM', 'BOOKS', 'MOTEL\nVACANCY', 'MARKET', '24/7'];

const HOP_MS = 450;

function useStepAnimation(target, resetKey) {
  const [displayed, setDisplayed] = useState(target);
  const [hopping, setHopping] = useState(false);
  const keyRef = useRef(resetKey);

  useEffect(() => {
    if (keyRef.current !== resetKey) {
      keyRef.current = resetKey;
      setDisplayed(target);
      setHopping(false);
    }
  }, [resetKey, target]);

  useEffect(() => {
    if (displayed === target) { setHopping(false); return; }
    setHopping(true);
    const settle = setTimeout(() => setHopping(false), HOP_MS * 0.72);
    const step = setTimeout(() => {
      setDisplayed(prev => prev + (target > prev ? 1 : -1));
    }, HOP_MS);
    return () => { clearTimeout(settle); clearTimeout(step); };
  }, [displayed, target]);

  return { displayed, hopping };
}

// The 3D pawn piece
function Pawn({ color, avatar, letter, hopping }) {
  const grad = {
    pink: ['#f472b6','#ec4899','#be185d'],
    purple: ['#c084fc','#a855f7','#7e22ce'],
    blue: ['#60a5fa','#3b82f6','#1d4ed8'],
    teal: ['#2dd4bf','#14b8a6','#0f766e'],
    gold: ['#fbbf24','#f59e0b','#b45309'],
    coral: ['#fb923c','#f97316','#c2410c'],
  }[color] || ['#c084fc','#a855f7','#7e22ce'];

  return (
    <motion.div
      className="relative flex flex-col items-center"
      style={{ width: 72, height: 88 }}
      animate={hopping
        ? { y: [0, -36, 0], scaleX: [1, 0.96, 1.04, 1], scaleY: [1, 1.08, 0.92, 1] }
        : { y: [0, -4, 0] }
      }
      transition={hopping
        ? { duration: HOP_MS * 0.72 / 1000, ease: [0.22, 1, 0.36, 1] }
        : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      {/* Shadow */}
      <div className="absolute bottom-0 rounded-full blur-md"
        style={{ width: 56, height: 14, background: 'rgba(0,0,0,0.7)' }} />
      {/* Stem */}
      <div className="absolute rounded-full"
        style={{
          bottom: 12, width: 22, height: 22,
          background: `linear-gradient(to bottom, ${grad[0]}, ${grad[2]})`,
          boxShadow: `0 0 18px ${grad[1]}cc`,
        }} />
      {/* Head */}
      <div className="absolute rounded-full border-2 border-white/40 flex items-center justify-center overflow-hidden"
        style={{
          bottom: 26, width: 52, height: 52,
          background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]}, ${grad[2]})`,
          boxShadow: `0 0 28px ${grad[1]}dd, inset 0 4px 8px rgba(255,255,255,0.3)`,
        }}>
        {avatar
          ? <img src={avatar} alt="" className="w-full h-full object-cover" />
          : <span className="text-white font-black text-lg drop-shadow">{letter}</span>
        }
        {/* Shine */}
        <div className="absolute top-1 left-2 w-5 h-2 rounded-full bg-white/40 blur-sm" />
      </div>
    </motion.div>
  );
}

// A single tile card embedded in the road
function RoadTile({ tile, icon: Icon, distFromCurrent, laneColor, perspectiveIndex, totalVisible }) {
  const isCurrent = distFromCurrent === 0;
  const isAhead = distFromCurrent > 0;

  // Perspective: tiles further ahead appear smaller and higher
  const depthT = (distFromCurrent + 1) / (totalVisible + 1); // 0=close, 1=far
  const scale = isCurrent ? 1 : Math.max(0.28, 1 - distFromCurrent * 0.18);
  const opacity = isCurrent ? 1 : Math.max(0.35, 1 - distFromCurrent * 0.2);

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.8 }}
      animate={{ opacity, scale }}
      className="relative rounded-xl border flex flex-col items-center justify-center text-center overflow-hidden"
      style={{
        borderColor: isCurrent ? `${laneColor}cc` : `${laneColor}66`,
        background: isCurrent
          ? `linear-gradient(180deg, rgba(20,10,40,0.97), rgba(5,2,15,0.99))`
          : `linear-gradient(180deg, rgba(15,8,30,0.92), rgba(3,1,10,0.96))`,
        boxShadow: isCurrent
          ? `0 0 40px ${laneColor}88, 0 0 80px ${laneColor}44, inset 0 1px 0 rgba(255,255,255,0.15)`
          : `0 0 12px ${laneColor}33, inset 0 1px 0 rgba(255,255,255,0.08)`,
        padding: isCurrent ? '14px 20px' : '8px 12px',
      }}
    >
      {/* Neon border glow strip */}
      <div className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${laneColor}, transparent)` }} />
      <div className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${laneColor}88, transparent)` }} />

      {isCurrent && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${laneColor}22, transparent 70%)` }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center gap-1">
        {isCurrent && <Icon className="w-5 h-5 mb-1" style={{ color: laneColor }} />}
        {!isCurrent && distFromCurrent <= 2 && (
          <p className="text-[7px] font-black uppercase tracking-widest opacity-60" style={{ color: laneColor }}>
            Space {perspectiveIndex}
          </p>
        )}
        {(isCurrent || distFromCurrent <= 2) && (
          <p className={`font-black text-white leading-tight ${isCurrent ? 'text-sm' : 'text-[8px]'}`}
            style={{ textShadow: isCurrent ? `0 0 12px ${laneColor}` : 'none' }}>
            {isCurrent ? tile.name : tile.name}
          </p>
        )}
        {distFromCurrent > 2 && (
          <div className="w-2 h-2 rounded-full" style={{ background: laneColor, boxShadow: `0 0 6px ${laneColor}` }} />
        )}
      </div>
    </motion.div>
  );
}

export function RoadView({ paths, activePathTiles, players, currentPlayerIndex, focusedPathIndex, getTileById, categoryStyles }) {
  const currentPlayer = players[currentPlayerIndex];
  const pathIdx = focusedPathIndex !== null && focusedPathIndex !== undefined
    ? focusedPathIndex
    : (currentPlayer?.pathIndex ?? 0);

  const tilesOnPath = activePathTiles[pathIdx] ?? [];
  const totalTiles = tilesOnPath.length || 1;

  const { displayed: displayPos, hopping } = useStepAnimation(
    currentPlayer?.position ?? 0,
    `${currentPlayer?.id}-${pathIdx}`
  );

  // Color per path
  const LANE_COLORS = ['#a855f7', '#ec4899', '#f97316'];
  const laneColor = LANE_COLORS[pathIdx] ?? '#a855f7';

  // Show tiles: current + up to 5 ahead
  const SHOW_AHEAD = 5;
  const visibleTiles = [];
  for (let d = 0; d <= SHOW_AHEAD; d++) {
    const idx = displayPos + d;
    if (idx >= totalTiles) break;
    visibleTiles.push({ tileIndex: idx, dist: d });
  }

  // Billboard picks based on path progress
  const progress = displayPos / Math.max(1, totalTiles - 1);
  const leftBB = LEFT_BILLBOARDS[Math.floor(progress * LEFT_BILLBOARDS.length) % LEFT_BILLBOARDS.length];
  const rightBB = RIGHT_BILLBOARDS[Math.floor(progress * RIGHT_BILLBOARDS.length) % RIGHT_BILLBOARDS.length];
  const leftSign = NEON_SIGNS[pathIdx % NEON_SIGNS.length];
  const rightSign = NEON_SIGNS[(pathIdx + 2) % NEON_SIGNS.length];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: 'linear-gradient(180deg, #020408 0%, #04080f 40%, #080410 100%)' }}>

      {/* ─── CITY SKYLINE ─── */}
      <div className="absolute inset-x-0 top-0 h-[45%] overflow-hidden">
        {/* Sky gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, #010206 0%, #02040e 50%, #06020f 100%)'
        }} />
        {/* Buildings */}
        {[
          { l: '2%', w: '7%', h: '52%', windows: 24, accent: laneColor },
          { l: '9%', w: '5%', h: '38%', windows: 15 },
          { l: '14%', w: '9%', h: '62%', windows: 35, accent: '#f97316' },
          { l: '23%', w: '6%', h: '44%', windows: 18 },
          { l: '29%', w: '8%', h: '55%', windows: 28, accent: '#3b82f6' },
          { l: '37%', w: '5%', h: '35%', windows: 12 },
          { l: '42%', w: '7%', h: '70%', windows: 42, accent: laneColor, isPinacle: true },
          { l: '49%', w: '5%', h: '40%', windows: 16 },
          { l: '54%', w: '6%', h: '48%', windows: 22 },
          { l: '60%', w: '8%', h: '58%', windows: 30, accent: '#ec4899' },
          { l: '68%', w: '5%', h: '36%', windows: 14 },
          { l: '73%', w: '9%', h: '65%', windows: 38, accent: '#22d3ee' },
          { l: '82%', w: '6%', h: '43%', windows: 20 },
          { l: '88%', w: '7%', h: '50%', windows: 26, accent: laneColor },
          { l: '95%', w: '5%', h: '32%', windows: 10 },
        ].map((b, i) => (
          <div key={i} className="absolute bottom-0 rounded-t-sm"
            style={{
              left: b.l, width: b.w, height: b.h,
              background: 'linear-gradient(180deg, #0a0a1a, #040408)',
              boxShadow: b.accent ? `0 0 20px ${b.accent}33` : undefined,
            }}>
            {/* Windows grid */}
            <div className="absolute inset-x-1 top-2 grid grid-cols-3 gap-0.5">
              {Array.from({ length: Math.min(b.windows, 30) }).map((_, wi) => (
                <div key={wi} className="h-1 rounded-sm"
                  style={{
                    background: wi % 7 === 0 ? (b.accent || '#fbbf24') :
                      wi % 5 === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.06)',
                    boxShadow: wi % 7 === 0 ? `0 0 6px ${b.accent || '#fbbf24'}` : undefined,
                  }} />
              ))}
            </div>
            {/* Tower top glow for tallest buildings */}
            {b.isPinacle && (
              <motion.div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                style={{ background: laneColor, boxShadow: `0 0 20px ${laneColor}` }}
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }} />
            )}
          </div>
        ))}
        {/* Horizon glow */}
        <div className="absolute bottom-0 inset-x-0 h-12"
          style={{ background: `linear-gradient(0deg, ${laneColor}22, transparent)` }} />
      </div>

      {/* ─── WET ROAD SURFACE ─── */}
      <div className="absolute bottom-0 inset-x-0 h-[60%]"
        style={{ background: 'linear-gradient(180deg, #050210 0%, #020108 100%)' }}>
        {/* Road reflections / wet sheen */}
        <div className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${laneColor}08 0%, transparent 30%), radial-gradient(ellipse at 50% 20%, ${laneColor}18, transparent 60%)`,
          }} />
        {/* Yellow center lines */}
        {[0, 1].map(i => (
          <div key={i} className="absolute top-[5%] bottom-0"
            style={{
              left: `${47 + i * 6}%`, width: 3,
              background: `repeating-linear-gradient(180deg, #fbbf24 0px, #fbbf24 40px, transparent 40px, transparent 70px)`,
              opacity: 0.7,
            }} />
        ))}
        {/* Subtle wet road reflection streaks */}
        {[0,1,2,3,4].map(i => (
          <motion.div key={i} className="absolute"
            style={{
              left: `${20 + i * 14}%`, top: '15%',
              width: 2, height: '60%',
              background: `linear-gradient(180deg, transparent, ${laneColor}44, transparent)`,
              opacity: 0.3,
            }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.4 }} />
        ))}
      </div>

      {/* ─── LEFT SIDEWALK + BUILDINGS ─── */}
      <div className="absolute left-0 top-[30%] bottom-0 w-[22%]"
        style={{ background: 'linear-gradient(90deg, #020106, #040210)' }}>
        <div className="absolute right-0 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
        {/* Streetlight */}
        <div className="absolute right-4 top-0 w-1 h-[55%] bg-gray-700 rounded-full">
          <div className="absolute -right-3 top-0 w-8 h-1 bg-gray-600 rounded-full" />
          <motion.div className="absolute -right-2 top-0 w-4 h-4 rounded-full"
            style={{ background: '#fbbf24', boxShadow: '0 0 30px #fbbf2488' }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }} />
        </div>
        {/* Store fronts */}
        <div className="absolute bottom-0 left-0 right-0 h-[50%] border-t border-white/10"
          style={{ background: 'linear-gradient(0deg, #060214, #03010a)' }}>
          <div className="absolute top-2 left-2 right-2 h-8 border border-white/10 rounded flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.6)' }}>
            <motion.span className="text-[10px] font-black tracking-widest"
              style={{ color: '#fbbf24', textShadow: '0 0 12px #fbbf24' }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}>
              {leftSign}
            </motion.span>
          </div>
        </div>
      </div>

      {/* ─── RIGHT SIDEWALK + BUILDINGS ─── */}
      <div className="absolute right-0 top-[30%] bottom-0 w-[22%]"
        style={{ background: 'linear-gradient(270deg, #020106, #040210)' }}>
        <div className="absolute left-0 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
        {/* Streetlight */}
        <div className="absolute left-4 top-0 w-1 h-[55%] bg-gray-700 rounded-full">
          <div className="absolute -left-3 top-0 w-8 h-1 bg-gray-600 rounded-full" />
          <motion.div className="absolute -left-2 top-0 w-4 h-4 rounded-full"
            style={{ background: '#fbbf24', boxShadow: '0 0 30px #fbbf2488' }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2.3, repeat: Infinity }} />
        </div>
        {/* Store fronts */}
        <div className="absolute bottom-0 left-0 right-0 h-[50%] border-t border-white/10"
          style={{ background: 'linear-gradient(0deg, #060214, #03010a)' }}>
          <div className="absolute top-2 left-2 right-2 h-8 border border-white/10 rounded flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.6)' }}>
            <motion.span className="text-[10px] font-black tracking-widest"
              style={{ color: '#34d399', textShadow: '0 0 12px #34d399' }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.8, repeat: Infinity }}>
              {rightSign}
            </motion.span>
          </div>
        </div>
      </div>

      {/* ─── LEFT BILLBOARD ─── */}
      <div className="absolute" style={{ left: '1%', top: '8%', width: '18%' }}>
        <motion.div
          className="rounded-lg border p-3"
          style={{
            borderColor: `${leftBB.color}66`,
            background: 'rgba(0,0,0,0.85)',
            boxShadow: `0 0 30px ${leftBB.color}44`,
          }}
          animate={{ boxShadow: [`0 0 20px ${leftBB.color}33`, `0 0 40px ${leftBB.color}66`, `0 0 20px ${leftBB.color}33`] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <p className="font-black text-sm leading-tight whitespace-pre-line"
            style={{ color: leftBB.color, textShadow: `0 0 16px ${leftBB.color}` }}>
            {leftBB.text}
          </p>
          {leftBB.sub && <p className="text-lg mt-1">{leftBB.sub}</p>}
        </motion.div>
      </div>

      {/* ─── RIGHT BILLBOARD ─── */}
      <div className="absolute" style={{ right: '1%', top: '8%', width: '18%' }}>
        <motion.div
          className="rounded-lg border p-3 text-right"
          style={{
            borderColor: `${rightBB.color}66`,
            background: 'rgba(0,0,0,0.85)',
            boxShadow: `0 0 30px ${rightBB.color}44`,
          }}
          animate={{ boxShadow: [`0 0 20px ${rightBB.color}33`, `0 0 40px ${rightBB.color}66`, `0 0 20px ${rightBB.color}33`] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <p className="font-black text-sm leading-tight whitespace-pre-line"
            style={{ color: rightBB.color, textShadow: `0 0 16px ${rightBB.color}` }}>
            {rightBB.text}
          </p>
        </motion.div>
      </div>

      {/* ─── GAME TITLE BILLBOARD (top center) ─── */}
      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 z-10">
        <motion.div
          className="rounded-xl border-2 px-5 py-2 text-center"
          style={{
            borderColor: `${laneColor}88`,
            background: 'rgba(0,0,0,0.9)',
            boxShadow: `0 0 40px ${laneColor}55`,
          }}
          animate={{ boxShadow: [`0 0 20px ${laneColor}44`, `0 0 50px ${laneColor}88`, `0 0 20px ${laneColor}44`] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="font-black text-base italic leading-tight"
            style={{ color: laneColor, textShadow: `0 0 20px ${laneColor}`, fontFamily: '"Dancing Script", cursive', fontSize: 20 }}>
            Trippin'
          </p>
          <p className="font-black text-[9px] tracking-widest text-white/80 uppercase">
            Through Life With Mandy
          </p>
        </motion.div>
      </div>

      {/* ─── ROAD TILES (perspective receding into horizon) ─── */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-4"
        style={{ top: '42%' }}>

        {/* Render tiles from far (top) to near (bottom) */}
        {[...visibleTiles].reverse().map(({ tileIndex, dist }, i) => {
          const tile = getTileById(tilesOnPath[tileIndex]);
          const styleInfo = categoryStyles[tile.category] || categoryStyles.start;
          const Icon = styleInfo.icon;
          const isCurrent = dist === 0;

          // Perspective sizing: current tile is large at bottom, ahead tiles shrink
          const tileW = isCurrent ? 320 : Math.max(80, 320 - dist * 52);
          const tileH = isCurrent ? 90 : Math.max(32, 90 - dist * 14);
          const mb = isCurrent ? 0 : dist === 1 ? 8 : 4;
          const opacity = Math.max(0.3, 1 - dist * 0.18);

          return (
            <motion.div
              key={`tile-${tileIndex}`}
              className="relative rounded-xl border flex items-center justify-center text-center overflow-hidden flex-shrink-0"
              style={{
                width: tileW,
                height: tileH,
                marginBottom: mb,
                opacity,
                borderColor: isCurrent ? `${laneColor}cc` : `${laneColor}55`,
                background: isCurrent
                  ? `linear-gradient(180deg, rgba(20,10,45,0.98), rgba(5,2,18,0.99))`
                  : `linear-gradient(180deg, rgba(12,6,28,0.92), rgba(3,1,12,0.96))`,
                boxShadow: isCurrent
                  ? `0 0 50px ${laneColor}88, 0 0 100px ${laneColor}33, inset 0 1px 0 rgba(255,255,255,0.15), 0 -4px 30px ${laneColor}44`
                  : `0 0 10px ${laneColor}22`,
              }}
            >
              {/* Neon border strips */}
              <div className="absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${laneColor}${isCurrent ? 'cc' : '44'}, transparent)` }} />
              <div className="absolute inset-x-0 bottom-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${laneColor}${isCurrent ? '88' : '22'}, transparent)` }} />
              {/* Corner glows */}
              {isCurrent && <>
                <div className="absolute top-0 left-0 w-8 h-8 rounded-br-full"
                  style={{ background: `radial-gradient(circle at 0 0, ${laneColor}44, transparent)` }} />
                <div className="absolute top-0 right-0 w-8 h-8 rounded-bl-full"
                  style={{ background: `radial-gradient(circle at 100% 0, ${laneColor}44, transparent)` }} />
              </>}

              {/* Animated glow pulse on current */}
              {isCurrent && (
                <motion.div className="absolute inset-0 pointer-events-none"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${laneColor}22, transparent 70%)` }} />
              )}

              <div className="relative z-10 flex items-center gap-3 px-4">
                {isCurrent && <Icon className="w-6 h-6 flex-shrink-0" style={{ color: laneColor, filter: `drop-shadow(0 0 8px ${laneColor})` }} />}
                <div className="text-left">
                  {!isCurrent && dist <= 3 && (
                    <p className="font-black uppercase tracking-widest"
                      style={{ fontSize: Math.max(6, 9 - dist), color: `${laneColor}99` }}>
                      SPACE {tileIndex + 1}
                    </p>
                  )}
                  {(isCurrent || dist <= 2) ? (
                    <p className={`font-black text-white leading-tight ${isCurrent ? 'text-base' : dist === 1 ? 'text-[9px]' : 'text-[7px]'}`}
                      style={{ textShadow: isCurrent ? `0 0 16px ${laneColor}` : 'none' }}>
                      {isCurrent ? tile.name : `${tile.name}`}
                    </p>
                  ) : (
                    <div className="w-2 h-2 rounded-full"
                      style={{ background: laneColor, boxShadow: `0 0 6px ${laneColor}` }} />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* ─── PAWN on current tile ─── */}
        <div className="absolute" style={{ bottom: 78, left: '50%', transform: 'translateX(-50%)' }}>
          {/* Pawn glow halo */}
          <motion.div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full"
            style={{ width: 80, height: 20, background: `radial-gradient(ellipse, ${laneColor}88, transparent 70%)`, filter: 'blur(4px)' }}
            animate={{ scaleX: hopping ? [1, 0.8, 1.2, 1] : [1, 1.05, 1], opacity: hopping ? [0.8, 0.3, 0.8] : [0.6, 0.9, 0.6] }}
            transition={{ duration: hopping ? HOP_MS / 1000 : 1.5, repeat: hopping ? 0 : Infinity }} />

          <Pawn
            color={currentPlayer?.color ?? 'purple'}
            avatar={currentPlayer?.avatar}
            letter={currentPlayer?.name?.charAt(0)?.toUpperCase() ?? 'P'}
            hopping={hopping}
          />
        </div>
      </div>

      {/* ─── PLAYER INFO BADGE ─── */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="flex items-center gap-2 rounded-full border px-3 py-1.5"
          style={{ borderColor: `${laneColor}55`, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-black"
            style={{ background: laneColor, boxShadow: `0 0 10px ${laneColor}` }}>
            {currentPlayer?.name?.charAt(0)}
          </div>
          <span className="text-white text-xs font-bold">{currentPlayer?.name}</span>
          <span className="font-black text-xs" style={{ color: (currentPlayer?.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
            ${currentPlayer?.money ?? 0}
          </span>
        </div>
      </div>

      {/* ─── AMBIENT RAIN EFFECT ─── */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div key={`rain-${i}`}
          className="absolute w-px rounded-full pointer-events-none"
          style={{
            left: `${5 + i * 4.5}%`,
            top: 0,
            height: 60,
            background: 'linear-gradient(180deg, transparent, rgba(180,210,255,0.3), transparent)',
          }}
          animate={{ y: ['0%', '110%'], opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.2 + (i % 5) * 0.15, repeat: Infinity, delay: i * 0.07, ease: 'linear' }} />
      ))}

      {/* ─── HORIZON GLOW ─── */}
      <div className="absolute pointer-events-none"
        style={{
          top: '38%', left: '20%', right: '20%', height: 60,
          background: `radial-gradient(ellipse at 50% 50%, ${laneColor}33, transparent 70%)`,
          filter: 'blur(12px)',
        }} />
    </div>
  );
}