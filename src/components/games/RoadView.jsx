import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Constants ────────────────────────────────────────────────────────────────
const HOP_MS = 440;

const PAWN_HEX = {
  pink: '#ec4899', purple: '#a855f7', blue: '#3b82f6',
  teal: '#14b8a6', gold: '#f59e0b', coral: '#f43f5e',
};

const CAT_COLOR = {
  start: '#ffffff', finish: '#fbbf24',
  money: '#34d399', money_loss: '#f87171',
  tax: '#ef4444', heartbreak: '#f472b6',
  chaos: '#fb923c', blessing: '#38bdf8',
  glowup: '#c084fc', wildcard: '#e879f9',
};

const CAT_EMOJI = {
  start: '🚀', finish: '🏆', money: '💹', money_loss: '💸',
  tax: '💀', heartbreak: '💔', chaos: '🔥', blessing: '✨',
  glowup: '🌟', wildcard: '🃏',
};

// Life district themes — the path winds through these
const DISTRICTS = [
  { name: 'Hustle District',    color: '#a855f7', emoji: '💼', categories: ['start', 'money', 'glowup'] },
  { name: 'Heartbreak Ave',     color: '#f472b6', emoji: '💔', categories: ['heartbreak', 'chaos'] },
  { name: 'Finance Row',        color: '#34d399', emoji: '💵', categories: ['money', 'money_loss', 'tax'] },
  { name: 'Glow Up Plaza',      color: '#c084fc', emoji: '✨', categories: ['glowup', 'blessing', 'wildcard'] },
  { name: 'Chaos Corner',       color: '#fb923c', emoji: '🔥', categories: ['chaos', 'tax'] },
  { name: 'Mandy Magic Lane',   color: '#e879f9', emoji: '🌟', categories: ['blessing', 'wildcard', 'finish'] },
];

function getDistrict(category) {
  return DISTRICTS.find(d => d.categories.includes(category)) ?? DISTRICTS[0];
}

// ─── Winding path layout — isometric grid coords ─────────────────────────────
// Returns array of {col, row} for up to 30 tiles in an S-curve winding path
function buildPathLayout(tileCount) {
  const layout = [];
  // Winding snake path: right → up → left → up → right → up...
  const COLS = 7;
  let col = 0, row = 0, dir = 1;
  for (let i = 0; i < tileCount; i++) {
    layout.push({ col, row });
    if (i < tileCount - 1) {
      const nextCol = col + dir;
      if (nextCol >= COLS || nextCol < 0) {
        row++;
        dir *= -1;
      } else {
        col = nextCol;
      }
    }
  }
  return layout;
}

// ─── Step animation ───────────────────────────────────────────────────────────
function useStepAnimation(targetPos, resetKey) {
  const [displayPos, setDisplayPos] = useState(targetPos);
  const [hopping, setHopping] = useState(false);
  const lastKey = useRef(resetKey);

  useEffect(() => {
    if (lastKey.current !== resetKey) {
      lastKey.current = resetKey;
      setDisplayPos(targetPos);
      setHopping(false);
    }
  }, [resetKey, targetPos]);

  useEffect(() => {
    if (displayPos === targetPos) { setHopping(false); return; }
    setHopping(true);
    const t1 = setTimeout(() => setHopping(false), HOP_MS * 0.72);
    const t2 = setTimeout(() => setDisplayPos(p => p + (targetPos > p ? 1 : -1)), HOP_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [displayPos, targetPos]);

  return { displayPos, hopping };
}

// ─── City Background ──────────────────────────────────────────────────────────
function CityBg({ accent }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Deep night sky gradient */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #020510 0%, #060d28 35%, #04091a 65%, #010208 100%)'
      }} />

      {/* Stars */}
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{ width: 1 + (i % 3 === 0 ? 1 : 0), height: 1 + (i % 3 === 0 ? 1 : 0), left: `${(i * 1.66) % 100}%`, top: `${(i * 1.33) % 45}%`, opacity: 0.15 + (i % 5) * 0.08 }}
          animate={{ opacity: [0.08, 0.6, 0.08] }}
          transition={{ duration: 2 + (i % 6) * 0.6, repeat: Infinity, delay: i * 0.07 }}
        />
      ))}

      {/* City skyline silhouette */}
      <svg className="absolute bottom-0 w-full" viewBox="0 0 800 320" preserveAspectRatio="none" style={{ opacity: 0.85 }}>
        {/* Building shapes */}
        {[
          { x: 0, w: 80, h: 160 }, { x: 75, w: 50, h: 220 }, { x: 120, w: 70, h: 140 },
          { x: 185, w: 45, h: 190 }, { x: 225, w: 60, h: 170 }, { x: 280, w: 90, h: 130 },
          { x: 365, w: 55, h: 200 }, { x: 415, w: 75, h: 150 }, { x: 485, w: 50, h: 210 },
          { x: 530, w: 80, h: 180 }, { x: 605, w: 45, h: 160 }, { x: 645, w: 70, h: 240 },
          { x: 710, w: 55, h: 130 }, { x: 760, w: 40, h: 190 },
        ].map(({ x, w, h }, i) => (
          <g key={i}>
            <rect x={x} y={320 - h} width={w} height={h}
              fill={i % 4 === 0 ? '#08101e' : i % 3 === 0 ? '#060d18' : '#04080f'} />
            {/* Windows */}
            {Array.from({ length: Math.floor(h / 22) }).map((_, wr) =>
              Array.from({ length: Math.floor(w / 18) }).map((_, wc) => {
                const on = Math.random() > 0.45;
                const wCol = i % 3 === 0 ? accent : i % 5 === 0 ? '#f472b6' : '#fef08a';
                return on ? (
                  <rect key={`${wr}-${wc}`}
                    x={x + 4 + wc * 16} y={320 - h + 8 + wr * 20}
                    width={8} height={11}
                    fill={wCol} opacity={0.4 + Math.random() * 0.5}
                    style={{ filter: `drop-shadow(0 0 4px ${wCol})` }}
                  />
                ) : null;
              })
            )}
            {/* Rooftop antenna glow */}
            {i % 5 === 0 && (
              <motion.rect x={x + w / 2 - 1} y={320 - h - 12} width={2} height={12}
                fill={accent} opacity={0.8}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2 + i * 0.2, repeat: Infinity }}
              />
            )}
          </g>
        ))}
      </svg>

      {/* Rain streaks */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div key={i} className="absolute w-px rounded-full"
          style={{ left: `${(i * 3.4) % 100}%`, top: '-4%', height: 40 + (i % 5) * 10, background: `rgba(147,197,253,0.12)` }}
          animate={{ y: ['0vh', '110vh'], opacity: [0, 0.5, 0] }}
          transition={{ duration: 1.1 + (i % 6) * 0.09, repeat: Infinity, delay: i * 0.04, ease: 'linear' }}
        />
      ))}

      {/* Ground wet reflection wash */}
      <div className="absolute bottom-0 inset-x-0 h-32" style={{
        background: `linear-gradient(to top, ${accent}18, rgba(56,189,248,0.04), transparent)`
      }} />

      {/* Moving cars in distance */}
      {[{ left: '8%', top: '62%', dir: 1 }, { left: '88%', top: '65%', dir: -1 }].map((car, i) => (
        <motion.div key={i} className="absolute rounded"
          style={{ width: 28, height: 10, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', top: car.top }}
          animate={{ x: car.dir > 0 ? ['-20vw', '120vw'] : ['120vw', '-20vw'], opacity: [0, 0.7, 0.7, 0] }}
          transition={{ duration: 10 + i * 3, repeat: Infinity, delay: i * 4 }}
        >
          <span className="absolute top-0.5 left-1 w-3 h-1 rounded-full bg-amber-200/80" />
          <span className="absolute top-0.5 right-1 w-2 h-1 rounded-full bg-red-400/70" />
        </motion.div>
      ))}

      {/* Steam vents */}
      {[22, 55, 78].map((left, i) => (
        <motion.div key={i} className="absolute rounded-full blur-xl"
          style={{ width: 24, height: 24, left: `${left}%`, bottom: '20%', background: 'rgba(200,210,255,0.06)' }}
          animate={{ y: [0, -80], opacity: [0, 0.3, 0], scale: [0.8, 2.5] }}
          transition={{ duration: 5 + i, repeat: Infinity, delay: i * 2.2 }}
        />
      ))}
    </div>
  );
}

// ─── Single board tile ────────────────────────────────────────────────────────
function BoardTile({ tile, tileIdx, layout, isCurrent, isPast, isAdjacent, tileSize, pathNeon, categoryStyles, players, activePathIdx }) {
  const { col, row } = layout;
  const neon = CAT_COLOR[tile.category] || pathNeon;
  const emoji = CAT_EMOJI[tile.category] || '';
  const district = getDistrict(tile.category);
  const styleInfo = categoryStyles?.[tile.category] ?? categoryStyles?.start;
  const Icon = styleInfo?.icon;

  // Isometric transform: col → right-down, row → left-down
  // We use a skewed grid so it reads as "3D-ish" but stays fully legible
  const ISO_X_STEP = tileSize * 1.08;
  const ISO_Y_STEP = tileSize * 0.62;
  const x = col * ISO_X_STEP;
  const y = row * ISO_Y_STEP;

  const occupants = players.filter(p => (p.pathIndex ?? 0) === activePathIdx && p.position === tileIdx);

  const baseBg = isPast
    ? 'rgba(8,12,24,0.88)'
    : isCurrent
    ? `rgba(12,18,42,0.97)`
    : 'rgba(6,10,20,0.92)';

  const borderOpacity = isCurrent ? 'ff' : isPast ? '44' : isAdjacent ? 'cc' : '77';
  const glowIntensity = isCurrent ? '99' : isAdjacent ? '44' : '22';

  return (
    <motion.div
      className="absolute flex flex-col items-center justify-center overflow-hidden select-none"
      style={{
        left: x, top: y,
        width: tileSize, height: tileSize * 0.68,
        borderRadius: 10,
        border: `${isCurrent ? 2.5 : 1.5}px solid ${neon}${borderOpacity}`,
        background: baseBg,
        boxShadow: isCurrent
          ? `0 0 28px ${neon}88, 0 0 60px ${neon}33, inset 0 0 20px ${neon}1a`
          : isAdjacent
          ? `0 0 12px ${neon}44, inset 0 0 8px ${neon}0d`
          : `0 0 6px ${neon}22`,
        opacity: isPast ? 0.55 : 1,
        zIndex: isCurrent ? 20 : isAdjacent ? 15 : 10,
        cursor: 'default',
      }}
      animate={isCurrent ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={isCurrent ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: isPast ? 0.55 : 1, scale: 1 }}
    >
      {/* Top neon line */}
      <div className="absolute inset-x-0 top-0 rounded-t-lg" style={{
        height: isCurrent ? 3 : 2,
        background: `linear-gradient(90deg, transparent, ${neon}, transparent)`,
        opacity: isCurrent ? 1 : 0.6,
      }} />

      {/* Scanline texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.013) 3px,rgba(255,255,255,0.013) 4px)',
        opacity: 0.6,
      }} />

      {/* Bottom glow fill */}
      <div className="absolute inset-x-0 bottom-0" style={{
        height: '40%',
        background: `linear-gradient(to top, ${neon}22, transparent)`,
      }} />

      {/* Tile content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-1.5 py-1 gap-0.5">
        {/* Space number */}
        <p className="font-black uppercase text-white/30" style={{ fontSize: Math.max(5, tileSize * 0.07), letterSpacing: '0.15em' }}>
          {tileIdx === 0 ? 'START' : tileIdx === -1 ? 'END' : `#${tileIdx + 1}`}
        </p>

        {/* Icon + name row */}
        <div className="flex items-center gap-1 w-full justify-center">
          {Icon && (
            <div style={{
              width: Math.max(12, tileSize * 0.16), height: Math.max(12, tileSize * 0.16),
              borderRadius: 5, background: `${neon}1a`, border: `1px solid ${neon}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: isCurrent ? `0 0 10px ${neon}66` : undefined,
            }}>
              <Icon style={{ width: '60%', height: '60%', color: neon }} />
            </div>
          )}
          <p className="font-black text-white leading-tight text-center"
            style={{
              fontSize: Math.max(6, tileSize * 0.1),
              textShadow: isCurrent ? `0 0 10px ${neon}` : undefined,
              maxWidth: tileSize * 0.65,
            }}>
            {tile.name}
          </p>
          <span style={{ fontSize: Math.max(8, tileSize * 0.14), flexShrink: 0 }}>{emoji}</span>
        </div>

        {/* Money badge */}
        {(tile.effect === 'money_gain' || tile.effect === 'money_loss') && tile.effectValue && (
          <p className="font-black rounded-full px-1.5"
            style={{
              fontSize: Math.max(6, tileSize * 0.09),
              color: tile.effect === 'money_gain' ? '#34d399' : '#f87171',
              background: tile.effect === 'money_gain' ? 'rgba(52,211,153,0.14)' : 'rgba(248,113,113,0.14)',
              textShadow: tile.effect === 'money_gain' ? '0 0 8px #34d399' : '0 0 8px #f87171',
            }}>
            {tile.effect === 'money_gain' ? '+' : '-'}${Math.abs(tile.effectValue)}
          </p>
        )}
        {tile.effect === 'tax' && <p className="font-black" style={{ fontSize: Math.max(5, tileSize * 0.08), color: '#ef4444' }}>💀 ALL TAXED</p>}
      </div>

      {/* Player pawns sitting on this tile */}
      {occupants.length > 0 && (
        <div className="absolute bottom-0.5 right-0.5 flex gap-0.5">
          {occupants.map(p => {
            const ph = PAWN_HEX[p.color] || '#a855f7';
            return (
              <motion.div key={p.id}
                className="rounded-full border border-white/60 flex items-center justify-center font-black text-white overflow-hidden"
                style={{ width: Math.max(14, tileSize * 0.18), height: Math.max(14, tileSize * 0.18), fontSize: Math.max(6, tileSize * 0.09), background: `radial-gradient(circle at 35% 30%, ${ph}ff, ${ph}99)`, boxShadow: `0 0 10px ${ph}cc` }}
                animate={isCurrent ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 1, repeat: isCurrent ? Infinity : 0 }}
              >
                {p.avatar ? <img src={p.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : p.name.charAt(0)}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* "Current" pulse ring */}
      {isCurrent && (
        <motion.div className="absolute inset-0 rounded-lg pointer-events-none"
          style={{ border: `2px solid ${neon}`, boxShadow: `0 0 20px ${neon}88` }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}

      {/* Past checkmark */}
      {isPast && (
        <div className="absolute top-1 right-1 rounded-full flex items-center justify-center"
          style={{ width: 12, height: 12, background: `${neon}33`, border: `1px solid ${neon}55`, fontSize: 7, color: neon }}>
          ✓
        </div>
      )}
    </motion.div>
  );
}

// ─── Path connector line between tiles ───────────────────────────────────────
function PathConnector({ fromLayout, toLayout, tileSize, neon, isPast }) {
  const ISO_X_STEP = tileSize * 1.08;
  const ISO_Y_STEP = tileSize * 0.62;
  const TH = tileSize * 0.68;

  const fx = fromLayout.col * ISO_X_STEP + tileSize / 2;
  const fy = fromLayout.row * ISO_Y_STEP + TH / 2;
  const tx = toLayout.col * ISO_X_STEP + tileSize / 2;
  const ty = toLayout.row * ISO_Y_STEP + TH / 2;

  const dx = tx - fx, dy = ty - fy;
  const len = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  return (
    <div className="absolute pointer-events-none" style={{
      left: fx, top: fy,
      width: len, height: 3,
      background: `linear-gradient(90deg, ${neon}${isPast ? '88' : '44'}, ${neon}${isPast ? '44' : '22'})`,
      boxShadow: isPast ? `0 0 6px ${neon}66` : `0 0 3px ${neon}33`,
      transformOrigin: '0 50%',
      transform: `rotate(${angle}deg)`,
      borderRadius: 2,
    }} />
  );
}

// ─── District label overlay ───────────────────────────────────────────────────
function DistrictLabel({ name, color, x, y }) {
  return (
    <motion.div className="absolute rounded-lg border px-2 py-0.5 pointer-events-none select-none"
      style={{
        left: x, top: y,
        fontSize: 7, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase',
        color, borderColor: `${color}44`, background: 'rgba(0,2,10,0.82)',
        boxShadow: `0 0 12px ${color}44`, textShadow: `0 0 8px ${color}`,
        whiteSpace: 'nowrap', zIndex: 5,
      }}
      animate={{ opacity: [0.5, 0.9, 0.5] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
    >
      {name}
    </motion.div>
  );
}

// ─── Neon motivational signs (flanking) ──────────────────────────────────────
function NeonSign({ text, color, style }) {
  return (
    <motion.div className="absolute flex flex-col items-center justify-center rounded-xl border font-black uppercase text-center pointer-events-none select-none"
      style={{
        ...style,
        minWidth: 70, padding: '6px 10px',
        fontSize: 8, letterSpacing: '0.1em', lineHeight: 1.3,
        color, borderColor: `${color}55`,
        background: 'rgba(0,1,8,0.92)',
        boxShadow: `0 0 18px ${color}66, 0 0 40px ${color}1a`,
        textShadow: `0 0 10px ${color}`,
        zIndex: 30,
      }}
      animate={{ opacity: [0.4, 1, 0.35, 0.88, 0.4] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
    >
      {text.split('\n').map((l, i) => <span key={i}>{l}</span>)}
    </motion.div>
  );
}

// ─── Main RoadView ────────────────────────────────────────────────────────────
export function RoadView({ paths, activePathTiles, players, currentPlayerIndex, focusedPathIndex, getTileById, categoryStyles, playerColors }) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      setContainerSize({ w: el.clientWidth, h: el.clientHeight });
    });
    obs.observe(el);
    setContainerSize({ w: el.clientWidth, h: el.clientHeight });
    return () => obs.disconnect();
  }, []);

  const currentPlayer = players[currentPlayerIndex];
  const activePathIdx = focusedPathIndex !== null && focusedPathIndex !== undefined
    ? focusedPathIndex : (currentPlayer.pathIndex ?? 0);

  const pathNeon = ['#a855f7', '#ec4899', '#f97316'][activePathIdx] ?? '#a855f7';
  const tilesOnPath = activePathTiles[activePathIdx] ?? [];

  const { displayPos, hopping } = useStepAnimation(
    currentPlayer.position, `${currentPlayer.id}-${activePathIdx}`
  );
  const safePos = Math.max(0, Math.min(displayPos, tilesOnPath.length - 1));

  // Build the winding path layout
  const pathLayout = useMemo(() => buildPathLayout(tilesOnPath.length), [tilesOnPath.length]);

  // Compute tile size to fit the board
  const COLS = 7;
  const maxRows = pathLayout.length > 0 ? Math.max(...pathLayout.map(p => p.row)) + 1 : 5;
  const ISO_X_STEP_RATIO = 1.08;
  const ISO_Y_STEP_RATIO = 0.62;
  const PADDING = 16;

  const tileW = Math.min(
    (containerSize.w - PADDING * 2) / (COLS * ISO_X_STEP_RATIO),
    (containerSize.h - PADDING * 4 - 80) / (maxRows * ISO_Y_STEP_RATIO + 1),
    110
  );
  const tileSize = Math.max(60, tileW);
  const ISO_X_STEP = tileSize * ISO_X_STEP_RATIO;
  const ISO_Y_STEP = tileSize * ISO_Y_STEP_RATIO;
  const TILE_H = tileSize * 0.68;

  const totalBoardW = COLS * ISO_X_STEP;
  const totalBoardH = maxRows * ISO_Y_STEP + TILE_H;

  // Center the board
  const offsetX = (containerSize.w - totalBoardW) / 2;
  const offsetY = PADDING + 50; // leave room for header

  // Camera: pan so current tile is visible (centered-ish)
  const curLayout = pathLayout[safePos] ?? { col: 0, row: 0 };
  const curX = curLayout.col * ISO_X_STEP + offsetX;
  const curY = curLayout.row * ISO_Y_STEP + offsetY;

  // Scroll/pan to keep current tile in view — clamp so board doesn't go off screen
  const idealScrollX = containerSize.w / 2 - curX - tileSize / 2;
  const idealScrollY = containerSize.h / 2 - curY - TILE_H / 2;
  const panX = Math.max(containerSize.w - totalBoardW - offsetX - PADDING, Math.min(0, idealScrollX));
  const panY = Math.max(containerSize.h - totalBoardH - offsetY - 60, Math.min(PADDING, idealScrollY));

  const progressPct = tilesOnPath.length > 1 ? Math.round((safePos / (tilesOnPath.length - 1)) * 100) : 0;
  const pathName = paths[activePathIdx]?.name ?? 'Life';
  const pathEmoji = paths[activePathIdx]?.emoji ?? '🏙️';
  const currentTile = getTileById(tilesOnPath[safePos] ?? 0);
  const curNeon = CAT_COLOR[currentTile?.category] || pathNeon;

  // Upcoming tile info (next 3)
  const upcomingTiles = tilesOnPath.slice(safePos + 1, safePos + 4).map((id, i) => ({
    tile: getTileById(id), pos: safePos + 1 + i
  }));

  // District labels — one per distinct region
  const districtLabels = useMemo(() => {
    const labels = [];
    let lastDistrict = null;
    tilesOnPath.forEach((id, i) => {
      const tile = getTileById(id);
      const d = getDistrict(tile.category);
      if (d.name !== lastDistrict && pathLayout[i]) {
        lastDistrict = d.name;
        const layout = pathLayout[i];
        labels.push({ ...d, layout, tileIdx: i });
      }
    });
    return labels;
  }, [tilesOnPath, getTileById, pathLayout]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" style={{ zIndex: 5 }}>

      {/* ── Neon city background ── */}
      <CityBg accent={pathNeon} />

      {/* ── Header ── */}
      <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-4 py-2"
        style={{ background: 'rgba(0,0,6,0.94)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${pathNeon}30` }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 16 }}>{pathEmoji}</span>
          <div>
            <p style={{ fontSize: 7, fontWeight: 900, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>EDUCATION PATH</p>
            <p style={{ fontSize: 12, fontWeight: 900, color: '#fff' }}>{pathName}</p>
          </div>
        </div>
        {/* Journey progress */}
        <div className="flex flex-col items-center gap-1">
          <p style={{ fontSize: 7, fontWeight: 900, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            SPACE {safePos + 1} of {tilesOnPath.length}
          </p>
          <div className="rounded-full overflow-hidden" style={{ width: 140, height: 6, background: 'rgba(255,255,255,0.08)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${pathNeon}, ${curNeon})`, boxShadow: `0 0 10px ${pathNeon}` }}
              animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 14, fontWeight: 900, color: (currentPlayer.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
            ${currentPlayer.money?.toLocaleString?.() ?? 0}
          </span>
          {currentPlayer.job && <span style={{ fontSize: 13 }}>{currentPlayer.job.emoji}</span>}
        </div>
      </div>

      {/* ── Left side neon signs ── */}
      <NeonSign text={'HUSTLE\nHARD'}          color="#f472b6" style={{ left: 4, top: '20%' }} />
      <NeonSign text={'NO RISK\nNO REWARD'}    color="#a855f7" style={{ left: 4, top: '42%' }} />
      <NeonSign text={'KEEP\nMOVING\nFORWARD'} color="#38bdf8" style={{ left: 4, top: '64%' }} />

      {/* ── Right side neon signs ── */}
      <NeonSign text={'LIVE YOUR\nDREAMS'}          color="#f472b6" style={{ right: 4, top: '18%' }} />
      <NeonSign text={'OPPORTUNITY\nIS EVERYWHERE'} color="#34d399" style={{ right: 4, top: '40%' }} />
      <NeonSign text={'FOCUS &\nGROW'}              color="#fbbf24" style={{ right: 4, top: '63%' }} />

      {/* ── Upcoming tiles preview (bottom right) ── */}
      {upcomingTiles.length > 0 && (
        <div className="absolute bottom-14 right-4 z-40 flex flex-col gap-1.5"
          style={{ maxWidth: 140 }}>
          <p style={{ fontSize: 7, fontWeight: 900, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.16em', textTransform: 'uppercase', textAlign: 'right', marginBottom: 2 }}>
            COMING UP
          </p>
          {upcomingTiles.map(({ tile, pos }) => {
            const nc = CAT_COLOR[tile.category] || pathNeon;
            return (
              <div key={pos} className="flex items-center gap-1.5 rounded-lg px-2 py-1"
                style={{ background: 'rgba(0,0,10,0.88)', border: `1px solid ${nc}44`, backdropFilter: 'blur(6px)' }}>
                <span style={{ fontSize: 11 }}>{CAT_EMOJI[tile.category] || '•'}</span>
                <div>
                  <p style={{ fontSize: 7, fontWeight: 900, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>#{pos + 1}</p>
                  <p style={{ fontSize: 8, fontWeight: 900, color: nc, textShadow: `0 0 6px ${nc}` }}>{tile.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── THE BOARD — isometric winding path ── */}
      <motion.div className="absolute"
        style={{ left: offsetX, top: offsetY, width: totalBoardW, height: totalBoardH + 20 }}
        animate={{ x: panX, y: panY }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Path connector lines (drawn first, under tiles) */}
        {pathLayout.slice(0, -1).map((fromL, i) => {
          const toL = pathLayout[i + 1];
          if (!toL) return null;
          const tile = getTileById(tilesOnPath[i] ?? 0);
          const nc = CAT_COLOR[tile.category] || pathNeon;
          return (
            <PathConnector key={`conn-${i}`}
              fromLayout={fromL} toLayout={toL}
              tileSize={tileSize} neon={nc}
              isPast={i < safePos}
            />
          );
        })}

        {/* District labels */}
        {districtLabels.map((d, i) => {
          const lx = d.layout.col * ISO_X_STEP + tileSize / 2;
          const ly = d.layout.row * ISO_Y_STEP - 18;
          return <DistrictLabel key={i} name={`${d.emoji} ${d.name}`} color={d.color} x={lx} y={ly} />;
        })}

        {/* Tiles */}
        {tilesOnPath.map((tileId, idx) => {
          const tile = getTileById(tileId);
          const layout = pathLayout[idx];
          if (!layout) return null;
          const isCurrent = idx === safePos;
          const isPast = idx < safePos;
          const isAdjacent = Math.abs(idx - safePos) === 1;

          return (
            <BoardTile key={`${activePathIdx}-${tileId}-${idx}`}
              tile={tile} tileIdx={idx} layout={layout}
              isCurrent={isCurrent} isPast={isPast} isAdjacent={isAdjacent}
              tileSize={tileSize} pathNeon={pathNeon}
              categoryStyles={categoryStyles}
              players={players} activePathIdx={activePathIdx}
            />
          );
        })}
      </motion.div>

      {/* ── Current tile detail callout ── */}
      <AnimatePresence>
        {currentTile && (
          <motion.div className="absolute bottom-14 left-4 z-40 rounded-xl border px-3 py-2"
            style={{
              background: 'rgba(0,0,10,0.94)', backdropFilter: 'blur(12px)',
              border: `1.5px solid ${curNeon}66`, maxWidth: 180,
              boxShadow: `0 0 20px ${curNeon}44`, borderColor: `${curNeon}66`,
            }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            key={safePos}
          >
            <p style={{ fontSize: 7, fontWeight: 900, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>YOU ARE HERE</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span style={{ fontSize: 16 }}>{CAT_EMOJI[currentTile.category] || '📍'}</span>
              <p style={{ fontSize: 11, fontWeight: 900, color: curNeon, textShadow: `0 0 10px ${curNeon}` }}>{currentTile.name}</p>
            </div>
            {currentTile.actionText && (
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>{currentTile.actionText}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom player bar ── */}
      <div className="absolute bottom-0 inset-x-0 z-50 flex items-center gap-2 px-4 py-2"
        style={{ background: 'rgba(0,0,6,0.96)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${pathNeon}25` }}>
        <div className="flex gap-1.5 flex-1 flex-wrap">
          {players.map((p, i) => {
            const hex = PAWN_HEX[p.color] || '#a855f7';
            const isActive = i === currentPlayerIndex;
            const pTiles = activePathTiles[p.pathIndex ?? 0] ?? [];
            const pProg = pTiles.length > 1 ? Math.round((p.position / (pTiles.length - 1)) * 100) : 0;
            return (
              <div key={p.id} className="flex items-center gap-1.5 rounded-lg px-2 py-1"
                style={{ background: isActive ? `${hex}1e` : 'rgba(255,255,255,0.03)', border: `1px solid ${isActive ? hex + 'aa' : 'rgba(255,255,255,0.07)'}` }}>
                <motion.div className="rounded-full flex items-center justify-center font-black text-white overflow-hidden flex-shrink-0"
                  style={{ width: 22, height: 22, fontSize: 9, background: `radial-gradient(circle at 35% 30%, ${hex}ff, ${hex}99)`, border: `2px solid ${isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)'}`, boxShadow: isActive ? `0 0 10px ${hex}cc` : undefined }}
                  animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={{ duration: 1.2, repeat: isActive ? Infinity : 0 }}
                >
                  {p.avatar ? <img src={p.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : p.name.charAt(0)}
                </motion.div>
                <div>
                  <p style={{ fontSize: 8, fontWeight: 700, color: isActive ? '#fff' : 'rgba(255,255,255,0.6)' }}>{p.name.split(' ')[0]}</p>
                  <p style={{ fontSize: 8, fontWeight: 900, color: (p.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
                    ${p.money?.toLocaleString?.() ?? p.money ?? 0}
                  </p>
                </div>
                {/* Mini progress bar */}
                <div className="rounded-full overflow-hidden" style={{ width: 36, height: 3, background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pProg}%`, background: hex, boxShadow: `0 0 4px ${hex}` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}