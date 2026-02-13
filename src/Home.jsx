import React, { useState, useEffect, useRef } from 'react';
import image201 from "./assets/flowersss.png";
import uploadIcon from "./assets/Vector.png"; 
import checkIcon from "./assets/Group.png";
import scanIcon from "./assets/Vector (1).png";
import chatbotImg from "./assets/chatbot.png";
import planko from "./assets/plank2.png"
import plankoo from "./assets/plank3.png"
import planto from "./assets/planto.jpg"
import plantsVideo from "./assets/plantvideo.mp4";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, StopCircle, Send, Play, ChevronRight, X, Upload as UploadIcon } from "lucide-react"; 
import tree from "./assets/tree.png" 
import { useTranslation } from "react-i18next";
import Footer from './Footer';
import { AiOutlineCloseCircle } from "react-icons/ai";

export default function AboutPage() {
  const { t, i18n } = useTranslation(); 
  const [showText, setShowText] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [showVideo, setShowVideo] = useState(false); 
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [recording, setRecording] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  

  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null); 
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


  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      type: file.type.split('/')[1]?.toUpperCase() || "IMG",
      preview: URL.createObjectURL(file) 
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const removeFile = (id) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== id));
  };

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
        
  
       <AnimatePresence>
  {showUploadModal && (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowUploadModal(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
      />
    
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        
        dir={isArabic ? "rtl" : "ltr"}
        className="relative z-[110] bg-white shadow-2xl w-full max-w-[480px] text-black border border-gray-100 rounded-3xl overflow-hidden flex flex-col"
      >
        
        <div className="p-6 pb-0 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-lg">
            {isArabic ? "تحميل الملفات" : "Upload files"}
          </h2>
          <button 
            onClick={() => setShowUploadModal(false)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <AiOutlineCloseCircle className='cursor-pointer' size={32} />
          </button>
        </div>

        <div className='p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]'>
          
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-blue-100 rounded-3xl p-6 min-h-[200px] flex flex-col items-center justify-center bg-blue-50/20 overflow-hidden transition-colors hover:bg-blue-50/40"
          >
            {selectedFiles.length > 0 ? (
              <div className="w-full flex flex-col items-center">
                <img 
                  src={selectedFiles[selectedFiles.length - 1].preview} 
                  alt="preview" 
                  className="max-h-[160px] rounded-xl object-contain shadow-sm mb-4" 
                />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="text-xs font-bold text-green-600 hover:underline"
                >
                  {isArabic ? "تغيير الملف المختار" : "Change Selection"}
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
                  {isArabic ? "اختر ملفًا أو قم بسحبه وإفلاته هنا" : "Choose a file or drag & drop it here"}
                </p>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="px-8 py-2 bg-white border cursor-pointer border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition shadow-sm active:scale-95"
                >
                  {isArabic ? "تصفح الملفات" : "Browse File"}
                </button>
              </>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple 
              className="hidden" 
              accept="image/*"
            />
          </div>

          
          <div className="flex flex-col gap-3">
            {selectedFiles.map((file) => (
              <motion.div 
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3"
              >
                <div className="bg-red-500 text-white text-[9px] font-bold p-1 rounded">{file.type}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700 truncate max-w-[180px]">{file.name}</span>
                    <button onClick={() => removeFile(file.id)} className="text-gray-400 cur\ hover:text-red-500">🗑️</button>
                  </div>
                  <div className="text-[10px] text-green-600 font-bold mt-1">
                    ✓ {file.size} • {isArabic ? "تم التحميل" : "Completed"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
        

        <img
          src={image201}
          alt="hero-plant"
          className={`absolute -bottom-15 z-10 w-[350px] md:w-[370px] lg:w-[630px] transition-all duration-700
            ${isArabic ? 'right-[-100px] md:right-1/2 lg:translate-x-1/2' : 'left-[-100px] md:left-1/2 lg:-translate-x-1/2'}`}
        />

        <div className='flex flex-col md:flex-row w-full z-20 min-h-[80vh] relative'>
          <div className="flex flex-col items-start gap-4 md:gap-[100px] pt-6 md:pt-0 md:items-center md:flex-row md:justify-between w-full">
            <div className={`flex flex-col items-start gap-10 md:gap-60 max-w-2xl text-black py-2 md:py-5 ${isArabic ? 'text-right' : 'text-left'}`}>
              <h1 className='text-[30px] md:text-[40لpx] font lg:text-[70px]  leading-[0.95]'>
                {t("hero_title")}
              </h1>
              <div>
                <h2 className='text-[25px] md:text-[30px] lg:text-[40px] font-poppins mb-1'>
                  {t("hero_model_name")}
                </h2>
                <p className='text-[10px] md:text-[11px] lg:text-[15px] font-poppins text-gray-600 md:max-w-[270px] lg:max-w-[500px]'>
                  {t("hero_description")}
                </p>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center justify-between gap-2 md:gap-10 mt-8 md:mt-10 w-full md:w-auto px-2">
              <div className="flex flex-row md:flex-col items-center flex-1 md:flex-none">
                <div onClick={() => setShowUploadModal(true)} className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#34A853] flex items-center cursor-pointer justify-center shadow-lg shrink-0">
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
                <div onClick={() => setShowUploadModal(true)} className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#34A853] flex items-center justify-center  cursor-pointer shadow-lg shrink-0">
                   <img src={uploadIcon} className="w-5 h-5 md:w-6 md:h-6 invert" alt="upload" />
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
                <button onClick={() => setOpenChat(false)} className="text-white text-3xl font-bold cursor-pointer hover:rotate-90 transition-transform">×</button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-green-50 space-y-3 text-black">
                {messages.length === 0 && <p className="text-center text-gray-400 mt-10 text-sm">ابدأ المحادثة الآن...</p>}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`p-3 rounded-2xl shadow-sm max-w-[90%]   ${msg.type === 'text' ? 'bg-white border' : 'bg-green-100'}`}>
                    {/* break-words overflow-hidden whitespace-pre-wrap  */}
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
                  <Send  size={20} className={  isArabic ? "rotate-180" : ""} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className='w-full h-auto bg-white flex justify-center items-center'>
        <div className='flex flex-col-reverse justify-center items-center lg:flex-row gap-10 py-12'>
          <div className="left">
            <img className='w-[300px] lg:w-[550px] h-[255px] lg:h-[430px] transition-transform duration-500 hover:scale-105  shadow-lg' src={planto} alt="planto"/>
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
          <h1 className="text-5xl md:text-6xl font-medium font-kufam text-[#3d8c40] mb-2">
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

      <section className="w-full bg-white py-20 px-4 md:px-10 relative overflow-visible">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="max-w-xl flex flex-col items-start text-left">
            <h1 className="text-4xl md:text-5xl font-medium font-kufam text-green-700 mb-4">
             {t("categories_title")}
            </h1>
            <p className="text-green-600 font-medium tracking-wide mb-4">
              {t("categories_subtitle")}
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {t("categories_description")}
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-6">
              <button onClick={() => { navigate('/plants'); window.scrollTo({ top: 0, behavior: 'smooth' });}} className="px-3.5 lg:px-6 py-2 border border-green-600 text-green-700 cursor-pointer rounded-full font-medium hover:bg-green-600 hover:text-white transition">
                {t("explore")}
              </button>
              <button 
                onClick={() => setShowVideo(true)}
                className="flex items-center gap-2 text-green-700 font-medium cursor-pointer hover:scale-105 transition-transform"
              >
                <span  className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white shadow-lg">
                  <Play size={18} fill="currentColor" />
                </span>
                {t("live_demo")}
              </button>
            </div>
          </div>
          <div  className="relative cursor-pointer bg-[#f1f1f1] rounded-3xl p-6 w-[280px] md:w-[320px] shadow-lg">
   
  
            <div className="flex justify-center">
              <img src={tree} alt="Plant" className="w-[230px] h-[230px] object-contain -mt-20" />
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-green-600 mb-1">{t("trendy_plant")}</p>
              <h2 className="text-xl font-semibold text-green-800 mb-4">Calathea Plant</h2>
              <button className="px-4 py-1 text-xs bg-green-600 text-white rounded-full mb-4">{t("example_btn")}</button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-green-700"></span>
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
              </div>
              <ChevronRight className={`text-green-700 cursor-pointer ${isArabic ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none"
            >
              <div className="absolute inset-0 bg-transparent pointer-events-auto" onClick={() => setShowVideo(false)}></div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                className="relative w-[95%] md:w-[80%] lg:w-[70%] max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-2 border-green-600/20 pointer-events-auto z-[110]"
              >
                <button onClick={() => setShowVideo(false)} className="absolute top-4 right-4 z-[120] bg-white text-green-700 hover:bg-green-100 p-1.5 rounded-full shadow-md"><X size={20} /></button>
                <video className="w-full h-full object-cover" autoPlay controls src={plantsVideo}>Your browser does not support the video tag.</video>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      <Footer/>
    </div>
  );
}