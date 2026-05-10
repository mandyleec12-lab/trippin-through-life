import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, MoreHorizontalIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlitterHeart } from './GlitterHeart';
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const moreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    setIsOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);
  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // Primary links shown directly in the nav bar
  const primaryLinks = [{
    name: 'Home',
    path: '/'
  }, {
    name: 'Courses & Checklists',
    path: '/courses'
  }, {
    name: 'Coaching',
    path: '/coaching'
  }, {
    name: 'Travel',
    path: '/travel'
  }] as Array<{
    name: string;
    path: string;
    external?: boolean;
  }>;
  // Secondary links hidden in the "More" dropdown
  const moreLinks = [{
    name: 'About',
    path: '/about'
  }, {
    name: 'Free Resources',
    path: '/free-resources'
  }, {
    name: 'Workouts',
    path: '/workouts'
  }, {
    name: 'Storefront',
    path: 'https://beacons.ai/trippinwithmandy',
    external: true
  }, {
    name: 'App',
    path: '/app'
  }] as Array<{
    name: string;
    path: string;
    external?: boolean;
  }>;
  const allLinks = [...primaryLinks, ...moreLinks];
  const renderNavLink = (link: {
    name: string;
    path: string;
    external?: boolean;
  }) => link.external ? <a key={link.name} href={link.path} target="_blank" rel="noopener noreferrer" className="font-medium text-sm transition-colors text-cta-500 hover:text-cta-600">
    
        {link.name}
      </a> : <NavLink key={link.name} to={link.path} className={({
    isActive
  }) => `font-medium text-sm transition-colors relative ${isActive ? 'text-plum-700' : 'text-plum-500 hover:text-plum-700'}`}>
    
        {({
      isActive
    }) => <>
            {link.name}
            {isActive && <motion.div layoutId="underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cta-400 rounded-full" />}
          </>}
      </NavLink>;
  return <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <GlitterHeart size={22} className="group-hover:scale-125 transition-transform" />
            
            <span className="text-lg md:text-2xl font-semibold text-plum-700 tracking-wide truncate max-w-[200px] md:max-w-none" style={{
            fontFamily: '"Dancing Script", cursive'
          }}>
              
              <span className="md:hidden">Trippin' Through Life</span>
              <span className="hidden md:inline">Trippin' With Mandy</span>
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {primaryLinks.map(renderNavLink)}

            {/* More Dropdown */}
            <div ref={moreRef} className="relative">
              <button onClick={() => setMoreOpen(!moreOpen)} className={`font-medium text-sm transition-colors flex items-center gap-1 ${moreOpen ? 'text-plum-700' : 'text-plum-500 hover:text-plum-700'}`} aria-label="More pages">
                
                More
                <MenuIcon className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {moreOpen && <motion.div initial={{
                opacity: 0,
                y: 8,
                scale: 0.95
              }} animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }} exit={{
                opacity: 0,
                y: 8,
                scale: 0.95
              }} transition={{
                duration: 0.15
              }} className="absolute right-0 top-full mt-3 w-48 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-blush-100 py-2 overflow-hidden">
                  
                    {moreLinks.map((link) => link.external ? <a key={link.name} href={link.path} target="_blank" rel="noopener noreferrer" className="block px-4 py-2.5 text-sm font-medium text-cta-500 hover:bg-blush-50 hover:text-cta-600 transition-colors">
                    
                          {link.name}
                        </a> : <NavLink key={link.name} to={link.path} className={({
                  isActive
                }) => `block px-4 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-blush-50 text-plum-700' : 'text-plum-500 hover:bg-blush-50 hover:text-plum-700'}`}>
                    
                          {link.name}
                        </NavLink>)}
                  </motion.div>}
              </AnimatePresence>
            </div>

            <NavLink to="/coaching" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cta-500 text-white font-medium text-sm hover:bg-cta-600 transition-colors shadow-md shadow-cta-500/20 whitespace-nowrap">
              
              <GlitterHeart size={16} variant="light" />
              Work With Me
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-plum-700 focus:outline-none" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            
            {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav — shows ALL links */}
      <AnimatePresence>
        {isOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} exit={{
        opacity: 0,
        height: 0
      }} className="md:hidden bg-white border-t border-blush-100 overflow-hidden">
          
            <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
              {allLinks.map((link) => link.external ? <a key={link.name} href={link.path} target="_blank" rel="noopener noreferrer" className="block px-3 py-3 rounded-md text-base font-medium text-cta-500 hover:bg-blush-50 hover:text-cta-600">
              
                    {link.name}
                  </a> : <NavLink key={link.name} to={link.path} className={({
            isActive
          }) => `block px-3 py-3 rounded-md text-base font-medium ${isActive ? 'bg-blush-50 text-plum-700' : 'text-plum-500 hover:bg-blush-50 hover:text-plum-700'}`}>
              
                    {link.name}
                  </NavLink>)}
              <NavLink to="/coaching" className="mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-cta-500 text-white font-medium text-base hover:bg-cta-600 transition-colors">
              
                <GlitterHeart size={16} variant="light" />
                Work With Me
              </NavLink>
            </div>
          </motion.div>}
      </AnimatePresence>
    </header>;
}