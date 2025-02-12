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
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: "home/register",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <HomeIngredientsRegisterPage />
      </Suspense>
    ),
  },
  {
    path: "home/edit",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <HomeIngredientsEditPage />
      </Suspense>
    ),
  },
];

export default homeRoutes;
