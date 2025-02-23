import {
  useRef,
  useState,
  useCallback,
  ChangeEvent,
  useEffect,
  KeyboardEvent,
} from "react";
import { useParams } from "react-router-dom";
import ChattingBubble from "@/components/chat/ChattingBubble";
import SendIcon from "@/components/svg/SendIcon";
import ChattingMenuButton from "@/components/chat/ChattingMenuButton";
import { getChattingContents } from "@/service/chatting";
import { ChatMessage } from "@/types/chatting";
import ChattingRoomInfiniteScroll from "@/components/chat/ChattingRoomInfiniteScroll";
import { useChattingSubscription } from "@/hooks/useChattingSubscription";
import useAuth from "@/hooks/useAuth";
import { postImageInRoom } from "@/service/chatting";
import DamulSection from "@/components/common/DamulSection";

interface ChatData {
  messages: ChatMessage[];
  memberNum: number;
  roomName: string;
  postId: number;
}

const ChattingRoomPage = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const { roomId } = useParams();
  const { data, isLoading } = useAuth();

  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [prevImage, setPrevImage] = useState<string | null>(null);
  const [chatData, setChatData] = useState<ChatData>({
    messages: [],
    memberNum: 0,
    roomName: "",
    postId: 0,
  });

  // 메시지 수신 핸들러
  const handleMessageReceived = useCallback(
    (newMessage: ChatMessage) => {
      if (newMessage.id === data?.data.id) {
        return;
      }

      setChatData((prevChatData) => {
        const updatedMessages = [...prevChatData.messages, newMessage];
        return {
          ...prevChatData,
          messages: updatedMessages,
        };
      });
    },
    [data?.data.id],
  );

  // STOMP 클라이언트 초기화
  const { sendMessage, readMessage } = useChattingSubscription({
    roomId: roomId,
    onMessageReceived: handleMessageReceived,
  });

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // 엔터키 클릭 이벤트
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 미리보기 이미지 제거
  const handleImageRemove = () => {
    setPrevImage(null);
  };

  // 채팅 내역 가져오기
  const fetchItems = async (pageParam: number) => {
    try {
      const response = await getChattingContents({
        roomId: roomId,
        cursor: pageParam,
        size: 50,
      });
      // console.log(response?.data);
      if (response?.data && typeof response.data === "object") {
        setChatData({
          messages: response.data.data || [],
          memberNum: response.data.memberNum || 0,
          roomName: response.data.roomName || "",
          postId: response.data.postId || 0,
        });
      } else {
        console.warn("예상과 다른 데이터 구조:", response?.data);
        setChatData({ messages: [], memberNum: 0, roomName: "", postId: 0 });
      }

      return response?.data;
    } catch (error) {
      // console.error("채팅 데이터 불러오기 실패:", error);
    }
  };

  // 가장 하단부터 보여주기
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [chatData.messages]);

  // 메시지 전송
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("이미지 용량은 5MB 이하만 업로드 가능합니다.");
      return;
    }

    setImage(file);

    // 미리보기용 Base64 변환
    const previewReader = new FileReader();
    previewReader.onloadend = () => {
      setPrevImage(previewReader.result as string);
    };
    previewReader.readAsDataURL(file);
  };

  // 메세지 전송
  const handleSendMessage = async () => {
    if (image) {
      await sendImage();
    }

    if (message.trim()) {
      const newTextMessage: ChatMessage = {
        id: Date.now(),
        roomId: Number(roomId),
        senderId: data?.data.id,
        messageType: "TEXT",
        content: message,
        createdAt: new Date().toISOString(),
      };

      setChatData((prevChatData) => ({
        ...prevChatData,
        messages: [...prevChatData.messages, newTextMessage],
      }));

      sendMessage({
        userId: data?.data.id,
        messageType: "TEXT",
        content: message,
      });

      setMessage("");

      if (messageInputRef.current) {
        messageInputRef.current.style.height = "2.5rem";
      }
    }
  };

  // 이미지 전송
  const sendImage = async () => {
    const formData = new FormData();
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await postImageInRoom({ roomId, formData });
      // console.log(response);

      const newImageMessage: ChatMessage = {
        id: Date.now(),
        roomId: Number(roomId),
        senderId: data?.data.id,
        messageType: "FILE",
        createdAt: new Date().toISOString(),
        fileUrl: response.data?.image,
      };

      setChatData((prevChatData) => ({
        ...prevChatData,
        messages: [...prevChatData.messages, newImageMessage],
      }));

      setImage(null);
      setPrevImage(null);
    } catch (error) {
      // console.log(error);
    }
  };

  // 채팅 읽음 처리
  useEffect(() => {
    if (!chatData.messages.length || !roomId || !data?.data.id) return;

    const lastMessage = chatData.messages[chatData.messages.length - 1];

    // console.log("sdsd", lastMessage);

    readMessage({
      userId: data?.data.id,
      roomId: roomId,
      messageId: lastMessage.id,
    });
  }, [chatData.messages]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="fixed flex top-14 px-5 items-center justify-between border-b border-neutral-200 bg-white font-semibold text-start h-12 w-full pc:w-[598px]">
        <p>
          {chatData.roomName}({chatData.memberNum})
        </p>
        <ChattingMenuButton roomId={roomId} postId={chatData.postId} />
      </div>

      <DamulSection className="flex-1 text-center py-16">
        <ChattingRoomInfiniteScroll
          key={chatData.messages.length}
          queryKey={["chats"]}
          fetchFn={fetchItems}
          renderItems={(msg: ChatMessage) => (
            <ChattingBubble key={msg.id} msg={msg} />
          )}
          skeleton={
            <div className="h-24 mb-2 animate-pulse bg-normal-100 rounded" />
          }
        />
        <div ref={messagesEndRef} />
      </DamulSection>

      <div>
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
          {prevImage ? (
            <div className="flex-1 border-1 p-3 rounded-lg relative">
              <div className="relative h-24 w-24">
                <img
                  src={prevImage}
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
              ref={messageInputRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1 border rounded-md px-5 py-2 focus:outline-none text-sm resize-none min-h-[2.5rem] max-h-[10rem]"
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
      </div>
    </div>
  );
};

export default ChattingRoomPage;
