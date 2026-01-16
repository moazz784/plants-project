import React, { useState, useRef } from 'react'; 
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Languages, LogOut } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import gsap from 'gsap'; 
import imge1 from './assets/logo.png'; // حرف l صغير مش كبير
import imge2 from './assets/img-2.jpg';

export default function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const headerRef = useRef(null);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const handleLeafRain = () => {
    const header = headerRef.current;
    if (!header) return;

    const leafIcons = [ '🍃'];
    const leafCount = 17; 

    for (let i = 0; i < leafCount; i++) {
      const leaf = document.createElement('div');
      leaf.innerText = leafIcons[Math.floor(Math.random() * leafIcons.length)];
      leaf.style.position = 'absolute';
      leaf.style.top = '-30px'; 
      leaf.style.left = Math.random() * 100 + '%';
      leaf.style.fontSize = (Math.random() * 10 + 15) + 'px';
      leaf.style.pointerEvents = 'none'; 
      leaf.style.zIndex = '1';
      leaf.style.opacity = '0.8';

      header.appendChild(leaf);

      gsap.to(leaf, {
        y: header.offsetHeight + 60,
        x: (Math.random() - 0.5) * 150, 
        rotation: Math.random() * 720,
        opacity: 0,
        duration: Math.random() * 1.5 + 1.5,
        ease: "power1.out",
        onComplete: () => leaf.remove()
      });
    }
  };

  return (
    <>
      <nav 
        ref={headerRef}
        onMouseEnter={handleLeafRain}
        className="relative flex items-center justify-between w-full bg-[#f8f9fa] px-8 md:px-10 py-5 font-sans border-b border-gray-100 z-[100]"
      >
        <div className="flex items-center shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <img
              src={imge1}
              alt="LeafScan Logo"
              className="w-12 h-12 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_15px_rgba(58,155,99,0.5)]"
            />
            <h1 className="text-2xl sm:text-[34px] font-semibold text-[#3A9B63] drop-shadow-[0_0_15px_rgba(58,155,99,0.5)]">
              LeafScan
            </h1>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 relative z-10">
          <Link to="/" className="px-8 py-2.5 bg-[#1a5d3a] text-white rounded-full font-medium shadow-md transition hover:opacity-90">
            {t('home')} 
          </Link>
          <Link to="/about" className="px-8 py-2.5 bg-white text-green-800 rounded-full font-medium shadow-sm border border-gray-100 hover:bg-[#1a5d3a] hover:text-white transition">
            {t('about')}
          </Link>
          <Link to="/services" className="px-8 py-2.5 bg-white text-green-800 rounded-full font-medium shadow-sm border border-gray-100 hover:bg-[#1a5d3a] hover:text-white transition">
            {t('services')}
          </Link>
          <Link to="/contact-us" className="px-8 py-2.5 bg-white text-green-800 rounded-full font-medium shadow-sm border border-gray-100 hover:bg-[#1a5d3a] hover:text-white transition">
            {t('contact_us')}
          </Link>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <button 
            onClick={toggleLanguage}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:border-[#3A9B63] hover:text-[#3A9B63] transition-all duration-300 group"
          >
            <Languages size={18} className="text-gray-600 group-hover:text-[#3A9B63] transition-colors" />
            <span className="font-bold text-sm uppercase group-hover:text-[#3A9B63]">
              {i18n.language === 'en' ? 'AR' : 'EN'}
            </span>
          </button>

          <div className="flex items-center gap-3 border-l px-4 border-gray-200 rtl:border-l-0 rtl:border-r">
            <div className="hidden sm:flex flex-col items-end rtl:items-start">
              <span className="text-sm font-bold text-gray-900 leading-tight">Mai Ahmed</span>
              <span className="text-[15px] text-gray-500 cursor-pointer hover:text-red-500 transition">
                {t('logout')} →
              </span>
            </div>

            <img 
              src={imge2}
              alt="Profile"
              onClick={() => navigate('/login')}
              className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 shadow-lg object-cover border-2 border-white transition-transform"
            />

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-1 text-green-900 active:scale-90 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 w-full bg-white border-b border-gray-200 flex flex-col items-center gap-4 py-8 lg:hidden shadow-xl z-[110] overflow-hidden"
            >
              <Link onClick={() => setIsMenuOpen(false)} to="/" className="text-green-800 font-medium text-lg">{t('home')}</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/about" className="text-green-800 font-medium text-lg">{t('about')}</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/services" className="text-green-800 font-medium text-lg">{t('services')}</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/contact-us" className="text-green-800 font-medium text-lg">{t('contact_us')}</Link>
              
              <div className="w-3/4 border-t border-gray-100 pt-4 flex flex-col gap-4">
                <button onClick={() => { toggleLanguage(); setIsMenuOpen(false); }} className="flex items-center justify-center gap-2 text-gray-900 font-bold">
                  <Languages size={20} className="text-[#3A9B63]" />
                  {i18n.language === 'en' ? 'العربية' : 'English'}
                </button>
                <div className="flex flex-col items-center border-t border-gray-100 pt-4">
                    <span className="text-gray-900 font-bold mb-1 text-lg">Mai Ahmed</span>
                    <button className="text-red-500 font-medium flex items-center gap-2">
                        <LogOut size={18}/> {t('logout')}
                    </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <Outlet />
    </>
  );
}