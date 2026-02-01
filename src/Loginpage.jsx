import React, { useState } from "react";
import flowerImage from "./assets/flowerimage.jpg";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [active, setActive] = useState(false);

  // دالة تسجيل الدخول (Sign In)
  const handleSubmit = (values) => {
    localStorage.setItem("hasloged", "true");

    // نتحقق إذا كان هناك بيانات مخزنة مسبقاً (الاسم والصورة)
    const savedData = localStorage.getItem("user_data");

    if (savedData) {
      toast.success(t("login_success")); // أهلاً بعودتك (سيجد صورته واسمه)
    } else {
      // لو دخل بحساب جديد بدون "Signup" مسبق، نضع له بيانات افتراضية
      const defaultData = { name: "User", image: null };
      localStorage.setItem("user_data", JSON.stringify(defaultData));
      toast.success(t("login_success"));
    }
    
    navigate("/");
  };

  // دالة إنشاء حساب جديد (Sign Up)
  const handleSignup = (values) => {
    const userData = {
      name: values.name,
      image: null // سيقوم بتغييرها لاحقاً من الهيدر
    };

    localStorage.setItem("user_data", JSON.stringify(userData));
    localStorage.setItem("hasloged", "true");

    toast.success(t("signup_success"));
    navigate("/");
  };

  const validationscema = yup.object({
    email: yup.string().required().email(),
    password: yup.string().required().min(5),
  });

  const signupSchema = yup.object({
    name: yup.string().min(3).required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  });

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full bg-white overflow-hidden">

        {/* ===== Login Section (Sign In) ===== */}
        <div className={`absolute top-0 left-0 h-full w-full md:w-1/2 flex items-center justify-center transition-all duration-700 ease-in-out ${active ? "md:translate-x-full md:opacity-0 md:pointer-events-none hidden md:flex" : "opacity-100 z-20"}`}>
          <Formik initialValues={{ email: "", password: "" }} validationSchema={validationscema} onSubmit={handleSubmit}>
            <Form className="w-full max-w-md px-10 flex flex-col gap-4">
              <h1 className="text-3xl font-Poppins text-center">{t("login_welcome")}</h1>
              <p className="text-center">{t("login_subtitle")}</p>
              
              <label className="font-medium font-poppins">{t("login_email_label")}</label>
              <Field name="email" type="email" className="border rounded-full p-3" placeholder={t("login_email_placeholder")} />
              <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
              
              <label className="font-medium font-poppins">{t("login_password_label")}</label>
              <Field name="password" type="password" className="border rounded-full p-3" placeholder={t("login_password_placeholder")} />
              <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
              
              <button type="submit" className="mt-4 bg-green-700 text-white py-3 rounded-full hover:bg-green-800 transition">{t("login_btn")}</button>
              <p className="text-center">{t("login_no_account")} <span onClick={() => setActive(true)} className="text-green-700 font-semibold cursor-pointer underline">{t("login_signup_link")}</span></p>
            </Form>
          </Formik>
        </div>
       

        {/* ===== Signup Section ===== */}
        <div className={`absolute top-0 left-0 h-full w-full md:w-1/2 flex items-center justify-center transition-all duration-700 ease-in-out ${active ? "opacity-100 z-20 md:translate-x-full" : "md:opacity-0 md:pointer-events-none hidden md:flex"}`}>
          <Formik initialValues={{ name: "", email: "", password: "" }} validationSchema={signupSchema} onSubmit={handleSignup}>
            <Form className="w-full max-w-md px-9 flex flex-col gap-4">
              <h1 className="text-3xl font-medium font-poppins text-center">{t("signup_title")}</h1>
              <label className="font-medium font-poppins">{t("signup_name_label")}</label>
              <Field name="name" type="text" placeholder={t("signup_name_placeholder")} className="border rounded-full p-3"  />
              <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
              <label className="font-medium font-poppins">{t("signup_email_label")}</label>
              <Field name="email" type="email" placeholder={t("signup_email_placeholder")} className="border rounded-full p-3" />
              <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
              <label className="font-medium font-poppins">{t("signup_password_label")}</label>
              <Field name="password" type="password" placeholder={t("signup_password_placeholder")} className="border rounded-full p-3" />
              <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
              <button type="submit" className="mt-4 bg-green-700 text-white py-3 rounded-full hover:bg-green-800 transition">{t("signup_btn")}</button>
              <p className="text-center">{t("signup_have_account")} <span onClick={() => setActive(false)} className="text-green-700 font-semibold cursor-pointer underline">{t("signup_signin_link")}</span></p>
            </Form>
          </Formik>
        </div>

        <div className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full bg-cover rounded-l-3xl bg-center transition-transform duration-700 ease-in-out ${active ? "-translate-x-full" : ""}`} style={{ backgroundImage: `url(${flowerImage})` }} />
      </div>
    </div>
  );
}