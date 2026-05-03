import React, { useState } from "react";
import flowerImage from "./assets/flowerimage.jpg";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { api, getErrorMessage } from "./api";
import { useAuth } from "./AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [active, setActive] = useState(false);
  const { login: authLogin } = useAuth(); 


  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.auth.login(values.email, values.password);
  
      
      authLogin(response.user);
      
      toast.success(t("login_success"));
      navigate("/");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  
  const handleSignup = async (values, { setSubmitting }) => {
    try {
      const response = await api.auth.register(values.name, values.email, values.password);
      
      authLogin(response.user);
      
      toast.success(t("signup_success"));
      navigate("/");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
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
        
        {/* Login Form */}
        <div
          className={`absolute top-0 left-0 h-full w-full md:w-1/2 flex items-center justify-center transition-all duration-700 ease-in-out ${
            active
              ? "md:translate-x-full md:opacity-0 md:pointer-events-none hidden md:flex"
              : "opacity-100 z-20"
          }`}
        >
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationscema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="w-full max-w-md px-10 flex flex-col gap-4">
                <h1 className="text-3xl text-center">{t("login_welcome")}</h1>
                <p className="text-center">{t("login_subtitle")}</p>

                <label>{t("login_email_label")}</label>
                <Field
                  name="email"
                  type="email"
                  className="border-2 border-green-400 focus:border-green-700 focus:ring-2 focus:ring-green-600 outline-none rounded-[15px] p-3 transition"
                  placeholder={t("login_email_placeholder")}
                />
                <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />

                <div className="flex justify-between items-center">
                  <label>{t("login_password_label")}</label>
                  <span
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-green-700 cursor-pointer hover:underline"
                  >
                    {t("signup_forget")}
                  </span>
                </div>

                <Field
                  name="password"
                  type="password"
                  className="border-2 border-green-400 focus:border-green-700 focus:ring-2 focus:ring-green-600 outline-none rounded-[15px] p-3 transition"
                  placeholder={t("login_password_placeholder")}
                />
                <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 bg-green-700 text-white py-3 rounded-[15px] hover:bg-green-800 transition disabled:bg-gray-400"
                >
                  {isSubmitting ? "Wait..." : t("login_btn")}
                </button>

                
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-sm text-gray-500">Or</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <div className="flex gap-4 w-full">
                  <button type="button" className="flex-1 flex items-center cursor-pointer justify-center gap-2 border border-gray-300 rounded-[12px] py-2 text-sm hover:bg-gray-50 transition">
                    <FaGoogle className="text-red-500 text-base" /> Google
                  </button>
                  <button type="button" className="flex-1 flex items-center justify-center cursor-pointer gap-2 border border-gray-300 rounded-[12px] py-2 text-sm hover:bg-gray-50 transition">
                    <FaFacebook className="text-blue-600 text-base" /> Facebook
                  </button>
                </div>

                <p className="text-center mt-3">
                  {t("login_no_account")}{" "}
                  <span onClick={() => setActive(true)} className="text-green-700 font-semibold cursor-pointer underline">
                    {t("login_signup_link")}
                  </span>
                </p>
              </Form>
            )}
          </Formik>
        </div>

        {/* Signup Form */}
        <div
          className={`absolute top-0 left-0 h-full w-full md:w-1/2 flex items-center justify-center transition-all duration-700 ease-in-out ${
            active
              ? "opacity-100 z-20 md:translate-x-full"
              : "md:opacity-0 md:pointer-events-none hidden md:flex"
          }`}
        >
          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={signupSchema}
            onSubmit={handleSignup}
          >
            {({ isSubmitting }) => (
              <Form className="w-full max-w-md px-9 flex flex-col gap-4">
                <h1 className="text-3xl text-center">{t("signup_title")}</h1>

                <label>{t("signup_name_label")}</label>
                <Field
                  name="name"
                  type="text"
                  className="border-2 border-green-400 focus:border-green-700 focus:ring-2 focus:ring-green-600 outline-none rounded-[15px] p-3 transition"
                  placeholder={t("signup_name_placeholder")}
                />
                <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />

                <label>{t("signup_email_label")}</label>
                <Field
                  name="email"
                  type="email"
                  className="border-2 border-green-400 focus:border-green-700 focus:ring-2 focus:ring-green-600 outline-none rounded-[15px] p-3 transition"
                  placeholder={t("signup_email_placeholder")}
                />
                <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />

                <label>{t("signup_password_label")}</label>
                <Field
                  name="password"
                  type="password"
                  className="border-2 border-green-400 focus:border-green-700 focus:ring-2 focus:ring-green-600 outline-none rounded-[15px] p-3 transition"
                  placeholder={t("signup_password_placeholder")}
                />
                <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 bg-green-700 text-white py-3 rounded-[15px] hover:bg-green-800 transition disabled:bg-gray-400"
                >
                  {isSubmitting ? "Creating..." : t("signup_btn")}
                </button>

                <p className="text-center">
                  {t("signup_have_account")}{" "}
                  <span onClick={() => setActive(false)} className="text-green-700 font-semibold cursor-pointer underline">
                    {t("signup_signin_link")}
                  </span>
                </p>
              </Form>
            )}
          </Formik>
        </div>

        
        <div
          className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full bg-cover rounded-l-3xl bg-center transition-transform duration-700 ease-in-out ${
            active ? "-translate-x-full" : ""
          }`}
          style={{ backgroundImage: `url(${flowerImage})` }}
        />
      </div>
    </div>
  );
}