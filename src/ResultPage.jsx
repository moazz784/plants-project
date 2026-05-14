import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { image, disease, treatment } = location.state || {};

  if (!image) {
    return (
      <div className="w-full h-screen flex items-center justify-center ">
        <p className="text-gray-500 font-bold">No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-16">
          <div className="flex-1">
            <h1 className="text-4xl md:text-3xl font-black uppercase tracking-tight mb-4">
              {disease || "MODEL PLANT"}
            </h1>
            <p className="text-gray-600 leading-relaxed max-w-xl">
              Lorem ipsum dolor sit amet consectetur. Curabitur tempus diam ellentesque volutpat sit nulla eget enim purus tempor duis. Vulputate pretium at imperdiet pharetra ac.
            </p>
          </div>

          
          <div className="relative flex-1 flex justify-center">
             
             <div className="absolute -top-10 left-0 bg-[#166534] text-white p-3 rounded-md w-48 shadow-lg hidden md:block">
                <h4 className="font-bold text-sm border-b border-green-400 mb-1 pb-1">Leaf Component</h4>
                <p className="text-[10px] leading-tight opacity-90">Lorem ipsum dolor sit amet consectetur. Lectus elit quam massa aliquam.</p>
                <div className="absolute h-10 w-px bg-green-700 -bottom-10 left-1/2"></div>
             </div>

            <img 
              src={image} 
              alt="Plant" 
              className="w-64 h-64 md:w-80 md:h-80 object-contain"
            />

            
            <div className="absolute top-0 -right-4 bg-[#166534] text-white p-3 rounded-md w-48 shadow-lg hidden md:block">
                <h4 className="font-bold text-sm border-b border-green-400 mb-1 pb-1">Leaf Component</h4>
                <p className="text-[10px] leading-tight opacity-90">Lorem ipsum dolor sit amet consectetur. Lectus elit quam massa aliquam.</p>
                <div className="absolute h-6 w-10 border-l border-t border-green-700 -left-10 top-1/2"></div>
             </div>
          </div>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          
          <div className="bg-[#166534] text-white p-8 rounded-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">◆</span>
              <h3 className="text-2xl font-serif italic font-bold">disease</h3>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              {treatment || "Lorem ipsum dolor sit amet consectetur. Facilisis curabitur a vitae morbi platea sapien tellus. Ipsum id tempor massa."}
            </p>
          </div>

          
          <div className="bg-[#E5E7EB] p-8 rounded-sm">
            <div className="flex items-center gap-2 mb-3 text-green-800">
              <span className="text-xl">🌿</span>
              <h3 className="text-2xl font-serif italic font-bold">How to care</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              Lorem ipsum dolor sit amet consectetur. Facilisis curabitur a vitae morbi platea sapien tellus. Ipsum id tempor massa.
            </p>
          </div>

          
          <div className="bg-[#E5E7EB] p-8 rounded-sm">
            <div className="flex items-center gap-2 mb-3 text-green-800">
              <span className="text-xl">💊</span>
              <h3 className="text-2xl font-serif italic font-bold">Treatment</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
               {treatment || "Lorem ipsum dolor sit amet consectetur. Facilisis curabitur a vitae morbi platea sapien tellus."}
            </p>
          </div>

      
          <div className="bg-[#E5E7EB] p-8 rounded-sm">
            <div className="flex items-center gap-2 mb-3 text-green-800">
              <span className="text-xl">💡</span>
              <h3 className="text-2xl font-serif italic font-bold">Tips & tricks</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              Lorem ipsum dolor sit amet consectetur. Facilisis curabitur a vitae morbi platea sapien tellus.
            </p>
          </div>
        </div>

        
        <div className="border-2 border-green-800 rounded-xl p-6 mb-10">
          <h3 className="text-2xl font-bold text-green-900 mb-4">Risk Life Prediction</h3>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
             <div className="bg-green-700 h-full w-[80%]" />
          </div>
          <div className="flex justify-between mt-2 items-center">
            <span className="text-2xl font-bold text-green-800">80%</span>
            <span className="text-xl font-bold text-gray-400">High</span>
          </div>
        </div>

      
        <button 
          onClick={() => navigate("/")}
          className="bg-green-800 text-white px-10 py-3 rounded-full font-bold hover:bg-green-900 transition-colors shadow-lg"
        >
          Go Back
        </button>

      </div>
    </div>
  );
}