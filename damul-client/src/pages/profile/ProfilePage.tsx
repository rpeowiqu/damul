import { Outlet } from "react-router-dom";
import DamulTab from "@/components/common/DamulTab";

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
    <main className="flex flex-col">
      <div className="h-44 bg-normal-200"></div>
      <DamulTab propItems={tabItems} />
      <Outlet />
    </main>
  );
};

export default ProfilePage;
