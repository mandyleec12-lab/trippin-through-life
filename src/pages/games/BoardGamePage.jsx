import React, { useState, useEffect, useRef, createElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlitterHeart } from '../../components/GlitterHeart';
import { HeartCrackIcon, DollarSignIcon, SparklesIcon, FlameIcon, StarIcon, Wand2Icon, TrophyIcon, FlagIcon, Dice1Icon, Dice2Icon, Dice3Icon, Dice4Icon, Dice5Icon, Dice6Icon, DicesIcon, CameraIcon, SkullIcon, GraduationCapIcon, BookOpenIcon, ZapIcon } from 'lucide-react';
import { JourneyStartScene } from '../../components/games/JourneyStartScene';
import { CityBackdrop } from '../../components/games/CityBackdrop';
import { RoadView } from '../../components/games/RoadView';
// --- TYPES ---
type PlayerColor = 'pink' | 'purple' | 'blue' | 'teal' | 'gold' | 'coral';
interface Job {
  id: string;
  name: string;
  emoji: string;
  wage: number;
  wageDisplay?: string;
  taxType: 'W2' | '1099';
  taxRate: number;
  effectDescription: string;
  flavorText: string;
  tier: 'bad' | 'good';
}
interface StartingModifier {
  title: string;
  emoji: string;
  kind: 'advantage' | 'disadvantage' | 'neutral';
  description: string;
  moneyDelta: number;
  chaosDelta: number;
}
interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  position: number;
  skipNextTurn: boolean;
  avatar: string | null;
  job: Job | null;
  money: number;
  turnsPlayed: number;
  roundsWithoutIncome: number;
  evolved: boolean;
  pathIndex: number | null;
  inSchool: boolean;
  schoolTurnsLeft: number;
  studentLoanDebt: number;
  chaosTriggersRemaining: number;
  startingModifier: StartingModifier | null;
}
type Category = 'start' | 'heartbreak' | 'money' | 'glowup' | 'chaos' | 'blessing' | 'wildcard' | 'finish' | 'tax' | 'money_loss';
interface TileData {
  id: number;
  name: string;
  category: Category;
  actionText: string;
  effect: 'move' | 'skip' | 'roll_again' | 'none' | 'tax' | 'money_loss' | 'money_gain' | 'chaos_portal' | 'career_switch';
  effectValue?: number;
}
interface ChaosChoice {
  label: string;
  description: string;
  icon: string;
  tone: 'risk' | 'caution' | 'hope';
  outcomeTitle: string;
  outcomeText: string;
  moneyDelta: number;
  skipNextTurn?: boolean;
  escape?: boolean;
}
interface ChaosScene {
  title: string;
  subtitle: string;
  location: string;
  leftNote: string;
  sceneAccent: string;
  choices: ChaosChoice[];
}
type GamePhase = 'setup' | 'starting_deal' | 'journey_start' | 'playing' | 'tax_event' | 'chaos_realm' | 'career_switch' | 'winner';
const PAWN_STEP_DURATION_MS = 440;
const PAWN_LANDING_BUFFER_MS = 700;
const STARTING_HAND_RESHUFFLE_LIMIT = 2;

// --- CONSTANTS ---
const PLAYER_COLORS: Record<PlayerColor, string> = {
  pink: 'bg-pink-500 shadow-pink-500/50',
  purple: 'bg-purple-500 shadow-purple-500/50',
  blue: 'bg-blue-500 shadow-blue-500/50',
  teal: 'bg-teal-500 shadow-teal-500/50',
  gold: 'bg-amber-400 shadow-amber-400/50',
  coral: 'bg-rose-400 shadow-rose-400/50'
};
const PLAYER_BORDER: Record<PlayerColor, string> = {
  pink: 'border-pink-400',
  purple: 'border-purple-400',
  blue: 'border-blue-400',
  teal: 'border-teal-400',
  gold: 'border-amber-300',
  coral: 'border-rose-300'
};
const CATEGORY_STYLES: Record<Category, {
  glow: string;
  border: string;
  bg: string;
  icon: React.ElementType;
}> = {
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

// --- EDUCATION PATHS ---
const LIFE_PATHS = [{
  name: 'College', emoji: '🎓', icon: GraduationCapIcon,
  color: 'from-violet-400 to-purple-500', glowColor: 'rgba(139,92,246,0.5)',
  textColor: 'text-violet-600', bgLight: 'bg-violet-50', borderColor: 'border-violet-300',
  summary: 'Structured start with stronger job access, plus debt and pressure risk.'
}, {
  name: 'High School Diploma / GED', emoji: '📚', icon: BookOpenIcon,
  color: 'from-pink-400 to-rose-500', glowColor: 'rgba(236,72,153,0.5)',
  textColor: 'text-pink-600', bgLight: 'bg-pink-50', borderColor: 'border-pink-300',
  summary: 'Balanced practical route with steadier footing and moderate risk.'
}, {
  name: 'Dropout', emoji: '⚡', icon: ZapIcon,
  color: 'from-orange-400 to-coral-500', glowColor: 'rgba(251,146,60,0.5)',
  textColor: 'text-orange-600', bgLight: 'bg-orange-50', borderColor: 'border-orange-300',
  summary: 'Rougher start with more chaos risk, but success stays possible.'
}];
const EDUCATION_PATH_COUNT = LIFE_PATHS.length;

const STARTING_MODIFIERS: StartingModifier[] = [
  { title: 'Family safety net', emoji: '🛟', kind: 'advantage', description: 'A little support cushions the first few turns.', moneyDelta: 250, chaosDelta: -1 },
  { title: 'Reliable ride', emoji: '🚗', kind: 'advantage', description: 'Getting around is easier at the start.', moneyDelta: 150, chaosDelta: -1 },
  { title: 'Extra shift lined up', emoji: '💵', kind: 'advantage', description: 'You start with one small money boost.', moneyDelta: 100, chaosDelta: 0 },
  { title: 'Clean slate', emoji: '✨', kind: 'neutral', description: 'No bonus, no penalty. Play the hand from here.', moneyDelta: 0, chaosDelta: 0 },
  { title: 'Bills already due', emoji: '📬', kind: 'disadvantage', description: 'Life starts with pressure on your wallet.', moneyDelta: -150, chaosDelta: 1 },
  { title: 'Rough first month', emoji: '🌧️', kind: 'disadvantage', description: 'A messy start makes chaos more likely.', moneyDelta: -200, chaosDelta: 1 }
];

// --- JOBS ---
const ALL_JOBS: Job[] = [
  { id: 'corporate-remote', name: 'Corporate Remote Worker', emoji: '💻', wage: 32, taxType: 'W2', taxRate: 0.22, effectDescription: 'Stable income, occasional burnout', flavorText: 'Camera off, pants off, productivity off', tier: 'good' },
  { id: 'nurse', name: 'Nurse', emoji: '🏥', wage: 35, taxType: 'W2', taxRate: 0.22, effectDescription: 'Stable income, high stress', flavorText: 'Saving lives but cant save yourself', tier: 'good' },
  { id: 'engineer', name: 'Engineer', emoji: '🛠️', wage: 45, taxType: 'W2', taxRate: 0.22, effectDescription: 'High stable income', flavorText: 'Building things and burning out', tier: 'good' },
  { id: 'accountant', name: 'Accountant', emoji: '📊', wage: 30, taxType: 'W2', taxRate: 0.22, effectDescription: 'Stable income', flavorText: 'Numbers dont lie but your boss does', tier: 'good' },
  { id: 'marketing-mgr', name: 'Marketing Manager', emoji: '📣', wage: 34, taxType: 'W2', taxRate: 0.22, effectDescription: 'Stable income', flavorText: 'Making things go viral except your paycheck', tier: 'good' },
  { id: 'software-dev', name: 'Software Developer', emoji: '👨‍💻', wage: 48, taxType: 'W2', taxRate: 0.22, effectDescription: 'Highest stable income', flavorText: 'Debugging code and your life simultaneously', tier: 'good' },
  { id: 'teacher', name: 'Teacher', emoji: '🍎', wage: 27, taxType: 'W2', taxRate: 0.22, effectDescription: 'Stable but low income', flavorText: 'Teaching others what you barely survived', tier: 'good' },
  { id: 'financial-analyst', name: 'Financial Analyst', emoji: '💰', wage: 42, taxType: 'W2', taxRate: 0.22, effectDescription: 'High stable income', flavorText: 'Analyzing everyones money but yours', tier: 'good' },
  { id: 'call-center', name: 'Call Center Agent', emoji: '📞', wage: 18, taxType: 'W2', taxRate: 0.18, effectDescription: 'Moderate steady income', flavorText: 'Please hold while I hold back tears', tier: 'bad' },
  { id: 'retail-mgr', name: 'Retail Manager', emoji: '🛍️', wage: 22, taxType: 'W2', taxRate: 0.18, effectDescription: 'Moderate steady income', flavorText: 'The customer is NOT always right', tier: 'bad' },
  { id: 'warehouse-supervisor', name: 'Warehouse Supervisor', emoji: '📦', wage: 21, taxType: 'W2', taxRate: 0.18, effectDescription: 'Moderate steady income', flavorText: 'My back, my knees, my will to live', tier: 'bad' },
  { id: 'delivery-driver', name: 'Delivery Driver', emoji: '🚚', wage: 20, taxType: 'W2', taxRate: 0.18, effectDescription: 'Moderate steady income', flavorText: 'Your back hurts but the tips help', tier: 'bad' },
  { id: 'security-guard', name: 'Security Guard', emoji: '🛡️', wage: 19, taxType: 'W2', taxRate: 0.18, effectDescription: 'Moderate steady income', flavorText: 'Guarding everything except your peace', tier: 'bad' },
  { id: 'fast-food', name: 'Fast Food Worker', emoji: '🍔', wage: 15, taxType: 'W2', taxRate: 0.15, effectDescription: 'Low income, unstable', flavorText: 'Sir this is a Wendys', tier: 'bad' },
  { id: 'retail-associate', name: 'Retail Associate', emoji: '🛍️', wage: 15, taxType: 'W2', taxRate: 0.15, effectDescription: 'Low income, unstable', flavorText: 'Folding clothes that will be ruined in 5 mins', tier: 'bad' },
  { id: 'gig-driver', name: 'Gig Driver', emoji: '🚗', wage: 22, wageDisplay: '$8-$35/hr variable', taxType: '1099', taxRate: 0.35, effectDescription: 'Unpredictable income, chance for BIG BREAK 💥', flavorText: 'Made $100… kept $12 after gas and life choices', tier: 'good' },
  { id: 'house-cleaner', name: 'House Cleaner', emoji: '🧽', wage: 16, taxType: 'W2', taxRate: 0.15, effectDescription: 'Low income, physical work', flavorText: 'Found something weird under the bed...', tier: 'bad' },
  { id: 'dishwasher', name: 'Dishwasher', emoji: '🍽️', wage: 15, taxType: 'W2', taxRate: 0.15, effectDescription: 'Low income, physical work', flavorText: 'Scrubbing plates and scrubbing by', tier: 'bad' },
  { id: 'streamer', name: 'Streamer', emoji: '🎮', wage: 20, wageDisplay: '$0-$40/hr variable', taxType: '1099', taxRate: 0.35, effectDescription: 'Unpredictable income, chance for BIG BREAK 💥', flavorText: 'Going live to 2 people… but one viral moment changes everything', tier: 'good' },
  { id: 'content-creator', name: 'Content Creator', emoji: '📱', wage: 28, wageDisplay: '$5-$50/hr variable', taxType: '1099', taxRate: 0.35, effectDescription: 'Unpredictable income, chance for BIG BREAK 💥', flavorText: 'Dancing for pennies until the brand deal hits', tier: 'good' },
  { id: 'freelancer', name: 'Freelancer', emoji: '💻', wage: 40, wageDisplay: '$20-$60/hr variable', taxType: '1099', taxRate: 0.35, effectDescription: 'Unpredictable income, chance for BIG BREAK 💥', flavorText: 'Chasing invoices instead of dreams', tier: 'good' },
  { id: 'hair-stylist', name: 'Hair Stylist', emoji: '💇‍♀️', wage: 35, wageDisplay: '$20-$50/hr variable', taxType: '1099', taxRate: 0.35, effectDescription: 'Unpredictable income, chance for BIG BREAK 💥', flavorText: 'Part-time therapist, full-time artist', tier: 'good' },
  { id: 'personal-trainer', name: 'Personal Trainer', emoji: '🏋️‍♀️', wage: 43, wageDisplay: '$25-$60/hr variable', taxType: '1099', taxRate: 0.35, effectDescription: 'Unpredictable income, chance for BIG BREAK 💥', flavorText: 'Getting paid to yell at people', tier: 'good' }
];

// --- PATH-SPECIFIC JOB POOLS ---
const PATH_JOBS: Record<number, string[]> = {
  0: ['corporate-remote', 'nurse', 'engineer', 'accountant', 'marketing-mgr', 'software-dev', 'teacher', 'financial-analyst'],
  1: ['call-center', 'retail-mgr', 'warehouse-supervisor', 'delivery-driver', 'security-guard'],
  2: ['fast-food', 'retail-associate', 'gig-driver', 'house-cleaner', 'dishwasher']
};
const getJobsForPath = (pathIndex: number): Job[] => {
  const normalizedPath = Math.max(0, Math.min(EDUCATION_PATH_COUNT - 1, Math.floor(pathIndex)));
  const jobIds = PATH_JOBS[normalizedPath] || [];
  return ALL_JOBS.filter((j) => jobIds.includes(j.id));
};

// --- TILES ---
const TILES: TileData[] = [
  { id: 0, name: 'The Journey Begins', category: 'start', actionText: 'Ready to trip through life?', effect: 'none' },
  { id: 1, name: 'Your Ex Texted', category: 'heartbreak', actionText: 'Take a shot or skip a turn', effect: 'skip' },
  { id: 3, name: 'Car Broke Down', category: 'chaos', actionText: 'Move back 1 space', effect: 'move', effectValue: -1 },
  { id: 4, name: 'New Haircut, New You', category: 'glowup', actionText: 'Roll again!', effect: 'roll_again' },
  { id: 5, name: 'Found $20 in Old Jeans', category: 'blessing', actionText: 'Move ahead 1 space', effect: 'move', effectValue: 1 },
  { id: 6, name: 'Got Ghosted Again', category: 'heartbreak', actionText: 'Skip next turn', effect: 'skip' },
  { id: 7, name: 'WILD CARD', category: 'wildcard', actionText: 'Host picks your fate', effect: 'none' },
  { id: 9, name: 'Started Therapy', category: 'glowup', actionText: 'Move ahead 3 spaces', effect: 'move', effectValue: 3 },
  { id: 10, name: '💸 TAX SEASON', category: 'tax', actionText: 'The IRS has entered the chat. ALL players get taxed!', effect: 'tax' },
  { id: 11, name: 'Stranger Paid for Coffee', category: 'blessing', actionText: 'Move ahead 1 space', effect: 'move', effectValue: 1 },
  { id: 12, name: 'Caught Them Cheating', category: 'heartbreak', actionText: 'Move back 3 spaces', effect: 'move', effectValue: -3 },
  { id: 14, name: 'WILD CARD', category: 'wildcard', actionText: 'Swap places with any player', effect: 'none' },
  { id: 15, name: 'Gym Glow Up Era', category: 'glowup', actionText: 'Roll again!', effect: 'roll_again' },
  { id: 16, name: 'Identity Stolen', category: 'chaos', actionText: 'Move back 2 spaces', effect: 'move', effectValue: -2 },
  { id: 17, name: 'Dream Job Called Back', category: 'blessing', actionText: 'Move ahead 3 spaces', effect: 'move', effectValue: 3 },
  { id: 18, name: 'Toxic Friend Exposed', category: 'heartbreak', actionText: 'Skip a turn', effect: 'skip' },
  { id: 20, name: '💸 TAX SEASON', category: 'tax', actionText: 'Uncle Sam wants his cut. ALL players get taxed!', effect: 'tax' },
  { id: 21, name: 'WILD CARD', category: 'wildcard', actionText: 'Everyone moves back 1 except you', effect: 'none' },
  { id: 22, name: 'Apartment Flooded', category: 'chaos', actionText: 'Move back 2 spaces', effect: 'move', effectValue: -2 },
  { id: 23, name: 'Met Your Person', category: 'blessing', actionText: 'Move ahead 3 spaces', effect: 'move', effectValue: 3 },
  { id: 24, name: 'Wedding Called Off', category: 'heartbreak', actionText: 'Move back 3 spaces', effect: 'move', effectValue: -3 },
  { id: 26, name: 'Wrote Your First Book', category: 'glowup', actionText: 'Move ahead 2 spaces', effect: 'move', effectValue: 2 },
  { id: 27, name: 'Lost Your Keys... Again', category: 'chaos', actionText: 'Skip a turn', effect: 'skip' },
  { id: 28, name: '💸 TAX SEASON', category: 'tax', actionText: 'Final tax hit before the finish! ALL players get taxed!', effect: 'tax' },
  { id: 29, name: 'You Made It, Babe!', category: 'finish', actionText: 'Winner winner!', effect: 'none' },
  { id: 30, name: 'Rent Went Up 😬', category: 'money_loss', actionText: 'Rent went up this month...', effect: 'money_loss', effectValue: -150 },
  { id: 31, name: 'Utility Bill Shock ⚡', category: 'money_loss', actionText: 'Utility bill way higher than expected', effect: 'money_loss', effectValue: -100 },
  { id: 35, name: 'Gas Prices Spike ⛽', category: 'money_loss', actionText: 'Gas prices are insane right now', effect: 'money_loss', effectValue: -50 },
  { id: 36, name: 'Car Maintenance 🛠️', category: 'money_loss', actionText: 'Car needs maintenance... again', effect: 'money_loss', effectValue: -150 },
  { id: 37, name: 'Flat Tire 😭', category: 'money_loss', actionText: "Flat tire… and you're already late for work", effect: 'money_loss', effectValue: -100 },
  { id: 38, name: 'Speeding Ticket 🚓', category: 'money_loss', actionText: 'Caught going 15 over...', effect: 'money_loss', effectValue: -275 },
  { id: 40, name: 'Doctor Visit 🏥', category: 'money_loss', actionText: 'Doctor visit… not covered by insurance', effect: 'money_loss', effectValue: -700 },
  { id: 41, name: 'Prescription Cost 💊', category: 'money_loss', actionText: 'Prescription cost hits different', effect: 'money_loss', effectValue: -300 },
  { id: 42, name: 'Dental Expense 😬', category: 'money_loss', actionText: 'Unexpected dental expense', effect: 'money_loss', effectValue: -500 },
  { id: 43, name: 'Retail Therapy 🛍️', category: 'money_loss', actionText: 'Retail therapy got you again', effect: 'money_loss', effectValue: -450 },
  { id: 44, name: 'Impulse Buy 😅', category: 'money_loss', actionText: 'Impulse buy regret is real', effect: 'money_loss', effectValue: -200 },
  { id: 45, name: 'Ordered Food Again 🍔', category: 'money_loss', actionText: 'Ordered food instead of cooking', effect: 'money_loss', effectValue: -20 },
  { id: 46, name: 'Boredom Spending', category: 'money_loss', actionText: 'Spent money out of pure boredom', effect: 'money_loss', effectValue: -25 },
  { id: 48, name: 'Credit Card Interest 😩', category: 'money_loss', actionText: 'Credit card interest hit hard', effect: 'money_loss', effectValue: -28 },
  { id: 49, name: 'Mystery Bank Fee', category: 'money_loss', actionText: "Bank fee you didn't understand", effect: 'money_loss', effectValue: -30 },
  { id: 50, name: 'Double Charged 💀', category: 'money_loss', actionText: 'Payment processed twice!', effect: 'money_loss', effectValue: -150 },
  { id: 55, name: 'Parking Ticket 🅿️', category: 'money_loss', actionText: 'Forgot to feed the meter', effect: 'money_loss', effectValue: -75 },
  { id: 56, name: 'Phone Screen Cracked 📱', category: 'money_loss', actionText: 'Dropped your phone face down...', effect: 'money_loss', effectValue: -200 },
  { id: 57, name: 'Pet Vet Bill 🐾', category: 'money_loss', actionText: 'Your fur baby needed the vet', effect: 'money_loss', effectValue: -400 },
  { id: 58, name: 'Found Money in Your Pocket 😄', category: 'money', actionText: 'Check those pockets more often!', effect: 'money_gain', effectValue: 20 },
  { id: 59, name: 'Got Paid Back 💸', category: 'money', actionText: 'They actually remembered!', effect: 'money_gain', effectValue: 50 },
  { id: 60, name: 'Cashback Hit Your Account 💳', category: 'money', actionText: 'Free money is the best money', effect: 'money_gain', effectValue: 25 },
  { id: 61, name: "Didn't Order Food for Once 🍔", category: 'money', actionText: 'Your wallet thanks you', effect: 'money_gain', effectValue: 30 },
  { id: 62, name: 'Stuck to Your Budget 📊', category: 'money', actionText: 'Look at you being responsible!', effect: 'money_gain', effectValue: 75 },
  { id: 63, name: 'Split Bill Win 😌', category: 'money', actionText: 'Paid less than expected!', effect: 'money_gain', effectValue: 40 },
  { id: 64, name: 'Coupon Actually Worked 😭', category: 'money', actionText: 'Against all odds...', effect: 'money_gain', effectValue: 15 },
  { id: 65, name: 'Free Drink/Meal Hookup 🍹', category: 'money', actionText: 'Someone came through!', effect: 'money_gain', effectValue: 25 },
  { id: 66, name: 'Someone Covered You 🙌', category: 'money', actionText: 'Good people still exist', effect: 'money_gain', effectValue: 35 },
  { id: 67, name: 'Tax Refund Hit 🙌', category: 'money', actionText: 'Uncle Sam gave something back!', effect: 'money_gain', effectValue: 400 },
  { id: 68, name: 'Extra Hours Paid Off ⏰', category: 'money', actionText: 'That overtime was worth it', effect: 'money_gain', effectValue: 150 },
  { id: 69, name: "Sold Something You Didn't Need 📦", category: 'money', actionText: 'Declutter = profit', effect: 'money_gain', effectValue: 120 },
  { id: 70, name: 'Refund Finally Processed 😩', category: 'money', actionText: 'Only took 3 weeks...', effect: 'money_gain', effectValue: 200 },
  { id: 71, name: 'Random Discount at Checkout 🛍️', category: 'money', actionText: 'Price drop surprise!', effect: 'money_gain', effectValue: 100 },
  { id: 72, name: 'Side Money Came Through 💻', category: 'money', actionText: 'Hustle pays off sometimes', effect: 'money_gain', effectValue: 180 },
  { id: 73, name: 'Unexpected Cash Gift 🎁', category: 'money', actionText: 'Somebody loves you!', effect: 'money_gain', effectValue: 250 },
  { id: 75, name: 'Saved Way More Than Expected 😭', category: 'money', actionText: 'Accidentally responsible!', effect: 'money_gain', effectValue: 600 },
  { id: 76, name: 'Someone Came Through BIG 💖', category: 'money', actionText: 'Real ones show up when it matters', effect: 'money_gain', effectValue: 700 },
  { id: 77, name: 'Emergency Cost Less Than Expected 😮‍💨', category: 'money', actionText: "Could've been so much worse", effect: 'money_gain', effectValue: 550 },
  { id: 78, name: 'Covered Everything This Month 🙌', category: 'money', actionText: 'Bills paid, food bought, still breathing', effect: 'money_gain', effectValue: 500 },
  { id: 80, name: 'Student Loan Payment Hit 😭', category: 'money_loss', actionText: 'Sallie Mae never forgets...', effect: 'money_loss', effectValue: -300 },
  { id: 81, name: "Degree Didn't Match the Pay 😬", category: 'money_loss', actionText: '4 years for THIS salary?', effect: 'money_loss', effectValue: -200 },
  { id: 82, name: 'Burnout… Unpaid Time Off 😩', category: 'money_loss', actionText: 'Your body said no but bills said yes', effect: 'money_loss', effectValue: -250 },
  { id: 83, name: 'Job Relocation Cost You 💼', category: 'money_loss', actionText: 'New city, new expenses, same stress', effect: 'money_loss', effectValue: -400 },
  { id: 84, name: 'Office Politics Cost You 😒', category: 'money_loss', actionText: 'Someone else got YOUR opportunity', effect: 'money_loss', effectValue: -150 },
  { id: 85, name: 'Hours Cut This Week 😬', category: 'money_loss', actionText: 'Schedule changed without warning', effect: 'money_loss', effectValue: -200 },
  { id: 86, name: 'Missed Promotion 😒', category: 'money_loss', actionText: 'They gave it to someone else...', effect: 'money_loss', effectValue: -150 },
  { id: 87, name: 'Shift Cut Last Minute 😩', category: 'money_loss', actionText: 'Manager changed the schedule again', effect: 'money_loss', effectValue: -120 },
  { id: 88, name: 'Called Out Unpaid 😭', category: 'money_loss', actionText: "Burnout is real but bills don't care", effect: 'money_loss', effectValue: -180 },
  { id: 89, name: 'No Raise This Year 😤', category: 'money_loss', actionText: 'Job feels stuck… again', effect: 'money_loss', effectValue: -100 },
  { id: 90, name: 'Shift Got Canceled 😭', category: 'money_loss', actionText: 'Already got dressed for nothing', effect: 'money_loss', effectValue: -120 },
  { id: 91, name: 'Hours Cut Again 😬', category: 'money_loss', actionText: 'Boss keeps cutting your schedule', effect: 'money_loss', effectValue: -200 },
  { id: 92, name: 'Let Go Unexpectedly 💀', category: 'money_loss', actionText: 'No warning. No severance. Just gone.', effect: 'money_loss', effectValue: -300 },
  { id: 93, name: 'Missed Work… No Pay 😩', category: 'money_loss', actionText: "Life happened but the check didn't", effect: 'money_loss', effectValue: -150 },
  { id: 94, name: 'Transportation Issue 🚗', category: 'money_loss', actionText: "Couldn't get to work today", effect: 'money_loss', effectValue: -100 },
  { id: 100, name: 'Career Crossroads', category: 'wildcard', actionText: 'A life decision moment awaits', effect: 'none' },
  { id: 101, name: 'Street Hustle Pays Off', category: 'blessing', actionText: 'Move ahead 2 spaces', effect: 'move', effectValue: 2 },
  { id: 102, name: 'Promotion Time', category: 'glowup', actionText: 'Roll again!', effect: 'roll_again' },
  { id: 103, name: 'Life Crossroads', category: 'wildcard', actionText: 'A big life choice moment', effect: 'none' },
  { id: 104, name: 'Laundry Machine Ate Your Quarters', category: 'money_loss', actionText: 'And your clothes are still wet', effect: 'money_loss', effectValue: -15 },
  { id: 105, name: 'Friend Needed Emergency Cash', category: 'money_loss', actionText: 'You know you are never seeing this again', effect: 'money_loss', effectValue: -200 },
  { id: 114, name: 'Found a Side Gig 💪', category: 'money', actionText: 'Hustle paying off', effect: 'money_gain', effectValue: 300 },
  { id: 115, name: 'Got a Raise!', category: 'money', actionText: 'Finally some recognition', effect: 'money_gain', effectValue: 200 },
  { id: 116, name: 'Scratch Ticket Win 🎰', category: 'money', actionText: "Don't spend it all at once", effect: 'money_gain', effectValue: 150 },
  { id: 117, name: 'Birthday Money 🎂', category: 'money', actionText: 'Thanks Grandma!', effect: 'money_gain', effectValue: 100 },
  { id: 124, name: 'Best Friend Moved Away', category: 'heartbreak', actionText: 'Skip a turn to cry', effect: 'skip' },
  { id: 125, name: 'Got a Compliment From a Stranger', category: 'blessing', actionText: 'Move ahead 1 space', effect: 'move', effectValue: 1 },
  { id: 126, name: 'Therapy Breakthrough 🧠', category: 'glowup', actionText: 'Move ahead 2 spaces', effect: 'move', effectValue: 2 },
  { id: 127, name: 'Roommate Drama 😤', category: 'chaos', actionText: 'Move back 1 space', effect: 'move', effectValue: -1 },
  { id: 128, name: 'WILD CARD', category: 'wildcard', actionText: 'Truth or Dare', effect: 'none' },
  { id: 129, name: 'Started a Journal ✨', category: 'glowup', actionText: 'Roll again!', effect: 'roll_again' },
  { id: 130, name: 'Family Drama at Dinner', category: 'heartbreak', actionText: 'Skip a turn', effect: 'skip' },
  { id: 131, name: 'Random Act of Kindness', category: 'blessing', actionText: 'Move ahead 2 spaces', effect: 'move', effectValue: 2 },
  { id: 132, name: 'Phone Died at the Worst Time', category: 'chaos', actionText: 'Move back 1 space', effect: 'move', effectValue: -1 },
  { id: 133, name: 'WILD CARD', category: 'wildcard', actionText: 'Spin the Wheel', effect: 'none' }
];

const DEFAULT_PATH_TILE_ASSIGNMENTS = [
  [0, 1, 30, 58, 80, 35, 3, 60, 40, 81, 4, 62, 48, 100, 5, 82, 66, 44, 6, 67, 83, 52, 7, 75, 103, 84, 55, 29],
  [0, 59, 31, 85, 9, 36, 61, 41, 86, 12, 63, 49, 102, 68, 87, 45, 14, 69, 88, 53, 15, 76, 103, 89, 56, 29],
  [0, 16, 32, 90, 64, 17, 37, 91, 70, 18, 42, 71, 92, 50, 101, 21, 65, 93, 46, 22, 72, 54, 103, 94, 23, 77, 57, 29]
];

const getTileById = (id: number): TileData => TILES.find((t) => t.id === id) || TILES[0];

// --- CHAOS REALM ---
const CHAOS_REALM_SCENES: ChaosScene[] = [{
  title: 'Car dead in the storm', subtitle: 'The engine clicks once, then gives up. Rain hammers the windshield.',
  location: 'Flooded service road', leftNote: 'Your phone is at 3%. You need one smart move.', sceneAccent: '#f59e0b',
  choices: [
    { label: 'Check the car', description: 'Pop the hood and try to get it moving.', icon: '🔧', tone: 'caution', outcomeTitle: 'You bought yourself time', outcomeText: 'The fix barely holds, but you avoid a bigger tow bill.', moneyDelta: -75 },
    { label: 'Enter the gas station', description: 'Look for help, supplies, or a working phone.', icon: '⛽', tone: 'hope', outcomeTitle: 'A clerk helped you call a ride', outcomeText: 'It costs money, but you get out of the storm safely.', moneyDelta: -120, escape: true },
    { label: 'Take the alley', description: 'A shortcut might get you out faster.', icon: '🌆', tone: 'risk', outcomeTitle: 'The shortcut got expensive', outcomeText: 'You found the way out, but lost cash replacing what got ruined.', moneyDelta: -220 }
  ]
}, {
  title: 'Abandoned gas station', subtitle: 'The pumps are dead. A neon OPEN sign flickers like it is lying.',
  location: 'Last stop before downtown', leftNote: 'Every option could help. Every option could make it worse.', sceneAccent: '#a855f7',
  choices: [
    { label: 'Search the counter', description: 'Look for a charger, map, or emergency number.', icon: '🔦', tone: 'caution', outcomeTitle: 'You found a working charger', outcomeText: 'A little battery, a little clarity, and one way forward.', moneyDelta: 50 },
    { label: 'Ask the stranger outside', description: 'They know the area, but you do not know them.', icon: '🧥', tone: 'risk', outcomeTitle: 'Bad advice sent you in circles', outcomeText: 'You make it out, shaken and short on cash.', moneyDelta: -180, skipNextTurn: true },
    { label: 'Stay under the awning', description: 'Wait out the worst of the rain.', icon: '🌧️', tone: 'hope', outcomeTitle: 'The storm eased', outcomeText: 'You lost time, but avoided making a desperate choice.', moneyDelta: 0, escape: true }
  ]
}, {
  title: 'No safe route', subtitle: 'Sirens echo under the overpass. The city feels like it is watching.',
  location: 'Underpass by the tracks', leftNote: 'One more decision. Then the board pulls you back.', sceneAccent: '#22d3ee',
  choices: [
    { label: 'Call someone trusted', description: 'Swallow your pride and ask for help.', icon: '📱', tone: 'hope', outcomeTitle: 'Someone answered', outcomeText: 'Support arrived when you needed it most.', moneyDelta: 125, escape: true },
    { label: 'Sleep at the motel', description: 'Pay for one night and regroup.', icon: '🏚️', tone: 'caution', outcomeTitle: 'A rough reset', outcomeText: 'Not comfortable, not cheap, but safer than the street.', moneyDelta: -160, escape: true },
    { label: 'Keep walking', description: 'Push through and hope the city lets you pass.', icon: '🚶', tone: 'risk', outcomeTitle: 'You made it through exhausted', outcomeText: 'You escape, but the stress follows you into the next turn.', moneyDelta: -90, skipNextTurn: true, escape: true }
  ]
}];

const CAREER_SWITCH_EVENTS = [
  { name: 'Took time off to figure things out 😬', amount: -300 },
  { name: 'Invested in new skills/courses 📚', amount: -400 },
  { name: 'Lost stable income during transition 💸', amount: -500 },
  { name: 'Bought equipment/supplies 🛠️', amount: -350 },
  { name: 'Took on debt to make the switch 💳', amount: -600 }
];

const TRANSPORTATION_EVENTS = [
  { name: 'Low on gas… fill up ⛽', amount: -60, emoji: '⛽' },
  { name: 'Gas prices hit again 😒', amount: -80, emoji: '⛽' },
  { name: 'Oil change due 🛠️', amount: -75, emoji: '🛠️' },
  { name: 'Took an Uber… surge pricing 😭', amount: -45, emoji: '🚕' },
  { name: 'Late night ride cost more than expected 🚕', amount: -60, emoji: '🚕' },
  { name: 'Bus/train fare 🚌', amount: -10, emoji: '🚌' },
  { name: 'Car insurance went up 😤', amount: -90, emoji: '🚗' },
  { name: 'Parking garage fee 🅿️', amount: -35, emoji: '🅿️' },
  { name: 'Toll road surprise 💸', amount: -15, emoji: '🛣️' },
  { name: 'Had to jump start the car 🔋', amount: -50, emoji: '🔋' }
];

// 3D Dice helpers
const PIP_POSITIONS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]]
};

function DiceFace({ value, style }: { value: number; style: React.CSSProperties }) {
  const pips = PIP_POSITIONS[value] || [];
  return (
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-pink-50 to-purple-100 border-4 border-purple-300 shadow-[inset_0_0_20px_rgba(168,85,247,0.15)]" style={{ ...style, backfaceVisibility: 'hidden' }}>
      <div className="relative w-full h-full p-4">
        {pips.map(([row, col], i) => (
          <div key={i} className="absolute w-5 h-5 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" style={{ top: `${15 + row * 30}%`, left: `${15 + col * 30}%` }} />
        ))}
      </div>
    </div>
  );
}

function getDiceFaceRotation(value: number | null): { x: number; y: number } {
  switch (value) {
    case 1: return { x: 0, y: 0 };
    case 6: return { x: 0, y: 180 };
    case 2: return { x: 0, y: -90 };
    case 5: return { x: 0, y: 90 };
    case 3: return { x: -90, y: 0 };
    case 4: return { x: 90, y: 0 };
    default: return { x: 0, y: 0 };
  }
}

function FloatingParticles({ count = 30 }: { count?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: 2 + Math.random() * 4, height: 2 + Math.random() * 4, background: ['rgba(236,72,153,0.3)', 'rgba(168,85,247,0.3)', 'rgba(96,165,250,0.3)', 'rgba(251,191,36,0.3)', 'rgba(255,255,255,0.5)'][i % 5], left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -30 - Math.random() * 40, 0], x: [0, (Math.random() - 0.5) * 20, 0], opacity: [0.2, 0.6, 0.2], scale: [1, 1.3, 1] }}
          transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 5, ease: 'easeInOut' }} />
      ))}
    </div>
  );
}

function SparkleBurst({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <AnimatePresence>
      <div className="absolute inset-0 pointer-events-none z-10">
        {Array.from({ length: 40 }).map((_, i) => {
          const angle = i / 40 * Math.PI * 2;
          const distance = 80 + Math.random() * 120;
          return (
            <motion.div key={i} className="absolute left-1/2 top-1/2 rounded-full"
              style={{ width: 3 + Math.random() * 5, height: 3 + Math.random() * 5, background: ['#f9a8d4', '#c4b5fd', '#93c5fd', '#fcd34d', '#ffffff'][i % 5] }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance - 40, opacity: 0, scale: 0 }}
              transition={{ duration: 1.2 + Math.random() * 0.8, ease: 'easeOut' }} />
          );
        })}
      </div>
    </AnimatePresence>
  );
}

// --- MAIN COMPONENT ---
export function BoardGamePage() {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [dealRevealReady, setDealRevealReady] = useState(false);
  const [dealSequenceId, setDealSequenceId] = useState(0);
  const [startingHandReshuffles, setStartingHandReshuffles] = useState(0);
  const [activePathTiles, setActivePathTiles] = useState(DEFAULT_PATH_TILE_ASSIGNMENTS);
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Player 1', color: 'pink', position: 0, skipNextTurn: false, avatar: null, job: null, money: 0, turnsPlayed: 0, roundsWithoutIncome: 0, evolved: false, pathIndex: null, inSchool: false, schoolTurnsLeft: 0, studentLoanDebt: 0, chaosTriggersRemaining: 0, startingModifier: null },
    { id: '2', name: 'Player 2', color: 'purple', position: 0, skipNextTurn: false, avatar: null, job: null, money: 0, turnsPlayed: 0, roundsWithoutIncome: 0, evolved: false, pathIndex: null, inSchool: false, schoolTurnsLeft: 0, studentLoanDebt: 0, chaosTriggersRemaining: 0, startingModifier: null }
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isPawnAnimating, setIsPawnAnimating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [zoomedTile, setZoomedTile] = useState<number | null>(null);
  const [focusedPathIndex, setFocusedPathIndex] = useState<number | null>(null);
  const [isPawnMoving, setIsPawnMoving] = useState(false);
  const [taxResults, setTaxResults] = useState<Array<{ name: string; emoji: string; taxType: string; taxed: number; remaining: number }>>([]);
  const [jobEffectMessage, setJobEffectMessage] = useState<string | null>(null);
  const [incomeFlash, setIncomeFlash] = useState<string | null>(null);
  const [boardLanded, setBoardLanded] = useState(true);
  const [showBurst, setShowBurst] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const [realmEvents, setRealmEvents] = useState<Array<{ name: string; amount: number }>>([]);
  const [currentRealmEventIndex, setCurrentRealmEventIndex] = useState(0);
  const [realmTotalLoss, setRealmTotalLoss] = useState(0);
  const [pendingNewPath, setPendingNewPath] = useState<number | null>(null);
  const [chaosRealmScenes, setChaosRealmScenes] = useState<ChaosScene[]>([]);
  const [chaosSceneIndex, setChaosSceneIndex] = useState(0);
  const [selectedChaosChoice, setSelectedChaosChoice] = useState<ChaosChoice | null>(null);
  const [chaosOutcome, setChaosOutcome] = useState<ChaosChoice | null>(null);
  const [eliminatedPlayers, setEliminatedPlayers] = useState<string[]>([]);
  const [showChaosTransition, setShowChaosTransition] = useState(false);
  const [transportEvent, setTransportEvent] = useState<{ name: string; amount: number; emoji: string } | null>(null);

  const generateShuffledPaths = () => {
    const UNIVERSAL_NEGATIVE_IDS = [30, 31, 35, 36, 37, 38, 40, 41, 42, 43, 44, 45, 46, 48, 49, 50, 55, 56, 57, 104, 105];
    const UNIVERSAL_POSITIVE_IDS = [58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 75, 76, 77, 78, 114, 115, 116, 117];
    const LIFE_EVENT_IDS = [1, 3, 4, 5, 6, 7, 9, 11, 12, 14, 15, 16, 17, 18, 21, 22, 23, 24, 26, 27, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133];
    const PATH_SPECIFIC: Record<number, number[]> = { 0: [80, 81, 82, 83, 84], 1: [85, 86, 87, 88, 89], 2: [90, 91, 92, 93, 94] };
    const PATH_ANCHOR_TILES: Record<number, number> = { 0: 100, 1: 102, 2: 101 };
    const shuffle = (array: number[]) => [...array].sort(() => Math.random() - 0.5);
    let availableNeg = shuffle(UNIVERSAL_NEGATIVE_IDS);
    const availablePos = shuffle(UNIVERSAL_POSITIVE_IDS);
    const availableLife = shuffle(LIFE_EVENT_IDS);
    const newPaths = [];
    for (let i = 0; i < EDUCATION_PATH_COUNT; i++) {
      const negSubset = availableNeg.splice(0, 8);
      const posSubset = availablePos.splice(0, 6);
      const lifeSubset = availableLife.splice(0, 5);
      const middleTiles = shuffle([...negSubset, ...posSubset, ...lifeSubset, ...PATH_SPECIFIC[i], PATH_ANCHOR_TILES[i], 103]);
      newPaths.push([0, ...middleTiles, 29]);
    }
    setActivePathTiles(newPaths);
  };

  useEffect(() => {
    if (phase === 'playing' && !boardLanded) {
      setTimeout(() => { setBoardLanded(true); setShowBurst(true); setTimeout(() => setShowBurst(false), 2000); }, 300);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'starting_deal') return;
    const timer = setTimeout(() => setDealRevealReady(true), 1250);
    return () => clearTimeout(timer);
  }, [phase, dealSequenceId]);

  const addPlayer = () => {
    if (players.length >= 6) return;
    const colors: PlayerColor[] = ['pink', 'purple', 'blue', 'teal', 'gold', 'coral'];
    setPlayers([...players, { id: Date.now().toString(), name: `Player ${players.length + 1}`, color: colors[players.length % 6], position: 0, skipNextTurn: false, avatar: null, job: null, money: 0, turnsPlayed: 0, roundsWithoutIncome: 0, evolved: false, pathIndex: null, inSchool: false, schoolTurnsLeft: 0, studentLoanDebt: 0, chaosTriggersRemaining: 0, startingModifier: null }]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 2) return;
    setPlayers(players.filter((p) => p.id !== id));
  };

  const updatePlayer = (id: string, field: keyof Player, value: any) => {
    setPlayers(players.map((p) => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleAvatarUpload = (playerId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPlayers((prev) => prev.map((p) => p.id === playerId ? { ...p, avatar: e.target?.result as string } : p));
    };
    reader.readAsDataURL(file);
  };

  const assignStartingHands = () => {
    setDealRevealReady(false);
    setDealSequenceId((prev) => prev + 1);
    setFocusedPathIndex(null);
    setIsPawnMoving(false);
    generateShuffledPaths();
    const chaosLimits: Record<number, number> = { 0: 3, 1: 2, 2: 3 };
    setPlayers(players.map((p) => {
      const pathIndex = Math.floor(Math.random() * EDUCATION_PATH_COUNT);
      const jobs = getJobsForPath(pathIndex);
      const job = jobs[Math.floor(Math.random() * jobs.length)] ?? null;
      const startingModifier = STARTING_MODIFIERS[Math.floor(Math.random() * STARTING_MODIFIERS.length)];
      const isCollege = pathIndex === 0;
      const loanAmount = isCollege ? Math.floor(Math.random() * 2001) + 1000 : 0;
      const chaosTriggersRemaining = Math.max(0, (chaosLimits[pathIndex] ?? 2) + startingModifier.chaosDelta);
      return { ...p, position: 0, skipNextTurn: false, money: startingModifier.moneyDelta - loanAmount, turnsPlayed: 0, roundsWithoutIncome: 0, job, evolved: false, pathIndex, inSchool: false, schoolTurnsLeft: 0, studentLoanDebt: loanAmount, chaosTriggersRemaining, startingModifier };
    }));
    setPhase('starting_deal');
  };

  const dealStartingHands = () => { setStartingHandReshuffles(0); assignStartingHands(); };
  const reshuffleStartingHands = () => {
    if (startingHandReshuffles >= STARTING_HAND_RESHUFFLE_LIMIT) return;
    const confirmed = window.confirm('Are you sure? You could get something worse.');
    if (!confirmed) return;
    setStartingHandReshuffles((prev) => prev + 1);
    assignStartingHands();
  };

  const enterPlayingPhase = () => {
    setBoardLanded(true);
    setPhase('playing');
    setCurrentPlayerIndex(0);
    setDiceValue(null);
    setIsRolling(false);
    setIsPawnAnimating(false);
    setShowPopup(false);
    setZoomedTile(null);
    setFocusedPathIndex(null);
    setIsPawnMoving(false);
  };
  const startPlaying = enterPlayingPhase;
  const startActualPlaying = enterPlayingPhase;

  const earnIncome = (playerIndex: number): number => {
    const player = players[playerIndex];
    if (!player.job) return 0;
    return player.job.wage * 8;
  };

  const rollDice = () => {
    if (isRolling || isPawnMoving || showPopup || jobEffectMessage || transportEvent) return;
    const player = players[currentPlayerIndex];
    const isFirstMove = player.position === 0 && player.turnsPlayed === 0;
    if (!isFirstMove && Math.random() < 0.17) {
      const event = TRANSPORTATION_EVENTS[Math.floor(Math.random() * TRANSPORTATION_EVENTS.length)];
      setTransportEvent(event);
      setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? { ...p, money: p.money + event.amount } : p));
      return;
    }
    executeRoll();
  };

  const dismissTransportEvent = () => { setTransportEvent(null); executeRoll(); };

  const executeRoll = () => {
    const player = players[currentPlayerIndex];
    if (!player) return;
    setFocusedPathIndex(player.pathIndex !== null ? player.pathIndex : 0);
    const income = earnIncome(currentPlayerIndex);
    let loanPayment = 0;
    if (player.pathIndex === 0 && player.studentLoanDebt > 0 && Math.random() < 0.35) {
      loanPayment = -(Math.floor(Math.random() * 151) + 150);
    }
    const collegeBonusTriggered = player.pathIndex === 0 && Math.random() < 0.2;
    const collegeBonusAmount = collegeBonusTriggered ? Math.floor(Math.random() * 401) + 200 : 0;
    const totalGain = income + collegeBonusAmount + loanPayment;
    if (totalGain !== 0 || income > 0) {
      setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? { ...p, money: p.money + totalGain, turnsPlayed: p.turnsPlayed + 1 } : p));
      const flashParts: string[] = [];
      if (income > 0) flashParts.push(`+${income}`);
      if (collegeBonusTriggered) flashParts.push(`🎉 BONUS +${collegeBonusAmount}`);
      if (loanPayment < 0) flashParts.push(`💳 Loan ${loanPayment}`);
      setIncomeFlash(flashParts.join(' | '));
      setTimeout(() => setIncomeFlash(null), collegeBonusTriggered || loanPayment < 0 ? 2500 : 1500);
    } else {
      setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? { ...p, turnsPlayed: p.turnsPlayed + 1 } : p));
    }
    doNormalRoll();
  };

  const doNormalRoll = () => {
    setIsRolling(true);
    setDiceValue(null);
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(roll);
      setIsRolling(false);
      setTimeout(() => { setDiceValue(null); movePlayer(roll); }, 800);
    }, 900);
  };

  const movePlayer = (spaces: number) => {
    const player = players[currentPlayerIndex];
    if (!player) return;
    const pathIdx = player.pathIndex !== null ? player.pathIndex : 0;
    const pathLength = activePathTiles[pathIdx].length;
    let newPosIndex = player.position + spaces;
    if (newPosIndex >= pathLength) newPosIndex = pathLength - 1;
    if (newPosIndex < 0) newPosIndex = 0;
    const finalPos = newPosIndex;
    const spacesMoved = Math.abs(finalPos - player.position);
    const landingDelay = Math.max(PAWN_STEP_DURATION_MS + PAWN_LANDING_BUFFER_MS, spacesMoved * PAWN_STEP_DURATION_MS + PAWN_LANDING_BUFFER_MS);
    setFocusedPathIndex(pathIdx);
    setIsPawnMoving(true);
    setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? { ...p, position: finalPos } : p));
    setTimeout(() => {
      setIsPawnMoving(false);
      handleLandOnTile(finalPos, { ...player, position: finalPos });
    }, landingDelay);
  };

  const handleLandOnTile = (positionIndex: number, player: Player) => {
    const pathIdx = player.pathIndex !== null ? player.pathIndex : 0;
    const tileId = activePathTiles[pathIdx][positionIndex];
    const tile = getTileById(tileId);
    if (tile.effect === 'tax') {
      const results = players.map((p) => {
        if (!p.job) return { name: p.name, emoji: '❓', taxType: 'N/A', taxed: 0, remaining: p.money };
        const taxAmount = Math.floor(p.money * p.job.taxRate);
        return { name: p.name, emoji: p.job.emoji, taxType: p.job.taxType, taxed: taxAmount, remaining: p.money - taxAmount };
      });
      setTaxResults(results);
      setPlayers((prev) => prev.map((p, i) => ({ ...p, money: results[i].remaining })));
      setZoomedTile(tileId);
      setPhase('tax_event');
      return;
    }
    const isNormalTile = tile.category !== 'start' && tile.category !== 'finish' && tile.category !== 'tax' && tile.effect !== 'career_switch' && tile.effect !== 'chaos_portal';
    const currentPlayer = players[currentPlayerIndex];
    const hasTriggersLeft = currentPlayer && currentPlayer.chaosTriggersRemaining > 0;
    const randomChaosTrigger = isNormalTile && hasTriggersLeft && Math.random() < 0.1;
    if (tile.effect === 'chaos_portal' || randomChaosTrigger) {
      if (randomChaosTrigger) {
        setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? { ...p, chaosTriggersRemaining: p.chaosTriggersRemaining - 1 } : p));
      }
      const sceneCount = Math.floor(Math.random() * 3) + 1;
      const shuffledScenes = [...CHAOS_REALM_SCENES].sort(() => Math.random() - 0.5).slice(0, sceneCount);
      setChaosRealmScenes(shuffledScenes);
      setChaosSceneIndex(0);
      setSelectedChaosChoice(null);
      setChaosOutcome(null);
      setRealmTotalLoss(0);
      setShowChaosTransition(true);
      setPhase('chaos_realm');
      setZoomedTile(tileId);
      setTimeout(() => setShowChaosTransition(false), 2500);
      return;
    }
    if (tile.effect === 'career_switch') {
      const numEvents = Math.floor(Math.random() * 3) + 2;
      const shuffledEvents = [...CAREER_SWITCH_EVENTS].sort(() => Math.random() - 0.5).slice(0, numEvents);
      setRealmEvents(shuffledEvents);
      setCurrentRealmEventIndex(0);
      setRealmTotalLoss(0);
      setPendingNewPath(null);
      setPhase('career_switch');
      setZoomedTile(tileId);
      return;
    }
    setZoomedTile(tileId);
    setShowPopup(true);
    const pathLength = activePathTiles[pathIdx].length;
    if (positionIndex === pathLength - 1) {
      setTimeout(() => { setWinner(player); setPhase('winner'); }, 2000);
    }
  };

  const handleChaosChoice = (choice: ChaosChoice) => {
    if (selectedChaosChoice) return;
    setSelectedChaosChoice(choice);
    setChaosOutcome(choice);
    setRealmTotalLoss((prev) => prev + choice.moneyDelta);
    if (choice.skipNextTurn) {
      setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? { ...p, skipNextTurn: true } : p));
    }
  };

  const finishChaosRealm = () => {
    setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? { ...p, money: p.money + realmTotalLoss } : p));
    setPhase('playing');
    setZoomedTile(null);
    setSelectedChaosChoice(null);
    setChaosOutcome(null);
    setChaosRealmScenes([]);
    setChaosSceneIndex(0);
    advanceToNextPlayer();
  };

  const continueChaosRealm = () => {
    if (!chaosOutcome) return;
    const shouldExit = chaosOutcome.escape || chaosSceneIndex >= chaosRealmScenes.length - 1;
    if (shouldExit) { finishChaosRealm(); return; }
    setChaosSceneIndex((prev) => prev + 1);
    setSelectedChaosChoice(null);
    setChaosOutcome(null);
  };

  const advanceToNextPlayer = (customEliminated?: string[]) => {
    const eliminated = customEliminated || eliminatedPlayers;
    setCurrentPlayerIndex((prevIdx) => {
      let nextIdx = (prevIdx + 1) % players.length;
      while (eliminated.includes(players[nextIdx].id) && eliminated.length < players.length - 1) {
        nextIdx = (nextIdx + 1) % players.length;
      }
      return nextIdx;
    });
    setShowPopup(false);
    setZoomedTile(null);
    setFocusedPathIndex(null);
    setIsPawnMoving(false);
    setDiceValue(null);
    setIsRolling(false);
    setPhase('playing');
  };

  const handleCareerSwitchSelection = (pathIndex: number) => setPendingNewPath(pathIndex);

  const confirmCareerSwitch = () => {
    if (pendingNewPath === null) return;
    const newJobs = getJobsForPath(pendingNewPath);
    const randomJob = newJobs[Math.floor(Math.random() * newJobs.length)];
    setPlayers((prev) => prev.map((p, i) => {
      if (i === currentPlayerIndex) {
        const oldPathLength = activePathTiles[p.pathIndex || 0].length;
        const newPathLength = activePathTiles[pendingNewPath].length;
        const progress = p.position / Math.max(1, oldPathLength - 1);
        const newPos = Math.floor(progress * (newPathLength - 1));
        return { ...p, money: p.money + realmTotalLoss, pathIndex: pendingNewPath, job: randomJob, position: newPos };
      }
      return p;
    }));
    setPhase('playing');
    setZoomedTile(null);
    setFocusedPathIndex(null);
    setIsPawnMoving(false);
    advanceToNextPlayer();
  };

  const applyEffectAndNextTurn = () => {
    const tile = getTileById(zoomedTile || 0);
    let rollAgain = false;
    setPlayers((prev) => {
      return prev.map((p, i) => {
        if (i !== currentPlayerIndex) return p;
        const pathIdx = p.pathIndex !== null ? p.pathIndex : 0;
        const pathLength = activePathTiles[pathIdx].length;
        const updated = { ...p };
        if (tile.effect === 'move' && tile.effectValue) {
          let pos = updated.position + tile.effectValue;
          if (pos >= pathLength) pos = pathLength - 1;
          if (pos < 0) pos = 0;
          updated.position = pos;
        } else if (tile.effect === 'skip') {
          updated.skipNextTurn = true;
        } else if (tile.effect === 'roll_again') {
          rollAgain = true;
        } else if (tile.effect === 'money_loss' && tile.effectValue) {
          updated.money = p.money + tile.effectValue;
        } else if (tile.effect === 'money_gain' && tile.effectValue) {
          updated.money = p.money + tile.effectValue;
        }
        return updated;
      });
    });
    setShowPopup(false);
    setZoomedTile(null);
    setFocusedPathIndex(rollAgain ? players[currentPlayerIndex].pathIndex : null);
    setIsPawnMoving(false);
    setDiceValue(null);
    if (!rollAgain) advanceToNextPlayer();
  };

  const closeTaxEvent = () => {
    setPhase('playing');
    setTaxResults([]);
    setZoomedTile(null);
    advanceToNextPlayer();
  };

  useEffect(() => {
    if (phase === 'playing' && !showPopup && !isRolling && !isPawnMoving && !jobEffectMessage) {
      const cp = players[currentPlayerIndex];
      if (cp && cp.skipNextTurn && !eliminatedPlayers.includes(cp.id)) {
        setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? { ...p, skipNextTurn: false } : p));
        setTimeout(() => advanceToNextPlayer(), 1500);
      }
    }
  }, [currentPlayerIndex, phase, showPopup, isRolling, isPawnMoving, jobEffectMessage, eliminatedPlayers]);

  const DiceIcon = diceValue ? [Dice1Icon, Dice2Icon, Dice3Icon, Dice4Icon, Dice5Icon, Dice6Icon][diceValue - 1] : DicesIcon;
  const currentChaosScene = chaosRealmScenes[chaosSceneIndex] ?? CHAOS_REALM_SCENES[0];
  const chaosSceneCount = Math.max(1, chaosRealmScenes.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 overflow-hidden font-sans select-none">
      <FloatingParticles count={40} />

      {/* ========== SETUP ========== */}
      {phase === 'setup' && (
        <div className="absolute inset-0 z-10 overflow-y-auto" style={{background: 'linear-gradient(160deg, #7c3aed 0%, #9333ea 20%, #c026d3 42%, #ec4899 62%, #f97316 80%, #fbbf24 100%)'}}>
          {/* Background glow blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[10%] left-[5%] w-48 h-32 rounded-full opacity-30 blur-3xl" style={{background:'#a855f7'}} />
            <div className="absolute top-[5%] right-[10%] w-40 h-40 rounded-full opacity-25 blur-3xl" style={{background:'#f472b6'}} />
            <div className="absolute bottom-[20%] left-[8%] w-56 h-32 rounded-full opacity-20 blur-3xl" style={{background:'#818cf8'}} />
            <div className="absolute bottom-[10%] right-[5%] w-40 h-40 rounded-full opacity-25 blur-3xl" style={{background:'#fb923c'}} />
          </div>

          <div className="min-h-full flex flex-col items-center justify-start pt-4 pb-6 px-4">
            {/* TITLE */}
            <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="text-center mb-3 w-full">
              <motion.h1 animate={{y:[0,-4,0]}} transition={{duration:3,repeat:Infinity,ease:'easeInOut'}}
                style={{fontFamily:'"Dancing Script", cursive', lineHeight:1.05}}
                className="font-black drop-shadow-[0_6px_24px_rgba(0,0,0,0.45)] leading-none">
                <span className="block" style={{fontSize:'clamp(3rem,16vw,6rem)', color:'#fff', WebkitTextStroke:'2px #d946ef', textShadow:'0 0 30px rgba(236,72,153,0.8), 0 4px 0 rgba(0,0,0,0.3)'}}>Trippin'</span>
                <span className="block" style={{fontSize:'clamp(3rem,16vw,6rem)', color:'#f9a8d4', WebkitTextStroke:'2px #be185d', textShadow:'0 0 30px rgba(244,114,182,0.8), 0 4px 0 rgba(0,0,0,0.3)'}}>Through</span>
                <span className="block" style={{fontSize:'clamp(3rem,16vw,6rem)', color:'#93c5fd', WebkitTextStroke:'2px #1d4ed8', textShadow:'0 0 30px rgba(96,165,250,0.8), 0 4px 0 rgba(0,0,0,0.3)'}}>Life</span>
              </motion.h1>
              <p className="text-white font-bold text-sm mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                ➜ The chaotic game of glow-ups, breakdowns &amp; tax season. 💀 ←
              </p>
            </motion.div>

            {/* MAIN CARD */}
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15,duration:0.4}}
              className="w-full max-w-lg rounded-3xl border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden"
              style={{background:'rgba(255,255,255,0.18)', backdropFilter:'blur(20px)'}}>

              {/* PATH CARDS */}
              <div className="grid grid-cols-3 gap-2 p-3">
                {LIFE_PATHS.map((path, i) => (
                  <div key={i} className={`${path.bgLight} border-2 ${path.borderColor} rounded-2xl p-3 text-center`}>
                    <div className="text-3xl mb-1">{path.emoji}</div>
                    <p className={`text-[11px] font-black ${path.textColor} leading-tight`}>{path.name}</p>
                    <p className={`text-[9px] font-semibold ${path.textColor} opacity-60 mt-0.5 leading-tight`}>{path.summary.split(' ').slice(0,3).join(' ')}…</p>
                  </div>
                ))}
              </div>

              {/* LIFE DEALS YOUR HAND */}
              <div className="text-center py-1.5 border-t border-white/20">
                <p className="text-white font-black text-sm drop-shadow">➜ Life deals your hand. ←</p>
              </div>

              {/* PLAYER ROWS */}
              <div className="space-y-2 px-3 pb-2 pt-1">
                {players.map((player, index) => (
                  <motion.div key={player.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:index*0.06}}
                    className="flex items-center gap-3 rounded-2xl p-3 border border-white/30 shadow-md"
                    style={{background:'rgba(255,255,255,0.85)'}}>
                    <label className="relative cursor-pointer shrink-0">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleAvatarUpload(player.id, f);
                      }} />
                      {player.avatar
                        ? <div className={`w-12 h-12 rounded-full border-[3px] overflow-hidden shadow-lg ${PLAYER_BORDER[player.color]}`}>
                            <img src={player.avatar} alt="" className="w-full h-full object-cover" />
                          </div>
                        : <div className={`w-12 h-12 rounded-full ${PLAYER_COLORS[player.color]} shadow-lg flex items-center justify-center relative`}>
                            <CameraIcon className="w-5 h-5 text-white/90" />
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
                              <span className="text-[9px] font-black text-purple-500">+</span>
                            </div>
                          </div>}
                    </label>
                    <div className="flex-1 min-w-0">
                      <input type="text" value={player.name} onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                        className="bg-transparent font-black text-gray-900 text-base outline-none w-full" placeholder={`Player ${index + 1}`} />
                      <p className="text-[10px] text-gray-400 font-medium">Choose your color &amp; journey</p>
                    </div>
                    <div className="shrink-0 relative">
                      <select value={player.color} onChange={(e) => updatePlayer(player.id, 'color', e.target.value as PlayerColor)}
                        className="appearance-none bg-white border-2 border-purple-200 rounded-xl pl-3 pr-7 py-2 text-purple-700 font-black text-xs outline-none cursor-pointer shadow">
                        {(['pink','purple','blue','teal','gold','coral'] as PlayerColor[]).map((c) => (
                          <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>
                        ))}
                      </select>
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-400 text-xs pointer-events-none">▾</span>
                    </div>
                    {players.length > 2 && (
                      <button onClick={() => removePlayer(player.id)} className="text-rose-400 hover:text-rose-600 font-bold text-base shrink-0 w-5">✕</button>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* UPLOAD HINT */}
              <div className="mx-3 mb-3 rounded-xl border border-dashed border-white/50 py-2 text-center">
                <p className="text-white/90 text-xs font-semibold">☁️ Tap the circle to upload a profile pic!</p>
              </div>

              {/* BUTTONS */}
              <div className="flex items-center gap-2 px-3 pb-4">
                {players.length < 6 && (
                  <button onClick={addPlayer}
                    className="px-5 py-3 rounded-full font-bold text-sm border-2 border-white/60 text-white hover:bg-white/20 transition-colors whitespace-nowrap shadow"
                    style={{background:'rgba(255,255,255,0.15)'}}>
                    + Add Player
                  </button>
                )}
                <motion.button onClick={dealStartingHands} whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                  className="flex-1 py-4 rounded-full font-black text-white text-base uppercase tracking-wider shadow-[0_8px_30px_rgba(236,72,153,0.6)]"
                  style={{background:'linear-gradient(90deg,#ec4899,#a855f7,#6366f1)'}}>
                  DEAL STARTING HANDS 🃏
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* ========== STARTING DEAL ========== */}
      {phase === 'starting_deal' && (
        <div className="absolute inset-0 overflow-hidden bg-[#12091f] flex flex-col text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.35),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.24),transparent_34%),linear-gradient(135deg,#12091f_0%,#1b1230_52%,#231124_100%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <FloatingParticles count={24} />
          <div className="relative z-10 px-4 pt-8 pb-4 text-center shrink-0">
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.32em] text-pink-200/80">Opening Deal</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]">Life deals your hand.</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base font-semibold text-white/70">Education sets the starting position. Your decisions decide the story.</p>
          </div>
          {!dealRevealReady ? (
            <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-10">
              <div className="relative w-full max-w-xl min-h-[420px] flex flex-col items-center justify-center">
                <div className="absolute inset-0 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-md" />
                <div className="relative h-52 w-64 mb-8">
                  {[0,1,2,3,4].map((card) => (
                    <motion.div key={card} className="absolute left-1/2 top-1/2 h-40 w-28 rounded-2xl border border-white/20 bg-gradient-to-br from-violet-500/95 via-fuchsia-500/95 to-orange-400/95 shadow-2xl"
                      initial={{ x: '-50%', y: '-50%', rotate: (card - 2) * 8, scale: 0.92 }}
                      animate={{ x: ['-50%', `${-78 + card * 38}%`, '-50%'], y: ['-50%', `${-54 + Math.abs(card - 2) * 10}%`, '-50%'], rotate: [(card - 2) * 8, (card - 2) * 18, (card - 2) * 6], scale: [0.92, 1.02, 0.96] }}
                      transition={{ duration: 1.05, delay: card * 0.04, ease: [0.22, 1, 0.36, 1] }}>
                      <div className="absolute inset-2 rounded-xl border border-white/25" />
                      <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white/90">{card === 2 ? 'TTL' : '•'}</div>
                    </motion.div>
                  ))}
                </div>
                <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.28}} className="relative text-center">
                  <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">Shuffling paths, jobs, and first twists</p>
                  <div className="mt-4 flex justify-center gap-2">
                    {[0,1,2].map((dot) => (
                      <motion.span key={dot} className="h-2 w-2 rounded-full bg-pink-300"
                        animate={{opacity:[0.25,1,0.25], scale:[1,1.4,1]}}
                        transition={{duration:0.75, repeat:Infinity, delay:dot*0.15}} />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-8">
              <div className="mx-auto mb-5 flex max-w-4xl items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
                <p className="text-xs md:text-sm font-bold text-white/75">
                  {startingHandReshuffles >= STARTING_HAND_RESHUFFLE_LIMIT ? 'No reshuffles left. This starting hand is locked.' : `Review your starting hand. Reshuffles remaining: ${STARTING_HAND_RESHUFFLE_LIMIT - startingHandReshuffles}.`}
                </p>
              </div>
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {players.map((player, index) => {
                  const path = player.pathIndex !== null ? LIFE_PATHS[player.pathIndex] : LIFE_PATHS[0];
                  const modifier = player.startingModifier;
                  const modifierTone = modifier?.kind === 'advantage' ? 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100' : modifier?.kind === 'disadvantage' ? 'border-rose-300/40 bg-rose-300/10 text-rose-100' : 'border-violet-300/40 bg-violet-300/10 text-violet-100';
                  return (
                    <motion.div key={player.id} initial={{opacity:0,y:34,rotateX:-12,scale:0.96}} animate={{opacity:1,y:0,rotateX:0,scale:1}} transition={{delay:index*0.16,duration:0.42,ease:[0.22,1,0.36,1]}} className="overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/[0.075] shadow-[0_20px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                      <div className="relative p-5">
                        <div className="absolute inset-x-0 top-0 h-1" style={{background:`linear-gradient(90deg, transparent, ${path.glowColor}, transparent)`}} />
                        <div className="mb-5 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">Player {index + 1}</p>
                            <h2 className="text-2xl font-black text-white">{player.name}</h2>
                          </div>
                          {player.avatar
                            ? <img src={player.avatar} alt="" className="h-14 w-14 rounded-2xl object-cover border border-white/30 shadow-lg" />
                            : <div className={`h-14 w-14 rounded-2xl ${PLAYER_COLORS[player.color]} border border-white/30 flex items-center justify-center text-white text-xl font-black shadow-lg`}>{player.name.charAt(0).toUpperCase()}</div>}
                        </div>
                        <div className="space-y-2.5">
                          <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <div className="mb-2 flex items-center justify-between gap-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Education</p>
                              <span className="text-2xl">{path.emoji}</span>
                            </div>
                            <h3 className="text-xl font-black text-white">{path.name}</h3>
                            <p className="mt-1 text-xs font-semibold leading-snug text-white/60">{path.summary}</p>
                          </section>
                          <section className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-100/70">Starting income</p>
                            {player.job && (
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="text-3xl">{player.job.emoji}</span>
                                  <div className="min-w-0">
                                    <h3 className="truncate font-black text-white">{player.job.name}</h3>
                                    <p className="truncate text-xs font-semibold text-white/55">{player.job.flavorText}</p>
                                  </div>
                                </div>
                                <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-sm font-black text-emerald-100">{player.job.wageDisplay || `$${player.job.wage}/hr`}</span>
                              </div>
                            )}
                          </section>
                          {modifier && (
                            <section className={`${modifierTone} rounded-2xl border p-4`}>
                              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] opacity-70">First twist</p>
                              <div className="flex items-start gap-3">
                                <span className="text-3xl">{modifier.emoji}</span>
                                <div>
                                  <h3 className="font-black">{modifier.title}</h3>
                                  <p className="text-xs font-semibold opacity-70">{modifier.description}</p>
                                </div>
                              </div>
                            </section>
                          )}
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2">
                            <p className="text-[9px] font-black uppercase tracking-wider text-white/40">Cash</p>
                            <p className={`text-base font-black ${player.money < 0 ? 'text-rose-200' : 'text-emerald-200'}`}>${player.money}</p>
                          </div>
                          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2">
                            <p className="text-[9px] font-black uppercase tracking-wider text-white/40">Chaos</p>
                            <p className="text-base font-black text-violet-100">{player.chaosTriggersRemaining}</p>
                          </div>
                          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2">
                            <p className="text-[9px] font-black uppercase tracking-wider text-white/40">Start</p>
                            <p className="text-base font-black text-white">Tile 1</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:players.length*0.16+0.18}} className="max-w-3xl mx-auto mt-6 rounded-[1.75rem] border border-white/10 bg-white/[0.08] p-5 text-center shadow-xl backdrop-blur-xl">
                <p className="text-sm md:text-base font-semibold text-white/70 mb-4">Your first roll will zoom to your lane so the move is easy to follow.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {startingHandReshuffles < STARTING_HAND_RESHUFFLE_LIMIT && (
                    <button onClick={reshuffleStartingHands} className="px-6 py-3 rounded-full border border-white/15 bg-white/10 text-white/80 font-extrabold hover:bg-white/15 transition">
                      Reshuffle Hand ({STARTING_HAND_RESHUFFLE_LIMIT - startingHandReshuffles} left)
                    </button>
                  )}
                  <motion.button onClick={startPlaying} whileHover={{scale:1.04}} whileTap={{scale:0.98}} className="px-10 py-4 rounded-full bg-white text-[#26113c] font-black text-xl shadow-[0_12px_40px_rgba(255,255,255,0.22)]">
                    Take the First Roll
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* ========== JOURNEY START ========== */}
      {phase === 'journey_start' && <JourneyStartScene players={players} onStartPlaying={startActualPlaying} />}

      {/* ========== PLAYING ========== */}
      {phase === 'playing' && (
        <div className="absolute inset-0 flex flex-col">
          <div className="p-3 flex justify-between items-center bg-white/50 backdrop-blur-xl border-b border-white/60 z-20 shadow-[0_4px_20px_rgba(168,85,247,0.08)]">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500" style={{fontFamily:'"Dancing Script", cursive'}}>Trippin' Through Life</h1>
            <div className="flex items-center gap-2">
              {players[currentPlayerIndex].avatar && <img src={players[currentPlayerIndex].avatar!} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-white shadow" />}
              <div className={`px-3 py-1 rounded-full text-white font-bold text-xs shadow-lg ${PLAYER_COLORS[players[currentPlayerIndex].color]}`}>{players[currentPlayerIndex].name}</div>
              {players[currentPlayerIndex].job && <span className="text-sm">{players[currentPlayerIndex].job!.emoji}</span>}
              {players[currentPlayerIndex].pathIndex === 0 && players[currentPlayerIndex].studentLoanDebt > 0 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">💳 Loans</span>}
              <span className={`font-bold text-sm ${players[currentPlayerIndex].money < 0 ? 'text-red-500' : 'text-emerald-600'}`}>${players[currentPlayerIndex].money}</span>
            </div>
          </div>
          <AnimatePresence>
            {jobEffectMessage && (
              <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur-2xl px-6 py-3 rounded-2xl shadow-[0_8px_30px_rgba(168,85,247,0.15)] border border-purple-200/50 text-center max-w-md">
                <p className="font-bold text-gray-800 text-lg">{jobEffectMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {incomeFlash && (
              <motion.div initial={{opacity:0,y:20,scale:0.8}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-30}} className="absolute top-16 right-4 z-40 bg-emerald-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-[0_4px_20px_rgba(16,185,129,0.4)]">
                {incomeFlash}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex-1 relative overflow-hidden" style={{perspective:'1200px'}} ref={boardRef}>
            <CityBackdrop imageUrl="/ChatGPT_Image_May_6,_2026,_02_47_41_PM.png" />
            <FloatingParticles count={40} />
            <SparkleBurst active={showBurst} />
            <RoadView paths={LIFE_PATHS} activePathTiles={activePathTiles} players={players} currentPlayerIndex={currentPlayerIndex} focusedPathIndex={focusedPathIndex} getTileById={getTileById} categoryStyles={CATEGORY_STYLES} playerColors={PLAYER_COLORS} />
            <AnimatePresence>
              {(isRolling || diceValue !== null) && (
                <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[100]" style={{perspective:'1400px'}} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <motion.div className="absolute bg-black/30 rounded-full blur-xl" style={{width:130,height:30,marginTop:100}}
                    initial={{scale:0.3,opacity:0}}
                    animate={isRolling ? {scale:[0.3,0.4,0.6,0.5,0.9,0.8,1],opacity:[0,0.2,0.4,0.3,0.7,0.6,0.8]} : {scale:1,opacity:0.6}}
                    transition={{duration:isRolling?1.8:0.4,times:isRolling?[0,0.15,0.35,0.55,0.75,0.9,1]:undefined}} />
                  <motion.div className="relative" style={{width:128,height:128,transformStyle:'preserve-3d'}}
                    initial={{x:-600,y:-400,scale:0.6,rotateX:0,rotateY:0,rotateZ:-45}}
                    animate={isRolling ? {x:[-600,-200,100,-50,30,-10,0],y:[-400,-250,-350,60,-40,20,0],scale:[0.6,0.85,1.15,1.05,1.1,1,1],rotateX:[0,540,1080,1620,1980,2160,getDiceFaceRotation(diceValue).x],rotateY:[0,720,1260,1800,2160,2340,getDiceFaceRotation(diceValue).y],rotateZ:[-45,360,720,1080,1260,1380,0]} : {x:0,y:0,scale:1,rotateX:getDiceFaceRotation(diceValue).x,rotateY:getDiceFaceRotation(diceValue).y,rotateZ:0}}
                    transition={{duration:isRolling?1.8:0.4,ease:isRolling?[0.34,1.56,0.64,1]:[0.16,1,0.3,1],times:isRolling?[0,0.2,0.4,0.6,0.75,0.9,1]:undefined}}>
                    <DiceFace value={1} style={{transform:'translateZ(64px)'}} />
                    <DiceFace value={6} style={{transform:'rotateY(180deg) translateZ(64px)'}} />
                    <DiceFace value={2} style={{transform:'rotateY(90deg) translateZ(64px)'}} />
                    <DiceFace value={5} style={{transform:'rotateY(-90deg) translateZ(64px)'}} />
                    <DiceFace value={3} style={{transform:'rotateX(90deg) translateZ(64px)'}} />
                    <DiceFace value={4} style={{transform:'rotateX(-90deg) translateZ(64px)'}} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {showPopup && zoomedTile !== null && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 flex items-center justify-center z-50 p-4 bg-black/20 backdrop-blur-sm">
                  <motion.div initial={{scale:0.7,y:30}} animate={{scale:1,y:0}} exit={{scale:0.7,y:30}} transition={{type:'spring',stiffness:100,damping:18}}
                    className={`bg-white/90 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-4 ${CATEGORY_STYLES[getTileById(zoomedTile).category].border} max-w-md w-full text-center`}>
                    {createElement(CATEGORY_STYLES[getTileById(zoomedTile).category].icon, { className: `w-16 h-16 mx-auto mb-3 ${getTileById(zoomedTile).category === 'money_loss' ? 'text-red-500 opacity-90' : getTileById(zoomedTile).effect === 'money_gain' ? 'text-emerald-500 opacity-90' : 'opacity-70'}` })}
                    <div className={`inline-block px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-3 ${getTileById(zoomedTile).category === 'money_loss' ? 'bg-red-100 text-red-600' : getTileById(zoomedTile).effect === 'money_gain' ? 'bg-emerald-100 text-emerald-600' : 'bg-black/5 text-black/50'}`}>
                      {getTileById(zoomedTile).category === 'money_loss' ? '💸 money hit' : getTileById(zoomedTile).effect === 'money_gain' ? '💰 money win' : getTileById(zoomedTile).category}
                    </div>
                    <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${getTileById(zoomedTile).category === 'money_loss' ? 'text-red-700' : getTileById(zoomedTile).effect === 'money_gain' ? 'text-emerald-700' : 'text-gray-800'}`}>{getTileById(zoomedTile).name}</h2>
                    <p className="text-lg font-bold text-gray-500 mb-2">{getTileById(zoomedTile).actionText}</p>
                    {getTileById(zoomedTile).effect === 'money_loss' && getTileById(zoomedTile).effectValue && (
                      <motion.div initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1,x:[0,-4,4,-4,4,0]}} transition={{duration:0.5}} className="text-3xl font-bold text-red-600 mb-4 py-2 px-4 bg-red-50 rounded-2xl border-2 border-red-200 inline-block">
                        -${Math.abs(getTileById(zoomedTile).effectValue!)}
                      </motion.div>
                    )}
                    {getTileById(zoomedTile).effect === 'money_gain' && getTileById(zoomedTile).effectValue && (
                      <motion.div initial={{scale:0.5,opacity:0}} animate={{scale:[1,1.15,1],opacity:1}} transition={{duration:0.5,ease:'easeOut'}} className="text-3xl font-bold text-emerald-600 mb-4 py-2 px-4 bg-emerald-50 rounded-2xl border-2 border-emerald-200 inline-block">
                        +${getTileById(zoomedTile).effectValue}
                      </motion.div>
                    )}
                    {getTileById(zoomedTile).effect !== 'money_loss' && getTileById(zoomedTile).effect !== 'money_gain' && <div className="mb-4" />}
                    <motion.button onClick={applyEffectAndNextTurn} whileHover={{scale:1.03}} whileTap={{scale:0.98}} className="w-full py-3 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold text-lg shadow-lg">
                      {zoomedTile === 29 ? 'Claim Victory!' : 'Next Player'}
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {transportEvent && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm">
                <motion.div initial={{scale:0.6,y:40}} animate={{scale:1,y:0}} exit={{scale:0.6,y:40,opacity:0}} transition={{type:'spring',stiffness:120,damping:16}} className="bg-white/95 backdrop-blur-2xl p-7 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border-2 border-orange-200 max-w-sm w-full text-center">
                  <motion.div initial={{scale:0}} animate={{scale:1,rotate:[0,-10,10,-5,0]}} transition={{duration:0.5,delay:0.1}} className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4 border-2 border-orange-200">
                    <span className="text-3xl">{transportEvent.emoji}</span>
                  </motion.div>
                  <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-bold text-xs uppercase tracking-wider mb-3">🚗 Transportation</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{transportEvent.name}</h3>
                  <motion.div initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1,x:[0,-3,3,-3,0]}} transition={{duration:0.4,delay:0.2}} className="text-2xl font-bold text-orange-600 mb-5 py-2 px-4 bg-orange-50 rounded-2xl border-2 border-orange-200 inline-block">
                    -${Math.abs(transportEvent.amount)}
                  </motion.div>
                  <p className="text-gray-400 text-sm font-medium mb-5">Life just charged you again 😒</p>
                  <motion.button onClick={dismissTransportEvent} whileHover={{scale:1.03}} whileTap={{scale:0.98}} className="w-full py-3 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 text-white font-bold text-base shadow-lg shadow-orange-400/20">
                    Ugh, fine 😒
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="bg-white/60 backdrop-blur-2xl border-t border-white/70 p-3 md:p-4 z-20 shadow-[0_-10px_40px_rgba(168,85,247,0.06)]">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap justify-center gap-2 flex-1">
                {players.map((player, i) => {
                  const isEliminated = eliminatedPlayers.includes(player.id);
                  return (
                    <motion.div key={player.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}} className={`flex items-center gap-2 ${isEliminated ? 'opacity-40 grayscale' : ''}`}>
                      <div className={`w-6 h-6 rounded-full ${isEliminated ? 'bg-gray-400' : PLAYER_COLORS[player.color]} flex items-center justify-center text-white font-bold text-xs`}>
                        {isEliminated ? '💀' : player.name.charAt(0)}
                      </div>
                      <span className={`text-sm font-bold ${isEliminated ? 'text-gray-500 line-through' : player.money < 0 ? 'text-red-500' : 'text-emerald-600'}`}>${player.money}</span>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 min-h-[44px]">
                <AnimatePresence>
                  {!isRolling && !isPawnMoving && !showPopup && (
                    <motion.button key="roll-dice-btn" onClick={rollDice} initial={{opacity:0,scale:0.85}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.85}} transition={{duration:0.25,ease:[0.22,1,0.36,1]}} whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="px-6 py-3 rounded-full font-black text-sm transition-colors shadow-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-pink-500/50">
                      {players[currentPlayerIndex].position === 0 && players[currentPlayerIndex].turnsPlayed === 0 ? '🎲 Roll First Move' : '🎲 Roll Dice'}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== CHAOS REALM ========== */}
      {phase === 'chaos_realm' && (
        <div className="absolute inset-0 bg-gradient-to-b from-red-950 via-black to-red-950 flex flex-col overflow-hidden z-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(127,29,29,0.36),transparent_34%),linear-gradient(180deg,rgba(8,10,24,0.96)_0%,rgba(15,5,12,0.95)_45%,rgba(5,5,8,1)_100%)]" />
            <motion.div className="absolute inset-x-0 top-0 h-44 bg-slate-950/80 blur-sm" animate={{opacity:[0.7,0.95,0.72]}} transition={{duration:3.2,repeat:Infinity,ease:'easeInOut'}} />
            {[0,1,2].map((bolt) => (
              <motion.div key={`lightning-${bolt}`} className="absolute top-0 h-48 w-px bg-red-100"
                style={{left:`${24+bolt*24}%`,boxShadow:'0 0 24px rgba(248,113,113,0.95), 0 0 70px rgba(239,68,68,0.6)',transform:`skewX(${bolt%2===0?-18:14}deg)`}}
                animate={{opacity:[0,0,1,0]}} transition={{duration:2.8+bolt*0.5,repeat:Infinity,delay:bolt*0.85,times:[0,0.72,0.76,0.82]}} />
            ))}
            {Array.from({length:34}).map((_,rain) => (
              <motion.span key={`chaos-rain-${rain}`} className="absolute top-[-12%] h-16 w-px rounded-full bg-sky-200/40"
                style={{left:`${rain/34*100}%`}}
                animate={{y:['0vh','118vh'],opacity:[0,0.8,0]}} transition={{duration:0.9+rain%5*0.08,repeat:Infinity,delay:rain*0.035,ease:'linear'}} />
            ))}
          </div>
          <FloatingParticles count={60} />
          <AnimatePresence>
            {showChaosTransition && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.5}} className="absolute inset-0 z-50 flex items-center justify-center bg-black">
                <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:0.3,duration:0.8}} className="text-center">
                  <motion.div animate={{y:[0,-10,0]}} transition={{repeat:Infinity,duration:2}} className="text-8xl mb-6">🔥</motion.div>
                  <h1 className="text-4xl md:text-6xl font-bold text-red-600 tracking-widest uppercase" style={{textShadow:'0 0 30px rgba(220,38,38,0.8)'}}>Entering the<br />Chaos Realm</h1>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="relative z-30 flex min-h-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-4 p-5">
              <div className="max-w-xs">
                <h2 className="text-4xl font-black uppercase tracking-tight text-purple-300 drop-shadow-[0_0_24px_rgba(168,85,247,0.8)] md:text-6xl" style={{fontFamily:'"Dancing Script", cursive'}}>Chaos Realm</h2>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-purple-200/70">Choose wisely</p>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-white/70">{currentChaosScene.leftNote}</p>
              </div>
              <div className="rounded-2xl border border-red-400/30 bg-black/55 px-4 py-3 text-right backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-200/65">Scene {chaosSceneIndex+1} / {chaosSceneCount}</p>
                <p className="mt-1 text-sm font-black text-red-100">Impact: {realmTotalLoss>=0?'+':'-'}${Math.abs(realmTotalLoss)}</p>
              </div>
            </div>
            <div className="relative flex-1 overflow-hidden px-5 pb-4">
              <motion.div key={currentChaosScene.title} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} className="absolute left-1/2 top-[14%] w-[min(640px,76vw)] -translate-x-1/2 rounded-[2rem] border border-white/12 bg-black/35 p-5 text-center shadow-[0_22px_80px_rgba(0,0,0,0.45)] backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-[0.32em]" style={{color:currentChaosScene.sceneAccent}}>{currentChaosScene.location}</p>
                <h3 className="mt-2 text-3xl font-black text-white md:text-5xl">{currentChaosScene.title}</h3>
                <p className="mx-auto mt-3 max-w-lg text-sm font-semibold text-white/70">{currentChaosScene.subtitle}</p>
              </motion.div>
            </div>
            <div className="relative z-40 border-t border-white/10 bg-black/60 px-4 py-4 backdrop-blur-xl">
              {!chaosOutcome ? (
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-3">
                  {currentChaosScene.choices.map((choice) => (
                    <motion.button key={choice.label} onClick={() => handleChaosChoice(choice)} whileHover={{y:-4,scale:1.02}} whileTap={{scale:0.98}}
                      className={`rounded-2xl border p-4 text-left transition ${choice.tone==='risk'?'border-cyan-400/35 bg-cyan-950/35 hover:bg-cyan-900/45':choice.tone==='hope'?'border-purple-400/35 bg-purple-950/35 hover:bg-purple-900/45':'border-amber-300/35 bg-amber-950/30 hover:bg-amber-900/40'}`}>
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-black/40 text-2xl">{choice.icon}</span>
                        <div>
                          <h4 className="font-black uppercase tracking-wide text-white">{choice.label}</h4>
                          <p className="mt-1 text-xs font-semibold text-white/60">{choice.description}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/45">Choose this</p>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} className="mx-auto flex max-w-4xl flex-col items-center gap-4 rounded-[1.75rem] border border-white/12 bg-black/70 p-5 text-center shadow-[0_18px_60px_rgba(0,0,0,0.5)] md:flex-row md:text-left">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-3xl">{chaosOutcome.icon}</div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-purple-200/70">Hidden consequence revealed</p>
                    <h4 className="mt-1 text-2xl font-black text-white">{chaosOutcome.outcomeTitle}</h4>
                    <p className="mt-1 text-sm font-semibold text-white/70">{chaosOutcome.outcomeText}</p>
                    <p className={`mt-2 text-sm font-black ${chaosOutcome.moneyDelta>=0?'text-emerald-300':'text-red-300'}`}>
                      {chaosOutcome.moneyDelta>=0?'+':'-'}${Math.abs(chaosOutcome.moneyDelta)}{chaosOutcome.skipNextTurn?' · next turn starts shaken':''}
                    </p>
                  </div>
                  <button onClick={continueChaosRealm} className="rounded-full bg-white px-7 py-3 font-black text-slate-950 shadow-[0_0_24px_rgba(255,255,255,0.22)]">
                    {chaosOutcome.escape||chaosSceneIndex>=chaosRealmScenes.length-1?'Return to the Board':'Keep Moving'}
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========== CAREER SWITCH ========== */}
      {phase === 'career_switch' && (
        <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
          <motion.div initial={{opacity:0,scale:0.9,y:30}} animate={{opacity:1,scale:1,y:0}} transition={{type:'spring',stiffness:80,damping:20}} className="bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-[0_20px_80px_rgba(168,85,247,0.15)] border border-white/80 max-w-3xl w-full text-center relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2" style={{fontFamily:'"Dancing Script", cursive'}}>Career Switch</h2>
            <p className="text-purple-400 font-bold mb-8">You're switching careers! Choose a new education lane...</p>
            <div className="space-y-4">
              {realmEvents.map((event, idx) => (
                <motion.div key={idx} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:idx*0.1}} className="p-4 rounded-2xl border-2 bg-yellow-50 border-yellow-200">
                  <div className="flex items-center gap-2 mb-2"><span className="text-2xl">💼</span><span className="font-bold text-gray-800">{event.name}</span></div>
                  <p className="text-sm text-gray-500">You lost <span className="font-bold text-red-600">${Math.abs(event.amount)}</span></p>
                </motion.div>
              ))}
            </div>
            <div className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {LIFE_PATHS.map((path, i) => {
                  const pathJobs = getJobsForPath(i).slice(0, 3);
                  return (
                    <motion.button key={i} onClick={() => handleCareerSwitchSelection(i)} whileHover={{scale:1.05}} whileTap={{scale:0.98}}
                      className={`p-4 rounded-2xl border-2 ${pendingNewPath===i?'bg-gradient-to-r from-amber-400 to-orange-500 text-white':'bg-white/80 border-gray-200'} text-center`}>
                      <div className="flex items-center justify-center mb-2"><span className="text-2xl">{path.emoji}</span></div>
                      <p className="font-bold text-lg">{path.name}</p>
                      <p className="text-sm text-gray-500">{pathJobs.map((job) => <span key={job.id} className="inline-block mr-1">{job.emoji} {job.name}</span>)}</p>
                    </motion.button>
                  );
                })}
              </div>
              <motion.button onClick={confirmCareerSwitch} whileHover={{scale:1.05}} whileTap={{scale:0.98}} className="mt-4 px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-lg shadow-lg">
                Confirm Switch
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========== TAX EVENT ========== */}
      {phase === 'tax_event' && (
        <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
          <motion.div initial={{opacity:0,scale:0.9,y:30}} animate={{opacity:1,scale:1,y:0}} transition={{type:'spring',stiffness:80,damping:20}} className="bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-[0_20px_80px_rgba(168,85,247,0.15)] border border-white/80 max-w-3xl w-full text-center relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2" style={{fontFamily:'"Dancing Script", cursive'}}>Tax Season</h2>
            <p className="text-purple-400 font-bold mb-8">All players get taxed! How much will you have left?</p>
            <div className="space-y-4">
              {taxResults.map((result, idx) => (
                <motion.div key={idx} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:idx*0.1}} className="p-4 rounded-2xl border-2 bg-red-50 border-red-200">
                  <div className="flex items-center gap-2 mb-2"><span className="text-2xl">💸</span><span className="font-bold text-gray-800">{result.name}</span></div>
                  <p className="text-sm text-gray-500">{result.emoji} {result.taxType} - ${result.taxed} remaining: ${result.remaining}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-6">
              <motion.button onClick={closeTaxEvent} whileHover={{scale:1.05}} whileTap={{scale:0.98}} className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-lg">
                Close Tax Event
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========== WINNER ========== */}
      {phase === 'winner' && (
        <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
          <motion.div initial={{opacity:0,scale:0.9,y:30}} animate={{opacity:1,scale:1,y:0}} transition={{type:'spring',stiffness:80,damping:20}} className="bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-[0_20px_80px_rgba(168,85,247,0.15)] border border-white/80 max-w-3xl w-full text-center relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2" style={{fontFamily:'"Dancing Script", cursive'}}>Congratulations!</h2>
            <p className="text-purple-400 font-bold mb-8">{winner?.name} has won the game!</p>
            <div className="space-y-4">
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="p-4 rounded-2xl border-2 bg-green-50 border-green-200">
                <div className="flex items-center gap-2 mb-2"><span className="text-2xl">🏆</span><span className="font-bold text-gray-800">Final Results</span></div>
                <p className="text-sm text-gray-500">{winner?.name} has ${winner?.money} at the end!</p>
              </motion.div>
            </div>
            <div className="mt-6">
              <motion.button onClick={() => {
                setPhase('setup');
                setIsPawnAnimating(false);
                setPlayers([
                  { id: '1', name: 'Player 1', color: 'pink', position: 0, skipNextTurn: false, avatar: null, job: null, money: 0, turnsPlayed: 0, roundsWithoutIncome: 0, evolved: false, pathIndex: null, inSchool: false, schoolTurnsLeft: 0, studentLoanDebt: 0, chaosTriggersRemaining: 0, startingModifier: null },
                  { id: '2', name: 'Player 2', color: 'purple', position: 0, skipNextTurn: false, avatar: null, job: null, money: 0, turnsPlayed: 0, roundsWithoutIncome: 0, evolved: false, pathIndex: null, inSchool: false, schoolTurnsLeft: 0, studentLoanDebt: 0, chaosTriggersRemaining: 0, startingModifier: null }
                ]);
              }} whileHover={{scale:1.05}} whileTap={{scale:0.98}} className="px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-lg shadow-lg">
                Play Again
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}