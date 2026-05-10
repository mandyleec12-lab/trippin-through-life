import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { SparkleEffect } from './SparkleEffect';
import { CheckIcon, RotateCcwIcon, SparklesIcon, ChevronDownIcon, ChevronUpIcon, ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
interface Task {
  id: string;
  text: string;
}
interface Subsection {
  title: string;
  tasks: Task[];
}
interface Tip {
  emoji: string;
  text: string;
}
interface FreeCleaningChecklistProps {
  title: string;
  subtitle: string;
  emoji: string;
  accent: string;
  headerColor: string;
  storageKey: string;
  backgroundImage: string;
  tasks?: Task[];
  subsections?: Subsection[];
  tips?: Tip[];
}
const allLists = [{
  title: 'Daily Reset',
  emoji: '🌿',
  path: '/free-resources/cleaning/daily'
}, {
  title: 'Weekly Clean',
  emoji: '🔁',
  path: '/free-resources/cleaning/weekly'
}, {
  title: 'Monthly',
  emoji: '📅',
  path: '/free-resources/cleaning/monthly'
}, {
  title: 'Quarterly',
  emoji: '🔄',
  path: '/free-resources/cleaning/quarterly'
}, {
  title: 'Every 6 Months',
  emoji: '🧠',
  path: '/free-resources/cleaning/biannual'
}, {
  title: 'Yearly',
  emoji: '🏡',
  path: '/free-resources/cleaning/yearly'
}];
export function FreeCleaningChecklist({
  title,
  subtitle,
  emoji,
  accent,
  headerColor,
  storageKey,
  backgroundImage,
  tasks,
  subsections,
  tips
}: FreeCleaningChecklistProps) {
  const location = useLocation();
  const otherLists = allLists.filter((list) => list.path !== location.pathname);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });
  // Initialize all subsections as expanded
  const initialExpandedState = subsections?.reduce((acc, sub) => {
    acc[sub.title] = true;
    return acc;
  }, {} as Record<string, boolean>) || {};
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(initialExpandedState);
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checkedTasks));
  }, [checkedTasks, storageKey]);
  const toggleTask = (taskId: string) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };
  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };
  const resetProgress = () => {
    if (window.confirm('Are you sure you want to uncheck all items and start over?')) {
      setCheckedTasks({});
    }
  };
  let totalTasks = 0;
  if (tasks) {
    totalTasks += tasks.length;
  }
  if (subsections) {
    subsections.forEach((sub) => {
      totalTasks += sub.tasks.length;
    });
  }
  const completedTasks = Object.values(checkedTasks).filter(Boolean).length;
  const progressPercentage = totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : 0;
  const isComplete = totalTasks > 0 && completedTasks === totalTasks;
  const renderTask = (task: Task) => {
    const isChecked = checkedTasks[task.id] || false;
    return <label key={task.id} className={`flex items-center gap-4 p-3 sm:p-4 cursor-pointer transition-all duration-300 rounded-2xl ${isChecked ? 'bg-white/40' : 'hover:bg-white/80'}`}>
        
        <div className="relative flex items-center justify-center shrink-0">
          <input type="checkbox" className="peer sr-only" checked={isChecked} onChange={() => toggleTask(task.id)} />
          
          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isChecked ? 'bg-cta-500 border-[3px] border-cta-500 shadow-md shadow-cta-500/30' : 'border-[3px] border-plum-500 bg-white hover:border-cta-400'}`}>
            
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
        <span className={`text-base sm:text-lg transition-all duration-300 ${isChecked ? 'text-plum-300 line-through' : `${headerColor} font-medium`}`}>
          
          {task.text}
        </span>
      </label>;
  };
  return <div className="min-h-screen pb-24 bg-[#fdf2f8]">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover object-center opacity-50" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/60 to-[#fdf2f8] backdrop-blur-[2px]" />
        </div>

        <SparkleEffect count={100} />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="mb-8 flex justify-center">
            <Link to="/free-resources/cleaning-schedule" className="inline-flex items-center gap-2 text-plum-600 hover:text-cta-500 font-bold transition-colors bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-plum-200">
              
              <ArrowLeftIcon className="w-4 h-4" />
              All Cleaning Schedules
            </Link>
          </div>

          <div className="text-center">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cta-500 text-white text-sm font-bold mb-6 uppercase tracking-wider shadow-lg shadow-cta-500/30">
              
              <SparklesIcon className="w-4 h-4" />
              Free Interactive List
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.1
          }} className="text-6xl md:text-8xl mb-4 drop-shadow-md">
              
              {emoji}
            </motion.div>

            <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2
          }} className="font-heading text-5xl md:text-7xl font-bold text-plum-800 mb-4 drop-shadow-sm uppercase tracking-tight">
              
              {title}
            </motion.h1>

            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3
          }} className="text-xl md:text-2xl text-plum-600 font-medium max-w-2xl mx-auto">
              
              {subtitle} ✨
            </motion.p>
          </div>
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
        delay: 0.4
      }} className="bg-white/90 backdrop-blur-xl border border-plum-100 rounded-3xl p-6 shadow-xl mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 sticky top-24 z-40">
          
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm font-bold text-plum-800 mb-3">
              <span className="flex items-center gap-2">
                Your Progress {isComplete && '🎉'}
              </span>
              <span>
                {progressPercentage}% ({completedTasks}/{totalTasks})
              </span>
            </div>
            <div className="h-4 w-full bg-plum-50 rounded-full overflow-hidden shadow-inner">
              <motion.div className="h-full bg-gradient-to-r from-plum-400 via-purple-400 to-cta-500" initial={{
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

        {/* Cleaning Tips */}
        {tips && tips.length > 0 && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.45
      }} className="bg-gradient-to-r from-amber-50/90 to-yellow-50/90 backdrop-blur-md border border-amber-200/50 rounded-3xl p-6 sm:p-8 shadow-lg mb-8">
          
            <h3 className="font-heading text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
              💡 Cleaning Reminders
            </h3>
            <div className="space-y-3">
              {tips.map((tip, i) => <div key={i} className="flex items-start gap-3">
                  <span className="text-lg shrink-0">{tip.emoji}</span>
                  <p className="text-amber-900 font-semibold text-sm sm:text-base">
                    {tip.text}
                  </p>
                </div>)}
            </div>
          </motion.div>}

        {/* Checklist Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="bg-white/70 backdrop-blur-md border border-white rounded-3xl overflow-hidden shadow-lg mb-16">
          
          <div className={`bg-gradient-to-r ${accent} p-6 sm:p-8 border-b border-white/50`}>
            
            <h2 className={`font-heading text-2xl sm:text-3xl font-bold ${headerColor} uppercase tracking-wide`}>
              
              Tasks
            </h2>
          </div>

          <div className="p-4 sm:p-6">
            {/* Simple Tasks List */}
            {tasks && <div className="space-y-1">
                {tasks.map((task) => renderTask(task))}
              </div>}

            {/* Subsections (for Weekly) */}
            {subsections && <div className="space-y-4">
                {subsections.map((sub, subIdx) => <div key={subIdx} className="bg-white/50 rounded-2xl overflow-hidden border border-white/50">
                
                    <button onClick={() => toggleSection(sub.title)} className="w-full flex items-center justify-between p-4 bg-white/40 hover:bg-white/60 transition-colors">
                  
                      <h3 className={`font-bold text-lg ${headerColor}`}>
                        {sub.title}
                      </h3>
                      {expandedSections[sub.title] ? <ChevronUpIcon className={`w-5 h-5 ${headerColor}`} /> : <ChevronDownIcon className={`w-5 h-5 ${headerColor}`} />}
                    </button>

                    <AnimatePresence>
                      {expandedSections[sub.title] && <motion.div initial={{
                  height: 0,
                  opacity: 0
                }} animate={{
                  height: 'auto',
                  opacity: 1
                }} exit={{
                  height: 0,
                  opacity: 0
                }} className="overflow-hidden">
                    
                          <div className="p-2 border-t border-white/50">
                            {sub.tasks.map((task) => renderTask(task))}
                          </div>
                        </motion.div>}
                    </AnimatePresence>
                  </div>)}
              </div>}
          </div>
        </motion.div>

        {/* Bottom Navigation (Other Lists) */}
        <div className="mb-16">
          <h3 className="font-heading text-2xl font-bold text-plum-800 mb-6 text-center">
            Jump to another list
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {otherLists.map((list, idx) => <Link key={idx} to={list.path} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-plum-200 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-plum-300 transition-all text-plum-700 font-bold">
              
                <span className="text-xl">{list.emoji}</span>
                {list.title}
              </Link>)}
          </div>
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
      }} className="rounded-[3rem] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden" style={{
        backgroundColor: '#2D1533'
      }}>
          
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" style={{
          backgroundColor: 'rgba(214, 51, 133, 0.15)'
        }} />
          
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" style={{
          backgroundColor: 'rgba(147, 51, 234, 0.15)'
        }} />
          

          <div className="w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center relative z-10" style={{
          backgroundColor: 'rgba(214, 51, 133, 0.2)'
        }}>
            
            <SparklesIcon className="w-8 h-8" style={{
            color: '#F472B6'
          }} />
            
          </div>

          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 relative z-10" style={{
          color: '#ffffff'
        }}>
            
            Want more step-by-step guides?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto relative z-10 font-medium leading-relaxed" style={{
          color: 'rgba(255, 255, 255, 0.85)'
        }}>
            
            If you loved this free schedule, check out my premium deep-dive
            checklists. They come with printable PDFs!
          </p>

          <Link to="/checklists" className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:-translate-y-1 relative z-10" style={{
          backgroundColor: '#D63385',
          color: '#ffffff'
        }}>
            
            Browse Premium Checklists
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>;
}