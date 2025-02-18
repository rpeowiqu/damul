import { useRef, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ExtendedOptions extends SockJS.Options {
  withCredentials: boolean;
}

interface UseStompConnectionProps {
  subscribeTopics: string[];
  onMessageReceived: (topic: string, message: any) => void;
}

export const useStompConnection = ({
  subscribeTopics,
  onMessageReceived,
}: UseStompConnectionProps) => {
  const wsUrl = import.meta.env.VITE_WS_BASE_URL;
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (subscribeTopics.length === 0) return;

    const stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(wsUrl, null, {
          transports: ["websocket"],
          withCredentials: true,
        } as ExtendedOptions),
      onConnect: (frame) => {
        console.log("🔗 STOMP 연결 성공:", frame);

        // 주어진 모든 토픽을 구독
        subscribeTopics.forEach((topic) => {
          stompClient.subscribe(topic, (message) => {
            const receivedMessage = JSON.parse(message.body);
            console.log(`📩 메시지 수신 [${topic}]:`, receivedMessage);
            onMessageReceived(topic, receivedMessage);
          });
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

    return () => {
      stompClient.deactivate().then(() => console.log("⛔ STOMP 연결 종료"));
    };
  }, [subscribeTopics]);

  return stompClientRef;
};
