"use client"
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Button from "./Button";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full px-4 md:px-6 lg:px-10 py-3 sticky top-0 backdrop-blur-md z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div>
          <img src="logo.png" alt="assetra logo" className="h-[15.81px]" />
        </div>

        {/* Desktop Links (ONLY lg and above) */}
        <div className="hidden lg:flex gap-8 text-sm font-medium">
          <a href="auth/register">Home</a>
          <a href="#">Features</a>
          <a href="#">How It Works</a>
          <a href="#">Pricing</a>
        </div>

        {/* Desktop Buttons (ONLY lg and above) */}
        <div className="hidden lg:flex gap-3">
          <Button text="Login" variant="black" href={"/login"} />
          <Button text="Start Free Trial" variant="white" href={"/register"} />
        </div>

        {/* Hamburger (shown on mobile + tablet) */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-100 mt-4" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-5 bg-white p-5 rounded-xl shadow-lg">
          <a href="#" className="text-base">Home</a>
          <a href="#" className="text-base">Features</a>
          <a href="#" className="text-base">How It Works</a>
          <a href="#" className="text-base">Pricing</a>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button text="Login" variant="black" className="w-full" href={"/login"} />
            <Button text="Start Free Trial" variant="white" className="w-full" href={"/register"} />
          </div>
        </div>
      </div>
    </nav>
  );
}