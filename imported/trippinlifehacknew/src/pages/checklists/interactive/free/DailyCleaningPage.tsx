import React from 'react';
import { FreeCleaningChecklist } from '../../../../components/FreeCleaningChecklist';
export function DailyCleaningPage() {
  const tasks = [{
    id: 'd-1',
    text: 'Make beds'
  }, {
    id: 'd-2',
    text: 'Wipe kitchen counters'
  }, {
    id: 'd-3',
    text: 'Do dishes / load dishwasher'
  }, {
    id: 'd-4',
    text: 'Quick bathroom wipe (sink + toilet if needed)'
  }, {
    id: 'd-5',
    text: 'Pick up clutter (10–15 min reset)'
  }, {
    id: 'd-6',
    text: 'Take out trash (if full)'
  }];
  return <FreeCleaningChecklist title="DAILY RESET" subtitle="quick + realistic" emoji="🌿" accent="from-emerald-100 to-teal-50" headerColor="text-emerald-800" storageKey="free-cleaning-daily" backgroundImage="/ChatGPT_Image_Mar_22,_2026,_10_03_10_PM.png" tasks={tasks} />;
}