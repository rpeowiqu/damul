import { Link } from "react-router-dom";
import Image from "../common/Image";
import ChatAlarm from "../footer/ChatAlram";
import { formatDate } from "@/utils/date";
import { ChattingListItemProps } from "@/types/chatting";

const ChattingListItem = ({
  id,
  title,
  thumbnailUrl,
  memberNum,
  lastMessage,
  lastMessageTime,
  unReadNum,
  keyword,
}: ChattingListItemProps) => {
  const highlightTitle = (title: string) => {
    if (!keyword) return title;

    const regex = new RegExp(`(${keyword})`, "gi"); // 대소문자 구분 없이 keyword에 맞는 부분 찾기
    const parts = title.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={index} className="text-positive-500">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };
  return (
    <>
      <Link
        to={`/chatting/${id}`}
        className="flex gap-3 border-t-1 p-3 pc:p-4 cursor-pointer hover:bg-neutral-100"
      >
        <Image src={thumbnailUrl} className="w-10 h-10 rounded-full" />
        <div className="flex w-full justify-between gap-3">
          <div className="flex flex-1 flex-col text-start justify-between">
            <div className="flex text-sm gap-1">
              <p className="line-clamp-1">{highlightTitle(title)}</p>
              <p>({memberNum})</p>
            </div>
            <p className="text-xs text-neutral-600 line-clamp-1">
              {lastMessage}
            </p>
          </div>
          <div className="flex flex-col justify-between items-end min-w-20">
            <p className="text-xxs text-neutral-500">
              {formatDate(lastMessageTime)}
            </p>
            {unReadNum > 0 && <ChatAlarm unReadNum={unReadNum} />}
          </div>
        </div>
      </Link>
    </>
  );
};

export default ChattingListItem;
