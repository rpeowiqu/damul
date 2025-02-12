import { lazy, Suspense } from "react";

const ChattingMainPage = lazy(() => import("@/pages/chat/ChattingMainPage"));
const ChattingRoomPage = lazy(() => import("@/pages/chat/ChattingRoomPage"));
const ChattingSearchPage = lazy(
  () => import("@/pages/chat/ChattingSearchPage"),
);
const ChattingSearchResultPage = lazy(
  () => import("@/pages/chat/ChattingSearchResultPage"),
);
const ChattingStartPage = lazy(() => import("@/pages/chat/ChattingStartPage"));

const chatRoutes = [
  {
    path: "chatting",
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ChattingMainPage />
          </Suspense>
        ),
      },
      {
        path: ":roomId",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ChattingRoomPage />
          </Suspense>
        ),
      },
      {
        path: "search",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ChattingSearchPage />
          </Suspense>
        ),
      },
      {
        path: "search/:keyword",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ChattingSearchResultPage />
          </Suspense>
        ),
      },
      {
        path: "create",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ChattingStartPage />
          </Suspense>
        ),
      },
    ],
  },
];

export default chatRoutes;
