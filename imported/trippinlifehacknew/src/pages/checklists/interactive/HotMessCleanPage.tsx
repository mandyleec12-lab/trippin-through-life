import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SparkleEffect } from '../../../components/SparkleEffect';
import { CheckIcon, RotateCcwIcon, DownloadIcon, SparklesIcon } from 'lucide-react';
const checklistData = [{
  id: 'damage',
  title: 'DAMAGE CONTROL (0-15 MIN)',
  notes: "We're stopping the chaos from getting worse",
  accent: 'from-pink-500 to-rose-600',
  tasks: [{
    id: 'dam-1',
    text: 'Grab all trash (cups, wrappers, random junk)'
  }, {
    id: 'dam-2',
    text: 'Start dishwasher or load dishes'
  }, {
    id: 'dam-3',
    text: 'Put obvious items back where they belong'
  }, {
    id: 'dam-4',
    text: 'Open a window / light a candle (fake freshness counts 😅)'
  }]
}, {
  id: 'visibility',
  title: 'HIGH-VISIBILITY AREAS (15-30 MIN)',
  notes: 'Clean what people will actually notice 👀',
  accent: 'from-fuchsia-500 to-pink-600',
  tasks: [{
    id: 'vis-1',
    text: 'Wipe kitchen counters + sink'
  }, {
    id: 'vis-2',
    text: 'Wipe bathroom sink + toilet seat'
  }, {
    id: 'vis-3',
    text: 'Wipe mirrors'
  }, {
    id: 'vis-4',
    text: 'Clear main surfaces (coffee table, counters)'
  }]
}, {
  id: 'main',
  title: 'RESET THE MAIN SPACE (30-45 MIN)',
  notes: 'Make it look like you have your life together',
  accent: 'from-magenta-500 to-fuchsia-600',
  tasks: [{
    id: 'main-1',
    text: 'Fold blankets + fluff pillows'
  }, {
    id: 'main-2',
    text: 'Tidy living room clutter'
  }, {
    id: 'main-3',
    text: 'Put away shoes / bags'
  }, {
    id: 'main-4',
    text: 'Straighten anything that looks chaotic'
  }]
}, {
  id: 'floor',
  title: 'FLOOR SAVE (45-55 MIN)',
  notes: 'Because crumbs = instant judgment 😭',
  accent: 'from-rose-500 to-pink-700',
  tasks: [{
    id: 'flr-1',
    text: 'Quick vacuum or sweep'
  }, {
    id: 'flr-2',
    text: 'Spot clean obvious messes'
  }, {
    id: 'flr-3',
    text: 'Shake out rugs if needed'
  }]
}, {
  id: 'final',
  title: 'FINAL TOUCHES (55-60 MIN)',
  notes: "We're done... and we're proud of it",
  accent: 'from-pink-600 to-rose-700',
  tasks: [{
    id: 'fin-1',
    text: 'Take out trash'
  }, {
    id: 'fin-2',
    text: 'Spray something that smells good'
  }, {
    id: 'fin-3',
    text: 'Do a quick walkthrough'
  }, {
    id: 'fin-4',
    text: "Close doors to messy rooms (we don't talk about those)"
  }]
}];
export function HotMessCleanPage() {
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('hme-561-progress');
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
    localStorage.setItem('hme-561-progress', JSON.stringify(checkedTasks));
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
  return <div className="min-h-screen pb-24 bg-[#fff0f5]">
      {/* Glam Hero Section */}
      <div className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/ChatGPT_Image_Mar_23,_2026,_05_23_18_PM.png" alt="" className="w-full h-full object-cover opacity-50" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-[#fff0f5]/40 via-transparent to-[#fff0f5]" />
        </div>

        <SparkleEffect count={150} />

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-pink-300 text-sm font-bold text-pink-600 mb-6 uppercase tracking-wider shadow-sm">
            
            <SparklesIcon className="w-4 h-4" />1 Hour Reset
          </motion.div>

          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="font-heading text-5xl md:text-7xl font-bold text-[#8b1c4a] mb-6 drop-shadow-sm uppercase tracking-tight">
            
            Hot Mess <br /> Emergency Clean
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="text-xl md:text-2xl text-pink-700 font-medium max-w-2xl mx-auto italic">
            
            because we waited until the last minute... again ✨
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
      }} className="bg-white/90 backdrop-blur-xl border border-pink-200 rounded-3xl p-6 shadow-xl mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 sticky top-24 z-40">
          
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm font-bold text-pink-900 mb-3">
              <span className="flex items-center gap-2">
                Your Progress {isComplete && '🎉'}
              </span>
              <span>
                {progressPercentage}% ({completedTasks}/{totalTasks})
              </span>
            </div>
            <div className="h-4 w-full bg-pink-100 rounded-full overflow-hidden shadow-inner">
              <motion.div className="h-full bg-gradient-to-r from-pink-400 via-rose-500 to-fuchsia-500" initial={{
              width: 0
            }} animate={{
              width: `${progressPercentage}%`
            }} transition={{
              duration: 0.5,
              ease: 'easeOut'
            }} />
              
            </div>
          </div>

          <button onClick={resetProgress} className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-pink-300 text-pink-600 font-bold text-sm hover:bg-pink-50 hover:text-pink-800 transition-all shadow-sm">
            
            <RotateCcwIcon className="w-4 h-4" />
            Start Fresh
          </button>
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
        }} className="bg-white/80 backdrop-blur-md border border-pink-100 rounded-3xl overflow-hidden shadow-lg">
            
              {/* Section Header */}
              <div className={`bg-gradient-to-r ${section.accent} p-6 border-b border-white/20 text-center`}>
              
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-2 drop-shadow-sm">
                  {section.title}
                </h2>
                <p className="text-pink-100 font-medium text-sm md:text-base">
                  {section.notes}
                </p>
              </div>

              {/* Tasks */}
              <div className="p-2 sm:p-4">
                {section.tasks.map((task) => {
              const isChecked = checkedTasks[task.id] || false;
              return <label key={task.id} className={`flex items-center gap-4 p-4 cursor-pointer transition-all duration-300 rounded-2xl ${isChecked ? 'bg-pink-50/50' : 'hover:bg-pink-50/80'}`}>
                    
                      <div className="relative flex items-center justify-center shrink-0">
                        <input type="checkbox" className="peer sr-only" checked={isChecked} onChange={() => toggleTask(task.id)} />
                      
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isChecked ? 'bg-pink-500 border-pink-500 shadow-md shadow-pink-500/30' : 'border-pink-300 bg-white hover:border-pink-400'}`}>
                        
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
                      <span className={`text-lg transition-all duration-300 ${isChecked ? 'text-pink-300 line-through' : 'text-pink-900 font-medium'}`}>
                      
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
      }} className="mt-16 bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-600 rounded-[3rem] p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <SparklesIcon className="w-12 h-12 mx-auto mb-6 text-pink-200" />

          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 relative z-10">
            Want the printable version?
          </h2>
          <p className="text-pink-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto relative z-10 font-medium">
            Get the beautiful PDF to print for your fridge and keep your
            cleaning on track.
          </p>

          <a href="https://trippinwithmandy.gumroad.com/l/bklnc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-pink-600 font-bold text-lg hover:bg-pink-50 transition-all shadow-xl hover:-translate-y-1 relative z-10">
            
            <DownloadIcon className="w-5 h-5" />
            Get the Template ($2.99)
          </a>
        </motion.div>
      </div>
    </div>;
}