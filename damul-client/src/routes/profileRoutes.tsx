import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));
const ProfileInfoPage = lazy(() => import("@/pages/profile/ProfileInfoPage"));
const ProfileBadgePage = lazy(() => import("@/pages/profile/ProfileBadgePage"));
const ProfileRecipePage = lazy(
  () => import("@/pages/profile/ProfileRecipePage"),
);
const ProfileBookmarkPage = lazy(
  () => import("@/pages/profile/ProfileBookmarkPage"),
);
const ProfileIngredientsPage = lazy(
  () => import("@/pages/profile/ProfileIngredientsPage"),
);
const ProfileFriendPage = lazy(
  () => import("@/pages/profile/ProfileFriendPage"),
);
const ProfileFriendFollowerPage = lazy(
  () => import("@/pages/profile/ProfileFriendFollowerPage"),
);
const ProfileFriendFollowingPage = lazy(
  () => import("@/pages/profile/ProfileFriendFollowingPage"),
);

const profileRoutes = [
  {
    path: "profile/:userId",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ProfilePage />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="info" replace />,
      },
      {
        path: "info",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProfileInfoPage />
          </Suspense>
        ),
      },
      {
        path: "badge",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProfileBadgePage />
          </Suspense>
        ),
      },
      {
        path: "recipe",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProfileRecipePage />
          </Suspense>
        ),
      },
      {
        path: "bookmark",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProfileBookmarkPage />
          </Suspense>
        ),
      },
      {
        path: "ingredients",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProfileIngredientsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "profile/:userId/friend",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileFriendPage />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="follower" replace />,
      },
      {
        path: "follower",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProfileFriendFollowerPage />
          </Suspense>
        ),
      },
      {
        path: "following",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProfileFriendFollowingPage />
          </Suspense>
        ),
      },
    ],
  },
];

export default profileRoutes;
