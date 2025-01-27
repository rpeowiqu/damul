import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import Layout from "@/components/common/Layout";
import LoginPage from "@/pages/login/LoginPage";
import SignUpPage from "@/pages/signUp/SignUpPage";
import RecipeMainPage from "@/pages/community/CommunityRecipeMainPage";
import RecipeSearchPage from "@/pages/community/CommunityRecipeSearchPage";
import RecipePostPage from "@/pages/community/CommunityRecipePostPage";
import RecipeDetailPage from "@/pages/community/CommunityRecipeDetailPage";
import MarketMainPage from "@/pages/community/CommunityMarketMainPage";
import MarketSearchPage from "@/pages/community/CommunityMarketSearchPage";
import MarketPostPage from "@/pages/community/CommunityMarketPostPage";
import MarketDetailPage from "@/pages/community/CommunityMarketDetailPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import ProfileInfoPage from "@/pages/profile/ProfileInfoPage";
import ProfileBadgePage from "@/pages/profile/ProfileBadgePage";
import ProfileRecipePage from "@/pages/profile/ProfileRecipePage";
import ProfileBookmarkPage from "@/pages/profile/ProfileBookmarkPage";
import CommunityPage from "@/pages/community/CommunityPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
        children: [
          {
            index: true,
            element: <Navigate to="info" replace />,
          },
          {
            path: "info",
            element: <ProfileInfoPage />,
          },
          {
            path: "badge",
            element: <ProfileBadgePage />,
          },
          {
            path: "recipe",
            element: <ProfileRecipePage />,
          },
          {
            path: "bookmark",
            element: <ProfileBookmarkPage />,
          },
        ],
      },
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
            element: (
              <>
                <Outlet />
              </>
            ),
            children: [
              {
                index: true,
                element: <RecipeMainPage />,
              },
              {
                path: "search",
                element: <RecipeSearchPage />,
              },
            ],
          },
          {
            path: "market",
            element: (
              <>
                <Outlet />
              </>
            ),
            children: [
              {
                index: true,
                element: <MarketMainPage />,
              },
              {
                path: "search",
                element: <MarketSearchPage />,
              },
            ],
          },
        ],
      },
      // 독립적인 경로로 설정
      {
        path: "community/recipe/post",
        element: <RecipePostPage />,
      },
      {
        path: "community/recipe/:id",
        element: <RecipeDetailPage />,
      },
      {
        path: "community/market/post",
        element: <MarketPostPage />,
      },
      {
        path: "community/market/:id",
        element: <MarketDetailPage />,
      },
    ],
  },
  {
    path: "/",
    element: <Layout header={null} footer={null} />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);

export default router;

