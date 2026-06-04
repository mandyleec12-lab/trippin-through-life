import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function FloatingParticles({ count = 30 }) {
  return <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div key={i} className="absolute rounded-full"
        style={{ width: 2 + Math.random() * 4, height: 2 + Math.random() * 4,
          background: ['rgba(236,72,153,0.3)','rgba(168,85,247,0.3)','rgba(96,165,250,0.3)','rgba(251,191,36,0.3)','rgba(255,255,255,0.5)'][i % 5],
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        animate={{ y: [0, -30 - Math.random() * 40, 0], x: [0, (Math.random() - 0.5) * 20, 0], opacity: [0.2, 0.6, 0.2], scale: [1, 1.3, 1] }}
        transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 5, ease: 'easeInOut' }} />
    ))}
  </div>;
}

export default function ChaosRealmScreen({
  showChaosTransition, currentChaosScene, chaosSceneIndex, chaosSceneCount,
  realmTotalLoss, chaosOutcome, onChoice, onContinue
}) {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-red-950 via-black to-red-950 flex flex-col overflow-hidden z-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(127,29,29,0.36),transparent_34%),linear-gradient(180deg,rgba(8,10,24,0.96)_0%,rgba(15,5,12,0.95)_45%,rgba(5,5,8,1)_100%)]" />
        <motion.div className="absolute inset-x-0 top-0 h-44 bg-slate-950/80 blur-sm" animate={{opacity:[0.7,0.95,0.72]}} transition={{duration:3.2,repeat:Infinity,ease:'easeInOut'}} />
        {[0,1,2].map((bolt) => (
          <motion.div key={`lb-${bolt}`} className="absolute top-0 h-48 w-px bg-red-100"
            style={{ left:`${24+bolt*24}%`, boxShadow:'0 0 24px rgba(248,113,113,0.95),0 0 70px rgba(239,68,68,0.6)', transform:`skewX(${bolt%2===0?-18:14}deg)` }}
            animate={{opacity:[0,0,1,0]}} transition={{duration:2.8+bolt*0.5,repeat:Infinity,delay:bolt*0.85,times:[0,0.72,0.76,0.82]}} />
        ))}
        {[0,1,2,3,4,5].map((b) => (
          <div key={`cb-${b}`} className="absolute bottom-0 rounded-t-xl border-t border-red-500/20 bg-black/70"
            style={{left:`${b*17-4}%`,width:`${14+b%2*6}%`,height:`${34+b%3*12}%`,boxShadow:'0 0 28px rgba(127,29,29,0.32)'}}>
            <div className="absolute inset-x-3 top-5 grid grid-cols-3 gap-2">
              {Array.from({length:18}).map((_,wi) => <span key={wi} className="h-1 rounded-sm" style={{background:wi%5===0?'rgba(248,113,113,0.82)':'rgba(255,255,255,0.07)'}} />)}
            </div>
            {b%2===0 && <div className="absolute left-3 top-16 rotate-[-8deg] rounded border border-red-500/40 bg-black/80 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-red-400">BROKEN</div>}
          </div>
        ))}
        {Array.from({length:34}).map((_,r) => (
          <motion.span key={`cr-${r}`} className="absolute top-[-12%] h-16 w-px rounded-full bg-sky-200/40"
            style={{left:`${r/34*100}%`}} animate={{y:['0vh','118vh'],opacity:[0,0.8,0]}}
            transition={{duration:0.9+r%5*0.08,repeat:Infinity,delay:r*0.035,ease:'linear'}} />
        ))}
      </div>
      <FloatingParticles count={40} />

      {/* Entry overlay */}
      <AnimatePresence>
        {showChaosTransition && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.5}}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black">
            <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:0.3,duration:0.8}} className="text-center">
              <motion.div animate={{y:[0,-10,0]}} transition={{repeat:Infinity,duration:2}} className="text-8xl mb-6">🔥</motion.div>
              <h1 className="text-4xl md:text-6xl font-bold text-red-600 tracking-widest uppercase" style={{textShadow:'0 0 30px rgba(220,38,38,0.8)'}}>
                Entering the<br/>Chaos Realm
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-30 flex min-h-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5">
          <div className="max-w-xs">
            <h2 className="text-4xl font-black uppercase tracking-tight text-purple-300 drop-shadow-[0_0_24px_rgba(168,85,247,0.8)] md:text-6xl"
              style={{fontFamily:'"Dancing Script", cursive'}}>Chaos Realm</h2>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-purple-200/70">Choose wisely</p>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-white/70">{currentChaosScene.leftNote}</p>
          </div>
          <div className="rounded-2xl border border-red-400/30 bg-black/55 px-4 py-3 text-right backdrop-blur-md">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-200/65">Scene {chaosSceneIndex + 1} / {chaosSceneCount}</p>
            <p className="mt-1 text-sm font-black text-red-100">Impact: {realmTotalLoss >= 0 ? '+' : '-'}${Math.abs(realmTotalLoss)}</p>
          </div>
        </div>

        {/* Scene */}
        <div className="relative flex-1 overflow-hidden px-5 pb-4">
          <div className="absolute inset-x-[18%] bottom-[24%] h-[42%] rounded-[50%] opacity-70 blur-2xl"
            style={{background:`radial-gradient(circle, ${currentChaosScene.sceneAccent}55, transparent 62%)`}} />
          <motion.div key={currentChaosScene.title} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}}
            className="absolute left-1/2 top-[14%] w-[min(640px,76vw)] -translate-x-1/2 rounded-[2rem] border border-white/12 bg-black/35 p-5 text-center shadow-[0_22px_80px_rgba(0,0,0,0.45)] backdrop-blur-md">
            <p className="text-[10px] font-black uppercase tracking-[0.32em]" style={{color:currentChaosScene.sceneAccent}}>{currentChaosScene.location}</p>
            <h3 className="mt-2 text-3xl font-black text-white md:text-5xl">{currentChaosScene.title}</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm font-semibold text-white/70">{currentChaosScene.subtitle}</p>
          </motion.div>
        </div>

        {/* Choices / Outcome */}
        <div className="relative z-40 border-t border-white/10 bg-black/60 px-4 py-4 backdrop-blur-xl">
          {!chaosOutcome ? (
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-3">
              {currentChaosScene.choices.map((choice) => (
                <motion.button key={choice.label} onClick={() => onChoice(choice)}
                  whileHover={{y:-4,scale:1.02}} whileTap={{scale:0.98}}
                  className={`rounded-2xl border p-4 text-left transition ${choice.tone==='risk'?'border-cyan-400/35 bg-cyan-950/35 hover:bg-cyan-900/45':choice.tone==='hope'?'border-purple-400/35 bg-purple-950/35 hover:bg-purple-900/45':'border-amber-300/35 bg-amber-950/30 hover:bg-amber-900/40'}`}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-black/40 text-2xl">{choice.icon}</span>
                    <div>
                      <h4 className="font-black uppercase tracking-wide text-white">{choice.label}</h4>
                      <p className="mt-1 text-xs font-semibold text-white/62">{choice.description}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/45">Choose this</p>
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}
              className="mx-auto flex max-w-4xl flex-col items-center gap-4 rounded-[1.75rem] border border-white/12 bg-black/70 p-5 text-center shadow-[0_18px_60px_rgba(0,0,0,0.5)] md:flex-row md:text-left">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-3xl">{chaosOutcome.icon}</div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-purple-200/70">Hidden consequence revealed</p>
                <h4 className="mt-1 text-2xl font-black text-white">{chaosOutcome.outcomeTitle}</h4>
                <p className="mt-1 text-sm font-semibold text-white/68">{chaosOutcome.outcomeText}</p>
                <p className={`mt-2 text-sm font-black ${chaosOutcome.moneyDelta>=0?'text-emerald-300':'text-red-300'}`}>
                  {chaosOutcome.moneyDelta>=0?'+':'-'}${Math.abs(chaosOutcome.moneyDelta)}
                  {chaosOutcome.skipNextTurn?' · next turn starts shaken':''}
                </p>
              </div>
              <button onClick={onContinue} className="rounded-full bg-white px-7 py-3 font-black text-slate-950 shadow-[0_0_24px_rgba(255,255,255,0.22)]">
                {chaosOutcome.escape ? 'Return to the Board' : 'Keep Moving'}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}