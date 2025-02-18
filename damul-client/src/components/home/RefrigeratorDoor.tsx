import { useState } from "react";
import { motion } from "framer-motion";

import doorImage from "@/assets/door.png";

const RefrigeratorDoor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const handleAnimationComplete = () => {
    if (isOpen) {
      setTimeout(() => setIsClosed(true), 100);
    } else {
      setIsClosed(false);
    }
  };

  return (
    <motion.div
      onClick={() => setIsOpen(!isOpen)}
      className="rounded-xl absolute cursor-pointer w-full h-full z-30 shadow-lg transform active:translate-y-1 active:shadow-sm transition border-2 border-normal-100"
      animate={{
        rotateY: isOpen ? 160 : 0,
        translateX: isOpen ? 40 : 0,
        translateZ: isOpen ? 100 : 0,
        opacity: isOpen ? 1 : isClosed ? 0 : 1,
      }}
      initial={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: 0, opacity: 0 }}
      transition={{
        duration: 1,
        ease: "easeInOut",
        rotateY: { duration: 1.2, ease: "easeInOut" },
        translateX: { duration: 1, ease: "easeInOut" },
        translateZ: { duration: 1, ease: "easeInOut" },
        opacity: { duration: 1, ease: "easeInOut" },
      }}
      onAnimationComplete={handleAnimationComplete}
      style={{
        transformOrigin: "right center",
        transformStyle: "preserve-3d",
        display: isClosed ? "none" : "block",
      }}
    >
      <div className="relative w-full h-full overflow-hidden rounded-xl">
        <div className="rounded-xl shine-effect absolute top-0 left-[-120%] w-full h-full bg-gradient-to-r from-transparent via-gray-200/40 to-transparent opacity-40 animate-shine z-30"></div>

        <img
          src={doorImage}
          className="w-full h-full rounded-xl z-30"
          style={{
            backfaceVisibility: "hidden",
            boxShadow:
              "0 0 60px rgba(255, 255, 255, 0.8), 0 0 120px rgba(0, 0, 0, 0.5)",
          }}
        />
      </div>
    </motion.div>
  );
};

export default RefrigeratorDoor;
