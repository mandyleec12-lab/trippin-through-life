import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlitterHeart } from '../components/GlitterHeart';
import { CopyIcon, CheckIcon, ExternalLinkIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
const ADMIN_PASSWORD = 'Perditashits@2080';
const BASE_URL = 'https://trippinwithmandy.com';
const sections = [{
  category: '🧹 Cleaning — Paid Interactive Ghost Links',
  description: 'Share these ONLY with buyers after purchase',
  color: 'from-rose-100 to-pink-50',
  border: 'border-rose-200',
  badge: 'bg-rose-500',
  links: [{
    name: 'Sunday Reset Routine',
    path: '/checklists/cleaning/sr-847',
    gumroad: 'https://trippinwithmandy.gumroad.com/l/puiyqk',
    price: '$2.99'
  }, {
    name: 'Hot Mess Emergency Clean',
    path: '/checklists/cleaning/hme-561',
    gumroad: 'https://trippinwithmandy.gumroad.com/l/bklnc',
    price: '$2.99'
  }, {
    name: 'Ultimate Kitchen Cleaning Guide',
    path: '/checklists/cleaning/ukc-742',
    gumroad: 'https://trippinwithmandy.gumroad.com/l/mdpjew',
    price: '$3.99'
  }, {
    name: 'Ultimate Living Room Cleaning Guide',
    path: '/checklists/cleaning/ulrc-519',
    gumroad: 'https://trippinwithmandy.gumroad.com/l/tdsgi',
    price: '$3.99'
  }, {
    name: 'Ultimate Half Bathroom Cleaning Checklist',
    path: '/checklists/cleaning/uhbc-318',
    gumroad: 'https://trippinwithmandy.gumroad.com/l/xetmry',
    price: '$3.99'
  }, {
    name: 'Ultimate Full Bathroom Cleaning Guide',
    path: '/checklists/cleaning/ufbc-273',
    gumroad: 'https://trippinwithmandy.gumroad.com/l/aslgj',
    price: '$3.99'
  }]
}, {
  category: '✈️ Travel — Paid Interactive Ghost Links',
  description: 'Share these ONLY with buyers after purchase',
  color: 'from-sky-100 to-blue-50',
  border: 'border-sky-200',
  badge: 'bg-sky-500',
  links: [{
    name: 'Ultimate Tropical Cruise Packing Guide',
    path: '/checklists/travel/tcpl-627',
    gumroad: 'https://trippinwithmandy.gumroad.com/l/tbjrtz',
    price: '$3.99'
  }, {
    name: 'Ultimate Cold Climate Cruise Packing Guide',
    path: '/checklists/travel/ccpl-451',
    gumroad: 'https://trippinwithmandy.gumroad.com/l/pkujp',
    price: '$3.99'
  }]
}, {
  category: '✈️ Travel Free Interactive',
  description: 'Publicly accessible free resources',
  color: 'from-emerald-100 to-teal-50',
  border: 'border-emerald-200',
  badge: 'bg-emerald-500',
  links: [{
    name: 'Pre-Trip Home Prep',
    path: '/free-resources/travel/home-prep',
    gumroad: null,
    price: 'FREE'
  }]
}, {
  category: '🎲 Games — Ghost Links',
  description: 'Interactive games for TikTok Live or private sharing',
  color: 'from-fuchsia-100 to-pink-50',
  border: 'border-fuchsia-200',
  badge: 'bg-fuchsia-500',
  links: [{
    name: 'Trippin Through Life Board Game',
    path: '/games/ttl-483',
    gumroad: null,
    price: 'TikTok Live'
  }]
}, {
  category: '✨ Free Interactive Cleaning Schedules',
  description: 'These are publicly accessible free resources',
  color: 'from-emerald-100 to-teal-50',
  border: 'border-emerald-200',
  badge: 'bg-emerald-500',
  links: [{
    name: 'Ultimate Cleaning Schedule (Overview)',
    path: '/free-resources/cleaning-schedule',
    gumroad: null,
    price: 'FREE'
  }, {
    name: 'Daily Reset',
    path: '/free-resources/cleaning/daily',
    gumroad: null,
    price: 'FREE'
  }, {
    name: 'Weekly Clean',
    path: '/free-resources/cleaning/weekly',
    gumroad: null,
    price: 'FREE'
  }, {
    name: 'Monthly Clean',
    path: '/free-resources/cleaning/monthly',
    gumroad: null,
    price: 'FREE'
  }, {
    name: 'Quarterly Clean',
    path: '/free-resources/cleaning/quarterly',
    gumroad: null,
    price: 'FREE'
  }, {
    name: 'Every 6 Months (Biannual)',
    path: '/free-resources/cleaning/biannual',
    gumroad: null,
    price: 'FREE'
  }, {
    name: 'Yearly Clean',
    path: '/free-resources/cleaning/yearly',
    gumroad: null,
    price: 'FREE'
  }, {
    name: 'Cleaning Tasks People Forget',
    path: '/checklists/cleaning/ctf-392',
    gumroad: 'https://trippinwithmandy.gumroad.com/l/lnsfo',
    price: '$1.99 printable'
  }]
}, {
  category: '💆 Self-Care Free Interactive',
  description: 'Publicly accessible free resources',
  color: 'from-purple-100 to-lavender-50',
  border: 'border-purple-200',
  badge: 'bg-purple-500',
  links: [{
    name: 'Daily Self-Care Routine',
    path: '/free-resources/self-care/daily',
    gumroad: null,
    price: 'FREE'
  }]
}];
function CopyButton({
  text


}: {text: string;}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return <button onClick={handleCopy} className="shrink-0 p-1.5 rounded-lg hover:bg-white/80 transition-colors text-plum-400 hover:text-plum-700" title="Copy link">
      
      {copied ? <CheckIcon className="w-4 h-4 text-emerald-500" /> : <CopyIcon className="w-4 h-4" />}
    </button>;
}
export function AdminLinksPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('twm-admin-auth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('twm-admin-auth', 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-lavender-50 flex items-center justify-center px-4">
        <motion.div initial={{
        opacity: 0,
        y: 20,
        scale: 0.95
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} className="bg-white rounded-3xl shadow-2xl border border-plum-100 p-10 w-full max-w-md text-center">
          
          <div className="flex justify-center mb-4">
            <GlitterHeart size={40} />
          </div>
          <div className="w-14 h-14 rounded-full bg-plum-100 flex items-center justify-center mx-auto mb-6">
            <LockIcon className="w-7 h-7 text-plum-600" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-plum-800 mb-2">
            Admin Access
          </h1>
          <p className="text-plum-400 font-medium mb-8 text-sm">
            This page is private. Enter your password to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }} placeholder="Enter password" className={`w-full px-5 py-3.5 rounded-2xl border-2 font-medium text-plum-800 placeholder-plum-300 outline-none transition-all pr-12 ${error ? 'border-red-400 bg-red-50' : 'border-plum-200 bg-plum-50 focus:border-cta-400 focus:bg-white'}`} autoFocus />
              
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-plum-400 hover:text-plum-600 transition-colors">
                
                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>

            <AnimatePresence>
              {error && <motion.p initial={{
              opacity: 0,
              y: -8
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0
            }} className="text-red-500 text-sm font-semibold">
                
                  Incorrect password. Try again.
                </motion.p>}
            </AnimatePresence>

            <button type="submit" className="w-full py-3.5 rounded-2xl bg-cta-500 text-white font-bold text-base hover:bg-cta-600 transition-colors shadow-lg shadow-cta-500/20">
              
              Unlock
            </button>
          </form>
        </motion.div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-lavender-50 pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="text-center mb-12">
          
          <div className="flex justify-center mb-4">
            <GlitterHeart size={40} />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-plum-100 border border-plum-200 text-plum-700 text-sm font-bold mb-4">
            <LockIcon className="w-4 h-4" />
            PRIVATE — DO NOT SHARE THIS PAGE
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-plum-800 mb-3">
            Trippin' With Mandy
          </h1>
          <p className="text-plum-500 font-medium text-lg">
            Admin Link Reference — All ghost links and resources in one place
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, sIdx) => <motion.div key={sIdx} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: sIdx * 0.1
        }} className={`bg-gradient-to-br ${section.color} border ${section.border} rounded-3xl p-6 sm:p-8 shadow-sm`}>
            
              <div className="mb-2">
                <h2 className="font-heading text-xl font-bold text-plum-800">
                  {section.category}
                </h2>
                <p className="text-plum-500 text-sm font-medium mt-1">
                  {section.description}
                </p>
              </div>

              <div className="mt-5 space-y-3">
                {section.links.map((link, lIdx) => {
              const fullUrl = `${BASE_URL}${link.path}`;
              return <div key={lIdx} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-plum-800 text-sm sm:text-base">
                            {link.name}
                          </span>
                          <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${section.badge}`}>
                          
                            {link.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-plum-400 text-xs sm:text-sm font-mono truncate">
                            {fullUrl}
                          </span>
                          <CopyButton text={fullUrl} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a href={link.path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-plum-600 text-white text-xs font-bold hover:bg-plum-700 transition-colors">
                        
                          Open
                          <ExternalLinkIcon className="w-3 h-3" />
                        </a>
                        {link.gumroad && <a href={link.gumroad} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cta-500 text-white text-xs font-bold hover:bg-cta-600 transition-colors">
                        
                            Gumroad
                            <ExternalLinkIcon className="w-3 h-3" />
                          </a>}
                      </div>
                    </div>;
            })}
              </div>
            </motion.div>)}
        </div>

        <motion.p initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.5
      }} className="text-center text-plum-300 text-sm mt-12 font-medium">
          
          Made with 💗 and a whole lot of grit — Trippin' With Mandy™
        </motion.p>
      </div>
    </div>;
}