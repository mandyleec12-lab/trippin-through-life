import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SparkleEffect } from '../../components/SparkleEffect';
import { ClipboardListIcon, PaletteIcon, FileTextIcon, ExternalLinkIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
export function CleaningListsPage() {
  const checklists = [{
    name: '1 Hour Emergency Hot Mess Clean',
    price: '$2.99',
    description: "For when someone's coming over and you waited till the last minute. This checklist gets your place looking put-together in 60 minutes flat—no judgment, just results.",
    includes: ['Interactive Checklist (included with purchase)', 'Printable PDF'],
    link: 'https://trippinwithmandy.gumroad.com/l/bklnc',
    accent: 'from-blush-100/40 to-cta-100/30',
    borderColor: 'border-blush-200/50',
    icon: '🧹'
  }, {
    name: 'Sunday Reset Checklist',
    price: '$2.99',
    description: 'Your weekly reset starts here. A step-by-step checklist to get your space, your mind, and your week back on track every Sunday.',
    includes: ['Interactive Checklist (included with purchase)', 'Printable PDF'],
    link: 'https://trippinwithmandy.gumroad.com/l/puiyqk',
    accent: 'from-lavender-100/40 to-blush-100/30',
    borderColor: 'border-lavender-200/50',
    icon: '🫧'
  }, {
    name: 'Cleaning Tasks People Forget',
    price: '$1.99',
    description: 'The stuff you should be cleaning (and actually when to clean it). A realistic list of the tasks everyone forgets — weekly, bi-weekly, monthly, and seasonal — plus a timeline so you stop guessing and start fresh.',
    includes: ['Free Interactive Checklist', 'Printable PDF Checklist (paid)'],
    link: 'https://trippinwithmandy.gumroad.com/l/lnsfo',
    accent: 'from-sky-100/40 to-white/30',
    borderColor: 'border-sky-200/50',
    icon: '📋'
  }, {
    name: 'Ultimate Kitchen Cleaning Guide',
    price: '$3.99',
    description: 'A 4-page deep clean guide covering every zone of your kitchen — including the spots most people forget. 85+ tasks across 15 sections with pro tips built in. Comes with an interactive digital version too.',
    includes: ['Interactive Digital Checklist (included with purchase)', 'Printable PDF (4 Pages)'],
    link: 'https://trippinwithmandy.gumroad.com/l/mdpjew',
    accent: 'from-teal-100/40 to-emerald-50/30',
    borderColor: 'border-teal-200/50',
    icon: '✨'
  }, {
    name: 'Ultimate Living Room Cleaning Guide',
    price: '$3.99',
    description: 'A 4-page deep clean guide for your living room — from clutter and dusting to floors and final touches. 13 sections covering every surface, soft item, and forgotten spot. Includes an interactive digital version.',
    includes: ['Interactive Digital Checklist (included with purchase)', 'Printable PDF (4 Pages)'],
    link: 'https://trippinwithmandy.gumroad.com/l/tdsgi',
    accent: 'from-rose-100/40 to-pink-50/30',
    borderColor: 'border-rose-200/50',
    icon: '🛋️'
  }, {
    name: 'Ultimate Half Bathroom Cleaning Checklist',
    price: '$3.99',
    description: 'A comprehensive deep clean guide for your half bathroom (powder room). Covers every surface from top to bottom, including the spots most people forget. Includes an interactive digital version.',
    includes: ['Interactive Digital Checklist (included with purchase)', 'Printable PDF (5 Pages)'],
    link: 'https://trippinwithmandy.gumroad.com/l/xetmry',
    accent: 'from-teal-100/40 to-emerald-50/30',
    borderColor: 'border-teal-200/50',
    icon: '🚽'
  }, {
    name: 'Ultimate Full Bathroom Cleaning Guide',
    price: '$3.99',
    description: 'The deep clean guide for your full bathroom — bath, shower, or combo. Every surface, every corner, every forgotten spot. 13 sections with 100+ tasks.',
    includes: ['Interactive Digital Checklist (included with purchase)', 'Printable PDF (3 Pages)'],
    link: 'https://trippinwithmandy.gumroad.com/l/aslgj',
    accent: 'from-blue-100/40 to-slate-50/30',
    borderColor: 'border-blue-200/50',
    icon: '🛁'
  }];
  return <div className="min-h-screen pt-24 pb-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blush-50 via-white to-lavender-50/30 z-0" />

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
            
            Cleaning <span className="text-cta-500">Lists</span>
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
            
            Get your space together without losing your mind. Step-by-step
            guides for every mess — from quick resets to full deep cleans.
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* FREE SAMPLE CARD */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="group relative bg-gradient-to-br from-cta-100/50 to-white backdrop-blur-sm border-2 border-cta-300 rounded-[2rem] p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
            
            <div className="absolute -top-4 -right-4 bg-cta-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform rotate-12">
              FREE SAMPLE ✨
            </div>

            <div className="text-5xl mb-6">✨</div>

            <h3 className="font-heading text-2xl font-bold text-plum-800 mb-3 leading-snug">
              The Ultimate Cleaning Schedule
            </h3>

            <p className="text-plum-600 font-medium mb-6 flex-grow">
              What to clean & when so your life doesn't feel chaotic. Try our
              interactive cleaning schedule — check things off, track your
              progress, and finally stop guessing what needs to be done.
            </p>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-cta-200">
              <span className="font-heading text-3xl font-bold text-cta-600">
                FREE
              </span>
              <Link to="/free-resources/cleaning-schedule" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cta-500 text-white font-bold text-sm group-hover:bg-cta-600 transition-colors shadow-lg shadow-cta-500/20">
                
                Try It Now
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* PAID CHECKLISTS */}
          {checklists.map((item, i) => <motion.a key={i} href={item.link} target="_blank" rel="noopener noreferrer" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: (i + 1) * 0.1
        }} className={`group relative bg-gradient-to-br ${item.accent} backdrop-blur-sm ${item.borderColor} border rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col`}>
            
              <div className="text-5xl mb-6">{item.icon}</div>

              <h3 className="font-heading text-2xl font-bold text-plum-700 mb-3 leading-snug">
                {item.name}
              </h3>

              <p className="text-plum-500 font-medium mb-6 flex-grow">
                {item.description}
              </p>

              <div className="space-y-3 mb-8">
                {item.includes.map((inc, j) => <div key={j} className="flex items-center gap-2 text-sm font-bold text-plum-600">
                
                    {j === 0 ? <PaletteIcon className="w-4 h-4 text-cta-500 shrink-0" /> : <FileTextIcon className="w-4 h-4 text-cta-500 shrink-0" />}
                    {inc}
                  </div>)}
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-plum-100/30">
                <span className="font-heading text-3xl font-bold text-plum-700">
                  {item.price}
                </span>
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cta-500 text-white font-bold text-sm group-hover:bg-cta-600 transition-colors shadow-lg shadow-cta-500/20">
                  Get It
                  <ExternalLinkIcon className="w-4 h-4" />
                </span>
              </div>
            </motion.a>)}
        </div>
      </section>
    </div>;
}