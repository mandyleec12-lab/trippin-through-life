import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SparkleEffect } from '../../../components/SparkleEffect';
import { SparklesIcon, ArrowRightIcon } from 'lucide-react';
const scheduleCards = [{
  title: 'Daily Reset',
  subtitle: 'quick + realistic',
  emoji: '🌿',
  accent: 'from-emerald-100 to-teal-50',
  borderColor: 'border-emerald-200',
  textColor: 'text-emerald-800',
  taskCount: '6 tasks',
  path: '/free-resources/cleaning/daily'
}, {
  title: 'Weekly Clean',
  subtitle: 'your "keep the house together" reset',
  emoji: '🔁',
  accent: 'from-blue-100 to-sky-50',
  borderColor: 'border-blue-200',
  textColor: 'text-blue-800',
  taskCount: '21 tasks',
  path: '/free-resources/cleaning/weekly'
}, {
  title: 'Monthly Deep Clean',
  subtitle: 'the stuff people start ignoring 👀',
  emoji: '📅',
  accent: 'from-purple-100 to-fuchsia-50',
  borderColor: 'border-purple-200',
  textColor: 'text-purple-800',
  taskCount: '8 tasks',
  path: '/free-resources/cleaning/monthly'
}, {
  title: 'Every 3 Months',
  subtitle: 'QUARTERLY RESET',
  emoji: '🔄',
  accent: 'from-amber-100 to-orange-50',
  borderColor: 'border-amber-200',
  textColor: 'text-amber-800',
  taskCount: '6 tasks',
  path: '/free-resources/cleaning/quarterly'
}, {
  title: 'Every 6 Months',
  subtitle: 'THE "people forget this" list 🔥',
  emoji: '🧠',
  accent: 'from-rose-100 to-pink-50',
  borderColor: 'border-rose-200',
  textColor: 'text-rose-800',
  taskCount: '8 tasks',
  path: '/free-resources/cleaning/biannual'
}, {
  title: 'Yearly Reset',
  subtitle: 'full life refresh energy',
  emoji: '🏡',
  accent: 'from-indigo-100 to-violet-50',
  borderColor: 'border-indigo-200',
  textColor: 'text-indigo-800',
  taskCount: '6 tasks',
  path: '/free-resources/cleaning/yearly'
}];
export function UltimateCleaningSchedulePage() {
  return <div className="min-h-screen pb-24 bg-[#fdf2f8]">
      {/* Glam Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/ChatGPT_Image_Mar_22,_2026,_10_03_10_PM.png" alt="" className="w-full h-full object-cover object-center opacity-50" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/60 to-[#fdf2f8] backdrop-blur-[2px]" />
        </div>

        <SparkleEffect count={150} />

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cta-500 text-white text-sm font-bold mb-6 uppercase tracking-wider shadow-lg shadow-cta-500/30">
            
            <SparklesIcon className="w-4 h-4" />
            Free Interactive Lists
          </motion.div>

          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="font-heading text-5xl md:text-7xl font-bold text-plum-800 mb-6 drop-shadow-sm">
            
            The Ultimate <br /> Cleaning Schedule
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="text-xl md:text-2xl text-plum-600 font-medium max-w-2xl mx-auto">
            
            What to clean & when so your life doesn't feel chaotic ✨
          </motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white mb-12 text-center">
          
          <p className="text-lg text-plum-700 font-medium">
            Pick a schedule below and start checking things off. Each list saves
            your progress so you can come back anytime!
          </p>
        </motion.div>

        {/* Grid of Schedules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {scheduleCards.map((card, idx) => <motion.div key={idx} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4 + idx * 0.1
        }}>
            
              <Link to={card.path} className={`group block h-full bg-gradient-to-br ${card.accent} border ${card.borderColor} rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden`}>
              
                <div className="absolute top-6 right-6 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-plum-600">
                  {card.taskCount}
                </div>

                <div className="text-6xl mb-6 drop-shadow-md group-hover:scale-110 transition-transform duration-300 origin-bottom-left">
                  {card.emoji}
                </div>

                <h2 className={`font-heading text-2xl font-bold ${card.textColor} mb-2 uppercase tracking-wide`}>
                
                  {card.title}
                </h2>

                <p className={`font-bold opacity-80 ${card.textColor} mb-8`}>
                  {card.subtitle}
                </p>

                <div className="flex items-center gap-2 font-bold text-plum-700 group-hover:text-cta-600 transition-colors mt-auto">
                  Start Checklist{' '}
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
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
            
            If you loved these free schedules, check out my premium deep-dive
            checklists. They come with printable PDFs!
          </p>

          <Link to="/checklists/cleaning" className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:-translate-y-1 relative z-10" style={{
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