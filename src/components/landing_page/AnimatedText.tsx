"use client";

import React, { useEffect, useState } from "react";

interface AnimatedTextProps {
  words?: string[];
  animate?: boolean;
  interval?: number;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  words = [],
  animate = false,
  interval = 2500,
  className = "",
}) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!animate || words.length <= 1) return;

    const timer = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setVisible(true);
      }, 250);
    }, interval);

    return () => clearInterval(timer);
  }, [animate, interval, words.length]);

  const displayText = words.length > 0 ? words[index] : "";

  return (
    <span className={`inline-block align-middle ${className}`}>
      <span
        className={`
          inline-block transition-all duration-500
          ${
            visible
              ? "opacity-100 blur-0 translate-y-0"
              : "opacity-0 blur-sm -translate-y-1"
          }
        `}
      >
        {displayText}
      </span>
    </span>
  );
};

export default AnimatedText;