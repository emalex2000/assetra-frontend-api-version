"use client";

import { JSX, useState } from "react";
import Navbar from "../../../../components/landing-page/Navbar";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login(): JSX.Element {
  const [phone, setPhone] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  return (
    <>
      <div className="
        flex flex-col lg:flex-row 
        gap-8 lg:gap-10 
        px-4 sm:px-6 md:px-10 lg:px-16 
        py-8 lg:py-12 
        bg-gray-50 min-h-screen
      ">
        
        {/* LEFT IMAGE */}
        <div className="
          w-full lg:w-1/2 
          h-[220px] sm:h-[280px] md:h-[350px] lg:h-auto
        ">
          <img
            src="login-image.png"
            alt="Login visual"
            className="rounded-2xl object-cover w-full h-full"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="
          w-full lg:w-1/2 
          flex flex-col justify-center
        ">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
            Sign up with free trial
          </h1>

          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            Empower your experience, sign up for a free account today
          </p>

          <form className="flex flex-col gap-5">

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">
                Work email*
              </label>
              <input
                type="email"
                placeholder="ex. email@domain.com"
                className="mt-1 w-full h-[48px] px-3 bg-white rounded-md border-none focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-medium">
                Phone number*{" "}
                <span className="text-xs text-gray-400 cursor-pointer">
                  Why?
                </span>
              </label>

              <PhoneInput
                country={"us"}
                value={phone}
                onChange={(value: string) => setPhone(value)}
                inputClass="!w-full !h-[48px] !pl-[60px] !rounded-md !bg-white !border-none"
                buttonClass="!rounded-l-md !bg-white !border-none"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium">
                Password*
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full h-[48px] px-3 pr-10 rounded-md border border-none focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* PASSWORD RULES */}
              <div className="
                text-xs text-gray-500 mt-2 
                grid grid-cols-1 sm:grid-cols-2 gap-1
              ">
                <p>• One lowercase character</p>
                <p>• One uppercase character</p>
                <p>• One number</p>
                <p>• One special character</p>
                <p>• 8 characters minimum</p>
              </div>
            </div>

            {/* EMAIL OPT OUT */}
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input type="checkbox" className="mt-1" />
              <p>
                Please exclude me from any future emails regarding Assetra and related product 
                updates, marketing practices, and promotions.
              </p>
            </div>

            {/* TERMS */}
            <p className="text-xs text-gray-500">
              By registering for an account, you are consenting to our{" "}
              <span className="text-blue-600 cursor-pointer">
                Terms of Service
              </span>{" "}
              and confirming that you have reviewed and accepted the{" "}
              <span className="text-blue-600 cursor-pointer">
                Global Privacy Statement
              </span>.
            </p>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full h-[48px] bg-black text-white rounded-md font-medium hover:bg-gray-900 transition"
            >
              Get started free
            </button>

            {/* LOGIN */}
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600">
                Login
              </a>
            </p>

          </form>
        </div>
      </div>
    </>
  );
}