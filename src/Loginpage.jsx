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

  const handleSubmit = (values) => {
    let dataverfication = true;
    if (dataverfication) {
      localStorage.setItem("hasloged", "true");
      toast.success(t("login_success"));
      navigate("/");
    } else {
      toast.error(t("login_error"));
    }
    console.log(values);
  };

  const handleSignup = (values) => {
    localStorage.setItem("hasloged", "true");
    toast.success(t("signup_success"));
    console.log(values);
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

        {/* ===== Login ===== */}
        <div
          className={`
            absolute top-0 left-0 h-full w-full md:w-1/2
            flex items-center justify-center
            transition-all duration-700 ease-in-out
            ${
              active
                ? "md:translate-x-full md:opacity-0 md:pointer-events-none hidden md:flex"
                : "opacity-100 z-20"
            }
          `}
        >
          <Formik
            initialValues={{ email: "", password: "", remember: false }}
            validationSchema={validationscema}
            onSubmit={handleSubmit}
          >
            <Form className="w-full max-w-md px-10 flex flex-col gap-4">
              <h1 className="text-3xl font-Poppins text-center">
                {t("login_welcome")}
              </h1>

              <p className="text-center">{t("login_subtitle")}</p>

              <label className="font-bold">{t("login_email_label")}</label>
              <Field
                name="email"
                type="email"
                placeholder={t("login_email_placeholder")}
                className="border rounded-lg p-3"
              />
              <ErrorMessage name="email" component="p" className="text-red-500" />

              <label className="font-bold">{t("login_password_label")}</label>
              <Field
                name="password"
                type="password"
                placeholder={t("login_password_placeholder")}
                className="border rounded-lg p-3"
              />
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500"
              />

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <Field
                  type="checkbox"
                  name="remember"
                  className="w-4 h-4 accent-green-700"
                />
                <span className="text-sm text-gray-700">
                  {t("login_remember")}
                </span>
              </label>

              <button
                type="submit"
                className="mt-4 cursor-pointer bg-green-700 text-white py-3 rounded-full"
              >
                {t("login_btn")}
              </button>

              <p className="text-center">
                {t("login_no_account")}{" "}
                <span
                  onClick={() => setActive(true)}
                  className="text-green-700 font-semibold cursor-pointer underline"
                >
                  {t("login_signup_link")}
                </span>
              </p>
            </Form>
          </Formik>
        </div>

        {/* ===== Signup ===== */}
        <div
          className={`
            absolute top-0 left-0 h-full w-full md:w-1/2
            flex items-center justify-center
            transition-all duration-700 ease-in-out
            ${
              active
                ? "opacity-100 z-20 md:translate-x-full"
                : "md:opacity-0 md:pointer-events-none hidden md:flex"
            }
          `}
        >
          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={signupSchema}
            onSubmit={handleSignup}
          >
            <Form className="w-full max-w-md px-10 flex flex-col gap-4">
              <h1 className="text-3xl font-bold text-center">
                {t("signup_title")}
              </h1>

              <Field
                name="name"
                type="text"
                placeholder={t("signup_name_placeholder")}
                className="border rounded-lg p-3"
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-500 text-sm"
              />

              <Field
                name="email"
                type="email"
                placeholder={t("signup_email_placeholder")}
                className="border rounded-lg p-3"
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500 text-sm"
              />

              <Field
                name="password"
                type="password"
                placeholder={t("signup_password_placeholder")}
                className="border rounded-lg p-3"
              />
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500 text-sm"
              />

              <button
                type="submit"
                className="mt-4 cursor-pointer bg-green-700 text-white py-3 rounded-full"
              >
                {t("signup_btn")}
              </button>

              <p className="text-center">
                {t("signup_have_account")}{" "}
                <span
                  onClick={() => setActive(false)}
                  className="text-green-700 font-semibold cursor-pointer underline"
                >
                  {t("signup_signin_link")}
                </span>
              </p>
            </Form>
          </Formik>
        </div>

        {/* ===== Image ===== */}
        <div
          className={`
            hidden md:block
            absolute top-0 left-1/2 w-1/2 h-full
            bg-cover bg-center
            transition-transform duration-700 ease-in-out
            ${active ? "-translate-x-full" : ""}
          `}
          style={{ backgroundImage: `url(${flowerImage})` }}
        />
      </div>
    </div>
  );
}

