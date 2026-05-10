import React from 'react';
import { FreeCleaningChecklist } from '../../../../components/FreeCleaningChecklist';
export function WeeklyCleaningPage() {
  const subsections = [{
    title: 'Kitchen',
    tasks: [{
      id: 'w-k-1',
      text: 'Wipe down appliances (microwave, stove, fridge exterior)'
    }, {
      id: 'w-k-2',
      text: 'Clean inside microwave'
    }, {
      id: 'w-k-3',
      text: 'Sanitize sink'
    }, {
      id: 'w-k-4',
      text: 'Wipe cabinet fronts'
    }, {
      id: 'w-k-5',
      text: 'Sweep + mop floors'
    }]
  }, {
    title: 'Bathroom(s)',
    tasks: [{
      id: 'w-b-1',
      text: 'Clean toilet'
    }, {
      id: 'w-b-2',
      text: 'Clean sink + counter'
    }, {
      id: 'w-b-3',
      text: 'Clean mirrors'
    }, {
      id: 'w-b-4',
      text: 'Wipe down shower/tub'
    }, {
      id: 'w-b-5',
      text: 'Replace towels'
    }, {
      id: 'w-b-6',
      text: 'Empty trash'
    }]
  }, {
    title: 'Bedrooms',
    tasks: [{
      id: 'w-bd-1',
      text: 'Change sheets'
    }, {
      id: 'w-bd-2',
      text: 'Dust surfaces'
    }, {
      id: 'w-bd-3',
      text: 'Vacuum / sweep'
    }, {
      id: 'w-bd-4',
      text: 'Declutter surfaces'
    }]
  }, {
    title: 'Living Areas',
    tasks: [{
      id: 'w-l-1',
      text: 'Dust furniture'
    }, {
      id: 'w-l-2',
      text: 'Vacuum / sweep'
    }, {
      id: 'w-l-3',
      text: 'Wipe tables + surfaces'
    }, {
      id: 'w-l-4',
      text: 'Fluff pillows / straighten space'
    }]
  }];
  return <FreeCleaningChecklist title="WEEKLY CLEAN" subtitle='your "keep the house together" reset' emoji="🔁" accent="from-blue-100 to-sky-50" headerColor="text-blue-800" storageKey="free-cleaning-weekly" backgroundImage="/ChatGPT_Image_Mar_22,_2026,_10_01_35_PM.png" subsections={subsections} />;
}