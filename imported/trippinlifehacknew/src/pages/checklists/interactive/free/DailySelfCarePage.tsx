import React from 'react';
import { FreeCleaningChecklist } from '../../../../components/FreeCleaningChecklist';
export function DailySelfCarePage() {
  const tasks = [{
    id: 'sc-7',
    text: 'Build daily routines (consistency without needing motivation supports your mental health)'
  }, {
    id: 'sc-1',
    text: 'Shower or bath (full wash OR rinse-off — both count)'
  }, {
    id: 'sc-2',
    text: 'Brush teeth (fresh mouth = fresh energy)'
  }, {
    id: 'sc-3',
    text: "Brush hair (even if you're not styling it — this is about care, not looks)"
  }, {
    id: 'sc-4',
    text: 'Moisturize your body (lotions, oils — anything that nurtures your skin)'
  }, {
    id: 'sc-5',
    text: 'Skincare routine (cleanse, moisturize, SPF — whatever YOUR skin needs)'
  }, {
    id: 'sc-6',
    text: 'Put on clean clothes (comfort counts, pajamas count — just fresh)'
  }, {
    id: 'sc-8',
    text: 'Get 6–8 hours of sleep (your mood depends on it more than you think)'
  }, {
    id: 'sc-9',
    text: 'Drink your water (yes, this is your reminder — go grab it now)'
  }, {
    id: 'sc-10',
    text: 'Move your body (walk, stretch, dance — mobility matters)'
  }, {
    id: 'sc-11',
    text: 'Take a quiet moment (breathe, pray, aromatherapy, journal, or just exist)'
  }, {
    id: 'sc-12',
    text: "Fuel your body right (eat something that isn't just convenience food)"
  }, {
    id: 'sc-13',
    text: 'Do one thing for YOU (not for your kids, job, or anyone else)'
  }, {
    id: 'sc-14',
    text: 'Speak kindly to yourself (look in the mirror and remind yourself of your worth)'
  }];
  return <FreeCleaningChecklist title="DAILY SELF-CARE" subtitle="hygiene + wellness ritual" emoji="🧖‍♀️" accent="from-pink-100 to-purple-50" headerColor="text-pink-800" storageKey="free-selfcare-daily" backgroundImage="/ChatGPT_Image_Mar_23,_2026,_02_22_11_AM.png" tasks={tasks} />;
}