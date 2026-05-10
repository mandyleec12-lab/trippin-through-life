import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparkleEffect } from '../../../components/SparkleEffect';
import { CheckIcon, RotateCcwIcon, DownloadIcon, SparklesIcon } from 'lucide-react';
const roomData = [{
  id: 'living',
  title: 'LIVING AREAS',
  tasks: [{
    id: 'liv-1',
    text: 'Dust vents + air returns'
  }, {
    id: 'liv-2',
    text: 'Dust blinds / curtain rods'
  }, {
    id: 'liv-3',
    text: 'Clean behind + under furniture'
  }]
}, {
  id: 'kitchen',
  title: 'KITCHEN',
  tasks: [{
    id: 'kit-1',
    text: 'Clean inside trash can'
  }, {
    id: 'kit-2',
    text: 'Clean fridge and freezer (inside) toss out old food'
  }, {
    id: 'kit-3',
    text: 'Wipe cabinet fronts'
  }, {
    id: 'kit-4',
    text: 'Clean behind + under appliances'
  }, {
    id: 'kit-5',
    text: 'Clean inside microwave'
  }]
}, {
  id: 'bathroom',
  title: 'BATHROOM',
  tasks: [{
    id: 'bat-1',
    text: 'Wash shower curtain / liner'
  }, {
    id: 'bat-2',
    text: 'Clean behind toilet'
  }, {
    id: 'bat-3',
    text: 'Wipe down product bottles'
  }, {
    id: 'bat-4',
    text: 'Clean exhaust fan vent'
  }, {
    id: 'bat-5',
    text: 'Wash bath mats'
  }, {
    id: 'bat-6',
    text: 'Organize vanity'
  }]
}, {
  id: 'bedroom',
  title: 'BEDROOM',
  tasks: [{
    id: 'bed-1',
    text: 'Wash pillow cases'
  }, {
    id: 'bed-2',
    text: 'Wipe nightstands + lamps'
  }, {
    id: 'bed-3',
    text: 'Organize closet'
  }, {
    id: 'bed-4',
    text: 'Clean under bed'
  }, {
    id: 'bed-5',
    text: 'Declutter drawers'
  }]
}, {
  id: 'laundry',
  title: 'LAUNDRY / HOME MAINTENANCE',
  tasks: [{
    id: 'lnd-1',
    text: 'Clean washing machine'
  }, {
    id: 'lnd-2',
    text: 'Empty lint trap + vent area'
  }, {
    id: 'lnd-3',
    text: 'Check + replace filters (air, etc.)'
  }, {
    id: 'lnd-4',
    text: 'Clean dishwasher'
  }, {
    id: 'lnd-5',
    text: 'Wipe detergent spills / buildup'
  }]
}, {
  id: 'whole',
  title: 'WHOLE HOUSE QUICK HITS',
  tasks: [{
    id: 'whl-1',
    text: 'Wipe doors + door frames'
  }, {
    id: 'whl-2',
    text: 'Clean behind trash areas'
  }, {
    id: 'whl-3',
    text: 'Wipe light switches + door handles'
  }, {
    id: 'whl-4',
    text: 'Clean windows + tracks'
  }, {
    id: 'whl-5',
    text: 'Sanitize high-touch spots'
  }, {
    id: 'whl-6',
    text: 'Clean baseboards'
  }]
}];
const timelineData = [{
  id: 'weekly',
  title: 'WEEKLY (quick maintenance)',
  desc: 'These keep your space feeling fresh without buildup:',
  tasks: [{
    id: 'wk-1',
    text: 'Wipe baseboards in high-traffic areas'
  }, {
    id: 'wk-2',
    text: 'Clean bathroom trash cans'
  }, {
    id: 'wk-3',
    text: 'Wipe light switches + door handles'
  }, {
    id: 'wk-4',
    text: 'Dust visible surfaces (tables, shelves, TV stand)'
  }, {
    id: 'wk-5',
    text: 'Quick mirror wipe-down'
  }]
}, {
  id: 'biweekly',
  title: 'BI-WEEKLY (every 2 weeks)',
  tasks: [{
    id: 'bw-1',
    text: 'Dust blinds / window sills'
  }, {
    id: 'bw-2',
    text: 'Vacuum under couch cushions'
  }, {
    id: 'bw-3',
    text: 'Wipe down kitchen cabinets (fronts)'
  }, {
    id: 'bw-4',
    text: 'Clean inside microwave + fridge shelves (quick wipe)'
  }]
}, {
  id: 'monthly',
  title: 'MONTHLY (the "people forget these" list 👀)',
  tasks: [{
    id: 'mo-1',
    text: 'Clean inside trash cans'
  }, {
    id: 'mo-2',
    text: 'Dust ceiling fans + vents'
  }, {
    id: 'mo-3',
    text: 'Clean behind furniture (couch, bed edges, etc.)'
  }, {
    id: 'mo-4',
    text: 'Wipe baseboards throughout entire home'
  }, {
    id: 'mo-5',
    text: 'Wash shower curtain / liner'
  }, {
    id: 'mo-6',
    text: 'Deep clean sinks + drains'
  }]
}, {
  id: 'months23',
  title: 'EVERY 2-3 MONTHS',
  tasks: [{
    id: 'm23-1',
    text: 'Move furniture + vacuum/mop underneath'
  }, {
    id: 'm23-2',
    text: 'Clean inside oven'
  }, {
    id: 'm23-3',
    text: 'Wash pillows + comforters'
  }, {
    id: 'm23-4',
    text: 'Wipe down walls (spot clean marks/scuffs)'
  }]
}, {
  id: 'months6',
  title: 'EVERY 6 MONTHS',
  tasks: [{
    id: 'm6-1',
    text: 'Deep clean fridge + freezer'
  }, {
    id: 'm6-2',
    text: 'Clean behind/under appliances'
  }, {
    id: 'm6-3',
    text: 'Wash curtains'
  }, {
    id: 'm6-4',
    text: 'Organize + purge closets'
  }]
}];
export function CleaningTasksForgottenPage() {
  const [activeTab, setActiveTab] = useState<'room' | 'timeline'>('room');
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('ctf-392-progress');
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
    localStorage.setItem('ctf-392-progress', JSON.stringify(checkedTasks));
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
  const currentData = activeTab === 'room' ? roomData : timelineData;
  const totalTasks = currentData.reduce((acc, section) => acc + section.tasks.length, 0);
  // Calculate completed tasks for the CURRENT view only
  const currentTaskIds = currentData.flatMap((s) => s.tasks.map((t) => t.id));
  const completedTasks = currentTaskIds.filter((id) => checkedTasks[id]).length;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round(completedTasks / totalTasks * 100);
  return <div className="min-h-screen pt-32 pb-24 relative bg-[#fffaf5]">
      {/* Subtle grid background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{
      backgroundImage: 'linear-gradient(#8b5a5a 1px, transparent 1px), linear-gradient(90deg, #8b5a5a 1px, transparent 1px)',
      backgroundSize: '20px 20px'
    }} />
      

      <SparkleEffect count={30} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="font-heading text-5xl md:text-6xl font-bold text-[#8b4545] mb-4">
            
            The Cleaning Tasks
            <span className="block mt-2">Everyone Forgets 👀</span>
          </motion.h1>
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="text-lg text-[#a06b6b] font-bold uppercase tracking-widest">
            
            The stuff no one thinks about... until it's bad.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-full p-1.5 shadow-sm border border-[#f0e6e6] inline-flex">
            <button onClick={() => setActiveTab('room')} className={`relative px-8 py-3 rounded-full text-sm font-bold transition-colors ${activeTab === 'room' ? 'text-white' : 'text-[#a06b6b] hover:text-[#8b4545]'}`}>
              
              {activeTab === 'room' && <motion.div layoutId="activeTab" className="absolute inset-0 bg-[#d48c8c] rounded-full" transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25
            }} />}
              <span className="relative z-10">By Room</span>
            </button>
            <button onClick={() => setActiveTab('timeline')} className={`relative px-8 py-3 rounded-full text-sm font-bold transition-colors ${activeTab === 'timeline' ? 'text-white' : 'text-[#a06b6b] hover:text-[#8b4545]'}`}>
              
              {activeTab === 'timeline' && <motion.div layoutId="activeTab" className="absolute inset-0 bg-[#d48c8c] rounded-full" transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25
            }} />}
              <span className="relative z-10">By Timeline</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="bg-white border border-[#f0e6e6] rounded-2xl p-6 shadow-sm mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 sticky top-24 z-40">
          
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm font-bold text-[#8b4545] mb-2">
              <span>
                Progress ({activeTab === 'room' ? 'Room View' : 'Timeline View'}
                )
              </span>
              <span>
                {progressPercentage}% ({completedTasks}/{totalTasks})
              </span>
            </div>
            <div className="h-3 w-full bg-[#fdf8f5] rounded-full overflow-hidden border border-[#f0e6e6]">
              <motion.div className="h-full bg-[#d48c8c]" initial={{
              width: 0
            }} animate={{
              width: `${progressPercentage}%`
            }} transition={{
              duration: 0.5,
              ease: 'easeOut'
            }} />
              
            </div>
          </div>

          <button onClick={resetProgress} className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fdf8f5] border border-[#f0e6e6] text-[#8b4545] font-bold text-sm hover:bg-[#f5ebeb] transition-colors">
            
            <RotateCcwIcon className="w-4 h-4" />
            Reset
          </button>
        </motion.div>

        {/* Content */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -10
          }} transition={{
            duration: 0.2
          }} className="space-y-8">
              
              {currentData.map((section, sectionIdx) => <div key={section.id} className="bg-white border-2 border-[#8b4545] rounded-3xl overflow-hidden shadow-sm relative pt-12 pb-6 px-6 md:px-10">
                
                  {/* Brushstroke Header */}
                  <div className="absolute top-0 left-6 md:left-10 -translate-y-1/2 bg-[#d48c8c] px-6 py-2 rounded-lg transform -rotate-2">
                    <h2 className="font-heading text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
                      {section.title}
                    </h2>
                  </div>

                  {/* Optional Description */}
                  {'desc' in section && section.desc && <p className="text-[#a06b6b] font-medium mb-4 italic">
                      {section.desc}
                    </p>}

                  {/* Tasks Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6">
                    {section.tasks.map((task) => {
                  const isChecked = checkedTasks[task.id] || false;
                  return <label key={task.id} className="flex items-start gap-4 cursor-pointer group">
                        
                          <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                            <input type="checkbox" className="peer sr-only" checked={isChecked} onChange={() => toggleTask(task.id)} />
                          
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isChecked ? 'bg-[#d48c8c] border-[#d48c8c]' : 'border-[#8b4545] bg-white group-hover:bg-[#fdf8f5]'}`}>
                            
                              <motion.div initial={false} animate={{
                          scale: isChecked ? 1 : 0,
                          opacity: isChecked ? 1 : 0
                        }} transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 20
                        }}>
                              
                                <CheckIcon className="w-4 h-4 text-white" />
                              </motion.div>
                            </div>
                          </div>
                          <span className={`text-lg transition-all duration-300 ${isChecked ? 'text-[#d48c8c] line-through' : 'text-[#5a3a3a] font-medium'}`}>
                          
                            {task.text}
                          </span>
                        </label>;
                })}
                  </div>
                </div>)}
            </motion.div>
          </AnimatePresence>
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
      }} className="mt-16 bg-[#8b4545] rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 relative z-10">
            Want the printable version?
          </h2>
          <p className="text-[#f5ebeb] text-lg mb-8 max-w-2xl mx-auto relative z-10 font-medium">
            Get the beautiful PDF to print for your fridge and keep your
            cleaning on track.
          </p>

          <a href="https://trippinwithmandy.gumroad.com/l/lnsfo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#d48c8c] text-white font-bold text-lg hover:bg-[#c27a7a] transition-colors shadow-lg relative z-10">
            
            <DownloadIcon className="w-5 h-5" />
            Get the Template ($2.99)
          </a>
        </motion.div>
      </div>
    </div>;
}