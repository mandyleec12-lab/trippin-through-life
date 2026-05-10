import React, { useMemo, useId } from 'react';
interface GlitterHeartProps {
  size?: number;
  className?: string;
  variant?: 'default' | 'light';
}
const COLORS = {
  default: {
    gradient: ['#E84B9F', '#D63384', '#E84B9F', '#F472B6', '#D63384'],
    glitter: ['#fff', '#FFD1E3', '#FFB3D1', '#FF8CB8', '#F472B6', '#fff', '#FFE8F1', '#fff'],
    stroke: '#E84B9F'
  },
  light: {
    gradient: ['#FFD1E3', '#FFB3D1', '#FFC0CB', '#FFE8F1', '#FFD1E3'],
    glitter: ['#fff', '#fff', '#FFE8F1', '#fff', '#FFD1E3', '#fff', '#fff', '#FFF5F9'],
    stroke: '#FFB3D1'
  }
};
export function GlitterHeart({
  size = 20,
  className = '',
  variant = 'default'
}: GlitterHeartProps) {
  const palette = COLORS[variant];
  const reactId = useId();
  const uid = reactId.replace(/:/g, '');
  const glitterDots = useMemo(() => {
    // Cap at 80 dots max to avoid performance issues on large hearts
    const count = Math.min(Math.max(Math.floor(size * 2.5), 20), 80);
    return Array.from({
      length: count
    }).map((_, i) => ({
      id: i,
      cx: Math.random() * 100,
      cy: Math.random() * 100,
      r: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 3,
      duration: Math.random() * 1.5 + 0.8,
      color: palette.glitter[Math.floor(Math.random() * palette.glitter.length)]
    }));
  }, [size, variant]);
  return <svg width={size} height={size} viewBox="0 0 100 100" className={`shrink-0 ${className}`} aria-hidden="true">
      
      <defs>
        <clipPath id={`hc-${uid}`}>
          <path d="M50 88 C25 65, 0 50, 0 30 C0 13, 13 0, 28 0 C38 0, 46 6, 50 14 C54 6, 62 0, 72 0 C87 0, 100 13, 100 30 C100 50, 75 65, 50 88Z" />
        </clipPath>
        <linearGradient id={`hg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.gradient[0]} />
          <stop offset="30%" stopColor={palette.gradient[1]} />
          <stop offset="50%" stopColor={palette.gradient[2]} />
          <stop offset="70%" stopColor={palette.gradient[3]} />
          <stop offset="100%" stopColor={palette.gradient[4]} />
        </linearGradient>
      </defs>

      <g clipPath={`url(#hc-${uid})`}>
        <rect width="100" height="100" fill={`url(#hg-${uid})`} />

        {glitterDots.map((dot) => <circle key={dot.id} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.color} opacity="0">
          
            <animate attributeName="opacity" values="0;0.9;1;0.8;0" dur={`${dot.duration}s`} begin={`${dot.delay}s`} repeatCount="indefinite" />
          
            <animate attributeName="r" values={`${dot.r * 0.5};${dot.r};${dot.r * 1.3};${dot.r};${dot.r * 0.5}`} dur={`${dot.duration}s`} begin={`${dot.delay}s`} repeatCount="indefinite" />
          
          </circle>)}

        {glitterDots.filter((_, i) => i % 4 === 0).map((dot) => <circle key={`flash-${dot.id}`} cx={dot.cx} cy={dot.cy} r={dot.r * 0.8} fill="#fff" opacity="0">
          
              <animate attributeName="opacity" values="0;0;1;0;0" dur={`${dot.duration * 1.2}s`} begin={`${dot.delay + 0.3}s`} repeatCount="indefinite" />
          
            </circle>)}
      </g>

      <path d="M50 88 C25 65, 0 50, 0 30 C0 13, 13 0, 28 0 C38 0, 46 6, 50 14 C54 6, 62 0, 72 0 C87 0, 100 13, 100 30 C100 50, 75 65, 50 88Z" fill="none" stroke={palette.stroke} strokeWidth="1" opacity="0.5" />
      
    </svg>;
}