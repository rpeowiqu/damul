import { lazy, Suspense } from "react";

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

    element: (
      <Suspense fallback={<div></div>}>
        <HomeIngredientsRegisterPage />
      </Suspense>
    ),
  },
  {
    path: "home/edit",
    element: <HomeIngredientsEditPage />,
  },
];

export default homeRoutes;
