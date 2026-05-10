import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SparkleEffect } from '../../../../components/SparkleEffect';
import { CheckIcon, RotateCcwIcon, ArrowLeftIcon } from 'lucide-react';
const STORAGE_KEY = 'free-travel-home-prep-progress';
const sections = [{
  title: '🧺 Quick Home Reset',
  tasks: [{
    id: 'hp-1',
    text: 'Clear kitchen counters'
  }, {
    id: 'hp-2',
    text: 'Wipe kitchen sink and surfaces'
  }, {
    id: 'hp-3',
    text: 'Empty trash cans'
  }, {
    id: 'hp-4',
    text: 'Take out trash, recycling, and compost'
  }, {
    id: 'hp-5',
    text: 'Do a quick living room reset'
  }, {
    id: 'hp-6',
    text: 'Clear the entryway'
  }, {
    id: 'hp-7',
    text: 'Pick up shoes, bags, and clutter near the door'
  }, {
    id: 'hp-8',
    text: 'Put away anything that could smell while you’re gone'
  }, {
    id: 'hp-9',
    text: 'Do a quick bathroom wipe-down'
  }, {
    id: 'hp-10',
    text: 'Clean toilets and bathroom sinks'
  }, {
    id: 'hp-11',
    text: 'Sweep or vacuum high-traffic areas'
  }],
  tip: 'You do not need a perfect house before a trip. The goal is to come home to calm, not chaos.'
}, {
  title: '🛏️ Bedrooms & Laundry',
  tasks: [{
    id: 'hp-12',
    text: 'Wash clothes needed for the trip'
  }, {
    id: 'hp-13',
    text: 'Check the washer for forgotten wet clothes'
  }, {
    id: 'hp-14',
    text: 'Dry and fold laundry'
  }, {
    id: 'hp-15',
    text: 'Wash towels and dishcloths'
  }, {
    id: 'hp-16',
    text: 'Put fresh sheets on beds if possible'
  }, {
    id: 'hp-17',
    text: 'Put clean pajamas out for kids'
  }, {
    id: 'hp-18',
    text: 'Leave fresh towels ready for when you return'
  }, {
    id: 'hp-19',
    text: 'Empty laundry hampers if possible'
  }, {
    id: 'hp-20',
    text: 'Check for damp towels, swimsuits, bathrobes, or sports gear'
  }],
  tip: 'Damp laundry can smell awful after a few days. Do one final laundry check before leaving.'
}, {
  title: '🍽️ Kitchen & Fridge Prep',
  tasks: [{
    id: 'hp-21',
    text: 'Toss expired food'
  }, {
    id: 'hp-22',
    text: 'Eat, toss, or freeze leftovers'
  }, {
    id: 'hp-23',
    text: 'Check fridge for anything that may spoil'
  }, {
    id: 'hp-24',
    text: 'Check pantry for old potatoes, onions, garlic, or fruit'
  }, {
    id: 'hp-25',
    text: 'Freeze bread, bagels, sauces, berries, or leftovers if needed'
  }, {
    id: 'hp-26',
    text: 'Leave an easy meal or snack for when you get home'
  }, {
    id: 'hp-27',
    text: 'Wipe down fridge shelves if something spilled'
  }, {
    id: 'hp-28',
    text: 'Run dishwasher or wash dishes'
  }, {
    id: 'hp-29',
    text: 'Don’t leave dirty dishes in the sink'
  }, {
    id: 'hp-30',
    text: 'Put baking soda in fridge if needed'
  }],
  tip: 'Coming home tired is easier when the kitchen is clean and there is something simple to eat.'
}, {
  title: '🐾 Pets & Plants',
  tasks: [{
    id: 'hp-31',
    text: 'Arrange pet sitter or boarding'
  }, {
    id: 'hp-32',
    text: 'Leave pet food, water, meds, and instructions'
  }, {
    id: 'hp-33',
    text: 'Clean litter boxes, cages, or pet areas'
  }, {
    id: 'hp-34',
    text: 'Make sure pets cannot access anything dangerous'
  }, {
    id: 'hp-35',
    text: 'Water houseplants'
  }, {
    id: 'hp-36',
    text: 'Water garden plants'
  }, {
    id: 'hp-37',
    text: 'Leave plant-care instructions if someone is helping'
  }]
}, {
  title: '🔐 Safety & Security',
  tasks: [{
    id: 'hp-38',
    text: 'Lock all doors'
  }, {
    id: 'hp-39',
    text: 'Close and lock all windows'
  }, {
    id: 'hp-40',
    text: 'Check garage door'
  }, {
    id: 'hp-41',
    text: 'Lock shed, gates, and outdoor storage'
  }, {
    id: 'hp-42',
    text: 'Put away ladders, tools, and outdoor items'
  }, {
    id: 'hp-43',
    text: 'Set alarm system'
  }, {
    id: 'hp-44',
    text: 'Tell alarm company you will be away if needed'
  }, {
    id: 'hp-45',
    text: 'Give trusted neighbor/friend your travel dates'
  }, {
    id: 'hp-46',
    text: 'Leave a house key with someone you trust if needed'
  }, {
    id: 'hp-47',
    text: 'Ask someone to collect mail/packages if gone longer'
  }, {
    id: 'hp-48',
    text: 'Stop mail or newspaper delivery if needed'
  }, {
    id: 'hp-49',
    text: 'Set lights on timers if available'
  }, {
    id: 'hp-50',
    text: 'Close blinds/curtains naturally'
  }],
  tip: 'Do not make the house look empty. Keep it secure, but normal-looking.'
}, {
  title: '💧 Water, Power & Temperature',
  tasks: [{
    id: 'hp-51',
    text: 'Turn off main water supply if leaving for a long trip'
  }, {
    id: 'hp-52',
    text: 'At minimum, turn off washer water valves'
  }, {
    id: 'hp-53',
    text: 'Check sump pump if you have one'
  }, {
    id: 'hp-54',
    text: 'Set thermostat appropriately'
  }, {
    id: 'hp-55',
    text: 'Do not fully turn off heat in winter'
  }, {
    id: 'hp-56',
    text: 'Set heat high enough to prevent frozen pipes'
  }, {
    id: 'hp-57',
    text: 'Set A/C high enough to save energy but keep air moving'
  }, {
    id: 'hp-58',
    text: 'Set water heater to vacation mode if available'
  }, {
    id: 'hp-59',
    text: 'Unplug toaster, coffee maker, and small appliances'
  }, {
    id: 'hp-60',
    text: 'Unplug electronics or turn off surge protectors'
  }]
}, {
  title: '📄 Travel Documents & Money',
  tasks: [{
    id: 'hp-61',
    text: 'Check passport / ID'
  }, {
    id: 'hp-62',
    text: 'Confirm boarding passes'
  }, {
    id: 'hp-63',
    text: 'Confirm travel dates and itinerary'
  }, {
    id: 'hp-64',
    text: 'Print important travel documents'
  }, {
    id: 'hp-65',
    text: 'Screenshot important travel documents'
  }, {
    id: 'hp-66',
    text: 'Take photos of passport, ID, and credit cards'
  }, {
    id: 'hp-67',
    text: 'Check travel requirements for destination'
  }, {
    id: 'hp-68',
    text: 'Review travel insurance info'
  }, {
    id: 'hp-69',
    text: 'Bring small cash for tips'
  }, {
    id: 'hp-70',
    text: 'Notify bank/credit card company if needed'
  }, {
    id: 'hp-71',
    text: 'Put documents in one safe, easy-to-grab place'
  }]
}, {
  title: '💊 Last-Minute Essentials',
  tasks: [{
    id: 'hp-72',
    text: 'Check prescriptions'
  }, {
    id: 'hp-73',
    text: 'Pack enough medication plus extra'
  }, {
    id: 'hp-74',
    text: 'Charge all electronics'
  }, {
    id: 'hp-75',
    text: 'Pack chargers'
  }, {
    id: 'hp-76',
    text: 'Download maps, apps, music, shows, and tickets'
  }, {
    id: 'hp-77',
    text: 'Schedule ride to airport/port if needed'
  }, {
    id: 'hp-78',
    text: 'Check in for flight if flying'
  }, {
    id: 'hp-79',
    text: 'Weigh luggage'
  }, {
    id: 'hp-80',
    text: 'Check luggage tags'
  }, {
    id: 'hp-81',
    text: 'Check all suitcase pockets'
  }, {
    id: 'hp-82',
    text: 'Photograph luggage contents'
  }, {
    id: 'hp-83',
    text: 'Make sure carry-on fits size rules'
  }]
}, {
  title: '🚪 Final Walkthrough Before Leaving',
  tasks: [{
    id: 'hp-84',
    text: 'Trash is out'
  }, {
    id: 'hp-85',
    text: 'Dishes are done'
  }, {
    id: 'hp-86',
    text: 'Washer and dryer are empty'
  }, {
    id: 'hp-87',
    text: 'Fridge is checked'
  }, {
    id: 'hp-88',
    text: 'Doors and windows are locked'
  }, {
    id: 'hp-89',
    text: 'Thermostat is set'
  }, {
    id: 'hp-90',
    text: 'Small appliances are unplugged'
  }, {
    id: 'hp-91',
    text: 'Pets/plants are handled'
  }, {
    id: 'hp-92',
    text: 'Lights/security are set'
  }, {
    id: 'hp-93',
    text: 'Documents, meds, chargers, and valuables are with you'
  }]
}, {
  title: '💖 Coming Home Peacefully',
  tasks: [{
    id: 'hp-94',
    text: 'Leave clean towels out'
  }, {
    id: 'hp-95',
    text: 'Leave beds made'
  }, {
    id: 'hp-96',
    text: 'Leave entryway clear'
  }, {
    id: 'hp-97',
    text: 'Leave easy food available'
  }, {
    id: 'hp-98',
    text: 'Leave one cozy space clean'
  }, {
    id: 'hp-99',
    text: 'Take a deep breath — you are ready'
  }],
  tip: 'The goal is simple: leave with less stress and come home to a house that feels peaceful, safe, and ready for you.'
}];
export function PreTripHomePrepPage() {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const totalTasks = sections.reduce((acc, section) => acc + section.tasks.length, 0);
  const progress = totalTasks === 0 ? 0 : Math.round(completedTasks.length / totalTasks * 100);
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCompletedTasks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved progress');
      }
    }
    setIsLoaded(true);
  }, []);
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedTasks));
    }
  }, [completedTasks, isLoaded]);
  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]);
  };
  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setCompletedTasks([]);
    }
  };
  if (!isLoaded) return null;
  return <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/50 to-sage-50 pt-24 pb-32 relative">
      <SparkleEffect count={40} />

      {/* Sticky Progress Bar */}
      <div className="fixed top-[68px] sm:top-[76px] left-0 w-full bg-white/80 backdrop-blur-md border-b border-emerald-100 z-40 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold text-emerald-800 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
              <motion.div initial={{
              width: 0
            }} animate={{
              width: `${progress}%`
            }} className="h-full bg-emerald-500 rounded-full" />
              
            </div>
          </div>
          <button onClick={resetProgress} className="shrink-0 p-2 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors" title="Reset Progress">
            
            <RotateCcwIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-8 relative z-10">
        <Link to="/checklists/travel" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-bold mb-8 transition-colors">
          
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Travel Lists
        </Link>

        {/* Hero Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-xl border border-emerald-100 mb-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-6 uppercase tracking-wider">
            FREE INTERACTIVE CHECKLIST
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-emerald-900 mb-4 leading-tight">
            🏡 Pre-Trip Home Prep
          </h1>
          <p className="text-lg text-emerald-700 font-medium max-w-xl mx-auto">
            What To Do Before You Leave So You Come Back To A Peaceful, Clean
            Home
          </p>
        </div>

        {/* Checklist Sections */}
        <div className="space-y-8">
          {sections.map((section, sIdx) => <div key={sIdx} className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-md border border-emerald-100">
                <h2 className="font-heading text-2xl font-bold text-emerald-900 mb-6 pb-4 border-b border-emerald-100">
                  {section.title}
                </h2>

                <div className="space-y-3">
                  {section.tasks.map((task) => {
                const isChecked = completedTasks.includes(task.id);
                return <motion.button key={task.id} onClick={() => toggleTask(task.id)} whileTap={{
                  scale: 0.98
                }} className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all text-left group ${isChecked ? 'bg-emerald-50/50 opacity-60' : 'bg-white hover:bg-emerald-50/30'}`}>
                      
                        <div className={`shrink-0 w-10 h-10 rounded-xl border-[3px] flex items-center justify-center transition-colors ${isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-emerald-200 text-transparent group-hover:border-emerald-300'}`}>
                        
                          <CheckIcon className="w-6 h-6 stroke-[3]" />
                        </div>
                        <span className={`text-lg font-medium pt-1.5 transition-all ${isChecked ? 'text-emerald-400 line-through' : 'text-emerald-800'}`}>
                        
                          {task.text}
                        </span>
                      </motion.button>;
              })}
                </div>
              </div>

              {/* Tip Callout */}
              {section.tip && <motion.div initial={{
            opacity: 0,
            y: 10
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="bg-emerald-50/80 border border-emerald-200/50 rounded-2xl p-6 shadow-sm mx-4 md:mx-8 relative overflow-hidden">
              
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400" />
                  <div className="flex gap-4 items-start">
                    <div className="text-2xl shrink-0">👉</div>
                    <p className="text-emerald-800 font-medium leading-relaxed">
                      {section.tip}
                    </p>
                  </div>
                </motion.div>}
            </div>)}
        </div>

        {/* Completion Message */}
        <AnimatePresence>
          {progress === 100 && <motion.div initial={{
          opacity: 0,
          scale: 0.9,
          y: 20
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} className="mt-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-8 text-center text-white shadow-xl relative overflow-hidden">
            
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
              <div className="relative z-10">
                <div className="text-5xl mb-4">🏡✨</div>
                <h3 className="font-heading text-3xl font-bold mb-2">
                  You're Ready to Go!
                </h3>
                <p className="text-emerald-50 font-medium">
                  Your home is prepped and waiting for your peaceful return.
                  Have an amazing trip!
                </p>
              </div>
            </motion.div>}
        </AnimatePresence>
      </div>
    </div>;
}