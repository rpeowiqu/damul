import { useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// Extend the Options type to include withCredentials
interface ExtendedOptions extends SockJS.Options {
  withCredentials: boolean;
}

const WebSocketComponent = () => {
  const wsUrl = "http://localhost:8080/ws"; // 웹소켓 서버 주소
  const stompClientRef = useRef<Client | null>(null);
  const roomId = 5; // 채팅방 ID
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // 1️⃣ STOMP 클라이언트 생성
    const stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(wsUrl, null, {
          transports: ["websocket"],
          withCredentials: true, // Add this line
        } as ExtendedOptions),
      onConnect: (frame) => {
        console.log("Connected: " + frame);

        // 구독 설정 (/sub/... 으로 시작)
        stompClient.subscribe("/sub/chat/room/1", (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log("Received:", receivedMessage);
          // 메시지 처리 로직
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

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate().then(() => {
          console.log("🔌 STOMP 연결 종료");
        });
      }
    };
  }, []);

  // 메시지 전송 함수
  const sendMessage = () => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.warn("🚨 STOMP 클라이언트가 연결되지 않음");
      return;
    }

    const message = {
      messageType: "TEXT",
      content: "Hello, WebSocket!",
      fileUrl: "",
      room: { id: roomId },
    };

    stompClientRef.current.publish({
      destination: `/pub/chat/room/${roomId}/message`,
      body: JSON.stringify(message),
    });

    console.log("📤 메시지 전송:", message);
  };

  return (
    <div>
      <h2>React STOMP WebSocket</h2>
      <button onClick={sendMessage}>메시지 보내기</button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketComponent;
