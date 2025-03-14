import { useState } from "react";
import ingredientImage from "@/assets/ingredients.jpg";
import DamulButton from "../common/DamulButton";
import MainIntroItem from "./MainIntroItem";
import CommunityIntroItem from "./CommunityIntroItem";
import ProfileIntroItem from "./ProfileIntroItem";
import StatisticsIntroItem from "./StatisticsIntroItem";
import { useNavigate } from "react-router-dom";

const IntroContent = () => {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const nav = useNavigate();

  const renderItem = () => {
    switch (stepIndex) {
      case 0:
        return <MainIntroItem />;
      case 1:
        return <CommunityIntroItem />;
      case 2:
        return <ProfileIntroItem />;
      case 3:
        return <StatisticsIntroItem />;
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center flex-1 bg-white">
      <img
        src={ingredientImage}
        className="absolute left-0 top-0 w-full object-cover mask-gradient opacity-20"
      />

      <div className="flex flex-col gap-12 w-full h-full">
        {renderItem()}

        <div className="flex justify-center items-center gap-5">
          <button
            className={
              "w-8 h-8 text-lg sm:text-xl font-black text-positive-300 mr-2 z-50"
            }
            onClick={() => setStepIndex((stepIndex - 1 + 4) % 4)}
          >
            &lt;
          </button>

          {Array.from({ length: 4 }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 sm:w-4 sm:h-4 z-50 rounded-full ${index === stepIndex ? "bg-positive-300" : "bg-normal-100"}`}
              onClick={() => setStepIndex(index)}
            />
          ))}

          <button
            className={
              "w-8 h-8 text-lg sm:text-xl font-black text-positive-300 ml-2 z-50"
            }
            onClick={() => setStepIndex((stepIndex + 1) % 4)}
          >
            &gt;
          </button>
        </div>

        <div className="px-4 sm:px-10 z-50">
          <DamulButton
            variant="positive"
            className="w-full"
            onClick={() => nav("/login")}
          >
            지금 바로 시작하기!
          </DamulButton>
        </div>
      </div>
    </div>
  );
};

export default IntroContent;
