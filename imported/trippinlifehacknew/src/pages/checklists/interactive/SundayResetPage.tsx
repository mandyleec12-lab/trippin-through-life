import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SparkleEffect } from '../../../components/SparkleEffect';
import { CheckIcon, RotateCcwIcon, DownloadIcon, SparklesIcon } from 'lucide-react';
const checklistData = [{
  id: 'vibe',
  title: 'SET THE VIBE.',
  time: '(5—10 min)',
  notes: "We're setting the tone first. Clean energy starts with how the space feels, not just how it looks.",
  accent: 'from-pink-100 to-rose-50',
  tasks: [{
    id: 'vibe-1',
    text: 'Light a candle / open windows'
  }, {
    id: 'vibe-2',
    text: 'Put on a playlist or podcast'
  }, {
    id: 'vibe-3',
    text: 'Empty and load dishwasher'
  }, {
    id: 'vibe-4',
    text: 'Quick declutter of obvious mess'
  }, {
    id: 'vibe-5',
    text: 'Start a load of laundry'
  }]
}, {
  id: 'space',
  title: 'RESET YOUR SPACE',
  time: '(20—30 min)',
  notes: "Focus on visible areas first. If you see completion you feel like you've accomplished something.",
  accent: 'from-purple-100 to-fuchsia-50',
  tasks: [{
    id: 'space-1',
    text: 'Clear and wipe surfaces (kitchen, tables, bathroom)'
  }, {
    id: 'space-2',
    text: 'Take out trash'
  }, {
    id: 'space-3',
    text: 'Fold / switch laundry'
  }]
}, {
  id: 'comfort',
  title: 'RESET YOUR COMFORT ZONE',
  time: '(10—15 min)',
  notes: 'Your space should feel like peace again. This is your recharge zone',
  accent: 'from-blue-100 to-sky-50',
  tasks: [{
    id: 'comfort-1',
    text: 'Make the bed and change pillows cases.'
  }, {
    id: 'comfort-2',
    text: 'Quick bedroom tidy'
  }, {
    id: 'comfort-3',
    text: 'Put away/ hang clothes'
  }, {
    id: 'comfort-4',
    text: 'Vacuum'
  }]
}, {
  id: 'bathroom',
  title: 'Reset Your Bathroom',
  time: '(10—15 min)',
  notes: 'Quick refresh, not a deep clean. A clean bathroom instantly makes everything feel more put together.',
  accent: 'from-teal-100 to-emerald-50',
  tasks: [{
    id: 'bath-1',
    text: 'pickup any thing out of place.'
  }, {
    id: 'bath-2',
    text: 'Wipe sink, shower or bath, and counter'
  }, {
    id: 'bath-3',
    text: 'Clean toilet (seat + quick bowl scrub)'
  }, {
    id: 'bath-4',
    text: 'Take out trash and sweep/mop floors'
  }]
}, {
  id: 'life',
  title: 'RESET YOUR LIFE',
  time: '(10—15 min)',
  notes: 'Get ahead of the week, not behind it. A little planning now saves a lot of stress later.',
  accent: 'from-orange-100 to-amber-50',
  tasks: [{
    id: 'life-1',
    text: 'Plan meals / quick grocery list'
  }, {
    id: 'life-2',
    text: "Restock essentials and note what you're low on"
  }, {
    id: 'life-3',
    text: 'Set out clothes for the next day'
  }, {
    id: 'life-4',
    text: 'Check calendar for the week highlight top 3 priorities.'
  }]
}];
export function SundayResetPage() {
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('sr-847-progress');
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
    localStorage.setItem('sr-847-progress', JSON.stringify(checkedTasks));
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
  return <div className="min-h-screen pb-24 bg-[#fdf2f8]">
      {/* Glam Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/file_0000000072cc722f9a948e7c2f07609c.png" alt="" className="w-full h-full object-cover object-center opacity-40" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/60 to-[#fdf2f8] backdrop-blur-[2px]" />
        </div>

        <SparkleEffect count={120} />

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-pink-200 text-sm font-bold text-pink-600 mb-6 uppercase tracking-wider shadow-sm">
            
            <SparklesIcon className="w-4 h-4" />
            Interactive Checklist
          </motion.div>

          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="font-heading text-5xl md:text-7xl font-bold text-[#2d1533] mb-6 drop-shadow-sm">
            
            Sunday Reset Routine
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="text-xl md:text-2xl text-plum-700 font-medium max-w-2xl mx-auto italic">
            
            Romanticize your reset instead of dreading your week ✨
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
      }} className="bg-white/80 backdrop-blur-xl border border-pink-100 rounded-3xl p-6 shadow-xl mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 sticky top-24 z-40">
          
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm font-bold text-plum-800 mb-3">
              <span className="flex items-center gap-2">
                Your Progress {isComplete && '🎉'}
              </span>
              <span>
                {progressPercentage}% ({completedTasks}/{totalTasks})
              </span>
            </div>
            <div className="h-4 w-full bg-pink-50 rounded-full overflow-hidden shadow-inner">
              <motion.div className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-cta-500" initial={{
              width: 0
            }} animate={{
              width: `${progressPercentage}%`
            }} transition={{
              duration: 0.5,
              ease: 'easeOut'
            }} />
              
            </div>
          </div>

          <button onClick={resetProgress} className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-plum-200 text-plum-600 font-bold text-sm hover:bg-plum-50 hover:text-plum-800 transition-all shadow-sm">
            
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
        }} className="bg-white/60 backdrop-blur-md border border-white rounded-3xl overflow-hidden shadow-lg">
            
              {/* Section Header */}
              <div className={`bg-gradient-to-r ${section.accent} p-6 border-b border-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
              
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-plum-900 uppercase tracking-wide">
                    {section.title}
                  </h2>
                  <p className="text-plum-600 font-bold mt-1">{section.time}</p>
                </div>
                <div className="bg-white/60 px-4 py-3 rounded-2xl max-w-xs">
                  <p className="text-xs text-plum-800 italic font-medium leading-relaxed">
                    "{section.notes}"
                  </p>
                </div>
              </div>

              {/* Tasks */}
              <div className="p-2 sm:p-4">
                {section.tasks.map((task) => {
              const isChecked = checkedTasks[task.id] || false;
              return <label key={task.id} className={`flex items-center gap-4 p-4 cursor-pointer transition-all duration-300 rounded-2xl ${isChecked ? 'bg-white/40' : 'hover:bg-white/80'}`}>
                    
                      <div className="relative flex items-center justify-center shrink-0">
                        <input type="checkbox" className="peer sr-only" checked={isChecked} onChange={() => toggleTask(task.id)} />
                      
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isChecked ? 'bg-cta-500 border-cta-500 shadow-md shadow-cta-500/30' : 'border-plum-300 bg-white hover:border-cta-400'}`}>
                        
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
                      <span className={`text-lg transition-all duration-300 ${isChecked ? 'text-plum-300 line-through' : 'text-plum-800 font-medium'}`}>
                      
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
      }} className="mt-16 bg-gradient-to-br from-pink-500 via-purple-500 to-cta-600 rounded-[3rem] p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <SparklesIcon className="w-12 h-12 mx-auto mb-6 text-pink-200" />

          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 relative z-10">
            Love this checklist?
          </h2>
          <p className="text-pink-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto relative z-10 font-medium">
            Get the beautiful printable PDF for your fridge and keep your reset
            routine on track.
          </p>

          <a href="https://trippinwithmandy.gumroad.com/l/puiyqk" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-purple-600 font-bold text-lg hover:bg-pink-50 transition-all shadow-xl hover:-translate-y-1 relative z-10">
            
            <DownloadIcon className="w-5 h-5" />
            Get the Template ($2.99)
          </a>
        </motion.div>
      </div>
    </div>;
}