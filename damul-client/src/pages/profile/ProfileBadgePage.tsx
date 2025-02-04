import BadgeShowcase from "@/components/profile/BadgeShowcase";
import { BadgeList } from "@/types/profile";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const ProfileBadgePage = () => {
  const { user } = useOutletContext();
  const [badgeList, setBadgeList] = useState<BadgeList>({
    list: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/mocks/profile/user-profile-badge_${user.userId}.json`,
        );
        if (!response.ok) {
          throw new Error("데이터를 불러오지 못했습니다.");
        }

        const data = await response.json();
        setBadgeList(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 p-5 bg-white">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">{user.nickname}의 뱃지 전시대</h1>
        <p className="text-normal-600">그동안 획득한 뱃지들을 살펴보세요!</p>
      </div>

      <BadgeShowcase list={badgeList.list} />
    </div>
  );
};

export default ProfileBadgePage;
