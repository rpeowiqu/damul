import { useState } from "react";
import fallbackSrc from "@/assets/noImage.jpeg";

interface ImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

const Image = ({ src, alt = "이미지", className = "" }: ImageProps) => {
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc);

  const handleError = () => {
    setImageSrc(fallbackSrc);
  };

  return (
    <img src={imageSrc} alt={alt} className={className} onError={handleError} />
  );
};

export default Image;
