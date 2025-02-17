import { useEffect, useState } from "react";
import noImage from "@/assets/noImage.jpeg";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

const Image = ({ src, alt, className }: ImageProps) => {
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <img
      src={imageSrc || noImage}
      alt={alt}
      className={className}
      onError={() => setImageSrc(noImage)}
    />
  );
};

export default Image;
