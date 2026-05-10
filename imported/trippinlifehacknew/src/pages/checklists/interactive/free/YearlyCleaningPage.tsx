import React from 'react';
import { FreeCleaningChecklist } from '../../../../components/FreeCleaningChecklist';
export function YearlyCleaningPage() {
  const tasks = [{
    id: 'y-1',
    text: 'Deep declutter entire home'
  }, {
    id: 'y-2',
    text: 'Clean walls'
  }, {
    id: 'y-3',
    text: 'Deep clean garage / storage'
  }, {
    id: 'y-4',
    text: 'Check + replace filters (AC, etc.)'
  }, {
    id: 'y-5',
    text: 'Organize important documents'
  }, {
    id: 'y-6',
    text: 'Donate unused items'
  }];
  return <FreeCleaningChecklist title="YEARLY RESET" subtitle="full life refresh energy" emoji="🏡" accent="from-indigo-100 to-violet-50" headerColor="text-indigo-800" storageKey="free-cleaning-yearly" backgroundImage="/ChatGPT_Image_Mar_22,_2026,_10_01_35_PM.png" tasks={tasks} />;
}