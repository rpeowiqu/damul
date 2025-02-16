import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/common/Layout";
import homeRoutes from "./homeRoutes";
import adminRoutes from "./adminRoutes";
import chatRoutes from "./chatRoutes";
import profileRoutes from "./profileRoutes";
import communityRoutes from "./communityRoutes";
import statisticsRoutes from "./statisticsRoutes";
import NotFoundPage from "@/pages/notFound/NotFoundPage";
import IntroPage from "@/pages/intro/IntroPage";

const HomePage = lazy(() => import("@/pages/home/HomePage"));
const LoginPage = lazy(() => import("@/pages/login/LoginPage"));
const SignUpPage = lazy(() => import("@/pages/signup/SignUpPage"));
const SettingPage = lazy(() => import("@/pages/setting/SettingPage"));
const AlarmPage = lazy(() => import("@/pages/alarm/AlarmPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <IntroPage />,
        handle: { header: false, footer: false },
      },
      {
        path: "login",
        element: <LoginPage />,
        handle: { header: false, footer: false },
      },
      {
        path: "signup",
        element: <SignUpPage />,
        handle: { header: false, footer: false },
      },
      {
        path: "setting",
        element: <SettingPage />,
        handle: { header: true, footer: false },
      },
      {
        path: "alarm",
        element: <AlarmPage />,
        handle: { header: true, footer: false },
      },
      ...homeRoutes,
      ...chatRoutes,
      ...profileRoutes,
      ...communityRoutes,
      ...adminRoutes,
      ...statisticsRoutes,
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
