import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── ALL CROSSROADS QUESTIONS ─────────────────────────────────────────────────
export const CROSSROADS_QUESTIONS = [
  // Career
  { id: 'c1', category: 'Career', emoji: '💼', question: 'Stay at your current job OR accept a new offer?',
    optionA: { label: 'Stay Put', emoji: '🛡️', effects: { money: 100, label: 'Stability bonus' }, trait: 'stable' },
    optionB: { label: 'New Offer', emoji: '🚀', effects: { money: [-200, 400], label: 'Risk/reward swing' }, trait: 'risk_taker' } },
  { id: 'c2', category: 'Career', emoji: '📣', question: 'Ask for a raise OR stay quiet?',
    optionA: { label: 'Ask for Raise', emoji: '💪', effects: { money: [150, 350], label: 'Could go either way' }, trait: 'ambitious' },
    optionB: { label: 'Stay Quiet', emoji: '🤫', effects: { money: -50, label: 'Missed opportunity' }, trait: 'reserved' } },
  { id: 'c3', category: 'Career', emoji: '🎓', question: 'Go back to school OR gain experience?',
    optionA: { label: 'Back to School', emoji: '📚', effects: { money: -300, future_bonus: 500, label: 'Upfront cost, future payoff' }, trait: 'educated' },
    optionB: { label: 'Gain Experience', emoji: '🔧', effects: { money: 200, label: 'Immediate income boost' }, trait: 'experienced' } },
  { id: 'c4', category: 'Career', emoji: '⚡', question: 'Start a side hustle OR focus on your career?',
    optionA: { label: 'Side Hustle', emoji: '💡', effects: { money: [-100, 400], label: 'High variance payoff' }, trait: 'entrepreneur' },
    optionB: { label: 'Focus on Career', emoji: '🎯', effects: { money: 150, label: 'Steady climb' }, trait: 'focused' } },
  { id: 'c5', category: 'Career', emoji: '📊', question: 'Become a manager OR stay independent?',
    optionA: { label: 'Become Manager', emoji: '👔', effects: { money: 250, label: 'Higher pay, more stress' }, trait: 'leader' },
    optionB: { label: 'Stay Independent', emoji: '🎸', effects: { money: 50, label: 'Freedom maintained' }, trait: 'independent' } },
  { id: 'c6', category: 'Career', emoji: '🏠', question: 'Work from home OR return to the office?',
    optionA: { label: 'Work From Home', emoji: '💻', effects: { money: 80, label: 'Saved commute costs' }, trait: 'remote_worker' },
    optionB: { label: 'Return to Office', emoji: '🏢', effects: { money: -80, future_bonus: 200, label: 'Visibility pays off later' }, trait: 'office_worker' } },
  { id: 'c7', category: 'Career', emoji: '🌟', question: 'Take a risky dream job OR keep a secure paycheck?',
    optionA: { label: 'Dream Job', emoji: '✨', effects: { money: [-200, 600], label: 'Could change everything' }, trait: 'dreamer' },
    optionB: { label: 'Secure Paycheck', emoji: '🔒', effects: { money: 100, label: 'Safety first' }, trait: 'cautious' } },
  { id: 'c8', category: 'Career', emoji: '🛍️', question: 'Start your own business OR work for someone else?',
    optionA: { label: 'Own Business', emoji: '🏪', effects: { money: [-400, 800], label: 'Make or break moment' }, trait: 'entrepreneur' },
    optionB: { label: 'Work for Others', emoji: '👷', effects: { money: 120, label: 'Steady income' }, trait: 'employee' } },
  { id: 'c9', category: 'Career', emoji: '✈️', question: 'Relocate for work OR stay where you are?',
    optionA: { label: 'Relocate', emoji: '🌍', effects: { money: [-200, 350], label: 'New city, new chances' }, trait: 'adventurous' },
    optionB: { label: 'Stay Put', emoji: '🏡', effects: { money: 50, label: 'Roots run deep' }, trait: 'rooted' } },
  { id: 'c10', category: 'Career', emoji: '🏆', question: 'Take a promotion OR prioritize family time?',
    optionA: { label: 'Take Promotion', emoji: '📈', effects: { money: 300, label: 'Big career leap' }, trait: 'ambitious' },
    optionB: { label: 'Family First', emoji: '❤️', effects: { money: -100, label: 'Priceless memories' }, trait: 'family_oriented' } },

  // Money
  { id: 'm1', category: 'Money', emoji: '🏘️', question: 'Buy a home OR continue renting?',
    optionA: { label: 'Buy a Home', emoji: '🏠', effects: { money: -500, future_bonus: 700, label: 'Big investment, future equity' }, trait: 'homeowner' },
    optionB: { label: 'Keep Renting', emoji: '🔑', effects: { money: -150, label: 'Flexible, lower upfront' }, trait: 'renter' } },
  { id: 'm2', category: 'Money', emoji: '💰', question: 'Save the money OR spend it?',
    optionA: { label: 'Save It', emoji: '🐖', effects: { money: 200, label: 'Future security' }, trait: 'saver' },
    optionB: { label: 'Spend It', emoji: '🛒', effects: { money: -200, label: 'YOLO tax' }, trait: 'spender' } },
  { id: 'm3', category: 'Money', emoji: '📈', question: 'Invest it OR pay off debt?',
    optionA: { label: 'Invest', emoji: '📊', effects: { money: [-100, 500], label: 'Market gamble' }, trait: 'investor' },
    optionB: { label: 'Pay Off Debt', emoji: '✂️', effects: { money: -200, future_bonus: 300, label: 'Long-term freedom' }, trait: 'debt_free' } },
  { id: 'm4', category: 'Money', emoji: '🌴', question: 'Take the vacation OR stay on budget?',
    optionA: { label: 'Take Vacation', emoji: '🏖️', effects: { money: -350, label: 'Worth every penny?' }, trait: 'adventurous' },
    optionB: { label: 'Stay on Budget', emoji: '📋', effects: { money: 150, label: 'Disciplined saver' }, trait: 'disciplined' } },
  { id: 'm5', category: 'Money', emoji: '🚗', question: 'Buy the dream car OR drive the old one?',
    optionA: { label: 'Dream Car', emoji: '🏎️', effects: { money: -600, label: 'Living the fantasy' }, trait: 'spender' },
    optionB: { label: 'Keep Old Car', emoji: '🚙', effects: { money: 100, label: 'Practical choice' }, trait: 'frugal' } },
  { id: 'm6', category: 'Money', emoji: '👨‍👩‍👧', question: 'Help family financially OR protect your finances?',
    optionA: { label: 'Help Family', emoji: '❤️', effects: { money: -250, label: 'Love costs something' }, trait: 'generous' },
    optionB: { label: 'Protect Finances', emoji: '🛡️', effects: { money: 50, label: 'Self-preservation' }, trait: 'practical' } },
  { id: 'm7', category: 'Money', emoji: '🎲', question: 'Take the financial risk OR play it safe?',
    optionA: { label: 'Take the Risk', emoji: '🔥', effects: { money: [-300, 700], label: 'High stakes' }, trait: 'risk_taker' },
    optionB: { label: 'Play it Safe', emoji: '⚓', effects: { money: 75, label: 'Steady wins the race' }, trait: 'cautious' } },

  // Love & Relationships
  { id: 'r1', category: 'Love', emoji: '💑', question: 'Move in together OR keep separate homes?',
    optionA: { label: 'Move In Together', emoji: '🏠', effects: { money: 200, label: 'Split those bills!' }, trait: 'committed' },
    optionB: { label: 'Keep Separate', emoji: '🔑', effects: { money: -150, label: 'Independence costs' }, trait: 'independent' } },
  { id: 'r2', category: 'Love', emoji: '💍', question: 'Get married OR stay committed without marriage?',
    optionA: { label: 'Get Married', emoji: '👰', effects: { money: -300, future_bonus: 250, label: 'Wedding costs, life gains' }, trait: 'married' },
    optionB: { label: 'Stay Committed', emoji: '💞', effects: { money: 50, label: 'No ring, no drama' }, trait: 'committed' } },
  { id: 'r3', category: 'Love', emoji: '👶', question: 'Have children OR remain child-free?',
    optionA: { label: 'Have Children', emoji: '👨‍👩‍👧', effects: { money: -400, label: 'Expensive but priceless' }, trait: 'parent' },
    optionB: { label: 'Stay Child-Free', emoji: '🌿', effects: { money: 200, label: 'Freedom & savings' }, trait: 'child_free' } },
  { id: 'r4', category: 'Love', emoji: '💔', question: 'Give love another chance OR stay single?',
    optionA: { label: 'Try Again', emoji: '💗', effects: { money: [-100, 200], label: 'Risky heart' }, trait: 'romantic' },
    optionB: { label: 'Stay Single', emoji: '🌟', effects: { money: 100, label: 'Solo glow-up' }, trait: 'independent' } },

  // Health
  { id: 'h1', category: 'Health', emoji: '🏋️', question: 'Join a gym OR exercise at home?',
    optionA: { label: 'Join Gym', emoji: '🏪', effects: { money: -60, label: 'Monthly commitment' }, trait: 'gym_goer' },
    optionB: { label: 'Home Workout', emoji: '🏠', effects: { money: 0, label: 'Free & effective' }, trait: 'self_disciplined' } },
  { id: 'h2', category: 'Health', emoji: '🧠', question: 'Start therapy OR self-reflect?',
    optionA: { label: 'Start Therapy', emoji: '🛋️', effects: { money: -200, future_bonus: 300, label: 'Invest in your mind' }, trait: 'therapy_goer' },
    optionB: { label: 'Self-Reflect', emoji: '📔', effects: { money: 0, label: 'Inner work' }, trait: 'introspective' } },
  { id: 'h3', category: 'Health', emoji: '😴', question: 'Get more sleep OR work more hours?',
    optionA: { label: 'More Sleep', emoji: '🛌', effects: { money: -100, future_bonus: 200, label: 'Rest is productive' }, trait: 'balanced' },
    optionB: { label: 'More Work', emoji: '⏰', effects: { money: 150, label: 'Grind now, rest later' }, trait: 'workaholic' } },

  // Family
  { id: 'f1', category: 'Family', emoji: '🏡', question: 'Move closer to family OR stay where you are?',
    optionA: { label: 'Move Closer', emoji: '🚚', effects: { money: -300, label: 'Moving costs' }, trait: 'family_oriented' },
    optionB: { label: 'Stay Put', emoji: '📍', effects: { money: 0, label: 'Your roots are here' }, trait: 'rooted' } },
  { id: 'f2', category: 'Family', emoji: '🐾', question: 'Adopt a pet OR stay pet-free?',
    optionA: { label: 'Adopt a Pet', emoji: '🐶', effects: { money: -150, label: 'Worth every penny' }, trait: 'pet_owner' },
    optionB: { label: 'Stay Pet-Free', emoji: '🌿', effects: { money: 50, label: 'No fur, no cost' }, trait: 'minimalist' } },

  // Adventure & Lifestyle
  { id: 'a1', category: 'Adventure', emoji: '🌍', question: 'Move to a new city OR stay put?',
    optionA: { label: 'New City', emoji: '🏙️', effects: { money: [-250, 300], label: 'Fresh start energy' }, trait: 'adventurous' },
    optionB: { label: 'Stay Put', emoji: '🏡', effects: { money: 50, label: 'Comfort of home' }, trait: 'rooted' } },
  { id: 'a2', category: 'Adventure', emoji: '✈️', question: 'Travel the world OR build your savings?',
    optionA: { label: 'Travel', emoji: '🌏', effects: { money: -400, label: 'Rich in experience' }, trait: 'world_traveler' },
    optionB: { label: 'Build Savings', emoji: '💰', effects: { money: 300, label: 'Security stacks up' }, trait: 'saver' } },
  { id: 'a3', category: 'Adventure', emoji: '🎯', question: 'Follow your heart OR follow logic?',
    optionA: { label: 'Follow Heart', emoji: '❤️', effects: { money: [-200, 400], label: 'Unpredictable path' }, trait: 'passionate' },
    optionB: { label: 'Follow Logic', emoji: '🧩', effects: { money: 100, label: 'Calculated move' }, trait: 'analytical' } },
  { id: 'a4', category: 'Adventure', emoji: '🏕️', question: 'Live in the city OR the country?',
    optionA: { label: 'City Life', emoji: '🏙️', effects: { money: -200, future_bonus: 300, label: 'Opportunities everywhere' }, trait: 'city_dweller' },
    optionB: { label: 'Country Life', emoji: '🌾', effects: { money: 100, label: 'Lower cost of living' }, trait: 'country_dweller' } },

  // Pure Chaos TTL
  { id: 'x1', category: 'Plot Twist', emoji: '🌀', question: 'Surprise twins OR surprise promotion?',
    optionA: { label: 'Surprise Twins', emoji: '👶👶', effects: { money: -500, label: 'Double the love, double the bill' }, trait: 'parent' },
    optionB: { label: 'Surprise Promotion', emoji: '🎉', effects: { money: 400, label: 'Your time to shine!' }, trait: 'ambitious' } },
  { id: 'x2', category: 'Plot Twist', emoji: '🤑', question: 'Win $10,000 OR erase one regret?',
    optionA: { label: 'Win $10,000', emoji: '💵', effects: { money: 1000, label: 'Bag secured!' }, trait: 'lucky' },
    optionB: { label: 'Erase a Regret', emoji: '✨', effects: { money: 200, future_bonus: 200, label: 'Peace of mind pays' }, trait: 'reflective' } },
  { id: 'x3', category: 'Plot Twist', emoji: '💫', question: 'Meet your soulmate OR land your dream job?',
    optionA: { label: 'Soulmate', emoji: '💕', effects: { money: -100, future_bonus: 300, label: 'Love is an investment' }, trait: 'romantic' },
    optionB: { label: 'Dream Job', emoji: '⭐', effects: { money: 500, label: 'Career peak achieved' }, trait: 'career_focused' } },

  // This Changes Everything
  { id: 'big1', category: 'This Changes Everything', emoji: '🌟', question: 'Become wealthy OR find true love?',
    optionA: { label: 'Become Wealthy', emoji: '💎', effects: { money: 800, label: 'Bag secured, but at a cost' }, trait: 'wealthy' },
    optionB: { label: 'Find True Love', emoji: '💞', effects: { money: -150, future_bonus: 400, label: 'Love fills the gaps' }, trait: 'in_love' } },
  { id: 'big2', category: 'This Changes Everything', emoji: '⏰', question: 'More time OR more money?',
    optionA: { label: 'More Time', emoji: '🕰️', effects: { money: -200, label: 'Time is the real flex' }, trait: 'balanced' },
    optionB: { label: 'More Money', emoji: '💰', effects: { money: 500, label: 'Stack it up' }, trait: 'money_focused' } },
  { id: 'big3', category: 'This Changes Everything', emoji: '🏆', question: 'Happiness OR achievement?',
    optionA: { label: 'Happiness', emoji: '😊', effects: { money: 0, future_bonus: 250, label: 'Joy compounds over time' }, trait: 'content' },
    optionB: { label: 'Achievement', emoji: '🥇', effects: { money: 350, label: 'Results speak loudest' }, trait: 'high_achiever' } },
  { id: 'big4', category: 'This Changes Everything', emoji: '🛤️', question: 'Write your own story OR let life surprise you?',
    optionA: { label: 'Write Your Story', emoji: '✍️', effects: { money: 150, label: 'Author of your fate' }, trait: 'intentional' },
    optionB: { label: 'Let Life Surprise', emoji: '🎁', effects: { money: [-200, 500], label: 'Chaos or gift?' }, trait: 'spontaneous' } },
];

// ─── LIFE SUMMARY ARCHETYPES ──────────────────────────────────────────────────
const LIFE_ARCHETYPES = [
  { id: 'entrepreneur', traits: ['entrepreneur', 'risk_taker', 'ambitious'], label: 'Self-Made Entrepreneur', emoji: '🏪', desc: 'You bet on yourself — and it shows.' },
  { id: 'corporate', traits: ['ambitious', 'leader', 'career_focused', 'focused'], label: 'Corporate Climber', emoji: '📈', desc: 'The ladder had your name on every rung.' },
  { id: 'family', traits: ['family_oriented', 'parent', 'committed', 'generous'], label: 'Family First Hero', emoji: '❤️', desc: 'You built something money can\'t buy.' },
  { id: 'traveler', traits: ['world_traveler', 'adventurous', 'spontaneous'], label: 'World Traveler', emoji: '🌍', desc: 'You collected stamps, not stuff.' },
  { id: 'freedom', traits: ['saver', 'debt_free', 'investor', 'frugal'], label: 'Financial Freedom Master', emoji: '💰', desc: 'Compound interest is your love language.' },
  { id: 'romantic', traits: ['romantic', 'in_love', 'committed', 'passionate'], label: 'Hopeless Romantic', emoji: '💕', desc: 'Love was always your north star.' },
  { id: 'balanced', traits: ['balanced', 'content', 'disciplined', 'self_disciplined'], label: 'The Balanced One', emoji: '⚖️', desc: 'You figured out what actually matters.' },
  { id: 'late_bloomer', traits: ['reflective', 'introspective', 'educated', 'therapy_goer'], label: 'Late Bloomer Success Story', emoji: '🌸', desc: 'You grew slowly — and beautifully.' },
  { id: 'community', traits: ['generous', 'family_oriented', 'independent'], label: 'Community Leader', emoji: '🤝', desc: 'You lifted others while you climbed.' },
  { id: 'survivor', traits: ['cautious', 'practical', 'rooted', 'reserved'], label: 'Debt Survivor', emoji: '💪', desc: 'You faced the worst and kept moving.' },
];

export function getLifeSummary(crossroadsDecisions) {
  const traitCounts = {};
  crossroadsDecisions.forEach(d => {
    const trait = d.chosenTrait;
    if (trait) traitCounts[trait] = (traitCounts[trait] || 0) + 1;
  });

  let bestArchetype = null;
  let bestScore = -1;
  LIFE_ARCHETYPES.forEach(arch => {
    const score = arch.traits.reduce((sum, t) => sum + (traitCounts[t] || 0), 0);
    if (score > bestScore) { bestScore = score; bestArchetype = arch; }
  });

  return bestArchetype || LIFE_ARCHETYPES[0];
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function LifeCrossroadsModal({ player, question, onChoice }) {
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const resolveEffect = (effects) => {
    if (Array.isArray(effects.money)) {
      return Math.random() < 0.5 ? effects.money[0] : effects.money[1];
    }
    return effects.money;
  };

  const handlePick = (option, side) => {
    if (chosen) return;
    setChosen(side);
    setTimeout(() => {
      setRevealed(true);
      const moneyDelta = resolveEffect(option.effects);
      const futureDelta = option.effects.future_bonus || 0;
      setTimeout(() => {
        onChoice({
          questionId: question.id,
          chosenSide: side,
          chosenLabel: option.label,
          chosenTrait: option.trait,
          moneyDelta,
          futureDelta,
          effectLabel: option.effects.label,
        });
      }, 1800);
    }, 600);
  };

  const chosenOption = chosen === 'A' ? question.optionA : chosen === 'B' ? question.optionB : null;
  const moneyDelta = chosenOption ? resolveEffect(chosenOption.effects) : 0;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 40 }}
        transition={{ type: 'spring', stiffness: 100, damping: 18 }}
        className="w-full max-w-lg bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 rounded-3xl border border-purple-400/30 shadow-[0_0_60px_rgba(168,85,247,0.4)] overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 text-center">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-4 py-1 mb-3">
            <span className="text-lg">🌀</span>
            <span className="text-purple-200 font-black text-xs uppercase tracking-widest">Life Crossroads</span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            {player.avatar
              ? <img src={player.avatar} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-purple-400" />
              : <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-black text-sm">{player.name.charAt(0)}</div>
            }
            <span className="text-purple-200 font-bold text-sm">{player.name}</span>
          </div>
          <p className="text-white font-black text-lg md:text-xl leading-snug mt-2 px-2">
            {question.emoji} {question.question}
          </p>
          <p className="text-purple-300/70 text-xs font-semibold mt-1 uppercase tracking-wider">{question.category}</p>
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-3 px-6 mb-1">
          <div className="flex-1 h-px bg-purple-500/20" />
          <span className="text-purple-400 font-black text-sm">THIS OR THAT?</span>
          <div className="flex-1 h-px bg-purple-500/20" />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 px-6 pb-4">
          {[{ option: question.optionA, side: 'A', color: 'from-purple-600/80 to-indigo-700/80', border: 'border-purple-400/50', hover: 'hover:border-purple-300' },
            { option: question.optionB, side: 'B', color: 'from-pink-600/80 to-rose-700/80', border: 'border-pink-400/50', hover: 'hover:border-pink-300' }
          ].map(({ option, side, color, border, hover }) => (
            <motion.button
              key={side}
              onClick={() => handlePick(option, side)}
              disabled={!!chosen}
              whileHover={!chosen ? { scale: 1.03, y: -2 } : {}}
              whileTap={!chosen ? { scale: 0.97 } : {}}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 bg-gradient-to-br ${color} ${border} ${hover} transition-all
                ${chosen === side ? 'ring-4 ring-white/40 scale-105' : ''}
                ${chosen && chosen !== side ? 'opacity-40 scale-95' : ''}
                ${!chosen ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="text-4xl">{option.emoji}</span>
              <span className="text-white font-black text-sm text-center leading-tight">{option.label}</span>
              {!chosen && (
                <span className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">Choose</span>
              )}
              {chosen === side && !revealed && (
                <motion.div className="absolute inset-0 rounded-2xl bg-white/20" animate={{ opacity: [0, 0.3, 0] }} transition={{ duration: 0.6 }} />
              )}
            </motion.button>
          ))}
        </div>

        {/* Outcome reveal */}
        <AnimatePresence>
          {revealed && chosenOption && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="mx-6 mb-6 rounded-2xl border border-white/10 bg-black/40 p-4 text-center"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-purple-300/70 mb-1">Outcome Revealed</p>
              <p className="text-white font-black text-base mb-2">{chosenOption.effects.label}</p>
              <div className="flex items-center justify-center gap-3">
                <span className={`text-2xl font-black ${moneyDelta >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {moneyDelta >= 0 ? '+' : ''}{moneyDelta}
                </span>
                {chosenOption.effects.future_bonus && (
                  <span className="text-amber-300 text-sm font-bold">+{chosenOption.effects.future_bonus} future bonus 🔮</span>
                )}
              </div>
              <p className="text-white/40 text-xs mt-2">This decision will shape your future...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}