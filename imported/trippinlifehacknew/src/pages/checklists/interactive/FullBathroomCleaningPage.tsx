import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SparkleEffect } from '../../../components/SparkleEffect';
import { CheckIcon, RotateCcwIcon, ArrowLeftIcon, ExternalLinkIcon } from 'lucide-react';
const STORAGE_KEY = 'ufbc-273-progress';
const sections = [{
  title: '📋 Before You Start',
  tasks: [{
    id: 'fbc-0-1',
    text: 'Open the door and turn on the vent fan for airflow'
  }, {
    id: 'fbc-0-2',
    text: 'Gather supplies: microfiber cloths, scrub brush, toilet brush'
  }, {
    id: 'fbc-0-3',
    text: 'Gather: glass cleaner, all-purpose cleaner, disinfectant, toilet bowl cleaner'
  }, {
    id: 'fbc-0-4',
    text: 'Grab a trash bag'
  }, {
    id: 'fbc-0-5',
    text: 'Remove bath mat(s) or rug(s)'
  }, {
    id: 'fbc-0-6',
    text: 'Remove towels, washcloths, and shower curtain (if applicable)'
  }, {
    id: 'fbc-0-7',
    text: 'Put on gloves'
  }],
  tip: 'Prep first so you are not running around mid-clean.'
}, {
  title: '🗑️ Declutter and Clear Surfaces',
  tasks: [{
    id: 'fbc-1-1',
    text: 'Remove everything from the vanity/counter'
  }, {
    id: 'fbc-1-2',
    text: 'Remove items from shelves, shower ledges, or tub edges'
  }, {
    id: 'fbc-1-3',
    text: 'Throw away empty bottles, old products, and trash'
  }, {
    id: 'fbc-1-4',
    text: 'Remove towels for laundry'
  }, {
    id: 'fbc-1-5',
    text: 'Take out the trash can liner'
  }]
}, {
  title: '🪶 Dust Top to Bottom',
  tasks: [{
    id: 'fbc-2-1',
    text: 'Dust light fixture and ceiling corners'
  }, {
    id: 'fbc-2-2',
    text: 'Dust vent or exhaust fan cover'
  }, {
    id: 'fbc-2-3',
    text: 'Dust top of mirror frame'
  }, {
    id: 'fbc-2-4',
    text: 'Dust shelves, wall decor, and frames'
  }, {
    id: 'fbc-2-5',
    text: 'Dust top of door frame'
  }, {
    id: 'fbc-2-6',
    text: 'Dust towel bars, hooks, and racks'
  }]
}, {
  title: '🪞 Clean the Mirror',
  tasks: [{
    id: 'fbc-3-1',
    text: 'Spray glass cleaner on a cloth (not directly on mirror)'
  }, {
    id: 'fbc-3-2',
    text: 'Wipe in a Z-pattern or circular motion'
  }, {
    id: 'fbc-3-3',
    text: 'Clean edges and corners'
  }, {
    id: 'fbc-3-4',
    text: 'Wipe mirror frame'
  }]
}, {
  title: '🚰 Clean the Sink and Vanity',
  tasks: [{
    id: 'fbc-4-1',
    text: 'Apply cleaner to sink basin'
  }, {
    id: 'fbc-4-2',
    text: 'Scrub basin, drain, and overflow hole'
  }, {
    id: 'fbc-4-3',
    text: 'Clean faucet and handles (remove buildup)'
  }, {
    id: 'fbc-4-4',
    text: 'Wipe vanity countertop'
  }, {
    id: 'fbc-4-5',
    text: 'Clean backsplash'
  }, {
    id: 'fbc-4-6',
    text: 'Wipe cabinet fronts and drawer pulls'
  }, {
    id: 'fbc-4-7',
    text: 'Clean inside drawers/cabinets (deep clean option)'
  }, {
    id: 'fbc-4-8',
    text: 'Wipe and return items'
  }]
}, {
  title: '🚽 Clean the Toilet — Outside First',
  tasks: [{
    id: 'fbc-5-1',
    text: 'Spray entire outside with disinfectant'
  }, {
    id: 'fbc-5-2',
    text: 'Wipe tank top and sides'
  }, {
    id: 'fbc-5-3',
    text: 'Wipe flush handle'
  }, {
    id: 'fbc-5-4',
    text: 'Wipe lid (top + bottom)'
  }, {
    id: 'fbc-5-5',
    text: 'Wipe seat (top + bottom)'
  }, {
    id: 'fbc-5-6',
    text: 'Clean hinges'
  }, {
    id: 'fbc-5-7',
    text: 'Wipe rim and outside of bowl'
  }, {
    id: 'fbc-5-8',
    text: 'Clean base thoroughly'
  }, {
    id: 'fbc-5-9',
    text: 'Clean behind toilet'
  }, {
    id: 'fbc-5-10',
    text: 'Wipe bolt covers'
  }]
}, {
  title: '🧽 Clean the Toilet — Inside',
  tasks: [{
    id: 'fbc-6-1',
    text: 'Apply cleaner under rim and let sit'
  }, {
    id: 'fbc-6-2',
    text: 'Scrub under rim'
  }, {
    id: 'fbc-6-3',
    text: 'Scrub inside bowl'
  }, {
    id: 'fbc-6-4',
    text: 'Scrub to drain'
  }, {
    id: 'fbc-6-5',
    text: 'Flush and rinse brush'
  }, {
    id: 'fbc-6-6',
    text: 'Wipe any drips'
  }]
}, {
  title: '🚿🛁 Shower / Bathtub Cleaning',
  isSpecialSection: true,
  subgroups: [{
    title: '🚿 Shower Only',
    tasks: [{
      id: 'fbc-7-1',
      text: 'Spray walls with cleaner'
    }, {
      id: 'fbc-7-2',
      text: 'Scrub tile or surround'
    }, {
      id: 'fbc-7-3',
      text: 'Clean grout lines'
    }, {
      id: 'fbc-7-4',
      text: 'Clean glass doors or curtain liner'
    }, {
      id: 'fbc-7-5',
      text: 'Clean shower fixtures (handle, showerhead)'
    }, {
      id: 'fbc-7-6',
      text: 'Remove soap scum buildup'
    }, {
      id: 'fbc-7-7',
      text: 'Rinse thoroughly'
    }]
  }, {
    title: '🛁 Bathtub Only',
    tasks: [{
      id: 'fbc-7-8',
      text: 'Spray entire tub with cleaner'
    }, {
      id: 'fbc-7-9',
      text: 'Scrub tub surface'
    }, {
      id: 'fbc-7-10',
      text: 'Clean around drain'
    }, {
      id: 'fbc-7-11',
      text: 'Scrub soap buildup rings'
    }, {
      id: 'fbc-7-12',
      text: 'Clean faucet and handles'
    }, {
      id: 'fbc-7-13',
      text: 'Rinse thoroughly'
    }]
  }, {
    title: '🛁🚿 Tub + Shower Combo',
    tasks: [{
      id: 'fbc-7-14',
      text: 'Spray walls AND tub'
    }, {
      id: 'fbc-7-15',
      text: 'Scrub tile/surround and tub surface'
    }, {
      id: 'fbc-7-16',
      text: 'Clean grout lines'
    }, {
      id: 'fbc-7-17',
      text: 'Remove soap scum from walls + tub'
    }, {
      id: 'fbc-7-18',
      text: 'Clean fixtures (faucet + showerhead)'
    }, {
      id: 'fbc-7-19',
      text: 'Clean curtain or glass doors'
    }, {
      id: 'fbc-7-20',
      text: 'Rinse everything thoroughly'
    }]
  }],
  tip: 'Choose the section that matches your setup — you do not need to do all three!'
}, {
  title: '🧱 Clean Walls, Door, and Baseboards',
  tasks: [{
    id: 'fbc-8-1',
    text: 'Spot clean walls'
  }, {
    id: 'fbc-8-2',
    text: 'Wipe light switch plate'
  }, {
    id: 'fbc-8-3',
    text: 'Clean door handle (inside + outside)'
  }, {
    id: 'fbc-8-4',
    text: 'Wipe door front and back'
  }, {
    id: 'fbc-8-5',
    text: 'Clean door frame'
  }, {
    id: 'fbc-8-6',
    text: 'Wipe baseboards'
  }, {
    id: 'fbc-8-7',
    text: 'Pay extra attention behind toilet'
  }]
}, {
  title: '🧹 Clean the Floor',
  tasks: [{
    id: 'fbc-9-1',
    text: 'Sweep or vacuum entire floor'
  }, {
    id: 'fbc-9-2',
    text: 'Clean corners and edges'
  }, {
    id: 'fbc-9-3',
    text: 'Get around and behind toilet base'
  }, {
    id: 'fbc-9-4',
    text: 'Mop with disinfectant'
  }, {
    id: 'fbc-9-5',
    text: 'Clean floor vent if present'
  }, {
    id: 'fbc-9-6',
    text: 'Let floor dry completely'
  }]
}, {
  title: '🦠 Sanitize High-Touch Surfaces',
  tasks: [{
    id: 'fbc-10-1',
    text: 'Sanitize light switch'
  }, {
    id: 'fbc-10-2',
    text: 'Sanitize door handle'
  }, {
    id: 'fbc-10-3',
    text: 'Sanitize faucet handles'
  }, {
    id: 'fbc-10-4',
    text: 'Sanitize flush handle'
  }, {
    id: 'fbc-10-5',
    text: 'Sanitize toilet paper holder'
  }, {
    id: 'fbc-10-6',
    text: 'Sanitize cabinet/drawer pulls'
  }]
}, {
  title: '✨ Final Touches and Restock',
  tasks: [{
    id: 'fbc-11-1',
    text: 'Replace trash bag'
  }, {
    id: 'fbc-11-2',
    text: 'Put out fresh towels'
  }, {
    id: 'fbc-11-3',
    text: 'Refill soap dispenser'
  }, {
    id: 'fbc-11-4',
    text: 'Replace toilet paper if needed'
  }, {
    id: 'fbc-11-5',
    text: 'Return only essential items to counter'
  }, {
    id: 'fbc-11-6',
    text: 'Put bath mat(s) back'
  }, {
    id: 'fbc-11-7',
    text: 'Hang clean shower curtain if removed'
  }, {
    id: 'fbc-11-8',
    text: 'Use room spray or candle'
  }, {
    id: 'fbc-11-9',
    text: 'Do a final walkthrough'
  }]
}, {
  title: "🔍 Deep Clean Don't Forget List",
  tasks: [{
    id: 'fbc-12-1',
    text: 'Exhaust fan vent cover'
  }, {
    id: 'fbc-12-2',
    text: 'Behind the toilet'
  }, {
    id: 'fbc-12-3',
    text: 'Toilet bolt covers'
  }, {
    id: 'fbc-12-4',
    text: 'Toilet seat hinges'
  }, {
    id: 'fbc-12-5',
    text: 'Faucet aerator'
  }, {
    id: 'fbc-12-6',
    text: 'Sink overflow hole'
  }, {
    id: 'fbc-12-7',
    text: 'Inside trash can'
  }, {
    id: 'fbc-12-8',
    text: 'Shower drain'
  }, {
    id: 'fbc-12-9',
    text: 'Shower curtain liner'
  }, {
    id: 'fbc-12-10',
    text: 'Grout lines'
  }, {
    id: 'fbc-12-11',
    text: 'Door hinges'
  }, {
    id: 'fbc-12-12',
    text: 'Baseboards behind toilet'
  }],
  tip: 'The spots most people skip — if you hit these, your bathroom is truly deep cleaned.'
}];
export function FullBathroomCleaningPage() {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  // Calculate total tasks. For the special section, we count all tasks across all subgroups.
  // The user only needs to complete one subgroup, but for simplicity of the progress bar,
  // we'll just count all tasks. Alternatively, we could exclude the special section from the total,
  // or only count tasks that are checked.
  // Let's count all tasks.
  const totalTasks = sections.reduce((acc, section) => {
    if (section.isSpecialSection && section.subgroups) {
      return acc + section.subgroups.reduce((subAcc, sub) => subAcc + sub.tasks.length, 0);
    }
    return acc + (section.tasks?.length || 0);
  }, 0);
  const progress = totalTasks === 0 ? 0 : Math.round(completedTasks.length / totalTasks * 100);
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCompletedTasks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved progress');
      }
    }
    setIsLoaded(true);
  }, []);
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedTasks));
    }
  }, [completedTasks, isLoaded]);
  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]);
  };
  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setCompletedTasks([]);
    }
  };
  if (!isLoaded) return null;
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-sky-50 pt-24 pb-32 relative">
      <SparkleEffect count={40} />

      {/* Sticky Progress Bar */}
      <div className="fixed top-[68px] sm:top-[76px] left-0 w-full bg-white/80 backdrop-blur-md border-b border-blue-100 z-40 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold text-blue-800 mb-1">
              <span>Progress</span>
              <span>{Math.min(progress, 100)}%</span>
            </div>
            <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
              <motion.div initial={{
              width: 0
            }} animate={{
              width: `${Math.min(progress, 100)}%`
            }} className="h-full bg-blue-500 rounded-full" />
              
            </div>
          </div>
          <button onClick={resetProgress} className="shrink-0 p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Reset Progress">
            
            <RotateCcwIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-8 relative z-10">
        <Link to="/checklists/cleaning" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold mb-8 transition-colors">
          
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Cleaning Lists
        </Link>

        {/* Hero Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-xl border border-blue-100 mb-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-6 uppercase tracking-wider">
            INTERACTIVE DIGITAL CHECKLIST
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
            🚿🛁 Ultimate Full Bathroom Cleaning Guide
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-xl mx-auto mb-6">
            The Deep Clean — Every Surface, Every Corner, Every Forgotten Spot
            ✨
          </p>
          <p className="text-sm text-blue-600 font-bold bg-blue-50/50 inline-block px-4 py-2 rounded-lg border border-blue-100 mb-8">
            Broken down to fit any bathroom — bath only, shower only, or combo
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-blue-100/50">
            <a href="PLACEHOLDER" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-cta-500 text-white font-bold text-sm hover:bg-cta-600 transition-colors shadow-lg shadow-cta-500/20 w-full sm:w-auto">
              
              Get Printable PDF ($3.99)
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Checklist Sections */}
        <div className="space-y-8">
          {sections.map((section, sIdx) => <div key={sIdx} className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-md border border-blue-100">
                <h2 className="font-heading text-2xl font-bold text-slate-800 mb-6 pb-4 border-b border-blue-100">
                  {section.title}
                </h2>

                {section.isSpecialSection && section.subgroups ? <div className="space-y-8">
                    {section.subgroups.map((subgroup, subIdx) => <div key={subIdx} className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                  
                        <h3 className="font-heading text-xl font-bold text-blue-800 mb-4">
                          {subgroup.title}
                        </h3>
                        <div className="space-y-3">
                          {subgroup.tasks.map((task) => {
                    const isChecked = completedTasks.includes(task.id);
                    return <motion.button key={task.id} onClick={() => toggleTask(task.id)} whileTap={{
                      scale: 0.98
                    }} className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all text-left group ${isChecked ? 'bg-blue-50/50 opacity-60' : 'bg-white hover:bg-blue-50/30 shadow-sm border border-transparent hover:border-blue-100'}`}>
                          
                                <div className={`shrink-0 w-10 h-10 rounded-xl border-[3px] flex items-center justify-center transition-colors ${isChecked ? 'bg-blue-500 border-blue-500 text-white' : 'border-blue-200 text-transparent group-hover:border-blue-300'}`}>
                            
                                  <CheckIcon className="w-6 h-6 stroke-[3]" />
                                </div>
                                <span className={`text-lg font-medium pt-1.5 transition-all ${isChecked ? 'text-blue-400 line-through' : 'text-slate-700'}`}>
                            
                                  {task.text}
                                </span>
                              </motion.button>;
                  })}
                        </div>
                      </div>)}
                  </div> : <div className="space-y-3">
                    {section.tasks?.map((task) => {
                const isChecked = completedTasks.includes(task.id);
                return <motion.button key={task.id} onClick={() => toggleTask(task.id)} whileTap={{
                  scale: 0.98
                }} className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all text-left group ${isChecked ? 'bg-blue-50/50 opacity-60' : 'bg-white hover:bg-blue-50/30 shadow-sm border border-transparent hover:border-blue-100'}`}>
                      
                          <div className={`shrink-0 w-10 h-10 rounded-xl border-[3px] flex items-center justify-center transition-colors ${isChecked ? 'bg-blue-500 border-blue-500 text-white' : 'border-blue-200 text-transparent group-hover:border-blue-300'}`}>
                        
                            <CheckIcon className="w-6 h-6 stroke-[3]" />
                          </div>
                          <span className={`text-lg font-medium pt-1.5 transition-all ${isChecked ? 'text-blue-400 line-through' : 'text-slate-700'}`}>
                        
                            {task.text}
                          </span>
                        </motion.button>;
              })}
                  </div>}
              </div>

              {/* Tip Callout */}
              {section.tip && <motion.div initial={{
            opacity: 0,
            y: 10
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="bg-blue-50/80 border border-blue-200/50 rounded-2xl p-6 shadow-sm mx-4 md:mx-8 relative overflow-hidden">
              
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-400" />
                  <div className="flex gap-4 items-start">
                    <div className="text-2xl shrink-0">👉</div>
                    <p className="text-blue-800 font-medium leading-relaxed">
                      {section.tip}
                    </p>
                  </div>
                </motion.div>}
            </div>)}
        </div>

        {/* Completion Message */}
        <AnimatePresence>
          {progress >= 100 && <motion.div initial={{
          opacity: 0,
          scale: 0.9,
          y: 20
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} className="mt-12 bg-gradient-to-br from-blue-400 to-sky-500 rounded-3xl p-8 text-center text-white shadow-xl relative overflow-hidden">
            
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
              <div className="relative z-10">
                <div className="text-5xl mb-4">✨🛁</div>
                <h3 className="font-heading text-3xl font-bold mb-2">
                  Sparkling Clean!
                </h3>
                <p className="text-blue-50 font-medium">
                  You've deep cleaned every corner of your bathroom. Enjoy the
                  fresh space!
                </p>
              </div>
            </motion.div>}
        </AnimatePresence>
      </div>
    </div>;
}