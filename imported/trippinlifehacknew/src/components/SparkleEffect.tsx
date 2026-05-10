import React, { useMemo } from 'react';
interface SparkleEffectProps {
  count?: number;
  className?: string;
}
export function SparkleEffect({
  count = 120,
  className = ''
}: SparkleEffectProps) {
  const particles = useMemo(() => {
    return Array.from({
      length: count
    }).map((_, i) => {
      const size = Math.random() * 3.5 + 0.5;
      const isHeart = Math.random() > 0.88;
      const isBright = Math.random() > 0.7;
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${Math.random() * 2.5 + 1}s`,
        size,
        isHeart,
        isBright,
        color: ['#F472B6', '#E84B9F', '#FFB3D1', '#FF8CB8', '#fff', '#FFD1E3', '#DBC8F5', '#D63384', '#FFC0CB', '#FF69B4'][Math.floor(Math.random() * 10)]
      };
    });
  }, [count]);
  return <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      
      {particles.map((p) => p.isHeart ? <div key={p.id} className="absolute opacity-0" style={{
      left: p.left,
      top: p.top,
      animationName: 'sparkle',
      animationDelay: p.animationDelay,
      animationDuration: p.animationDuration,
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
      color: p.color,
      fontSize: `${p.size * 3 + 4}px`,
      filter: `drop-shadow(0 0 3px ${p.color}) drop-shadow(0 0 6px ${p.color}80)`
    }} aria-hidden="true">
        
            ♥
          </div> : <div key={p.id} className="absolute rounded-full opacity-0" style={{
      left: p.left,
      top: p.top,
      width: `${p.size}px`,
      height: `${p.size}px`,
      backgroundColor: p.color,
      animationName: 'sparkle',
      animationDelay: p.animationDelay,
      animationDuration: p.animationDuration,
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
      boxShadow: p.isBright ? `0 0 ${p.size * 3}px ${p.color}, 0 0 ${p.size * 6}px ${p.color}70, 0 0 ${p.size * 10}px ${p.color}30` : `0 0 ${p.size * 2}px ${p.color}, 0 0 ${p.size * 4}px ${p.color}50`
    }} aria-hidden="true" />)}
    </div>;
}