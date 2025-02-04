import DamulTabItem from "./DamulTabItem";

import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

interface DamulTabProps {
  // URL 경로
  path: string;

  // 동적 경로일 경우, 경로 변수
  pathVariables?: string[];

  // 탭의 이름
  name: string;
}

const DamulTab = ({ tabList }: { tabList: DamulTabProps[] }) => {
  const params = useParams();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    // 탭 전환이 아닌, URL을 통해 페이지가 변경되는 경우, 탭 구분자의 위치가 올바르지 않기 때문에 마운트 시 URL을 확인해서 activeIndex 초기화
    const index = tabList.findIndex(({ path, pathVariables }) => {
      if (pathVariables && pathVariables.length > 0) {
        let resolvedPath = path;
        pathVariables.forEach((param) => {
          if (params[param]) {
            resolvedPath = resolvedPath.replace(`:${param}`, params[param]);
          }
        });

        return resolvedPath === location.pathname;
      }

      return path === location.pathname;
    });

    setActiveIndex(index !== -1 ? index : 0);
  }, [location.pathname]);

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
          width: `${100 / tabList.length}%`,
          transform: `translateX(${100 * activeIndex}%)`,
        }}
      ></div>
    </div>
  );
};

export default DamulTab;
