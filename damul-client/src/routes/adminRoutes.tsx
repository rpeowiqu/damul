import { lazy, Suspense } from "react";
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
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AdminLoginPage />
      </Suspense>
    ),
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AdminPage />
      </Suspense>
    ),
    children: [
      {
        path: "reports",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AdminReportPage />
          </Suspense>
        ),
      },
      {
        path: "reports/:reportId",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportDetail />
          </Suspense>
        ),
      },
      {
        path: "users",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AdminUserPage />
          </Suspense>
        ),
      },
      {
        path: "users/:userId",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <UserDetail />
          </Suspense>
        ),
      },
      {
        path: "posts",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AdminPostPage />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <Navigate to={"recipe"} />,
          },
          {
            path: "recipe",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <AdminPostRecipePage />
              </Suspense>
            ),
          },
          {
            path: "recipe/:id",
            element: <div></div>,
          },
          {
            path: "market",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <AdminPostMarketPage />
              </Suspense>
            ),
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
