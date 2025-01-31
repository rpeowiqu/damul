import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import Layout from "@/components/common/Layout";
import LoginPage from "@/pages/login/LoginPage";
import SignUpPage from "@/pages/signUp/SignUpPage";
import CommunityRecipeMainPage from "@/pages/community/CommunityRecipeMainPage";
import CommunityRecipeSearchPage from "@/pages/community/CommunityRecipeSearchPage";
import CommunityRecipePostPage from "@/pages/community/CommunityRecipePostPage";
import CommunityRecipeDetailPage from "@/pages/community/CommunityRecipeDetailPage";
import CommunityMarketMainPage from "@/pages/community/CommunityMarketMainPage";
import CommunityMarketSearchPage from "@/pages/community/CommunityMarketSearchPage";
import CommunityMarketPostPage from "@/pages/community/CommunityMarketPostPage";
import CommunityMarketDetailPage from "@/pages/community/CommunityMarketDetailPage";
import CommunitySearchResultPage from "@/pages/community/CommunitySearchResultPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import ProfileInfoPage from "@/pages/profile/ProfileInfoPage";
import ProfileBadgePage from "@/pages/profile/ProfileBadgePage";
import ProfileRecipePage from "@/pages/profile/ProfileRecipePage";
import ProfileBookmarkPage from "@/pages/profile/ProfileBookmarkPage";
import CommunityPage from "@/pages/community/CommunityPage";
import FriendPage from "@/pages/friend/FriendPage";
import FriendFollowerPage from "@/pages/friend/FriendFollowerPage";
import FriendFollowingPage from "@/pages/friend/FriendFollowingPage";

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
                element: <CommunityRecipeMainPage />,
              },
              {
                path: "search",
                element: <CommunityRecipeSearchPage />,
              },
              {
                path: "search/:keyword",
                element: <CommunitySearchResultPage />,
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
                element: <CommunityMarketMainPage />,
              },
              {
                path: "search",
                element: <CommunityMarketSearchPage />,
              },
              {
                path: "search/:keyword",
                element: <CommunitySearchResultPage />,
              },
            ],
          },
        ],
      },
      // 독립적인 경로로 설정
      {
        path: "community/recipe/post",
        element: <CommunityRecipePostPage />,
      },
      {
        path: "community/recipe/:id",
        element: <CommunityRecipeDetailPage />,
      },
      {
        path: "community/market/post",
        element: <CommunityMarketPostPage />,
      },
      {
        path: "community/market/:id",
        element: <CommunityMarketDetailPage />,
      },
      {
        path: "friend",
        element: <FriendPage />,
        children: [
          {
            index: true,
            element: <Navigate to="follower" replace />,
          },
          {
            path: "follower",
            element: <FriendFollowerPage />,
          },
          {
            path: "following",
            element: <FriendFollowingPage />,
          },
        ],
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
