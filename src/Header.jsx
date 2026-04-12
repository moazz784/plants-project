import React, { useState, useRef, useEffect } from 'react'; 
import { useNavigate, Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Languages, Settings, LogOut, Camera, User, ChevronRight } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import gsap from 'gsap'; 
import imge1 from './assets/logo.png'; 
import imge2 from './assets/default.webp'; 
import toast from "react-hot-toast";

import { useAuth } from './AuthContext';
import { api } from './api';

export default function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const { t, i18n } = useTranslation();
  const headerRef = useRef(null);
  const leavesContainerRef = useRef(null); 
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const { user, logout: authLogout, refreshUser } = useAuth();

  /* =========================
      🌿 أنيميشن أوراق الشجر (GSAP)
  ========================== */
  useEffect(() => {
    const header = headerRef.current;
    const container = leavesContainerRef.current;
    if (!header || !container) return;

    const dropLeaves = () => {
      const headerHeight = header.offsetHeight;
      for (let i = 0; i < 15; i++) {
        const leaf = document.createElement("div");
        leaf.innerHTML = "🍀"; 
        // ✨,🌷,🌹,🌸,🌻,🍂,🍀,🌿,🌺
        leaf.style.position = "absolute";
        leaf.style.top = "-50px";
        leaf.style.left = `${Math.random() * 100}%`;
        leaf.style.fontSize = `${Math.random() * 10 + 20}px`;
        leaf.style.pointerEvents = "none";
        leaf.style.zIndex = "0"; 
        leaf.style.opacity = Math.random() * 0.7 + 0.3;
        leaf.style.filter = "drop-shadow(2px 2px 2px rgba(0,0,0,0.1))";
        container.appendChild(leaf);
        const duration = 2.5 + Math.random() * 0.5;
        const xMove = Math.random() > 0.5 ? 80 : -80;
        const rotation = Math.random() * 20;

        gsap.to(leaf, {
          y: headerHeight + 50,
          x: `+=${xMove}`,
          rotation: rotation,
          duration: duration,
          ease: "sine.inOut",
          onUpdate: () => {
            const leafRect = leaf.getBoundingClientRect();
            const headerRect = header.getBoundingClientRect();
            if (leafRect.top > headerRect.bottom) {
              leaf.remove();
            }
          },
          onComplete: () => {
            if (leaf.parentNode) leaf.remove();
          }
        });
      }
    };

    header.addEventListener("mouseenter", dropLeaves);
    return () => header.removeEventListener("mouseenter", dropLeaves);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error(i18n.language === 'ar' ? "حجم الصورة كبير، اختر صورة أقل من 1 ميجا" : "Image too large, keep it under 1MB");
        return;
      }
      const reader = new FileReader();
      const loadingToast = toast.loading(i18n.language === 'ar' ? "جاري تحديث الصورة..." : "Updating image...");
      reader.onloadend = async () => {
        try {
          const base64Clean = reader.result.split(',')[1];
          await api.users.updateMe({ name: user.name, profileImageBase64: base64Clean });
          await refreshUser(); 
          toast.dismiss(loadingToast);
          toast.success(t("image_updated_success") || "Success!");
        } catch (error) {
          toast.dismiss(loadingToast); 
          toast.error(i18n.language === 'ar' ? "السيرفر رفض الصورة، جرب حجم أصغر" : "Upload failed");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    await authLogout();
    toast.success(t("logout_success"));
    navigate("/login");
  };

  
  const navLinkStyle = ({ isActive }) => 
    `w-32 py-2 flex items-center justify-center rounded-full font-medium transition ${
      isActive ? "bg-[#1a5d3a] text-white shadow-md" : "bg-white text-green-800 border border-gray-100 hover:bg-[#1a5d3a] hover:text-white"
    }`;

  const dashboardStyle = ({ isActive }) => 
    `w-32 py-2 flex items-center justify-center rounded-full font-medium transition ${
      isActive ? "bg-yellow-600 text-white shadow-md" : "bg-white text-yellow-700 border border-yellow-100 hover:bg-yellow-600 hover:text-white hover:border-yellow-600"
    }`;

  const messagesStyle = ({ isActive }) => 
    `w-32 py-2 flex items-center justify-center rounded-full font-medium transition ${
      isActive ? "bg-blue-600 text-white shadow-md" : "bg-white text-blue-700 border border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600"
    }`;

  const mobileLinkStyle = "text-green-800 font-medium text-lg hover:text-[#1a5d3a] transition-colors";

  return (
    <>
    
      <nav ref={headerRef} className="relative flex items-center justify-between w-full bg-[#f8f9fa] px-8 md:px-10 py-5 font-sans border-b border-gray-100 z-[100]">
        
  
        <div ref={leavesContainerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden" />

        <div className="flex items-center shrink-0 cursor-pointer relative z-10" onClick={() => navigate('/')}>
          <img src={imge1} alt="Logo" className="w-10 h-10 sm:w-22 object-contain" />
          <h1 className="text-xl sm:text-2xl md:text-[34px] font-semibold text-[#3A9B63] ml-2">LeafScan</h1>
        </div>

      
        <div className="hidden lg:flex items-center gap-3 relative z-10">
          <NavLink to="/" end className={navLinkStyle}>{t('home')}</NavLink>
          <NavLink to="/about" className={navLinkStyle}>{t('about')}</NavLink>
          <NavLink to="/services" className={navLinkStyle}>{t('services')}</NavLink>
          <NavLink to="/contact-us" className={navLinkStyle}>{t('contact_us')}</NavLink>
          {user?.role?.toLowerCase() === 'admin' && (
            <>
              <NavLink to="/dashboard" className={dashboardStyle}>Dashboard</NavLink>
              <NavLink to="/messages" className={messagesStyle}>Messages</NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 relative z-10">
          <button onClick={toggleLanguage} className="hidden md:flex items-center cursor-pointer gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:text-[#3A9B63]">
            <Languages size={18} />
            <span className="font-bold text-sm uppercase">{i18n.language === 'en' ? 'AR' : 'EN'}</span>
          </button>

          <div className="flex items-center gap-3 border-l pl-3 sm:px-4 border-gray-200 rtl:border-l-0 rtl:border-r rtl:pr-3">
            {user ? (
              <>
                <div className="hidden sm:flex flex-col items-end rtl:items-start">
                  <span className="text-sm font-bold text-gray-900">{user.name}</span>
                  <span onClick={handleLogout} className="text-[13px] text-gray-500 cursor-pointer hover:text-red-500">
                    {i18n.language === 'ar' ? <>&larr; {t('logout')}</> : <>{t('logout')} →</>}
                  </span>
                </div>
                <div ref={dropdownRef} className="relative">
                  <img src={user.profileImageBase64 ? `data:image/png;base64,${user.profileImageBase64}` : imge2} alt="Profile" className="w-12 h-12 rounded-full shadow-lg object-cover border-2 border-white cursor-pointer" onClick={() => setOpenProfileMenu(!openProfileMenu)} />
                  <button onClick={() => setOpenProfileMenu(!openProfileMenu)} className={`absolute -bottom-1 ${i18n.language === 'ar' ? '-left-1' : '-right-1'} bg-green-700 text-white p-1 rounded-full shadow hover:bg-green-800`}><Settings size={12} /></button>
                  <AnimatePresence>
                    {openProfileMenu && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`absolute top-full mt-2 w-56 bg-white shadow-xl rounded-[10px] border border-gray-100 z-[200] overflow-hidden ${i18n.language === 'ar' ? 'left-0' : 'right-0'}`}>
                        <button onClick={() => { fileInputRef.current.click(); setOpenProfileMenu(false); }} className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 border-b border-gray-50"><div className="flex items-center gap-3 text-gray-700 font-medium text-[14px]"><Camera size={18} /> {t('change_image')}</div><ChevronRight size={16} /></button>
                        <button onClick={() => { setOpenProfileMenu(false); navigate('/profile'); }} className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"><div className="flex items-center gap-3 text-gray-800 font-semibold text-[14px]"><User size={18} /> {t('edit_profile')}</div><ChevronRight size={16} /></button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className="bg-green-700 text-white cursor-pointer px-2 md:px-5 py-2 rounded-full hover:bg-green-800 transition whitespace-nowrap flex-shrink-0 text-[12px] md:text-base font-medium z-10"
              >
              
                {t('login')}
              </button>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-1 text-green-800 active:scale-90 relative z-[200]"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">{isMenuOpen ? <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />}</svg></button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="absolute top-full left-0 w-full bg-white border-b border-gray-200 flex flex-col items-center gap-6 py-8 lg:hidden shadow-xl z-[110]">
              <NavLink onClick={() => setIsMenuOpen(false)} to="/" className={mobileLinkStyle}>{t('home')}</NavLink>
              <NavLink onClick={() => setIsMenuOpen(false)} to="/about" className={mobileLinkStyle}>{t('about')}</NavLink>
              <NavLink onClick={() => setIsMenuOpen(false)} to="/services" className={mobileLinkStyle}>{t('services')}</NavLink>
              <NavLink onClick={() => setIsMenuOpen(false)} to="/contact-us" className={mobileLinkStyle}>{t('contact_us')}</NavLink>
              {user?.role?.toLowerCase() === 'admin' && (
                <>
                  <NavLink onClick={() => setIsMenuOpen(false)} to="/dashboard" className={mobileLinkStyle}>Dashboard</NavLink>
                  <NavLink onClick={() => setIsMenuOpen(false)} to="/messages" className={mobileLinkStyle}>Messages</NavLink>
                </>
              )}
              <div className="w-3/4 border-t border-gray-100 pt-6 flex flex-col items-center gap-5">
                <button onClick={() => { toggleLanguage(); setIsMenuOpen(false); }} className="flex items-center gap-2 font-bold text-gray-800"><Languages size={20} className="text-[#3A9B63]" /> {i18n.language === 'en' ? 'العربية' : 'English'}</button>
                {user && (
                  <div className="text-center flex flex-col items-center gap-2">
                    <p className="font-bold text-gray-900 text-lg">{user.name}</p>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-medium"><LogOut size={18}/> {t('logout')}</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
      <Outlet />
    </>
  );
}