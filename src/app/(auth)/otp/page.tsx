"use client";

import { JSX, useRef, useState } from "react";

export default function OTP(): JSX.Element {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Handle input change
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <>
      <div className="
        flex flex-col lg:flex-row
        gap-8 lg:gap-20
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
            alt="Verification visual"
            className="rounded-2xl object-cover w-full h-full"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center t">
          
          {/* LOGO */}
            <div className="flex flex-row items-center justify-center">
                <img src="logo.png" alt="Logo" className="h-[12.72px] mb-6" />
            </div>

          <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
            Enter verification code from Email
          </h1>

          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            Please enter the code we sent to this email <br />
            <span className="text-black font-medium">
              exampleemail@gmail.com
            </span>
          </p>

          {/* OTP INPUTS */}
          <div className="flex flex-row justify-between mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="
                  w-[61.72px] h-[68.75px] sm:w-12 sm:h-14
                  text-center text-lg
                  border border-gray-300 rounded-md
                  focus:ring-2 focus:ring-blue-500 outline-none
                flex flex-row justify-between
                "
              />
            ))}
          </div>

          {/* VERIFY BUTTON */}
          <button className="w-full h-[48px] bg-black text-white rounded-md font-medium hover:bg-gray-900 transition">
            Verify Email
          </button>

          {/* RESEND */}
          <div className="flex flex-col items-center align-center">
            <p className="text-xs text-gray-500 mt-3">
                Didn’t receive code?{" "}
                <span className="text-blue-600 cursor-pointer">
                Resend code
                </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}