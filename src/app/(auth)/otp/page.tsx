"use client";

import { JSX, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function OTP(): JSX.Element {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // separate timers
  const [otpTimeLeft, setOtpTimeLeft] = useState<number>(300); // 5 mins
  const [resendTimeLeft, setResendTimeLeft] = useState<number>(60); // 60 secs

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("otp_email");

    if (!savedEmail) {
      router.push("/signup");
      return;
    }

    setEmail(savedEmail);
  }, [router]);

  // OTP expiry countdown
  useEffect(() => {
    if (otpTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setOtpTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [otpTimeLeft]);

  // Resend countdown
  useEffect(() => {
    if (resendTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setResendTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    setError("");

    if (!email) {
      setError("Email not found. Please sign up again.");
      return;
    }

    if (otpTimeLeft <= 0) {
      setError("OTP has expired. Please resend a new code.");
      return;
    }

    if (code.length !== 6) {
      setError("Please enter the complete OTP.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/api/accounts/verify-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: code,
          email,
        }),
      });

      const rawText = await res.text();

      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error("Backend returned HTML instead of JSON.");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Verification failed");
      }

      localStorage.removeItem("otp_email");
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");

    if (!email) {
      setError("Email not found. Please sign up again.");
      return;
    }

    if (resendTimeLeft > 0) return;

    try {
      setResending(true);

      const res = await fetch("http://localhost:8000/api/accounts/resend-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const rawText = await res.text();

      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error("Backend returned HTML instead of JSON.");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to resend OTP");
      }

      // reset fields and timers
      setOtp(["", "", "", "", "", ""]);
      setOtpTimeLeft(300);     // new OTP expires in 5 mins
      setResendTimeLeft(60);   // resend button locked for 60 secs
      inputsRef.current[0]?.focus();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to resend OTP");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 px-4 sm:px-6 md:px-10 lg:px-16 py-8 lg:py-12 bg-gray-50 min-h-screen">
      <div className="w-full lg:w-1/2 h-[220px] sm:h-[280px] md:h-[350px] lg:h-auto">
        <img
          src="/login-image.png"
          alt="Verification visual"
          className="rounded-2xl object-cover w-full h-full"
        />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        <div className="flex justify-center">
          <img src="/logo.png" alt="Logo" className="h-[20px] mb-6" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
          Enter verification code from Email
        </h1>

        <p className="text-gray-500 mb-6 text-sm sm:text-base">
          Please enter the code we sent to this email <br />
          <span className="text-black font-medium">{email || "Loading..."}</span>
        </p>

        <div className="flex justify-between gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-[50px] h-[60px] text-center text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            />
          ))}
        </div>

        <div className="mb-4 space-y-1">
          <p className="text-sm text-gray-500">
            OTP expires in:{" "}
            <span className="font-medium text-black">
              {formatTime(otpTimeLeft)}
            </span>
          </p>

          <p className="text-sm text-gray-500">
            Resend available in:{" "}
            <span className="font-medium text-black">
              {resendTimeLeft > 0 ? formatTime(resendTimeLeft) : "Now"}
            </span>
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={loading || otpTimeLeft <= 0}
          className="w-full h-[48px] bg-black text-white rounded-md font-medium hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <div className="flex flex-col items-center mt-4">
          <p className="text-xs text-gray-500">
            Didn’t receive code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimeLeft > 0 || resending}
              className={`font-medium ${
                resendTimeLeft > 0 || resending
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600"
              }`}
            >
              {resending
                ? "Sending..."
                : resendTimeLeft > 0
                ? `Resend in ${resendTimeLeft}s`
                : "Resend code"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}