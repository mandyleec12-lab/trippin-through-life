import React from 'react';
import { FreeCleaningChecklist } from '../../../../components/FreeCleaningChecklist';
export function KitchenCleaningPage() {
  const subsections = [{
    title: '🧼 PREP (START HERE)',
    tasks: [{
      id: 'prep-1',
      text: 'Open windows for airflow'
    }, {
      id: 'prep-2',
      text: 'Gather all cleaning supplies'
    }]
  }, {
    title: '💡 LIGHTING + AIR',
    tasks: [{
      id: 'light-1',
      text: 'Dust and wipe light fixtures'
    }, {
      id: 'light-2',
      text: 'Clean bulbs (when cool)'
    }, {
      id: 'light-3',
      text: 'Clean under hanging lights (especially over island/table)'
    }, {
      id: 'light-4',
      text: 'Clean ceiling fan (if applicable)'
    }, {
      id: 'light-5',
      text: 'Dust air vents / returns'
    }, {
      id: 'light-6',
      text: 'Wipe smoke detector'
    }]
  }, {
    title: '🧺 CABINETS + DRAWERS',
    tasks: [{
      id: 'cab-1',
      text: 'Empty cabinets and drawers'
    }, {
      id: 'cab-2',
      text: 'Toss broken/unneeded items'
    }, {
      id: 'cab-3',
      text: 'Replace old shelf liners (if needed)'
    }, {
      id: 'cab-4',
      text: 'Wipe inside cabinets and drawers'
    }, {
      id: 'cab-5',
      text: 'Organize pots, pans, and utensils'
    }, {
      id: 'cab-6',
      text: 'Wipe cabinet fronts, doors, and handles'
    }, {
      id: 'cab-7',
      text: 'Clean hinges and high-touch areas'
    }]
  }, {
    title: '🧱 WALLS + BACKSPLASH',
    tasks: [{
      id: 'wall-1',
      text: 'Wipe backsplash (grease splatter zone)'
    }, {
      id: 'wall-2',
      text: 'Spot clean walls (especially near stove + trash)'
    }, {
      id: 'wall-3',
      text: 'Clean light switch plates'
    }]
  }, {
    title: '🔥 STOVE + COOKING AREA',
    tasks: [{
      id: 'stove-1',
      text: 'Remove and clean burner grates + drip pans'
    }, {
      id: 'stove-2',
      text: 'Clean stovetop surface + underneath removable parts'
    }, {
      id: 'stove-3',
      text: 'Clean control knobs'
    }, {
      id: 'stove-4',
      text: 'Clean oven (inside, racks, and door glass)'
    }, {
      id: 'stove-5',
      text: 'Soak racks before scrubbing (pro tip)'
    }, {
      id: 'stove-6',
      text: 'Clean hood vent / range filter'
    }]
  }, {
    title: '☕ COUNTERS + SMALL APPLIANCES',
    tasks: [{
      id: 'counter-1',
      text: 'Clear EVERYTHING off counters'
    }, {
      id: 'counter-2',
      text: 'Clean underneath all items'
    }, {
      id: 'counter-3',
      text: 'Wipe and disinfect countertops (edges + front lip too)'
    }, {
      id: 'counter-4',
      text: 'Clean coffee maker (run cleaning cycle)'
    }, {
      id: 'counter-5',
      text: 'Clean microwave (inside ceiling + outside)'
    }, {
      id: 'counter-6',
      text: 'Steam microwave before wiping (water + vinegar/lemon)'
    }, {
      id: 'counter-7',
      text: 'Clean toaster / air fryer / blender (crumbs + exterior)'
    }]
  }, {
    title: '🧊 FRIDGE + FREEZER',
    tasks: [{
      id: 'fridge-1',
      text: 'Remove all food (work shelf by shelf)'
    }, {
      id: 'fridge-2',
      text: 'Toss expired or questionable items'
    }, {
      id: 'fridge-3',
      text: 'Remove and wash shelves + drawers'
    }, {
      id: 'fridge-4',
      text: "Wipe interior (don't forget door bins)"
    }, {
      id: 'fridge-5',
      text: 'Dry everything before putting food back'
    }, {
      id: 'fridge-6',
      text: 'Wipe containers before returning them'
    }, {
      id: 'fridge-7',
      text: 'Clean freezer (shelves, drawers, old ice)'
    }, {
      id: 'fridge-8',
      text: 'Add deodorizer (baking soda)'
    }, {
      id: 'fridge-9',
      text: 'Wipe rubber door seals'
    }, {
      id: 'fridge-10',
      text: 'Clean drip tray (if accessible)'
    }, {
      id: 'fridge-11',
      text: 'Dust fridge coils (back or bottom)'
    }]
  }, {
    title: '💧 SINK + WATER AREA',
    tasks: [{
      id: 'sink-1',
      text: 'Scrub sink basin (deep clean)'
    }, {
      id: 'sink-2',
      text: 'Clean faucet + handles (especially base)'
    }, {
      id: 'sink-3',
      text: 'Clean around drain'
    }, {
      id: 'sink-4',
      text: 'Clean sink sprayer / nozzle (vinegar soak)'
    }, {
      id: 'sink-5',
      text: 'Clean sink mats / racks'
    }, {
      id: 'sink-6',
      text: 'Run disposal with ice + lemon to freshen'
    }, {
      id: 'sink-7',
      text: 'Wipe under-sink cabinet (check for leaks + buildup)'
    }]
  }, {
    title: '🍽️ DISHWASHER',
    tasks: [{
      id: 'dish-1',
      text: 'Clean filter (most missed step)'
    }, {
      id: 'dish-2',
      text: 'Clean spray arms + drain trap'
    }, {
      id: 'dish-3',
      text: 'Wipe inside edges + door'
    }, {
      id: 'dish-4',
      text: 'Run cleaning cycle'
    }]
  }, {
    title: '🥫 PANTRY + FOOD STORAGE',
    tasks: [{
      id: 'pantry-1',
      text: 'Remove all items'
    }, {
      id: 'pantry-2',
      text: 'Toss expired food'
    }, {
      id: 'pantry-3',
      text: 'Wipe shelves, doors, and handles'
    }, {
      id: 'pantry-4',
      text: 'Vacuum pantry floor'
    }, {
      id: 'pantry-5',
      text: 'Organize (bins, baskets, containers)'
    }]
  }, {
    title: '🗑️ TRASH AREA',
    tasks: [{
      id: 'trash-1',
      text: 'Empty trash'
    }, {
      id: 'trash-2',
      text: 'Wash inside of trash can'
    }, {
      id: 'trash-3',
      text: 'Wipe outside + lid'
    }, {
      id: 'trash-4',
      text: 'Clean floor around trash area'
    }]
  }, {
    title: '🧊 WATER + ICE SYSTEM',
    tasks: [{
      id: 'water-1',
      text: 'Replace or check water filter'
    }, {
      id: 'water-2',
      text: 'Wipe water dispenser area'
    }, {
      id: 'water-3',
      text: 'Empty and wipe ice bin'
    }, {
      id: 'water-4',
      text: 'Break up or discard old ice'
    }]
  }, {
    title: '🧼 FLOORS + LOWER AREAS (LAST STEP)',
    tasks: [{
      id: 'floor-1',
      text: 'Sweep thoroughly (corners + edges)'
    }, {
      id: 'floor-2',
      text: 'Mop floors (focus on sticky areas)'
    }, {
      id: 'floor-3',
      text: 'Clean baseboards'
    }, {
      id: 'floor-4',
      text: 'Clean cabinet toe kicks (bottom lip)'
    }, {
      id: 'floor-5',
      text: 'Scrub floor edges where cabinets meet floor'
    }, {
      id: 'floor-6',
      text: 'Check corners under cabinets'
    }]
  }, {
    title: '🚪 BEHIND + UNDER APPLIANCES',
    tasks: [{
      id: 'behind-1',
      text: 'Move fridge + clean behind/under'
    }, {
      id: 'behind-2',
      text: 'Move stove + clean behind/under'
    }, {
      id: 'behind-3',
      text: 'Clean curtains (remove odors)'
    }, {
      id: 'behind-4',
      text: 'Dust blinds'
    }, {
      id: 'behind-5',
      text: 'Clean inside microwave, toaster oven, etc.'
    }, {
      id: 'behind-6',
      text: 'Clean range hood filter'
    }, {
      id: 'behind-7',
      text: 'Descale coffee maker / kettle'
    }]
  }, {
    title: '💅 FINAL TOUCHES (THIS IS YOUR BRAND MAGIC)',
    tasks: [{
      id: 'final-1',
      text: 'Dry sink for a polished finish'
    }, {
      id: 'final-2',
      text: 'Dry fridge interior'
    }, {
      id: 'final-3',
      text: 'Wipe any streaks or residue'
    }, {
      id: 'final-4',
      text: 'Reset counters neatly'
    }]
  }];
  const tips = [{
    emoji: '⏳',
    text: 'Let cleaners sit 2–5 minutes before wiping (breaks down grease)'
  }, {
    emoji: '⬇️',
    text: 'Clean from TOP → DOWN — Start high → work your way down → floors LAST'
  }, {
    emoji: '🧪',
    text: 'Baking soda + vinegar OR cleaner is a great alternative to most cleaners'
  }];
  return <FreeCleaningChecklist title="ULTIMATE KITCHEN CLEANING" subtitle="The deep clean your kitchen deserves ✨" emoji="✨" accent="from-teal-100 to-emerald-50" headerColor="text-teal-800" storageKey="free-kitchen-ultimate" backgroundImage="/file_000000006ef071fdb52ec95af7ad142f.png" subsections={subsections} tips={tips} />;
}