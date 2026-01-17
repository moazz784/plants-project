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

      // ===== About Page =====
      about_title: "ABOUT US",
      who_we_are: "WHO WE ARE?",
      about_description:
        "We are dedicated to revolutionizing agriculture through advanced Artificial Intelligence. Our platform provides an instant and accurate detection of plant diseases just by analyzing a photo. By bridging the gap between technology and nature, we empower farmers and plant lovers to protect their crops, ensure food security, and promote healthier ecosystems with smart, data-driven insights.",

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
      footer_copyright:
        "© Copyright {{year}}, All Rights Reserved @moazz alsadeq developer",
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

      // ===== About Page =====
      about_title: "من نحن",
      who_we_are: "من نحن؟",
      about_description:
        "نحن ملتزمون بإحداث ثورة في الزراعة من خلال الذكاء الاصطناعي المتقدم. توفر منصتنا كشفاً فورياً ودقيقاً لأمراض النباتات بمجرد تحليل الصورة. من خلال سد الفجوة بين التكنولوجيا والطبيعة، نمكن المزارعين ومحبي النباتات من حماية محاصيلهم، وضمان الأمن الغذائي، وتعزيز أنظمة بيئية أكثر صحة من خلال رؤى ذكية قائمة على البيانات.",

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
      footer_copyright:
        "© حقوق النشر {{year}}، جميع الحقوق محفوظة @معاذ الصادق",
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
