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
      who_we_are: "who we are !",

      // ===== Our Numbers Section =====
      numbers_title: "OUR NUMBERS",
      numbers_subtitle: "WHAT IS OUR RESULTS?",
      exp_years: "Years of experience",
      test_plants: "Tests plants",
      vital_signs: "Detect vital Signs",
      suitable_dust: "Detect Suitable Dust",

      // ===== Our Services Section =====
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

      // ===== Encyclopedia (Plants Category) =====
      title: "Plant Diagnosis Encyclopedia",
      subtitle: "Click on any plant to view injury and treatment details",
      pathologicalProblem: "The Pathological Problem",
      causeAnalysis: "Cause Analysis",
      immediateTreatment: "Immediate Treatment Plan",
      closeBtn: "Okay, I started treatment",
      
      cat_house: "Trendy House",
      cat_hardy: "Hardy",
      cat_indoor: "Indoor",
      cat_climbing: "Climbing",
      cat_succulent: "Succulent",

      plants: [
        {
          fullName: "Root or Crown Mold",
          disease: "Mold appears on the crown or stem area, and the tissue turns brown and loses its hardness.",
          cause: "Overwatering, inadequate drainage, or clogged drainage openings.",
          treatment: "Reduce irrigation water, and improve ventilation or the drainage system."
        },
        {
          fullName: "Wilt (Seedling Collapse)",
          disease: "Stem rot occurs near the soil surface, leading to the collapse and death of young seedlings.",
          cause: "A fungal disease that affects seedlings.",
          treatment: "Dispose of infected plants, use sterile soil, and use fungicides."
        },
        {
          fullName: "Leaf Blight – Leaf Spot",
          disease: "Yellow, red, or brown spots appear on the leaves, and some spots fall off after drying.",
          cause: "A fungal or bacterial infection affecting the leaf tissue.",
          treatment: "Remove infected parts and spray with appropriate fungicide."
        },
        {
          fullName: "Powdery Mildew",
          disease: "Soft white flour-like spots appear on leaves and flower buds.",
          cause: "High humidity conditions and lack of ventilation.",
          treatment: "Move to a ventilated place, remove affected parts, and clean with alcohol or malathion."
        },
        {
          fullName: "Boring Insects (Anteels)",
          disease: "Holes appear in the stem and roots as insects live inside, attracting other pests.",
          cause: "Insect infestation and penetration into internal plant tissues.",
          treatment: "Use malathion spray for control and elimination of insects."
        },
        {
          fullName: "Aphids (El Mennat)",
          disease: "A sap-sucking insect that affects leaves and flower buds.",
          cause: "Insect infestation sucking the plant's essential nutrients.",
          treatment: "Wash the plant with foaming water (without using an antiseptic)."
        },
        {
          fullName: "Mealybug",
          disease: "It is shaped like a round, white insect that forms spider web on the leaves.",
          cause: "Infestation of mealybug insects creating protective waxy webs.",
          treatment: "Wash the leaves with a cotton ball soaked in alcohol or spray with malathion."
        },
        {
          fullName: "Scale Insect",
          disease: "Small, light, waxy brown circles appear on the back of the leaves and absorb the plant's sap.",
          cause: "Scale insects attaching to the leaf surface to feed on sap.",
          treatment: "Wash with soap solution or spray with malathion."
        },
        {
          fullName: "Snails and Slugs",
          disease: "They create shiny passages on leaves and pots and eat the leaves at night.",
          cause: "Mollusk activity during high humidity or nighttime.",
          treatment: "Manual purification and disposal of insects."
        },
        {
          fullName: "Red Spider",
          disease: "It causes spider tissue on the leaves resulting in perforated spots, and often appears on the green parts and leaves.",
          cause: "Spider mite infestation creating fine webs and puncturing cells.",
          treatment: "Isolate and wash the plant with foamy water or use pesticides such as thidevol or Comet."
        },
        {
          fullName: "Thrips",
          disease: "It causes brown or black spots to appear on leaves and flowers.",
          cause: "Thrips insects feeding on plant tissue causing scarring.",
          treatment: "Spray with soap and water while manually purifying the larvae, avoiding the soap solution falling on the soil."
        }
      ],

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
      card_rec_title: "Select Best Crops",
      card_rec_sub: "choose soil type and climate to get recommendations",
      btn_get_rec: "Get Recommendation",
      res_recommended: "Recommended",
      res_reason: "Based on {{soil}} soil and {{climate}} climate.",
      crop_result: "Watermelon & Peanuts",
      card_calc_title: "Irrigation & Fertilization Calculator",
      card_calc_sub: "calculate requirements for your specific area",
      btn_get_calc: "Get Best Result",
      water_needed: "Water Needed",
      fertilizer: "Fertilizer",
      liters_week: "Liters/Week",
      kg_unit: "Kg (NPK 20-20-20)",
      label_soil: "Soil Type",
      label_climate: "Climate",
      label_crop: "Crop",
      label_land: "Land Area (acres)",
      placeholder_land: "Enter land area...",
      choose_prefix: "Choose",
      opt_sandy: "Sandy",
      opt_clay: "Clay",
      opt_silt: "Silt",
      opt_arid: "Arid",
      opt_humid: "Humid",
      opt_cold: "Cold",
      opt_tomato: "Tomato",
      opt_wheat: "Wheat",
      opt_corn: "Corn",
      alert_missing_rec: "Please select both Soil Type and Climate!",
      alert_missing_calc: "Please fill all fields and enter land area!",

      // ===== Auth =====
      login_subtitle: "Enter your Credentials to access your account",
      login_welcome: "Welcome back!",
      login_email_placeholder: "Enter your email",
      login_email_label: "Email address",
      login_password_placeholder: "Enter your password",
      login_password_label: "Password",
      login_btn: "Login",
      login_remember: "Remember for 30 days",
      login_signup_link: "Sign Up",
      login_no_account: "Don't have an account?",
      login_error: "Wrong email or password",
      login_success: "🔓 Login Successful",
      signup_name_placeholder: "Enter your name",
      signup_title: "Create Account",
      signup_password_placeholder: "Password",
      signup_email_placeholder: "Enter your Email",
      signup_have_account: "Already have an account?",
      signup_btn: "Sign Up",
      signup_success: "🎉 Account created successfully",
      signup_signin_link: "Sign In",
      logout_success: "🔒You have logged out successfully",
      signup_email_label: "Email address",
      signup_password_label: "Password",
      signup_name_label: "Name"
    }
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
      who_we_are: " من نحن ! ",

      // ===== Our Numbers Section =====
      numbers_title: "أرقامنا",
      numbers_subtitle: "ما هي نتائجنا؟",
      exp_years: "سنوات من الخبرة",
      test_plants: "نباتات تم فحصها",
      vital_signs: "كشف العلامات الحيوية",
      suitable_dust: "كشف التربة المناسبة",

      // ===== Our Services Section =====
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

      // ===== Encyclopedia (Plants Category) =====
      title: "موسوعة تشخيص النباتات",
      subtitle: "اضغط على أي نبتة لعرض تفاصيل الإصابة والعلاج",
      pathologicalProblem: "المشكلة المرضية",
      causeAnalysis: "تحليل السبب",
      immediateTreatment: "خطة العلاج الفوري",
      closeBtn: "حسناً، بدأت العلاج",

      cat_house: "منزلي عصري",
      cat_hardy: "قوي التحمل",
      cat_indoor: "داخلي",
      cat_climbing: "متسلق",
      cat_succulent: "عصاري",

      plants: [
        {
          fullName: "عفن الجذور أو التاج",
          disease: "ظهور عفن على منطقة التاج أو الساق، وتتحول الأنسجة للون البني وتفقد صلابتها.",
          cause: "الإفراط في الري، أو عدم كفاية تصريف المياه، أو انسداد فتحات التصريف.",
          treatment: "تقليل كمية مياه الري، وتحسين التهوية أو نظام تصريف المياه في الوعاء."
        },
        {
          fullName: "الذبول (انهيار الشتلات)",
          disease: "حدوث تعفن للساق بالقرب من سطح التربة، مما يؤدي إلى انهيار الشتلات الصغيرة وموتها.",
          cause: "مرض فطري يصيب الشتلات.",
          treatment: "التخلص من النبات المصاب واستخدام تربة معقمة، تنظيف الوعاء بمطهر، أو استخدام مبيدات فطرية."
        },
        {
          fullName: "لفحة وتبقع الأوراق",
          disease: "ظهور بقع صفراء أو حمراء أو بنية على سطح الأوراق، وتساقط بعضها بعد جفافها.",
          cause: "عدوى فطرية أو بكتيرية تصيب أنسجة الأوراق.",
          treatment: "التخلص من الأجزاء المصابة، ورش النبات بالمبيد الفطري المناسب."
        },
        {
          fullName: "البياض الدقيقي",
          disease: "ظهور بقع بيضاء ناعمة تشبه الدقيق على الأوراق وبراعم الزهور.",
          cause: "ظروف الرطوبة العالية ونقص التهوية.",
          treatment: "نقل النبات لمكان جيد التهوية، إزالة الأجزاء المصابة، والتنظيف بقطنة مبللة بالكحول أو الرش بالملاثيون."
        },
        {
          fullName: "الحشرات الثاقبة (النمل)",
          disease: "ظهور ثقوب في الساق والجذور نتيجة معيشة الحشرات بداخلها، مما يجذب حشرات ضارة أخرى.",
          cause: "إصابة حشرية واختراق الحشرات لأنسجة النبات الداخلية.",
          treatment: "استخدام رش الملاثيون للمكافحة والقضاء على الحشرات."
        },
        {
          fullName: "حشرة المن",
          disease: "حشرة ماصة للعصارة تصيب الأوراق وبراعم الزهور.",
          cause: "إصابة حشرية تمتص العناصر الغذائية الأساسية من النبات.",
          treatment: "غسل النبات بالماء الصابوني (الرغوي) مع تجنب استخدام المطهرات الكيميائية."
        },
        {
          fullName: "البق الدقيقي",
          disease: "تظهر على شكل حشرة بيضاء مستديرة تشكل ما يشبه خيوط العنكبوت على الأوراق.",
          cause: "إصابة بحشرات البق الدقيقي التي تفرز طبقة شمعية واقية.",
          treatment: "مسح الأوراق بقطنة مبللة بالكحول أو الرش باستخدام الملاثيون."
        },
        {
          fullName: "الحشرة القشرية",
          disease: "دوائر بنية شمعية صغيرة تظهر على ظهر الأوراق وتمتص عصارة النبات.",
          cause: "التصاق الحشرات القشرية بسطح الورقة للتغذية.",
          treatment: "الغسل بمحلول صابوني أو الرش بالملاثيون."
        },
        {
          fullName: "القواقع والبزاقات",
          disease: "تترك ممرات لامعة على الأوراق والأواني وتتغذى على الأوراق ليلاً.",
          cause: "نشاط الرخويات بسبب الرطوبة العالية أو الأجواء الليلية.",
          treatment: "التنقية اليدوية للحشرات والتخلص منها."
        },
        {
          fullName: "العنكبوت الأحمر",
          disease: "يسبب نسيجاً عنكبوتياً وبقعاً مثقوبة على الأجزاء الخضراء والأوراق.",
          cause: "إصابة بسوس العنكبوت الذي يفرز خيوطاً دقيقة ويثقب الخلايا.",
          treatment: "عزل النبات وغسله بالماء الرغوي أو استخدام مبيدات مثل Comet أو Thidevol."
        },
        {
          fullName: "حشرة التريبس",
          disease: "تؤدي لظهور بقع بنية أو سوداء على الأوراق والأزهار.",
          cause: "تغذية حشرات التريبس على أنسجة النبات مما يترك ندبات.",
          treatment: "الرش بالماء والصابون مع إزالة اليرقات يدوياً، مع الحرص على عدم وصول الصابون للتربة."
        }
      ],

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
      card_rec_title: "اختيار أفضل المحاصيل",
      card_rec_sub: "اختر نوع التربة والمناخ للحصول على توصيات دقيقة",
      btn_get_rec: "الحصول على التوصية",
      res_recommended: "المحصول الموصى به",
      res_reason: "بناءً على تربة {{soil}} ومناخ {{climate}}.",
      crop_result: "البطيخ والفول السوداني",
      card_calc_title: "حاسبة الري والتسميد",
      card_calc_sub: "احسب الاحتياجات المائية والسمادية لمساحتك الخاصة",
      btn_get_calc: "عرض النتائج",
      water_needed: "الماء المطلوب",
      fertilizer: "السماد",
      liters_week: "لتر/أسبوعياً",
      kg_unit: "كجم (NPK 20-20-20)",
      label_soil: "نوع التربة",
      label_climate: "المناخ",
      label_crop: "المحصول",
      label_land: "مساحة الأرض (فدان)",
      placeholder_land: "أدخل مساحة الأرض...",
      choose_prefix: "اختر",
      opt_sandy: "رملية",
      opt_clay: "طينية",
      opt_silt: "غرينية",
      opt_arid: "قاحل",
      opt_humid: "رطب",
      opt_cold: "بارد",
      opt_tomato: "طماطم",
      opt_wheat: "قمح",
      opt_corn: "ذرة",
      alert_missing_rec: "يرجى اختيار نوع التربة والمناخ معاً!",
      alert_missing_calc: "يرجى ملء جميع الحقول وإدخال مساحة الأرض!",

      // ===== Auth =====
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
      signup_name_placeholder: "ادخل الاسم",
      signup_email_placeholder: "ادخل البريد الالكتروني ",
      signup_password_placeholder: "كلمة المرور",
      signup_btn: "إنشاء حساب",
      signup_have_account: "لديك حساب بالفعل؟",
      signup_signin_link: "تسجيل الدخول",
      signup_success: "🎉 تم إنشاء الحساب بنجاح",
      logout_success: "✅ تم تسجيل الخروج بنجاح",
      signup_email_label: "الايميل",
      signup_password_label: "الباسورد",
      signup_name_label: "الاسم"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "cookie", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"]
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;