import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import useAuth from "./useAuth";

interface ExtendedOptions extends SockJS.Options {
  withCredentials: boolean;
}

export const useStompSubscription = () => {
  const wsUrl = import.meta.env.VITE_WS_BASE_URL;
  const { data } = useAuth();
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!data?.data.id) return;
    if (stompClientRef.current && stompClientRef.current.connected) {
      return; // 기존 연결이 있다면 새로 연결하지 않음
    }

    const stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(wsUrl, null, {
          transports: ["websocket"],
          withCredentials: true,
        } as ExtendedOptions),
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공");
      },
      onStompError: (frame) => {
        console.error("❌ STOMP 오류:", frame.headers["message"], frame.body);
      },
      onWebSocketError: (event) => {
        console.error("⚠ WebSocket 에러:", event);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    // return () => {
    //   stompClient.deactivate().then(() => console.log("🔌 STOMP 연결 해제"));
    // };
  }, [data?.data.id]);

  return { stompClient: stompClientRef };
};
