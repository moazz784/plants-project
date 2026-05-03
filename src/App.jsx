import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import gsap from "gsap";
import Header from "./Header";
import useSound from "use-sound";
import Home from "./Home";
import About from "./About";
import Loginpage from "./Loginpage";
import Preloader from "./Preloader";
import Contact from "./Contact";
import Momo from "./Momo";
import Services from "./Services";
import { Toaster } from "react-hot-toast";
import Plantscategoriy from "./Plantscategoriy";
import Profile from "./Profile";
import Dashboard from "./Dashboard";
import clickSound from "./assets/click.mp3";
import { AuthProvider } from "./AuthContext";
import AdminGuard from "./AdminGuard";
import Messages from "./Messages";
import ResultPage from "./ResultPage";

export default function App() {
  const [loading, setLoading] = useState(true);

  
 const [play] = useSound(clickSound);

  
useEffect(() => {
  const handleClick = (e) => {
    const el = e.target.closest("a, button");

    if (el) {
      play();
    }
  };

  document.addEventListener("click", handleClick);

  return () => {
    document.removeEventListener("click", handleClick);
  };
}, [play]);
  useEffect(() => {
    const titles = ["LeafScan ", "AI Plant Doctor ", "Smart Detection "];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    const animateTitle = () => {
      const currentWord = titles[wordIndex];
      const currentChars = currentWord.substring(0, charIndex);
      const invisibleChar = "\u200B";
      const displayTitle =
        currentChars.length === 0 ? invisibleChar : currentChars;
      const cursor = "▋";

      document.title = `${displayTitle}${isDeleting ? "" : cursor}`;

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 1500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % titles.length;
        typeSpeed = 400;
      }

      if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
      }

      timeout = setTimeout(animateTitle, typeSpeed);
    };

    animateTitle();
    return () => clearTimeout(timeout);
  }, []);

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
    <AuthProvider>
      <Toaster position="top-center" richColors />

      

      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {!loading && (
        <div className="page">
          <BrowserRouter>
            <Routes>
              <Route element={<Header />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact-us" element={<Contact />} />
                <Route path="/plants" element={<Plantscategoriy />} />
                <Route path="/result" element={<ResultPage />} />
              </Route>

              <Route path="/profile" element={<Profile />} />

              <Route element={<AdminGuard />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/messages" element={<Messages />} />
              </Route>

              <Route path="/login" element={<Loginpage />} />
              <Route path="*" element={<Momo />} />
            </Routes>
          </BrowserRouter>
        </div>
      )}
    </AuthProvider>
  );
}