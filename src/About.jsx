
import React from 'react'; 
import { useTranslation } from 'react-i18next'; 
import plantImage from './assets/plant.png'; 
import Footer from './Footer'; 

export default function AboutUs() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      
      <section className="w-full min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 py-12 md:px-16 lg:px-24 gap-10 md:gap-16">
          
          <div className="w-full md:w-[55%] flex flex-col space-y-4 text-left rtl:text-right">
            <h1 className="text-5xl md:text-6xl lg:text-6xl text-black tracking-tight uppercase">
              {t('about_title')}
            </h1>
            
            <h3 className="text-2xl md:text-3xl font-medium text-black">
              {t('who_we_are')}
            </h3>
            
            <p className="text-lg md:text-xl lg:text-2xl font-light text-gray-800 leading-relaxed text-justify">
              {t('about_description')}
            </p>
          </div>

          <div className="w-full md:w-[40%] flex justify-center items-center">
            <div className="relative w-full max-w-md">
              <img 
                src={plantImage} 
                alt="Potted Plants" 
                className="w-full h-auto object-contain rounded-2xl transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      
      <div 
        className="w-full min-h-[70vh] bg-cover bg-center flex items-center justify-center py-16"
        style={{ 
          backgroundImage: `linear-gradient(0deg, #021B10E8, #021B10E8), url('/photo-flowers.png')` 
        }}
      >
        <div className="container mx-auto px-4 flex flex-col items-center gap-12">
          
          <div className="text-center flex flex-col gap-2 text-white">
            <h1 className="font-semibold text-[31px] md:text-[45px] tracking-wide uppercase">
               {t('numbers_title')}
            </h1>
            <p className="font-extralight text-[20px] md:text-[31px]">
               {t('numbers_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
            
          
            <div className="flex flex-col items-center gap-2">
              <h1 className="font-semibold text-[#388F4C] text-[50px] md:text-[62px] leading-none">23+</h1>
              <div className="w-full max-w-[280px] h-[60px] bg-[#D9D9D9] flex justify-center items-center rounded-sm shadow-lg">
                <h1 className="font-extralight text-black text-sm md:text-base">
                   {t('exp_years')}
                </h1>
              </div>
            </div>

            
            <div className="flex flex-col items-center gap-2">
              <h1 className="font-semibold text-[#388F4C] text-[50px] md:text-[62px] leading-none">35K</h1>
              <div className="w-full max-w-[280px] h-[60px] bg-[#D9D9D9] flex justify-center items-center rounded-sm shadow-lg">
                <h1 className="font-extralight text-black text-sm md:text-base">
                   {t('test_plants')}
                </h1>
              </div>
            </div>

            
            <div className="flex flex-col items-center gap-2">
              <h1 className="font-semibold text-[#388F4C] text-[50px] md:text-[62px] leading-none">70+</h1>
              <div className="w-full max-w-[280px] h-[60px] bg-[#D9D9D9] flex justify-center items-center rounded-sm shadow-lg">
                <h1 className="font-extralight text-black text-sm md:text-base">
                   {t('vital_signs')}
                </h1>
              </div>
            </div>

            
            <div className="flex flex-col items-center gap-2">
              <h1 className="font-semibold text-[#388F4C] text-[50px] md:text-[62px] leading-none">33+</h1>
              <div className="w-full max-w-[280px] h-[60px] bg-[#D9D9D9] flex justify-center items-center rounded-sm shadow-lg">
                <h1 className="font-extralight text-black text-sm md:text-base">
                   {t('suitable_dust')}
                </h1>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}