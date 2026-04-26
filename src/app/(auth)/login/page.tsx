"use client";

import { FormEvent, JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { authStore } from "../../../lib/authStore";
import { tokenStorage } from "../../../lib/tokenStorage";

type LoginResponse = {
  access: string;
  refresh: string;
  user?: {
    id?: string;
    email?: string;
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Login(): JSX.Element {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [keepLoggedIn, setKeepLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          (data as any)?.detail ||
            (data as any)?.error ||
            (data as any)?.non_field_errors?.[0] ||
            "Login failed"
        );
      }

      if (!data.access || !data.refresh) {
        throw new Error("Access or refresh token was not returned by the backend.");
      }
      authStore.setAccessToken(data.access);
      tokenStorage.setRefreshToken(data.refresh);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("access_token", data.access);

        if (keepLoggedIn) {
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("remember_me", "true");
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("remember_me");
        }
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem("user_email", data.user?.email || email.trim());
        sessionStorage.setItem("user_id", data.user?.id || "");

        if (keepLoggedIn) {
          localStorage.setItem("remember_me", "true");
        } else {
          localStorage.removeItem("remember_me");
        }
      }

      router.replace("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        flex min-h-screen flex-col gap-8 bg-gray-50
        px-4 py-8
        sm:px-6
        md:px-10
        lg:flex-row lg:gap-10 lg:px-16 lg:py-12
      "
    >
      <div
        className="
          h-[220px] w-full
          sm:h-[280px]
          md:h-[350px]
          lg:h-auto lg:w-1/2
        "
      >
        <img
          src="/login-image.png"
          alt="Login visual"
          className="h-full w-full rounded-2xl object-cover"
        />
      </div>

      <div
        className="
          flex w-full flex-col justify-center
          lg:w-1/2
        "
      >
        <h1 className="mb-2 text-2xl font-semibold sm:text-3xl">
          Welcome User
        </h1>

        <p className="mb-6 text-sm text-gray-500 sm:text-base">
          Login to your account to continue
        </p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium">Work email*</label>
            <input
              type="email"
              placeholder="ex. email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 h-12 w-full rounded-md bg-white px-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
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
                className="mt-1 h-[48px] w-full rounded-md bg-white px-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
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
          </div>

          <div className="flex flex-row justify-between pb-2">
            <div className="flex flex-row gap-2">
              <input
                type="checkbox"
                id="keepLoggedIn"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="cursor-pointer"
              />
              <label htmlFor="keepLoggedIn">Keep me logged in</label>
            </div>

            <a href="/forgot-password">Forgot password</a>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-[48px] w-full cursor-pointer rounded-md bg-black font-medium text-white transition hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-600">
              Signup
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}