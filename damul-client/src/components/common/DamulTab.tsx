import DamulTabItem from "./DamulTabItem";

import { useState } from "react";

interface DamulTabProps {
  // URL 절대 경로
  absPath: string;

  // 탭의 이름
  name: string;
}

const DamulTab = ({ propItems }: { propItems: DamulTabProps[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative h-12 bg-white border-b border-b-normal-200">
      <div className="flex items-center h-full">
        {propItems.map((item, index) => {
          return (
            <DamulTabItem
              key={index}
              {...item}
              onClick={() => setActiveIndex(index)}
            />
          );
        })}
      </div>

      <div
        className="absolute bottom-0 h-1 rounded-t-full bg-positive-300 transition-transform duration-300 ease-in-out"
        style={{
          width: `${100 / propItems.length}%`, // 탭의 너비 비율
          transform: `translateX(${100 * activeIndex}%)`, // 선택된 탭으로 이동
        }}
      ></div>
    </div>
  );
};

export default DamulTab;
