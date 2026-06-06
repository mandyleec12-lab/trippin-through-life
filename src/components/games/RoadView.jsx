import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

// 3D Pawn: ball on a stem
function Pawn({ color, avatar, letter, hopping }) {
  const grad = {
    pink:   ['#f472b6','#ec4899','#be185d'],
    purple: ['#c084fc','#a855f7','#7e22ce'],
    blue:   ['#60a5fa','#3b82f6','#1d4ed8'],
    teal:   ['#2dd4bf','#14b8a6','#0f766e'],
    gold:   ['#fbbf24','#f59e0b','#b45309'],
    coral:  ['#fb923c','#f97316','#c2410c'],
  }[color] || ['#c084fc','#a855f7','#7e22ce'];

  return (
    <motion.div
      className="relative flex flex-col items-center"
      style={{ width: 80, height: 100 }}
      animate={hopping
        ? { y: [0, -40, 0], scaleX: [1, 0.95, 1.05, 1], scaleY: [1, 1.1, 0.9, 1] }
        : { y: [0, -5, 0] }
      }
      transition={hopping
        ? { duration: HOP_MS * 0.72 / 1000, ease: [0.22, 1, 0.36, 1] }
        : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      {/* Shadow on road */}
      <div className="absolute bottom-0 rounded-full blur-md"
        style={{ width: 64, height: 16, background: 'rgba(0,0,0,0.8)' }} />
      {/* Stem base disc */}
      <div className="absolute rounded-full"
        style={{
          bottom: 14, left: '50%', transform: 'translateX(-50%)',
          width: 28, height: 12,
          background: `linear-gradient(to bottom, ${grad[0]}88, ${grad[2]}cc)`,
          boxShadow: `0 0 16px ${grad[1]}aa`,
        }} />
      {/* Stem */}
      <div className="absolute rounded-full"
        style={{
          bottom: 22, left: '50%', transform: 'translateX(-50%)',
          width: 14, height: 30,
          background: `linear-gradient(to bottom, ${grad[0]}, ${grad[2]})`,
          boxShadow: `0 0 12px ${grad[1]}88`,
        }} />
      {/* Ball head */}
      <div className="absolute rounded-full border-2 border-white/30 flex items-center justify-center overflow-hidden"
        style={{
          bottom: 44, left: '50%', transform: 'translateX(-50%)',
          width: 58, height: 58,
          background: `radial-gradient(circle at 35% 30%, ${grad[0]}, ${grad[1]} 50%, ${grad[2]})`,
          boxShadow: `0 0 32px ${grad[1]}cc, 0 0 60px ${grad[1]}55, inset 0 4px 10px rgba(255,255,255,0.4)`,
        }}>
        {avatar
          ? <img src={avatar} alt="" className="w-full h-full object-cover" />
          : <span className="text-white font-black text-xl drop-shadow">{letter}</span>
        }
        {/* Specular highlight */}
        <div className="absolute top-2 left-3 w-6 h-3 rounded-full bg-white/50 blur-sm" />
      </div>
    </motion.div>
  );
}

export function RoadView({ paths, activePathTiles, players, currentPlayerIndex, focusedPathIndex, getTileById, categoryStyles, playerColors }) {
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

  const LANE_COLORS = ['#a855f7', '#ec4899', '#f59e0b'];
  const laneColor = LANE_COLORS[pathIdx] ?? '#a855f7';

  // Show current tile + up to 6 ahead (they shrink toward horizon)
  const SHOW_AHEAD = 6;
  const visibleTiles = [];
  for (let d = 0; d <= SHOW_AHEAD; d++) {
    const idx = displayPos + d;
    if (idx >= totalTiles) break;
    visibleTiles.push({ tileIndex: idx, dist: d });
  }

  // Perspective trapezoid geometry for each tile
  // Tile at dist=0 (current): large near camera
  // Tiles shrink as dist increases toward horizon
  // We place them in a CSS perspective container, stacked vertically

  // Tile dimensions: width narrows, height shrinks with distance
  const getTileDims = (dist) => {
    const scale = Math.pow(0.62, dist);
    const w = Math.round(560 * scale);
    const h = Math.round(110 * scale);
    return { w, h };
  };

  // Vertical gap between tiles (also perspective-compressed)
  const getGap = (dist) => Math.round(8 * Math.pow(0.62, dist));

  return (
    <div className="absolute inset-0 overflow-hidden select-none"
      style={{ background: 'linear-gradient(180deg, #010308 0%, #020510 45%, #03020a 100%)' }}>

      {/* ── SKY + CITY SKYLINE ── */}
      <div className="absolute inset-x-0 top-0" style={{ height: '52%' }}>
        {/* Deep night sky gradient */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #000208 0%, #01041a 55%, #050218 100%)' }} />

        {/* Stars */}
        {[...Array(40)].map((_, i) => (
          <motion.div key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: i % 5 === 0 ? 2 : 1,
              height: i % 5 === 0 ? 2 : 1,
              left: `${(i * 7.3 + 3) % 100}%`,
              top: `${(i * 11.7 + 2) % 45}%`,
              opacity: 0.4 + (i % 3) * 0.2,
            }}
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2 + i % 4, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}

        {/* City buildings silhouette — left cluster */}
        {[
          { l: '0%',  w: '7%',  h: '75%', windows: 24, accent: null },
          { l: '6%',  w: '5%',  h: '55%', windows: 16, accent: laneColor },
          { l: '10%', w: '8%',  h: '85%', windows: 32, accent: '#f97316', tall: true },
          { l: '17%', w: '6%',  h: '62%', windows: 20, accent: null },
          { l: '22%', w: '7%',  h: '70%', windows: 28, accent: '#3b82f6' },
          { l: '28%', w: '5%',  h: '45%', windows: 14, accent: null },
          { l: '32%', w: '6%',  h: '58%', windows: 18, accent: laneColor },
        ].map((b, i) => (
          <div key={`bl-${i}`} className="absolute bottom-0 rounded-t-sm"
            style={{
              left: b.l, width: b.w, height: b.h,
              background: `linear-gradient(180deg, #0d0d1e, #060610)`,
              boxShadow: b.accent ? `0 0 30px ${b.accent}33` : undefined,
            }}>
            <div className="absolute inset-x-1 top-2 grid grid-cols-3 gap-px">
              {Array.from({ length: Math.min(b.windows, 24) }).map((_, wi) => (
                <div key={wi} className="h-1 rounded-sm"
                  style={{
                    background: wi % 7 === 0 ? (b.accent || '#fbbf24') :
                      wi % 4 === 0 ? 'rgba(255,255,200,0.6)' : 'rgba(255,255,255,0.04)',
                    boxShadow: wi % 7 === 0 ? `0 0 8px ${b.accent || '#fbbf24'}` : undefined,
                  }} />
              ))}
            </div>
            {b.tall && (
              <motion.div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                style={{ background: laneColor, boxShadow: `0 0 16px ${laneColor}` }}
                animate={{ opacity: [1, 0.1, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }} />
            )}
          </div>
        ))}

        {/* City buildings silhouette — right cluster */}
        {[
          { r: '0%',  w: '7%',  h: '72%', windows: 22, accent: null },
          { r: '6%',  w: '5%',  h: '50%', windows: 15, accent: '#ec4899' },
          { r: '10%', w: '8%',  h: '90%', windows: 35, accent: '#22d3ee', tall: true },
          { r: '17%', w: '6%',  h: '65%', windows: 21, accent: null },
          { r: '22%', w: '7%',  h: '68%', windows: 26, accent: laneColor },
          { r: '28%', w: '5%',  h: '42%', windows: 13, accent: null },
          { r: '32%', w: '6%',  h: '55%', windows: 17, accent: '#f59e0b' },
        ].map((b, i) => (
          <div key={`br-${i}`} className="absolute bottom-0 rounded-t-sm"
            style={{
              right: b.r, width: b.w, height: b.h,
              background: `linear-gradient(180deg, #0d0d1e, #060610)`,
              boxShadow: b.accent ? `0 0 30px ${b.accent}33` : undefined,
            }}>
            <div className="absolute inset-x-1 top-2 grid grid-cols-3 gap-px">
              {Array.from({ length: Math.min(b.windows, 24) }).map((_, wi) => (
                <div key={wi} className="h-1 rounded-sm"
                  style={{
                    background: wi % 6 === 0 ? (b.accent || '#fbbf24') :
                      wi % 4 === 0 ? 'rgba(255,255,200,0.5)' : 'rgba(255,255,255,0.04)',
                    boxShadow: wi % 6 === 0 ? `0 0 8px ${b.accent || '#fbbf24'}` : undefined,
                  }} />
              ))}
            </div>
            {b.tall && (
              <motion.div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                style={{ background: b.accent || laneColor, boxShadow: `0 0 16px ${b.accent || laneColor}` }}
                animate={{ opacity: [1, 0.1, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: 0.4 }} />
            )}
          </div>
        ))}

        {/* Horizon glow */}
        <div className="absolute bottom-0 inset-x-0 h-16"
          style={{ background: `linear-gradient(0deg, ${laneColor}1a 0%, transparent 100%)` }} />

        {/* Vanishing point glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: 300, height: 80,
            background: `radial-gradient(ellipse at 50% 100%, ${laneColor}44, transparent 70%)`,
            filter: 'blur(8px)',
          }} />
      </div>

      {/* ── WET ROAD SURFACE ── */}
      <div className="absolute inset-x-0 bottom-0" style={{ top: '48%' }}>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #040112 0%, #020008 100%)' }} />

        {/* Road wet sheen / reflection */}
        <div className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${laneColor}18 0%, transparent 55%), linear-gradient(180deg, ${laneColor}0a 0%, transparent 40%)`,
          }} />

        {/* Yellow center lane lines — two parallel dashes converging to horizon */}
        <div className="absolute top-0 bottom-0"
          style={{ left: 'calc(50% - 6px)', width: 3,
            background: `repeating-linear-gradient(180deg, #fbbf24 0px, #fbbf24 48px, transparent 48px, transparent 80px)`,
            opacity: 0.75 }} />
        <div className="absolute top-0 bottom-0"
          style={{ left: 'calc(50% + 3px)', width: 3,
            background: `repeating-linear-gradient(180deg, #fbbf24 0px, #fbbf24 48px, transparent 48px, transparent 80px)`,
            opacity: 0.75 }} />

        {/* Wet road reflection streaks */}
        {[0,1,2,3,4,5].map(i => (
          <motion.div key={`streak-${i}`}
            className="absolute"
            style={{
              left: `${8 + i * 16}%`, top: '5%',
              width: 2, height: '70%',
              background: `linear-gradient(180deg, transparent, ${laneColor}33, transparent)`,
            }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: i * 0.3 }} />
        ))}
      </div>

      {/* ── LEFT SIDEWALK + SHOPS ── */}
      <div className="absolute left-0 bottom-0" style={{ top: '38%', width: '18%' }}>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, #010108, #030214)' }} />
        {/* Curb line */}
        <div className="absolute right-0 top-0 bottom-0 w-1"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.12), transparent)' }} />

        {/* Streetlight pole */}
        <div className="absolute right-6 top-0 w-1 bg-gray-700 rounded-full" style={{ height: '55%' }}>
          <div className="absolute -right-5 top-0 w-10 h-1 bg-gray-600 rounded-full" />
          <motion.div className="absolute -right-3 top-0 w-6 h-6 rounded-full"
            style={{ background: '#fef3c7', boxShadow: '0 0 40px #fbbf24, 0 0 80px #fbbf2444' }}
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.5, repeat: Infinity }} />
        </div>

        {/* Shop fronts */}
        <div className="absolute bottom-0 inset-x-0" style={{ height: '52%',
          background: 'linear-gradient(0deg, #060118, #020010)',
          borderTop: '1px solid rgba(255,255,255,0.08)' }}>

          {/* LOANS sign */}
          <motion.div className="absolute top-3 left-2 right-3 h-10 border rounded-sm flex items-center justify-center"
            style={{ borderColor: '#ef444466', background: 'rgba(0,0,0,0.7)' }}
            animate={{ boxShadow: ['0 0 12px #ef444433', '0 0 28px #ef444488', '0 0 12px #ef444433'] }}
            transition={{ duration: 1.6, repeat: Infinity }}>
            <span className="text-sm font-black tracking-widest"
              style={{ color: '#ef4444', textShadow: '0 0 14px #ef4444' }}>LOANS</span>
          </motion.div>

          {/* CAFE sign */}
          <motion.div className="absolute top-16 left-3 w-8 border rounded-sm flex items-center justify-center py-1"
            style={{ borderColor: '#fbbf2466', background: 'rgba(0,0,0,0.7)' }}
            animate={{ boxShadow: ['0 0 8px #fbbf2422', '0 0 20px #fbbf2466', '0 0 8px #fbbf2422'] }}
            transition={{ duration: 2, repeat: Infinity }}>
            <span className="text-[9px] font-black"
              style={{ color: '#fbbf24', textShadow: '0 0 10px #fbbf24', writingMode: 'vertical-rl' }}>CAFE</span>
          </motion.div>

          {/* Sidewalk message board */}
          <div className="absolute bottom-4 left-2 right-3 rounded border border-white/10 p-2"
            style={{ background: 'rgba(0,0,0,0.6)' }}>
            <p className="text-[9px] font-bold leading-tight text-white/70">
              Choices<br/>Today<br/>Reality<br/>Tomorrow
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDEWALK + SHOPS ── */}
      <div className="absolute right-0 bottom-0" style={{ top: '38%', width: '18%' }}>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(270deg, #010108, #030214)' }} />
        {/* Curb line */}
        <div className="absolute left-0 top-0 bottom-0 w-1"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.12), transparent)' }} />

        {/* Streetlight pole */}
        <div className="absolute left-6 top-0 w-1 bg-gray-700 rounded-full" style={{ height: '55%' }}>
          <div className="absolute -left-5 top-0 w-10 h-1 bg-gray-600 rounded-full" />
          <motion.div className="absolute -left-3 top-0 w-6 h-6 rounded-full"
            style={{ background: '#fef3c7', boxShadow: '0 0 40px #fbbf24, 0 0 80px #fbbf2444' }}
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.8, repeat: Infinity }} />
        </div>

        {/* Shop fronts */}
        <div className="absolute bottom-0 inset-x-0" style={{ height: '52%',
          background: 'linear-gradient(0deg, #060118, #020010)',
          borderTop: '1px solid rgba(255,255,255,0.08)' }}>

          {/* MARKET sign */}
          <motion.div className="absolute top-3 left-3 right-2 h-10 border rounded-sm flex items-center justify-center"
            style={{ borderColor: '#22d3ee66', background: 'rgba(0,0,0,0.7)' }}
            animate={{ boxShadow: ['0 0 12px #22d3ee33', '0 0 28px #22d3ee88', '0 0 12px #22d3ee33'] }}
            transition={{ duration: 1.9, repeat: Infinity }}>
            <span className="text-sm font-black tracking-widest"
              style={{ color: '#22d3ee', textShadow: '0 0 14px #22d3ee' }}>MARKET</span>
          </motion.div>

          {/* 24/7 sign */}
          <motion.div className="absolute top-16 right-3 w-9 border rounded-sm flex items-center justify-center py-1"
            style={{ borderColor: '#a855f766', background: 'rgba(0,0,0,0.7)' }}
            animate={{ boxShadow: ['0 0 8px #a855f722', '0 0 20px #a855f766', '0 0 8px #a855f722'] }}
            transition={{ duration: 1.7, repeat: Infinity }}>
            <span className="text-[9px] font-black"
              style={{ color: '#a855f7', textShadow: '0 0 10px #a855f7' }}>24/7</span>
          </motion.div>

          {/* Right side message board */}
          <div className="absolute bottom-4 left-3 right-2 rounded border border-white/10 p-2 text-right"
            style={{ background: 'rgba(0,0,0,0.6)' }}>
            <p className="text-[9px] font-bold leading-tight text-white/70">
              No Risk<br/>No Reward
            </p>
          </div>
        </div>
      </div>

      {/* ── LEFT LARGE BILLBOARD ── */}
      <div className="absolute" style={{ left: '1%', top: '6%', width: '16%' }}>
        <motion.div className="rounded-lg border-2 p-3"
          style={{ borderColor: `${laneColor}88`, background: 'rgba(0,0,0,0.88)',
            boxShadow: `0 0 40px ${laneColor}44` }}
          animate={{ boxShadow: [`0 0 20px ${laneColor}33`, `0 0 50px ${laneColor}77`, `0 0 20px ${laneColor}33`] }}
          transition={{ duration: 2.5, repeat: Infinity }}>
          <p className="font-black text-sm leading-tight whitespace-pre-line"
            style={{ color: laneColor, textShadow: `0 0 18px ${laneColor}` }}>
            INVEST IN{'\n'}YOURSELF
          </p>
          <p className="text-lg mt-1">📈</p>
        </motion.div>
      </div>

      {/* ── LEFT SECONDARY BILLBOARD ── */}
      <div className="absolute" style={{ left: '1%', top: '28%', width: '14%' }}>
        <motion.div className="rounded border p-2"
          style={{ borderColor: '#a855f766', background: 'rgba(0,0,0,0.8)' }}
          animate={{ boxShadow: ['0 0 10px #a855f733', '0 0 25px #a855f766', '0 0 10px #a855f733'] }}
          transition={{ duration: 3, repeat: Infinity }}>
          <p className="text-[10px] font-bold leading-tight text-white/80">
            Choices<br/>Today<br/>Reality<br/>Tomorrow
          </p>
        </motion.div>
      </div>

      {/* ── RIGHT LARGE BILLBOARD ── */}
      <div className="absolute" style={{ right: '1%', top: '5%', width: '17%' }}>
        <motion.div className="rounded-lg border-2 p-3"
          style={{ borderColor: '#22d3ee88', background: 'rgba(0,0,0,0.88)',
            boxShadow: '0 0 40px #22d3ee44' }}
          animate={{ boxShadow: ['0 0 20px #22d3ee33', '0 0 50px #22d3ee77', '0 0 20px #22d3ee33'] }}
          transition={{ duration: 3, repeat: Infinity }}>
          <p className="font-black text-sm leading-tight"
            style={{ color: '#22d3ee', textShadow: '0 0 18px #22d3ee' }}>
            OPPORTUNITY<br/>IS EVERYWHERE
          </p>
        </motion.div>
      </div>

      {/* ── RIGHT SECONDARY BILLBOARD ── */}
      <div className="absolute" style={{ right: '1%', top: '28%', width: '14%' }}>
        <motion.div className="rounded border p-2 text-right"
          style={{ borderColor: '#f59e0b66', background: 'rgba(0,0,0,0.8)' }}
          animate={{ boxShadow: ['0 0 10px #f59e0b33', '0 0 25px #f59e0b66', '0 0 10px #f59e0b33'] }}
          transition={{ duration: 2.8, repeat: Infinity }}>
          <p className="text-[10px] font-bold leading-tight text-right"
            style={{ color: '#f59e0b', textShadow: '0 0 8px #f59e0b' }}>
            LIVE YOUR<br/>DREAMS
          </p>
        </motion.div>
      </div>

      {/* ── GAME TITLE CENTER (top billboard) ── */}
      <div className="absolute top-[4%] left-1/2 -translate-x-1/2 z-10">
        <motion.div className="rounded-xl border-2 px-5 py-2 text-center"
          style={{ borderColor: `${laneColor}99`, background: 'rgba(0,0,0,0.92)',
            boxShadow: `0 0 50px ${laneColor}66` }}
          animate={{ boxShadow: [`0 0 25px ${laneColor}44`, `0 0 60px ${laneColor}99`, `0 0 25px ${laneColor}44`] }}
          transition={{ duration: 2, repeat: Infinity }}>
          <p className="font-black italic leading-tight"
            style={{ color: laneColor, textShadow: `0 0 24px ${laneColor}`,
              fontFamily: '"Dancing Script", cursive', fontSize: 22 }}>
            Trippin'
          </p>
          <p className="font-black text-[8px] tracking-widest text-white/80 uppercase">
            Through Life With Mandy
          </p>
        </motion.div>
      </div>

      {/* ── ROAD TILES IN PERSPECTIVE ──
          We stack tiles bottom-to-top, each one narrower and shorter.
          The current tile (dist=0) is the big one at bottom.
          Tiles ahead (dist=1,2,...) shrink toward horizon center.
      */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end"
        style={{ top: '46%', paddingBottom: 16 }}>

        {/* Render tiles from farthest (top) to nearest (bottom = current) */}
        {[...visibleTiles].reverse().map(({ tileIndex, dist }) => {
          const tile = getTileById(tilesOnPath[tileIndex]);
          const styleInfo = categoryStyles[tile.category] || categoryStyles.start;
          const Icon = styleInfo.icon;
          const isCurrent = dist === 0;
          const { w, h } = getTileDims(dist);
          const gap = getGap(dist);
          const opacity = Math.max(0.25, 1 - dist * 0.16);

          // Trapezoid shape: perspective tile embedded in road
          // Near tile is wider; far tiles are narrower
          // We use clipPath to make a trapezoid (wider at bottom, narrower at top)
          const trapezoidClip = `polygon(${dist * 3}% 0%, ${100 - dist * 3}% 0%, 100% 100%, 0% 100%)`;

          return (
            <motion.div
              key={`rt-${tileIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity }}
              className="relative flex flex-col items-center justify-center text-center flex-shrink-0"
              style={{
                width: w,
                height: h,
                marginBottom: gap,
              }}
            >
              {/* The tile card with trapezoid perspective illusion */}
              <div className="absolute inset-0 rounded-xl overflow-hidden"
                style={{
                  clipPath: trapezoidClip,
                  borderRadius: isCurrent ? 16 : 10,
                  background: isCurrent
                    ? `linear-gradient(180deg, rgba(18,8,40,0.98) 0%, rgba(6,2,16,0.99) 100%)`
                    : `linear-gradient(180deg, rgba(12,5,28,0.94) 0%, rgba(4,1,10,0.97) 100%)`,
                }}>
                {/* Neon border glow — top edge */}
                <div className="absolute inset-x-0 top-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent 5%, ${laneColor}${isCurrent ? 'ee' : '55'} 50%, transparent 95%)` }} />
                {/* Bottom edge */}
                <div className="absolute inset-x-0 bottom-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent 5%, ${laneColor}${isCurrent ? 'aa' : '33'} 50%, transparent 95%)` }} />
                {/* Left edge */}
                <div className="absolute left-0 inset-y-0 w-[2px]"
                  style={{ background: `linear-gradient(180deg, ${laneColor}${isCurrent ? 'aa' : '33'}, ${laneColor}${isCurrent ? '55' : '11'})` }} />
                {/* Right edge */}
                <div className="absolute right-0 inset-y-0 w-[2px]"
                  style={{ background: `linear-gradient(180deg, ${laneColor}${isCurrent ? 'aa' : '33'}, ${laneColor}${isCurrent ? '55' : '11'})` }} />

                {/* Pulse glow for current tile */}
                {isCurrent && (
                  <motion.div className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: [0.15, 0.45, 0.15] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    style={{ background: `radial-gradient(ellipse at 50% 50%, ${laneColor}22, transparent 70%)` }} />
                )}

                {/* Outer neon box-shadow glow (applied via wrapper) */}
              </div>

              {/* Neon glow box around tile */}
              <div className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  boxShadow: isCurrent
                    ? `0 0 60px ${laneColor}88, 0 0 120px ${laneColor}33, inset 0 0 30px ${laneColor}11`
                    : `0 0 18px ${laneColor}33`,
                  borderRadius: isCurrent ? 16 : 10,
                  border: `2px solid ${laneColor}${isCurrent ? 'cc' : '44'}`,
                  clipPath: trapezoidClip,
                }} />

              {/* Tile content */}
              <div className="relative z-10 flex items-center justify-center gap-2 px-3">
                {isCurrent && (
                  <Icon className="flex-shrink-0"
                    style={{ width: 22, height: 22, color: laneColor,
                      filter: `drop-shadow(0 0 8px ${laneColor})` }} />
                )}
                <div className={`text-center ${isCurrent ? '' : 'min-w-0'}`}>
                  {/* Space label */}
                  <p className="font-black uppercase tracking-widest"
                    style={{
                      fontSize: isCurrent ? 10 : Math.max(6, 8 - dist),
                      color: `${laneColor}cc`,
                      lineHeight: 1.2,
                    }}>
                    SPACE {tileIndex + 1}
                  </p>
                  {/* Tile name */}
                  {(isCurrent || dist <= 3) && (
                    <p className="font-black text-white leading-tight"
                      style={{
                        fontSize: isCurrent ? 18 : Math.max(7, 14 - dist * 3),
                        textShadow: isCurrent ? `0 0 20px ${laneColor}` : 'none',
                      }}>
                      {tile.name}
                    </p>
                  )}
                  {/* Emoji on current tile */}
                  {isCurrent && tile.actionText && (
                    <p className="text-white/50 mt-0.5" style={{ fontSize: 9 }}>
                      {tile.actionText}
                    </p>
                  )}
                </div>
                {isCurrent && (
                  <Icon className="flex-shrink-0"
                    style={{ width: 22, height: 22, color: laneColor, opacity: 0.6 }} />
                )}
              </div>
            </motion.div>
          );
        })}

        {/* ── PAWN on current tile ── */}
        <div style={{
          position: 'absolute',
          bottom: getTileDims(0).h + 16 - 8,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
        }}>
          {/* Pawn glow halo on road */}
          <motion.div
            className="absolute rounded-full"
            style={{
              bottom: -4, left: '50%', transform: 'translateX(-50%)',
              width: 90, height: 22,
              background: `radial-gradient(ellipse, ${laneColor}99, transparent 70%)`,
              filter: 'blur(5px)',
            }}
            animate={{ scaleX: hopping ? [1, 0.7, 1.3, 1] : [1, 1.08, 1], opacity: hopping ? [0.9, 0.3, 0.9] : [0.6, 1, 0.6] }}
            transition={{ duration: hopping ? HOP_MS / 1000 : 1.8, repeat: hopping ? 0 : Infinity }}
          />
          <Pawn
            color={currentPlayer?.color ?? 'purple'}
            avatar={currentPlayer?.avatar}
            letter={currentPlayer?.name?.charAt(0)?.toUpperCase() ?? 'P'}
            hopping={hopping}
          />
        </div>
      </div>

      {/* ── RAIN EFFECT ── */}
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.div key={`rain-${i}`}
          className="absolute w-px rounded-full pointer-events-none"
          style={{
            left: `${3 + i * 3.4}%`,
            top: 0,
            height: 70,
            background: 'linear-gradient(180deg, transparent, rgba(160,200,255,0.28), transparent)',
          }}
          animate={{ y: ['0%', '115%'], opacity: [0, 0.7, 0] }}
          transition={{ duration: 1.1 + (i % 6) * 0.12, repeat: Infinity, delay: i * 0.06, ease: 'linear' }} />
      ))}

      {/* ── PLAYER INFO BADGE ── */}
      <div className="absolute bottom-4 right-4 z-30">
        <div className="flex items-center gap-2 rounded-full border px-3 py-1.5"
          style={{ borderColor: `${laneColor}55`, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black"
            style={{ background: laneColor, boxShadow: `0 0 12px ${laneColor}` }}>
            {currentPlayer?.name?.charAt(0)}
          </div>
          <span className="text-white text-xs font-bold">{currentPlayer?.name}</span>
          <span className="font-black text-xs" style={{ color: (currentPlayer?.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
            ${currentPlayer?.money ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}