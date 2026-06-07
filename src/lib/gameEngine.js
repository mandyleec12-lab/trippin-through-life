/**
 * 4D Life Engine — tracks player life stats, reputation, delayed consequences,
 * and unlocked/locked city districts based on past decisions.
 *
 * "4D" means time is the 4th dimension: choices made early resurface later.
 */

// ── Life Stat Dimensions ──────────────────────────────────────────────────────
export const LIFE_STAT_KEYS = ['education', 'health', 'family', 'risk', 'kindness', 'wealth'];

export const createLifeStats = () => ({
  education: 0,  // +college, +school events, -dropout chaos
  health: 0,     // +gym, +therapy, -stress tiles
  family: 0,     // +relationship blessings, -heartbreak
  risk: 0,       // +chaos choices, +wildcard bets
  kindness: 0,   // +helping others, +community tiles
  wealth: 0,     // tracks net financial decisions (not current money)
});

// ── City Districts — unlock by life stat thresholds ───────────────────────────
export const CITY_DISTRICTS = [
  {
    id: 'university_row',
    name: 'University Row',
    emoji: '🎓',
    description: 'Ivy-covered buildings, networking events, alumni connections',
    unlockCondition: (stats) => stats.education >= 3,
    lockCondition: null,
    bonusTileEffect: { moneyGain: 400, moveBonus: 2 },
    color: '#7c3aed',
  },
  {
    id: 'wellness_district',
    name: 'Wellness District',
    emoji: '🧘',
    description: 'Spas, organic markets, gyms. High health = resilience bonuses.',
    unlockCondition: (stats) => stats.health >= 3,
    lockCondition: (stats) => stats.health < -2,
    bonusTileEffect: { skipImmunity: true, moneyGain: 150 },
    color: '#059669',
  },
  {
    id: 'family_neighborhood',
    name: 'The Neighborhood',
    emoji: '🏡',
    description: 'Community cookouts, babysitting networks, mutual aid circles.',
    unlockCondition: (stats) => stats.family >= 3,
    lockCondition: null,
    bonusTileEffect: { moneyGain: 200, extraRoll: true },
    color: '#f59e0b',
  },
  {
    id: 'hustle_district',
    name: 'Hustle District',
    emoji: '🔥',
    description: 'High risk, high reward. Crypto bros, gig stacking, side hustles.',
    unlockCondition: (stats) => stats.risk >= 4,
    lockCondition: null,
    bonusTileEffect: { moneyGain: 600, chaosRisk: true },
    color: '#ef4444',
  },
  {
    id: 'kindness_quarter',
    name: 'The Quarter',
    emoji: '💜',
    description: 'Community mentors, hidden job opportunities, reputation rewards.',
    unlockCondition: (stats) => stats.kindness >= 3,
    lockCondition: null,
    bonusTileEffect: { reputationBonus: 50, moneyGain: 300, skipImmunity: true },
    color: '#8b5cf6',
  },
  {
    id: 'skid_row',
    name: 'Skid Row',
    emoji: '😔',
    description: 'Forced here when health AND family AND wealth all go negative.',
    unlockCondition: null,
    lockCondition: null,
    forceCondition: (stats) => stats.health < -3 && stats.family < -2 && stats.wealth < -3,
    bonusTileEffect: { moneyLoss: -500, chaosRisk: true },
    color: '#374151',
  },
];

// ── Delayed Consequence Pool ──────────────────────────────────────────────────
// Each consequence fires N turns after the triggering decision.
export const DELAYED_CONSEQUENCES = [
  // Education consequences
  {
    id: 'degree_payoff',
    triggerStat: 'education',
    triggerThreshold: 3,
    turnsDelay: 6,
    title: '🎓 Your Degree Paid Off',
    description: 'That networking event 6 turns ago? The contact called. You got a raise.',
    moneyDelta: 800,
    statDelta: { wealth: 1 },
    category: 'money',
  },
  {
    id: 'student_debt_crisis',
    triggerStat: 'education',
    triggerThreshold: -2,
    turnsDelay: 5,
    title: '💳 Student Debt Collection',
    description: 'Sallie Mae found you. Interest compounded while you were ignoring it.',
    moneyDelta: -600,
    statDelta: { wealth: -1 },
    category: 'money_loss',
  },
  // Health consequences
  {
    id: 'health_investment_pays',
    triggerStat: 'health',
    triggerThreshold: 4,
    turnsDelay: 8,
    title: '💪 Health Saved You',
    description: 'You were sick, but your body fought back faster. Skipped a hospital bill.',
    moneyDelta: 500,
    statDelta: { health: 1 },
    skipImmunity: true,
    category: 'blessing',
  },
  {
    id: 'burnout_consequence',
    triggerStat: 'health',
    triggerThreshold: -3,
    turnsDelay: 4,
    title: '😮‍💨 Burnout Finally Hit',
    description: 'You ignored the warning signs. Your body is making you stop.',
    moneyDelta: -400,
    statDelta: { health: -1, wealth: -1 },
    skipNextTurn: true,
    category: 'chaos',
  },
  // Family consequences
  {
    id: 'family_network_bonus',
    triggerStat: 'family',
    triggerThreshold: 4,
    turnsDelay: 7,
    title: '🏡 Family Came Through',
    description: 'Remember when you showed up for them? They showed up bigger.',
    moneyDelta: 700,
    statDelta: { family: 1 },
    category: 'blessing',
  },
  {
    id: 'relationship_fallout',
    triggerStat: 'family',
    triggerThreshold: -3,
    turnsDelay: 5,
    title: '💔 Relationship Fallout',
    description: 'The distance you created caught up with you. Support system collapsed.',
    moneyDelta: -300,
    statDelta: { family: -1, health: -1 },
    skipNextTurn: true,
    category: 'heartbreak',
  },
  // Kindness / Reputation consequences
  {
    id: 'reputation_unlock',
    triggerStat: 'kindness',
    triggerThreshold: 3,
    turnsDelay: 6,
    title: '💜 Your Reputation Preceded You',
    description: 'Someone you mentored got you an introduction. Hidden job unlocked.',
    moneyDelta: 500,
    statDelta: { kindness: 1, wealth: 1 },
    category: 'blessing',
  },
  {
    id: 'community_rejects',
    triggerStat: 'kindness',
    triggerThreshold: -2,
    turnsDelay: 5,
    title: '😤 Community Noticed',
    description: "Word travels fast. Your reputation took a hit. They don't forget.",
    moneyDelta: -200,
    statDelta: { kindness: -1 },
    category: 'chaos',
  },
  // Risk consequences
  {
    id: 'risk_big_break',
    triggerStat: 'risk',
    triggerThreshold: 5,
    turnsDelay: 9,
    title: '💥 BIG BREAK — The Bet Paid Off',
    description: 'That crazy gamble you made? It actually hit. The city is talking about you.',
    moneyDelta: 1200,
    statDelta: { risk: 1, wealth: 2 },
    category: 'money',
  },
  {
    id: 'risk_backfire',
    triggerStat: 'risk',
    triggerThreshold: 3,
    turnsDelay: 6,
    title: '📉 The Risk Came Due',
    description: "You rolled the dice one too many times. The house always collects.",
    moneyDelta: -800,
    statDelta: { risk: -1, wealth: -2 },
    category: 'money_loss',
  },
];

// ── Life Crossroads — branching decisions that alter future ────────────────────
export const LIFE_CROSSROADS = [
  {
    id: 'invest_in_self',
    title: 'Invest in Yourself?',
    subtitle: 'You have a chance to take a course, go to therapy, or hit the gym.',
    choices: [
      {
        label: 'Take the Course 📚',
        description: 'Costs money now. Could unlock better careers later.',
        moneyDelta: -300,
        statDelta: { education: 2, wealth: -1 },
        consequence: 'degree_payoff',
        delayTurns: 6,
      },
      {
        label: 'Join the Gym 🏋️',
        description: 'Monthly cost but you\'ll be more resilient to chaos.',
        moneyDelta: -100,
        statDelta: { health: 2 },
        consequence: 'health_investment_pays',
        delayTurns: 8,
      },
      {
        label: 'Keep Your Money 💰',
        description: 'Save it. You\'ve got bills.',
        moneyDelta: 0,
        statDelta: {},
        consequence: null,
        delayTurns: 0,
      },
    ],
  },
  {
    id: 'family_or_career',
    title: 'Family or Career?',
    subtitle: 'A major opportunity just crossed paths with a family need.',
    choices: [
      {
        label: 'Put Family First 🏡',
        description: 'Miss the opportunity. Strengthen the relationship.',
        moneyDelta: -200,
        statDelta: { family: 3, kindness: 1 },
        consequence: 'family_network_bonus',
        delayTurns: 7,
      },
      {
        label: 'Chase the Career 💼',
        description: 'Big money potential. Relationships may suffer.',
        moneyDelta: 400,
        statDelta: { wealth: 2, family: -1 },
        consequence: null,
        delayTurns: 0,
      },
      {
        label: 'Try to Do Both 🤯',
        description: 'Chaotic middle ground. Could go either way.',
        moneyDelta: 100,
        statDelta: { health: -1, family: 1 },
        consequence: 'burnout_consequence',
        delayTurns: 4,
      },
    ],
  },
  {
    id: 'risky_investment',
    title: 'The Risky Investment',
    subtitle: 'Someone offers you a deal. High risk, high reward.',
    choices: [
      {
        label: 'Go All In 🎲',
        description: 'Could double your money. Could wipe you out.',
        moneyDelta: 0,
        statDelta: { risk: 3 },
        consequence: 'risk_big_break',
        delayTurns: 9,
        bigBreakChance: true,
      },
      {
        label: 'Invest a Little 📊',
        description: 'Modest risk for modest reward.',
        moneyDelta: 150,
        statDelta: { risk: 1, wealth: 1 },
        consequence: null,
        delayTurns: 0,
      },
      {
        label: 'Walk Away 🚶',
        description: 'Live to fight another day.',
        moneyDelta: 50,
        statDelta: {},
        consequence: null,
        delayTurns: 0,
      },
    ],
  },
  {
    id: 'mentor_someone',
    title: 'Someone Needs Your Help',
    subtitle: 'A younger person asks you for guidance. You\'re busy, but...',
    choices: [
      {
        label: 'Mentor Them 💜',
        description: 'Give your time. Build reputation points.',
        moneyDelta: -50,
        statDelta: { kindness: 3 },
        consequence: 'reputation_unlock',
        delayTurns: 6,
      },
      {
        label: 'Pass Them a Contact 📱',
        description: 'Low effort. Small kindness still counts.',
        moneyDelta: 0,
        statDelta: { kindness: 1 },
        consequence: null,
        delayTurns: 0,
      },
      {
        label: 'Too Busy 😬',
        description: 'You have your own problems.',
        moneyDelta: 0,
        statDelta: { kindness: -1 },
        consequence: null,
        delayTurns: 0,
      },
    ],
  },
  {
    id: 'health_crisis',
    title: 'Your Body is Sending Signals',
    subtitle: 'You\'ve been running on empty. Time to make a call.',
    choices: [
      {
        label: 'Rest and Recover 🛌',
        description: 'Lose income. Gain resilience.',
        moneyDelta: -250,
        statDelta: { health: 3 },
        consequence: 'health_investment_pays',
        delayTurns: 5,
      },
      {
        label: 'Power Through 💪',
        description: 'Keep the money. Burn the candle.',
        moneyDelta: 100,
        statDelta: { health: -2, risk: 1 },
        consequence: 'burnout_consequence',
        delayTurns: 4,
      },
      {
        label: 'Get Therapy 🧠',
        description: 'Invest in mental health. Delayed returns.',
        moneyDelta: -150,
        statDelta: { health: 2, family: 1 },
        consequence: 'family_network_bonus',
        delayTurns: 7,
      },
    ],
  },
];

// ── Archetype Calculator ──────────────────────────────────────────────────────
const ARCHETYPES = [
  { name: 'The Visionary', emoji: '🌟', condition: (s) => s.education >= 4 && s.wealth >= 2 },
  { name: 'The Grinder', emoji: '💪', condition: (s) => s.risk >= 4 && s.wealth >= 3 },
  { name: 'The Healer', emoji: '🧘', condition: (s) => s.health >= 4 && s.kindness >= 3 },
  { name: 'The Connector', emoji: '🤝', condition: (s) => s.kindness >= 4 && s.family >= 3 },
  { name: 'The Survivor', emoji: '🔥', condition: (s) => s.health < 0 && s.wealth < 0 && s.risk >= 2 },
  { name: 'The Caretaker', emoji: '🏡', condition: (s) => s.family >= 5 },
  { name: 'The Rebel', emoji: '⚡', condition: (s) => s.risk >= 5 && s.education < 1 },
  { name: 'The Scholar', emoji: '📚', condition: (s) => s.education >= 5 },
  { name: 'The Wanderer', emoji: '🌍', condition: (s) => Object.values(s).every(v => Math.abs(v) < 3) },
];

export function getPlayerArchetype(lifeStats) {
  for (const arch of ARCHETYPES) {
    if (arch.condition(lifeStats)) return arch;
  }
  return { name: 'The Survivor', emoji: '💜' };
}

// ── Stat Impact Helpers ───────────────────────────────────────────────────────
export function getStatImpactFromTile(tileCategory, tileEffect) {
  const impacts = {
    glowup: { health: 1 },
    heartbreak: { family: -1, health: -1 },
    blessing: { kindness: 1, family: 1 },
    chaos: { risk: 1, health: -1 },
    money: { wealth: 1 },
    money_loss: { wealth: -1 },
    tax: { wealth: -1 },
    wildcard: { risk: 1 },
  };
  return impacts[tileCategory] || {};
}

export function applyStatDelta(lifeStats, delta) {
  const next = { ...lifeStats };
  for (const [key, val] of Object.entries(delta)) {
    if (key in next) next[key] = (next[key] || 0) + val;
  }
  return next;
}

export function getUnlockedDistricts(lifeStats) {
  return CITY_DISTRICTS.filter(d => {
    if (d.forceCondition) return d.forceCondition(lifeStats);
    if (!d.unlockCondition) return false;
    if (d.lockCondition && d.lockCondition(lifeStats)) return false;
    return d.unlockCondition(lifeStats);
  });
}

export function getPendingConsequences(lifeStats, turnsPlayed) {
  return DELAYED_CONSEQUENCES.filter(c => {
    const statVal = lifeStats[c.triggerStat] || 0;
    if (c.triggerThreshold > 0) return statVal >= c.triggerThreshold;
    if (c.triggerThreshold < 0) return statVal <= c.triggerThreshold;
    return false;
  });
}

// ── Cross-roads tile IDs (injected into path tile assignments) ────────────────
// These 5 tile IDs are "life crossroads" tiles — not in the standard TILES array.
// They are handled specially in the game engine.
export const CROSSROADS_TILE_IDS = [200, 201, 202, 203, 204];

export const CROSSROADS_TILES = CROSSROADS_TILE_IDS.map((id, i) => ({
  id,
  name: LIFE_CROSSROADS[i % LIFE_CROSSROADS.length].title,
  category: 'wildcard',
  actionText: 'A life crossroads moment...',
  effect: 'crossroads',
  crossroadsIndex: i % LIFE_CROSSROADS.length,
}));