"use client";

import Image from "next/image";
import { useState } from "react";

interface StartupImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  fallbackText?: string;
}

const StartupImage = ({ src, alt, width, height, className, fallbackText = "No Image Available" }: StartupImageProps) => {
  const [imageError, setImageError] = useState(false);

  // Use nature.jpg as fallback image
  const imageSrc = (!src || imageError) ? "/nature.jpg" : src;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImageError(true)}
    />
  );
};

export default StartupImage;
