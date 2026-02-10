import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Toaster } from 'sonner';
import gsap from "gsap";
import Header from "./Header";
import Home from "./Home";
import About from "./About";
import Loginpage from "./Loginpage";
import error from "./assets/error.png";
import Preloader from "./Preloader";
import Contact from "./Contact";
import Momo from "./Momo"
import Services from "./Services"
import { Toaster } from "react-hot-toast";
import Plantscategoriy from "./Plantscategoriy";
import Profile from "./Profile";
export default function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!loading) {
      gsap.from(".page", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power3.out",
      });
    }
  }, [loading]);

  return (
    <>
      <Toaster position="top-center" richColors />
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      {!loading && (
        <div className="page">
          <BrowserRouter>
            <Routes>
              <Route element={<Header />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services/>} />
              <Route path="/contact-us" element={<Contact/>} />
              <Route path="/plants" element={<Plantscategoriy/>} />
              </Route>
               <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Loginpage />} />
              <Route path="*" element={<Momo />} />
            </Routes>
          </BrowserRouter>
        </div>
      )}
    </>
  );
}

