import DamulTabItem from "./DamulTabItem";

import { useState } from "react";
import { useLocation } from "react-router-dom";

interface DamulTabProps {
  // URL 절대 경로
  absPath: string;

  // 탭의 이름
  name: string;
}

const DamulTab = ({ tabList }: { tabList: DamulTabProps[] }) => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(() => {
    // 탭 전환이 아닌, URL을 통해 페이지가 변경되는 경우, 탭 구분자의 위치가 올바르지 않기 때문에 마운트 시 URL을 확인해서 activeIndex 초기화
    const path = location.pathname;
    const index = tabList.findIndex((item) => item.absPath === path);
    return index !== -1 ? index : 0;
  });

  return (
    <div className="relative h-12 bg-white border-b border-b-normal-200">
      <div className="flex items-center h-full">
        {tabList.map((item, index) => {
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
          width: `${100 / tabList.length}%`, // 탭의 너비 비율
          transform: `translateX(${100 * activeIndex}%)`, // 선택된 탭으로 이동
        }}
      ></div>
    </div>
  );
};

export default DamulTab;
