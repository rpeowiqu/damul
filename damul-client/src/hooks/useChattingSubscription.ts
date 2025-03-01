import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getUnreads } from "@/service/chatting";

interface ExtendedOptions extends SockJS.Options {
  withCredentials: boolean;
}

interface ChattingSubscriptionProps {
  roomId?: string | number | undefined;
  onMessageReceived?: (message: any) => void;
  setChatCnt?: (count: number) => void;
}

export const useChattingSubscription = ({
  roomId,
  onMessageReceived,
  setChatCnt,
}: ChattingSubscriptionProps) => {
  const wsUrl = import.meta.env.VITE_WS_BASE_URL;
  const stompClientRef = useRef<Client | null>(null);

  const fetchUnreadChatCnt = async () => {
    try {
      const response = await getUnreads();
      {
        setChatCnt && setChatCnt(response?.data.unReadMessageNum);
      }
      return response?.data;
    } catch (error) {
      // console.log(error);
    }
  };

  const initializeStompClient = () => {
    const stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(wsUrl, null, {
          transports: ["websocket"],
          withCredentials: true,
        } as ExtendedOptions),
      onConnect: (frame) => {
        // console.log("Chat Connected: " + frame);

        fetchUnreadChatCnt();

        stompClient.subscribe(`/sub/chat/room/${roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          // console.log("📩 메시지 수신:", receivedMessage);
          if (onMessageReceived) {
            onMessageReceived(receivedMessage);
          }
        });

        stompClient.subscribe(`/sub/chat/room/${roomId}/read`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          // console.log("📩 메시지 수신:", receivedMessage);
          if (onMessageReceived) {
            onMessageReceived(receivedMessage);
          }
        });
      },
      onStompError: (frame) => {
        // console.error("🚨 STOMP 에러:", frame.headers["message"], frame.body);
      },
      onWebSocketError: (event) => {
        // console.error("⚠️ WebSocket 에러:", event);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;
  };

  useEffect(() => {
    initializeStompClient();
    return () => {
      stompClientRef.current
        ?.deactivate()
        .then(() => console.log("STOMP 연결 종료"));
    };
  }, [roomId]);

  const sendMessage = ({
    userId,
    messageType,
    content,
    image,
  }: {
    userId: string;
    messageType: string;
    content?: string;
    image?: number[];
  }) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.warn("🚨 STOMP 클라이언트가 연결되지 않음");
      return;
    }

    const message = {
      userId,
      messageType,
      content,
      image,
      room: { id: roomId },
    };

    // console.log("📤 메시지 전송:", message);
    stompClientRef.current.publish({
      destination: `/pub/chat/room/${roomId}/message`,
      body: JSON.stringify(message),
    });
  };

  const readMessage = ({
    userId,
    roomId,
    messageId,
  }: {
    userId: string;
    roomId: string | undefined;
    messageId?: number;
  }) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.warn("🚨 STOMP 클라이언트가 연결되지 않음");
      return;
    }

    const message = {
      userId,
      roomId,
      messageId,
    };

    // // console.log("📤 메시지 읽음 요청 전송:", message);

    stompClientRef.current.publish({
      destination: `/pub/chat/read`,
      body: JSON.stringify(message),
    });
  };

  const sendEnterRoom = (roomId: number, userId: string) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.warn("🚨 STOMP 클라이언트가 연결되지 않음");
      return;
    }

    const enterMessage = { userId, roomId };
    // console.log("🚪 채팅방 입장 요청:", enterMessage);

    stompClientRef.current.publish({
      destination: `/pub/chat/room/${roomId}/enter/${userId}`,
      body: JSON.stringify(enterMessage),
    });

    // 채팅방 입장 시 기존 메시지 읽음 처리
    readMessage({ userId, roomId: String(roomId) });
  };

  return { sendMessage, readMessage, sendEnterRoom };
};
