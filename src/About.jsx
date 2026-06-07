import React from 'react'; 
import { useTranslation } from 'react-i18next'; 
import plantImage from './assets/plant.png'; 
import Footer from './Footer'; 
import founder1 from './assets/youssef.jpeg';
import founder2 from './assets/kadry.jpeg';
import founder3 from './assets/moazz.jpeg';
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import Flag from 'react-world-flags';
export default function AboutUs() {
  const { t } = useTranslation();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div className="flex flex-col min-h-screen">
      
      <section className="w-full min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 py-12 md:px-16 lg:px-24 gap-10 md:gap-16">
          
          <div className="w-full md:w-[55%] flex flex-col space-y-4 text-left rtl:text-right">
            <h1 className="text-4xl md:text-6xl lg:text-6xl font-kufam text-black tracking-tight uppercase">
              {t('about_title')}
            </h1>
            
            <h3 className="text-2xl md:text-3xl font-medium text-black">
              {t('who_we_are')}
            </h3>
            
            <p className="text-lg md:text-xl lg:text-2xl font-extralight text-gray-800 leading-relaxed text-justify">
              {t('about_description')}
            </p>
          </div>

          <div className="w-full md:w-[40%] flex justify-center items-center">
            <div className="relative w-full max-w-md">
              <img 
                src={plantImage} 
                alt="Potted Plants" 
                className="w-full h-auto object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      <div 
        ref={ref}
        className="w-full min-h-[70vh] bg-cover bg-center flex items-center justify-center py-16"
        style={{ 
          backgroundImage: `linear-gradient(0deg, #021B10E8, #021B10E8), url('/photo-flowers.png')` 
        }}
      >
        <div className="container mx-auto px-4 flex flex-col items-center gap-12">
          
          <div className="text-center flex flex-col gap-2 text-white">
            <h1 className="font-semibold font-kufam text-[31px] md:text-[45px] tracking-wide uppercase">
              {t('numbers_title')}
            </h1>
            <p className="font-extralight text-[20px] md:text-[31px]">
              {t('numbers_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
            
            <div className="flex flex-col items-center gap-6">
              <h1 className="font-semibold text-[#388F4C] text-[50px] md:text-[62px] leading-none">
                {inView ? <CountUp end={23} duration={4} /> : 0}+
              </h1>
              <div className="w-full max-w-[280px] h-[60px] bg-[#D9D9D9] flex justify-center items-center rounded-sm shadow-lg">
                <h1 className="font-extralight text-black text-sm md:text-base">
                  {t('exp_years')}
                </h1>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <h1 className="font-semibold text-[#388F4C] text-[50px] md:text-[62px] leading-none">
                {inView ? <CountUp end={35} duration={4} /> : 0}K
              </h1>
              <div className="w-full max-w-[280px] h-[60px] bg-[#D9D9D9] flex justify-center items-center rounded-sm shadow-lg">
                <h1 className="font-extralight text-black text-sm md:text-base">
                  {t('test_plants')}
                </h1>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <h1 className="font-semibold text-[#388F4C] text-[50px] md:text-[62px] leading-none">
                {inView ? <CountUp end={70} duration={4} /> : 0}+
              </h1>
              <div className="w-full max-w-[280px] h-[60px] bg-[#D9D9D9] flex justify-center items-center rounded-sm shadow-lg">
                <h1 className="font-extralight text-black text-sm md:text-base">
                  {t('vital_signs')}
                </h1>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <h1 className="font-semibold text-[#388F4C] text-[50px] md:text-[62px] leading-none">
                {inView ? <CountUp end={33} duration={4} /> : 0}+
              </h1>
              <div className="w-full max-w-[280px] h-[60px] bg-[#D9D9D9] flex justify-center items-center rounded-sm shadow-lg">
                <h1 className="font-extralight text-black text-sm md:text-base">
                  {t('suitable_dust')}
                </h1>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* Founders Section */}
<section className="w-full bg-white py-20 px-6">
  <div className="max-w-7xl mx-auto">

    <div className="text-center mb-14">
      <h2 className="text-4xl md:text-5xl font-kufam font-semibold text-black uppercase">
        Platform Founders
      </h2>

      <p className="mt-4 text-lg md:text-xl text-gray-600 font-light">
        Meet the team behind leaf scan
        
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

      {/* Mohamed Kadry */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        <img
          src={founder2}
          alt="Mohamed Kadry"
          className="w-full h-[320px] object-cover"
        />

        <div className="p-6 text-center">
          <h3 className="text-3xl font-bold text-black">
            Mohamed Kadry
          </h3>

          <p className="text-blue-500 text-lg mt-2">
            Founder • UI/UX Developer
          </p>

          <div className="mt-6 space-y-4 text-gray-600">
<p className='flex justify-center items-center'>
  <Flag code="EG" className="w-6 h-auto rounded-sm shadow-sm" />
 </p>

            <p className="flex items-center justify-center gap-2">
              🎓Bachelor of Computer Science — Misr University for Science and Technology (MUST)
            </p>

            <p className="flex items-center justify-center gap-2">
              📅 Class of 2026
            </p>

            <p className="flex items-center justify-center gap-2">
              📍 Cairo, Egypt
            </p>

          </div>
        </div>
      </div>

      {/* Moazz Alsadeq */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        <img
          src={founder3}
          alt="Moazz Alsadeq"
          className="w-full h-[320px] object-cover"
        />

        <div className="p-6 text-center">
          <h3 className="text-3xl font-bold text-black">
            Moazz Alsadeq
          </h3>

          <p className="text-blue-500 text-lg mt-2">
            Founder • Frontend Developer
          </p>

          <div className="mt-6 space-y-4 text-gray-600">

  <p className='flex justify-center items-center'>
  <Flag code="EG" className="w-6 h-auto rounded-sm shadow-sm" />
 </p>

            <p className="flex items-center justify-center gap-2">
           🎓Bachelor of Computer Science — Misr University for Science and Technology (MUST)
            </p>

            <p className="flex items-center justify-center gap-2">
              📅 Class of 2026
            </p>

            <p className="flex items-center justify-center gap-2">
              📍 Cairo, Egypt
            </p>

          </div>
        </div>
      </div>

      {/* Youssef Medhat */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        <img
          src={founder1}
          alt="Youssef Medhat"
          className="w-full h-[320px] object-cover"
        />

        <div className="p-6 text-center">
          <h3 className="text-3xl font-bold text-black">
            Youssef Medhat
          </h3>

          <p className="text-blue-500 text-lg mt-2">
            Founder • Backend Developer
          </p>

          <div className="mt-6 space-y-4 text-gray-600">

<p className='flex justify-center items-center'>
  <Flag code="EG" className="w-6 h-auto rounded-sm shadow-sm" />
 </p>

            <p className="flex items-center justify-center gap-2">
              🎓Bachelor of Computer Science — Misr University for Science and Technology (MUST)
            </p>

            <p className="flex items-center justify-center gap-2">
              📅 Class of 2026
            </p>

            <p className="flex items-center justify-center gap-2">
              📍 Cairo, Egypt
            </p>
 
          </div>
        </div>
      </div>

    </div>

  </div>
</section>
      <Footer />
    </div>
  );
}

