import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated city background
 * Switches between normal (vibrant) and Chaos Realm (dark, scary)
 */
export default function CityScene({ inChaosRealm = false }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky gradient */}
      <motion.div
        className="absolute inset-0 transition-colors duration-1000"
        animate={{
          background: inChaosRealm
            ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)'
            : 'linear-gradient(180deg, #87ceeb 0%, #e0f6ff 50%, #fff9e6 100%)',
        }}
      />

      {/* Animated clouds / fog */}
      {inChaosRealm ? (
        // Chaos Realm: dark fog and ominous clouds
        <>
          <motion.div
            className="absolute top-0 left-0 right-0 h-1/3 opacity-40"
            animate={{
              backgroundPosition: ['0% 0%', '100% 0%'],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              background: 'repeating-linear-gradient(90deg, transparent, transparent 10%, rgba(75,0,130,0.3) 10%, rgba(75,0,130,0.3) 20%)',
            }}
          />
          <motion.div
            className="absolute top-1/4 left-0 right-0 h-1/3 opacity-30"
            animate={{
              backgroundPosition: ['-100% 0%', '0% 0%'],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            style={{
              background: 'repeating-linear-gradient(90deg, rgba(220,20,60,0.2) 0%, rgba(220,20,60,0.2) 15%, transparent 15%, transparent 30%)',
            }}
          />
        </>
      ) : (
        // Normal: bright happy clouds
        <>
          <motion.div
            className="absolute top-10 left-10 w-32 h-16 rounded-full bg-white opacity-70"
            animate={{
              x: [0, 20, -10, 0],
              y: [0, 10, -5, 0],
            }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-20 right-20 w-40 h-20 rounded-full bg-white opacity-60"
            animate={{
              x: [0, -30, 10, 0],
              y: [0, -15, 5, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, delay: 2 }}
          />
          <motion.div
            className="absolute top-32 left-1/3 w-36 h-12 rounded-full bg-white opacity-50"
            animate={{
              x: [0, 25, -15, 0],
              y: [0, 8, -3, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, delay: 4 }}
          />
        </>
      )}

      {/* Buildings / Skyline */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/3 transition-opacity duration-1000"
        animate={{
          opacity: inChaosRealm ? 0.6 : 1,
        }}
      >
        {inChaosRealm ? (
          // Chaos: Dark, broken, ominous buildings
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent">
            {/* Flickering broken neon signs */}
            <motion.div
              className="absolute bottom-1/3 left-1/4 w-20 h-12 bg-red-600 rounded opacity-40"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/3 w-24 h-8 bg-purple-600 rounded opacity-30"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
            {/* Broken architecture shapes */}
            <div className="absolute bottom-0 left-0 right-0 h-full opacity-20">
              <div className="absolute bottom-0 left-10 w-32 h-40 bg-gray-700 skew-x-6" />
              <div className="absolute bottom-0 left-1/3 w-40 h-48 bg-gray-600 -skew-x-3" />
              <div className="absolute bottom-0 right-20 w-36 h-36 bg-gray-700" style={{ clipPath: 'polygon(0 0, 100% 20%, 100% 100%, 0 100%)' }} />
            </div>
          </div>
        ) : (
          // Normal: Vibrant, happy city skyline
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-100 via-orange-100 to-transparent">
            {/* Happy buildings with animated lights */}
            <motion.div className="absolute bottom-0 left-0 right-0 h-full opacity-40">
              <div className="absolute bottom-0 left-5 w-24 h-40 bg-gradient-to-b from-blue-400 to-blue-500 rounded-t-2xl" />
              <div className="absolute bottom-0 left-1/3 w-32 h-48 bg-gradient-to-b from-purple-400 to-purple-500 rounded-t-3xl" />
              <div className="absolute bottom-0 right-10 w-28 h-36 bg-gradient-to-b from-pink-400 to-pink-500 rounded-t-lg" />
            </motion.div>
            {/* Animated lights in windows */}
            <motion.div
              className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-yellow-300 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-yellow-300 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
            />
          </div>
        )}
      </motion.div>

      {/* Rain / Particles (only in Chaos Realm) */}
      {inChaosRealm && (
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-8 bg-gradient-to-b from-cyan-300 to-transparent"
              initial={{
                x: Math.random() * 100 + '%',
                y: -50,
              }}
              animate={{
                y: '100vh',
              }}
              transition={{
                duration: 1.5 + Math.random() * 1,
                repeat: Infinity,
                delay: Math.random() * 1,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}