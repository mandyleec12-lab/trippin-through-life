import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SparkleEffect } from '../../../components/SparkleEffect';
import { CheckIcon, RotateCcwIcon, DownloadIcon, SparklesIcon } from 'lucide-react';
const checklistData = [{
  id: 'documents',
  title: '📄 Documents & Boarding',
  notes: '',
  accent: 'from-sky-400 to-blue-500',
  tasks: [{
    id: 'd-1',
    text: 'Required boarding documents (passport or birth certificate if needed)'
  }, {
    id: 'd-2',
    text: 'Cruise boarding pass (printed + screenshot on phone)'
  }, {
    id: 'd-3',
    text: 'Reservation printout (backup)'
  }, {
    id: 'd-4',
    text: "Driver's license / IDs (you + kids)"
  }, {
    id: 'd-5',
    text: 'Credit/debit cards + small amount of cash'
  }, {
    id: 'd-6',
    text: 'Travel insurance info (if you have it)'
  }, {
    id: 'd-7',
    text: 'Luggage tags (printed & attached)'
  }],
  tips: ["No passport? You can still cruise if you're leaving from AND returning to a U.S. port.", "Bring your birth certificate + driver's license for boarding.", 'If your name has changed (ex: marriage), bring your marriage license to match documents.', "For children: if they don't have a passport or state ID, their birth certificate is sufficient.", 'Bring small bills — tip porters about $5 per bag when checking luggage. Helps ensure your bags are handled properly and arrive faster.']
}, {
  id: 'clothing',
  title: '👗 Clothing',
  notes: '',
  accent: 'from-cyan-400 to-teal-500',
  tasks: [{
    id: 'c-1',
    text: 'Outfit for each day'
  }, {
    id: 'c-2',
    text: 'Travel outfit (to port)'
  }, {
    id: 'c-3',
    text: 'Elegant dinner outfit(s) ✨'
  }, {
    id: 'c-4',
    text: 'Casual dinner outfits'
  }, {
    id: 'c-5',
    text: 'Pajamas'
  }, {
    id: 'c-6',
    text: 'Undergarments'
  }, {
    id: 'c-7',
    text: 'Socks'
  }, {
    id: 'c-8',
    text: 'Swimsuits (bring 2 if possible)'
  }, {
    id: 'c-9',
    text: 'Cover-ups'
  }, {
    id: 'c-10',
    text: 'Light jacket or cardigan (ships get COLD)'
  }, {
    id: 'c-11',
    text: "Workout clothes (if you'll use gym)"
  }, {
    id: 'c-12',
    text: 'Comfortable walking shoes'
  }, {
    id: 'c-13',
    text: 'Dress shoes (for dinners)'
  }, {
    id: 'c-14',
    text: 'Flip flops / sandals'
  }, {
    id: 'c-15',
    text: 'Water shoes (rocky beaches)'
  }],
  tips: ['Focus on COMFORT. Think rompers, bathing suits, loose-fitting outfits.', "It's humid, hot, and you'll be walking A LOT on the ship.", "Unless it's an Alaskan cruise — then plan for cooler weather."]
}, {
  id: 'toiletries',
  title: '💄 Toiletries & Beauty',
  notes: '',
  accent: 'from-teal-400 to-emerald-500',
  tasks: [{
    id: 't-1',
    text: 'Toothbrush & toothpaste'
  }, {
    id: 't-2',
    text: 'Shampoo & conditioner'
  }, {
    id: 't-3',
    text: 'Leave-in conditioner'
  }, {
    id: 't-4',
    text: 'Body wash (optional but nicer than cruise soap)'
  }, {
    id: 't-5',
    text: 'Deodorant'
  }, {
    id: 't-6',
    text: 'Razor'
  }, {
    id: 't-7',
    text: 'Feminine hygiene products'
  }, {
    id: 't-8',
    text: 'Lotion'
  }, {
    id: 't-9',
    text: 'Sunscreen ☀️'
  }, {
    id: 't-10',
    text: 'Makeup'
  }, {
    id: 't-11',
    text: 'Makeup remover'
  }, {
    id: 't-12',
    text: 'Skincare products'
  }, {
    id: 't-13',
    text: 'Hairbrush'
  }, {
    id: 't-14',
    text: 'Hair products (spray, gel, mousse)'
  }, {
    id: 't-15',
    text: 'Hair accessories (clips, scrunchies, ponytails)'
  }, {
    id: 't-16',
    text: 'Cotton swabs'
  }, {
    id: 't-17',
    text: 'Nail clippers/file (people forget this!)'
  }],
  tips: []
}, {
  id: 'health',
  title: '💊 Health & Essentials',
  notes: '',
  accent: 'from-blue-400 to-indigo-500',
  tasks: [{
    id: 'h-1',
    text: 'Daily medications'
  }, {
    id: 'h-2',
    text: 'Motion sickness meds'
  }, {
    id: 'h-3',
    text: 'Pain reliever (headache)'
  }, {
    id: 'h-4',
    text: 'Heartburn meds'
  }, {
    id: 'h-5',
    text: 'Bandaids / mini first aid kit'
  }, {
    id: 'h-6',
    text: 'Allergy meds'
  }, {
    id: 'h-7',
    text: 'Hand sanitizer'
  }, {
    id: 'h-8',
    text: 'Disinfecting wipes'
  }],
  tips: ['Cruise medical centers are VERY expensive.', 'Even something small like Neosporin or a Band-Aid can cost $100+.', 'Bring anything you might need — a small first aid kit is 100% worth it.', 'Also, one of the biggest concerns people have about cruising is getting sick.', "It does happen, especially if you're not taking precautions.", 'Stay on top of sanitizing your hands and frequently touched surfaces.']
}, {
  id: 'electronics',
  title: '📱 Electronics',
  notes: '',
  accent: 'from-indigo-400 to-violet-500',
  tasks: [{
    id: 'e-1',
    text: 'Phone'
  }, {
    id: 'e-2',
    text: 'Chargers (ALL of them)'
  }, {
    id: 'e-3',
    text: 'Portable charger 🔋'
  }, {
    id: 'e-4',
    text: 'Headphones'
  }, {
    id: 'e-5',
    text: 'Action camera'
  }, {
    id: 'e-6',
    text: 'Action camera accessories (extra batteries, mounts, waterproof case, chargers)'
  }, {
    id: 'e-7',
    text: 'Extra storage (SD cards for camera, extra phone storage if needed)'
  }, {
    id: 'e-8',
    text: "Tablets / kids' devices (ex: kids' tablets for downtime)"
  }, {
    id: 'e-9',
    text: 'Charging block / multi USB hub (limited outlets in cabins)'
  }, {
    id: 'e-10',
    text: 'Tripod / selfie stick (for content creators)'
  }, {
    id: 'e-11',
    text: 'Any filming gear (lights, mics, etc. if you use them)'
  }],
  tips: ["Internet on cruises is NOT automatic — it's a paid package.", "If you don't plan to buy it, download EVERYTHING ahead of time (shows, music, etc.).", 'Put your phone on AIRPLANE MODE once you board.', 'Your phone can randomly connect to towers near islands and rack up roaming charges without you realizing it.', "You might have service one minute and lose it the next — that's how people get hit with big bills.", "If you can't afford internet for everyone: At least get one package for the room. Use the cruise's messaging app (usually cheap) to stay in touch.", 'IMPORTANT: You cannot share internet at the same time. One person must fully log out before another logs in.', "Content creators: Bring everything you need to film — tripod, selfie stick, etc. You won't want to miss moments because you didn't have your setup ready."]
}, {
  id: 'musthaves',
  title: '🌊 Cruise-Specific Must-Haves (THE GOOD STUFF)',
  notes: '',
  accent: 'from-sky-500 to-cyan-500',
  tasks: [{
    id: 'm-1',
    text: 'Waterproof phone case'
  }, {
    id: 'm-2',
    text: 'Waterproof bag'
  }, {
    id: 'm-3',
    text: 'Beach bag / tote'
  }, {
    id: 'm-4',
    text: 'Towel clips (wind WILL steal your towel 😭)'
  }, {
    id: 'm-5',
    text: 'Reusable water bottle'
  }, {
    id: 'm-6',
    text: 'Lanyard for cruise card (game changer)'
  }, {
    id: 'm-7',
    text: 'Small backpack for excursions'
  }, {
    id: 'm-8',
    text: 'Magnetic hooks (for older ships like you said)'
  }, {
    id: 'm-9',
    text: 'Ziplock bags (wet clothes, snacks, random stuff)'
  }, {
    id: 'm-10',
    text: 'Travel-size laundry detergent (for quick sink washes)'
  }],
  tips: []
}, {
  id: 'extras',
  title: '🌧️ Extras / Comfort Items',
  notes: '',
  accent: 'from-amber-400 to-orange-500',
  tasks: [{
    id: 'ex-1',
    text: 'Small umbrella'
  }, {
    id: 'ex-2',
    text: 'Sunglasses'
  }, {
    id: 'ex-3',
    text: 'Book / Kindle'
  }, {
    id: 'ex-4',
    text: 'Snacks (especially for kids or late nights)'
  }, {
    id: 'ex-5',
    text: 'Gum / mints'
  }, {
    id: 'ex-6',
    text: 'Wrinkle-release spray (WAY better than ironing)'
  }, {
    id: 'ex-7',
    text: 'Nightlight (cabins get DARK)'
  }, {
    id: 'ex-8',
    text: 'Door decorations (optional but fun + helps find your room)'
  }],
  tips: []
}, {
  id: 'notes',
  title: '🚬 Personal Notes',
  notes: '',
  accent: 'from-rose-400 to-pink-500',
  tasks: [{
    id: 'n-1',
    text: 'Extra vapes (not sold onboard)'
  }, {
    id: 'n-2',
    text: 'Check drink package rules (soda/wine limits)'
  }, {
    id: 'n-3',
    text: 'Plan outfits around excursions + events'
  }, {
    id: 'n-4',
    text: 'Comfortable shoes are a MUST'
  }, {
    id: 'n-5',
    text: 'Elegant dinners + club outfits'
  }],
  tips: []
}];
export function TropicalCruisePackingPage() {
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('tcpl-627-progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });
  useEffect(() => {
    localStorage.setItem('tcpl-627-progress', JSON.stringify(checkedTasks));
  }, [checkedTasks]);
  const toggleTask = (taskId: string) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };
  const resetProgress = () => {
    if (window.confirm('Are you sure you want to uncheck all items and start over?')) {
      setCheckedTasks({});
    }
  };
  const totalTasks = checklistData.reduce((acc, section) => acc + section.tasks.length, 0);
  const completedTasks = Object.values(checkedTasks).filter(Boolean).length;
  const progressPercentage = Math.round(completedTasks / totalTasks * 100);
  const isComplete = completedTasks === totalTasks;
  return <div className="min-h-screen pb-24" style={{
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdfa 100%)'
  }}>
      
      {/* Hero Section */}
      <div className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/file_00000000ac5c71f588bc694e6a709fd8.png" alt="" className="w-full h-full object-cover object-top opacity-40" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-sky-100/40 via-blue-50/50 to-[#f0f9ff]" />
        </div>

        <SparkleEffect count={150} />

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-sky-300 text-sm font-bold text-sky-700 mb-6 uppercase tracking-wider shadow-sm">
            
            <SparklesIcon className="w-4 h-4" /> The Ultimate Guide
          </motion.div>

          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="font-heading text-5xl md:text-7xl font-bold text-sky-900 mb-6 drop-shadow-sm uppercase tracking-tight">
            
            Ultimate Tropical Cruise <br /> Packing Checklist
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="text-xl md:text-2xl text-sky-700 font-medium max-w-2xl mx-auto italic">
            
            If you're going somewhere humid with water, you need this. Pack
            smart, travel stress-free, and never forget the essentials again. 🌴
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-8">
        {/* Sticky Progress Bar */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} className="bg-white/90 backdrop-blur-xl border border-sky-200 rounded-3xl p-6 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 sticky top-24 z-40">
          
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm font-bold text-sky-900 mb-3">
              <span className="flex items-center gap-2">
                Your Progress {isComplete && '🎉'}
              </span>
              <span>
                {progressPercentage}% ({completedTasks}/{totalTasks})
              </span>
            </div>
            <div className="h-4 w-full bg-sky-100 rounded-full overflow-hidden shadow-inner">
              <motion.div className="h-full bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400" initial={{
              width: 0
            }} animate={{
              width: `${progressPercentage}%`
            }} transition={{
              duration: 0.5,
              ease: 'easeOut'
            }} />
              
            </div>
          </div>
          <button onClick={resetProgress} className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-sky-300 text-sky-700 font-bold text-sm hover:bg-sky-50 hover:text-sky-900 transition-all shadow-sm">
            
            <RotateCcwIcon className="w-4 h-4" />
            Start Fresh
          </button>
        </motion.div>

        {/* Checklist Sections */}
        <div className="space-y-8">
          {checklistData.map((section, sectionIdx) => <motion.div key={section.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4 + sectionIdx * 0.08
        }} className="bg-white/80 backdrop-blur-md border border-sky-100 rounded-3xl overflow-hidden shadow-lg">
            
              <div className={`bg-gradient-to-r ${section.accent} p-6 border-b border-white/20 text-center`}>
              
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-1 drop-shadow-sm">
                  {section.title}
                </h2>
                {section.notes && <p className="text-white/90 font-medium text-sm md:text-base italic">
                    {section.notes}
                  </p>}
              </div>

              <div className="p-2 sm:p-4">
                {section.tasks.map((task) => {
              const isChecked = checkedTasks[task.id] || false;
              return <label key={task.id} className={`flex items-center gap-4 p-4 cursor-pointer transition-all duration-300 rounded-2xl ${isChecked ? 'bg-sky-50/50' : 'hover:bg-sky-50/80'}`}>
                    
                      <div className="relative flex items-center justify-center shrink-0">
                        <input type="checkbox" className="peer sr-only" checked={isChecked} onChange={() => toggleTask(task.id)} />
                      
                        <div className={`w-10 h-10 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 ${isChecked ? 'bg-sky-500 border-sky-500 shadow-lg shadow-sky-500/40' : 'border-sky-400 bg-white hover:border-sky-500 hover:shadow-md hover:shadow-sky-300/30'}`}>
                        
                          <motion.div initial={false} animate={{
                      scale: isChecked ? 1 : 0,
                      opacity: isChecked ? 1 : 0
                    }} transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20
                    }}>
                          
                            <CheckIcon className="w-6 h-6 text-white stroke-[3]" />
                          </motion.div>
                        </div>
                      </div>
                      <span className={`text-lg transition-all duration-300 ${isChecked ? 'text-sky-300 line-through' : 'text-sky-900 font-semibold'}`}>
                      
                        {task.text}
                      </span>
                    </label>;
            })}

                {/* Tips Section */}
                {section.tips && section.tips.length > 0 && <div className="mt-4 mx-4 mb-2 p-5 bg-sky-50/80 border border-sky-200/50 rounded-2xl space-y-3">
                    <h4 className="font-bold text-sky-800 text-sm uppercase tracking-wider mb-2">
                      💡 Helpful Info
                    </h4>
                    {section.tips.map((tip, tipIdx) => <div key={tipIdx} className="flex items-start gap-2">
                        <span className="shrink-0 text-sm">👉</span>
                        <p className="text-sky-700 text-sm font-medium italic leading-relaxed">
                          {tip}
                        </p>
                      </div>)}
                  </div>}
              </div>
            </motion.div>)}
        </div>

        {/* Upsell CTA */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="mt-16 bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-500 rounded-[3rem] p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <SparklesIcon className="w-12 h-12 mx-auto mb-6 text-sky-100" />

          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 relative z-10">
            Want the printable version?
          </h2>
          <p className="text-sky-50 text-lg md:text-xl mb-8 max-w-2xl mx-auto relative z-10 font-medium">
            Get the beautiful printable PDF of the Ultimate Tropical Cruise
            Packing Guide to keep.
          </p>

          <a href="https://trippinwithmandy.gumroad.com/l/tbjrtz" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-sky-700 font-bold text-lg hover:bg-sky-50 transition-all shadow-xl hover:-translate-y-1 relative z-10">
            
            <DownloadIcon className="w-5 h-5" />
            Get the Guide ($3.99)
          </a>
        </motion.div>
      </div>
    </div>;
}