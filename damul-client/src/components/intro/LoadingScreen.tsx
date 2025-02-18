import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion } from "framer-motion";
import loadingGif from "@/assets/loadingGif.gif";
import { Progress } from "../ui/progress";

interface LoadingScreenProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const LoadingScreen = ({ setIsLoading }: LoadingScreenProps) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const start = performance.now();
    const updateProgress = (timestamp: number) => {
      const elapsed = timestamp - start;
      const newProgress = Math.min(101, (elapsed / 2000) * 100);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
        setProgress(newProgress);
      } else {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    requestAnimationFrame(updateProgress);
  }, []);

  const getLoadingText = () => {
    if (progress <= 40) {
      return "열심히 데이터를 가져오고 있어요!";
    } else if (progress <= 80) {
      return "오늘은 어떤 음식을 하실건가요?";
    } else if (progress <= 99) {
      return "거의 다 왔어요!!";
    }
    return "도착!";
  };

  return (
    <div className="flex flex-col flex-1 gap-12 justify-center items-center bg-white">
      <motion.div
        className="box"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <img
          className="size-36 sm:size-48 rounded-full object-cover shadow-lg"
          src={loadingGif}
          alt=""
        />
      </motion.div>
      <div className="flex flex-col gap-2 w-3/5">
        <Progress
          value={progress}
          className="[&>div]:bg-positive-300 bg-normal-50"
        />
        <p className="text-sm text-positive-300 font-bold text-center">
          {getLoadingText()}
          <br />
          {progress.toFixed(0)}%
        </p>
      </div>

      <div className="fixed left-0 right-0 bottom-10 flex flex-col gap-3 items-center w-full max-w-[600px] mx-auto">
        <img className="w-12" src="/logo.svg" alt="" />
        <p className="text-xs text-normal-100">2025 ⓒ DAMUL-50DAYS</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
