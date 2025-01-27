import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/common/Layout";
import LoginPage from "@/pages/login/LoginPage";
import SignUpPage from "@/pages/signUp/SignUpPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import ProfileInfoPage from "@/pages/profile/ProfileInfoPage";
import ProfileBadgePage from "@/pages/profile/ProfileBadgePage";
import ProfileRecipePage from "@/pages/profile/ProfileRecipePage";
import ProfileBookmarkPage from "@/pages/profile/ProfileBookmarkPage";

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
