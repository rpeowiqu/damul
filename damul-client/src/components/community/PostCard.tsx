import AlarmIcon from "../svg/AlarmIcon";

interface PostCardsProps {
  title: string;
  description: string;
  isEmpty: boolean;
}

const PostCard = ({ title, description, isEmpty }: PostCardsProps) => {
  return (
    <div
      className={`flex items-center justify-between gap-5 p-7 border-2 rounded-lg border-positive-300 hover:bg-positive-50 active:bg-positive-100 font-semibold shadow-md ${!isEmpty ? "bg-positive-200" : ""}`}
    >
      <div className="flex items-center gap-5">
        <AlarmIcon />
        <div>{title}</div>
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
