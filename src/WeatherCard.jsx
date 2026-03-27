import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Wind, Zap } from "lucide-react";

const WeatherCard = ({ isArabic }) => {
  const [weather, setWeather] = useState(null);

  // 1. تحديد روابط الصور الخلفية لكل حالة
  const weatherBackgrounds = {
  sunny: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
  
  cloudy: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1920&q=80",
  
  rainy: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1920&q=80",
  
  night: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=80",
  
  default: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1920&q=80"
};

  useEffect(() => {
    let watchId;
    const fetchWeather = async (lat, lon) => {
      try {
        const key = "332999ba288d41549d1112711261403";
        const lang = isArabic ? 'ar' : 'en';
        const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${lat},${lon}&lang=${lang}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.current) {
          setWeather({
            temp: Math.round(data.current.temp_c),
            condition: data.current.condition.text,
            humidity: data.current.humidity,
            wind: data.current.wind_kph,
            icon: "https:" + data.current.condition.icon,
            city: data.location.name,
            isDay: data.current.is_day === 1,
            // تحديد فئة الطقس بناءً على النص القادم من API
            category: determineWeatherCategory(data.current.condition.text.toLowerCase())
          });
        }
      } catch (error) {
        console.error("Weather Error:", error);
      }
    };

    // دالة لتصنيف نص الطقس إلى فئات الخلفيات
    const determineWeatherCategory = (text) => {
  // تحويل النص لصغير لسهولة البحث
  const t = text.toLowerCase();

  // فئة المشمس / الصافي
  if (t.includes('sunny') || t.includes('clear') || t.includes('مشمس') || t.includes('صافي')) {
    return 'sunny';
  }
  
  // فئة الغائم / الضباب
  if (t.includes('cloud') || t.includes('overcast') || t.includes('mist') || t.includes('fog') || 
      t.includes('غائم') || t.includes('غيوم') || t.includes('ضباب') || t.includes('غبار')) {
    return 'cloudy';
  }
  
  // فئة الأمطار / العواصف
  if (t.includes('rain') || t.includes('drizzle') || t.includes('thunder') || t.includes('patchy') ||
      t.includes('مطر') || t.includes('رعد') || t.includes('زخات') || t.includes('ممطر')) {
    return 'rainy';
  }

  return 'default';
};

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(30.0444, 31.2357), // القاهرة كاحتياطي
        { enableHighAccuracy: true }
      );
    }
    return () => navigator.geolocation.clearWatch(watchId);
  }, [isArabic]);

  if (!weather) return null;

  // 2. اختيار الخلفية المناسبة (مع مراعاة الليل/النهار)
  const getBackgroundImage = () => {
    if (!weather.isDay && weather.category !== 'rainy') return weatherBackgrounds.night;
    return weatherBackgrounds[weather.category] || weatherBackgrounds.default;
  };

  // 3. مكوّن أنيميشن قطرات المطر
  const RainOverlay = () => (
    <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none z-0">
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="animate-rain absolute bg-white/50 w-[1.5px] h-[18px] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.6 + Math.random() * 0.4}s`,
          }}
        />
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        // تطبيق الخلفية الديناميكية مع تظليل خفيف للنصوص
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url(${getBackgroundImage()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className={`absolute z-50 top-29 md:top-32 flex flex-col gap-3 p-3 md:p-6 rounded-[2.5rem] 
        backdrop-blur-[1px] border border-white/30 shadow-2xl overflow-hidden
        w-[88%] left-1/2 -translate-x-1/2 md:translate-x-0  
        /* التعديل هنا: كبرنا الـ max-width سنة */
        lg:max-w-[370px] md:max-w-[400px] 
        ${isArabic ? 'md:left-40 md:right-auto' : 'md:right-40 md:left-auto'}`}
    >
      {/* 4. إظهار المطر فقط لو الحالة "ممطر" */}
      {weather.category === 'rainy' && <RainOverlay />}

      {/* المحتوى - z-10 ليكون فوق المطر والخلفية */}
      <div className="relative z-10 flex flex-col gap-3">
        
        {/* الجزء العلوي: المدينة والحرارة */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white/90 uppercase tracking-widest mb-1 drop-shadow-md">
              {weather.city}
            </span>
            <div className="flex items-end gap-1">
              <span className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">
                {weather.temp}°
              </span>
              <span className="text-lg font-bold text-white/80 pb-1 text-green-300">C</span>
            </div>
          </div>

          <div className="relative">
            <img
              src={weather.icon}
              alt="weather icon"
              className="w-14 h-14 md:w-16 md:h-16 drop-shadow-md animate-pulse"
            />
            {/* توهج خلف الأيقونة */}
            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
          </div>
        </div>

        {/* الجزء السفلي: تفاصيل الطقس */}
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-full w-fit drop-shadow-md">
            {isArabic ? `${weather.condition}` : `${weather.condition}`}
          </span>

          <div className="flex gap-4 mt-2 pt-3 border-t border-white/20">
            {/* الرطوبة */}
            <div className="flex items-center gap-1.5">
              <Droplets size={14} className="text-blue-300" />
              <span className="text-[10px] md:text-xs font-bold text-white/90">
                {isArabic ? `رطوبة: ${weather.humidity}%` : `Hum: ${weather.humidity}%`}
              </span>
            </div>

            {/* الرياح */}
            <div className="flex items-center gap-1.5">
              <Wind size={14} className="text-green-300" />
              <span className="text-[10px] md:text-xs font-bold text-white/90">
                {isArabic ? `رياح: ${weather.wind}` : `Wind: ${weather.wind}`} {isArabic ? "كم/س" : "km/h"}
              </span>
            </div>

            {/* علامة المباشر */}
            <div className="ms-auto flex items-center gap-1">
              <Zap size={10} className="text-yellow-400" />
              <span className="text-[9px] font-black text-white/60 tracking-tighter uppercase">
                {isArabic ? "مباشر" : "Live"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;