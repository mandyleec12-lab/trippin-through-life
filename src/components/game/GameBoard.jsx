import React from 'react';
import { motion } from 'framer-motion';

/**
 * The curved road board with glowing tiles
 * Shows all tiles and path positions
 */
export default function GameBoard({ position, inChaosRealm = false, onTileClick = () => {} }) {
  const TILES_COUNT = 30;

  // Get all tile positions along a curved path
  const getTilePosition = (index) => {
    const progress = index / (TILES_COUNT - 1);
    const yPos = 95 - progress * 90; // Top to bottom

    // Create meandering curve across 4 path lanes
    const frequency = 2;
    const amplitude = 12;
    const curve = Math.sin(progress * Math.PI * frequency) * amplitude;
    const centerX = 50 + curve;

    return { x: centerX, y: yPos };
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        viewBox="0 0 400 600"
        className="w-full h-full max-w-md"
        style={{ filter: inChaosRealm ? 'hue-rotate(240deg) saturate(0.6)' : 'none' }}
      >
        {/* Road path */}
        <motion.path
          d={`M ${getTilePosition(0).x * 4} ${getTilePosition(0).y * 6} ${[...Array(TILES_COUNT)]
            .map((_, i) => {
              const pos = getTilePosition(i);
              return `L ${pos.x * 4} ${pos.y * 6}`;
            })
            .join(' ')}`}
          stroke={inChaosRealm ? '#4c1d95' : '#c084fc'}
          strokeWidth="40"
          fill="none"
          strokeLinecap="round"
          opacity={0.5}
        />

        {/* Tiles */}
        {[...Array(TILES_COUNT)].map((_, i) => {
          const pos = getTilePosition(i);
          const isCurrentPosition = Math.abs(position - i) < 0.5;

          // Tile colors based on type
          let tileColor = inChaosRealm ? '#831843' : '#ec4899';
          if (i === 0) tileColor = inChaosRealm ? '#5b21b6' : '#a78bfa';
          if (i === TILES_COUNT - 1) tileColor = inChaosRealm ? '#7c3aed' : '#fbbf24';

          return (
            <motion.g key={i}>
              {/* Tile glow */}
              {isCurrentPosition && (
                <motion.circle
                  cx={pos.x * 4}
                  cy={pos.y * 6}
                  r={30}
                  fill={tileColor}
                  opacity={0.3}
                  animate={{
                    r: [30, 45, 30],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}

              {/* Tile */}
              <motion.circle
                cx={pos.x * 4}
                cy={pos.y * 6}
                r="16"
                fill={tileColor}
                stroke="white"
                strokeWidth="2"
                animate={{
                  scale: isCurrentPosition ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
                onClick={() => onTileClick(i)}
                style={{ cursor: 'pointer' }}
              />

              {/* Tile number */}
              <text
                x={pos.x * 4}
                y={pos.y * 6}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-bold"
                fill="white"
                opacity={0.8}
              >
                {i}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}