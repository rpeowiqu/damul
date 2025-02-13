import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ExtendedOptions extends SockJS.Options {
  withCredentials: boolean;
}

interface SendChattingProps {
  roomId: number;
}

interface sendMessage {
  messageType: string;
  content?: string;
  fileUrl?: string;
}

export const useStompClient = ({ roomId }: SendChattingProps) => {
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
          console.log("Received:", receivedMessage);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details:", frame.body);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket error:", event);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;
  };

  useEffect(() => {
    initializeStompClient();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate().then(() => {
          console.log("🔌 STOMP 연결 종료");
        });
      }
    };
  }, [roomId]);

  const sendMessage = ({ messageType, content, fileUrl }: sendMessage) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.warn("🚨 STOMP 클라이언트가 연결되지 않음");
      return;
    }

    const message = {
      messageType,
      content,
      fileUrl,
      room: { id: roomId },
    };

    stompClientRef.current.publish({
      destination: `/pub/chat/room/${roomId}/message`,
      body: JSON.stringify(message),
    });

    console.log("📤 메시지 전송:", message);
  };

  return { sendMessage };
};
