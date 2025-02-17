import { useState, useEffect, useMemo } from "react";

import Badge from "./Badge";
import DamulModal from "../common/DamulModal";
import { BadgeBasic, BadgeDetail } from "@/types/profile";
import useCloseOnBack from "@/hooks/useCloseOnBack";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getBadge } from "@/service/profile";

interface BadgeShowcaseProps {
  list: BadgeBasic[];
  sortType: "level" | "title";
}

const BadgeShowcase = ({ list, sortType }: BadgeShowcaseProps) => {
  const { userId } = useParams();
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(-1);
  const [isOpen, setIsOpen] = useCloseOnBack(() => setCurrentBadgeIndex(-1));
  const { data, isLoading } = useQuery<BadgeDetail>({
    queryKey: ["badge", userId, currentBadgeIndex],
    queryFn: async () => {
      const response = await getBadge(
        parseInt(userId!),
        list[currentBadgeIndex].badgeId,
      );
      return response.data;
    },
    initialData: {
      id: 0,
      title: "",
      level: 0,
      createdAt: "",
      description: "",
      rank: 0,
      catchPhrase: "",
    },
    refetchOnWindowFocus: false,
    enabled: currentBadgeIndex > -1,
  });

  useEffect(() => {
    setIsOpen(currentBadgeIndex > -1 ? true : false);
  }, [currentBadgeIndex]);

  const sortedList = useMemo(() => {
    return [...list].sort((a, b) => {
      if (sortType === "title") {
        return a.badgeName.localeCompare(b.badgeName);
      }

      return a.badgeLevel > b.badgeLevel ? -1 : 1;
    });
  }, [list, sortType]);

  return (
    <div className="flex flex-col gap-3 p-3 border border-normal-100 rounded-xl">
      <p className="text-end text-sm">보유 뱃지 수 : {list.length}개</p>

      {sortedList.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-5 place-items-center gap-4">
          {sortedList.map((badge, index) => (
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
        <p className="text-center text-normal-200">
          보유 중인 뱃지가 없습니다.
          <br />
          식자재를 등록하고 뱃지를 획득해 보세요.
        </p>
      )}

      {currentBadgeIndex > -1 && !isLoading && (
        <DamulModal
          isOpen={isOpen}
          onOpenChange={() => {
            if (isOpen) {
              history.back();
            }
          }}
          title={"뱃지 상세보기"}
          contentStyle="pc:max-w-80"
        >
          <div className="flex flex-col justify-center gap-5 px-3">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center w-20 h-20 pt-2 rounded-full border-2 border-normal-100">
                <Badge badgeLevel={list[currentBadgeIndex].badgeLevel} />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <div>
                  <p className="text-xs text-positive-400">뱃지명</p>
                  <p className="font-bold">
                    {data.title} (Lv.{data.level})
                  </p>
                </div>
                <div>
                  <p className="text-xs text-positive-400">획득일</p>
                  <p className="font-bold">
                    {new Date(data.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-base font-black">{data.description}</p>
              <p className="text-positive-400">
                상위 {data.rank}%가 이 뱃지를 획득했어요.
              </p>
            </div>

            <p className="text-center text-normal-300">“{data.catchPhrase}”</p>
          </div>
        </DamulModal>
      )}
    </div>
  );
};

export default BadgeShowcase;
