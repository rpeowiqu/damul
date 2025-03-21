import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import doorImage from "@/assets/door.png";

const RefrigeratorDoor = ({ storage }: { storage: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const doorOpened = sessionStorage.getItem(`doorOpened_${storage}`);
    if (doorOpened === "true") {
      setIsHidden(true);
    }
  }, [storage]);

  const handleDoorClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      sessionStorage.setItem(`doorOpened_${storage}`, "true");
    }
  };

  return (
    <motion.div
      onClick={handleDoorClick}
      className={`rounded-xl absolute cursor-pointer w-full h-full z-30 shadow-lg active:translate-y-1 active:shadow-sm transition border-2 border-normal-100 ${
        isHidden ? "hidden" : "block"
      }`}
      animate={{
        rotateY: isOpen ? 180 : 0,
      }}
      initial={{ rotateY: 0 }}
      transition={{
        duration: 1.5,
        ease: "linear",
      }}
      onUpdate={(latest) => {
        const rotateY = typeof latest.rotateY === "number" ? latest.rotateY : 0;
        if (rotateY > 140 && !isHidden) {
          setIsHidden(true);
        } else if (rotateY <= 140 && isHidden) {
          setIsHidden(false);
        }
      }}
      style={{
        transformOrigin: "right center",
        transformStyle: "preserve-3d",
      }}
    >
      <div className="relative w-full h-full overflow-hidden rounded-xl">
        <div
          className={`absolute -top-32 right-[80%] w-96 h-96 bg-gradient-to-r from-transparent ${storage === "freezer" ? "via-sky-100/50" : "via-gray-200/60"}  to-transparent animate-shine z-30`}
        ></div>
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
