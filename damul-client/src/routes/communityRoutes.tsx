import { lazy, Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

const CommunityPage = lazy(() => import("@/pages/community/CommunityPage"));
const CommunityRecipeMainPage = lazy(
  () => import("@/pages/community/CommunityRecipeMainPage"),
);
const CommunityRecipeSearchPage = lazy(
  () => import("@/pages/community/CommunityRecipeSearchPage"),
);
const CommunityRecipeSearchResultPage = lazy(
  () => import("@/pages/community/CommunityRecipeSearchResultPage"),
);
const CommunityMarketMainPage = lazy(
  () => import("@/pages/community/CommunityMarketMainPage"),
);
const CommunityMarketSearchPage = lazy(
  () => import("@/pages/community/CommunityMarketSearchPage"),
);
const CommunityMarketSearchResultPage = lazy(
  () => import("@/pages/community/CommunityMarketSearchResultPage"),
);
const CommunityRecipePostPage = lazy(
  () => import("@/pages/community/CommunityRecipePostPage"),
);
const CommunityRecipeDetailPage = lazy(
  () => import("@/pages/community/CommunityRecipeDetailPage"),
);
const CommunityMarketPostPage = lazy(
  () => import("@/pages/community/CommunityMarketPostPage"),
);
const CommunityMarketDetailPage = lazy(
  () => import("@/pages/community/CommunityMarketDetailPage"),
);

const communityRoutes = [
  {
    path: "community",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CommunityPage />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="recipe" replace />,
      },
      {
        path: "recipe",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <CommunityRecipeMainPage />
              </Suspense>
            ),
          },
          {
            path: "search",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <CommunityRecipeSearchPage />
              </Suspense>
            ),
          },
          {
            path: "search/:keyword",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <CommunityRecipeSearchResultPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "market",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <CommunityMarketMainPage />
              </Suspense>
            ),
          },
          {
            path: "search",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <CommunityMarketSearchPage />
              </Suspense>
            ),
          },
          {
            path: "search/result",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <CommunityMarketSearchResultPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "community/recipe/post",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CommunityRecipePostPage />
      </Suspense>
    ),
  },
  {
    path: "community/recipe/:recipeId",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CommunityRecipeDetailPage />
      </Suspense>
    ),
  },
  {
    path: "community/recipe/:recipeId/edit",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CommunityRecipePostPage />
      </Suspense>
    ),
  },
  {
    path: "community/market/post",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CommunityMarketPostPage />
      </Suspense>
    ),
  },
  {
    path: "community/market/:postId",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CommunityMarketDetailPage />
      </Suspense>
    ),
  },
  {
    path: "community/market/:postId/edit",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CommunityMarketPostPage />
      </Suspense>
    ),
  },
];

export default communityRoutes;
