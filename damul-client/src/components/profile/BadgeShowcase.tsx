import { useState, useEffect } from "react";

import Badge from "./Badge";
import DamulModal from "../common/DamulModal";

interface BadgeShowcaseProps {
  level: number;
  title: string;
  condition: string;
  description: string;
}

const BadgeShowcase = ({ badgeList }: { badgeList: BadgeShowcaseProps[] }) => {
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (currentBadgeIndex > -1) {
      setIsOpen(true);
    }
  }, [currentBadgeIndex]);

  return (
    <div className="flex flex-col gap-3 p-3 border border-normal-100 rounded-md">
      <p className="text-end text-sm">
        보유 뱃지 수 : {badgeList.length || 0}개
      </p>
      <div className="flex flex-col">
        <div className="grid grid-cols-5 pc:grid-cols-6 place-items-center gap-4">
          {badgeList.map((badge, index) => (
            <Badge
              key={index}
              {...badge}
              onClick={() => {
                setCurrentBadgeIndex(index);
              }}
            />
          ))}
        </div>
      </div>

      {currentBadgeIndex > -1 && (
        <DamulModal
          isOpen={isOpen}
          setIsOpen={() => {
            if (isOpen) {
              setIsOpen(false);
              setCurrentBadgeIndex(-1);
            }
          }}
          title={"뱃지 상세보기"}
          contentStyle="max-w-80"
          triggerComponent={null}
        >
          <div className="flex flex-col justify-center gap-5 px-3">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center w-20 h-20 pt-2 rounded-full border-2 border-normal-100">
                <Badge level={badgeList[currentBadgeIndex].level} />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <div>
                  <p className="text-xs text-positive-400">뱃지명</p>
                  <div className="flex gap-1">
                    <p className="font-bold">
                      {badgeList[currentBadgeIndex].title}
                    </p>
                    <p className="font-black">
                      (Lv.{badgeList[currentBadgeIndex].level})
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-positive-400">획득일</p>
                  <p className="font-bold">2025-01-17</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-base font-black">
                {badgeList[currentBadgeIndex].condition}
              </p>
              <p className="text-positive-400 text-sm">
                상위 0.55%가 이 뱃지를 획득했어요.
              </p>
            </div>

            <p className="text-center text-normal-300">
              {badgeList[currentBadgeIndex].description}
            </p>
          </div>
        </DamulModal>
      )}
    </div>
  );
};

export default BadgeShowcase;
