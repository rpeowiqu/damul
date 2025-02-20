import { Outlet } from "react-router-dom";
import DamulTab from "@/components/common/DamulTab";
import { Suspense } from "react";
import Loading from "@/components/common/Loading";

const tabItems = [
  {
    path: "/community/recipe",
    name: "레시피 게시판",
  },
  {
    path: "/community/market",
    name: "공구/나눔 마켓",
  },
];

const CommunityPage = () => {
  return (
    <main className="flex flex-col">
      <DamulTab tabList={tabItems} />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </main>
  );
};

export default CommunityPage;
