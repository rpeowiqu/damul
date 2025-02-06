import Image from "../common/Image";
import ChatAlarm from "../footer/ChatAlram";

interface ChattingListItemProps {
  title: string;
  thumbnailUrl: string;
  memberNum: number;
  lastMessage: string;
  lastMessageTime: string;
  unReadNum: number;
}

const ChattingListItem = ({
  title,
  thumbnailUrl,
  memberNum,
  lastMessage,
  lastMessageTime,
  unReadNum,
}: ChattingListItemProps) => {
  return (
    <div className="flex gap-3 border-t-1 p-3 pc:p-4 cursor-pointer">
      <Image src={thumbnailUrl} className="w-10 h-10 rounded-full" />
      <div className="flex w-full justify-between">
        <div className="flex flex-col text-start justify-between">
          <div className="flex text-sm gap-1">
            <p className="line-clamp-1">{title}</p>
            <p>({memberNum})</p>
          </div>
          <p className="text-xs text-neutral-600 line-clamp-1">{lastMessage}</p>
        </div>
        <div className="flex flex-col justify-between items-end min-w-16">
          <p className="text-xs text-neutral-500">{lastMessageTime}</p>
          {unReadNum > 0 && (<ChatAlarm chatAlarmNum={unReadNum}/>)}
        </div>
      </div>
    </div>
  );
};

export default ChattingListItem;
