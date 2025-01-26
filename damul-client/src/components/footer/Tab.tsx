import React from "react";
import ChatAlarm from "./ChatAlram";

interface TabProps {
  iconType: React.ElementType;
  iconFill?: string;
  menuColor?: string;
  label?: string;
  bgColor?: string;
}

// 채팅 알람 개수 (임시값)
const chatAlarmNum = 3;

const Tab: React.FC<TabProps> = ({
  iconType: Icon,
  iconFill = "none",
  menuColor = "black",
  label = "홈",
  bgColor = "bg-positive-300",
}) => {
  return (
    <div className="flex h-full items-center justify-center">
      <div
        className={`relative flex flex-col w-12 h-12 pc:w-14 pc:h-14 items-center justify-center gap-0.5 pt-1 rounded-full ${bgColor}`}
      >
        {Icon && <Icon iconFill={iconFill} iconStroke={menuColor} />}
        <p className={`text-xxs text-${menuColor}`}>{label}</p>
        {label === "채팅" && chatAlarmNum > 0 && (
          <ChatAlarm chatAlarmNum={chatAlarmNum} />
        )}
      </div>
    </div>
  );
};

export default Tab;
