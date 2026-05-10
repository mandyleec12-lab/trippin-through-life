import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SparkleEffect } from '../components/SparkleEffect';
import { ClipboardListIcon, ArrowRightIcon } from 'lucide-react';
export function ChecklistsPage() {
  const categories = [{
    name: 'Cleaning Lists',
    description: 'Step-by-step guides for every mess, from 1-hour emergencies to deep cleans.',
    path: '/checklists/cleaning',
    icon: '🧹',
    accent: 'from-blush-100/60 to-white/40',
    borderColor: 'border-blush-200/50',
    count: '8 Checklists',
    hasFree: true
  }, {
    name: 'Travel Lists',
    description: 'Pack smart, travel stress-free, and never forget the essentials again.',
    path: '/checklists/travel',
    icon: '✈️',
    accent: 'from-sky-100/60 to-white/40',
    borderColor: 'border-sky-200/50',
    count: '3 Checklists',
    hasFree: true
  }, {
    name: 'Self-Care & Glow-Up',
    description: 'Because you deserve to feel good. Routines and resets for your mind and body.',
    path: '/checklists/self-care',
    icon: '✨',
    accent: 'from-blush-100/60 to-lavender-100/40',
    borderColor: 'border-plum-200/50',
    count: '1 Free Checklist',
    hasFree: true
  }, {
    name: 'Life Organization',
    description: 'Get your shit together, one list at a time. From budgets to meal prep.',
    path: '/checklists/organization',
    icon: '📋',
    accent: 'from-lavender-100/60 to-white/40',
    borderColor: 'border-lavender-200/50',
    count: 'Coming Soon',
    hasFree: false
  }, {
    name: 'Life Hacks',
    description: 'Work smarter, not harder. Cheatsheets for when you just need things to be easier.',
    path: '/checklists/hacks',
    icon: '💡',
    accent: 'from-amber-100/60 to-white/40',
    borderColor: 'border-amber-200/50',
    count: 'Coming Soon',
    hasFree: false
  }];
  return <div className="min-h-screen pt-24 pb-24 relative">
      {/* Background */}
      <img src="/ChatGPT_Image_Mar_21,_2026,_09_37_08_PM.png" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-contain object-top pointer-events-none z-0" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/70 z-0" />

      {/* Hero */}
      <section className="relative py-20 text-center overflow-hidden">
        <SparkleEffect count={90} />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-sm border border-blush-200/50 text-sm font-bold text-plum-700 mb-6 uppercase tracking-wider">
            
            <ClipboardListIcon className="w-4 h-4 text-cta-500" />
            The Ultimate Checklist Guide
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
            
            Checklist <span className="text-cta-500">Categories</span>
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
            
            Find exactly what you need. Browse our growing library of individual
            checklists, planners, and guides by category.
          </motion.p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, i) => <motion.div key={i} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: i * 0.1
        }}>
            
              <Link to={category.path} className={`group block relative bg-gradient-to-br ${category.accent} backdrop-blur-sm ${category.borderColor} border rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col`}>
              
                <div className="flex items-start justify-between mb-6">
                  <div className="text-5xl">{category.icon}</div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="px-3 py-1 bg-white/60 text-plum-600 text-xs font-bold rounded-full uppercase tracking-wider">
                      {category.count}
                    </div>
                    {category.hasFree && <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-[11px] font-extrabold rounded-full uppercase tracking-wider shadow-md shadow-emerald-400/30 animate-pulse">
                        🎉 Free Options Available!
                      </div>}
                  </div>
                </div>

                <h3 className="font-heading text-2xl font-bold text-plum-700 mb-3">
                  {category.name}
                </h3>

                <p className="text-plum-600 font-medium mb-8 flex-grow">
                  {category.description}
                </p>

                <div className="flex items-center text-cta-500 font-bold group-hover:text-cta-600 transition-colors mt-auto">
                  Browse Category
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </motion.div>)}
        </div>
      </section>
    </div>;
}