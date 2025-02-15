import { lazy } from "react";
import { Navigate } from "react-router-dom";

const AdminLoginPage = lazy(() => import("@/pages/admin/AdminLoginPage"));
const AdminPage = lazy(() => import("@/pages/admin/AdminPage"));
const AdminReportPage = lazy(() => import("@/pages/admin/AdminReportPage"));
const ReportDetail = lazy(() => import("@/components/admin/ReportDetail"));
const AdminUserPage = lazy(() => import("@/pages/admin/AdminUserPage"));
const UserDetail = lazy(() => import("@/components/admin/UserDetail"));
const AdminPostPage = lazy(() => import("@/pages/admin/AdminPostPage"));
const AdminPostRecipePage = lazy(
  () => import("@/pages/admin/AdminPostRecipePage"),
);
const AdminPostMarketPage = lazy(
  () => import("@/pages/admin/AdminPostMarketPage"),
);

const adminRoutes = [
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
];

export default adminRoutes;
