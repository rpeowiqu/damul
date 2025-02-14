import { Suspense, useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import DamulTab from "@/components/common/DamulTab";
import ProfileBanner from "@/components/profile/ProfileBanner";
import { ProfileHeader } from "@/types/profile";
import { getProfileHeader } from "@/service/mypage";
import useAuth from "@/hooks/useAuth";

const ProfilePage = () => {
  const { userId } = useParams();
  const { data, isLoading } = useAuth();
  const [header, setHeader] = useState<ProfileHeader | null>(null);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const isOwn = userId && parseInt(userId) === data?.data.id;
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
    if (!userId) {
      return;
    }

    const fetchHeader = async () => {
      try {
        const response = await getProfileHeader(parseInt(userId));
        if (response) {
          setHeader(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetched(true);
      }
    };

    fetchHeader();
  }, [userId]);

  if (isLoading) {
    return;
  }

  if (!isFetched) {
    return null;
  }

  if (!header) {
    return <Navigate to={"/404"} replace />;
  }

  return (
    <div className="flex flex-col h-full">
      <ProfileBanner
        nickname={header.nickname}
        imageUrl={header.profileImageUrl}
        bgImageUrl={header.profileBackgroundImageUrl}
      />
      <DamulTab tabList={tabItems} />
      <div className="flex-1 bg-normal-50">
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet context={{ user: header }} />
        </Suspense>
      </div>
    </div>
  );
};

export default ProfilePage;
