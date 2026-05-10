import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SparkleEffect } from '../../components/SparkleEffect';
import { ClipboardListIcon, PaletteIcon, FileTextIcon, LockIcon, ArrowLeftIcon, ArrowRightIcon, SparklesIcon } from 'lucide-react';
export function SelfCareListsPage() {
  const checklists = [{
    name: 'Morning Routine Reset',
    price: '$2.99',
    description: "Build a morning that doesn't start with doom-scrolling. A step-by-step checklist to create a routine that actually sets you up for the day.",
    includes: ['Free Interactive Checklist', 'Printable PDF'],
    link: '',
    accent: 'from-sky-100/40 to-white/30',
    borderColor: 'border-sky-200/50',
    icon: '☀️',
    comingSoon: true
  }, {
    name: 'Ultimate Glow-Up Guide',
    price: '$2.99',
    description: 'Your step-by-step checklist for a full mind, body, and soul reset.',
    includes: ['Free Interactive Checklist', 'Printable PDF'],
    link: '',
    accent: 'from-blush-100/40 to-lavender-100/30',
    borderColor: 'border-blush-200/50',
    icon: '✨',
    comingSoon: true
  }];
  return <div className="min-h-screen pt-24 pb-24 relative">
      <img src="/ChatGPT_Image_Mar_21,_2026,_09_37_08_PM.png" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-contain object-top pointer-events-none z-0" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/70 z-0" />

      <section className="relative py-12 text-center overflow-hidden">
        <SparkleEffect count={50} />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="mb-8 flex justify-center">
            <Link to="/checklists" className="inline-flex items-center gap-2 text-plum-500 hover:text-cta-500 font-bold transition-colors">
              
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Categories
            </Link>
          </div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-sm border border-blush-200/50 text-sm font-bold text-plum-700 mb-6 uppercase tracking-wider">
            
            <ClipboardListIcon className="w-4 h-4 text-cta-500" />
            Category
          </motion.div>

          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="font-heading text-5xl md:text-6xl font-bold text-plum-700 mb-6">
            
            Self-Care & <span className="text-cta-500">Glow-Up</span>
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="text-xl text-plum-500 font-medium max-w-2xl mx-auto">
            
            Because you deserve to feel good. Routines and resets for your mind
            and body.
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12">
        {/* Free Interactive Checklist */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="bg-gradient-to-br from-pink-50 to-purple-50 backdrop-blur-sm border-2 border-pink-200 rounded-[2rem] p-8 shadow-md mb-10">
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-5xl">🧖‍♀️</div>
            <div className="flex-grow text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500 text-white text-xs font-bold mb-3 uppercase tracking-wider">
                <SparklesIcon className="w-3 h-3" />
                Free Interactive Checklist
              </div>
              <h3 className="font-heading text-2xl font-bold text-pink-800 mb-2">
                Daily Self-Care & Hygiene Ritual
              </h3>
              <p className="text-pink-600 font-medium">
                Your daily hygiene & wellness ritual — shower, skincare,
                hydration, movement, and mindful moments. Track your self-care
                every day!
              </p>
            </div>
            <Link to="/free-resources/self-care/daily" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-pink-500 text-white font-bold text-sm hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/20 shrink-0">
              
              Try It Free
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        <h2 className="font-heading text-2xl font-bold text-plum-700 mb-6 text-center">
          Premium Checklists
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {checklists.map((item, i) => <motion.div key={i} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: i * 0.1
        }} className={`relative bg-gradient-to-br ${item.accent} backdrop-blur-sm ${item.borderColor} border rounded-[2rem] p-6 shadow-sm opacity-75 transition-all duration-300 flex flex-col`}>
            
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/80 text-plum-500 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1 border border-plum-100">
                <LockIcon className="w-3 h-3" /> Coming Soon
              </div>

              <div className="text-4xl mb-4">{item.icon}</div>

              <h3 className="font-heading text-lg font-bold text-plum-700 mb-2 leading-snug">
                {item.name}
              </h3>

              <p className="text-plum-500 text-sm font-medium mb-4 flex-grow">
                {item.description}
              </p>

              <div className="space-y-2 mb-5">
                {item.includes.map((inc, j) => <div key={j} className="flex items-center gap-2 text-xs font-bold text-plum-600">
                
                    {j === 0 ? <PaletteIcon className="w-3.5 h-3.5 text-cta-500 shrink-0" /> : <FileTextIcon className="w-3.5 h-3.5 text-cta-500 shrink-0" />}
                    {inc}
                  </div>)}
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-plum-100/30">
                <span className="font-heading text-2xl font-bold text-plum-700">
                  {item.price}
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-plum-200/50 text-plum-500 font-bold text-xs">
                  <LockIcon className="w-3 h-3" />
                  Soon
                </span>
              </div>
            </motion.div>)}
        </div>
      </section>
    </div>;
}