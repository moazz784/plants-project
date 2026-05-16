import React, { useState, useEffect, useRef } from 'react';
import image201 from "./assets/flowersss.png";
import uploadIcon from "./assets/Vector.png"; 
import checkIcon from "./assets/Group.png";
import scanIcon from "./assets/Vector (1).png";
import chatbotImg from "./assets/chatbot.png";
import planko from "./assets/plank2.png";
import plankoo from "./assets/plank3.png";
import planto from "./assets/planto.jpg";
import plantsVideo from "./assets/plantvideo.mp4";
import tree from "./assets/tree.png";
import tree22 from "./assets/tree22.png";
import tree33 from "./assets/tree33.png";
import WeatherCard from './WeatherCard';
import Footer from './Footer';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, StopCircle, Send, Play, ChevronRight, X, Camera,
  MessageSquarePlus, History as HistoryIcon 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";
import { api } from "./api";
import toast from "react-hot-toast";

export default function AboutPage() {
  const { t, i18n } = useTranslation(); 
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const isArabic = i18n.language === 'ar';
  const [showText, setShowText] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [showVideo, setShowVideo] = useState(false); 
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [recording, setRecording] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [[current, direction], setCurrent] = useState([0, 0]);
  
  // Popup state: 'scan' or 'upload'
  const [popupTarget, setPopupTarget] = useState('scan');
  
  // Camera states
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem("leafScan_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const startNewChat = () => {
    if (messages.length > 0) {
      const newEntry = {
        id: Date.now(),
        title: messages[0].content.substring(0, 25) + "...",
        messages: messages
      };
      setChatHistory(prev => [newEntry, ...prev]);
      setMessages([]);
    }
    setCurrentSessionId(null);
  };
  
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef(null); 
  const mediaRecorderRef = useRef(null);
   
  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    const userText = inputValue;
    const userMessage = { type: 'text', content: userText, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    const thinkingId = Date.now();
    setMessages((prev) => [...prev, { id: thinkingId, type: 'text', content: isArabic ? "جاري التفكير..." : "Thinking...", sender: 'bot' }]);
    try {
      const conversation = [...messages, userMessage]
        .filter(m => m.type === 'text')
        .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.content }));

      const res = await api.chat.send(currentSessionId, conversation, isArabic ? 'ar' : 'en');
      setCurrentSessionId(res.sessionId);
      setMessages((prev) => prev.map(msg => msg.id === thinkingId ? { ...msg, content: res.content } : msg));
    } catch (error) {
      console.error('Chat failed:', error);
      setMessages((prev) => prev.map(msg => msg.id === thinkingId ? { ...msg, content: isArabic ? "عذراً، حدث خطأ." : "Sorry, something went wrong." } : msg));
    }
  };
  
  const plants = [
    { id: 1, name: "Calathea Plant", image: tree},
    { id: 2, name: "Snake Plant", image: tree22 },
    { id: 3, name: "Aloe Vera", image: tree33 },
  ];
  
  useEffect(() => {
    localStorage.setItem("leafScan_history", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Cycle popup every 4 seconds between scan and upload
  useEffect(() => {
    const interval = setInterval(() => {
      setPopupTarget(prev => prev === 'scan' ? 'upload' : 'scan');
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setShowText(prev => !prev), 3000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  const notifyIfScanNotPersisted = (data) => {
    if (data && data.persistedToDashboard === false) {
      toast(
        isArabic
          ? 'اكتمل التحليل، لكن لم تُحدَّث إحصائيات لوحة التحكم على الخادم (تحقق من ترحيل قاعدة البيانات).'
          : 'Analysis complete, but this scan was not saved for dashboard statistics. Ensure API database migrations—including the seed migration—have been applied.',
        { duration: 8500 },
      );
    }
  };

  // Start camera when cameraOpen becomes true
  useEffect(() => {
    if (cameraOpen) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera error:", err);
          alert(isArabic ? "تعذر فتح الكاميرا" : "Could not open camera");
          setCameraOpen(false);
        }
      };
      startCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraOpen, isArabic]);

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/jpeg');

    // Convert data URL to a File for the API
    const res = await fetch(imageDataUrl);
    const blob = await res.blob();
    const imageFile = new File([blob], 'capture.jpg', { type: 'image/jpeg' });

    setCameraOpen(false);
    setIsAnalyzing(true);

    try {
      const data = await api.plant.predict(imageFile);
      notifyIfScanNotPersisted(data);
      navigate("/result", {
        state: {
          image: imageDataUrl,
          predictedClass: data.predictedClass,
          confidence: data.confidence,
          top3: data.top3,
        },
      });
    } catch (err) {
      toast.error(isArabic ? "فشل تحليل الصورة. حاول مرة أخرى." : "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const file = files[0]; 
    const imageUrl = URL.createObjectURL(file);
    const newFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      type: file.type.split('/')[1]?.toUpperCase() || "IMG",
      preview: imageUrl,
      originalFile: file,
    };
    setSelectedFiles([newFile]);
  };

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); processFiles(Array.from(e.dataTransfer.files)); };
  const removeFile = (id) => setSelectedFiles(prev => prev.filter(file => file.id !== id));

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
    } catch (err) { console.error(err); }
  };
  
  const stopRecording = () => { if (mediaRecorderRef.current) { mediaRecorderRef.current.stop(); setRecording(false); } };
  
  const nextSlide = () => setCurrent(([prev]) => [(prev + 1) % plants.length, 1]);
  const prevSlide = () => setCurrent(([prev]) => [(prev - 1 + plants.length) % plants.length, -1]);

  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 3500);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative" dir={isArabic ? "rtl" : "ltr"}>
      
      {/* ========== FIRST SECTION (Hero) ========== */}
      <section className='w-full min-h-screen bg-[url(/background.jpg)] relative bg-cover bg-center overflow-hidden px-5 md:px-10'>
        
        <WeatherCard isArabic={isArabic} />
        
        {/* Upload Modal (رفع ملف) */}
        <AnimatePresence>
          {showUploadModal && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 md:pt-32">
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
                  <h2 className="font-bold text-gray-800 text-lg">{isArabic ? "تحميل الملفات" : "Upload files"}</h2>
                  <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-red-500"><AiOutlineCloseCircle size={32} /></button>
                </div>
                <div className='relative p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]'>
                  <div onDragOver={handleDragOver} onDrop={handleDrop} className="border-2 border-dashed border-blue-100 rounded-3xl p-6 min-h-[200px] flex flex-col items-center justify-center bg-blue-50/20">
                    {selectedFiles.length > 0 ? (
                      <div className="w-full flex flex-col items-center">
                        <img src={selectedFiles[0].preview} alt="preview" className="max-h-[160px] rounded-xl object-contain shadow-sm mb-4" />
                        <button onClick={() => fileInputRef.current.click()} className="text-xs font-bold text-green-600 hover:underline">{isArabic ? "تغيير الملف المختار" : "Change Selection"}</button>
                        <button
                          onClick={async () => {
                            const fileEntry = selectedFiles[0];
                            if (!fileEntry?.originalFile) return;
                            setShowUploadModal(false);
                            setIsAnalyzing(true);
                            try {
                              const data = await api.plant.predict(fileEntry.originalFile);
                              notifyIfScanNotPersisted(data);
                              navigate("/result", {
                                state: {
                                  image: fileEntry.preview,
                                  predictedClass: data.predictedClass,
                                  confidence: data.confidence,
                                  top3: data.top3,
                                },
                              });
                            } catch (err) {
                              toast.error(isArabic ? "فشل تحليل الصورة. حاول مرة أخرى." : "Analysis failed. Please try again.");
                            } finally {
                              setIsAnalyzing(false);
                            }
                          }}
                          className="mt-4 px-6 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition shadow-lg"
                        >
                          {isArabic ? "احصل على النتيجة" : "Get Result"}
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-gray-700 mb-4 text-center">{isArabic ? "اختر ملفًا أو قم بسحبه وإفلاته هنا" : "Choose a file or drag & drop it here"}</p>
                        <button onClick={() => fileInputRef.current.click()} className="px-8 py-2 bg-white border cursor-pointer border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50">Browse File</button>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" accept="image/*" />
                  </div>
                  <div className="flex flex-col gap-3">
                    {selectedFiles.map((file) => (
                      <motion.div key={file.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                        <div className="bg-red-500 text-white text-[9px] font-bold p-1 rounded">{file.type}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center"><span className="text-sm font-bold text-gray-700 truncate">{file.name}</span><button onClick={() => removeFile(file.id)} className="text-gray-400 hover:text-red-500">🗑️</button></div>
                          <div className="text-[10px] text-green-600 font-bold mt-1">✓ {file.size} • {isArabic ? "تم التحميل" : "Completed"}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Camera Modal (تصوير مباشر) */}
        <AnimatePresence>
          {cameraOpen && (
            <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 pt-20 md:pt-32">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCameraOpen(false)}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-black rounded-3xl overflow-hidden w-full max-w-3xl aspect-video shadow-2xl"
              >
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6">
                  <button 
                    onClick={() => setCameraOpen(false)}
                    className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition"
                  >
                    <X size={28} />
                  </button>
                  <button 
                    onClick={capturePhoto}
                    className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition"
                  >
                    <Camera size={28} />
                  </button>
                </div>
                <button 
                  onClick={() => setCameraOpen(false)}
                  className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
                >
                  <X size={24} />
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Hero image */}
        <img src={image201} alt="hero-plant" className={`absolute -bottom-15 z-10 w-[350px] md:w-[370px] lg:w-[630px] transition-all duration-700 ${isArabic ? 'right-[-100px] md:right-1/2 lg:translate-x-1/2' : 'left-[-100px] md:left-1/2 lg:-translate-x-1/2'}`} />
        
        <div className='flex flex-col md:flex-row w-full z-20 min-h-[80vh] relative'>
          <div className="flex flex-col items-start gap-4 md:gap-[100px] pt-6 md:pt-0 md:items-center md:flex-row md:justify-between w-full">
            <div className={`flex flex-col items-start gap-10 md:gap-60 max-w-2xl text-black py-2 md:py-5 ${isArabic ? 'text-right' : 'text-left'}`}>
              <h1 className='text-[30px] md:text-[40px] lg:text-[70px] leading-[0.95]'>{t("hero_title")}</h1>
              {/* Hero model name and description: hidden on mobile, visible on md+ */}
              <div className="hidden md:block">
                <h2 className='text-[25px] md:text-[30px] lg:text-[40px] font-poppins mb-1'>{t("hero_model_name")}</h2>
                <p className='text-[10px] md:text-[11px] lg:text-[15px] font-poppins text-gray-600 md:max-w-[270px] lg:max-w-[500px]'>{t("hero_description")}</p>
              </div>
            </div>
            <div className="flex flex-row md:flex-col items-center justify-between gap-2 md:gap-10 mt-45 md:mt-10 w-full md:w-auto px-2">
              
              {/* زر المسح (Scan) - يفتح مودال رفع الملفات (UPLOAD) */}
              <div className="flex flex-row md:flex-col items-center flex-1 md:flex-none relative">
                <div onClick={() => setShowUploadModal(true)} className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#34A853] flex items-center cursor-pointer justify-center shadow-lg shrink-0">
                  <img src={scanIcon} className="w-6 h-6 md:w-7 md:h-7 brightness-0 invert" alt="scan" />
                </div>
                <div className="flex-1 md:flex-none h-[2px] md:h-24 w-full md:w-px border-t-2 md:border-l-2 border-dotted border-green-700/30 mx-2 md:mx-0"></div>
                {/* Popup for scan icon - appears only on md screens and larger */}
                <AnimatePresence>
                  {popupTarget === 'scan' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 pointer-events-none whitespace-nowrap
                        bg-gradient-to-r from-green-500 to-green-700 text-white font-bold text-xs md:text-sm px-3 md:px-5 py-1 md:py-2 rounded-full shadow-md hidden md:block"
                    >
                      {isArabic ? "ارفع النبات" : "upload your plant"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* الزر الأوسط (Check) - ليس له وظيفة حالياً */}
              <div className="flex flex-row md:flex-col items-center flex-1 md:flex-none">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-lg border shrink-0">
                  <img src={checkIcon} className="w-6 h-6 md:w-8 md:h-8" alt="check" />
                </div>
                <div className="flex-1 md:flex-none h-[2px] md:h-24 w-full md:w-px border-t-2 md:border-l-2 border-dotted border-green-700/30 mx-2 md:mx-0"></div>
              </div>
              
              {/* زر الرفع (Upload) - يفتح الكاميرا */}
              <div className="flex flex-col items-center relative">
                <div onClick={() => setCameraOpen(true)} className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#34A853] flex items-center justify-center cursor-pointer shadow-lg shrink-0">
                  <img src={uploadIcon} className="w-6 h-6 md:w-6 md:h-6 brightness-0 invert" alt="upload" />
                </div>
                {/* Popup for upload icon - appears only on md screens and larger */}
                <AnimatePresence>
                  {popupTarget === 'upload' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 pointer-events-none whitespace-nowrap
                        bg-gradient-to-r from-green-500 to-green-700 text-white font-bold text-xs md:text-sm px-3 md:px-5 py-1 md:py-2 rounded-full shadow-md hidden md:block"
                    >
                      {isArabic ? "امسح النبات" : "scan your plant"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Chatbot button */}
        <div className={`absolute bottom-2 z-50 flex flex-col items-center pointer-events-auto ${isArabic ? '-left-36 md:-left-20' : '-right-36 md:-right-20'}`}>
          {showText && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-2 px-5 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-full shadow-md"><h1>{t("chat_with_me")}</h1></motion.div>}
          <img src={chatbotImg} className="w-[450px] md:w-[470px] lg:w-[600px] cursor-pointer hover:scale-105 transition-transform" onClick={() => setOpenChat(!openChat)} alt="chatbot" />
        </div>

        {/* Chat window (unchanged) */}
        <AnimatePresence>
          {openChat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className={`absolute z-50 w-[320px] h-[450px] md:w-[450px] md:h-[550px] bg-white shadow-2xl rounded-3xl flex flex-col overflow-hidden border border-green-200 bottom-[80px] ${isArabic ? 'left-4 md:left-[100px]' : 'right-4 md:right-[100px]'}`}
            >
              <div className="bg-gradient-to-r from-green-600 to-green-500 text-white font-bold p-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowHistory(!showHistory)} className="hover:bg-white/20 p-2 rounded-full transition-all"><HistoryIcon size={20} /></button>
                  <h1 className="text-sm">💬 {t("customer_chat")}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={startNewChat} className="hover:bg-white/20 p-2 rounded-full transition-all"><MessageSquarePlus size={20} /></button>
                  <button onClick={() => setOpenChat(false)} className="text-2xl hover:rotate-90 transition-transform px-2">×</button>
                </div>
              </div>
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ x: isArabic ? 300 : -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: isArabic ? 300 : -300 }}
                    className={`absolute inset-y-0 z-[60] w-64 bg-white shadow-2xl p-4 flex flex-col border-gray-100 ${isArabic ? 'right-0 border-l' : 'left-0 border-r'}`}
                  >
                    <div className="flex justify-between items-center mb-6 border-b pb-2">
                      <span className="font-bold text-green-700 text-sm">{isArabic ? "المحادثات السابقة" : "History"}</span>
                      <button onClick={() => setShowHistory(false)}><X size={18} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2">
                      {chatHistory.length === 0 ? (
                        <p className="text-center text-gray-400 text-xs mt-10">لا يوجد سجل حالياً</p>
                      ) : (
                        chatHistory.map((item) => (
                          <button key={item.id} onClick={() => { setMessages(item.messages); setShowHistory(false); }} className="w-full text-right p-3 text-[11px] bg-gray-50 hover:bg-green-50 rounded-xl border border-transparent hover:border-green-100 transition-all truncate">{item.title}</button>
                        ))
                      )}
                    </div>
                    <button onClick={() => { if(confirm(isArabic ? "مسح السجل؟" : "Clear History?")) setChatHistory([]) }} className="mt-4 text-[10px] text-red-500 hover:underline">{isArabic ? "مسح السجل بالكامل" : "Clear History"}</button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex-1 p-4 overflow-y-auto bg-green-50 space-y-3 text-black flex flex-col">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full opacity-40 grayscale">
                    <img src={chatbotImg} alt="bot" className="w-16 h-16 mb-2" />
                    <p className="text-sm italic">{isArabic ? "كيف يمكنني مساعدتك؟" : "How can I help you?"}</p>
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`p-3 rounded-2xl shadow-sm max-w-[85%] ${msg.sender === 'user' ? 'bg-green-600 text-white self-end ml-auto rounded-tr-none' : 'bg-white border border-green-200 text-black self-start rounded-tl-none'}`}>
                    {msg.type === 'text' ? <p className="text-sm">{msg.content}</p> : <audio controls src={msg.content} className="w-full h-8" />}
                  </div>
                ))}
              </div>
              <div className="p-3 bg-white border-t flex items-center gap-2">
                <button onClick={recording ? stopRecording : startRecording} className={`p-3 rounded-full transition-all ${recording ? 'bg-red-500 animate-pulse text-white' : 'bg-gray-100 text-green-600 hover:bg-green-100'}`}>
                  {recording ? <StopCircle size={22} /> : <Mic size={22} />}
                </button>
                <input value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} className="flex-1 p-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 text-sm text-black outline-none" placeholder={t("type_message")} />
                <button onClick={sendMessage} className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-md"><Send size={20} className={isArabic ? "rotate-180" : ""} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========== LOADER - يظهر في الجزء العلوي من أول سكشن ========== */}
        <AnimatePresence>
          {isAnalyzing && (
            <div className="fixed inset-0 z-[200] flex items-start justify-center bg-white/60 backdrop-blur-md pt-40 md:pt-56">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="absolute inset-0 border-4 border-gray-100 border-t-green-600 rounded-full"
                  />
                  <motion.img 
                    src={tree} 
                    className="w-12 h-12 object-contain"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-center"
                >
                  <h3 className="text-2xl font-bold text-green-800 tracking-widest uppercase italic animate-pulse">
                    {isArabic ? "جاري التحليل..." : "Analyzing..."}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {isArabic ? "برجاء الانتظار قليلاً" : "Please wait a moment"}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </section>

      {/* ========== باقي أقسام الصفحة (بدون تغيير) ========== */}
      <section className='w-full h-auto bg-white flex justify-center items-center'>
        <div className='flex flex-col-reverse justify-center items-center lg:flex-row gap-10 py-12'>
          <div className="left">
            <img className='w-[300px] lg:w-[550px] h-[255px] lg:h-[430px] transition-transform duration-500 hover:scale-105 shadow-lg' src={planto} alt="planto"/>
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
          <h1 className="text-5xl md:text-6xl font-medium font-kufam text-[#3d8c40] mb-2">{t("services_title")}</h1>
          <p className="text-[#5cb85c] text-lg md:text-xl">{t("services_subtitle")}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          <div className="relative group w-full md:w-[450px] h-[280px] overflow-hidden shadow-xl">
            <div className="absolute top-5 left-0 z-10 bg-[#D9D9D98C] backdrop-blur-md px-8 py-2 rounded-r-full">
              <span className="text-[#000000] font-bold text-lg">{t("service_vital_signs")}</span>
            </div>
            <img src={plankoo} alt="Plant vital signs" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
          <div className="relative group w-full md:w-[450px] h-[280px] overflow-hidden shadow-xl">
            <div className="absolute top-5 left-0 z-10 bg-[#D9D9D98C] backdrop-blur-md px-8 py-2 rounded-r-full shadow-sm">
              <span className="text-[#000000] font-bold text-lg">{t("service_suitable_dust")}</span>
            </div>
            <img src={planko} alt="Soil health" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
        </div>
      </div>

      <section className="w-full bg-white py-20 px-4 md:px-10 relative overflow-visible">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="max-w-xl flex flex-col items-start text-left">
            <h1 className="text-4xl md:text-5xl font-medium font-kufam text-green-700 mb-4">{t("categories_title")}</h1>
            <p className="text-green-600 font-medium tracking-wide mb-4">{t("categories_subtitle")}</p>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">{t("categories_description")}</p>
            <div className="flex items-center justify-center lg:justify-start gap-6">
              <button onClick={() => { navigate('/plants'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-3.5 lg:px-6 py-2 border border-green-600 text-green-700 cursor-pointer rounded-full font-medium hover:bg-green-600 hover:text-white transition">{t("explore")}</button>
              <button onClick={() => setShowVideo(true)} className="flex items-center gap-2 text-green-700 font-medium cursor-pointer hover:scale-105 transition-transform">
                <span className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white shadow-lg"><Play size={18} fill="currentColor" className="rtl:rotate-180" /></span>
                {t("live_demo")}
              </button>
            </div>
          </div>
          <div className="relative w-[300px] md:w-[350px] pt-24 pb-8 px-8 bg-[#F2F2F2] rounded-[40px] shadow-2xl flex flex-col items-center">
            <div className="absolute -top-18 md:-top-25 w-full flex justify-center pointer-events-none">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.img key={plants[current].id} src={plants[current].image} alt={plants[current].name} initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: -20 }} transition={{ duration: 0.4 }} className="w-[180px] h-[220px] md:w-[220px] md:h-[260px] object-contain drop-shadow-2xl" />
              </AnimatePresence>
            </div>
            <div className="text-center mt-12 mb-6">
              <p className="text-[#3CB371] text-lg font-medium">Trendy House Plant</p>
              <motion.h2 key={plants[current].name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl md:text-4xl font-bold text-[#064E3B] mt-2">{plants[current].name}</motion.h2>
            </div>
            <button className="bg-[#00A859] hover:bg-[#008f4c] text-white px-8 py-3 rounded-full font-bold text-sm tracking-wide transition-all shadow-md active:scale-95">SAME EXAMPLE</button>
            <div className="flex items-center justify-between w-full mt-10">
              <div className="flex gap-2">{plants.map((_, index) => (<span key={index} className={`h-2.5 rounded-full transition-all duration-300 ${index === current ? "w-6 bg-[#064E3B]" : "w-2.5 bg-[#4ADE80]"}`} />))}</div>
              <button onClick={isArabic ? prevSlide : nextSlide} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><ChevronRight className={`text-[#064E3B] ${isArabic ? "rotate-180" : ""}`} size={32} /></button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showVideo && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none">
              <div className="absolute inset-0 bg-transparent pointer-events-auto" onClick={() => setShowVideo(false)}></div>
              <motion.div initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 20 }} className="relative w-[95%] md:w-[80%] lg:w-[70%] max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-2 border-green-600/20 pointer-events-auto z-[110]">
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