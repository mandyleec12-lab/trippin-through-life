import React, { useEffect, useState, cloneElement, Component } from 'react';
import { motion } from 'framer-motion';
import { SparkleEffect } from '../components/SparkleEffect';
import { PlaneIcon, MapIcon, CompassIcon, SparklesIcon } from 'lucide-react';
import { GlitterHeart } from '../components/GlitterHeart';
function RegularTravelForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [tripTypes, setTripTypes] = useState<string[]>([]);
  const [travelDates, setTravelDates] = useState('');
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [extra, setExtra] = useState('');
  const toggleTripType = (type: string) => {
    setTripTypes((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const formData = new FormData();
      formData.append('fields[email]', email);
      formData.append('fields[z_i_p]', name);
      formData.append('fields[name]', contactMethod);
      formData.append('fields[last_name]', contactDetails);
      tripTypes.forEach((t) => formData.append('fields[company][]', t));
      formData.append('fields[country]', travelDates);
      formData.append('fields[city]', destination);
      formData.append('fields[phone]', budget);
      formData.append('fields[state]', extra);
      formData.append('ml-submit', '1');
      formData.append('anticsrf', 'true');
      await fetch('https://assets.mailerlite.com/jsonp/2211088/forms/182588858091702005/subscribe', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };
  if (status === 'success') {
    return <div className="bg-white/80 rounded-2xl p-8 text-center border border-blush-200">
        <p className="font-heading text-2xl font-bold text-plum-700 mb-2">
          ✈️ You're all set!
        </p>
        <p className="text-plum-500 font-medium">
          I'll review your trip request and reach out soon. Let's get you out of
          here! 💖
        </p>
      </div>;
  }
  return <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-bold text-plum-700 mb-1.5">
          Name
        </label>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-blush-200 focus:ring-2 focus:ring-cta-500 outline-none bg-white/80" placeholder="Your name" />
        
      </div>
      <div>
        <label className="block text-sm font-bold text-plum-700 mb-1.5">
          Email
        </label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-blush-200 focus:ring-2 focus:ring-cta-500 outline-none bg-white/80" placeholder="your@email.com" />
        
      </div>
      <div>
        <label className="block text-sm font-bold text-plum-700 mb-1.5">
          Best way to contact you
        </label>
        <select required value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-blush-200 focus:ring-2 focus:ring-cta-500 outline-none bg-white/80 text-plum-700">
          
          <option value="">Select...</option>
          <option value="phone">Phone</option>
          <option value="text">Text</option>
          <option value="email">Email</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-bold text-plum-700 mb-1.5">
          Enter your contact details
        </label>
        <input type="text" required value={contactDetails} onChange={(e) => setContactDetails(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-blush-200 focus:ring-2 focus:ring-cta-500 outline-none bg-white/80" placeholder="Phone number or email" />
        
      </div>
      <div>
        <label className="block text-sm font-bold text-plum-700 mb-2">
          What kind of trip? (select all that apply)
        </label>
        <div className="flex flex-wrap gap-3">
          {['cruise', 'hotel', 'plane', 'rent a car', 'other'].map((type) => <label key={type} className="flex items-center gap-2 cursor-pointer">
            
              <input type="checkbox" checked={tripTypes.includes(type)} onChange={() => toggleTripType(type)} className="w-4 h-4 rounded border-blush-300 text-cta-500 focus:ring-cta-500" />
            
              <span className="text-plum-600 font-medium text-sm capitalize">
                {type}
              </span>
            </label>)}
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-plum-700 mb-1.5">
          Travel Dates?
        </label>
        <input type="text" value={travelDates} onChange={(e) => setTravelDates(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-blush-200 focus:ring-2 focus:ring-cta-500 outline-none bg-white/80" placeholder="Exact dates or 'flexible'" />
        
      </div>
      <div>
        <label className="block text-sm font-bold text-plum-700 mb-1.5">
          Where would you like to go?
        </label>
        <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-blush-200 focus:ring-2 focus:ring-cta-500 outline-none bg-white/80" placeholder="E.g., Mexico, Europe, or 'Anywhere warm!'" />
        
      </div>
      <div>
        <label className="block text-sm font-bold text-plum-700 mb-1.5">
          Budget range
        </label>
        <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-blush-200 focus:ring-2 focus:ring-cta-500 outline-none bg-white/80" placeholder="E.g., $500–$1000" />
        
      </div>
      <div>
        <label className="block text-sm font-bold text-plum-700 mb-1.5">
          Anything else you want me to know?
        </label>
        <input type="text" value={extra} onChange={(e) => setExtra(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-blush-200 focus:ring-2 focus:ring-cta-500 outline-none bg-white/80" placeholder="Special requests, accessibility needs, etc." />
        
      </div>
      <button type="submit" disabled={status === 'loading'} className="w-full py-4 rounded-full bg-cta-500 text-white font-bold text-lg hover:bg-cta-600 transition-all shadow-lg disabled:opacity-60">
        
        {status === 'loading' ? '...' : '✈️ Build My Trip!'}
      </button>
      {status === 'error' && <p className="text-red-500 text-xs font-medium">
          Something went wrong. Please try again.
        </p>}
    </form>;
}
function BudgetTravelForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [budget, setBudget] = useState('');
  const [unavailableDates, setUnavailableDates] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const formData = new FormData();
      formData.append('fields[email]', email);
      formData.append('fields[city]', name);
      formData.append('fields[name]', contactMethod);
      formData.append('fields[last_name]', contactDetails);
      formData.append('fields[company]', budget);
      formData.append('fields[country]', unavailableDates);
      formData.append('ml-submit', '1');
      formData.append('anticsrf', 'true');
      await fetch('https://assets.mailerlite.com/jsonp/2211088/forms/182588184542053728/subscribe', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };
  if (status === 'success') {
    return <div className="bg-white/80 rounded-2xl p-8 text-center border border-sky-200">
        <p className="font-heading text-2xl font-bold text-plum-700 mb-2">
          ✈️ You're on the list!
        </p>
        <p className="text-plum-500 font-medium">
          I'll find you something amazing within your budget. Get ready! 💖
        </p>
      </div>;
  }
  return <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-bold text-plum-700 mb-1.5">
          Name
        </label>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:ring-2 focus:ring-cta-500 outline-none bg-white/80" placeholder="Your name" />
        
      </div>
      <div>
        <label className="block text-sm font-bold text-plum-700 mb-1.5">
          Email
        </label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:ring-2 focus:ring-cta-500 outline-none bg-white/80" placeholder="your@email.com" />
        
      </div>
      <div>
        <label className="block text-sm font-bold text-plum-700 mb-1.5">
          Best way to contact you
        </label>
        <select required value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:ring-2 focus:ring-cta-500 outline-none bg-white/80 text-plum-700">
          
          <option value="">Select...</option>
          <option value="Phone">Phone</option>
          <option value="Text">Text</option>
          <option value="Email">Email</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-bold text-plum-700 mb-1.5">
          Enter your contact details
        </label>
        <input type="text" required value={contactDetails} onChange={(e) => setContactDetails(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:ring-2 focus:ring-cta-500 outline-none bg-white/80" placeholder="Phone number or email" />
        
      </div>
      <div>
        <label className="block text-sm font-bold text-plum-700 mb-1.5">
          Budget
        </label>
        <input type="text" required value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:ring-2 focus:ring-cta-500 outline-none bg-white/80" placeholder="E.g., $300, $500, $1000" />
        
      </div>
      <div>
        <label className="block text-sm font-bold text-plum-700 mb-1.5">
          Any dates you're unable to travel?
        </label>
        <input type="text" value={unavailableDates} onChange={(e) => setUnavailableDates(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:ring-2 focus:ring-cta-500 outline-none bg-white/80" placeholder="E.g., 'Not available in December'" />
        
      </div>
      <button type="submit" disabled={status === 'loading'} className="w-full py-4 rounded-full bg-plum-700 text-white font-bold text-lg hover:bg-plum-900 transition-all shadow-lg disabled:opacity-60">
        
        {status === 'loading' ? '...' : '✈️ Surprise Me!'}
      </button>
      {status === 'error' && <p className="text-red-500 text-xs font-medium">
          Something went wrong. Please try again.
        </p>}
    </form>;
}
const RealisticPlane = ({
  flip = false,
  size = 48



}: {flip?: boolean;size?: number;}) => <svg width={size} height={size} viewBox="0 0 512 512" fill="currentColor" style={{
  transform: flip ? 'scaleX(-1)' : undefined
}}>
  
    <path d="M186.6 25.1c-8.8-2.9-18.4.8-22.8 8.9L97.2 152.5c-2.5 4.6-2.5 10.1-.1 14.7l13.6 26.2L15.8 227c-10.1 3.4-16.7 12.5-16.7 22.8v32.7c0 10.3 6.6 19.5 16.4 22.8l94.8 32.5 13.7 26.4c2.4 4.6 2.4 10.1-.1 14.7L57.8 497c-4.4 8.1-1 18.2 7.8 22.8 3.1 1.6 6.4 2.2 9.7 2.2 5.8 0 11.5-2.6 15.2-7.4L199.8 370c3.5-4.5 4.5-10.5 2.6-16l-12.4-35.8 122.3-41.9c3.3-1.1 6.1-3.4 7.9-6.4l68.4-115.5c1.5-2.5 2.2-5.4 2.2-8.3V128c0-4.2-1.7-8.3-4.7-11.3l-22.6-22.6c-3-3-7.1-4.7-11.3-4.7h-18.1c-2.9 0-5.8.7-8.3 2.2L210.3 160.1c-3 1.8-5.3 4.6-6.4 7.9l-41.9 122.3-35.8-12.4c-5.5-1.9-11.5-.9-16 2.6L-4.5 389.8" opacity="0.35" />
  
    <path d="M497 2.5c-4.6-4.4-11.8-4.4-16.4.1L338.3 147.9 210.8 91.4c-4.7-2.1-10.2-1.3-14.1 2l-28.9 24.8L42.5 68.6C31.9 65.1 20.6 71 17.1 81.6l-11.3 33.8c-3.5 10.5 2.4 21.8 12.9 25.4l125.3 42.8 24.9-28.8c3.4-3.9 4.1-9.4 2-14.1l-56.5-127.5L259.7 155c4.5 4.5 11.8 4.5 16.3 0L509.5 18.9c4.5-4.6 4.5-12-.1-16.4h-12.4z" opacity="0.5" />
  
  </svg>;
function ScrollPlane({
  topStart,
  topEnd,
  reverse = false,
  size = 44





}: {topStart: number;topEnd: number;reverse?: boolean;size?: number;}) {
  const [pos, setPos] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setPos(progress);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const xPercent = reverse ? 100 - pos * 120 : -20 + pos * 120;
  const topPercent = topStart + (topEnd - topStart) * pos;
  const opacity = Math.min(pos * 4, 1) * Math.min((1 - pos) * 4, 1) * 0.18;
  return <div className="absolute pointer-events-none z-[1]" style={{
    top: `${topPercent}%`,
    left: `${xPercent}%`,
    opacity,
    transition: 'opacity 0.3s ease',
    filter: 'drop-shadow(0 4px 12px rgba(139,92,138,0.15))'
  }}>
      
      {/* Vapor trail */}
      <svg className="absolute" style={{
      [reverse ? 'left' : 'right']: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 160,
      height: 20
    }} viewBox="0 0 160 20" fill="none">
        
        <defs>
          <linearGradient id={`trail-${reverse ? 'r' : 'f'}-${topStart}`} x1={reverse ? '0%' : '100%'} y1="0%" x2={reverse ? '100%' : '0%'} y2="0%">
            
            <stop offset="0%" stopColor="rgba(139,92,138,0.3)" />
            <stop offset="100%" stopColor="rgba(139,92,138,0)" />
          </linearGradient>
        </defs>
        <path d={reverse ? 'M0,10 Q40,4 80,10 Q120,16 160,10' : 'M0,10 Q40,16 80,10 Q120,4 160,10'} stroke={`url(#trail-${reverse ? 'r' : 'f'}-${topStart})`} strokeWidth="2" fill="none" />
        
        <path d={reverse ? 'M0,10 Q40,4 80,10 Q120,16 160,10' : 'M0,10 Q40,16 80,10 Q120,4 160,10'} stroke={`url(#trail-${reverse ? 'r' : 'f'}-${topStart})`} strokeWidth="1" strokeDasharray="4 6" fill="none" opacity="0.5" />
        
      </svg>
      <div className="text-plum-400" style={{
      transform: `rotate(${reverse ? '15deg' : '-15deg'})`
    }}>
        
        <RealisticPlane flip={reverse} size={size} />
      </div>
    </div>;
}
export function TravelPage() {
  return <div className="min-h-screen bg-gradient-to-b from-[#dce6f5] via-[#e8dff0] to-[#f5e8f0] pt-24 pb-12 relative overflow-hidden">
      {/* Scroll-driven airplane shadows */}
      <ScrollPlane topStart={5} topEnd={15} size={48} />
      <ScrollPlane topStart={35} topEnd={50} reverse size={40} />
      <ScrollPlane topStart={65} topEnd={80} size={44} />

      {/* Hero — Image as Background */}
      <section className="relative flex items-start overflow-hidden">
        {/* Background image — full, no cropping */}
        <img src="/ChatGPT_Image_Mar_21,_2026,_08_52_39_PM.png" alt="" className="absolute inset-0 w-full h-full object-contain object-top" aria-hidden="true" />
        
        {/* Match the image aspect ratio so nothing is cropped */}
        <div className="w-full" style={{
        paddingBottom: '66.67%'
      }} />
        
        {/* Soft overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#dce6f5]/60 via-transparent to-[#dce6f5]/30" />

        {/* Sparkles over the background */}
        <SparkleEffect count={90} />

        {/* Twinkling stars */}
        {[{
        top: '12%',
        right: '15%',
        delay: 0,
        size: 'w-3 h-3'
      }, {
        top: '25%',
        right: '30%',
        delay: 0.5,
        size: 'w-2 h-2'
      }, {
        top: '18%',
        right: '45%',
        delay: 1,
        size: 'w-2.5 h-2.5'
      }, {
        bottom: '25%',
        right: '20%',
        delay: 0.8,
        size: 'w-2 h-2'
      }, {
        bottom: '35%',
        right: '40%',
        delay: 1.3,
        size: 'w-3 h-3'
      }, {
        top: '40%',
        right: '10%',
        delay: 1.6,
        size: 'w-1.5 h-1.5'
      }].map((spark, i) => <motion.div key={i} className={`absolute z-10 ${spark.size} rounded-full bg-white`} style={{
        top: spark.top,
        bottom: spark.bottom,
        right: spark.right,
        boxShadow: '0 0 8px 3px rgba(255,255,255,0.9), 0 0 20px 6px rgba(200,180,220,0.5)'
      }} animate={{
        opacity: [0, 1, 0.3, 1, 0],
        scale: [0.5, 1.3, 0.7, 1.2, 0.5]
      }} transition={{
        duration: 3.5,
        delay: spark.delay,
        repeat: Infinity,
        ease: 'easeInOut'
      }} />)}

        {/* Text content — positioned at top over the background */}
        <div className="absolute top-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 pt-[30%] md:pt-[22%]">
          <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-plum-700 mb-6 drop-shadow-sm whitespace-nowrap">
            
            Trippin' Through <span className="shimmer-text">Travel</span>
          </motion.h1>
          <motion.p initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.15
        }} className="text-xl md:text-2xl text-plum-600 font-medium max-w-lg drop-shadow-sm">
            
            Because everybody deserves to get the hell out sometimes.
          </motion.p>
        </div>
      </section>

      {/* Philosophy Section — pulled up onto background */}
      <section className="mt-0 md:-mt-[25%] relative z-10 py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="prose prose-lg prose-plum mx-auto text-plum-700 leading-relaxed text-center bg-white/40 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/50 shadow-lg">
          
          <p className="text-2xl font-heading text-plum-700 mb-8 font-bold">
            I believe travel is healing.
          </p>
          <p className="mb-6 font-medium">
            Getting out of your everyday environment, seeing something new,
            breathing different air — it changes you. It resets your nervous
            system and reminds you that the world is bigger than whatever you're
            going through right now.
          </p>
          <p className="mb-6 font-medium">
            I don't care if your budget is $200 or $2,000. I will find you
            something. A weekend getaway, a road trip, a beach somewhere —
            everyone deserves to escape.
          </p>
          <p className="text-xl text-cta-500 font-bold mt-8">
            Tell me your budget, tell me your dream, and let me make it happen.
          </p>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-14 bg-blush-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl font-bold text-plum-700 mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-blush-200" />

            {[{
            icon: <MapIcon />,
            title: '1. Book Your Free Consultation',
            desc: "No judgment, just honesty. Tell me your budget, your vibe, and your must-haves. I'll work with what you have and go from there."
          }, {
            icon: <CompassIcon />,
            title: '2. I Build Your Perfect Trip',
            desc: 'I research, compare, and put together a personalized travel plan that fits your budget—flights, stays, activities, all of it.'
          }, {
            icon: <PlaneIcon />,
            title: '3. You Pack Your Bags & Go',
            desc: 'You get your itinerary, book with confidence, and go live your best life. Come back recharged and ready.'
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
                <h3 className="font-heading text-2xl font-bold text-plum-700 mb-3">
                  {step.title}
                </h3>
                <p className="text-plum-500 font-medium">{step.desc}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Travel Types */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-plum-700 mb-4">
            What We Can Plan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[{
          title: 'Budget Getaways',
          desc: 'Weekend trips and local escapes under $500.',
          color: 'bg-blush-50 border-blush-100'
        }, {
          title: 'Healing Retreats',
          desc: 'Wellness-focused travel experiences to reset your soul.',
          color: 'bg-lavender-50 border-lavender-100'
        }, {
          title: 'Adventure Trips',
          desc: 'For when you need to feel alive and push your boundaries.',
          color: 'bg-sky-50 border-sky-100'
        }, {
          title: 'Group Travel',
          desc: 'Coming soon: group trips with the community. We rise together.',
          color: 'bg-white border-plum-100',
          badge: 'Coming Soon'
        }].map((type, i) => <motion.div key={i} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: i * 0.1
        }} className={`p-8 rounded-3xl border ${type.color} shadow-sm relative`}>
            
              {type.badge && <div className="absolute top-4 right-4 px-2 py-1 bg-plum-100 text-plum-700 text-xs font-bold rounded-md uppercase">
                  {type.badge}
                </div>}
              <SparklesIcon className="w-6 h-6 text-cta-500 mb-4" />
              <h3 className="font-heading text-xl font-bold text-plum-700 mb-2">
                {type.title}
              </h3>
              <p className="text-plum-500 font-medium text-sm">{type.desc}</p>
            </motion.div>)}
        </div>
      </section>

      {/* TWO TRAVEL FORMS - Side by Side */}
      <section className="py-12 relative overflow-hidden bg-gradient-to-b from-white to-blush-50">
        <SparkleEffect count={80} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-plum-700 mb-4 flex items-center justify-center gap-3">
              Let Me Plan Your Escape ✈️
            </h2>
            <p className="text-lg text-plum-500 font-medium max-w-2xl mx-auto">
              Choose the option that fits you best — whether you already know
              where you want to go, or you want me to surprise you within your
              budget 💕
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Regular Travel Form */}
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] shadow-xl border border-blush-200 relative">
              
              <div className="absolute -top-4 -right-4 rotate-12">
                <GlitterHeart size={32} className="opacity-80" />
              </div>
              <div className="mb-6">
                <h3 className="font-heading text-2xl font-bold text-plum-700 mb-2">
                  Need to Book Travel?
                </h3>
                <p className="text-plum-500 font-medium text-sm">
                  Already know what you want? Ready to book?
                </p>
                <p className="text-cta-500 font-bold text-sm mt-1">
                  Say less 😏 Fill this out and let's get you out of here ✈️💖
                </p>
              </div>
              <RegularTravelForm />
            </motion.div>

            {/* Budget Travel Form */}
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.15
          }} className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] shadow-xl border border-sky-200 relative">
              
              <div className="absolute -top-4 -left-4 -rotate-12">
                <GlitterHeart size={32} variant="light" className="opacity-80" />
                
              </div>
              <div className="mb-6">
                <h3 className="font-heading text-2xl font-bold text-plum-700 mb-2">
                  Budget Travel Services
                </h3>
                <p className="text-plum-500 font-medium text-sm">
                  Because everyone deserves to get the hell out sometimes.
                </p>
                <p className="text-plum-500 font-medium text-sm mt-1">
                  If you want me to plan a vacation within your budget—where I
                  choose the destination and dates for you—this is for you.
                </p>
                <p className="text-cta-500 font-bold text-sm mt-1">
                  Fill out this quick questionnaire and let's get you out of
                  here ✈️
                </p>
              </div>
              <BudgetTravelForm />
            </motion.div>
          </div>

          <p className="mt-8 text-center text-sm font-medium text-plum-500">
            I'll personally review your request and reach out with options that
            fit your vibe and your budget.
          </p>

          <div className="mt-6 flex justify-center">
            <a href="https://www.tiktok.com/@mandyleedidathing?_r=1&_t=ZP-94syzVPhazm" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/70 backdrop-blur-sm border border-blush-200 text-plum-700 font-bold text-sm hover:bg-white hover:border-cta-300 transition-all shadow-sm">
              
              <svg className="w-5 h-5 text-cta-500" viewBox="0 0 24 24" fill="currentColor">
                
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
              Follow my Travel TikTok ✈️
            </a>
          </div>
        </div>
      </section>
    </div>;
}