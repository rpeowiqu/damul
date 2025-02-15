import { useEffect, useRef } from "react";

const WebSocketComponent = () => {
  const wsUrl = "ws://localhost:8080/ws"; // 웹소켓 서버 주소
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ 웹소켓 연결 성공");
    };

    socket.onmessage = (event) => {
      console.log("📩 메시지 수신:", event.data);
    };

    socket.onerror = (error) => {
      console.log(error);
      console.error("❌ 웹소켓 오류 발생");
    };

    socket.onclose = (event) => {
      console.log("🔌 웹소켓 연결 종료:", event.code, event.reason);
    };

    return () => {
      socket.close();
    };
  }, []); // wsUrl 의존성 제거

  return (
    <div>
      <h2>React TypeScript 웹 소켓 예제</h2>
    </div>
  );
};

export default WebSocketComponent;
