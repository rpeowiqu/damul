import { lazy } from "react";
import { Navigate } from "react-router-dom";

const StatisticsPage = lazy(() => import("@/pages/statistics/StatisticsPage"));
const StatisticsTrendPage = lazy(
  () => import("@/pages/statistics/StatisticsTrendPage"),
);
const StatisticsHistoryPage = lazy(
  () => import("@/pages/statistics/StatisticsHistoryPage"),
);

const statisticsRoutes = [
  {
    path: "statistics",
    element: <StatisticsPage />,
    children: [
      {
        index: true,
        element: <Navigate to="trend" replace />,
      },
      {
        path: "trend",
        element: <StatisticsTrendPage />,
      },
      {
        path: "history",
        element: <StatisticsHistoryPage />,
      },
    ],
  },
];

export default statisticsRoutes;
