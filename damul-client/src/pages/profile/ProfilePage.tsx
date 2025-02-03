import { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import DamulTab from "@/components/common/DamulTab";
import ProfileBanner from "@/components/profile/ProfileBanner";
import { ProfileHeader } from "@/types/profile";
import useUserStore from "@/stores/user";

const ProfilePage = () => {
  const { userId } = useParams();
  const myId = useUserStore((state) => state.myId);
  const [header, setHeader] = useState<ProfileHeader | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isOwn = userId && parseInt(userId) === myId;
  const tabItems = [
    {
      path: "/profile/:userId/info",
      pathVariables: ["userId"],
      name: "유저 정보",
    },
    {
      path: "/profile/:userId/badge",
      pathVariables: ["userId"],
      name: "뱃지",
    },
    {
      path: "/profile/:userId/recipe",
      pathVariables: ["userId"],
      name: "나의 레시피",
    },
    {
      path: isOwn
        ? "/profile/:userId/bookmark"
        : "/profile/:userId/ingredients",
      pathVariables: ["userId"],
      name: isOwn ? "북마크" : "보유 식자재",
    },
  ];

  // 마운트 될 때, 동적 경로로부터 userId를 가져와서 해당 유저의 프로필을 보여준다.
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await fetch(
            "/mocks/profile/user-profile-header.json",
          );
          if (!response.ok) {
            throw new Error("데이터를 불러오지 못했습니다.");
          }

          const data = await response.json();
          const foundUser = data.find(
            (item: ProfileHeader) => item.userId === parseInt(userId),
          );
          setHeader(foundUser);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [userId]);

  if (isLoading) {
    return null;
  }

  if (!header) {
    return <Navigate to={"/404"} replace />;
  }

  return (
    <div className="flex flex-col h-full">
      <DamulTab tabList={tabItems} />
      <ProfileBanner nickname={header.nickname} />
      <div className="flex-1 bg-normal-50">
        <Outlet context={{ user: header }} />
      </div>
    </div>
  );
};

export default ProfilePage;
