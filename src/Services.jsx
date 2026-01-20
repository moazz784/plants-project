import React, { useState } from 'react';
import photos from "./assets/photo33.avif"
import photok from "./assets/photo44.avif"
import Footer from './Footer';
const AgricultureServices = () => {
  // 1. States تبدأ بقيم فارغة
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

  // States لعرض النتائج
  const [recResult, setRecResult] = useState(null);
  const [calcResult, setCalcResult] = useState(null);

  // 2. دالة التوصية مع التحقق من الاختيارات
  const handleGetRecommendation = () => {
    if (!recommendationData.soilType || !recommendationData.climate) {
      alert("Please select both Soil Type and Climate!");
      return;
    }
    setRecResult({
      bestCrop: "Watermelon & Peanuts",
      reason: `Based on ${recommendationData.soilType} soil and ${recommendationData.climate} climate.`
    });
  };

  // 3. دالة الحسابات مع التحقق
  const handleGetCalculation = () => {
    const { soilType, climate, crop, landArea } = calculatorData;
    if (!soilType || !climate || !crop || !landArea) {
      alert("Please fill all fields and enter land area!");
      return;
    }
    setCalcResult({
      water: (landArea * 500).toLocaleString() + " Liters/Week",
      fertilizer: (landArea * 15).toLocaleString() + " Kg (NPK 20-20-20)"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans text-gray-800 ">
      <div className="max-w-4xl mx-auto mb-10 text-left">
        <h1 className="text-4xl font-semibold mb-1">Services</h1>
        <p className="text-sm tracking-[0.2em] text-gray-500 font-medium uppercase">What we do?</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-15">
        
        {/* Card 1: Select Best Crops */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="h-24 bg-emerald-100">
            <img src={photos} className="w-full h-full object-cover" alt="banner" />
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">Select Best Crops</h2>
              <p className="text-xs text-gray-400">choose soil type and climate to get recommendations</p>
            </div>

            <div className="space-y-4">
              <InputField 
                label="Soil Type" 
                value={recommendationData.soilType} 
                options={['Sandy', 'Clay', 'Silt']} 
                onChange={(v) => setRecommendationData({...recommendationData, soilType: v})} 
              />
              <InputField 
                label="Climate" 
                value={recommendationData.climate} 
                options={['Arid', 'Humid', 'Cold']} 
                onChange={(v) => setRecommendationData({...recommendationData, climate: v})} 
              />
            </div>

            <button 
              onClick={handleGetRecommendation}
              className="w-full mt-8 bg-[#13633F] hover:bg-[#0e4d31] text-white py-3 rounded-md font-bold transition-all active:scale-[0.98]"
            >
              Get Recommendation
            </button>

            {recResult && (
              <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <h3 className="text-[#13633F] font-bold">Recommended: {recResult.bestCrop}</h3>
                <p className="text-sm text-gray-600 italic">{recResult.reason}</p>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Calculator */}
        <div className="bg-[#F9F9F9] border border-gray-200 rounded-lg mb-10 overflow-hidden shadow-md">
          <div className="h-24 overflow-hidden">
            <img src={photok} className="w-full h-full object-cover" alt="banner" />
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">Irrigation & Fertilization Calculator</h2>
              <p className="text-xs text-gray-400">calculate requirements for your specific area</p>
            </div>

            <div className="space-y-4">
              <InputField 
                label="Soil Type" 
                value={calculatorData.soilType} 
                options={['Sandy', 'Clay']} 
                onChange={(v) => setCalculatorData({...calculatorData, soilType: v})} 
              />
              <InputField 
                label="Climate" 
                value={calculatorData.climate} 
                options={['Arid', 'Humid']} 
                onChange={(v) => setCalculatorData({...calculatorData, climate: v})} 
              />
              <InputField 
                label="Crop" 
                value={calculatorData.crop} 
                options={['Tomato', 'Wheat', 'Corn']} 
                onChange={(v) => setCalculatorData({...calculatorData, crop: v})} 
              />
              
              <div className="flex flex-col text-left">
                <label className="text-[#2D5A43] font-bold text-sm mb-1">Land Area (acres)</label>
                <input 
                  type="number" 
                  placeholder="Enter land area..."
                  className="w-full bg-[#97C1A9]/40 p-2 rounded-md outline-none border border-transparent focus:border-[#13633F]" 
                  value={calculatorData.landArea}
                  onChange={(e) => setCalculatorData({...calculatorData, landArea: e.target.value})}
                />
              </div>
            </div>

            <button 
              onClick={handleGetCalculation}
              className="w-full mt-8 bg-[#13633F] hover:bg-[#0e4d31] text-white py-3 py-2 rounded-md font-bold transition-all active:scale-[0.98]"
            >
              Get Best Result
            </button>

            {calcResult && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-3 bg-white shadow-inner rounded-lg border border-emerald-100">
                  <p className="text-[10px] text-emerald-800 font-black uppercase">Water Needed</p>
                  <p className="text-sm font-bold text-gray-700">{calcResult.water}</p>
                </div>
                <div className="p-3 bg-white shadow-inner rounded-lg border border-emerald-100">
                  <p className="text-[10px] text-emerald-800 font-black uppercase">Fertilizer</p>
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

// Reusable Select Component مع خيار "الافتراضي"
const InputField = ({ label, value, options, onChange }) => (
  <div className="flex flex-col text-left">
    <label className="text-[#2D5A43] font-bold text-sm mb-1">{label}</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#97C1A9]/40 p-2 rounded-md outline-none cursor-pointer hover:bg-[#97C1A9]/60 transition-colors"
    >
      <option value="" disabled>Choose {label}...</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
     
  </div>
);

export default AgricultureServices;