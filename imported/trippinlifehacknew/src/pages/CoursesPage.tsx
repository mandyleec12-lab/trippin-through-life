import React, { useEffect, useState, useRef, createElement, Component } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SparkleEffect } from '../components/SparkleEffect';
import { CheckIcon, SparklesIcon, LockIcon, ClipboardListIcon, ArrowRightIcon } from 'lucide-react';
import { GlitterHeart } from '../components/GlitterHeart';
function CourseSignupForm({
  formId,
  buttonText = '💖 Notify Me'



}: {formId: string;buttonText?: string;}) {
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
      await fetch(`https://assets.mailerlite.com/jsonp/2211088/forms/${formId}/subscribe`, {
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
  if (status === 'success') {
    return <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 text-center border border-lavender-200/50">
        <p className="font-heading text-xl font-bold text-plum-700 mb-1">
          💖 Thank you!
        </p>
        <p className="text-plum-500 text-sm font-medium">
          You'll be the first to know when it drops.
        </p>
      </div>;
  }
  return <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-sm font-bold text-plum-600 mb-1">
        Get notified when it's available
      </label>
      <div className="flex gap-2">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-full border border-plum-200/50 bg-white/40 text-plum-700 text-sm font-medium placeholder:text-plum-300 focus:outline-none focus:ring-2 focus:ring-cta-400 focus:border-transparent" />
        
        <button type="submit" disabled={status === 'loading'} className="px-6 py-3 rounded-full bg-cta-500 text-white font-bold text-sm hover:bg-cta-600 transition-colors shadow-md shadow-cta-500/20 whitespace-nowrap disabled:opacity-60">
          
          {status === 'loading' ? '...' : buttonText}
        </button>
      </div>
      {status === 'error' && <p className="text-red-500 text-xs font-medium">
          Something went wrong. Please try again.
        </p>}
    </form>;
}
export function CoursesPage() {
  return <div className="min-h-screen pt-24 pb-24 relative">
      {/* Full background image */}
      <img src="/ChatGPT_Image_Mar_21,_2026,_09_37_08_PM.png" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-contain object-top pointer-events-none z-0" />
      
      {/* Soft overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/70 z-0" />

      {/* Hero */}
      <section className="relative py-20 text-center overflow-hidden">
        <SparkleEffect count={90} />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="font-heading text-5xl md:text-6xl font-bold text-plum-700 mb-6">
            
            Trippin' Through{' '}
            <span className="text-cta-500">Transformation</span>
          </motion.h1>
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="text-xl text-plum-500 font-medium">
            
            Real tools for real transformation. No fluff, no gatekeeping.
          </motion.p>
        </div>
      </section>

      {/* Featured Course */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="relative bg-gradient-to-br from-blush-100/40 to-white/40 backdrop-blur-[2px] border border-blush-200/50 rounded-[3rem] p-8 md:p-12 shadow-xl overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cta-500 text-white text-sm font-bold mb-8 shadow-md uppercase tracking-wider">
            <GlitterHeart size={16} variant="light" />
            Flagship Course
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-plum-700 mb-4">
                The Broken Beginning
              </h2>
              <p className="text-xl text-cta-500 font-bold mb-6">
                Your first step from surviving to thriving.
              </p>
              <p className="text-plum-700 leading-relaxed mb-8 font-medium">
                A course for anyone who's been knocked down by life and is ready
                to get back up — stronger, sassier, and unapologetically
                themselves. This isn't about toxic positivity. It's about doing
                the real work to rebuild your confidence, rewrite your story,
                and step into the badass you were always meant to be.
              </p>

              <a href="https://trippinwithmandy.gumroad.com/l/bgkefq" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 rounded-full bg-plum-700 text-white font-bold text-lg hover:bg-plum-900 transition-all shadow-lg hover:-translate-y-1">
                
                <GlitterHeart size={20} variant="light" />
                Enroll on Gumroad
              </a>
            </div>

            <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 border border-white/50">
              <h3 className="font-bold text-plum-700 text-xl mb-6">
                What you'll learn:
              </h3>
              <ul className="space-y-4">
                {['How to stop letting your past define your future', 'Building unshakeable confidence from the inside out', 'Setting boundaries without guilt', 'Turning your pain into your superpower', 'Daily mindset practices that actually stick'].map((feature, i) => <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 bg-blush-200 rounded-full p-1 shrink-0">
                      <CheckIcon className="w-4 h-4 text-plum-700" />
                    </div>
                    <span className="text-plum-700 font-medium">{feature}</span>
                  </li>)}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Checklists CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div initial={{
        opacity: 0,
        y: 15
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="relative bg-gradient-to-br from-white/50 to-lavender-50/50 backdrop-blur-sm border border-lavender-200/50 rounded-2xl p-6 md:p-8 shadow-sm overflow-hidden">
          
          <div className="absolute top-4 right-4 px-3 py-1 bg-cta-500/90 text-white text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
            <SparklesIcon className="w-3 h-3" /> More Added Daily
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <ClipboardListIcon className="w-6 h-6 text-cta-500" />
            </div>

            <div className="flex-grow text-center sm:text-left">
              <h3 className="font-heading text-xl font-bold text-plum-700 mb-1">
                Individual Checklists
              </h3>
              <p className="text-plum-500 font-medium text-sm">
                Grab exactly what you need — interactive checklists & printable
                PDFs starting at $1.99.
              </p>
            </div>

            <Link to="/checklists" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-cta-500 text-white font-bold text-sm hover:bg-cta-600 transition-all shadow-md hover:-translate-y-0.5 whitespace-nowrap shrink-0">
              
              Browse
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Coming Soon Courses */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-plum-700">
            More Courses Dropping Soon
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* The Ultimate Checklist Guide — with embedded MailerLite form */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="relative bg-gradient-to-br from-lavender-50/40 to-white/40 backdrop-blur-sm border border-lavender-200/50 rounded-[2rem] p-8 shadow-sm">
            
            <div className="absolute top-6 right-6 px-3 py-1 bg-white/80 text-plum-500 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1 border border-plum-100">
              <LockIcon className="w-3 h-3" /> Coming Soon
            </div>

            <h3 className="font-heading text-2xl font-bold text-plum-700 mb-3 mt-4">
              The Ultimate Checklist Guide
            </h3>
            <p className="text-plum-500 mb-8 font-medium">
              Every checklist you could ever need—all in one place. From daily
              routines to life organization, this guide is designed to help you
              stay on track, reduce overwhelm, and get your life back in order
              one step at a time.
            </p>

            {/* MailerLite Signup Form — Ultimate Checklist Guide */}
            <CourseSignupForm formId="182583406836582077" />
          </motion.div>

          {/* Trippin & Fixin — Coming Soon */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.2
        }} className="relative bg-gradient-to-br from-sky-50/40 to-white/40 backdrop-blur-sm border border-sky-200/50 rounded-[2rem] p-8 shadow-sm">
            
            <div className="absolute top-6 right-6 px-3 py-1 bg-white/80 text-plum-500 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1 border border-plum-100">
              <LockIcon className="w-3 h-3" /> Coming Soon
            </div>

            <h3 className="font-heading text-2xl font-bold text-plum-700 mb-3 mt-4">
              Trippin & Fixin – From Chaos to Coordination
            </h3>
            <p className="text-plum-500 mb-8 font-medium">
              In this next phase, we take everything you started in The Broken
              Beginning and bring it into real life. This is where we tackle the
              day-to-day chaos—getting organized physically, emotionally, and
              mentally. You'll learn how to rebuild structure, create routines
              that actually work, and start feeling in control of your life
              again. This isn't about perfection—it's about progress,
              consistency, and finally getting your life back together in a way
              that feels good.
            </p>

            {/* MailerLite Signup Form — Trippin & Fixin */}
            <CourseSignupForm formId="182586322711479418" />
          </motion.div>
        </div>
      </section>
    </div>;
}