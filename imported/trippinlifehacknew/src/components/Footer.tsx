import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { InstagramIcon, MailIcon, FacebookIcon, YoutubeIcon, LockIcon, EyeIcon, EyeOffIcon, XIcon, Gamepad2Icon } from 'lucide-react';
import { GlitterHeart } from './GlitterHeart';
const GAME_PASSWORD = 'Perditashits@2080';
const GAME_PATH = '/games/ttl-483';
function GameLockModal({
  open,
  onClose



}: {open: boolean;onClose: () => void;}) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === GAME_PASSWORD) {
      sessionStorage.setItem('twm-game-auth', 'true');
      setError(false);
      setPassword('');
      onClose();
      navigate(GAME_PATH);
    } else {
      setError(true);
      setPassword('');
    }
  };
  return <AnimatePresence>
      {open && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
        
          <motion.div initial={{
        opacity: 0,
        y: 20,
        scale: 0.95
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        y: 20,
        scale: 0.95
      }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl border border-plum-100 p-8 w-full max-w-sm relative">
          
            <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full text-plum-400 hover:text-plum-700 hover:bg-plum-50 transition-colors" aria-label="Close">
            
              <XIcon className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="flex justify-center mb-3">
                <GlitterHeart size={32} />
              </div>
              <div className="w-12 h-12 rounded-full bg-fuchsia-100 flex items-center justify-center mx-auto mb-4">
                <LockIcon className="w-6 h-6 text-fuchsia-600" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-plum-800 mb-2">
                Trippin' Through Life
              </h2>
              <p className="text-plum-400 text-sm font-medium mb-6">
                Enter the password to play the game.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }} placeholder="Enter password" className={`w-full px-5 py-3 rounded-2xl border-2 font-medium text-plum-800 placeholder-plum-300 outline-none transition-all pr-12 ${error ? 'border-red-400 bg-red-50' : 'border-plum-200 bg-plum-50 focus:border-cta-400 focus:bg-white'}`} autoFocus />
                
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-plum-400 hover:text-plum-600 transition-colors">
                  
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>

                {error && <p className="text-red-500 text-sm font-semibold">
                    Incorrect password. Try again.
                  </p>}

                <button type="submit" className="w-full py-3 rounded-2xl bg-cta-500 text-white font-bold text-base hover:bg-cta-600 transition-colors shadow-lg shadow-cta-500/20">
                
                  Let's Play 🎲
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
}
export function Footer() {
  const [showGameModal, setShowGameModal] = useState(false);
  const navigate = useNavigate();
  const handleGameClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (sessionStorage.getItem('twm-game-auth') === 'true') {
      navigate(GAME_PATH);
    } else {
      setShowGameModal(true);
    }
  };
  return <footer className="bg-white border-t border-blush-100 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blush-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" />
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-lavender-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" style={{
      animationDelay: '2s'
    }} />
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <GlitterHeart size={22} className="group-hover:scale-125 transition-transform" />
              
              <span className="font-heading text-2xl font-semibold text-plum-700">
                Trippin' With Mandy™
              </span>
            </Link>
            <p className="text-plum-500 max-w-sm mb-6 leading-relaxed">
              Rebuilding the world one soul at a time. The Broken Beginning —
              and taking you with me.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://www.facebook.com/share/1KSrTKNe17/" target="_blank" rel="noopener noreferrer" className="p-2 bg-blush-50 rounded-full text-plum-500 hover:text-cta-500 hover:bg-blush-100 transition-colors" aria-label="Facebook">
                
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/mandy.lee.944023?igsh=eTVlMHFtbXM3M216" target="_blank" rel="noopener noreferrer" className="p-2 bg-blush-50 rounded-full text-plum-500 hover:text-cta-500 hover:bg-blush-100 transition-colors" aria-label="Instagram">
                
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@trippin.with.mandy?_r=1&_t=ZP-94syxD66BF1" target="_blank" rel="noopener noreferrer" className="p-2 bg-blush-50 rounded-full text-plum-500 hover:text-cta-500 hover:bg-blush-100 transition-colors" aria-label="TikTok - Main">
                
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a href="https://youtube.com/@trippinwithmandy?si=y8DXbx-brot4uKGM" target="_blank" rel="noopener noreferrer" className="p-2 bg-blush-50 rounded-full text-plum-500 hover:text-cta-500 hover:bg-blush-100 transition-colors" aria-label="YouTube">
                
                <YoutubeIcon className="w-5 h-5" />
              </a>
              <a href="mailto:trippinwithmandy@gmail.com" className="p-2 bg-blush-50 rounded-full text-plum-500 hover:text-cta-500 hover:bg-blush-100 transition-colors" aria-label="Email">
                
                <MailIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg text-plum-700 mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-plum-500 hover:text-plum-700 transition-colors">
                  
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-plum-500 hover:text-plum-700 transition-colors">
                  
                  About Mandy
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-plum-500 hover:text-plum-700 transition-colors">
                  
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/coaching" className="text-plum-500 hover:text-plum-700 transition-colors">
                  
                  1:1 Coaching
                </Link>
              </li>
              <li>
                <Link to="/travel" className="text-plum-500 hover:text-plum-700 transition-colors">
                  
                  Travel Planning
                </Link>
              </li>
              <li>
                <a href="https://beacons.ai/trippinwithmandy" target="_blank" rel="noopener noreferrer" className="text-cta-500 font-bold hover:text-cta-600 transition-colors inline-flex items-center gap-1">
                  
                  Shop My Favorites <GlitterHeart size={12} />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg text-plum-700 mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/app" className="text-plum-500 hover:text-plum-700 transition-colors">
                  
                  The App (Coming Soon)
                </Link>
              </li>
              <li>
                <Link to="/free-resources" className="text-plum-500 hover:text-plum-700 transition-colors">
                  
                  Free Resources
                </Link>
              </li>
              <li>
                <a href="mailto:trippinwithmandy@gmail.com" className="text-plum-500 hover:text-plum-700 transition-colors">
                  
                  Contact
                </a>
              </li>
              <li>
                <button onClick={handleGameClick} className="text-plum-500 hover:text-fuchsia-600 transition-colors inline-flex items-center gap-1.5 group">
                  
                  <Gamepad2Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Trippin' Through Life Game
                  <LockIcon className="w-3 h-3 opacity-60" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-blush-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-plum-500">
            © {new Date().getFullYear()} Trippin' With Mandy™. All rights
            reserved.
          </p>
          <p className="text-sm text-plum-500 flex items-center gap-1">
            Made with <GlitterHeart size={16} /> and a whole lot of grit
          </p>
        </div>
      </div>

      <GameLockModal open={showGameModal} onClose={() => setShowGameModal(false)} />
      
    </footer>;
}