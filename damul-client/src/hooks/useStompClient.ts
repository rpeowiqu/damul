import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ExtendedOptions extends SockJS.Options {
  withCredentials: boolean;
}

interface SendChattingProps {
  roomId: string | undefined;
  onMessageReceived: (message: any) => void; // 메시지 수신 핸들러 추가
}

interface SendMessage {
  userId: string;
  messageType: string;
  content?: string;
  fileUrl?: string;
}

export const useStompClient = ({
  roomId,
  onMessageReceived,
}: SendChattingProps) => {
  const wsUrl = import.meta.env.VITE_WS_BASE_URL;
  const stompClientRef = useRef<Client | null>(null);

  const initializeStompClient = () => {
    const stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(wsUrl, null, {
          transports: ["websocket"],
          withCredentials: true,
        } as ExtendedOptions),
      onConnect: (frame) => {
        console.log("Connected: " + frame);
        stompClient.subscribe(`/sub/chat/room/${roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log("📩 메시지 수신:", receivedMessage);
          onMessageReceived(receivedMessage); // ✅ 수신한 메시지를 상위 컴포넌트에 전달
        });
      },
      onStompError: (frame) => {
        console.error("🚨 STOMP 에러:", frame.headers["message"], frame.body);
      },
      onWebSocketError: (event) => {
        console.error("⚠️ WebSocket 에러:", event);
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
        .then(() => console.log("🔌 STOMP 연결 종료"));
    };
  }, [roomId]);

  const sendMessage = ({
    userId,
    messageType,
    content,
    fileUrl,
  }: SendMessage) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.warn("🚨 STOMP 클라이언트가 연결되지 않음");
      return;
    }

    const message = {
      userId,
      messageType,
      content,
      fileUrl,
      room: { id: roomId },
    };

    console.log("📤 메시지 전송:", message);
    stompClientRef.current.publish({
      destination: `/pub/chat/room/${roomId}/message`,
      body: JSON.stringify(message),
    });
  };

  const sendEnterRoom = (roomId: number, userId: string) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.warn("🚨 STOMP 클라이언트가 연결되지 않음");
      return;
    }

    const enterMessage = { userId, roomId };
    console.log("🚪 채팅방 입장 요청:", enterMessage);

    stompClientRef.current.publish({
      destination: `/pub/chat/room/${roomId}/enter/${userId}`,
      body: JSON.stringify(enterMessage),
    });
  };

  return { sendMessage, sendEnterRoom };
};
