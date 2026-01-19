import React from "react";
import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <div className="w-full h-screen relative bg-green-50 flex items-center justify-center overflow-hidden">

      
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-30"></div>

      
      <div className="relative z-10 flex flex-col items-center text-green-900">
        <h1 className="text-[8rem] font-extrabold relative">
          404
          <span className="absolute -top-5 -right-16 text-5xl animate-bounce">🌿</span>
        </h1>

        <p className="text-2xl mt-4 text-center font-medium">
          the page not found
        </p>

        <Link
          to="/"
          className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
        back to Home
        </Link>
      </div>
    </div>
  );
}