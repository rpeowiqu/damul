import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/common/Layout";
import homeRoutes from "./homeRoutes";
import adminRoutes from "./adminRoutes";
import chatRoutes from "./chatRoutes";
import profileRoutes from "./profileRoutes";
import communityRoutes from "./communityRoutes";
import NotFoundPage from "@/pages/notFound/NotFoundPage";

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
        path: "login",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LoginPage />
          </Suspense>
        ),
        handle: { noHeaderNoFooter: true },
      },
      {
        path: "signup",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SignUpPage />
          </Suspense>
        ),
        handle: { noHeaderNoFooter: true },
      },
      {
        path: "setting",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SettingPage />
          </Suspense>
        ),
        handle: { noFooter: true },
      },
      {
        path: "alarm",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AlarmPage />
          </Suspense>
        ),
        handle: { noFooter: true },
      },
      ...homeRoutes,
      ...chatRoutes,
      ...profileRoutes,
      ...communityRoutes,
      ...adminRoutes,
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
