"use client";

import { JSX, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Signup(): JSX.Element {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          phone_number: `+${phone}`,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          data?.error ||
          data?.message ||
          "Something went wrong during signup.";
        throw new Error(
          Array.isArray(message) ? message.join(", ") : message
        );
      }

      localStorage.setItem("otp_email", email);

      router.push("/otp");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        flex flex-col lg:flex-row
        gap-8 lg:gap-10
        px-4 sm:px-6 md:px-10 lg:px-16
        py-8 lg:py-12
        bg-gray-50 min-h-screen
      "
    >
      <div
        className="
          w-full lg:w-1/2
          h-[220px] sm:h-[280px] md:h-[350px] lg:h-auto
        "
      >
        <img
          src="/login-image.png"
          alt="Login visual"
          className="rounded-2xl object-cover w-full h-full"
        />
      </div>

      <div
        className="
          w-full lg:w-1/2
          flex flex-col justify-center
        "
      >
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
          Sign up with free trial
        </h1>

        <p className="text-gray-500 mb-6 text-sm sm:text-base">
          Empower your experience, sign up for a free account today
        </p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium">Work email*</label>
            <input
              type="email"
              placeholder="ex. email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full h-[48px] px-3 bg-white rounded-md border-none focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Phone number*{" "}
              <span className="text-xs text-gray-400 cursor-pointer">Why?</span>
            </label>

            <PhoneInput
              country="us"
              value={phone}
              onChange={(value: string) => setPhone(value)}
              inputClass="!w-full !h-[48px] !pl-[60px] !rounded-md !bg-white !border-none"
              buttonClass="!rounded-l-md !bg-white !border-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password*</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full h-[48px] px-3 pr-10 rounded-md border-none focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div
              className="
                text-xs text-gray-500 mt-2
                grid grid-cols-1 sm:grid-cols-2 gap-1
              "
            >
              <p>• One lowercase character</p>
              <p>• One uppercase character</p>
              <p>• One number</p>
              <p>• One special character</p>
              <p>• 8 characters minimum</p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-600">
            <input type="checkbox" className="mt-1" />
            <p>
              Please exclude me from any future emails regarding Assetra and
              related product updates, marketing practices, and promotions.
            </p>
          </div>

          <p className="text-xs text-gray-500">
            By registering for an account, you are consenting to our{" "}
            <span className="text-blue-600 cursor-pointer">Terms of Service</span>{" "}
            and confirming that you have reviewed and accepted the{" "}
            <span className="text-blue-600 cursor-pointer">
              Global Privacy Statement
            </span>.
          </p>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[48px] bg-black text-white rounded-md font-medium hover:bg-gray-900 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Get started free"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}