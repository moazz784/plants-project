import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Preloader({ onComplete }) {
  const loaderRef = useRef(null);
  const numberRef = useRef(null);
  const lineRef = useRef(null);

  useLayoutEffect(() => {
    // منع السكرول أثناء التحميل
    document.body.style.overflow = "hidden";

    const counter = { value: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // أنيميشن الخط
      tl.from(lineRef.current, {
        scaleX: 0,
        duration: 1,
        ease: "power4.out",
      });

      // عداد الأرقام
      gsap.to(counter, {
        value: 100,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.innerText = Math.floor(counter.value) + "%";
          }
        },
        onComplete: () => {
          // لما العداد يخلص، نبدأ نخفي اللودر ونظهر الموقع
          const exitTl = gsap.timeline({
            onComplete: () => {
              // --- التعديل السحري هنا ---
              document.documentElement.classList.add('content-ready');
              document.body.style.overflow = "auto";
              onComplete?.();
            },
          });

          exitTl
            .to(numberRef.current, { opacity: 0, y: -20, duration: 0.3 })
            .to(lineRef.current, { scaleX: 0, duration: 0.6, ease: "power4.in" })
            .to(loaderRef.current, {
              opacity: 0,
              y: "-100%",
              duration: 1,
              ease: "power4.inOut",
            }, "-=0.3");
        },
      });
    }, loaderRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="preloader">
      <div ref={lineRef} className="loader-line" />
      <span ref={numberRef} className="loader-number">0%</span>
      <div className="loader-circle" />
    </div>
  );
}
