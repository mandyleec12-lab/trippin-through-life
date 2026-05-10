import React from 'react';
import { FreeCleaningChecklist } from '../../../../components/FreeCleaningChecklist';
export function BiannualCleaningPage() {
  const tasks = [{
    id: 'b-1',
    text: 'Wash pillows'
  }, {
    id: 'b-2',
    text: 'Clean washing machine'
  }, {
    id: 'b-3',
    text: 'Clean dishwasher'
  }, {
    id: 'b-4',
    text: 'Clean behind appliances'
  }, {
    id: 'b-5',
    text: 'Deep clean fridge + freezer'
  }, {
    id: 'b-6',
    text: 'Clean ceiling fans'
  }, {
    id: 'b-7',
    text: 'Wash curtains'
  }, {
    id: 'b-8',
    text: 'Shampoo carpets / deep clean rugs'
  }];
  return <FreeCleaningChecklist title="EVERY 6 MONTHS" subtitle='THE "people forget this" list 🔥' emoji="🧠" accent="from-rose-100 to-pink-50" headerColor="text-rose-800" storageKey="free-cleaning-biannual" backgroundImage="/ChatGPT_Image_Mar_22,_2026,_10_03_10_PM.png" tasks={tasks} />;
}