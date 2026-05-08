import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Dice roller with stable animation
 * Shows rolling, landing, and final result
 */
export default function DiceRoller({ onRoll, isRolling = false, result = null }) {
  const [diceRotation, setDiceRotation] = useState({ x: 0, y: 0, z: 0 });

  const handleRoll = () => {
    if (isRolling) return;

    // Animate dice spinning
    const finalX = Math.floor(Math.random() * 360);
    const finalY = Math.floor(Math.random() * 360);
    const finalZ = Math.floor(Math.random() * 360);

    setDiceRotation({ x: finalX, y: finalY, z: finalZ });
    onRoll();
  };

  // Calculate which number shows based on rotation
  const getResultFromRotation = () => {
    if (result !== null) return result;
    return Math.floor(Math.random() * 6) + 1;
  };

  const displayResult = getResultFromRotation();

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Dice display */}
      <motion.div
        className="relative w-24 h-24 bg-gradient-to-br from-white via-pink-50 to-purple-100 border-4 border-purple-300 rounded-xl shadow-2xl cursor-pointer"
        animate={{
          rotateX: isRolling ? diceRotation.x : 0,
          rotateY: isRolling ? diceRotation.y : 0,
          rotateZ: isRolling ? diceRotation.z : 0,
          scale: isRolling ? 1.1 : 1,
        }}
        transition={{
          duration: isRolling ? 0.8 : 0.3,
          type: 'spring',
        }}
        onClick={handleRoll}
        style={{
          perspective: '1000px',
        }}
      >
        {/* Dice dots */}
        <DiceFace number={displayResult} />

        {/* Shine effect */}
        <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-white/70 blur-xs" />
      </motion.div>

      {/* Result number */}
      <motion.div
        className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
        key={displayResult}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {displayResult}
      </motion.div>

      {/* Roll button */}
      <motion.button
        onClick={handleRoll}
        disabled={isRolling}
        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
        whileHover={{ scale: isRolling ? 1 : 1.05 }}
        whileTap={{ scale: isRolling ? 1 : 0.95 }}
      >
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </motion.button>
    </div>
  );
}

/**
 * Render dice face with pips based on number
 */
function DiceFace({ number }) {
  const dotPositions = {
    1: [[50, 50]],
    2: [
      [25, 25],
      [75, 75],
    ],
    3: [
      [25, 25],
      [50, 50],
      [75, 75],
    ],
    4: [
      [25, 25],
      [25, 75],
      [75, 25],
      [75, 75],
    ],
    5: [
      [25, 25],
      [25, 75],
      [50, 50],
      [75, 25],
      [75, 75],
    ],
    6: [
      [25, 25],
      [25, 50],
      [25, 75],
      [75, 25],
      [75, 50],
      [75, 75],
    ],
  };

  const positions = dotPositions[number] || dotPositions[1];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 shadow-sm"
          style={{
            left: `${pos[0]}%`,
            top: `${pos[1]}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}