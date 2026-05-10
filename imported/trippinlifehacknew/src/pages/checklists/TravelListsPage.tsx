import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SparkleEffect } from '../../components/SparkleEffect';
import { ClipboardListIcon, PaletteIcon, FileTextIcon, LockIcon, ArrowLeftIcon } from 'lucide-react';
export function TravelListsPage() {
  const checklists = [{
    name: 'Pre-Trip Home Prep',
    price: 'FREE',
    description: 'What to do before you leave so you come back to a peaceful, clean home.',
    includes: ['Free Interactive Checklist'],
    link: '/free-resources/travel/home-prep',
    accent: 'from-emerald-100/40 to-teal-50/30',
    borderColor: 'border-emerald-200/50',
    icon: '🏡',
    comingSoon: false
  }, {
    name: 'Ultimate Tropical Cruise Packing Guide',
    price: '$3.99',
    description: "If you're going somewhere humid with water, you need this. A comprehensive packing checklist PLUS helpful cruise tips and tricks.",
    includes: ['Interactive Digital Checklist (included with purchase)', 'Printable PDF'],
    link: 'https://trippinwithmandy.gumroad.com/l/tbjrtz',
    accent: 'from-sky-100/40 to-cyan-50/30',
    borderColor: 'border-sky-200/50',
    icon: '🌴',
    comingSoon: false
  }, {
    name: 'Ultimate Cold Climate Cruise Packing Guide',
    price: '$3.99',
    description: "If you're heading somewhere cold, icy, or remote — this is your ultimate packing guide. Layer smart and stay warm.",
    includes: ['Interactive Digital Checklist (included with purchase)', 'Printable PDF'],
    link: 'https://trippinwithmandy.gumroad.com/l/pkujp',
    accent: 'from-indigo-100/40 to-violet-50/30',
    borderColor: 'border-indigo-200/50',
    icon: '❄️',
    comingSoon: false
  }];
  return <div className="min-h-screen pt-24 pb-24 relative">
      <img src="/ChatGPT_Image_Mar_21,_2026,_08_52_39_PM.png" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-contain object-top pointer-events-none z-0" />
      
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
            
            Travel <span className="text-cta-500">Lists</span>
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
            
            Pack smart, travel stress-free, and never forget the essentials
            again.
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
        }} className={`relative bg-gradient-to-br ${item.accent} backdrop-blur-sm ${item.borderColor} border rounded-[2rem] p-6 shadow-sm ${item.comingSoon ? 'opacity-75' : ''} transition-all duration-300 flex flex-col`}>
            
              {item.comingSoon && <div className="absolute top-4 right-4 px-3 py-1 bg-white/80 text-plum-500 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1 border border-plum-100">
                  <LockIcon className="w-3 h-3" /> Coming Soon
                </div>}

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
                {item.comingSoon ? <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-plum-200/50 text-plum-500 font-bold text-xs">
                    <LockIcon className="w-3 h-3" />
                    Soon
                  </span> : item.price === 'FREE' ? <Link to={item.link} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors shadow-md">
                
                    Open Free
                  </Link> : <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cta-500 text-white font-bold text-xs hover:bg-cta-600 transition-colors shadow-md">
                
                    Get It
                  </a>}
              </div>
            </motion.div>)}
        </div>
      </section>
    </div>;
}