import { HeartCrackIcon, DollarSignIcon, SparklesIcon, FlameIcon, StarIcon, Wand2Icon, TrophyIcon, FlagIcon, SkullIcon, GraduationCapIcon, BookOpenIcon, ZapIcon } from 'lucide-react';

export const PLAYER_COLORS = {
  pink: 'bg-pink-500 shadow-pink-500/50',
  purple: 'bg-purple-500 shadow-purple-500/50',
  blue: 'bg-blue-500 shadow-blue-500/50',
  teal: 'bg-teal-500 shadow-teal-500/50',
  gold: 'bg-amber-400 shadow-amber-400/50',
  coral: 'bg-rose-400 shadow-rose-400/50'
};
export const PLAYER_BORDER = {
  pink: 'border-pink-400',
  purple: 'border-purple-400',
  blue: 'border-blue-400',
  teal: 'border-teal-400',
  gold: 'border-amber-300',
  coral: 'border-rose-300'
};
export const CATEGORY_STYLES = {
  start: { glow: 'shadow-[0_0_20px_rgba(255,255,255,0.8)]', border: 'border-white', bg: 'bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300', icon: FlagIcon },
  heartbreak: { glow: 'shadow-[0_0_15px_rgba(244,63,94,0.4)]', border: 'border-rose-300', bg: 'bg-rose-50', icon: HeartCrackIcon },
  money: { glow: 'shadow-[0_0_15px_rgba(251,191,36,0.4)]', border: 'border-amber-300', bg: 'bg-amber-50', icon: DollarSignIcon },
  glowup: { glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]', border: 'border-purple-300', bg: 'bg-purple-50', icon: SparklesIcon },
  chaos: { glow: 'shadow-[0_0_15px_rgba(249,115,22,0.4)]', border: 'border-orange-300', bg: 'bg-orange-50', icon: FlameIcon },
  blessing: { glow: 'shadow-[0_0_15px_rgba(20,184,166,0.4)]', border: 'border-teal-300', bg: 'bg-teal-50', icon: StarIcon },
  wildcard: { glow: 'shadow-[0_0_20px_rgba(236,72,153,0.5)]', border: 'border-pink-300', bg: 'bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50', icon: Wand2Icon },
  finish: { glow: 'shadow-[0_0_30px_rgba(251,191,36,0.6)]', border: 'border-amber-300', bg: 'bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-300', icon: TrophyIcon },
  tax: { glow: 'shadow-[0_0_20px_rgba(220,38,38,0.5)]', border: 'border-red-400', bg: 'bg-gradient-to-br from-red-50 via-red-50 to-orange-50', icon: SkullIcon },
  money_loss: { glow: 'shadow-[0_0_18px_rgba(239,68,68,0.45)]', border: 'border-red-300', bg: 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50', icon: DollarSignIcon }
};

export const LIFE_PATHS = [
  { name: 'College', emoji: '🎓', icon: GraduationCapIcon, color: 'from-violet-400 to-purple-500', glowColor: 'rgba(139,92,246,0.5)', textColor: 'text-violet-600', bgLight: 'bg-violet-50', borderColor: 'border-violet-300', summary: 'Structured start with stronger job access, plus debt and pressure risk.' },
  { name: 'High School Diploma / GED', emoji: '📚', icon: BookOpenIcon, color: 'from-pink-400 to-rose-500', glowColor: 'rgba(236,72,153,0.5)', textColor: 'text-pink-600', bgLight: 'bg-pink-50', borderColor: 'border-pink-300', summary: 'Balanced practical route with steadier footing and moderate risk.' },
  { name: 'Dropout', emoji: '⚡', icon: ZapIcon, color: 'from-orange-400 to-coral-500', glowColor: 'rgba(251,146,60,0.5)', textColor: 'text-orange-600', bgLight: 'bg-orange-50', borderColor: 'border-orange-300', summary: 'Rougher start with more chaos risk, but success stays possible.' },
];
export const EDUCATION_PATH_COUNT = LIFE_PATHS.length;

export const STARTING_MODIFIERS = [
  { title: 'Family safety net', emoji: '🛟', kind: 'advantage', description: 'A little support cushions the first few turns.', moneyDelta: 250, chaosDelta: -1 },
  { title: 'Reliable ride', emoji: '🚗', kind: 'advantage', description: 'Getting around is easier at the start.', moneyDelta: 150, chaosDelta: -1 },
  { title: 'Extra shift lined up', emoji: '💵', kind: 'advantage', description: 'You start with one small money boost.', moneyDelta: 100, chaosDelta: 0 },
  { title: 'Clean slate', emoji: '✨', kind: 'neutral', description: 'No bonus, no penalty. Play the hand from here.', moneyDelta: 0, chaosDelta: 0 },
  { title: 'Bills already due', emoji: '📬', kind: 'disadvantage', description: 'Life starts with pressure on your wallet.', moneyDelta: -150, chaosDelta: 1 },
  { title: 'Rough first month', emoji: '🌧️', kind: 'disadvantage', description: 'A messy start makes chaos more likely.', moneyDelta: -200, chaosDelta: 1 },
];

export const PATH_JOBS = {
  0: ['corporate-remote','nurse','engineer','accountant','marketing-mgr','hr-specialist','software-dev','project-mgr','teacher','office-mgr','financial-analyst','healthcare-admin','it-specialist'],
  1: ['call-center','retail-mgr','warehouse-supervisor','delivery-driver','admin-assistant','bank-teller','customer-service','security-guard','medical-assistant','receptionist','shift-supervisor','factory-worker'],
  2: ['fast-food','retail-associate','house-cleaner','dishwasher','stocker','day-labor','gas-station','lawn-care','warehouse-worker','babysitting','thrift-flipper'],
};

export const DEFAULT_PATH_TILE_ASSIGNMENTS = [
  [0,1,30,58,80,35,3,60,40,81,4,62,48,100,5,82,66,44,6,67,83,52,7,75,103,84,55,29],
  [0,59,31,85,9,36,61,41,86,12,63,49,102,68,87,45,14,69,88,53,15,76,103,89,56,29],
  [0,16,32,90,64,17,37,91,70,18,42,71,92,50,101,21,65,93,46,22,72,54,103,94,23,77,57,29],
];

export const CAREER_SWITCH_EVENTS = [
  { name: 'Took time off to figure things out 😬', amount: -300 },
  { name: 'Invested in new skills/courses 📚', amount: -400 },
  { name: 'Lost stable income during transition 💸', amount: -500 },
  { name: 'Bought equipment/supplies 🛠️', amount: -350 },
  { name: 'Took on debt to make the switch 💳', amount: -600 },
  { name: 'Income unstable for a while 😩', amount: -250 },
  { name: 'Started from scratch 😭', amount: -450 },
];

export const CHAOS_REALM_SCENES = [
  { title: 'Car dead in the storm', subtitle: 'The engine clicks once, then gives up. Rain hammers the windshield.', location: 'Flooded service road', leftNote: 'Your phone is at 3%. You need one smart move.', sceneAccent: '#f59e0b',
    choices: [
      { label: 'Check the car', description: 'Pop the hood and try to get it moving.', icon: '🔧', tone: 'caution', outcomeTitle: 'You bought yourself time', outcomeText: 'The fix barely holds, but you avoid a bigger tow bill.', moneyDelta: -75 },
      { label: 'Enter the gas station', description: 'Look for help, supplies, or a working phone.', icon: '⛽', tone: 'hope', outcomeTitle: 'A clerk helped you call a ride', outcomeText: 'It costs money, but you get out of the storm safely.', moneyDelta: -120, escape: true },
      { label: 'Take the alley', description: 'A shortcut might get you out faster.', icon: '🌆', tone: 'risk', outcomeTitle: 'The shortcut got expensive', outcomeText: 'You found the way out, but lost cash replacing what got ruined.', moneyDelta: -220 },
    ]
  },
  { title: 'Abandoned gas station', subtitle: 'The pumps are dead. A neon OPEN sign flickers like it is lying.', location: 'Last stop before downtown', leftNote: 'Every option could help. Every option could make it worse.', sceneAccent: '#a855f7',
    choices: [
      { label: 'Search the counter', description: 'Look for a charger, map, or emergency number.', icon: '🔦', tone: 'caution', outcomeTitle: 'You found a working charger', outcomeText: 'A little battery, a little clarity, and one way forward.', moneyDelta: 50 },
      { label: 'Ask the stranger outside', description: 'They know the area, but you do not know them.', icon: '🧥', tone: 'risk', outcomeTitle: 'Bad advice sent you in circles', outcomeText: 'You make it out, shaken and short on cash.', moneyDelta: -180, skipNextTurn: true },
      { label: 'Stay under the awning', description: 'Wait out the worst of the rain.', icon: '🌧️', tone: 'hope', outcomeTitle: 'The storm eased', outcomeText: 'You lost time, but avoided making a desperate choice.', moneyDelta: 0, escape: true },
    ]
  },
  { title: 'No safe route', subtitle: 'Sirens echo under the overpass. The city feels like it is watching.', location: 'Underpass by the tracks', leftNote: 'One more decision. Then the board pulls you back.', sceneAccent: '#22d3ee',
    choices: [
      { label: 'Call someone trusted', description: 'Swallow your pride and ask for help.', icon: '📱', tone: 'hope', outcomeTitle: 'Someone answered', outcomeText: 'Support arrived when you needed it most.', moneyDelta: 125, escape: true },
      { label: 'Sleep at the motel', description: 'Pay for one night and regroup.', icon: '🏚️', tone: 'caution', outcomeTitle: 'A rough reset', outcomeText: 'Not comfortable, not cheap, but safer than the street.', moneyDelta: -160, escape: true },
      { label: 'Keep walking', description: 'Push through and hope the city lets you pass.', icon: '🚶', tone: 'risk', outcomeTitle: 'You made it through exhausted', outcomeText: 'You escape, but the stress follows you into the next turn.', moneyDelta: -90, skipNextTurn: true, escape: true },
    ]
  },
];