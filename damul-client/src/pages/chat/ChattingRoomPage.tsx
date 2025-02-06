import { useRef } from "react";
import Image from "@/components/common/Image";

interface ChatMessage {
  id: number;
  roomId: number;
  senderId: number;
  profileImageUrl: string;
  nickname: string;
  messageType: "TEXT" | "IMAGE" | "FILE" | "ENTER" | "LEAVE";
  content: string;
  fileUrl?: string;
  createdAt: string;
  unReadCount: number;
}

interface ChatResponse {
  data: ChatMessage[];
  meta: {
    nextCursor: number;
    hasNext: boolean;
  };
}

const mockData: ChatResponse = {
  data: [
    {
      id: 1,
      roomId: 123,
      senderId: 45,
      profileImageUrl: "https://via.placeholder.com/40",
      nickname: "토마토러버전종우",
      messageType: "TEXT",
      content:
        "토마토를 드세요 토마토를 드세요 토마토를 드세요 토마토를 드세요 토마토를 드세요 토마토를 드세요 토마토를 드세요 토마토를 드세요 토마토를 드세요 토마토를 드세요 토마토를 드세요",
      createdAt: "2025-02-06T12:00:00Z",
      unReadCount: 2,
    },
    {
      id: 2,
      roomId: 123,
      senderId: 46,
      profileImageUrl: "https://via.placeholder.com/40",
      nickname: "집가고싶은윤서히",
      messageType: "IMAGE",
      content: "집에 가세요",
      fileUrl: "https://via.placeholder.com/150",
      createdAt: "2025-02-06T12:05:00Z",
      unReadCount: 1,
    },
    {
      id: 1,
      roomId: 123,
      senderId: 45,
      profileImageUrl: "https://via.placeholder.com/40",
      nickname: "토마토러버전종우",
      messageType: "TEXT",
      content: "토마토를 드세요",
      createdAt: "2025-02-06T12:00:00Z",
      unReadCount: 2,
    },
    {
      id: 2,
      roomId: 123,
      senderId: 46,
      profileImageUrl: "https://via.placeholder.com/40",
      nickname: "집가고싶은윤서히",
      messageType: "IMAGE",
      content: "집에 가세요",
      fileUrl: "https://via.placeholder.com/150",
      createdAt: "2025-02-06T12:05:00Z",
      unReadCount: 1,
    },
    {
      id: 1,
      roomId: 123,
      senderId: 1,
      profileImageUrl: "https://via.placeholder.com/40",
      nickname: "우와세상에",
      messageType: "TEXT",
      content: "토마토를 드세요",
      createdAt: "2025-02-06T12:00:00Z",
      unReadCount: 2,
    },
    {
      id: 2,
      roomId: 123,
      senderId: 46,
      profileImageUrl: "https://via.placeholder.com/40",
      nickname: "집가고싶은윤서히",
      messageType: "IMAGE",
      content: "집에 가세요",
      fileUrl: "https://via.placeholder.com/150",
      createdAt: "2025-02-06T12:05:00Z",
      unReadCount: 1,
    },
    {
      id: 1,
      roomId: 123,
      senderId: 45,
      profileImageUrl: "https://via.placeholder.com/40",
      nickname: "토마토러버전종우",
      messageType: "TEXT",
      content: "토마토를 드세요",
      createdAt: "2025-02-06T12:00:00Z",
      unReadCount: 2,
    },
    {
      id: 2,
      roomId: 123,
      senderId: 1,
      profileImageUrl: "https://via.placeholder.com/40",
      nickname: "우와세상에",
      messageType: "IMAGE",
      content: "집에 가세요",
      fileUrl: "https://via.placeholder.com/150",
      createdAt: "2025-02-06T12:05:00Z",
      unReadCount: 1,
    },
  ],
  meta: {
    nextCursor: 3,
    hasNext: false,
  },
};

const ChattingRoomPage = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const mySenderId = 1;

  return (
    <main className="h-full text-center py-6 space-y-2">
      <div className="fixed flex top-14 p-5 items-center border-b-1 border-neutral-200 bg-white font-semibold text-start h-16 w-full pc:w-[599px]">
        토마토러버전종우 (4)
      </div>
      <div className="flex-1 overflow-y-auto p-4 py-14 space-y-4">
        {mockData.data.map((msg) => {
          const isMyMessage = msg.senderId === mySenderId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
            >
              <div className="flex items-start space-x-3 max-w-104">
                {!isMyMessage && (
                  <Image
                    src={msg.profileImageUrl}
                    alt={msg.nickname}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="flex flex-col">
                  {!isMyMessage && (
                    <div className="text-start text-sm pb-1">
                      {msg.nickname}
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    {isMyMessage && (
                      <div className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-md shadow text-start text-sm ${
                        isMyMessage
                          ? "bg-neutral-300"
                          : "bg-positive-100 text-black"
                      }`}
                    >
                      {msg.messageType === "TEXT" && <p>{msg.content}</p>}
                      {msg.messageType === "IMAGE" && (
                        <Image
                          src={msg.fileUrl}
                          alt="sent image"
                          className="w-40 h-40 rounded-lg"
                        />
                      )}
                    </div>
                    {!isMyMessage && (
                      <div className="w-auto text-xs text-gray-500 text-right self-end">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>
      <div className="fixed w-full pc:w-[599px] bottom-16 p-4 border-t bg-white flex items-center">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button className="ml-2 bg-positive-300 text-white p-2 rounded-lg">
          전송
        </button>
      </div>
    </main>
  );
};

export default ChattingRoomPage;
