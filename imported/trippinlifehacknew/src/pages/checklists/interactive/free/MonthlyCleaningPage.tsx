import React from 'react';
import { FreeCleaningChecklist } from '../../../../components/FreeCleaningChecklist';
export function MonthlyCleaningPage() {
  const tasks = [{
    id: 'm-1',
    text: 'Clean inside fridge'
  }, {
    id: 'm-2',
    text: 'Clean inside oven'
  }, {
    id: 'm-3',
    text: 'Wipe baseboards'
  }, {
    id: 'm-4',
    text: 'Dust vents'
  }, {
    id: 'm-5',
    text: 'Clean windows (inside)'
  }, {
    id: 'm-6',
    text: 'Clean doors + handles'
  }, {
    id: 'm-7',
    text: 'Vacuum under furniture'
  }, {
    id: 'm-8',
    text: 'Organize pantry / cabinets'
  }];
  return <FreeCleaningChecklist title="MONTHLY DEEP CLEAN" subtitle="the stuff people start ignoring 👀" emoji="📅" accent="from-purple-100 to-fuchsia-50" headerColor="text-purple-800" storageKey="free-cleaning-monthly" backgroundImage="/ChatGPT_Image_Mar_22,_2026,_10_03_10_PM.png" tasks={tasks} />;
}