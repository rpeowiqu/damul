import { motion } from "framer-motion";
import { MeatIcon, VegetableIcon, DairyIcon } from "../svg";

const Loading = ({
  message,
  purpose,
}: {
  message?: string;
  purpose?: string;
}) => {
  const icons = [MeatIcon, VegetableIcon, DairyIcon];

  return (
    <div
      className={`mx-auto fixed w-full pc:w-[600px] inset-0 ${purpose === "OCR" ? "bg-black/50" : "bg-white"}  flex flex-col justify-center items-center z-[9999999999]`}
    >
      <p className="text-lg text-white">{message}</p>
      <div className="flex justify-center items-center h-16 space-x-7">
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
    </div>
  );
};

export default Loading;
