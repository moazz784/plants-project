import React, { useState } from "react";
import flowerImage from "./assets/flowerimage.jpg";
import { ErrorMessage, Field, Form, Formik, } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import toast from "react-hot-toast";
export default function Login() {
const navigate = useNavigate();
  const [active, setActive] = useState(false);
   const handleSubmit=(values)=>{
    let dataverfication = true;
    if (dataverfication){
      localStorage.setItem("hasloged", "true");
      toast.success('🔓 Login Successful');
      navigate('/');
    }else{
      toast.error('wrong email or password')
    }
    console.log(values);
   }

  const handleSignup = (values) => {
  localStorage.setItem("hasloged", "true"); 
  toast.success("🎉 Account created successfully");
  console.log(values);
  navigate('/');
};


   const validationscema = yup.object({
email :yup.string().required().email(),
password : yup.string().required().min(5),

 
   });
   const signupSchema = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),

  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

   
  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full bg-white overflow-hidden">

        
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
  initialValues={{
    email: '',
    password: '',
    remember: false
  }}
  validationSchema={validationscema}
  onSubmit={handleSubmit}
>

          <Form className="w-full max-w-md px-10 flex flex-col gap-4">
  <h1 className="text-3xl font-Poppins text-center">Welcome back!</h1>

  <p className="text-center">
    Enter your Credentials to access your account
  </p>

  <label className="font-bold">Email address</label>
  <Field
    name="email"
    className="border rounded-lg p-3"
    type="email"
    placeholder="Enter your email"
  />
  <ErrorMessage name="email" className="text-red-500" component="p" />

  <label className="font-bold">Password</label>
  <Field
    name="password"
    className="border rounded-lg p-3"
    type="password"
    placeholder="Enter your password"
  />
  <ErrorMessage name="password" className="text-red-500" component="p" />

  
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <Field
      type="checkbox"
      name="remember"
      className="w-4 h-4 accent-green-700"
    />
    <span className="text-sm text-gray-700">
      Remember for 30 days
    </span>
  </label>

  <button
    type="submit"
    className="mt-4 cursor-pointer bg-green-700 text-white py-3 rounded-full"
  >
    Login
  </button>

  <p className="text-center">
    Don't have an account?{" "}
    <span
      onClick={() => setActive(true)}
      className="text-green-700 font-semibold cursor-pointer underline"
    >
      Sign Up
    </span>
  </p>
</Form>

          </Formik>
          
        </div>
       
        
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
  initialValues={{
    name: "",
    email: "",
    password: "",
  }}
  validationSchema={signupSchema}
  onSubmit={handleSignup} 
>


  <Form className="w-full max-w-md px-10 flex flex-col gap-4">
    <h1 className="text-3xl font-bold text-center">Create Account</h1>

    
    <Field
      name="name"
      type="text"
      placeholder="Name"
      className="border rounded-lg p-3"
    />
    <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />

    
    <Field
      name="email"
      type="email"
      placeholder="Email"
      className="border rounded-lg p-3"
    />
    <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />

  
    <Field
      name="password"
      type="password"
      placeholder="Password"
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
      Sign Up
    </button>

    <p className="text-center">
      Already have an account?{" "}
      <span
        onClick={() => setActive(false)}
        className="text-green-700 font-semibold cursor-pointer underline"
      >
        Sign In
      </span>
    </p>
  </Form>
</Formik>

        </div>

        
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
