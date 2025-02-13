import { useRef, useState, ChangeEvent, useEffect, KeyboardEvent } from "react";
import { useParams } from "react-router-dom";
import ChattingBubble from "@/components/chat/ChattingBubble";
import SendIcon from "@/components/svg/SendIcon";
import ChattingMenuButton from "@/components/chat/ChattingMenuButton";
import { getChattingContents } from "@/service/chatting";
import { ChatMessage } from "@/types/chatting";
import DamulInfiniteScrollList from "@/components/common/DamulInfiniteScrollList";
import { useStompClient } from "@/hooks/useStompClient";

const ChattingRoomPage = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { roomId } = useParams();
  const { sendMessage } = useStompClient({ roomId: Number(roomId) });

  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 기본 엔터 동작 방지
      handleSendMessage();
    }
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

  const [chatData, setChatData] = useState<ChatMessage[]>([]);
  const [memberNum, setMemberNum] = useState(0);
  const [roomName, setRoomName] = useState("");

  const fetchItems = async (pageParam: number) => {
    try {
      const response = await getChattingContents({
        roomId: roomId,
        cursor: pageParam,
        size: 5,
      });
      if (response?.data) {
        setChatData(response.data);
        setMemberNum(response.data.memberNum);
        setRoomName(response.data.roomName);
      }
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [chatData]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage({ messageType: "TEXT", content: message });
      setMessage("");
    } else if (image) {
      sendMessage({ messageType: "IMAGE", fileUrl: image });
      setImage(null);
    } else {
      return;
    }
  };

  return (
    <main className="h-full text-center py-6 space-y-2">
      <div className="fixed flex top-14 p-5 items-center justify-between border-b-1 border-neutral-200 bg-white font-semibold text-start h-12 pc:h-16 w-full pc:w-[598px]">
        <p>
          {roomName}({memberNum})
        </p>
        <ChattingMenuButton roomId={5} />
      </div>
      <div className="flex-1 justify-end overflow-y-auto p-4 py-10 pc:py-14 space-y-4">
        <DamulInfiniteScrollList
          queryKey={["chats"]}
          fetchFn={fetchItems}
          renderItems={(msg: ChatMessage) => <ChattingBubble msg={msg} />}
          skeleton={
            <div className="h-24 mb-2 animate-pulse bg-normal-100 rounded" />
          }
        />
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
            <div className="relative h-24 w-24">
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
            onKeyDown={handleKeyDown}
            className="flex-1 border rounded-md px-5 py-2 focus:outline-none text-sm resize-none min-h-[2rem] max-h-[6rem]"
            placeholder="메시지 입력"
            rows={1}
          />
        )}
        <button
          onClick={handleSendMessage}
          className="self-end ml-2 border-2 border-positive-300 text-white p-1 pc:p-2 rounded-full"
        >
          <SendIcon className="w-5 h-5 pc:w-6 pc:h-6 fill-positive-400" />
        </button>
      </div>
    </main>
  );
};

export default ChattingRoomPage;
