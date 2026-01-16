import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { FaSquareGithub } from "react-icons/fa6";
import imge1 from './assets/Logo.png';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-white pt-10 pb-8 px-4 md:px-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
          
          <div className="flex items-center gap-2">
            <img src={imge1} alt="LeafScan" className="w-10 h-10 object-contain" />
            <h1 className="text-2xl font-semibold text-[#3A9B63]">LeafScan</h1>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 md:gap-12">
        
            <Link to="/about" className="text-gray-800 font-medium hover:text-[#3A9B63] transition-colors">
              {t('footer_about')}
            </Link>
            <Link to="/services" className="text-gray-800 font-medium hover:text-[#3A9B63] transition-colors">
              {t('footer_services')}
            </Link>
            <Link to="/contact-us" className="text-gray-800 font-medium hover:text-[#3A9B63] transition-colors">
              {t('footer_contact')}
            </Link>
          </nav>

          <div className="flex gap-6 text-xl text-gray-700">
            <a href="#" className="hover:text-[#3A9B63] transition-all"><FaTwitter /></a>
            <a href="#" className="hover:text-[#3A9B63] transition-all"><FaFacebookF /></a>
            <a href="#" className="hover:text-[#3A9B63] transition-all"><FaInstagram /></a>
            <a href="#" className="hover:text-[#3A9B63] transition-all"><FaSquareGithub /></a>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          
          <p>{t('footer_copyright', { year: 2025 })}</p>
          
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:underline">{t('footer_privacy')}</Link>
            <Link to="/terms" className="hover:underline">{t('footer_terms')}</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}