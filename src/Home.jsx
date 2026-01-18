import React, { useState, useEffect, useRef } from 'react';
import image201 from "./assets/flowersss.png";
import uploadIcon from "./assets/Vector.png"; 
import checkIcon from "./assets/Group.png";
import scanIcon from "./assets/Vector (1).png";
import chatbotImg from "./assets/chatbot.png";
import planto from "./assets/planto.jpg"
import { useNavigate } from "react-router-dom";
import Footer from './Footer';
import { motion, AnimatePresence } from "framer-motion";
import { Mic, StopCircle } from "lucide-react";

export default function AboutPage() {
  const [showText, setShowText] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setShowText(true);
      setTimeout(() => setShowText(false), 3000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const startRecording = async () => {
    if (!navigator.mediaDevices) return alert("Your browser does not support audio recording");
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
    <div className="relative">

      <section className='w-full min-h-screen bg-[url(/background.jpg)] relative bg-cover bg-center overflow-hidden px-5 md:px-10'>

        <img
          src={image201}
          alt="image"
          className="absolute -bottom-15 left-[-100px] md:left-1/2 lg:-translate-x-1/2  md:-translate-x-[30%] w-[350px] md:w-[370px] lg:w-[630px] z-10"
        />

        <div className='flex flex-col md:flex-row w-full z-20 min-h-[80vh] relative'>

          <div className="flex flex-col items-start gap-4 md:gap-[100px] pt-6 md:pt-0 md:items-center md:flex-row md:justify-between w-full">

            <div className='flex flex-col items-start text-left gap-10 md:gap-60 max-w-2xl text-black py-2 md:py-5'>
              <h1 className='text-[30px] md:text-[43px] lg:text-[70px] font-kufam leading-[0.95]'>
                Experience ever- evolving Technology
              </h1>

              <div>
                <h2 className='text-[25px] md:text-[30px] lg:text-[40px] font-kufam mb-1'>
                  SMART AI MODEL
                </h2>
                <p className='text-[10px] md:text-[11px] lg:text-[15px] font-poppins text-gray-600 md:max-w-[270px] lg:max-w-[500px]'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, dolorum cupiditate. Soluta temporibus illum voluptas iste dolores, tempora accusamus eos quam eius error. Modi velit reiciendis tempore impedit officia suscipit!
                </p>
              </div>
            </div>

            <div className="flex flex-row
  md:flex-col
  items-center
  justify-between
  gap-11 md:gap-10
  mt-8 md:mt-32
  w-full
  md:w-auto
  px-4">

              <div className="flex flex-col items-center">
                <div className="w-12 md:w-14 h-12 md:h-14 rounded-full bg-[#34A853] flex items-center justify-center shadow-lg">
                 
                  <img src={scanIcon} className="w-7 h-7 invert" />
                </div>
                <div className="w-16 md:w-auto h-px md:h-24 border-t-2 md:border-l-2 border-dotted border-green-700/30"></div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 md:w-14 h-12 md:h-14 rounded-full bg-white flex items-center justify-center shadow-lg border">
                  <img src={checkIcon} className="w-8 h-8" />
                </div>
                <div className="w-16 md:w-auto h-px md:h-24 border-t-2 md:border-l-2 border-dotted border-green-700/30">
                </div>
              </div>
               
              <div className="flex flex-col items-center">
                <div className="w-12 md:w-14 h-12 md:h-14 rounded-full bg-[#34A853] flex items-center justify-center shadow-lg">
                   <img src={uploadIcon} className="w-6 h-6 invert" />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Chatbot */}
        <div className="absolute bottom-2 -right-36 md:-right-20 z-50 flex flex-col items-center">
          {showText && (
            <div className="mb-2 px-5 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-full">
              Chat with me
            </div>
          )}
          <img
            src={chatbotImg}
            className="w-[450px] md:w-[470px] lg:w-[600px] cursor-pointer"
            onClick={() => setOpenChat(!openChat)}
          />
        </div>

        {/* Chat Window */}
        <AnimatePresence>
          {openChat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 50 }}
              transition={{ duration: 0.4 }}
              className="absolute z-50 w-[300px] h-[400px] md:w-[500px] md:h-[500px]
                         bg-white shadow-2xl rounded-3xl flex flex-col overflow-hidden
                         border border-green-200 bottom-[60px] right-2 md:bottom-[30px] md:right-[310px]"
            >

              {/* ✅ التعديل الوحيد هنا */}
              <div className="bg-gradient-to-r from-green-600 to-green-500 text-white font-bold p-4 flex items-center justify-between">
                <span>💬 Customer Chat</span>
                <button
                  onClick={() => setOpenChat(false)}
                  className="text-white text-xl font-bold hover:scale-110 transition-transform"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-green-50 space-y-2">
                {messages.map((msg, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-green-100">
                    {msg.type === 'text' ? msg.content : <audio controls src={msg.content} />}
                  </div>
                ))}
              </div>

              <div className="p-2 flex gap-1">
                <input
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  className="flex-1 p-3 border rounded-2xl"
                  placeholder="Type your message..."
                />
                <button onClick={sendMessage} className="bg-green-600 text-white px-0.5 md:px-3 rounded-2xl">
                  Send
                </button>

                {!recording ? (
                  <button onClick={startRecording} className="bg-red-500 text-white p-2 rounded-2xl">
                    <Mic size={20} />
                  </button>
                ) : (
                  <button onClick={stopRecording} className="bg-gray-700 text-white p-2 rounded-2xl">
                    <StopCircle size={20} />
                  </button>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </section>
      <section className='w-full h-auto bg-white flex  justify-center items-center '>
        <div className='flex flex-col-reverse justify-center items-center lg:flex-row gap-10 py-12'>
    <div className="left">
      <img className='w-[300px] lg:w-[550px] h-[255px] lg:h-[430px] transition-transform duration-500 hover:scale-105' src={planto}/>
    </div>
    <div className="right flex flex-col  gap-3">
      <h1 className=' font-[var(--font-kufam)] text-[38px] lg:text-[83px] text-[#388F4C]  '>ABOUT US</h1>
      <h1 className='font-[var(--font-poppins)] text-[17px]  lg:text-[38px]  text-[#355f3f] pl-1.5 lg:pl-0 max-w-[310px] lg:max-w-[530px] '>LeafScan Ai Model to detact information of leafs</h1>
      <p className='max-w-[300px] pl-1.5 lg:pl-0 lg:max-w-[650px] text-[11px]  lg:text-[15px]'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium alias totam nihil ut dolorum dolor dolore ducimus enim libero rerum reprehenderit asperiores nemo ipsam commodi iusto impedit, autem aliquid? Quos?</p>
     <div className='flex justify-center lg:justify-end  mt-4'>

      <button
      onClick={() => {
    navigate("/about");   // ينقلك للصفحة
    window.scrollTo(0, 0); // يضمن بدء الصفحة من فوق
  }}
      
  className="
    flex items-center gap-3
    bg-green-700 text-white
    cursor-pointer
    px-5 lg:px-9 py-2
    rounded-full
    hover:bg-green-800
    transition
  "
>
  <span className="text-sm font-[var(--font-kufam)]">
    <h2>Show More</h2>
  </span>

  <span
    className="
      w-8 h-8
      flex items-center justify-center
      bg-white text-green-700
      rounded-full
      text-sm font-bold
    "
  >
    →
  </span>
</button>
     </div>

    </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

