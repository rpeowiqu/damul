import { useRef, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getUnreadAlarmCnt } from "@/service/alarm";

interface ExtendedOptions extends SockJS.Options {
  withCredentials: boolean;
}

interface AlarmSubscription {
  userId: string;
  onAlarmReceived: (message: any) => void;
  setAlarmCnt: (count: number) => void;
}

export const useAlarmSubscription = ({
  userId,
  onAlarmReceived,
  setAlarmCnt,
}: AlarmSubscription) => {
  const wsUrl = import.meta.env.VITE_WS_BASE_URL;
  const stompClientRef = useRef<Client | null>(null);

  const fetchUnreadAlarmCnt = async () => {
    try {
      const response = await getUnreadAlarmCnt();
      setAlarmCnt(response.data.unReadMessageNum);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(wsUrl, null, {
          transports: ["websocket"],
          withCredentials: true,
        } as ExtendedOptions),
      onConnect: (frame) => {
        console.log("Alarm Connected: " + frame);

        fetchUnreadAlarmCnt();

        stompClient.subscribe(`/sub/notification/${userId}`, (message) => {
          const notification = JSON.parse(message.body);
          console.log("알림 수신:", notification);
          if (onAlarmReceived) {
            onAlarmReceived(notification);
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP 알림 에러:", frame.headers["message"], frame.body);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket 알림 에러:", event);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [userId]);

  const readMessage = ({ alarmId }: { alarmId: number }) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.warn("🚨 STOMP 클라이언트가 연결되지 않음");
      return;
    }

    console.log("📤 메시지 읽음:", alarmId);
    stompClientRef.current.publish({
      destination: `/pub/notification/read/${alarmId}`,
    });
  };

  return { readMessage };
};
