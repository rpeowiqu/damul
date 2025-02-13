import { lazy } from "react";
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
    element: <CommunityPage />,
    children: [
      {
        index: true,
        element: <Navigate to="recipe" replace />,
      },
      {
        path: "recipe",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <CommunityRecipeMainPage />,
          },
          {
            path: "search",
            element: <CommunityRecipeSearchPage />,
          },
          {
            path: "search/:keyword",
            element: <CommunityRecipeSearchResultPage />,
          },
        ],
      },
      {
        path: "market",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <CommunityMarketMainPage />,
          },
          {
            path: "search",
            element: <CommunityMarketSearchPage />,
          },
          {
            path: "search/result",
            element: <CommunityMarketSearchResultPage />,
          },
        ],
      },
    ],
  },
  {
    path: "community/recipe/post",
    element: <CommunityRecipePostPage />,
  },
  {
    path: "community/recipe/:recipeId",
    element: <CommunityRecipeDetailPage />,
  },
  {
    path: "community/recipe/:recipeId/edit",
    element: <CommunityRecipePostPage />,
  },
  {
    path: "community/market/post",
    element: <CommunityMarketPostPage />,
  },
  {
    path: "community/market/:postId",
    element: <CommunityMarketDetailPage />,
  },
  {
    path: "community/market/:postId/edit",
    element: <CommunityMarketPostPage />,
  },
];

export default communityRoutes;
