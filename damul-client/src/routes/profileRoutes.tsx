import { lazy } from "react";
import { Navigate } from "react-router-dom";

const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));
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

const ProfileInfoPage = lazy(() => import("@/pages/profile/ProfileInfoPage"));

const profileRoutes = [
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
];

export default profileRoutes;
