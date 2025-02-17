import { useEffect, useState } from "react";
import { getUnreads } from "@/service/chatting";
import { ElementType } from "react";
import ChatAlarm from "./ChatAlram";

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
  const [unReadNum, setUnreadNum] = useState(0);
  // const fetchItems = async () => {
  //   try {
  //     const response = await getUnreads();
  //     setUnreadNum(response?.data.unReadMessageNum);
  //     return response?.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchItems();
  // }, []);
  return (
    <div className="flex h-full items-center justify-center">
      <div
        className={`relative flex flex-col w-12 h-12 pc:w-14 pc:h-14 items-center justify-center gap-0.5 pt-1 rounded-full ${bgColor}`}
      >
        {Icon && <Icon iconFill={iconFill} iconStroke={menuColor} />}
        <p className={`text-xxs text-${menuColor} font-bold`}>{label}</p>
        {label === "채팅" && unReadNum > 0 && (
          <ChatAlarm unReadNum={unReadNum} className="absolute" />
        )}
      </div>
    </div>
  );
};

export default Tab;
