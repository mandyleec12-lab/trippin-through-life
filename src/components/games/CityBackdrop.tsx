import React from 'react';
import { motion } from 'framer-motion';
export type CityMood = 'neon' | 'luxury' | 'rain' | 'beach' | 'rooftop';
const MOOD_GRADIENTS: Record<CityMood, string> = {
  neon: 'linear-gradient(180deg, rgba(48,16,89,0.62) 0%, rgba(9,23,60,0.42) 52%, rgba(6,8,20,0.72) 100%)',
  luxury: 'linear-gradient(180deg, rgba(20,14,55,0.56) 0%, rgba(66,28,94,0.46) 55%, rgba(10,8,28,0.72) 100%)',
  rain: 'linear-gradient(180deg, rgba(12,28,56,0.75) 0%, rgba(10,20,40,0.62) 54%, rgba(4,10,20,0.82) 100%)',
  beach: 'linear-gradient(180deg, rgba(21,30,70,0.5) 0%, rgba(19,95,123,0.35) 48%, rgba(10,10,25,0.65) 100%)',
  rooftop: 'linear-gradient(180deg, rgba(66,20,80,0.58) 0%, rgba(24,26,82,0.4) 50%, rgba(8,6,20,0.74) 100%)'
};
const ACCENT_COLORS: Record<CityMood, string> = {
  neon: '#f472b6',
  luxury: '#fde68a',
  rain: '#38bdf8',
  beach: '#2dd4bf',
  rooftop: '#a78bfa'
};
const DEFAULT_DISTRICT: Record<CityMood, string> = {
  neon: 'Neon Downtown District',
  luxury: 'Velvet Skyline District',
  rain: 'Rainfall Boulevard',
  beach: 'Sunset Pier District',
  rooftop: 'Rooftop Lounge District'
};
interface CityBackdropProps {
  imageUrl: string;
  districtName?: string;
  mood?: CityMood;
  /** Optional legacy variant — maps to mood for backwards compatibility */
  variant?: 'normal' | 'chaos';
}
export function CityBackdrop({
  imageUrl,
  districtName,
  mood,
  variant
}: CityBackdropProps) {
  // Map legacy variant prop to mood
  const resolvedMood: CityMood = mood ?? (variant === 'chaos' ? 'rain' : 'neon');
  const accent = ACCENT_COLORS[resolvedMood];
  const label = districtName ?? DEFAULT_DISTRICT[resolvedMood];
  return <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base photo with soft fade-out at the bottom */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out" style={{
      backgroundImage: `url('${imageUrl}')`,
      maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
      filter: resolvedMood === 'rain' ? 'brightness(0.55) saturate(1.1) hue-rotate(-10deg)' : 'brightness(1) saturate(1)'
    }} />
      

      {/* Mood gradient wash */}
      <div className="absolute inset-0 transition-all duration-1000" style={{
      background: MOOD_GRADIENTS[resolvedMood]
    }} />
      

      {/* Soft top-right glow */}
      <motion.div className="absolute inset-0" animate={{
      opacity: [0.25, 0.45, 0.25]
    }} transition={{
      duration: 4.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }} style={{
      background: 'radial-gradient(circle at 70% 24%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 48%)'
    }} />
      

      {/* Subtle city depth silhouettes */}
      {Array.from({
      length: 8
    }).map((_, index) => {
      const width = 8 + index % 3 * 4;
      const height = 26 + index % 4 * 10;
      const left = 4 + index * 12;
      return <div key={`tower-${index}`} className="absolute bottom-0 rounded-t-xl border-t border-white/10" style={{
        left: `${left}%`,
        width: `${width}%`,
        height: `${height}%`,
        background: 'linear-gradient(180deg, rgba(16,20,38,0.3), rgba(8,10,20,0.82))'
      }} />;
    })}

      {/* Animated neon billboards (kept sparse for readability) */}
      {Array.from({
      length: 4
    }).map((_, index) => <motion.div key={`billboard-${index}`} className="absolute rounded-xl backdrop-blur-[1px]" style={{
      top: `${18 + index * 14}%`,
      left: `${index % 2 === 0 ? 7 : 76}%`,
      width: `${58 + index % 2 * 14}px`,
      height: `${22 + index % 2 * 6}px`,
      background: `${accent}${index % 2 === 0 ? '66' : '44'}`,
      boxShadow: `0 0 22px ${accent}`
    }} animate={{
      opacity: [0.15, 0.8, 0.2],
      scale: [0.95, 1.05, 0.98]
    }} transition={{
      duration: 2 + index % 5 * 0.65,
      delay: index * 0.2,
      repeat: Infinity,
      ease: 'easeInOut'
    }} />)}

      {/* Traffic streaks along the bottom */}
      {Array.from({
      length: 4
    }).map((_, index) => <motion.div key={`traffic-${index}`} className="absolute h-[2px] rounded-full" style={{
      bottom: `${10 + index % 3 * 5}%`,
      left: '-30%',
      width: `${110 + index * 24}px`,
      background: index % 2 === 0 ? '#fef08a' : '#93c5fd',
      boxShadow: index % 2 === 0 ? '0 0 18px rgba(250,204,21,0.9)' : '0 0 18px rgba(125,211,252,0.9)'
    }} animate={{
      x: ['0%', '150%'],
      opacity: [0, 0.9, 0]
    }} transition={{
      duration: 4 + index * 0.9,
      delay: index * 0.35,
      repeat: Infinity,
      ease: 'easeInOut'
    }} />)}

      {/* Subtle parallax breathing */}
      <motion.div className="absolute inset-0" animate={{
      x: ['-4%', '4%', '-4%']
    }} transition={{
      duration: 14,
      repeat: Infinity,
      ease: 'easeInOut'
    }} style={{
      background: 'radial-gradient(ellipse at 50% 90%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 70%)'
    }} />
      

      {/* Rain particles — only when mood is rain */}
      {resolvedMood === 'rain' && Array.from({
      length: 32
    }).map((_, index) => <motion.div key={`rain-${index}`} className="absolute w-[1.5px] rounded-full bg-sky-200/70" style={{
      left: `${index / 32 * 100}%`,
      top: '-8%',
      height: `${20 + index % 4 * 8}px`
    }} animate={{
      y: ['0%', '125%'],
      opacity: [0, 0.8, 0]
    }} transition={{
      duration: 1.2 + index % 5 * 0.12,
      delay: index * 0.05,
      repeat: Infinity,
      ease: 'linear'
    }} />)}

      {/* District label badge */}
      <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
        {label}
      </div>
    </div>;
}