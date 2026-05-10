import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SparkleEffect } from '../../../components/SparkleEffect';
import { CheckIcon, RotateCcwIcon, DownloadIcon, SparklesIcon } from 'lucide-react';
const checklistData = [{
  id: 'before',
  title: '📋 BEFORE YOU START',
  notes: 'Prep first so you are not running around mid-clean',
  accent: 'from-teal-400 to-emerald-400',
  tasks: [{
    id: 'b-1',
    text: 'Open the door and turn on the vent fan for airflow'
  }, {
    id: 'b-2',
    text: 'Gather supplies: microfiber cloths, scrub brush, toilet brush'
  }, {
    id: 'b-3',
    text: 'Gather: glass cleaner, all-purpose cleaner, disinfectant, toilet bowl cleaner'
  }, {
    id: 'b-4',
    text: 'Grab a trash bag'
  }, {
    id: 'b-5',
    text: 'Remove bath mat or rug if there is one'
  }, {
    id: 'b-6',
    text: 'Put on gloves'
  }]
}, {
  id: 'declutter',
  title: '1. DECLUTTER AND CLEAR SURFACES',
  notes: '',
  accent: 'from-emerald-400 to-cyan-500',
  tasks: [{
    id: 'c-1',
    text: 'Remove everything from the vanity/counter'
  }, {
    id: 'c-2',
    text: 'Remove items from shelves or wall storage'
  }, {
    id: 'c-3',
    text: 'Throw away empty bottles, old products, and trash'
  }, {
    id: 'c-4',
    text: 'Remove hand towels and washcloths for laundry'
  }, {
    id: 'c-5',
    text: 'Take out the trash can liner'
  }]
}, {
  id: 'dust',
  title: '2. DUST TOP TO BOTTOM',
  notes: '',
  accent: 'from-cyan-400 to-sky-400',
  tasks: [{
    id: 'd-1',
    text: 'Dust light fixture and any ceiling corners'
  }, {
    id: 'd-2',
    text: 'Dust vent or exhaust fan cover'
  }, {
    id: 'd-3',
    text: 'Dust the top of the mirror frame'
  }, {
    id: 'd-4',
    text: 'Dust shelves, wall decor, and frames'
  }, {
    id: 'd-5',
    text: 'Dust the top of the door frame'
  }, {
    id: 'd-6',
    text: 'Dust the towel bar or ring'
  }]
}, {
  id: 'mirror',
  title: '3. CLEAN THE MIRROR',
  notes: '',
  accent: 'from-sky-400 to-blue-400',
  tasks: [{
    id: 'm-1',
    text: 'Spray glass cleaner on a cloth, not directly on the mirror'
  }, {
    id: 'm-2',
    text: 'Wipe in a Z-pattern or circular motion for streak-free results'
  }, {
    id: 'm-3',
    text: 'Clean the edges and corners where buildup collects'
  }, {
    id: 'm-4',
    text: 'Wipe the mirror frame if it has one'
  }]
}, {
  id: 'sink',
  title: '4. CLEAN THE SINK AND VANITY',
  notes: '',
  accent: 'from-teal-500 to-emerald-500',
  tasks: [{
    id: 's-1',
    text: 'Apply cleaner to the entire sink basin'
  }, {
    id: 's-2',
    text: 'Scrub the basin, drain, and overflow hole'
  }, {
    id: 's-3',
    text: 'Clean the faucet and handles — remove water spots and buildup'
  }, {
    id: 's-4',
    text: 'Wipe down the vanity countertop'
  }, {
    id: 's-5',
    text: 'Clean the backsplash area behind the faucet'
  }, {
    id: 's-6',
    text: 'Wipe cabinet fronts and drawer pulls'
  }, {
    id: 's-7',
    text: 'Clean inside drawers and cabinets if doing a deep clean'
  }, {
    id: 's-8',
    text: 'Wipe the soap dispenser and any counter items before putting them back'
  }]
}, {
  id: 'toilet-out',
  title: '5. CLEAN THE TOILET — OUTSIDE FIRST',
  notes: '',
  accent: 'from-emerald-500 to-teal-600',
  tasks: [{
    id: 'to-1',
    text: 'Spray the entire outside of the toilet with disinfectant'
  }, {
    id: 'to-2',
    text: 'Wipe the tank top and sides'
  }, {
    id: 'to-3',
    text: 'Wipe the flush handle'
  }, {
    id: 'to-4',
    text: 'Wipe the lid top and bottom'
  }, {
    id: 'to-5',
    text: 'Wipe the seat top and bottom'
  }, {
    id: 'to-6',
    text: 'Wipe the hinges — gunk loves to hide here'
  }, {
    id: 'to-7',
    text: 'Wipe the rim and the outside of the bowl'
  }, {
    id: 'to-8',
    text: 'Wipe the base of the toilet thoroughly'
  }, {
    id: 'to-9',
    text: 'Clean behind the toilet as far as you can reach'
  }, {
    id: 'to-10',
    text: 'Wipe the bolt covers at the base'
  }]
}, {
  id: 'toilet-in',
  title: '6. CLEAN THE TOILET — INSIDE',
  notes: '',
  accent: 'from-teal-600 to-cyan-600',
  tasks: [{
    id: 'ti-1',
    text: 'Apply toilet bowl cleaner under the rim and let it sit'
  }, {
    id: 'ti-2',
    text: 'Scrub under the rim with a toilet brush'
  }, {
    id: 'ti-3',
    text: 'Scrub the inside of the bowl'
  }, {
    id: 'ti-4',
    text: 'Scrub down to the drain'
  }, {
    id: 'ti-5',
    text: 'Flush and rinse the brush in clean water'
  }, {
    id: 'ti-6',
    text: 'Wipe any drips around the bowl after flushing'
  }]
}, {
  id: 'walls',
  title: '7. CLEAN WALLS, DOOR, AND BASEBOARDS',
  notes: '',
  accent: 'from-cyan-500 to-sky-500',
  tasks: [{
    id: 'w-1',
    text: 'Spot clean walls — check for splashes and fingerprints'
  }, {
    id: 'w-2',
    text: 'Wipe light switch plate'
  }, {
    id: 'w-3',
    text: 'Wipe the door handle inside and out'
  }, {
    id: 'w-4',
    text: 'Clean the door front and back'
  }, {
    id: 'w-5',
    text: 'Wipe the door frame'
  }, {
    id: 'w-6',
    text: 'Wipe baseboards all the way around the room'
  }, {
    id: 'w-7',
    text: 'Pay extra attention to baseboards behind the toilet'
  }]
}, {
  id: 'floor',
  title: '8. CLEAN THE FLOOR',
  notes: '',
  accent: 'from-sky-500 to-teal-500',
  tasks: [{
    id: 'f-1',
    text: 'Sweep or vacuum the entire floor including corners'
  }, {
    id: 'f-2',
    text: 'Get behind and around the toilet base'
  }, {
    id: 'f-3',
    text: 'Mop the floor with disinfectant'
  }, {
    id: 'f-4',
    text: 'Pay extra attention to the area around the toilet base'
  }, {
    id: 'f-5',
    text: 'Clean the floor vent if there is one'
  }, {
    id: 'f-6',
    text: 'Let the floor dry completely'
  }]
}, {
  id: 'sanitize',
  title: '9. SANITIZE HIGH-TOUCH SURFACES',
  notes: '',
  accent: 'from-teal-400 to-emerald-500',
  tasks: [{
    id: 'sa-1',
    text: 'Sanitize the light switch'
  }, {
    id: 'sa-2',
    text: 'Sanitize the door handle'
  }, {
    id: 'sa-3',
    text: 'Sanitize the faucet handles'
  }, {
    id: 'sa-4',
    text: 'Sanitize the flush handle'
  }, {
    id: 'sa-5',
    text: 'Sanitize the toilet paper holder'
  }, {
    id: 'sa-6',
    text: 'Sanitize cabinet and drawer pulls'
  }]
}, {
  id: 'final',
  title: '10. FINAL TOUCHES AND RESTOCK',
  notes: '',
  accent: 'from-emerald-400 to-teal-400',
  tasks: [{
    id: 'fin-1',
    text: 'Replace the trash bag'
  }, {
    id: 'fin-2',
    text: 'Put out fresh hand towels'
  }, {
    id: 'fin-3',
    text: 'Refill the soap dispenser if needed'
  }, {
    id: 'fin-4',
    text: 'Replace the toilet paper roll if low'
  }, {
    id: 'fin-5',
    text: 'Put back only what belongs on the counter'
  }, {
    id: 'fin-6',
    text: 'Place the bath mat or rug back if clean'
  }, {
    id: 'fin-7',
    text: 'Light a candle or use a room spray'
  }, {
    id: 'fin-8',
    text: 'Do a final walkthrough from the doorway'
  }]
}, {
  id: 'dontforget',
  title: "✨ DEEP CLEAN DON'T FORGET LIST",
  notes: 'The spots most people skip',
  accent: 'from-teal-600 to-emerald-600',
  tasks: [{
    id: 'df-1',
    text: 'Exhaust fan vent cover'
  }, {
    id: 'df-2',
    text: 'Behind the toilet'
  }, {
    id: 'df-3',
    text: 'Toilet bolt covers'
  }, {
    id: 'df-4',
    text: 'Toilet seat hinges'
  }, {
    id: 'df-5',
    text: 'Faucet aerator'
  }, {
    id: 'df-6',
    text: 'Sink overflow hole'
  }, {
    id: 'df-7',
    text: 'Inside the trash can'
  }, {
    id: 'df-8',
    text: 'Light switch plate'
  }, {
    id: 'df-9',
    text: 'Door hinges'
  }, {
    id: 'df-10',
    text: 'Baseboards behind the toilet'
  }]
}];
export function HalfBathroomCleaningPage() {
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('uhbc-318-progress');
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
    localStorage.setItem('uhbc-318-progress', JSON.stringify(checkedTasks));
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
  return <div className="min-h-screen pb-24" style={{
    background: 'linear-gradient(135deg, #f0fdf9 0%, #f0f9ff 50%, #f0fdf4 100%)'
  }}>
      
      {/* Hero Section */}
      <div className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/file_0000000072cc722f9a948e7c2f07609c.png" alt="" className="w-full h-full object-cover object-top opacity-30" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-teal-100/50 via-emerald-50/60 to-[#f0fdf9]" />
        </div>

        <SparkleEffect count={150} />

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-teal-300 text-sm font-bold text-teal-700 mb-6 uppercase tracking-wider shadow-sm">
            
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
        }} className="font-heading text-5xl md:text-7xl font-bold text-teal-900 mb-6 drop-shadow-sm uppercase tracking-tight">
            
            Ultimate Half Bathroom <br /> Cleaning Guide
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="text-xl md:text-2xl text-teal-700 font-medium max-w-2xl mx-auto italic">
            
            Every surface, every corner, every forgotten spot ✨
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
      }} className="bg-white/90 backdrop-blur-xl border border-teal-200 rounded-3xl p-6 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 sticky top-24 z-40">
          
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm font-bold text-teal-900 mb-3">
              <span className="flex items-center gap-2">
                Your Progress {isComplete && '🎉'}
              </span>
              <span>
                {progressPercentage}% ({completedTasks}/{totalTasks})
              </span>
            </div>
            <div className="h-4 w-full bg-teal-100 rounded-full overflow-hidden shadow-inner">
              <motion.div className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400" initial={{
              width: 0
            }} animate={{
              width: `${progressPercentage}%`
            }} transition={{
              duration: 0.5,
              ease: 'easeOut'
            }} />
              
            </div>
          </div>
          <button onClick={resetProgress} className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-teal-300 text-teal-700 font-bold text-sm hover:bg-teal-50 hover:text-teal-900 transition-all shadow-sm">
            
            <RotateCcwIcon className="w-4 h-4" />
            Start Fresh
          </button>
        </motion.div>

        {/* Pro Tips */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.35
      }} className="bg-gradient-to-br from-teal-100/80 to-emerald-100/80 backdrop-blur-md border border-teal-200 rounded-3xl p-6 sm:p-8 shadow-lg mb-12">
          
          <h3 className="font-heading text-2xl font-bold text-teal-900 mb-4">
            💡 Pro Tips
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">🚽</span>
              <p className="text-teal-900 font-semibold text-sm sm:text-base">
                Always clean the toilet OUTSIDE first, then inside — keeps
                things sanitary
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">⬆️</span>
              <p className="text-teal-900 font-semibold text-sm sm:text-base">
                Dust top to bottom so debris falls to areas you haven't cleaned
                yet
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">🧤</span>
              <p className="text-teal-900 font-semibold text-sm sm:text-base">
                Wear gloves — especially when cleaning the toilet
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">💨</span>
              <p className="text-teal-900 font-semibold text-sm sm:text-base">
                Turn on the vent fan before you start to help surfaces dry
                faster
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
          delay: 0.4 + sectionIdx * 0.08
        }} className="bg-white/80 backdrop-blur-md border border-teal-100 rounded-3xl overflow-hidden shadow-lg">
            
              <div className={`bg-gradient-to-r ${section.accent} p-6 border-b border-white/20 text-center`}>
              
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-1 drop-shadow-sm">
                  {section.title}
                </h2>
                {section.notes && <p className="text-white/90 font-medium text-sm md:text-base italic">
                    {section.notes}
                  </p>}
              </div>

              <div className="p-2 sm:p-4">
                {section.tasks.map((task) => {
              const isChecked = checkedTasks[task.id] || false;
              return <label key={task.id} className={`flex items-center gap-4 p-4 cursor-pointer transition-all duration-300 rounded-2xl ${isChecked ? 'bg-teal-50/50' : 'hover:bg-teal-50/80'}`}>
                    
                      <div className="relative flex items-center justify-center shrink-0">
                        <input type="checkbox" className="peer sr-only" checked={isChecked} onChange={() => toggleTask(task.id)} />
                      
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isChecked ? 'bg-teal-400 border-teal-400 shadow-md shadow-teal-400/30' : 'border-teal-300 bg-white hover:border-teal-400'}`}>
                        
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
                      <span className={`text-lg transition-all duration-300 ${isChecked ? 'text-teal-300 line-through' : 'text-teal-900 font-medium'}`}>
                      
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
      }} className="mt-16 bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-500 rounded-[3rem] p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <SparklesIcon className="w-12 h-12 mx-auto mb-6 text-teal-100" />

          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 relative z-10">
            Want the printable version?
          </h2>
          <p className="text-teal-50 text-lg md:text-xl mb-8 max-w-2xl mx-auto relative z-10 font-medium">
            Get the beautiful printable PDF to keep in your bathroom.
          </p>

          <a href="https://trippinwithmandy.gumroad.com/l/xetmry" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-teal-700 font-bold text-lg hover:bg-teal-50 transition-all shadow-xl hover:-translate-y-1 relative z-10">
            
            <DownloadIcon className="w-5 h-5" />
            Get the Template ($2.99)
          </a>
        </motion.div>
      </div>
    </div>;
}