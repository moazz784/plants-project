import React from 'react'; 
import { useTranslation } from 'react-i18next'; 
import plantImage from './assets/plant.png'; 
import Footer from './Footer'; 

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

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
      
      <Footer />
    </div>
  );
}


















// import React, { useState, useEffect, useRef } from 'react';
// import image201 from "./assets/flowersss.png";
// import uploadIcon from "./assets/Vector.png"; 
// import checkIcon from "./assets/Group.png";
// import scanIcon from "./assets/Vector (1).png";
// import chatbotImg from "./assets/chatbot.png";
// import planko from "./assets/plank2.png";
// import plankoo from "./assets/plank3.png";
// import planto from "./assets/planto.jpg";
// import plantsVideo from "./assets/plantvideo.mp4";
// import tree from "./assets/tree.png";
// import Footer from './Footer';
// import { AiOutlineCloseCircle } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Mic, StopCircle, Send, Play, ChevronRight, X } from "lucide-react"; 
// import { useTranslation } from "react-i18next";

// export default function AboutPage() {
//   const { t, i18n } = useTranslation(); 
//   const navigate = useNavigate();
//   const isArabic = i18n.language === 'ar';

//   const [showText, setShowText] = useState(false);
//   const [openChat, setOpenChat] = useState(false);
//   const [showVideo, setShowVideo] = useState(false); 
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');
//   const [recording, setRecording] = useState(false);
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [[current, direction], setCurrent] = useState([0, 0]);

//   const fileInputRef = useRef(null); 
//   const mediaRecorderRef = useRef(null);

//   const plants = [
//     { id: 1, name: "Calathea Plant", image: tree },
//     { id: 2, name: "Snake Plant", image: tree },
//     { id: 3, name: "Aloe Vera", image: tree },
//   ];

//   // Redirect if not logged in
//   useEffect(() => {
//     const hasloged = localStorage.getItem("hasloged") === "true";
//     if (!hasloged) navigate("/login");
//   }, [navigate]);

//   // Floating chatbot text
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setShowText(true);
//       setTimeout(() => setShowText(false), 3000);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   // Auto slide every 3.5s
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent(([prev]) => [(prev + 1) % plants.length, 1]);
//     }, 3500);
//     return () => clearInterval(interval);
//   }, []);

//   const nextSlide = () => setCurrent(([prev]) => [(prev + 1) % plants.length, 1]);
//   const prevSlide = () => setCurrent(([prev]) => [(prev - 1 + plants.length) % plants.length, -1]);

//   const variants = {
//     enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0, position: "absolute" }),
//     center: { x: 0, opacity: 1, position: "relative" },
//     exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0, position: "absolute" }),
//   };

//   // File upload handlers
//   const handleFileChange = (event) => {
//     const files = Array.from(event.target.files);
//     processFiles(files);
//   };

//   const processFiles = (files) => {
//     const newFiles = files.map(file => ({
//       id: Math.random().toString(36).substr(2, 9),
//       name: file.name,
//       size: (file.size / 1024).toFixed(1) + " KB",
//       type: file.type.split('/')[1]?.toUpperCase() || "IMG",
//       preview: URL.createObjectURL(file)
//     }));
//     setSelectedFiles(prev => [...prev, ...newFiles]);
//   };

//   const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
//   const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); processFiles(Array.from(e.dataTransfer.files)); };
//   const removeFile = (id) => setSelectedFiles(prev => prev.filter(file => file.id !== id));

//   // Audio recording
//   const startRecording = async () => {
//     if (!navigator.mediaDevices) return alert("Your browser does not support audio recording");
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       const audioChunks = [];
//       mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
//         const audioURL = URL.createObjectURL(audioBlob);
//         setMessages(prev => [...prev, { type: 'audio', content: audioURL }]);
//       };
//       mediaRecorder.start();
//       setRecording(true);
//     } catch (err) {
//       console.error("Error accessing microphone:", err);
//     }
//   };
//   const stopRecording = () => { if (mediaRecorderRef.current) { mediaRecorderRef.current.stop(); setRecording(false); } };

//   const sendMessage = () => {
//     if (inputValue.trim() !== '') { setMessages(prev => [...prev, { type: 'text', content: inputValue }]); setInputValue(''); }
//   };