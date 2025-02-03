import { useState, useEffect } from "react";

import Badge from "./Badge";
import DamulModal from "../common/DamulModal";
import { BadgeList } from "@/types/profile";

const BadgeShowcase = ({ list }: BadgeList) => {
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (currentBadgeIndex > -1) {
      setIsOpen(true);
    }
  }, [currentBadgeIndex]);

  return (
    <div className="flex flex-col gap-3 p-3 border border-normal-100 rounded-xl">
      <p className="text-end text-sm">보유 뱃지 수 : {list.length}개</p>

      {list.length > 0 ? (
        <div className="grid grid-cols-5 pc:grid-cols-6 place-items-center gap-4">
          {list.map((badge, index) => (
            <Badge
              key={index}
              {...badge}
              onClick={() => {
                setCurrentBadgeIndex(index);
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-normal-200 text-lg">
          보유 중인 뱃지가 없습니다.
          <br />
          식자재를 등록하고 뱃지를 획득해 보세요.
        </p>
      )}

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
                <Badge badgeLevel={list[currentBadgeIndex].badgeLevel} />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <div>
                  <p className="text-xs text-positive-400">뱃지명</p>
                  <div className="flex gap-1">
                    <p className="font-bold">
                      {list[currentBadgeIndex].badgeName}
                    </p>
                    <p className="font-black">
                      (Lv.{list[currentBadgeIndex].badgeLevel})
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
                {list[currentBadgeIndex].condition}
              </p>
              <p className="text-positive-400 text-sm">
                상위 0.55%가 이 뱃지를 획득했어요.
              </p>
            </div>

            <p className="text-center text-normal-300">
              {list[currentBadgeIndex].description}
            </p>
          </div>
        </DamulModal>
      )}
    </div>
  );
};

export default BadgeShowcase;
