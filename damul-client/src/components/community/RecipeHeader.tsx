import AlarmIcon from "../svg/AlarmIcon";

interface RecipeHeaderProps {
    title: string;
    createdAt: string;
  }
  const RecipeHeader = ({ title, createdAt }: RecipeHeaderProps) => {
    return (
      <div className="flex justify-between p-2 border-b border-neutral-300">
        <div className="text-start">
          <p className="text-sm text-neutral-600">레시피 게시판</p>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="flex flex-col justify-between items-end py-0.5">
          <AlarmIcon className="w-5 h-5" />
          <p className="text-xs text-neutral-500">{createdAt}</p>
        </div>
      </div>
    );
  };

export default RecipeHeader;
