import AlarmIcon from "../svg/AlarmIcon";

interface PostCardsProps {
  title: string;
  description: string;
  isEmpty: boolean;
}

const PostCard = ({ title, description, isEmpty }: PostCardsProps) => {
  return (
    <div
      className={`flex flex-1 items-center justify-between gap-2 p-5 pc:p-7 border-2 rounded-lg border-positive-300 hover:bg-positive-50 active:bg-positive-100 text-sm pc:text-md font-semibold shadow-md ${!isEmpty ? "bg-positive-200" : ""}`}
    >
      <div className="flex items-center gap-2 w-28">
        <AlarmIcon className="w-6 h-6" />
        <div className="w-full">{title}</div>
      </div>
      <div className="flex w-48 pc:w-64">
        {!isEmpty ? (
          <>
            <div className="w-full text-normal-700 text-center">입력 완료</div>
            <AlarmIcon />
          </>
        ) : (
          <div className="w-full text-normal-700 text-center">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
