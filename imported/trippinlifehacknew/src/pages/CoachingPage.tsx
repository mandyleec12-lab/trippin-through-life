import React, { useState, cloneElement, Component } from 'react';
import { motion } from 'framer-motion';
import { SparkleEffect } from '../components/SparkleEffect';
import { GlitterHeart } from '../components/GlitterHeart';
import { CalendarIcon, MessageCircleIcon, SparklesIcon, FlameIcon } from 'lucide-react';
export function CoachingPage() {
  const handleRequestSession = (tier: string) => {
    const subject = encodeURIComponent(`Coaching Request - ${tier}`);
    const body = encodeURIComponent(`Hi Mandy!\n\nI'm interested in the ${tier} coaching option.\n\nPlease reach out so we can discuss details and get started!\n\nThank you!`);
    window.location.href = `mailto:trippinwithmandy@gmail.com?subject=${subject}&body=${body}`;
  };
  return <div className="min-h-screen pt-24 pb-24 relative">
      {/* Full background image */}
      <img src="/ChatGPT_Image_Mar_21,_2026,_09_50_42_PM.png" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-contain object-top pointer-events-none z-0" />
      
      {/* Soft overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/80 z-0" />

      {/* Hero */}
      <section className="relative py-20 text-center overflow-hidden bg-gradient-to-b from-blush-50/30 to-white/20 backdrop-blur-[1px]">
        <SparkleEffect count={80} />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="font-heading text-5xl md:text-6xl font-bold text-plum-800 mb-6 drop-shadow-sm">
            
            Trippin' Through <span className="text-cta-600">Healing</span>
          </motion.h1>
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="text-xl text-plum-700 font-semibold">
            
            Real-life guidance, mindset support, and confidence rebuilding—not
            therapy, but practical help navigating real-life challenges.
          </motion.p>
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="text-lg text-cta-600 font-bold mt-4">
            
            Book your free call today
          </motion.p>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{
          opacity: 0,
          x: -30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} className="relative">
            
            <div className="aspect-square rounded-[3rem] bg-lavender-100/80 backdrop-blur-sm p-8 flex items-center justify-center relative overflow-hidden border border-lavender-200/60">
              <SparkleEffect count={40} />
              <div className="text-center z-10">
                <FlameIcon className="w-16 h-16 text-cta-500 mx-auto mb-4" />
                <h3 className="font-heading text-3xl text-plum-800 font-bold">
                  Who It's For
                </h3>
                <ul className="mt-6 space-y-3 text-left">
                  <li className="flex items-center gap-2 text-plum-800 font-semibold">
                    <SparklesIcon className="w-4 h-4 text-cta-500 shrink-0" />{' '}
                    You're stuck and you know it.
                  </li>
                  <li className="flex items-center gap-2 text-plum-800 font-semibold">
                    <SparklesIcon className="w-4 h-4 text-cta-500 shrink-0" />{' '}
                    You're tired of just surviving.
                  </li>
                  <li className="flex items-center gap-2 text-plum-800 font-semibold">
                    <SparklesIcon className="w-4 h-4 text-cta-500 shrink-0" />{' '}
                    You need someone who won't judge your mess.
                  </li>
                  <li className="flex items-center gap-2 text-plum-800 font-semibold">
                    <SparklesIcon className="w-4 h-4 text-cta-500 shrink-0" />{' '}
                    You're ready to do the damn work.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          x: 30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} className="bg-white/85 backdrop-blur-sm rounded-3xl p-8 border border-blush-100 shadow-lg">
            
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-plum-800 mb-6">
              What to Expect
            </h2>
            <ul className="space-y-6">
              {[{
              title: 'Real talk, not textbook advice',
              desc: "I don't do fluff. We're going to look at your life honestly and figure out exactly what needs to change."
            }, {
              title: 'Someone who actually gives a damn',
              desc: 'When you work with me, I am fully invested in your healing and your success.'
            }, {
              title: 'Accountability with love (and tough love)',
              desc: 'I will hold your hand, but I will also call you out on your excuses. Because you deserve better.'
            }, {
              title: 'Mindset shifts that stick',
              desc: "We aren't just putting a band-aid on it. We are rewiring how you think and operate."
            }].map((item, i) => <li key={i} className="flex gap-4">
                  <div className="mt-1 w-2 h-2 rounded-full bg-cta-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-plum-800 text-lg">
                      {item.title}
                    </h4>
                    <p className="text-plum-600 font-semibold">{item.desc}</p>
                  </div>
                </li>)}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* What I Help With */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold text-plum-800 mb-4">
            What I Help With
          </h2>
          <p className="text-plum-700 font-semibold max-w-2xl mx-auto text-lg">
            Life coaching covers a lot of ground. Here are some of the areas I
            work with most — but honestly, if you are going through it, we can
            figure it out together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[{
          icon: '💼',
          title: 'Business & Side Hustles',
          items: ['Getting started', 'Organization and planning', 'Website building guidance', 'Turning ideas into action']
        }, {
          icon: '🏠',
          title: 'Jobs & Work From Home',
          items: ['Job search help', 'Resume guidance', 'Finding legitimate remote work', 'Tools and job platforms']
        }, {
          icon: '🧠',
          title: 'Life Organization & Mindset',
          items: ['Managing life chaos', 'Building simple routines', 'Stress management for busy lives', 'Consistency and motivation']
        }, {
          icon: '💪',
          title: 'Real-Life Support',
          items: ['Accountability', 'Breaking goals into steps', 'Overcoming overthinking', 'Practical guidance']
        }].map((category, i) => <motion.div key={i} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: i * 0.1
        }} className="bg-gradient-to-br from-blush-50/60 to-lavender-50/40 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-blush-100/50 shadow-sm hover:shadow-md transition-shadow">
            
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="font-heading text-2xl font-bold text-plum-800">
                  {category.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {category.items.map((item, j) => <li key={j} className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cta-400 shrink-0" />
                    <span className="text-plum-700 font-semibold text-sm md:text-base">
                      {item}
                    </span>
                  </li>)}
              </ul>
            </motion.div>)}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-blush-50/80 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl font-bold text-plum-800 mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-blush-200" />

            {[{
            icon: <CalendarIcon />,
            title: '1. Book a Free Consultation Call',
            desc: "Your first consultation call is completely free. This is where we talk about what you're going through, what kind of support you need, and whether we're a good fit to work together. If you decide to continue after that, paid coaching options are available at the rates listed above."
          }, {
            icon: <MessageCircleIcon />,
            title: '2. Get Real',
            desc: 'We map out exactly where you are and where you want to be.'
          }, {
            icon: <SparklesIcon />,
            title: '3. Transform',
            desc: 'We do the work. You stop surviving and start living like a badass.'
          }].map((step, i) => <motion.div key={i} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: i * 0.2
          }} className="relative z-10">
              
                <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-sm border border-blush-100 flex items-center justify-center text-cta-500 mb-6">
                  {cloneElement(step.icon as React.ReactElement, {
                className: 'w-10 h-10'
              })}
                </div>
                <h3 className="font-heading text-2xl font-bold text-plum-800 mb-3">
                  {step.title}
                </h3>
                <p className="text-plum-700 font-semibold">{step.desc}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 bg-white/80 relative overflow-hidden z-10">
        <SparkleEffect count={50} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-plum-800 mb-4">
              Accessible pricing because everyone deserves support.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Card 1 */}
            <div className="bg-white/90 backdrop-blur-sm border border-blush-100 rounded-[3rem] p-10 shadow-xl flex flex-col relative overflow-hidden">
              <h3 className="font-heading text-2xl font-bold text-plum-800 mb-2">
                1:1 Session
              </h3>
              <p className="text-plum-600 font-semibold mb-6">45–60 minutes</p>
              <div className="mb-8">
                <span className="font-heading text-4xl font-bold text-plum-800">
                  $25–$45
                </span>
              </div>
              <p className="text-plum-700 font-semibold mb-10 flex-grow">
                A single deep-dive session to tackle what's on your mind right
                now.
              </p>
              <a href="https://calendly.com/trippinwithmandy/free-consultation-call" target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-full bg-plum-700 text-white font-bold text-lg hover:bg-plum-800 transition-colors text-center block">
                
                Book Free Consultation
              </a>
            </div>

            {/* Card 2 (Most Popular) */}
            <div className="bg-gradient-to-br from-plum-900 to-plum-800 rounded-[3rem] p-10 shadow-2xl flex flex-col relative overflow-hidden transform md:-translate-y-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cta-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="inline-flex self-start px-4 py-1.5 rounded-full bg-cta-500 text-white text-xs font-bold uppercase tracking-wider mb-6">
                Most Popular
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-2">
                3 Session Package
              </h3>
              <div className="mb-8 mt-6">
                <span className="font-heading text-4xl font-bold text-white">
                  $60–$100
                </span>
              </div>
              <p className="text-white/90 font-semibold mb-10 flex-grow">
                Three sessions to build momentum and create real, lasting
                change.
              </p>
              <a href="https://calendly.com/trippinwithmandy/free-consultation-call" target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-full bg-cta-500 text-white font-bold text-lg hover:bg-cta-600 transition-colors shadow-lg shadow-cta-500/30 text-center block">
                
                Book Free Consultation
              </a>
            </div>

            {/* Card 3 */}
            <div className="bg-white/90 backdrop-blur-sm border border-blush-100 rounded-[3rem] p-10 shadow-xl flex flex-col relative overflow-hidden">
              <h3 className="font-heading text-2xl font-bold text-plum-800 mb-2">
                Monthly Support
              </h3>
              <div className="mb-8 mt-12">
                <span className="font-heading text-4xl font-bold text-plum-800">
                  $120–$180
                </span>
                <span className="text-plum-600 font-semibold">/month</span>
              </div>
              <p className="text-plum-700 font-semibold mb-10 flex-grow">
                Ongoing support with weekly check-ins to keep you on track and
                thriving.
              </p>
              <a href="https://calendly.com/trippinwithmandy/free-consultation-call" target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-full bg-plum-700 text-white font-bold text-lg hover:bg-plum-800 transition-colors text-center block">
                
                Book Free Consultation
              </a>
            </div>
          </div>

          <p className="text-center text-plum-700 font-semibold mt-10 max-w-2xl mx-auto">
            Your first consultation call is free. You'll receive a Google Meet
            link after booking.
            <br />
            <br />
            All sessions are personalized to your needs. Once you submit your
            request, I'll reach out to schedule and confirm details.
          </p>
          <p className="text-center text-plum-500 text-sm font-medium mt-4 max-w-xl mx-auto italic">
            * Prices may vary. These are base coaching prices. Any additional
            services (e.g. building websites, custom projects) are charged
            separately.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-4 relative z-10">
        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm p-12 rounded-[3rem] shadow-xl border border-blush-100 relative overflow-hidden">
          <SparkleEffect count={50} />
          <div className="relative z-10">
            <h2 className="font-heading text-3xl font-bold text-plum-800 mb-4">
              Ready to invest in yourself?
            </h2>
            <p className="text-plum-700 mb-8 font-semibold">
              Real-life guidance, mindset support, and confidence rebuilding.
              Let's figure out the right fit for you.
            </p>
            <a href="https://calendly.com/trippinwithmandy/free-consultation-call" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-cta-500 text-white font-bold text-lg hover:bg-cta-600 transition-all shadow-lg hover:-translate-y-1">
              
              <GlitterHeart size={20} variant="light" />
              Book Free Consultation
            </a>
          </div>
        </div>
      </section>
    </div>;
}