import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import introMain_1 from "@/assets/intro_main_1.png";
import introMain_2 from "@/assets/intro_main_2.png";
import introCommunity_1 from "@/assets/intro_community_1.png";
import introCommunity_2 from "@/assets/intro_community_2.png";
import introProfile_1 from "@/assets/intro_profile_1.png";
import introProfile_2 from "@/assets/intro_profile_2.png";
import introStatistics_1 from "@/assets/intro_statistics_1.png";
import introStatistics_2 from "@/assets/intro_statistics_2.png";
import DamulButton from "../common/DamulButton";
import IntroItem from "./IntroItem";
import QRScanIcon from "../svg/QRScanIcon";
import ReceiptScanIcon from "../svg/ReceiptScanIcon";

const IntroContent = () => {
  const [stepIndex, setStepIndex] = useState<number>(0);

  const renderElement = () => {
    switch (stepIndex) {
      case 0:
        return (
          <IntroItem
            title={"효율적인 식자재 관리하기"}
            subTitle={"식자재 관리 어떻게해? 다믈랭에 다믈랭"}
            key={stepIndex}
            imageSrc={introMain_1}
          >
            <motion.div
              animate={{
                scale: [0, 1.2, 1],
                transition: {
                  duration: 1,
                  delay: 0.6,
                  ease: "easeInOut",
                },
              }}
              className="flex flex-col justify-center items-center absolute left-5 w-24 h-24 object-cover bg-red-300 rounded-full"
            >
              <ReceiptScanIcon className="size-12 fill-white stroke-white" />
              <p className="text-white text-xs font-black">영수증 스캔</p>
            </motion.div>

            <motion.div
              animate={{
                scale: [0, 1.2, 1],
                transition: {
                  duration: 1,
                  delay: 1.0,
                  ease: "easeInOut",
                },
              }}
              className="flex flex-col justify-center items-center absolute top-24 right-5 w-20 h-20 object-cover bg-blue-200 rounded-full"
            >
              <QRScanIcon className="size-10 fill-white stroke-white" />
              <p className="text-white text-xs font-black">QR스캔</p>
            </motion.div>
          </IntroItem>
        );
      case 1:
        return (
          <IntroItem
            title={"안녕하세요2"}
            subTitle={"가나다라마바사아자차카타파하"}
            key={stepIndex}
            imageSrc={introMain_2}
          />
        );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-12 flex-1 p-10">
      {renderElement()}

      <div className="flex gap-5">
        {Array.from({ length: 4 }).map((item, index) => (
          <button
            key={index}
            className={`w-4 h-4 bg-normal-50 rounded-full ${index === stepIndex && "bg-positive-300"}`}
            onClick={() => setStepIndex(index)}
          />
        ))}
      </div>

      <DamulButton variant="positive" className="w-full">
        시작하기
      </DamulButton>
    </div>
  );
};

export default IntroContent;
