import React, { Children } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SparkleEffect } from '../components/SparkleEffect';
import { GlitterHeart } from '../components/GlitterHeart';
import { FlameIcon, HeartIcon, SparklesIcon, ArrowRightIcon } from 'lucide-react';
export function AboutPage() {
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  return <div className="min-h-screen overflow-hidden">
      {/* STORY SECTION */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden" style={{
      background: 'linear-gradient(135deg, #FBE4EE 0%, #F8D4E4 20%, #F0C0D6 45%, #F4D0E0 70%, #FDE8F0 100%)'
    }}>
        
        {/* Layered glow overlays for depth and dimension */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/40 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-100/30 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-white/30 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] bg-pink-50/30 rounded-full blur-[60px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-white/20 rounded-full blur-[100px] rotate-12" />
        <div className="absolute top-20 right-10 w-[200px] h-[200px] bg-lavender-200/20 rounded-full blur-[60px]" />

        {/* Floating decorative hearts */}
        <motion.div animate={{
        y: [-10, 10, -10],
        rotate: [-8, 8, -8]
      }} transition={{
        duration: 7,
        repeat: Infinity,
        ease: 'easeInOut'
      }} className="absolute top-20 left-[15%] z-[5] opacity-20">
          
          <GlitterHeart size={40} variant="light" />
        </motion.div>
        <motion.div animate={{
        y: [8, -12, 8]
      }} transition={{
        duration: 9,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 1
      }} className="absolute top-[40%] left-[8%] z-[5] opacity-15">
          
          <GlitterHeart size={28} variant="light" />
        </motion.div>
        <motion.div animate={{
        y: [-6, 14, -6],
        rotate: [5, -5, 5]
      }} transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 3
      }} className="absolute bottom-[20%] right-[12%] z-[5] opacity-20">
          
          <GlitterHeart size={36} variant="light" />
        </motion.div>
        <motion.div animate={{
        y: [5, -8, 5]
      }} transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 2
      }} className="absolute bottom-[35%] left-[5%] z-[5] opacity-10">
          
          <GlitterHeart size={50} variant="light" />
        </motion.div>

        {/* Additional floating hearts for richer background */}
        <motion.div animate={{
        y: [-8, 12, -8],
        rotate: [3, -6, 3]
      }} transition={{
        duration: 10,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 0.5
      }} className="absolute top-[15%] right-[8%] z-[5] opacity-15">
          
          <GlitterHeart size={32} variant="light" />
        </motion.div>
        <motion.div animate={{
        y: [6, -10, 6]
      }} transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 4
      }} className="absolute top-[60%] left-[20%] z-[5] opacity-12">
          
          <GlitterHeart size={24} variant="light" />
        </motion.div>
        <motion.div animate={{
        y: [-5, 9, -5],
        rotate: [-4, 4, -4]
      }} transition={{
        duration: 11,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 1.5
      }} className="absolute top-[10%] left-[45%] z-[5] opacity-18">
          
          <GlitterHeart size={20} variant="light" />
        </motion.div>
        <motion.div animate={{
        y: [7, -7, 7]
      }} transition={{
        duration: 7,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 3.5
      }} className="absolute bottom-[10%] left-[35%] z-[5] opacity-15">
          
          <GlitterHeart size={44} variant="light" />
        </motion.div>
        <motion.div animate={{
        y: [-9, 6, -9],
        rotate: [6, -3, 6]
      }} transition={{
        duration: 9,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 5
      }} className="absolute top-[75%] right-[25%] z-[5] opacity-10">
          
          <GlitterHeart size={30} variant="light" />
        </motion.div>
        <motion.div animate={{
        y: [4, -11, 4]
      }} transition={{
        duration: 12,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 2.5
      }} className="absolute top-[5%] right-[35%] z-[5] opacity-20">
          
          <GlitterHeart size={18} variant="light" />
        </motion.div>

        {/* Extra floating hearts for even richer feel */}
        <motion.div animate={{
        y: [-6, 10, -6],
        rotate: [2, -4, 2]
      }} transition={{
        duration: 7,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 6
      }} className="absolute top-[25%] right-[40%] z-[5] opacity-18">
          
          <GlitterHeart size={22} variant="light" />
        </motion.div>
        <motion.div animate={{
        y: [5, -9, 5]
      }} transition={{
        duration: 10,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 7
      }} className="absolute top-[50%] right-[5%] z-[5] opacity-15">
          
          <GlitterHeart size={38} variant="light" />
        </motion.div>
        <motion.div animate={{
        y: [-4, 8, -4],
        rotate: [-3, 5, -3]
      }} transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 1.8
      }} className="absolute bottom-[5%] right-[45%] z-[5] opacity-20">
          
          <GlitterHeart size={26} variant="light" />
        </motion.div>
        <motion.div animate={{
        y: [7, -5, 7]
      }} transition={{
        duration: 9,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 4.5
      }} className="absolute top-[85%] left-[10%] z-[5] opacity-12">
          
          <GlitterHeart size={34} variant="light" />
        </motion.div>
        <motion.div animate={{
        y: [-8, 6, -8],
        rotate: [4, -2, 4]
      }} transition={{
        duration: 11,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 8
      }} className="absolute top-[35%] left-[42%] z-[5] opacity-16">
          
          <GlitterHeart size={16} variant="light" />
        </motion.div>

        {/* Even MORE floating hearts — go big */}
        {[{
        top: '3%',
        left: '25%',
        size: 42,
        delay: 0.3,
        dur: 8,
        rotate: true,
        variant: 'default' as const,
        opacity: 'opacity-25'
      }, {
        top: '8%',
        right: '18%',
        size: 30,
        delay: 1.2,
        dur: 9,
        rotate: false,
        variant: 'light' as const,
        opacity: 'opacity-20'
      }, {
        top: '12%',
        left: '60%',
        size: 18,
        delay: 2.5,
        dur: 7,
        rotate: true,
        variant: 'default' as const,
        opacity: 'opacity-30'
      }, {
        top: '18%',
        left: '3%',
        size: 36,
        delay: 0.8,
        dur: 10,
        rotate: false,
        variant: 'light' as const,
        opacity: 'opacity-18'
      }, {
        top: '22%',
        right: '55%',
        size: 24,
        delay: 3.2,
        dur: 8,
        rotate: true,
        variant: 'default' as const,
        opacity: 'opacity-22'
      }, {
        top: '28%',
        left: '75%',
        size: 20,
        delay: 4.0,
        dur: 11,
        rotate: false,
        variant: 'light' as const,
        opacity: 'opacity-25'
      }, {
        top: '32%',
        right: '3%',
        size: 46,
        delay: 1.5,
        dur: 9,
        rotate: true,
        variant: 'default' as const,
        opacity: 'opacity-15'
      }, {
        top: '38%',
        left: '55%',
        size: 14,
        delay: 5.5,
        dur: 7,
        rotate: false,
        variant: 'light' as const,
        opacity: 'opacity-30'
      }, {
        top: '42%',
        left: '30%',
        size: 28,
        delay: 2.0,
        dur: 12,
        rotate: true,
        variant: 'default' as const,
        opacity: 'opacity-20'
      }, {
        top: '48%',
        right: '15%',
        size: 40,
        delay: 6.0,
        dur: 8,
        rotate: false,
        variant: 'light' as const,
        opacity: 'opacity-18'
      }, {
        top: '52%',
        left: '12%',
        size: 22,
        delay: 3.8,
        dur: 10,
        rotate: true,
        variant: 'default' as const,
        opacity: 'opacity-25'
      }, {
        top: '55%',
        right: '35%',
        size: 32,
        delay: 0.5,
        dur: 9,
        rotate: false,
        variant: 'light' as const,
        opacity: 'opacity-22'
      }, {
        top: '60%',
        left: '48%',
        size: 16,
        delay: 7.0,
        dur: 7,
        rotate: true,
        variant: 'default' as const,
        opacity: 'opacity-30'
      }, {
        top: '65%',
        right: '8%',
        size: 38,
        delay: 2.8,
        dur: 11,
        rotate: false,
        variant: 'light' as const,
        opacity: 'opacity-15'
      }, {
        top: '70%',
        left: '22%',
        size: 26,
        delay: 4.5,
        dur: 8,
        rotate: true,
        variant: 'default' as const,
        opacity: 'opacity-25'
      }, {
        top: '75%',
        right: '50%',
        size: 20,
        delay: 1.0,
        dur: 10,
        rotate: false,
        variant: 'default' as const,
        opacity: 'opacity-20'
      }, {
        top: '78%',
        left: '65%',
        size: 44,
        delay: 5.0,
        dur: 9,
        rotate: true,
        variant: 'light' as const,
        opacity: 'opacity-18'
      }, {
        top: '82%',
        left: '8%',
        size: 30,
        delay: 3.5,
        dur: 12,
        rotate: false,
        variant: 'default' as const,
        opacity: 'opacity-22'
      }, {
        top: '88%',
        right: '22%',
        size: 18,
        delay: 6.5,
        dur: 7,
        rotate: true,
        variant: 'light' as const,
        opacity: 'opacity-30'
      }, {
        top: '92%',
        left: '40%',
        size: 34,
        delay: 0.2,
        dur: 8,
        rotate: false,
        variant: 'default' as const,
        opacity: 'opacity-20'
      }].map((h, i) => <motion.div key={`extra-heart-${i}`} animate={{
        y: [-8, 10, -8],
        ...(h.rotate ? {
          rotate: [-5, 5, -5]
        } : {})
      }} transition={{
        duration: h.dur,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: h.delay
      }} className={`absolute z-[5] ${h.opacity}`} style={{
        top: h.top,
        left: h.left,
        right: h.right
      }}>
          
            <GlitterHeart size={h.size} variant={h.variant} />
          </motion.div>)}

        {/* TONS of sparkles */}
        <SparkleEffect count={400} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: Text Content */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5 pt-4">
              
              <motion.div variants={itemVariants} className="flex items-center gap-3 flex-wrap mb-2">
                
                <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-plum-900 italic leading-tight">
                  This is where my story changed...
                </h1>
                <GlitterHeart size={28} />
              </motion.div>

              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 text-[15px] md:text-[17px] text-plum-900 font-medium leading-relaxed">
                
                <motion.p variants={itemVariants}>
                  <strong>
                    I've been around death since I was five years old.
                  </strong>
                </motion.p>
                <motion.p variants={itemVariants}>
                  I'm a widow who lost her husband to cancer. I'm raising three
                  incredible kids—one of them with autism. And if that wasn't
                  enough, I've lived with ADHD and depression my entire life.
                </motion.p>
                <motion.p variants={itemVariants}>
                  <strong>Recently, I got laid off from my job.</strong>
                </motion.p>
                <motion.p variants={itemVariants}>
                  And instead of letting it break me, I said—
                </motion.p>
                <motion.p variants={itemVariants} className="text-2xl md:text-3xl font-heading italic text-plum-900 my-3 pl-5 border-l-4 border-white/60">
                  
                  "F*ck it. I'm going to help people."
                </motion.p>
                <motion.p variants={itemVariants}>
                  That's what led me here.
                </motion.p>
                <motion.p variants={itemVariants}>
                  I became a mindset and <strong>life coach</strong> because I
                  want to be the person I <strong>needed</strong> when I was
                  going through my hardest moments. I help people push through
                  whatever the hell is holding them back from actually living
                  their life.
                </motion.p>
                <motion.p variants={itemVariants}>
                  I'm big on body <strong>positivity</strong>,{' '}
                  <strong>self-care</strong>, and <em>actually</em> taking care
                  of yourself. Not the trendy version—the real, messy, everyday
                  version that keeps you going when life gets hard.
                </motion.p>
                <motion.p variants={itemVariants}>
                  I focus on confidence, motivation, and helping you{' '}
                  <strong>see your worth</strong>—even when you've forgotten it.
                </motion.p>
                <motion.p variants={itemVariants}>
                  Look, I've got a <strong>sassy mouth</strong> and I cuss a
                  lot. I <strong>don't do fake</strong>. But I've got a heart of
                  gold, and all I want to do is help rebuild the world{' '}
                  <strong>one soul at a time</strong>.
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Right: Phone Mockup — LARGE FOCAL POINT */}
            <motion.div initial={{
            opacity: 0,
            x: 40
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            ease: 'easeOut',
            delay: 0.3
          }} className="relative flex justify-center items-start lg:sticky lg:top-24">
              
              {/* Strong radial glow behind phone */}
              <div className="absolute w-[700px] h-[900px] bg-white/30 rounded-full blur-[100px] z-10 -top-8" />
              <div className="absolute w-[500px] h-[500px] bg-pink-200/35 rounded-full blur-[80px] z-10 top-10 -right-12" />
              <div className="absolute w-[400px] h-[400px] bg-white/20 rounded-full blur-[60px] z-10 bottom-10 -left-10" />

              {/* Phone Mockup Image — 2x focal point size */}
              <img src="/ChatGPT_Image_Mar_21,_2026,_02_52_33_PM.png" alt="Mandy - phone mockup" className="relative z-20 w-full max-w-none lg:scale-125 drop-shadow-2xl" />
              

              {/* Floating hearts near phone */}
              <motion.div animate={{
              y: [-8, 8, -8],
              rotate: [-5, 5, -5]
            }} transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }} className="absolute top-8 -right-2 md:right-2 z-30">
                
                <GlitterHeart size={28} variant="light" className="opacity-80" />
                
              </motion.div>

              <motion.div animate={{
              y: [6, -6, 6]
            }} transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2
            }} className="absolute bottom-20 -left-4 z-30">
                
                <GlitterHeart size={24} className="opacity-60" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* QUOTE SECTION */}
      <section className="py-16 md:py-20 relative overflow-hidden bg-gradient-to-b from-blush-200 to-blush-100">
        <SparkleEffect count={40} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }}>
            
            <GlitterHeart size={40} className="mx-auto mb-6" />
            <blockquote className="font-heading text-3xl md:text-5xl text-plum-800 leading-tight font-bold italic">
              "I've been through hell and I'm still standing. Now, I'm here to
              help you do the same."
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* PHILOSOPHY / VALUES SECTION */}
      <section className="py-16 md:py-20 relative overflow-hidden bg-plum-900">
        <SparkleEffect count={60} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <motion.h2 initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              
              How We Roll
            </motion.h2>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.1
          }} className="text-plum-200 text-lg max-w-2xl mx-auto font-medium">
              
              The core values that guide everything I do.
            </motion.p>
          </div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
          once: true,
          margin: '-50px'
        }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-[2rem]">
              
              <div className="w-14 h-14 bg-cta-500/20 rounded-2xl flex items-center justify-center mb-6">
                <FlameIcon className="w-7 h-7 text-cta-400" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-3">
                No Fake Shit
              </h3>
              <p className="text-white/80 font-medium leading-relaxed text-sm">
                Showing up as our true, messy, beautiful selves. We leave the
                masks at the door.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-[2rem]">
              
              <div className="w-14 h-14 bg-blush-500/20 rounded-2xl flex items-center justify-center mb-6">
                <HeartIcon className="w-7 h-7 text-blush-300" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-3">
                Grow Through It
              </h3>
              <p className="text-white/80 font-medium leading-relaxed text-sm">
                Embracing the uncomfortable moments because that's where the
                real badassery is built.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-[2rem]">
              
              <div className="w-14 h-14 bg-lavender-500/20 rounded-2xl flex items-center justify-center mb-6">
                <SparklesIcon className="w-7 h-7 text-lavender-300" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-3">
                We Rise Together
              </h3>
              <p className="text-white/80 font-medium leading-relaxed text-sm">
                Healing is an inside job, but you don't have to do it alone.
                I've got your back.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 md:py-20 relative overflow-hidden bg-gradient-to-b from-blush-100 to-blush-50">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="flex flex-col items-center">
            
            <GlitterHeart size={56} className="mb-6" />

            <h2 className="font-heading text-4xl md:text-5xl font-bold text-plum-900 mb-10 leading-tight">
              Ready to stop just surviving?
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link to="/courses" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-plum-700 font-bold text-lg border-2 border-blush-300 hover:bg-blush-50 hover:border-cta-400 transition-all shadow-lg hover:-translate-y-1">
                
                <GlitterHeart size={22} />
                Explore Courses
              </Link>
              <Link to="/coaching" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-cta-500 text-white font-bold text-lg hover:bg-cta-600 transition-all shadow-xl shadow-cta-500/30 hover:-translate-y-1 hover:scale-105">
                
                <GlitterHeart size={22} variant="light" />
                Book 1:1 Coaching
                <ArrowRightIcon className="w-5 h-5 ml-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>;
}