import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import gsap from "gsap";
import Header from "./Header";
import Home from "./Home";
import About from "./About";
import Loginpage from "./Loginpage";
import error from "./assets/error.png";
import Preloader from "./Preloader";
import Contact from "./Contact";
import Momo from "./Momo"
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
      
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      {!loading && (
        <div className="page">
          <BrowserRouter>
            <Routes>
              <Route element={<Header />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<h1>mohamed</h1>} />
              <Route path="/contact-us" element={<Contact/>} />
              </Route>

              <Route path="/login" element={<Loginpage />} />
              <Route path="*" element={<Momo />} />
            </Routes>
          </BrowserRouter>
        </div>
      )}
    </>
  );
}

