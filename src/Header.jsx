import React, { useState, useRef, useEffect } from 'react'; 
import { useNavigate, Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Languages, Settings, LogOut,Camera, User, ChevronRight,  } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import gsap from 'gsap'; 
import imge1 from './assets/logo.png'; 
import imge2 from './assets/default.webp'; 
import toast from "react-hot-toast";

export default function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const { t, i18n } = useTranslation();
  const headerRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem("user_data");
    return savedData ? JSON.parse(savedData) : { name: "User Name", image: imge2 };
  });

  useEffect(() => {
    const savedData = localStorage.getItem("user_data");
    if (savedData) setUserData(JSON.parse(savedData));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedData = { ...userData, image: reader.result };
        setUserData(updatedData);
        localStorage.setItem("user_data", JSON.stringify(updatedData));
        toast.success("تم تحديث الصورة");
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const handleLeafRain = () => {
    const header = headerRef.current;
    if (!header) return;
    const leafIcons = [' 🍃'];
    for (let i = 0; i < 17; i++) {
      const leaf = document.createElement('div');
      leaf.innerText = leafIcons[0];
      leaf.style.position = 'absolute';
      leaf.style.top = '-30px'; 
      leaf.style.left = Math.random() * 100 + '%';
      leaf.style.fontSize = (Math.random() * 10 + 15) + 'px';
      leaf.style.pointerEvents = 'none'; 
      leaf.style.zIndex = '1';
      header.appendChild(leaf);
      gsap.to(leaf, {
        y: header.offsetHeight + 60,
        x: (Math.random() - 0.5) * 150, 
        rotation: Math.random() * 720,
        opacity: 0,
        duration: Math.random() * 1.5 + 1.5,
        onComplete: () => leaf.remove()
      });
    }
  }; 

  const handleLogout = () => {
    localStorage.removeItem("hasloged");
    toast.success(t("logout_success"));
    navigate("/login");
  };

  return (
    <>
      <nav ref={headerRef} onMouseEnter={handleLeafRain} className="relative flex items-center justify-between w-full bg-[#f8f9fa] px-8 md:px-10 py-5 font-sans border-b border-gray-100 z-[100]">
        
        {/* اللوجو */}
        <div className="flex items-center shrink-0 cursor-pointer" onClick={() => navigate('/')}>
          <img src={imge1} alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          <h1 className="text-xl sm:text-2xl md:text-[34px] font-semibold text-[#3A9B63] ml-2">LeafScan</h1>
        </div>

        {/* روابط التنقل */}
        <div className="hidden lg:flex items-center gap-4">
          <NavLink to="/" end className={({ isActive }) => `w-36 py-2.5 flex items-center justify-center rounded-full font-medium transition ${isActive ? "bg-[#1a5d3a] text-white shadow-md" : "bg-white text-green-800 border border-gray-100 hover:bg-[#1a5d3a] hover:text-white"}`}>{t('home')}</NavLink>
          <NavLink to="/about" className={({ isActive }) => `w-36 py-2.5 flex items-center justify-center rounded-full font-medium transition ${isActive ? "bg-[#1a5d3a] text-white shadow-md" : "bg-white text-green-800 border border-gray-100 hover:bg-[#1a5d3a] hover:text-white"}`}>{t('about')}</NavLink>
          <NavLink to="/services" className={({ isActive }) => `w-36 py-2.5 flex items-center justify-center rounded-full font-medium transition ${isActive ? "bg-[#1a5d3a] text-white shadow-md" : "bg-white text-green-800 border border-gray-100 hover:bg-[#1a5d3a] hover:text-white"}`}>{t('services')}</NavLink>
          <NavLink to="/contact-us" className={({ isActive }) => `w-36 py-2.5 flex items-center justify-center rounded-full font-medium transition ${isActive ? "bg-[#1a5d3a] text-white shadow-md" : "bg-white text-green-800 border border-gray-100 hover:bg-[#1a5d3a] hover:text-white"}`}>{t('contact_us')}</NavLink>
        </div>

        {/* الجزء الأيمن */}
        <div className="flex items-center gap-3 sm:gap-4">

          <button onClick={toggleLanguage} className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:text-[#3A9B63] transition-all">
            <Languages size={18} />
            <span className="font-bold text-sm uppercase">{i18n.language === 'en' ? 'AR' : 'EN'}</span>
          </button>

          <div className="flex items-center gap-3 border-l pl-3 sm:px-4 border-gray-200 rtl:border-l-0 rtl:border-r rtl:pr-3">

            <div className="hidden sm:flex flex-col items-end rtl:items-start">
              <span className="text-sm font-bold text-gray-900">{userData.name}</span>
              <span onClick={handleLogout} className="text-[13px] text-gray-500 cursor-pointer hover:text-red-500 hover:text-[14px]  hover:transition">
                {i18n.language === 'ar' ? <>&larr; {t('logout')}</> : <>{t('logout')} →</>}
              </span>
            </div>

            {/* صورة البروفايل + Dropdown */}
            <div ref={dropdownRef} className="relative">
              <img 
                src={userData.image || imge2}
                alt="Profile"
                className="w-11 h-11 rounded-full shadow-lg object-cover border-2 border-white cursor-pointer hover:scale-105 transition-transform"
              />

              {/* أيقونة صغيرة لتفتح Dropdown */}
              <button
                onClick={() => setOpenProfileMenu(!openProfileMenu)}
                className={`absolute -bottom-1 ${i18n.language === 'ar' ? '-left-1' : '-right-1'} bg-green-700 text-white p-1 rounded-full shadow hover:bg-green-800 transition`}
              >
                <Settings size={12} />
              </button>

              {/* Dropdown Animated */}
   <AnimatePresence>
  {openProfileMenu && (
   <motion.div
  // 1. في الموبايل بنلغي السنترة (-50%) ونخليها (0%) عشان نتحكم يدوياً
  initial={{ opacity: 0, scale: 0.95, y: -10, x: "0%" }}
  animate={{ opacity: 1, scale: 1, y: 0, x: "0%" }}
  exit={{ opacity: 0, scale: 0.95, y: -10, x: "0%" }}
  transition={{ duration: 0.15 }}
  
  className={`absolute top-full mt-3 w-60 bg-white shadow-xl rounded-[10px] border border-gray-100 z-50 overflow-hidden 
    ${i18n.language === 'ar' 
      ? '-left-7 right-auto sm:left-0'  // في العربي: بعيد عن الطرف الشمال بـ 16px (left-4)
      : '-right-7 left-auto sm:right-0' // في الإنجليزي: بعيد عن الطرف اليمين بـ 16px (right-4)
    }`}
>
      {/* الخيار الأول */}
      <button
        onClick={() => {
          fileInputRef.current.click();
          setOpenProfileMenu(false);
        }}
        // 2. المسافات الداخلية: قللنا الـ padding من py-4 لـ py-3 ومن px-5 لـ px-4
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50"
      >
        <div className="flex items-center gap-3"> {/* صغرنا المسافة بين الأيقونة والنص gap-3 */}
          {/* 3. حجم مربع الأيقونة: صغرنا من w-10 لـ w-8 */}
          <div className="relative flex items-center justify-center w-8 h-8 bg-gray-50 rounded-lg group">
             <Camera size={18} className="text-gray-500" /> {/* صغرنا الأيقونة لـ 18 */}
          </div>
          <span className="text-gray-700 font-medium text-[14px]"> {/* صغرنا الخط لـ 14px */}
            {t('change_image')}
          </span>
        </div>
        <ChevronRight size={16} className="text-gray-300" />
      </button>

      {/* الخيار الثاني */}
      <button
        onClick={() => {
          setOpenProfileMenu(false);
          navigate('/profile');
        }}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors bg-gray-50/30"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
             <User size={18} className="text-gray-600" />
          </div>
          <span className="text-gray-800 font-semibold text-[14px]">
            {t('edit_profile')}
          </span>
        </div>
        <ChevronRight size={16} className="text-gray-300" />
      </button>
    </motion.div>
  )}
</AnimatePresence>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            {/* زر الموبايل */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-1 text-green-800 transition-transform active:scale-90">
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />}
              </svg>
            </button>
          </div>
        </div>

        {/* قائمة الموبايل */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }} 
              className="absolute top-full left-0 w-full bg-white border-b border-gray-200 flex flex-col items-center gap-4 py-8 lg:hidden shadow-xl z-[110]"
            >
              <NavLink onClick={() => setIsMenuOpen(false)} to="/" className="text-green-800 font-medium text-lg hover:text-[#1a5d3a]">{t('home')}</NavLink>
              <NavLink onClick={() => setIsMenuOpen(false)} to="/about" className="text-green-800 font-medium text-lg hover:text-[#1a5d3a]">{t('about')}</NavLink>
              <NavLink onClick={() => setIsMenuOpen(false)} to="/services" className="text-green-800 font-medium text-lg hover:text-[#1a5d3a]">{t('services')}</NavLink>
              <NavLink onClick={() => setIsMenuOpen(false)} to="/contact-us" className="text-green-800 font-medium text-lg hover:text-[#1a5d3a]">{t('contact_us')}</NavLink>
              
              <div className="w-3/4 border-t border-gray-100 pt-4 flex flex-col items-center gap-4">
                <button onClick={() => { toggleLanguage(); setIsMenuOpen(false); }} className="flex items-center gap-2 font-bold text-gray-800">
                   <Languages size={20} className="text-[#3A9B63]" /> {i18n.language === 'en' ? 'العربية' : 'English'}
                </button>
                <div className="text-center">
                  <p className="font-bold text-gray-900">{userData.name}</p>
                  <button onClick={handleLogout} className={`mt-2 flex items-center gap-2 justify-center ${i18n.language === 'ar' ? 'flex-row-reverse' : 'flex-row'} text-red-500`}>
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
