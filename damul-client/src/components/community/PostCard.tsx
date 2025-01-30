import AlarmIcon from "../svg/AlarmIcon";

interface PostCardsProps {
    title: string;
    description: string;
}

const PostCard = ({title, description}: PostCardsProps) => {
  return (
    <div className="flex items-center justify-between gap-5 p-7 border-2 rounded-lg border-positive-300 hover:bg-positive-50 active:bg-positive-100 font-semibold shadow-md">
      <div className="flex items-center gap-5">
        <AlarmIcon />
        <div>{title}</div>
      </div>
      <div className="w-40 text-normal-700">{description}</div>
    </div>
  );
};

export default PostCard;
