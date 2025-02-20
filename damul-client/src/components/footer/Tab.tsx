import { useEffect } from "react";
import { ElementType } from "react";
import ChatAlarm from "./ChatAlram";
import { useChattingSubscription } from "@/hooks/useChattingSubscription";
import { useChatAlarmStore } from "@/stores/alarmStore";
import { getUnreads } from "@/service/chatting";

interface TabProps {
  iconType: ElementType;
  iconFill?: string;
  menuColor?: string;
  label?: string;
  bgColor?: string;
}

const Tab = ({
  iconType: Icon,
  iconFill = "none",
  menuColor = "black",
  label = "홈",
  bgColor = "bg-positive-300",
}: TabProps) => {
  const { chatCnt, setChatCnt } = useChatAlarmStore();

  useChattingSubscription({
    onMessageReceived: (alarm) => {
      setChatCnt(alarm);
    },
  });
  const fetchUnreads = async () => {
    try {
      const response = await getUnreads();
      setChatCnt(response.data.unReadMessageNum);
    } catch (error) {
      // console.error("Failed to fetch unread messages:", error);
    }
  };

  useEffect(() => {
    fetchUnreads();

    // console.log("뭐여ㅑ", chatCnt);
  }, []);

  return (
    <div className="flex h-full items-center justify-center">
      <div
        className={`relative flex flex-col w-12 h-12 pc:w-14 pc:h-14 items-center justify-center gap-0.5 pt-1 rounded-full ${bgColor}`}
      >
        {Icon && <Icon iconFill={iconFill} iconStroke={menuColor} />}
        <p className={`text-xxs text-${menuColor} font-bold`}>{label}</p>
        {label === "채팅" && chatCnt !== "0" && chatCnt && (
          <ChatAlarm key={chatCnt} unReadNum={chatCnt} className="absolute" />
        )}
      </div>
    </div>
  );
};

export default Tab;
