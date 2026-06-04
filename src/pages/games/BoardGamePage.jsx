import React, { useEffect, useState, useRef, createElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlitterHeart } from '../../components/GlitterHeart';
import { HeartCrackIcon, DollarSignIcon, SparklesIcon, FlameIcon, StarIcon, Wand2Icon, TrophyIcon, FlagIcon, Dice1Icon, Dice2Icon, Dice3Icon, Dice4Icon, Dice5Icon, Dice6Icon, DicesIcon, CameraIcon, SkullIcon, GraduationCapIcon, BookOpenIcon, ZapIcon } from 'lucide-react';
import { JourneyStartScene } from '../../components/games/JourneyStartScene';
import { CityBackdrop } from '../../components/games/CityBackdrop';
import { RoadView } from '../../components/games/RoadView';

const PAWN_STEP_DURATION_MS = 440;
const PAWN_LANDING_BUFFER_MS = 700;
const STARTING_HAND_RESHUFFLE_LIMIT = 2;
// --- JOBS ---
const ALL_JOBS = [
// --- 🎓 COLLEGE → BEST JOB PATH (Path 0) ---
{
  id: 'corporate-remote',
  name: 'Corporate Remote Worker',
  emoji: '💻',
  wage: 32,
  taxType: 'W2',
  taxRate: 0.22,
  effectDescription: 'Stable income, occasional burnout',
  flavorText: 'Camera off, pants off, productivity off',
  tier: 'good'
}, {
  id: 'nurse',
  name: 'Nurse',
  emoji: '🏥',
  wage: 35,
  taxType: 'W2',
  taxRate: 0.22,
  effectDescription: 'Stable income, high stress',
  flavorText: 'Saving lives but cant save yourself',
  tier: 'good'
}, {
  id: 'engineer',
  name: 'Engineer',
  emoji: '🛠️',
  wage: 45,
  taxType: 'W2',
  taxRate: 0.22,
  effectDescription: 'High stable income',
  flavorText: 'Building things and burning out',
  tier: 'good'
}, {
  id: 'accountant',
  name: 'Accountant',
  emoji: '📊',
  wage: 30,
  taxType: 'W2',
  taxRate: 0.22,
  effectDescription: 'Stable income',
  flavorText: 'Numbers dont lie but your boss does',
  tier: 'good'
}, {
  id: 'marketing-mgr',
  name: 'Marketing Manager',
  emoji: '📣',
  wage: 34,
  taxType: 'W2',
  taxRate: 0.22,
  effectDescription: 'Stable income',
  flavorText: 'Making things go viral except your paycheck',
  tier: 'good'
}, {
  id: 'hr-specialist',
  name: 'HR Specialist',
  emoji: '👥',
  wage: 28,
  taxType: 'W2',
  taxRate: 0.22,
  effectDescription: 'Stable income',
  flavorText: 'Pretending to care professionally',
  tier: 'good'
}, {
  id: 'software-dev',
  name: 'Software Developer',
  emoji: '👨‍💻',
  wage: 48,
  taxType: 'W2',
  taxRate: 0.22,
  effectDescription: 'Highest stable income',
  flavorText: 'Debugging code and your life simultaneously',
  tier: 'good'
}, {
  id: 'project-mgr',
  name: 'Project Manager',
  emoji: '📋',
  wage: 40,
  taxType: 'W2',
  taxRate: 0.22,
  effectDescription: 'High stable income',
  flavorText: 'Herding cats professionally',
  tier: 'good'
}, {
  id: 'teacher',
  name: 'Teacher',
  emoji: '🍎',
  wage: 27,
  taxType: 'W2',
  taxRate: 0.22,
  effectDescription: 'Stable but low income',
  flavorText: 'Teaching others what you barely survived',
  tier: 'good'
}, {
  id: 'office-mgr',
  name: 'Office Manager',
  emoji: '🏢',
  wage: 29,
  taxType: 'W2',
  taxRate: 0.22,
  effectDescription: 'Stable income',
  flavorText: 'The only one holding this place together',
  tier: 'good'
}, {
  id: 'financial-analyst',
  name: 'Financial Analyst',
  emoji: '💰',
  wage: 42,
  taxType: 'W2',
  taxRate: 0.22,
  effectDescription: 'High stable income',
  flavorText: 'Analyzing everyones money but yours',
  tier: 'good'
}, {
  id: 'healthcare-admin',
  name: 'Healthcare Administrator',
  emoji: '🏥',
  wage: 36,
  taxType: 'W2',
  taxRate: 0.22,
  effectDescription: 'Stable income',
  flavorText: 'Paperwork and panic attacks',
  tier: 'good'
}, {
  id: 'it-specialist',
  name: 'IT Specialist',
  emoji: '🖥️',
  wage: 38,
  taxType: 'W2',
  taxRate: 0.22,
  effectDescription: 'Stable income',
  flavorText: 'Have you tried turning it off and on again?',
  tier: 'good'
},
// --- 📚 HS / GED → GOOD JOB PATH (Path 1) ---
{
  id: 'call-center',
  name: 'Call Center Agent',
  emoji: '📞',
  wage: 18,
  taxType: 'W2',
  taxRate: 0.18,
  effectDescription: 'Moderate steady income',
  flavorText: 'Please hold while I hold back tears',
  tier: 'bad'
}, {
  id: 'retail-mgr',
  name: 'Retail Manager',
  emoji: '🛍️',
  wage: 22,
  taxType: 'W2',
  taxRate: 0.18,
  effectDescription: 'Moderate steady income',
  flavorText: 'The customer is NOT always right',
  tier: 'bad'
}, {
  id: 'warehouse-supervisor',
  name: 'Warehouse Supervisor',
  emoji: '📦',
  wage: 21,
  taxType: 'W2',
  taxRate: 0.18,
  effectDescription: 'Moderate steady income',
  flavorText: 'My back, my knees, my will to live',
  tier: 'bad'
}, {
  id: 'delivery-driver',
  name: 'Delivery Driver',
  emoji: '🚚',
  wage: 20,
  taxType: 'W2',
  taxRate: 0.18,
  effectDescription: 'Moderate steady income',
  flavorText: 'Your back hurts but the tips help',
  tier: 'bad'
}, {
  id: 'admin-assistant',
  name: 'Administrative Assistant',
  emoji: '📋',
  wage: 19,
  taxType: 'W2',
  taxRate: 0.18,
  effectDescription: 'Moderate steady income',
  flavorText: 'Organizing someone elses life',
  tier: 'bad'
}, {
  id: 'bank-teller',
  name: 'Bank Teller',
  emoji: '🏦',
  wage: 18,
  taxType: 'W2',
  taxRate: 0.18,
  effectDescription: 'Moderate steady income',
  flavorText: 'Handling money you cant keep',
  tier: 'bad'
}, {
  id: 'customer-service',
  name: 'Customer Service Representative',
  emoji: '💬',
  wage: 17,
  taxType: 'W2',
  taxRate: 0.18,
  effectDescription: 'Moderate steady income',
  flavorText: 'Smiling through the chaos',
  tier: 'bad'
}, {
  id: 'security-guard',
  name: 'Security Guard',
  emoji: '🛡️',
  wage: 19,
  taxType: 'W2',
  taxRate: 0.18,
  effectDescription: 'Moderate steady income',
  flavorText: 'Guarding everything except your peace',
  tier: 'bad'
}, {
  id: 'medical-assistant',
  name: 'Medical Assistant',
  emoji: '🩺',
  wage: 20,
  taxType: 'W2',
  taxRate: 0.18,
  effectDescription: 'Moderate steady income',
  flavorText: 'Open wide and pray for benefits',
  tier: 'bad'
}, {
  id: 'receptionist',
  name: 'Receptionist',
  emoji: '🏢',
  wage: 17,
  taxType: 'W2',
  taxRate: 0.18,
  effectDescription: 'Moderate steady income',
  flavorText: 'Gatekeeping the entire office',
  tier: 'bad'
}, {
  id: 'shift-supervisor',
  name: 'Shift Supervisor',
  emoji: '⏰',
  wage: 21,
  taxType: 'W2',
  taxRate: 0.18,
  effectDescription: 'Moderate steady income',
  flavorText: 'All the responsibility, half the pay',
  tier: 'bad'
}, {
  id: 'factory-worker',
  name: 'Factory Worker',
  emoji: '🏭',
  wage: 20,
  taxType: 'W2',
  taxRate: 0.18,
  effectDescription: 'Moderate steady income',
  flavorText: 'Rinse and repeat until retirement',
  tier: 'bad'
},
// --- ⚡ DROPOUT → MINIMUM WAGE PATH (Path 2) ---
{
  id: 'fast-food',
  name: 'Fast Food Worker',
  emoji: '🍔',
  wage: 15,
  taxType: 'W2',
  taxRate: 0.15,
  effectDescription: 'Low income, unstable',
  flavorText: 'Sir this is a Wendys',
  tier: 'bad'
}, {
  id: 'retail-associate',
  name: 'Retail Associate',
  emoji: '🛍️',
  wage: 15,
  taxType: 'W2',
  taxRate: 0.15,
  effectDescription: 'Low income, unstable',
  flavorText: 'Folding clothes that will be ruined in 5 mins',
  tier: 'bad'
}, {
  id: 'gig-driver',
  name: 'Gig Driver',
  emoji: '🚗',
  wage: 22,
  wageDisplay: '$8-$35/hr variable',
  taxType: '1099',
  taxRate: 0.35,
  effectDescription: 'Unpredictable income, chance for BIG BREAK 💥',
  flavorText: 'Made $100… kept $12 after gas and life choices',
  tier: 'good'
}, {
  id: 'house-cleaner',
  name: 'House Cleaner',
  emoji: '🧽',
  wage: 16,
  taxType: 'W2',
  taxRate: 0.15,
  effectDescription: 'Low income, physical work',
  flavorText: 'Found something weird under the bed...',
  tier: 'bad'
}, {
  id: 'dishwasher',
  name: 'Dishwasher',
  emoji: '🍽️',
  wage: 15,
  taxType: 'W2',
  taxRate: 0.15,
  effectDescription: 'Low income, physical work',
  flavorText: 'Scrubbing plates and scrubbing by',
  tier: 'bad'
}, {
  id: 'stocker',
  name: 'Stocker',
  emoji: '📦',
  wage: 15,
  taxType: 'W2',
  taxRate: 0.15,
  effectDescription: 'Low income, physical work',
  flavorText: 'Night shifts and weird customers',
  tier: 'bad'
}, {
  id: 'day-labor',
  name: 'Day Labor Worker',
  emoji: '🛠️',
  wage: 17,
  taxType: 'W2',
  taxRate: 0.15,
  effectDescription: 'Low income, unstable',
  flavorText: 'Heavy lifting for light pay',
  tier: 'bad'
}, {
  id: 'gas-station',
  name: 'Gas Station Clerk',
  emoji: '⛽',
  wage: 15,
  taxType: 'W2',
  taxRate: 0.15,
  effectDescription: 'Low income, unstable',
  flavorText: 'Selling lottery tickets you wish you won',
  tier: 'bad'
}, {
  id: 'lawn-care',
  name: 'Lawn Care Worker',
  emoji: '🌱',
  wage: 16,
  taxType: 'W2',
  taxRate: 0.15,
  effectDescription: 'Low income, physical work',
  flavorText: 'Making yards pretty while yours falls apart',
  tier: 'bad'
}, {
  id: 'warehouse-worker',
  name: 'Warehouse Worker',
  emoji: '📦',
  wage: 17,
  taxType: 'W2',
  taxRate: 0.15,
  effectDescription: 'Low income, physical work',
  flavorText: 'Permanent stress temporary paycheck',
  tier: 'bad'
}, {
  id: 'babysitting',
  name: 'Babysitting / Odd Jobs',
  emoji: '👶',
  wage: 15,
  taxType: '1099',
  taxRate: 0.3,
  effectDescription: 'Low income, unstable',
  flavorText: 'Raising other peoples kids for minimum wage',
  tier: 'bad'
}, {
  id: 'thrift-flipper',
  name: 'Thrift Flipper',
  emoji: '🧢',
  wage: 12,
  taxType: '1099',
  taxRate: 0.3,
  effectDescription: 'Low income, unstable',
  flavorText: 'One persons trash is your income',
  tier: 'bad'
},
// --- 📺 FUTURE OPPORTUNITY JOBS (not a starting education path) ---
{
  id: 'streamer',
  name: 'Streamer',
  emoji: '🎮',
  wage: 20,
  wageDisplay: '$0-$40/hr variable',
  taxType: '1099',
  taxRate: 0.35,
  effectDescription: 'Unpredictable income, chance for BIG BREAK 💥',
  flavorText: 'Going live to 2 people… but one viral moment changes everything',
  tier: 'good'
}, {
  id: 'content-creator',
  name: 'Content Creator',
  emoji: '📱',
  wage: 28,
  wageDisplay: '$5-$50/hr variable',
  taxType: '1099',
  taxRate: 0.35,
  effectDescription: 'Unpredictable income, chance for BIG BREAK 💥',
  flavorText: 'Dancing for pennies until the brand deal hits',
  tier: 'good'
}, {
  id: 'freelancer',
  name: 'Freelancer',
  emoji: '💻',
  wage: 40,
  wageDisplay: '$20-$60/hr variable',
  taxType: '1099',
  taxRate: 0.35,
  effectDescription: 'Unpredictable income, chance for BIG BREAK 💥',
  flavorText: 'Chasing invoices instead of dreams',
  tier: 'good'
}, {
  id: 'small-biz',
  name: 'Small Business Owner',
  emoji: '🛍️',
  wage: 45,
  wageDisplay: '$10-$80/hr variable',
  taxType: '1099',
  taxRate: 0.35,
  effectDescription: 'Unpredictable income, chance for BIG BREAK 💥',
  flavorText: 'You invested in yourself… one big deal changes everything',
  tier: 'good'
}, {
  id: 'online-seller',
  name: 'Online Seller',
  emoji: '📦',
  wage: 30,
  wageDisplay: '$15-$45/hr variable',
  taxType: '1099',
  taxRate: 0.35,
  effectDescription: 'Unpredictable income, chance for BIG BREAK 💥',
  flavorText: 'Packing orders at 3 AM',
  tier: 'good'
}, {
  id: 'dropshipper',
  name: 'Dropshipper',
  emoji: '📊',
  wage: 35,
  wageDisplay: '$0-$70/hr variable',
  taxType: '1099',
  taxRate: 0.35,
  effectDescription: 'Unpredictable income, chance for BIG BREAK 💥',
  flavorText: 'Selling things youve never even seen',
  tier: 'good'
}, {
  id: 'social-media-mgr',
  name: 'Social Media Manager',
  emoji: '📣',
  wage: 30,
  wageDisplay: '$20-$40/hr variable',
  taxType: '1099',
  taxRate: 0.35,
  effectDescription: 'Unpredictable income, chance for BIG BREAK 💥',
  flavorText: 'Chronically online for a living',
  tier: 'good'
}, {
  id: 'photographer',
  name: 'Photographer',
  emoji: '📸',
  wage: 50,
  wageDisplay: '$25-$75/hr variable',
  taxType: '1099',
  taxRate: 0.35,
  effectDescription: 'Unpredictable income, chance for BIG BREAK 💥',
  flavorText: 'Capturing moments, missing paychecks',
  tier: 'good'
}, {
  id: 'hair-stylist',
  name: 'Hair Stylist',
  emoji: '💇‍♀️',
  wage: 35,
  wageDisplay: '$20-$50/hr variable',
  taxType: '1099',
  taxRate: 0.35,
  effectDescription: 'Unpredictable income, chance for BIG BREAK 💥',
  flavorText: 'Part-time therapist, full-time artist',
  tier: 'good'
}, {
  id: 'nail-tech',
  name: 'Nail Tech',
  emoji: '💅',
  wage: 32,
  wageDisplay: '$18-$45/hr variable',
  taxType: '1099',
  taxRate: 0.35,
  effectDescription: 'Unpredictable income, chance for BIG BREAK 💥',
  flavorText: 'Breathing acrylic dust for the bag',
  tier: 'good'
}, {
  id: 'personal-trainer',
  name: 'Personal Trainer',
  emoji: '🏋️‍♀️',
  wage: 43,
  wageDisplay: '$25-$60/hr variable',
  taxType: '1099',
  taxRate: 0.35,
  effectDescription: 'Unpredictable income, chance for BIG BREAK 💥',
  flavorText: 'Getting paid to yell at people',
  tier: 'good'
}, {
  id: 'coach-consultant',
  name: 'Coach / Consultant',
  emoji: '🧠',
  wage: 65,
  wageDisplay: '$30-$100/hr variable',
  taxType: '1099',
  taxRate: 0.35,
  effectDescription: 'Unpredictable income, chance for BIG BREAK 💥',
  flavorText: 'Selling advice you barely follow yourself',
  tier: 'good'
}];

// --- CONSTANTS ---
const PLAYER_COLORS = {
  pink: 'bg-pink-500 shadow-pink-500/50',
  purple: 'bg-purple-500 shadow-purple-500/50',
  blue: 'bg-blue-500 shadow-blue-500/50',
  teal: 'bg-teal-500 shadow-teal-500/50',
  gold: 'bg-amber-400 shadow-amber-400/50',
  coral: 'bg-rose-400 shadow-rose-400/50'
};
const PLAYER_BORDER = {
  pink: 'border-pink-400',
  purple: 'border-purple-400',
  blue: 'border-blue-400',
  teal: 'border-teal-400',
  gold: 'border-amber-300',
  coral: 'border-rose-300'
};
const CATEGORY_STYLES = {
  start: {
    glow: 'shadow-[0_0_20px_rgba(255,255,255,0.8)]',
    border: 'border-white',
    bg: 'bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300',
    icon: FlagIcon
  },
  heartbreak: {
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.4)]',
    border: 'border-rose-300',
    bg: 'bg-rose-50',
    icon: HeartCrackIcon
  },
  money: {
    glow: 'shadow-[0_0_15px_rgba(251,191,36,0.4)]',
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    icon: DollarSignIcon
  },
  glowup: {
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
    border: 'border-purple-300',
    bg: 'bg-purple-50',
    icon: SparklesIcon
  },
  chaos: {
    glow: 'shadow-[0_0_15px_rgba(249,115,22,0.4)]',
    border: 'border-orange-300',
    bg: 'bg-orange-50',
    icon: FlameIcon
  },
  blessing: {
    glow: 'shadow-[0_0_15px_rgba(20,184,166,0.4)]',
    border: 'border-teal-300',
    bg: 'bg-teal-50',
    icon: StarIcon
  },
  wildcard: {
    glow: 'shadow-[0_0_20px_rgba(236,72,153,0.5)]',
    border: 'border-pink-300',
    bg: 'bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50',
    icon: Wand2Icon
  },
  finish: {
    glow: 'shadow-[0_0_30px_rgba(251,191,36,0.6)]',
    border: 'border-amber-300',
    bg: 'bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-300',
    icon: TrophyIcon
  },
  tax: {
    glow: 'shadow-[0_0_20px_rgba(220,38,38,0.5)]',
    border: 'border-red-400',
    bg: 'bg-gradient-to-br from-red-50 via-red-50 to-orange-50',
    icon: SkullIcon
  },
  money_loss: {
    glow: 'shadow-[0_0_18px_rgba(239,68,68,0.45)]',
    border: 'border-red-300',
    bg: 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50',
    icon: DollarSignIcon
  }
};
// --- TILES (30 tiles) ---
const TILES = [{
  id: 0,
  name: 'The Journey Begins',
  category: 'start',
  actionText: 'Ready to trip through life?',
  effect: 'none'
}, {
  id: 1,
  name: 'Your Ex Texted',
  category: 'heartbreak',
  actionText: 'Take a shot or skip a turn',
  effect: 'skip'
}, {
  id: 3,
  name: 'Car Broke Down',
  category: 'chaos',
  actionText: 'Move back 1 space',
  effect: 'move',
  effectValue: -1
}, {
  id: 4,
  name: 'New Haircut, New You',
  category: 'glowup',
  actionText: 'Roll again!',
  effect: 'roll_again'
}, {
  id: 5,
  name: 'Found $20 in Old Jeans',
  category: 'blessing',
  actionText: 'Move ahead 1 space',
  effect: 'move',
  effectValue: 1
}, {
  id: 6,
  name: 'Got Ghosted Again',
  category: 'heartbreak',
  actionText: 'Skip next turn',
  effect: 'skip'
}, {
  id: 7,
  name: 'WILD CARD',
  category: 'wildcard',
  actionText: 'Host picks your fate',
  effect: 'none'
}, {
  id: 9,
  name: 'Started Therapy',
  category: 'glowup',
  actionText: 'Move ahead 3 spaces',
  effect: 'move',
  effectValue: 3
}, {
  id: 10,
  name: '💸 TAX SEASON',
  category: 'tax',
  actionText: 'The IRS has entered the chat. ALL players get taxed!',
  effect: 'tax'
}, {
  id: 11,
  name: 'Stranger Paid for Coffee',
  category: 'blessing',
  actionText: 'Move ahead 1 space',
  effect: 'move',
  effectValue: 1
}, {
  id: 12,
  name: 'Caught Them Cheating',
  category: 'heartbreak',
  actionText: 'Move back 3 spaces',
  effect: 'move',
  effectValue: -3
}, {
  id: 14,
  name: 'WILD CARD',
  category: 'wildcard',
  actionText: 'Swap places with any player',
  effect: 'none'
}, {
  id: 15,
  name: 'Gym Glow Up Era',
  category: 'glowup',
  actionText: 'Roll again!',
  effect: 'roll_again'
}, {
  id: 16,
  name: 'Identity Stolen',
  category: 'chaos',
  actionText: 'Move back 2 spaces',
  effect: 'move',
  effectValue: -2
}, {
  id: 17,
  name: 'Dream Job Called Back',
  category: 'blessing',
  actionText: 'Move ahead 3 spaces',
  effect: 'move',
  effectValue: 3
}, {
  id: 18,
  name: 'Toxic Friend Exposed',
  category: 'heartbreak',
  actionText: 'Skip a turn',
  effect: 'skip'
}, {
  id: 20,
  name: '💸 TAX SEASON',
  category: 'tax',
  actionText: 'Uncle Sam wants his cut. ALL players get taxed!',
  effect: 'tax'
}, {
  id: 21,
  name: 'WILD CARD',
  category: 'wildcard',
  actionText: 'Everyone moves back 1 except you',
  effect: 'none'
}, {
  id: 22,
  name: 'Apartment Flooded',
  category: 'chaos',
  actionText: 'Move back 2 spaces',
  effect: 'move',
  effectValue: -2
}, {
  id: 23,
  name: 'Met Your Person',
  category: 'blessing',
  actionText: 'Move ahead 3 spaces',
  effect: 'move',
  effectValue: 3
}, {
  id: 24,
  name: 'Wedding Called Off',
  category: 'heartbreak',
  actionText: 'Move back 3 spaces',
  effect: 'move',
  effectValue: -3
}, {
  id: 26,
  name: 'Wrote Your First Book',
  category: 'glowup',
  actionText: 'Move ahead 2 spaces',
  effect: 'move',
  effectValue: 2
}, {
  id: 27,
  name: 'Lost Your Keys... Again',
  category: 'chaos',
  actionText: 'Skip a turn',
  effect: 'skip'
}, {
  id: 28,
  name: '💸 TAX SEASON',
  category: 'tax',
  actionText: 'Final tax hit before the finish! ALL players get taxed!',
  effect: 'tax'
}, {
  id: 29,
  name: 'You Made It, Babe!',
  category: 'finish',
  actionText: 'Winner winner!',
  effect: 'none'
},
// --- 💸 UNIVERSAL MONEY STRUGGLE TILES ---
// Bills / Adulting Pain
{
  id: 30,
  name: 'Rent Went Up 😬',
  category: 'money_loss',
  actionText: 'Rent went up this month...',
  effect: 'money_loss',
  effectValue: -150
}, {
  id: 31,
  name: 'Utility Bill Shock ⚡',
  category: 'money_loss',
  actionText: 'Utility bill way higher than expected',
  effect: 'money_loss',
  effectValue: -100
}, {
  id: 32,
  name: 'Internet Bill Up',
  category: 'money_loss',
  actionText: 'Internet bill randomly increased',
  effect: 'money_loss',
  effectValue: -20
}, {
  id: 33,
  name: 'Forgot a Subscription 💸',
  category: 'money_loss',
  actionText: 'Subscription you forgot about hit again',
  effect: 'money_loss',
  effectValue: -25
}, {
  id: 34,
  name: 'Late Fee 😒',
  category: 'money_loss',
  actionText: 'Late fee added to your bill',
  effect: 'money_loss',
  effectValue: -35
},
// Life Expenses
{
  id: 35,
  name: 'Gas Prices Spike ⛽',
  category: 'money_loss',
  actionText: 'Gas prices are insane right now',
  effect: 'money_loss',
  effectValue: -50
}, {
  id: 36,
  name: 'Car Maintenance 🛠️',
  category: 'money_loss',
  actionText: 'Car needs maintenance... again',
  effect: 'money_loss',
  effectValue: -150
}, {
  id: 37,
  name: 'Flat Tire 😭',
  category: 'money_loss',
  actionText: "Flat tire… and you're already late for work",
  effect: 'money_loss',
  effectValue: -100
}, {
  id: 38,
  name: 'Speeding Ticket 🚓',
  category: 'money_loss',
  actionText: 'Caught going 15 over...',
  effect: 'money_loss',
  effectValue: -275
}, {
  id: 39,
  name: 'Car Got Towed 😭',
  category: 'money_loss',
  actionText: 'Towed… pay to get it back',
  effect: 'money_loss',
  effectValue: -350
},
// Health / Real Life
{
  id: 40,
  name: 'Doctor Visit 🏥',
  category: 'money_loss',
  actionText: 'Doctor visit… not covered by insurance',
  effect: 'money_loss',
  effectValue: -700
}, {
  id: 41,
  name: 'Prescription Cost 💊',
  category: 'money_loss',
  actionText: 'Prescription cost hits different',
  effect: 'money_loss',
  effectValue: -300
}, {
  id: 42,
  name: 'Dental Expense 😬',
  category: 'money_loss',
  actionText: 'Unexpected dental expense',
  effect: 'money_loss',
  effectValue: -500
},
// Bad Decisions
{
  id: 43,
  name: 'Retail Therapy 🛍️',
  category: 'money_loss',
  actionText: 'Retail therapy got you again',
  effect: 'money_loss',
  effectValue: -450
}, {
  id: 44,
  name: 'Impulse Buy 😅',
  category: 'money_loss',
  actionText: 'Impulse buy regret is real',
  effect: 'money_loss',
  effectValue: -200
}, {
  id: 45,
  name: 'Ordered Food Again 🍔',
  category: 'money_loss',
  actionText: 'Ordered food instead of cooking',
  effect: 'money_loss',
  effectValue: -20
}, {
  id: 46,
  name: 'Boredom Spending',
  category: 'money_loss',
  actionText: 'Spent money out of pure boredom',
  effect: 'money_loss',
  effectValue: -25
}, {
  id: 47,
  name: 'TikTok Made Me Buy It 😭',
  category: 'money_loss',
  actionText: 'TikTok made you buy it...',
  effect: 'money_loss',
  effectValue: -60
},
// Bank / Money System Pain
{
  id: 48,
  name: 'Credit Card Interest 😩',
  category: 'money_loss',
  actionText: 'Credit card interest hit hard',
  effect: 'money_loss',
  effectValue: -28
}, {
  id: 49,
  name: 'Mystery Bank Fee',
  category: 'money_loss',
  actionText: "Bank fee you didn't understand",
  effect: 'money_loss',
  effectValue: -30
}, {
  id: 50,
  name: 'Double Charged 💀',
  category: 'money_loss',
  actionText: 'Payment processed twice!',
  effect: 'money_loss',
  effectValue: -150
}, {
  id: 51,
  name: 'Low Balance Fee 😒',
  category: 'money_loss',
  actionText: 'Low balance fee hit again',
  effect: 'money_loss',
  effectValue: -35
},
// Low-Key Stress Money Hits
{
  id: 52,
  name: 'Helped Someone Out 💔',
  category: 'money_loss',
  actionText: 'Gave money to someone who needed it',
  effect: 'money_loss',
  effectValue: -5
}, {
  id: 53,
  name: 'Bought a Meal ❤️',
  category: 'money_loss',
  actionText: 'Bought someone a meal',
  effect: 'money_loss',
  effectValue: -12
}, {
  id: 54,
  name: 'TikTok Gifts 😭',
  category: 'money_loss',
  actionText: 'Threw too many TikTok gifts',
  effect: 'money_loss',
  effectValue: -100
},
// Extra scattered hits
{
  id: 55,
  name: 'Parking Ticket 🅿️',
  category: 'money_loss',
  actionText: 'Forgot to feed the meter',
  effect: 'money_loss',
  effectValue: -75
}, {
  id: 56,
  name: 'Phone Screen Cracked 📱',
  category: 'money_loss',
  actionText: 'Dropped your phone face down...',
  effect: 'money_loss',
  effectValue: -200
}, {
  id: 57,
  name: 'Pet Vet Bill 🐾',
  category: 'money_loss',
  actionText: 'Your fur baby needed the vet',
  effect: 'money_loss',
  effectValue: -400
},
// --- 💸 POSITIVE MONEY WINS ---
// Small Wins
{
  id: 58,
  name: 'Found Money in Your Pocket 😄',
  category: 'money',
  actionText: 'Check those pockets more often!',
  effect: 'money_gain',
  effectValue: 20
}, {
  id: 59,
  name: 'Got Paid Back 💸',
  category: 'money',
  actionText: 'They actually remembered!',
  effect: 'money_gain',
  effectValue: 50
}, {
  id: 60,
  name: 'Cashback Hit Your Account 💳',
  category: 'money',
  actionText: 'Free money is the best money',
  effect: 'money_gain',
  effectValue: 25
}, {
  id: 61,
  name: "Didn't Order Food for Once 🍔",
  category: 'money',
  actionText: 'Your wallet thanks you',
  effect: 'money_gain',
  effectValue: 30
}, {
  id: 62,
  name: 'Stuck to Your Budget 📊',
  category: 'money',
  actionText: 'Look at you being responsible!',
  effect: 'money_gain',
  effectValue: 75
}, {
  id: 63,
  name: 'Split Bill Win 😌',
  category: 'money',
  actionText: 'Paid less than expected!',
  effect: 'money_gain',
  effectValue: 40
}, {
  id: 64,
  name: 'Coupon Actually Worked 😭',
  category: 'money',
  actionText: 'Against all odds...',
  effect: 'money_gain',
  effectValue: 15
}, {
  id: 65,
  name: 'Free Drink/Meal Hookup 🍹',
  category: 'money',
  actionText: 'Someone came through!',
  effect: 'money_gain',
  effectValue: 25
}, {
  id: 66,
  name: 'Someone Covered You 🙌',
  category: 'money',
  actionText: 'Good people still exist',
  effect: 'money_gain',
  effectValue: 35
},
// Medium Wins
{
  id: 67,
  name: 'Tax Refund Hit 🙌',
  category: 'money',
  actionText: 'Uncle Sam gave something back!',
  effect: 'money_gain',
  effectValue: 400
}, {
  id: 68,
  name: 'Extra Hours Paid Off ⏰',
  category: 'money',
  actionText: 'That overtime was worth it',
  effect: 'money_gain',
  effectValue: 150
}, {
  id: 69,
  name: "Sold Something You Didn't Need 📦",
  category: 'money',
  actionText: 'Declutter = profit',
  effect: 'money_gain',
  effectValue: 120
}, {
  id: 70,
  name: 'Refund Finally Processed 😩',
  category: 'money',
  actionText: 'Only took 3 weeks...',
  effect: 'money_gain',
  effectValue: 200
}, {
  id: 71,
  name: 'Random Discount at Checkout 🛍️',
  category: 'money',
  actionText: 'Price drop surprise!',
  effect: 'money_gain',
  effectValue: 100
}, {
  id: 72,
  name: 'Side Money Came Through 💻',
  category: 'money',
  actionText: 'Hustle pays off sometimes',
  effect: 'money_gain',
  effectValue: 180
}, {
  id: 73,
  name: 'Unexpected Cash Gift 🎁',
  category: 'money',
  actionText: 'Somebody loves you!',
  effect: 'money_gain',
  effectValue: 250
}, {
  id: 74,
  name: 'Bill Was Cheaper Than Expected 😮‍💨',
  category: 'money',
  actionText: "Wait... that's it??",
  effect: 'money_gain',
  effectValue: 130
},
// Big Wins
{
  id: 75,
  name: 'Saved Way More Than Expected 😭',
  category: 'money',
  actionText: 'Accidentally responsible!',
  effect: 'money_gain',
  effectValue: 600
}, {
  id: 76,
  name: 'Someone Came Through BIG 💖',
  category: 'money',
  actionText: 'Real ones show up when it matters',
  effect: 'money_gain',
  effectValue: 700
}, {
  id: 77,
  name: 'Emergency Cost Less Than Expected 😮‍💨',
  category: 'money',
  actionText: "Could've been so much worse",
  effect: 'money_gain',
  effectValue: 550
}, {
  id: 78,
  name: 'Covered Everything This Month 🙌',
  category: 'money',
  actionText: 'Bills paid, food bought, still breathing',
  effect: 'money_gain',
  effectValue: 500
}, {
  id: 79,
  name: 'Financial Stress Eased Up 😩✨',
  category: 'money',
  actionText: 'Finally catching a break',
  effect: 'money_gain',
  effectValue: 650
},
// --- 🎓 PATH-SPECIFIC NEGATIVE TILES: College → Best Job ---
{
  id: 80,
  name: 'Student Loan Payment Hit 😭',
  category: 'money_loss',
  actionText: 'Sallie Mae never forgets...',
  effect: 'money_loss',
  effectValue: -300
}, {
  id: 81,
  name: "Degree Didn't Match the Pay 😬",
  category: 'money_loss',
  actionText: '4 years for THIS salary?',
  effect: 'money_loss',
  effectValue: -200
}, {
  id: 82,
  name: 'Burnout… Unpaid Time Off 😩',
  category: 'money_loss',
  actionText: 'Your body said no but bills said yes',
  effect: 'money_loss',
  effectValue: -250
}, {
  id: 83,
  name: 'Job Relocation Cost You 💼',
  category: 'money_loss',
  actionText: 'New city, new expenses, same stress',
  effect: 'money_loss',
  effectValue: -400
}, {
  id: 84,
  name: 'Office Politics Cost You 😒',
  category: 'money_loss',
  actionText: 'Someone else got YOUR opportunity',
  effect: 'money_loss',
  effectValue: -150
},
// --- 📚 PATH-SPECIFIC NEGATIVE TILES: HS/GED → Good Job ---
{
  id: 85,
  name: 'Hours Cut This Week 😬',
  category: 'money_loss',
  actionText: 'Schedule changed without warning',
  effect: 'money_loss',
  effectValue: -200
}, {
  id: 86,
  name: 'Missed Promotion 😒',
  category: 'money_loss',
  actionText: 'They gave it to someone else...',
  effect: 'money_loss',
  effectValue: -150
}, {
  id: 87,
  name: 'Shift Cut Last Minute 😩',
  category: 'money_loss',
  actionText: 'Manager changed the schedule again',
  effect: 'money_loss',
  effectValue: -120
}, {
  id: 88,
  name: 'Called Out Unpaid 😭',
  category: 'money_loss',
  actionText: "Burnout is real but bills don't care",
  effect: 'money_loss',
  effectValue: -180
}, {
  id: 89,
  name: 'No Raise This Year 😤',
  category: 'money_loss',
  actionText: 'Job feels stuck… again',
  effect: 'money_loss',
  effectValue: -100
},
// --- ⚡ PATH-SPECIFIC NEGATIVE TILES: Dropout → Min Wage ---
{
  id: 90,
  name: 'Shift Got Canceled 😭',
  category: 'money_loss',
  actionText: 'Already got dressed for nothing',
  effect: 'money_loss',
  effectValue: -120
}, {
  id: 91,
  name: 'Hours Cut Again 😬',
  category: 'money_loss',
  actionText: 'Boss keeps cutting your schedule',
  effect: 'money_loss',
  effectValue: -200
}, {
  id: 92,
  name: 'Let Go Unexpectedly 💀',
  category: 'money_loss',
  actionText: 'No warning. No severance. Just gone.',
  effect: 'money_loss',
  effectValue: -300
}, {
  id: 93,
  name: 'Missed Work… No Pay 😩',
  category: 'money_loss',
  actionText: "Life happened but the check didn't",
  effect: 'money_loss',
  effectValue: -150
}, {
  id: 94,
  name: 'Transportation Issue 🚗',
  category: 'money_loss',
  actionText: "Couldn't get to work today",
  effect: 'money_loss',
  effectValue: -100
},
// --- NEW MONEY LOSS TILES (104-113) ---
{
  id: 104,
  name: 'Laundry Machine Ate Your Quarters',
  category: 'money_loss',
  actionText: 'And your clothes are still wet',
  effect: 'money_loss',
  effectValue: -15
}, {
  id: 105,
  name: 'Friend Needed Emergency Cash',
  category: 'money_loss',
  actionText: 'You know you are never seeing this again',
  effect: 'money_loss',
  effectValue: -200
}, {
  id: 106,
  name: 'Accidentally Tipped 30%',
  category: 'money_loss',
  actionText: 'Math is hard under pressure',
  effect: 'money_loss',
  effectValue: -25
}, {
  id: 107,
  name: 'Streaming Service Price Hike',
  category: 'money_loss',
  actionText: 'They got you again',
  effect: 'money_loss',
  effectValue: -18
}, {
  id: 108,
  name: 'Lost Your Wallet 😭',
  category: 'money_loss',
  actionText: 'The replacement fees hurt the most',
  effect: 'money_loss',
  effectValue: -350
}, {
  id: 109,
  name: 'HOA Fee Hit',
  category: 'money_loss',
  actionText: 'Paying to be told what to do',
  effect: 'money_loss',
  effectValue: -250
}, {
  id: 110,
  name: 'Gym Membership You Never Use',
  category: 'money_loss',
  actionText: 'Maybe next month...',
  effect: 'money_loss',
  effectValue: -45
}, {
  id: 111,
  name: 'Food Delivery Fee Shock',
  category: 'money_loss',
  actionText: 'The fees cost more than the food',
  effect: 'money_loss',
  effectValue: -22
}, {
  id: 112,
  name: 'Accidentally Left Lights On',
  category: 'money_loss',
  actionText: 'Your dad was right',
  effect: 'money_loss',
  effectValue: -40
}, {
  id: 113,
  name: 'Kid Needed School Supplies',
  category: 'money_loss',
  actionText: 'Why are markers so expensive?',
  effect: 'money_loss',
  effectValue: -80
},
// --- NEW MONEY GAIN TILES (114-123) ---
{
  id: 114,
  name: 'Found a Side Gig 💪',
  category: 'money',
  actionText: 'Hustle paying off',
  effect: 'money_gain',
  effectValue: 300
}, {
  id: 115,
  name: 'Got a Raise!',
  category: 'money',
  actionText: 'Finally some recognition',
  effect: 'money_gain',
  effectValue: 200
}, {
  id: 116,
  name: 'Scratch Ticket Win 🎰',
  category: 'money',
  actionText: "Don't spend it all at once",
  effect: 'money_gain',
  effectValue: 150
}, {
  id: 117,
  name: 'Birthday Money 🎂',
  category: 'money',
  actionText: 'Thanks Grandma!',
  effect: 'money_gain',
  effectValue: 100
}, {
  id: 118,
  name: 'Sold Old Clothes Online',
  category: 'money',
  actionText: 'Decluttering for profit',
  effect: 'money_gain',
  effectValue: 80
}, {
  id: 119,
  name: 'Class Action Settlement Hit',
  category: 'money',
  actionText: 'You forgot you even signed up',
  effect: 'money_gain',
  effectValue: 450
}, {
  id: 120,
  name: 'Neighbor Paid You to Pet Sit',
  category: 'money',
  actionText: 'Getting paid to hang with dogs',
  effect: 'money_gain',
  effectValue: 60
}, {
  id: 121,
  name: 'Won a Bet 😏',
  category: 'money',
  actionText: 'You knew you were right',
  effect: 'money_gain',
  effectValue: 175
}, {
  id: 122,
  name: 'Overtime Approved!',
  category: 'money',
  actionText: 'Tired but richer',
  effect: 'money_gain',
  effectValue: 250
}, {
  id: 123,
  name: 'Random Venmo From Mom 💕',
  category: 'money',
  actionText: 'Moms are the best',
  effect: 'money_gain',
  effectValue: 125
},
// --- NEW LIFE EVENT TILES (124-133) ---
{
  id: 124,
  name: 'Best Friend Moved Away',
  category: 'heartbreak',
  actionText: 'Skip a turn to cry',
  effect: 'skip'
}, {
  id: 125,
  name: 'Got a Compliment From a Stranger',
  category: 'blessing',
  actionText: 'Move ahead 1 space',
  effect: 'move',
  effectValue: 1
}, {
  id: 126,
  name: 'Therapy Breakthrough 🧠',
  category: 'glowup',
  actionText: 'Move ahead 2 spaces',
  effect: 'move',
  effectValue: 2
}, {
  id: 127,
  name: 'Roommate Drama 😤',
  category: 'chaos',
  actionText: 'Move back 1 space',
  effect: 'move',
  effectValue: -1
}, {
  id: 128,
  name: 'WILD CARD',
  category: 'wildcard',
  actionText: 'Truth or Dare',
  effect: 'none'
}, {
  id: 129,
  name: 'Started a Journal ✨',
  category: 'glowup',
  actionText: 'Roll again!',
  effect: 'roll_again'
}, {
  id: 130,
  name: 'Family Drama at Dinner',
  category: 'heartbreak',
  actionText: 'Skip a turn',
  effect: 'skip'
}, {
  id: 131,
  name: 'Random Act of Kindness',
  category: 'blessing',
  actionText: 'Move ahead 2 spaces',
  effect: 'move',
  effectValue: 2
}, {
  id: 132,
  name: 'Phone Died at the Worst Time',
  category: 'chaos',
  actionText: 'Move back 1 space',
  effect: 'move',
  effectValue: -1
}, {
  id: 133,
  name: 'WILD CARD',
  category: 'wildcard',
  actionText: 'Spin the Wheel',
  effect: 'none'
}];

// --- REALM EVENTS ---
const CHAOS_REALM_TILE_POOL = [
// Entry tile
{
  id: 0,
  name: 'Welcome to the Chaos Realm',
  emoji: '🔥',
  description: "You've entered a place where everything can fall apart...",
  effect: 'safe_passage',
  effectValue: 0
},
// Chaos/Struggle tiles (converted from CHAOS_REALM_EVENTS + DEEP_STRUGGLE_EVENTS)
{
  id: 1,
  name: 'Lost your job unexpectedly',
  emoji: '😭',
  description: 'Everything just fell apart',
  effect: 'money_loss',
  effectValue: -500
}, {
  id: 2,
  name: 'Car broke down AND you need repairs',
  emoji: '🚗',
  description: 'When it rains, it pours',
  effect: 'money_loss',
  effectValue: -400
}, {
  id: 3,
  name: "Rent due and you're short",
  emoji: '💸',
  description: 'The stress is overwhelming',
  effect: 'money_loss',
  effectValue: -350
}, {
  id: 4,
  name: 'Dental emergency',
  emoji: '😬',
  description: 'Pain and bills at the same time',
  effect: 'money_loss',
  effectValue: -600
}, {
  id: 5,
  name: 'Got sick, no income for days',
  emoji: '🤒',
  description: 'Your body gave out',
  effect: 'money_loss',
  effectValue: -200
}, {
  id: 6,
  name: 'Everything is due at once',
  emoji: '😵‍💫',
  description: 'Drowning in obligations',
  effect: 'money_loss',
  effectValue: -500
}, {
  id: 7,
  name: "Burnout hit hard… can't function",
  emoji: '😩',
  description: 'You need to step away',
  effect: 'skip_turn',
  effectValue: 0
}, {
  id: 8,
  name: 'Life feels overwhelming right now',
  emoji: '💔',
  description: 'Everything is too much',
  effect: 'money_loss',
  effectValue: -250
}, {
  id: 9,
  name: 'Eviction notice showed up',
  emoji: '😭',
  description: 'Nowhere to go',
  effect: 'money_loss',
  effectValue: -700
}, {
  id: 10,
  name: 'Phone got stolen',
  emoji: '📱',
  description: 'Your lifeline is gone',
  effect: 'money_loss',
  effectValue: -400
}, {
  id: 11,
  name: 'Had to borrow money from family',
  emoji: '💔',
  description: 'The shame is real',
  effect: 'money_loss',
  effectValue: -300
}, {
  id: 12,
  name: 'Anxiety spiral hit hard',
  emoji: '😵‍💫',
  description: "Can't catch your breath",
  effect: 'move_back',
  effectValue: -2
}, {
  id: 13,
  name: 'Lost a close friendship',
  emoji: '💔',
  description: 'Alone when you need people most',
  effect: 'money_loss',
  effectValue: -150
}, {
  id: 14,
  name: 'Work drama got out of control',
  emoji: '😤',
  description: 'Everything is falling apart',
  effect: 'money_loss',
  effectValue: -350
},
// Deep struggle tiles
{
  id: 15,
  name: 'Hit a breaking point… need to step away',
  emoji: '🧠',
  description: 'Your mind needs rest',
  effect: 'money_loss',
  effectValue: -400
}, {
  id: 16,
  name: 'Checked into care/support to reset',
  emoji: '🏥',
  description: 'Taking time to heal',
  effect: 'money_loss',
  effectValue: -500
}, {
  id: 17,
  name: 'Coping habits got out of control… time to face it',
  emoji: '😬',
  description: 'Reality check moment',
  effect: 'money_loss',
  effectValue: -300
}, {
  id: 18,
  name: 'Rock bottom… but still breathing',
  emoji: '💪',
  description: 'This is the lowest point',
  effect: 'money_loss',
  effectValue: -600
}, {
  id: 19,
  name: 'Had to start completely over',
  emoji: '😭',
  description: 'Everything you built is gone',
  effect: 'money_loss',
  effectValue: -500
}, {
  id: 20,
  name: 'Lost everything but yourself',
  emoji: '💜',
  description: 'At least you still have you',
  effect: 'money_loss',
  effectValue: -450
},
// THE INSTANT LOSE TILE
{
  id: 21,
  name: 'Rock Bottom — You Lost Everything',
  emoji: '💀',
  description: 'Sometimes the chaos wins...',
  effect: 'instant_lose',
  effectValue: 0
},
// Recovery tiles (converted from RECOVERY_EVENTS)
{
  id: 22,
  name: 'Took time to rest and reset',
  emoji: '🛌',
  description: 'Small steps forward',
  effect: 'recovery',
  effectValue: 100
}, {
  id: 23,
  name: 'Support system showed up for you',
  emoji: '💕',
  description: "You're not alone",
  effect: 'recovery',
  effectValue: 150
}, {
  id: 24,
  name: 'Started getting back on track slowly',
  emoji: '🙌',
  description: 'Progress, not perfection',
  effect: 'recovery',
  effectValue: 200
}, {
  id: 25,
  name: 'Small win… but it meant everything',
  emoji: '💖',
  description: 'Hope is returning',
  effect: 'recovery',
  effectValue: 120
}, {
  id: 26,
  name: 'Found a little peace again',
  emoji: '🕊️',
  description: 'Breathing easier now',
  effect: 'recovery',
  effectValue: 100
}, {
  id: 27,
  name: 'Rebuilding, one step at a time',
  emoji: '✨',
  description: 'Slow and steady',
  effect: 'recovery',
  effectValue: 180
}, {
  id: 28,
  name: 'Someone believed in you when you didnt',
  emoji: '💖',
  description: 'That made all the difference',
  effect: 'recovery',
  effectValue: 200
}, {
  id: 29,
  name: 'Got approved for assistance',
  emoji: '🙌',
  description: 'Help arrived',
  effect: 'recovery',
  effectValue: 250
}, {
  id: 30,
  name: 'Community rallied around you',
  emoji: '💕',
  description: 'People showed up',
  effect: 'recovery',
  effectValue: 180
}, {
  id: 31,
  name: 'Woke up and chose healing',
  emoji: '✨',
  description: 'Today is a new day',
  effect: 'recovery',
  effectValue: 150
},
// Safe passage tiles (breathing room)
{
  id: 32,
  name: 'A moment of calm',
  emoji: '🌙',
  description: 'Nothing bad happened today',
  effect: 'safe_passage',
  effectValue: 0
}, {
  id: 33,
  name: 'Caught your breath',
  emoji: '😮‍💨',
  description: 'Just a moment to breathe',
  effect: 'safe_passage',
  effectValue: 0
}, {
  id: 34,
  name: 'Survived another day',
  emoji: '💪',
  description: 'That counts for something',
  effect: 'safe_passage',
  effectValue: 0
},
// Exit tile
{
  id: 35,
  name: 'You Made It Through',
  emoji: '🌅',
  description: 'The chaos realm releases you... for now',
  effect: 'exit',
  effectValue: 0
}];
const CHAOS_REALM_SCENES = [{
  title: 'Car dead in the storm',
  subtitle: 'The engine clicks once, then gives up. Rain hammers the windshield.',
  location: 'Flooded service road',
  leftNote: 'Your phone is at 3%. You need one smart move.',
  sceneAccent: '#f59e0b',
  choices: [{
    label: 'Check the car',
    description: 'Pop the hood and try to get it moving.',
    icon: '🔧',
    tone: 'caution',
    outcomeTitle: 'You bought yourself time',
    outcomeText: 'The fix barely holds, but you avoid a bigger tow bill.',
    moneyDelta: -75
  }, {
    label: 'Enter the gas station',
    description: 'Look for help, supplies, or a working phone.',
    icon: '⛽',
    tone: 'hope',
    outcomeTitle: 'A clerk helped you call a ride',
    outcomeText: 'It costs money, but you get out of the storm safely.',
    moneyDelta: -120,
    escape: true
  }, {
    label: 'Take the alley',
    description: 'A shortcut might get you out faster.',
    icon: '🌆',
    tone: 'risk',
    outcomeTitle: 'The shortcut got expensive',
    outcomeText: 'You found the way out, but lost cash replacing what got ruined.',
    moneyDelta: -220
  }]
}, {
  title: 'Abandoned gas station',
  subtitle: 'The pumps are dead. A neon OPEN sign flickers like it is lying.',
  location: 'Last stop before downtown',
  leftNote: 'Every option could help. Every option could make it worse.',
  sceneAccent: '#a855f7',
  choices: [{
    label: 'Search the counter',
    description: 'Look for a charger, map, or emergency number.',
    icon: '🔦',
    tone: 'caution',
    outcomeTitle: 'You found a working charger',
    outcomeText: 'A little battery, a little clarity, and one way forward.',
    moneyDelta: 50
  }, {
    label: 'Ask the stranger outside',
    description: 'They know the area, but you do not know them.',
    icon: '🧥',
    tone: 'risk',
    outcomeTitle: 'Bad advice sent you in circles',
    outcomeText: 'You make it out, shaken and short on cash.',
    moneyDelta: -180,
    skipNextTurn: true
  }, {
    label: 'Stay under the awning',
    description: 'Wait out the worst of the rain.',
    icon: '🌧️',
    tone: 'hope',
    outcomeTitle: 'The storm eased',
    outcomeText: 'You lost time, but avoided making a desperate choice.',
    moneyDelta: 0,
    escape: true
  }]
}, {
  title: 'No safe route',
  subtitle: 'Sirens echo under the overpass. The city feels like it is watching.',
  location: 'Underpass by the tracks',
  leftNote: 'One more decision. Then the board pulls you back.',
  sceneAccent: '#22d3ee',
  choices: [{
    label: 'Call someone trusted',
    description: 'Swallow your pride and ask for help.',
    icon: '📱',
    tone: 'hope',
    outcomeTitle: 'Someone answered',
    outcomeText: 'Support arrived when you needed it most.',
    moneyDelta: 125,
    escape: true
  }, {
    label: 'Sleep at the motel',
    description: 'Pay for one night and regroup.',
    icon: '🏚️',
    tone: 'caution',
    outcomeTitle: 'A rough reset',
    outcomeText: 'Not comfortable, not cheap, but safer than the street.',
    moneyDelta: -160,
    escape: true
  }, {
    label: 'Keep walking',
    description: 'Push through and hope the city lets you pass.',
    icon: '🚶',
    tone: 'risk',
    outcomeTitle: 'You made it through exhausted',
    outcomeText: 'You escape, but the stress follows you into the next turn.',
    moneyDelta: -90,
    skipNextTurn: true,
    escape: true
  }]
}];
const CAREER_SWITCH_EVENTS = [{
  name: 'Took time off to figure things out 😬',
  amount: -300
}, {
  name: 'Invested in new skills/courses 📚',
  amount: -400
}, {
  name: 'Lost stable income during transition 💸',
  amount: -500
}, {
  name: 'Bought equipment/supplies 🛠️',
  amount: -350
}, {
  name: 'Took on debt to make the switch 💳',
  amount: -600
}, {
  name: 'Income unstable for a while 😩',
  amount: -250
}, {
  name: 'Started from scratch 😭',
  amount: -450
}];

// --- 🚗 UNIVERSAL TRANSPORTATION EVENTS ---
const TRANSPORTATION_EVENTS = [
// Car / Gas
{
  name: 'Low on gas… fill up ⛽',
  amount: -60,
  emoji: '⛽'
}, {
  name: 'Gas prices hit again 😒',
  amount: -80,
  emoji: '⛽'
}, {
  name: 'Oil change due 🛠️',
  amount: -75,
  emoji: '🛠️'
}, {
  name: 'Tire pressure issue… quick fix',
  amount: -40,
  emoji: '🔧'
},
// Electric Vehicle
{
  name: 'Battery low… need to charge 🔌',
  amount: -30,
  emoji: '🔌'
}, {
  name: 'Charging station cost more than expected 😬',
  amount: -50,
  emoji: '🔌'
},
// Uber / Rideshare
{
  name: 'Took an Uber… surge pricing 😭',
  amount: -45,
  emoji: '🚕'
}, {
  name: 'Late night ride cost more than expected 🚕',
  amount: -60,
  emoji: '🚕'
}, {
  name: 'Had to Uber instead of driving',
  amount: -35,
  emoji: '🚕'
},
// Public Transport
{
  name: 'Bus/train fare 🚌',
  amount: -10,
  emoji: '🚌'
}, {
  name: 'Had to reload transit card',
  amount: -25,
  emoji: '🚌'
}, {
  name: 'Missed ride… paid again 😒',
  amount: -15,
  emoji: '🚌'
}, {
  name: 'Car insurance went up 😤',
  amount: -90,
  emoji: '🚗'
}, {
  name: 'Parking garage fee 🅿️',
  amount: -35,
  emoji: '🅿️'
}, {
  name: 'Car registration renewal 📋',
  amount: -120,
  emoji: '📋'
}, {
  name: 'Windshield wiper replacement',
  amount: -30,
  emoji: '🚗'
}, {
  name: 'Uber pool still expensive 😒',
  amount: -28,
  emoji: '🚕'
}, {
  name: 'Train delay made you late',
  amount: -20,
  emoji: '🚌'
}, {
  name: 'Toll road surprise 💸',
  amount: -15,
  emoji: '🛣️'
}, {
  name: 'Had to jump start the car 🔋',
  amount: -50,
  emoji: '🔋'
}];

// --- EDUCATION PATHS ---
const LIFE_PATHS = [{
  name: 'College',
  emoji: '🎓',
  icon: GraduationCapIcon,
  color: 'from-violet-400 to-purple-500',
  glowColor: 'rgba(139,92,246,0.5)',
  textColor: 'text-violet-600',
  bgLight: 'bg-violet-50',
  borderColor: 'border-violet-300',
  summary: 'Structured start with stronger job access, plus debt and pressure risk.'
}, {
  name: 'High School Diploma / GED',
  emoji: '📚',
  icon: BookOpenIcon,
  color: 'from-pink-400 to-rose-500',
  glowColor: 'rgba(236,72,153,0.5)',
  textColor: 'text-pink-600',
  bgLight: 'bg-pink-50',
  borderColor: 'border-pink-300',
  summary: 'Balanced practical route with steadier footing and moderate risk.'
}, {
  name: 'Dropout',
  emoji: '⚡',
  icon: ZapIcon,
  color: 'from-orange-400 to-coral-500',
  glowColor: 'rgba(251,146,60,0.5)',
  textColor: 'text-orange-600',
  bgLight: 'bg-orange-50',
  borderColor: 'border-orange-300',
  summary: 'Rougher start with more chaos risk, but success stays possible.'
}];
const EDUCATION_PATH_COUNT = LIFE_PATHS.length;
const STARTING_MODIFIERS = [{
  title: 'Family safety net',
  emoji: '🛟',
  kind: 'advantage',
  description: 'A little support cushions the first few turns.',
  moneyDelta: 250,
  chaosDelta: -1
}, {
  title: 'Reliable ride',
  emoji: '🚗',
  kind: 'advantage',
  description: 'Getting around is easier at the start.',
  moneyDelta: 150,
  chaosDelta: -1
}, {
  title: 'Extra shift lined up',
  emoji: '💵',
  kind: 'advantage',
  description: 'You start with one small money boost.',
  moneyDelta: 100,
  chaosDelta: 0
}, {
  title: 'Clean slate',
  emoji: '✨',
  kind: 'neutral',
  description: 'No bonus, no penalty. Play the hand from here.',
  moneyDelta: 0,
  chaosDelta: 0
}, {
  title: 'Bills already due',
  emoji: '📬',
  kind: 'disadvantage',
  description: 'Life starts with pressure on your wallet.',
  moneyDelta: -150,
  chaosDelta: 1
}, {
  title: 'Rough first month',
  emoji: '🌧️',
  kind: 'disadvantage',
  description: 'A messy start makes chaos more likely.',
  moneyDelta: -200,
  chaosDelta: 1
}];

// --- PATH-SPECIFIC JOB POOLS ---
const PATH_JOBS = {
  0: ['corporate-remote', 'nurse', 'engineer', 'accountant', 'marketing-mgr', 'hr-specialist', 'software-dev', 'project-mgr', 'teacher', 'office-mgr', 'financial-analyst', 'healthcare-admin', 'it-specialist'],
  1: ['call-center', 'retail-mgr', 'warehouse-supervisor', 'delivery-driver', 'admin-assistant', 'bank-teller', 'customer-service', 'security-guard', 'medical-assistant', 'receptionist', 'shift-supervisor', 'factory-worker'],
  2: ['fast-food', 'retail-associate', 'house-cleaner', 'dishwasher', 'stocker', 'day-labor', 'gas-station', 'lawn-care', 'warehouse-worker', 'babysitting', 'thrift-flipper']
};
const getJobsForPath = (pathIndex) => {
  const normalizedPath = Math.max(0, Math.min(EDUCATION_PATH_COUNT - 1, Math.floor(pathIndex)));
  const jobIds = PATH_JOBS[normalizedPath] || [];
  return ALL_JOBS.filter((j) => jobIds.includes(j.id));
};
// Map tiles to 3 education starts that later share life districts and chaos.
// Money struggle tiles (30-57) are distributed evenly and mixed into early/mid/late positions
const DEFAULT_PATH_TILE_ASSIGNMENTS = [
// Path 0: College (+ path-specific: 80-84)
[0, 1, 30, 58, 80, 35, 3, 60, 40, 81, 4, 62, 48, 100, 5, 82, 66, 44, 6, 67, 83, 52, 7, 75, 103, 84, 55, 29],
// Path 1: HS/GED (+ path-specific: 85-89)
[0, 59, 31, 85, 9, 36, 61, 41, 86, 12, 63, 49, 102, 68, 87, 45, 14, 69, 88, 53, 15, 76, 103, 89, 56, 29],
// Path 2: Dropout (+ path-specific: 90-94)
[0, 16, 32, 90, 64, 17, 37, 91, 70, 18, 42, 71, 92, 50, 101, 21, 65, 93, 46, 22, 72, 54, 103, 94, 23, 77, 57, 29]];
const getTileById = (id) => {
  return TILES.find((t) => t.id === id) || TILES[0];
};
// Position calculator for the 3-path linear layout
const getBoardPosition = (tileId, activePathTiles = DEFAULT_PATH_TILE_ASSIGNMENTS) => {
  // Start tile — bottom center
  if (tileId === 0) return {
    x: 50,
    y: 98,
    angle: 0
  };
  // Finish tile — top center
  if (tileId === 29) return {
    x: 50,
    y: 2,
    angle: 0
  };
  // Tax tiles — positioned in center
  if (tileId === 10) return {
    x: 50,
    y: 70,
    angle: 0
  };
  if (tileId === 20) return {
    x: 50,
    y: 40,
    angle: 0
  };
  if (tileId === 28) return {
    x: 50,
    y: 15,
    angle: 0
  };
  // Find which path this tile belongs to
  for (let pathIdx = 0; pathIdx < activePathTiles.length; pathIdx++) {
    const pathTiles = activePathTiles[pathIdx];
    const posInPath = pathTiles.indexOf(tileId);
    if (posInPath !== -1) {
      const progress = posInPath / (pathTiles.length - 1);
      // Three readable lanes that can visually reconnect through shared districts.
      const xPositions = [26, 50, 74];
      // Y goes from 95 (bottom) to 5 (top)
      const y = 95 - progress * 90;
      // Create a meandering curve
      const frequency = 3; // Number of S-curves
      const amplitude = 8; // Width of the curve in %
      const curve = Math.sin(progress * Math.PI * frequency) * amplitude;
      // Calculate angle (derivative of sine is cosine)
      const angle = Math.cos(progress * Math.PI * frequency) * 15;
      return {
        x: xPositions[pathIdx] + curve,
        y: y,
        angle: angle
      };
    }
  }
  // Fallback for any unmapped tiles
  return {
    x: 50,
    y: 50,
    angle: 0
  };
};
// 3D Dice helpers
const PIP_POSITIONS = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]]
};
function DiceFace({
  value,
  style
}) {
  const pips = PIP_POSITIONS[value] || [];
  return <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-pink-50 to-purple-100 border-4 border-purple-300 shadow-[inset_0_0_20px_rgba(168,85,247,0.15)]" style={{
    ...style,
    backfaceVisibility: 'hidden'
  }}>
      
      <div className="relative w-full h-full p-4">
        {pips.map(([row, col], i) => <div key={i} className="absolute w-5 h-5 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" style={{
        top: `${15 + row * 30}%`,
        left: `${15 + col * 30}%`
      }} />)}
      </div>
    </div>;
}
// Maps a dice value (1-6) to the cube rotation that lands that face toward the camera (front)
function getDiceFaceRotation(value) {
  switch (value) {
    case 1:
      return {
        x: 0,
        y: 0
      };
    case 6:
      return {
        x: 0,
        y: 180
      };
    case 2:
      return {
        x: 0,
        y: -90
      };
    case 5:
      return {
        x: 0,
        y: 90
      };
    case 3:
      return {
        x: -90,
        y: 0
      };
    case 4:
      return {
        x: 90,
        y: 0
      };
    default:
      return {
        x: 0,
        y: 0
      };
  }
}
// Floating particles component
function FloatingParticles({
  count = 30
}) {
  return <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({
      length: count
    }).map((_, i) => <motion.div key={i} className="absolute rounded-full" style={{
      width: 2 + Math.random() * 4,
      height: 2 + Math.random() * 4,
      background: ['rgba(236,72,153,0.3)', 'rgba(168,85,247,0.3)', 'rgba(96,165,250,0.3)', 'rgba(251,191,36,0.3)', 'rgba(255,255,255,0.5)'][i % 5],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }} animate={{
      y: [0, -30 - Math.random() * 40, 0],
      x: [0, (Math.random() - 0.5) * 20, 0],
      opacity: [0.2, 0.6, 0.2],
      scale: [1, 1.3, 1]
    }} transition={{
      duration: 4 + Math.random() * 6,
      repeat: Infinity,
      delay: Math.random() * 5,
      ease: 'easeInOut'
    }} />)}
    </div>;
}
// Sparkle burst component for board landing
function SparkleBurst({
  active
}) {
  if (!active) return null;
  return <AnimatePresence>
      <div className="absolute inset-0 pointer-events-none z-10">
        {Array.from({
        length: 40
      }).map((_, i) => {
        const angle = i / 40 * Math.PI * 2;
        const distance = 80 + Math.random() * 120;
        return <motion.div key={i} className="absolute left-1/2 top-1/2 rounded-full" style={{
          width: 3 + Math.random() * 5,
          height: 3 + Math.random() * 5,
          background: ['#f9a8d4', '#c4b5fd', '#93c5fd', '#fcd34d', '#ffffff'][i % 5]
        }} initial={{
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1
        }} animate={{
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 40,
          opacity: 0,
          scale: 0
        }} transition={{
          duration: 1.2 + Math.random() * 0.8,
          ease: 'easeOut'
        }} />;
      })}
      </div>
    </AnimatePresence>;
}
// --- COMPONENT ---
export function BoardGamePage() {
  const [phase, setPhase] = useState('setup');
  const [dealRevealReady, setDealRevealReady] = useState(false);
  const [dealSequenceId, setDealSequenceId] = useState(0);
  const [startingHandReshuffles, setStartingHandReshuffles] = useState(0);
  const [activePathTiles, setActivePathTiles] = useState(DEFAULT_PATH_TILE_ASSIGNMENTS);
  const [players, setPlayers] = useState([{
    id: '1',
    name: 'Player 1',
    color: 'pink',
    position: 0,
    skipNextTurn: false,
    avatar: null,
    job: null,
    money: 0,
    turnsPlayed: 0,
    roundsWithoutIncome: 0,
    evolved: false,
    pathIndex: null,
    inSchool: false,
    schoolTurnsLeft: 0,
    studentLoanDebt: 0,
    chaosTriggersRemaining: 0,
    startingModifier: null
  }, {
    id: '2',
    name: 'Player 2',
    color: 'purple',
    position: 0,
    skipNextTurn: false,
    avatar: null,
    job: null,
    money: 0,
    turnsPlayed: 0,
    roundsWithoutIncome: 0,
    evolved: false,
    pathIndex: null,
    inSchool: false,
    schoolTurnsLeft: 0,
    studentLoanDebt: 0,
    chaosTriggersRemaining: 0,
    startingModifier: null
  }]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isPawnAnimating, setIsPawnAnimating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [winner, setWinner] = useState(null);
  const [zoomedTile, setZoomedTile] = useState(null);
  const [focusedPathIndex, setFocusedPathIndex] = useState(null);
  const [isPawnMoving, setIsPawnMoving] = useState(false);
  const [taxResults, setTaxResults] = useState([]);
  const [jobEffectMessage, setJobEffectMessage] = useState(null);
  const [incomeFlash, setIncomeFlash] = useState(null);
  const [boardLanded, setBoardLanded] = useState(true);
  const [showBurst, setShowBurst] = useState(false);
  const boardRef = useRef(null);
  // Realm State
  const [realmEvents, setRealmEvents] = useState([]);
  const [currentRealmEventIndex, setCurrentRealmEventIndex] = useState(0);
  const [realmTotalLoss, setRealmTotalLoss] = useState(0);
  const [pendingNewPath, setPendingNewPath] = useState(null);
  // Short first-person Chaos Realm mode state
  const [chaosRealmScenes, setChaosRealmScenes] = useState([]);
  const [chaosSceneIndex, setChaosSceneIndex] = useState(0);
  const [selectedChaosChoice, setSelectedChaosChoice] = useState(null);
  const [chaosOutcome, setChaosOutcome] = useState(null);
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);
  const [showChaosTransition, setShowChaosTransition] = useState(false);
  // Transportation event state
  const [transportEvent, setTransportEvent] = useState(null);
  const generateShuffledPaths = () => {
    // Define pools
    const UNIVERSAL_NEGATIVE_IDS = [...Array.from({
      length: 28
    }, (_, i) => i + 30), ...Array.from({
      length: 10
    }, (_, i) => i + 104) // 104-113
    ];
    const UNIVERSAL_POSITIVE_IDS = [...Array.from({
      length: 22
    }, (_, i) => i + 58), ...Array.from({
      length: 10
    }, (_, i) => i + 114) // 114-123
    ];
    const LIFE_EVENT_IDS = [1, 3, 4, 5, 6, 7, 9, 11, 12, 14, 15, 16, 17, 18, 21, 22, 23, 24, 26, 27, ...Array.from({
      length: 10
    }, (_, i) => i + 124) // 124-133
    ];
    const PATH_SPECIFIC = {
      0: [80, 81, 82, 83, 84],
      1: [85, 86, 87, 88, 89],
      2: [90, 91, 92, 93, 94]
    };
    const PATH_ANCHOR_TILES = {
      0: 100,
      1: 102,
      2: 101
    };
    // Health/food expense tile IDs excluded from Dropout path (Medicaid + food assistance)
    const DROPOUT_EXCLUDED_TILES = [40, 41, 42, 45, 111];
    // Shuffle helper
    const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
    let availableNeg = shuffle(UNIVERSAL_NEGATIVE_IDS);
    const availablePos = shuffle(UNIVERSAL_POSITIVE_IDS);
    const availableLife = shuffle(LIFE_EVENT_IDS);
    const newPaths = [];
    for (let i = 0; i < EDUCATION_PATH_COUNT; i++) {
      // For Dropout path (index 2), filter out health/food tiles (Medicaid + food assistance)
      let negSubset;
      if (i === 2) {
        const filteredNeg = availableNeg.filter((id) => !DROPOUT_EXCLUDED_TILES.includes(id));
        negSubset = filteredNeg.slice(0, 8);
        availableNeg = availableNeg.filter((id) => !negSubset.includes(id));
      } else {
        negSubset = availableNeg.splice(0, 8);
      }
      const posSubset = availablePos.splice(0, 6);
      const lifeSubset = availableLife.splice(0, 5);
      // Combine middle tiles and shuffle them
      const middleTiles = shuffle([...negSubset, ...posSubset, ...lifeSubset, ...PATH_SPECIFIC[i], PATH_ANCHOR_TILES[i], 103]);
      // Build path: Start (0) -> Middle -> Finish (29)
      newPaths.push([0, ...middleTiles, 29]);
    }
    setActivePathTiles(newPaths);
  };
  // Board landing animation trigger
  useEffect(() => {
    if (phase === 'playing' && !boardLanded) {
      setTimeout(() => {
        setBoardLanded(true);
        setShowBurst(true);
        setTimeout(() => setShowBurst(false), 2000);
      }, 300);
    }
  }, [phase]);
  useEffect(() => {
    if (phase !== 'starting_deal') return;
    const timer = setTimeout(() => setDealRevealReady(true), 1250);
    return () => clearTimeout(timer);
  }, [phase, dealSequenceId]);
  // --- SETUP ---
  const addPlayer = () => {
    if (players.length >= 6) return;
    const colors = ['pink', 'purple', 'blue', 'teal', 'gold', 'coral'];
    setPlayers([...players, {
      id: Date.now().toString(),
      name: `Player ${players.length + 1}`,
      color: colors[players.length % 6],
      position: 0,
      skipNextTurn: false,
      avatar: null,
      job: null,
      money: 0,
      turnsPlayed: 0,
      roundsWithoutIncome: 0,
      evolved: false,
      pathIndex: null,
      inSchool: false,
      schoolTurnsLeft: 0,
      studentLoanDebt: 0,
      chaosTriggersRemaining: 0,
      startingModifier: null
    }]);
  };
  const removePlayer = (id) => {
    if (players.length <= 2) return;
    setPlayers(players.filter((p) => p.id !== id));
  };
  const updatePlayer = (id, field, value) => {
    setPlayers(players.map((p) => p.id === id ? {
      ...p,
      [field]: value
    } : p));
  };
  const handleAvatarUpload = (playerId, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPlayers((prev) => prev.map((p) => p.id === playerId ? {
        ...p,
        avatar: e.target?.result
      } : p));
    };
    reader.readAsDataURL(file);
  };
  const assignStartingHands = () => {
    setDealRevealReady(false);
    setDealSequenceId((prev) => prev + 1);
    setFocusedPathIndex(null);
    setIsPawnMoving(false);
    generateShuffledPaths();
    const chaosLimits = {
      0: 3,
      1: 2,
      2: 3
    };
    setPlayers(players.map((p) => {
      const pathIndex = Math.floor(Math.random() * EDUCATION_PATH_COUNT);
      const jobs = getJobsForPath(pathIndex);
      const job = jobs[Math.floor(Math.random() * jobs.length)] ?? null;
      const startingModifier = STARTING_MODIFIERS[Math.floor(Math.random() * STARTING_MODIFIERS.length)];
      const isCollege = pathIndex === 0;
      const loanAmount = isCollege ? Math.floor(Math.random() * 2001) + 1000 : 0;
      const chaosTriggersRemaining = Math.max(0, (chaosLimits[pathIndex] ?? 2) + startingModifier.chaosDelta);
      return {
        ...p,
        position: 0,
        skipNextTurn: false,
        money: startingModifier.moneyDelta - loanAmount,
        turnsPlayed: 0,
        roundsWithoutIncome: 0,
        job,
        evolved: false,
        pathIndex,
        inSchool: false,
        schoolTurnsLeft: 0,
        studentLoanDebt: loanAmount,
        chaosTriggersRemaining,
        startingModifier
      };
    }));
    setPhase('starting_deal');
  };
  const dealStartingHands = () => {
    setStartingHandReshuffles(0);
    assignStartingHands();
  };
  const reshuffleStartingHands = () => {
    if (startingHandReshuffles >= STARTING_HAND_RESHUFFLE_LIMIT) return;
    const confirmed = window.confirm('Are you sure? You could get something worse.');
    if (!confirmed) return;
    setStartingHandReshuffles((prev) => prev + 1);
    assignStartingHands();
  };
  const enterPlayingPhase = () => {
    // Enter the cinematic board for the FIRST and only time. From here on,
    // turns happen in-place on the board — no more returning to this screen.
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
    // No auto-roll. The player presses the Roll Dice button in the bottom bar
    // when they're ready — one dice flow per turn, no duplicates.
  };
  const startPlaying = enterPlayingPhase;
  const startActualPlaying = enterPlayingPhase;
  // --- INCOME ---
  const earnIncome = (playerIndex) => {
    const player = players[playerIndex];
    if (!player.job) return 0;
    const job = player.job;
    return job.wage * 8;
  };
  // --- JOB EFFECTS ---
  const applyJobPreRollEffect = (playerIndex) => {
    const player = players[playerIndex];
    if (!player.job) return false;
    const job = player.job;
    const skipAndNext = (msg) => {
      setJobEffectMessage(msg);
      setPlayers((prev) => prev.map((p, i) => i === playerIndex ? {
        ...p,
        skipNextTurn: true
      } : p));
      setTimeout(() => {
        setJobEffectMessage(null);
        setCurrentPlayerIndex((playerIndex + 1) % players.length);
      }, 2500);
      return true;
    };
    // Path 0: College
    if (job.id === 'nurse' && player.turnsPlayed > 0 && player.turnsPlayed % 3 === 0) return skipAndNext(`🧑‍⚕️ ${player.name}: Burnout hit! Skip this turn.`);
    if (job.id === 'corporate-remote' && Math.random() < 0.2) return skipAndNext(`💻 ${player.name}: Forgot to log in! Skip this turn.`);
    // Path 2: Dropout
    if (job.id === 'fast-food' && Math.random() < 0.2) return skipAndNext(`🍔 ${player.name}: Lunch rush meltdown! Skip this turn.`);
    // Path 1: HS/GED
    if (job.id === 'warehouse-supervisor' && Math.random() < 0.2) return skipAndNext(`📦 ${player.name}: Overworked! Skip this turn.`);
    return false;
  };
  // --- GAMEPLAY ---
  const rollDice = () => {
    if (isRolling || isPawnMoving || showPopup || jobEffectMessage || transportEvent) return;
    const player = players[currentPlayerIndex];
    const isFirstMove = player.position === 0 && player.turnsPlayed === 0;
    // Keep the opening move clean before random interruptions start.
    if (!isFirstMove && Math.random() < 0.17) {
      const event = TRANSPORTATION_EVENTS[Math.floor(Math.random() * TRANSPORTATION_EVENTS.length)];
      setTransportEvent(event);
      setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? {
        ...p,
        money: p.money + event.amount
      } : p));
      return;
    }
    executeRoll();
  };
  const dismissTransportEvent = () => {
    setTransportEvent(null);
    executeRoll();
  };
  const executeRoll = () => {
    const player = players[currentPlayerIndex];
    if (!player) return;
    setFocusedPathIndex(player.pathIndex !== null ? player.pathIndex : 0);
    const income = earnIncome(currentPlayerIndex);
    // --- COLLEGE POST-GRADUATION: Student loan payment (~35% chance per turn) ---
    let loanPayment = 0;
    if (player.pathIndex === 0 && player.studentLoanDebt > 0 && Math.random() < 0.35) {
      loanPayment = -(Math.floor(Math.random() * 151) + 150); // -$150 to -$300
    }
    // College bonus check (~20% chance, +$200-$600)
    const collegeBonusTriggered = player.pathIndex === 0 && Math.random() < 0.2;
    const collegeBonusAmount = collegeBonusTriggered ? Math.floor(Math.random() * 401) + 200 // $200 - $600
    : 0;
    const totalGain = income + collegeBonusAmount + loanPayment;
    if (totalGain !== 0 || income > 0) {
      setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? {
        ...p,
        money: p.money + totalGain,
        turnsPlayed: p.turnsPlayed + 1
      } : p));
      // Build income flash message
      const flashParts = [];
      if (income > 0) flashParts.push(`+${income}`);
      if (collegeBonusTriggered) flashParts.push(`🎉 BONUS +${collegeBonusAmount}`);
      if (loanPayment < 0) flashParts.push(`💳 Loan ${loanPayment}`);
      setIncomeFlash(flashParts.join(' | '));
      const flashDuration = collegeBonusTriggered || loanPayment < 0 ? 2500 : 1500;
      setTimeout(() => setIncomeFlash(null), flashDuration);
    } else {
      setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? {
        ...p,
        turnsPlayed: p.turnsPlayed + 1
      } : p));
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
      setTimeout(() => {
        setDiceValue(null);
        movePlayer(roll);
      }, 800);
    }, 900);
  };
  const movePlayer = (spaces) => {
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
    setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? {
      ...p,
      position: finalPos
    } : p));
    setTimeout(() => {
      setIsPawnMoving(false);
      handleLandOnTile(finalPos, {
        ...player,
        position: finalPos
      });
    }, landingDelay);
  };
  const handleLandOnTile = (positionIndex, player) => {
    const pathIdx = player.pathIndex !== null ? player.pathIndex : 0;
    const tileId = activePathTiles[pathIdx][positionIndex];
    const tile = getTileById(tileId);
    if (tile.effect === 'tax') {
      const results = players.map((p) => {
        if (!p.job) return {
          name: p.name,
          emoji: '❓',
          taxType: 'N/A',
          taxed: 0,
          remaining: p.money
        };
        const taxAmount = Math.floor(p.money * p.job.taxRate);
        return {
          name: p.name,
          emoji: p.job.emoji,
          taxType: p.job.taxType,
          taxed: taxAmount,
          remaining: p.money - taxAmount
        };
      });
      setTaxResults(results);
      setPlayers((prev) => prev.map((p, i) => ({
        ...p,
        money: results[i].remaining
      })));
      setZoomedTile(tileId);
      setPhase('tax_event');
      return;
    }
    // Check for Chaos Realm trigger (uses per-path chaos trigger limits)
    const isNormalTile = tile.category !== 'start' && tile.category !== 'finish' && tile.category !== 'tax' && tile.effect !== 'career_switch' && tile.effect !== 'chaos_portal';
    const currentPlayer = players[currentPlayerIndex];
    const hasTriggersLeft = currentPlayer && currentPlayer.chaosTriggersRemaining > 0;
    const randomChaosTrigger = isNormalTile && hasTriggersLeft && Math.random() < 0.1;
    if (tile.effect === 'chaos_portal' || randomChaosTrigger) {
      // Decrement chaos triggers remaining
      if (randomChaosTrigger) {
        setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? {
          ...p,
          chaosTriggersRemaining: p.chaosTriggersRemaining - 1
        } : p));
      }
      // Generate a short first-person scene sequence instead of another board.
      const sceneCount = Math.floor(Math.random() * 3) + 1;
      const shuffledScenes = [...CHAOS_REALM_SCENES].sort(() => Math.random() - 0.5).slice(0, sceneCount);
      const entryFlavor = CHAOS_REALM_TILE_POOL[0].description;
      setChaosRealmScenes(shuffledScenes.map((scene, sceneIdx) => sceneIdx === 0 ? {
        ...scene,
        leftNote: `${entryFlavor} ${scene.leftNote}`
      } : scene));
      setChaosSceneIndex(0);
      setSelectedChaosChoice(null);
      setChaosOutcome(null);
      setRealmTotalLoss(0);
      setShowChaosTransition(true);
      setPhase('chaos_realm');
      setZoomedTile(tileId);
      setTimeout(() => {
        setShowChaosTransition(false);
      }, 2500);
      return;
    }
    if (tile.effect === 'career_switch') {
      const numEvents = Math.floor(Math.random() * 3) + 2; // 2 to 4 events
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
      setTimeout(() => {
        setWinner(player);
        setPhase('winner');
      }, 2000);
    }
  };
  // --- REALM LOGIC ---
  const advanceRealmEvent = () => {
    if (phase === 'career_switch') {
      const currentEvent = realmEvents[currentRealmEventIndex];
      setRealmTotalLoss((prev) => prev + currentEvent.amount);
      if (currentRealmEventIndex < realmEvents.length - 1) {
        setCurrentRealmEventIndex((prev) => prev + 1);
      } else {
        setCurrentRealmEventIndex(realmEvents.length);
      }
    }
  };
  const handleChaosChoice = (choice) => {
    if (selectedChaosChoice) return;
    setSelectedChaosChoice(choice);
    setChaosOutcome(choice);
    setRealmTotalLoss((prev) => prev + choice.moneyDelta);
    if (choice.skipNextTurn) {
      setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? {
        ...p,
        skipNextTurn: true
      } : p));
    }
  };
  const finishChaosRealm = () => {
    setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? {
      ...p,
      money: p.money + realmTotalLoss
    } : p));
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
    if (shouldExit) {
      finishChaosRealm();
      return;
    }
    setChaosSceneIndex((prev) => prev + 1);
    setSelectedChaosChoice(null);
    setChaosOutcome(null);
  };
  const advanceToNextPlayer = (customEliminated) => {
    const eliminated = customEliminated || eliminatedPlayers;
    setCurrentPlayerIndex((prevIdx) => {
      let nextIdx = (prevIdx + 1) % players.length;
      // Skip eliminated players
      while (eliminated.includes(players[nextIdx].id) && eliminated.length < players.length - 1) {
        nextIdx = (nextIdx + 1) % players.length;
      }
      return nextIdx;
    });
    // Stay inside the active path environment — next player rolls from their
    // current tile. The Journey Begins screen is only shown once at game start,
    // never between turns.
    setShowPopup(false);
    setZoomedTile(null);
    setFocusedPathIndex(null);
    setIsPawnMoving(false);
    setDiceValue(null);
    setIsRolling(false);
    setPhase('playing');
  };
  const handleCareerSwitchSelection = (pathIndex) => {
    setPendingNewPath(pathIndex);
  };
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
        return {
          ...p,
          money: p.money + realmTotalLoss,
          pathIndex: pendingNewPath,
          job: randomJob,
          position: newPos
        };
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
      const np = prev.map((p, i) => {
        if (i !== currentPlayerIndex) return p;
        const pathIdx = p.pathIndex !== null ? p.pathIndex : 0;
        const pathLength = activePathTiles[pathIdx].length;
        const updated = {
          ...p
        };
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
      return np;
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
  // Handle skip turns
  useEffect(() => {
    if (phase === 'playing' && !showPopup && !isRolling && !isPawnMoving && !jobEffectMessage) {
      const cp = players[currentPlayerIndex];
      if (cp.skipNextTurn && !eliminatedPlayers.includes(cp.id)) {
        setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? {
          ...p,
          skipNextTurn: false
        } : p));
        setTimeout(() => advanceToNextPlayer(), 1500);
      }
    }
  }, [currentPlayerIndex, phase, showPopup, isRolling, isPawnMoving, jobEffectMessage, eliminatedPlayers]);
  const DiceIcon = diceValue ? [Dice1Icon, Dice2Icon, Dice3Icon, Dice4Icon, Dice5Icon, Dice6Icon][diceValue - 1] : DicesIcon;
  const currentChaosScene = chaosRealmScenes[chaosSceneIndex] ?? CHAOS_REALM_SCENES[0];
  const chaosSceneCount = Math.max(1, chaosRealmScenes.length);
  // ===================== RENDER =====================
  return <div className="min-h-screen bg-gradient-to-br from-pink-100 via-lavender-100 to-blue-100 overflow-hidden font-sans select-none">
      <FloatingParticles count={40} />

      {/* ========== SETUP ========== */}
      {phase === 'setup' && <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
          <motion.div initial={{
        opacity: 0,
        scale: 0.9,
        y: 30
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} transition={{
        type: 'spring',
        stiffness: 80,
        damping: 20
      }} className="bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-[0_20px_80px_rgba(168,85,247,0.15)] border border-white/80 max-w-2xl w-full text-center relative overflow-hidden">
          
            {/* Decorative glows */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl" />
            <div className="absolute -top-8 -left-8 rotate-12">
              <GlitterHeart size={50} />
            </div>
            <div className="absolute -bottom-8 -right-8 -rotate-12">
              <GlitterHeart size={50} />
            </div>

            <motion.div animate={{
          y: [0, -5, 0]
        }} transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}>
            
              <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-2 pb-1" style={{
            fontFamily: '"Dancing Script", cursive'
          }}>
              
                Trippin' Through Life
              </h1>
            </motion.div>
            <p className="text-purple-400 font-bold mb-2 text-lg">
              The chaotic game of glow-ups, breakdowns & tax season. 💀
            </p>

            {/* Education paths preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6 mt-4">
              {LIFE_PATHS.map((path, i) => <motion.div key={i} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3 + i * 0.1
          }} className={`${path.bgLight} ${path.borderColor} border rounded-xl p-2 text-center`}>
              
                  <span className="text-lg">{path.emoji}</span>
                  <p className={`text-[10px] font-bold ${path.textColor} leading-tight`}>
                
                    {path.name}
                  </p>
                </motion.div>)}
            </div>
            <p className="text-purple-700 font-bold mb-4">
              Life deals your hand.
            </p>

            <div className="space-y-3 mb-6 text-left">
              {players.map((player, index) => <motion.div key={player.id} initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: index * 0.05
          }} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-3 rounded-2xl border border-purple-100/50 shadow-sm">
              
                  <label className="relative cursor-pointer shrink-0 group">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleAvatarUpload(player.id, f);
              }} />
                
                    {player.avatar ? <div className={`w-12 h-12 rounded-full border-[3px] overflow-hidden shadow-lg shadow-purple-200/50 ${PLAYER_BORDER[player.color]}`}>
                  
                        <img src={player.avatar} alt="" className="w-full h-full object-cover" />
                  
                      </div> : <div className={`w-12 h-12 rounded-full ${PLAYER_COLORS[player.color]} shadow-lg flex items-center justify-center relative`}>
                  
                        <CameraIcon className="w-5 h-5 text-white/80" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow">
                          <span className="text-[8px] font-bold text-purple-500">
                            +
                          </span>
                        </div>
                      </div>}
                  </label>
                  <input type="text" value={player.name} onChange={(e) => updatePlayer(player.id, 'name', e.target.value)} className="flex-1 bg-transparent font-bold text-purple-800 text-lg outline-none min-w-0" placeholder={`Player ${index + 1}`} />
              
                  <select value={player.color} onChange={(e) => updatePlayer(player.id, 'color', e.target.value)} className="bg-white/80 border border-purple-200/50 rounded-xl px-2 py-1.5 text-purple-700 font-bold outline-none text-sm backdrop-blur-sm">
                
                    {(['pink', 'purple', 'blue', 'teal', 'gold', 'coral']).map((c) => <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>)}
                  </select>
                  {players.length > 2 && <button onClick={() => removePlayer(player.id)} className="text-rose-400 hover:text-rose-600 font-bold px-2">
                
                      ✕
                    </button>}
                </motion.div>)}
            </div>
            <p className="text-purple-400 text-sm font-medium mb-6">
              📸 Tap the circle to upload a profile pic!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {players.length < 6 && <button onClick={addPlayer} className="px-6 py-3 rounded-full bg-purple-100/80 text-purple-600 font-bold hover:bg-purple-200/80 transition-colors backdrop-blur-sm">
              
                  + Add Player
                </button>}
              <motion.button onClick={dealStartingHands} whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.98
          }} className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xl shadow-[0_8px_30px_rgba(236,72,153,0.3)] hover:shadow-[0_12px_40px_rgba(236,72,153,0.4)] transition-shadow">
              
                DEAL STARTING HANDS 🃏
              </motion.button>
            </div>
          </motion.div>
        </div>}

      {/* ========== STARTING DEAL ========== */}
      {phase === 'starting_deal' && <div className="absolute inset-0 overflow-hidden bg-[#12091f] flex flex-col text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.35),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.24),transparent_34%),linear-gradient(135deg,#12091f_0%,#1b1230_52%,#231124_100%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <FloatingParticles count={24} />

          <div className="relative z-10 px-4 pt-8 pb-4 text-center shrink-0">
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.32em] text-pink-200/80">
              Opening Deal
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              Life deals your hand.
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base font-semibold text-white/70">
              Education sets the starting position. Your decisions decide the story.
            </p>
          </div>

          {!dealRevealReady ? <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-10">
            <div className="relative w-full max-w-xl min-h-[420px] flex flex-col items-center justify-center">
              <div className="absolute inset-0 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-md" />
              <div className="relative h-52 w-64 mb-8">
                {[0, 1, 2, 3, 4].map((card) => <motion.div key={card} className="absolute left-1/2 top-1/2 h-40 w-28 rounded-2xl border border-white/20 bg-gradient-to-br from-violet-500/95 via-fuchsia-500/95 to-orange-400/95 shadow-2xl" initial={{
              x: '-50%',
              y: '-50%',
              rotate: (card - 2) * 8,
              scale: 0.92
            }} animate={{
              x: ['-50%', `${-78 + card * 38}%`, '-50%'],
              y: ['-50%', `${-54 + Math.abs(card - 2) * 10}%`, '-50%'],
              rotate: [(card - 2) * 8, (card - 2) * 18, (card - 2) * 6],
              scale: [0.92, 1.02, 0.96]
            }} transition={{
              duration: 1.05,
              delay: card * 0.04,
              ease: [0.22, 1, 0.36, 1]
            }}>
                  <div className="absolute inset-2 rounded-xl border border-white/25" />
                  <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white/90">
                    {card === 2 ? 'TTL' : '•'}
                  </div>
                </motion.div>)}
              </div>
              <motion.div initial={{
            opacity: 0,
            y: 12
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.28
          }} className="relative text-center">
                <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">
                  Shuffling paths, jobs, and first twists
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  {[0, 1, 2].map((dot) => <motion.span key={dot} className="h-2 w-2 rounded-full bg-pink-300" animate={{
                opacity: [0.25, 1, 0.25],
                scale: [1, 1.4, 1]
              }} transition={{
                duration: 0.75,
                repeat: Infinity,
                delay: dot * 0.15
              }} />)}
                </div>
              </motion.div>
            </div>
          </div> : <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-8">
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
            return <motion.div key={player.id} initial={{
              opacity: 0,
              y: 34,
              rotateX: -12,
              scale: 0.96
            }} animate={{
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1
            }} transition={{
              delay: index * 0.16,
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1]
            }} className="overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/[0.075] shadow-[0_20px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl">

                    <div className="relative p-5">
                      <div className="absolute inset-x-0 top-0 h-1" style={{
                  background: `linear-gradient(90deg, transparent, ${path.glowColor}, transparent)`
                }} />
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
                            Player {index + 1}
                          </p>
                          <h2 className="text-2xl font-black text-white">{player.name}</h2>
                        </div>
                        {player.avatar ? <img src={player.avatar} alt="" className="h-14 w-14 rounded-2xl object-cover border border-white/30 shadow-lg" /> : <div className={`h-14 w-14 rounded-2xl ${PLAYER_COLORS[player.color]} border border-white/30 flex items-center justify-center text-white text-xl font-black shadow-lg`}>
                            {player.name.charAt(0).toUpperCase()}
                          </div>}
                      </div>

                      <div className="space-y-2.5">
                        <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                              Education
                            </p>
                            <span className="text-2xl">{path.emoji}</span>
                          </div>
                          <h3 className="text-xl font-black text-white">{path.name}</h3>
                          <p className="mt-1 text-xs font-semibold leading-snug text-white/58">
                            {path.summary}
                          </p>
                        </section>

                        <section className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-100/70">
                            Starting income
                          </p>
                          {player.job && <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="text-3xl">{player.job.emoji}</span>
                                <div className="min-w-0">
                                  <h3 className="truncate font-black text-white">
                                    {player.job.name}
                                  </h3>
                                  <p className="truncate text-xs font-semibold text-white/55">
                                    {player.job.flavorText}
                                  </p>
                                </div>
                              </div>
                              <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-sm font-black text-emerald-100">
                                {player.job.wageDisplay || `$${player.job.wage}/hr`}
                              </span>
                            </div>}
                        </section>

                        {modifier && <section className={`${modifierTone} rounded-2xl border p-4`}>
                            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] opacity-70">
                              First twist
                            </p>
                            <div className="flex items-start gap-3">
                              <span className="text-3xl">{modifier.emoji}</span>
                              <div>
                                <h3 className="font-black">{modifier.title}</h3>
                                <p className="text-xs font-semibold opacity-70">
                                  {modifier.description}
                                </p>
                              </div>
                            </div>
                          </section>}
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2">
                          <p className="text-[9px] font-black uppercase tracking-wider text-white/40">
                            Cash
                          </p>
                          <p className={`text-base font-black ${player.money < 0 ? 'text-rose-200' : 'text-emerald-200'}`}>
                            ${player.money}
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2">
                          <p className="text-[9px] font-black uppercase tracking-wider text-white/40">
                            Chaos
                          </p>
                          <p className="text-base font-black text-violet-100">
                            {player.chaosTriggersRemaining}
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2">
                          <p className="text-[9px] font-black uppercase tracking-wider text-white/40">
                            Start
                          </p>
                          <p className="text-base font-black text-white">Tile 1</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>;
          })}
            </div>

            <motion.div initial={{
          opacity: 0,
          y: 16
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: players.length * 0.16 + 0.18
        }} className="max-w-3xl mx-auto mt-6 rounded-[1.75rem] border border-white/10 bg-white/[0.08] p-5 text-center shadow-xl backdrop-blur-xl">
              <p className="text-sm md:text-base font-semibold text-white/68 mb-4">
                Your first roll will zoom to your lane so the move is easy to follow.
                Shared life districts and chaos can affect anyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {startingHandReshuffles < STARTING_HAND_RESHUFFLE_LIMIT && <button onClick={reshuffleStartingHands} className="px-6 py-3 rounded-full border border-white/15 bg-white/10 text-white/80 font-extrabold hover:bg-white/15 transition">
                    Reshuffle Hand ({STARTING_HAND_RESHUFFLE_LIMIT - startingHandReshuffles} left)
                  </button>}
                <motion.button onClick={startPlaying} whileHover={{
              scale: 1.04
            }} whileTap={{
              scale: 0.98
            }} className="px-10 py-4 rounded-full bg-white text-[#26113c] font-black text-xl shadow-[0_12px_40px_rgba(255,255,255,0.22)]">
                  Take the First Roll
                </motion.button>
              </div>
            </motion.div>
          </div>}
        </div>}

      {/* ========== JOURNEY START ========== */}
      {phase === 'journey_start' && <JourneyStartScene players={players} onStartPlaying={startActualPlaying} />}

      {/* ========== PLAYING ========== */}
      {phase === 'playing' && <div className="absolute inset-0 flex flex-col">
          {/* Header */}
          <div className="p-3 flex justify-between items-center bg-white/50 backdrop-blur-xl border-b border-white/60 z-20 shadow-[0_4px_20px_rgba(168,85,247,0.08)]">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500" style={{
          fontFamily: '"Dancing Script", cursive'
        }}>
            
              Trippin' Through Life
            </h1>
            <div className="flex items-center gap-2">
              {players[currentPlayerIndex].avatar && <img src={players[currentPlayerIndex].avatar} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-white shadow" />}
              <div className={`px-3 py-1 rounded-full text-white font-bold text-xs shadow-lg ${PLAYER_COLORS[players[currentPlayerIndex].color]}`}>
              
                {players[currentPlayerIndex].name}
              </div>
              {players[currentPlayerIndex].job && <span className="text-sm">
                  {players[currentPlayerIndex].job.emoji}
                </span>}
              {players[currentPlayerIndex].pathIndex === 0 && players[currentPlayerIndex].studentLoanDebt > 0 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    💳 Loans
                  </span>}
              <span className={`font-bold text-sm ${players[currentPlayerIndex].money < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
              
                ${players[currentPlayerIndex].money}
              </span>
            </div>
          </div>

          {/* Job Effect Message */}
          <AnimatePresence>
            {jobEffectMessage && <motion.div initial={{
          opacity: 0,
          y: -20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur-2xl px-6 py-3 rounded-2xl shadow-[0_8px_30px_rgba(168,85,247,0.15)] border border-purple-200/50 text-center max-w-md">
            
                <p className="font-bold text-gray-800 text-lg">
                  {jobEffectMessage}
                </p>
              </motion.div>}
          </AnimatePresence>

          {/* Income Flash */}
          <AnimatePresence>
            {incomeFlash && <motion.div initial={{
          opacity: 0,
          y: 20,
          scale: 0.8
        }} animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }} exit={{
          opacity: 0,
          y: -30
        }} className="absolute top-16 right-4 z-40 bg-emerald-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-[0_4px_20px_rgba(16,185,129,0.4)]">
            
                {incomeFlash}
              </motion.div>}
          </AnimatePresence>

          {/* ===== THE BOARD ===== */}
          <div className="flex-1 relative overflow-hidden" style={{
        perspective: '1200px'
      }} ref={boardRef}>
          
            {/* Pastel-neon cyber city backdrop */}
            <CityBackdrop imageUrl="/ChatGPT_Image_May_6,_2026,_02_47_41_PM.png" />

            <FloatingParticles count={40} />
            <SparkleBurst active={showBurst} />

            {/* Cinematic Road View — 3 lanes overview, zooms to active player when rolling */}
            <RoadView paths={LIFE_PATHS} activePathTiles={activePathTiles} players={players} currentPlayerIndex={currentPlayerIndex} focusedPathIndex={focusedPathIndex} getTileById={getTileById} categoryStyles={CATEGORY_STYLES} playerColors={PLAYER_COLORS} />
          

            {/* 3D Dice Throw Overlay */}
            <AnimatePresence>
              {(isRolling || diceValue !== null) && <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[100]" style={{
            perspective: '1400px'
          }} initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }}>
              
                  {/* Ground shadow that pulses with the throw */}
                  <motion.div className="absolute bg-black/30 rounded-full blur-xl" style={{
              width: 130,
              height: 30,
              marginTop: 100
            }} initial={{
              scale: 0.3,
              opacity: 0
            }} animate={isRolling ? {
              scale: [0.3, 0.4, 0.6, 0.5, 0.9, 0.8, 1],
              opacity: [0, 0.2, 0.4, 0.3, 0.7, 0.6, 0.8]
            } : {
              scale: 1,
              opacity: 0.6
            }} transition={{
              duration: isRolling ? 1.8 : 0.4,
              times: isRolling ? [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1] : undefined
            }} />
              

                  {/* True 3D Dice Cube */}
                  <motion.div className="relative" style={{
              width: 128,
              height: 128,
              transformStyle: 'preserve-3d'
            }} initial={{
              x: -600,
              y: -400,
              scale: 0.6,
              rotateX: 0,
              rotateY: 0,
              rotateZ: -45
            }} animate={isRolling ? {
              x: [-600, -200, 100, -50, 30, -10, 0],
              y: [-400, -250, -350, 60, -40, 20, 0],
              scale: [0.6, 0.85, 1.15, 1.05, 1.1, 1, 1],
              rotateX: [0, 540, 1080, 1620, 1980, 2160, getDiceFaceRotation(diceValue).x],
              rotateY: [0, 720, 1260, 1800, 2160, 2340, getDiceFaceRotation(diceValue).y],
              rotateZ: [-45, 360, 720, 1080, 1260, 1380, 0]
            } : {
              x: 0,
              y: 0,
              scale: 1,
              rotateX: getDiceFaceRotation(diceValue).x,
              rotateY: getDiceFaceRotation(diceValue).y,
              rotateZ: 0
            }} transition={{
              duration: isRolling ? 1.8 : 0.4,
              ease: isRolling ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1],
              times: isRolling ? [0, 0.2, 0.4, 0.6, 0.75, 0.9, 1] : undefined
            }}>
                
                    {/* Front face — 1 */}
                    <DiceFace value={1} style={{
                transform: 'translateZ(64px)'
              }} />
                
                    {/* Back face — 6 */}
                    <DiceFace value={6} style={{
                transform: 'rotateY(180deg) translateZ(64px)'
              }} />
                
                    {/* Right face — 2 */}
                    <DiceFace value={2} style={{
                transform: 'rotateY(90deg) translateZ(64px)'
              }} />
                
                    {/* Left face — 5 */}
                    <DiceFace value={5} style={{
                transform: 'rotateY(-90deg) translateZ(64px)'
              }} />
                
                    {/* Top face — 3 */}
                    <DiceFace value={3} style={{
                transform: 'rotateX(90deg) translateZ(64px)'
              }} />
                
                    {/* Bottom face — 4 */}
                    <DiceFace value={4} style={{
                transform: 'rotateX(-90deg) translateZ(64px)'
              }} />
                
                  </motion.div>
                </motion.div>}
            </AnimatePresence>

            {/* Tile Popup */}
            <AnimatePresence>
              {showPopup && zoomedTile !== null && <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="absolute inset-0 flex items-center justify-center z-50 p-4 bg-black/20 backdrop-blur-sm">
              
                  <motion.div initial={{
              scale: 0.7,
              y: 30
            }} animate={{
              scale: 1,
              y: 0
            }} exit={{
              scale: 0.7,
              y: 30
            }} transition={{
              type: 'spring',
              stiffness: 100,
              damping: 18
            }} className={`bg-white/90 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-4 ${CATEGORY_STYLES[getTileById(zoomedTile).category].border} max-w-md w-full text-center`}>
                
                    {createElement(CATEGORY_STYLES[getTileById(zoomedTile).category].icon, {
                className: `w-16 h-16 mx-auto mb-3 ${getTileById(zoomedTile).category === 'money_loss' ? 'text-red-500 opacity-90' : getTileById(zoomedTile).effect === 'money_gain' ? 'text-emerald-500 opacity-90' : 'opacity-70'}`
              })}
                    <div className={`inline-block px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-3 ${getTileById(zoomedTile).category === 'money_loss' ? 'bg-red-100 text-red-600' : getTileById(zoomedTile).effect === 'money_gain' ? 'bg-emerald-100 text-emerald-600' : 'bg-black/5 text-black/50'}`}>
                  
                      {getTileById(zoomedTile).category === 'money_loss' ? '💸 money hit' : getTileById(zoomedTile).effect === 'money_gain' ? '💰 money win' : getTileById(zoomedTile).category}
                    </div>
                    <h2 className={`font-heading text-2xl md:text-3xl font-bold mb-3 ${getTileById(zoomedTile).category === 'money_loss' ? 'text-red-700' : getTileById(zoomedTile).effect === 'money_gain' ? 'text-emerald-700' : 'text-gray-800'}`}>
                  
                      {getTileById(zoomedTile).name}
                    </h2>
                    <p className="text-lg font-bold text-gray-500 mb-2">
                      {getTileById(zoomedTile).actionText}
                    </p>
                    {getTileById(zoomedTile).effect === 'money_loss' && getTileById(zoomedTile).effectValue && <motion.div initial={{
                scale: 0.5,
                opacity: 0
              }} animate={{
                scale: 1,
                opacity: 1,
                x: [0, -4, 4, -4, 4, 0]
              }} transition={{
                duration: 0.5
              }} className="text-3xl font-bold text-red-600 mb-4 py-2 px-4 bg-red-50 rounded-2xl border-2 border-red-200 inline-block">
                  
                          -${Math.abs(getTileById(zoomedTile).effectValue)}
                        </motion.div>}
                    {getTileById(zoomedTile).effect === 'money_gain' && getTileById(zoomedTile).effectValue && <motion.div initial={{
                scale: 0.5,
                opacity: 0
              }} animate={{
                scale: [1, 1.15, 1],
                opacity: 1
              }} transition={{
                duration: 0.5,
                ease: 'easeOut'
              }} className="text-3xl font-bold text-emerald-600 mb-4 py-2 px-4 bg-emerald-50 rounded-2xl border-2 border-emerald-200 inline-block">
                  
                          +${getTileById(zoomedTile).effectValue}
                        </motion.div>}
                    {getTileById(zoomedTile).effect !== 'money_loss' && getTileById(zoomedTile).effect !== 'money_gain' && <div className="mb-4" />}
                    <motion.button onClick={applyEffectAndNextTurn} whileHover={{
                scale: 1.03
              }} whileTap={{
                scale: 0.98
              }} className="w-full py-3 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold text-lg shadow-lg">
                  
                      {zoomedTile === 29 ? 'Claim Victory!' : 'Next Player'}
                    </motion.button>
                  </motion.div>
                </motion.div>}
            </AnimatePresence>
          </div>

          {/* Transportation Event Popup */}
          <AnimatePresence>
            {transportEvent && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="absolute inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm">
            
                <motion.div initial={{
            scale: 0.6,
            y: 40
          }} animate={{
            scale: 1,
            y: 0
          }} exit={{
            scale: 0.6,
            y: 40,
            opacity: 0
          }} transition={{
            type: 'spring',
            stiffness: 120,
            damping: 16
          }} className="bg-white/95 backdrop-blur-2xl p-7 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border-2 border-orange-200 max-w-sm w-full text-center">
              
                  <motion.div initial={{
              scale: 0
            }} animate={{
              scale: 1,
              rotate: [0, -10, 10, -5, 0]
            }} transition={{
              duration: 0.5,
              delay: 0.1
            }} className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4 border-2 border-orange-200">
                
                    <span className="text-3xl">{transportEvent.emoji}</span>
                  </motion.div>
                  <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-bold text-xs uppercase tracking-wider mb-3">
                    🚗 Transportation
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {transportEvent.name}
                  </h3>
                  <motion.div initial={{
              scale: 0.5,
              opacity: 0
            }} animate={{
              scale: 1,
              opacity: 1,
              x: [0, -3, 3, -3, 0]
            }} transition={{
              duration: 0.4,
              delay: 0.2
            }} className="text-2xl font-bold text-orange-600 mb-5 py-2 px-4 bg-orange-50 rounded-2xl border-2 border-orange-200 inline-block">
                
                    -${Math.abs(transportEvent.amount)}
                  </motion.div>
                  <p className="text-gray-400 text-sm font-medium mb-5">
                    Life just charged you again 😒
                  </p>
                  <motion.button onClick={dismissTransportEvent} whileHover={{
              scale: 1.03
            }} whileTap={{
              scale: 0.98
            }} className="w-full py-3 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 text-white font-bold text-base shadow-lg shadow-orange-400/20">
                
                    Ugh, fine 😒
                  </motion.button>
                </motion.div>
              </motion.div>}
          </AnimatePresence>

          {/* Bottom Bar */}
          <div className="bg-white/60 backdrop-blur-2xl border-t border-white/70 p-3 md:p-4 z-20 shadow-[0_-10px_40px_rgba(168,85,247,0.06)]">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap justify-center gap-2 flex-1">
                {players.map((player, i) => {
              const isEliminated = eliminatedPlayers.includes(player.id);
              return <motion.div key={player.id} initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: i * 0.1
              }} className={`flex items-center gap-2 ${isEliminated ? 'opacity-40 grayscale' : ''}`}>
                    
                      <div className={`w-6 h-6 rounded-full ${isEliminated ? 'bg-gray-400' : PLAYER_COLORS[player.color]} flex items-center justify-center text-white font-bold text-xs`}>
                      
                        {isEliminated ? '💀' : player.name.charAt(0)}
                      </div>
                      <span className={`text-sm font-bold ${isEliminated ? 'text-gray-500 line-through' : player.money < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                      
                        ${player.money}
                      </span>
                    </motion.div>;
            })}
              </div>
              <div className="flex items-center gap-2 min-h-[44px]">
                <AnimatePresence>
                  {!isRolling && !isPawnMoving && !showPopup && <motion.button key="roll-dice-btn" onClick={rollDice} initial={{
                opacity: 0,
                scale: 0.85
              }} animate={{
                opacity: 1,
                scale: 1
              }} exit={{
                opacity: 0,
                scale: 0.85
              }} transition={{
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1]
              }} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="px-6 py-3 rounded-full font-black text-sm transition-colors shadow-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-pink-500/50">
                  
                      {players[currentPlayerIndex].position === 0 && players[currentPlayerIndex].turnsPlayed === 0 ? '🎲 Roll First Move' : '🎲 Roll Dice'}
                    </motion.button>}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>}

      {/* ========== CHAOS REALM ========== */}
      {phase === 'chaos_realm' && <div className="absolute inset-0 bg-gradient-to-b from-red-950 via-black to-red-950 flex flex-col overflow-hidden z-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(127,29,29,0.36),transparent_34%),linear-gradient(180deg,rgba(8,10,24,0.96)_0%,rgba(15,5,12,0.95)_45%,rgba(5,5,8,1)_100%)]" />
            <motion.div className="absolute inset-x-0 top-0 h-44 bg-slate-950/80 blur-sm" animate={{
          opacity: [0.7, 0.95, 0.72]
        }} transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut'
        }} />
            {[0, 1, 2].map((bolt) => <motion.div key={`lightning-${bolt}`} className="absolute top-0 h-48 w-px bg-red-100" style={{
          left: `${24 + bolt * 24}%`,
          boxShadow: '0 0 24px rgba(248,113,113,0.95), 0 0 70px rgba(239,68,68,0.6)',
          transform: `skewX(${bolt % 2 === 0 ? -18 : 14}deg)`
        }} animate={{
          opacity: [0, 0, 1, 0]
        }} transition={{
          duration: 2.8 + bolt * 0.5,
          repeat: Infinity,
          delay: bolt * 0.85,
          times: [0, 0.72, 0.76, 0.82]
        }} />)}
            {[0, 1, 2, 3, 4, 5].map((building) => <div key={`chaos-building-${building}`} className="absolute bottom-0 rounded-t-xl border-t border-red-500/20 bg-black/70" style={{
          left: `${building * 17 - 4}%`,
          width: `${14 + building % 2 * 6}%`,
          height: `${34 + building % 3 * 12}%`,
          boxShadow: '0 0 28px rgba(127,29,29,0.32), inset 0 1px 0 rgba(248,113,113,0.12)'
        }}>
                <div className="absolute inset-x-3 top-5 grid grid-cols-3 gap-2">
                  {Array.from({ length: 18 }).map((_, windowIndex) => <span key={windowIndex} className="h-1 rounded-sm" style={{
              background: windowIndex % 5 === 0 ? 'rgba(248,113,113,0.82)' : 'rgba(255,255,255,0.07)',
              boxShadow: windowIndex % 5 === 0 ? '0 0 10px rgba(248,113,113,0.9)' : undefined
            }} />)}
                </div>
                {building % 2 === 0 && <div className="absolute left-3 top-16 rotate-[-8deg] rounded border border-red-500/40 bg-black/80 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-red-400 shadow-[0_0_18px_rgba(239,68,68,0.45)]">
                    BROKEN
                  </div>}
              </div>)}
            <div className="absolute inset-x-0 bottom-0 h-1/2" style={{
          background: 'linear-gradient(90deg, rgba(127,29,29,0.4) 0 2px, transparent 2px 18%, transparent 82%, rgba(127,29,29,0.4) 82% calc(82% + 2px), transparent calc(82% + 2px)), radial-gradient(ellipse at 50% 100%, rgba(239,68,68,0.24), transparent 55%)'
        }} />
            {[0, 1, 2, 3].map((trash) => <div key={`trash-${trash}`} className="absolute bottom-16 h-8 w-10 rounded-md border border-red-900/70 bg-slate-900/90" style={{
          left: `${10 + trash * 25}%`,
          transform: `rotate(${trash % 2 === 0 ? -15 : 12}deg)`,
          boxShadow: '0 10px 18px rgba(0,0,0,0.5)'
        }}>
                <span className="absolute -right-3 top-5 h-2 w-8 rounded-full bg-red-950/80" />
              </div>)}
            {Array.from({ length: 34 }).map((_, rain) => <motion.span key={`chaos-rain-${rain}`} className="absolute top-[-12%] h-16 w-px rounded-full bg-sky-200/40" style={{
          left: `${rain / 34 * 100}%`
        }} animate={{
          y: ['0vh', '118vh'],
          opacity: [0, 0.8, 0]
        }} transition={{
          duration: 0.9 + rain % 5 * 0.08,
          repeat: Infinity,
          delay: rain * 0.035,
          ease: 'linear'
        }} />)}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_0%,transparent_48%,rgba(0,0,0,0.62)_100%)]" />
          </div>
          <FloatingParticles count={60} />

          {/* Entry Transition Overlay */}
          <AnimatePresence>
            {showChaosTransition && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 0.5
        }} className="absolute inset-0 z-50 flex items-center justify-center bg-black">
            
                <motion.div initial={{
            scale: 0.8,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} transition={{
            delay: 0.3,
            duration: 0.8
          }} className="text-center">
              
                  <motion.div animate={{
              y: [0, -10, 0]
            }} transition={{
              repeat: Infinity,
              duration: 2
            }} className="text-8xl mb-6">
                
                    🔥
                  </motion.div>
                  <h1 className="text-4xl md:text-6xl font-bold text-red-600 tracking-widest uppercase" style={{
              textShadow: '0 0 30px rgba(220,38,38,0.8)'
            }}>
                
                    Entering the
                    <br />
                    Chaos Realm
                  </h1>
                </motion.div>
              </motion.div>}
          </AnimatePresence>

          <div className="relative z-30 flex min-h-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-4 p-5">
              <div className="max-w-xs">
                <h2 className="text-4xl font-black uppercase tracking-tight text-purple-300 drop-shadow-[0_0_24px_rgba(168,85,247,0.8)] md:text-6xl" style={{
              fontFamily: '"Dancing Script", cursive'
            }}>
                  Chaos Realm
                </h2>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-purple-200/70">
                  Choose wisely
                </p>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-white/70">
                  {currentChaosScene.leftNote}
                </p>
              </div>
              <div className="rounded-2xl border border-red-400/30 bg-black/55 px-4 py-3 text-right backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-200/65">
                  Scene {chaosSceneIndex + 1} / {chaosSceneCount}
                </p>
                <p className="mt-1 text-sm font-black text-red-100">
                  Impact: {realmTotalLoss >= 0 ? '+' : '-'}${Math.abs(realmTotalLoss)}
                </p>
              </div>
            </div>

            <div className="relative flex-1 overflow-hidden px-5 pb-4">
              <div className="absolute inset-x-[18%] bottom-[24%] h-[42%] rounded-[50%] opacity-70 blur-2xl" style={{
            background: `radial-gradient(circle, ${currentChaosScene.sceneAccent}55, transparent 62%)`
          }} />
              <div className="absolute left-[35%] top-[20%] h-[34%] w-[34%] rounded-t-xl border border-white/10 bg-black/70 shadow-[0_24px_80px_rgba(0,0,0,0.75)]">
                <div className="absolute inset-x-8 top-4 rounded-md border border-red-400/35 bg-black/80 py-2 text-center text-3xl font-black uppercase tracking-[0.38em] text-red-400 shadow-[0_0_28px_rgba(239,68,68,0.6)]">
                  GAS
                </div>
                <div className="absolute bottom-0 left-1/2 h-28 w-20 -translate-x-1/2 rounded-t-md border border-white/10 bg-slate-950/85" />
                <div className="absolute bottom-10 right-8 rounded border border-fuchsia-400/30 bg-black/80 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-fuchsia-300 shadow-[0_0_18px_rgba(217,70,239,0.5)]">
                  OPEN
                </div>
              </div>
              <div className="absolute bottom-[12%] left-[10%] h-24 w-48 -rotate-6 rounded-2xl border border-white/10 bg-black/70 shadow-[0_22px_42px_rgba(0,0,0,0.65)]">
                <div className="absolute -top-10 left-6 h-12 w-24 rounded-t-[60%] border border-white/10 bg-black/80" />
                <div className="absolute left-8 top-8 h-3 w-16 rounded-full bg-amber-200/70 shadow-[0_0_18px_rgba(251,191,36,0.8)]" />
                <div className="absolute -right-8 top-8 h-16 w-20 rounded-full bg-slate-300/10 blur-lg" />
              </div>
              <div className="absolute bottom-[10%] right-[8%] h-36 w-16 rotate-[-22deg] rounded-full bg-black/80 shadow-[0_0_28px_rgba(0,0,0,0.9)]">
                <div className="absolute -left-10 top-2 h-20 w-20 rounded-full bg-slate-100/20 blur-xl" />
              </div>
              <div className="absolute inset-x-[6%] bottom-0 h-[42%]" style={{
            background: 'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.16), transparent 58%), linear-gradient(90deg, rgba(250,204,21,0.28) 0 2px, transparent 2px 20%, transparent 80%, rgba(250,204,21,0.28) 80% calc(80% + 2px), transparent calc(80% + 2px))',
            clipPath: 'polygon(0 100%, 27% 0, 73% 0, 100% 100%)'
          }} />

              <motion.div key={currentChaosScene.title} initial={{
            opacity: 0,
            y: 18
          }} animate={{
            opacity: 1,
            y: 0
          }} className="absolute left-1/2 top-[14%] w-[min(640px,76vw)] -translate-x-1/2 rounded-[2rem] border border-white/12 bg-black/35 p-5 text-center shadow-[0_22px_80px_rgba(0,0,0,0.45)] backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-[0.32em]" style={{
              color: currentChaosScene.sceneAccent
            }}>
                  {currentChaosScene.location}
                </p>
                <h3 className="mt-2 text-3xl font-black text-white md:text-5xl">
                  {currentChaosScene.title}
                </h3>
                <p className="mx-auto mt-3 max-w-lg text-sm font-semibold text-white/70">
                  {currentChaosScene.subtitle}
                </p>
              </motion.div>
            </div>

            <div className="relative z-40 border-t border-white/10 bg-black/60 px-4 py-4 backdrop-blur-xl">
              {!chaosOutcome ? <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-3">
                  {currentChaosScene.choices.map((choice) => <motion.button key={choice.label} onClick={() => handleChaosChoice(choice)} whileHover={{
              y: -4,
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} className={`rounded-2xl border p-4 text-left transition ${choice.tone === 'risk' ? 'border-cyan-400/35 bg-cyan-950/35 hover:bg-cyan-900/45' : choice.tone === 'hope' ? 'border-purple-400/35 bg-purple-950/35 hover:bg-purple-900/45' : 'border-amber-300/35 bg-amber-950/30 hover:bg-amber-900/40'}`}>
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-black/40 text-2xl">
                          {choice.icon}
                        </span>
                        <div>
                          <h4 className="font-black uppercase tracking-wide text-white">{choice.label}</h4>
                          <p className="mt-1 text-xs font-semibold text-white/62">{choice.description}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
                        Choose this
                      </p>
                    </motion.button>)}
                </div> : <motion.div initial={{
            opacity: 0,
            y: 14
          }} animate={{
            opacity: 1,
            y: 0
          }} className="mx-auto flex max-w-4xl flex-col items-center gap-4 rounded-[1.75rem] border border-white/12 bg-black/70 p-5 text-center shadow-[0_18px_60px_rgba(0,0,0,0.5)] md:flex-row md:text-left">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-3xl">
                    {chaosOutcome.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-purple-200/70">
                      Hidden consequence revealed
                    </p>
                    <h4 className="mt-1 text-2xl font-black text-white">{chaosOutcome.outcomeTitle}</h4>
                    <p className="mt-1 text-sm font-semibold text-white/68">{chaosOutcome.outcomeText}</p>
                    <p className={`mt-2 text-sm font-black ${chaosOutcome.moneyDelta >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                      {chaosOutcome.moneyDelta >= 0 ? '+' : '-'}${Math.abs(chaosOutcome.moneyDelta)}
                      {chaosOutcome.skipNextTurn ? ' · next turn starts shaken' : ''}
                    </p>
                  </div>
                  <button onClick={continueChaosRealm} className="rounded-full bg-white px-7 py-3 font-black text-slate-950 shadow-[0_0_24px_rgba(255,255,255,0.22)]">
                    {chaosOutcome.escape || chaosSceneIndex >= chaosRealmScenes.length - 1 ? 'Return to the Board' : 'Keep Moving'}
                  </button>
                </motion.div>}
            </div>
          </div>
        </div>}

      {/* ========== CAREER SWITCH ========== */}
      {phase === 'career_switch' && <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
          <motion.div initial={{
        opacity: 0,
        scale: 0.9,
        y: 30
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} transition={{
        type: 'spring',
        stiffness: 80,
        damping: 20
      }} className="bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-[0_20px_80px_rgba(168,85,247,0.15)] border border-white/80 max-w-3xl w-full text-center relative overflow-y-auto max-h-[90vh]">
          
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl" />

            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2" style={{
          fontFamily: '"Dancing Script", cursive'
        }}>
            
              Career Switch
            </h2>
            <p className="text-purple-400 font-bold mb-8">
              You're switching careers! Choose a new education lane...
            </p>

            <div className="space-y-4">
              {realmEvents.map((event, idx) => <motion.div key={idx} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: idx * 0.1
          }} className="p-4 rounded-2xl border-2 bg-yellow-50 border-yellow-200">
              
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💼</span>
                    <span className="font-bold text-gray-800">
                      {event.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    You lost{' '}
                    <span className="font-bold text-red-600">
                      ${Math.abs(event.amount)}
                    </span>
                  </p>
                </motion.div>)}
            </div>

            <div className="mt-6">
              <p className="text-lg text-gray-700 mb-4">
                Your work is changing, but the three education lanes stay simple
                for this foundation test.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {LIFE_PATHS.map((path, i) => {
              const pathJobs = getJobsForPath(i).slice(0, 3);
              return <motion.button key={i} onClick={() => handleCareerSwitchSelection(i)} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.98
              }} className={`p-4 rounded-2xl border-2 ${pendingNewPath === i ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' : 'bg-white/80 border-gray-200'} text-center`}>
                
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-2xl">{path.emoji}</span>
                    </div>
                    <p className="font-bold text-lg">{path.name}</p>
                    <p className="text-sm text-gray-500">
                      {pathJobs.map((job) => <span key={job.id} className="inline-block mr-1">
                          {job.emoji} {job.name}
                        </span>)}
                    </p>
                  </motion.button>;
            })}
              </div>
              <motion.button onClick={confirmCareerSwitch} whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.98
          }} className="mt-4 px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-lg shadow-lg">
              
                Confirm Switch
              </motion.button>
            </div>
          </motion.div>
        </div>}

      {/* ========== TAX EVENT ========== */}
      {phase === 'tax_event' && <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
          <motion.div initial={{
        opacity: 0,
        scale: 0.9,
        y: 30
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} transition={{
        type: 'spring',
        stiffness: 80,
        damping: 20
      }} className="bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-[0_20px_80px_rgba(168,85,247,0.15)] border border-white/80 max-w-3xl w-full text-center relative overflow-y-auto max-h-[90vh]">
          
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl" />

            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2" style={{
          fontFamily: '"Dancing Script", cursive'
        }}>
            
              Tax Season
            </h2>
            <p className="text-purple-400 font-bold mb-8">
              All players get taxed! How much will you have left?
            </p>

            <div className="space-y-4">
              {taxResults.map((result, idx) => <motion.div key={idx} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: idx * 0.1
          }} className="p-4 rounded-2xl border-2 bg-red-50 border-red-200">
              
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💸</span>
                    <span className="font-bold text-gray-800">
                      {result.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {result.emoji} {result.taxType} - ${result.taxed} remaining:
                    ${result.remaining}
                  </p>
                </motion.div>)}
            </div>

            <div className="mt-6">
              <motion.button onClick={closeTaxEvent} whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.98
          }} className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-lg">
              
                Close Tax Event
              </motion.button>
            </div>
          </motion.div>
        </div>}

      {/* ========== WINNER ========== */}
      {phase === 'winner' && <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
          <motion.div initial={{
        opacity: 0,
        scale: 0.9,
        y: 30
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} transition={{
        type: 'spring',
        stiffness: 80,
        damping: 20
      }} className="bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-[0_20px_80px_rgba(168,85,247,0.15)] border border-white/80 max-w-3xl w-full text-center relative overflow-y-auto max-h-[90vh]">
          
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl" />

            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2" style={{
          fontFamily: '"Dancing Script", cursive'
        }}>
            
              Congratulations!
            </h2>
            <p className="text-purple-400 font-bold mb-8">
              {winner?.name} has won the game!
            </p>

            <div className="space-y-4">
              <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.1
          }} className="p-4 rounded-2xl border-2 bg-green-50 border-green-200">
              
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🏆</span>
                  <span className="font-bold text-gray-800">Final Results</span>
                </div>
                <p className="text-sm text-gray-500">
                  {winner?.name} has ${winner?.money} at the end!
                </p>
              </motion.div>
            </div>

            <div className="mt-6">
              <motion.button onClick={() => {
            setPhase('setup');
            setIsPawnAnimating(false);
            setPlayers([{
              id: '1',
              name: 'Player 1',
              color: 'pink',
              position: 0,
              skipNextTurn: false,
              avatar: null,
              job: null,
              money: 0,
              turnsPlayed: 0,
              roundsWithoutIncome: 0,
              evolved: false,
              pathIndex: null,
              inSchool: false,
              schoolTurnsLeft: 0,
              studentLoanDebt: 0,
              chaosTriggersRemaining: 0,
              startingModifier: null
            }, {
              id: '2',
              name: 'Player 2',
              color: 'purple',
              position: 0,
              skipNextTurn: false,
              avatar: null,
              job: null,
              money: 0,
              turnsPlayed: 0,
              roundsWithoutIncome: 0,
              evolved: false,
              pathIndex: null,
              inSchool: false,
              schoolTurnsLeft: 0,
              studentLoanDebt: 0,
              chaosTriggersRemaining: 0,
              startingModifier: null
            }]);
          }} whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.98
          }} className="px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-lg shadow-lg">
              
                Play Again
              </motion.button>
            </div>
          </motion.div>
        </div>}
    </div>;
}