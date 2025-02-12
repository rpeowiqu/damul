import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import Layout from "@/components/common/Layout";
import LoginPage from "@/pages/login/LoginPage";
import SignUpPage from "@/pages/signup/SignUpPage";
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
import ReportDetail from "@/components/admin/ReportDetail";
import UserDetail from "@/components/admin/UserDetail";
import AdminPostRecipePage from "@/pages/admin/AdminPostRecipePage";
import AdminPostMarketPage from "@/pages/admin/AdminPostMarketPage";
import ChattingMainPage from "@/pages/chat/ChattingMainPage";
import ChattingSearchPage from "@/pages/chat/ChattingSearchPage";
import ChattingStartPage from "@/pages/chat/ChattingStartPage";
import HomeIngredientsRegisterPage from "@/pages/home/HomeIngredientsRegisterPage";
import ChattingSearchResultPage from "@/pages/chat/ChattingSearchResultPage";
import ChattingRoomPage from "@/pages/chat/ChattingRoomPage";
import TestPage from "@/pages/TestPage";
import AlarmPage from "@/pages/alarm/AlarmPage";
import HomeIngredientsEditPage from "@/pages/home/HomeIngredientsEditPage";

const router = createBrowserRouter([
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
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "test",
        element: <TestPage />,
      },
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      { path: "home/register", element: <HomeIngredientsRegisterPage /> },
      { path: "home/edit", element: <HomeIngredientsEditPage /> },
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
                path: "search/result",
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
        path: "community/recipe/:recipeId",
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
        path: "community/market/:postId",
        element: <CommunityMarketDetailPage />,
      },
      {
        path: "community/market/:id/edit",
        element: <CommunityMarketPostPage />,
      },
      {
        path: "chatting",
        children: [
          {
            index: true,
            element: <ChattingMainPage />,
          },
          {
            path: ":roomId",
            element: <ChattingRoomPage />,
          },
          {
            path: "search",
            element: <ChattingSearchPage />,
          },
          {
            path: "search/:keyword",
            element: <ChattingSearchResultPage />,
          },
          {
            path: "create",
            element: <ChattingStartPage />,
          },
        ],
      },
      {
        path: "setting",
        element: <SettingPage />,
      },
      {
        path: "alarm",
        element: <AlarmPage />,
      },
    ],
  },
  {
    path: "/",
    element: <Layout footer={null} />,
    children: [
      {
        path: "setting",
        element: <SettingPage />,
      },
      {
        path: "alarm",
        element: <AlarmPage />,
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
        path: "reports",
        element: <AdminReportPage />,
      },
      {
        path: "reports/:reportId",
        element: <ReportDetail />,
      },
      {
        path: "users",
        element: <AdminUserPage />,
      },
      {
        path: "users/:userId",
        element: <UserDetail />,
      },
      {
        path: "posts",
        element: <AdminPostPage />,
        children: [
          {
            index: true,
            element: <Navigate to={"recipe"} />,
          },
          {
            path: "recipe",
            element: <AdminPostRecipePage />,
          },
          {
            path: "recipe/:id",
            element: <div></div>,
          },
          {
            path: "market",
            element: <AdminPostMarketPage />,
          },
          {
            path: "share/:id",
            element: <div></div>,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
