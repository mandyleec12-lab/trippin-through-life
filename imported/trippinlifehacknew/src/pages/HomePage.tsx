import React, { useEffect, useState, useRef, Children, createElement, Component } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SparkleEffect } from '../components/SparkleEffect';
import { GlitterHeart } from '../components/GlitterHeart';
import { HeroGraphic } from '../components/HeroGraphic';
import { SplitFlapQuote } from '../components/SplitFlapQuote';
import { BookOpenIcon, PlaneIcon, ArrowRightIcon, FlameIcon, HeartIcon, SparklesIcon } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
const heroQuotes = [{
  text: "You didn't survive all that shit just to live small. It's time to",
  highlight: 'take up space, babe.'
}, {
  text: "You didn't come this far just to doubt yourself now. You've already survived the hardest parts — it's time to start",
  highlight: 'living like you believe that.'
}, {
  text: "Stop shrinking yourself to make other people comfortable. You weren't made to be easy to handle — you were made to be",
  highlight: 'unforgettable.'
}, {
  text: "You don't need permission to change your life. You just need one moment where you decide you deserve better —",
  highlight: "and don't look back."
}, {
  text: "You are not behind — you're building a vision no one else sees yet. Stay focused.",
  highlight: "They'll understand later."
}];
function RotatingQuoteSection() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % heroQuotes.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);
  const current = heroQuotes[quoteIndex];
  return <section className="py-16 bg-gradient-to-br from-plum-900 via-plum-800 to-plum-900 relative overflow-hidden">
      <SparkleEffect count={80} />
      <div className="absolute top-6 left-6 text-[10rem] font-heading text-white/5 leading-none select-none pointer-events-none">
        "
      </div>
      <div className="absolute bottom-0 right-6 text-[10rem] font-heading text-white/5 leading-none select-none pointer-events-none rotate-180">
        "
      </div>
      <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
        <div className="flex items-center justify-center gap-4 mb-6">
          <GlitterHeart size={28} variant="light" className="animate-pulse" />
          <GlitterHeart size={36} variant="light" />
          <GlitterHeart size={28} variant="light" className="animate-pulse" />
        </div>
        <div className="min-h-[8rem] md:min-h-[10rem] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.blockquote key={quoteIndex} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1]
          }} className="text-2xl md:text-3xl lg:text-4xl text-white leading-snug drop-shadow-xl" style={{
            fontFamily: '"Dancing Script", cursive'
          }}>
              
              "{current.text}{' '}
              <span className="text-cta-400">{current.highlight}</span>"
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-cta-400 to-transparent rounded-full mx-auto mt-6" />
      </div>
    </section>;
}
function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const formData = new FormData();
      formData.append('fields[email]', email);
      formData.append('fields[name]', name);
      formData.append('ml-submit', '1');
      formData.append('anticsrf', 'true');
      await fetch('https://assets.mailerlite.com/jsonp/2211088/forms/182578891602266068/subscribe', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });
      setStatus('success');
      setEmail('');
      setName('');
    } catch {
      setStatus('error');
    }
  };
  if (status === 'success') {
    return <div className="bg-white/60 rounded-2xl p-6 text-center border border-plum-200/30">
        <p className="font-heading text-xl font-bold text-plum-700 mb-1">
          💖 You're in!
        </p>
        <p className="text-plum-500 text-sm font-medium">
          Real talk, course drops, and travel deals coming your way.
        </p>
      </div>;
  }
  return <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="flex-1 px-5 py-3.5 rounded-full border border-plum-200/50 bg-white/80 text-plum-700 text-sm font-medium placeholder:text-plum-400 focus:outline-none focus:ring-2 focus:ring-cta-400 focus:border-transparent" />
        
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="flex-1 px-5 py-3.5 rounded-full border border-plum-200/50 bg-white/80 text-plum-700 text-sm font-medium placeholder:text-plum-400 focus:outline-none focus:ring-2 focus:ring-cta-400 focus:border-transparent" />
        
      </div>
      <button type="submit" disabled={status === 'loading'} className="w-full px-7 py-3.5 rounded-full bg-cta-500 text-white font-bold text-sm hover:bg-cta-600 transition-colors shadow-md shadow-cta-500/20 whitespace-nowrap disabled:opacity-60">
        
        {status === 'loading' ? '...' : '💖 Get Notified, Gorgeous'}
      </button>
      {status === 'error' && <p className="text-red-500 text-xs font-medium">
          Something went wrong. Please try again.
        </p>}
    </form>;
}
export function HomePage() {
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  const marqueePhrases = ['No toxic positivity', 'Real talk only', 'The Broken Beginning', 'Healing is messy', 'Take up space, babe'];
  return <div className="min-h-screen overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>

      {/* SPLIT-FLAP INSPIRATIONAL QUOTES — sits in the navbar gap */}
      <div className="pt-[68px] sm:pt-[76px]">
        <SplitFlapQuote />
      </div>

      {/* HERO SECTION - Split Layout */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-32 overflow-hidden">
        {/* Dramatic Background Blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-blush-50 via-white to-lavender-50 -z-20" />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blush-300/30 rounded-full blur-[120px] -z-10 -translate-x-1/2 -translate-y-1/4" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-lavender-300/30 rounded-full blur-[100px] -z-10 translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] bg-cta-300/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 -translate-y-1/2 rotate-45" />

        <SparkleEffect count={150} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative">
            {/* 100% Real Glassmorphism Card - Floating between text and heart */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.8,
            ease: 'easeOut',
            delay: 0.6
          }} className="hidden lg:block absolute left-[46%] top-8 z-30">
              
              <motion.div animate={{
              y: [8, -8, 8]
            }} transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }} className="bg-white/70 backdrop-blur-xl border border-white p-4 rounded-2xl shadow-xl transform rotate-3 inline-flex items-center gap-3">
                
                <div className="w-9 h-9 rounded-full bg-cta-100 flex items-center justify-center">
                  <FlameIcon className="w-4 h-4 text-[#2D1533]" />
                </div>
                <div>
                  <p className="font-heading text-lg font-bold text-plum-700 leading-tight">
                    100% Real
                  </p>
                  <p className="text-[10px] font-bold text-plum-500 uppercase tracking-wider">
                    No BS Allowed
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Left Content */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center lg:text-left pt-10">
              
              <motion.div variants={itemVariants} className="mb-8 inline-block">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-blush-300 text-sm font-bold text-plum-700 shadow-lg shadow-blush-200/50 uppercase tracking-wider transform -rotate-2">
                  <GlitterHeart size={18} />
                  Real talk. Real healing. Real results.
                </span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-bold mb-6 tracking-tight leading-[1.1]" style={{
              fontFamily: '"Dancing Script", cursive'
            }}>
                
                <span className="block pb-2 text-plum-700">Trippin'</span>
                <span className="block text-[#D63385] text-[56px]">
                  Through Life
                </span>
                <span className="md:text-6xl block mt-2 text-[#2D1533] text-[80px]">
                  with Mandy
                </span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-plum-500 max-w-xl mx-auto lg:mx-0 mb-10 font-medium leading-relaxed">
                
                I turned my mess into my message—and now I help you through The
                Broken Beginning.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                
                <Link to="/courses" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-cta-500 text-white font-bold text-lg hover:bg-cta-600 transition-all shadow-xl shadow-cta-500/30 hover:-translate-y-1">
                  
                  <GlitterHeart size={20} variant="light" />
                  My Programs
                </Link>
                <Link to="/free-resources#free-lists" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-cta-500 text-white font-bold text-lg hover:bg-cta-600 transition-all shadow-xl shadow-cta-500/30 hover:-translate-y-1">
                  
                  <GlitterHeart size={20} variant="light" />
                  Free Services
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Decorative Composition */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.85
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 1.2,
            ease: 'easeOut',
            delay: 0.2
          }} className="relative hidden lg:flex justify-center items-center h-[600px]">
              
              <HeroGraphic />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SASSY MARQUEE */}
      <div className="relative py-6 bg-plum-900 overflow-hidden transform -rotate-1 scale-105 shadow-2xl z-20">
        <div className="absolute inset-0 bg-gradient-to-r from-cta-500/20 to-plum-500/20 mix-blend-overlay" />
        <div className="flex whitespace-nowrap animate-marquee">
          {/* Double the array for seamless looping */}
          {[...marqueePhrases, ...marqueePhrases, ...marqueePhrases, ...marqueePhrases].map((phrase, i) => <div key={i} className="flex items-center gap-8 mx-8">
              <span className="text-2xl md:text-3xl font-bold text-white tracking-wide" style={{
            fontFamily: '"Dancing Script", cursive'
          }}>
              
                {phrase}
              </span>
              <GlitterHeart size={24} variant="light" />
            </div>)}
        </div>
      </div>

      {/* WHAT I OFFER - Bento Grid */}
      <section className="py-32 bg-blush-50 relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="inline-flex items-center justify-center gap-3 mb-6">
              
              <GlitterHeart size={24} />
              <h2 className="font-heading text-5xl md:text-6xl font-bold text-plum-700">
                How We're Doing This
              </h2>
              <GlitterHeart size={24} />
            </motion.div>
            <p className="text-plum-500 max-w-2xl mx-auto text-xl font-medium">
              No fluff. No toxic positivity. Just real tools to help you stop
              surviving and start thriving.
            </p>
          </div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
          once: true,
          margin: '-100px'
        }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
            
            {/* Coaching Card - FEATURED (Spans 2 cols on desktop) */}
            <motion.div variants={itemVariants} className="lg:col-span-2 lg:row-span-2 group relative bg-gradient-to-br from-plum-900 via-plum-800 to-plum-900 p-10 md:p-14 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col justify-between">
              
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-cta-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-lavender-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
              <SparkleEffect count={40} />

              <div className="absolute top-8 right-8 opacity-20 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-110 transform">
                <GlitterHeart size={120} variant="light" />
              </div>

              <div className="relative z-10 mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold mb-8 uppercase tracking-wider">
                  <FlameIcon className="w-4 h-4 text-cta-400" />
                  Signature Experience
                </div>
                <h3 className="font-heading text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  1:1 Coaching
                </h3>
                <p className="text-white/90 text-xl max-w-md leading-relaxed font-semibold">
                  Personalized, no-BS coaching to help you stop surviving and
                  start thriving. We dig deep and do the real work.
                </p>
              </div>

              <div className="relative z-10 mt-auto">
                <Link to="/coaching" className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-cta-500 text-white font-bold text-lg hover:bg-cta-400 transition-all shadow-lg hover:-translate-y-1 w-full sm:w-auto">
                  
                  <GlitterHeart size={20} variant="light" />
                  Work With Me
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </motion.div>

            {/* Courses Card */}
            <motion.div variants={itemVariants} className="group relative bg-gradient-to-br from-white to-blush-50 p-8 md:p-10 rounded-[3rem] shadow-xl border border-blush-200 overflow-hidden flex flex-col justify-between hover:-translate-y-2 transition-transform duration-500">
              
              <div className="absolute -right-6 -top-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <BookOpenIcon className="w-40 h-40 text-cta-500" />
              </div>

              <div className="relative z-10 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-blush-200 flex items-center justify-center mb-6 shadow-inner">
                  <BookOpenIcon className="w-8 h-8 text-plum-700" />
                </div>
                <h3 className="font-heading text-3xl font-bold text-plum-700 mb-4">
                  The Broken Beginning
                </h3>
                <p className="text-plum-600 font-medium leading-relaxed">
                  The Broken Beginning and beyond. Self-paced courses that don't
                  sugarcoat the journey.
                </p>
              </div>

              <Link to="/courses" className="relative z-10 inline-flex items-center font-bold text-cta-500 hover:text-cta-600 text-lg mt-auto">
                
                <GlitterHeart size={18} className="mr-2" />
                Get Started
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>

            {/* Travel Card */}
            <motion.div variants={itemVariants} className="group relative bg-gradient-to-br from-white to-sky-50 p-8 md:p-10 rounded-[3rem] shadow-xl border border-sky-200 overflow-hidden flex flex-col justify-between hover:-translate-y-2 transition-transform duration-500">
              
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <PlaneIcon className="w-40 h-40 text-sky-500" />
              </div>

              <div className="relative z-10 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-sky-200 flex items-center justify-center mb-6 shadow-inner">
                  <PlaneIcon className="w-8 h-8 text-plum-700" />
                </div>
                <h3 className="font-heading text-3xl font-bold text-plum-700 mb-4">
                  Travel
                </h3>
                <p className="text-plum-600 font-medium leading-relaxed">
                  Budget-friendly getaways because everyone deserves to escape,
                  reset, and explore.
                </p>
              </div>

              <Link to="/travel" className="relative z-10 inline-flex items-center font-bold text-cta-500 hover:text-cta-600 text-lg mt-auto">
                
                <GlitterHeart size={18} className="mr-2" />
                Plan a Trip
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* DRAMATIC QUOTE SECTION - rotating quotes */}
      <RotatingQuoteSection />

      {/* NEWSLETTER - MailerLite Embedded Form */}
      <section className="py-32 bg-gradient-to-b from-blush-50 to-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-cta-300/20 rounded-full blur-[120px] -z-10" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 40
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }} className="bg-[#f5d8d8]/80 backdrop-blur-md rounded-2xl p-8 md:p-12 text-center relative shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/40">
            
            {/* Floating decorative hearts */}
            <div className="absolute -top-6 -left-6 rotate-12">
              <GlitterHeart size={60} />
            </div>
            <div className="absolute -bottom-8 -right-8 -rotate-12">
              <GlitterHeart size={80} />
            </div>

            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-plum-800 mb-4">
                Stay Connected
              </h2>
              <p className="text-plum-700 text-lg mb-8 font-medium leading-relaxed">
                Get real talk, course drops, and travel deals straight to your
                inbox.
              </p>

              {/* MailerLite Newsletter Form */}
              <NewsletterForm />

              <div className="mt-8 pt-6 border-t border-plum-200/30">
                <a href="https://calendly.com/trippinwithmandy/free-consultation-call" target="_blank" rel="noopener noreferrer" className="inline-block text-plum-700 font-medium hover:text-plum-900 transition-colors relative group">
                  
                  Not ready yet? Book a free consultation with me 💖
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-plum-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>;
}