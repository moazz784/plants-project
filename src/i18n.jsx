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

      // ===== About Section =====
      about_title: "ABOUT US",
      about_subtitle: "LeafScan AI Model to detect information of leaves",
      about_description: "Our AI-driven model transforms simple photography into a powerful diagnostic engine. By utilizing advanced image recognition, we detect early-stage pathologies and pest threats that are invisible to the naked eye. We are committed to providing instant, accurate insights to help you protect your plants and ensure they thrive through every season.",
      show_more: "Show More",
      who_we_are:"who we are !",


      // ===== Our Numbers Section =====
      numbers_title: "OUR NUMBERS",
      numbers_subtitle: "WHAT IS OUR RESULTS?",
      exp_years: "Years of experience",
      test_plants: "Tests plants",
      vital_signs: "Detect vital Signs",
      suitable_dust: "Detect Suitable Dust",

      // ===== Our Services Section (New) =====
      services_title: "Our Services",
      services_subtitle: "Our Services in this field Care Plant Health",
      service_vital_signs: "Detect vital Signs",
      service_suitable_dust: "Detect Suitable Dust",

      // ===== Footer =====
      footer_about: "About",
      footer_services: "Services",
      footer_contact: "Contact us",
      footer_privacy: "Privacy Policy",
      footer_terms: "Terms & Conditions",
      footer_copyright: "© Copyright {{year}}, All Rights Reserved @moazz alsadeq developer",
      // ===== Categories Section =====
      categories_title: "Our Categories",
      categories_subtitle: "CHOOSE BEST RELATED TYPE",
      categories_description: "Explore the world of plants in more detail. By clicking the explore button, you will be taken to a dedicated page where you can discover various plant species, identify the diseases that might affect them, and find expert advice on treatments to keep your plants healthy and thriving.",
      explore: "EXPLORE",
      live_demo: "LIVE Demo",
      trendy_plant: "Trendy House Plant",
      example_btn: "SAME EXAMPLE",
      // ===== Contact Page =====
      contact_info_title: "Contact Information",
      contact_info_sub: "Say something to start a live chat!",
      contact_address: "132 Dartmouth Street Abbas Elgaad, Cairo 02156 EGYPT",
      first_name: "First Name",
      last_name: "Last Name",
      email: "Email",
      phone_number: "Phone Number",
      message: "Message",
      message_placeholder: "Write your message...",
      send_btn: "Send Message",
      // ===== Agriculture Services =====
      services_main_title: "Services",
      services_sub_title: "What we do?",
      
      // Card 1: Recommendation
      card_rec_title: "Select Best Crops",
      card_rec_sub: "choose soil type and climate to get recommendations",
      btn_get_rec: "Get Recommendation",
      res_recommended: "Recommended",
      res_reason: "Based on {{soil}} soil and {{climate}} climate.",
      crop_result: "Watermelon & Peanuts",

      // Card 2: Calculator
      card_calc_title: "Irrigation & Fertilization Calculator",
      card_calc_sub: "calculate requirements for your specific area",
      btn_get_calc: "Get Best Result",
      water_needed: "Water Needed",
      fertilizer: "Fertilizer",
      liters_week: "Liters/Week",
      kg_unit: "Kg (NPK 20-20-20)",

      // Form Fields & Options
      label_soil: "Soil Type",
      label_climate: "Climate",
      label_crop: "Crop",
      label_land: "Land Area (acres)",
      placeholder_land: "Enter land area...",
      choose_prefix: "Choose",
      
      // Options Values
      opt_sandy: "Sandy",
      opt_clay: "Clay",
      opt_silt: "Silt",
      opt_arid: "Arid",
      opt_humid: "Humid",
      opt_cold: "Cold",
      opt_tomato: "Tomato",
      opt_wheat: "Wheat",
      opt_corn: "Corn",

      // Alerts
      alert_missing_rec: "Please select both Soil Type and Climate!",
      alert_missing_calc: "Please fill all fields and enter land area!",
      // ===== Auth (Login & Signup) =====
login_welcome: "Welcome back!",
login_subtitle: "Enter your Credentials to access your account",
login_email_label: "Email address",
login_email_placeholder: "Enter your email",
login_password_label: "Password",
login_password_placeholder: "Enter your password",
login_remember: "Remember for 30 days",
login_btn: "Login",
login_no_account: "Don't have an account?",
login_signup_link: "Sign Up",
login_success: "🔓 Login Successful",
login_error: "Wrong email or password",

signup_title: "Create Account",
signup_name_placeholder: "Name",
signup_email_placeholder: "Email",
signup_password_placeholder: "Password",
signup_btn: "Sign Up",
signup_have_account: "Already have an account?",
signup_signin_link: "Sign In",
signup_success: "🎉 Account created successfully",

      
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
      who_we_are:" من نحن ! ",

      // ===== Our Numbers Section =====
      numbers_title: "أرقامنا",
      numbers_subtitle: "ما هي نتائجنا؟",
      exp_years: "سنوات من الخبرة",
      test_plants: "نباتات تم فحصها",
      vital_signs: "كشف العلامات الحيوية",
      suitable_dust: "كشف التربة المناسبة",

      // ===== Our Services Section (New) =====
      services_title: "خدماتنا",
      services_subtitle: "خدماتنا في هذا المجال تهتم بصحة النبات",
      service_vital_signs: "كشف العلامات الحيوية",
      service_suitable_dust: "كشف التربة المناسبة",

      // ===== Footer =====
      footer_about: "من نحن",
      footer_services: "خدماتنا",
      footer_contact: "تواصل معنا",
      footer_privacy: "سياسة الخصوصية",
      footer_terms: "الشروط والأحكام",
      footer_copyright: "© حقوق النشر {{year}}، جميع الحقوق محفوظة @معاذ الصادق",
      // ===== Categories Section =====
      categories_title: "تصنيفاتنا",
      categories_subtitle: "اختر النوع المناسب لنباتك",
      categories_description: "استكشف عالم النباتات بعمق أكبر؛ من خلال الضغط على زر الاستكشاف، ستنتقل إلى صفحة متكاملة تعرض لك أنواع النباتات المختلفة، وتساعدك في التعرف على الأمراض التي قد تصيبها، مع تقديم نصائح علمية دقيقة وعلاجات فعالة لكل مشكلة لضمان نمو نباتاتك بصحة وازدهار.",
      explore: "استكشف الآن",
      live_demo: "عرض مباشر",
      trendy_plant: "نباتات منزلية رائجة",
      example_btn: "مثال توضيحي",
      // ===== Contact Page =====
      contact_info_title: "معلومات التواصل",
      contact_info_sub: "أرسل لنا رسالة لبدء الدردشة الحية!",
      contact_address: "١٣٢ شارع دارتموث، عباس العقاد، القاهرة ٠٢١٥٦، مصر",
      first_name: "الاسم الأول",
      last_name: "اسم العائلة",
      email: "البريد الإلكتروني",
      phone_number: "رقم الهاتف",
      message: "الرسالة",
      message_placeholder: "اكتب رسالتك هنا...",
      send_btn: "إرسال الرسالة",
      // ===== Agriculture Services =====
      services_main_title: "خدماتنا",
      services_sub_title: "ماذا نقدم؟",
      
      // Card 1: Recommendation
      card_rec_title: "اختيار أفضل المحاصيل",
      card_rec_sub: "اختر نوع التربة والمناخ للحصول على توصيات دقيقة",
      btn_get_rec: "الحصول على التوصية",
      res_recommended: "المحصول الموصى به",
      res_reason: "بناءً على تربة {{soil}} ومناخ {{climate}}.",
      crop_result: "البطيخ والفول السوداني",

      // Card 2: Calculator
      card_calc_title: "حاسبة الري والتسميد",
      card_calc_sub: "احسب الاحتياجات المائية والسمادية لمساحتك الخاصة",
      btn_get_calc: "عرض النتائج",
      water_needed: "الماء المطلوب",
      fertilizer: "السماد",
      liters_week: "لتر/أسبوعياً",
      kg_unit: "كجم (NPK 20-20-20)",

      // Form Fields & Options
      label_soil: "نوع التربة",
      label_climate: "المناخ",
      label_crop: "المحصول",
      label_land: "مساحة الأرض (فدان)",
      placeholder_land: "أدخل مساحة الأرض...",
      choose_prefix: "اختر",
      
      // Options Values
      opt_sandy: "رملية",
      opt_clay: "طينية",
      opt_silt: "غرينية",
      opt_arid: "قاحل",
      opt_humid: "رطب",
      opt_cold: "بارد",
      opt_tomato: "طماطم",
      opt_wheat: "قمح",
      opt_corn: "ذرة",

      // Alerts
      alert_missing_rec: "يرجى اختيار نوع التربة والمناخ معاً!",
      alert_missing_calc: "يرجى ملء جميع الحقول وإدخال مساحة الأرض!",
      // ===== Auth (Login & Signup) =====
login_welcome: "مرحبًا بعودتك!",
login_subtitle: "أدخل بياناتك للوصول إلى حسابك",
login_email_label: "البريد الإلكتروني",
login_email_placeholder: "أدخل بريدك الإلكتروني",
login_password_label: "كلمة المرور",
login_password_placeholder: "أدخل كلمة المرور",
login_remember: "تذكرني لمدة 30 يوم",
login_btn: "تسجيل الدخول",
login_no_account: "ليس لديك حساب؟",
login_signup_link: "إنشاء حساب",
login_success: "🔓 تم تسجيل الدخول بنجاح",
login_error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",

signup_title: "إنشاء حساب",
signup_name_placeholder: "الاسم",
signup_email_placeholder: "البريد الإلكتروني",
signup_password_placeholder: "كلمة المرور",
signup_btn: "إنشاء حساب",
signup_have_account: "لديك حساب بالفعل؟",
signup_signin_link: "تسجيل الدخول",
signup_success: "🎉 تم إنشاء الحساب بنجاح",

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