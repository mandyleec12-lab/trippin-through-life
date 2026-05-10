import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SparkleEffect } from '../components/SparkleEffect';
import { GlitterHeart } from '../components/GlitterHeart';
import { SplitFlapQuote } from '../components/SplitFlapQuote';
import { ArrowRightIcon, HeartIcon, MessageCircleIcon, PhoneIcon } from 'lucide-react';
export function FreeResourcesPage() {
  return <div className="min-h-screen bg-white pt-24 pb-24">
      {/* Hero */}
      <section className="relative py-20 text-center overflow-hidden bg-gradient-to-b from-blush-50 to-white">
        <SparkleEffect count={80} />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="font-heading text-5xl md:text-6xl font-bold text-plum-700 mb-6">
            
            Trippin' Through <span className="text-cta-500">Guidance</span>
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
            
            Tools, support, and a gentle reminder that you don't have to figure
            it all out alone.
          </motion.p>
        </div>
      </section>

      {/* SPARKLY QUOTE MARQUEE */}
      <SplitFlapQuote />

      {/* REDESIGNED CRISIS SECTION */}
      <section className="py-16 bg-gradient-to-br from-lavender-50 via-blush-50 to-pink-50 relative overflow-hidden">
        <SparkleEffect count={40} />

        {/* Decorative blurred circles for soft glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <GlitterHeart size={40} variant="light" className="mx-auto mb-4" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-plum-700 mb-3">
              If You're Not Okay Right Now
            </h2>
            <p className="text-plum-600 text-lg font-medium max-w-2xl mx-auto">
              You're not alone. You don't have to go through this by yourself.
            </p>
          </div>

          {/* IMMEDIATE CRISIS HELP */}
          <div className="mb-12">
            <h3 className="font-heading text-xl font-bold text-plum-700 mb-6 flex items-center gap-2">
              <span className="text-2xl">🚨</span> Immediate Crisis Help
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Lifeline */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-blush-100 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center shrink-0">
                    <PhoneIcon className="w-5 h-5 text-sky-500" />
                  </div>
                  <h4 className="font-bold text-plum-800 text-lg">
                    Suicide & Crisis Lifeline
                  </h4>
                </div>
                <div className="mb-4 flex-grow">
                  <p className="text-plum-600 font-medium mb-1">Call or text</p>
                  <p className="text-4xl font-black text-plum-800 mb-3 tracking-tight">
                    988
                  </p>
                  <p className="text-plum-500 text-sm font-medium flex items-center gap-1.5 mb-1">
                    <span className="text-cta-400">Chat:</span> 988lifeline.org
                  </p>
                  <p className="text-plum-500 text-sm font-medium flex items-center gap-1.5">
                    <span>🕒</span> Available 24/7, free & confidential
                  </p>
                </div>
                <a href="https://988lifeline.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 font-bold transition-colors mt-auto">
                  
                  Get Help Now <ArrowRightIcon className="w-4 h-4" />
                </a>
              </div>

              {/* Card 2: Text Line */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-blush-100 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-cta-50 flex items-center justify-center shrink-0">
                    <MessageCircleIcon className="w-5 h-5 text-cta-500" />
                  </div>
                  <h4 className="font-bold text-plum-800 text-lg">
                    Crisis Text Line
                  </h4>
                </div>
                <div className="mb-4 flex-grow">
                  <p className="text-plum-600 font-medium mb-1">
                    Text <strong className="text-plum-800">HOME</strong> to
                  </p>
                  <p className="text-4xl font-black text-plum-800 mb-3 tracking-tight">
                    741741
                  </p>
                  <p className="text-plum-500 text-sm font-medium mb-1">
                    Connects you with a trained crisis counselor
                  </p>
                  <p className="text-plum-500 text-sm font-medium flex items-center gap-1.5">
                    <span>🕒</span> Available 24/7
                  </p>
                </div>
                <a href="https://www.crisistextline.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-cta-50 text-cta-600 hover:bg-cta-100 font-bold transition-colors mt-auto">
                  
                  Talk to Someone <ArrowRightIcon className="w-4 h-4" />
                </a>
              </div>

              {/* Card 3: Emergency */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-blush-100 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <span className="text-xl">🚓</span>
                  </div>
                  <h4 className="font-bold text-plum-800 text-lg">Emergency</h4>
                </div>
                <div className="mb-4 flex-grow">
                  <p className="text-plum-600 font-medium mb-1">Call</p>
                  <p className="text-4xl font-black text-red-500 mb-3 tracking-tight">
                    911
                  </p>
                  <p className="text-plum-500 text-sm font-medium">
                    If someone is in immediate danger
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SPECIALIZED SUPPORT */}
          <div className="mb-8">
            <h3 className="font-heading text-xl font-bold text-plum-700 mb-6 flex items-center gap-2">
              <span className="text-2xl">💖</span> Specialized Support
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Trevor Project */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-blush-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🌈</span>
                  <h4 className="font-bold text-plum-800">LGBTQ+ Support</h4>
                </div>
                <p className="text-plum-500 text-xs font-bold uppercase tracking-wider mb-3">
                  The Trevor Project
                </p>
                <div className="space-y-2 mb-4">
                  <p className="text-plum-700 font-bold text-lg">
                    1-866-488-7386
                  </p>
                  <p className="text-plum-600 text-sm font-medium">
                    Text <strong className="text-plum-800">START</strong> to{' '}
                    <strong className="text-plum-800">678678</strong>
                  </p>
                  <p className="text-plum-500 text-sm font-medium flex items-center gap-1.5">
                    <span>🕒</span> 24/7 support for LGBTQ+ youth
                  </p>
                </div>
                <a href="https://www.thetrevorproject.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm gap-1 text-cta-500 hover:text-cta-600 font-bold transition-colors">
                  
                  Get Support <ArrowRightIcon className="w-3 h-3" />
                </a>
              </div>

              {/* SAMHSA */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-blush-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🧠</span>
                  <h4 className="font-bold text-plum-800">
                    Mental Health & Substance Use
                  </h4>
                </div>
                <p className="text-plum-500 text-xs font-bold uppercase tracking-wider mb-3">
                  SAMHSA National Helpline
                </p>
                <div className="space-y-2">
                  <p className="text-plum-700 font-bold text-lg">
                    1-800-662-4357
                  </p>
                  <p className="text-plum-500 text-sm font-medium flex items-center gap-1.5">
                    <span>🕒</span> 24/7, free, confidential
                  </p>
                </div>
              </div>

              {/* Postpartum */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-blush-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">👩‍👧</span>
                  <h4 className="font-bold text-plum-800">
                    Postpartum Support
                  </h4>
                </div>
                <p className="text-plum-500 text-xs font-bold uppercase tracking-wider mb-3">
                  For Moms (EN/ES)
                </p>
                <div className="space-y-2 mb-4">
                  <p className="text-plum-600 text-sm font-medium">
                    Call or text:
                  </p>
                  <p className="text-plum-700 font-bold text-lg">
                    1-800-944-4773
                  </p>
                  <p className="text-plum-500 text-sm font-medium flex items-center gap-1.5">
                    <span>🕒</span> Not 24/7, but very responsive
                  </p>
                </div>
                <a href="https://www.postpartum.net/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm gap-1 text-cta-500 hover:text-cta-600 font-bold transition-colors">
                  
                  Visit Website <ArrowRightIcon className="w-3 h-3" />
                </a>
              </div>

              {/* Domestic Violence */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-blush-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">💔</span>
                  <h4 className="font-bold text-plum-800">Domestic Violence</h4>
                </div>
                <p className="text-plum-500 text-xs font-bold uppercase tracking-wider mb-3">
                  National Hotline
                </p>
                <div className="space-y-2 mb-4">
                  <p className="text-plum-700 font-bold text-lg">
                    1-800-799-7233
                  </p>
                  <p className="text-plum-600 text-sm font-medium">
                    Text <strong className="text-plum-800">START</strong> to{' '}
                    <strong className="text-plum-800">88788</strong>
                  </p>
                  <p className="text-plum-500 text-sm font-medium flex items-center gap-1.5">
                    <span>🕒</span> 24/7
                  </p>
                </div>
                <a href="https://www.thehotline.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm gap-1 text-cta-500 hover:text-cta-600 font-bold transition-colors">
                  
                  Get Support <ArrowRightIcon className="w-3 h-3" />
                </a>
              </div>

              {/* Child Abuse */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-blush-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">👶</span>
                  <h4 className="font-bold text-plum-800">
                    Child Abuse Hotline
                  </h4>
                </div>
                <p className="text-plum-500 text-xs font-bold uppercase tracking-wider mb-3">
                  Childhelp
                </p>
                <div className="space-y-2">
                  <p className="text-plum-600 text-sm font-medium">
                    Call or text:
                  </p>
                  <p className="text-plum-700 font-bold text-lg">
                    1-800-422-4453
                  </p>
                  <p className="text-plum-500 text-sm font-medium flex items-center gap-1.5">
                    <span>🕒</span> 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-plum-500 font-medium italic mt-12">
            Take a breath. You're going to be okay. 💗
          </p>
        </div>
      </section>

      {/* SECOND MARQUEE - extra positivity */}
      <SplitFlapQuote />

      {/* FREE RESOURCES SECTION */}
      <section className="py-16 bg-white relative overflow-hidden">
        <SparkleEffect count={60} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-plum-700 mb-6">
              Free Resources & Reset
            </h2>
            <p className="text-lg text-plum-600 font-medium leading-relaxed">
              I've been through some really hard things in life—and I know what
              it feels like to feel stuck, overwhelmed, or alone. If that's
              where you are right now, please know this:{' '}
              <strong className="text-plum-800">
                you matter, and you don't have to figure it all out by yourself.
              </strong>
            </p>
          </div>

          {/* Free Coaching Call - thin wide card above the grid */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="mb-10">
            
            <a href="https://calendly.com/trippinwithmandy/crisis-call" target="_blank" rel="noopener noreferrer" className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-cta-50 to-pink-50 rounded-2xl px-8 py-5 border-2 border-cta-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
              
              <div className="flex items-center gap-4">
                <span className="text-3xl">💗</span>
                <div>
                  <h3 className="font-heading text-lg font-bold text-plum-800">
                    Need Someone to Talk To?
                  </h3>
                  <p className="text-plum-500 font-medium text-sm">
                    Book a free coaching call — no strings, no judgment, just
                    support.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cta-500 text-white font-bold text-sm hover:bg-cta-600 transition-colors shadow-lg shadow-cta-500/20 shrink-0">
                Book a Free Call
                <ArrowRightIcon className="w-4 h-4" />
              </span>
            </a>
          </motion.div>

          {/* GRID ROW 1 */}
          <div id="free-lists" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 scroll-mt-32">
            
            {/* Interactive Cleaning Schedule Card */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="bg-gradient-to-br from-cta-50 to-white rounded-3xl p-8 border-2 border-cta-200 shadow-md flex flex-col relative overflow-hidden">
              
              <div className="absolute top-4 right-4 bg-cta-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform rotate-12">
                NEW ✨
              </div>
              <div className="text-3xl mb-4">✨</div>
              <h3 className="font-heading text-2xl font-bold text-plum-800 mb-4">
                Free Interactive Cleaning Schedule
              </h3>
              <p className="text-plum-600 font-medium mb-8 flex-grow">
                The Ultimate Cleaning Schedule — what to clean & when. Check
                things off, track your progress, use it every week for free!
              </p>
              <Link to="/free-resources/cleaning-schedule" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-cta-500 text-white font-bold text-sm hover:bg-cta-600 transition-colors shadow-lg shadow-cta-500/20 w-full">
                
                Try It Now
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Interactive Self-Care Schedule Card */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.1
          }} className="bg-gradient-to-br from-pink-50 to-white rounded-3xl p-8 border-2 border-pink-200 shadow-md flex flex-col relative overflow-hidden">
              
              <div className="absolute top-4 right-4 bg-pink-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform rotate-12">
                NEW 🧖‍♀️
              </div>
              <div className="text-3xl mb-4">🧖‍♀️</div>
              <h3 className="font-heading text-2xl font-bold text-pink-800 mb-4">
                Free Interactive Self-Care Checklist
              </h3>
              <p className="text-pink-600 font-medium mb-8 flex-grow">
                Daily hygiene and wellness ritual. Take care of your body and
                mind with this simple, trackable daily routine!
              </p>
              <Link to="/free-resources/self-care/daily" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-pink-500 text-white font-bold text-sm hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/20 w-full">
                
                Try It Now
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Free Pre-Trip Home Prep Card */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.15
          }} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-200 shadow-md flex flex-col relative overflow-hidden">
              
              <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform rotate-12">
                NEW 🏡
              </div>
              <div className="text-3xl mb-4">🏡</div>
              <h3 className="font-heading text-2xl font-bold text-emerald-800 mb-4">
                Free Pre-Trip Home Prep Checklist
              </h3>
              <p className="text-emerald-600 font-medium mb-8 flex-grow">
                What to do before you leave so you come back to a peaceful,
                clean home. 10 sections covering everything from kitchen prep to
                security!
              </p>
              <Link to="/free-resources/travel/home-prep" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 w-full">
                
                Try It Now
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* FREE WORKOUT CONSULTATION Card */}
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
          }} className="bg-gradient-to-br from-sky-50 to-lavender-50 rounded-3xl p-8 border-2 border-sky-200 shadow-md flex flex-col relative overflow-hidden">
              
              <div className="absolute top-4 right-4 bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform rotate-12">
                FREE 💪
              </div>
              <div className="text-3xl mb-4">💪</div>
              <h3 className="font-heading text-2xl font-bold text-plum-800 mb-4">
                Free Workout Consultation
              </h3>
              <p className="text-plum-600 font-medium mb-3 flex-grow">
                Meet Jake — once the smallest in the room, now lifting over 500
                lbs and training for championship-level competition. His journey
                is proof of what consistency and discipline can do.
              </p>
              <p className="text-plum-500 text-sm font-medium mb-6">
                Free consultations, zero pressure — just real advice from
                someone who's been exactly where you are.
              </p>
              <a href="https://calendly.com/trippinwithmandy/jakes-free-workout-consultation" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-sky-500 text-white font-bold text-sm hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20 w-full">
                
                Book Free Consultation
                <ArrowRightIcon className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          {/* PANIC ATTACK GROUNDING - Full width between rows */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="bg-gradient-to-br from-blush-50 to-lavender-50 rounded-3xl p-8 md:p-10 shadow-lg border border-blush-100 my-12">
            
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🫧</div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-plum-700 mb-2">
                Struggling with a Panic Attack?
              </h2>
              <p className="text-plum-500 font-semibold">
                If you're having anxiety or a panic attack, try this grounding
                technique:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/80 rounded-2xl p-6 text-center border border-blush-100 shadow-sm">
                <span className="text-3xl block mb-3">👀</span>
                <h3 className="font-bold text-plum-800 text-lg mb-1">
                  See 5 things
                </h3>
                <p className="text-plum-500 font-medium text-sm">
                  Look around and name 5 things you can see right now.
                </p>
              </div>
              <div className="bg-white/80 rounded-2xl p-6 text-center border border-blush-100 shadow-sm">
                <span className="text-3xl block mb-3">✋</span>
                <h3 className="font-bold text-plum-800 text-lg mb-1">
                  Feel 5 things
                </h3>
                <p className="text-plum-500 font-medium text-sm">
                  Touch 5 different textures — your shirt, the table, your hair.
                </p>
              </div>
              <div className="bg-white/80 rounded-2xl p-6 text-center border border-blush-100 shadow-sm">
                <span className="text-3xl block mb-3">👂</span>
                <h3 className="font-bold text-plum-800 text-lg mb-1">
                  Hear 5 things
                </h3>
                <p className="text-plum-500 font-medium text-sm">
                  Close your eyes and listen for 5 sounds around you.
                </p>
              </div>
            </div>
            <p className="text-cta-500 font-bold text-center mt-6 text-sm italic">
              This helps bring your mind back to the present moment. You're
              going to be okay. 💗
            </p>
          </motion.div>

          {/* GRID ROW 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Card 1 */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.1
          }} className="bg-blush-50 rounded-3xl p-8 border border-blush-100 shadow-sm">
              
              <div className="text-3xl mb-4">🧘‍♀️</div>
              <h3 className="font-heading text-2xl font-bold text-plum-700 mb-4">
                Things You Can Do Right Now
              </h3>
              <ul className="space-y-3 text-plum-600 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-cta-500 mt-1">•</span> Take a deep
                  breath (seriously—slow it down)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cta-500 mt-1">•</span> Drink some water
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cta-500 mt-1">•</span> Step outside for
                  a few minutes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cta-500 mt-1">•</span> Text someone you
                  trust
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cta-500 mt-1">•</span> Put on music that
                  grounds you
                </li>
              </ul>
            </motion.div>

            {/* Card 2 */}
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
          }} className="bg-lavender-50 rounded-3xl p-8 border border-lavender-100 shadow-sm">
              
              <div className="text-3xl mb-4">📓</div>
              <h3 className="font-heading text-2xl font-bold text-plum-700 mb-4">
                Quick Reset Questions
              </h3>
              <ul className="space-y-3 text-plum-600 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-cta-500 mt-1">•</span> What am I feeling
                  right now?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cta-500 mt-1">•</span> What do I
                  actually need today?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cta-500 mt-1">•</span> What's one small
                  thing I can do?
                </li>
              </ul>
            </motion.div>

            {/* Card 3 */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.3
          }} className="bg-sky-50 rounded-3xl p-8 border border-sky-100 shadow-sm">
              
              <div className="text-3xl mb-4">🎧</div>
              <h3 className="font-heading text-2xl font-bold text-plum-700 mb-4">
                My Go-To Distractions
              </h3>
              <ul className="space-y-3 text-plum-600 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-cta-500 mt-1">•</span> A comfort show
                  (Gilmore Girls, anyone?)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cta-500 mt-1">•</span> A podcast that
                  feels like talking to a friend
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cta-500 mt-1">•</span> Scrolling through
                  travel TikToks
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>;
}