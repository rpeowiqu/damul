import { motion } from "framer-motion";
import { MeatIcon, VegetableIcon, DairyIcon } from "../svg";

const OcrLoading = () => {
  const icons = [MeatIcon, VegetableIcon, DairyIcon];

  return (
    <div className="flex justify-center items-center h-screen space-x-7">
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className="w-10 h-10 flex justify-center items-center"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2, // 순차적인 애니메이션 효과
          }}
        >
          <Icon className="w-full h-full" />
        </motion.div>
      ))}
    </div>
  );
};

export default OcrLoading;
