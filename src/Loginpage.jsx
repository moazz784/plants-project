import React, { useState } from "react";
import flowerImage from "./assets/flowerimage.jpg"; 


export default function Login() {
  const [active, setActive] = useState(false);

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center overflow-hidden">
      
      <div className="relative w-full h-full bg-white overflow-hidden">

    
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center transition-all duration-700
          ${active ? "translate-x-full opacity-0" : "opacity-100 z-20"}`}
        >
          <form className="w-full max-w-md px-10 flex flex-col gap-4">
            <ul>
              <li>
            <h1 className="text-3xl font-bold text-center">Welcome back! </h1>
              </li>
               <li>
            <h1>Enter your Credentials to access your account</h1>
               </li>
            </ul>
            <label className="font-bold">Email address</label>
            <input className="border rounded-lg p-3" type="email" placeholder="Enter your email" />
            <label className="font-bold">Password</label>
            <input className="border rounded-lg p-3" type="password" placeholder="Password" />
            <button className="mt-4 bg-green-700 text-white py-3 rounded-full">
              Sign In
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
          </form>
        </div>

        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center transition-all duration-700
          ${active ? "translate-x-full opacity-100 z-20" : "opacity-0 z-10"}`}
        >
          <form className="w-full max-w-md px-10 flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-center">Create Account</h1>
            <input className="border rounded-lg p-3" type="text" placeholder="Name" />
            <input className="border rounded-lg p-3" type="email" placeholder="Email" />
            <input className="border rounded-lg p-3" type="password" placeholder="Password" />
            <button className="mt-4 bg-green-700 text-white py-3 rounded-full">
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
          </form>
        </div>
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full bg-cover bg-center transition-transform duration-700
          ${active ? "-translate-x-full" : ""}`}
         style={{ backgroundImage: `url(${flowerImage})` }}
        />

      </div>
    </div>
  );
}
