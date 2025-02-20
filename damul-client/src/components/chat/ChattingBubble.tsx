import { Link } from "react-router-dom";
import Image from "../common/Image";
import { ChatMessage } from "@/types/chatting";
import useAuth from "@/hooks/useAuth";

interface ChattingBubbleProps {
  msg: ChatMessage;
}

const ChattingBubble = ({ msg }: ChattingBubbleProps) => {
  const { data, isLoading } = useAuth();
  const isMyMessage = data?.data.id === msg.senderId;

  if (isLoading) return null;

  if (msg.messageType === "SYSTEM") {
    return (
      <div className="text-neutral-500 text-sm py-3">
        <p>{msg.content}</p>
      </div>
    );
  }

  if (isMyMessage) {
    return (
      <div key={msg.id} className="flex justify-end">
        <div className="flex items-start space-x-3 mb-5">
          <div className="flex flex-col">
            <div className="flex items-end space-x-2">
              <div className="text-xs text-gray-500 ml-12">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              {msg.messageType === "TEXT" && (
                <div className="rounded-md text-start text-sm flex-1 bg-neutral-100 p-3 whitespace-pre-wrap break-words break-all">
                  <p>{msg.content}</p>
                </div>
              )}
              {msg.messageType === "IMAGE" && (
                <div className="flex-1 p-3">
                  <Image
                    src={msg.fileUrl}
                    alt="sent image"
                    className="w-auto h-40 rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key={msg.id} className="flex justify-start">
      <div className="flex items-start space-x-3 mb-5">
        <Link to={`/profile/${msg.senderId}/info`}>
          <Image
            src={msg.profileImageUrl}
            alt={msg.nickname}
            className="min-w-10 w-10 h-10 rounded-full cursor-pointer"
          />
        </Link>
        <div className="flex flex-col">
          <Link to={`/profile/${msg.senderId}/info`}>
            <p className="text-start text-sm pb-1 cursor-pointer">
              {msg.nickname}
            </p>
          </Link>
          <div className="flex items-end space-x-2">
            {msg.messageType === "TEXT" && (
              <div className="rounded-md text-start text-sm flex-1 bg-neutral-100 p-3 whitespace-pre-wrap break-words break-all">
                <p>{msg.content}</p>
              </div>
            )}
            {msg.messageType === "IMAGE" && (
              <div className="flex-1 px-3">
                <Image
                  src={msg.fileUrl}
                  alt="sent image"
                  className="w-auto h-40 rounded-lg"
                />
              </div>
            )}
            <div className="w-auto text-xs text-gray-500 text-right self-end">
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChattingBubble;
