import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── BOARD SPACE COORDINATES ────────────────────────────────────────────────
// Each entry is { x, y } as a percentage of the board image dimensions.
// The path runs from space 0 (START, bottom-center) to space N (FINISH, top).
// These were mapped directly against the current board artwork
// (ChatGPT_Image_May_6,_2026,_02_47_41_PM.png).
// To update: replace BOARD_SPACES with new coordinates matching the new image.
//
// Total spaces: 30 (indices 0–29)
//
// Path shape: S-curve road that winds from bottom-center upward through
// left-center, then right-center, then top-center — matching the illuminated
// road spaces visible on the board image.

const BOARD_SPACES = [
  // START — bottom center
  { x: 50, y: 92 },
  // Winding up the left lane
  { x: 42, y: 86 },
  { x: 36, y: 80 },
  { x: 32, y: 73 },
  { x: 30, y: 66 },
  // Left curve peak
  { x: 32, y: 59 },
  { x: 37, y: 53 },
  { x: 43, y: 48 },
  // Middle convergence
  { x: 50, y: 45 },
  { x: 57, y: 42 },
  // Right lane rising
  { x: 63, y: 38 },
  { x: 67, y: 33 },
  { x: 68, y: 27 },
  { x: 66, y: 21 },
  { x: 62, y: 16 },
  // Right curve to center
  { x: 57, y: 13 },
  { x: 52, y: 11 },
  { x: 47, y: 11 },
  { x: 42, y: 13 },
  { x: 38, y: 17 },
  // Upper left swing
  { x: 35, y: 22 },
  { x: 34, y: 27 },
  { x: 35, y: 32 },
  { x: 38, y: 36 },
  { x: 42, y: 39 },
  // Final convergence to top
  { x: 47, y: 37 },
  { x: 50, y: 33 },
  { x: 50, y: 27 },
  { x: 50, y: 20 },
  // FINISH — top center
  { x: 50, y: 13 },
];

// ─── PAWN COLORS ─────────────────────────────────────────────────────────────
const PAWN_COLORS = {
  pink:   'from-pink-400 via-pink-500 to-pink-700',
  purple: 'from-purple-400 via-purple-500 to-purple-700',
  blue:   'from-blue-400 via-blue-500 to-blue-700',
  teal:   'from-teal-400 via-teal-500 to-teal-700',
  gold:   'from-amber-400 via-amber-500 to-amber-700',
  coral:  'from-orange-400 via-rose-500 to-rose-700',
};

const HOP_DURATION_MS = 420;

// ─── STEP ANIMATION HOOK ─────────────────────────────────────────────────────
function useStepAnimation(targetPos, resetKey) {
  const [displayPos, setDisplayPos] = useState(targetPos);
  const [hopping, setHopping]       = useState(false);
  const lastKeyRef = useRef(resetKey);

  useEffect(() => {
    if (lastKeyRef.current !== resetKey) {
      lastKeyRef.current = resetKey;
      setDisplayPos(targetPos);
      setHopping(false);
    }
  }, [resetKey, targetPos]);

  useEffect(() => {
    if (displayPos === targetPos) { setHopping(false); return; }
    setHopping(true);
    const settle = setTimeout(() => setHopping(false), HOP_DURATION_MS * 0.72);
    const step   = setTimeout(() => {
      setDisplayPos(prev => prev === targetPos ? prev : prev + (targetPos > prev ? 1 : -1));
    }, HOP_DURATION_MS);
    return () => { clearTimeout(settle); clearTimeout(step); };
  }, [displayPos, targetPos]);

  return { displayPos, hopping };
}

// ─── PAWN TOKEN ───────────────────────────────────────────────────────────────
function PawnToken({ color, avatar, letter, hopping }) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: 44, height: 56 }}
      animate={hopping
        ? { y: [0, -22, 0], scaleX: [1, 0.96, 1.04, 1], scaleY: [1, 1.08, 0.93, 1] }
        : { y: [0, -3, 0], scaleX: [1, 1.01, 1], scaleY: [1, 0.99, 1] }
      }
      transition={{
        duration: hopping ? HOP_DURATION_MS * 0.72 / 1000 : 1.8,
        repeat:   hopping ? 0 : Infinity,
        ease:     hopping ? [0.22, 1, 0.36, 1] : 'easeInOut',
      }}
    >
      {/* Shadow */}
      <div className="absolute bottom-0 rounded-full bg-black/55 blur-md" style={{ width: 36, height: 10 }} />
      {/* Base disc */}
      <div className={`absolute bottom-1 rounded-full bg-gradient-to-b ${color}`} style={{ width: 34, height: 12, boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.4)' }} />
      {/* Body */}
      <div
        className={`absolute bottom-4 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center overflow-hidden border border-white/40`}
        style={{ width: 30, height: 32, fontSize: 12, boxShadow: 'inset 4px 5px 10px rgba(255,255,255,0.3), inset -4px -6px 10px rgba(0,0,0,0.35), 0 8px 18px rgba(0,0,0,0.4)' }}
      >
        <div className="absolute inset-1 rounded-xl border border-white/20 pointer-events-none" />
        {avatar
          ? <img src={avatar} alt="" className="w-full h-full object-cover" />
          : <span className="relative z-10 text-white font-black drop-shadow text-xs">{letter}</span>
        }
      </div>
      {/* Glow ring */}
      {hopping && (
        <motion.div
          className="absolute bottom-3 rounded-full border border-white/35"
          style={{ width: 40, height: 16 }}
          initial={{ scale: 0.7, opacity: 0.7 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: HOP_DURATION_MS / 1000, ease: 'easeOut' }}
        />
      )}
    </motion.div>
  );
}

// ─── PATH OVERLAY ─────────────────────────────────────────────────────────────
// Draws a faint SVG polyline + dot per space so the path is visible.
function PathOverlay({ spaces, neon, clampedPos, showDebugOverlay }) {
  if (!showDebugOverlay) return null;
  const points = spaces.map(s => `${s.x},${s.y}`).join(' ');
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ zIndex: 8 }}
    >
      {/* Path line */}
      <polyline
        points={points}
        fill="none"
        stroke={`${neon}88`}
        strokeWidth="0.5"
        strokeDasharray="1.5 1.5"
      />
      {/* Space dots */}
      {spaces.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r={i === clampedPos ? 1.2 : 0.7}
            fill={i === clampedPos ? neon : `${neon}99`}
            style={{ filter: i === clampedPos ? `drop-shadow(0 0 2px ${neon})` : undefined }}
          />
          <text x={s.x + 1.2} y={s.y + 0.6} fontSize="1.4" fill="white" opacity="0.7">{i}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function RoadView({
  paths,
  activePathTiles,
  players,
  currentPlayerIndex,
  focusedPathIndex,
  getTileById,
  categoryStyles,
  playerColors,
}) {
  const currentPlayer = players[currentPlayerIndex];
  const activePathIdx = focusedPathIndex !== null && focusedPathIndex !== undefined
    ? focusedPathIndex
    : (currentPlayer.pathIndex !== null && currentPlayer.pathIndex !== undefined ? currentPlayer.pathIndex : 0);

  const tilesOnPath   = activePathTiles[activePathIdx] ?? [];
  const totalTiles    = tilesOnPath.length || BOARD_SPACES.length;

  // Map game position (index into tilesOnPath) to a BOARD_SPACES index.
  // If the path has more tiles than spaces, we clamp to the last space.
  const mapPosToSpace = (pos) => {
    const normalized = pos / Math.max(1, totalTiles - 1);
    return Math.round(normalized * (BOARD_SPACES.length - 1));
  };

  const { displayPos, hopping } = useStepAnimation(
    currentPlayer.position,
    `${currentPlayer.id}-${activePathIdx}`
  );

  const clampedPos   = Math.max(0, Math.min(displayPos, totalTiles - 1));
  const spaceIndex   = mapPosToSpace(clampedPos);
  const currentSpace = BOARD_SPACES[Math.min(spaceIndex, BOARD_SPACES.length - 1)];

  // Neon color per lane
  const PATH_NEON = ['#a855f7', '#ec4899', '#f97316'];
  const neon = PATH_NEON[activePathIdx] ?? '#a855f7';

  // Debug overlay toggle (hold Shift+D in browser)
  const [showDebug, setShowDebug] = useState(false);
  useEffect(() => {
    const onKey = (e) => { if (e.shiftKey && e.key === 'D') setShowDebug(v => !v); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const boardRef = useRef(null);

  return (
    <div ref={boardRef} className="absolute inset-0 overflow-hidden" style={{ zIndex: 5 }}>

      {/* ── Board image ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/ChatGPT_Image_May_6,_2026,_02_47_41_PM.png')",
          zIndex: 0,
        }}
      />

      {/* ── Dark gradient overlay for readability ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(2,6,23,0.18) 0%, transparent 35%, rgba(2,4,10,0.22) 100%)',
          zIndex: 1,
        }}
      />

      {/* ── Debug path overlay (Shift+D to toggle) ── */}
      <PathOverlay
        spaces={BOARD_SPACES}
        neon={neon}
        clampedPos={spaceIndex}
        showDebugOverlay={showDebug}
      />

      {/* ── Space highlight ring at current position ── */}
      <motion.div
        className="absolute rounded-full border-2 pointer-events-none"
        style={{
          left:      `${currentSpace.x}%`,
          top:       `${currentSpace.y}%`,
          width:     48,
          height:    48,
          transform: 'translate(-50%, -50%)',
          borderColor: neon,
          background: `radial-gradient(circle, ${neon}44 0%, transparent 70%)`,
          boxShadow:   `0 0 18px ${neon}88`,
          zIndex: 9,
        }}
        animate={{
          scale:   hopping ? [1, 0.9, 1.12, 1] : [1, 1.06, 1],
          opacity: hopping ? [0.9, 0.5, 0.9]   : [0.7, 1, 0.7],
        }}
        transition={{ duration: hopping ? HOP_DURATION_MS * 0.72 / 1000 : 1.6 }}
      />

      {/* ── Player pawn ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ zIndex: 10 }}
        animate={{
          left: `${currentSpace.x}%`,
          top:  `${currentSpace.y}%`,
          x: '-50%',
          y: '-100%',
        }}
        transition={{
          duration: HOP_DURATION_MS / 1000,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <PawnToken
          color={PAWN_COLORS[currentPlayer.color] || PAWN_COLORS.purple}
          avatar={currentPlayer.avatar}
          letter={currentPlayer.name.charAt(0).toUpperCase()}
          hopping={hopping}
        />
      </motion.div>

      {/* ── Other players (non-active) shown as small dots ── */}
      {players.map((player, i) => {
        if (i === currentPlayerIndex) return null;
        const pIdx   = player.pathIndex !== null ? player.pathIndex : 0;
        const pTiles = activePathTiles[pIdx] ?? [];
        const pTotal = pTiles.length || BOARD_SPACES.length;
        const pNorm  = player.position / Math.max(1, pTotal - 1);
        const pSi    = Math.round(pNorm * (BOARD_SPACES.length - 1));
        const pSpace = BOARD_SPACES[Math.min(pSi, BOARD_SPACES.length - 1)];
        const pNeon  = PATH_NEON[pIdx] ?? '#ec4899';
        return (
          <div
            key={player.id}
            className="absolute rounded-full border-2 border-white/60 flex items-center justify-center text-white font-black"
            style={{
              left:      `${pSpace.x}%`,
              top:       `${pSpace.y}%`,
              width:     22,
              height:    22,
              fontSize:  9,
              transform: 'translate(-50%, -50%)',
              background: pNeon,
              boxShadow:  `0 0 10px ${pNeon}88`,
              zIndex: 8,
            }}
          >
            {player.name.charAt(0).toUpperCase()}
          </div>
        );
      })}

      {/* ── Debug info badge (Shift+D) ── */}
      {showDebug && (
        <div className="absolute top-2 right-2 rounded-xl bg-black/80 px-3 py-2 text-[10px] text-white font-mono" style={{ zIndex: 20 }}>
          <div className="font-bold text-yellow-300 mb-1">PATH DEBUG (Shift+D to hide)</div>
          <div>Total board spaces: {BOARD_SPACES.length}</div>
          <div>Current game pos: {currentPlayer.position} / {totalTiles - 1}</div>
          <div>Mapped space index: {spaceIndex}</div>
          <div>Coord: ({currentSpace.x}%, {currentSpace.y}%)</div>
          <div className="mt-1 text-white/60">Space coords:</div>
          {BOARD_SPACES.map((s, i) => (
            <div key={i} className={i === spaceIndex ? 'text-yellow-300' : 'text-white/50'}>
              [{i}] ({s.x}, {s.y})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}