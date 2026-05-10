import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SparkleEffect } from '../../../components/SparkleEffect';
import { CheckIcon, RotateCcwIcon, DownloadIcon, SparklesIcon } from 'lucide-react';
const checklistData = [{
  id: 'documents',
  title: '📄 Documents & Boarding',
  notes: '',
  accent: 'from-slate-500 to-indigo-600',
  tasks: [{
    id: 'd-1',
    text: 'Required boarding documents'
  }, {
    id: 'd-2',
    text: 'Cruise boarding pass printed + screenshot on phone'
  }, {
    id: 'd-3',
    text: 'Reservation printout'
  }, {
    id: 'd-4',
    text: "Driver's license / IDs"
  }, {
    id: 'd-5',
    text: 'Credit/debit cards + small amount of cash'
  }, {
    id: 'd-6',
    text: 'Travel insurance info'
  }, {
    id: 'd-7',
    text: 'Luggage tags printed & attached'
  }, {
    id: 'd-8',
    text: 'Excursion confirmations'
  }, {
    id: 'd-9',
    text: 'Emergency contact info'
  }],
  tips: ['Passport may be required depending on your cruise route.', "Some closed-loop cruises leaving from and returning to the same U.S. port may allow a birth certificate + driver's license, but always check your specific cruise line and itinerary.", 'If your name has changed, bring your marriage license or legal name-change document.', 'For children, bring required ID/birth certificate/passport documents based on the cruise line rules.', 'Bring small bills to tip porters, usually around $5 per bag.']
}, {
  id: 'clothing',
  title: '👗 Clothing',
  notes: '',
  accent: 'from-indigo-500 to-violet-600',
  tasks: [{
    id: 'c-1',
    text: 'Travel outfit to port'
  }, {
    id: 'c-2',
    text: '2-3 casual ship outfits'
  }, {
    id: 'c-3',
    text: '1-2 elegant dinner outfits ✨'
  }, {
    id: 'c-4',
    text: 'Casual dinner outfits'
  }, {
    id: 'c-5',
    text: 'Pajamas / lounge clothes'
  }, {
    id: 'c-6',
    text: 'Undergarments'
  }, {
    id: 'c-7',
    text: 'Moisture-wicking underwear'
  }, {
    id: 'c-8',
    text: 'Warm socks'
  }, {
    id: 'c-9',
    text: 'Wool or synthetic hiking socks'
  }, {
    id: 'c-10',
    text: 'Swimsuits'
  }, {
    id: 'c-11',
    text: 'Light cardigan or wrap'
  }, {
    id: 'c-12',
    text: 'Workout clothes'
  }, {
    id: 'c-13',
    text: 'Outfit for travel home'
  }],
  tips: ['Yes, still bring swimsuits. Cruise ships usually have heated pools, hot tubs, and spa areas.']
}, {
  id: 'layering',
  title: '🧊 Layering Essentials',
  notes: '',
  accent: 'from-cyan-600 to-blue-600',
  tasks: [{
    id: 'l-1',
    text: 'Base layer tops'
  }, {
    id: 'l-2',
    text: 'Base layer bottoms'
  }, {
    id: 'l-3',
    text: 'Fleece pullover or warm hoodie'
  }, {
    id: 'l-4',
    text: 'Lightweight puffer jacket'
  }, {
    id: 'l-5',
    text: 'Waterproof rain jacket with hood'
  }, {
    id: 'l-6',
    text: 'Waterproof rain pants'
  }, {
    id: 'l-7',
    text: 'Quick-dry pants or hiking pants'
  }, {
    id: 'l-8',
    text: 'Warm beanie / hat'
  }, {
    id: 'l-9',
    text: 'Lightweight gloves'
  }, {
    id: 'l-10',
    text: 'Scarf neck gaiter or buff'
  }, {
    id: 'l-11',
    text: 'Warm sleep socks'
  }],
  tips: ['Choose moisture-wicking fabric like merino wool or synthetic material for base layers. Avoid cotton because it holds moisture and can make you colder.', 'The waterproof rain jacket with hood is one of the most important items for a cold climate cruise.']
}, {
  id: 'shoes',
  title: '👟 Shoes',
  notes: '',
  accent: 'from-slate-600 to-slate-800',
  tasks: [{
    id: 's-1',
    text: 'Waterproof hiking boots'
  }, {
    id: 's-2',
    text: 'Comfortable walking shoes for the ship'
  }, {
    id: 's-3',
    text: 'Dress shoes for dinner'
  }, {
    id: 's-4',
    text: 'Flip flops or sandals for pool/spa/shower'
  }, {
    id: 's-5',
    text: 'Extra shoe bags or plastic bags for dirty shoes'
  }],
  tips: ["Break in hiking boots before the cruise so you don't get blisters on excursions."]
}, {
  id: 'toiletries',
  title: '💄 Toiletries & Beauty',
  notes: '',
  accent: 'from-violet-500 to-purple-600',
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
    text: 'Body wash'
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
    text: 'Heavy moisturizer'
  }, {
    id: 't-10',
    text: 'Lip balm'
  }, {
    id: 't-11',
    text: 'Sunscreen'
  }, {
    id: 't-12',
    text: 'Makeup'
  }, {
    id: 't-13',
    text: 'Makeup remover'
  }, {
    id: 't-14',
    text: 'Skincare products'
  }, {
    id: 't-15',
    text: 'Hairbrush'
  }, {
    id: 't-16',
    text: 'Hair products'
  }, {
    id: 't-17',
    text: 'Hair accessories'
  }, {
    id: 't-18',
    text: 'Cotton swabs'
  }, {
    id: 't-19',
    text: 'Nail clippers/file'
  }],
  tips: ['Cold weather does not mean you can skip sunscreen. Water and glacier glare can still burn your skin.']
}, {
  id: 'health',
  title: '💊 Health & Essentials',
  notes: '',
  accent: 'from-blue-500 to-indigo-600',
  tasks: [{
    id: 'h-1',
    text: 'Daily medications'
  }, {
    id: 'h-2',
    text: 'Motion sickness meds'
  }, {
    id: 'h-3',
    text: 'Pain reliever'
  }, {
    id: 'h-4',
    text: 'Heartburn meds'
  }, {
    id: 'h-5',
    text: 'Allergy meds'
  }, {
    id: 'h-6',
    text: 'Cold medicine'
  }, {
    id: 'h-7',
    text: 'Bandaids'
  }, {
    id: 'h-8',
    text: 'Blister pads / moleskin'
  }, {
    id: 'h-9',
    text: 'Mini first aid kit'
  }, {
    id: 'h-10',
    text: 'Hand sanitizer'
  }, {
    id: 'h-11',
    text: 'Disinfecting wipes'
  }, {
    id: 'h-12',
    text: 'Prescription medication info'
  }],
  tips: ['Cruise medical centers are very expensive, so bring the basics you might need.']
}, {
  id: 'electronics',
  title: '📱 Electronics',
  notes: '',
  accent: 'from-purple-500 to-fuchsia-600',
  tasks: [{
    id: 'e-1',
    text: 'Phone'
  }, {
    id: 'e-2',
    text: 'Chargers'
  }, {
    id: 'e-3',
    text: 'Portable charger'
  }, {
    id: 'e-4',
    text: 'Extra power bank'
  }, {
    id: 'e-5',
    text: 'Headphones'
  }, {
    id: 'e-6',
    text: 'Action camera'
  }, {
    id: 'e-7',
    text: 'Action camera accessories'
  }, {
    id: 'e-8',
    text: 'Extra batteries'
  }, {
    id: 'e-9',
    text: 'Camera mounts'
  }, {
    id: 'e-10',
    text: 'Waterproof camera case'
  }, {
    id: 'e-11',
    text: 'Extra SD cards / storage'
  }, {
    id: 'e-12',
    text: "Tablet / kids' devices"
  }, {
    id: 'e-13',
    text: 'Charging block / multi USB hub'
  }, {
    id: 'e-14',
    text: 'Tripod / selfie stick'
  }, {
    id: 'e-15',
    text: 'Lights / mic / filming gear if needed'
  }],
  tips: ['Cold weather can drain batteries faster.', 'Download shows, music, maps, and important apps before boarding.', 'Put your phone on airplane mode once you board to avoid roaming charges.', 'Cruise internet is usually a paid package and may not work perfectly in remote areas.']
}, {
  id: 'musthaves',
  title: '🏔️ Cold Climate Cruise Must-Haves',
  notes: '',
  accent: 'from-cyan-500 to-blue-600',
  tasks: [{
    id: 'm-1',
    text: 'Waterproof phone case'
  }, {
    id: 'm-2',
    text: 'Waterproof daypack or backpack rain cover'
  }, {
    id: 'm-3',
    text: 'Dry bag for electronics'
  }, {
    id: 'm-4',
    text: 'Reusable water bottle'
  }, {
    id: 'm-5',
    text: 'Binoculars'
  }, {
    id: 'm-6',
    text: 'Sunglasses'
  }, {
    id: 'm-7',
    text: 'Bug spray'
  }, {
    id: 'm-8',
    text: 'Small backpack for excursions'
  }, {
    id: 'm-9',
    text: 'Ziplock bags'
  }, {
    id: 'm-10',
    text: 'Travel-size laundry detergent'
  }, {
    id: 'm-11',
    text: 'Towel clips'
  }, {
    id: 'm-12',
    text: 'Lanyard for cruise card'
  }, {
    id: 'm-13',
    text: 'Magnetic hooks'
  }, {
    id: 'm-14',
    text: 'Packing cubes'
  }],
  tips: ['Binoculars are great for whales, wildlife, glaciers, and scenery.', 'Glacier glare can be intense — bring good sunglasses.', 'Bug spray is especially important for Alaska cruises in warmer months.']
}, {
  id: 'extras',
  title: '🌧️ Extras / Comfort Items',
  notes: '',
  accent: 'from-slate-400 to-slate-600',
  tasks: [{
    id: 'ex-1',
    text: 'Book / Kindle'
  }, {
    id: 'ex-2',
    text: 'Snacks'
  }, {
    id: 'ex-3',
    text: 'Gum / mints'
  }, {
    id: 'ex-4',
    text: 'Wrinkle-release spray'
  }, {
    id: 'ex-5',
    text: 'Nightlight'
  }, {
    id: 'ex-6',
    text: 'Door decorations'
  }, {
    id: 'ex-7',
    text: 'Hand warmers'
  }, {
    id: 'ex-8',
    text: 'Small blanket scarf or cozy wrap'
  }, {
    id: 'ex-9',
    text: 'Travel tissues'
  }],
  tips: []
}, {
  id: 'excursions',
  title: '🚢 Excursion Planning',
  notes: '',
  accent: 'from-indigo-400 to-blue-500',
  tasks: [{
    id: 'ep-1',
    text: 'Plan outfits around excursions'
  }, {
    id: 'ep-2',
    text: 'Check if excursions provide gear'
  }, {
    id: 'ep-3',
    text: 'Pack rain gear for whale watching kayaking glaciers and outdoor tours'
  }, {
    id: 'ep-4',
    text: 'Bring layers even if the day starts warm'
  }, {
    id: 'ep-5',
    text: 'Keep gloves hat sunglasses and rain jacket in your daypack'
  }, {
    id: 'ep-6',
    text: 'Bring snacks and water for long excursions'
  }, {
    id: 'ep-7',
    text: 'Charge all electronics the night before'
  }, {
    id: 'ep-8',
    text: 'Pack dry bag before water-based excursions'
  }],
  tips: []
}, {
  id: 'notes',
  title: '🚬 Personal Notes',
  notes: '',
  accent: 'from-violet-400 to-purple-500',
  tasks: [{
    id: 'n-1',
    text: 'Extra vapes if needed'
  }, {
    id: 'n-2',
    text: 'Check drink package rules'
  }, {
    id: 'n-3',
    text: 'Check soda/wine limits'
  }, {
    id: 'n-4',
    text: 'Comfortable shoes are a must'
  }, {
    id: 'n-5',
    text: 'Elegant dinners + lounge outfits'
  }, {
    id: 'n-6',
    text: 'Keep one warm outfit easy to reach on embarkation day'
  }, {
    id: 'n-7',
    text: 'Keep documents medication chargers and valuables in your carry-on'
  }],
  tips: ['Vapes may not be sold onboard.']
}];
export function ColdClimateCruisePackingPage() {
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('ccpl-451-progress');
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
    localStorage.setItem('ccpl-451-progress', JSON.stringify(checkedTasks));
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
    background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f5f3ff 100%)'
  }}>
      
      {/* Hero Section */}
      <div className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/file_00000000fc04720cad1e457ffc644a20.png" alt="" className="w-full h-full object-cover object-top opacity-40" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-slate-100/40 via-indigo-50/50 to-[#f8fafc]" />
        </div>

        <SparkleEffect count={150} />

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-indigo-300 text-sm font-bold text-indigo-700 mb-6 uppercase tracking-wider shadow-sm">
            
            <SparklesIcon className="w-4 h-4" /> Alaska • Norway • Iceland •
            Glacier Cruises • Cool Weather Sailings
          </motion.div>

          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="font-heading text-5xl md:text-7xl font-bold text-indigo-900 mb-6 drop-shadow-sm uppercase tracking-tight">
            
            Ultimate Cold Climate <br /> Cruise Packing Checklist
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="text-xl md:text-2xl text-indigo-700 font-medium max-w-2xl mx-auto italic">
            
            If you are heading somewhere cold, icy, or remote — this is your
            ultimate packing guide. Layer smart, stay warm, and enjoy every
            moment. ❄️
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
      }} className="bg-white/90 backdrop-blur-xl border border-indigo-200 rounded-3xl p-6 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 sticky top-24 z-40">
          
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm font-bold text-indigo-900 mb-3">
              <span className="flex items-center gap-2">
                Your Progress {isComplete && '🎉'}
              </span>
              <span>
                {progressPercentage}% ({completedTasks}/{totalTasks})
              </span>
            </div>
            <div className="h-4 w-full bg-indigo-100 rounded-full overflow-hidden shadow-inner">
              <motion.div className="h-full bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400" initial={{
              width: 0
            }} animate={{
              width: `${progressPercentage}%`
            }} transition={{
              duration: 0.5,
              ease: 'easeOut'
            }} />
              
            </div>
          </div>
          <button onClick={resetProgress} className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-indigo-300 text-indigo-700 font-bold text-sm hover:bg-indigo-50 hover:text-indigo-900 transition-all shadow-sm">
            
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
        }} className="bg-white/80 backdrop-blur-md border border-indigo-100 rounded-3xl overflow-hidden shadow-lg">
            
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
              return <label key={task.id} className={`flex items-center gap-4 p-4 cursor-pointer transition-all duration-300 rounded-2xl ${isChecked ? 'bg-indigo-50/50' : 'hover:bg-indigo-50/80'}`}>
                    
                      <div className="relative flex items-center justify-center shrink-0">
                        <input type="checkbox" className="peer sr-only" checked={isChecked} onChange={() => toggleTask(task.id)} />
                      
                        <div className={`w-10 h-10 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 ${isChecked ? 'bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-500/40' : 'border-indigo-400 bg-white hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-300/30'}`}>
                        
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
                      <span className={`text-lg transition-all duration-300 ${isChecked ? 'text-indigo-300 line-through' : 'text-indigo-900 font-semibold'}`}>
                      
                        {task.text}
                      </span>
                    </label>;
            })}

                {/* Tips Section */}
                {section.tips && section.tips.length > 0 && <div className="mt-4 mx-4 mb-2 p-5 bg-indigo-50/80 border border-indigo-200/50 rounded-2xl space-y-3">
                    <h4 className="font-bold text-indigo-800 text-sm uppercase tracking-wider mb-2">
                      💡 Helpful Info
                    </h4>
                    {section.tips.map((tip, tipIdx) => <div key={tipIdx} className="flex items-start gap-2">
                        <span className="shrink-0 text-sm">👉</span>
                        <p className="text-indigo-700 text-sm font-medium italic leading-relaxed">
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
      }} className="mt-16 bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-600 rounded-[3rem] p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <SparklesIcon className="w-12 h-12 mx-auto mb-6 text-indigo-100" />

          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 relative z-10">
            Want the printable version?
          </h2>
          <p className="text-indigo-50 text-lg md:text-xl mb-8 max-w-2xl mx-auto relative z-10 font-medium">
            Get the beautiful printable PDF of the Ultimate Cold Climate Cruise
            Packing Guide to keep.
          </p>

          <a href="https://trippinwithmandy.gumroad.com/l/pkujp" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-indigo-700 font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl hover:-translate-y-1 relative z-10">
            
            <DownloadIcon className="w-5 h-5" />
            Get the Guide ($3.99)
          </a>
        </motion.div>
      </div>
    </div>;
}