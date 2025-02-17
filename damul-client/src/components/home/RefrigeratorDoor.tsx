import { useState } from "react";
import { motion } from "framer-motion";
import doorImage from "@/assets/door.png";

const RefrigeratorDoor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const handleAnimationComplete = () => {
    if (isOpen) {
      setIsClosed(true);
    } else {
      setIsClosed(false);
    }
  };

  return (
    <motion.div
      onClick={() => setIsOpen(!isOpen)}
      className={`absolute cursor-pointer w-full h-full z-50`}
      animate={{
        rotateY: isOpen ? 120 : 0,
        translateX: isOpen ? 10 : 0,
        translateZ: isOpen ? 5 : 0,
        opacity: isOpen ? 0 : 1,
      }}
      initial={{ rotateY: 0 }}
      transition={{ duration: 1 }}
      onAnimationComplete={handleAnimationComplete}
      style={{
        transformOrigin: "right center",
        transformStyle: "preserve-3d",
        display: isClosed ? "none" : "block",
      }}
    >
      <img
        src={doorImage}
        className="w-full h-full rounded-xl absolute"
        style={{ backfaceVisibility: "hidden" }}
      />
    </motion.div>
  );
};

export default RefrigeratorDoor;
