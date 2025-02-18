import { Link } from "react-router-dom";
import Image from "../common/Image";
import { getTimeAgo } from "@/utils/date";

interface AlarmItemProps {
  senderId: number;
  profileImageUrl: string;
  content: string;
  createdAt: string;
  read: boolean;
}

const AlarmItem = ({
  profileImageUrl,
  content,
  createdAt,
  read,
}: AlarmItemProps) => {
  return (
    <div className="h-full text-center space-y-2 border-b">
      <div className="flex items-center justify-between px-7 cursor-pointer">
        <div className="flex items-center gap-3 h-20">
          <Image
            src={profileImageUrl}
            className="w-10 h-10 pc:w-12 pc:h-12 rounded-full"
          />
          <div className="text-xs pc:text-md">{content}</div>
        </div>
        <div className="flex flex-col text-xs pc:text-sm text-neutral-500 h-20 py-2 justify-between">
          <div className="self-start">{getTimeAgo(createdAt)}</div>
          <div className="self-end">{read ? "읽음" : "안읽음"}</div>
        </div>
      </div>
    </div>
  );
};

export default AlarmItem;
