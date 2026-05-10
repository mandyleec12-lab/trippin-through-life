import React from 'react';
import { FreeCleaningChecklist } from '../../../../components/FreeCleaningChecklist';
export function QuarterlyCleaningPage() {
  const tasks = [{
    id: 'q-1',
    text: 'Deep clean closets'
  }, {
    id: 'q-2',
    text: 'Rotate / declutter clothes'
  }, {
    id: 'q-3',
    text: 'Wash comforters'
  }, {
    id: 'q-4',
    text: 'Clean mattress (vacuum + freshen)'
  }, {
    id: 'q-5',
    text: 'Declutter junk drawers'
  }, {
    id: 'q-6',
    text: 'Clean under beds'
  }];
  return <FreeCleaningChecklist title="EVERY 3 MONTHS" subtitle="QUARTERLY RESET" emoji="🔄" accent="from-amber-100 to-orange-50" headerColor="text-amber-800" storageKey="free-cleaning-quarterly" backgroundImage="/ChatGPT_Image_Mar_22,_2026,_10_01_35_PM.png" tasks={tasks} />;
}