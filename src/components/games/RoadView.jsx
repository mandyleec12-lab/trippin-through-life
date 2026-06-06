import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HOP_MS = 440;

const PAWN_HEX = {
  pink:   '#ec4899',
  purple: '#a855f7',
  blue:   '#3b82f6',
  teal:   '#14b8a6',
  gold:   '#f59e0b',
  coral:  '#f43f5e',
};

const CAT_NEON = {
  start:      '#ffffff',
  finish:     '#fbbf24',
  money:      '#34d399',
  money_loss: '#f87171',
  tax:        '#ef4444',
  heartbreak: '#f472b6',
  chaos:      '#fb923c',
  blessing:   '#38bdf8',
  glowup:     '#c084fc',
  wildcard:   '#e879f9',
};

const CAT_EMOJI = {
  start:      '🚀', finish:     '🏆',
  money:      '💹', money_loss: '💸',
  tax:        '💀', heartbreak: '💔',
  chaos:      '🔥', blessing:   '✨',
  glowup:     '🌟', wildcard:   '🃏',
};

// ── Step-by-step pawn animation ──────────────────────────────────────────────
function useStepAnimation(targetPos, resetKey) {
  const [displayPos, setDisplayPos] = useState(targetPos);
  const [hopping, setHopping] = useState(false);
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
    const t1 = setTimeout(() => setHopping(false), HOP_MS * 0.72);
    const t2 = setTimeout(() => {
      setDisplayPos(p => p === targetPos ? p : p + (targetPos > p ? 1 : -1));
    }, HOP_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [displayPos, targetPos]);

  return { displayPos, hopping };
}

// ── City background with buildings ───────────────────────────────────────────
function CityBackground({ pathNeon }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Deep night sky */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #020510 0%, #060d28 30%, #04091a 60%, #020408 100%)'
      }} />

      {/* Stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{ width: 1 + (i % 2), height: 1 + (i % 2), left: `${(i * 1.97 + 1) % 100}%`, top: `${(i * 1.73 + 1) % 38}%`, opacity: 0.25 + (i % 5) * 0.1 }}
          animate={{ opacity: [0.1, 0.7, 0.1] }}
          transition={{ duration: 2 + (i % 7) * 0.5, repeat: Infinity, delay: i * 0.08 }}
        />
      ))}

      {/* Back buildings layer */}
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => {
        const h = 20 + (i % 5) * 14;
        const w = 6 + (i % 3) * 3;
        const left = i * 10 - 3;
        const neonW = i % 3 === 0 ? `${pathNeon}88` : i % 5 === 1 ? '#f472b688' : '#38bdf888';
        return (
          <div key={i} className="absolute bottom-0" style={{
            left: `${left}%`, width: `${w}%`, height: `${h}%`,
            background: `linear-gradient(180deg, rgba(6,10,28,0.95), rgba(2,4,12,0.99))`,
            borderTop: `1.5px solid ${neonW}`,
          }}>
            {/* Windows */}
            <div className="absolute inset-x-1 top-2 grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              {Array.from({ length: 18 }).map((_, w) => (
                <div key={w} style={{
                  height: 3.5,
                  borderRadius: 1,
                  background: w % 5 === 0 ? `${pathNeon}dd` : w % 7 === 0 ? '#fef08a99' : w % 11 === 0 ? '#f472b699' : 'rgba(255,255,255,0.03)',
                  boxShadow: w % 5 === 0 ? `0 0 8px ${pathNeon}` : w % 7 === 0 ? '0 0 6px #fef08a' : undefined,
                }} />
              ))}
            </div>
            {/* Rooftop antenna/sign */}
            {i % 4 === 0 && <div className="absolute -top-8 left-1/2 w-px h-8" style={{ background: `${pathNeon}aa`, boxShadow: `0 0 6px ${pathNeon}` }} />}
            {i % 5 === 0 && (
              <motion.div className="absolute -top-5 left-1 rounded-sm px-1" style={{ fontSize: 5, fontWeight: 900, color: pathNeon, background: 'rgba(0,0,0,0.8)', border: `1px solid ${pathNeon}55`, letterSpacing: '0.1em' }}
                animate={{ opacity: [0.5, 1, 0.3, 0.9, 0.5] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity }}
              >
                {['24/7','OPEN','GND','LOFT'][i % 4]}
              </motion.div>
            )}
          </div>
        );
      })}

      {/* Horizon glow */}
      <div className="absolute" style={{
        bottom: '28%', left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: 60,
        background: `radial-gradient(ellipse, ${pathNeon}33 0%, #f472b622 40%, transparent 70%)`,
        filter: 'blur(16px)',
      }} />

      {/* Rain streaks */}
      {Array.from({ length: 38 }).map((_, i) => (
        <motion.div key={i} className="absolute w-px rounded-full"
          style={{ left: `${(i * 2.63 + 0.5) % 100}%`, top: '-5%', height: 50 + (i % 6) * 8, background: 'rgba(147,197,253,0.11)' }}
          animate={{ y: ['0vh', '115vh'], opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.0 + (i % 7) * 0.08, repeat: Infinity, delay: i * 0.033, ease: 'linear' }}
        />
      ))}

      {/* Wet ground reflections flanking the road */}
      <div className="absolute inset-x-0 bottom-0 h-36" style={{
        background: `linear-gradient(to top, ${pathNeon}1a, rgba(56,189,248,0.04), transparent)`
      }} />
      {[0,1,2,3,4,5].map(i => (
        <motion.div key={i} className="absolute rounded-full blur-md"
          style={{ bottom: `${2 + i * 4}%`, left: `${4 + i * 15}%`, width: 50 + i * 15, height: 5, background: i % 2 === 0 ? pathNeon : '#f472b6', opacity: 0 }}
          animate={{ opacity: [0, 0.28, 0] }}
          transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, delay: i * 0.9 }}
        />
      ))}

      {/* Moving cars */}
      {[0,1,2].map(i => (
        <motion.div key={i} className="absolute rounded border border-white/10"
          style={{ width: 36, height: 14, top: `${75 + i * 5}%`, background: 'rgba(10,14,30,0.9)', left: i % 2 === 0 ? '-5%' : '105%' }}
          animate={{ x: i % 2 === 0 ? ['0vw','130vw'] : ['0vw','-130vw'], opacity: [0, 0.85, 0] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, delay: i * 4, ease: 'linear' }}
        >
          <span className="absolute left-0.5 top-0.5 h-1 w-3 rounded-full bg-amber-200/90" />
          <span className="absolute right-0.5 bottom-0.5 h-1 w-1.5 rounded-full bg-red-400/80" />
        </motion.div>
      ))}

      {/* Steam vents */}
      {[14, 68, 40].map((left, i) => (
        <motion.div key={i} className="absolute rounded-full blur-xl"
          style={{ width: 36, height: 36, left: `${left}%`, bottom: `${16 + i * 5}%`, background: 'rgba(180,190,255,0.07)' }}
          animate={{ y: [0, -90], opacity: [0, 0.4, 0], scale: [0.8, 2.2] }}
          transition={{ duration: 4 + i * 0.8, repeat: Infinity, delay: i * 1.8 }}
        />
      ))}

      {/* Street lamp posts flanking */}
      {[8, 18, 78, 88].map((left, i) => (
        <div key={i} className="absolute bottom-0" style={{ left: `${left}%`, width: 4, height: '42%', background: 'rgba(100,110,130,0.6)' }}>
          <div className="absolute -top-1 -left-2 w-8 h-1 rounded-full" style={{ background: 'rgba(140,150,170,0.8)' }} />
          <motion.div className="absolute -top-3 -left-1 w-6 h-3 rounded-full blur-sm"
            style={{ background: '#fef3c7' }}
            animate={{ opacity: [0.6, 1, 0.7] }}
            transition={{ duration: 2.5 + i * 0.3, repeat: Infinity }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Neon sign (flanking the street) ──────────────────────────────────────────
function NeonSign({ text, color, big, left, top, bottom, right, index }) {
  const lines = text.split('\n');
  return (
    <motion.div className="absolute flex flex-col items-center justify-center rounded-xl border font-black uppercase text-center"
      style={{
        left, top, bottom, right,
        minWidth: big ? 100 : 72,
        padding: big ? '10px 14px' : '6px 10px',
        fontSize: big ? 12 : 9,
        letterSpacing: '0.1em',
        lineHeight: 1.35,
        color,
        borderColor: `${color}66`,
        background: 'rgba(0,2,10,0.88)',
        boxShadow: `0 0 24px ${color}66, 0 0 50px ${color}22, inset 0 0 14px ${color}11`,
        textShadow: `0 0 12px ${color}, 0 0 24px ${color}88`,
        backdropFilter: 'blur(6px)',
        zIndex: 30,
      }}
      animate={{ opacity: [0.45, 1, 0.35, 0.9, 0.45] }}
      transition={{ duration: 3.2 + index * 0.55, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
    >
      {lines.map((l, i) => <span key={i}>{l}</span>)}
    </motion.div>
  );
}

// ── Storefront sign ───────────────────────────────────────────────────────────
function Storefront({ label, color, left, top, bottom, right, index }) {
  return (
    <motion.div className="absolute rounded-lg border font-black uppercase text-center px-2 py-1.5"
      style={{
        left, top, bottom, right,
        fontSize: 10, letterSpacing: '0.08em',
        color, borderColor: `${color}55`,
        background: 'rgba(0,2,10,0.90)',
        boxShadow: `0 0 14px ${color}55, inset 0 0 8px ${color}11`,
        textShadow: `0 0 8px ${color}`,
        zIndex: 30,
      }}
      animate={{ opacity: [0.55, 0.95, 0.55] }}
      transition={{ duration: 4 + index * 0.6, repeat: Infinity, delay: index * 0.7 }}
    >
      {label}
    </motion.div>
  );
}

// ── 3D Pawn ───────────────────────────────────────────────────────────────────
function Pawn3D({ player, hopping }) {
  const hex = PAWN_HEX[player.color] || '#a855f7';
  return (
    <motion.div className="flex flex-col items-center pointer-events-none select-none"
      animate={hopping
        ? { y: [0, -44, 0], scale: [1, 1.12, 1] }
        : { y: [0, -7, 0] }
      }
      transition={hopping
        ? { duration: HOP_MS / 1000, ease: [0.22, 1, 0.36, 1] }
        : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      {/* Ball */}
      <div style={{
        width: 70, height: 70, borderRadius: '50%',
        background: `radial-gradient(circle at 33% 28%, white 0%, ${hex}ff 20%, ${hex}bb 60%, ${hex}55 100%)`,
        boxShadow: `0 0 40px ${hex}cc, 0 0 80px ${hex}55, 0 8px 30px rgba(0,0,0,0.6), inset 0 -8px 20px rgba(0,0,0,0.35)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, fontWeight: 900, color: 'white',
        border: '2px solid rgba(255,255,255,0.45)',
        position: 'relative',
        flexShrink: 0,
      }}>
        {player.avatar
          ? <img src={player.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          : <span style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>P</span>
        }
        {/* Specular shine */}
        <div style={{
          position: 'absolute', top: 9, left: 12, width: 18, height: 13, borderRadius: '50%',
          background: 'rgba(255,255,255,0.55)', transform: 'rotate(-25deg)', filter: 'blur(3px)',
        }} />
      </div>
      {/* Stem */}
      <div style={{
        width: 14, height: 22,
        background: `linear-gradient(180deg, ${hex}cc, ${hex}33)`,
        borderRadius: '0 0 6px 6px', marginTop: -2,
        boxShadow: `0 0 14px ${hex}66`,
      }} />
      {/* Shadow pool */}
      <motion.div
        style={{ width: 56, height: 10, borderRadius: '50%', background: `${hex}55`, filter: 'blur(8px)', marginTop: -2 }}
        animate={{ scaleX: [1, 0.85, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

// ── Tile card (flat on the ground, perspective applied by parent) ─────────────
function TileCard({ tile, idx, isCurrent, isStart, isFinish, occupants, hopping, categoryStyles, pathNeon, scale }) {
  const styleInfo = categoryStyles[tile.category] || categoryStyles.start;
  const Icon = styleInfo.icon;
  const neon  = CAT_NEON[tile.category]  || pathNeon;
  const emoji = CAT_EMOJI[tile.category] || '🌃';

  const label = isStart ? 'THE JOURNEY BEGINS' : isFinish ? 'YOU MADE IT! 🏆' : tile.name.toUpperCase();

  // scale controls font size for perspective depth illusion
  const fs  = Math.max(7, Math.round(15 * scale));
  const fs2 = Math.max(6, Math.round(10 * scale));
  const iconSz = Math.max(14, Math.round(24 * scale));

  return (
    <div style={{
      width: '100%', height: '100%',
      background: isCurrent
        ? `linear-gradient(145deg, rgba(8,12,32,0.98), rgba(14,20,50,0.96))`
        : `linear-gradient(145deg, rgba(4,6,18,0.95), rgba(2,4,12,0.97))`,
      border: `${isCurrent ? 2.5 : 1.5}px solid ${isCurrent ? neon : neon + '55'}`,
      borderRadius: 12,
      boxShadow: isCurrent
        ? `0 0 50px ${neon}aa, 0 0 100px ${neon}33, inset 0 0 20px ${neon}18`
        : `0 0 14px ${neon}33, inset 0 0 10px ${neon}08`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.012) 2px,rgba(255,255,255,0.012) 3px)', opacity: 0.5
      }} />
      {/* Top neon bar */}
      <div className="absolute inset-x-0 top-0" style={{ height: 2.5, background: `linear-gradient(90deg,transparent,${neon},transparent)`, opacity: isCurrent ? 1 : 0.5 }} />
      {/* Bottom reflection */}
      <div className="absolute inset-x-0 bottom-0" style={{ height: '35%', background: `linear-gradient(to top,${neon}22,transparent)` }} />

      {/* Space label */}
      {!isStart && !isFinish && (
        <p style={{ fontSize: Math.max(6, fs2 - 1), color: 'rgba(255,255,255,0.35)', fontWeight: 900, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 2 }}>
          SPACE {idx + 1}
        </p>
      )}

      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', width: '100%', justifyContent: 'center' }}>
        <div style={{
          width: iconSz, height: iconSz, borderRadius: 8, flexShrink: 0,
          background: `${neon}18`, border: `1px solid ${neon}55`,
          boxShadow: isCurrent ? `0 0 16px ${neon}88` : `0 0 6px ${neon}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon style={{ width: iconSz * 0.6, height: iconSz * 0.6, color: neon }} />
        </div>
        <p style={{
          fontSize: fs, fontWeight: 900, color: isCurrent ? '#fff' : 'rgba(255,255,255,0.88)',
          letterSpacing: '0.05em', lineHeight: 1.2, textTransform: 'uppercase',
          textShadow: isCurrent ? `0 0 14px ${neon}` : undefined,
          flex: 1, textAlign: 'center',
        }}>
          {label}
        </p>
        <span style={{ fontSize: Math.max(10, iconSz * 0.7), opacity: 0.75, flexShrink: 0 }}>{emoji}</span>
      </div>

      {/* Money badge */}
      {(tile.effect === 'money_gain' || tile.effect === 'money_loss') && tile.effectValue && (
        <p style={{
          fontSize: Math.max(6, fs2), fontWeight: 900, marginTop: 3,
          color: tile.effect === 'money_gain' ? '#34d399' : '#f87171',
          background: tile.effect === 'money_gain' ? 'rgba(52,211,153,0.14)' : 'rgba(248,113,113,0.14)',
          padding: '1px 8px', borderRadius: 20,
        }}>
          {tile.effect === 'money_gain' ? '+' : '-'}${Math.abs(tile.effectValue)}
        </p>
      )}
      {tile.effect === 'tax' && <p style={{ fontSize: Math.max(6, fs2), fontWeight: 900, color: '#ef4444', marginTop: 2 }}>💀 ALL TAXED</p>}
      {tile.effect === 'skip' && <p style={{ fontSize: Math.max(6, fs2), fontWeight: 900, color: '#fb923c', marginTop: 2 }}>⏭ SKIP TURN</p>}
      {tile.effect === 'roll_again' && <p style={{ fontSize: Math.max(6, fs2), fontWeight: 900, color: '#c084fc', marginTop: 2 }}>🎲 ROLL AGAIN</p>}

      {/* Pawn tokens on non-current tiles */}
      {occupants.length > 0 && !isCurrent && (
        <div style={{ display: 'flex', gap: 3, marginTop: 3 }}>
          {occupants.map(p => {
            const hex2 = PAWN_HEX[p.color] || '#a855f7';
            return (
              <div key={p.id} style={{
                width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                background: `radial-gradient(circle at 35% 35%, ${hex2}ee, ${hex2}88)`,
                border: '1px solid rgba(255,255,255,0.7)',
                boxShadow: `0 0 8px ${hex2}cc`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 7, fontWeight: 900, color: 'white',
              }}>
                {p.avatar ? <img src={p.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : p.name.charAt(0)}
              </div>
            );
          })}
        </div>
      )}

      {/* Active pulse */}
      {isCurrent && (
        <motion.div className="absolute inset-0 rounded pointer-events-none"
          style={{ border: `2.5px solid ${neon}`, boxShadow: `0 0 40px ${neon}` }}
          animate={{ opacity: [0.1, 1, 0.1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
}

// ── Main RoadView ─────────────────────────────────────────────────────────────
export function RoadView({ paths, activePathTiles, players, currentPlayerIndex, focusedPathIndex, getTileById, categoryStyles, playerColors }) {
  const currentPlayer = players[currentPlayerIndex];

  const activePathIdx = (focusedPathIndex !== null && focusedPathIndex !== undefined)
    ? focusedPathIndex
    : (currentPlayer.pathIndex ?? 0);

  const pathNeon    = ['#a855f7', '#ec4899', '#f97316'][activePathIdx] ?? '#a855f7';
  const tilesOnPath = activePathTiles[activePathIdx] ?? [];

  const { displayPos, hopping } = useStepAnimation(
    currentPlayer.position,
    `${currentPlayer.id}-${activePathIdx}`
  );
  const safePos = Math.max(0, Math.min(displayPos, tilesOnPath.length - 1));

  // Visible window: current + tiles ahead
  const SHOW_AHEAD  = 5;
  const SHOW_BEHIND = 0;
  const winStart = Math.max(0, safePos - SHOW_BEHIND);
  const winEnd   = Math.min(tilesOnPath.length - 1, safePos + SHOW_AHEAD);
  // visibleTiles[0] = current (nearest), [n] = farthest
  const visibleTiles = tilesOnPath.slice(winStart, winEnd + 1);

  const occupantMap = useMemo(() => {
    const map = {};
    for (const p of players) {
      const pPath = p.pathIndex ?? 0;
      if (pPath !== activePathIdx) continue;
      const idx = (p.id === currentPlayer.id) ? safePos : p.position;
      const clamped = Math.max(0, Math.min(idx, tilesOnPath.length - 1));
      map[clamped] = map[clamped] ? [...map[clamped], p] : [p];
    }
    return map;
  }, [players, activePathIdx, currentPlayer.id, safePos, tilesOnPath.length]);

  const progressPct = tilesOnPath.length > 1 ? Math.round((safePos / (tilesOnPath.length - 1)) * 100) : 0;
  const pathName    = paths[activePathIdx]?.name ?? 'Life';
  const pathEmoji   = paths[activePathIdx]?.emoji ?? '🏙️';
  const currentTile = getTileById(tilesOnPath[safePos] ?? 0);

  // Tile geometry: bottom tile is widest+tallest, each step up shrinks
  const BASE_W = 340;
  const BASE_H = 100;
  const GAP    = 6;

  // Scale factor per step up (0 = current/bottom, i = i steps ahead)
  const tileScale = (i) => Math.pow(0.72, i);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 5 }}>
      {/* ── City background ── */}
      <CityBackground pathNeon={pathNeon} />

      {/* ── Left neon billboard signs ── */}
      <NeonSign text={'HUSTLE\nHARD'}         color="#f472b6" big left="1%" top="12%" index={0} />
      <NeonSign text={'NO RISK\nNO REWARD'}   color="#a855f7" left="1%" top="30%" index={1} />
      <NeonSign text={'KEEP\nMOVING\nFORWARD'} color="#38bdf8" left="1%" top="50%" index={2} />
      <NeonSign text={'INVEST\nIN YOURSELF'}  color="#34d399" big left="1%" top="68%" index={3} />
      <Storefront label="☕ CAFE"   color="#fb923c" left="1%"  top="84%" index={0} />
      <Storefront label="📚 BOOKS"  color="#38bdf8" left="1%"  top="90%" index={1} />
      <Storefront label="🏋️ GYM"   color="#a855f7" left="12%" top="88%" index={2} />

      {/* ── Right neon billboard signs ── */}
      <NeonSign text={'FOCUS\nDISCIPLINE\nDESTINY'}  color="#34d399" big right="1%" top="10%" index={0} />
      <NeonSign text={'OPPORTUNITY\nIS EVERYWHERE'}   color="#38bdf8" big right="1%" top="30%" index={1} />
      <NeonSign text={'LIVE YOUR\nDREAMS'}            color="#f472b6" right="1%" top="50%" index={2} />
      <NeonSign text={'NO RISK\nNO REWARD'}           color="#fbbf24" right="1%" top="66%" index={3} />
      <Storefront label="🏦 MARKET"  color="#34d399" right="1%"  top="82%" index={0} />
      <Storefront label="🏨 MOTEL"   color="#c084fc" right="1%"  top="88%" index={1} />
      <Storefront label="🎯 24/7"    color="#fbbf24" right="12%" top="85%" index={2} />

      {/* ── Game title floating at horizon ── */}
      <motion.div className="absolute font-black text-center rounded-2xl border px-5 py-2"
        style={{
          top: '10%', left: '50%', transform: 'translateX(-50%)',
          fontSize: 11, letterSpacing: '0.16em', color: pathNeon,
          borderColor: `${pathNeon}55`, background: 'rgba(0,0,8,0.88)',
          boxShadow: `0 0 30px ${pathNeon}77, 0 0 60px ${pathNeon}33`,
          textShadow: `0 0 14px ${pathNeon}`, whiteSpace: 'nowrap', zIndex: 35,
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Trippin' Through Life
      </motion.div>

      {/* ── Header bar ── */}
      <div className="absolute top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-1.5"
        style={{ background: 'rgba(0,0,8,0.88)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${pathNeon}35` }}>
        <div className="flex items-center gap-2">
          <span>{pathEmoji}</span>
          <div>
            <p className="font-black uppercase text-white/40" style={{ fontSize: 6, letterSpacing: '0.2em' }}>YOUR PATH</p>
            <p className="font-black text-white" style={{ fontSize: 11 }}>{pathName}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <p className="font-black text-white/30 uppercase" style={{ fontSize: 6, letterSpacing: '0.18em' }}>
            SPACE {safePos + 1} / {tilesOnPath.length}
          </p>
          <div className="rounded-full overflow-hidden" style={{ width: 110, height: 5, background: 'rgba(255,255,255,0.08)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: pathNeon, boxShadow: `0 0 8px ${pathNeon}` }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-black" style={{ fontSize: 13, color: (currentPlayer.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
            ${currentPlayer.money?.toLocaleString?.() ?? 0}
          </span>
          {currentPlayer.job && <span style={{ fontSize: 10 }}>{currentPlayer.job.emoji}</span>}
        </div>
      </div>

      {/* ── 3D STREET — the magic ── */}
      {/*
        We use a CSS 3D perspective container.
        The tiles are laid out in a column and then rotated on the X axis
        so they lie flat on the "ground" receding to the horizon.
        The bottom tile (current) is the closest and largest.
        Each tile above it is scaled smaller to reinforce perspective depth.
      */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none"
        style={{ paddingBottom: 80, paddingTop: 60, zIndex: 20 }}>

        {/* Perspective scene root */}
        <div style={{
          perspective: 900,
          perspectiveOrigin: '50% 0%',
          width: BASE_W + 80,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
          height: '100%',
        }}>
          {/* Road surface behind tiles */}
          <div style={{
            position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: BASE_W,
            height: '100%',
            background: `linear-gradient(180deg, transparent 0%, rgba(4,6,18,0.0) 20%, rgba(8,12,28,0.55) 60%, rgba(10,14,32,0.85) 100%)`,
            pointerEvents: 'none',
          }} />

          {/* Road lane markings */}
          <div style={{
            position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%) rotateX(62deg)',
            transformOrigin: 'bottom center',
            width: 4, height: '160%',
            background: `repeating-linear-gradient(180deg, ${pathNeon}88 0px, ${pathNeon}88 24px, transparent 24px, transparent 44px)`,
            opacity: 0.35,
          }} />

          {/* Tile strip — rendered farthest→nearest so near is on top */}
          <div style={{
            display: 'flex', flexDirection: 'column-reverse',
            alignItems: 'center',
            gap: GAP,
            transform: 'rotateX(52deg)',
            transformOrigin: 'bottom center',
            transformStyle: 'preserve-3d',
            width: '100%',
            paddingBottom: 10,
          }}>
            {visibleTiles.map((tileId, i) => {
              // i=0 → bottom/nearest (current), i=n → top/farthest
              const actualIdx = winStart + i;
              const tile      = getTileById(tileId);
              const isCurrent = actualIdx === safePos;
              const isStart   = actualIdx === 0;
              const isFinish  = actualIdx === tilesOnPath.length - 1;
              const occupants = occupantMap[actualIdx] ?? [];
              const sc        = tileScale(i);
              const tw        = Math.round(BASE_W * sc);
              const th        = Math.round(BASE_H * sc);

              return (
                <motion.div key={`${activePathIdx}-${tileId}-${actualIdx}`}
                  style={{ width: tw, height: th, flexShrink: 0, pointerEvents: 'auto' }}
                  animate={isCurrent ? { scale: [1, 1.015, 1] } : { scale: 1 }}
                  transition={{ duration: 1.6, repeat: isCurrent ? Infinity : 0, ease: 'easeInOut' }}
                >
                  <TileCard
                    tile={tile} idx={actualIdx}
                    isCurrent={isCurrent} isStart={isStart} isFinish={isFinish}
                    occupants={occupants} hopping={hopping}
                    categoryStyles={categoryStyles} pathNeon={pathNeon}
                    scale={sc}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Pawn — sits on the current tile at the bottom */}
          <div style={{
            position: 'absolute',
            bottom: 90,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
            pointerEvents: 'none',
          }}>
            <Pawn3D player={currentPlayer} hopping={hopping} />
          </div>
        </div>
      </div>

      {/* ── Bottom status bar ── */}
      <div className="absolute bottom-0 inset-x-0 z-40 flex items-center gap-3 px-4 py-2"
        style={{ background: 'rgba(0,0,8,0.92)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${pathNeon}30` }}>
        {/* All player chips */}
        <div className="flex gap-2 flex-1 flex-wrap">
          {players.map((p, i) => {
            const hex = PAWN_HEX[p.color] || '#a855f7';
            const isActive = i === currentPlayerIndex;
            return (
              <div key={p.id} className="flex items-center gap-1.5 rounded-lg px-2 py-1"
                style={{ background: isActive ? `${hex}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${isActive ? hex + 'aa' : 'rgba(255,255,255,0.08)'}` }}>
                <div className="rounded-full flex items-center justify-center font-black text-white overflow-hidden"
                  style={{ width: 20, height: 20, fontSize: 8, background: `radial-gradient(circle at 35% 35%, ${hex}ee, ${hex}88)`, border: '1px solid rgba(255,255,255,0.5)' }}>
                  {p.avatar ? <img src={p.avatar} alt="" className="w-full h-full object-cover rounded-full" /> : p.name.charAt(0)}
                </div>
                <span className="font-bold text-white/80" style={{ fontSize: 9 }}>{p.name.split(' ')[0]}</span>
                <span className="font-black" style={{ fontSize: 9, color: (p.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
                  ${p.money?.toLocaleString?.() ?? p.money ?? 0}
                </span>
              </div>
            );
          })}
        </div>
        {/* Current tile */}
        <div className="text-right shrink-0">
          <p className="font-black uppercase text-white/25" style={{ fontSize: 6, letterSpacing: '0.14em' }}>NOW ON</p>
          <p className="font-black" style={{ fontSize: 10, color: CAT_NEON[currentTile?.category] || pathNeon }}>{currentTile?.name}</p>
        </div>
      </div>
    </div>
  );
}