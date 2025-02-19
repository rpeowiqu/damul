import { motion } from "framer-motion";
import { ReactNode } from "react";

interface IntroItemProps {
  title: string;
  content: string;
  screenImage: string;
  firstEffectClassName?: string;
  firstEffectContent?: ReactNode;
  secondEffectClassName?: string;
  secondEffectContent?: ReactNode;
  thirdEffectClassName?: string;
  thirdEffectContent?: ReactNode;
}

const IntroItem = ({
  title,
  content,
  screenImage,
  firstEffectClassName,
  firstEffectContent,
  secondEffectClassName,
  secondEffectContent,
  thirdEffectClassName,
  thirdEffectContent,
}: IntroItemProps) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 1.0,
        },
      }}
      className="relative w-full min-h-[405px] sm:min-h-[500px] flex flex-col justify-center items-center"
    >
      <motion.img
        src={screenImage}
        className="w-48 sm:w-56 object-cover mask-gradient -mb-16"
      />
      <motion.div
        animate={{
          y: [0, -5, 0],
          transition: {
            duration: 1.0,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        }}
        className="flex flex-col items-center gap-2"
      >
        <h1 className="text-xl sm:text-2xl font-black text-positive-300 select-none">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-normal-400 select-none">
          {content}
        </p>
      </motion.div>

      <motion.div
        animate={{
          scale: [0, 1.2, 1],
          transition: {
            duration: 1.0,
            delay: 0.6,
            ease: "easeInOut",
            type: "spring",
            stiffness: 400,
            damping: 10,
          },
        }}
        className={`flex flex-col justify-center items-center absolute object-cover rounded-full opacity-75 ${firstEffectClassName}`}
      >
        {firstEffectContent}
      </motion.div>

      <motion.div
        animate={{
          scale: [0, 1.2, 1],
          transition: {
            duration: 1.0,
            delay: 1.0,
            ease: "easeInOut",
            type: "spring",
            stiffness: 400,
            damping: 10,
          },
        }}
        className={`flex flex-col justify-center items-center absolute object-cover rounded-full opacity-75  ${secondEffectClassName}`}
      >
        {secondEffectContent}
      </motion.div>

      <motion.div
        animate={{
          scale: [0, 1.2, 1],
          transition: {
            duration: 1.0,
            delay: 1.4,
            ease: "easeInOut",
            type: "spring",
            stiffness: 400,
            damping: 10,
          },
        }}
        className={`flex flex-col justify-center items-center absolute object-cover rounded-full opacity-75 ${thirdEffectClassName}`}
      >
        {thirdEffectContent}
      </motion.div>
    </motion.div>
  );
};

export default IntroItem;
