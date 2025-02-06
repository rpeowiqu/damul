import { useRef, useState, ChangeEvent, useEffect } from "react";
import Image from "@/components/common/Image";
import SendIcon from "@/components/svg/SendIcon";
import ChattingMenuButton from "@/components/chat/ChattingMenuButton";

interface ChatMessage {
  id: number;
  roomId: number;
  senderId: number;
  profileImageUrl: string;
  nickname: string;
  messageType: "TEXT" | "IMAGE";
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
      messageType: "TEXT",
      content: "집에 가세요 집에 가세요 집에 가세요 집에 가세요",
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
      content:
        "토마토를 드세요 토마토를 드세요 토마토를 드세요토마토를 드세요 토마토를 드세요 토마토를 드세요 토마토를 드세요 토마토를 드세요 토마토를 드세요토마토를 드세요토마토를 드세요 토마토를 드세요 v",
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
      messageType: "TEXT",
      content: "집에 가세요 집에 가세요 집에 가세요 집에 가세요",
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
      content:
        "토마토를 드세요 토마토를 드세요 토마토를 드세요토마토를 드세요 토마토를 드세요 토마토를 드세요 토마토를 드세요 토마토를 드세요 토마토를 드세요토마토를 드세요토마토를 드세요 토마토를 드세요 Vv",
      createdAt: "2025-02-06T12:00:00Z",
      unReadCount: 2,
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

  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [mockData.data]);

  return (
    <main className="h-full text-center py-6 space-y-2">
      <div className="fixed flex top-14 p-5 items-center justify-between border-b-1 border-neutral-200 bg-white font-semibold text-start h-12 pc:h-16 w-full pc:w-[598px]">
        <p>토마토러버전종우 (4)</p>
        <ChattingMenuButton/>
      </div>
      <div className="flex-1 overflow-y-auto p-4 py-10 pc:py-14 space-y-4">
        {mockData.data.map((msg) => {
          const isMyMessage = msg.senderId === mySenderId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
            >
              <div className="flex items-start space-x-3">
                {!isMyMessage && (
                  <Image
                    src={msg.profileImageUrl}
                    alt={msg.nickname}
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                )}
                <div className="flex flex-col">
                  {!isMyMessage && (
                    <p className="text-start text-sm pb-1 cursor-pointer">
                      {msg.nickname}
                    </p>
                  )}
                  <div className="flex items-end space-x-2">
                    {isMyMessage && (
                      <div className="text-xs text-gray-500 ml-12">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                    <div
                      className={`rounded-md shadow text-start text-sm flex-1 ${
                        msg.messageType === "IMAGE"
                          ? "bg-transparent"
                          : isMyMessage
                            ? "bg-neutral-100 p-3"
                            : "bg-positive-100 p-3"
                      }`}
                    >
                      {msg.messageType === "TEXT" && <p>{msg.content}</p>}
                      {msg.messageType === "IMAGE" && (
                        <Image
                          src={msg.fileUrl}
                          alt="sent image"
                          className="w-auto h-40 rounded-lg"
                        />
                      )}
                    </div>

                    {!isMyMessage && (
                      <div className="w-auto text-xs text-gray-500 text-right self-end">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
      <div className="fixed w-full pc:w-[598px] bottom-16 p-2 pc:p-4 border-t bg-white flex items-end">
        <label
          htmlFor="image-upload"
          className="bg-neutral-200 p-1 pc:p-2 rounded-full cursor-pointer mr-2"
        >
          <div className="flex w-5 h-5 pc:w-6 pc:h-6 items-center justify-center">
            +
          </div>
        </label>
        <input
          type="file"
          id="image-upload"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {image ? (
          <div className="flex-1 border-1 p-3 rounded-lg relative">
            <div className="relative h-24 w-32 bg-red-200">
              <img
                src={image}
                alt="Preview"
                className="h-24 object-cover rounded-lg"
              />
              <button
                onClick={handleImageRemove}
                className="absolute flex top-1 right-1 w-6 h-6 text-white bg-positive-300 p-1 rounded-full text-sm items-center justify-center"
              >
                X
              </button>
            </div>
          </div>
        ) : (
          <textarea
            value={message}
            onChange={handleInputChange}
            className="flex-1 border rounded-md px-5 py-2 focus:outline-none text-sm resize-none min-h-[2rem] max-h-[6rem]"
            placeholder="메시지 입력"
            rows={1}
          />
        )}
        <button className="self-end ml-2 border-2 border-positive-300 text-white p-1 pc:p-2 rounded-full">
          <SendIcon className="w-5 h-5 pc:w-6 pc:h-6 fill-positive-400" />
        </button>
      </div>
    </main>
  );
};

export default ChattingRoomPage;
