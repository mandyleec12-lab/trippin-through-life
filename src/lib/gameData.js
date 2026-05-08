// Game configuration and all static data

export const LIFE_PATHS = [
  {
    id: 0,
    name: 'College → Best Job',
    emoji: '🎓',
    color: 'from-violet-400 to-purple-500',
    textColor: 'text-violet-400',
    bgColor: 'bg-violet-950',
    description: 'High income, high pressure, high burnout risk',
  },
  {
    id: 1,
    name: 'HS/GED → Good Job',
    emoji: '📚',
    color: 'from-pink-400 to-rose-500',
    textColor: 'text-pink-400',
    bgColor: 'bg-rose-950',
    description: 'Steady income, steady stress, steady progress',
  },
  {
    id: 2,
    name: 'Dropout → Min Wage',
    emoji: '⚡',
    color: 'from-orange-400 to-amber-500',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-950',
    description: 'Low income, high struggle, survival focus',
  },
  {
    id: 3,
    name: 'Self-Employed → Streaming',
    emoji: '📺',
    color: 'from-cyan-400 to-teal-500',
    textColor: 'text-cyan-400',
    bgColor: 'bg-teal-950',
    description: 'Unpredictable income, big break potential, burnout risk',
  },
];

export const PAWN_COLORS = [
  { name: 'Pink', bg: 'bg-pink-500', shadow: 'shadow-pink-500/60' },
  { name: 'Purple', bg: 'bg-purple-500', shadow: 'shadow-purple-500/60' },
  { name: 'Blue', bg: 'bg-blue-500', shadow: 'shadow-blue-500/60' },
  { name: 'Teal', bg: 'bg-teal-500', shadow: 'shadow-teal-500/60' },
  { name: 'Gold', bg: 'bg-amber-400', shadow: 'shadow-amber-400/60' },
  { name: 'Coral', bg: 'bg-rose-400', shadow: 'shadow-rose-400/60' },
];

// Board constants
export const BOARD_TILES_COUNT = 30;
export const TILE_GLOW_DURATION = 1.2; // seconds
export const PAWN_MOVE_DURATION = 0.3; // seconds per tile
export const DICE_ROLL_DURATION = 0.8; // seconds

// Karma system thresholds
export const KARMA = {
  BLESSING_THRESHOLD: 15, // +15 karma triggers random blessings
  CHAOS_THRESHOLD: -15, // -15 karma triggers chaos events
  RESET_AT_MIDPOINT: 30, // Reset to 0 after 30 tiles
};

// Burnout system
export const BURNOUT = {
  HIGH_INCOME_INCREASE: 0.05, // +5% chance per tile on high-income paths
  LOW_INCOME_INCREASE: 0.02, // +2% chance per tile on low-income paths
  CHAOS_REALM_MULTIPLIER: 3, // 3x burnout chance in chaos realm
  TRIGGERS_AT: 0.7, // When burnout hits 70%, chaos realm chance increases
};

// Event types for decision cards
export const EVENT_TYPES = {
  MORAL_CHOICE: 'moral_choice',
  MONEY_EVENT: 'money_event',
  LIFE_EVENT: 'life_event',
  CHAOS_EVENT: 'chaos_event',
  BLESSING_EVENT: 'blessing_event',
  CAREER_EVENT: 'career_event',
};

// Delayed consequence system
export const DELAYED_CONSEQUENCES = {
  SHORT: 2, // 2-4 tiles
  MEDIUM: 5, // 5-10 tiles
  LONG: 10, // 10-15 tiles
};