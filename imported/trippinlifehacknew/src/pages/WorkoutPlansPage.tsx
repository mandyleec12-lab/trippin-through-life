import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SparkleEffect } from '../components/SparkleEffect';
import { DumbbellIcon, HeartPulseIcon, FlameIcon, SparklesIcon } from 'lucide-react';
import { GlitterHeart } from '../components/GlitterHeart';
export function WorkoutPlansPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const formData = new FormData();
      formData.append('fields[email]', email);
      formData.append('ml-submit', '1');
      formData.append('anticsrf', 'true');
      await fetch('https://assets.mailerlite.com/jsonp/2211088/forms/182597071850702388/subscribe', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };
  return <div className="min-h-screen pt-24 pb-24 overflow-hidden relative">
      {/* Full background image */}
      <img src="/ChatGPT_Image_Mar_21,_2026,_09_25_04_PM.png" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-contain object-top pointer-events-none z-0" />
      
      {/* Soft overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-lavender-50/70 z-0" />
      <SparkleEffect count={100} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-12">
          {/* Text Content */}
          <motion.div initial={{
          opacity: 0,
          x: -30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8
        }}>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-sm border border-blush-200/50 text-sm font-bold text-plum-700 mb-8 shadow-sm uppercase tracking-wider">
              <FlameIcon className="w-4 h-4 text-cta-500 animate-pulse" />
              Coming Soon
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-bold text-plum-700 mb-6 leading-tight">
              Trippin' <br />
              <span className="text-cta-500">in Motion</span>
            </h1>

            <p className="text-xl text-plum-500 mb-8 leading-relaxed font-medium">
              Workout plans designed for real life, real bodies, and real
              healing. No toxic diet culture, no punishing yourself—just
              movement that makes you feel strong, capable, and unapologetically
              badass.
            </p>

            <ul className="space-y-4 mb-10">
              {[{
              icon: <DumbbellIcon className="w-5 h-5 text-cta-500" />,
              text: 'Strength building without the gym intimidation'
            }, {
              icon: <HeartPulseIcon className="w-5 h-5 text-cta-500" />,
              text: 'Movement designed for nervous system regulation'
            }, {
              icon: <SparklesIcon className="w-5 h-5 text-cta-500" />,
              text: 'Routines that fit into your actual, messy life'
            }].map((feature, i) => <li key={i} className="flex items-center gap-3 text-plum-700 font-bold">
                
                  <div className="bg-white p-2 rounded-full shadow-sm border border-blush-100">
                    {feature.icon}
                  </div>
                  {feature.text}
                </li>)}
            </ul>

            <div className="bg-white/40 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-blush-200/50 shadow-lg">
              {status === 'success' ? <div className="text-center py-4">
                  <p className="font-heading text-2xl font-bold text-plum-700 mb-2">
                    💖 You're on the list!
                  </p>
                  <p className="text-plum-500 font-medium">
                    Get ready to sweat, heal, and take up space. We'll email you
                    when the plans drop.
                  </p>
                </div> : <>
                  <h3 className="font-bold text-plum-700 mb-2 text-lg">
                    Be the first to know when we launch
                  </h3>
                  <p className="text-sm text-plum-500 mb-4 font-medium">
                    Drop your email below to get early access and an exclusive
                    discount.
                  </p>
                  <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
                  
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 px-4 py-3.5 rounded-xl border border-blush-200 focus:ring-2 focus:ring-cta-500 outline-none bg-white/80" />
                  
                    <button type="submit" disabled={status === 'loading'} className="inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-cta-500 text-white rounded-xl font-bold hover:bg-cta-600 transition-colors shadow-md disabled:opacity-60 whitespace-nowrap">
                    
                      <GlitterHeart size={16} variant="light" />
                      {status === 'loading' ? '...' : 'Notify Me'}
                    </button>
                  </form>
                  {status === 'error' && <p className="text-red-500 text-xs font-medium mt-2">
                      Something went wrong. Please try again.
                    </p>}
                </>}
            </div>
          </motion.div>

          {/* Visual Composition */}
          <motion.div initial={{
          opacity: 0,
          y: 50
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 1,
          delay: 0.2
        }} className="relative mx-auto w-full max-w-md lg:max-w-lg">
            
            {/* Decorative background blobs */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cta-500/20 to-blush-400/30 blur-3xl rounded-full" />

            <div className="relative grid grid-cols-2 gap-4">
              {/* Card 1 — Rebuild Foundation */}
              <motion.div animate={{
              y: [0, -8, 0]
            }} transition={{
              repeat: Infinity,
              duration: 5,
              ease: 'easeInOut'
            }} className="col-span-2 bg-white/40 backdrop-blur-sm p-6 rounded-[2rem] border border-blush-200/50 shadow-xl">
                
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blush-100 rounded-2xl flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6 text-plum-700" />
                  </div>
                  <span className="px-3 py-1 bg-cta-100 text-cta-600 text-xs font-bold rounded-full">
                    ✨ Healing
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-plum-700 mb-2">
                  Rebuild Foundation
                </h3>
                <p className="text-sm text-plum-500 font-medium">
                  Gentle stretching and yoga to reconnect with your body,
                  release tension, and feel safe again.
                </p>
              </motion.div>

              {/* Card 2 — Cardio Release */}
              <motion.div animate={{
              y: [0, 8, 0]
            }} transition={{
              repeat: Infinity,
              duration: 6,
              ease: 'easeInOut',
              delay: 1
            }} className="bg-white/40 backdrop-blur-sm p-6 rounded-[2rem] border border-blush-200/50 shadow-xl">
                
                <div className="w-10 h-10 bg-cta-100 rounded-xl flex items-center justify-center mb-4">
                  <HeartPulseIcon className="w-5 h-5 text-cta-500" />
                </div>
                <h3 className="font-heading text-lg font-bold text-plum-700 mb-1">
                  Cardio Release
                </h3>
                <p className="text-xs text-plum-500 font-medium">
                  Move your body, boost your mood, and release stress through
                  fun, beginner-friendly cardio. 💃
                </p>
              </motion.div>

              {/* Card 3 — Strength & Confidence */}
              <motion.div animate={{
              y: [0, -6, 0]
            }} transition={{
              repeat: Infinity,
              duration: 5.5,
              ease: 'easeInOut',
              delay: 0.5
            }} className="bg-white/40 backdrop-blur-sm p-6 rounded-[2rem] border border-lavender-200/50 shadow-xl">
                
                <div className="w-10 h-10 bg-lavender-100 rounded-xl flex items-center justify-center mb-4">
                  <DumbbellIcon className="w-5 h-5 text-plum-700" />
                </div>
                <h3 className="font-heading text-lg font-bold text-plum-700 mb-1">
                  Strength & Confidence
                </h3>
                <p className="text-xs text-plum-500 font-medium">
                  Build real strength, stability, and confidence. In
                  collaboration with my son, a dedicated strength athlete 💪
                </p>
              </motion.div>
            </div>

            {/* Floating Hearts */}
            <motion.div animate={{
            y: [-10, 10, -10],
            rotate: [-10, 10, -10]
          }} transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }} className="absolute -top-6 -right-6 z-20">
              
              <GlitterHeart size={48} />
            </motion.div>
            <motion.div animate={{
            y: [8, -8, 8],
            rotate: [5, -5, 5]
          }} transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }} className="absolute -bottom-4 -left-4 z-20">
              
              <GlitterHeart size={36} variant="light" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>;
}