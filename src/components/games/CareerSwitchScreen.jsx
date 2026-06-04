import React from 'react';
import { motion } from 'framer-motion';

export default function CareerSwitchScreen({ realmEvents, lifePaths, pendingNewPath, onSelectPath, onConfirm, getJobsForPath }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
      <motion.div initial={{opacity:0,scale:0.9,y:30}} animate={{opacity:1,scale:1,y:0}}
        transition={{type:'spring',stiffness:80,damping:20}}
        className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_20px_80px_rgba(168,85,247,0.15)] border border-white/80 max-w-3xl w-full text-center overflow-y-auto max-h-[90vh]">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2"
          style={{fontFamily:'"Dancing Script", cursive'}}>Career Switch</h2>
        <p className="text-purple-400 font-bold mb-6">You're switching careers! Choose a new education lane...</p>
        <div className="space-y-3 mb-6">
          {realmEvents.map((event, idx) => (
            <motion.div key={idx} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:idx*0.1}}
              className="p-4 rounded-2xl border-2 bg-yellow-50 border-yellow-200 flex items-center gap-3 text-left">
              <span className="text-2xl">💼</span>
              <div>
                <p className="font-bold text-gray-800">{event.name}</p>
                <p className="text-sm text-red-600 font-bold">-${Math.abs(event.amount)}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {lifePaths.map((path, i) => {
            const pathJobs = getJobsForPath(i).slice(0, 3);
            return (
              <motion.button key={i} onClick={() => onSelectPath(i)} whileHover={{scale:1.05}} whileTap={{scale:0.98}}
                className={`p-4 rounded-2xl border-2 ${pendingNewPath === i ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-transparent' : 'bg-white/80 border-gray-200'} text-center`}>
                <span className="text-2xl block mb-2">{path.emoji}</span>
                <p className="font-bold text-lg">{path.name}</p>
                <p className="text-xs text-gray-500 mt-1">{pathJobs.map(j => `${j.emoji} ${j.name}`).join(' · ')}</p>
              </motion.button>
            );
          })}
        </div>
        <motion.button onClick={onConfirm} disabled={pendingNewPath === null} whileHover={{scale:1.05}} whileTap={{scale:0.98}}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-lg shadow-lg disabled:opacity-50">
          Confirm Switch
        </motion.button>
      </motion.div>
    </div>
  );
}