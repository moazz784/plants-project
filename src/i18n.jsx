import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // ===== Common =====
      welcome: "Welcome to LeafScan",
      home: "Home",
      about: "About Us",
      services: "Services",
      contact_us: "Contact Us",
      logout: "Log out",

      // ===== Hero Section =====
      hero_title: "Experience ever-evolving Technology",
      hero_model_name: "SMART AI MODEL",
      hero_description: "Advanced visual diagnostics for total plant protection. Our AI analyzes image data to detect early-stage pathologies and pest threats with pinpoint accuracy. Simply upload a photo to unlock instant health insights and prevent potential risks before they take root.",
      
      // ===== Chatbot Section =====
      chat_with_me: "Chat with me",
      customer_chat: "Customer Chat",
      type_message: "Type your message...",
      send: "Send",

      // ===== About Section (The one with plant photo) =====
      about_title: "ABOUT US",
      about_subtitle: "LeafScan AI Model to detect information of leaves",
      about_description: "Our AI-driven model transforms simple photography into a powerful diagnostic engine. By utilizing advanced image recognition, we detect early-stage pathologies and pest threats that are invisible to the naked eye. We are committed to providing instant, accurate insights to help you protect your plants and ensure they thrive through every season.",
      show_more: "Show More",

      // ===== Our Numbers Section =====
      numbers_title: "OUR NUMBERS",
      numbers_subtitle: "WHAT IS OUR RESULTS?",
      exp_years: "Years of experience",
      test_plants: "Tests plants",
      vital_signs: "Detect vital Signs",
      suitable_dust: "Detect Suitable Dust",

      // ===== Footer =====
      footer_about: "About",
      footer_services: "Services",
      footer_contact: "Contact us",
      footer_privacy: "Privacy Policy",
      footer_terms: "Terms & Conditions",
      footer_copyright: "© Copyright {{year}}, All Rights Reserved @moazz alsadeq developer",
    },
  },

  ar: {
    translation: {
      // ===== Common =====
      welcome: "أهلاً بك في LeafScan",
      home: "الرئيسية",
      about: "من نحن",
      services: "خدماتنا",
      contact_us: "تواصل معنا",
      logout: "تسجيل الخروج",

      // ===== Hero Section =====
      hero_title: "اختبر التكنولوجيا دائمـة التطـور",
      hero_model_name: "نموذج الذكاء الاصطناعي الذكي",
      hero_description: "تشخيصات بصرية متطورة لحماية شاملة لنباتاتك. يقوم نظام الذكاء الاصطناعي لدينا بتحليل بيانات الصور للكشف عن مسببات الأمراض وتهديدات الآفات في مراحلها المبكرة وبدقة متناهية. ما عليك سوى رفع صورة للحصول على رؤى فورية حول حالة النبتة الصحية، ومنع المخاطر المحتملة قبل أن تتفاقم.",
      
      // ===== Chatbot Section =====
      chat_with_me: "تحدث معي",
      customer_chat: "دردشة العملاء",
      type_message: "اكتب رسالتك هنا...",
      send: "إرسال",

      // ===== About Section =====
      about_title: "من نحن",
      about_subtitle: "نموذج LeafScan للذكاء الاصطناعي للكشف عن بيانات صحة أوراق الشجر",
      about_description: "يقوم نموذجنا المدعوم بالذكاء الاصطناعي بتحويل الصور البسيطة إلى محرك تشخيصي قوي. من خلال استخدام تقنيات التعرف المتقدم على الصور، نكشف عن أمراض النبات وتهديدات الآفات في مراحلها المبكرة التي لا تُرى بالعين المجردة. نحن ملتزمون بتقديم رؤى فورية ودقيقة لمساعدتك في حماية نباتاتك وضمان ازدهارها في كل الفصول.",
      show_more: "عرض المزيد",

      // ===== Our Numbers Section =====
      numbers_title: "أرقامنا",
      numbers_subtitle: "ما هي نتائجنا؟",
      exp_years: "سنوات من الخبرة",
      test_plants: "نباتات تم فحصها",
      vital_signs: "كشف العلامات الحيوية",
      suitable_dust: "كشف التربة المناسبة",

      // ===== Footer =====
      footer_about: "من نحن",
      footer_services: "خدماتنا",
      footer_contact: "تواصل معنا",
      footer_privacy: "سياسة الخصوصية",
      footer_terms: "الشروط والأحكام",
      footer_copyright: "© حقوق النشر {{year}}، جميع الحقوق محفوظة @معاذ الصادق",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "cookie", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;