import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import plant11 from "./assets/plant121.jpg"
import plant22 from "./assets/plant22.jpg"
import plant33 from "./assets/plant33.jpg"
import plant44 from "./assets/plant44.webp"
import plant55 from "./assets/plant55.jpg"
import plant66 from "./assets/plant66.jpg"
import plant77 from "./assets/plant77.webp"
import plant88 from "./assets/plant88.jpg"
import plant99 from "./assets/plant99.jpg"
import plant100 from "./assets/plant100.webp"
import plant200 from "./assets/plant200.jpg"

export default function Plantscategoriy() {
  const { t, i18n } = useTranslation();
  const [selectedPlant, setSelectedPlant] = useState(null);
  const plantsData = [
    {
      id: 1,
      name: t('plants.0.fullName'), 
      fullName: t('plants.0.fullName'),
      category: t('cat_house'),
      disease: t('plants.0.disease'),
      cause: t('plants.0.cause'),
      treatment: t('plants.0.treatment'),
      image: plant11
    },
    {
      id: 2,
      name: t('plants.1.fullName'),
      fullName: t('plants.1.fullName'),
      category: t('cat_hardy'),
      disease: t('plants.1.disease'),
      cause: t('plants.1.cause'),
      treatment: t('plants.1.treatment'),
      image: plant22
    },
    {
      id: 3,
      name: t('plants.2.fullName'),
      fullName: t('plants.2.fullName'),
      category: t('cat_indoor'),
      disease: t('plants.2.disease'),
      cause: t('plants.2.cause'),
      treatment: t('plants.2.treatment'),
      image: plant33
    },
    {
      id: 4,
      name: t('plants.3.fullName'),
      fullName: t('plants.3.fullName'),
      category: t('cat_climbing'),
      disease: t('plants.3.disease'),
      cause: t('plants.3.cause'),
      treatment: t('plants.3.treatment'),
      image: plant44
    },
    {
      id: 5,
      name: t('plants.4.fullName'),
      fullName: t('plants.4.fullName'),
      category: t('cat_succulent'),
      disease: t('plants.4.disease'),
      cause: t('plants.4.cause'),
      treatment: t('plants.4.treatment'),
      image: plant55
    },
    {
      id: 6,
      name: t('plants.5.fullName'),
      fullName: t('plants.5.fullName'),
      category: t('cat_indoor'),
      disease: t('plants.5.disease'),
      cause: t('plants.5.cause'),
      treatment: t('plants.5.treatment'),
      image: plant66
    },
    {
      id: 7,
      name: t('plants.6.fullName'),
      fullName: t('plants.6.fullName'),
      category: t('cat_house'),
      disease: t('plants.6.disease'),
      cause: t('plants.6.cause'),
      treatment: t('plants.6.treatment'),
      image: plant77
    },
    {
      id: 8,
      name: t('plants.7.fullName'),
      fullName: t('plants.7.fullName'),
      category: t('cat_hardy'),
      disease: t('plants.7.disease'),
      cause: t('plants.7.cause'),
      treatment: t('plants.7.treatment'),
      image: plant88
    },
    {
      id: 9,
      name: t('plants.8.fullName'),
      fullName: t('plants.8.fullName'),
      category: t('cat_climbing'),
      disease: t('plants.8.disease'),
      cause: t('plants.8.cause'),
      treatment: t('plants.8.treatment'),
      image: plant99
    },
    {
      id: 10,
      name: t('plants.9.fullName'),
      fullName: t('plants.9.fullName'),
      category: t('cat_succulent'),
      disease: t('plants.9.disease'),
      cause: t('plants.9.cause'),
      treatment: t('plants.9.treatment'),
      image: plant100
    },
    {
      id: 11,
      name: t('plants.10.fullName'),
      fullName: t('plants.10.fullName'),
      category: t('cat_indoor'),
      disease: t('plants.10.disease'),
      cause: t('plants.10.cause'),
      treatment: t('plants.10.treatment'),
      image: plant200
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfc] pt-24 pb-12 px-6 font-sans" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-3xl font-bold text-[#006b38] mb-2 tracking-tight">{t('title')}</h1>
        <p className="text-gray-400 text-sm">{t('subtitle')}</p>
      </div>

      {/* Grid of Minimal Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {plantsData.map((plant) => (
          <motion.div
            key={plant.id}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedPlant(plant)}
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-[15px] p-2 shadow-sm border border-gray-50 group-hover:shadow-xl group-hover:border-green-100 transition-all duration-300">
              <div className="relative aspect-square rounded-[15px] overflow-hidden mb-3">
                <img 
                  src={plant.image} 
                  alt={plant.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="px-2 pb-3 text-center">
                <h3 className="font-bold text-gray-800 text-sm truncate">{plant.name}</h3>
                <span className="text-[10px] text-green-600 font-semibold">{plant.category}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPlant && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlant(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`bg-white rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl relative z-10 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
            >
              <div className="relative h-56">
                <img src={selectedPlant.image} className="w-full h-full object-cover" alt="" />
                <button 
                  onClick={() => setSelectedPlant(null)}
                  className={`absolute top-4 ${i18n.language === 'ar' ? 'left-4' : 'right-4'} text-red-700 bg-white/80 w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-md`}
                >✕</button>
                <div className={`absolute bottom-4 ${i18n.language === 'ar' ? 'right-6' : 'left-6'} text-white drop-shadow-lg`}>
                    <h2 className="text-2xl font-bold">{selectedPlant.fullName}</h2>
                </div>
              </div>

              <div className="p-7 space-y-5">
                <div className={`flex gap-3 ${i18n.language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="flex-1">
                        <h4 className="text-red-600 font-bold text-[10px] uppercase">{t('pathologicalProblem')}</h4>
                        <p className="text-gray-800 font-bold leading-tight">{selectedPlant.disease}</p>
                    </div>
                    <div className="w-1 bg-red-500 rounded-full" />
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl">
                  <h4 className="text-gray-400 font-bold text-[9px] mb-1 uppercase tracking-widest">{t('causeAnalysis')}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{selectedPlant.cause}</p>
                </div>

                <div className={`bg-green-50 p-5 rounded-2xl border-[#008542] ${i18n.language === 'ar' ? 'border-r-4' : 'border-l-4'}`}>
                  <h4 className="text-[#008542] font-bold text-[10px] mb-1 uppercase">{t('immediateTreatment')}</h4>
                  <p className="text-sm text-gray-700 italic leading-relaxed">"{selectedPlant.treatment}"</p>
                </div>

                <button 
                  onClick={() => setSelectedPlant(null)}
                  className="w-full bg-[#008542] text-white py-3.5 rounded-2xl font-bold hover:bg-[#006b38] transition-all"
                >
                  {t('closeBtn')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}