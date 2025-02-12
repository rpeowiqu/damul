import DamulHoverCard from "@/components/common/DamulHoverCard";
import BadgeShowcase from "@/components/profile/BadgeShowcase";
import { BadgeList } from "@/types/profile";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const ProfileBadgePage = () => {
  const { user } = useOutletContext();
  const [badgeList, setBadgeList] = useState<BadgeList>({
    list: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         `/mocks/profile/user-profile-badge_${user.userId}.json`,
  //       );
  //       if (!response.ok) {
  //         throw new Error("데이터를 불러오지 못했습니다.");
  //       }

  //       const data = await response.json();
  //       setBadgeList(data);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [user]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 p-5 bg-white">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">{user.nickname}님의 뱃지 전시대</h1>
        <div className="flex justify-between items-center">
          <p className="text-normal-600">그동안 획득한 뱃지들을 살펴보세요!</p>

          <DamulHoverCard
            hoverCardTrigger={
              <AlertCircleIcon className="size-4 stroke-normal-300" />
            }
          >
            <p className="text-sm">뱃지는 매일 오전 12시에 갱신 됩니다.</p>
          </DamulHoverCard>
        </div>
      </div>

      <BadgeShowcase list={badgeList.list} />
    </div>
  );
};

export default ProfileBadgePage;
