import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineCloseCircle } from "react-icons/ai";

export default function FileUploadModal({ showUploadModal, setShowUploadModal }) {
  // مخزن للملفات التي يختارها المستخدم فعلياً
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // دالة التعامل مع اختيار الملفات
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      type: file.type.split('/')[1].toUpperCase(),
      rawFile: file
    }));
    // إضافة الملفات الجديدة للملفات المختارة سابقاً
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  // دالة حذف ملف من القائمة
  const removeFile = (id) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== id));
  };

  return (
    <AnimatePresence>
      {showUploadModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
          {/* الخلفية المظلمة */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUploadModal(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
          />
          
          {/* جسم الموديل */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative z-[110] bg-white shadow-2xl w-full max-w-[500px] text-black border border-gray-100 rounded-3xl overflow-hidden flex flex-col"
          >
            {/* الهيدر وزر القفل */}
            <div className="p-6 pb-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border flex items-center justify-center shadow-sm text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <h2 className="font-bold text-gray-800 text-lg">Upload files</h2>
              </div>
              
              {/* زر القفل المطلوب */}
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <AiOutlineCloseCircle size={30} />
              </button>
            </div>

            <div className='p-6 flex flex-col gap-5 overflow-y-auto max-h-[80vh]'>
              
              {/* منطقة الرفع وزر Browse */}
              <div className="border-2 border-dashed border-blue-100 rounded-3xl p-10 flex flex-col items-center justify-center bg-blue-50/20">
                <p className="text-sm font-semibold text-gray-700 mb-4 text-center">Choose a file or drag & drop it here</p>
                
                {/* Input مخفي يتم تفعيله بالزر */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple 
                  className="hidden" 
                  accept="image/*"
                />
                
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="px-8 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition shadow-sm active:scale-95"
                >
                  Browse File
                </button>
              </div>

              {/* قائمة الملفات - تظهر فقط عند وجود ملفات */}
              <div className="flex flex-col gap-3">
                {selectedFiles.length > 0 ? (
                  selectedFiles.map((file) => (
                    <motion.div 
                      key={file.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3"
                    >
                      <div className="bg-red-500 text-white text-[9px] font-bold p-1 rounded mt-1">{file.type}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-700 truncate max-w-[200px]">{file.name}</span>
                          <button 
                            onClick={() => removeFile(file.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            🗑️
                          </button>
                        </div>
                        <div className="text-[10px] text-green-600 font-bold mt-1">✓ {file.size} • Completed</div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 text-xs py-4">No files selected yet</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}