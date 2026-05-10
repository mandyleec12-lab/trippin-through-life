import React, { useState, Component } from 'react';
import { motion } from 'framer-motion';
import { SparkleEffect } from '../components/SparkleEffect';
import { ClockIcon, BrainIcon, TargetIcon, SparklesIcon } from 'lucide-react';
import { GlitterHeart } from '../components/GlitterHeart';
export function AppComingSoonPage() {
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
      await fetch('https://assets.mailerlite.com/jsonp/2211088/forms/182587044822779312/subscribe', {
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
  return <div className="min-h-screen bg-gradient-to-b from-sky-50 via-lavender-50 to-blush-50 pt-24 pb-24 overflow-hidden">
      <SparkleEffect count={120} />

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
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-sky-200 text-sm font-bold text-sky-700 mb-8 shadow-sm uppercase tracking-wider">
              <SparklesIcon className="w-4 h-4 animate-pulse" />
              Coming Soon
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-bold text-plum-700 mb-6 leading-tight">
              Trippin' Through <span className="shimmer-text">Life</span>
            </h1>

            <p className="text-xl text-plum-500 mb-8 leading-relaxed font-medium">
              Meet your new AI-powered life scheduler. It doesn't just manage
              your time—it designs your day down to the minute, seamlessly
              integrating your healing routines, goals, and the rest you
              actually need.
            </p>

            <ul className="space-y-4 mb-10">
              {[{
              icon: <ClockIcon className="w-5 h-5 text-cta-500" />,
              text: 'Minute-by-minute intelligent scheduling'
            }, {
              icon: <BrainIcon className="w-5 h-5 text-cta-500" />,
              text: 'AI that learns your energy patterns'
            }, {
              icon: <TargetIcon className="w-5 h-5 text-cta-500" />,
              text: 'Built-in habit and healing tracking'
            }].map((feature, i) => <li key={i} className="flex items-center gap-3 text-plum-700 font-bold">
                
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    {feature.icon}
                  </div>
                  {feature.text}
                </li>)}
            </ul>

            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-lg">
              {status === 'success' ? <div className="text-center py-2">
                  <p className="font-heading text-xl font-bold text-plum-700 mb-1">
                    💖 You're on the list!
                  </p>
                  <p className="text-plum-500 text-sm font-medium">
                    We'll let you know as soon as the app is ready.
                  </p>
                </div> : <>
                  <h3 className="font-bold text-plum-700 mb-2">
                    Get early access
                  </h3>
                  <form className="flex gap-2" onSubmit={handleSubmit}>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-xl border border-blush-200 focus:ring-2 focus:ring-cta-500 outline-none" />
                  
                    <button type="submit" disabled={status === 'loading'} className="inline-flex items-center gap-2 px-6 py-3 bg-plum-700 text-white rounded-xl font-bold hover:bg-plum-900 transition-colors disabled:opacity-60">
                    
                      <GlitterHeart size={16} variant="light" />
                      {status === 'loading' ? '...' : 'Join Waitlist'}
                    </button>
                  </form>
                  {status === 'error' && <p className="text-red-500 text-xs font-medium mt-2">
                      Something went wrong. Please try again.
                    </p>}
                </>}
            </div>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div initial={{
          opacity: 0,
          y: 50
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 1,
          delay: 0.2
        }} className="relative mx-auto w-full max-w-[320px]">
            
            {/* Decorative glow behind phone */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cta-500/20 to-sky-400/20 blur-3xl rounded-full" />

            <div className="relative h-[650px] bg-white rounded-[3rem] border-[12px] border-white shadow-2xl overflow-hidden flex flex-col">
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-7 bg-white rounded-b-2xl w-40 mx-auto z-20" />

              {/* Screen Content */}
              <div className="flex-1 bg-blush-50 p-6 pt-14 overflow-hidden relative">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-plum-700">
                      Good Morning
                    </h3>
                    <p className="text-sm text-plum-500 font-medium">
                      Your aligned day awaits.
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <SparklesIcon className="w-5 h-5 text-cta-500" />
                  </div>
                </div>

                {/* Fake Schedule Items */}
                <div className="space-y-4">
                  <div className="text-xs font-bold text-plum-400 uppercase tracking-wider mb-2">
                    Up Next
                  </div>

                  <motion.div animate={{
                  y: [0, -5, 0]
                }} transition={{
                  repeat: Infinity,
                  duration: 4
                }} className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-cta-500">
                    
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-plum-700">
                        Morning Meditation
                      </h4>
                      <span className="text-xs font-bold text-cta-500 bg-blush-100 px-2 py-1 rounded-md">
                        8:00 AM
                      </span>
                    </div>
                    <p className="text-xs text-plum-500 font-medium">
                      15 mins • Nervous system regulation
                    </p>
                  </motion.div>

                  <div className="bg-white/60 p-4 rounded-2xl border border-white">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-plum-700">
                        Deep Work Block
                      </h4>
                      <span className="text-xs font-bold text-plum-500">
                        8:30 AM
                      </span>
                    </div>
                    <p className="text-xs text-plum-500 font-medium">
                      90 mins • Project planning
                    </p>
                  </div>

                  <div className="bg-lavender-100/50 p-4 rounded-2xl border border-lavender-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-plum-700">
                        Somatic Check-in
                      </h4>
                      <span className="text-xs font-bold text-plum-500">
                        10:00 AM
                      </span>
                    </div>
                    <p className="text-xs text-plum-500 font-medium">
                      5 mins • Stretch & breathe
                    </p>
                  </div>
                </div>

                {/* Bottom Nav Mockup */}
                <div className="absolute bottom-0 inset-x-0 h-20 bg-white/80 backdrop-blur-md border-t border-white flex justify-around items-center px-6 pb-4">
                  <div className="w-6 h-6 rounded-full bg-plum-700" />
                  <div className="w-6 h-6 rounded-full bg-plum-200" />
                  <div className="w-12 h-12 rounded-full bg-cta-500 -mt-8 flex items-center justify-center shadow-lg text-white">
                    <SparklesIcon className="w-6 h-6" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-plum-200" />
                  <div className="w-6 h-6 rounded-full bg-plum-200" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>;
}