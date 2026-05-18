import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function formatClassName(rawName) {
  if (!rawName) return '';
  const [plant, disease] = rawName.split('___');
  const plantLabel = plant.replace(/_/g, ' ').replace(/\(.*?\)/g, '').trim();
  const diseaseLabel = disease
    ? disease.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : '';
  return diseaseLabel ? `${plantLabel} — ${diseaseLabel}` : plantLabel;
}

function confidenceColor(confidence) {
  if (confidence >= 80) return 'bg-green-600';
  if (confidence >= 50) return 'bg-orange-400';
  return 'bg-red-500';
}

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { image, predictedClass, confidence, top3 } = location.state || {};

  if (!image) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-500 font-bold">{t('no_data_available')}</p>
      </div>
    );
  }

  const displayName = formatClassName(predictedClass);
  const isHealthy = predictedClass?.toLowerCase().includes('healthy');
  const roundedConfidence = typeof confidence === 'number' ? Math.round(confidence) : 0;

  const getConfidenceLabel = () => {
    if (roundedConfidence >= 80) return t('high');
    if (roundedConfidence >= 50) return t('medium');
    return t('low');
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 md:p-10 font-sans" dir={t('dir') || 'ltr'}>
      <div className="max-w-6xl mx-auto">

        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-16">
          <div className="flex-1">
            <h1 className="text-4xl md:text-3xl font-black uppercase tracking-tight mb-4">
              {displayName || t('detection_result')}
            </h1>
            <p className="text-gray-600 leading-relaxed max-w-xl">
              {isHealthy
                ? t('healthy_message')
                : t('disease_message', { displayName: displayName })}
            </p>
          </div>

          <div className="relative flex-1 flex justify-center">
            <div className="absolute -top-10 left-0 bg-[#166534] text-white p-3 rounded-md w-48 shadow-lg hidden md:block">
              <h4 className="font-bold text-sm border-b border-green-400 mb-1 pb-1">{t('detected_plant')}</h4>
              <p className="text-[10px] leading-tight opacity-90">
                {predictedClass ? predictedClass.split('___')[0].replace(/_/g, ' ') : '—'}
              </p>
              <div className="absolute h-10 w-px bg-green-700 -bottom-10 left-1/2"></div>
            </div>

            <img
              src={image}
              alt={t('detected_plant')}
              className="w-64 h-64 md:w-80 md:h-80 object-contain"
            />

            <div className="absolute top-0 -right-4 bg-[#166534] text-white p-3 rounded-md w-48 shadow-lg hidden md:block">
              <h4 className="font-bold text-sm border-b border-green-400 mb-1 pb-1">{t('confidence')}</h4>
              <p className="text-[10px] leading-tight opacity-90">{roundedConfidence}% — {getConfidenceLabel()}</p>
              <div className="absolute h-6 w-10 border-l border-t border-green-700 -left-10 top-1/2"></div>
            </div>
          </div>
        </div>

        {/* --- Grid Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Diagnosis - Dark Card */}
          <div className="bg-[#166534] text-white p-8 rounded-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">◆</span>
              <h3 className="text-2xl font-serif italic font-bold">{t('diagnosis')}</h3>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              {isHealthy
                ? t('healthy_diagnosis')
                : t('disease_diagnosis', { displayName: displayName, confidence: roundedConfidence })}
            </p>
          </div>

          {/* How to care */}
          <div className="bg-[#E5E7EB] p-8 rounded-sm">
            <div className="flex items-center gap-2 mb-3 text-green-800">
              <span className="text-xl">🌿</span>
              <h3 className="text-2xl font-serif italic font-bold">{t('how_to_care')}</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              {isHealthy
                ? t('healthy_care')
                : t('disease_care')}
            </p>
          </div>

          {/* Treatment */}
          <div className="bg-[#E5E7EB] p-8 rounded-sm">
            <div className="flex items-center gap-2 mb-3 text-green-800">
              <span className="text-xl">💊</span>
              <h3 className="text-2xl font-serif italic font-bold">{t('treatment')}</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              {isHealthy
                ? t('healthy_treatment')
                : t('disease_treatment')}
            </p>
          </div>

          {/* Tips & Tricks */}
          <div className="bg-[#E5E7EB] p-8 rounded-sm">
            <div className="flex items-center gap-2 mb-3 text-green-800">
              <span className="text-xl">💡</span>
              <h3 className="text-2xl font-serif italic font-bold">{t('tips_and_tricks')}</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              {t('tips_content')}
            </p>
          </div>
        </div>

        {/* --- Confidence Bar --- */}
        <div className="border-2 border-green-800 rounded-xl p-6 mb-10">
          <h3 className="text-2xl font-bold text-green-900 mb-4">{t('prediction_confidence')}</h3>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${confidenceColor(roundedConfidence)}`}
              style={{ width: `${roundedConfidence}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 items-center">
            <span className="text-2xl font-bold text-green-800">{roundedConfidence}%</span>
            <span className="text-xl font-bold text-gray-400">{getConfidenceLabel()}</span>
          </div>
        </div>

        {/* --- Top 3 Predictions --- */}
        {top3 && top3.length > 0 && (
          <div className="border border-gray-200 rounded-xl p-6 mb-10">
            <h3 className="text-xl font-bold text-green-900 mb-5">{t('top_predictions')}</h3>
            <ol className="flex flex-col gap-4">
              {top3.map((item, i) => {
                const itemConf = Math.round(item.confidence);
                const getItemConfidenceLabel = () => {
                  if (itemConf >= 80) return t('high');
                  if (itemConf >= 50) return t('medium');
                  return t('low');
                };
                return (
                  <li key={i} className="flex items-center gap-4">
                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-green-700 text-white text-sm font-bold shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-700">
                          {formatClassName(item.class)}
                        </span>
                        <span className="text-sm font-bold text-green-800">{itemConf}% ({getItemConfidenceLabel()})</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${confidenceColor(itemConf)}`}
                          style={{ width: `${itemConf}%` }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="bg-green-800 text-white px-10 py-3 rounded-full font-bold hover:bg-green-900 transition-colors shadow-lg"
        >
          {t('go_back')}
        </button>

      </div>
    </div>
  );
}