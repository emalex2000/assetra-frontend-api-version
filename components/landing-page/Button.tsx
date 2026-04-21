import React from "react";
import Link from "next/link";
import { IconType } from "react-icons";

type ButtonVariant = "black" | "white" | "blue";
type IconPosition = "left" | "right";

interface ButtonProps {
  text: string;
  variant: ButtonVariant;
  icon?: IconType;
  iconPosition?: IconPosition;
  onClick?: () => void;
  className?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  text,
  variant,
  icon: Icon,
  iconPosition = "right",
  onClick,
  className = "",
  href,
  type = "button",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl transition cursor-pointer text-sm font-medium";

  const variants: Record<ButtonVariant, string> = {
    black: "bg-black text-white hover:bg-gray-800",
    white:
      "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
    blue: "bg-blue-600 text-white hover:bg-blue-700",
  };

  const content = (
    <>
      {Icon && iconPosition === "left" && <Icon size={14} />}
      <span>{text}</span>
      {Icon && iconPosition === "right" && <Icon size={14} />}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseStyles} ${variants[variant]} ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {content}
    </button>
  );
};

export default Button;