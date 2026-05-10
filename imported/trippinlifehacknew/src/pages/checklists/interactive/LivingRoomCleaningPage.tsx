import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SparkleEffect } from '../../../components/SparkleEffect';
import { CheckIcon, RotateCcwIcon, DownloadIcon, SparklesIcon } from 'lucide-react';
const checklistData = [{
  id: 'before',
  title: '📋 BEFORE YOU START',
  notes: 'Prep first so you are not running around mid-clean',
  accent: 'from-rose-400 to-pink-400',
  tasks: [{
    id: 'b-1',
    text: 'Open windows for airflow'
  }, {
    id: 'b-2',
    text: 'Gather supplies: microfiber cloths, duster or extension duster'
  }, {
    id: 'b-3',
    text: 'Gather: glass cleaner, all-purpose cleaner, disinfectant'
  }, {
    id: 'b-4',
    text: 'Gather: vacuum with attachments, mop or floor cleaner if needed'
  }, {
    id: 'b-5',
    text: 'Grab a trash bag and laundry basket'
  }, {
    id: 'b-6',
    text: 'Bring in a step stool if you need to reach higher areas'
  }]
}, {
  id: 'clutter',
  title: '1. REMOVE OBVIOUS CLUTTER FIRST',
  notes: '',
  accent: 'from-fuchsia-400 to-purple-500',
  tasks: [{
    id: 'c-1',
    text: 'Throw away trash'
  }, {
    id: 'c-2',
    text: 'Pick up cups, dishes, wrappers, paper, and random junk'
  }, {
    id: 'c-3',
    text: 'Return items that belong in other rooms'
  }, {
    id: 'c-4',
    text: 'Gather shoes, bags, toys, remotes, chargers, and loose items'
  }, {
    id: 'c-5',
    text: 'Sort anything you no longer want into a donate pile'
  }, {
    id: 'c-6',
    text: 'Clear coffee table, side tables, shelves, and the floor'
  }]
}, {
  id: 'soft',
  title: '2. STRIP AND PREP SOFT ITEMS',
  notes: '',
  accent: 'from-pink-400 to-rose-400',
  tasks: [{
    id: 's-1',
    text: 'Remove throw blankets'
  }, {
    id: 's-2',
    text: 'Remove pillow covers if washable'
  }, {
    id: 's-3',
    text: 'Take down curtains if they need washing'
  }, {
    id: 's-4',
    text: 'Set washable items aside for laundry'
  }, {
    id: 's-5',
    text: 'Check care labels before washing anything'
  }]
}, {
  id: 'dust',
  title: '3. DUST TOP TO BOTTOM',
  notes: 'Start high so dust falls downward and you only clean lower areas once',
  accent: 'from-violet-400 to-fuchsia-400',
  tasks: [{
    id: 'd-1',
    text: '[High Dusting] Dust ceiling corners and remove cobwebs'
  }, {
    id: 'd-2',
    text: '[High Dusting] Dust ceiling fan blades'
  }, {
    id: 'd-3',
    text: '[High Dusting] Dust vents'
  }, {
    id: 'd-4',
    text: '[High Dusting] Dust light fixtures'
  }, {
    id: 'd-5',
    text: '[High Dusting] Dust curtain rods'
  }, {
    id: 'd-6',
    text: '[High Dusting] Dust tops of shelves, bookcases, entertainment centers, and cabinets'
  }, {
    id: 'd-7',
    text: '[Mid-Level Dusting] Dust framed photos and artwork'
  }, {
    id: 'd-8',
    text: '[Mid-Level Dusting] Dust mirrors and wall decor'
  }, {
    id: 'd-9',
    text: '[Mid-Level Dusting] Dust bookshelves and books'
  }, {
    id: 'd-10',
    text: '[Mid-Level Dusting] Dust plants and plant leaves'
  }, {
    id: 'd-11',
    text: '[Lower Dusting] Dust coffee tables and side tables'
  }, {
    id: 'd-12',
    text: '[Lower Dusting] Dust TV stand or media console'
  }, {
    id: 'd-13',
    text: '[Lower Dusting] Dust baseboards'
  }, {
    id: 'd-14',
    text: '[Lower Dusting] Dust doors and door frames'
  }]
}, {
  id: 'windows',
  title: '4. CLEAN WINDOWS AND WINDOW AREAS',
  notes: '',
  accent: 'from-sky-400 to-blue-400',
  tasks: [{
    id: 'w-1',
    text: 'Dust blinds first'
  }, {
    id: 'w-2',
    text: 'Wipe blinds if needed'
  }, {
    id: 'w-3',
    text: 'Clean window glass'
  }, {
    id: 'w-4',
    text: 'Wipe window frames'
  }, {
    id: 'w-5',
    text: 'Clean window sills and ledges'
  }, {
    id: 'w-6',
    text: 'Wipe curtain rods if dusty'
  }, {
    id: 'w-7',
    text: 'Wash or vacuum curtains if needed'
  }]
}, {
  id: 'walldecor',
  title: '5. CLEAN WALL DÉCOR AND FRAMED ITEMS',
  notes: '',
  accent: 'from-amber-400 to-orange-400',
  tasks: [{
    id: 'wd-1',
    text: 'Remove wall décor if needed for a better clean'
  }, {
    id: 'wd-2',
    text: 'Wipe frames carefully'
  }, {
    id: 'wd-3',
    text: 'Wipe glass on picture frames with a cloth, not by spraying directly on the frame'
  }, {
    id: 'wd-4',
    text: 'Rehang items once dry and dust-free'
  }]
}, {
  id: 'softsurfaces',
  title: '6. CLEAN SOFT SURFACES',
  notes: '',
  accent: 'from-pink-500 to-rose-500',
  tasks: [{
    id: 'ss-1',
    text: '[Upholstery & Fabric] Vacuum couch cushions'
  }, {
    id: 'ss-2',
    text: '[Upholstery & Fabric] Vacuum under cushions'
  }, {
    id: 'ss-3',
    text: '[Upholstery & Fabric] Vacuum chairs, loveseats, ottomans, and any upholstered pieces'
  }, {
    id: 'ss-4',
    text: '[Upholstery & Fabric] Vacuum pet beds if they are in the room'
  }, {
    id: 'ss-5',
    text: '[Rugs & Carpet] Vacuum rugs thoroughly'
  }, {
    id: 'ss-6',
    text: '[Rugs & Carpet] Vacuum carpet thoroughly'
  }, {
    id: 'ss-7',
    text: '[Rugs & Carpet] Use crevice tool along edges and corners'
  }, {
    id: 'ss-8',
    text: '[Rugs & Carpet] Spot treat visible stains'
  }, {
    id: 'ss-9',
    text: '[Rugs & Carpet] Steam clean or shampoo carpets/rugs if needed'
  }, {
    id: 'ss-10',
    text: '[Rugs & Carpet] Let carpets dry fully if deep cleaned'
  }]
}, {
  id: 'hightouch',
  title: '7. CLEAN AND SANITIZE HIGH-TOUCH SURFACES',
  notes: '',
  accent: 'from-teal-400 to-emerald-500',
  tasks: [{
    id: 'ht-1',
    text: 'Wipe light switches'
  }, {
    id: 'ht-2',
    text: 'Wipe doorknobs'
  }, {
    id: 'ht-3',
    text: 'Wipe door handles'
  }, {
    id: 'ht-4',
    text: 'Wipe remote controls'
  }, {
    id: 'ht-5',
    text: 'Wipe lamp switches'
  }, {
    id: 'ht-6',
    text: 'Wipe tabletops'
  }, {
    id: 'ht-7',
    text: 'Wipe drawer pulls and cabinet handles'
  }, {
    id: 'ht-8',
    text: 'Wipe electronics buttons and controls carefully'
  }, {
    id: 'ht-9',
    text: 'Sanitize surfaces that get touched often'
  }]
}, {
  id: 'electronics',
  title: '8. CLEAN ELECTRONICS CAREFULLY',
  notes: '',
  accent: 'from-indigo-400 to-violet-500',
  tasks: [{
    id: 'e-1',
    text: 'Dust TV screen with proper cloth'
  }, {
    id: 'e-2',
    text: 'Dust computer screens or tablets if kept in the room'
  }, {
    id: 'e-3',
    text: 'Wipe TV stand and electronics area'
  }, {
    id: 'e-4',
    text: 'Organize visible cords and wires'
  }, {
    id: 'e-5',
    text: 'Dust around game systems, speakers, and media boxes'
  }, {
    id: 'e-6',
    text: 'Check manufacturer instructions before using cleaner on screens'
  }]
}, {
  id: 'furniture',
  title: '9. CLEAN FURNITURE SURFACES',
  notes: '',
  accent: 'from-rose-400 to-fuchsia-400',
  tasks: [{
    id: 'f-1',
    text: 'Wipe coffee table'
  }, {
    id: 'f-2',
    text: 'Wipe side tables'
  }, {
    id: 'f-3',
    text: 'Wipe shelves'
  }, {
    id: 'f-4',
    text: 'Wipe entertainment center'
  }, {
    id: 'f-5',
    text: 'Clean inside drawers if doing a true deep clean'
  }]
}, {
  id: 'walls',
  title: '10. WASH WALLS, DOORS, AND BASEBOARDS',
  notes: '',
  accent: 'from-purple-400 to-pink-400',
  tasks: [{
    id: 'wa-1',
    text: 'Spot clean walls'
  }, {
    id: 'wa-2',
    text: 'Wipe wall smudges and fingerprints'
  }, {
    id: 'wa-3',
    text: 'Wipe around door frames'
  }, {
    id: 'wa-4',
    text: 'Clean doors front and back'
  }, {
    id: 'wa-5',
    text: 'Wipe baseboards thoroughly'
  }, {
    id: 'wa-6',
    text: 'Pay extra attention to corners and behind furniture'
  }]
}, {
  id: 'tidy',
  title: '11. TIDY AND RE-ORGANIZE THE ROOM',
  notes: '',
  accent: 'from-amber-400 to-rose-400',
  tasks: [{
    id: 't-1',
    text: 'Put back only what belongs in the room'
  }, {
    id: 't-2',
    text: 'Style pillows and blankets neatly'
  }, {
    id: 't-3',
    text: 'Organize books, baskets, and decor'
  }, {
    id: 't-4',
    text: 'Return remotes to one place'
  }, {
    id: 't-5',
    text: 'Straighten candles, trays, and decorative items'
  }, {
    id: 't-6',
    text: 'Remove anything that makes the room feel crowded'
  }]
}, {
  id: 'floors',
  title: '12. CLEAN THE FLOORS LAST',
  notes: '',
  accent: 'from-emerald-400 to-teal-500',
  tasks: [{
    id: 'fl-1',
    text: '[Hard Floors] Sweep'
  }, {
    id: 'fl-2',
    text: '[Hard Floors] Vacuum if needed'
  }, {
    id: 'fl-3',
    text: '[Hard Floors] Mop hard floors'
  }, {
    id: 'fl-4',
    text: '[Hard Floors] Get under furniture as much as possible'
  }, {
    id: 'fl-5',
    text: '[Carpeted Floors] Vacuum slowly and thoroughly'
  }, {
    id: 'fl-6',
    text: '[Carpeted Floors] Use attachments along edges and under furniture'
  }, {
    id: 'fl-7',
    text: '[Carpeted Floors] Deodorize if needed'
  }, {
    id: 'fl-8',
    text: '[Carpeted Floors] Steam clean if doing a major deep clean'
  }]
}, {
  id: 'final',
  title: '13. FINAL TOUCHES',
  notes: '',
  accent: 'from-pink-400 to-rose-500',
  tasks: [{
    id: 'fin-1',
    text: 'Empty trash'
  }, {
    id: 'fin-2',
    text: 'Replace trash liner if you keep a can in the room'
  }, {
    id: 'fin-3',
    text: 'Sanitize the trash can if needed'
  }, {
    id: 'fin-4',
    text: 'Return clean blankets and pillows'
  }, {
    id: 'fin-5',
    text: 'Light a candle or use a room spray'
  }, {
    id: 'fin-6',
    text: 'Do one final walkthrough'
  }, {
    id: 'fin-7',
    text: 'Check from the doorway to see what still looks messy'
  }]
}, {
  id: 'dontforget',
  title: '✨ DEEP CLEAN "DON\'T FORGET" LIST',
  notes: 'The spots most people skip',
  accent: 'from-fuchsia-500 to-purple-600',
  tasks: [{
    id: 'df-1',
    text: 'Ceiling fan blades'
  }, {
    id: 'df-2',
    text: 'Vents'
  }, {
    id: 'df-3',
    text: 'Behind and under couch cushions'
  }, {
    id: 'df-4',
    text: 'Window sills'
  }, {
    id: 'df-5',
    text: 'Remote controls'
  }, {
    id: 'df-6',
    text: 'Light switches'
  }, {
    id: 'df-7',
    text: 'Door handles'
  }, {
    id: 'df-8',
    text: 'Baseboards'
  }, {
    id: 'df-9',
    text: 'Curtains and blinds'
  }]
}];
export function LivingRoomCleaningPage() {
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('ulrc-519-progress');
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
    localStorage.setItem('ulrc-519-progress', JSON.stringify(checkedTasks));
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
    background: 'linear-gradient(135deg, #fdf0f8 0%, #f5e6ff 50%, #fce4f0 100%)'
  }}>
      
      {/* Hero Section */}
      <div className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/file_0000000072cc722f9a948e7c2f07609c.png" alt="" className="w-full h-full object-cover object-top opacity-30" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-pink-100/50 via-rose-50/60 to-[#fdf0f8]" />
        </div>

        <SparkleEffect count={150} />

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-rose-300 text-sm font-bold text-rose-600 mb-6 uppercase tracking-wider shadow-sm">
            
            <SparklesIcon className="w-4 h-4" /> The Deep Clean
          </motion.div>

          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="font-heading text-5xl md:text-7xl font-bold text-[#5a1a3a] mb-6 drop-shadow-sm uppercase tracking-tight">
            
            Ultimate Living Room <br /> Cleaning Guide
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="text-xl md:text-2xl text-rose-700 font-medium max-w-2xl mx-auto italic">
            
            Every surface, every corner, every forgotten spot ✨
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
      }} className="bg-white/90 backdrop-blur-xl border border-rose-200 rounded-3xl p-6 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 sticky top-24 z-40">
          
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm font-bold text-rose-900 mb-3">
              <span className="flex items-center gap-2">
                Your Progress {isComplete && '🎉'}
              </span>
              <span>
                {progressPercentage}% ({completedTasks}/{totalTasks})
              </span>
            </div>
            <div className="h-4 w-full bg-rose-100 rounded-full overflow-hidden shadow-inner">
              <motion.div className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400" initial={{
              width: 0
            }} animate={{
              width: `${progressPercentage}%`
            }} transition={{
              duration: 0.5,
              ease: 'easeOut'
            }} />
              
            </div>
          </div>
          <button onClick={resetProgress} className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-rose-300 text-rose-600 font-bold text-sm hover:bg-rose-50 hover:text-rose-800 transition-all shadow-sm">
            
            <RotateCcwIcon className="w-4 h-4" />
            Start Fresh
          </button>
        </motion.div>

        {/* Pro Tips */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.35
      }} className="bg-gradient-to-br from-rose-100/80 to-pink-100/80 backdrop-blur-md border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-lg mb-12">
          
          <h3 className="font-heading text-2xl font-bold text-rose-900 mb-4">
            💡 Pro Tips
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">⬆️</span>
              <p className="text-rose-900 font-semibold text-sm sm:text-base">
                Always dust TOP → DOWN so you only clean lower areas once
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">🧺</span>
              <p className="text-rose-900 font-semibold text-sm sm:text-base">
                Strip soft items (blankets, pillow covers, curtains) FIRST so
                they can wash while you clean
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">🪟</span>
              <p className="text-rose-900 font-semibold text-sm sm:text-base">
                Open windows before you start for airflow — it helps dry
                surfaces faster
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">🧹</span>
              <p className="text-rose-900 font-semibold text-sm sm:text-base">
                Floors are ALWAYS last — never vacuum or mop before you dust
              </p>
            </div>
          </div>
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
        }} className="bg-white/80 backdrop-blur-md border border-rose-100 rounded-3xl overflow-hidden shadow-lg">
            
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
              return <label key={task.id} className={`flex items-center gap-4 p-4 cursor-pointer transition-all duration-300 rounded-2xl ${isChecked ? 'bg-rose-50/50' : 'hover:bg-rose-50/80'}`}>
                    
                      <div className="relative flex items-center justify-center shrink-0">
                        <input type="checkbox" className="peer sr-only" checked={isChecked} onChange={() => toggleTask(task.id)} />
                      
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isChecked ? 'bg-rose-400 border-rose-400 shadow-md shadow-rose-400/30' : 'border-rose-300 bg-white hover:border-rose-400'}`}>
                        
                          <motion.div initial={false} animate={{
                      scale: isChecked ? 1 : 0,
                      opacity: isChecked ? 1 : 0
                    }} transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20
                    }}>
                          
                            <CheckIcon className="w-5 h-5 text-white" />
                          </motion.div>
                        </div>
                      </div>
                      <span className={`text-lg transition-all duration-300 ${isChecked ? 'text-rose-300 line-through' : 'text-rose-900 font-medium'}`}>
                      
                        {task.text}
                      </span>
                    </label>;
            })}
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
      }} className="mt-16 bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-500 rounded-[3rem] p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <SparklesIcon className="w-12 h-12 mx-auto mb-6 text-pink-200" />

          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 relative z-10">
            Want the printable version?
          </h2>
          <p className="text-pink-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto relative z-10 font-medium">
            Get the beautiful 4-page PDF to print and keep in your living room.
          </p>

          <a href="https://trippinwithmandy.gumroad.com/l/tdsgi" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-rose-600 font-bold text-lg hover:bg-rose-50 transition-all shadow-xl hover:-translate-y-1 relative z-10">
            
            <DownloadIcon className="w-5 h-5" />
            Get the Template ($3.99)
          </a>
        </motion.div>
      </div>
    </div>;
}