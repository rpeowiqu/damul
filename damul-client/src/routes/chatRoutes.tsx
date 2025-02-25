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
    element: <ChattingMainPage />,
  },
  {
    path: "chatting/:roomId",
    element: <ChattingRoomPage />,
  },
  {
    path: "chatting/search",
    element: <ChattingSearchPage />,
  },
  {
    path: "chatting/search/:keyword",
    element: <ChattingSearchResultPage />,
  },
  {
    path: "chatting/create",
    element: <ChattingStartPage />,
  },
];

export default chatRoutes;
