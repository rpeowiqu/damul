import { Outlet } from "react-router-dom";
import DamulTab from "@/components/common/DamulTab";
import { Suspense } from "react";
import Loading from "@/components/common/Loading";

const tabItems = [
  {
    path: "/statistics/trend",
    pathVariables: [],
    name: "식자재 가격 동향",
  },
  {
    path: "/statistics/history",
    pathVariables: [],
    name: "나의 구매 이력",
  },
];

const StatisticsPage = () => {
  return (
    <div className="flex-1 bg-normal-50">
      <DamulTab tabList={tabItems} />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default StatisticsPage;
