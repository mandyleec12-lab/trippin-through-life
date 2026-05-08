// Game logic: karma system, consequences, decision mechanics

import { KARMA, BURNOUT, DELAYED_CONSEQUENCES } from './gameData';

/**
 * Karma System
 * - Hidden from player
 * - Good choices: +karma
 * - Selfish choices: -karma
 * - Affects future event probabilities
 */
export const createGameState = (pathId) => ({
  position: 0,
  money: 500, // Starting money
  pathId,
  karma: 0,
  burnout: 0,
  inChaosRealm: false,
  decisions: [], // All choices player made
  delayedConsequences: [], // Events queued for future tiles
  turn: 1,
});

/**
 * Process a decision card choice
 * Returns: { karmaChange, immediateEffect, delayedEffect }
 */
export const processDecision = (cardType, choiceIndex) => {
  const decisions = {
    wallet: {
      choices: [
        { text: 'Return it', karma: 5, money: 0, delayed: 'blessing' },
        { text: 'Keep it', karma: -5, money: 50, delayed: 'chaos' },
      ],
    },
    starving: {
      choices: [
        { text: 'Buy them food', karma: 3, money: -15, delayed: null },
        { text: 'Walk by', karma: -3, money: 0, delayed: 'guilt' },
      ],
    },
    help_friend: {
      choices: [
        { text: 'Help them', karma: 4, money: -30, delayed: 'favor_repaid' },
        { text: 'Say no', karma: -4, money: 0, delayed: 'isolation' },
      ],
    },
    cheat_opportunity: {
      choices: [
        { text: 'Stay honest', karma: 6, money: 0, delayed: 'integrity_reward' },
        { text: 'Cheat for money', karma: -6, money: 200, delayed: 'caught' },
      ],
    },
  };

  const card = decisions[cardType];
  if (!card || !card.choices[choiceIndex]) return null;

  return card.choices[choiceIndex];
};

/**
 * Calculate chance of blessing/chaos event based on karma
 */
export const shouldTriggerKarmaEvent = (karma, isChaosRealm = false) => {
  const thresholds = isChaosRealm
    ? { blessing: 20, chaos: -5 } // Easier to get chaos in chaos realm
    : { blessing: KARMA.BLESSING_THRESHOLD, chaos: KARMA.CHAOS_THRESHOLD };

  if (karma >= thresholds.blessing && Math.random() < 0.3) return 'blessing';
  if (karma <= thresholds.chaos && Math.random() < 0.3) return 'chaos';
  return null;
};

/**
 * Calculate burnout increase based on path and income
 */
export const calculateBurnoutIncrease = (pathId, isChaosRealm = false) => {
  const baseRates = {
    0: BURNOUT.HIGH_INCOME_INCREASE, // College path
    1: BURNOUT.LOW_INCOME_INCREASE * 1.5, // HS/GED path
    2: BURNOUT.LOW_INCOME_INCREASE, // Dropout path (survival focus)
    3: BURNOUT.HIGH_INCOME_INCREASE * 1.2, // Self-employed (unpredictable)
  };

  let increase = baseRates[pathId] || 0.02;
  if (isChaosRealm) increase *= BURNOUT.CHAOS_REALM_MULTIPLIER;

  return increase;
};

/**
 * Check if player should enter Chaos Realm
 * Triggered by:
 * - Money < -200 (debt spiral)
 * - Burnout > 70%
 * - Negative karma below threshold
 */
export const shouldEnterChaosRealm = (state) => {
  if (state.inChaosRealm) return false; // Already in
  if (state.money < -200) return true; // Debt spiral
  if (state.burnout > 0.7) return true; // Severe burnout
  if (state.karma <= KARMA.CHAOS_THRESHOLD) return true; // Karma threshold
  return false;
};

/**
 * Get the next delayed consequence if tile matches
 */
export const getDelayedConsequence = (state, currentTile) => {
  return state.delayedConsequences.find((c) => c.triggeredAtTile === currentTile);
};

/**
 * Queue a delayed consequence (triggered X tiles later)
 */
export const queueDelayedConsequence = (state, consequenceType, delayType) => {
  const delays = {
    short: Math.floor(Math.random() * (4 - 2 + 1) + 2), // 2-4 tiles
    medium: Math.floor(Math.random() * (10 - 5 + 1) + 5), // 5-10 tiles
    long: Math.floor(Math.random() * (15 - 10 + 1) + 10), // 10-15 tiles
  };

  const delay = delays[delayType] || delays.medium;
  const triggeredAtTile = state.position + delay;

  return {
    type: consequenceType,
    triggeredAtTile,
    created: state.position,
  };
};

/**
 * Get a blessed event based on karma level
 */
export const getBlessingEvent = (karma) => {
  const blessings = [
    { text: 'Unexpected bonus at work!', money: 150, desc: 'Your kindness came full circle' },
    { text: 'An old friend reached out with a job lead', money: 200, desc: 'Someone remembered your integrity' },
    { text: 'Found money in an old coat', money: 75, desc: 'Lucky blessings find good people' },
    { text: 'Someone paid back a forgotten debt', money: 100, desc: 'Good people remember good deeds' },
    { text: 'Random act of kindness from a stranger', money: 50, desc: 'What goes around, comes around' },
  ];

  return blessings[Math.floor(Math.random() * blessings.length)];
};

/**
 * Get a chaos event based on karma level
 */
export const getChaosEvent = (karma) => {
  const chaosEvents = [
    { text: 'Someone you wronged just... showed up 😬', money: -200, desc: 'Consequences have a way of catching up' },
    { text: 'Got scammed online', money: -300, desc: 'Selfish choices attract selfish people' },
    { text: 'Betrayed by someone you trusted', money: -150, desc: 'Burned bridges burn you back' },
    { text: 'Bad luck struck when you needed stability most', money: -250, desc: 'Negativity attracts negativity' },
    { text: 'Isolated when you needed support', money: -100, desc: 'People remember how you treated them' },
  ];

  return chaosEvents[Math.floor(Math.random() * chaosEvents.length)];
};

/**
 * Calculate tax based on path (self-employed pay more)
 */
export const calculateTax = (money, pathId) => {
  const taxRates = {
    0: 0.22, // College (W2)
    1: 0.18, // HS/GED (W2)
    2: 0.15, // Dropout (W2)
    3: 0.35, // Self-employed (1099)
  };

  const rate = taxRates[pathId] || 0.2;
  return Math.round(money * rate);
};