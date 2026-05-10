import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCapIcon, BookOpenIcon, ZapIcon } from 'lucide-react';
interface Player {
  id: string;
  name: string;
  color: string;
  pathIndex: number | null;
  avatar?: string | null;
}
interface JourneyStartSceneProps {
  players: Player[];
  onStartPlaying: () => void;
}
const DAY_CITY_IMAGE = "/ChatGPT_Image_May_5,_2026,_12_21_41_PM.png";
const PATH_COLORS = [{
  stroke: '#8b5cf6',
  fill: '#a78bfa',
  name: 'College',
  emoji: '🎓',
  icon: GraduationCapIcon
}, {
  stroke: '#ec4899',
  fill: '#f472b6',
  name: 'HS / GED',
  emoji: '📚',
  icon: BookOpenIcon
}, {
  stroke: '#f59e0b',
  fill: '#fbbf24',
  name: 'Dropout',
  emoji: '⚡',
  icon: ZapIcon
}];
export function JourneyStartScene({
  players,
  onStartPlaying
}: JourneyStartSceneProps) {
  // Group players by their dealt education path
  const playersByPath: Record<number, Player[]> = {
    0: [],
    1: [],
    2: []
  };
  players.forEach((p) => {
    const idx = p.pathIndex !== null && p.pathIndex !== undefined ? Math.max(0, Math.min(PATH_COLORS.length - 1, p.pathIndex)) : 0;
    playersByPath[idx].push(p);
  });
  return <div className="fixed inset-0 w-full h-full z-30 overflow-hidden bg-black">
      {/* DAY CITY BACKDROP — full bleed realistic 3D scene */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url('${DAY_CITY_IMAGE}')`
    }} />
      

      {/* Soft top gradient so the title is readable */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/40 via-black/10 to-transparent pointer-events-none" />

      {/* Top title */}
      <div className="absolute top-0 left-0 right-0 flex flex-col items-center pt-6 pb-4 pointer-events-none z-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.65)] text-center">
            The Board Is Set
          </h1>
        </div>
        <p className="text-xs md:text-sm text-white font-bold tracking-widest uppercase bg-black/40 px-6 py-1.5 rounded-full backdrop-blur-sm text-center">
          Your starting hand is dealt. Your choices shape what happens next.
        </p>
      </div>

      {/* Player pawns floating along the bottom of the road */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-6 md:gap-12 pointer-events-none z-10 px-4">
        {PATH_COLORS.map((_, pathIdx) => {
        const pathPlayers = playersByPath[pathIdx];
        const pathColor = PATH_COLORS[pathIdx];
        const Icon = pathColor.icon;
        if (pathPlayers.length === 0) return null;
        return <div key={pathIdx} className="flex flex-col items-center gap-1.5">
              <div className="flex gap-1.5 flex-wrap justify-center max-w-[140px]">
                {pathPlayers.map((p, idx) => <motion.div key={p.id} initial={{
              y: -20,
              opacity: 0
            }} animate={{
              y: [0, -8, 0],
              opacity: 1
            }} transition={{
              y: {
                duration: 1.8,
                repeat: Infinity,
                delay: idx * 0.2
              },
              opacity: {
                duration: 0.4,
                delay: idx * 0.1
              }
            }} className="flex flex-col items-center">
                  
                    <div className="rounded-full border-[3px] border-white shadow-2xl overflow-hidden flex items-center justify-center" style={{
                width: 44,
                height: 44,
                background: pathColor.fill,
                boxShadow: `0 0 24px ${pathColor.stroke}, 0 6px 12px rgba(0,0,0,0.5)`
              }}>
                    
                      {p.avatar ? <img src={p.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-white font-bold text-base">
                          {p.name.charAt(0).toUpperCase()}
                        </span>}
                    </div>
                    <div className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-white whitespace-nowrap shadow-lg" style={{
                background: pathColor.stroke
              }}>
                    
                      {p.name}
                    </div>
                  </motion.div>)}
              </div>
              {/* Path label */}
              <div className="px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-lg flex items-center gap-1.5" style={{
            background: pathColor.stroke,
            boxShadow: `0 0 16px ${pathColor.stroke}80`
          }}>
                
                <Icon className="w-3 h-3" />
                {pathColor.name}
              </div>
            </div>;
      })}
      </div>

      {/* Roll Dice CTA */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
        <motion.button onClick={onStartPlaying} whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.97
      }} className="group flex items-center gap-4 bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-md p-2 pr-8 rounded-full border-2 border-white shadow-[0_0_40px_rgba(236,72,153,0.8)] hover:shadow-[0_0_60px_rgba(236,72,153,1)] transition-all">
          
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
            <motion.span className="text-4xl" animate={{
            rotate: [0, 360]
          }} transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear'
          }}>
              
              🎲
            </motion.span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-white font-bold text-lg uppercase tracking-wider">
              Start first turn
            </span>
            <span className="text-pink-100 text-sm">
              zoom in and roll
            </span>
          </div>
        </motion.button>
      </div>
    </div>;
}