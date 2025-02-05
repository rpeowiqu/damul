import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import Layout from "@/components/common/Layout";
import LoginPage from "@/pages/login/LoginPage";
import SignUpPage from "@/pages/SignUp/SignUpPage";
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
import ProfileIngredientsPage from "@/pages/profile/ProfileIngredientsPage";
import CommunityPage from "@/pages/community/CommunityPage";
import ProfileFriendPage from "@/pages/profile/ProfileFriendPage";
import ProfileFriendFollowerPage from "@/pages/profile/ProfileFriendFollowerPage";
import ProfileFriendFollowingPage from "@/pages/profile/ProfileFriendFollowingPage";
import NotFoundPage from "@/pages/notFound/NotFoundPage";
import SettingPage from "@/pages/setting/SettingPage";
import AdminPage from "@/pages/admin/AdminPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminReportPage from "@/pages/admin/AdminReportPage";
import AdminUserPage from "@/pages/admin/AdminUserPage";
import AdminPostPage from "@/pages/admin/AdminPostPage";
import HomePage from "@/pages/home/HomePage";
import HomeIngredientsRegisterPage from "@/pages/home/HomeIngredientsRegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      { path: "home/register", element: <HomeIngredientsRegisterPage /> },
      {
        path: "profile/:userId",
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
          {
            path: "ingredients",
            element: <ProfileIngredientsPage />,
          },
        ],
      },
      {
        path: "profile/:userId/friend",
        element: <ProfileFriendPage />,
        children: [
          {
            index: true,
            element: <Navigate to="follower" replace />,
          },
          {
            path: "follower",
            element: <ProfileFriendFollowerPage />,
          },
          {
            path: "following",
            element: <ProfileFriendFollowingPage />,
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
        path: "community/recipe/:id/edit",
        element: <CommunityRecipePostPage />,
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
        path: "community/market/:id/edit",
        element: <CommunityMarketPostPage />,
      },
      {
        path: "setting",
        element: <SettingPage />,
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
      {
        path: "signup",
        element: <SignUpPage />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
    children: [
      {
        path: "report",
        element: <AdminReportPage />,
      },
      {
        path: "user",
        element: <AdminUserPage />,
      },
      {
        path: "post",
        element: <AdminPostPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
