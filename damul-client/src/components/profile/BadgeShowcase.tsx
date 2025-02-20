import { useState, useMemo } from "react";

import Badge from "./Badge";
import DamulModal from "../common/DamulModal";
import { BadgeBasic, BadgeDetail } from "@/types/profile";
import useCloseOnBack from "@/hooks/useCloseOnBack";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getBadge } from "@/service/profile";
import useOverlayStore from "@/stores/overlayStore";

interface BadgeShowcaseProps {
  list: BadgeBasic[];
  sortType: "level" | "title";
}

const BadgeShowcase = ({ list, sortType }: BadgeShowcaseProps) => {
  const { userId } = useParams();
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(-1);
  const { overlaySet, openOverlay } = useOverlayStore();
  const isOpenOverlay = overlaySet.has("BadgeShowcase");

  useCloseOnBack("BadgeShowcase");

  const sortedList = useMemo(() => {
    return [...list].sort((a, b) => {
      if (sortType === "title") {
        return a.badgeName.localeCompare(b.badgeName);
      }

      return a.badgeLevel > b.badgeLevel ? -1 : 1;
    });
  }, [list, sortType]);
  const originalIndex = useMemo(() => {
    if (currentBadgeIndex === -1) {
      return -1;
    }

    const badge = sortedList[currentBadgeIndex];
    return list.findIndex((b) => b.badgeId === badge.badgeId);
  }, [currentBadgeIndex, sortedList, list]);
  const badgeId = originalIndex > -1 ? list[originalIndex].badgeId : null;
  const { data, isLoading } = useQuery<BadgeDetail>({
    queryKey: ["badge", userId, badgeId],
    queryFn: async () => {
      const response = await getBadge(
        parseInt(userId!),
        sortedList[currentBadgeIndex].badgeId,
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    enabled: !!badgeId,
  });

  const selectedBadge = data ?? {
    id: 0,
    title: "",
    level: 0,
    createdAt: "",
    description: "",
    rank: 0,
    catchPhrase: "",
  };

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
                openOverlay("BadgeShowcase");
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

      <DamulModal
        isOpen={!isLoading && isOpenOverlay}
        onOpenChange={() => {
          if (isOpenOverlay) {
            history.back();
          }
        }}
        title={"뱃지 상세보기"}
        contentStyle="pc:max-w-80"
      >
        <div className="flex flex-col justify-center gap-5 px-3">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center w-20 h-20 pt-2 rounded-full border-2 border-normal-100">
              <Badge badgeLevel={selectedBadge.level} />
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <div>
                <p className="text-xs text-positive-400">뱃지명</p>
                <p className="text-sm text-normal-600 font-bold">
                  {selectedBadge.title} (Lv.{selectedBadge.level})
                </p>
              </div>
              <div>
                <p className="text-xs text-positive-400">획득일</p>
                <p className="text-sm text-normal-600 font-bold">
                  {new Date(selectedBadge.createdAt).toLocaleDateString(
                    "ko-KR",
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-base text-normal-600 font-black">
              {selectedBadge.description}
            </p>
            <p className="text-sm text-positive-400">
              상위 {selectedBadge.rank.toFixed(2)}%가 이 뱃지를 획득했어요.
            </p>
          </div>

          <p className="text-center text-sm text-normal-300">
            “{selectedBadge.catchPhrase}”
          </p>
        </div>
      </DamulModal>
    </div>
  );
};

export default BadgeShowcase;
