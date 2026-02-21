import React, { useState } from 'react'; 
import { Phone, Mail, MapPin } from "lucide-react";
import plantIo from "./assets/flowem.png";
import { useTranslation } from "react-i18next";
import { api } from "./api"; 
import toast from "react-hot-toast";

export default function Contact() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 

  
    if (!formData.email || !formData.message) {
      toast.error(isArabic ? "برجاء ملء الحقول المطلوبة" : "Please fill required fields");
      return;
    }

    const loadingToast = toast.loading(isArabic ? "جاري الإرسال..." : "Sending...");

   try {
  
  await api.messages.create({
    SenderFirstName: formData.firstName,
    SenderLastName: formData.lastName,
    SenderEmail: formData.email,
    Body: formData.message 
  });

  toast.success(isArabic ? "تم إرسال رسالتك بنجاح!" : "Message sent successfully!", { id: loadingToast });
  setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });

} catch (error) {
  console.log("Details:", error);
  
  toast.error(isArabic ? "خطأ في بيانات الإرسال" : "Validation Error", { id: loadingToast });
}
  };

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section 
      className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-6" 
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        
        <div className="relative bg-green-800 text-white p-8 flex flex-col justify-between overflow-hidden">
          <div>
            <h2 className="text-2xl font-bold mb-2">{t("contact_info_title")}</h2>
            <p className="text-sm text-green-100 mb-8">{t("contact_info_sub")}</p>

            <div className="space-y-10 text-sm">
              <div className="flex items-center z-20 gap-3">
                <Phone size={18} className={isArabic ? "rotate-[270deg]" : ""} />
                <span className="z-20 font-sans">+01015486616</span>
              </div>
              <div className="flex items-center z-20 gap-3">
                <Mail size={18} />
                <span className="z-20 font-sans">Ahmedomarali23@gmail.com</span>
              </div>
              <div className="flex items-center z-20 gap-3">
                <MapPin size={18} className="mt-1" />
                <span className="z-20 leading-relaxed">{t("contact_address")}</span>
              </div>
            </div>
          </div>

          <div className={`absolute bottom-0 ${isArabic ? 'left-0' : 'right-0'} w-40 h-40 bg-green-700 rounded-full opacity-40 ${isArabic ? '-translate-x-1/3' : 'translate-x-1/3'} translate-y-1/3`} />
          <img
            src={plantIo}
            alt="Plant"
            className={`absolute -bottom-7 ${isArabic ? '-left-7' : '-right-7'} w-40 md:w-52 lg:w-60 z-1 lg:z-20 pointer-events-none ${isArabic ? 'scale-x-[-1]' : ''}`}
          />
        </div>

        
        <div className="p-8 bg-white">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1 text-gray-700">{t("first_name")}</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border-b border-gray-300 outline-none py-2 focus:border-green-700 transition bg-transparent"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1 text-gray-700">{t("last_name")}</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border-b border-gray-300 outline-none py-2 focus:border-green-700 transition bg-transparent"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1 text-gray-700">{t("email")}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b border-gray-300 outline-none py-2 focus:border-green-700 transition bg-transparent"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1 text-gray-700">{t("phone_number")}</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border-b border-gray-300 outline-none py-2 focus:border-green-700 transition bg-transparent"
              />
            </div>

            <div className="md:col-span-2 flex flex-col">
              <label className="text-sm font-semibold mb-1 text-gray-700">{t("message")}</label>
              <textarea
                rows="3"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t("message_placeholder")}
                className="w-full border-b border-gray-300 outline-none py-2 resize-none focus:border-green-700 transition bg-transparent"
              />
            </div>

            <div className={`md:col-span-2 flex ${isArabic ? 'justify-start' : 'justify-end'} mt-6`}>
              <button 
                type="submit"
                className="bg-green-700 text-white px-10 py-3 rounded-lg shadow-md hover:bg-green-800 transition active:scale-95 font-medium"
              >
                {t("send_btn")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}