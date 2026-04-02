import React from "react";
import AnimatedText from "./AnimatedText";
import AvatarStack from "./Avatarstacks";


interface HeroHeadingProps {
  mainText: string;
  highlightText: string;
  words?: string[];
  animateWords?: boolean;
  avatars?: string[];
  className?: string;
}

const HeroHeading: React.FC<HeroHeadingProps> = ({
  mainText,
  highlightText,
  words = [],
  animateWords = false,
  avatars = [],
  className = "",
}) => {
  return (
    <h1
      className={`text-[30px] md:text-[40px] font-bold leading-tight ${className}`}
    >
      {/* Main Text */}
      {mainText}{" "}

      {/* Blue Highlight */}
      <span className="text-blue-700">{highlightText}</span>{" "}

      {/* Animated Text + Avatars */}
      <span className="inline-flex items-center gap-2">
        <AnimatedText words={words} animate={animateWords} />

        {avatars.length > 0 && (
          <AvatarStack images={avatars} />
        )}
      </span>
    </h1>
  );
};

export default HeroHeading;