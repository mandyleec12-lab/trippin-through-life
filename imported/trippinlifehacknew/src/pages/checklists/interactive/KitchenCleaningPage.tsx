import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SparkleEffect } from '../../../components/SparkleEffect';
import { CheckIcon, RotateCcwIcon, DownloadIcon, SparklesIcon } from 'lucide-react';
const checklistData = [{
  id: 'lighting',
  title: '💡 LIGHTING + AIR (TOP LEVEL)',
  notes: '',
  accent: 'from-amber-400 to-orange-400',
  tasks: [{
    id: 'light-1',
    text: 'Dust and wipe light fixtures'
  }, {
    id: 'light-2',
    text: 'Clean bulbs (when cool)'
  }, {
    id: 'light-3',
    text: 'Clean under hanging lights (especially over island/table)'
  }, {
    id: 'light-4',
    text: 'Clean ceiling fan (if applicable)'
  }, {
    id: 'light-5',
    text: 'Dust air vents / returns'
  }, {
    id: 'light-6',
    text: 'Wipe smoke detector'
  }]
}, {
  id: 'cabinets',
  title: '🧺 CABINETS TOP AND BOTTOM + DRAWERS',
  notes: '',
  accent: 'from-pink-400 to-rose-400',
  tasks: [{
    id: 'cab-1',
    text: 'Empty cabinets and drawers'
  }, {
    id: 'cab-2',
    text: 'Toss broken/unneeded items'
  }, {
    id: 'cab-3',
    text: 'Replace old shelf liners (if needed)'
  }, {
    id: 'cab-4',
    text: 'Wipe inside cabinets and drawers'
  }, {
    id: 'cab-5',
    text: 'Organize pots, pans, and utensils'
  }, {
    id: 'cab-6',
    text: "Wipe cabinet fronts, doors, and handles — don't forget under the lip of the cabinet that meets the baseboard"
  }]
}, {
  id: 'stove',
  title: '🔥 STOVE + COOKING AREA',
  notes: '',
  accent: 'from-orange-500 to-red-500',
  tasks: [{
    id: 'stove-1',
    text: 'Remove and clean burner grates + drip pans'
  }, {
    id: 'stove-2',
    text: 'Clean stovetop surface + underneath removable parts'
  }, {
    id: 'stove-3',
    text: 'Clean control knobs'
  }, {
    id: 'stove-4',
    text: 'Clean oven (inside, racks, and door glass) — Soak racks before scrubbing'
  }, {
    id: 'stove-5',
    text: 'Clean hood vent / range filter'
  }]
}, {
  id: 'walls',
  title: '🧱 WALLS + BACKSPLASH',
  notes: '',
  accent: 'from-emerald-400 to-teal-500',
  tasks: [{
    id: 'wall-1',
    text: 'Wipe backsplash (grease splatter zone)'
  }, {
    id: 'wall-2',
    text: 'Spot clean walls (especially near stove + trash)'
  }, {
    id: 'wall-3',
    text: 'Clean light switch plates'
  }]
}, {
  id: 'counters',
  title: '☕ COUNTERS + SMALL APPLIANCES',
  notes: '',
  accent: 'from-blue-400 to-indigo-400',
  tasks: [{
    id: 'counter-1',
    text: 'Clear EVERYTHING off counters'
  }, {
    id: 'counter-2',
    text: 'Clean underneath all items'
  }, {
    id: 'counter-3',
    text: 'Wipe and disinfect countertops (edges + front lip too)'
  }, {
    id: 'counter-4',
    text: 'Clean coffee maker (run cleaning cycle)'
  }, {
    id: 'counter-5',
    text: 'Clean microwave (inside ceiling + outside)'
  }, {
    id: 'counter-6',
    text: 'Steam microwave before wiping (water + vinegar/lemon)'
  }, {
    id: 'counter-7',
    text: 'Clean toaster / air fryer / blender (crumbs + exterior)'
  }]
}, {
  id: 'dishwasher',
  title: '🍽️ DISHWASHER',
  notes: '',
  accent: 'from-cyan-400 to-blue-500',
  tasks: [{
    id: 'dish-1',
    text: 'Clean filter (most missed step)'
  }, {
    id: 'dish-2',
    text: 'Clean spray arms + drain trap'
  }, {
    id: 'dish-3',
    text: 'Wipe inside edges + door'
  }, {
    id: 'dish-4',
    text: 'Run cleaning cycle (vinegar method)'
  }]
}, {
  id: 'pantry',
  title: '🥫 PANTRY + FOOD STORAGE',
  notes: '',
  accent: 'from-fuchsia-400 to-purple-500',
  tasks: [{
    id: 'pantry-1',
    text: 'Remove all items'
  }, {
    id: 'pantry-2',
    text: 'Toss expired food'
  }, {
    id: 'pantry-3',
    text: 'Wipe shelves, doors, and handles'
  }, {
    id: 'pantry-4',
    text: 'Vacuum pantry floor'
  }, {
    id: 'pantry-5',
    text: 'Organize (bins, baskets, containers)'
  }]
}, {
  id: 'fridge',
  title: '🧊 FRIDGE + FREEZER',
  notes: '',
  accent: 'from-sky-400 to-blue-400',
  tasks: [{
    id: 'fridge-1',
    text: 'Remove all food (work shelf by shelf)'
  }, {
    id: 'fridge-2',
    text: 'Toss expired or questionable items'
  }, {
    id: 'fridge-3',
    text: 'Remove and wash shelves + drawers'
  }, {
    id: 'fridge-4',
    text: "Wipe interior (don't forget door bins)"
  }, {
    id: 'fridge-5',
    text: 'Dry everything before putting food back'
  }, {
    id: 'fridge-6',
    text: 'Wipe containers before returning them'
  }, {
    id: 'fridge-7',
    text: 'Clean freezer (shelves, drawers, old ice)'
  }, {
    id: 'fridge-8',
    text: 'Add deodorizer (baking soda)'
  }, {
    id: 'fridge-9',
    text: '[Hidden fridge tasks - LEVEL UP] Wipe rubber door seals'
  }, {
    id: 'fridge-10',
    text: 'Clean drip tray (if accessible)'
  }, {
    id: 'fridge-11',
    text: 'Dust fridge coils (back or bottom)'
  }]
}, {
  id: 'water',
  title: '🧊 WATER + ICE SYSTEM',
  notes: '',
  accent: 'from-teal-400 to-emerald-400',
  tasks: [{
    id: 'water-1',
    text: 'Replace or check water filter'
  }, {
    id: 'water-2',
    text: 'Wipe water dispenser area'
  }, {
    id: 'water-3',
    text: '[Ice Maker] Empty and wipe ice bin'
  }, {
    id: 'water-4',
    text: 'Break up or discard old ice'
  }]
}, {
  id: 'sink',
  title: '💧 SINK + WATER AREA',
  notes: '',
  accent: 'from-indigo-400 to-purple-500',
  tasks: [{
    id: 'sink-1',
    text: 'Scrub sink basin (deep clean)'
  }, {
    id: 'sink-2',
    text: 'Clean faucet + handles (especially base)'
  }, {
    id: 'sink-3',
    text: 'Clean around drain'
  }, {
    id: 'sink-4',
    text: 'Clean sink sprayer / nozzle (vinegar soak)'
  }, {
    id: 'sink-5',
    text: '[Garbage Disposal] Baking soda + vinegar OR cleaner'
  }, {
    id: 'sink-6',
    text: 'Ice + lemon to freshen'
  }, {
    id: 'sink-7',
    text: 'Wipe under-sink cabinet (check for leaks + buildup)'
  }]
}, {
  id: 'trash',
  title: '🗑️ TRASH AREA',
  notes: '',
  accent: 'from-stone-400 to-gray-500',
  tasks: [{
    id: 'trash-1',
    text: 'Empty trash'
  }, {
    id: 'trash-2',
    text: 'Wash inside of trash can'
  }, {
    id: 'trash-3',
    text: 'Wipe outside + lid'
  }, {
    id: 'trash-4',
    text: 'Clean floor around trash area'
  }]
}, {
  id: 'floors',
  title: '🧼 FLOORS + LOWER AREAS (LAST STEP)',
  notes: '',
  accent: 'from-amber-500 to-orange-500',
  tasks: [{
    id: 'floor-1',
    text: 'Sweep thoroughly (corners + edges)'
  }, {
    id: 'floor-2',
    text: 'Mop floors (focus on sticky areas)'
  }, {
    id: 'floor-3',
    text: 'Clean baseboards'
  }, {
    id: 'floor-4',
    text: '[Hidden Floor Zones - HIGH VALUE] Clean cabinet toe kicks (bottom lip)'
  }, {
    id: 'floor-5',
    text: 'Scrub floor edges where cabinets meet floor'
  }, {
    id: 'floor-6',
    text: 'Check corners under cabinets'
  }]
}, {
  id: 'behind',
  title: '🚪 BEHIND + UNDER APPLIANCES',
  notes: '',
  accent: 'from-rose-400 to-pink-500',
  tasks: [{
    id: 'behind-1',
    text: 'Move fridge + clean behind/under'
  }, {
    id: 'behind-2',
    text: 'Move stove + clean behind/under'
  }]
}, {
  id: 'extra',
  title: '🧹 EXTRA (FORGOTTEN BUT POWERFUL)',
  notes: '',
  accent: 'from-violet-400 to-fuchsia-500',
  tasks: [{
    id: 'extra-1',
    text: 'Clean curtains (remove odors)'
  }, {
    id: 'extra-2',
    text: 'Dust blinds'
  }, {
    id: 'extra-3',
    text: 'Clean inside microwave, toaster oven, etc.'
  }, {
    id: 'extra-4',
    text: 'Clean range hood filter'
  }, {
    id: 'extra-5',
    text: 'Descale coffee maker / kettle'
  }]
}, {
  id: 'protip',
  title: '💅 PRO TIP (FINAL TOUCHES)',
  notes: '',
  accent: 'from-pink-400 to-rose-500',
  tasks: [{
    id: 'final-1',
    text: 'Dry sink for a polished finish'
  }, {
    id: 'final-2',
    text: 'Dry fridge interior'
  }, {
    id: 'final-3',
    text: 'Wipe any streaks or residue'
  }, {
    id: 'final-4',
    text: 'Reset counters neatly'
  }]
}];
export function KitchenCleaningPage() {
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('ukc-742-progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });
  useEffect(() => {
    localStorage.setItem('ukc-742-progress', JSON.stringify(checkedTasks));
  }, [checkedTasks]);
  const toggleTask = (taskId: string) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };
  const resetProgress = () => {
    if (window.confirm('Are you sure you want to uncheck all items and start over?')) {
      setCheckedTasks({});
    }
  };
  const totalTasks = checklistData.reduce((acc, section) => acc + section.tasks.length, 0);
  const completedTasks = Object.values(checkedTasks).filter(Boolean).length;
  const progressPercentage = Math.round(completedTasks / totalTasks * 100);
  const isComplete = completedTasks === totalTasks;
  return <div className="min-h-screen pb-24 bg-[#f5f0ff]">
      {/* Hero Section */}
      <div className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/file_000000006ef071fdb52ec95af7ad142f.png" alt="" className="w-full h-full object-cover object-center opacity-40" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-purple-100/40 via-purple-50/60 to-[#f5f0ff] backdrop-blur-[1px]" />
        </div>

        <SparkleEffect count={150} />

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-purple-300 text-sm font-bold text-purple-600 mb-6 uppercase tracking-wider shadow-sm">
            
            <SparklesIcon className="w-4 h-4" /> The Deep Clean
          </motion.div>

          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="font-heading text-5xl md:text-7xl font-bold text-[#4a2d52] mb-6 drop-shadow-sm uppercase tracking-tight">
            
            Ultimate Kitchen <br /> Cleaning Guide
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="text-xl md:text-2xl text-purple-700 font-medium max-w-2xl mx-auto italic">
            
            The deep clean your kitchen actually needs ✨
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-8">
        {/* Sticky Progress Bar */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} className="bg-white/90 backdrop-blur-xl border border-purple-200 rounded-3xl p-6 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 sticky top-24 z-40">
          
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm font-bold text-purple-900 mb-3">
              <span className="flex items-center gap-2">
                Your Progress {isComplete && '🎉'}
              </span>
              <span>
                {progressPercentage}% ({completedTasks}/{totalTasks})
              </span>
            </div>
            <div className="h-4 w-full bg-purple-100 rounded-full overflow-hidden shadow-inner">
              <motion.div className="h-full bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400" initial={{
              width: 0
            }} animate={{
              width: `${progressPercentage}%`
            }} transition={{
              duration: 0.5,
              ease: 'easeOut'
            }} />
              
            </div>
          </div>

          <button onClick={resetProgress} className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-purple-300 text-purple-600 font-bold text-sm hover:bg-purple-50 hover:text-purple-800 transition-all shadow-sm">
            
            <RotateCcwIcon className="w-4 h-4" />
            Start Fresh
          </button>
        </motion.div>

        {/* Pro Tips Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.35
      }} className="bg-gradient-to-br from-purple-100/80 to-pink-100/80 backdrop-blur-md border border-purple-200 rounded-3xl p-6 sm:p-8 shadow-lg mb-12">
          
          <h3 className="font-heading text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2">
            💡 Pro Tips
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">✨</span>
              <p className="text-purple-900 font-semibold text-sm sm:text-base">
                Clean from TOP → DOWN
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">⬇️</span>
              <p className="text-purple-900 font-semibold text-sm sm:text-base">
                Start high → work your way down → floors LAST
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">🧪</span>
              <p className="text-purple-900 font-semibold text-sm sm:text-base">
                Baking soda + vinegar makes a great cleaner
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">⏳</span>
              <p className="text-purple-900 font-semibold text-sm sm:text-base">
                Let cleaners sit 2–5 minutes before wiping (breaks down grease)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Checklist Sections */}
        <div className="space-y-8">
          {checklistData.map((section, sectionIdx) => <motion.div key={section.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4 + sectionIdx * 0.1
        }} className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-3xl overflow-hidden shadow-lg">
            
              {/* Section Header */}
              <div className={`bg-gradient-to-r ${section.accent} p-6 border-b border-white/20 text-center`}>
              
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-2 drop-shadow-sm">
                  {section.title}
                </h2>
                {section.notes && <p className="text-white/90 font-medium text-sm md:text-base">
                    {section.notes}
                  </p>}
              </div>

              {/* Tasks */}
              <div className="p-2 sm:p-4">
                {section.tasks.map((task) => {
              const isChecked = checkedTasks[task.id] || false;
              return <label key={task.id} className={`flex items-center gap-4 p-4 cursor-pointer transition-all duration-300 rounded-2xl ${isChecked ? 'bg-purple-50/50' : 'hover:bg-purple-50/80'}`}>
                    
                      <div className="relative flex items-center justify-center shrink-0">
                        <input type="checkbox" className="peer sr-only" checked={isChecked} onChange={() => toggleTask(task.id)} />
                      
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isChecked ? 'bg-purple-500 border-purple-500 shadow-md shadow-purple-500/30' : 'border-purple-300 bg-white hover:border-purple-400'}`}>
                        
                          <motion.div initial={false} animate={{
                      scale: isChecked ? 1 : 0,
                      opacity: isChecked ? 1 : 0
                    }} transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20
                    }}>
                          
                            <CheckIcon className="w-5 h-5 text-white" />
                          </motion.div>
                        </div>
                      </div>
                      <span className={`text-lg transition-all duration-300 ${isChecked ? 'text-purple-400 line-through' : 'text-purple-900 font-medium'}`}>
                      
                        {task.text}
                      </span>
                    </label>;
            })}
              </div>
            </motion.div>)}
        </div>

        {/* Upsell CTA */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="mt-16 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 rounded-[3rem] p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <SparklesIcon className="w-12 h-12 mx-auto mb-6 text-purple-200" />

          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 relative z-10">
            Want the printable version?
          </h2>
          <p className="text-purple-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto relative z-10 font-medium">
            Get the beautiful 4-page PDF to print and keep in your kitchen.
          </p>

          <a href="https://trippinwithmandy.gumroad.com/l/mdpjew" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-purple-600 font-bold text-lg hover:bg-purple-50 transition-all shadow-xl hover:-translate-y-1 relative z-10">
            
            <DownloadIcon className="w-5 h-5" />
            Get the Template ($3.99)
          </a>
        </motion.div>
      </div>
    </div>;
}