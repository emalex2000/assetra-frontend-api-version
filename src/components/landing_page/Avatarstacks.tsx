import React from "react";

interface AvatarStackProps {
  images: string[];
  className?: string;
}

const AvatarStack: React.FC<AvatarStackProps> = ({
  images,
  className = "",
}) => {
  return (
    <div className={`flex -space-x-3 ${className}`}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt="user"
          className="w-7 h-7 rounded-full border-2 border-white object-cover"
          style={{ zIndex: images.length - i }}
        />
      ))}
    </div>
  );
};

export default AvatarStack;