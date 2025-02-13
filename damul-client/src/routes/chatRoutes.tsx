import { lazy } from "react";

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
];

export default chatRoutes;
