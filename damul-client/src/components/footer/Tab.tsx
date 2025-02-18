import { useState } from "react";
import { ElementType } from "react";
import ChatAlarm from "./ChatAlram";
import useAuth from "@/hooks/useAuth";
import { useChattingSubscription } from "@/hooks/useChattingSubscription";

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
  const { data, isLoading } = useAuth();
  const userId = data?.data.id;
  const [chatCnt, setChatCnt] = useState(0);

  useChattingSubscription({
    onMessageReceived: (alarm) => {
      console.log("새 알림:", alarm);
      setChatCnt((prev) => prev + 1);
    },
    setChatCnt,
  });

  return (
    <div className="flex h-full items-center justify-center">
      <div
        className={`relative flex flex-col w-12 h-12 pc:w-14 pc:h-14 items-center justify-center gap-0.5 pt-1 rounded-full ${bgColor}`}
      >
        {Icon && <Icon iconFill={iconFill} iconStroke={menuColor} />}
        <p className={`text-xxs text-${menuColor} font-bold`}>{label}</p>
        {label === "채팅" && chatCnt > 0 && (
          <ChatAlarm unReadNum={chatCnt} className="absolute" />
        )}
      </div>
    </div>
  );
};

export default Tab;
