import { lazy } from "react";

const HomePage = lazy(() => import("@/pages/home/HomePage"));
const HomeIngredientsRegisterPage = lazy(
  () => import("@/pages/home/HomeIngredientsRegisterPage"),
);
const HomeIngredientsEditPage = lazy(
  () => import("@/pages/home/HomeIngredientsEditPage"),
);

const homeRoutes = [
  {
    path: "home",
    element: <HomePage />,
  },
  {
    path: "home/register",
    element: <HomeIngredientsRegisterPage />,
  },
  {
    path: "home/edit",
    element: <HomeIngredientsEditPage />,
  },
];

export default homeRoutes;
