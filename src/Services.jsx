import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import photos from "./assets/photo33.avif";
import photok from "./assets/photo44.avif";
import Footer from './Footer';

const AgricultureServices = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';


  const [recommendationData, setRecommendationData] = useState({ 
    soilType: '', 
    climate: '' 
  });

  const [calculatorData, setCalculatorData] = useState({ 
    soilType: '', 
    climate: '', 
    crop: '', 
    landArea: '' 
  });


  const [recResult, setRecResult] = useState(null);
  const [calcResult, setCalcResult] = useState(null);

  
  const handleGetRecommendation = () => {
    if (!recommendationData.soilType || !recommendationData.climate) {
      alert(t("alert_missing_rec"));
      return;
    }
    setRecResult({
      bestCrop: t("crop_result"),
      reason: t("res_reason", { 
        soil: t(`opt_${recommendationData.soilType.toLowerCase()}`), 
        climate: t(`opt_${recommendationData.climate.toLowerCase()}`) 
      })
    });
  };

  
  const handleGetCalculation = () => {
    const { soilType, climate, crop, landArea } = calculatorData;
    if (!soilType || !climate || !crop || !landArea) {
      alert(t("alert_missing_calc"));
      return;
    }
    setCalcResult({
      water: (landArea * 500).toLocaleString() + " " + t("liters_week"),
      fertilizer: (landArea * 15).toLocaleString() + " " + t("kg_unit")
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans text-gray-800" dir={isArabic ? "rtl" : "ltr"}>
      <div className={`max-w-4xl mx-auto mb-10 ${isArabic ? 'text-right' : 'text-left'}`}>
        <h1 className="text-4xl font-semibold font-kufam mb-1">{t("services_main_title")}</h1>
        <p className="text-sm tracking-[0.2em] text-gray-500 font-medium uppercase">{t("services_sub_title")}</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-15">
        
        
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="h-24 bg-emerald-100">
            <img src={photos} className="w-full h-full object-cover" alt="banner" />
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">{t("card_rec_title")}</h2>
              <p className="text-xs text-gray-400">{t("card_rec_sub")}</p>
            </div>

            <div className="space-y-4">
              <InputField 
                label={t("label_soil")} 
                value={recommendationData.soilType} 
                options={['Sandy', 'Clay', 'Silt']} 
                t={t}
                onChange={(v) => setRecommendationData({...recommendationData, soilType: v})} 
              />
              <InputField 
                label={t("label_climate")} 
                value={recommendationData.climate} 
                options={['Arid', 'Humid', 'Cold']} 
                t={t}
                onChange={(v) => setRecommendationData({...recommendationData, climate: v})} 
              />
            </div>

            <button 
              onClick={handleGetRecommendation}
              className="w-full mt-8 bg-[#13633F] hover:bg-[#0e4d31] text-white py-3 rounded-md font-bold transition-all active:scale-[0.98]"
            >
              {t("btn_get_rec")}
            </button>

            {recResult && (
              <div className={`mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded ${isArabic ? 'text-right border-l-0 border-r-4' : 'text-left'}`}>
                <h3 className="text-[#13633F] font-bold">{t("res_recommended")}: {recResult.bestCrop}</h3>
                <p className="text-sm text-gray-600 italic">{recResult.reason}</p>
              </div>
            )}
          </div>
        </div>

        
        <div className="bg-[#F9F9F9] border border-gray-200 rounded-lg mb-10 overflow-hidden shadow-md">
          <div className="h-24 overflow-hidden">
            <img src={photok} className="w-full h-full object-cover" alt="banner" />
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">{t("card_calc_title")}</h2>
              <p className="text-xs text-gray-400">{t("card_calc_sub")}</p>
            </div>

            <div className="space-y-4">
              <InputField 
                label={t("label_soil")} 
                value={calculatorData.soilType} 
                options={['Sandy', 'Clay']} 
                t={t}
                onChange={(v) => setCalculatorData({...calculatorData, soilType: v})} 
              />
              <InputField 
                label={t("label_climate")} 
                value={calculatorData.climate} 
                options={['Arid', 'Humid']} 
                t={t}
                onChange={(v) => setCalculatorData({...calculatorData, climate: v})} 
              />
              <InputField 
                label={t("label_crop")} 
                value={calculatorData.crop} 
                options={['Tomato', 'Wheat', 'Corn']} 
                t={t}
                onChange={(v) => setCalculatorData({...calculatorData, crop: v})} 
              />
              
              <div className={`flex flex-col ${isArabic ? 'text-right' : 'text-left'}`}>
                <label className="text-[#2D5A43] font-bold text-sm mb-1">{t("label_land")}</label>
                <input 
                  type="number" 
                  placeholder={t("placeholder_land")}
                  className="w-full bg-[#97C1A9]/40 p-2 rounded-md outline-none border border-transparent focus:border-[#13633F]" 
                  value={calculatorData.landArea}
                  onChange={(e) => setCalculatorData({...calculatorData, landArea: e.target.value})}
                />
              </div>
            </div>

            <button 
              onClick={handleGetCalculation}
              className="w-full mt-8 bg-[#13633F] hover:bg-[#0e4d31] text-white py-3 rounded-md font-bold transition-all active:scale-[0.98]"
            >
              {t("btn_get_calc")}
            </button>

            {calcResult && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-3 bg-white shadow-inner rounded-lg border border-emerald-100 text-center">
                  <p className="text-[10px] text-emerald-800 font-black uppercase">{t("water_needed")}</p>
                  <p className="text-sm font-bold text-gray-700">{calcResult.water}</p>
                </div>
                <div className="p-3 bg-white shadow-inner rounded-lg border border-emerald-100 text-center">
                  <p className="text-[10px] text-emerald-800 font-black uppercase">{t("fertilizer")}</p>
                  <p className="text-sm font-bold text-gray-700">{calcResult.fertilizer}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

 
const InputField = ({ label, value, options, onChange, t }) => (
  <div className={`flex flex-col ${t.language === 'ar' ? 'text-right' : 'text-left'}`}>
    <label className="text-[#2D5A43] font-bold text-sm mb-1">{label}</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#97C1A9]/40 p-2 rounded-md outline-none cursor-pointer hover:bg-[#97C1A9]/60 transition-colors"
    >
      <option value="" disabled>{t("choose_prefix")} {label}...</option>
      {options.map(opt => (
        <option key={opt} value={opt}>
          {t(`opt_${opt.toLowerCase()}`)}
        </option>
      ))}
    </select>
  </div>
);

export default AgricultureServices;