import React from "react";
import Link from "next/link";
import { IconType } from "react-icons";

type ButtonVariant = "black" | "white";
type IconPosition = "left" | "right";

interface ButtonProps {
  text: string;
  variant: ButtonVariant;
  icon?: IconType;
  iconPosition?: IconPosition;
  onClick?: () => void;
  className?: string;
  href: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  variant,
  icon: Icon,
  iconPosition = "right",
  onClick,
  className = "",
  href,
}) => {
  const baseStyles =
    "flex items-center justify-center gap-2 h-9 py-2 px-4 rounded-md transition cursor-pointer";

  const variants: Record<ButtonVariant, string> = {
    black: "bg-black text-white hover:bg-gray-700",
    white:
      "border border-black text-black hover:bg-blue-600 hover:border-none hover:text-white",
  };

  const content = (
    <>
      {Icon && iconPosition === "left" && <Icon size={14} />}
      {text}
      {Icon && iconPosition === "right" && <Icon size={14} />}
    </>
  );

  // ✅ IF LINK → render Link
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

  // ✅ OTHERWISE → normal button
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {content}
    </button>
  );
};

export default Button;