import { Outlet } from "react-router-dom";

import DamulTab from "@/components/common/DamulTab";
import ProfileBanner from "@/components/profile/ProfileBanner";

const tabItems = [
  {
    absPath: "/profile/info",
    name: "유저 정보",
  },
  {
    absPath: "/profile/badge",
    name: "뱃지",
  },
  {
    absPath: "/profile/recipe",
    name: "나의 레시피",
  },
  {
    absPath: "/profile/bookmark",
    name: "북마크",
  },
];

const ProfilePage = () => {
  return (
    <main className="flex flex-col h-full">
      <DamulTab propItems={tabItems} />
      <ProfileBanner nickname={"토마토러버전종우"} />
      <div className="flex-1 bg-normal-50">
        <Outlet />
      </div>
    </main>
  );
};

export default ProfilePage;
