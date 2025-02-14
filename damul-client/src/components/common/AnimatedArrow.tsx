import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedArrowProps {
  className?: string;
  direction: "up" | "down";
  children: ReactNode;
}

const containerVariants = {
  up: {
    visible: {
      transition: {
        staggerChildren: 0.2,
        staggerDirection: 1,
      },
    },
  },
  down: {
    visible: {
      transition: {
        staggerChildren: 0.2,
        staggerDirection: -1,
      },
    },
  },
};

const arrowVariants = {
  up: {
    hidden: { color: "#fd6c6c" },
    visible: {
      opacity: [0, 1, 0],
      y: [10, 5, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 0.3,
      },
    },
  },
  down: {
    hidden: { color: "#60a5fa" },
    visible: {
      opacity: [0, 1, 0],
      y: [0, 5, 10],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 0.3,
      },
    },
  },
};

const AnimatedArrow = ({
  className,
  direction,
  children,
}: AnimatedArrowProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className={`flex flex-col justify-end ${className}`}
      variants={containerVariants[direction]}
    >
      {Array.from({ length: 2 }).map((_, index) => (
        <motion.div
          key={index}
          variants={arrowVariants[direction]}
          className="-m-2"
        >
          {children}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnimatedArrow;
