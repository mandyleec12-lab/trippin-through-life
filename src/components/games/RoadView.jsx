import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LANE_COLORS = ['#a855f7', '#ec4899', '#f59e0b'];
const LANE_GLOW = ['rgba(168,85,247,0.9)', 'rgba(236,72,153,0.9)', 'rgba(245,158,11,0.9)'];
const LANE_GLOW_SOFT = ['rgba(168,85,247,0.25)', 'rgba(236,72,153,0.25)', 'rgba(245,158,11,0.25)'];

const MOTIVATIONAL = [
  'HUSTLE HARD', 'NO RISK NO REWARD', 'INVEST IN YOURSELF',
  'OPPORTUNITY IS EVERYWHERE', 'FOCUS DISCIPLINE DESTINY',
  'KEEP MOVING FORWARD', 'CHOICES TODAY REALITY TOMORROW',
  'BUILD YOUR FUTURE', 'STAY FOCUSED', 'DREAM PLAN BUILD LIVE',
  'MINDSET MATTERS', 'SUCCESS STARTS HERE', '24/7 GRIND',
  'LEVEL UP', 'BELIEVE', 'PATIENCE PAYS OFF',
];

// Trapezoid tile geometry: bottom (near) is wide, top (far) is narrow
// Each tile = a trapezoid with perspective, tiles stack from bottom to top of road strip
const TILES_SHOWN = 8;

// Road geometry constants
const ROAD_W_NEAR = 340;    // px wide at bottom
const ROAD_W_FAR = 48;      // px wide at horizon
const ROAD_H = 520;         // total road strip height px (rendered in perspective container)
const HORIZON_Y = 38;       // % from top where road vanishes
const VP_W = 900;           // virtual viewport for calculations
const VP_H = 600;

function lerp(a, b, t) { return a + (b - a) * t; }

// Compute tile trapezoid positions
// t=0 is nearest (bottom), t=1 is at horizon
function tileAtT(t) {
  const y = lerp(VP_H, HORIZON_Y / 100 * VP_H, t);
  const halfW = lerp(ROAD_W_NEAR / 2, ROAD_W_FAR / 2, t);
  const cx = VP_W / 2;
  return { y, halfW, cx };
}

function getTileClipPath(t0, t1, cx, vpW) {
  const b = tileAtT(t0); // bottom edge of tile
  const top = tileAtT(t1); // top edge of tile
  const bl = { x: b.cx - b.halfW, y: b.y };
  const br = { x: b.cx + b.halfW, y: b.y };
  const tl = { x: top.cx - top.halfW, y: top.y };
  const tr = { x: top.cx + top.halfW, y: top.y };
  return { bl, br, tl, tr };
}

// Billboard component
function Billboard({ side, x, y, w, h, color, text, italic, fontSize = 16, rotate = 0, style = {} }) {
  return (
    <div style={{
      position: 'absolute',
      left: side === 'left' ? undefined : undefined,
      top: y,
      width: w,
      height: h,
      transform: `rotate(${rotate}deg)`,
      ...style,
    }}>
      {/* Glow behind */}
      <div style={{
        position: 'absolute', inset: -8,
        borderRadius: 6,
        background: `radial-gradient(ellipse, ${color}55 0%, transparent 70%)`,
        filter: 'blur(8px)',
      }} />
      {/* Board */}
      <div style={{
        position: 'relative',
        width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.88)',
        border: `2.5px solid ${color}`,
        borderRadius: 5,
        boxShadow: `0 0 18px ${color}cc, 0 0 40px ${color}66, inset 0 0 12px ${color}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '6px 8px',
      }}>
        <span style={{
          color: color,
          fontSize: fontSize,
          fontWeight: 900,
          fontStyle: italic ? 'italic' : 'normal',
          textAlign: 'center',
          lineHeight: 1.2,
          textShadow: `0 0 12px ${color}, 0 0 30px ${color}`,
          fontFamily: italic ? '"Dancing Script", cursive' : 'inherit',
          letterSpacing: italic ? 0 : 1,
          whiteSpace: 'pre-line',
        }}>{text}</span>
      </div>
    </div>
  );
}

// Neon sign (vertical or horizontal pole sign)
function NeonSign({ text, color, style }) {
  return (
    <div style={{
      ...style,
      background: 'rgba(0,0,0,0.75)',
      border: `2px solid ${color}`,
      borderRadius: 4,
      padding: '4px 8px',
      boxShadow: `0 0 14px ${color}cc, 0 0 28px ${color}66`,
      color: color,
      fontSize: 11,
      fontWeight: 900,
      letterSpacing: 2,
      textShadow: `0 0 10px ${color}`,
      textAlign: 'center',
      whiteSpace: 'pre-line',
    }}>{text}</div>
  );
}

// Streetlight component
function Streetlight({ side, bottom, color }) {
  const isLeft = side === 'left';
  return (
    <div style={{
      position: 'absolute',
      bottom,
      [isLeft ? 'left' : 'right']: 0,
      width: 24,
      display: 'flex', flexDirection: 'column', alignItems: isLeft ? 'flex-end' : 'flex-start',
    }}>
      {/* Light halo */}
      <div style={{
        width: 28, height: 28,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #fff5cc 0%, #fbbf2488 40%, transparent 70%)',
        boxShadow: '0 0 20px #fbbf2499, 0 0 40px #fbbf2444',
        marginBottom: 0,
        alignSelf: 'center',
      }} />
      {/* Arm */}
      <div style={{
        width: 22, height: 3,
        background: '#555577',
        borderRadius: 2,
        alignSelf: isLeft ? 'flex-end' : 'flex-start',
      }} />
      {/* Pole */}
      <div style={{
        width: 5, height: 80,
        background: 'linear-gradient(to bottom, #666688, #334)',
        borderRadius: 2,
        alignSelf: isLeft ? 'flex-end' : 'flex-start',
        marginRight: isLeft ? 4 : 0,
        marginLeft: isLeft ? 0 : 4,
      }} />
    </div>
  );
}

// Building silhouette with lit windows
function Building({ x, w, h, color, windows = true }) {
  const rows = Math.floor(h / 22);
  const cols = Math.floor(w / 14);
  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: x,
      width: w,
      height: h,
      background: 'linear-gradient(180deg, #0a0818 0%, #060410 100%)',
      borderTop: `1.5px solid ${color}44`,
      borderLeft: `1px solid ${color}22`,
      borderRight: `1px solid ${color}22`,
    }}>
      {/* Neon edge glow on top */}
      <div style={{
        position: 'absolute', top: -3, left: 0, right: 0, height: 3,
        background: color,
        boxShadow: `0 0 14px ${color}, 0 0 28px ${color}88`,
        borderRadius: '2px 2px 0 0',
      }} />
      {/* Windows */}
      {windows && (
        <div style={{ padding: '8px 4px', display: 'grid', gridTemplateColumns: `repeat(${Math.max(cols,2)}, 1fr)`, gap: 3 }}>
          {Array.from({ length: rows * Math.max(cols, 2) }).map((_, i) => {
            const lit = Math.random() > 0.45;
            const neon = lit && Math.random() > 0.88;
            return (
              <div key={i} style={{
                width: '100%', height: 8,
                background: neon ? color : lit ? '#fffacc' : '#111122',
                boxShadow: neon ? `0 0 6px ${color}` : lit ? '0 0 4px #fbbf2444' : 'none',
                borderRadius: 1,
                opacity: lit ? (neon ? 0.9 : 0.7) : 0.3,
              }} />
            );
          })}
        </div>
      )}
    </div>
  );
}

export function RoadView({ activePathTiles, players, currentPlayerIndex, focusedPathIndex, getTileById }) {
  const currentPlayer = players[currentPlayerIndex];
  const pathIdx = focusedPathIndex !== null && focusedPathIndex !== undefined
    ? focusedPathIndex : (currentPlayer?.pathIndex ?? 0);
  const tilesOnPath = activePathTiles[pathIdx] ?? [];
  const color = LANE_COLORS[pathIdx] ?? LANE_COLORS[0];
  const glow = LANE_GLOW[pathIdx] ?? LANE_GLOW[0];
  const glowSoft = LANE_GLOW_SOFT[pathIdx] ?? LANE_GLOW_SOFT[0];
  const pos = currentPlayer?.position ?? 0;

  // Stable billboard positions
  const leftBillboards = useMemo(() => [
    { y: '12%', w: 140, h: 78, color: '#3b82f6', text: `INVEST IN\nYOURSELF`, fontSize: 14 },
    { y: '32%', w: 110, h: 60, color: '#a855f7', text: `NO RISK\nNO REWARD`, fontSize: 13 },
    { y: '52%', w: 120, h: 55, color: '#22d3ee', text: `KEEP MOVING\nFORWARD`, fontSize: 12 },
    { y: '70%', w: 100, h: 48, color: '#ec4899', text: `CHOICES TODAY\nREALITY TOMORROW`, fontSize: 10 },
  ], []);
  const rightBillboards = useMemo(() => [
    { y: '10%', w: 150, h: 80, color: '#22d3ee', text: `OPPORTUNITY\nIS EVERYWHERE`, fontSize: 14 },
    { y: '30%', w: 130, h: 68, color: '#f59e0b', text: `FOCUS\nDISCIPLINE\nDESTINY`, fontSize: 13 },
    { y: '50%', w: 115, h: 55, color: '#a855f7', text: `BUILD YOUR\nFUTURE`, fontSize: 13 },
    { y: '68%', w: 100, h: 48, color: '#ec4899', text: `STAY\nFOCUSED`, fontSize: 13 },
  ], []);

  // Compute tile trapezoids using displayPos so tiles scroll as pawn hops
  const tileCount = Math.min(TILES_SHOWN, tilesOnPath.length - displayPos);
  const tilesData = useMemo(() => {
    const result = [];
    for (let d = 0; d < tileCount; d++) {
      const tileIndex = displayPos + d;
      if (tileIndex >= tilesOnPath.length) break;
      // t goes from 0 (near) to 1 (horizon)
      // Space tiles more aggressively near bottom, compress at top
      const tNear = d / TILES_SHOWN;
      const tFar = (d + 1) / TILES_SHOWN;
      // Ease: sqrt gives more space near bottom
      const t0 = Math.pow(tNear, 0.55);
      const t1 = Math.pow(tFar, 0.55);

      const b = tileAtT(t0);
      const top_ = tileAtT(t1);

      const points = {
        bl: { x: b.cx - b.halfW + 12, y: b.y },
        br: { x: b.cx + b.halfW - 12, y: b.y },
        tl: { x: top_.cx - top_.halfW + 12, y: top_.y },
        tr: { x: top_.cx + top_.halfW - 12, y: top_.y },
      };

      const tile = getTileById(tilesOnPath[tileIndex]);
      const isCurrent = d === 0;
      // center of tile for label positioning
      const cx = VP_W / 2;
      const topY = top_.y;
      const botY = b.y;
      const midY = (topY + botY) / 2;
      const tileW = (b.halfW + top_.halfW) - 24;
      const scale = lerp(1, 0.35, t0);

      result.push({ points, tile, isCurrent, cx, midY, topY, botY, tileW, scale, d });
    }
    return result;
  }, [displayPos, tilesOnPath, tileCount]);

  // ── PAWN HOP: step displayPos one tile at a time toward pos ──
  const [displayPos, setDisplayPos] = useState(pos);
  const [hopKey, setHopKey] = useState(0);   // incremented each hop to re-trigger animation
  const [isHopping, setIsHopping] = useState(false);
  const hopQueueRef = useRef([]);
  const hoppingRef = useRef(false);

  // When pos changes, queue up each step
  useEffect(() => {
    const diff = pos - displayPos;
    if (diff === 0) return;
    const steps = diff > 0
      ? Array.from({ length: diff }, (_, i) => displayPos + i + 1)
      : Array.from({ length: -diff }, (_, i) => displayPos - i - 1);
    hopQueueRef.current = steps;
    if (!hoppingRef.current) processQueue();
  }, [pos]);

  function processQueue() {
    if (hopQueueRef.current.length === 0) { hoppingRef.current = false; setIsHopping(false); return; }
    hoppingRef.current = true;
    setIsHopping(true);
    const next = hopQueueRef.current.shift();
    setDisplayPos(next);
    setHopKey(k => k + 1);
    // Wait for hop animation (440ms) then advance
    setTimeout(processQueue, 460);
  }

  // Continuous idle bob (only when not hopping)
  const [bob, setBob] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => {
      setBob(Math.sin((now - start) / 700) * 4);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const horizonY = HORIZON_Y; // percent from top

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #010208 0%, #030418 35%, #060820 60%, #0a0520 100%)',
      overflow: 'hidden',
      fontFamily: '"Inter", "Segoe UI", sans-serif',
    }}>

      {/* ── NIGHT SKY / CITY GLOW ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 0%, ${color}22 0%, transparent 55%)`,
      }} />

      {/* Stars */}
      {useMemo(() => Array.from({ length: 60 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${(i * 137.5) % 100}%`,
          top: `${(i * 61.8) % 40}%`,
          width: i % 5 === 0 ? 2 : 1,
          height: i % 5 === 0 ? 2 : 1,
          borderRadius: '50%',
          background: '#fff',
          opacity: 0.3 + (i % 4) * 0.15,
        }} />
      )), [])}

      {/* ── CITY SKYLINE (distant buildings) ── */}
      <div style={{
        position: 'absolute', bottom: `${100 - horizonY}%`, left: 0, right: 0,
        height: '28%',
        display: 'flex', alignItems: 'flex-end',
        zIndex: 2,
      }}>
        {[
          { x: 0,    w: 28, h: '55%', color: '#a855f7' },
          { x: 24,   w: 22, h: '75%', color: '#22d3ee' },
          { x: 42,   w: 30, h: '45%', color: '#ec4899' },
          { x: 68,   w: 18, h: '85%', color: '#a855f7' },
          { x: 82,   w: 26, h: '60%', color: '#f59e0b' },
          { x: 104,  w: 20, h: '70%', color: '#22d3ee' },
          { x: 122,  w: 35, h: '50%', color: '#3b82f6' },
          { x: 153,  w: 22, h: '90%', color: '#a855f7' }, // tall center tower
          { x: 172,  w: 16, h: '55%', color: '#ec4899' },
          { x: 185,  w: 28, h: '68%', color: '#f59e0b' },
          { x: 210,  w: 24, h: '45%', color: '#22d3ee' },
          { x: 230,  w: 32, h: '72%', color: '#a855f7' },
          { x: 258,  w: 20, h: '58%', color: '#ec4899' },
          { x: 274,  w: 26, h: '80%', color: '#3b82f6' },
          { x: 296,  w: 22, h: '48%', color: '#f59e0b' },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute',
            bottom: 0, left: `${b.x / 320 * 100}%`,
            width: `${b.w / 320 * 100}%`,
            height: b.h,
            background: 'linear-gradient(180deg, #0d0820 0%, #050310 100%)',
            borderTop: `2px solid ${b.color}`,
            boxShadow: `0 0 12px ${b.color}66`,
          }}>
            {/* Antenna / spire on tall buildings */}
            {b.h > '70%' && (
              <div style={{
                position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                width: 2, height: 10,
                background: b.color,
                boxShadow: `0 0 8px ${b.color}`,
              }} />
            )}
          </div>
        ))}
      </div>

      {/* ── HORIZON GLOW ── */}
      <div style={{
        position: 'absolute',
        top: `${horizonY}%`,
        left: 0, right: 0,
        height: 3,
        background: `linear-gradient(90deg, transparent, ${color}99, ${color}, ${color}99, transparent)`,
        boxShadow: `0 0 30px ${color}cc, 0 0 60px ${color}66`,
        zIndex: 3,
      }} />

      {/* ── LEFT SIDEWALK / BUILDINGS ── */}
      <div style={{
        position: 'absolute',
        left: 0, top: `${horizonY}%`, bottom: 0,
        width: '18%',
        background: 'linear-gradient(180deg, #08060f 0%, #0d0a1a 100%)',
        borderRight: `1px solid ${color}33`,
        zIndex: 3,
        overflow: 'hidden',
      }}>
        {/* Buildings */}
        <Building x={0} w={60} h={90} color="#a855f7" />
        <Building x={58} w={45} h={65} color="#22d3ee" />
        <Building x={100} w={55} h={80} color="#ec4899" />
        {/* Sidewalk texture */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 25,
          background: 'linear-gradient(180deg, #1a1428, #0d0a18)',
          borderTop: `1px solid ${color}44`,
        }} />
        {/* Streetlights */}
        <Streetlight side="left" bottom={20} />
        <Streetlight side="left" bottom={80} />
        {/* Left billboards */}
        {leftBillboards.map((b, i) => (
          <div key={i} style={{ position: 'absolute', top: b.y, right: 4, width: b.w }}>
            <div style={{
              height: b.h,
              background: 'rgba(0,0,0,0.9)',
              border: `2px solid ${b.color}`,
              borderRadius: 5,
              boxShadow: `0 0 16px ${b.color}cc, 0 0 32px ${b.color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '4px 6px',
            }}>
              <span style={{
                color: b.color,
                fontSize: b.fontSize,
                fontWeight: 900,
                textAlign: 'center',
                lineHeight: 1.25,
                textShadow: `0 0 10px ${b.color}`,
                whiteSpace: 'pre-line',
              }}>{b.text}</span>
            </div>
            {/* Pole */}
            <div style={{ width: 3, height: 20, background: '#666', margin: '0 auto' }} />
          </div>
        ))}
      </div>

      {/* ── RIGHT SIDEWALK / BUILDINGS ── */}
      <div style={{
        position: 'absolute',
        right: 0, top: `${horizonY}%`, bottom: 0,
        width: '18%',
        background: 'linear-gradient(180deg, #08060f 0%, #0d0a1a 100%)',
        borderLeft: `1px solid ${color}33`,
        zIndex: 3,
        overflow: 'hidden',
      }}>
        <Building x={0} w={55} h={75} color="#f59e0b" />
        <Building x={52} w={50} h={95} color="#a855f7" />
        <Building x={99} w={60} h={60} color="#22d3ee" />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 25,
          background: 'linear-gradient(180deg, #1a1428, #0d0a18)',
          borderTop: `1px solid ${color}44`,
        }} />
        <Streetlight side="right" bottom={20} />
        <Streetlight side="right" bottom={80} />
        {/* Right billboards */}
        {rightBillboards.map((b, i) => (
          <div key={i} style={{ position: 'absolute', top: b.y, left: 4, width: b.w }}>
            <div style={{
              height: b.h,
              background: 'rgba(0,0,0,0.9)',
              border: `2px solid ${b.color}`,
              borderRadius: 5,
              boxShadow: `0 0 16px ${b.color}cc, 0 0 32px ${b.color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '4px 6px',
            }}>
              <span style={{
                color: b.color,
                fontSize: b.fontSize,
                fontWeight: 900,
                textAlign: 'center',
                lineHeight: 1.25,
                textShadow: `0 0 10px ${b.color}`,
                whiteSpace: 'pre-line',
              }}>{b.text}</span>
            </div>
            <div style={{ width: 3, height: 20, background: '#666', margin: '0 auto' }} />
          </div>
        ))}
      </div>

      {/* ── TITLE SIGN - top center ── */}
      <div style={{
        position: 'absolute', top: '4%', left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, textAlign: 'center',
        background: 'rgba(0,0,0,0.85)',
        border: `2px solid ${color}`,
        borderRadius: 8,
        padding: '6px 18px',
        boxShadow: `0 0 24px ${color}cc, 0 0 60px ${color}44`,
      }}>
        <div style={{
          color: color,
          fontSize: 22,
          fontWeight: 900,
          fontStyle: 'italic',
          fontFamily: '"Dancing Script", cursive',
          textShadow: `0 0 18px ${color}, 0 0 40px ${color}88`,
          lineHeight: 1,
        }}>Trippin'</div>
        <div style={{
          color: '#fff',
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: 3,
          textTransform: 'uppercase',
          opacity: 0.85,
        }}>THROUGH LIFE WITH MANDY</div>
      </div>

      {/* ── ROAD SVG (trapezoid shape + tiles) ── */}
      <div style={{
        position: 'absolute', inset: 0,
        zIndex: 4,
        pointerEvents: 'none',
      }}>
        <svg
          viewBox={`0 0 ${VP_W} ${VP_H}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Road gradient - dark asphalt */}
            <linearGradient id="roadGrad" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#050310" />
              <stop offset="40%" stopColor="#080518" />
              <stop offset="100%" stopColor="#120a22" />
            </linearGradient>
            {/* Wet reflection gradient */}
            <linearGradient id="wetRefl" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="60%" stopColor={color} stopOpacity="0.04" />
              <stop offset="100%" stopColor={color} stopOpacity="0.14" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Road body */}
          <polygon
            points={`
              ${VP_W / 2 - ROAD_W_FAR / 2},${horizonY / 100 * VP_H}
              ${VP_W / 2 + ROAD_W_FAR / 2},${horizonY / 100 * VP_H}
              ${VP_W / 2 + ROAD_W_NEAR / 2},${VP_H}
              ${VP_W / 2 - ROAD_W_NEAR / 2},${VP_H}
            `}
            fill="url(#roadGrad)"
          />

          {/* Wet reflection overlay */}
          <polygon
            points={`
              ${VP_W / 2 - ROAD_W_FAR / 2},${horizonY / 100 * VP_H}
              ${VP_W / 2 + ROAD_W_FAR / 2},${horizonY / 100 * VP_H}
              ${VP_W / 2 + ROAD_W_NEAR / 2},${VP_H}
              ${VP_W / 2 - ROAD_W_NEAR / 2},${VP_H}
            `}
            fill="url(#wetRefl)"
          />

          {/* Road edge lines */}
          <line
            x1={VP_W / 2 - ROAD_W_FAR / 2} y1={horizonY / 100 * VP_H}
            x2={VP_W / 2 - ROAD_W_NEAR / 2} y2={VP_H}
            stroke={color} strokeWidth="3" strokeOpacity="0.7" filter="url(#glow)"
          />
          <line
            x1={VP_W / 2 + ROAD_W_FAR / 2} y1={horizonY / 100 * VP_H}
            x2={VP_W / 2 + ROAD_W_NEAR / 2} y2={VP_H}
            stroke={color} strokeWidth="3" strokeOpacity="0.7" filter="url(#glow)"
          />

          {/* Center yellow lines */}
          {Array.from({ length: 10 }).map((_, i) => {
            const t0 = i / 10, t1 = (i + 0.4) / 10;
            const a = tileAtT(Math.pow(t0, 0.6)), b_ = tileAtT(Math.pow(t1, 0.6));
            return (
              <g key={i}>
                <line x1={VP_W / 2 - 8} y1={a.y} x2={VP_W / 2 - 8} y2={b_.y}
                  stroke="#fbbf24" strokeWidth={lerp(4, 1, t0)} strokeOpacity="0.8" />
                <line x1={VP_W / 2 + 8} y1={a.y} x2={VP_W / 2 + 8} y2={b_.y}
                  stroke="#fbbf24" strokeWidth={lerp(4, 1, t0)} strokeOpacity="0.8" />
              </g>
            );
          })}

          {/* ── TILES ── */}
          {tilesData.map(({ points, tile, isCurrent, cx, midY, topY, botY, tileW, scale, d }) => {
            const { bl, br, tl, tr } = points;
            const polyStr = `${bl.x},${bl.y} ${br.x},${br.y} ${tr.x},${tr.y} ${tl.x},${tl.y}`;
            const tileColor = isCurrent ? color : '#6644aa';
            const opacity = Math.max(0.15, 1 - d * 0.13);
            const gIntensity = isCurrent ? 0.35 : 0.12;

            return (
              <g key={d} opacity={opacity}>
                {/* Tile fill */}
                <polygon points={polyStr}
                  fill={isCurrent ? `${color}18` : '#0a0820'}
                  stroke="none"
                />
                {/* Tile neon border */}
                <polygon points={polyStr}
                  fill="none"
                  stroke={tileColor}
                  strokeWidth={isCurrent ? 3.5 : 2}
                  filter={isCurrent ? "url(#strongGlow)" : "url(#glow)"}
                  strokeOpacity={isCurrent ? 1 : 0.65}
                />

                {/* Corner dots */}
                {[bl, br, tl, tr].map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r={isCurrent ? 5 : 3}
                    fill={tileColor} filter="url(#glow)" opacity={0.9} />
                ))}

                {/* Space number */}
                <text
                  x={cx} y={topY + (midY - topY) * 0.32}
                  textAnchor="middle"
                  fill={tileColor}
                  fontSize={Math.max(7, 13 * scale)}
                  fontWeight="900"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="2"
                  style={{ filter: `drop-shadow(0 0 6px ${tileColor})` }}
                >
                  SPACE {(displayPos + d + 1)}
                </text>

                {/* Tile name */}
                <text
                  x={cx} y={midY + (isCurrent ? 4 : 1)}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={Math.max(8, isCurrent ? 22 * scale : 16 * scale)}
                  fontWeight="900"
                  fontFamily="Inter, sans-serif"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }}
                >
                  {tile.name.length > 20 ? tile.name.slice(0, 18) + '…' : tile.name}
                </text>
              </g>
            );
          })}

          {/* ── PAWN SHADOW ON ROAD ── */}
          <ellipse
            cx={VP_W / 2} cy={VP_H - 60}
            rx={55} ry={10}
            fill={color} opacity={0.3}
            filter="url(#glow)"
          />
        </svg>

        {/* ── 3D PAWN (HTML overlay) ── */}
        <div style={{
          position: 'absolute',
          bottom: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          pointerEvents: 'none',
        }}>
          {/* Ball + stem hop together as one unit */}
          <motion.div
            key={hopKey}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            animate={isHopping
              ? { y: [0, -70, 0], scaleX: [1, 0.85, 1], scaleY: [1, 1.18, 1] }
              : { y: [bob - 4, bob + 4, bob - 4] }
            }
            transition={isHopping
              ? { duration: 0.42, ease: [0.33, 1, 0.68, 1], times: [0, 0.45, 1] }
              : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            {/* Ball head */}
            <div style={{
              width: 64, height: 64,
              borderRadius: '50%',
              background: `radial-gradient(circle at 38% 35%, #ffffff55, ${color} 40%, ${color}bb 75%, #000 100%)`,
              boxShadow: `0 0 30px ${color}, 0 0 70px ${color}88, 0 8px 24px rgba(0,0,0,0.8), inset -8px -8px 20px rgba(0,0,0,0.5), inset 6px 6px 16px rgba(255,255,255,0.2)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              {/* Specular highlight */}
              <div style={{
                position: 'absolute', top: 10, left: 12,
                width: 16, height: 14,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.65)',
                filter: 'blur(3px)',
              }} />
              <span style={{ color: '#fff', fontSize: 22, fontWeight: 900, textShadow: '0 2px 8px rgba(0,0,0,0.7)', zIndex: 1 }}>
                {currentPlayer?.name?.charAt(0)?.toUpperCase() ?? 'P'}
              </span>
            </div>

            {/* Stem */}
            <div style={{
              width: 14, height: 36,
              background: `linear-gradient(180deg, ${color} 0%, ${color}88 60%, ${color}44 100%)`,
              borderRadius: '6px 6px 2px 2px',
              boxShadow: `0 0 12px ${color}88`,
              marginTop: -4,
            }} />
          </motion.div>

          {/* Base disc — stays on ground, squishes on landing */}
          <motion.div
            key={`base-${hopKey}`}
            style={{
              width: 52, height: 14,
              background: `radial-gradient(ellipse at center, ${color} 0%, ${color}88 50%, ${color}22 100%)`,
              borderRadius: '50%',
              boxShadow: `0 0 20px ${color}cc, 0 0 40px ${color}44`,
              marginTop: -18,
            }}
            animate={isHopping
              ? { scaleX: [1, 0.7, 1.4, 1], scaleY: [1, 0.6, 1.2, 1] }
              : {}
            }
            transition={isHopping ? { duration: 0.42, times: [0, 0.3, 0.75, 1] } : {}}
          />

          {/* Glow ring */}
          <motion.div
            style={{
              width: 80, height: 18,
              borderRadius: '50%',
              border: `2px solid ${color}`,
              boxShadow: `0 0 18px ${color}cc, 0 0 40px ${color}66`,
              marginTop: 2,
            }}
            animate={{ scaleX: [0.9, 1.1, 0.9], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* ── RAIN STREAKS ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', overflow: 'hidden' }}>
        {useMemo(() => Array.from({ length: 45 }).map((_, i) => (
          <motion.div key={i} style={{
            position: 'absolute',
            top: '-5%',
            left: `${(i * 2.3) % 100}%`,
            width: 1,
            height: `${20 + (i % 4) * 12}px`,
            background: 'linear-gradient(180deg, transparent, rgba(180,220,255,0.45), transparent)',
            borderRadius: 1,
          }}
            animate={{ y: ['0vh', '110vh'], opacity: [0, 0.6, 0] }}
            transition={{
              duration: 1.1 + (i % 5) * 0.12,
              delay: i * 0.05,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )), [])}
      </div>

      {/* ── WET PUDDLE REFLECTIONS on road ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: '18%', right: '18%',
        height: '35%', zIndex: 3, pointerEvents: 'none', overflow: 'hidden',
      }}>
        {[0.25, 0.5, 0.75].map((xRel, i) => (
          <motion.div key={i} style={{
            position: 'absolute',
            bottom: `${10 + i * 10}%`,
            left: `${xRel * 100 - 8}%`,
            width: 60, height: 8,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${color}44 0%, transparent 70%)`,
            filter: 'blur(2px)',
          }}
            animate={{ opacity: [0.3, 0.7, 0.3], scaleX: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2.5 + i, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ── PLAYER HUD ── */}
      <div style={{
        position: 'absolute', bottom: 12, right: 16,
        zIndex: 30, display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(0,0,0,0.88)',
        border: `1.5px solid ${color}66`,
        borderRadius: 20, padding: '5px 12px',
        boxShadow: `0 0 16px ${color}44`,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: color,
          boxShadow: `0 0 10px ${color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, color: '#fff', fontSize: 12,
        }}>{currentPlayer?.name?.charAt(0)}</div>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{currentPlayer?.name}</span>
        <span style={{
          fontWeight: 900, fontSize: 13,
          color: (currentPlayer?.money ?? 0) < 0 ? '#f87171' : '#34d399',
        }}>${currentPlayer?.money ?? 0}</span>
      </div>
    </div>
  );
}