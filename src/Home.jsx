import React, { useState, useEffect, useRef } from 'react';
import image201 from "./assets/flowersss.png";
import uploadIcon from "./assets/Vector.png"; 
import checkIcon from "./assets/Group.png";
import scanIcon from "./assets/Vector (1).png";
import chatbotImg from "./assets/chatbot.png";
import planko from "./assets/plank2.png"
import plankoo from "./assets/plank3.png"
import planto from "./assets/planto.jpg"
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, StopCircle, Send } from "lucide-react"; 
import { useTranslation } from "react-i18next";
import Footer from './Footer';

export default function AboutPage() {
  const { t, i18n } = useTranslation(); 
  const [showText, setShowText] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const hasloged = localStorage.getItem("hasloged") === "true";
    if (!hasloged) {
      navigate("/login");
    }
  }, [navigate]);

  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    const interval = setInterval(() => {
      setShowText(true);
      setTimeout(() => setShowText(false), 3000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const startRecording = async () => {
    if (!navigator.mediaDevices) return alert("Your browser does not support audio recording");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks = [];
      mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioURL = URL.createObjectURL(audioBlob);
        setMessages(prev => [...prev, { type: 'audio', content: audioURL }]);
      };
      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const sendMessage = () => {
    if (inputValue.trim() !== '') {
      setMessages(prev => [...prev, { type: 'text', content: inputValue }]);
      setInputValue('');
    }
  };

  return (
    <div className="relative" dir={isArabic ? "rtl" : "ltr"}>
      <section className='w-full min-h-screen bg-[url(/background.jpg)] relative bg-cover bg-center overflow-hidden px-5 md:px-10'>
        <img
          src={image201}
          alt="hero-plant"
          className={`absolute -bottom-15 z-10 w-[350px] md:w-[370px] lg:w-[630px] transition-all duration-700
            ${isArabic ? 'right-[-100px] md:right-1/2 lg:translate-x-1/2' : 'left-[-100px] md:left-1/2 lg:-translate-x-1/2'}`}
        />

        <div className='flex flex-col md:flex-row w-full z-20 min-h-[80vh] relative'>
          <div className="flex flex-col items-start gap-4 md:gap-[100px] pt-6 md:pt-0 md:items-center md:flex-row md:justify-between w-full">
            <div className={`flex flex-col items-start gap-10 md:gap-60 max-w-2xl text-black py-2 md:py-5 ${isArabic ? 'text-right' : 'text-left'}`}>
              <h1 className='text-[30px] md:text-[43px] lg:text-[70px] font-kufam leading-[0.95]'>
                {t("hero_title")}
              </h1>
              <div>
                <h2 className='text-[25px] md:text-[30px] lg:text-[40px] font-kufam mb-1'>
                  {t("hero_model_name")}
                </h2>
                <p className='text-[10px] md:text-[11px] lg:text-[15px] font-poppins text-gray-600 md:max-w-[270px] lg:max-w-[500px]'>
                  {t("hero_description")}
                </p>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center justify-between gap-2 md:gap-10 mt-8 md:mt-10 w-full md:w-auto px-2">
              <div className="flex flex-row md:flex-col items-center flex-1 md:flex-none">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#34A853] flex items-center cursor-pointer justify-center shadow-lg shrink-0">
                  <img src={scanIcon} className="w-5 h-5 md:w-7 md:h-7 invert" alt="scan" />
                </div>
                <div className="flex-1 md:flex-none h-[2px] md:h-24 w-full md:w-px border-t-2 md:border-l-2 border-dotted border-green-700/30 mx-2 md:mx-0"></div>
              </div>

              <div className="flex flex-row md:flex-col items-center flex-1 md:flex-none">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-lg border shrink-0">
                  <img src={checkIcon} className="w-6 h-6 md:w-8 md:h-8" alt="check" />
                </div>
                <div className="flex-1 md:flex-none h-[2px] md:h-24 w-full md:w-px border-t-2 md:border-l-2 border-dotted border-green-700/30 mx-2 md:mx-0"></div>
              </div>
                
              <div className="flex flex-col items-center">
                <div  className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#34A853] flex items-center justify-center  cursor-pointer shadow-lg shrink-0">
                   <img   src={uploadIcon}  className="w-5 h-5 md:w-6 md:h-6 invert" alt="upload" />
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className={`absolute bottom-2 z-50 flex flex-col items-center pointer-events-auto ${isArabic ? '-left-36 md:-left-20' : '-right-36 md:-right-20'}`}>
          {showText && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mb-2 px-5 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-full shadow-md pointer-events-auto"
            >
                <h1>{t("chat_with_me")}</h1>
            </motion.div>
          )}
          <img 
            src={chatbotImg} 
            className="w-[450px] md:w-[470px] lg:w-[600px] cursor-pointer hover:scale-105 transition-transform pointer-events-auto" 
            onClick={() => setOpenChat(!openChat)} 
            alt="chatbot" 
          />
        </div>
      

       <AnimatePresence>
          {openChat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className={`absolute z-50 w-[320px] h-[450px] md:w-[450px] md:h-[550px] bg-white shadow-2xl rounded-3xl flex flex-col overflow-hidden border border-green-200 bottom-[80px] ${isArabic ? 'left-4 md:left-[100px]' : 'right-4 md:right-[100px]'}`}
            >
              <div className="bg-gradient-to-r from-green-600 to-green-500 text-white font-bold p-4 flex items-center justify-between">
                <h1 className="flex items-center gap-2">💬 {t("customer_chat")}</h1>
                <button onClick={() => setOpenChat(false)} className="text-white text-2xl font-bold hover:rotate-90 transition-transform">×</button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-green-50 space-y-3 text-black">
                {messages.length === 0 && <p className="text-center text-gray-400 mt-10 text-sm">ابدأ المحادثة الآن...</p>}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`p-3 rounded-2xl shadow-sm max-w-[80%] ${msg.type === 'text' ? 'bg-white border' : 'bg-green-100'}`}>
                    {msg.type === 'text' ? (
                      <p className="text-sm">{msg.content}</p>
                    ) : (
                      <audio controls src={msg.content} className="w-full h-8" />
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 bg-white border-t flex items-center gap-2">
                <button 
                  onClick={recording ? stopRecording : startRecording}
                  className={`p-3 rounded-full transition-all ${recording ? 'bg-red-500 animate-pulse text-white' : 'bg-gray-100 text-green-600 hover:bg-green-100'}`}
                >
                  {recording ? <StopCircle size={22} /> : <Mic size={22} />}
                </button>

                <input
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 p-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 text-sm text-black outline-none"
                  placeholder={t("type_message")}
                />
                
                <button 
                  onClick={sendMessage} 
                  className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-md"
                >
                  <Send size={20} className={isArabic ? "rotate-180" : ""} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className='w-full h-auto bg-white flex justify-center items-center'>
        <div className='flex flex-col-reverse justify-center items-center lg:flex-row gap-10 py-12'>
          <div className="left">
            <img className='w-[300px] lg:w-[550px] h-[255px] lg:h-[430px] transition-transform duration-500 hover:scale-105 rounded-xl shadow-lg' src={planto} alt="planto"/>
          </div>
          <div className={`right flex flex-col gap-3 px-4 ${isArabic ? 'text-right' : 'text-left'}`}>
            <h1 className='font-kufam text-[38px] lg:text-[83px] text-[#388F4C] uppercase'>{t("about_title")}</h1>
            <h1 className='font-poppins text-[17px] lg:text-[35px] text-[#388F4C] max-w-[310px] lg:max-w-[530px] leading-tight '>{t("about_subtitle")}</h1>
            <p className='max-w-[300px] lg:max-w-[650px] text-[11px] lg:text-[15px] text-gray-700 leading-relaxed'>{t("about_description")}</p>
            <div className={`flex mt-6 ${isArabic ? 'justify-start' : 'justify-end'}`}>
              <button onClick={() => { navigate("/about"); window.scrollTo(0, 0); }} className="flex items-center gap-3 bg-green-700 text-white px-5 lg:px-9 py-2 rounded-full hover:bg-green-800 transition shadow-lg group">
                <span className="text-sm font-kufam">{t("show_more")}</span>
                <span className={`w-8 h-8 flex items-center justify-center bg-white text-green-700 rounded-full text-sm font-bold transition-transform duration-300 ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : 'rotate-0 group-hover:translate-x-1'}`}>→</span>
              </button>
            </div>
          </div>
        </div>
      </section> 
      
      <div className="w-full py-16 px-4 bg-white font-sans text-center">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-medium text-[#3d8c40] mb-2">
            {t("services_title")}
          </h1>
          <p className="text-[#5cb85c] text-lg md:text-xl">
            {t("services_subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          <div className="relative group w-full md:w-[450px] h-[280px] overflow-hidden shadow-xl ">
            <div className="absolute top-5 left-0 z-10 bg-[#D9D9D98C] backdrop-blur-md px-8 py-2 rounded-r-full ">
              <span className="text-[#000000] font-bold text-lg">
                {t("service_vital_signs")}
              </span>
            </div>
            <img 
              src={plankoo} 
              alt="Plant vital signs" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          <div className="relative group w-full md:w-[450px] h-[280px] overflow-hidden shadow-xl ">
            <div className="absolute top-5 left-0 z-10 bg-[#D9D9D98C] backdrop-blur-md px-8 py-2 rounded-r-full shadow-sm">
              <span className="text-[#000000] font-bold text-lg">
                {t("service_suitable_dust")}
              </span>
            </div>
            <img 
              src={planko} 
              alt="Soil health" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}