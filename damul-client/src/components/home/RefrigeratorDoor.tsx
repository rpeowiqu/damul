import { useState } from "react";
import { motion } from "framer-motion";

import doorImage from "@/assets/door.png";

const RefrigeratorDoor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  return (
    <motion.div
      onClick={() => setIsOpen(!isOpen)}
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
