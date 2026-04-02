"use client";

import { JSX, useState } from "react";


export default function Login(): JSX.Element {

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
            Forgot Password
          </h1>

          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            Enter your registered email address to recover Password
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
            

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full h-[48px] bg-black text-white rounded-md cursor-pointer font-medium hover:bg-gray-900 transition"
            >
              Retrieve password
            </button>

            {/* LOGIN */}
            <p className="text-sm text-center text-gray-600">
              Back to login?{" "}
              <a href="/login" className="text-blue-600">
                signup
              </a>
            </p>

          </form>
        </div>
      </div>
    </>
  );
}