import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

// The street image tile slots — measured as % of image dimensions.
// These map to the visible tile panels in the reference images,
// receding from bottom (nearest/largest) to top (farthest/smallest).
// Each slot: { cx, cy, w, h } — center x%, center y%, width%, height%
// Tuned to match the perspective tiles visible in the reference photos.
const TILE_SLOTS = [
  { cx: 50, cy: 87, w: 44, h: 12 },   // slot 0 — nearest (current)
  { cx: 50, cy: 74, w: 35, h:  9.5 }, // slot 1
  { cx: 50, cy: 63, w: 28, h:  7.5 }, // slot 2
  { cx: 50, cy: 54, w: 22, h:  6 },   // slot 3
  { cx: 50, cy: 46, w: 17, h:  5 },   // slot 4
  { cx: 50, cy: 40, w: 13, h:  4 },   // slot 5 — farthest visible
];

// Pawn sits on slot 0 (current tile)
// When player moves, pawn animates to new slot position

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

// Animated neon rain overlay
function RainOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }}>
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.div key={i}
          className="absolute w-px rounded-full"
          style={{
            left: `${(i * 3.6 + 1) % 100}%`,
            top: '-4%',
            height: 35 + (i % 5) * 10,
            background: 'rgba(147,197,253,0.12)',
          }}
          animate={{ y: ['0vh', '110vh'], opacity: [0, 0.45, 0] }}
          transition={{ duration: 1.0 + (i % 6) * 0.1, repeat: Infinity, delay: i * 0.045, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

// Animated neon glow pulse on a tile overlay
function TileGlow({ slot, color, active, containerW, containerH }) {
  const left = `${slot.cx - slot.w / 2}%`;
  const top  = `${slot.cy - slot.h / 2}%`;
  const width  = `${slot.w}%`;
  const height = `${slot.h}%`;

  return (
    <motion.div
      className="absolute rounded-xl pointer-events-none"
      style={{
        left, top, width, height,
        border: `${active ? 3 : 1.5}px solid ${color}`,
        boxShadow: active
          ? `0 0 30px ${color}cc, 0 0 60px ${color}66, inset 0 0 20px ${color}22`
          : `0 0 10px ${color}55, inset 0 0 6px ${color}11`,
        zIndex: 8,
      }}
      animate={active
        ? { opacity: [0.7, 1, 0.7], boxShadow: [`0 0 24px ${color}aa, inset 0 0 14px ${color}1a`, `0 0 48px ${color}ee, inset 0 0 28px ${color}33`, `0 0 24px ${color}aa, inset 0 0 14px ${color}1a`] }
        : { opacity: [0.3, 0.6, 0.3] }
      }
      transition={{ duration: active ? 0.9 : 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// Tile label overlay — text that appears on top of the image tiles
function TileLabel({ slot, tile, spaceNum, active, pathNeon, categoryStyles }) {
  const neon = CAT_COLOR[tile?.category] || pathNeon;
  const emoji = CAT_EMOJI[tile?.category] || '';
  const styleInfo = categoryStyles?.[tile?.category] ?? categoryStyles?.start;
  const Icon = styleInfo?.icon;

  // Scale font with tile size
  const fs = active ? 12 : Math.max(6, 12 * (slot.w / TILE_SLOTS[0].w));
  const subFs = active ? 9 : Math.max(5, 8 * (slot.w / TILE_SLOTS[0].w));
  const iconSz = active ? 18 : Math.max(10, 18 * (slot.w / TILE_SLOTS[0].w));

  return (
    <div
      className="absolute pointer-events-none flex flex-col items-center justify-center"
      style={{
        left: `${slot.cx - slot.w / 2}%`,
        top:  `${slot.cy - slot.h / 2}%`,
        width:  `${slot.w}%`,
        height: `${slot.h}%`,
        zIndex: 10,
      }}
    >
      <p style={{ fontSize: subFs, fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.16em', textTransform: 'uppercase', lineHeight: 1 }}>
        {spaceNum === 1 ? 'THE START' : `SPACE ${spaceNum}`}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
        {Icon && active && (
          <div style={{ width: iconSz, height: iconSz, borderRadius: 5, background: `${neon}22`, border: `1px solid ${neon}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon style={{ width: '65%', height: '65%', color: neon }} />
          </div>
        )}
        <p style={{
          fontSize: fs, fontWeight: 900, color: active ? '#fff' : 'rgba(255,255,255,0.82)',
          textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.15, textAlign: 'center',
          textShadow: `0 0 12px ${neon}, 0 0 24px ${neon}88`,
        }}>
          {tile?.name}
        </p>
        {emoji && <span style={{ fontSize: Math.max(9, iconSz * 0.9), opacity: 0.85, flexShrink: 0 }}>{emoji}</span>}
      </div>
      {active && (tile?.effect === 'money_gain' || tile?.effect === 'money_loss') && tile?.effectValue && (
        <p style={{ fontSize: subFs + 1, fontWeight: 900, marginTop: 2, color: tile.effect === 'money_gain' ? '#34d399' : '#f87171', textShadow: tile.effect === 'money_gain' ? '0 0 8px #34d399' : '0 0 8px #f87171' }}>
          {tile.effect === 'money_gain' ? '+' : '-'}${Math.abs(tile.effectValue)}
        </p>
      )}
    </div>
  );
}

// The 3D pawn ball — positioned over the current slot
function Pawn({ slot, player, hopping, containerW, containerH }) {
  const hex = PAWN_HEX[player.color] || '#a855f7';
  // Pawn sits at top-center of the current (nearest) slot
  const pawnCX = slot.cx;
  const pawnCY = slot.cy - slot.h * 0.18; // slightly above tile center

  const ballSize = Math.round(containerW * slot.w / 100 * 0.22);
  const clampedBallSize = Math.max(44, Math.min(ballSize, 90));

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${pawnCX}%`,
        top:  `${pawnCY}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 30,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}
      animate={hopping
        ? { y: [0, -clampedBallSize * 0.9, -clampedBallSize * 0.4, 0], scale: [1, 1.08, 0.97, 1] }
        : { y: [0, -clampedBallSize * 0.08, 0] }
      }
      transition={hopping
        ? { duration: HOP_MS / 1000, ease: [0.22, 1, 0.36, 1] }
        : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      {/* Ball */}
      <div style={{
        width: clampedBallSize, height: clampedBallSize, borderRadius: '50%',
        background: `radial-gradient(circle at 32% 26%, rgba(255,255,255,0.9) 0%, ${hex} 16%, ${hex}cc 52%, ${hex}66 100%)`,
        boxShadow: `0 0 ${clampedBallSize * 0.5}px ${hex}cc, 0 0 ${clampedBallSize}px ${hex}44, 0 ${clampedBallSize * 0.15}px ${clampedBallSize * 0.35}px rgba(0,0,0,0.7), inset 0 -${clampedBallSize * 0.1}px ${clampedBallSize * 0.2}px rgba(0,0,0,0.38)`,
        border: '2px solid rgba(255,255,255,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', flexShrink: 0,
      }}>
        {player.avatar
          ? <img src={player.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          : <span style={{ fontSize: clampedBallSize * 0.32, fontWeight: 900, color: 'rgba(255,255,255,0.95)', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>P</span>
        }
        <div style={{ position: 'absolute', top: clampedBallSize * 0.12, left: clampedBallSize * 0.18, width: clampedBallSize * 0.24, height: clampedBallSize * 0.16, borderRadius: '50%', background: 'rgba(255,255,255,0.62)', transform: 'rotate(-28deg)', filter: 'blur(2px)' }} />
      </div>
      {/* Stem */}
      <div style={{ width: clampedBallSize * 0.22, height: clampedBallSize * 0.32, background: `linear-gradient(180deg,${hex}cc,${hex}22)`, borderRadius: '0 0 6px 6px', marginTop: -2, boxShadow: `0 0 14px ${hex}55` }} />
      {/* Shadow */}
      <motion.div style={{ width: clampedBallSize * 0.85, height: clampedBallSize * 0.14, borderRadius: '50%', background: `${hex}55`, filter: 'blur(7px)', marginTop: -2 }}
        animate={{ scaleX: [1, 0.82, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
    </motion.div>
  );
}

// Animated neon lights flickering in background signs
function NeonFlicker({ text, color, style: pos }) {
  return (
    <motion.div
      className="absolute font-black uppercase rounded-xl border text-center pointer-events-none select-none"
      style={{
        ...pos,
        padding: '5px 8px',
        fontSize: 9, letterSpacing: '0.1em', lineHeight: 1.3,
        color, borderColor: `${color}55`,
        background: 'rgba(0,1,8,0.0)',
        textShadow: `0 0 10px ${color}, 0 0 22px ${color}88`,
        zIndex: 6,
      }}
      animate={{ opacity: [0.5, 1, 0.4, 0.95, 0.5], textShadow: [`0 0 8px ${color}`, `0 0 20px ${color}, 0 0 40px ${color}88`, `0 0 6px ${color}`, `0 0 18px ${color}, 0 0 36px ${color}aa`, `0 0 8px ${color}`] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
    >
      {text.split('\n').map((l, i) => <div key={i}>{l}</div>)}
    </motion.div>
  );
}

export function RoadView({ paths, activePathTiles, players, currentPlayerIndex, focusedPathIndex, getTileById, categoryStyles }) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
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

  const pathName  = paths[activePathIdx]?.name  ?? 'Life';
  const pathEmoji = paths[activePathIdx]?.emoji ?? '🏙️';
  const currentTile = getTileById(tilesOnPath[safePos] ?? 0);
  const curNeon = CAT_COLOR[currentTile?.category] || pathNeon;
  const progressPct = tilesOnPath.length > 1 ? Math.round((safePos / (tilesOnPath.length - 1)) * 100) : 0;

  // Build visible tile windows: current + up to 5 ahead (what the image shows)
  const SHOW_AHEAD = TILE_SLOTS.length - 1; // 5
  const visibleTiles = [];
  for (let i = 0; i <= SHOW_AHEAD; i++) {
    const idx = safePos + i;
    if (idx < tilesOnPath.length) {
      visibleTiles.push({ tileIdx: idx, slotIdx: i });
    }
  }

  // Pick the background image based on path
  const bgImages = [
    'https://media.base44.com/images/public/69fd8ff3b9153ebd6453d5ee/cb2e2fa92_ChatGPTImageMay10202608_20_34PM.png',
    'https://media.base44.com/images/public/69fd8ff3b9153ebd6453d5ee/c206abcf3_ChatGPTImageMay10202608_18_30PM.png',
    'https://media.base44.com/images/public/69fd8ff3b9153ebd6453d5ee/25fa8ac59_ChatGPTImageMay10202605_32_16PM2.png',
  ];
  const bgImage = bgImages[activePathIdx % bgImages.length];

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" style={{ zIndex: 5 }}>

      {/* ── THE BACKGROUND IMAGE — the actual reference photo ── */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          zIndex: 1,
        }}
        animate={{
          // Subtle parallax breathing to make the static image feel alive
          scale: [1, 1.012, 1],
          backgroundPosition: ['center bottom', 'center 52%', 'center bottom'],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Dark vignette overlay so text stays readable ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.35) 100%), linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)',
        zIndex: 2,
      }} />

      {/* ── Rain overlay — makes the image feel animated ── */}
      <RainOverlay />

      {/* ── Neon flicker signs overlaid on the image (matching sign positions in photos) ── */}
      <NeonFlicker text="HUSTLE\nHARD"         color="#38bdf8" style={{ top: '8%',  left: '2%', zIndex: 6 }} />
      <NeonFlicker text="NO RISK\nNO REWARD"   color="#a855f7" style={{ top: '22%', left: '2%', zIndex: 6 }} />
      <NeonFlicker text="KEEP\nMOVING\nFORWARD" color="#f472b6" style={{ top: '40%', left: '2%', zIndex: 6 }} />
      <NeonFlicker text="FOCUS\nDISCIPLINE\nDESTINY" color="#34d399" style={{ top: '8%',  right: '2%', zIndex: 6 }} />
      <NeonFlicker text="THE JOURNEY\nBUILDS YOU"     color="#fbbf24" style={{ top: '28%', right: '2%', zIndex: 6 }} />
      <NeonFlicker text="24/7\nMINDSET"               color="#f472b6" style={{ top: '20%', right: '20%', zIndex: 6 }} />

      {/* ── Invisible tile glow overlays mapped to image tile positions ── */}
      {visibleTiles.map(({ tileIdx, slotIdx }) => {
        const tile = getTileById(tilesOnPath[tileIdx] ?? 0);
        const neon = CAT_COLOR[tile?.category] || pathNeon;
        const slot = TILE_SLOTS[slotIdx];
        if (!slot) return null;
        const isCurrent = tileIdx === safePos;
        return (
          <TileGlow key={`glow-${tileIdx}`}
            slot={slot} color={neon} active={isCurrent}
            containerW={containerSize.w} containerH={containerSize.h}
          />
        );
      })}

      {/* ── Tile text labels overlaid on tile slots ── */}
      {visibleTiles.map(({ tileIdx, slotIdx }) => {
        const tile = getTileById(tilesOnPath[tileIdx] ?? 0);
        const slot = TILE_SLOTS[slotIdx];
        if (!slot) return null;
        const isCurrent = tileIdx === safePos;
        return (
          <TileLabel key={`label-${tileIdx}`}
            slot={slot} tile={tile}
            spaceNum={tileIdx + 1}
            active={isCurrent}
            pathNeon={pathNeon}
            categoryStyles={categoryStyles}
          />
        );
      })}

      {/* ── PAWN — animated ball that jumps between tile positions ── */}
      <Pawn
        slot={TILE_SLOTS[0]}
        player={currentPlayer}
        hopping={hopping}
        containerW={containerSize.w}
        containerH={containerSize.h}
      />

      {/* ── Ground glow pulse under pawn ── */}
      <motion.div className="absolute pointer-events-none"
        style={{
          left: `${TILE_SLOTS[0].cx}%`,
          top:  `${TILE_SLOTS[0].cy + TILE_SLOTS[0].h * 0.3}%`,
          transform: 'translate(-50%, -50%)',
          width: `${TILE_SLOTS[0].w * 0.6}%`,
          height: 18,
          borderRadius: '50%',
          background: curNeon,
          filter: 'blur(18px)',
          zIndex: 25,
        }}
        animate={{ opacity: [0.2, 0.5, 0.2], scaleX: [1, 1.15, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />

      {/* ── Header bar ── */}
      <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-4 py-1.5"
        style={{ background: 'rgba(0,0,6,0.88)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${pathNeon}30` }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 14 }}>{pathEmoji}</span>
          <div>
            <p style={{ fontSize: 6, fontWeight: 900, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>YOUR PATH</p>
            <p style={{ fontSize: 11, fontWeight: 900, color: '#fff' }}>{pathName}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <p style={{ fontSize: 6, fontWeight: 900, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            SPACE {safePos + 1} / {tilesOnPath.length}
          </p>
          <div className="rounded-full overflow-hidden" style={{ width: 130, height: 5, background: 'rgba(255,255,255,0.08)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg,${pathNeon},${curNeon})`, boxShadow: `0 0 8px ${pathNeon}` }}
              animate={{ width: `${progressPct}%` }} transition={{ duration: 0.45, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 13, fontWeight: 900, color: (currentPlayer.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
            ${currentPlayer.money?.toLocaleString?.() ?? 0}
          </span>
          {currentPlayer.job && <span style={{ fontSize: 12 }}>{currentPlayer.job.emoji}</span>}
        </div>
      </div>

      {/* ── "YOU ARE HERE" callout ── */}
      <AnimatePresence mode="wait">
        <motion.div key={safePos}
          className="absolute z-40 rounded-xl border px-3 py-2"
          style={{
            bottom: 52, left: 12,
            background: 'rgba(0,0,8,0.88)', backdropFilter: 'blur(12px)',
            borderColor: `${curNeon}66`, maxWidth: 170,
            boxShadow: `0 0 18px ${curNeon}44`,
          }}
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
        >
          <p style={{ fontSize: 7, fontWeight: 900, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>YOU ARE HERE</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span style={{ fontSize: 15 }}>{CAT_EMOJI[currentTile?.category] || '📍'}</span>
            <p style={{ fontSize: 11, fontWeight: 900, color: curNeon, textShadow: `0 0 10px ${curNeon}` }}>{currentTile?.name}</p>
          </div>
          {currentTile?.actionText && (
            <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', marginTop: 3, lineHeight: 1.3 }}>{currentTile.actionText}</p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom player bar ── */}
      <div className="absolute bottom-0 inset-x-0 z-50 flex items-center gap-2 px-4 py-2"
        style={{ background: 'rgba(0,0,6,0.94)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${pathNeon}28` }}>
        <div className="flex gap-1.5 flex-1 flex-wrap">
          {players.map((p, i) => {
            const hex = PAWN_HEX[p.color] || '#a855f7';
            const isActive = i === currentPlayerIndex;
            return (
              <div key={p.id} className="flex items-center gap-1.5 rounded-lg px-2 py-1"
                style={{ background: isActive ? `${hex}1e` : 'rgba(255,255,255,0.03)', border: `1px solid ${isActive ? hex + 'aa' : 'rgba(255,255,255,0.07)'}` }}>
                <motion.div
                  className="rounded-full flex items-center justify-center font-black text-white overflow-hidden flex-shrink-0"
                  style={{ width: 22, height: 22, fontSize: 9, background: `radial-gradient(circle at 35% 30%, ${hex}ff, ${hex}99)`, border: `2px solid ${isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.28)'}`, boxShadow: isActive ? `0 0 10px ${hex}cc` : undefined }}
                  animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 1.2, repeat: isActive ? Infinity : 0 }}
                >
                  {p.avatar ? <img src={p.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : p.name.charAt(0)}
                </motion.div>
                <span style={{ fontSize: 9, fontWeight: 700, color: isActive ? '#fff' : 'rgba(255,255,255,0.6)' }}>{p.name.split(' ')[0]}</span>
                <span style={{ fontSize: 9, fontWeight: 900, color: (p.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
                  ${p.money?.toLocaleString?.() ?? p.money ?? 0}
                </span>
              </div>
            );
          })}
        </div>
        <div className="text-right flex-shrink-0">
          <p style={{ fontSize: 6, fontWeight: 900, color: 'rgba(255,255,255,0.20)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>NOW ON</p>
          <p style={{ fontSize: 10, fontWeight: 900, color: curNeon, textShadow: `0 0 8px ${curNeon}` }}>{currentTile?.name}</p>
        </div>
      </div>
    </div>
  );
}