import Image from "../common/Image";

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
          <p className="text-sm">
            {title} ({memberNum})
          </p>
          <p className="text-xs text-neutral-600">{lastMessage}</p>
        </div>
        <div className="flex flex-col justify-between items-end ">
          <p className="text-xs text-neutral-500">{lastMessageTime}</p>
          {unReadNum > 0 && (
            <div className="flex w-4 h-4 bg-red-500 text-xxs text-white rounded-full text-center">
              {unReadNum}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChattingListItem;
