import { motion } from "framer-motion";
import { ReactNode } from "react";

interface IntroItemProps {
  title: string;
  subTitle: string;
  imageSrc: string;
  children?: ReactNode;
}

const IntroItem = ({ title, subTitle, imageSrc, children }: IntroItemProps) => {
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
          duration: 0.8,
        },
      }}
      className="relative w-full flex flex-col items-center"
    >
      <img
        src={imageSrc}
        className="absolute left-0 top-0 w-full h-96 object-cover opacity-5"
      />
      <motion.img
        src={imageSrc}
        className="w-56 object-cover mask-gradient -mb-16"
      />
      <motion.div
        animate={{
          y: [0, -5, 0],
          transition: {
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        }}
        className="flex flex-col items-center gap-2"
      >
        <h1 className="text-2xl font-black">{title}</h1>
        <p className="text-positive-300">{subTitle}</p>
      </motion.div>

      {children}
    </motion.div>
  );
};

export default IntroItem;
