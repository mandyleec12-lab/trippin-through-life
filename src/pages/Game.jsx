import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CityScene from '@/components/game/CityScene';
import GameBoard from '@/components/game/GameBoard';
import Pawn from '@/components/game/Pawn';
import DiceRoller from '@/components/game/DiceRoller';
import GameCard from '@/components/game/GameCard';
import HUD from '@/components/game/HUD';
import PathSelection from '@/components/game/PathSelection';
import { LIFE_PATHS, PAWN_COLORS } from '@/lib/gameData';
import { createGameState, shouldEnterChaosRealm, processDecision } from '@/lib/gameEngine';

/**
 * Main game page
 * Handles turn flow, pawn movement, card events, and game state
 */
export default function Game() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [position, setPosition] = useState(0);

  // Gameplay flow
  const [diceResult, setDiceResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);

  // Initialize game
  const handleSelectPath = (pathId) => {
    setSelectedPath(pathId);
    const state = createGameState(pathId);
    setGameState(state);
    setGameStarted(true);
  };

  // Handle dice roll
  const handleRoll = () => {
    if (isMoving || isRolling || !gameState) return;

    setIsRolling(true);
    setDiceResult(null);

    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setDiceResult(result);

      // Start pawn movement
      setTimeout(() => {
        movePlayer(result);
      }, 500);
    }, 800);
  };

  // Move player and trigger events
  const movePlayer = (steps) => {
    setIsMoving(true);

    const newPos = Math.min(position + steps, 30);
    setPosition(newPos);

    // After movement, trigger card event
    setTimeout(() => {
      setIsMoving(false);
      triggerCardEvent(newPos);
    }, steps * 300); // ~300ms per tile
  };

  // Trigger event card for landed tile
  const triggerCardEvent = (tilePosition) => {
    // Example events
    const events = [
      {
        type: 'moral',
        title: 'Found a Wallet with $100',
        description: "There's cash and an ID inside.",
        choices: [
          { text: 'Return it to owner', karma: 5, consequences: 'Your integrity matters' },
          { text: 'Keep the money', karma: -5, consequences: 'Guilt eats at you' },
        ],
      },
      {
        type: 'money',
        title: 'Unexpected Bonus!',
        description: 'Your employer gave everyone a surprise bonus.',
        choices: [
          { text: 'Save it', karma: 2, consequences: 'Financial stability increases' },
          { text: 'Treat yourself', karma: 0, consequences: 'Happiness boost, money gone' },
        ],
      },
      {
        type: 'life',
        title: 'Friend Needs Help',
        description: "They're struggling and need someone to talk to.",
        choices: [
          { text: 'Listen and support', karma: 4, consequences: 'Friendship strengthens' },
          { text: 'Too busy today', karma: -3, consequences: 'They feel alone' },
        ],
      },
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    setCurrentCard(randomEvent);
    setShowCard(true);
  };

  // Handle card choice
  const handleCardChoice = (choiceIndex) => {
    if (!currentCard) return;

    const choice = currentCard.choices[choiceIndex];
    // Process the decision
    const decision = processDecision(currentCard.type, choiceIndex);

    // Update game state
    setGameState((prev) => ({
      ...prev,
      money: prev.money + (choice.karma === 5 ? 50 : choice.karma === -5 ? -50 : 0),
      karma: prev.karma + choice.karma,
      turn: prev.turn + 1,
    }));

    // Check for chaos realm
    if (shouldEnterChaosRealm(gameState)) {
      setGameState((prev) => ({ ...prev, inChaosRealm: true }));
    }

    setTimeout(() => {
      setShowCard(false);
      setCurrentCard(null);
      setDiceResult(null);
    }, 500);
  };

  if (!gameStarted) {
    return <PathSelection onSelectPath={handleSelectPath} />;
  }

  if (!gameState) return null;

  const path = LIFE_PATHS[selectedPath];
  const pawnColor = PAWN_COLORS[0]; // First player for now

  // Calculate pawn screen position based on tile
  const tilePosition = position / 30; // 0 to 1
  const pawnY = 400 - tilePosition * 350; // Top to bottom
  const pawnX = 200 + Math.sin(tilePosition * Math.PI * 2) * 100; // Curved side to side

  return (
    <div className="fixed inset-0 bg-slate-950 overflow-hidden">
      {/* City background */}
      <CityScene inChaosRealm={gameState.inChaosRealm} />

      {/* HUD */}
      <HUD
        money={gameState.money}
        burnout={gameState.burnout}
        position={position}
        pathName={path.name}
        turn={gameState.turn}
        inChaosRealm={gameState.inChaosRealm}
      />

      {/* Game board */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <GameBoard position={position} inChaosRealm={gameState.inChaosRealm} />
      </div>

      {/* Pawn */}
      <Pawn
        color={pawnColor.name.toLowerCase()}
        position={{ x: pawnX, y: pawnY }}
        isMoving={isMoving}
        label="You"
      />

      {/* Controls at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-40 backdrop-blur-md bg-black/40 border-t-2 border-purple-500/50"
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-md mx-auto px-6 py-8">
          <DiceRoller onRoll={handleRoll} isRolling={isRolling} result={diceResult} />
        </div>
      </motion.div>

      {/* Card modal */}
      <GameCard
        isOpen={showCard}
        cardType={currentCard?.type || 'life'}
        title={currentCard?.title || 'Event'}
        description={currentCard?.description || ''}
        choices={currentCard?.choices || []}
        onChoose={handleCardChoice}
      />

      {/* Win state */}
      {position >= 30 && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">You Made It! 🎉</h1>
            <p className="text-2xl text-purple-300 mb-8">Final Money: ${gameState.money}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700"
            >
              Play Again
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}